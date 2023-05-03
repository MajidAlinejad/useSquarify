import { getMinMaxBy, getSumBy } from "../getSumBy/getSumBy";

export const getMaxAspectRatio = <T,>(
  scaledSequence: T[],
  realArea: number
) => {
  let maxAspectRatio = 0;
  const sumOfAreas = getSumBy(scaledSequence, "scaledValue");
  const [minimumOfAreas, maximumOfAreas] = getMinMaxBy(
    scaledSequence,
    "scaledValue"
  );

  if (scaledSequence.length && maximumOfAreas && sumOfAreas) {
    const result = Math.max(
      (realArea ** 2 * maximumOfAreas) / sumOfAreas ** 2,
      sumOfAreas ** 2 / (realArea ** 2 * minimumOfAreas)
    );
    maxAspectRatio = result;
  }

  return maxAspectRatio;
};
