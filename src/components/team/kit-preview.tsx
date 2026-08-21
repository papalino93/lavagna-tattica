interface KitPreviewProps {
  shirtColor: string;
  shortsColor: string;
  socksColor: string;
}

/** Anteprima stilizzata del kit: maglia, pantaloncini, calzettoni. */
export function KitPreview({ shirtColor, shortsColor, socksColor }: KitPreviewProps) {
  return (
    <svg viewBox="0 0 100 150" className="h-40 w-28" aria-hidden="true">
      {/* Maglia */}
      <path
        d="M20,10 L35,0 Q50,15 65,0 L80,10 L96,28 L80,42 L80,78 L20,78 L20,42 L4,28 Z"
        fill={shirtColor}
        stroke="rgba(0,0,0,0.15)"
        strokeWidth="1"
      />
      <path d="M40,3 Q50,14 60,3" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="2" />

      {/* Pantaloncini */}
      <path
        d="M22,82 L78,82 L78,104 Q78,108 74,108 L54,108 L54,116 L46,116 L46,108 L26,108 Q22,108 22,104 Z"
        fill={shortsColor}
        stroke="rgba(0,0,0,0.15)"
        strokeWidth="1"
      />

      {/* Calzettoni */}
      <rect x="27" y="120" width="16" height="26" rx="3" fill={socksColor} stroke="rgba(0,0,0,0.15)" strokeWidth="1" />
      <rect x="57" y="120" width="16" height="26" rx="3" fill={socksColor} stroke="rgba(0,0,0,0.15)" strokeWidth="1" />
    </svg>
  );
}
