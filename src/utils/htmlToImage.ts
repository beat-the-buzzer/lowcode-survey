import html2canvas from "html2canvas";

export const outputImage = (targetEleId: string, fileName: string) => {
  const target: any = document.getElementById(targetEleId);
  // const width = target.offsetWidth;
  // const height = target.offsetHeight;
  // const canvas = document.createElement("canvas");
  // const scale = 4;
  // canvas.width = width * scale;
  // canvas.height = height * scale;
  // canvas.getContext("2d")?.scale(scale, scale);

  html2canvas(target, {
    scale: 4,
    // canvas: canvas,
    // width: width,
    // height: height,
    backgroundColor: null,
    logging: true,
  }).then((_canvas) => {
    // const context: any = _canvas.getContext("2d");
    // context.mozImageSmoothingEnabled = false;
    // context.webkitImageSmoothingEnabled = false;
    // context.msImageSmoothingEnabled = false;
    // context.imageSmoothingEnabled = false;

    const url = _canvas.toDataURL("image/png");
    const downloadElement = document.createElement("a");
    downloadElement.href = url;
    downloadElement.download = fileName;
    document.body.appendChild(downloadElement);
    downloadElement.click();
    document.body.removeChild(downloadElement);
    window.URL.revokeObjectURL(url);
  });
};
