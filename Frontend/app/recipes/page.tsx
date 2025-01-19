'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getRecipes } from '@/services/api'
import { RecipeModel } from '@/app/types/models'

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<RecipeModel[]>([])

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const data = await getRecipes()
        setRecipes(data)
      } catch (error) {
        console.error('Failed to fetch recipes:', error)
      }
    }
    fetchRecipes()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[#3c2218]">Recipes</h1>
        <Link href="/recipes/new">
          <Button className="bg-[#e63946] hover:bg-[#e63946]/90 text-white">
            Share Recipe
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <Card key={recipe.ID} className="bg-white/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-[#3c2218]">
                {recipe.RecipeName}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-[#3c2218]/80">
                  Region: {recipe.Region || 'Not specified'}
                </p>
                <p className="text-sm text-[#3c2218]/80">
                  Emotion: {recipe.Emotion || 'Not specified'}
                </p>
                <Link href={`/recipes/${recipe.ID}`}>
                  <Button variant="outline" className="w-full mt-4">
                    View Recipe
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

