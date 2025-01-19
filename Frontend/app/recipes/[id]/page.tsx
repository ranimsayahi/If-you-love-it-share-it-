import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function RecipeDetailPage({ params }: { params: { id: string } }) {
  // This would come from your API
  const recipe = {
    id: params.id,
    name: "Couscous",
    region: "Tunis",
    emotion: "Comfort",
    description: "Traditional Tunisian couscous with vegetables and meat",
    ingredients: [
      "500g couscous",
      "Mixed vegetables",
      "Lamb or chicken",
      "Tunisian spices"
    ],
    steps: [
      "Prepare the couscous according to package instructions",
      "Cook the meat with spices",
      "Steam the vegetables",
      "Combine all ingredients"
    ],
    stories: [
      {
        id: 1,
        content: "This recipe reminds me of my grandmother's cooking...",
        author: "Sarah"
      }
    ]
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Link href="/recipes">
        <Button variant="ghost" className="text-[#3c2218]">
          ← Back to Recipes
        </Button>
      </Link>

      <Card className="bg-white/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-[#3c2218]">
            {recipe.name}
          </CardTitle>
          <div className="flex gap-4 text-sm text-[#3c2218]/80">
            <span>Region: {recipe.region}</span>
            <span>Emotion: {recipe.emotion}</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-[#3c2218] mb-2">Description</h2>
            <p className="text-[#3c2218]/80">{recipe.description}</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-[#3c2218] mb-2">Ingredients</h2>
            <ul className="list-disc pl-5 text-[#3c2218]/80 space-y-1">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-[#3c2218] mb-2">Instructions</h2>
            <ol className="list-decimal pl-5 text-[#3c2218]/80 space-y-2">
              {recipe.steps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-[#3c2218] mb-2">Stories</h2>
            {recipe.stories.map((story) => (
              <Card key={story.id} className="bg-white/30">
                <CardContent className="p-4">
                  <p className="text-[#3c2218]/80 italic">{story.content}</p>
                  <p className="text-sm text-[#3c2218]/60 mt-2">- {story.author}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

