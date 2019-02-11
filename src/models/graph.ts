import { isEmpty, first, max, map, merge, findLastIndex, get } from 'lodash'
import Node, {
  ReplaceNode,
  StartNode,
  GatewayNode,
  TaskNode,
  BranchStartNode,
  BranchEndNode,
  EndNode,
  PlaceholderNode,
  VirtualNode
} from './node'
import Edge from './edge'
import EdgeCollection from './edge-collection'
import NodeData from './node-data'
export default class Graph {
  nodes: Map<string, NodeData> = new Map()
  edges: EdgeCollection = new EdgeCollection()
  private start: NodeData | null = null

  constructor(nodes: NodeData[]) {
    nodes.forEach(node => {
      if (node.type === 'start') {
        this.start = node
      }
      this.nodes.set(node.id, node)
    })
  }

  private createViewNode(node: NodeData) {
    const { id, label, type, active, current } = node
    let rt
    switch (type) {
      case 'start':
        rt = new StartNode(id)
        break
      case 'end':
        rt = new EndNode(id)
        break
      case 'task':
        rt = new TaskNode(id, label)
        break
      case 'gateway':
        rt = new GatewayNode(id)
        break
      default:
        rt = new Node(id)
        break
    }
    rt.active = active
    rt.isCurrent = current
    return rt
  }

  private scanAllPath(start: NodeData) {
    let allPaths: Array<string[]> = []
    let currentPath: string[] = []

    const loop = (node: NodeData): any => {
      currentPath.push(node.id)

      if (!isEmpty(node.next)) {
        node.next.forEach((nodeId: string) => {
          const node = this.nodes.get(nodeId)
          if (!node) return
          loop(node)
          currentPath.pop()
        })
      } else {
        allPaths.push([...currentPath])
      }
    }
    loop(start)
    return allPaths
  }

  private moveEndNodeToTail(src: string[]) {
    const lastIndex = findLastIndex(src, (v: string) => !!v)
    if (lastIndex !== src.length - 1) {
      const rt = [...src]
      const endVal = src[lastIndex]
      rt.splice(lastIndex, 1)
      rt.push(endVal)
      return rt
    }
    return src
  }

  private alignPaths(allPaths: Array<string[]>) {
    const maxLength: number = <number>max(map(allPaths, 'length'))
    return allPaths.map((path: string[]) =>
      this.moveEndNodeToTail(merge(Array(maxLength).fill(null), path))
    )
  }

  private convertViewNode(allPaths: Array<string[]>) {
    const viewNodes: Map<string, Node> = new Map()

    const convertFirstLane = (path: string[]) => {
      const rt: Node[] = []
      for (let column = path.length - 1; column >= 0; column--) {
        const nodeId = path[column]
        const reversedColumn = path.length - 1 - column
        const prevVnode = rt[reversedColumn - 1]

        let vnode
        if (nodeId) {
          const node = <NodeData>this.nodes.get(nodeId)
          vnode = this.createViewNode(node)
          vnode.setLoc(0, column)
          if (vnode instanceof GatewayNode) {
            const virtual = new VirtualNode(vnode)
            virtual.label = node.getRelation(prevVnode.id)
            rt.push(virtual)
          }
          viewNodes.set(nodeId, vnode)
        } else {
          vnode = new PlaceholderNode(prevVnode)
        }

        rt.push(vnode)
      }

      rt.forEach((vnode: Node, column: number) => {
        const prveVnode = rt[column - 1]
        if (prveVnode) {
          prveVnode.lanePrev = vnode
        }

        if (vnode instanceof VirtualNode) {
          const rp = <ReplaceNode>vnode
          vnode.active = rp.replaced.active && prveVnode.active
        }
      })

      return rt.reverse()
    }

    return allPaths.map((path: string[], lane: number) => {
      if (lane === 0) {
        const firstLane = convertFirstLane(path)
        return firstLane
      }

      let lastGateway = -1
      const rt: Node[] = []

      const replaceExistViewNode = (vnode: Node, column: number) => {
        // 替换节点
        if (vnode instanceof EndNode) {
          // 结束节点
          return !path[column - 1] ? new BranchEndNode(vnode) : new Node()
        } else if (vnode instanceof TaskNode) {
          // 任务节点
          return column > lastGateway ? new BranchEndNode(vnode) : new Node()
        } else if (vnode instanceof GatewayNode) {
          lastGateway = vnode.column
          return new BranchStartNode(vnode)
        } else {
          // 开始节点
          return new Node()
        }
      }

      for (let column = path.length - 1; column >= 0; column--) {
        const nodeId = path[column]
        const reversedColumn = path.length - 1 - column
        const prevVnode = rt[reversedColumn - 1]

        let target
        if (nodeId) {
          const node = <NodeData>this.nodes.get(nodeId)
          let vnode = viewNodes.get(nodeId)
          if (vnode) {
            // 节点已经加入到别的泳道上
            target = replaceExistViewNode(vnode, column)
            if (target instanceof BranchStartNode) {
              const virtual = new VirtualNode(target)
              virtual.label = node.getRelation(prevVnode.id)
              rt.push(virtual)
            }
          } else {
            target = this.createViewNode(node)
            viewNodes.set(nodeId, target)
          }
        } else {
          target = new PlaceholderNode(prevVnode)
        }

        target.setLoc(lane, column)
        rt.push(target)
      }

      const reversed = rt.reverse()
      reversed.forEach((vnode: Node, column: number) => {
        const nextVnode = reversed[column + 1]
        if (nextVnode) {
          nextVnode.lanePrev = vnode
        }

        if (vnode instanceof BranchStartNode) {
          const rp = <BranchStartNode>vnode
          const nextnextVnode = reversed[column + 2]
          vnode.active = this.edges.isActive(rp.id, nextnextVnode.id)
          return
        }

        if (vnode instanceof PlaceholderNode) {
          const rp = <PlaceholderNode>vnode
          vnode.active =
            get(vnode, 'lanePrev.active', false) && rp.replaced.active
          return
        }

        if (vnode instanceof BranchEndNode) {
          const prevVnode = vnode.lanePrev
					console.log('TCL: Graph -> privateconvertViewNode -> prevVnode', prevVnode)
          const rp = <BranchEndNode>vnode
          if (prevVnode instanceof PlaceholderNode) {
            vnode.active = rp.replaced.active && prevVnode.active
          } else {
            vnode.active =
              rp.replaced.active && this.edges.isActive((<Node>prevVnode).id, vnode.id)
          }

          return
        }

        vnode.active = nextVnode && this.edges.isActive(vnode.id, nextVnode.id)
      })
      return reversed
    })
  }

  addEdge(edge: Edge) {
    const { from, to, relationName, active } = edge
    const fromNode = this.nodes.get(from)
    const toNode = this.nodes.get(to)
    if (fromNode && toNode) {
      if (active) {
        fromNode.active = toNode.active = true
      }
      fromNode.next.push(to)
      fromNode.setRelation(to, relationName)
      toNode.prev.push(from)
      this.edges.push(edge)
    }
  }

  toViewGraph() {
    if (this.start) {
      const allPaths = this.scanAllPath(this.start)
      const aligned = this.alignPaths(allPaths)
      return this.convertViewNode(aligned)
    }

    return []
  }
}
