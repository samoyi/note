import { CanvasWidget } from "@projectstorm/react-canvas-core";
import createEngine, {
  LinkModel,
  DiagramModel,
  DiagramEngine,
  PortModelAlignment,
} from "@projectstorm/react-diagrams";
import { useMemo } from "react";
import { useEffect, useState } from "react";
import { TrialNodeFactory } from "../../DataFlowCommon/TrialNode/TrialNodeFactory";
import { TrialNodeModel } from "../../DataFlowCommon/TrialNode/TrialNodeModel";
import { TrialPortModel } from "../../DataFlowCommon/TrialNode/TrialPortModel";
import { ArtifactNodeFactory } from "../../DataFlowCommon/ArtifactNode/ArtifactNodeFactory";
import { ArtifactNodeModel } from "../../DataFlowCommon/ArtifactNode/ArtifactNodeModel";
import { ArtifactPortModel } from "../../DataFlowCommon/ArtifactNode/ArtifactPortModel";
import { SimplePortFactory } from "../../DataFlowCommon/SimplePortFactory";
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { ArtifactDetail } from "api/folder";
import { useMultiArtifacts, useMultiFolderItems } from "component/hook/folder_query";
import { TrialDetailDoc } from "api/trial";
import { getArtifactLink, getTrialLink, Legend } from "component/App/DataFlowCommon/utils";


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: "relative",
      height: (props: { canvasHeight?: number }) => props.canvasHeight,
      "&>div": {
        height: '100%',
      },
    },
  }),
);

const PRODUCER_X = 200;
const HORIZONTAL_SPAN = 150;
const VERTICAL_SPAN = 80;
const SUB_VERTICAL_SPAN = 60;
const CENTER_X = PRODUCER_X + HORIZONTAL_SPAN;


