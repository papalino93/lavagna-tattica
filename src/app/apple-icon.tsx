import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Icona per la schermata home iOS: stesso soggetto dell'icona, a risoluzione maggiore. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#123d21",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 40,
            top: 24,
            width: 100,
            height: 100,
            borderRadius: "50%",
            background: "#f5f1e6",
            border: "8px solid #cda227",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 76,
            top: 6,
            width: 28,
            height: 18,
            borderRadius: 6,
            background: "#cda227",
            display: "flex",
          }}
        />
        <div style={{ position: "absolute", left: 22, top: 34, width: 16, height: 16, borderRadius: "50%", background: "#cda227", display: "flex" }} />
        <div style={{ position: "absolute", left: 142, top: 34, width: 16, height: 16, borderRadius: "50%", background: "#cda227", display: "flex" }} />
        <div
          style={{
            position: "absolute",
            left: 86,
            top: 42,
            width: 8,
            height: 34,
            borderRadius: 4,
            background: "#123d21",
            transform: "rotate(-28deg)",
            transformOrigin: "bottom center",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 28,
            top: 106,
            width: 124,
            height: 60,
            borderRadius: "60px 60px 26px 26px",
            background: "#cda227",
            display: "flex",
          }}
        />
        <div style={{ position: "absolute", left: 40, top: 96, width: 34, height: 38, borderRadius: 17, background: "#cda227", display: "flex" }} />
        <div style={{ position: "absolute", left: 73, top: 90, width: 34, height: 44, borderRadius: 17, background: "#cda227", display: "flex" }} />
        <div style={{ position: "absolute", left: 106, top: 96, width: 34, height: 38, borderRadius: 17, background: "#cda227", display: "flex" }} />
      </div>
    ),
    { ...size },
  );
}
