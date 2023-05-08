type IScaledValue = { scaledValue: number };

//raw math rectangle
interface IMRect {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}
interface ICRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

//human vision rectangle
interface IHRect {
  xOffset: number;
  yOffset: number;
  height: number;
  width: number;
}

interface IHeatColor {
  positiveThree: string;
  positiveTwo: string;
  positiveOne: string;
  zero: string;
  negativOne: string;
  negativTwo: string;
  negativThree: string;
}
