import { RefreshCcw, Inbox } from "lucide-react"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Interest } from "@/types/interest"

interface InterestCardProps {
  interest: Interest
  onLike?: () => void
  onRefresh?: () => void
}

export default function InterestCard({
  interest,
  onLike = () => {},
  onRefresh = () => {},
}: InterestCardProps) {
  return (
    <Card className="flex items-center justify-between p-4 hover:shadow-md transition-shadow">
      <CardHeader className="p-0">
        <CardTitle className="text-lg font-semibold">{interest.name}</CardTitle>
      </CardHeader>

      <div className="flex gap-2">
        <Button variant="ghost" size="icon" onClick={onLike} aria-label="Like and send to inbox">
          <Inbox className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onRefresh} aria-label="Refresh articles">
          <RefreshCcw className="h-5 w-5" />
        </Button>
      </div>
    </Card>
  )
}
