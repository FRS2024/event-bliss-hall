
import * as React from "react"
import { cn } from "@/lib/utils"

const cardVariants = {
  modern: "bg-white/90 backdrop-blur-sm border border-white/20 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1",
  glass: "bg-white/60 backdrop-blur-md border border-white/30 rounded-2xl shadow-lg shadow-black/5 transition-all duration-300 hover:bg-white/70 hover:shadow-xl",
  featured: "bg-gradient-to-br from-white to-gray-50/50 border border-gray-100 rounded-2xl shadow-lg shadow-gray-900/5 transition-all duration-300 hover:shadow-2xl hover:shadow-gray-900/10 hover:-translate-y-2",
  elegant: "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-soft transition-all duration-300 hover:shadow-medium hover:-translate-y-0.5"
}

interface EnhancedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof cardVariants
  interactive?: boolean
}

const EnhancedCard = React.forwardRef<HTMLDivElement, EnhancedCardProps>(
  ({ className, variant = "modern", interactive = true, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        cardVariants[variant],
        !interactive && "hover:transform-none hover:shadow-sm",
        className
      )}
      {...props}
    />
  )
)
EnhancedCard.displayName = "EnhancedCard"

const EnhancedCardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-2 p-6 pb-4", className)}
      {...props}
    />
  )
)
EnhancedCardHeader.displayName = "EnhancedCardHeader"

const EnhancedCardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("font-semibold leading-none tracking-tight text-xl sm:text-2xl", className)}
      {...props}
    />
  )
)
EnhancedCardTitle.displayName = "EnhancedCardTitle"

const EnhancedCardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-sm sm:text-base text-muted-foreground leading-relaxed", className)}
      {...props}
    />
  )
)
EnhancedCardDescription.displayName = "EnhancedCardDescription"

const EnhancedCardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
  )
)
EnhancedCardContent.displayName = "EnhancedCardContent"

const EnhancedCardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center p-6 pt-4 gap-4", className)}
      {...props}
    />
  )
)
EnhancedCardFooter.displayName = "EnhancedCardFooter"

export {
  EnhancedCard,
  EnhancedCardHeader,
  EnhancedCardFooter,
  EnhancedCardTitle,
  EnhancedCardDescription,
  EnhancedCardContent,
}
