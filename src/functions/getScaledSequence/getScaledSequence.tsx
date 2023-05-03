import { getScaleValueBy } from "../getScaleValue/getScaleValue";
export const getScaledSequenceBy = <T,>(
  sequence: T[],
  area: number,
  byIndex: string
): (T & IScaledValue)[] => {
  let scaledSequence: (T & IScaledValue)[] = [];
  const multiplier = getScaleValueBy(sequence, area, byIndex);

  if (multiplier !== Infinity && multiplier !== -Infinity) {
    const result = sequence.map((rowItem, index) => {
      return {
        ...rowItem,
        scaledValue: (rowItem as any)[byIndex] * multiplier,
      };
    });
    scaledSequence = result;
  }

  return scaledSequence;
};
