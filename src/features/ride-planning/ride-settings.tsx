type RangeControlProps = {
  id: string;
  label: string;
  value: number;
  max: number;
  step: number;
  displayValue: string;
  ariaLabel: string;
  onChange: (value: number) => void;
};

function RangeControl({
  id, label, value, max, step, displayValue, ariaLabel, onChange,
}: RangeControlProps) {
  return (
    <div className="distance-control">
      <div className="distance-control-heading">
        <label className="overline" htmlFor={id}>{label}</label>
        <output className="control-value" htmlFor={id}>{displayValue}<span>km</span></output>
      </div>
      <input
        className="distance-slider"
        id={id}
        type="range"
        min="1"
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        aria-label={ariaLabel}
      />
    </div>
  );
}

type RideSettingsProps = {
  distance: number;
  areaKm: number;
  onDistanceChange: (distance: number) => void;
  onAreaChange: (areaKm: number) => void;
};

export function RideSettings({ distance, areaKm, onDistanceChange, onAreaChange }: RideSettingsProps) {
  return (
    <>
      <RangeControl
        id="ride-distance" label="Distance" value={distance} max={20} step={1}
        displayValue={String(distance)} ariaLabel={`Distance ${distance} km`}
        onChange={onDistanceChange}
      />
      <RangeControl
        id="ride-area" label="Area" value={areaKm} max={15} step={0.5}
        displayValue={areaKm.toFixed(1)} ariaLabel={`Area radius ${areaKm.toFixed(1)} kilometers`}
        onChange={onAreaChange}
      />
    </>
  );
}
