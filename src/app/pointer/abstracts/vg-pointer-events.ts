import { IEvents, IGestureCustomProps } from "../../utilities/vg-types";
import { IVgPointerEvents, TEvents } from "../interfaces/vg-events-interface";
import { VgPointerEnter } from "../custom-events/vg-pointer-enter";
import { VgPointerLeave } from "../custom-events/vg-pointer-leave";
import { VgPointerMove } from "../custom-events/vg-pointer-move";

export abstract class AVgPointerEvents implements IVgPointerEvents {
  vgPointerMove!: VgPointerMove;
  vgPointerEnter!: VgPointerEnter;
  vgPointerLeave!: VgPointerLeave;
  _onPointerMoveCallback?: IEvents["onPointerMove"];
  _onPointerEnterCallback?: IEvents["onPointerEnter"];
  _onPointerLeaveCallback?: IEvents["onPointerLeave"];

  set onPointerMove(callback: IEvents["onPointerMove"]) {
    this._onPointerMoveCallback = callback;
  }

  set onPointerEnter(callback: IEvents["onPointerEnter"]) {
    this._onPointerEnterCallback = callback;
  }

  set onPointerLeave(callback: IEvents["onPointerLeave"]) {
    this._onPointerLeaveCallback = callback;
  }

  get onPointerMove(): IEvents["onPointerMove"] {
    return this._onPointerMoveCallback!;
  }

  get onPointerEnter(): IEvents["onPointerEnter"] {
    return this._onPointerEnterCallback!;
  }

  get onPointerLeave(): IEvents["onPointerLeave"] {
    return this._onPointerLeaveCallback!;
  }

  dispatch(element: HTMLElement, event: TEvents) {
    element?.dispatchEvent(event);
  }

  triggerMouseMove(mouseInit: MouseEventInit, props: IGestureCustomProps) {
    this.vgPointerMove = new VgPointerMove(mouseInit, props);
    this.dispatch(
      this.vgPointerMove?.element?.from as HTMLElement,
      this.vgPointerMove,
    );
    this.onPointerMove && this.onPointerMove();
  }
  triggerMouseEnter(mouseInit: MouseEventInit, props: IGestureCustomProps) {
    this.vgPointerEnter = new VgPointerEnter(mouseInit, props);
    console.log("hello world",      this.vgPointerEnter?.element?.to as HTMLElement,
    )
    this.dispatch(
      this.vgPointerEnter?.element?.to as HTMLElement,
      this.vgPointerEnter,
    );
    this.onPointerEnter && this.onPointerEnter();
  }

  triggerMouseLeave(mouseInit: MouseEventInit, props: IGestureCustomProps) {
    this.vgPointerLeave = new VgPointerLeave(mouseInit, props);
    this.dispatch(
      this.vgPointerLeave?.element?.from as HTMLElement,
      this.vgPointerLeave,
    );
    this.onPointerLeave && this.onPointerLeave();
  }
}
