import type { PointerEvent } from "react";
import type { DrawPoint } from "./types";

export const DRAW_CANVAS = { width: 320, height: 280 };

export function sampleShapePath(path: SVGPathElement): DrawPoint[] {
  const length = path.getTotalLength();
  const samples = 96;
  return Array.from({ length: samples }, (_, index) => {
    const point = path.getPointAtLength((length * index) / samples);
    return [point.x, point.y];
  });
}

export function getDrawPoint(event: PointerEvent<SVGSVGElement>): DrawPoint {
  const bounds = event.currentTarget.getBoundingClientRect();
  return [
    ((event.clientX - bounds.left) / bounds.width) * DRAW_CANVAS.width,
    ((event.clientY - bounds.top) / bounds.height) * DRAW_CANVAS.height,
  ];
}
