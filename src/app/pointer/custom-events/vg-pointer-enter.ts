import { DefaultConfig } from "../../config/defalut-config";
import { EVgMouseEvents } from "../../utilities/vg-constants";
import { IGestureCustomProps } from "../../utilities/vg-types";
import { ACommonMouseProps } from "../abstracts/vg-pointer-props-abstract";

export class VgPointerEnter extends ACommonMouseProps {
  constructor(mouseProp: MouseEventInit, customProps: IGestureCustomProps) {
    super(EVgMouseEvents.MOUSE_ENTER, mouseProp, customProps);
    // this.setCursor();
  }
  //TODO
  setCursor(): void {
    const { path, scale, showCursor } =
      DefaultConfig.instance.cursor.vgpointerenter;
    const { baseURI } = DefaultConfig.instance.cursor;
    if (showCursor && this.cursorElement.src != baseURI + path) {
      this.cursorElement.src = path;
      this.cursorElement.style.scale = scale.toString();
    }
  }
}
