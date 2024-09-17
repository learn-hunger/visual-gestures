import { IEvents, IGestureCustomProps } from "../../utilities/vg-types";
import { IVgPointerEvents, TEvents } from "../interfaces/vg-events-interface";
import { VgPointerEnter } from "../custom-events/vg-pointer-enter";
import { VgPointerLeave } from "../custom-events/vg-pointer-leave";
import { VgPointerMove } from "../custom-events/vg-pointer-move";
import { VgPointerDown } from "../custom-events/vg-pointer-down";
import { VgPointerUp } from "../custom-events/vg-pointer-up";
import { VgPointerClick } from "../custom-events/vg-pointer-click";
import { VgPointerDrop } from "../custom-events/vg-pointer-drop";
import { VgPointerDrag } from "../custom-events/vg-pointer-drag";

export abstract class AVgPointerEvents implements IVgPointerEvents {
  /**
   * common utility
   * @param element
   * @param event
   */
  dispatch(element: HTMLElement, event: TEvents) {
    element?.dispatchEvent(event);
  }

  dispose(): void {
    this._onPointerEnterCallback = undefined;
    this._onPointerLeaveCallback = undefined;
    this._onPointerMoveCallback = undefined;

    this._onPointerDownCallback = undefined;
    this._onPointerUpCallback = undefined;
    this._onPointerClickCallback = undefined;

    this._onPointerDragCallback = undefined;
    this._onPointerDropCallback = undefined;
  }
  /**
   * When mouse is moved
   *
   * @type {!VgPointerMove}
   */
  vgPointerMove!: VgPointerMove;
  _onPointerMoveCallback?: IEvents["onPointerMove"];
  set onPointerMove(callback: IEvents["onPointerMove"]) {
    this._onPointerMoveCallback = callback;
  }

  get onPointerMove(): IEvents["onPointerMove"] {
    return this._onPointerMoveCallback!;
  }

  triggerMouseMove(mouseInit: MouseEventInit, props: IGestureCustomProps) {
    this.vgPointerMove = new VgPointerMove(mouseInit, props);
    this.dispatch(
      this.vgPointerMove?.element?.from as HTMLElement,
      this.vgPointerMove,
    );
    this.onPointerMove && this.onPointerMove(this.vgPointerMove);
  }

  //-------------------------End of Mouse Move------------//

  /**
   * When mouse is Enter into an element
   *
   * @type {!VgPointerEnter}
   */
  vgPointerEnter!: VgPointerEnter;
  _onPointerEnterCallback?: IEvents["onPointerEnter"];
  set onPointerEnter(callback: IEvents["onPointerEnter"]) {
    this._onPointerEnterCallback = callback;
  }
  get onPointerEnter(): IEvents["onPointerEnter"] {
    return this._onPointerEnterCallback!;
  }

  triggerMouseEnter(mouseInit: MouseEventInit, props: IGestureCustomProps) {
    this.vgPointerEnter = new VgPointerEnter(mouseInit, props);
    this.dispatch(
      this.vgPointerEnter?.element?.to as HTMLElement,
      this.vgPointerEnter,
    );
    this.onPointerEnter && this.onPointerEnter(this.vgPointerEnter);
  }

  //--------------------End of mouse enter -------------------//

  /**
   * when mouse is leaved from an element
   *
   * @type {!VgPointerLeave}
   */
  vgPointerLeave!: VgPointerLeave;
  _onPointerLeaveCallback?: IEvents["onPointerLeave"];
  set onPointerLeave(callback: IEvents["onPointerLeave"]) {
    this._onPointerLeaveCallback = callback;
  }
  get onPointerLeave(): IEvents["onPointerLeave"] {
    return this._onPointerLeaveCallback!;
  }

  triggerMouseLeave(mouseInit: MouseEventInit, props: IGestureCustomProps) {
    this.vgPointerLeave = new VgPointerLeave(mouseInit, props);
    this.dispatch(
      this.vgPointerLeave?.element?.from as HTMLElement,
      this.vgPointerLeave,
    );
    this.onPointerLeave && this.onPointerLeave(this.vgPointerLeave);
  }

  //------------------End of mouse Leave ---------//

  ///# static events

