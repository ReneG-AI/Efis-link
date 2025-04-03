declare module 'date-fns' {
  export function format(date: Date | number, format: string, options?: { locale?: any }): string;
  export function addDays(date: Date | number, amount: number): Date;
  export function subDays(date: Date | number, amount: number): Date;
  export function startOfWeek(date: Date | number, options?: { weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6 }): Date;
  export function endOfWeek(date: Date | number, options?: { weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6 }): Date;
  export function isWithinInterval(date: Date | number, interval: { start: Date | number; end: Date | number }): boolean;
  export function parseISO(dateString: string): Date;
}

declare module 'date-fns/locale' {
  export const es: any;
} 