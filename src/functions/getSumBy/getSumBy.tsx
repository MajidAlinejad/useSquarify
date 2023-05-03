export const getSumBy = (vector: any[], by: string) => {
  let sum = 0;
  if (vector.length && !vector.includes(undefined)) {
    const partially = vector.reduce((partialSum, curr) => {
      return (partialSum += curr[by]);
    }, 0);
    sum = partially;
  }

  return sum;
};

export const getMinMaxBy = (vector: any[], by: string) => {
  let minMax: number[] = [];
  if (vector.length && !vector.includes(undefined)) {
    const minimum = vector.reduce((prev, curr) => {
      return prev[by] < curr[by] ? prev : curr;
    });
    const maximum = vector.reduce((prev, curr) => {
      return prev[by] > curr[by] ? prev : curr;
    });
    minMax = [minimum[by], maximum[by]];
  }

  return minMax;
};
