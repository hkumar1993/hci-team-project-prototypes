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

  // Influence state lives here so it persists across HiFi screen navigation
  const [genreInfluence,setGenreInfluence]=useState(
    {g1:.82,g2:.28,g3:.71,g4:.64,g5:.55,g6:.09}
  );
  const [artistInfluence,setArtistInfluence]=useState(
    {a1:1.00,a2:0.75,a3:0.70,a4:0.03,a5:0.01,a6:0.42}
  );
  const [songInfluence,setSongInfluence]=useState(
    {s1:.88,s2:.55,s3:.42,s4:.71,s5:.60,s6:.25,s7:.78,s8:.33,s9:.18,s10:.48,s11:.64,s12:.30}
  );

  const clamp=v=>Math.min(1,Math.max(0,v));
  const adjustGenre =(id,d)=>setGenreInfluence (p=>({...p,[id]:clamp(p[id]+d)}));
  const adjustArtist=(id,d)=>setArtistInfluence(p=>({...p,[id]:clamp(p[id]+d)}));
  const adjustSong  =(id,d)=>setSongInfluence  (p=>({...p,[id]:clamp(p[id]+d)}));

  return <>
    <style>{`*{box-sizing:border-box;}button,div,span{font-family:'Manrope','Inter',system-ui,sans-serif;}*::-webkit-scrollbar{display:none;}`}</style>
    <TopTabNav activeTab={activeTab} onTabChange={setActiveTab}/>
    <div style={{position:'fixed',top:48,left:0,right:0,bottom:0,overflow:'hidden'}}>
      {/* Keep medium fidelity canvas mounted to preserve pan/zoom state */}
      <div style={{display:activeTab==='medium'?'block':'none',height:'100%'}}>
        <MediumFidelityView/>
      </div>
      {activeTab==='raw'&&<RawPlaceholder/>}
      {activeTab==='hifi'&&
        <HiFiView
          genreInfluence={genreInfluence}
          artistInfluence={artistInfluence}
          songInfluence={songInfluence}
          adjustGenre={adjustGenre}
          adjustArtist={adjustArtist}
          adjustSong={adjustSong}/>}
    </div>
  </>;
}
