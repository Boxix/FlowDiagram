export enum NodeType {
  Empty = 'empty',
  Start = 'start',
  Task = 'task',
  End = 'end',
  Gateway = 'gateway',
  Placeholder = 'placeholder',
  BranchStart = 'branchStart',
  BranchEnd = 'branchEnd'
}

export default class Node {
  id: string
  label: string
  type: NodeType = NodeType.Empty

  constructor(id: string, label?: string) {
    this.id = id
    this.label = label || ''
  }
}

export class StartNode extends Node {
  constructor(id: string, label: string) {
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

export class PlaceholderNode extends Node {
  constructor(id: string) {
    super(id)
    this.type = NodeType.Placeholder
  }
}

export class BranchStartNode extends Node {
  constructor(id: string, label?: string) {
    super(id, label)
    this.type = NodeType.BranchStart
  }
}

export class BranchEndNode extends Node {
  linkTo: number = 0
  constructor(id: string, linkTo: number) {
    super(id)
    this.linkTo = linkTo
    this.type = NodeType.BranchEnd
  }
}
