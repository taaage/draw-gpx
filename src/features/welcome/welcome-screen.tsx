import Link from "next/link";
import { ArrowIcon } from "@/shared/arrow-icon";
import { ShapeExample } from "./shape-example";

function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
        <path
          d="M12 20.1 4.3 12.7C.6 9.1 3 3.8 7.2 4.1c2 .1 3.4 1.2 4.8 3 1.4-1.8 2.8-2.9 4.8-3 4.2-.3 6.6 5 2.9 8.6L12 20.1Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path d="m7.4 12.2 2.5-2.4 2.3 4.2 2-2.3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

export function WelcomeScreen({ onBegin }: { onBegin: () => void }) {
  return (
    <section className="intro-panel">
      <header className="site-header">
        <Link className="wordmark" href="/" aria-label="Draw a ride home">
          <BrandMark />
          <span>Draw a ride</span>
        </Link>
      </header>
      <h1 className="landing-title">
        Turn any shape<br />into your next<br />bike ride.
      </h1>
      <ShapeExample />
      <ol className="how-it-works">
        <li><span>1</span><p>Draw or pick a shape</p></li>
        <li><span>2</span><p>Choose where to ride and how far</p></li>
        <li><span>3</span><p>Export the GPX to Strava or your bike computer</p></li>
      </ol>
      <button className="begin-button" type="button" onClick={onBegin}>
        <span>Begin</span>
        <ArrowIcon size={19} />
      </button>
    </section>
  );
}
