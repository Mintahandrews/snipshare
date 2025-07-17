import { useStore } from "./store";
import domtoimage from "dom-to-image";
import { saveAs } from "file-saver";
import { safeAsync } from "./asyncHandler";

export async function snap(
  mode: "COPY_LINK" | "COPY_IMAGE" | "DOWNLOAD_IMAGE"
): Promise<void> {
  const editorDiv = document.getElementById("screenshot");
  const update = useStore.getState().update;

  if (!editorDiv) {
    update("message", "EDITOR_NOT_FOUND");
    throw new Error("EDITOR_NOT_FOUND");
  }

  if (mode === "COPY_LINK") {
    return safeAsync(
      async () => {
        try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href);
            return true;
          } else {
            // Fallback for browsers without clipboard API
            const textarea = document.createElement("textarea");
            textarea.value = window.location.href;
            textarea.style.position = "fixed"; // Avoid scrolling to bottom
            document.body.appendChild(textarea);
            textarea.focus();
            textarea.select();

            const successful = document.execCommand("copy");
            document.body.removeChild(textarea);

            if (successful) {
              return true;
    } else {
              throw new Error("FALLBACK_COPY_FAILED");
            }
          }
        } catch (error) {
      update("message", "CLIPBOARD_API_NOT_SUPPORTED");
      throw new Error("CLIPBOARD_API_NOT_SUPPORTED");
    }
      },
      () => {
        update("message", "LINK_COPIED");
      },
      (error) => {
        update("message", "COPY_LINK_FAILED");
        console.error("Failed to copy link:", error);
      }
    ) as Promise<void>;
  }

  try {
    // Check for mobile devices to optimize settings
    const isMobile =
      window.innerWidth < 768 ||
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

    // Get device pixel ratio for better quality on high-DPI displays
    // Use a reasonable cap for pixel ratio to prevent excessive memory usage on high-DPI devices
    const pixelRatio = Math.min(window.devicePixelRatio || 1, isMobile ? 2 : 3);

    const scale = isMobile ? 1 : pixelRatio;

    // For mobile devices, reduce the quality slightly to improve performance
    const quality = isMobile ? 0.95 : 1;

    const options = {
      width: editorDiv.clientWidth * scale,
      height: editorDiv.clientHeight * scale,
      style: {
        maxWidth: "none",
        maxHeight: "none",
        transform: `scale(${scale})`,
        transformOrigin: "top left",
        backgroundColor: "transparent",
      },
      quality: quality,
      cacheBust: true, // Prevent caching issues
    };

    return safeAsync(
      async () => {
        try {
          // Temporarily hide any error messages during capture
          const messageElement = document.getElementById("message-container");
          const originalDisplay = messageElement?.style.display;
          if (messageElement) messageElement.style.display = "none";

          // Show loading state
          update("message", "PROCESSING_IMAGE");

          // Use a timeout to allow UI to update before capturing
          await new Promise((resolve) => setTimeout(resolve, 100));

    const dataUrl = await domtoimage.toPng(editorDiv, options);

          // Restore message display
          if (messageElement)
            messageElement.style.display = originalDisplay || "";

          const response = await fetch(dataUrl);
          const blob = await response.blob();

        if (mode === "DOWNLOAD_IMAGE") {
            const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
            const title = useStore.getState().title || "code-snippet";
            const filename = `${title}-${timestamp}.png`;
            saveAs(blob, filename);
            return true;
        } else if (mode === "COPY_IMAGE") {
            try {
          if (navigator.clipboard && navigator.clipboard.write) {
            const item = new ClipboardItem({ "image/png": blob });
            await navigator.clipboard.write([item]);
                return true;
          } else {
            throw new Error("CLIPBOARD_API_NOT_SUPPORTED");
              }
            } catch (e) {
              // Fallback for browsers that don't support clipboard.write
              const tempImg = document.createElement("img");
              const url = URL.createObjectURL(blob);
              tempImg.src = url;

              return new Promise<boolean>((resolve) => {
                tempImg.onload = () => {
                  try {
                    const canvas = document.createElement("canvas");
                    canvas.width = tempImg.width;
                    canvas.height = tempImg.height;
                    const ctx = canvas.getContext("2d");

                    if (ctx) {
                      ctx.drawImage(tempImg, 0, 0);
                      canvas.toBlob(
                        (blob) => {
                          if (blob && navigator.clipboard) {
                            const item = new ClipboardItem({
                              "image/png": blob,
                            });
                            navigator.clipboard
                              .write([item])
                              .then(() => resolve(true))
                              .catch(() => {
                                update(
                                  "message",
                                  "CLIPBOARD_API_NOT_SUPPORTED"
                                );
                                resolve(false);
                              });
                          } else {
                            // Additional fallback for older browsers
                            if (
                              canvas &&
                              canvas.toDataURL &&
                              typeof document.execCommand === 'function'
                            ) {
                              try {
                                const dataUrl = canvas.toDataURL("image/png");
                                const success = copyImageFallback(dataUrl);
                                resolve(success);
                              } catch (e) {
                                resolve(false);
                              }
                            } else {
                              resolve(false);
                            }
                          }
                        },
                        "image/png",
                        quality
                      );
                    } else {
                      resolve(false);
                    }

                    URL.revokeObjectURL(url);
                  } catch (e) {
                    URL.revokeObjectURL(url);
                    resolve(false);
                  }
                };

                tempImg.onerror = () => {
                  URL.revokeObjectURL(url);
                  resolve(false);
                };
              });
            }
          }
        } catch (error) {
          console.error("Image processing error:", error);
          throw error;
        }
        return true;
      },
      () => {
        if (mode === "DOWNLOAD_IMAGE") {
          update("message", "IMAGE_DOWNLOADED");
        } else {
          update("message", "IMAGE_COPIED");
        }
      },
      (error) => {
        console.error("Image operation failed:", error);
        update("message", "IMAGE_OPERATION_FAILED");
      }
    ) as Promise<void>;
  } catch (e) {
    console.error("Image creation failed:", e);
    update("message", "IMAGE_CREATION_FAILED");
    throw new Error("IMAGE_CREATION_FAILED");
  }
}

// Additional fallback function for copying images
function copyImageFallback(dataUrl: string): boolean {
  const div = document.createElement("div");
  div.contentEditable = "true";
  div.style.position = "fixed";
  div.style.opacity = "0";

  const img = document.createElement("img");
  img.src = dataUrl;

  div.appendChild(img);
  document.body.appendChild(div);

  // Select the image
  const range = document.createRange();
  range.selectNode(div);
  const selection = window.getSelection();
  if (selection) {
    selection.removeAllRanges();
    selection.addRange(range);
  }

  // Try to copy
  const success = document.execCommand("copy");

  // Cleanup
  document.body.removeChild(div);

  return success;
}
