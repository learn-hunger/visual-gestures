import { EVgMouseEvents } from "../../utilities/vg-constants";
import { IGestureCustomProps } from "../../utilities/vg-types";
import { ACommonMouseProps } from "./abstract";

export class VgPointerLeave extends ACommonMouseProps {
  constructor(mouseProp: MouseEventInit, customProps: IGestureCustomProps) {
    super(EVgMouseEvents.MOUSE_LEAVE, mouseProp, customProps);
  }
}
