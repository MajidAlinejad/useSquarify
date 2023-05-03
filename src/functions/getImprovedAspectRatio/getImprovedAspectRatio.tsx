import { getMaxAspectRatio } from "../getMaxAspectRatio/getMaxAspectRatio";
import { getShortestSide } from "../getShortestSide/getShortestSide";

export const isAspectRatioImproved = <T,>(
  rowSequence: T[],
  mathRect: IMRect,
  slicedSequence: (T & IScaledValue)[]
) => {
  if (rowSequence && rowSequence.length === 0 && slicedSequence.length) {
    return [Infinity, -Infinity];
  }
  const newRow = [...rowSequence, slicedSequence[0]];
  const shortestSide = getShortestSide(mathRect);
  const currentMaxAspectRatio = getMaxAspectRatio(rowSequence, shortestSide);
  const newMaxAspectRatio = getMaxAspectRatio(newRow, shortestSide);

  return [
    currentMaxAspectRatio >=
      newMaxAspectRatio + (newRow.length + 90) / slicedSequence.length,
    { currentMaxAspectRatio, newMaxAspectRatio },
  ];
};
