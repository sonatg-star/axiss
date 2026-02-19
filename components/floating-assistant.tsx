"use client"

import { IconMessageChatbot } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function FloatingAssistant() {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button size="icon" className="size-12 rounded-full shadow-lg">
            <IconMessageChatbot className="size-6" />
            <span className="sr-only">AI Assistant</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">AI Assistant</TooltipContent>
      </Tooltip>
    </div>
  )
}
