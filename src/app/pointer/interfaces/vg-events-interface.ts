import { IEvents, IGestureCustomProps } from "../../utilities/vg-types";
import { VgPointerEnter } from "../custom-events/vg-pointer-enter";
import { VgPointerLeave } from "../custom-events/vg-pointer-leave";
import { VgPointerMove } from "../custom-events/vg-pointer-move";
import { VgPointerDown } from "../custom-events/vg-pointer-down";
import { VgPointerUp } from "../custom-events/vg-pointer-up";
import { VgPointerClick } from "../custom-events/vg-pointer-click";
import { VgPointerDrop } from "../custom-events/vg-pointer-drop";
import { VgPointerDrag } from "../custom-events/vg-pointer-drag";

export type TEvents =
  | VgPointerMove
  | VgPointerEnter
  | VgPointerLeave
  | VgPointerDown
  | VgPointerUp
  | VgPointerClick
  | VgPointerDrop
  | VgPointerDrag;
export interface IVgPointerEvents
  extends IVgPointerMove,
    IVgPointerEnter,
    IVgPointerLeave,
    IVgPointerDown,
    IVgPointerUp,
    IVgPointerClick,
    IVgPointerDrag,
    IVgPointerDrop {
  dispatch(element: HTMLElement, event: TEvents): void;
  dispose(): void;
}

/**
 * Pointer move handlers
 */
interface IVgPointerMove {
  vgPointerMove: VgPointerMove;
  _onPointerMoveCallback?: IEvents["onPointerMove"];
  set onPointerMove(callback: IEvents["onPointerMove"]);
  get onPointerMove(): IEvents["onPointerMove"];
  triggerMouseMove(mouseInit: MouseEventInit, props: IGestureCustomProps): void;
}

/**
 * Pointer Enter handlers
 */
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

/**
 * pointerLeave handlers
 */
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

/**
 * Pointer down handlers
 */
interface IVgPointerDown {
  vgPointerDown: VgPointerDown;
  _onPointerDownCallback?: IEvents["onPointerDown"];
  set onPointerDown(callback: IEvents["onPointerDown"]);
  get onPointerDown(): IEvents["onPointerDown"];
  triggerMouseDown(mouseInit: MouseEventInit, props: IGestureCustomProps): void;
}

/**
 * Pointer up handlers
 */
interface IVgPointerUp {
  vgPointerUp: VgPointerUp;
  _onPointerUpCallback?: IEvents["onPointerUp"];
  set onPointerUp(callback: IEvents["onPointerUp"]);
  get onPointerUp(): IEvents["onPointerUp"];
  triggerMouseUp(mouseInit: MouseEventInit, props: IGestureCustomProps): void;
}

/**
 * Pointer click handlers
 */
interface IVgPointerClick {
  vgPointerClick: VgPointerClick;
  _onPointerClickCallback?: IEvents["onPointerClick"];
  set onPointerClick(callback: IEvents["onPointerClick"]);
  get onPointerClick(): IEvents["onPointerClick"];
  triggerMouseClick(
    mouseInit: MouseEventInit,
    props: IGestureCustomProps,
  ): void;
}

/**
 * Pointer drop handlers
 */
interface IVgPointerDrop {
  vgPointerDrop: VgPointerDrop;
  _onPointerDropCallback?: IEvents["onPointerDrop"];
  set onPointerDrop(callback: IEvents["onPointerDrop"]);
  get onPointerDrop(): IEvents["onPointerDrop"];
  triggerMouseDrop(mouseInit: MouseEventInit, props: IGestureCustomProps): void;
}

/**
 * Pointer drag handlers
 */
interface IVgPointerDrag {
  vgPointerDrag: VgPointerDrag;
  _onPointerDragCallback?: IEvents["onPointerDrag"];
  set onPointerDrag(callback: IEvents["onPointerDrag"]);
  get onPointerDrag(): IEvents["onPointerDrag"];
  triggerMouseDrag(mouseInit: MouseEventInit, props: IGestureCustomProps): void;
}
