"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useChatStore, defaultSession, type ChatMode } from "@/lib/stores/chat-store"
import { useBrandStore, type Brand } from "@/lib/stores/brand-store"
import { useStrategyStore } from "@/lib/stores/strategy-store"
import {
  IconRobot,
  IconSend2,
  IconBolt,
  IconAdjustments,
  IconMessageDots,
} from "@tabler/icons-react"

// --- Mode Selection Screen ---

function ModeSelection({
  brand,
  onSelect,
}: {
  brand: Brand
  onSelect: (mode: ChatMode) => void
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-8 px-4">
      <div className="text-center">
        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-xl bg-primary/10 text-xl font-bold text-primary">
          {brand.initials}
        </div>
        <h2 className="text-xl font-semibold text-foreground">
          Create Strategy for {brand.name}
        </h2>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          Choose how you'd like to build your social media strategy.
        </p>
      </div>

      <div className="grid w-full max-w-lg gap-4 sm:grid-cols-2">
        <button
          onClick={() => onSelect("full-auto")}
          className="group flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-6 text-center transition-all hover:border-primary/40 hover:bg-primary/5"
        >
          <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
            <IconBolt className="size-6" />
          </div>
          <div>
            <p className="font-medium text-foreground">Full Automation</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Describe your brand and AI creates the entire strategy
              automatically.
            </p>
          </div>
        </button>

        <button
          onClick={() => onSelect("manual")}
          className="group flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-6 text-center transition-all hover:border-primary/40 hover:bg-primary/5"
        >
          <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
            <IconAdjustments className="size-6" />
          </div>
          <div>
            <p className="font-medium text-foreground">Step by Step</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Answer guided questions to build a tailored strategy piece by
              piece.
            </p>
          </div>
        </button>
      </div>
    </div>
  )
}

// --- Typing Indicator ---

function TypingIndicator() {
  return (
    <div className="flex items-start gap-3">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted">
        <IconRobot className="size-4 text-muted-foreground" />
      </div>
      <div className="rounded-2xl rounded-tl-md bg-muted px-4 py-3">
        <div className="flex items-center gap-1">
          <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:0ms]" />
          <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:150ms]" />
          <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  )
}

// --- Message Bubble ---

function MessageBubble({ message }: { message: { role: string; content: string } }) {
  const isUser = message.role === "user"

  return (
    <div className={cn("flex items-start gap-3", isUser && "flex-row-reverse")}>
      {!isUser && (
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted">
          <IconRobot className="size-4 text-muted-foreground" />
        </div>
      )}
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
          isUser
            ? "rounded-tr-md bg-primary text-primary-foreground"
            : "rounded-tl-md bg-muted text-foreground"
        )}
      >
        {isUser ? (
          <p>{message.content}</p>
        ) : (
          <div
            className="prose-sm [&_strong]:font-semibold [&_li]:ml-4 [&_li]:list-disc [&_p]:mb-2 last:[&_p]:mb-0"
            dangerouslySetInnerHTML={{ __html: formatMarkdown(message.content) }}
          />
        )}
      </div>
    </div>
  )
}

function formatMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n- /g, "<br/>- ")
    .replace(/^- (.*)$/gm, "<li>$1</li>")
    .replace(/\n\n/g, "</p><p>")
    .replace(/\n/g, "<br/>")
    .replace(/^(.*)$/, "<p>$1</p>")
}

// --- Main Chat Component ---

export function StrategyChat({
  brandId,
}: {
  brandId: string
}) {
  const brands = useBrandStore((s) => s.brands)
  const brand = brands.find((b) => b.id === brandId)

  const session = useChatStore((s) => s.sessions[brandId]) ?? defaultSession
  const setMode = useChatStore((s) => s.setMode)
  const sendMessage = useChatStore((s) => s.sendMessage)
  const selectOption = useChatStore((s) => s.selectOption)

  const generateStrategy = useStrategyStore((s) => s.generateStrategy)
  const strategy = useStrategyStore((s) => s.strategies[brandId])

  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [session.messages, session.isTyping])

  // Focus input when mode is selected
  useEffect(() => {
    if (session.mode && !session.isTyping) {
      inputRef.current?.focus()
    }
  }, [session.mode, session.isTyping])

  if (!brand) return null

  // Mode not yet selected
  if (!session.mode) {
    return (
      <ModeSelection
        brand={brand}
        onSelect={(mode) => setMode(brandId, mode)}
      />
    )
  }

  const handleSend = () => {
    const trimmed = input.trim()
    if (!trimmed || session.isTyping) return
    sendMessage(brandId, trimmed)
    setInput("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleGenerateStrategy = () => {
    generateStrategy(brandId, brand.name)
  }

  // Get options from last assistant message
  const lastMessage = session.messages[session.messages.length - 1]
  const options =
    lastMessage?.role === "assistant" ? lastMessage.options : undefined

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 border-b px-4 py-3">
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
          {brand.initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-foreground">{brand.name}</p>
          <p className="text-xs text-muted-foreground">
            {session.mode === "full-auto" ? "Full Automation" : "Step by Step"}{" "}
            Mode
          </p>
        </div>
        {session.strategyReady && (
          <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            Strategy Ready
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-2 py-3 sm:px-4 sm:py-4">
        <div className="mx-auto flex flex-col gap-4 sm:max-w-2xl">
          {session.messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}

          {session.isTyping && <TypingIndicator />}

          {/* Selectable options */}
          {options && !session.isTyping && (
            <div className="flex flex-wrap gap-2 pl-11">
              {options.map((opt) => (
                <Button
                  key={opt.id}
                  variant="outline"
                  size="sm"
                  onClick={() => selectOption(brandId, opt)}
                  className="rounded-full"
                >
                  {opt.label}
                </Button>
              ))}
            </div>
          )}

          {/* Generate Strategy button — only if strategy not yet created */}
          {session.strategyReady && !session.isTyping && !strategy && (
            <div className="flex justify-center pt-2">
              <Button size="lg" className="gap-2" onClick={handleGenerateStrategy}>
                <IconMessageDots className="size-4" />
                Generate Strategy
              </Button>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t px-2 py-2 sm:px-4 sm:py-3">
        <div className="mx-auto flex items-end gap-2 sm:max-w-2xl">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              strategy
                ? "Ask follow-up questions about your strategy..."
                : session.mode === "full-auto"
                  ? "Describe your brand..."
                  : "Type your answer or pick an option above..."
            }
            rows={1}
            disabled={session.isTyping}
            className="max-h-32 min-h-[40px] flex-1 resize-none rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring disabled:opacity-50"
          />
          <Button
            size="icon"
            onClick={handleSend}
            disabled={!input.trim() || session.isTyping}
          >
            <IconSend2 className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
