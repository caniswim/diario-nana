import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface SectionCardProps {
  title: string
  icon?: string
  children: React.ReactNode
  className?: string
}

export function SectionCard({ title, icon, children, className }: SectionCardProps) {
  return (
    <Card className={cn("shadow-sm", className)}>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          {icon && <span className="text-2xl">{icon}</span>}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {children}
      </CardContent>
    </Card>
  )
}
