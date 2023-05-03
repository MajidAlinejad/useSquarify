import { getSumBy } from "../getSumBy/getSumBy";

export const getScaleValueBy = (
  sequence: any[],
  area: number,
  byIndex: string
): number => {
  const sequenceSum = getSumBy(sequence, byIndex);
  return area / sequenceSum;
};
