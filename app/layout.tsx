import type { Metadata } from 'next';
import './globals.css';
import './readability.css';
import './admin.css';
import './studio.css';
import './prototype-updates.css';
export const metadata: Metadata = {
  title: 'UI Notes — 눈으로 이해하는 UI 사전',
  description: 'UI의 이름부터 움직임까지. 직접 만져보며 이해하는 실무자를 위한 UI 레퍼런스.',
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="ko"><body>{children}</body></html>;
}
