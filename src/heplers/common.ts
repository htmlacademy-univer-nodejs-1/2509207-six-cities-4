export function getRandomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

export function getRandomBoolean(): boolean {
  return Math.random() < 0.5;
}

export function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomRating(): number {
  return parseFloat((Math.random() * 4 + 1).toFixed(1));
}

export function getRandomSubset<T>(items: T[]): T[] {
  const shuffled = [...items].sort(() => 0.5 - Math.random());
  const count = getRandomNumber(1, items.length);
  return shuffled.slice(0, count);
}

export function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : '';
}
