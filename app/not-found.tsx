

import { ArrowLeftIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const NotFound = () => {
  return (
    <div className='flex flex-col  items-center justify-center min-h-screen p-4'>
        <div className="text-center">
            <h1 className='text-6xl font-bold text-primary mb-4'>404</h1>
            <h2 className='text-2xl font-semibold mb-4'>
                Page Not Found
            </h2>
            <p className='text-muted-foreground mb-8 max-w-md '>
                The page you are looking for does not exist or has been moved. Please check the URL or return to the homepage.
            </p>
            <div className='flex flex-col sm:flex-row justify-center gap-4'>
              <Link href={'/'} className='flex items-center justify-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80 transition-color '>
              <ArrowLeftIcon className=''/>
              Back to dashboard
              </Link>
            </div>
        </div>
    </div>
  )
}

export default NotFound