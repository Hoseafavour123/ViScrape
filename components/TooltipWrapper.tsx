import  { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip'


interface Props {
    children: React.ReactNode
    content: React.ReactNode
    side?: 'top' | 'right' | 'bottom' | 'left'
} 

export const TooltipWrapper = (props: Props) => {
    if (!props.content) {
        return props.children
    }
    return <TooltipProvider delayDuration={0}>
        <Tooltip>
            <TooltipTrigger asChild>
                {props.children}
            </TooltipTrigger>
            <TooltipContent side={props.side}>
                {props.content}
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
}