import { Loader2Icon } from "lucide-react"

export default function Loading(){
    return <div className='flex items-center justify-center h-screen'>
        <Loader2Icon size={30} className='animate-spin stroke-primary'/>
    </div>
}