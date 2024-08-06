import { ICursorProp } from "../utilities/vg-types";
export class DefaultConfig {
  private static defaultConfig: DefaultConfig;
  cursor: ICursorProp;
  cursorContainer: HTMLElement;
  private constructor() {
    this.cursor = {
      path: "https://img.icons8.com/?size=100&id=s3JOUU9Yp36E&format=png&color=000000",
      scale: 1,
      showCursor: true,
    };
    this.cursorContainer = document.body;
  }

  static get instance() {
    if (!DefaultConfig.defaultConfig) {
      DefaultConfig.defaultConfig = new DefaultConfig();
    }
    return DefaultConfig.defaultConfig;
  }
}
