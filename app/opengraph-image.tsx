import { ImageResponse } from 'next/og';
import { site } from '@/lib/site';

export const alt = 'Mohammad Awais Ansari — Full-Stack Developer and AI Applications';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%', height: '100%', padding: '64px 72px', background: '#0D0F10', color: '#F3F0EA' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 22, color: '#A4A6A8' }}><span>FULL-STACK DEVELOPER / AI APPLICATIONS</span><span>www.awaisansari.tech</span></div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
        <div style={{ fontSize: 76, lineHeight: 1.05, letterSpacing: -4 }}>{site.name}</div>
        <div style={{ fontSize: 30, maxWidth: 900, color: '#A4A6A8' }}>I turn ideas into useful web apps—with AI where it matters.</div>
      </div>
      <div style={{ display: 'flex', borderTop: '1px solid #363839', paddingTop: 24, fontSize: 22 }}>BuildStack · CareerWise · TripCraft</div>
    </div>, size,
  );
}
