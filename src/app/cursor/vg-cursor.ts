import { DefaultConfig } from "../config/defalut-config";
import { cursorStyle } from "../utilities/vg-constants";
import { IElementsSizes } from "../utilities/vg-types";

/**
 * Hanldes UI of the cursor element and container element
 */
class CursorDom {
  container: HTMLElement;
  cursor: HTMLImageElement;
  constructor(container: HTMLElement = document.body) {
    this.container = container;
    this.cursor = document.createElement("img");
    this.cursor.setAttribute("id", "vg-cursor-container");
    this.cursor.src = DefaultConfig.instance.cursor.default.path;
    this.createDom();
  }

  createDom() {
    this.cursor.style.cssText = cursorStyle.replace(/\n/g, "");
  }
}

/**
 * It contains all the properties of the cursor element
 */
export class CursorObject extends CursorDom {
  public _showCursor: boolean;
  //@ts-ignore
  //source path of the cursor image
  private _cursorPath: string;
  //@ts-ignore
  //scale of the cursor image
  private _cursorScale: number;

  /**
   * width and height of the cursor and whole container
   *by default container is body
   * @public
   * @type {IElementsSizes}
   */
  public sizes: IElementsSizes;
  constructor(container: HTMLElement = DefaultConfig.instance.cursorContainer) {
    super(container);
    //TODO dynamically set the cursor from the parameters send from main class
    const cursor = DefaultConfig.instance.cursor;
    this._cursorPath = cursor.default.path;
    this._cursorScale = cursor.default.scale;
    this._showCursor = cursor.showCursor;
    this.toggleCursor();
    this.sizes = this.initialiseSizes();
    //removal is being handled AvgCommon class
    window.addEventListener("resize", this.initialiseSizes);
  }

  //setter to toggle visibility of cursor
  set showCursor(check: boolean) {
    this._showCursor = check;
    this.toggleCursor();
  }

  // set cursorPath(path: string) {
  //   this._cursorPath = path;
  //   this.cursor.src = path;
  // }

  // set cursorScale(scale: number) {
  //   this._cursorScale = scale;
  //   this.cursor.style.scale = scale.toString();
  // }

  /**
   * based on the _showCursor property change
   * the visibility of the cursor
   * @type {*}
   */
  toggleCursor() {
    // toggleCursor
    this._showCursor
      ? this.container.appendChild(this.cursor)
      : this.cursor.remove();
  }

  /**
   * protected from the external classes or developer usage
   * It initalises the sizes of the cursor and container
   * gets updated with resizing screens by resize event
   * @returns
   */
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
