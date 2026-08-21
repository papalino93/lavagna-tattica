import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/** Favicon: mano che regge un cronometro, stile allenatore in campo. */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#123d21",
          borderRadius: 14,
          position: "relative",
        }}
      >
        {/* Cronometro */}
        <div
          style={{
            position: "absolute",
            left: 14,
            top: 8,
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "#f5f1e6",
            border: "3px solid #cda227",
            display: "flex",
          }}
        />
        {/* Corona in alto */}
        <div
          style={{
            position: "absolute",
            left: 27,
            top: 2,
            width: 10,
            height: 7,
            borderRadius: 2,
            background: "#cda227",
            display: "flex",
          }}
        />
        {/* Pulsanti laterali */}
        <div style={{ position: "absolute", left: 8, top: 12, width: 6, height: 6, borderRadius: "50%", background: "#cda227", display: "flex" }} />
        <div style={{ position: "absolute", left: 50, top: 12, width: 6, height: 6, borderRadius: "50%", background: "#cda227", display: "flex" }} />
        {/* Lancetta */}
        <div
          style={{
            position: "absolute",
            left: 31,
            top: 14,
            width: 3,
            height: 12,
            borderRadius: 2,
            background: "#123d21",
            transform: "rotate(-28deg)",
            transformOrigin: "bottom center",
            display: "flex",
          }}
        />
        {/* Mano che regge da sotto */}
        <div
          style={{
            position: "absolute",
            left: 10,
            top: 38,
            width: 44,
            height: 22,
            borderRadius: "22px 22px 10px 10px",
            background: "#cda227",
            display: "flex",
          }}
        />
        <div style={{ position: "absolute", left: 14, top: 34, width: 12, height: 14, borderRadius: 6, background: "#cda227", display: "flex" }} />
        <div style={{ position: "absolute", left: 26, top: 32, width: 12, height: 16, borderRadius: 6, background: "#cda227", display: "flex" }} />
        <div style={{ position: "absolute", left: 38, top: 34, width: 12, height: 14, borderRadius: 6, background: "#cda227", display: "flex" }} />
      </div>
    ),
    { ...size },
  );
}
