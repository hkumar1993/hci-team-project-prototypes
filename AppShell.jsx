import { useState } from 'react';
import MediumFidelityView from './spotify-hci-v2.jsx';
import HiFiView from './spotify-hifi.jsx';

const BG='#0E0A1F',CREAM='#F5EFE0',LIME='#D4FF6B';

const TABS=[
  {id:'raw',    label:'Raw Hand Drawn Prototype'},
  {id:'medium', label:'Medium Fidelity Prototypes'},
  {id:'hifi',   label:'High Fidelity Prototype'},
];

function TopTabNav({activeTab,onTabChange}){
  return <div style={{position:'fixed',top:0,left:0,right:0,height:48,zIndex:100,
    background:BG,borderBottom:'1px solid rgba(245,239,224,.08)',
    display:'flex',alignItems:'stretch',justifyContent:'center'}}>
    {TABS.map(t=>(
      <button key={t.id} onClick={()=>onTabChange(t.id)} style={{
        padding:'0 22px',border:'none',background:'transparent',cursor:'pointer',
        color:t.id===activeTab?CREAM:'rgba(245,239,224,.45)',
        fontSize:13,fontWeight:600,
        borderBottom:t.id===activeTab?`2px solid ${LIME}`:'2px solid transparent',
        fontFamily:"'Manrope','Inter',system-ui,sans-serif",
        transition:'color 150ms ease,border-bottom-color 150ms ease'}}>
        {t.label}
      </button>
    ))}
  </div>;
}

function RawPlaceholder(){
  return <div style={{width:'100%',height:'100%',background:BG,
    display:'flex',alignItems:'center',justifyContent:'center',
    color:'rgba(245,239,224,.4)',fontSize:16,fontWeight:600,
    fontFamily:"'Manrope','Inter',system-ui,sans-serif"}}>
    PDF will be embedded here
  </div>;
}

export default function App(){
  const [activeTab,setActiveTab]=useState('hifi');

  return <>
    <style>{`*{box-sizing:border-box;}button,div,span{font-family:'Manrope','Inter',system-ui,sans-serif;}*::-webkit-scrollbar{display:none;}`}</style>
    <TopTabNav activeTab={activeTab} onTabChange={setActiveTab}/>
    <div style={{position:'fixed',top:48,left:0,right:0,bottom:0,overflow:'hidden'}}>
      {/* Keep all views mounted to preserve state across tab switches */}
      <div style={{display:activeTab==='medium'?'block':'none',height:'100%'}}>
        <MediumFidelityView/>
      </div>
      <div style={{display:activeTab==='hifi'?'flex':'none',height:'100%',
        alignItems:'center',justifyContent:'center',background:'#000'}}>
        <HiFiView/>
      </div>
      {activeTab==='raw'&&<RawPlaceholder/>}
    </div>
  </>;
}
