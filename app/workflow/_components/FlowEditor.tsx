'use client'

import React, { useEffect } from 'react'
import { Workflow} from '@prisma/client'
import { ReactFlow, useNodesState, useEdgesState, Controls, Background, BackgroundVariant, useReactFlow } from '@xyflow/react'

import '@xyflow/react/dist/style.css'
import { CreateFlowNode } from '@/lib/workflow/createFlowNodes'
import { TaskType } from '@/types/task'
import NodeComponent from './nodes/NodeComponent'


const nodeTypes = {
  Node: NodeComponent
}

const snapGrid: [number, number] = [50, 50]

const fitViewOptions = { padding: 1}


const FlowEditor = ({workflow}:{ workflow: Workflow }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([
  ])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const { setViewport} = useReactFlow()

  useEffect(() => {
    try {
      const flow = JSON.parse(workflow.definition)
      if (!flow) return;
      setNodes(flow.nodes || [])
      setEdges(flow.edges || [])
      if (!flow.view) return;
      const { x=0, y=0, zoom=1 } = flow.viewport
      setViewport({ x, y, zoom })
    } catch (err) {
      console.error('Failed to parse workflow definition:', err)
      
    }
  }, [workflow.definition, setNodes, setEdges, setViewport])
  return (
    <main className='w-full h-full'>
      <ReactFlow
      nodes={nodes}
      edges={edges}
      onEdgesChange={onEdgesChange}
      onNodesChange={onNodesChange}
      nodeTypes={nodeTypes}
      snapToGrid
      snapGrid={snapGrid}
      fitViewOptions={
        fitViewOptions
      }
      fitView>
        <Controls position='top-left' fitViewOptions={fitViewOptions}/>
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </main>
  )
}

export default FlowEditor
