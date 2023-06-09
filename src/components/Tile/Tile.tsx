import { RefObject, cloneElement, useEffect, useRef, useState } from "react";
import { FC } from "react";
import { useSqurifiedHeatMap } from "../../hooks/useSqurifiedHeatMap/useSqurifiedHeatMap";
import { useStyles } from "../../style/jss";
import useLocalStorage from "../../hooks/useLocalStorage/useLocalStorage";

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
  const [category, setCategory] = useLocalStorage<string>("category", "");
  const classes = useStyles();

  const sw = useSqurifiedHeatMap({
    ...props,
    ref: container,
    topMargin: 20,
    detail: "Fixed",
  });

  const handleClickOnHeader = (name: string) => {
    setCategory(name);
  };

  return (
    <div ref={container} className={classes.groupWrapper}>
      <div
        className={classes.groupHeader}
        onClick={() => handleClickOnHeader(groupTitle)}
      >
        {groupTitle}
      </div>
      {sw}
    </div>
  );
};

export default Tile;
