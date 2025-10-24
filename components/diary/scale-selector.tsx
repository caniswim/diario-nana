"use client"

import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
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
  const currentIndex = value ? options.findIndex(opt => opt.value === value) : -1
  const currentOption = currentIndex >= 0 ? options[currentIndex] : null

  const handleSliderChange = (values: number[]) => {
    const index = values[0]
    if (index >= 0 && index < options.length) {
      onChange(options[index].value)
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">{label}</Label>
        {currentOption && (
          <Badge variant={currentOption.isIdeal ? "default" : "secondary"} className="text-xs">
            {currentOption.label}
          </Badge>
        )}
      </div>

      <Slider
        value={[currentIndex >= 0 ? currentIndex : 0]}
        onValueChange={handleSliderChange}
        max={options.length - 1}
        step={1}
        className="w-full"
      />

      <div className="flex justify-between text-xs text-muted-foreground px-1">
        <span>{options[0]?.description || options[0]?.label}</span>
        <span>{options[options.length - 1]?.description || options[options.length - 1]?.label}</span>
      </div>

      {currentOption?.description && (
        <p className="text-xs text-center text-muted-foreground mt-1">
          {currentOption.description}
        </p>
      )}
    </div>
  )
}
