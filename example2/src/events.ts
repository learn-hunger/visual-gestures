import { EVgMouseEvents } from "../../src/app/utilities/vg-constants";

export function eventsListeners() {
  let draggingElement: HTMLElement | null = null;
  let disposeEvents: (() => void)[] = [];
  Object.values(
    document.getElementsByClassName(
      "contents",
    ) as HTMLCollectionOf<HTMLElement>,
  ).forEach((folder) => {
    //event callbacks
    const folderPointerEnter = () => {
      folder.style.scale = "1.2";
    };
    const folderPointerLeave = () => {
      folder.style.scale = "1";
    };
    const dragStart = (event: Event) => {
      draggingElement = event.target as HTMLElement;
    };

    folder.addEventListener("dragstart", dragStart);
    folder.addEventListener("mouseenter", folderPointerEnter);
    folder.addEventListener("mouseleave", folderPointerLeave);
    //vg events
    folder.addEventListener(EVgMouseEvents.MOUSE_ENTER, folderPointerEnter);
    folder.addEventListener(EVgMouseEvents.MOUSE_LEAVE, folderPointerLeave);
    //todo dispose events
    const removeEventListeners = () => {
      folder.removeEventListener("dragstart", dragStart);
      folder.removeEventListener("mouseenter", folderPointerEnter);
      folder.removeEventListener("mouseleave", folderPointerLeave);
      //vg events
      folder.removeEventListener(
        EVgMouseEvents.MOUSE_ENTER,
        folderPointerEnter,
      );
      folder.removeEventListener(
        EVgMouseEvents.MOUSE_LEAVE,
        folderPointerLeave,
      );
    };
    disposeEvents.push(removeEventListeners);
  });

  //dustbin
  const bin = document.getElementsByClassName("bin");
  const binContainer = document.getElementById("dustbin-container");
  const binPointerEnter = () => {
    (bin[1] as HTMLElement).style.display = "none";
    (bin[0] as HTMLElement).style.scale = "1.2";
  };
  const binPointerLeave = () => {
    // console.log("drop end");
    (bin[1] as HTMLElement).style.display = "block";
    (bin[0] as HTMLElement).style.scale = "1";
  };
  const binDrop = (event: Event) => {
    console.log("dropping", event);
    event.preventDefault();
    if (draggingElement) {
      draggingElement.style.display = "none";
    }
    binPointerLeave();
  };
  const binDropOver = (event: Event) => {
    event.preventDefault();
    console.log("drop over trigge");
    binPointerEnter();
  };

  binContainer!.addEventListener("mouseenter", binPointerEnter);
  binContainer!.addEventListener("mouseleave", binPointerLeave);
  binContainer!.addEventListener("drop", binDrop);
  binContainer!.addEventListener("dragover", binDropOver);
  bin[0].addEventListener("dragleave", binPointerLeave);

  //vg events
  // binContainer!.addEventListener(EVgMouseEvents.MOUSE_ENTER,binPointerEnter);
  // binContainer!.addEventListener(EVgMouseEvents.MOUSE_LEAVE,binPointerLeave);
  bin[1]!.addEventListener(EVgMouseEvents.MOUSE_ENTER, binPointerEnter);
  bin[0]!.addEventListener(EVgMouseEvents.MOUSE_LEAVE, binPointerLeave);

  const removeEventListeners = () => {
    binContainer!.removeEventListener("mouseenter", binPointerEnter);
    binContainer!.removeEventListener("mouseleave", binPointerLeave);
    binContainer!.removeEventListener("drop", binDrop);
    binContainer!.removeEventListener("dragover", binDropOver);
    bin[0].removeEventListener("dragleave", binPointerLeave);
    //vg dispose
    bin[1]!.removeEventListener(EVgMouseEvents.MOUSE_ENTER, binPointerEnter);
    bin[0]!.removeEventListener(EVgMouseEvents.MOUSE_LEAVE, binPointerLeave);
    disposeEvents.forEach((eachFolderEvents) => {
      eachFolderEvents();
    });
  };
  window.addEventListener("beforeunload", removeEventListeners);
  window.addEventListener("unload", removeEventListeners);
}
