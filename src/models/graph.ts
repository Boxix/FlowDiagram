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

  constructor(id: string, label: string, type: string) {
    this.id = id
    this.label = label
    this.type = type
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
        rt = new StartNode(id, label)
        break
      case 'end':
        rt = new EndNode(id)
        break
      case 'task':
        rt = new TaskNode(id, label)
        break
      case 'gateway':
        rt = new GatewayNode(id, label)
        break
      default:
        rt = new Node(id, label)
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
    const viewNodes: Map<string, Node> = new Map()
    return allPaths.map((path: string[], lane: number) => {
      const toHandle = this.moveEndNodeToTail(
        merge(Array(maxLength).fill(null), path)
      )
      if (lane === 0) {
        return toHandle.map((nodeId: string, column: number) => {
          if (nodeId) {
            const node = <NodeData>this.nodes.get(nodeId)
            const vnode = this.createViewNode(node)
            vnode.setLoc(lane, column)
            viewNodes.set(nodeId, vnode)
            return vnode
          } else {
            return new PlaceholderNode()
          }
        })
      } else {
        let lastGateway = -1
        const rt = []
        for (let column = toHandle.length - 1; column >= 0; column--) {
          const nodeId = toHandle[column]
          if (nodeId) {
            const node = <NodeData>this.nodes.get(nodeId)
            let vnode = viewNodes.get(nodeId)
            if (vnode) {
              // 节点已经加入到别的泳道上
              if (vnode instanceof EndNode) {
                // 结束节点
                if (!toHandle[column - 1]) {
                  rt.push(new BranchEndNode(vnode.lane))
                } else {
                  rt.push(new Node())
                }
              } else if (vnode instanceof TaskNode) {
                // 任务节点
                if (column > lastGateway) {
                  rt.push(new BranchEndNode(vnode.lane))
                } else {
                  rt.push(new Node())
                }
              } else if (vnode instanceof GatewayNode) {
                lastGateway = vnode.column
                rt.push(new BranchStartNode())
              } else if (vnode instanceof StartNode) {
                rt.push(new Node())
              }
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
      }
    })
  }

  addEdge(edge: Edge) {
    const { from, to } = edge
    const fromNode = this.nodes.get(from)
    const toNode = this.nodes.get(to)
    if (fromNode && toNode) {
      fromNode.next.push(to)
      toNode.prev.push(from)
      this.edges.push(edge)
    }
  }

  toViewGraph() {
    if (this.start) {
      const allPaths = this.scanAllPath(this.start)
      const aligned = this.alignPaths(allPaths)
      return aligned
    }

    return []
  }
}
