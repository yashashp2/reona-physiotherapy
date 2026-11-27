import { ImageResponse } from 'next/og';
export const alt = 'Reona Barretto Physiotherapy — Move better. Feel stronger. Live confidently.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        background: '#F5F1E8',
        color: '#35594C',
        display: 'flex',
        flexDirection: 'column',
        padding: '70px 85px',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ display: 'flex', fontSize: 26, letterSpacing: 4 }}>
        REONA BARRETTO · PHYSIOTHERAPY
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          fontSize: 76,
          lineHeight: 1.1,
          fontFamily: 'serif',
        }}
      >
        <span>Move better. Feel stronger.</span>
        <span style={{ fontStyle: 'italic' }}>Live confidently.</span>
      </div>
      <div
        style={{ display: 'flex', fontSize: 23, borderTop: '1px solid #A8B5A2', paddingTop: 24 }}
      >
        Personalised care. Meaningful movement.
      </div>
    </div>,
    size,
  );
}
