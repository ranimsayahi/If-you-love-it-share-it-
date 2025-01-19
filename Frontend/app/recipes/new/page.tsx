'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { createRecipe } from '@/services/api'
import { toast } from "@/hooks/use-toast"
import { RecipeModel } from '@/app/types/models'

export default function NewRecipePage() {
  const [recipe, setRecipe] = useState<Partial<RecipeModel>>({
    RecipeName: '',
    Ingredients: '',
    Steps: '',
    Region: '',
    Emotion: undefined,
  })
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setRecipe(prev => ({ ...prev, [name]: value }))
  }

  const handleEmotionChange = (value: string) => {
    setRecipe(prev => ({ ...prev, Emotion: value as RecipeModel['Emotion'] }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createRecipe(recipe)
      toast({
        title: "Recipe Submitted",
        description: "Your recipe has been submitted for review.",
      })
      router.push('/recipes')
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
      toast({
        title: "Submission Failed",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="bg-white/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-[#3c2218]">Share Your Recipe</CardTitle>
          <CardDescription>
            Share your favorite Tunisian recipe and the story behind it.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="RecipeName">Recipe Name</Label>
              <Input
                id="RecipeName"
                name="RecipeName"
                value={recipe.RecipeName}
                onChange={handleChange}
                className="bg-white/50"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="Region">Region</Label>
              <Input
                id="Region"
                name="Region"
                value={recipe.Region}
                onChange={handleChange}
                className="bg-white/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="Emotion">Emotion</Label>
              <Select name="Emotion" onValueChange={handleEmotionChange}>
                <SelectTrigger className="bg-white/50">
                  <SelectValue placeholder="Select an emotion" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Comfort">Comfort</SelectItem>
                  <SelectItem value="Nostalgia">Nostalgia</SelectItem>
                  <SelectItem value="Joy">Joy</SelectItem>
                  <SelectItem value="Celebration">Celebration</SelectItem>
                  <SelectItem value="Adventure">Adventure</SelectItem>
                  <SelectItem value="Homesickness">Homesickness</SelectItem>
                  <SelectItem value="Love">Love</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="Ingredients">Ingredients</Label>
              <Textarea
                id="Ingredients"
                name="Ingredients"
                value={recipe.Ingredients}
                onChange={handleChange}
                className="bg-white/50"
                placeholder="Enter each ingredient on a new line"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="Steps">Steps</Label>
              <Textarea
                id="Steps"
                name="Steps"
                value={recipe.Steps}
                onChange={handleChange}
                className="bg-white/50"
                placeholder="Enter each step on a new line"
                required
              />
            </div>
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.push('/recipes')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#e63946] hover:bg-[#e63946]/90 text-white"
              >
                Share Recipe
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

