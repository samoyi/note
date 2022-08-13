import * as React from 'react';
import { ArtifactNodeModel } from './ArtifactNodeModel';
import { DiagramEngine, PortModelAlignment, PortWidget } from '@projectstorm/react-diagrams';

export interface ArtifactNodeWidgetProps {
  node: ArtifactNodeModel;
  engine: DiagramEngine;
  title?: string;
  size?: number;
  pos?: "top" | "bottom";
  color?: "string"
  link?: string
}

const SIZE = 22;
const BORDER_WIDTH = 3;
const PORT_SIZE = 0;


function PortDiv() {
  return (
    <div style={{
      width: `${PORT_SIZE}px`,
      height: `${PORT_SIZE}px`,
      zIndex: 10,
    }}></div>
  );
}
function NodeName(props: { name: string, pos?: "top" | "bottom" }) {
  const pos = props.pos ?? "bottom"
  return (
    <div style={{
      position: "absolute",
      [pos]: "-1.5em",
      whiteSpace: "nowrap",
      left: `${SIZE / 2}px`,
      transform: "translate(-50%)",
    }}>
      {props.name}
    </div>
  );
}


export class ArtifactNodeWidget extends React.Component<ArtifactNodeWidgetProps> {
  render() {
    return (
      <div
        className={'artifact-node'}
        style={{
          position: 'relative',
          width: SIZE,
          height: SIZE,
          boxSizing: "border-box",
          border: `${BORDER_WIDTH}px solid ${this.props.color ?? "rgb(106, 168, 79)"}`,
          borderRadius: "50%",
          cursor: this.props.link ? "pointer" : "default",
        }}
        onClick={() => this.props.link && (window.location.href = this.props.link)}
      >
        <NodeName name={this.props.title ?? ""} pos={this.props.pos} />
        <svg
          width={SIZE}
          height={SIZE}
          dangerouslySetInnerHTML={{
            __html:
              `
          <g id="Layer_1">
          </g>
          <g id="Layer_2">
          </g>
        `
          }}
        />
        <PortWidget
          style={{
            top: SIZE / 2 - BORDER_WIDTH - PORT_SIZE / 2,
            left: -BORDER_WIDTH - PORT_SIZE / 2,
            position: 'absolute'
          }}
          port={this.props.node.getPort(PortModelAlignment.LEFT)!}
          engine={this.props.engine}
        >
          <PortDiv />
        </PortWidget>
        <PortWidget
          style={{
            left: SIZE / 4 * 3 - BORDER_WIDTH - PORT_SIZE / 2,
            top: SIZE / 4 - BORDER_WIDTH - PORT_SIZE,
            position: 'absolute'
          }}
          port={this.props.node.getPort(PortModelAlignment.TOP)!}
          engine={this.props.engine}
        >
          <PortDiv />
        </PortWidget>
        <PortWidget
          style={{
            left: SIZE - BORDER_WIDTH - PORT_SIZE / 2,
            top: SIZE / 2 - BORDER_WIDTH - PORT_SIZE / 2,
            position: 'absolute'
          }}
          port={this.props.node.getPort(PortModelAlignment.RIGHT)!}
          engine={this.props.engine}
        >
          <PortDiv />
        </PortWidget>
        <PortWidget
          style={{
            left: SIZE / 4 * 3 - BORDER_WIDTH - PORT_SIZE / 2,
            top: SIZE / 4 * 3 - BORDER_WIDTH,
            position: 'absolute'
          }}
          port={this.props.node.getPort(PortModelAlignment.BOTTOM)!}
          engine={this.props.engine}
        >
          <PortDiv />
        </PortWidget>
      </div>
    );
  }
}