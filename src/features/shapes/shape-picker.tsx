import { ArrowIcon } from "@/shared/arrow-icon";
import { StepHeader } from "@/shared/step-header";
import { DRAW_CANVAS, sampleShapePath } from "./drawing";
import { SHAPES } from "./presets";
import type { useShapeSelection } from "./use-shape-selection";

type ShapePickerProps = {
  selection: ReturnType<typeof useShapeSelection>;
  onBack: () => void;
  onContinue: () => void;
};

export function ShapePicker({ selection, onBack, onContinue }: ShapePickerProps) {
  const {
    mode, setMode, selectedShape, setSelectedShape, drawnRoute, setDrawnRoute,
    setShapeOutline, startDrawing, continueDrawing, stopDrawing,
  } = selection;

  return (
    <section className="intro-panel next-step shape-step">
      <StepHeader step={1} onBack={onBack} backLabel="Back to welcome screen" />
      <div className="shape-step-content">
        <h1 className="step-title">Pick a shape from the list.</h1>
        <div className="mode-switch" role="tablist" aria-label="How to create a shape">
          <button
            className={mode === "draw" ? "selected" : ""}
            type="button"
            role="tab"
            aria-selected={mode === "draw"}
            onClick={() => {
              setMode("draw");
              setSelectedShape(null);
              setShapeOutline([]);
            }}
          >
            Draw
          </button>
          <button
            className={mode === "pick" ? "selected" : ""}
            type="button"
            role="tab"
            aria-selected={mode === "pick"}
            onClick={() => {
              setMode("pick");
              setDrawnRoute([]);
              setShapeOutline([]);
              stopDrawing();
            }}
          >
            Pick a shape
          </button>
        </div>
        {mode === "pick" ? (
          <div className="shape-grid" aria-label="Available shapes">
            {SHAPES.map((shape) => (
              <button
                key={shape.name}
                className={`shape-option ${selectedShape === shape.name ? "active" : ""}`}
                type="button"
                aria-pressed={selectedShape === shape.name}
                onClick={(event) => {
                  setSelectedShape(shape.name);
                  setDrawnRoute([]);
                  const path = event.currentTarget.querySelector("svg path");
                  setShapeOutline(path instanceof SVGPathElement ? sampleShapePath(path) : []);
                }}
              >
                <svg viewBox="0 0 100 100" aria-hidden="true">
                  <path d={shape.path} fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>{shape.name}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="drawing-card">
            <svg
              className="drawing-canvas"
              viewBox={`0 0 ${DRAW_CANVAS.width} ${DRAW_CANVAS.height}`}
              onPointerDown={startDrawing}
              onPointerMove={continueDrawing}
              onPointerUp={stopDrawing}
              onPointerCancel={stopDrawing}
              aria-label="Draw a shape here"
              role="img"
            >
              <text x="160" y="130" textAnchor="middle" className="drawing-prompt">
                {drawnRoute.length ? "" : "Draw your shape here"}
              </text>
              {drawnRoute.length > 1 && (
                <polyline
                  points={drawnRoute.map(([x, y]) => `${x},${y}`).join(" ")}
                  fill="none"
                  stroke="#211f1c"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
            </svg>
            <button className="clear-drawing" type="button" disabled={!drawnRoute.length} onClick={() => setDrawnRoute([])}>
              Clear drawing
            </button>
          </div>
        )}
      </div>
      <button
        className="next-button"
        type="button"
        disabled={mode === "pick" ? selectedShape === null : drawnRoute.length < 3}
        onClick={() => {
          if (mode === "draw") setShapeOutline(drawnRoute);
          onContinue();
        }}
        aria-label="Continue to the next step"
      >
        <ArrowIcon />
      </button>
    </section>
  );
}
