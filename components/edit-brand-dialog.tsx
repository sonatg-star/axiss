"use client"

import { useState } from "react"
import { useBrandStore, type Brand } from "@/lib/stores/brand-store"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

function EditBrandForm({
  brand,
  onDone,
}: {
  brand: Brand
  onDone: () => void
}) {
  const [name, setName] = useState(brand.name)
  const [description, setDescription] = useState(brand.description)
  const [websiteUrl, setWebsiteUrl] = useState(brand.websiteUrl)

  function handleSave() {
    if (!name.trim()) return
    const trimmedName = name.trim()
    const trimmedDesc = description.trim()
    const trimmedUrl = websiteUrl.trim()

    // Debug: show in tab title what we're saving
    document.title = `SAVED: ${trimmedName} | ${trimmedDesc.slice(0, 30)}`

    useBrandStore.getState().updateBrand(brand.id, {
      name: trimmedName,
      description: trimmedDesc,
      websiteUrl: trimmedUrl,
    })
    setTimeout(onDone, 50)
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Edit Brand</DialogTitle>
        <DialogDescription>Update your brand details.</DialogDescription>
      </DialogHeader>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="edit-brand-name">Brand Name *</Label>
          <Input
            id="edit-brand-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="edit-brand-description">Description</Label>
          <Textarea
            id="edit-brand-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="edit-brand-url">Website URL</Label>
          <Input
            id="edit-brand-url"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
          />
        </div>
      </div>
      <DialogFooter>
        <button
          type="button"
          onClick={handleSave}
          disabled={!name.trim()}
          className="inline-flex h-9 items-center justify-center rounded-full bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/80 disabled:opacity-50"
        >
          Save Changes
        </button>
      </DialogFooter>
    </>
  )
}

type Props = {
  brand: Brand
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditBrandDialog({ brand, open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        {open && (
          <EditBrandForm brand={brand} onDone={() => onOpenChange(false)} />
        )}
      </DialogContent>
    </Dialog>
  )
}
