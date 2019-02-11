export default class NodeData {
  id: string
  label: string
  type: string
  prev: string[] = []
  next: string[] = []
  active: boolean = false
  current: boolean = false

  private relationNames: any = {}

  constructor(
    id: string,
    type: string,
    options: { label?: string; current?: boolean }
  ) {
    const { label, current } = options
    this.id = id
    this.label = label || ''
    this.type = type
    this.current = current || false
  }

  setRelation(to: string, label: string) {
    this.relationNames[to] = label
  }

  getRelation(to: string) {
    return this.relationNames[to]
  }
}
