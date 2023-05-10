import { RefObject, useEffect, useState } from "react";
import { useHTMLElementSize } from "../useWindowSize/useWindowSize";
import { useSquarified } from "../useSquarified/useSquarified";
import { getCanvasRect } from "../../functions/getHumanRect/getHumanRect";
import { getCategories } from "../../functions/getCategories/getCategories";
import Tile from "../../components/Tile/Tile";

interface IuseGroupMap<T> {
  sequence: T[];
  ref: RefObject<HTMLElement>;
  sizedByColName: string;
  performanceByColName: string;
  symbolNameColName: string;
  groupColName: string;
  fullNameColName: string;
  heatColor?: IHeatColor;
  heatMultiply: number;
  detailComponent: JSX.Element;
  emptyComponent: JSX.Element;
}
export const useGroupMap = <T,>({
  ref,
  sequence,
  sizedByColName,
  groupColName,
  emptyComponent,
  ...rest
}: IuseGroupMap<T>) => {
  const [x, y] = useHTMLElementSize(ref.current);
  const [cat, setCat] = useState<any>([]);
  const squarified = useSquarified(cat, ref, "value", 0);
  useEffect(() => {
    const data = getCategories(sequence, sizedByColName, groupColName);
    setCat(data);
  }, [sequence]);

  return (
    <>
      <div
        style={{
          position: "relative",
          width: x,
          height: y,
        }}
      >
        {squarified.length
          ? squarified.map((gTile, inx) => {
              const rect = getCanvasRect(gTile.rect);
              const gName = (gTile as any)["title"];
              if (
                rect.x + Math.abs(rect.w) > x ||
                rect.y + Math.abs(rect.h) > y
              ) {
                return <></>;
              }
              const gSequence = sequence.filter(
                (item) => (item as any)[groupColName] === gName
              );
              return (
                <div
                  key={inx}
                  style={{
                    position: "absolute",
                    width: rect.w - 2,
                    height: rect.h - 2,
                    left: rect.x + 1,
                    top: rect.y + 1,
                  }}
                >
                  <Tile
                    {...rest}
                    emptyComponent={emptyComponent}
                    groupTitle={gName}
                    sequence={gSequence}
                    sizedByColName={sizedByColName}
                  />
                </div>
              );
            })
          : emptyComponent}
      </div>
    </>
  );
};
