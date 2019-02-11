import { omit, set, get } from 'lodash'
import Edge from './edge'


export default class EdgeCollection {
  private edges: Edge[] = []
  private edgeMap: any = {}

  push(edge: Edge) {
    this.edges.push(edge)
    const { from, to } = edge
    set(this.edgeMap, `${from}.${to}`, omit(edge, ['from', 'to']))
  }

  isActive(from: string, to: string) {
    return get(this.edgeMap, `${from}.${to}.active`, false)
  }
}
