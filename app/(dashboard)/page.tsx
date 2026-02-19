"use client"

import { useState } from "react"
import { useBrandStore } from "@/lib/stores/brand-store"
import { useStrategyStore } from "@/lib/stores/strategy-store"
import { useNavigationStore } from "@/lib/stores/navigation-store"
import { StrategyChat } from "@/components/strategy-chat"
import { StrategyDocument } from "@/components/strategy-document"
import { ContentCalendar } from "@/components/content-calendar"
import { ProductionView } from "@/components/production-view"
import { PublishView } from "@/components/publish-view"
import { AnalyticsDashboard } from "@/components/analytics-dashboard"
import { AdvertisingView } from "@/components/advertising-view"
import { AdPerformanceView } from "@/components/ad-performance-view"

function StrategyView({ brandId }: { brandId: string }) {
  const [showDocument, setShowDocument] = useState(
    () => !!useStrategyStore.getState().strategies[brandId]
  )

  if (showDocument) {
    return (
      <StrategyDocument
        brandId={brandId}
        onBackToChat={() => setShowDocument(false)}
      />
    )
  }

  return (
    <StrategyChat
      brandId={brandId}
      onViewStrategy={() => setShowDocument(true)}
    />
  )
}

export default function DashboardPage() {
  const activeBrandId = useBrandStore((s) => s.activeBrandId)
  const activeTab = useNavigationStore((s) => s.activeTab)

  if (!activeBrandId) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-foreground">
            Welcome to AXIS
          </h1>
          <p className="mt-2 text-muted-foreground">
            Select a brand from the sidebar to get started.
          </p>
        </div>
      </div>
    )
  }

  switch (activeTab) {
    case "strategy":
      return <StrategyView key={activeBrandId} brandId={activeBrandId} />
    case "calendar":
      return <ContentCalendar key={activeBrandId} brandId={activeBrandId} />
    case "production":
      return <ProductionView key={activeBrandId} brandId={activeBrandId} />
    case "publish":
      return <PublishView key={activeBrandId} brandId={activeBrandId} />
    case "analytics":
      return <AnalyticsDashboard key={activeBrandId} brandId={activeBrandId} />
    case "advertising":
      return <AdvertisingView key={activeBrandId} brandId={activeBrandId} />
    case "ad-performance":
      return <AdPerformanceView key={activeBrandId} brandId={activeBrandId} />
    default:
      return null
  }
}
