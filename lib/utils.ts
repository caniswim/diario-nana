import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Gerar UUID simples
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Formatar data para exibição
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

// Obter data no formato YYYY-MM-DD
export function getDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Verificar se é domingo
export function isDomingoing(date: Date): boolean {
  return date.getDay() === 0;
}

// Obter hora atual formatada
export function getCurrentTime(): string {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

// Sugerir nome de refeição baseado no horário
export function suggestMealName(time: string): string {
  const hour = parseInt(time.split(':')[0], 10);

  if (hour >= 5 && hour < 10) return 'Café da manhã';
  if (hour >= 10 && hour < 12) return 'Lanche da manhã';
  if (hour >= 12 && hour < 15) return 'Almoço';
  if (hour >= 15 && hour < 18) return 'Lanche da tarde';
  if (hour >= 18 && hour < 21) return 'Jantar';
  return 'Ceia';
}