const DataFlow = (props: {
  artifact: ArtifactDetail,
  producers: [TrialDetailDoc] | [],
  consumers: TrialDetailDoc[],
}) => {
  const { artifact, producers, consumers } = props;
  const producer = producers.length > 0 ? producers[0] : null;
  const artifactIDs = useMemo(() => {
    return producer?.outputArtifacts ?? [artifact.metadata.id];
  }, [artifact.metadata.id, producer?.outputArtifacts]);

  // 根据 artifacts 的数量设置初始画布高度
  const [canvasHeight, setCanvasHeight] = useState((artifactIDs.length + 2) * VERTICAL_SPAN);
  const classes = useStyles({ canvasHeight });

  // consumer 节点的初始纵向间距
  const [consumerVerticalSpan, setConsumerVerticalSpan] = useState(VERTICAL_SPAN);

  const currIdx = artifactIDs.findIndex((id) => id === artifact.metadata.id);

  const subArtifactIDs = useMemo(() => {
    const ids: string[] = [];
    consumers.forEach((c) => {
      return ids.push(...(c.outputArtifacts ?? []));
    });
    return ids;
  }, [consumers]);

  const { artifacts } = useMultiArtifacts(artifactIDs);
  const { folderItems } = useMultiFolderItems(artifacts.map(a => a.metadata.folder));

  const { artifacts: subArtifacts } = useMultiArtifacts(subArtifactIDs);
  // 如果 subArtifacts 需要更高的画布就增加画布高度
  if ((subArtifacts.length + 2) * SUB_VERTICAL_SPAN > canvasHeight) {
    setCanvasHeight((subArtifacts.length + 2) * SUB_VERTICAL_SPAN);
  }
  const { folderItems: subFolderItems } = useMultiFolderItems(subArtifacts.map(sub => sub.metadata.folder));
  const subFolderNames = useMemo(() => {
    return subFolderItems.map((item) => item.name)
  }, [subFolderItems]);

  const [engine, setEngine] = useState<DiagramEngine>();

  // 使用 useEffect 和 setTimeout 的原因：https://github.com/projectstorm/react-diagrams/issues/671
  useEffect(() => {
    setTimeout(() => {
      const engine = createEngine();

      // Register custom factories
      engine
        .getPortFactories()
        .registerFactory(
          new SimplePortFactory(
            "trial",
            () => new TrialPortModel(PortModelAlignment.LEFT),
          ),
        );
      engine
        .getPortFactories()
        .registerFactory(
          new SimplePortFactory(
            "artifact",
            () => new ArtifactPortModel(PortModelAlignment.LEFT),
          ),
        );
      engine.getNodeFactories().registerFactory(new TrialNodeFactory());
      engine.getNodeFactories().registerFactory(new ArtifactNodeFactory());
      const model = new DiagramModel();


      // Nodes
      let producerNode: TrialNodeModel | null = null;
      if (producer) {
        producerNode = new TrialNodeModel({
          title: producer.metadata.name,
          pos: "top",
          link: getTrialLink(producer.metadata.id)
        });
        producerNode.setPosition(CENTER_X - HORIZONTAL_SPAN, canvasHeight / 2);
      }

      let firstY = canvasHeight / 2 - currIdx * VERTICAL_SPAN;
      const artifactNodes = artifactIDs.map((a, i) => {
        const node = new ArtifactNodeModel({
          title: folderItems[i] ? folderItems[i].name + ":v" + artifacts[i].version : "",
          link: artifacts[i] ? getArtifactLink(artifacts[i].metadata.folder, artifacts[i].version) : "",
          ...(i === currIdx ? { color: "gray", link: "" } : {})
        });
        node.setPosition(PRODUCER_X + HORIZONTAL_SPAN, firstY + i * VERTICAL_SPAN);
        return node;
      });

      const currArtifactNode = artifactNodes[currIdx];

      let arr: ArtifactDetail[][] = Array.from({ length: consumers.length }, (item) => []);
      subArtifacts.forEach((s) => {
        let idx = consumers.findIndex((c) => {
          return c.outputArtifacts?.includes(s.metadata.id);
        });
        arr[idx].push(s);
      });
      const subArtifactGroupByConsumerIdx = arr;

      // 根据 subArtifacts 的数量调整 consumers 的纵向间距
      let maxCount = 0;
      subArtifactGroupByConsumerIdx.forEach((group) => {
        if (group.length > maxCount) {
          maxCount = group.length;
        }
      });
      setConsumerVerticalSpan(Math.max(maxCount * VERTICAL_SPAN * 3 / 4, VERTICAL_SPAN));

      // 计算 consumer 各个节点的纵坐标
      const len = consumers.length;
      const centerIdx = Math.floor(len / 2);
      let firstY1 = 0;
      if (len % 2) {
        firstY1 = canvasHeight / 2 - centerIdx * consumerVerticalSpan;
      }
      else {
        firstY1 = canvasHeight / 2 - centerIdx * consumerVerticalSpan + consumerVerticalSpan / 2;
      }
      const consumerLocYs = consumers.map((_, idx) => {
        return firstY1 + consumerVerticalSpan * idx;
      });

      // 计算 subArtifact 各个节点的纵坐标
      let arr1: number[] = [];
      subArtifactGroupByConsumerIdx.forEach((group, idx) => {
        if (group.length > 0) {
          const len = group.length;
          const centerIdx = Math.floor(len / 2);
          let firstY = 0;
          if (len % 2) {
            firstY = consumerLocYs[idx] - centerIdx * SUB_VERTICAL_SPAN;
          }
          else {
            firstY = consumerLocYs[idx] - centerIdx * SUB_VERTICAL_SPAN + SUB_VERTICAL_SPAN / 2;
          }
          group.forEach((_, i) => {
            arr1.push(firstY + SUB_VERTICAL_SPAN * i);
          });
        }
      });
      const subArtifactLocYs = arr1;

      // 生成 consumer 节点
      const consumerNodes = consumers.map((c, idx) => {
        const node = new TrialNodeModel({
          title: c.metadata.name,
          link: getTrialLink(c.metadata.id)
        });
        node.setPosition(CENTER_X + HORIZONTAL_SPAN, consumerLocYs[idx]);
        return node;
      });

      // 生成 subArtifact 节点
      const subArtifactNodes = subArtifacts.map((sub, idx) => {
        const node = new ArtifactNodeModel({
          title: subFolderNames[idx] + ":v" + sub.version,
          link: getArtifactLink(sub.metadata.folder, sub.version)
        });
        node.setPosition(CENTER_X + HORIZONTAL_SPAN * 2, subArtifactLocYs[idx]);
        return node;
      });


      // Ports
      let producerNodeRightPort: TrialPortModel | null = null;
      if (producerNode) {
        producerNodeRightPort = producerNode.getPort(PortModelAlignment.RIGHT)!;
      }

      const artifactLeftPorts = artifactNodes.map((node) => {
        return node.getPort(PortModelAlignment.LEFT)!
      });

      const currArtifactNodeRightPort = currArtifactNode.getPort(PortModelAlignment.RIGHT)!;

      const consumerPorts = consumerNodes.map((node) => {
        return node.getPort(PortModelAlignment.LEFT)!
      });

      const subArtifactPorts = subArtifactNodes.map((node) => {
        return node.getPort(PortModelAlignment.LEFT)!
      });


      // Links
      let linksToArtifacts;
      if (producerNodeRightPort === null) {
        linksToArtifacts = [];
      }
      else {
        linksToArtifacts = artifactNodes.map((node) => {
          return producerNodeRightPort!.link(
            node.getPort(PortModelAlignment.LEFT),
          );
        });
      }

      const linksToConsumers = consumerNodes.map((node) => {
        return currArtifactNodeRightPort.link(
          node.getPort(PortModelAlignment.LEFT),
        );
      });

      const links: LinkModel[] = [];
      let count = 0;
      consumerNodes.forEach((consumer, idx) => {
        subArtifactGroupByConsumerIdx[idx].forEach((s, i) => {
          links.push(consumer.getPort(PortModelAlignment.RIGHT).link(subArtifactPorts[count++]))
        });
      });
      const linksTosubArtifacts = links;


      model.addAll(
        ...artifactNodes,
        currArtifactNode,
        ...(producerNode ? [producerNode] : []),
        ...consumerNodes,
        ...subArtifactNodes,
        ...artifactLeftPorts,
        ...(producerNodeRightPort ? [producerNodeRightPort] : []),
        ...consumerPorts,
        ...subArtifactPorts,
        ...linksToArtifacts,
        ...linksToConsumers,
        ...linksTosubArtifacts,
      );

      model.setLocked(true);

      engine.setModel(model);

      setEngine(engine);
    }, 100);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [artifactIDs.length, artifacts.length, canvasHeight, consumerVerticalSpan, consumers.length, currIdx, folderItems.length, producer, subArtifacts.length, subFolderNames.length]);


  return <div className={classes.root}>
    {engine && <CanvasWidget className="w-full h-full bg-gray-600" engine={engine} />}
    <Legend />
  </div>
};

export default DataFlow;