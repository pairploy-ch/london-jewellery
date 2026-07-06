import { ImageResponse } from "next/og";

export const alt = "London Jewellery Consultant — Independent Jewellery Authentication";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#17120d",
          color: "#f4eee5",
          padding: "80px",
        }}
      >
        <div
          style={{
            fontSize: 24,
            letterSpacing: "8px",
            textTransform: "uppercase",
            color: "#c4a877",
          }}
        >
          Independent · Experienced
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 96, lineHeight: 1.05, fontWeight: 600 }}>
            London Jewellery
          </div>
          <div style={{ fontSize: 96, lineHeight: 1.05, fontWeight: 600 }}>
            Consultant
          </div>
          <div
            style={{
              marginTop: 28,
              fontSize: 34,
              color: "rgba(244,238,229,0.7)",
            }}
          >
            Independent assessment of branded fine jewellery.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 22,
            letterSpacing: "4px",
            textTransform: "uppercase",
            color: "rgba(244,238,229,0.55)",
          }}
        >
          <span>Cartier · Van Cleef &amp; Arpels · Tiffany · Bvlgari · Chopard · Chanel</span>
          <span>London, UK</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
