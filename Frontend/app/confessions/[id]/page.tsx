import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ConfessionDetailPage({ params }: { params: { id: string } }) {
  // This would come from your API
  const confession = {
    id: params.id,
    admission: "I once burned the brik so badly, I had to order takeout and pretend I made it... The worst part? Everyone loved it and asked for the recipe! I had to make up some secret family technique on the spot. Now whenever someone mentions that 'amazing brik' I made, I just smile and nod.",
    timestamp: "2024-01-16",
    status: "approved"
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <Link href="/confessions">
        <Button variant="ghost" className="text-[#3c2218]">
          ← Back to Confessions
        </Button>
      </Link>

      <Card className="bg-white/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-sm text-[#3c2218]/60">
            Shared on {new Date(confession.timestamp).toLocaleDateString()}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-[#3c2218] text-xl italic leading-relaxed">
            &quot;{confession.admission}&quot;
          </p>
        </CardContent>
      </Card>

      <div className="bg-[#3c2218]/5 p-6 rounded-lg">
        <h2 className="text-lg font-semibold text-[#3c2218] mb-4">Share your own confession</h2>
        <p className="text-[#3c2218]/80 mb-4">
          Got a culinary secret to share? Your confession will be anonymous and reviewed before being published.
        </p>
        <Link href="/confessions/new">
          <Button className="bg-[#e63946] hover:bg-[#e63946]/90 text-white">
            Share Your Confession
          </Button>
        </Link>
      </div>
    </div>
  )
}

