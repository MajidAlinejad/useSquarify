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
          background: "#ffeeff",
        }}
      >
        {squarified.map((gTile) => {
          const gSequence = sequence.filter(
            (item) => (item as any)[groupColName] === (gTile as any)["title"]
          );
          console.log(gSequence);
          const rect = getCanvasRect(gTile.rect);
          return (
            <div
              style={{
                position: "absolute",
                width: rect.w,
                height: rect.h,
                left: rect.x,
                top: rect.y,
                border: "2px solid black",
              }}
            >
              <Tile
                {...rest}
                sequence={gSequence}
                sizedByColName={sizedByColName}
              />
            </div>
          );
        })}
      </div>
    </>
  );
};
