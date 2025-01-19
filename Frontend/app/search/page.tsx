'use client'

import { useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface SearchResult {
  id: string;
  type: string;
  name?: string;
  author?: string;
  description?: string;
  content?: string;
  admission?: string;
}

// This would come from your API in a real application
const mockData = {
  recipes: [
    { id: 1, name: "Couscous", description: "Traditional Tunisian couscous" },
    { id: 2, name: "Brik", description: "Crispy Tunisian pastry" },
  ],
  stories: [
    { id: 1, content: "My grandmother's couscous recipe...", author: "Amira" },
    { id: 2, content: "Learning to make brik with my father...", author: "Youssef" },
  ],
  confessions: [
    { id: 1, admission: "I once burned the brik so badly..." },
    { id: 2, admission: "I secretly add harissa to everything..." },
  ],
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q')
  const type = searchParams.get('type') || 'all'
  const [results, setResults] = useState<SearchResult[]>([])

  useEffect(() => {
    // In a real application, this would be an API call
    const searchResults = Object.entries(mockData).flatMap(([dataType, items]) => {
      if (type === 'all' || type === dataType) {
        return items.filter((item: any) => 
          Object.values(item).some((value) => 
            typeof value === 'string' && value.toLowerCase().includes(query?.toLowerCase() || '')
          )
        ).map(item => ({ ...item, type: dataType }))
      }
      return []
    })

    setResults(searchResults)
  }, [query, type])

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#3c2218]">Search Results</h1>
      <p className="text-[#3c2218]/80">
        Showing results for &quot;{query}&quot; in {type === 'all' ? 'all categories' : type}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {results.map((result: SearchResult, index: number) => (
          <Card key={`${result.type}-${result.id}`} className="bg-white/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-[#3c2218]">
                {result.type === 'recipes' ? result.name : 
                 result.type === 'stories' ? `Story by ${result.author}` :
                 'Confession'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[#3c2218]/80 line-clamp-3">
                {result.description || result.content || result.admission}
              </p>
              <div className="mt-4 flex justify-end">
                <Link href={`/${result.type}/${result.id}`}>
                  <Button variant="outline" className="text-[#e63946]">
                    View {result.type === 'recipes' ? 'Recipe' : 
                           result.type === 'stories' ? 'Story' : 
                           'Confession'}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {results.length === 0 && (
        <p className="text-center text-[#3c2218]/80">No results found. Try a different search term or category.</p>
      )}
    </div>
  )
}

