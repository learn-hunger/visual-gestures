import { VgPointerDrag } from "../../src/app/pointer/custom-events/vg-pointer-drag";
import { VgPointerDrop } from "../../src/app/pointer/custom-events/vg-pointer-drop";
import { EVgMouseEvents } from "../../src/app/utilities/vg-constants";

export function eventsListeners() {
  let draggingElement: HTMLElement | null = null;
  let disposeEvents: (() => void)[] = [];
  const modalPreview = document.getElementById("preview-content");
  const content = ["Folder", "javascript", "python", "pdf", "html"];
  Object.values(
    document.getElementsByClassName(
      "contents",
    ) as HTMLCollectionOf<HTMLElement>,
  ).forEach((folder, index) => {
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
    const folderClick = () => {
      modalPreview!.innerHTML = content[index];
      showModal();
    };
    const pdfClick = () => {
      modalPreview!.innerHTML = content[index];
      showModal();
    };
    const showModal = () => {
      closeModal();
      modal!.style.display = "block";
    };
    const onPointerDrag = (event: Event) => {
      const props = event as VgPointerDrag;
      const { clientX, clientY } = props;
      folder.style.left = clientX.toString() + "px";
      folder.style.top = clientY.toString() + "px";
    };

    folder.addEventListener("dragstart", dragStart);
    folder.addEventListener("mouseenter", folderPointerEnter);
    folder.addEventListener("mouseleave", folderPointerLeave);
    //vg events
    folder.addEventListener(EVgMouseEvents.MOUSE_ENTER, folderPointerEnter);
    folder.addEventListener(EVgMouseEvents.MOUSE_LEAVE, folderPointerLeave);
    const containsFolder = folder.className.includes("folder");
    if (containsFolder) {
      folder.addEventListener("click", folderClick);
      folder.addEventListener(EVgMouseEvents.MOUSE_CLICK, folderClick);
    } else {
      //pdf
      folder.addEventListener("click", pdfClick);
      folder.addEventListener(EVgMouseEvents.MOUSE_CLICK, pdfClick);
    }

    folder.addEventListener(EVgMouseEvents.MOUSE_DRAG, onPointerDrag);
    //todo dispose events
    const removeEventListeners = () => {
      folder.removeEventListener("dragstart", dragStart);
      folder.removeEventListener("mouseenter", folderPointerEnter);
      folder.removeEventListener("mouseleave", folderPointerLeave);
      folder.removeEventListener(EVgMouseEvents.MOUSE_DRAG, onPointerDrag);

      //vg events
      folder.removeEventListener(
        EVgMouseEvents.MOUSE_ENTER,
        folderPointerEnter,
      );
      folder.removeEventListener(
        EVgMouseEvents.MOUSE_LEAVE,
        folderPointerLeave,
      );
      if (containsFolder) {
        folder.removeEventListener("click", folderClick);
        folder.removeEventListener(EVgMouseEvents.MOUSE_CLICK, folderClick);
      } else {
        //pdf
        folder.removeEventListener("click", pdfClick);
        folder.removeEventListener(EVgMouseEvents.MOUSE_CLICK, pdfClick);
      }
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
    (bin[1] as HTMLElement).style.display = "block";
    (bin[0] as HTMLElement).style.scale = "1";
  };
  const binDrop = (event: Event) => {
    event.preventDefault();
    if (draggingElement) {
      draggingElement.style.display = "none";
    }
    binPointerLeave();
  };

  const onPointerDrop = (event: Event) => {
    const props = event as VgPointerDrop;
    const dragElement = props.element!.dragElement! as HTMLElement;
    dragElement.style.display = "none";
  };

  const binDropOver = (event: Event) => {
    event.preventDefault();
    binPointerEnter();
  };

  binContainer!.addEventListener(EVgMouseEvents.MOUSE_DROP, onPointerDrop);
  bin[0]!.addEventListener(EVgMouseEvents.MOUSE_DROP, onPointerDrop);
  bin[1]!.addEventListener(EVgMouseEvents.MOUSE_DROP, onPointerDrop);
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

  //modal
  const modal = document.getElementById("modal");
  const closeButton = document.getElementById("close");
  const closeModal = () => {
    modal!.style.display = "none";
  };
  closeButton?.addEventListener("click", closeModal);
  closeButton?.addEventListener(EVgMouseEvents.MOUSE_CLICK, closeModal);

  const removeEventListeners = () => {
    binContainer!.removeEventListener("mouseenter", binPointerEnter);
    binContainer!.removeEventListener("mouseleave", binPointerLeave);
    binContainer!.removeEventListener("drop", binDrop);
    binContainer!.removeEventListener("dragover", binDropOver);
    bin[0].removeEventListener("dragleave", binPointerLeave);
    //vg dispose
    bin[1]!.removeEventListener(EVgMouseEvents.MOUSE_ENTER, binPointerEnter);
    bin[0]!.removeEventListener(EVgMouseEvents.MOUSE_LEAVE, binPointerLeave);
    binContainer!.removeEventListener(EVgMouseEvents.MOUSE_DROP, onPointerDrop);
    bin[0]!.removeEventListener(EVgMouseEvents.MOUSE_DROP, onPointerDrop);
    bin[1]!.removeEventListener(EVgMouseEvents.MOUSE_DROP, onPointerDrop);
    closeButton?.removeEventListener("click", closeModal);
    closeButton?.removeEventListener(EVgMouseEvents.MOUSE_CLICK, closeModal);
    disposeEvents.forEach((eachFolderEvents) => {
      eachFolderEvents();
    });
  };

  window.addEventListener("beforeunload", removeEventListeners);
  window.addEventListener("unload", removeEventListeners);
}
