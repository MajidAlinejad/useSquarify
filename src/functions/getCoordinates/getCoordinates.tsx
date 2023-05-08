import { getHumanRect } from "../getHumanRect/getHumanRect";
import { getSumBy } from "../getSumBy/getSumBy";

export interface IUnionCoordinates {
  rect: IMRect;
}

export const getCoordinates = <T,>(
  scaledSequence: T[],
  mathRect: IMRect,
  realRect: IMRect
): (T & IUnionCoordinates)[] => {
  const { height, width, xOffset, yOffset } = getHumanRect(mathRect);
  const sumOfAreas = getSumBy(scaledSequence, "scaledValue");

  const areaWidth = sumOfAreas / height;
  const areaHeight = sumOfAreas / width;

  let mutatedYOffset = yOffset;
  let mutatedXOffset = xOffset;
  const coor = scaledSequence.map((item) => {
    const getY1 = () => {
      const y1 =
        width >= height
          ? mutatedYOffset + (item as IScaledValue).scaledValue / areaWidth
          : mutatedYOffset + areaHeight;

      return y1 >= realRect.y1
        ? realRect.y1
        : y1 < realRect.y0
        ? realRect.y0
        : y1;
    };

    const getX1 = () => {
      const x1 =
        width >= height
          ? xOffset + areaWidth
          : mutatedXOffset + (item as IScaledValue).scaledValue / areaHeight;
      return x1 >= realRect.x1
        ? realRect.x1
        : x1 < realRect.x0
        ? realRect.x0
        : x1;
    };

    const y1 = getY1();
    const x1 = getX1();

    const rect: IMRect = {
      x0:
        mutatedXOffset >= realRect.x1
          ? realRect.x1
          : mutatedXOffset < realRect.x0
          ? realRect.x0
          : mutatedXOffset,
      y0:
        mutatedYOffset >= realRect.y1
          ? realRect.y1
          : mutatedYOffset < realRect.y0
          ? realRect.y0
          : mutatedYOffset,
      x1,
      y1,
    };
    mutatedYOffset = width >= height ? y1 : mutatedYOffset;
    mutatedXOffset = width >= height ? mutatedXOffset : x1;
    return { ...item, rect: rect };
  });

  return coor;
};
