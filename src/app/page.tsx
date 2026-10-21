"use client";

import dynamic from "next/dynamic";

const RidePlanner = dynamic(() => import("@/features/ride-planning/ride-planner"), {
  ssr: false,
  loading: () => <main className="loading-screen"><span>Preparing your map...</span></main>,
});

export default function Home() {
  return <RidePlanner />;
}