  /**
   * when mouse Down
   *
   * @type {!VgPointerDown}
   */
  vgPointerDown!: VgPointerDown;
  _onPointerDownCallback?: IEvents["onPointerDown"];
  set onPointerDown(callback: IEvents["onPointerDown"]) {
    this._onPointerDownCallback = callback;
  }
  get onPointerDown(): IEvents["onPointerDown"] {
    return this._onPointerDownCallback!;
  }

  triggerMouseDown(mouseInit: MouseEventInit, props: IGestureCustomProps) {
    this.vgPointerDown = new VgPointerDown(mouseInit, props);
    this.dispatch(
      this.vgPointerDown?.element?.from as HTMLElement,
      this.vgPointerDown,
    );
    this.onPointerDown && this.onPointerDown(this.vgPointerDown);
  }
  //--------------end of mouse Down----------

  /**
   * when mouse Up
   *
   * @type {!VgPointerUp}
   */
  vgPointerUp!: VgPointerUp;
  _onPointerUpCallback?: IEvents["onPointerUp"];
  set onPointerUp(callback: IEvents["onPointerUp"]) {
    this._onPointerUpCallback = callback;
  }
  get onPointerUp(): IEvents["onPointerUp"] {
    return this._onPointerUpCallback!;
  }

  triggerMouseUp(mouseInit: MouseEventInit, props: IGestureCustomProps) {
    this.vgPointerUp = new VgPointerUp(mouseInit, props);
    this.dispatch(
      this.vgPointerUp?.element?.from as HTMLElement,
      this.vgPointerUp,
    );
    this.onPointerUp && this.onPointerUp(this.vgPointerUp);
  }
  //--------------end of mouse Up----------

  /**
   * when mouse Click
   *
   * @type {!VgPointerClick}
   */
  vgPointerClick!: VgPointerClick;
  _onPointerClickCallback?: IEvents["onPointerClick"];
  set onPointerClick(callback: IEvents["onPointerClick"]) {
    this._onPointerClickCallback = callback;
  }
  get onPointerClick(): IEvents["onPointerClick"] {
    return this._onPointerClickCallback!;
  }

  triggerMouseClick(mouseInit: MouseEventInit, props: IGestureCustomProps) {
    this.vgPointerClick = new VgPointerClick(mouseInit, props);
    this.dispatch(
      this.vgPointerClick?.element?.clickElement as HTMLElement,
      this.vgPointerClick,
    );
    this.onPointerClick && this.onPointerClick(this.vgPointerClick);
  }
  //--------------end of mouse Click----------

  /**
   * when mouse Drop
   *
   * @type {!VgPointerDrop}
   */
  vgPointerDrop!: VgPointerDrop;
  _onPointerDropCallback?: IEvents["onPointerDrop"];
  set onPointerDrop(callback: IEvents["onPointerDrop"]) {
    this._onPointerDropCallback = callback;
  }
  get onPointerDrop(): IEvents["onPointerDrop"] {
    return this._onPointerDropCallback!;
  }

  triggerMouseDrop(mouseInit: MouseEventInit, props: IGestureCustomProps) {
    this.vgPointerDrop = new VgPointerDrop(mouseInit, props);
    this.dispatch(
      this.vgPointerDrop?.element?.dropElement as HTMLElement,
      this.vgPointerDrop,
    );
    this.onPointerDrop && this.onPointerDrop(this.vgPointerDrop);
  }
  //--------------end of mouse Drop----------

  /**
   * when mouse Drag
   *
   * @type {!VgPointerDrag}
   */
  vgPointerDrag!: VgPointerDrag;
  _onPointerDragCallback?: IEvents["onPointerDrag"];
  set onPointerDrag(callback: IEvents["onPointerDrag"]) {
    this._onPointerDragCallback = callback;
  }
  get onPointerDrag(): IEvents["onPointerDrag"] {
    return this._onPointerDragCallback!;
  }

  triggerMouseDrag(mouseInit: MouseEventInit, props: IGestureCustomProps) {
    this.vgPointerDrag = new VgPointerDrag(mouseInit, props);
    this.dispatch(
      this.vgPointerDrag?.element?.dragElement as HTMLElement,
      this.vgPointerDrag,
    );
    this.onPointerDrag && this.onPointerDrag(this.vgPointerDrag);
  }
  //--------------end of mouse Drag----------
}
