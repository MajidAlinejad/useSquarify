export const getHumanRect = (mathRect: IMRect): IHRect => {
  const x0 = mathRect.x0;
  const y0 = mathRect.y0;
  const x1 = mathRect.x1;
  const y1 = mathRect.y1;
  return {
    xOffset: x0,
    yOffset: y0,
    width: x1 - x0,
    height: y1 - y0,
  };
};

export const getCanvasRect = (mathRect: IMRect): ICRect => {
  const x0 = mathRect.x0;
  const y0 = mathRect.y0;
  const x1 = mathRect.x1;
  const y1 = mathRect.y1;
  return {
    x: x0,
    y: y0,
    w: x1 - x0,
    h: y1 - y0,
  };
};
