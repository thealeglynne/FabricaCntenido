'use client';
import { useState } from 'react';
import PanelPrincipal from './components/PanelPrincipal'; // Ajusta la ruta si tu estructura cambia
import PanelAnalista from './components/PanelAnalista';
import Header from './components/Header';
import PanelGerente from './components/PanelGerente';

export default function Home() {
  const [panel, setPanel] = useState('lider'); // 'lider', 'analista', 'gerente'

  return (
    <main style={{padding:0, minHeight:"100vh", background:'#101010'}}>
      <Header />
      <div style={{
        display: 'flex', 
        justifyContent: 'center', 
        gap: '1.5rem',
        margin: '2.5rem 0 1.5rem 0'
      }}>
        <button 
          onClick={() => setPanel('lider')} 
          className={`btn-main ${panel === 'lider' ? 'active-tab' : ''}`}
          style={{outline: panel==='lider' ? '2px solid #222' : ''}}
        >
          Panel Líder
        </button>
        <button 
          onClick={() => setPanel('analista')}
          className={`btn-secondary ${panel === 'analista' ? 'active-tab' : ''}`}
          style={{outline: panel==='analista' ? '2px solid #222' : ''}}
        >
          Panel Analista
        </button>
        <button 
          onClick={() => setPanel('gerente')}
          className={`btn-secondary ${panel === 'gerente' ? 'active-tab' : ''}`}
          style={{outline: panel==='gerente' ? '2px solid #222' : ''}}
        >
          Panel Gerente
        </button>
      </div>
      <div>
        {panel === 'lider' && <PanelPrincipal />}
        {panel === 'analista' && <PanelAnalista />}
        {panel === 'gerente' && <PanelGerente />}
      </div>
    </main>
  );
}
