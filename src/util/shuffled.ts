/// Returns a random integer between a range
export function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Fisher-Yates shuffle
// https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#The_modern_algorithm
// Returns a shuffled copy of the array
export function shuffled<T>(array: T[]): T[] {
  const copy = array.slice();

  for (let i = 0; i <= copy.length - 2; i++) {
    const j = randInt(i, copy.length - 1);
    const save = copy[j];
    copy[j] = copy[i];
    copy[i] = save;
  }

  return copy;
}

// Picks a random element from the array
export function pickRandom<T>(array: T[]): T | null {
  if (array.length === 0) {
    return null;
  } else {
    return array[randInt(0, array.length - 1)];
  }
}

// Takes (removes) a random element from the array in-place
export function takeRandom<T>(array: T[]): T | null {
  if (array.length === 0) {
    return null;
  } else {
    return array[randInt(0, array.length - 1)];
  }
}
