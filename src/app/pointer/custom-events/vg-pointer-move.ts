import { DefaultConfig } from "../../config/defalut-config";
import { EVgMouseEvents } from "../../utilities/vg-constants";
import { IGestureCustomProps } from "../../utilities/vg-types";
import { ACommonMouseProps } from "../abstracts/vg-pointer-props-abstract";
import { IVgCommonMethods } from "../interfaces/vg-common-event-methods";

export class VgPointerMove
  extends ACommonMouseProps
  implements IVgCommonMethods
{
  constructor(mouseProp: MouseEventInit, customProps: IGestureCustomProps) {
    super(EVgMouseEvents.MOUSE_MOVE, mouseProp, customProps);
    // this.setCursor();
    this.moveCursor();
  }

  setCursor(): void {
    const { path, scale, showCursor } =
      DefaultConfig.instance.cursor.vgpointermove;
    const { baseURI } = DefaultConfig.instance.cursor;
    if (showCursor && this.cursorElement.src != baseURI + path) {
      // console.log(this.cursorElement.src, baseURI + path, "cursor");
      this.cursorElement.src = path;
      this.cursorElement.style.scale = scale.toString();
    }
  }

  moveCursor() {
    this.cursorElement.style.left = this.clientX.toString() + "px";
    this.cursorElement.style.top = this.clientY.toString() + "px";
  }
}
