"use client"

import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"

interface ScaleOption {
  value: string
  label: string
  description?: string
  isIdeal?: boolean
}

interface ScaleSelectorProps {
  label: string
  options: ScaleOption[]
  value?: string
  onChange: (value: string) => void
  className?: string
}

export function ScaleSelector({
  label,
  options,
  value,
  onChange,
  className,
}: ScaleSelectorProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <Label className="text-base font-semibold">{label}</Label>
      <RadioGroup value={value} onValueChange={onChange} className="space-y-2">
        {options.map((option) => (
          <div
            key={option.value}
            className={cn(
              "flex items-start space-x-3 rounded-lg border p-3 transition-colors",
              value === option.value && "bg-primary/5 border-primary",
              option.isIdeal && "border-green-500/50 bg-green-50/50"
            )}
          >
            <RadioGroupItem value={option.value} id={option.value} className="mt-0.5" />
            <div className="flex-1 space-y-1">
              <Label
                htmlFor={option.value}
                className="cursor-pointer font-medium flex items-center gap-2"
              >
                {option.label}
                {option.isIdeal && (
                  <span className="text-xs text-green-600">⭐ Ideal</span>
                )}
              </Label>
              {option.description && (
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {option.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </RadioGroup>
    </div>
  )
}
