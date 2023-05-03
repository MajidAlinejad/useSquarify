import React, { MouseEvent, useEffect, useRef, useState } from "react";
import stocks from "./data/stock.json";
import { useSquarified } from "./hooks/useSquarified/useSquarified";
import { useHTMLElementSize } from "./hooks/useWindowSize/useWindowSize";

function App() {
  const groups = [
    ...new Set<string>(stocks.map((stock, i) => stock.d[31] as string)),
  ];

  const groupedStocks = groups.map((name, i) => {
    return {
      group: name,
      data: stocks
        .filter((stocks) => stocks.d[31] === name)
        .map((stock, i) => {
          return {
            name: stock.d[32],
            clip: stock.d[35],
            percent: stock.d[4],
            stock:
              (Math.round(+(stock.d[14] || 0)) / 1.0e9).toLocaleString() + "B",
            stockReal: Math.round(+(stock.d[14] || 0)),
            value: stock.d[33],
          };
        })
        .sort((a, b) => (b.value as number) - (a.value as number)),
    };
  });

  const technologyServices = groupedStocks[0].data;
  const technologyServicesName = groupedStocks[0].group;
  //
  const canvas = useRef<HTMLCanvasElement>(null);
  const container = useRef<HTMLDivElement>(null);
  const ctx = canvas.current?.getContext("2d");
  const [x, y] = useHTMLElementSize(container.current);
  const squarified = useSquarified(technologyServices, container, "stockReal");
  const [tochedTile, setTochedTile] = useState<number>();
  useEffect(() => {
    if (x && y) {
      if (ctx) {
        ctx.clearRect(0, 0, x, y);
        squarified.forEach((seq) => {
          let mrect = seq.rect as IMRect;
          const percentage = seq.percent
            ? Math.round(+seq.percent * 100) / 100
            : 0;
          const rect = {
            x: mrect.x0,
            y: mrect.y0,
            w: mrect.x1 - mrect.x0,
            h: mrect.y1 - mrect.y0,
          };

          const TitlefontSize =
            ((Math.min(rect.w, rect.h) -
              (1 / 10) * rect.w -
              (1 / 20) * rect.h) /
              ctx.measureText(`XXXX`).width) *
            10;
          const measuredFontSize =
            ctx.measureText(`${seq.clip}`).width * 2 > Math.min(rect.w, rect.h)
              ? 12
              : TitlefontSize > 100
              ? 80
              : TitlefontSize;

          ctx.fillStyle =
            percentage > 0 ? "#056636" : percentage < 0 ? "#991f29" : "#c1c4cd";
          ctx.fillRect(rect.x, rect.y, rect.w, rect.h);

          ctx.font = `${measuredFontSize}px Arial`;
          ctx.fillStyle = "white";
          ctx.textAlign = "center";
          ctx.fillText(
            `${seq.clip}`,
            rect.x + rect.w / 2,
            rect.y + rect.h / 2 + 5,
            rect.w - 10
          );

          if (50 < Math.min(rect.w, rect.h)) {
            const percentFontSize =
              TitlefontSize > 30
                ? 20
                : Math.min(rect.w, rect.h) < 100
                ? 11
                : 13;
            ctx.font = `${percentFontSize}px Arial`;

            ctx.fillText(
              `${percentage.toFixed(2)}%`,
              rect.x + rect.w / 2,
              rect.y + rect.h / 2 + percentFontSize * 1.6
            );
            ctx.textAlign = "center";
          }

          ctx.lineWidth = 2;
          ctx.strokeStyle = "#fff";
          ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
        });
      }
    }
  }, [squarified]);

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

  useEffect(() => {
    if (tochedTile !== undefined && ctx) {
      const toched = squarified[tochedTile];
      const rect = {
        x: toched.rect.x0,
        y: toched.rect.y0,
        w: toched.rect.x1 - toched.rect.x0,
        h: toched.rect.y1 - toched.rect.y0,
      };
      ctx.globalCompositeOperation = "multiply";
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#0064c3";
      ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);

      return () => {
        ctx.globalCompositeOperation = "hard-light";
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#fff";
        ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
      };
    }
  }, [tochedTile, squarified]);

  return (
    <div className="w-screen h-screen grid grid-rows-min-One">
      <div>
        <div className="w-full flex shadow-sm h-10 justify-between gap-2 p-2 px-6">
          <div className="flex  gap-2 border-x px-5">
            <button className="w-20 h-full text-sm  bg-slate-100 rounded">
              x1
            </button>
            <button className="w-20 h-full text-sm  bg-slate-100 rounded">
              Sort by
            </button>
          </div>
          <div className="flex  gap-2 border-x px-5">
            <button className="w-20 h-full text-sm  bg-slate-100 rounded">
              Color
            </button>
            <button className="w-20 h-full text-sm  bg-slate-100 rounded">
              Full
            </button>
          </div>
        </div>
        <div className="w-full flex  h-10 justify-between gap-2 p-2 px-6">
          <div className="flex  gap-2 items-center  ">
            <button className="text-lg  rotate-180 leading-snug">➜</button>
            <span className=" text-sm font-bold">{technologyServicesName}</span>
          </div>
        </div>
      </div>

      <div className="border-2 relative" ref={container}>
        <canvas
          onMouseMove={(e) => handleMouseOver(e)}
          className="border absolute left-0 top-0"
          style={{ textRendering: "optimizeLegibility" }}
          ref={canvas}
          width={x}
          height={y}
        />
      </div>
    </div>
  );
}

export default App;
