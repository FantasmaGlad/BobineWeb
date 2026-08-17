"use client";

import { useState } from "react";
import Spline from "@splinetool/react-spline/next";

export default function SplineStudioScene() {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="spline-studio-container">
      <div className="spline-studio-header">
        <div className="studio-rpm-title">
          <span className="studio-rpm-badge">Scène 3D Interactive Spline</span>
          <h3>Studio RPM & Régie Bobine</h3>
        </div>
      </div>

      <div className="spline-studio-viewport">
        {!loaded && (
          <div className="studio-rpm-loading">
            Chargement de la scène 3D Spline...
          </div>
        )}
        <Spline
          scene="/models/scene.splinecode"
          onLoad={() => setLoaded(true)}
          className="spline-canvas-wrapper"
        />
      </div>

      <div className="studio-rpm-footer">
        <span>Scène 3D Spline interactive — Faites pivoter, zoomez et explorez l&apos;espace</span>
        <span>Moteur Spline Runtime WebGL</span>
      </div>
    </div>
  );
}
