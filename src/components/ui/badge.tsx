import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
        accepted: "border-transparent bg-green-400 text-black hover:bg-green-400/80",
        submitted: "border-transparent bg-yellow-300 hover:bg-yellow-300/80",
        rejected: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        review: "border-transparent text-white bg-orange-600 hover:bg-orange-400/80",
        premium: "border-transparent bg-amber-400 text-black hover:bg-amber-400/80",
        active: "border-transparent bg-blue-400 text-black hover:bg-blue-400/80",
        ended: "border-transparent bg-gray-400 text-black hover:bg-gray-400/80",
        verified: "border-transparent bg-green-400 text-black hover:bg-green-400/80",
        unverified: "border-transparent bg-red-400 text-black hover:bg-red-400/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }