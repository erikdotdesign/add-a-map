figma.showUI(__html__, { width: 350, height: 500 });

figma.ui.onmessage = async (msg) => {
  if (msg.type === "add-map") {
    const { mapUrl, width, height } = msg;

    // Get the current selection or fallback to center
    const selection = figma.currentPage.selection;
    let x = figma.viewport.center.x - width / 2;
    let y = figma.viewport.center.y - height / 2;

    if (selection.length > 0) {
      const node = selection[0];
      x = node.x;
      y = node.y;
    }

    // Create rectangle
    const rect = figma.createRectangle();
    rect.resize(width, height);
    rect.x = x;
    rect.y = y;
    rect.name = `Map View`;

    // Fetch map image as bytes
    const imageBytes = await fetch(mapUrl)
      .then(res => res.arrayBuffer())
      .catch(err => {
        figma.notify("Failed to load map image");
        console.error(err);
      });

    if (!imageBytes) return;

    const image = figma.createImage(new Uint8Array(imageBytes));

    // Set image as fill
    rect.fills = [
      {
        type: "IMAGE",
        scaleMode: "FILL",
        imageHash: image.hash,
      },
    ];

    // Add to canvas
    figma.currentPage.appendChild(rect);
    figma.currentPage.selection = [rect];
    figma.viewport.scrollAndZoomIntoView([rect]);
  }
};