'use client'

import { deleteWorkflow } from '@/actions/workflows/deleteWorkflow'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'sonner'


type props = {
    open: boolean
    setOpen: (open: boolean) => void
    workflowName: string
    workflowId: string
}

export const DeleteWorkflowDialog = ({ open, setOpen, workflowName, workflowId}: props) => {
    const deleteMutation = useMutation({
        mutationFn: deleteWorkflow, 
        onSuccess: () => {
            toast.success("Workflow deleted successfully!", {id: workflowId})
            setConfirmText('')
        },
        onError: (error) => {
            toast.error(`Error deleting workflow: ${error.message}`, {id:workflowId})
        }
    })
    const [confirmText, setConfirmText] = useState('')
    return (
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              workflow.
              <div className="flex flex-col py-4 gap-2">
                <p>
                  If you are sure, enter <b>{workflowName} </b> to confirm.
                </p>
               <Input value={confirmText} onChange={(e) => setConfirmText(e.target.value)}/>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setConfirmText('')}>
                Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={confirmText !== workflowName || deleteMutation.isPending}
              className="bg-destructive text-destructive-foreground  hover:bg-destructive/90"
              onClick={() => {
                toast.loading("Deleting workflow...", {id: workflowId})
                deleteMutation.mutate(workflowId)
              }}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
}