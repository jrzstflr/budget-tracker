"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface FloatingActionButtonProps {
  onClick: () => void
  className?: string
}

export function FloatingActionButton({ onClick, className }: FloatingActionButtonProps) {
  const handleClick = () => {
    console.log("[v0] FloatingActionButton clicked")
    onClick()
  }

  return (
    <Button
      onClick={handleClick}
      size="lg"
      className={cn(
        "fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all lg:hidden z-50",
        "bg-primary hover:bg-primary/90 active:scale-95",
        className,
      )}
    >
      <Plus className="w-6 h-6" />
    </Button>
  )
}
