export const maxValue = (max) => (value) => ({ maxValue: typeof value === 'number' && value > max });
