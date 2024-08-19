import { DefaultConfig } from "../../config/defalut-config";
import { cursorStyle } from "../../utilities/vg-constants";
import { IElementsSizes } from "../../utilities/vg-types";
import { INormalizedLandmark } from "../../utilities/vg-types-handlandmarks";

export class CursorDom {
  container: HTMLElement;
  cursor: HTMLImageElement;
  constructor(container: HTMLElement = document.body) {
    this.container = container;
    this.cursor = document.createElement("img");
    this.cursor.setAttribute("id", "vg-cursor-container");
    this.cursor.src = DefaultConfig.instance.cursor.path;
    this.createDom();
  }

  createDom() {
    this.cursor.style.cssText = cursorStyle.replace(/\n/g, "");
  }
}

export class CursorObject extends CursorDom {
  public _showCursor: boolean;
  private _cursorPath: string;
  private _cursorScale: number;
  protected sizes: IElementsSizes;
  constructor(container: HTMLElement = DefaultConfig.instance.cursorContainer) {
    super(container);
    const cursor = DefaultConfig.instance.cursor;
    this._cursorPath = cursor.path;
    this._cursorScale = cursor.scale;
    this._showCursor = cursor.showCursor;
    this.toggleCursor();
    this.sizes = this.initialiseSizes();
    window.addEventListener("resize", this.initialiseSizes);
  }

  set showCursor(check: boolean) {
    this._showCursor = check;
    this.toggleCursor();
  }
  set cursorPath(path: string) {
    this._cursorPath = path;
    this.cursor.src = path;
  }

  set cursorScale(scale: number) {
    this._cursorScale = scale;
    this.cursor.style.scale = scale.toString();
  }

  toggleCursor() {
    // toggleCursor
    this._showCursor
      ? this.container.appendChild(this.cursor)
      : this.cursor.remove();
  }

  protected initialiseSizes = () => {
    this.sizes = {
      container: {
        clientWidth: this.container.clientWidth,
        clientHeight: this.container.clientHeight,
      },
      cursor: {
        clientWidth: this.cursor.clientWidth,
        clientHeight: this.cursor.clientHeight,
      },
    };
    return this.sizes;
  };
}

export abstract class AVgCommon extends CursorObject {
  abstract detect(landmark: INormalizedLandmark[], timestamp: number): void;

  dispose() {
    window.addEventListener("resize", this.initialiseSizes);
  }
}
