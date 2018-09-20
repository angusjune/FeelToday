function drawFaceCanvas(canvas, canvasSize, lipTopY, lipTopCp1X, lipLeftX, lipLeftY, lipLeftCp1X, lipLeftCp1Y, lipLeftCp2X, lipLeftCp2Y, lipBottomY, lipBottomCp1X, color, targetFrame, resizing) {
  //// General Declarations
  let context = wx.createCanvasContext(canvas)

  //// Resize to Target Frame
  context.save();
  var resizedFrame = applyResizingBehavior('aspectfill', makeRect(0, 0, 120, 120), targetFrame);
  context.translate(resizedFrame.x, resizedFrame.y);
  context.scale(resizedFrame.w / 120, resizedFrame.h / 120);

  context.restore();

  //// Color Declarations
  // var color = 'rgba(255, 255, 255, 1)';

  //// Variable Declarations
  var lineWidth = canvasSize.w / 20;
  var facePosition = makePoint(lineWidth / 2, lineWidth / 2);
  var faceSize = makeSize(canvasSize.w - lineWidth, canvasSize.h - lineWidth);
  var eyeSize = makeSize(canvasSize.w / 8, canvasSize.w / 6);
  var eyeLeftPoint = makePoint(11 * canvasSize.w / 40, 13 * canvasSize.h / 48);
  var eyeRightPoint = makePoint(canvasSize.w - 11 * canvasSize.w / 40 - eyeSize.w, 13 * canvasSize.h / 48);
  var lipTopCenterPoint = makePoint(canvasSize.w / 2, lipTopY * canvasSize.h);
  var lipTopBezierHandleLeftPoint = makePoint(lipTopCp1X * canvasSize.w, lipTopY * canvasSize.h);
  var lipTopBezierHandleRightPoint = makePoint(canvasSize.w - lipTopBezierHandleLeftPoint.x, lipTopBezierHandleLeftPoint.y);
  var lipSideLeftPoint = makePoint(lipLeftX * canvasSize.w, lipLeftY * canvasSize.h);
  var lipSideRightPoint = makePoint(canvasSize.w - lipSideLeftPoint.x, lipSideLeftPoint.y);
  var lipSideLeftBezierHandleLeftPoint = makePoint(lipLeftCp1X * canvasSize.w, lipLeftCp1Y * canvasSize.h);
  var lipSideRightBezierHandleRightPoint = makePoint(canvasSize.w - lipSideLeftBezierHandleLeftPoint.x, lipSideLeftBezierHandleLeftPoint.y);
  var lipSideLeftBezierHandleRightPoint = makePoint(lipLeftCp2X * canvasSize.w, lipLeftCp2Y * canvasSize.h);
  var lipSideRightBezierHandleLeftPoint = makePoint(canvasSize.w - lipSideLeftBezierHandleRightPoint.x, lipSideLeftBezierHandleRightPoint.y);
  var lipBottomCenterPoint = makePoint(canvasSize.w / 2, lipBottomY * canvasSize.h);
  var lipBottomBezierHandleLeftPoint = makePoint(lipBottomCp1X * canvasSize.w, lipBottomY * canvasSize.h);
  var lipBottomBezierHandleRightPoint = makePoint(canvasSize.w - lipBottomBezierHandleLeftPoint.x, lipBottomBezierHandleLeftPoint.y);

  //// face Drawing
  // oval(context, facePosition.x, facePosition.y, faceSize.w, faceSize.h);
  // context.setStrokeStyle(color);
  // context.setLineWidth(lineWidth);
  // context.stroke();
  //
  // context.restore();

  context.save();
  context.beginPath();
  context.arc(canvasSize.w / 2, canvasSize.h / 2, faceSize.w / 2, 0, 2 * Math.PI, false);
  context.closePath();
  context.setStrokeStyle(color);
  context.setLineWidth(lineWidth);
  context.stroke();
  context.restore();

  //// mouth Drawing
  context.save();

  context.beginPath();
  context.moveTo(lipSideLeftPoint.x, lipSideLeftPoint.y);
  context.bezierCurveTo((lipSideLeftBezierHandleRightPoint.x), lipSideLeftBezierHandleRightPoint.y, lipTopBezierHandleLeftPoint.x, lipTopBezierHandleLeftPoint.y, lipTopCenterPoint.x, lipTopCenterPoint.y);
  context.bezierCurveTo(lipTopBezierHandleRightPoint.x, lipTopBezierHandleRightPoint.y, (lipSideRightBezierHandleLeftPoint.x), lipSideRightBezierHandleLeftPoint.y, lipSideRightPoint.x, lipSideRightPoint.y);
  context.bezierCurveTo((lipSideRightBezierHandleRightPoint.x), lipSideRightBezierHandleRightPoint.y, lipBottomBezierHandleRightPoint.x, lipBottomBezierHandleRightPoint.y, lipBottomCenterPoint.x, lipBottomCenterPoint.y);
  context.bezierCurveTo(lipBottomBezierHandleLeftPoint.x, lipBottomBezierHandleLeftPoint.y, (lipSideLeftBezierHandleLeftPoint.x), lipSideLeftBezierHandleLeftPoint.y, lipSideLeftPoint.x, lipSideLeftPoint.y);
  context.closePath();
  context.setStrokeStyle(color);
  context.setLineWidth(lineWidth);
  context.setLineCap('round');
  context.setLineJoin('round');
  context.stroke();

  context.restore();

  //// eyeRight Drawing
  oval(context, eyeRightPoint.x, eyeRightPoint.y, eyeSize.w, eyeSize.h);
  context.setFillStyle(color);
  context.fill();

  context.restore();

  //// eyeLeft Drawing
  oval(context, eyeLeftPoint.x, eyeLeftPoint.y, eyeSize.w, eyeSize.h);
  context.setFillStyle(color);
  context.fill();

  context.restore();

  context.draw();

}

