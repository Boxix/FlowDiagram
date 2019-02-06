export default class Edge {
  from: string
  to: string
  relationName: string
  constructor(from: string, to: string, relationName?: string) {
    this.from = from
    this.to = to
    this.relationName = relationName || ''
  }
}
