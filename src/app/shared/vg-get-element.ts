import { IElementsSizes } from "../utilities/vg-types";
import { INormalizedLandmark } from "../utilities/vg-types-handlandmarks";

export function getElementCoordinatesFromLandmark(
  landmark: INormalizedLandmark,
  sizes: IElementsSizes,
): Pick<INormalizedLandmark, "x" | "y"> {
  const { x: pointerX, y: pointerY } = landmark;
  const { clientWidth: cursorX, clientHeight: cursorY } = sizes.cursor;
  const { clientWidth: containerX, clientHeight: containerY } = sizes.container;
  const clientX = Math.min((1 - pointerX) * containerX, containerX - cursorX);
  const clientY = Math.min(pointerY * containerY, containerY - cursorY);
  return { x: clientX, y: clientY };
}
