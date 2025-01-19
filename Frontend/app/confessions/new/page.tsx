'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { createConfession } from '@/services/api'
import { toast } from "@/hooks/use-toast"
import { ConfessionModel } from '@/app/types/models'

export default function NewConfessionPage() {
  const [confession, setConfession] = useState<Partial<ConfessionModel>>({
    Admission: ''
  })
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createConfession(confession)
      toast({
        title: "Confession Submitted",
        description: "Your culinary confession has been submitted for review.",
      })
      router.push('/confessions')
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      toast({
        title: "Submission Failed",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="bg-white/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-[#3c2218]">Share Your Culinary Confession</CardTitle>
          <CardDescription>
            Share your kitchen mishaps, secret ingredients, or cooking shortcuts. Your confession will be anonymous!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Textarea
                placeholder="Type your confession here..."
                value={confession.Admission}
                onChange={(e) => setConfession(prev => ({ ...prev, Admission: e.target.value }))}
                className="min-h-[200px] bg-white/50"
                required
              />
              <p className="text-sm text-[#3c2218]/60">
                Your confession will be reviewed before being published.
              </p>
            </div>
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.push('/confessions')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#e63946] hover:bg-[#e63946]/90 text-white"
              >
                Share Confession
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

