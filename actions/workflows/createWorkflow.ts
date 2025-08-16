'use server'

import { prisma } from "@/lib/prisma"
import { CreateFlowNode } from "@/lib/workflow/createFlowNodes"
import { CreateWorkflowSchemaType, createWorkflowSchema } from "@/shema/workflow"
import { AppNode } from "@/types/appNode"
import { TaskType } from "@/types/task"
import { WorkflowStatus } from "@/types/workflow"
import { auth } from "@clerk/nextjs/server"
import { Edge } from "@xyflow/react"
import { redirect } from "next/navigation"

export const createWorkflow = async (form: CreateWorkflowSchemaType) => {
    const { success, data } = createWorkflowSchema.safeParse(form)
    
    if (!success) {
        throw new Error("Invalid form data")
    }

    const { userId } = auth()

    if (!userId) {
        throw new Error("User not authenticated")
    }

    const initialWorkflow: {nodes: AppNode[] , edges: Edge[]} = {
        nodes: [],
        edges:[]
    }

    initialWorkflow.nodes.push(CreateFlowNode(TaskType.LAUNCH_BROWSER))
    

    const workflow = await prisma.workflow.create({
        data: {
            userId,
            status: WorkflowStatus.DRAFT,
            definition: JSON.stringify(initialWorkflow),
            ...data,
        },
    })

    if (!workflow) {
        throw new Error("Failed to create workflow")
    }

    redirect(`/workflow/editor/${workflow.id}`)
}