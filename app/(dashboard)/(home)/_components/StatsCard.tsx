'use client'

import { LucideIcon } from 'lucide-react'
import React from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ReactCountUpWrapper from '@/components/ReactCountUpWrapper';


interface Props {
  title: string
  value: number
  icon: React.ReactNode
}

const StatsCard = (props: Props) => {
  return (
    <Card className="relative overflow-hidden h-full">
      <CardHeader className="flex pb-2">
        <CardTitle>{props.title}</CardTitle>
        <div className="absolute -bottom-4 -right-8 opacity-10">
          {props.icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-primary">
          <ReactCountUpWrapper value={props.value} />
        </div>
      </CardContent>
    </Card>
  )
}

export default StatsCard
