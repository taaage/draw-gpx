import { useRef, useState, type PointerEvent } from "react";
import { getDrawPoint } from "./drawing";
import type { DrawPoint } from "./types";

export function useShapeSelection() {
  const [mode, setMode] = useState<"draw" | "pick">("pick");
  const [selectedShape, setSelectedShape] = useState<string | null>(null);
  const [drawnRoute, setDrawnRoute] = useState<DrawPoint[]>([]);
  const [shapeOutline, setShapeOutline] = useState<DrawPoint[]>([]);
  const drawingRef = useRef(false);

  const startDrawing = (event: PointerEvent<SVGSVGElement>) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    drawingRef.current = true;
    setSelectedShape(null);
    setDrawnRoute([getDrawPoint(event)]);
  };

  const continueDrawing = (event: PointerEvent<SVGSVGElement>) => {
    if (!drawingRef.current) return;
    const point = getDrawPoint(event);
    setDrawnRoute((route) => [...route, point]);
  };

  const stopDrawing = () => { drawingRef.current = false; };

  return {
    mode, setMode, selectedShape, setSelectedShape,
    drawnRoute, setDrawnRoute, shapeOutline, setShapeOutline,
    startDrawing, continueDrawing, stopDrawing,
  };
}
