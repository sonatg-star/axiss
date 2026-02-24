import { create } from "zustand"
import { persist } from "zustand/middleware"
import { useBrandStore } from "./brand-store"

export type ChatMode = "full-auto" | "manual"

export type MessageOption = {
  id: string
  label: string
}

export type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: number
  options?: MessageOption[]
}

export type ChatSession = {
  mode: ChatMode | null
  messages: Message[]
  strategyReady: boolean
  isTyping: boolean
}

type ChatStore = {
  sessions: Record<string, ChatSession>
  getSession: (brandId: string) => ChatSession
  setMode: (brandId: string, mode: ChatMode) => void
  sendMessage: (brandId: string, content: string) => void
  selectOption: (brandId: string, option: MessageOption) => void
}

export const defaultSession: ChatSession = {
  mode: null,
  messages: [],
  strategyReady: false,
  isTyping: false,
}

function createMessage(
  role: "user" | "assistant",
  content: string,
  options?: MessageOption[]
): Message {
  return {
    id: crypto.randomUUID(),
    role,
    content,
    timestamp: Date.now(),
    options,
  }
}

// Pre-seed Coff AI chat session (pilot brand)
const SEED_COFF_AI_SESSION: ChatSession = {
  mode: "full-auto",
  messages: [
    createMessage(
      "assistant",
      `I'll create a complete social media strategy for **Coff AI**. Tell me about your brand — what does it do, who is it for, and what makes it special?`
    ),
    createMessage(
      "user",
      "Coff AI is an AI-powered short video and image generation platform. Users can create video and visual content with AI using text prompts or images. We target content creators, social media managers, and small businesses who need high-quality visuals fast. Main competitors are Runway, Pika, and Canva's AI tools."
    ),
    createMessage(
      "assistant",
      `Thanks for sharing! I'm now analyzing Coff AI's brand positioning, target market, and competitive landscape.\n\nThis will take a moment while I research the best strategy for you...`
    ),
    createMessage(
      "assistant",
      `I've completed my analysis. Here's what I'm building into your strategy:\n\n- **Brand Positioning** tailored to your unique value proposition\n- **Target Audience Profiles** based on your description\n- **Platform Strategy** optimized for maximum reach\n- **Content Pillars** that align with your brand story\n- **Posting Schedule** based on audience behavior data\n\nLet me finalize the details...`
    ),
    createMessage(
      "assistant",
      `Your social media strategy is ready! I've created a comprehensive plan covering all 10 key areas.\n\nClick the **"View Strategy"** button below to review your complete strategy document. You can edit any section and regenerate parts you'd like to refine.`
    ),
  ],
  strategyReady: true,
  isTyping: false,
}

// --- Helper: Stream AI response ---

async function streamAIResponse(
  brandId: string,
  session: ChatSession,
  set: (fn: (state: { sessions: Record<string, ChatSession> }) => { sessions: Record<string, ChatSession> }) => void,
  get: () => { sessions: Record<string, ChatSession> }
) {
  const brands = useBrandStore.getState().brands
  const brand = brands.find((b) => b.id === brandId)
  const brandName = brand?.name ?? "your brand"
  const brandDescription = brand?.description ?? ""

  // Build messages for API
  const currentSession = get().sessions[brandId]
  if (!currentSession) return

  const apiMessages = currentSession.messages
    .filter((m) => m.role === "user" || m.role === "assistant")
    .map((m) => ({ role: m.role, content: m.content }))

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: apiMessages,
        brandName,
        brandDescription,
        mode: currentSession.mode,
      }),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const reader = response.body?.getReader()
    if (!reader) throw new Error("No reader available")

    const decoder = new TextDecoder()
    let fullContent = ""
    const assistantMsgId = crypto.randomUUID()

    // Add empty assistant message
    set((state) => {
      const s = state.sessions[brandId]
      if (!s) return state
      return {
        sessions: {
          ...state.sessions,
          [brandId]: {
            ...s,
            messages: [
              ...s.messages,
              {
                id: assistantMsgId,
                role: "assistant" as const,
                content: "",
                timestamp: Date.now(),
              },
            ],
          },
        },
      }
    })

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value, { stream: true })
      fullContent += chunk

      // Update the message content
      set((state) => {
        const s = state.sessions[brandId]
        if (!s) return state
        return {
          sessions: {
            ...state.sessions,
            [brandId]: {
              ...s,
              messages: s.messages.map((m) =>
                m.id === assistantMsgId
                  ? { ...m, content: fullContent }
                  : m
              ),
            },
          },
        }
      })
    }

    // Check if strategy is ready
    const isStrategyReady = fullContent.includes("strategy is ready")

    set((state) => {
      const s = state.sessions[brandId]
      if (!s) return state
      return {
        sessions: {
          ...state.sessions,
          [brandId]: {
            ...s,
            isTyping: false,
            strategyReady: s.strategyReady || isStrategyReady,
          },
        },
      }
    })
  } catch (error) {
    console.error("Chat API error:", error)
    // Fallback: add error message
    set((state) => {
      const s = state.sessions[brandId]
      if (!s) return state
      return {
        sessions: {
          ...state.sessions,
          [brandId]: {
            ...s,
            messages: [
              ...s.messages,
              createMessage(
                "assistant",
                "Sorry, I encountered an error connecting to the AI service. Please check your API key and try again."
              ),
            ],
            isTyping: false,
          },
        },
      }
    })
  }
}

// --- Store ---

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
  sessions: {
    "seed-coff-ai": SEED_COFF_AI_SESSION,
  },

  getSession: (brandId) => {
    return get().sessions[brandId] ?? defaultSession
  },

  setMode: (brandId, mode) => {
    const brands = useBrandStore.getState().brands
    const brand = brands.find((b) => b.id === brandId)
    const brandName = brand?.name ?? "your brand"

    const welcomeContent =
      mode === "full-auto"
        ? `I'll create a complete social media strategy for **${brandName}**. Tell me about your brand — what does it do, who is it for, and what makes it special?`
        : `Let's build ${brandName}'s strategy step by step. I'll ask you a series of questions to understand your brand better. Let's start — what industry or niche is ${brandName} in?`

    set((state) => ({
      sessions: {
        ...state.sessions,
        [brandId]: {
          mode,
          messages: [createMessage("assistant", welcomeContent)],
          strategyReady: false,
          isTyping: false,
        },
      },
    }))
  },

  sendMessage: (brandId, content) => {
    const session = get().getSession(brandId)
    if (!session.mode || session.isTyping) return

    const userMsg = createMessage("user", content)

    // Clear options from previous assistant message
    const updatedMessages = session.messages.map((m, i) =>
      i === session.messages.length - 1 && m.options
        ? { ...m, options: undefined }
        : m
    )

    set((state) => ({
      sessions: {
        ...state.sessions,
        [brandId]: {
          ...session,
          messages: [...updatedMessages, userMsg],
          isTyping: true,
        },
      },
    }))

    // Stream AI response
    streamAIResponse(brandId, session, set, get)
  },

  selectOption: (brandId, option) => {
    get().sendMessage(brandId, option.label)
  },
    }),
    {
      name: "axis-chat",
      partialize: (state) => ({
        sessions: Object.fromEntries(
          Object.entries(state.sessions).map(([k, v]) => [
            k,
            { ...v, isTyping: false },
          ])
        ),
      }),
    }
  )
)
