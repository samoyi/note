import { DefaultNodeModelOptions, NodeModel, NodeModelGenerics, PortModelAlignment } from '@projectstorm/react-diagrams'
import { TrialPortModel } from './TrialPortModel'

interface ITrialNodeModel {
  title?: string
  pos?: "top" | "bottom"
  color?: string
  link?: string
}

export interface TrialNodeModelGenerics extends NodeModelGenerics {
  PORT: TrialPortModel
  OPTIONS: DefaultNodeModelOptions
}

export class TrialNodeModel extends NodeModel<TrialNodeModelGenerics> {
  protected ports: { [s: string]: TrialPortModel }
  title: string
  pos?: "top" | "bottom"
  color?: string
  link?: string

  constructor(params?: ITrialNodeModel) {
    super({
      type: 'trial',
    })

    this.title = params?.title || ''
    this.pos = params?.pos
    this.link = params?.link
    this.color = params?.color
    this.ports = {}

    this.addPort(new TrialPortModel(PortModelAlignment.TOP))
    this.addPort(new TrialPortModel(PortModelAlignment.LEFT))
    this.addPort(new TrialPortModel(PortModelAlignment.BOTTOM))
    this.addPort(new TrialPortModel(PortModelAlignment.RIGHT))
  }

  // getPort(name: string): TrialPortModel | null {
  getPort(name: string): TrialPortModel {
    return this.ports[name]
  }

  addPort(port: TrialPortModel): TrialPortModel {
    port.setParent(this)
    this.ports[port.getName()] = port
    return port
  }
}
