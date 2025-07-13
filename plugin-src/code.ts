figma.showUI(__html__, { width: 350, height: 532 });

figma.ui.onmessage = async (msg) => {
  if (msg.type === "add-map") {
    const { mapUrl, width: fallbackWidth, height: fallbackHeight } = msg;

    const selection = figma.currentPage.selection;

    let x: number, y: number, width: number, height: number;

    if (selection.length > 0) {
      const bounds = selection[0];
      x = bounds.x;
      y = bounds.y;
      width = bounds.width;
      height = bounds.height;
    } else {
      // Fallback to center of viewport
      width = fallbackWidth;
      height = fallbackHeight;
      x = figma.viewport.center.x - width / 2;
      y = figma.viewport.center.y - height / 2;
    }

    const rect = figma.createRectangle();
    rect.resize(width, height);
    rect.x = x;
    rect.y = y;
    rect.name = `aam-map`;

    const imageBytes = await fetch(mapUrl)
      .then(res => res.arrayBuffer())
      .catch(err => {
        figma.notify("Failed to load map image");
        console.error(err);
      });

    if (!imageBytes) return;

    const image = figma.createImage(new Uint8Array(imageBytes));
    rect.fills = [{
      type: "IMAGE",
      scaleMode: "FILL",
      imageHash: image.hash,
    }];

    figma.currentPage.appendChild(rect);
    figma.currentPage.selection = [rect];
  }
};