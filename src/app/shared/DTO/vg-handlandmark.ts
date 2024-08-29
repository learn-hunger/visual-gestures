import { EHandLandmarks } from "../../utilities/vg-constants";
import {
  TFingersData,
  TFingersState,
  INormalizedLandmark,
} from "../../utilities/vg-types-handlandmarks";

/**
 * Data type object to manage and extract landmarks
 * as a group
 * example :
 * const l:INormalizedLandmark[]=[{x:0,y:0,z:0}];
 * const n=new VgHandLandmarksDTO(l)
 * n.data.INDEX.DIP.x
 */
export class VgHandLandmarksDTO {
  data: TFingersData;
  state: TFingersState;
  constructor(landmarks: INormalizedLandmark[]) {
    this.data = {
      WRIST: {
        WRIST: landmarks[EHandLandmarks.WRIST],
      },
      THUMB: {
        MCP: landmarks[EHandLandmarks.THUMB_MCP],
        PIP: landmarks[EHandLandmarks.THUMB_PIP],
        DIP: landmarks[EHandLandmarks.THUMP_DIP],
        TIP: landmarks[EHandLandmarks.THUMB_TIP],
      },
      INDEX: {
        MCP: landmarks[EHandLandmarks.INDEX_MCP],
        PIP: landmarks[EHandLandmarks.INDEX_PIP],
        DIP: landmarks[EHandLandmarks.INDEX_DIP],
        TIP: landmarks[EHandLandmarks.INDEX_TIP],
      },
      MIDDLE: {
        MCP: landmarks[EHandLandmarks.MIDDLE_MCP],
        PIP: landmarks[EHandLandmarks.MIDDLE_PIP],
        DIP: landmarks[EHandLandmarks.MIDDLE_DIP],
        TIP: landmarks[EHandLandmarks.MIDDLE_TIP],
      },
      RING: {
        MCP: landmarks[EHandLandmarks.RING_MCP],
        PIP: landmarks[EHandLandmarks.RING_PIP],
        DIP: landmarks[EHandLandmarks.RING_DIP],
        TIP: landmarks[EHandLandmarks.RING_TIP],
      },
      PINKY: {
        MCP: landmarks[EHandLandmarks.PINKY_MCP],
        PIP: landmarks[EHandLandmarks.PINKY_PIP],
        DIP: landmarks[EHandLandmarks.PINKY_DIP],
        TIP: landmarks[EHandLandmarks.PINKY_TIP],
      },
    };
    this.state = {
      WRIST: 0,
      THUMB: 0,
      INDEX: 0,
      PINKY: 0,
      RING: 0,
      MIDDLE: 0,
    };
  }
}
