import { DefaultNodeModelOptions, NodeModel, NodeModelGenerics, PortModelAlignment } from '@projectstorm/react-diagrams'
import { ArtifactPortModel } from './ArtifactPortModel'

interface IArtifactNodeModel {
  title?: string
  pos?: "top" | "bottom"
  color?: string
  link?: string
}

export interface ArtifactNodeModelGenerics extends NodeModelGenerics {
  PORT: ArtifactPortModel
  OPTIONS: DefaultNodeModelOptions
}

export class ArtifactNodeModel extends NodeModel<ArtifactNodeModelGenerics> {
  protected ports: { [s: string]: ArtifactPortModel }
  title: string
  pos?: "top" | "bottom"
  color?: string
  link?: string

  constructor(params?: IArtifactNodeModel) {
    super({
      type: 'artifact',
    })

    this.title = params?.title || ''
    this.pos = params?.pos
    this.color = params?.color
    this.link = params?.link
    this.ports = {}

    this.addPort(new ArtifactPortModel(PortModelAlignment.TOP))
    this.addPort(new ArtifactPortModel(PortModelAlignment.LEFT))
    this.addPort(new ArtifactPortModel(PortModelAlignment.BOTTOM))
    this.addPort(new ArtifactPortModel(PortModelAlignment.RIGHT))
  }

  // getPort(name: string): ArtifactPortModel | null {
  getPort(name: string): ArtifactPortModel {
    return this.ports[name]
  }

  addPort(port: ArtifactPortModel): ArtifactPortModel {
    port.setParent(this)
    this.ports[port.getName()] = port
    return port
  }
}
