type IScaledValue = { scaledValue: number };

//raw math rectangle
interface IMRect {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

//human vision rectangle
interface IHRect {
  xOffset: number;
  yOffset: number;
  height: number;
  width: number;
}
