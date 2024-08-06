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
}
export const x = {
  thumb: EHandLandmarks,
};
