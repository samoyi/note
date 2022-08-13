import { ArtifactNodeWidget } from './ArtifactNodeWidget';
import { ArtifactNodeModel } from './ArtifactNodeModel';
import * as React from 'react';
import { AbstractReactFactory } from '@projectstorm/react-canvas-core';
import { DiagramEngine } from '@projectstorm/react-diagrams-core';

export class ArtifactNodeFactory extends AbstractReactFactory<ArtifactNodeModel, DiagramEngine> {
  constructor() {
    super('artifact');
  }

  generateReactWidget(event): JSX.Element {
    return <ArtifactNodeWidget 
      engine={this.engine} 
      size={20} 
      node={event.model} 
      title={event.model.title} 
      pos={event.model.pos} 
      color={event.model.color} 
      link={event.model.link} 
    />;
  }

  generateModel(event) {
    return new ArtifactNodeModel();
  }
}