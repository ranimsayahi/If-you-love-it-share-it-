'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getConfessions } from '@/services/api'
import { ConfessionModel } from '@/app/types/models'

export default function ConfessionsPage() {
  const [confessions, setConfessions] = useState<ConfessionModel[]>([])

  useEffect(() => {
    const fetchConfessions = async () => {
      try {
        const data = await getConfessions()
        setConfessions(data)
      } catch (error) {
        console.error('Failed to fetch confessions:', error)
      }
    }
    fetchConfessions()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[#3c2218]">Culinary Confessions</h1>
        <Link href="/confessions/new">
          <Button className="bg-[#e63946] hover:bg-[#e63946]/90 text-white">
            Share Your Confession
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {confessions.map((confession) => (
          <Card key={confession.ID} className="bg-white/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-sm text-[#3c2218]/60">
                Shared on {new Date(confession.Timestamp).toLocaleDateString()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[#3c2218] text-lg italic">&quot;{confession.Admission}&quot;</p>
              <div className="mt-4 flex justify-end">
                <Link href={`/confessions/${confession.ID}`}>
                  <Button variant="ghost" className="text-[#e63946]">
                    Read More
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

