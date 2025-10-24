"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface MultiCheckboxProps {
  label: string
  options: string[]
  value: string[]
  onChange: (value: string[]) => void
  className?: string
}

export function MultiCheckbox({
  label,
  options,
  value,
  onChange,
  className,
}: MultiCheckboxProps) {
  const handleToggle = (option: string) => {
    if (value.includes(option)) {
      onChange(value.filter((v) => v !== option))
    } else {
      onChange([...value, option])
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      <Label className="text-sm font-medium">{label}</Label>
      <div className="space-y-1">
        {options.map((option) => (
          <div key={option} className="flex items-center space-x-2 p-1.5 rounded hover:bg-accent/50 transition-colors">
            <Checkbox
              id={option}
              checked={value.includes(option)}
              onCheckedChange={() => handleToggle(option)}
              className="h-4 w-4"
            />
            <Label
              htmlFor={option}
              className="cursor-pointer flex-1 text-sm font-normal"
            >
              {option}
            </Label>
          </div>
        ))}
      </div>
    </div>
  )
}
