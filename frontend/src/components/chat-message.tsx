import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { HelpCircle, User } from "lucide-react"

interface ChatMessageProps {
  role: "user" | "assistant"
  content: string
}

export function ChatMessage({ role, content }: ChatMessageProps) {
  return (
    <div className={`flex gap-3 items-start ${role === "assistant" ? "" : "flex-row-reverse"}`}>
      <Avatar className={role === "assistant" ? "bg-primary/10" : "bg-muted"}>
        <AvatarFallback>
          {role === "assistant" ? (
            <HelpCircle className="h-5 w-5 text-primary" />
          ) : (
            <User className="h-5 w-5 text-muted-foreground" />
          )}
        </AvatarFallback>
      </Avatar>
      <div className={`space-y-1 max-w-[80%] ${role === "assistant" ? "" : "text-right"}`}>
        <div className="text-xs text-muted-foreground">{role === "assistant" ? "Omnia" : "You"}</div>
        <div
          className={`text-sm rounded-2xl px-4 py-2 inline-block ${
            role === "assistant" ? "bg-muted text-foreground" : "bg-primary text-primary-foreground"
          }`}
        >
          {content}
        </div>
      </div>
    </div>
  )
}
