import type { ReactNode } from "react";
import { Svg, Path, Line, Circle, Ellipse, Rect, Polyline } from "@react-pdf/renderer";

/**
 * Pictogrammes filaires noir et blanc pour le PDF (viewBox 24x24, trait
 * uniquement, zéro remplissage) — même esprit graphique que les icônes
 * SVG du site (stroke="currentColor", fill="none"), adapté aux primitives
 * vectorielles de @react-pdf/renderer.
 */

const STROKE = "#000000";
const SW = 1.6;

interface IconProps {
  size?: number;
}

function Frame({ size = 14, children }: { size?: number; children: ReactNode }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {children}
    </Svg>
  );
}

const commonProps = {
  fill: "none",
  stroke: STROKE,
  strokeWidth: SW,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function IconManifesto({ size }: IconProps) {
  return (
    <Frame size={size}>
      <Path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" {...commonProps} />
      <Path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" {...commonProps} />
    </Frame>
  );
}

export function IconInstall({ size }: IconProps) {
  return (
    <Frame size={size}>
      <Path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" {...commonProps} />
      <Polyline points="7 10 12 15 17 10" {...commonProps} />
      <Line x1="12" y1="15" x2="12" y2="3" {...commonProps} />
    </Frame>
  );
}

export function IconPlay({ size }: IconProps) {
  return (
    <Frame size={size}>
      <Circle cx="12" cy="12" r="9" {...commonProps} />
      <Path d="M10 8.5l6 3.5-6 3.5v-7z" {...commonProps} />
    </Frame>
  );
}

export function IconFeatures({ size }: IconProps) {
  return (
    <Frame size={size}>
      <Line x1="4" y1="7" x2="20" y2="7" {...commonProps} />
      <Line x1="4" y1="12" x2="20" y2="12" {...commonProps} />
      <Line x1="4" y1="17" x2="20" y2="17" {...commonProps} />
      <Circle cx="9" cy="7" r="1.6" fill={STROKE} stroke="none" />
      <Circle cx="15" cy="12" r="1.6" fill={STROKE} stroke="none" />
      <Circle cx="9" cy="17" r="1.6" fill={STROKE} stroke="none" />
    </Frame>
  );
}

export function IconHelp({ size }: IconProps) {
  return (
    <Frame size={size}>
      <Circle cx="12" cy="12" r="9" {...commonProps} />
      <Path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.9.4-1.3 1-1.3 2" {...commonProps} />
      <Circle cx="12" cy="17" r="0.9" fill={STROKE} stroke="none" />
    </Frame>
  );
}

export function IconCode({ size }: IconProps) {
  return (
    <Frame size={size}>
      <Polyline points="8 6 3 12 8 18" {...commonProps} />
      <Polyline points="16 6 21 12 16 18" {...commonProps} />
    </Frame>
  );
}

export function IconRoadmap({ size }: IconProps) {
  return (
    <Frame size={size}>
      <Path d="M3 5l6-2 6 2 6-2v16l-6 2-6-2-6 2z" {...commonProps} />
      <Line x1="9" y1="3" x2="9" y2="19" {...commonProps} />
      <Line x1="15" y1="5" x2="15" y2="21" {...commonProps} />
    </Frame>
  );
}

export function IconServer({ size }: IconProps) {
  return (
    <Frame size={size}>
      <Rect x="3" y="4" width="18" height="7" {...commonProps} />
      <Rect x="3" y="13" width="18" height="7" {...commonProps} />
      <Circle cx="7" cy="7.5" r="0.8" fill={STROKE} stroke="none" />
      <Circle cx="7" cy="16.5" r="0.8" fill={STROKE} stroke="none" />
    </Frame>
  );
}

export function IconDatabase({ size }: IconProps) {
  return (
    <Frame size={size}>
      <Ellipse cx="12" cy="5.5" rx="8" ry="2.7" {...commonProps} />
      <Path d="M4 5.5v13c0 1.5 3.6 2.7 8 2.7s8-1.2 8-2.7v-13" {...commonProps} />
      <Path d="M4 12c0 1.5 3.6 2.7 8 2.7s8-1.2 8-2.7" {...commonProps} />
    </Frame>
  );
}

export function IconFilm({ size }: IconProps) {
  return (
    <Frame size={size}>
      <Rect x="3" y="4" width="18" height="16" {...commonProps} />
      <Line x1="7" y1="4" x2="7" y2="20" {...commonProps} />
      <Line x1="17" y1="4" x2="17" y2="20" {...commonProps} />
      <Line x1="3" y1="9" x2="7" y2="9" {...commonProps} />
      <Line x1="3" y1="14" x2="7" y2="14" {...commonProps} />
      <Line x1="17" y1="9" x2="21" y2="9" {...commonProps} />
      <Line x1="17" y1="14" x2="21" y2="14" {...commonProps} />
    </Frame>
  );
}

export function IconTerminal({ size }: IconProps) {
  return (
    <Frame size={size}>
      <Rect x="3" y="4" width="18" height="16" {...commonProps} />
      <Polyline points="7 9 10.5 12 7 15" {...commonProps} />
      <Line x1="12" y1="15" x2="17" y2="15" {...commonProps} />
    </Frame>
  );
}

export function IconTv({ size }: IconProps) {
  return (
    <Frame size={size}>
      <Rect x="3" y="5" width="18" height="12" {...commonProps} />
      <Line x1="9" y1="20" x2="15" y2="20" {...commonProps} />
      <Line x1="12" y1="17" x2="12" y2="20" {...commonProps} />
    </Frame>
  );
}

export function IconSmartphone({ size }: IconProps) {
  return (
    <Frame size={size}>
      <Rect x="7" y="2" width="10" height="20" rx="1.4" ry="1.4" {...commonProps} />
      <Line x1="10.5" y1="18.4" x2="13.5" y2="18.4" {...commonProps} />
    </Frame>
  );
}

export function IconTablet({ size }: IconProps) {
  return (
    <Frame size={size}>
      <Rect x="4" y="2" width="16" height="20" rx="1.6" ry="1.6" {...commonProps} />
      <Line x1="10" y1="19" x2="14" y2="19" {...commonProps} />
    </Frame>
  );
}
