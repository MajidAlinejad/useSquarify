import { RefObject, useState } from "react";
import { useSqurifiedHeatMap } from "../useSqurifiedHeatMap/useSqurifiedHeatMap";
import { useGroupMap } from "../useGroupMap/useGroupMap";
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
  const [category, setCategory] = useState<string>("");

  const categoriesMap = useGroupMap({
    groupColName,
    sequence,
    sizedByColName,
    ...rest,
  });

  return (
    <div>
      {categoriesMap}
      {/* <div>
        <div className="w-full flex  h-[35px] justify-between gap-2 p-2 px-6">
          <div className="flex  gap-2 items-center  ">
            <button className="text-lg  rotate-180 leading-snug">➜</button>
            <span className=" text-sm font-bold">
              {"technologyServicesName"}
            </span>
          </div>
        </div>
        {sw}
      </div> */}
    </div>
  );
};
