'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getStories } from '@/app/services/api'
import { PersonalStoryModel } from '@/app/types/models'

export default function StoriesPage() {
  const [stories, setStories] = useState<PersonalStoryModel[]>([])

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const data = await getStories()
        setStories(data)
      } catch (error) {
        console.error('Failed to fetch stories:', error)
      }
    }
    fetchStories()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[#3c2218]">Culinary Stories</h1>
        <Link href="/recipes">
          <Button className="bg-[#e63946] hover:bg-[#e63946]/90 text-white">
            Share Your Story
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {stories.map((story) => (
          <Card key={story.ID} className="bg-white/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-[#3c2218]">
                Story for Recipe #{story.RecipeID}
              </CardTitle>
              <p className="text-sm text-[#3c2218]/60">Shared on {new Date(story.Timestamp).toLocaleDateString()}</p>
            </CardHeader>
            <CardContent>
              <p className="text-[#3c2218] italic">{story.Content}</p>
              <div className="mt-4 flex justify-end">
                <Link href={`/recipes/${story.RecipeID}`}>
                  <Button variant="outline" className="text-[#e63946]">
                    View Associated Recipe
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

