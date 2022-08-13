import { TrialNodeWidget } from './TrialNodeWidget';
import { TrialNodeModel } from './TrialNodeModel';
import * as React from 'react';
import { AbstractReactFactory } from '@projectstorm/react-canvas-core';
import { DiagramEngine } from '@projectstorm/react-diagrams-core';

export class TrialNodeFactory extends AbstractReactFactory<TrialNodeModel, DiagramEngine> {
  constructor() {
    super('trial');
  }

  generateReactWidget(event): JSX.Element {
    return <TrialNodeWidget 
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
    return new TrialNodeModel();
  }
}