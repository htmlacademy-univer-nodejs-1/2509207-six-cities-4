import { ClassConstructor, plainToInstance } from 'class-transformer';
import { ValidationError } from 'class-validator';
import { ApplicationError, ValidationErrorField } from '../core/rest/index.js';

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

export function fillDTO<T, V>(someDto: ClassConstructor<T>, plainObject: V) {
  return plainToInstance(someDto, plainObject, { excludeExtraneousValues: true });
}

export function reduceValidationErrors(errors: ValidationError[]): ValidationErrorField[] {
  return errors.map(({ property, value, constraints}) => ({
    property,
    value,
    messages: constraints ? Object.values(constraints) : []
  }));
}

export function createErrorObject(errorType: ApplicationError, error: string, details: ValidationErrorField[] = []) {
  return { errorType, error, details };
}

export function getFullServerPath(host: string, port: number) {
  return `http://${host}:${port}`;
}
