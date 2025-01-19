// import Image from "next/image";

// export default function Home() {
//   return (
//     <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
//       <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
//         <Image
//           className="dark:invert"
//           src="/next.svg"
//           alt="Next.js logo"
//           width={180}
//           height={38}
//           priority
//         />
//         <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
//           <li className="mb-2">
//             Get started by editing{" "}
//             <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">
//               app/page.tsx
//             </code>
//             .
//           </li>
//           <li>Save and see your changes instantly.</li>
//         </ol>

//         <div className="flex gap-4 items-center flex-col sm:flex-row">
//           <a
//             className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
//             href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <Image
//               className="dark:invert"
//               src="/vercel.svg"
//               alt="Vercel logomark"
//               width={20}
//               height={20}
//             />
//             Deploy now
//           </a>
//           <a
//             className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
//             href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             Read our docs
//           </a>
//         </div>
//       </main>
//       <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
//         <a
//           className="flex items-center gap-2 hover:underline hover:underline-offset-4"
//           href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <Image
//             aria-hidden
//             src="/file.svg"
//             alt="File icon"
//             width={16}
//             height={16}
//           />
//           Learn
//         </a>
//         <a
//           className="flex items-center gap-2 hover:underline hover:underline-offset-4"
//           href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <Image
//             aria-hidden
//             src="/window.svg"
//             alt="Window icon"
//             width={16}
//             height={16}
//           />
//           Examples
//         </a>
//         <a
//           className="flex items-center gap-2 hover:underline hover:underline-offset-4"
//           href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <Image
//             aria-hidden
//             src="/globe.svg"
//             alt="Globe icon"
//             width={16}
//             height={16}
//           />
//           Go to nextjs.org →
//         </a>
//       </footer>
//     </div>
//   );
// }
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SearchFilters } from './components/SearchFilters'

export default function Home() {
  return (
    <div className="space-y-12">
      <div className="text-center space-y-6">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Capture_d_%C3%A9cran_2025-01-16_000733-removebg-NXdWkhdRuSxugvKaHPHLO1cfwP3bDk.png"
          alt="If you love it, share it! Logo"
          width={250}
          height={250}
          className="mx-auto"
        />
        <div className="space-y-4">
          <h1 className="text-5xl font-bold text-[#3c2218] font-serif">
            Welcome to If you love it, share it!
          </h1>
          <p className="text-2xl italic text-[#3c2218]/90 font-serif">
            One story at a time from Tunisia
          </p>
          <p className="text-lg text-[#3c2218]/80 max-w-3xl mx-auto leading-relaxed">
            Your ultimate gateway to authentic Tunisian flavors, blending traditional recipes, 
            heartfelt stories and a sprinkle of emotion to create a truly unique culinary experience
          </p>
        </div>
        <div className="flex justify-center">
          <SearchFilters />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white/50 backdrop-blur-sm border-[#3c2218]/10">
          <CardContent className="p-6 flex flex-col items-center space-y-4">
            <h2 className="text-2xl font-semibold text-[#e63946]">Recipes</h2>
            <p className="text-center text-[#3c2218]/80">Explore a variety of delicious Tunisian recipes</p>
            <Link href="/recipes">
              <Button className="bg-[#e63946] hover:bg-[#e63946]/90 text-white">Browse Recipes</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-white/50 backdrop-blur-sm border-[#3c2218]/10">
          <CardContent className="p-6 flex flex-col items-center space-y-4">
            <h2 className="text-2xl font-semibold text-[#e63946]">Stories</h2>
            <p className="text-center text-[#3c2218]/80">Read personal stories behind cherished recipes</p>
            <Link href="/stories">
              <Button className="bg-[#e63946] hover:bg-[#e63946]/90 text-white">Read Stories</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-white/50 backdrop-blur-sm border-[#3c2218]/10">
          <CardContent className="p-6 flex flex-col items-center space-y-4">
            <h2 className="text-2xl font-semibold text-[#e63946]">Confessions</h2>
            <p className="text-center text-[#3c2218]/80">Share your culinary secrets and mishaps</p>
            <Link href="/confessions">
              <Button className="bg-[#e63946] hover:bg-[#e63946]/90 text-white">View Confessions</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

