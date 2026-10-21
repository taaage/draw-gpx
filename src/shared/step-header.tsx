import { ArrowIcon } from "./arrow-icon";

type StepHeaderProps = {
  step: 1 | 2 | 3;
  onBack: () => void;
  backLabel: string;
};

export function StepHeader({ step, onBack, backLabel }: StepHeaderProps) {
  return (
    <header className="step-header">
      <button className="back-button" type="button" onClick={onBack} aria-label={backLabel}>
        <ArrowIcon back />
      </button>
      <div className="step-progress" aria-label={step === 3 ? "Route results" : `Step ${step} of 3`}>
        {[1, 2, 3].map((value) => <i key={value} className={value <= step ? "current" : undefined} />)}
      </div>
      <span className="step-spacer" />
    </header>
  );
}
