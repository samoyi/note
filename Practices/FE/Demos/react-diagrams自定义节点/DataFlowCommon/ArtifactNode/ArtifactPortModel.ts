import { LinkModel, PortModel, DefaultLinkModel, PortModelAlignment } from '@projectstorm/react-diagrams'
import { AbstractModelFactory } from '@projectstorm/react-canvas-core'

export class ArtifactPortModel extends PortModel {
  constructor(alignment: PortModelAlignment) {
    super({
      type: 'artifact',
      name: alignment,
      alignment,
    })
  }

  link<T extends LinkModel>(port: PortModel, factory?: AbstractModelFactory<T>): T {
    let link = this.createLinkModel(factory)
    link.setSourcePort(this)
    link.setTargetPort(port)
    return link as T
  }

  createLinkModel(factory?: AbstractModelFactory<LinkModel>): LinkModel {
    let link = super.createLinkModel()
    if (!link && factory) {
      return factory.generateModel({})
    }
    return link || new DefaultLinkModel()
  }
}
