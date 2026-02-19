"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  IconSpeakerphone,
  IconPlus,
  IconPlayerPlay,
  IconPlayerPause,
  IconBrandInstagram,
  IconBrandTiktok,
  IconBrandLinkedin,
  IconTarget,
  IconCurrencyDollar,
  IconEye,
  IconClick,
  IconArrowUpRight,
} from "@tabler/icons-react"
import { cn } from "@/lib/utils"

// --- Data ---

function fmtNum(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M"
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K"
  return n.toString()
}

type Campaign = {
  id: string
  name: string
  platform: string
  status: "active" | "paused" | "completed" | "draft"
  objective: string
  budget: number
  spent: number
  impressions: number
  clicks: number
  ctr: number
  startDate: string
  endDate: string
}

const CAMPAIGNS: Campaign[] = [
  {
    id: "c1",
    name: "Brand Awareness Q1",
    platform: "instagram",
    status: "active",
    objective: "Brand Awareness",
    budget: 2500,
    spent: 1847,
    impressions: 185_000,
    clicks: 3_420,
    ctr: 1.85,
    startDate: "Feb 1",
    endDate: "Mar 31",
  },
  {
    id: "c2",
    name: "Coffee Lovers Engagement",
    platform: "tiktok",
    status: "active",
    objective: "Engagement",
    budget: 1500,
    spent: 892,
    impressions: 124_000,
    clicks: 5_890,
    ctr: 4.75,
    startDate: "Feb 10",
    endDate: "Mar 15",
  },
  {
    id: "c3",
    name: "Website Traffic — AI Features",
    platform: "linkedin",
    status: "paused",
    objective: "Traffic",
    budget: 800,
    spent: 432,
    impressions: 42_000,
    clicks: 890,
    ctr: 2.12,
    startDate: "Jan 15",
    endDate: "Feb 28",
  },
  {
    id: "c4",
    name: "App Install Campaign",
    platform: "instagram",
    status: "draft",
    objective: "Conversions",
    budget: 3000,
    spent: 0,
    impressions: 0,
    clicks: 0,
    ctr: 0,
    startDate: "Mar 1",
    endDate: "Apr 30",
  },
]

const PLATFORM_META: Record<string, { icon: typeof IconBrandInstagram; color: string; label: string }> = {
  instagram: { icon: IconBrandInstagram, color: "text-pink-500", label: "Instagram" },
  tiktok: { icon: IconBrandTiktok, color: "text-foreground", label: "TikTok" },
  linkedin: { icon: IconBrandLinkedin, color: "text-blue-600", label: "LinkedIn" },
}

const STATUS_STYLES: Record<string, { label: string; color: string }> = {
  active: { label: "Active", color: "bg-emerald-500/10 text-emerald-600" },
  paused: { label: "Paused", color: "bg-amber-500/10 text-amber-600" },
  completed: { label: "Completed", color: "bg-slate-500/10 text-slate-600" },
  draft: { label: "Draft", color: "bg-blue-500/10 text-blue-600" },
}

// --- Summary Stats ---

const totalBudget = CAMPAIGNS.reduce((sum, c) => sum + c.budget, 0)
const totalSpent = CAMPAIGNS.reduce((sum, c) => sum + c.spent, 0)
const totalImpressions = CAMPAIGNS.reduce((sum, c) => sum + c.impressions, 0)
const totalClicks = CAMPAIGNS.reduce((sum, c) => sum + c.clicks, 0)
const activeCampaigns = CAMPAIGNS.filter((c) => c.status === "active").length

// --- Components ---

