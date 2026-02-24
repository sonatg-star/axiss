import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { TopNav } from "@/components/top-nav"
import { FloatingAssistant } from "@/components/floating-assistant"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex items-center gap-2">
          <div className="flex items-center px-2 py-2">
            <SidebarTrigger />
          </div>
          <TopNav />
        </header>
        <main className="flex-1 p-2 sm:p-4 md:p-6">
          {children}
        </main>
        <FloatingAssistant />
      </SidebarInset>
    </SidebarProvider>
  )
}
