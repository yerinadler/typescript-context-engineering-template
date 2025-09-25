let counter = 0;

const formatCounter = (value: number): string => value.toString(16).padStart(12, '0');

export const v7 = (): string => {
  counter += 1;
  return `00000000-0000-7000-8000-${formatCounter(counter)}`;
};

export default {
  v7,
};
