'use server'

import { prisma } from "@/lib/prisma"
import { WorkflowStatus } from "@/types/workflow"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"


export async function UpdateWorkflow({
    id, definition
}: {
    id: string,
    definition: string
}) {
    'use server'

    const { userId } = auth()

    if (!userId) {
        throw new Error('User not authenticated')
    }

    const existingWorkflow = await prisma.workflow.findUnique({
        where: {
            id,
            userId,
        },
    })

    if (!existingWorkflow) {
        throw new Error('Workflow not found or you do not have permission to update it')
    }

    if (existingWorkflow.status !== WorkflowStatus.DRAFT) {
        throw new Error('Workflow can only be updated if it is in DRAFT status')
    }

    await prisma.workflow.update({
        where: {
            id,
            userId,
        },
        data: {
            definition,
        },
    })

    revalidatePath(`/workflows`)
}