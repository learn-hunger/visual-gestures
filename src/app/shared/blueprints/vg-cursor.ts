import { DefaultConfig } from "../../config/defalut-config";
import { cursorParentStyle, cursorStyle } from "../../utilities/vg-constants";
import {
  IHandLandmarkerResult,
  INormalizedLandmark,
} from "../../utilities/vg-types-handlandmarks";

export class CursorDom {
  container: HTMLElement;
  parent: HTMLElement;
  cursor: HTMLImageElement;
  constructor(container: HTMLElement = document.body) {
    this.container = container;
    this.parent = document.createElement("div");
    this.cursor = document.createElement("img");
    this.cursor.src = DefaultConfig.instance.cursor.path;
    this.parent.appendChild(this.cursor);
    this.createDom();
  }

  createDom() {
    this.parent.style.cssText = cursorParentStyle.replace(/\n/g, "");
    this.cursor.style.cssText = cursorStyle.replace(/\n/g, "");
    // console.log("hell",cursorParentStyle.replace(/\n/g,''))
    // this.container.appendChild(this.parent);
  }
}

export class CursorObject extends CursorDom {
  _showCursor: boolean;
  _cursorPath: string;
  _cursorScale: number;
  constructor(
    // path: string = DefaultConfig.instance.cursor.path,
    // scale = DefaultConfig.instance.cursor.scale,
    // showCursor = DefaultConfig.instance.cursor.showCursor,
    container: HTMLElement = DefaultConfig.instance.cursorContainer,
  ) {
    super(container);
    const cursor = DefaultConfig.instance.cursor;
    this._cursorPath = cursor.path;
    this._cursorScale = cursor.scale;
    this._showCursor = cursor.showCursor;
    this.handleCursor();
  }

  set showCursor(check: boolean) {
    this._showCursor = check;
    this.handleCursor();
  }
  set cursorPath(path: string) {
    this._cursorPath = path;
    this.cursor.src = path;
  }

  set cursorScale(scale: number) {
    this._cursorScale = scale;
    this.cursor.style.scale = scale.toString();
  }

  handleCursor() {
    // handleCursor
    this._showCursor
      ? this.container.appendChild(this.parent)
      : this.parent.remove();
  }
}

export abstract class AVgCommon extends CursorObject {
  // abstract detect():void;
  abstract detect(landmark: INormalizedLandmark[][]): void;
}
