"use client";
import React from "react";

const ORBS = [
  "rgba(244,114,182,0.18)",
  "rgba(168,85,247,0.14)",
  "rgba(236,72,153,0.16)",
  "rgba(99,102,241,0.15)",
  "rgba(244,114,182,0.10)",
  "rgba(168,85,247,0.12)",
  "rgba(236,72,153,0.13)",
  "rgba(99,102,241,0.11)",
];

const ORB_POSITIONS = [
  { size: 340, left: 8,  top: 5,  duration: 9,  delay: 0,   blur: 90 },
  { size: 260, left: 78, top: 12, duration: 12, delay: 1.5, blur: 80 },
  { size: 300, left: 42, top: 60, duration: 10, delay: 0.8, blur: 95 },
  { size: 210, left: 88, top: 55, duration: 7,  delay: 2.2, blur: 65 },
  { size: 380, left: 5,  top: 72, duration: 13, delay: 0.3, blur: 105 },
  { size: 190, left: 58, top: 18, duration: 6,  delay: 1.0, blur: 70 },
  { size: 270, left: 28, top: 38, duration: 11, delay: 3.0, blur: 88 },
  { size: 230, left: 68, top: 82, duration: 8,  delay: 0.6, blur: 78 },
];

export default function OrbBackground() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
        background:
          "linear-gradient(135deg, #1A0A1E 0%, #1e0a1a 40%, #150a20 100%)",
      }}
      aria-hidden="true"
    >
      {ORBS.map((color, i) => {
        const pos = ORB_POSITIONS[i];
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${pos.left}%`,
              top: `${pos.top}%`,
              width: pos.size,
              height: pos.size,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
              filter: `blur(${pos.blur}px)`,
              animation: `orbFloat ${pos.duration}s ease-in-out ${pos.delay}s infinite`,
              willChange: "transform, opacity",
            }}
          />
        );
      })}
    </div>
  );
}
