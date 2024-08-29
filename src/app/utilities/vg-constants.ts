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
  MOUSE_MOVE = "vgPointerMove",
  MOUSE_LEAVE = "vgPointerLeave",
  MOUSE_ENTER = "vgPointerEnter",
}

export enum EFingers {
  WRIST,
  THUMB,
  INDEX,
  MIDDLE,
  RING,
  PINKY,
}
