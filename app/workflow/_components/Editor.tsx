'use client'

import { Workflow } from '@prisma/client'
import React from 'react'
import { ReactFlowProvider } from '@xyflow/react'
import FlowEditor from './FlowEditor'
import { TopBar } from './topbar/TopBar'
import TaskMenu from './TaskMenu'
import { FlowValidationContextProvided } from '@/components/context/FlowValidationContext'

const Editor = ({ workflow }: { workflow: Workflow }) => {
  return (
    <FlowValidationContextProvided>
      <ReactFlowProvider>
        <div className="flex flex-col h-full w-full overflow-hidden">
          <TopBar
            title={'Workflow Editor'}
            subtitle={workflow.name}
            workflowId={workflow.id}
          />
          <section className="flex h-full overflow-auto">
            <TaskMenu />
            <FlowEditor workflow={workflow} />
          </section>
        </div>
      </ReactFlowProvider>
    </FlowValidationContextProvided>
  )
}

export default Editor
