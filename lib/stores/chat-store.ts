import { create } from "zustand"
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

// --- Mock response data ---

const FULL_AUTO_RESPONSES: ((brandName: string) => string)[] = [
  (name) =>
    `Thanks for sharing! I'm now analyzing ${name}'s brand positioning, target market, and competitive landscape.\n\nThis will take a moment while I research the best strategy for you...`,
  () =>
    `I've completed my analysis. Here's what I'm building into your strategy:\n\n` +
    `- **Brand Positioning** tailored to your unique value proposition\n` +
    `- **Target Audience Profiles** based on your description\n` +
    `- **Platform Strategy** optimized for maximum reach\n` +
    `- **Content Pillars** that align with your brand story\n` +
    `- **Posting Schedule** based on audience behavior data\n\n` +
    `Let me finalize the details...`,
  () =>
    `Your social media strategy is ready! I've created a comprehensive plan covering all 10 key areas.\n\n` +
    `Click the **"View Strategy"** button below to review your complete strategy document. You can edit any section and regenerate parts you'd like to refine.`,
]

const MANUAL_QUESTIONS: {
  question: (brandName: string) => string
  options: MessageOption[]
}[] = [
  {
    question: (name) =>
      `Let's build ${name}'s strategy step by step. First — what industry are you in?`,
    options: [
      { id: "tech", label: "Technology" },
      { id: "fnb", label: "Food & Beverage" },
      { id: "fashion", label: "Fashion & Beauty" },
      { id: "health", label: "Health & Wellness" },
    ],
  },
  {
    question: () => `Who is your primary target audience?`,
    options: [
      { id: "genz", label: "Gen Z (18-25)" },
      { id: "millennials", label: "Millennials (25-40)" },
      { id: "professionals", label: "Working Professionals" },
      { id: "broad", label: "Broad / Everyone" },
    ],
  },
  {
    question: () => `Which platforms are most important for your brand?`,
    options: [
      { id: "instagram", label: "Instagram & TikTok" },
      { id: "linkedin", label: "LinkedIn & X" },
      { id: "all", label: "All Major Platforms" },
      { id: "unsure", label: "Not sure — recommend for me" },
    ],
  },
  {
    question: () => `What tone of voice fits your brand best?`,
    options: [
      { id: "professional", label: "Professional & Authoritative" },
      { id: "casual", label: "Casual & Friendly" },
      { id: "bold", label: "Bold & Energetic" },
      { id: "inspirational", label: "Warm & Inspirational" },
    ],
  },
  {
    question: () =>
      `Last one — what's your primary social media goal right now?`,
    options: [
      { id: "awareness", label: "Brand Awareness" },
      { id: "engagement", label: "Community & Engagement" },
      { id: "leads", label: "Leads & Sales" },
      { id: "authority", label: "Thought Leadership" },
    ],
  },
]

const MANUAL_FINAL_RESPONSE =
  `I've built your strategy based on your answers. Here's what's included:\n\n` +
  `- **Brand Summary** reflecting your identity\n` +
  `- **Target Audience** profiles matching your selection\n` +
  `- **Platform Strategy** optimized for your chosen channels\n` +
  `- **Content Pillars** aligned with your goals\n` +
  `- **Tone of Voice** guidelines\n` +
  `- **Posting Schedule & Format Mix**\n` +
  `- **KPIs** to track your progress\n\n` +
  `Click **"View Strategy"** to review your complete strategy document.`

// --- Store ---

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

function getManualQuestionIndex(messages: Message[]): number {
  return messages.filter((m) => m.role === "user").length
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

export const useChatStore = create<ChatStore>((set, get) => ({
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
        : MANUAL_QUESTIONS[0].question(brandName)

    const welcomeOptions =
      mode === "manual" ? MANUAL_QUESTIONS[0].options : undefined

    set((state) => ({
      sessions: {
        ...state.sessions,
        [brandId]: {
          mode,
          messages: [createMessage("assistant", welcomeContent, welcomeOptions)],
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

    // Mock delay
    const delay = 1000 + Math.random() * 1500

    setTimeout(() => {
      const currentSession = get().sessions[brandId]
      if (!currentSession) return

      const brands = useBrandStore.getState().brands
      const brand = brands.find((b) => b.id === brandId)
      const brandName = brand?.name ?? "your brand"

      if (currentSession.mode === "full-auto") {
        const userMsgCount = currentSession.messages.filter(
          (m) => m.role === "user"
        ).length
        const responseIdx = Math.min(
          userMsgCount - 1,
          FULL_AUTO_RESPONSES.length - 1
        )
        const responseText = FULL_AUTO_RESPONSES[responseIdx](brandName)
        const isLast = responseIdx === FULL_AUTO_RESPONSES.length - 1

        set((state) => ({
          sessions: {
            ...state.sessions,
            [brandId]: {
              ...currentSession,
              messages: [
                ...currentSession.messages,
                createMessage("assistant", responseText),
              ],
              isTyping: false,
              strategyReady: isLast,
            },
          },
        }))
      } else {
        // Manual mode
        const questionIdx = getManualQuestionIndex(currentSession.messages)

        if (questionIdx >= MANUAL_QUESTIONS.length) {
          // All questions answered
          set((state) => ({
            sessions: {
              ...state.sessions,
              [brandId]: {
                ...currentSession,
                messages: [
                  ...currentSession.messages,
                  createMessage("assistant", MANUAL_FINAL_RESPONSE),
                ],
                isTyping: false,
                strategyReady: true,
              },
            },
          }))
        } else {
          const next = MANUAL_QUESTIONS[questionIdx]
          set((state) => ({
            sessions: {
              ...state.sessions,
              [brandId]: {
                ...currentSession,
                messages: [
                  ...currentSession.messages,
                  createMessage(
                    "assistant",
                    next.question(brandName),
                    next.options
                  ),
                ],
                isTyping: false,
              },
            },
          }))
        }
      }
    }, delay)
  },

  selectOption: (brandId, option) => {
    get().sendMessage(brandId, option.label)
  },
}))
