import { RefObject, cloneElement, useEffect, useRef, useState } from "react";
import { FC } from "react";
import { useSqurifiedHeatMap } from "../../hooks/useSqurifiedHeatMap/useSqurifiedHeatMap";

interface ITileType<T> {
  sequence: T[];
  sizedByColName: string;
  performanceByColName: string;
  symbolNameColName: string;
  fullNameColName: string;
  heatColor?: IHeatColor;
  heatMultiply: number;
  detailComponent: JSX.Element;
  emptyComponent: JSX.Element;
}

const Tile = <T,>(props: ITileType<T>) => {
  const container = useRef<HTMLDivElement>(null);

  const sw = useSqurifiedHeatMap({
    ...props,
    ref: container,
    noDetail: true,
    topMargin: 20,
  });

  const handleMouseOver = (
    e: React.MouseEvent<HTMLCanvasElement, globalThis.MouseEvent>
  ) => {};

  return (
    <div ref={container} style={{ width: "100%", height: "100%" }}>
      {sw}
    </div>
  );
};

export default Tile;