function CampaignCard({ campaign }: { campaign: Campaign }) {
  const pmeta = PLATFORM_META[campaign.platform] ?? PLATFORM_META.instagram
  const smeta = STATUS_STYLES[campaign.status]
  const PlatformIcon = pmeta.icon
  const budgetPct = campaign.budget > 0 ? (campaign.spent / campaign.budget) * 100 : 0

  return (
    <div className="rounded-xl border bg-card p-5 transition-colors hover:bg-accent/20">
      {/* Top Row */}
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
            <PlatformIcon className={cn("size-5", pmeta.color)} />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              {campaign.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {campaign.objective} · {campaign.startDate} – {campaign.endDate}
            </p>
          </div>
        </div>
        <Badge variant="secondary" className={cn("text-[10px]", smeta.color)}>
          {smeta.label}
        </Badge>
      </div>

      {/* Budget Bar */}
      <div className="mb-3">
        <div className="mb-1 flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Budget</span>
          <span className="font-medium text-foreground">
            ${campaign.spent.toLocaleString()} / ${campaign.budget.toLocaleString()}
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={cn(
              "h-full rounded-full transition-all",
              budgetPct > 80 ? "bg-amber-500" : "bg-primary"
            )}
            style={{ width: `${Math.min(budgetPct, 100)}%` }}
          />
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-3">
        <div>
          <p className="text-xs text-muted-foreground">Impressions</p>
          <p className="text-sm font-semibold text-foreground">
            {fmtNum(campaign.impressions)}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Clicks</p>
          <p className="text-sm font-semibold text-foreground">
            {fmtNum(campaign.clicks)}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">CTR</p>
          <p className="text-sm font-semibold text-foreground">
            {campaign.ctr > 0 ? `${campaign.ctr}%` : "—"}
          </p>
        </div>
      </div>

      {/* Actions */}
      {campaign.status !== "draft" && campaign.status !== "completed" && (
        <div className="mt-3 flex gap-2 border-t pt-3">
          {campaign.status === "active" ? (
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <IconPlayerPause className="size-3" />
              Pause
            </Button>
          ) : (
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <IconPlayerPlay className="size-3" />
              Resume
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

// --- Main ---

export function AdvertisingView({ brandId }: { brandId: string }) {
  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-3">
          <IconSpeakerphone className="size-5 text-primary" />
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              Advertising
            </h2>
            <p className="text-xs text-muted-foreground">
              {activeCampaigns} active campaign{activeCampaigns !== 1 && "s"}
            </p>
          </div>
        </div>
        <Button size="sm" className="gap-1.5">
          <IconPlus className="size-3.5" />
          Create Campaign
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Summary */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <div className="rounded-xl border bg-card p-4">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <IconCurrencyDollar className="size-3.5" />
                Total Budget
              </div>
              <p className="mt-1 text-xl font-bold text-foreground">
                ${totalBudget.toLocaleString()}
              </p>
              <p className="text-[10px] text-muted-foreground">
                ${totalSpent.toLocaleString()} spent
              </p>
            </div>
            <div className="rounded-xl border bg-card p-4">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <IconEye className="size-3.5" />
                Impressions
              </div>
              <p className="mt-1 text-xl font-bold text-foreground">
                {fmtNum(totalImpressions)}
              </p>
              <p className="flex items-center gap-0.5 text-[10px] font-medium text-emerald-600">
                <IconArrowUpRight className="size-2.5" />
                +24.5%
              </p>
            </div>
            <div className="rounded-xl border bg-card p-4">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <IconClick className="size-3.5" />
                Total Clicks
              </div>
              <p className="mt-1 text-xl font-bold text-foreground">
                {fmtNum(totalClicks)}
              </p>
              <p className="flex items-center gap-0.5 text-[10px] font-medium text-emerald-600">
                <IconArrowUpRight className="size-2.5" />
                +18.2%
              </p>
            </div>
            <div className="rounded-xl border bg-card p-4">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <IconTarget className="size-3.5" />
                Avg. CPC
              </div>
              <p className="mt-1 text-xl font-bold text-foreground">
                ${(totalSpent / (totalClicks || 1)).toFixed(2)}
              </p>
              <p className="text-[10px] text-muted-foreground">
                across all campaigns
              </p>
            </div>
          </div>

          {/* Campaign List */}
          <div>
            <h3 className="mb-3 text-xs font-semibold text-foreground">
              Campaigns
            </h3>
            <div className="grid gap-4 lg:grid-cols-2">
              {CAMPAIGNS.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
