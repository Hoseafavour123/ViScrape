import { z } from 'zod'

export const createWorkflowSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(50, 'Name must be 50 characters or less'),
  description: z
    .string()
    .max(200, 'Description must be 200 characters or less')
    .optional(),
})


export type CreateWorkflowSchemaType = z.infer<typeof createWorkflowSchema>


export const duplicateWorkflowSchema = createWorkflowSchema.extend({
  workflowId: z.string()
})

export type duplicateWorkflowSchemaType = z.infer<typeof duplicateWorkflowSchema>