import { RefObject, cloneElement, useEffect, useRef, useState } from "react";
import { FC } from "react";
import { useSqurifiedHeatMap } from "../../hooks/useSqurifiedHeatMap/useSqurifiedHeatMap";
import { useStyles } from "../../style/jss";

interface ITileType<T> {
  groupTitle: string;
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

const Tile = <T,>({ groupTitle, ...props }: ITileType<T>) => {
  const container = useRef<HTMLDivElement>(null);
  const classes = useStyles();
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
    <div ref={container} className={classes.groupWrapper}>
      <div className={classes.groupHeader}>{groupTitle}</div>
      {sw}
    </div>
  );
};

export default Tile;
