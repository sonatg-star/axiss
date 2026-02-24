import { anthropic } from "@ai-sdk/anthropic"
import { generateObject } from "ai"
import { z } from "zod"

const contentCardSchema = z.object({
  cards: z.array(
    z.object({
      date: z.string().describe("ISO date string YYYY-MM-DD"),
      time: z.string().describe("Posting time HH:mm"),
      format: z.enum(["reel", "carousel", "single-post", "story"]),
      platform: z.enum(["instagram", "facebook", "tiktok", "linkedin", "pinterest", "x"]),
      theme: z.string().describe("Content theme/pillar slug from strategy"),
      title: z.string().describe("Short, catchy content title"),
    })
  ),
})

const fieldSchema = z.object({
  content: z.string().describe("The generated content for this field"),
})

export async function POST(req: Request) {
  const { action, brandName, brandDescription, strategy, startDate, endDate, postsPerDay, daysPerWeek, card, field, themes, themeLabels } = await req.json()

  if (action === "generate-calendar") {
    const result = await generateObject({
      model: anthropic("claude-sonnet-4-20250514"),
      schema: contentCardSchema,
      prompt: `You are a social media content planner for "${brandName}".
${brandDescription ? `Brand description: ${brandDescription}` : ""}
${strategy ? `Brand strategy context: ${strategy}` : ""}

Generate a content calendar from ${startDate} to ${endDate}.
- Schedule ${postsPerDay} posts per weekday${daysPerWeek < 7 ? `, ${daysPerWeek === 6 ? "1 post on Saturday, none on Sunday" : "no weekend posts"}` : " and 1-2 posts on weekends"}.
- Distribute posts across different platforms and formats.
- Use ONLY these content theme slugs for the theme field: ${themes?.join(", ") || "general"}.
${themeLabels ? `- Theme labels for context: ${themeLabels.join(", ")}.` : ""}
- Vary posting times between 08:00 and 20:00.
- Create catchy, specific titles for each post.

Make the content calendar varied, strategic, and aligned with the brand.`,
    })

    return Response.json(result.object)
  }

  if (action === "generate-field") {
    const fieldPrompts: Record<string, string> = {
      hook: `Write a compelling hook/opening line for this social media post. It should grab attention immediately and make people stop scrolling. 1-2 sentences max. Can include emoji.`,
      narrative: `Write the story/narrative structure for this social media post. Describe the content flow: what to show, in what order, and how to build engagement. 2-3 paragraphs.`,
      productionGuide: `Write a production guide for creating this content. Include bullet points about: filming setup, lighting, camera angles, editing style, music suggestions, and any special effects needed.`,
      prompts: `Write an AI/creative prompt that could be used to generate or guide the creation of this content. Include target audience context, key messages, and style directions.`,
      caption: `Write a complete social media caption for this post. Include: engaging text (2-3 paragraphs), a call-to-action, and 5-10 relevant hashtags. Match the platform's style.`,
    }

    const result = await generateObject({
      model: anthropic("claude-sonnet-4-20250514"),
      schema: fieldSchema,
      prompt: `You are a social media content writer for "${brandName}".
${brandDescription ? `Brand description: ${brandDescription}` : ""}

Content card context:
- Title: ${card.title}
- Theme: ${card.theme}
- Format: ${card.format}
- Platform: ${card.platform}
- Date: ${card.date}

${fieldPrompts[field] || `Generate content for the "${field}" field of this social media post.`}`,
    })

    return Response.json(result.object)
  }

  return Response.json({ error: "Unknown action" }, { status: 400 })
}
