'use server'

import { prisma } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"

export const deleteWorkflow = async (workflowId: string) => {
    const { userId } = auth()

    if (!userId) {
        throw new Error("User not authenticated")
    }

    const workflow = await prisma.workflow.findUnique({
        where: { id: workflowId, userId },
    })

    if (!workflow) {
        throw new Error("Workflow not found or you do not have permission to delete it")
    }

    await prisma.workflow.delete({
        where: { id: workflowId },
    })

    revalidatePath('/workflows')
}