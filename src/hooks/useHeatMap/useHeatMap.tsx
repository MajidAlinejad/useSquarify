import { RefObject, useState, useRef, useEffect } from "react";
import { useSqurifiedHeatMap } from "../useSqurifiedHeatMap/useSqurifiedHeatMap";
import { useGroupMap } from "../useGroupMap/useGroupMap";
import useLocalStorage from "../useLocalStorage/useLocalStorage";
import { useStyles } from "../../style/jss";

interface IuseHeatMap<T> {
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
export const useHeatMap = <T,>({
  groupColName,
  sequence,
  sizedByColName,
  ...rest
}: IuseHeatMap<T>): React.ReactNode => {
  const classes = useStyles();
  const [selectedSequence, setSelectedSequence] = useState<T[]>([]);
  const [category, setCategory] = useLocalStorage<string>("category", "");

  const sw = useSqurifiedHeatMap({
    ...rest,
    sequence: selectedSequence,
    sizedByColName,
    topMargin: 33,
  });

  const categoriesMap = useGroupMap({
    groupColName,
    sequence,
    sizedByColName,
    ...rest,
  });

  useEffect(() => {
    if (category) {
      const selected = sequence.filter(
        (item) => (item as any)[groupColName] === category
      );
      setSelectedSequence(selected);
    }
  }, [category, groupColName, sequence]);

  return (
    <>
      <div style={{ position: "absolute", zIndex: 2 }}>{categoriesMap}</div>
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          zIndex: !!category ? 5 : -1,
          opacity: !!category ? 1 : 0,
        }}
      >
        <div className={classes.groupNav}>
          <button onClick={() => setCategory("")}>
            All <span style={{ fontSize: "20px" }}>›</span>
          </button>
          <span className=" text-sm font-bold">{category}</span>
        </div>
        {sw}
      </div>
    </>
  );
};
