import { getHumanRect } from "../getHumanRect/getHumanRect";

export const getShortestSide = (input: IMRect) => {
  const { height, width } = getHumanRect(input);
  return Math.min(width, height);
};
