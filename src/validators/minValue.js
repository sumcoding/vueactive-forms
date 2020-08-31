export const minValue = (min) => (value) => ({ minValue: typeof value === 'number' && value < min });
