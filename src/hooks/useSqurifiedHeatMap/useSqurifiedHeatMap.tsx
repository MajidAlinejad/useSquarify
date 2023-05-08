import { RefObject, cloneElement, useEffect, useRef, useState } from "react";
import { useHTMLElementSize } from "../useWindowSize/useWindowSize";
import { useSquarified } from "../useSquarified/useSquarified";
import { getShortestSide } from "../../functions/getShortestSide/getShortestSide";
import { defaultHeatColor } from "./heatColor";
import { getHeatColor } from "../../functions/getHeatColor/getHeatColor";
import { getCanvasRect } from "../../functions/getHumanRect/getHumanRect";
import { IUnionCoordinates } from "../../functions/getCoordinates/getCoordinates";
interface IUseSqurifiedHeatMap<T> {
  sequence: T[];
  ref: RefObject<HTMLElement>;
  sizedByColName: string;
  performanceByColName: string;
  symbolNameColName: string;
  fullNameColName: string;
  heatColor?: IHeatColor;
  heatMultiply: number;
  detailComponent?: JSX.Element;
  emptyComponent?: JSX.Element;
  noDetail?: boolean;
  topMargin?: number;
}
export const useSqurifiedHeatMap = <T,>({
  ref,
  sequence,
  performanceByColName,
  sizedByColName,
  symbolNameColName,
  heatColor = defaultHeatColor,
  heatMultiply,
  detailComponent,
  emptyComponent,
  noDetail,
  topMargin = 0,
}: IUseSqurifiedHeatMap<T>) => {
  const [tochedTile, setTochedTile] = useState<number>();
  const [tochedTileDetail, setTochedTileDetail] = useState<T>();
  const [x, y] = useHTMLElementSize(ref.current);
  const canvas = useRef<HTMLCanvasElement>(null);
  const ctx = canvas.current?.getContext("2d");
  const squarified = useSquarified(sequence, ref, sizedByColName);

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

  // const handleMouseOverDetail = (
  //   e: React.MouseEvent<HTMLDivElement, globalThis.MouseEvent>
  // ) => {

  // };
  const hasTitle = (
    squarified: (T & IScaledValue & IUnionCoordinates)[],
    inx: number,
    rect: ICRect
  ) => {
    if (rect.h > 50 && rect.w > 50) {
      return true;
    }
    if (squarified.length <= inx + 12) {
      return squarified.length < inx + 2 || rect.h / rect.w < 1;
    } else {
      return true;
    }
  };
  const writeTitle = (
    measuredFontSize: number,
    symbolNameRaw: string,
    rect: ICRect
  ) => {
    if (ctx) {
      ctx.font = `${measuredFontSize}px Arial`;
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.fillText(
        symbolNameRaw.toString(),
        rect.x + rect.w / 2,
        rect.y + rect.h / 2 + 5,
        rect.w - 10
      );
    }
  };
  const fillTile = (
    firstValue: number,
    heatMultiply: number,
    heatColor: IHeatColor,
    rect: ICRect
  ) => {
    if (ctx) {
      ctx.fillStyle = getHeatColor(firstValue, heatMultiply, heatColor);
      ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
    }
  };
  const getMesuredFontSize = (
    symbolNameRaw: string,
    minimumEdge: number,
    TitlefontSize: number
  ) => {
    return (ctx as CanvasRenderingContext2D).measureText(symbolNameRaw).width *
      2 >
      minimumEdge
      ? 12
      : TitlefontSize > 100
      ? 80
      : TitlefontSize;
  };
  const getTitlefontSize = (
    minimumEdge: number,
    rect: ICRect,
    biggestFourLetter: number
  ) => {
    return (
      ((minimumEdge - 0.1 * rect.w - 0.05 * rect.h) / biggestFourLetter) * 10
    );
  };
  const writeFirstValue = (
    rect: ICRect,
    TitlefontSize: number,
    firstValue: number
  ) => {
    if (50 < Math.min(rect.w, rect.h) && ctx) {
      const percentFontSize =
        TitlefontSize > 30 ? 20 : Math.min(rect.w, rect.h) < 100 ? 11 : 13;
      ctx.font = `${percentFontSize}px Arial`;

      ctx.fillText(
        `${firstValue.toFixed(2)}%`,
        rect.x + rect.w / 2,
        rect.y + rect.h / 2 + percentFontSize * 1.6
      );
      ctx.textAlign = "center";
    }
  };

  useEffect(() => {
    if (x && y && ctx) {
      const biggestFourLetter = ctx.measureText(`XXXX`).width;
      ctx.clearRect(0, 0, x, y);
      squarified.forEach((squarifiedTile, inx) => {
        //
        const mathRect = squarifiedTile.rect as IMRect;
        const minimumEdge = getShortestSide(mathRect);
        const rect = getCanvasRect(mathRect);

        const firstValueRaw = (squarifiedTile as any)[
          performanceByColName
        ] as number;
        const symbolNameRaw = (squarifiedTile as any)[
          symbolNameColName
        ] as string;

        const firstValue = firstValueRaw
          ? Math.round(+firstValueRaw * 100) / 100
          : 0;

        const TitlefontSize = getTitlefontSize(
          minimumEdge,
          rect,
          biggestFourLetter
        );
        const measuredFontSize = getMesuredFontSize(
          symbolNameRaw,
          minimumEdge,
          TitlefontSize
        );

        fillTile(firstValue, heatMultiply, heatColor, rect);
        //
        const hasTile = hasTitle(squarified, inx, rect);
        hasTile && writeTitle(measuredFontSize, symbolNameRaw, rect);
        //
        writeFirstValue(rect, TitlefontSize, firstValue);
        fillBackground(ctx, rect);
      });
    }
  }, [squarified, heatMultiply, performanceByColName]);

  useEffect(() => {
    if (tochedTile !== undefined && ctx) {
      const toched = squarified[tochedTile];
      setTochedTileDetail(undefined);
      let timeout: NodeJS.Timeout = setTimeout(() => {
        setTochedTileDetail(toched);
      }, 500);

      const rect = getCanvasRect(toched.rect);
      ctx.globalCompositeOperation = "multiply";
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#0064c3";
      ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
      return () => {
        ctx.globalCompositeOperation = "hard-light";
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#fff";
        ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
        clearTimeout(timeout);
      };
    }
  }, [tochedTile, squarified]);

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
          top: topMargin,
          left: 0,
        }}
        ref={canvas}
        width={x}
        height={y - topMargin}
      />

      {!noDetail ? (
        <>
          <div
            style={{
              position: "absolute",
              zIndex: sequence.length === 0 ? 3 : -99,
              borderRadius: 10,
              bottom: "50%",
              left: "50%",
              opacity: sequence.length === 0 ? 1 : 0,
              transform: "translate(-50%,50%)",
            }}
          >
            {emptyComponent}
          </div>
          <div
            style={{
              zIndex: tochedTileDetail ? 3 : -99,
              opacity: tochedTileDetail ? 1 : 0,
              position: "absolute",
              borderRadius: 10,
              bottom: 0,
              left: "50%",
              transform: "translate(-50%,-50%)",
            }}
          >
            {detailComponent &&
              cloneElement(detailComponent, {
                stock: tochedTileDetail,
              })}
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

function fillBackground(ctx: CanvasRenderingContext2D, rect: ICRect) {
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#fff";
  ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
}
