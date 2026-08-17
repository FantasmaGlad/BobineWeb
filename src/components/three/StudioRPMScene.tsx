"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

const Spline = dynamic(() => import("@splinetool/react-spline/next"), {
  ssr: false,
  loading: () => (
    <div className="studio-rpm-loading">
      Chargement du studio 3D...
    </div>
  ),
});

export default function StudioRPMScene() {
  const [isInView, setIsInView] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Coupe le rendu WebGL quand la section n'est pas visible dans l'écran pour préserver le GPU
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { rootMargin: "150px", threshold: 0.05 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="studio-rpm-container" ref={containerRef}>
      <div className="studio-rpm-header">
        <div className="studio-rpm-title">
          <span className="studio-rpm-badge">Studio RPM & Biking 3D</span>
          <h3>Immersion en salle de cours collectifs</h3>
        </div>
      </div>

      <div className="studio-rpm-viewport">
        {isInView ? (
          <Spline scene="/models/scene.splinecode" />
        ) : (
          <div className="studio-rpm-loading">Scène 3D en pause (hors écran)</div>
        )}
      </div>

      <div className="studio-rpm-footer">
        <span>Glissez pour faire pivoter la vue · Molette pour zoomer et explorer la salle</span>
        <span>Salle de RPM avec écran de projection & vélos stationnaires</span>
      </div>
    </div>
  );
}




