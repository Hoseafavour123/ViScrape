'use client'

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import CustomDialogHeader from '@/components/CustomDialogHeader'
import { Layers2Icon } from 'lucide-react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form'
import { createWorkflowSchema } from '@/shema/workflow'


const CreateWorkflowDialog = ({triggerText}:{triggerText?: string}) => {
    const [open, setOpen]  = useState(false)

    const form = useForm<z.infer<typeof createWorkflowSchema>>({
        resolver: zodResolver(createWorkflowSchema),
        defaultValues: {
            name: '',
            description: '',
        },
    })
  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
            <Button>{triggerText ?? "Create workflow"}</Button>
        </DialogTrigger>
        <DialogContent className='px-0'>
            <CustomDialogHeader icon={Layers2Icon} title='Create workflow' subTitle='Start building your workflow'/>
            <div className='p-6 '>
                <Form {...form}>
                    

                </Form>
            </div>
        </DialogContent>
    </Dialog>
  )
}

export default CreateWorkflowDialog