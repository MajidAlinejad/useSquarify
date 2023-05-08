export const getCategories = (
  sequence: any[],
  sizedByColName: string,
  groupColName: string
) => {
  const groups = [
    ...new Set<string>(
      sequence.map((item, i) => (item as any)[groupColName] as string)
    ),
  ];

  const data = groups.map((groupName) => {
    let amount = 0;
    sequence.forEach((item) => {
      if (item[groupColName] === groupName) {
        amount += (item as any)[sizedByColName];
      }
    });

    return { title: groupName, value: amount };
  });

  return data;
};
