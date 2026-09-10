import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {title:'Neuron / explored — Interactive 3D Study Model',description:'Explore a 3D neuron and learn how its structures work together. An interactive anatomy study tool for psychology students.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
