import { getHumanRect } from "../getHumanRect/getHumanRect";
import { getMathRect } from "../getMathRect/getMathRect";
export const getRemainArea = (rect: IMRect, area: number): IMRect => {
  const { height, width, xOffset, yOffset } = getHumanRect(rect);

  if (width >= height) {
    const areaWidth = area / height;
    const newWidth = width - areaWidth;
    return getMathRect({
      xOffset: xOffset + areaWidth,
      yOffset,
      width: newWidth,
      height,
    });
  } else {
    const areaHeight = area / width;
    const newHeight = height - areaHeight;

    return getMathRect({
      xOffset,
      yOffset: yOffset + areaHeight,
      width,
      height: newHeight,
    });
  }
};
