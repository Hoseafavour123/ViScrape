'use client'
import { UpdateWorkflowCron } from '@/actions/workflows/updateWorkflowCron'
import CustomDialogHeader from '@/components/CustomDialogHeader'
import { Button } from '@/components/ui/button'
import cronstrue from 'cronstrue'
import parser from 'cron-parser'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useMutation } from '@tanstack/react-query'
import { CalendarIcon, ClockIcon, TriangleAlertIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { RemoveWorkflowSchedule } from '@/actions/workflows/removeWorkflowSchedule'
import { Separator } from '@radix-ui/react-separator'

const SchedulerDialog = (props: {
  workflowId: string
  cron: string | null
}) => {
  const [cron, setCron] = useState(props.cron || '')
  const [validCron, setValidCron] = useState(false)
  const [readableCron, setReadableCron] = useState('')

  const mutation = useMutation({
    mutationFn: UpdateWorkflowCron,
    onSuccess: () => {
      toast.success('Schedule updated successfully', { id: 'cron' })
    },
    onError: () => {
      toast.error('Something went wrong', { id: 'cron' })
    },
  })

  const removeScheduleMutation = useMutation({
    mutationFn: RemoveWorkflowSchedule,
    onSuccess: () => {
      toast.success('Schedule deleted successfully', { id: 'cron' })
    },
    onError: () => {
      toast.error('Something went wrong', { id: 'cron' })
    },
  })

  useEffect(() => {
    if (!cron.trim()) {
      setValidCron(false)
      setReadableCron('')
      return
    }

    try {
      parser.parseExpression(cron)
      const humanCronstr = cronstrue.toString(cron.trim())
      setValidCron(true)
      setReadableCron(humanCronstr)
    } catch (error) {
      console.log(error)
      setValidCron(false)
      setReadableCron('')
    }
  }, [cron])

  const workflowHasValidCron = props.cron && props.cron.length > 0
  const readableSavedCron =
    workflowHasValidCron && cronstrue.toString(props.cron!)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className={cn(
            'text-sm p-0 h-auto text-orange-500',
            workflowHasValidCron && 'text-primary'
          )}
          variant={'link'}
          size={'sm'}
        >
          {workflowHasValidCron && (
            <div className="flex items-center gap-2">
              <ClockIcon />
              {readableSavedCron}
            </div>
          )}
          {!workflowHasValidCron && (
            <div className="flex items-center gap-1">
              <TriangleAlertIcon className="h-3 w-3" /> Set schedule
            </div>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="px-0">
        <CustomDialogHeader
          title="Schedule workflow execution"
          icon={CalendarIcon}
        />
        <div className="p-6 space-y-4">
          <p className="text-muted-foreground text-sm">
            Specify a cron expression to schedule periodic workflow execution.
            All times are in UTC.
          </p>
          <Input
            value={cron}
            onChange={(e) => setCron(e.target.value)}
            placeholder="E.g * * * * *"
          />
          <div
            className={cn(
              'bg-accent rounded-md p-4 border text-sm ',
              validCron
                ? 'bg-primary/30'
                : ' border-destructive text-destructive'
            )}
          >
            {validCron ? readableCron : 'Not a valid cron'}
          </div>

          {workflowHasValidCron && (
            <DialogClose asChild>
              <div className="">
                <Button
                  className="w-full text-destructive border-destructive hover:text-destructive"
                  variant={'outline'}
                  disabled={
                    mutation.isPending || removeScheduleMutation.isPending
                  }
                  onClick={() => {
                    toast.loading('Removing schedule', { id: 'cron' })
                    removeScheduleMutation.mutate(props.workflowId)
                  }}
                >
                  Remove current schedule
                </Button>
                <Separator className='my-4'/>
              </div>
            </DialogClose>
          )}
        </div>
        <DialogFooter className="px-6 gap-2">
          <DialogClose asChild>
            <Button className="w-full" variant={'secondary'}>
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              disabled={mutation.isPending || !validCron}
              className="w-full"
              onClick={() => {
                toast.loading('Saving...', { id: 'cron' })
                mutation.mutate({ id: props.workflowId, cron })
              }}
            >
              Save
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default SchedulerDialog
