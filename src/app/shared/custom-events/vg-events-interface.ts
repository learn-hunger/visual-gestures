import { IEvents, IGestureCustomProps } from "../../utilities/vg-types";
import { VgPointerEnter } from "./vg-pointer-enter";
import { VgPointerLeave } from "./vg-pointer-leave";
import { VgPointerMove } from "./vg-pointer-move";

export type TEvents = VgPointerMove | VgPointerEnter | VgPointerLeave;
export interface IVgPointerEvents
  extends IVgPointerMove,
    IVgPointerEnter,
    IVgPointerLeave {
  dispatch(element: HTMLElement, event: TEvents): void;
}

interface IVgPointerMove {
  vgPointerMove: VgPointerMove;
  _onPointerMoveCallback?: IEvents["onPointerMove"];
  set onPointerMove(callback: IEvents["onPointerMove"]);
  get onPointerMove(): IEvents["onPointerMove"];
  triggerMouseMove(mouseInit: MouseEventInit, props: IGestureCustomProps): void;
}

interface IVgPointerEnter {
  vgPointerEnter: VgPointerEnter;
  _onPointerEnterCallback?: IEvents["onPointerEnter"];
  set onPointerEnter(callback: IEvents["onPointerEnter"]);
  get onPointerEnter(): IEvents["onPointerEnter"];
  triggerMouseEnter(
    mouseInit: MouseEventInit,
    props: IGestureCustomProps,
  ): void;
}

interface IVgPointerLeave {
  vgPointerLeave: VgPointerLeave;
  _onPointerLeaveCallback?: IEvents["onPointerLeave"];
  set onPointerLeave(callback: IEvents["onPointerLeave"]);
  get onPointerLeave(): IEvents["onPointerLeave"];
  triggerMouseLeave(
    mouseInit: MouseEventInit,
    props: IGestureCustomProps,
  ): void;
}
