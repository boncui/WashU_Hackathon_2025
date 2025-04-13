import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { IInterest } from "@/types/interest"
import Image from "next/image"
import Link from "next/link"

export default function InterestCard({ interest }: { interest: IInterest }) {
  return (
    <Card className="w-full mb-6">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl">{interest.name}</CardTitle>
            <p className="text-sm text-muted-foreground capitalize">{interest.type}</p>
            <p className="text-xs mt-1">{interest.update ? "✅ Updates enabled" : "🚫 Updates off"}</p>
          </div>
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
