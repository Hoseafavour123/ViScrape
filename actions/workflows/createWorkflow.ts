'use server'

import { prisma } from "@/lib/prisma"
import { CreateWorkflowSchemaType, createWorkflowSchema } from "@/shema/workflow"
import { WorkflowStatus } from "@/types/workflow"
import { auth } from "@clerk/nextjs/server"
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

    const workflow = await prisma.workflow.create({
        data: {
            userId,
            status: WorkflowStatus.DRAFT,
            definition: 'TO DO',
            ...data,
        },
    })

    if (!workflow) {
        throw new Error("Failed to create workflow")
    }

    redirect(`/workflows/editor/${workflow.id}`)
}