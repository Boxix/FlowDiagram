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
    options: { label?: string; active?: boolean; current?: boolean }
  ) {
    const { label, active, current } = options
    this.id = id
    this.label = label || ''
    this.type = type
    this.active = active || false
    this.current = current || false
  }

  setRelation(to: string, label: string) {
    this.relationNames[to] = label
  }

  getRelation(to: string) {
    return this.relationNames[to]
  }
}