//// Infrastructure

function clearCanvas(canvas, canvasSize) {
  let context = wx.createCanvasContext(canvas)
  context.clearRect(0, 0, canvasSize.width, canvasSize.height);
  context.draw();
}

// Possible arguments for 'resizing' parameter are:
//   'aspectfit': The content is proportionally resized to fit into the target rectangle.
//   'aspectfill': The content is proportionally resized to completely fill the target rectangle.
//   'stretch': The content is stretched to match the entire target rectangle.
//   'center': The content is centered in the target rectangle, but it is NOT resized.
function applyResizingBehavior(resizing, rect, targetRect) {
  if (targetRect === undefined || equalRects(rect, targetRect) || equalRects(targetRect, makeRect(0, 0, 0, 0))) {
    return rect;
  }

  var scales = makeSize(0, 0);
  scales.w = Math.abs(targetRect.w / rect.w);
  scales.h = Math.abs(targetRect.h / rect.h);

  switch (resizing) {
    case 'aspectfit':
      {
        scales.w = Math.min(scales.w, scales.h);
        scales.h = scales.w;
        break;
      }
    case 'aspectfill':
      {
        scales.w = Math.max(scales.w, scales.h);
        scales.h = scales.w;
        break;
      }
    case 'stretch':
    case undefined:
      break;
    case 'center':
      {
        scales.w = 1;
        scales.h = 1;
        break;
      }
    default:
      throw 'Unknown resizing behavior "' + resizing + '". Use "aspectfit", "aspectfill", "stretch" or "center" as resizing behavior.';
  }

  var result = makeRect(Math.min(rect.x, rect.x + rect.w), Math.min(rect.y, rect.y + rect.h), Math.abs(rect.w), Math.abs(rect.h));
  result.w *= scales.w;
  result.h *= scales.h;
  result.x = targetRect.x + (targetRect.w - result.w) / 2;
  result.y = targetRect.y + (targetRect.h - result.h) / 2;
  return result;
}

function oval(context, x, y, w, h) {
  context.save();
  context.beginPath();
  context.translate(x, y);
  context.scale(w / 2, h / 2);
  context.arc(1, 1, 1, 0, 2 * Math.PI, false);
  context.closePath();
  // context.restore();
}

function makeRect(x, y, w, h) {
  return {x: x, y: y, w: w, h: h};
}

function equalRects(r1, r2) {
  return r1.x === r2.x && r1.y === r2.y && r1.w == r2.w && r1.h === r2.h;
}

function makePoint(x, y) {
  return {x: x, y: y};
}

function makeSize(w, h) {
  return {w: w, h: h};
}

module.exports = {
  face: drawFaceCanvas,
  clear: clearCanvas,
  makeSize: makeSize,
  makePoint: makePoint,
  makeRect: makeRect
}
