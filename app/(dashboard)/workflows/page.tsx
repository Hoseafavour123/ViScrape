import { GetWorkflowForUser } from '@/actions/workflows/getWorkflowsForUser'
import { Skeleton } from '@/components/ui/skeleton'
import React, { Suspense } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, InboxIcon } from 'lucide-react'
import CreateWorkflowDialog from './_components/CreateWorkflowDialog'


const page = () => {
  return (
    <div className='flex-1 flex flex-col h-full'>
        <div className='flex justify-between'>
            <div className='flex flex-col'>
                <h1 className='text-3xl font-bold'>Workflows</h1>
                <p className='text-muted-foreground'>Manage your workflows</p>
            </div>
            <CreateWorkflowDialog />
        </div>

        <div className='h-full py-6'>
            <Suspense fallback={<UserWorkFlowsSkeleton/>}>
            <UserWorkflows/>
            </Suspense>
        </div>
    </div>
  )

 
}

 const UserWorkFlowsSkeleton = () => {
   return (
     <div className="space-y-2">
       {[1, 2, 3, 4].map((item) => (
         <Skeleton key={item} className="h-32 w-full" />
       ))}
     </div>
   )
 }


async function UserWorkflows() {
    const workflows = await GetWorkflowForUser()

    if (!workflows) {
         return (
           <Alert variant={'destructive'}>
             <AlertCircle className="w-4 h-4" />
             <AlertTitle>Error</AlertTitle>
             <AlertDescription>
               Something went wrong, check back later.
             </AlertDescription>
           </Alert>
         )
    }

    if (workflows.length === 0) {
        return (
         <div className='flex flex-col gap-4 h-full items-center justify-center'>
            <div className='rounded-full bg-accent w-20 h-20 flex items-center justify-center'>
                <InboxIcon size={40} className="bg-gradient-to-r from-purple-800 to-emerald-600 rounded-full p-2" />
            </div>
            <div className='flex flex-col gap-1 text-center'>
                <p className='font-bold'>No workflow created yet</p>
                <p className='text-sm text-muted-foreground'>
                    Click the button below to create your first workflow
                </p>
            </div>
            <CreateWorkflowDialog triggerText='Create your first workflow'/>
         </div>
        )
    }

   
    return <div></div>
}

export default page
