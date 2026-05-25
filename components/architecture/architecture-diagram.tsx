"use client";

import { memo, useMemo } from "react";
import ReactFlow, {
  Background,
  Controls,
  Handle,
  MarkerType,
  MiniMap,
  Position,
  type Edge,
  type Node,
  type NodeProps
} from "reactflow";
import { Cloud, Database, Network, Server, Shield } from "lucide-react";
import type { ArchitectureResponse, CloudService } from "@/types/architecture";

type CloudNodeData = CloudService & {
  provider: ArchitectureResponse["cloudProvider"];
};

const categoryIcons = {
  compute: Server,
  storage: Cloud,
  database: Database,
  networking: Network,
  security: Shield
};

function ArchitectureNode({ data }: NodeProps<CloudNodeData>) {
  const Icon = categoryIcons[data.category];

  return (
    <div className="w-60 rounded-2xl border border-border bg-card p-4 text-card-foreground shadow-soft">
      <Handle type="target" position={Position.Left} className="!bg-primary" />
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-semibold">{data.name}</p>
            <ProviderMark provider={data.provider} />
          </div>
          <p className="mt-1 capitalize text-xs text-muted-foreground">
            {data.category}
          </p>
        </div>
      </div>
      <p className="mt-3 line-clamp-3 text-xs leading-5 text-muted-foreground">
        {data.description}
      </p>
      <Handle type="source" position={Position.Right} className="!bg-primary" />
    </div>
  );
}

function ProviderMark({
  provider
}: {
  provider: ArchitectureResponse["cloudProvider"];
}) {
  const label = provider === "AWS" ? "AWS" : provider === "Azure" ? "AZ" : "GCP";

  return (
    <span className="inline-flex h-5 shrink-0 items-center rounded-md border border-border bg-secondary px-1.5 text-[10px] font-semibold text-muted-foreground">
      {label}
    </span>
  );
}

const nodeTypes = {
  cloudForge: memo(ArchitectureNode)
};

export function ArchitectureDiagram({
  architecture
}: {
  architecture: ArchitectureResponse;
}) {
  const { nodes, edges } = useMemo(
    () => createLayout(architecture),
    [architecture]
  );

  return (
    <div className="h-[560px] overflow-hidden rounded-2xl border border-border bg-background">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.18 }}
        minZoom={0.25}
        maxZoom={1.4}
        nodesDraggable
      >
        <Background color="hsl(var(--border))" gap={28} />
        <Controls position="bottom-left" />
        <MiniMap
          pannable
          zoomable
          nodeColor="hsl(var(--primary))"
          maskColor="hsl(var(--background) / 0.72)"
        />
      </ReactFlow>
    </div>
  );
}

function createLayout(architecture: ArchitectureResponse): {
  nodes: Node<CloudNodeData>[];
  edges: Edge[];
} {
  const incoming = new Map<string, number>();
  architecture.services.forEach((service) => incoming.set(service.id, 0));
  architecture.connections.forEach((connection) => {
    incoming.set(connection.target, (incoming.get(connection.target) ?? 0) + 1);
  });

  const layerById = new Map<string, number>();
  const roots = architecture.services
    .filter((service) => (incoming.get(service.id) ?? 0) === 0)
    .map((service) => service.id);
  const queue =
    roots.length > 0 ? roots : [architecture.services[0]?.id].filter(Boolean);

  queue.forEach((id) => layerById.set(id, 0));
  for (let index = 0; index < queue.length; index += 1) {
    const current = queue[index];
    const currentLayer = layerById.get(current) ?? 0;
    architecture.connections
      .filter((connection) => connection.source === current)
      .forEach((connection) => {
        const nextLayer = Math.max(
          layerById.get(connection.target) ?? 0,
          currentLayer + 1
        );
        layerById.set(connection.target, nextLayer);
        if (!queue.includes(connection.target)) {
          queue.push(connection.target);
        }
      });
  }

  const grouped = new Map<number, CloudService[]>();
  architecture.services.forEach((service) => {
    const layer = layerById.get(service.id) ?? 0;
    grouped.set(layer, [...(grouped.get(layer) ?? []), service]);
  });

  const nodes = architecture.services.map((service) => {
    const layer = layerById.get(service.id) ?? 0;
    const peers = grouped.get(layer) ?? [];
    const peerIndex = peers.findIndex((peer) => peer.id === service.id);
    const offset = (peerIndex - (peers.length - 1) / 2) * 190;

    return {
      id: service.id,
      type: "cloudForge",
      position: { x: layer * 340, y: 260 + offset },
      data: {
        ...service,
        provider: architecture.cloudProvider
      }
    } as Node<CloudNodeData>;
  });

  const edges = architecture.connections.map((connection) => ({
    id: `${connection.source}-${connection.target}`,
    source: connection.source,
    target: connection.target,
    type: "smoothstep",
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: "hsl(var(--primary))", strokeWidth: 2 }
  }));

  return { nodes, edges };
}
