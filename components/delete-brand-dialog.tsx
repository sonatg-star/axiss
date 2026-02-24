"use client"

import { useBrandStore, type Brand } from "@/lib/stores/brand-store"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

type Props = {
  brand: Brand
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteBrandDialog({ brand, open, onOpenChange }: Props) {
  const deleteBrand = useBrandStore((s) => s.deleteBrand)

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete &quot;{brand.name}&quot;?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete this brand and all its data. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={() => deleteBrand(brand.id)}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
