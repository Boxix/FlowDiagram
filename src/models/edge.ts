export default class Edge {
  from: string
  to: string
  relationName: string
  active: boolean = false
  constructor(
    from: string,
    to: string,
    active: boolean = false,
    relationName?: string
  ) {
    this.from = from
    this.to = to
    this.active = active
    this.relationName = relationName || ''
  }
}
