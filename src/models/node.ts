export enum NodeType {
  Empty = 'empty',
  Start = 'start',
  Task = 'task',
  End = 'end',
  Gateway = 'gateway',
  Placeholder = 'placeholder',
  BranchStart = 'branchStart',
  BranchEnd = 'branchEnd',
  Virtual = 'virtual'
}

export default class Node {
  private current: boolean = false

  id: string
  label: string
  type: NodeType = NodeType.Empty
  lane: number = -1
  column: number = -1
  active: boolean = false
  lanePrev?: Node

  constructor(id?: string, label?: string) {
    this.id = id || ''
    this.label = label || ''
  }

  setLoc(lane: number, column: number) {
    this.lane = lane
    this.column = column
  }

  get isCurrent() {
    return this.current
  }

  set isCurrent(val) {
    this.current = val
    if (val) {
      this.active = val
    }
  }
}

export class StartNode extends Node {
  constructor(id: string) {
    super(id, '开始')
    this.type = NodeType.Start
  }
}

export class TaskNode extends Node {
  constructor(id: string, label: string) {
    super(id, label)
    this.type = NodeType.Task
  }
}

export class GatewayNode extends Node {
  constructor(id: string, label?: string) {
    super(id, label)
    this.type = NodeType.Gateway
  }
}

export class EndNode extends Node {
  constructor(id: string) {
    super(id, '结束')
    this.type = NodeType.End
  }
}

export class ReplaceNode extends Node {
  replaced: Node

  constructor(node: Node) {
    super()
    this.replaced = node instanceof ReplaceNode ? node.replaced : node
    this.id = this.replaced.id
  }
}

export class PlaceholderNode extends ReplaceNode {
  constructor(node: Node) {
    super(node)
    this.type = NodeType.Placeholder
  }
}

export class BranchStartNode extends ReplaceNode {
  linkTo: number = 0
  constructor(node: Node) {
    super(node)
    this.linkTo = node.lane
    this.type = NodeType.BranchStart
  }
}

export class BranchEndNode extends ReplaceNode {
  linkTo: number = 0
  constructor(node: Node) {
    super(node)
    this.linkTo = node.lane
    this.type = NodeType.BranchEnd
  }
}

export class VirtualNode extends ReplaceNode {
  constructor(node: Node) {
    super(node)
    this.type = NodeType.Virtual
  }
}
