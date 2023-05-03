export const getMathRect = (humanRect: IHRect): IMRect => {
  const xOffset = humanRect.xOffset;
  const yOffset = humanRect.yOffset;
  const width = humanRect.width;
  const height = humanRect.height;

  return {
    x0: xOffset,
    y0: yOffset,
    x1: xOffset + width,
    y1: yOffset + height,
  };
};
