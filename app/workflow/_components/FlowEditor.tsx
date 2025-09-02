'use client'

import React, { useCallback, useEffect } from 'react'
import { Workflow} from '@prisma/client'
import { ReactFlow, useNodesState, useEdgesState, Controls, Background, BackgroundVariant, useReactFlow, Connection, addEdge, Edge, getOutgoers} from '@xyflow/react'

import '@xyflow/react/dist/style.css'
import { CreateFlowNode } from '@/lib/workflow/createFlowNodes'
import { TaskType } from '@/types/task'
import NodeComponent from './nodes/NodeComponent'
import { AppNode } from '@/types/appNode'
import DeleteAbleEdge from './edges/DeleteAbleEdge'
import { TaskRegistry } from '@/lib/workflow/task/registry'



const nodeTypes = {
  Node: NodeComponent
}

const edgeTypes = {
  default: DeleteAbleEdge
}

const snapGrid: [number, number] = [50, 50]

const fitViewOptions = { padding: 1}


const FlowEditor = ({workflow}:{ workflow: Workflow }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>([
  ])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])
  const { setViewport, screenToFlowPosition, updateNodeData, getNode } = useReactFlow()

  useEffect(() => {
    try {
      const flow = JSON.parse(workflow.definition)
      if (!flow) return;
      setNodes(flow.nodes || [])
      setEdges(flow.edges || [])
      if (!flow.viewport) return;
      const { x=0, y=0, zoom=1 } = flow.viewport
      setViewport({ x, y, zoom })
    } catch (err) {
      console.error('Failed to parse workflow definition:', err)
      
    }
  }, [workflow.definition, setNodes, setEdges, setViewport])

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    const taskType = event.dataTransfer.getData('application/reactflow')
    if (typeof taskType === undefined || !taskType) return;

    const position = screenToFlowPosition({
      x: event.clientX,
      y: event.clientY
    })

    const newNode = CreateFlowNode(taskType as TaskType, position);

    setNodes((nds) => nds.concat(newNode));
  }, [screenToFlowPosition, setNodes])

  const onConnect = useCallback((connection: Connection) => {
    setEdges(eds => addEdge({ ...connection, animated: true}, eds))
    if (!connection.targetHandle) {
      console.warn('Connection target handle is undefined, skipping update.')
      return;
    }
    const node = getNode(connection.target!); 
    if (!node) {
      console.warn('Node not found for connection target:', connection.target);
      return;
   }
    const nodeInputs = node.data.inputs ?? {};
   
    updateNodeData(node.id, {
      inputs: {...nodeInputs,
        [connection.targetHandle]: ""
      },
    })


  }, [setEdges, updateNodeData, nodes])

  const isValidConnection = useCallback((connection: Connection | Edge) => {

    const source = nodes.find((node) => node.id === connection.source)
    const target = nodes.find((node) => node.id === connection.target)

    if (!source) {
      console.warn('Source node not found for connection:', connection.source);
      return false;
    }
    
    if (!target) {
      console.warn('Target node not found for connection:', connection.target);
      return false;
    }
    const sourceTask = TaskRegistry[source.data.type];
    const targetTask = TaskRegistry[target.data.type];

    const output = sourceTask.outputs.find(output => output.name === connection.sourceHandle);

    if (!output) {
      console.log('Output not found for connection:', connection.sourceHandle);
      return false;
    }

    const input = targetTask.inputs.find(input => input.name === connection.targetHandle);

    if (!input) {
      console.log('Input not found for connection:', connection.targetHandle);
      return false;
    }

    if (input?.type !== output?.type) {
      console.log('Input and output types do not match:', input.type, output.type);
      return false;
    }

    const hasCycle = (node: AppNode, visited = new Set()) => {
      if (visited.has(node.id)) {
        return true; 
      }
      
      for (const outgoer of getOutgoers(node, nodes, edges) ) {
        if (outgoer.id === connection.source) {
          return true;
        }
        if (hasCycle(outgoer, visited)) return true;
      }
    }

    const detectedCycle = hasCycle(target as AppNode)

    return !detectedCycle
   
  }, [nodes, edges])


  return (
    <main className='w-full h-full'>
      <ReactFlow
      nodes={nodes}
      edges={edges}
      onEdgesChange={onEdgesChange}
      onNodesChange={onNodesChange}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      snapToGrid
      snapGrid={snapGrid}
      fitViewOptions={
        fitViewOptions
      }
      fitView
      onDragOver={onDragOver}
      onDrop={onDrop}
      onConnect={onConnect}
      isValidConnection={isValidConnection}>
        <Controls position='top-left' fitViewOptions={fitViewOptions}/>
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </main>
  )
}

export default FlowEditor
