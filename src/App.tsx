import React, { FC, Fragment, useEffect, useRef, useState } from "react";
import { getData } from "./data/getData";
import { Listbox, Transition } from "@headlessui/react";
import { MULTIPLIER } from "./constant/multiplier";
import { BsFullscreen, BsArrowsFullscreen } from "react-icons/bs";
import { HiOutlineCube } from "react-icons/hi";
import { VscEmptyWindow } from "react-icons/vsc";
import { DEFAULT_HEAT_COLOR } from "./constant/heatColor";
import { DEFAULT_PERFORMANCE, DEFAULT_SIZE } from "./constant/performance";
import { useHeatMap } from "./hooks/useHeatMap/useHeatMap";

function App() {
  const data = getData();
  const [heatMultiply, setHeatMultiply] = useState(MULTIPLIER[4]);
  const [performance, setPerformance] = useState(DEFAULT_PERFORMANCE[3]);
  const [filterPerformance, setFilterPerformance] = useState<number[]>([]);
  const [sizeBy, setSizeBy] = useState(DEFAULT_SIZE[0]);
  const [dataSequence, setDataSequence] = useState<typeof data>(data);

  //
  const container = useRef<HTMLDivElement>(null);

  const Detail = ({ stock }: { stock?: (typeof data)[0] }) => {
    if (stock === undefined) {
      return <></>;
    }
    return (
      <div className="w-[500px] h-[70px] text-white justify-around gap-3 items-center bg-black bg-opacity-95 rounded-lg border-blue-600 border-opacity-60 border duration-300 flex">
        <div className="flex flex-col gap-1 items-center">
          <span className="text-xs text-gray-400">Name</span>
          {stock?.clip}
        </div>
        <div className="flex flex-col gap-1 items-center">
          <span className="text-xs text-gray-400">Full Name</span>
          {stock?.name}
        </div>
        <div className="flex flex-col gap-1 items-center">
          <span className="text-xs text-gray-400">Percent</span>
          {((stock as any)[performance] as number)?.toFixed(2)}%
        </div>
        <div className="flex flex-col gap-1 items-center">
          <span className="text-xs text-gray-400">Value</span>
          {(+((stock as any)[sizeBy] || 0) / 1.0e9)
            .toFixed(2)
            .toLocaleString() + "B"}
        </div>
      </div>
    );
  };

  const Empty = () => {
    return (
      <div className="flex flex-col gap-1 items-center opacity-70 text-slate-500">
        <VscEmptyWindow className="text-9xl" />
        <span>No data match your criteria</span>
      </div>
    );
  };
  useEffect(() => {
    if (filterPerformance.length === 0) {
      setDataSequence(data);
    } else {
      let filtered: typeof data = [];
      filterPerformance.map((filter) => {
        const filterRange = getRange(filter, heatMultiply);

        const high = Math.max(...filterRange);
        const low = Math.min(...filterRange);

        const filteredData = data.filter((data) => {
          return (
            high > (data as any)[performance] &&
            low < (data as any)[performance]
          );
        });

        filtered = [...filtered, ...filteredData];
      });
      setDataSequence(data.filter((x) => !filtered.includes(x)));
    }
  }, [filterPerformance]);

  const sw = useHeatMap({
    sequence: dataSequence,
    ref: container,
    symbolNameColName: "clip",
    sizedByColName: sizeBy,
    performanceByColName: performance,
    fullNameColName: "name",
    heatMultiply: heatMultiply.value,
    detailComponent: <Detail />,
    emptyComponent: <Empty />,
    heatColor: DEFAULT_HEAT_COLOR,
    groupColName: "group",
  });

  return (
    <div className="w-screen h-screen grid grid-rows-min-One">
      <div>
        <div className="w-full flex flex-row-reverse shadow-sm h-10 justify-between gap-2 px-3">
          <div className="flex   gap-2 px-5 flex-row-reverse ">
            <button className=" h-full  hover:bg-slate-50  border-x  rounded px-3">
              <BsFullscreen />
            </button>
            <div className="flex gap-1 justify-evenly py-2">
              {[-3, -2, -1, 0, 1, 2, 3].map((item, inx) => (
                <div
                  key={inx}
                  onClick={() =>
                    setFilterPerformance((prev) => {
                      return prev.includes(item)
                        ? prev.filter((selected) => item !== selected)
                        : [...prev, item];
                    })
                  }
                  style={{ background: Object.values(DEFAULT_HEAT_COLOR)[inx] }}
                  className={` rounded-md w-10 text-sm px-8 cursor-pointer font-semibold text-white  flex items-center justify-center 
                    ${
                      filterPerformance.includes(item)
                        ? "opacity-20 grayscale "
                        : ""
                    }`}
                >
                  {(item * heatMultiply.value).toFixed(1)}
                </div>
              ))}
            </div>

            <div className="z-50 ">
              <Listbox value={heatMultiply} onChange={setHeatMultiply}>
                <div className="relative h-full ">
                  <Listbox.Button className="relative  rounded border-x h-full px-3 text-left cursor-pointer focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                    <span className="block truncate">{heatMultiply.title}</span>
                  </Listbox.Button>
                  <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options className="absolute right-0 w-[250px] mt-1 max-h-60  overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      {MULTIPLIER.map((item, itemIdx) => (
                        <Listbox.Option
                          key={itemIdx}
                          className={({ active }) =>
                            `relative cursor-default select-none py-2 pl-10 pr-4 ${
                              active
                                ? "bg-amber-100 text-amber-900"
                                : "text-gray-900"
                            }`
                          }
                          value={item}
                        >
                          {({ selected }) => (
                            <>
                              <span
                                className={`block truncate ${
                                  selected ? "font-medium" : "font-normal"
                                }`}
                              >
                                {item.title}
                              </span>
                              {selected ? (
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                  -
                                </span>
                              ) : null}
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </Listbox>
            </div>
          </div>
          <div className="flex   px-2">
            <div className="z-50 ">
              <Listbox value={performance} onChange={setPerformance}>
                <div className="relative h-full ">
                  <Listbox.Button className="relative  rounded border-l h-full px-3 text-left cursor-pointer focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                    <span className="flex justify-center items-center gap-2">
                      <HiOutlineCube className="rotate-45 scale-125" />
                      {performance}, %
                    </span>
                  </Listbox.Button>
                  <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options className="absolute left-0 w-[250px] mt-1 max-h-60  overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      {DEFAULT_PERFORMANCE.map((item, itemIdx) => (
                        <Listbox.Option
                          key={itemIdx}
                          className={({ active }) =>
                            `relative cursor-default select-none py-2 pl-10 pr-4 ${
                              active
                                ? "bg-amber-100 text-amber-900"
                                : "text-gray-900"
                            }`
                          }
                          value={item}
                        >
                          {({ selected }) => (
                            <>
                              <span
                                className={`block truncate ${
                                  selected ? "font-medium" : "font-normal"
                                }`}
                              >
                                Performance {item}, %
                              </span>
                              {selected ? (
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                  -
                                </span>
                              ) : null}
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </Listbox>
            </div>

            <div className="z-50 ">
              <Listbox value={sizeBy} onChange={setSizeBy}>
                <div className="relative h-full ">
                  <Listbox.Button className="relative  rounded border-x h-full px-3 text-left cursor-pointer focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                    <span className="flex justify-center items-center gap-2 truncate">
                      <BsArrowsFullscreen />
                      {sizeBy}
                    </span>
                  </Listbox.Button>
                  <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options className="absolute left-0 w-[250px] mt-1 max-h-60 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      {DEFAULT_SIZE.map((item, itemIdx) => (
                        <Listbox.Option
                          key={itemIdx}
                          className={({ active }) =>
                            `relative cursor-default select-none py-2 pl-10 pr-4 ${
                              active
                                ? "bg-amber-100 text-amber-900"
                                : "text-gray-900"
                            }`
                          }
                          value={item}
                        >
                          {({ selected }) => (
                            <>
                              <span
                                className={`block truncate ${
                                  selected ? "font-medium" : "font-normal"
                                }`}
                              >
                                Size By : {item}
                              </span>
                              {selected ? (
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                  -
                                </span>
                              ) : null}
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </Listbox>
            </div>
          </div>
        </div>
      </div>

      <div className="border-2 relative" ref={container}>
        {sw}
      </div>
    </div>
  );
}

export default App;
function getRange(
  filter: number,
  heatMultiply: { title: string; value: number; description: string }
) {
  const filterEdge =
    filter * heatMultiply.value -
    (heatMultiply.value / 2) * (filter < 0 ? -1 : 1);
  const getFilterMirrorEdge = () => {
    const edge =
      filter >= 0
        ? filterEdge + heatMultiply.value
        : filterEdge - heatMultiply.value;
    if (filter > 0 && filter === 3) {
      return Infinity;
    } else if (filter < 0 && filter === -3) {
      return -Infinity;
    } else {
      return edge;
    }
  };

  const filterMirrorEdge = getFilterMirrorEdge();

  const filterRange = [filterEdge, filterMirrorEdge];
  return filterRange.sort((a, b) => a - b);
}
