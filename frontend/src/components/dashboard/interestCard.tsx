import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { IInterest } from "@/types/interest"
import Image from "next/image"
import Link from "next/link"
import { X } from "lucide-react"

const API =
  (process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5001").replace(
    /\/users\/?$/i,
    "",
  )


export default function InterestCard({
  interest,
  userId,
  token,
  onDelete,
}: {
  interest: IInterest
  userId: string
  token: string
  onDelete?: (id: string) => void // callback to remove from list
}) {
  const handleDelete = async () => {
    const confirmed = window.confirm(`Are you sure you want to delete "${interest.name}"?`)
    if (!confirmed) return

    try {
      const res = await fetch(`${API}/users/${userId}/interests/${interest._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!res.ok) {
        const err = await res.text()
        throw new Error(`Failed to delete: ${err}`)
      }

      if (onDelete) onDelete(interest._id)
    } catch (err) {
      console.error("❌ Failed to delete interest:", err)
      alert("Error deleting interest")
    }
  }

  return (
    <Card className="w-full mb-6 relative">
      {/* Delete Button */}
      <button
        onClick={handleDelete}
        className="absolute top-3 right-3 text-muted-foreground hover:text-red-500"
        title="Delete Interest"
      >
        <X className="w-5 h-5" />
      </button>

      <CardHeader>
        <div>
          <CardTitle className="text-xl">{interest.name}</CardTitle>
          <p className="text-sm text-muted-foreground capitalize">{interest.type}</p>
          <p className="text-xs mt-1">{interest.update ? "✅ Updates enabled" : "🚫 Updates off"}</p>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {interest.articles.slice(0, 5).map((article) => (
            <Card key={article._id} className="bg-muted p-0 overflow-hidden">
              <Image
                src={article.image}
                alt={article.name}
                width={400}
                height={200}
                className="w-full h-32 object-cover"
              />
              <div className="p-3 space-y-1">
                <h4 className="text-sm font-semibold line-clamp-2">{article.name}</h4>
                <p className="text-xs text-muted-foreground line-clamp-2">{article.summary}</p>
                <div className="flex flex-wrap gap-1 pt-1">
                  {article.tags.map((tag, i) => (
                    <Badge key={i} variant="secondary" className="text-[10px]">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <Link
                  href={article.link}
                  target="_blank"
                  className="text-xs text-primary hover:underline inline-block mt-1"
                >
                  Read more
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
