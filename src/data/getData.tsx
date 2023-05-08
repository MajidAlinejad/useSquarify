import stocks from "./stock.json";
export const getData = () => {
  const groupedStocks = stocks.map((stock, i) => {
    return {
      name: stock.d[32],
      clip: stock.d[35],
      H: stock.d[0],
      Hx2: stock.d[1],
      D: stock.d[2],
      W: stock.d[3],
      M: stock.d[4],
      Mx3: stock.d[5],
      Mx6: stock.d[6],
      Y: stock.d[8],

      MarketCap: Math.round(+(stock.d[14] || 0)),
      VolumeH: Math.round(+(stock.d[21] || 0)),
      VolumeHx4: Math.round(+(stock.d[22] || 0)),
      VolumeD: Math.round(+(stock.d[23] || 0)),
      VolumeW: Math.round(+(stock.d[24] || 0)),
      VolumeM: Math.round(+(stock.d[25] || 0)),
      value: stock.d[33],
      group: stock.d[31],
    };
  });

  return groupedStocks;
};
