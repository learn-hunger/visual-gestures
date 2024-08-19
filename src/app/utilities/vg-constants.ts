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
  THUMB_CMC,
  THUMB_MCP,
  THUMP_IP,
  THUMB_TIP,
  INDEX_FINGER_MCP,
  INDEX_FINGER_PIP,
  INDEX_FINGER_DIP,
  INDEX_FINGER_TIP,
  MIDDLE_FINGER_MCP,
  MIDDLE_FINGER_PIP,
  MIDDLE_FINGER_DIP,
  MIDDLE_FINGER_TIP,
  RING_FINGER_MCP,
  RING_FINGER_PIP,
  RING_FINGER_DIP,
  RING_FINGER_TIP,
  PINKY_FINGER_MCP,
  PINKY_FINGER_PIP,
  PINKY_FINGER_DIP,
  PINKY_FINGER_TIP,
}

export enum EVgMouseEvents {
  MOUSE_MOVE = "vgPointerMove",
  MOUSE_LEAVE = "vgPointerLeave",
  MOUSE_ENTER = "vgPointerEnter",
}
