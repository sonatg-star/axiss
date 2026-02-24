import { anthropic } from "@ai-sdk/anthropic"
import { generateObject } from "ai"
import { z } from "zod"

const sectionSchema = z.object({
  "brand-summary": z.string().describe("Brand summary with mission, vision, and values. Use markdown formatting."),
  "market-overview": z.string().describe("Market overview with market size, key trends, and opportunity. Use markdown formatting with bold stats."),
  "competitor-analysis": z.string().describe("Competitor analysis with direct and indirect competitors, and brand's edge. Use markdown formatting."),
  "target-audience": z.string().describe("Target audience with 2-3 detailed personas including age, income, behavior, and pain points. Use markdown formatting."),
  "platform-strategy": z.string().describe("Platform strategy with 3-4 platforms, priority levels, content approach, and posting targets. Use emoji icons and markdown formatting."),
  "content-pillars": z.string().describe("5 content pillars with percentage allocations and descriptions. Use markdown formatting."),
  "tone-of-voice": z.string().describe("Tone of voice guidelines with attributes, do's and don'ts. Use markdown formatting."),
  "posting-schedule": z.string().describe("Weekly posting schedule as a markdown table with days and platforms, plus best posting times."),
  "format-mix": z.string().describe("Content format distribution with percentages and descriptions. Use emoji icons and markdown formatting."),
  "kpis": z.string().describe("KPIs organized into Growth, Engagement, Conversion, and Brand categories with specific monthly targets."),
})

export async function POST(req: Request) {
  try {
    const { brandName, brandDescription, chatHistory } = await req.json()

    const chatContext = chatHistory
      ? `\n\nChat conversation for context:\n${chatHistory}`
      : ""

    const result = await generateObject({
      model: anthropic("claude-sonnet-4-20250514"),
      schema: sectionSchema,
      prompt: `You are an expert social media strategist. Create a comprehensive social media strategy for the brand "${brandName}".

${brandDescription ? `Brand description: ${brandDescription}` : ""}
${chatContext}

Generate detailed, actionable content for all 10 strategy sections. Use markdown formatting with bold text, bullet points, and tables where appropriate. Make the content specific to this brand, not generic.`,
    })

    return Response.json(result.object)
  } catch (error) {
    console.error("Strategy API error:", error)
    return Response.json(
      { error: String(error) },
      { status: 500 }
    )
  }
}
