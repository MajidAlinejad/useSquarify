import { RefObject, useEffect, useState } from "react";
import { isAspectRatioImproved } from "../../functions/getImprovedAspectRatio/getImprovedAspectRatio";
import { getScaledSequenceBy } from "../../functions/getScaledSequence/getScaledSequence";

import { getSumBy } from "../../functions/getSumBy/getSumBy";
import {
  IUnionCoordinates,
  getCoordinates,
} from "../../functions/getCoordinates/getCoordinates";
import { getRemainArea } from "../../functions/getRemainArea/getRemainArea";
import { useHTMLElementSize } from "../useWindowSize/useWindowSize";

export const useSquarified = <T,>(
  sequence: T[],
  ref: RefObject<HTMLElement>,
  index: string,
  telorance?: number
) => {
  const [x, y] = useHTMLElementSize(ref.current);
  const [squarified, setSquarified] = useState<
    (T & IScaledValue & IUnionCoordinates)[]
  >([]);

  useEffect(() => {
    const sortSequence = sequence.sort(
      (a, b) => (b as any)[index] - (a as any)[index]
    );
    const sqr = getSquarified(
      sortSequence,
      {
        x0: 2,
        y0: 2,
        x1: x - 2,
        y1: y - 2,
      },
      index,
      telorance
    );
    setSquarified(sqr);
  }, [x, y, index, sequence]);

  return squarified;
};

export const getSquarified = <T,>(
  sequence: T[],
  rect: IMRect,
  index: string,
  telorance?: number
): (T & IScaledValue & IUnionCoordinates)[] => {
  let currentRow: (T & IScaledValue)[] = [];
  let tempSequence = getScaledSequenceBy(sequence, rect.y1 * rect.x1, index);
  let tempRect = rect;
  let stack: (T & IScaledValue & IUnionCoordinates)[] = [];

  while (true) {
    if (tempSequence.length === 0) {
      const newCoordinates = getCoordinates(currentRow, rect);
      const newStack: (T & IScaledValue & IUnionCoordinates)[] =
        stack.concat(newCoordinates);
      return newStack;
    }

    const currentArea = tempSequence[0];
    const restData = tempSequence.slice(1, tempSequence.length);
    if (
      isAspectRatioImproved(currentRow, tempRect, tempSequence, telorance)[0]
    ) {
      const newRow = currentRow.concat(currentArea);
      tempSequence = restData;
      currentRow = newRow;
    } else {
      const sum = getSumBy(currentRow, "scaledValue");
      const newContainer = getRemainArea(rect, sum);
      const newCoordinates = getCoordinates(currentRow, rect);
      const newStack = stack.concat(newCoordinates);
      currentRow = [];
      rect = newContainer;
      stack = newStack;
    }
  }
};
