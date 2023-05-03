import { getHumanRect } from "../getHumanRect/getHumanRect";
import { getSumBy } from "../getSumBy/getSumBy";

export interface IUnionCoordinates {
  rect: IMRect;
}

export const getCoordinates = <T,>(
  scaledSequence: T[],
  mathRect: IMRect
): (T & IUnionCoordinates)[] => {
  const { height, width, xOffset, yOffset } = getHumanRect(mathRect);
  const sumOfAreas = getSumBy(scaledSequence, "scaledValue");

  const areaWidth = sumOfAreas / height;
  const areaHeight = sumOfAreas / width;

  let mutatedYOffset = yOffset;
  let mutatedXOffset = xOffset;
  const coor = scaledSequence.map((item) => {
    const y1 =
      width >= height
        ? mutatedYOffset + (item as IScaledValue).scaledValue / areaWidth
        : mutatedYOffset + areaHeight;

    const x1 =
      width >= height
        ? xOffset + areaWidth
        : mutatedXOffset + (item as IScaledValue).scaledValue / areaHeight;

    const rect: IMRect = {
      x0: mutatedXOffset,
      y0: mutatedYOffset,
      x1,
      y1,
    };
    mutatedYOffset = width >= height ? y1 : mutatedYOffset;
    mutatedXOffset = width >= height ? mutatedXOffset : x1;
    return { ...item, rect: rect };
  });

  return coor;
};
