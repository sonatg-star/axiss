"use client"

import { useState } from "react"
import {
  IconDotsVertical,
  IconPencil,
  IconTrash,
  IconAxisX,
} from "@tabler/icons-react"
import { useBrandStore } from "@/lib/stores/brand-store"
import { AddBrandDialog } from "@/components/add-brand-dialog"
import { EditBrandDialog } from "@/components/edit-brand-dialog"
import { DeleteBrandDialog } from "@/components/delete-brand-dialog"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Brand } from "@/lib/stores/brand-store"

function BrandAvatar({ initials }: { initials: string }) {
  return (
    <div className="bg-primary/10 text-primary flex size-7 shrink-0 items-center justify-center rounded-md text-xs font-semibold">
      {initials}
    </div>
  )
}

function BrandItem({ brand }: { brand: Brand }) {
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const { activeBrandId, setActiveBrand } = useBrandStore()

  return (
    <>
      <SidebarMenuItem>
        <SidebarMenuButton
          isActive={activeBrandId === brand.id}
          onClick={() => setActiveBrand(brand.id)}
          tooltip={brand.name}
        >
          <BrandAvatar initials={brand.initials} />
          <span>{brand.name}</span>
        </SidebarMenuButton>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <SidebarMenuAction showOnHover>
              <IconDotsVertical className="size-4" />
            </SidebarMenuAction>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="start">
            <DropdownMenuItem onSelect={() => setEditOpen(true)}>
              <IconPencil className="size-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onSelect={() => setDeleteOpen(true)}
            >
              <IconTrash className="size-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>

      <EditBrandDialog brand={brand} open={editOpen} onOpenChange={setEditOpen} />
      <DeleteBrandDialog brand={brand} open={deleteOpen} onOpenChange={setDeleteOpen} />
    </>
  )
}

export function AppSidebar() {
  const brands = useBrandStore((s) => s.brands)

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" tooltip="AXIS">
              <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md">
                <IconAxisX className="size-5" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-semibold tracking-tight">AXIS</span>
                <span className="text-xs text-muted-foreground">Content Platform</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Brands</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {brands.length === 0 ? (
                <SidebarMenuItem>
                  <div className="px-2 py-6 text-center text-xs text-muted-foreground">
                    No brands yet.
                    <br />
                    Create your first brand.
                  </div>
                </SidebarMenuItem>
              ) : (
                brands.map((brand) => (
                  <BrandItem key={brand.id} brand={brand} />
                ))
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <AddBrandDialog />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
