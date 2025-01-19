'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"

export function SearchFilters() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="text-[#3c2218]">Advanced Filters</Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle className="text-[#3c2218]">Search Filters</SheetTitle>
          <SheetDescription>
            Refine your search with specific criteria
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label className="text-[#3c2218]">Content Type</Label>
            <Select>
              <SelectTrigger className="bg-white/50">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="recipes">Recipes</SelectItem>
                <SelectItem value="stories">Stories</SelectItem>
                <SelectItem value="confessions">Confessions</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label className="text-[#3c2218]">Region</Label>
            <Input 
              type="text"
              placeholder="Enter region..."
              className="bg-white/50"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[#3c2218]">Emotion</Label>
            <Select>
              <SelectTrigger className="bg-white/50">
                <SelectValue placeholder="Select emotion" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Emotions</SelectItem>
                <SelectItem value="comfort">Comfort</SelectItem>
                <SelectItem value="nostalgia">Nostalgia</SelectItem>
                <SelectItem value="joy">Joy</SelectItem>
                <SelectItem value="celebration">Celebration</SelectItem>
                <SelectItem value="adventure">Adventure</SelectItem>
                <SelectItem value="homesickness">Homesickness</SelectItem>
                <SelectItem value="love">Love</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-[#3c2218]">Sort By</Label>
            <Select>
              <SelectTrigger className="bg-white/50">
                <SelectValue placeholder="Select sorting" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button className="bg-[#e63946] hover:bg-[#e63946]/90 text-white">
            Apply Filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

