import { create } from "zustand"
import { persist } from "zustand/middleware"

export type Brand = {
  id: string
  name: string
  description: string
  websiteUrl: string
  initials: string
  createdAt: number
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

type BrandStore = {
  brands: Brand[]
  activeBrandId: string | null
  addBrand: (data: { name: string; description?: string; websiteUrl?: string }) => void
  updateBrand: (id: string, data: Partial<Pick<Brand, "name" | "description" | "websiteUrl">>) => void
  deleteBrand: (id: string) => void
  setActiveBrand: (id: string | null) => void
}

export const useBrandStore = create<BrandStore>()(
  persist(
    (set) => ({
      brands: [
        {
          id: "seed-coff-ai",
          name: "Coff AI",
          description: "AI-powered short video and image generation platform. Create stunning video and visual content with AI using text prompts or images.",
          websiteUrl: "https://coffai.com",
          initials: "CA",
          createdAt: Date.now(),
        },
      ],
      activeBrandId: null,

      addBrand: (data) => {
        const brand: Brand = {
          id: crypto.randomUUID(),
          name: data.name,
          description: data.description ?? "",
          websiteUrl: data.websiteUrl ?? "",
          initials: getInitials(data.name),
          createdAt: Date.now(),
        }
        set((state) => ({
          brands: [...state.brands, brand],
          activeBrandId: brand.id,
        }))
      },

      updateBrand: (id, data) => {
        set((state) => ({
          brands: state.brands.map((b) =>
            b.id === id
              ? {
                  ...b,
                  ...data,
                  initials: data.name ? getInitials(data.name) : b.initials,
                }
              : b
          ),
        }))
      },

      deleteBrand: (id) => {
        set((state) => ({
          brands: state.brands.filter((b) => b.id !== id),
          activeBrandId: state.activeBrandId === id ? null : state.activeBrandId,
        }))
      },

      setActiveBrand: (id) => {
        set({ activeBrandId: id })
      },
    }),
    {
      name: "axis-brands",
      partialize: (state) => ({
        brands: state.brands,
        activeBrandId: state.activeBrandId,
      }),
    }
  )
)
