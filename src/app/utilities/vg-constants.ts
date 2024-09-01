export const cursorParentStyle = `
    position:absolute;
    width:100%;
    height:100%;
    top:0;
    left:0;
`;

export const cursorStyle = `
    position:absolute;
    left:50%;
    top:50%;
    width:64px;
    height:64px;
    scale:1;
`;
export enum EHandLandmarks {
  WRIST,
  THUMB_MCP,
  THUMB_PIP,
  THUMP_DIP,
  THUMB_TIP,
  INDEX_MCP,
  INDEX_PIP,
  INDEX_DIP,
  INDEX_TIP,
  MIDDLE_MCP,
  MIDDLE_PIP,
  MIDDLE_DIP,
  MIDDLE_TIP,
  RING_MCP,
  RING_PIP,
  RING_DIP,
  RING_TIP,
  PINKY_MCP,
  PINKY_PIP,
  PINKY_DIP,
  PINKY_TIP,
}

export enum EVgMouseEvents {
  //motion events
  MOUSE_MOVE = "vgpointermove",
  MOUSE_LEAVE = "vgpointerleave",
  MOUSE_ENTER = "vgpointerenter",
  //static events
  MOUSE_DOWN = "vgpointerdown",
  MOUSE_UP = "vgpointerup",
  MOUSE_CLICK = "vgpointerclick",
  MOUSE_DROP = "vgpointerdrop",
  //both motion and static events
  MOUSE_DRAG = "vgpointerdrag",
}

export enum EFingers {
  WRIST,
  THUMB,
  INDEX,
  MIDDLE,
  RING,
  PINKY,
}
