export const getHeatColor = (
  value: number,
  multiplier: number,
  heatColor: IHeatColor
): string => {
  const ranges = [
    { id: "negativThree", value: [-2.5, -Infinity] },
    { id: "negativTwo", value: [-1.5, -2.5] },
    { id: "negativOne", value: [-0.5, -1.5] },
    { id: "zero", value: [-0.5, 0.5] },
    { id: "positiveOne", value: [0.5, 1.5] },
    { id: "positiveTwo", value: [1.5, 2.5] },
    { id: "positiveThree", value: [2.5, Infinity] },
  ].map(({ id, value }) => {
    return { id: id, value: [value[0] * multiplier, value[1] * multiplier] };
  });
  const inRange = ranges.find((range) => {
    if (value >= 0) {
      return value >= range.value[0] && value <= range.value[1];
    } else {
      return value <= range.value[0] && value >= range.value[1];
    }
  });

  return inRange ? (heatColor as any)[inRange?.id] : heatColor.zero;
};
