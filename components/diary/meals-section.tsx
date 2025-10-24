"use client"

import { Button } from "@/components/ui/button"
import { MealCard } from "./meal-card"
import { Plus, Utensils } from "lucide-react"
import type { Refeicao } from "@/types/diary"
import { generateId, getCurrentTime, suggestMealName } from "@/lib/utils"

interface MealsSectionProps {
  meals: Refeicao[]
  onChange: (meals: Refeicao[]) => void
}

export function MealsSection({ meals, onChange }: MealsSectionProps) {
  const addMeal = () => {
    const time = getCurrentTime()
    const newMeal: Refeicao = {
      id: generateId(),
      nome: suggestMealName(time),
      horario: time,
      sentimentos: [],
      comoComi: [],
      depoisFisico: [],
      depoisEmocional: [],
      createdAt: Date.now(),
    }
    onChange([...meals, newMeal])
  }

  const updateMeal = (index: number, meal: Refeicao) => {
    const newMeals = [...meals]
    newMeals[index] = meal
    onChange(newMeals)
  }

  const deleteMeal = (index: number) => {
    onChange(meals.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold flex items-center gap-2">
          <Utensils className="h-4 w-4 text-primary" />
          Refeições do Dia
        </h2>
        <Button onClick={addMeal} size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Adicionar
        </Button>
      </div>

      {meals.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground mb-4">
            Nenhuma refeição registrada ainda
          </p>
          <Button onClick={addMeal} variant="outline" className="gap-2">
            <Plus className="h-4 w-4" />
            Adicionar Primeira Refeição
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {meals.map((meal, index) => (
            <MealCard
              key={meal.id}
              meal={meal}
              onChange={(updated) => updateMeal(index, updated)}
              onDelete={() => deleteMeal(index)}
              canDelete={meals.length > 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}
