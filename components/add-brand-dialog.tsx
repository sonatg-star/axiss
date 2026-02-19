"use client"

import { useState } from "react"
import { useBrandStore } from "@/lib/stores/brand-store"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { IconPlus } from "@tabler/icons-react"

export function AddBrandDialog({ children }: { children?: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [websiteUrl, setWebsiteUrl] = useState("")
  const addBrand = useBrandStore((s) => s.addBrand)

  function handleCreate() {
    if (!name.trim()) return
    addBrand({ name: name.trim(), description: description.trim(), websiteUrl: websiteUrl.trim() })
    setName("")
    setDescription("")
    setWebsiteUrl("")
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children ?? (
          <Button variant="ghost" className="w-full justify-start gap-2">
            <IconPlus className="size-4" />
            <span>Add Brand</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Brand</DialogTitle>
          <DialogDescription>Add a new brand to manage its social media strategy.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="brand-name">Brand Name *</Label>
            <Input
              id="brand-name"
              placeholder="e.g. Coff AI"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              autoFocus
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="brand-description">Description</Label>
            <Textarea
              id="brand-description"
              placeholder="Brief description of the brand..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="brand-url">Website URL</Label>
            <Input
              id="brand-url"
              placeholder="https://example.com"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleCreate} disabled={!name.trim()}>
            Create Brand
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
