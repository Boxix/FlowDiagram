import { isEmpty, first, max, map, merge, findLastIndex } from 'lodash'
import Node, {
  StartNode,
  GatewayNode,
  TaskNode,
  BranchStartNode,
  BranchEndNode,
  EndNode,
  PlaceholderNode
} from './node'
import Edge from './edge'

export class NodeData {
  id: string
  label: string
  type: string
  prev: string[] = []
  next: string[] = []
  private relationNames: any = {}

  constructor(id: string, type: string, label: string = '') {
    this.id = id
    this.label = label
    this.type = type
  }

  setRelation(to: string, label: string) {
    this.relationNames[to] = label
  }

  getRelation(to: string) {
    return this.relationNames[to]
  }
}

export default class Graph {
  nodes: Map<string, NodeData> = new Map()
  edges: Edge[] = []
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
    const { id, label, type } = node
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
      return path.map((nodeId: string, column: number) => {
        if (nodeId) {
          const node = <NodeData>this.nodes.get(nodeId)
          const vnode = this.createViewNode(node)
          vnode.setLoc(0, column)
          if (vnode instanceof GatewayNode) {
            // 把到下一个节点的关系名写到当前网关显示的label上
            const nextNodeId = first(node.next) || ''
            vnode.label = node.getRelation(nextNodeId)
          }
          viewNodes.set(nodeId, vnode)
          return vnode
        } else {
          return new PlaceholderNode()
        }
      })
    }

    return allPaths.map((path: string[], lane: number) => {
      if (lane === 0) {
        return convertFirstLane(path)
      }

      let lastGateway = -1
      const rt = []

      const replaceExistViewNode = (vnode: Node, column: number) => {
        // 替换节点
        if (vnode instanceof EndNode) {
          // 结束节点
          return !path[column - 1] ? new BranchEndNode(vnode.lane) : new Node()
        } else if (vnode instanceof TaskNode) {
          // 任务节点
          return column > lastGateway
            ? new BranchEndNode(vnode.lane)
            : new Node()
        } else if (vnode instanceof GatewayNode) {
          lastGateway = vnode.column
          const node = <NodeData>this.nodes.get(path[column])
          const label = node.getRelation(path[column + 1])
          return new BranchStartNode(label)
        } else if (vnode instanceof StartNode) {
          return new Node()
        }
      }

      for (let column = path.length - 1; column >= 0; column--) {
        const nodeId = path[column]
        if (nodeId) {
          const node = <NodeData>this.nodes.get(nodeId)
          let vnode = viewNodes.get(nodeId)
          if (vnode) {
            // 节点已经加入到别的泳道上
            rt.push(replaceExistViewNode(vnode, column))
          } else {
            vnode = this.createViewNode(node)
            vnode.setLoc(lane, column)
            viewNodes.set(nodeId, vnode)
            rt.push(vnode)
          }
        } else {
          rt.push(new PlaceholderNode())
        }
      }

      return rt.reverse()
    })
  }

  addEdge(edge: Edge) {
    const { from, to, relationName } = edge
    const fromNode = this.nodes.get(from)
    const toNode = this.nodes.get(to)
    if (fromNode && toNode) {
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
