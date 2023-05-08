import { RefObject, cloneElement, useEffect, useRef, useState } from "react";
import { useHTMLElementSize } from "../useWindowSize/useWindowSize";
import { useSquarified } from "../useSquarified/useSquarified";
import { getShortestSide } from "../../functions/getShortestSide/getShortestSide";
import { getHeatColor } from "../../functions/getHeatColor/getHeatColor";
import { getCanvasRect } from "../../functions/getHumanRect/getHumanRect";
import { IUnionCoordinates } from "../../functions/getCoordinates/getCoordinates";
import { defaultHeatColor } from "../useSqurifiedHeatMap/heatColor";
import { getCategories } from "../../functions/getCategories/getCategories";

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
  performanceByColName,
  fullNameColName,
  sizedByColName,
  symbolNameColName,
  heatColor = defaultHeatColor,
  heatMultiply,
  detailComponent,
  emptyComponent,
  groupColName,
}: IuseGroupMap<T>) => {
  const [tochedTile, setTochedTile] = useState<number>();
  const [tochedTileDetail, setTochedTileDetail] = useState<T>();
  const [x, y] = useHTMLElementSize(ref.current);
  const canvas = useRef<HTMLCanvasElement>(null);
  const ctx = canvas.current?.getContext("2d");
  const [cat, setCat] = useState<any>([]);
  const squarified = useSquarified(cat, ref, "value", 0);

  useEffect(() => {
    const data = getCategories(sequence, sizedByColName, groupColName);
    console.log(data);
    setCat(data);
  }, [sequence]);

  const handleMouseOver = (
    e: React.MouseEvent<HTMLCanvasElement, globalThis.MouseEvent>
  ) => {
    const rect = canvas.current?.getBoundingClientRect();

    if (rect?.left) {
      const mX = e.clientX - rect?.left;
      const mY = e.clientY - rect?.top;
      const tochedTitle = squarified.findIndex(
        (tile) =>
          mX >= tile.rect.x0 &&
          mX <= tile.rect.x1 &&
          mY >= tile.rect.y0 &&
          mY <= tile.rect.y1
      );
      setTochedTile(tochedTitle > -1 ? tochedTitle : undefined);
    }
  };

  const writeTitle = (symbolNameRaw: string, rect: ICRect) => {
    if (ctx) {
      ctx.font = `10px Arial`;
      ctx.fillStyle = "white";
      ctx.textAlign = "right";
      ctx.fillText(
        symbolNameRaw.toString(),
        rect.x + 200,
        rect.y + 15,
        rect.w - 10
      );
    }
  };
  const fillTile = (rect: ICRect) => {
    if (ctx) {
      ctx.fillStyle = "#0064c3";
      ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
    }
  };

  useEffect(() => {
    if (squarified.length > 0) {
      if (x && y && ctx) {
        ctx.clearRect(0, 0, x, y);
        squarified.forEach((squarifiedTile, inx) => {
          //
          const mathRect = squarifiedTile.rect as IMRect;
          const rect = getCanvasRect(mathRect);

          const symbolNameRaw = (squarifiedTile as any)["title"] as string;
          const symbolValue = (squarifiedTile as any)["value"] as string;

          fillTile(rect);
          writeTitle(symbolNameRaw + "->" + symbolValue, rect);
          fillBackground(ctx, rect);
        });
      }
    }
  }, [squarified]);

  return (
    <>
      <canvas
        onMouseLeave={(e) => {
          setTochedTileDetail(undefined);
          setTochedTile(undefined);
        }}
        onMouseMove={(e) => handleMouseOver(e)}
        style={{
          textRendering: "optimizeLegibility",
          position: "absolute",
          top: 0,
          left: 0,
        }}
        ref={canvas}
        width={x}
        height={y}
      />
    </>
  );
};

function fillBackground(ctx: CanvasRenderingContext2D, rect: ICRect) {
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#fff";
  ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
}
