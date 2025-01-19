'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Search, Menu } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet" 

import { SearchFilters } from './SearchFilters'

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchType, setSearchType] = useState('all')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}&type=${searchType}`)
    }
  }

  return (
    <header className="bg-[#e8d5c4] border-b border-[#3c2218]/20 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <Link href="/" className="flex items-center gap-4">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Capture_d_%C3%A9cran_2025-01-16_000733-removebg-NXdWkhdRuSxugvKaHPHLO1cfwP3bDk.png"
              alt="If you love it, share it! Logo"
              width={50}
              height={50}
              className="h-12 w-auto"
            />
            <span className="text-2xl font-bold text-[#3c2218]">If you love it, share it!</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="ghost" className="text-[#3c2218] hover:text-[#e63946]">
                Login
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button className="bg-[#e63946] hover:bg-[#e63946]/90 text-white">
                Register
              </Button>
            </Link>
            <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="text-[#3c2218]">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle className="text-[#3c2218]">Menu</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col space-y-4 mt-4">
                  <Link href="/" className="text-[#3c2218] hover:text-[#e63946] transition-colors" onClick={() => setIsSidebarOpen(false)}>
                    Home
                  </Link>
                  <Link href="/recipes" className="text-[#3c2218] hover:text-[#e63946] transition-colors" onClick={() => setIsSidebarOpen(false)}>
                    Recipes
                  </Link>
                  <Link href="/stories" className="text-[#3c2218] hover:text-[#e63946] transition-colors" onClick={() => setIsSidebarOpen(false)}>
                    Stories
                  </Link>
                  <Link href="/confessions" className="text-[#3c2218] hover:text-[#e63946] transition-colors" onClick={() => setIsSidebarOpen(false)}>
                    Confessions
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <form onSubmit={handleSearch} className="flex gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
            <Input 
              placeholder="Search recipes, stories, confessions..." 
              className="pl-10 bg-white/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={searchType} onValueChange={setSearchType}>
            <SelectTrigger className="w-[180px] bg-white/50">
              <SelectValue placeholder="Filter by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="recipes">Recipes</SelectItem>
              <SelectItem value="stories">Stories</SelectItem>
              <SelectItem value="confessions">Confessions</SelectItem>
            </SelectContent>
          </Select>
          <Button type="submit" className="bg-[#e63946] hover:bg-[#e63946]/90 text-white">
            Search
          </Button>
        </form>
      </div>
    </header>
  )
}

export default Header

