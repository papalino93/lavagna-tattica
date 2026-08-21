import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Anteprima quando il link viene condiviso (WhatsApp, social, ecc.). */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(155deg, #0c2417 0%, #1f6b3a 60%, #2c8047 100%)",
          position: "relative",
        }}
      >
        {/* Righe campo, decorative */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            backgroundImage: "linear-gradient(rgba(255,255,255,0.05) 2px, transparent 2px)",
            backgroundSize: "100% 90px",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 64, padding: "0 90px" }}>
          {/* Icona: cronometro retto da una mano */}
          <div style={{ position: "relative", width: 230, height: 230, display: "flex", flexShrink: 0 }}>
            <div
              style={{
                position: "absolute",
                left: 46,
                top: 26,
                width: 138,
                height: 138,
                borderRadius: "50%",
                background: "#f5f1e6",
                border: "10px solid #cda227",
                display: "flex",
              }}
            />
            <div style={{ position: "absolute", left: 96, top: 4, width: 38, height: 24, borderRadius: 8, background: "#cda227", display: "flex" }} />
            <div style={{ position: "absolute", left: 24, top: 40, width: 20, height: 20, borderRadius: "50%", background: "#cda227", display: "flex" }} />
            <div style={{ position: "absolute", left: 186, top: 40, width: 20, height: 20, borderRadius: "50%", background: "#cda227", display: "flex" }} />
            <div
              style={{
                position: "absolute",
                left: 108,
                top: 50,
                width: 10,
                height: 42,
                borderRadius: 5,
                background: "#123d21",
                transform: "rotate(-28deg)",
                transformOrigin: "bottom center",
                display: "flex",
              }}
            />
            <div style={{ position: "absolute", left: 30, top: 122, width: 170, height: 76, borderRadius: "76px 76px 30px 30px", background: "#cda227", display: "flex" }} />
            <div style={{ position: "absolute", left: 44, top: 110, width: 46, height: 50, borderRadius: 23, background: "#cda227", display: "flex" }} />
            <div style={{ position: "absolute", left: 92, top: 102, width: 46, height: 58, borderRadius: 23, background: "#cda227", display: "flex" }} />
            <div style={{ position: "absolute", left: 140, top: 110, width: 46, height: 50, borderRadius: 23, background: "#cda227", display: "flex" }} />
          </div>

          {/* Testo */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", color: "#e8d39a", fontSize: 26, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase" }}>
              Squadra &amp; Tattica
            </div>
            <div style={{ display: "flex", color: "white", fontSize: 92, fontWeight: 800, lineHeight: 1, marginTop: 14 }}>
              Lavagna
            </div>
            <div style={{ display: "flex", color: "white", fontSize: 92, fontWeight: 800, lineHeight: 1 }}>
              Tattica
            </div>
            <div style={{ display: "flex", color: "rgba(255,255,255,0.75)", fontSize: 28, marginTop: 20 }}>
              Rosa, allenamenti, partite e schemi — tutto in un posto.
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
