import { getMaxAspectRatio } from "../getMaxAspectRatio/getMaxAspectRatio";
import { getShortestSide } from "../getShortestSide/getShortestSide";

export const isAspectRatioImproved = <T,>(
  rowSequence: T[],
  mathRect: IMRect,
  slicedSequence: (T & IScaledValue)[],
  telorance: number = 50
) => {
  if (rowSequence && rowSequence.length === 0 && slicedSequence.length) {
    return [Infinity, -Infinity];
  }
  const newRow = [...rowSequence, slicedSequence[0]];
  const shortestSide = getShortestSide(mathRect);
  const currentMaxAspectRatio = getMaxAspectRatio(rowSequence, shortestSide);
  const newMaxAspectRatio = getMaxAspectRatio(newRow, shortestSide);
  const flag =
    currentMaxAspectRatio >=
    newMaxAspectRatio + (newRow.length + telorance) / slicedSequence.length;

  return [
    slicedSequence.length < 6 ? false : flag,
    { currentMaxAspectRatio, newMaxAspectRatio },
  ];
};
