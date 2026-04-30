import { useState, useEffect, useRef, useCallback } from "react";

const BG='#0E0A1F',CREAM='#F5EFE0',LIME='#D4FF6B',CORAL='#FF6B57',VIOLET='#B7A8FF';

const SONGS=[
  {id:'s1', title:'Paper Moons',         artist:'Jules Marin',      years:2.1,hue:14, sat:82},
  {id:'s2', title:'Low Tide Lullaby',    artist:'Harbour & Vane',   years:1.8,hue:204,sat:68},
  {id:'s3', title:'Caramel City',        artist:'Odette Roe',       years:3.4,hue:34, sat:76},
  {id:'s4', title:'Gridlock Choir',      artist:'Patchwork',        years:2.6,hue:276,sat:62},
  {id:'s5', title:'Melt Slowly',         artist:'Neon Pilgrim',     years:1.2,hue:162,sat:58},
  {id:'s6', title:'Everything Is Quiet', artist:'Saga Linde',       years:4.1,hue:224,sat:54},
  {id:'s7', title:'Postcard From You',   artist:'Fernand Kite',     years:1.5,hue:10, sat:72},
  {id:'s8', title:'Cursive Sky',         artist:'Moss & Meridian',  years:2.9,hue:132,sat:48},
  {id:'s9', title:'Overgrown',           artist:'Wren Aldine',      years:5.0,hue:88, sat:52},
  {id:'s10',title:'Split the Difference',artist:'The Usual Quiet',  years:1.1,hue:300,sat:66},
  {id:'s11',title:'Lemon Grove',         artist:'Clementine Hayes', years:2.3,hue:48, sat:78},
  {id:'s12',title:'Static Prayer',       artist:'Vale Harper',      years:3.7,hue:252,sat:60},
];
const GENRES=[
  {id:'g1',name:'Lo-fi Ambient', weight:.82,hue:200},
  {id:'g2',name:'Country Pop',   weight:.28,hue:36},
  {id:'g3',name:'Bedroom Pop',   weight:.71,hue:320},
  {id:'g4',name:'Mid-90s R&B',   weight:.64,hue:14},
  {id:'g5',name:'Shoegaze',      weight:.55,hue:264},
  {id:'g6',name:'Holiday',       weight:.09,hue:140},
];
const ARTISTS=[
  {id:'a1',name:'Jules Marin',    plays:412,hue:14},
  {id:'a2',name:'Odette Roe',     plays:308,hue:34},
  {id:'a3',name:'Harbour & Vane', plays:289,hue:204},
  {id:'a4',name:'The Usual Quiet',plays:12, hue:300},
  {id:'a5',name:'Vale Harper',    plays:5,  hue:252},
  {id:'a6',name:'Moss & Meridian',plays:174,hue:132},
];

function Art({song,size=56,r=8}){
  const h=song.hue,s=song.sat;
  return <div style={{width:size,height:size,borderRadius:r,flexShrink:0,
    background:`linear-gradient(135deg,hsl(${h},${s}%,26%) 0%,hsl(${(h+40)%360},${s*.6}%,14%) 100%)`,
    position:'relative',overflow:'hidden',boxShadow:'inset 0 0 0 1px rgba(255,255,255,.06)'}}>
    <div style={{position:'absolute',top:'18%',left:'18%',width:'65%',height:'65%',borderRadius:'50%',
      background:`hsla(${(h+180)%360},${s}%,62%,.35)`,filter:'blur(5px)'}}/>
  </div>;
}

const P={home:'M3 11l9-8 9 8v10a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1z',
  srch:['M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16z','M21 21l-4.5-4.5'],
  lib:['M4 4v16','M9 4v16','M14 4l5 16'],
  play:'M7 4v16l13-8z',pause:['M7 4v16','M17 4v16'],
  plus:['M12 5v14','M5 12h14'],chk:'M5 12l5 5L20 7',
  x:['M6 6l12 12','M18 6L6 18'],back:['M15 18l-6-6 6-6'],
  more:['M5 12h.01','M12 12h.01','M19 12h.01'],
  sort:['M4 7h16','M6 12h12','M9 17h6'],
  shuf:['M16 3h5v5','M21 3l-7 7','M3 21l7-7','M21 21h-5v-5'],
  dl:['M12 3v12','M7 10l5 5 5-5','M4 21h16'],
  heart:'M12 21s-7-4.35-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.65-9.5 9-9.5 9z',
  slid:['M4 6h10','M18 6h2','M4 12h4','M12 12h8','M4 18h14','M18 18h2','M16 4v4','M10 10v4','M16 16v4'],
  bell:['M18 16l-1-1v-4a5 5 0 0 0-10 0v4l-1 1z','M10 20a2 2 0 0 0 4 0'],
  clk:['M12 7v5l3 2'],
  spkl:['M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2z','M19 14l1 2 2 1-2 1-1 2-1-2-2-1 2-1z'],
  chev:'M9 6l6 6-6 6',chevU:'M6 15l6-6 6 6',chevD:'M6 9l6 6 6-6'};

const Ic=({d,sz=20,st=CREAM,fill='none',sw=1.8})=>(
  <svg width={sz} height={sz} viewBox="0 0 24 24" fill={fill} stroke={st} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d)?d.map((p,i)=><path key={i} d={p}/>):<path d={d}/>}
  </svg>
);

const Pill=({children,on,onClick,style})=>(
  <button onClick={onClick} style={{border:'none',cursor:'pointer',whiteSpace:'nowrap',
    padding:'6px 13px',borderRadius:999,fontSize:12,fontWeight:600,
    background:on?CREAM:'rgba(245,239,224,.1)',color:on?BG:CREAM,...style}}>{children}</button>
);

function SBar(){
  return <div style={{position:'absolute',top:0,left:0,right:0,height:44,
    display:'flex',alignItems:'flex-end',justifyContent:'space-between',
    padding:'0 22px 7px',zIndex:10,color:CREAM,fontSize:14,fontWeight:700,pointerEvents:'none'}}>
    <span>9:41</span>
    <div style={{display:'flex',gap:6,alignItems:'center'}}>
      <div style={{display:'flex',gap:2,alignItems:'flex-end'}}>
        {[3,5,7,9].map((h,i)=><div key={i} style={{width:3,height:h,borderRadius:1,background:CREAM}}/>)}
      </div>
      <Ic d={['M11 19a8 8 0 1 1 0-16','M11 14a3 3 0 1 1 0-6']} sz={16} st={CREAM} sw={1.5}/>
      <div style={{width:22,height:11,borderRadius:3,border:'1.5px solid rgba(245,239,224,.5)',
        position:'relative',overflow:'hidden',marginLeft:2}}>
        <div style={{position:'absolute',left:2,top:2,bottom:2,width:'80%',background:CREAM,borderRadius:1}}/>
      </div>
    </div>
  </div>;
}

function TabBar({active='library'}){
  return <div style={{position:'absolute',left:0,right:0,bottom:0,paddingBottom:20,paddingTop:10,
    background:`linear-gradient(to top,${BG} 65%,rgba(14,10,31,0))`,
    display:'flex',justifyContent:'space-around',zIndex:6}}>
    {[{id:'home',l:'Home',d:P.home},{id:'search',l:'Search',d:P.srch},{id:'library',l:'Library',d:P.lib}].map(t=>(
      <div key={t.id} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:4,
        color:t.id===active?CREAM:'rgba(245,239,224,.38)',fontSize:11,fontWeight:600}}>
        <Ic d={t.d} sz={22} st={t.id===active?CREAM:'rgba(245,239,224,.38)'} sw={t.id===active?2.2:1.8}/>
        {t.l}
      </div>
    ))}
  </div>;
}

function MiniPlayer({bottom=76}){
  const s=SONGS[0];
  return <div style={{position:'absolute',left:8,right:8,bottom,height:56,borderRadius:14,
    background:'linear-gradient(90deg,#2A1E55,#3B2470)',
    display:'flex',alignItems:'center',padding:'0 10px',gap:10,
    boxShadow:'0 8px 28px rgba(0,0,0,.5)',zIndex:5}}>
    <Art song={s} size={40} r={6}/>
    <div style={{flex:1,minWidth:0}}>
      <div style={{fontSize:13,fontWeight:700,color:CREAM,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{s.title}</div>
      <div style={{fontSize:11,color:'rgba(245,239,224,.6)'}}>{s.artist}</div>
    </div>
    <div style={{display:'flex',alignItems:'center',gap:12}}>
      <Ic d={P.heart} sz={18} fill={CORAL} st={CORAL}/>
      <Ic d={P.pause} sz={18} sw={2.4}/>
    </div>
    <div style={{position:'absolute',left:10,right:10,bottom:4,height:2,background:'rgba(245,239,224,.15)',borderRadius:1,overflow:'hidden'}}>
      <div style={{width:'34%',height:'100%',background:CREAM}}/>
    </div>
  </div>;
}

function Shell({children}){
  return <div style={{width:390,height:800,position:'relative',overflow:'hidden',
    background:BG,borderRadius:44,flexShrink:0,
    boxShadow:'0 0 0 10px #0a0716,0 0 0 11px rgba(255,255,255,.06),0 32px 72px rgba(0,0,0,.6)',
    fontFamily:"'Manrope','Inter',system-ui,sans-serif"}}>
    <SBar/>{children}
    <div style={{position:'absolute',left:'50%',transform:'translateX(-50%)',
      bottom:6,width:120,height:4,borderRadius:3,background:'rgba(245,239,224,.45)',zIndex:10}}/>
  </div>;
}

// ── Library ─────────────────────────────────────────────────
function LibraryScreen({onLiked,onMenu}){
  return <Shell>
    <div style={{padding:'50px 20px 0'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <div onClick={onMenu} style={{width:34,height:34,borderRadius:17,cursor:onMenu?'pointer':'default',
            background:'linear-gradient(135deg,#FF6B57,#FF9272)',
            display:'flex',alignItems:'center',justifyContent:'center',color:BG,fontWeight:800,fontSize:14}}>H</div>
          <span style={{fontSize:20,fontWeight:800,color:CREAM}}>Your Library</span>
        </div>
        <div style={{display:'flex',gap:16,color:CREAM}}><Ic d={P.srch} sz={20}/><Ic d={P.plus} sz={20}/></div>
      </div>
      <div style={{display:'flex',gap:8,marginTop:14,overflowX:'auto',scrollbarWidth:'none'}}>
        {['Playlists','Albums','Artists','Podcasts'].map(t=><Pill key={t}>{t}</Pill>)}
      </div>
    </div>
    <div style={{padding:'14px 20px 8px',display:'flex',alignItems:'center',gap:8,fontSize:13,color:CREAM,fontWeight:600}}>
      <Ic d={P.sort} sz={15}/> Recents
    </div>
    <div onClick={onLiked} style={{display:'flex',alignItems:'center',gap:14,padding:'10px 20px',cursor:'pointer'}}>
      <div style={{width:52,height:52,borderRadius:8,background:'linear-gradient(145deg,#8ba6ff,#2B1F5E)',
        display:'flex',alignItems:'center',justifyContent:'center'}}>
        <Ic d={P.heart} sz={22} fill={CREAM} st={CREAM}/>
      </div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:14,fontWeight:700,color:CREAM}}>Liked Songs</div>
        <div style={{fontSize:12,color:'rgba(245,239,224,.5)',marginTop:2}}>
          <span style={{color:LIME,marginRight:6}}>◆</span>Playlist · 2,091 songs
        </div>
      </div>
    </div>
    {[{s:SONGS[1],t:'New Episodes',sub:'Updated yesterday'},
      {s:SONGS[2],t:"Summer Stack '25",sub:'Playlist · 44 songs'},
      {s:SONGS[7],t:'Moss & Meridian',sub:'Artist'},
      {s:SONGS[4],t:'Sleep Drift',sub:'Playlist · Pulse'},
      {s:SONGS[9],t:'Cursive Sky',sub:'Album · The Usual Quiet'},
    ].map(({s,t,sub})=>(
      <div key={t} style={{display:'flex',alignItems:'center',gap:14,padding:'9px 20px'}}>
        <Art song={s} size={52} r={8}/>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:14,fontWeight:600,color:CREAM,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{t}</div>
          <div style={{fontSize:12,color:'rgba(245,239,224,.5)',marginTop:2}}>{sub}</div>
        </div>
      </div>
    ))}
    <MiniPlayer/><TabBar/>
  </Shell>;
}

// ── P1 Liked Songs list ──────────────────────────────────────
function LikedSongsList({onBack,onClean}){
  return <Shell>
    <div style={{position:'absolute',top:0,left:0,right:0,height:240,
      background:'linear-gradient(180deg,#4B3A9C 0%,#1F163E 65%,rgba(14,10,31,0) 100%)'}}/>
    <div style={{position:'relative',zIndex:2,padding:'48px 20px 0'}}>
      <div onClick={onBack} style={{width:34,height:34,borderRadius:17,
        background:'rgba(0,0,0,.35)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}>
        <Ic d={P.back} sz={17}/>
      </div>
      <div style={{marginTop:26}}>
        <div style={{fontSize:38,lineHeight:1,color:CREAM,fontWeight:800}}>Liked Songs</div>
        <div style={{fontSize:13,color:'rgba(245,239,224,.6)',marginTop:5}}>2,091 songs</div>
      </div>
      <div style={{marginTop:14,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div style={{display:'flex',gap:12,alignItems:'center'}}>
          <div style={{position:'relative',width:30,height:30}}>
            <Art song={SONGS[3]} size={28} r={5}/>
            <div style={{position:'absolute',top:2,left:2}}><Art song={SONGS[1]} size={28} r={5}/></div>
          </div>
          <div style={{width:28,height:28,borderRadius:14,border:`1.5px solid rgba(245,239,224,.4)`,
            display:'flex',alignItems:'center',justifyContent:'center'}}><Ic d={P.dl} sz={13}/></div>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <Ic d={P.shuf} sz={19}/>
          <div style={{width:46,height:46,borderRadius:23,background:LIME,
            display:'flex',alignItems:'center',justifyContent:'center'}}>
            <Ic d={P.play} sz={19} fill={BG} st={BG} sw={0}/>
          </div>
        </div>
      </div>
      <div style={{display:'flex',gap:8,marginTop:12,overflowX:'auto',scrollbarWidth:'none'}}>
        {['Chill','Indie','Bedroom Pop','R&B'].map(t=><Pill key={t}>{t}</Pill>)}
      </div>
    </div>
    <div style={{marginTop:8,paddingBottom:150}}>
      <div style={{display:'flex',alignItems:'center',gap:14,padding:'10px 20px'}}>
        <div style={{width:44,height:44,borderRadius:10,
          background:'rgba(245,239,224,.08)',display:'flex',alignItems:'center',justifyContent:'center',
          border:'1px solid rgba(245,239,224,.12)'}}>
          <Ic d={P.plus} sz={22} st={CREAM} sw={2}/>
        </div>
        <div style={{fontSize:15,color:CREAM,fontWeight:600}}>Add to this playlist</div>
      </div>
      <div onClick={onClean} style={{display:'flex',alignItems:'center',gap:14,padding:'10px 20px',
        cursor:'pointer',
        background:'linear-gradient(90deg,rgba(212,255,107,.12),rgba(212,255,107,0))',
        borderLeft:`2px solid ${LIME}`}}>
        <div style={{width:44,height:44,borderRadius:10,
          background:'rgba(212,255,107,.14)',display:'flex',alignItems:'center',justifyContent:'center',
          border:`1px solid rgba(212,255,107,.4)`}}>
          <Ic d={P.spkl} sz={20} st={LIME}/>
        </div>
        <div style={{flex:1}}>
          <div style={{fontSize:14,fontWeight:700,color:LIME}}>Spring Cleaning</div>
          <div style={{fontSize:12,color:'rgba(245,239,224,.55)',marginTop:1}}>Swipe through and tidy up →</div>
        </div>
        <Ic d={P.chev} sz={17} st={LIME}/>
      </div>
      {SONGS.slice(0,7).map(s=>(
        <div key={s.id} style={{display:'flex',alignItems:'center',gap:12,padding:'9px 20px'}}>
          <Art song={s} size={44} r={6}/>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:14,color:CREAM,fontWeight:500}}>{s.title}</div>
            <div style={{fontSize:12,color:'rgba(245,239,224,.5)'}}>{s.artist}</div>
          </div>
          <Ic d={P.more} sz={18} st="rgba(245,239,224,.4)"/>
        </div>
      ))}
    </div>
    <MiniPlayer/><TabBar/>
  </Shell>;
}

// ── P1 Swipe card ────────────────────────────────────────────
const POOL=(()=>{
  const ts=['Paper Moons','Low Tide Lullaby','Caramel City','Gridlock Choir','Melt Slowly',
    'Everything Is Quiet','Postcard From You','Cursive Sky','Overgrown','Split the Difference',
    'Lemon Grove','Static Prayer','Honeycomb Highway','Velvet Machine','Slow Dial',
    'Wishing Well Blues','Ferris Wheel','Neon Tiger','Winter Garden','Quiet Season',
    'Mile Marker','Glass Apartments','Kodachrome Kid','Tangerine Tape','Salt & Ember',
    'Bright Archive','Cinnamon Static','Folded Map','Subway Hymn','Blue Volta'];
  const as=['Jules Marin','Harbour & Vane','Odette Roe','Patchwork','Neon Pilgrim',
    'Saga Linde','Fernand Kite','Moss & Meridian','Wren Aldine','The Usual Quiet'];
  return ts.map((title,i)=>({id:`p${i}`,title,artist:as[i%as.length],
    years:1.2+(i*.23)%4,hue:(i*37)%360,sat:55+(i*11)%30}));
})();

function SwipeCard({song,zIndex,offset=0,isTop=true,onKeep,onRemove}){
  const [drag,setDrag]=useState({x:0,y:0});
  const [exit,setExit]=useState(null);
  const startRef=useRef(null);
  const activeRef=useRef(false);
  const exitRef=useRef(false);

  useEffect(()=>{
    if(!isTop)return;
    const pt=e=>e.touches?.[0]?{x:e.touches[0].clientX,y:e.touches[0].clientY}:{x:e.clientX,y:e.clientY};
    const move=e=>{
      if(!activeRef.current||exitRef.current||!startRef.current)return;
      const p=pt(e);setDrag({x:p.x-startRef.current.x,y:p.y-startRef.current.y});
    };
    const end=e=>{
      if(!activeRef.current||exitRef.current||!startRef.current)return;
      const p=pt(e);const dx=p.x-startRef.current.x;
      activeRef.current=false;startRef.current=null;
      if(dx>90){exitRef.current=true;setExit('k');setTimeout(()=>onKeep&&onKeep(),280);}
      else if(dx<-90){exitRef.current=true;setExit('r');setTimeout(()=>onRemove&&onRemove(),280);}
      else setDrag({x:0,y:0});
    };
    window.addEventListener('mousemove',move);window.addEventListener('mouseup',end);
    window.addEventListener('touchmove',move,{passive:false});window.addEventListener('touchend',end);
    return()=>{window.removeEventListener('mousemove',move);window.removeEventListener('mouseup',end);
      window.removeEventListener('touchmove',move);window.removeEventListener('touchend',end);};
  },[isTop,song.id,onKeep,onRemove]);

  const onStart=e=>{
    if(!isTop||exitRef.current)return;
    const p=e.touches?.[0]?{x:e.touches[0].clientX,y:e.touches[0].clientY}:{x:e.clientX,y:e.clientY};
    startRef.current=p;activeRef.current=true;setDrag({x:0,y:0});
  };

  let tx=drag.x,ty=drag.y,rot=drag.x/16;
  if(exit==='k'){tx=520;ty=-40;rot=22;}
  if(exit==='r'){tx=-520;ty=-40;rot=-22;}
  const kOp=Math.min(1,Math.max(0,drag.x/90));
  const rOp=Math.min(1,Math.max(0,-drag.x/90));

  return <div onMouseDown={onStart} onTouchStart={onStart} style={{
    position:'absolute',left:22,right:22,top:128+offset,height:445,
    borderRadius:28,zIndex,
    background:`linear-gradient(155deg,hsl(${song.hue},${song.sat}%,28%) 0%,hsl(${(song.hue+40)%360},${song.sat*.55}%,13%) 100%)`,
    boxShadow:'0 22px 55px rgba(0,0,0,.6)',
    transform:`translate(${tx}px,${ty}px) rotate(${rot}deg) scale(${1-offset*.018})`,
    transition:activeRef.current?'none':'transform 270ms cubic-bezier(.2,.7,.2,1)',
    touchAction:'none',cursor:isTop?'grab':'default',userSelect:'none',overflow:'hidden'}}>
    <div style={{position:'absolute',top:28,left:'50%',transform:'translateX(-50%)',
      width:220,height:220,borderRadius:18,overflow:'hidden',boxShadow:'0 10px 30px rgba(0,0,0,.5)'}}>
      <Art song={song} size={220} r={18}/>
    </div>
    <div style={{position:'absolute',left:26,right:26,bottom:100}}>
      <div style={{fontSize:27,lineHeight:1.05,color:CREAM,fontWeight:800}}>{song.title}</div>
      <div style={{fontSize:14,color:'rgba(245,239,224,.75)',marginTop:4,fontWeight:500}}>{song.artist}</div>
    </div>
    <div style={{position:'absolute',left:26,bottom:58,display:'flex',alignItems:'center',gap:7,
      fontSize:12,color:'rgba(245,239,224,.6)',fontWeight:600}}>
      <Ic d={P.clk} sz={13}/> {song.years<2?`${Math.round(song.years*12)}mo`:`${song.years.toFixed(1)}y`} ago
    </div>
    <div style={{position:'absolute',left:26,right:26,bottom:20,display:'flex',alignItems:'center',gap:10}}>
      <div style={{width:30,height:30,borderRadius:15,background:'rgba(245,239,224,.12)',
        display:'flex',alignItems:'center',justifyContent:'center'}}>
        <Ic d={P.play} sz={13} fill={CREAM} st={CREAM} sw={0}/>
      </div>
      <div style={{flex:1,height:2,background:'rgba(245,239,224,.2)',borderRadius:1,overflow:'hidden'}}>
        <div style={{width:'22%',height:'100%',background:CREAM}}/>
      </div>
      <span style={{fontSize:11,color:'rgba(245,239,224,.6)'}}>0:42</span>
    </div>
    <div style={{position:'absolute',top:26,left:18,padding:'5px 12px',borderRadius:7,
      border:`3px solid ${CORAL}`,color:CORAL,fontSize:19,fontWeight:900,letterSpacing:2,
      transform:'rotate(-14deg)',opacity:rOp}}>REMOVE</div>
    <div style={{position:'absolute',top:26,right:18,padding:'5px 12px',borderRadius:7,
      border:`3px solid ${LIME}`,color:LIME,fontSize:19,fontWeight:900,letterSpacing:2,
      transform:'rotate(14deg)',opacity:kOp}}>KEEP</div>
  </div>;
}

function SpringCleaningScreen({onBack}){
  const N=POOL.length;
  const [idx,setIdx]=useState(0);
  const [kept,setKept]=useState(0);
  const [rmvd,setRmvd]=useState(0);
  const cur=POOL[idx%N];
  const next=()=>setIdx(i=>(i+1)%N);

  return <Shell>
    <div style={{position:'absolute',inset:0,
      background:`radial-gradient(circle at 50% 28%,hsla(${cur.hue},${cur.sat}%,33%,.5) 0%,${BG} 58%)`,
      transition:'background 480ms ease'}}/>
    <div style={{position:'absolute',top:50,left:20,right:20,
      display:'flex',alignItems:'center',justifyContent:'space-between',zIndex:5}}>
      <div onClick={onBack} style={{display:'flex',alignItems:'center',gap:6,cursor:'pointer',
        padding:'7px 12px',borderRadius:999,background:'rgba(0,0,0,.4)',color:CREAM}}>
        <Ic d={P.back} sz={14} sw={2.2}/><span style={{fontSize:12,fontWeight:700}}>All done</span>
      </div>
      <span style={{fontSize:11,color:'rgba(245,239,224,.5)',fontWeight:700,letterSpacing:1.2,textTransform:'uppercase'}}>Spring Cleaning</span>
      <div style={{width:60}}/>
    </div>

    {[0,1,2].map(off=>(
      <SwipeCard key={POOL[(idx+off)%N].id+String(off)} song={POOL[(idx+off)%N]}
        zIndex={3-off} offset={off*14} isTop={off===0}
        onKeep={off===0?()=>{setKept(k=>k+1);next();}:undefined}
        onRemove={off===0?()=>{setRmvd(r=>r+1);next();}:undefined}/>
    ))}
    <div style={{position:'absolute',bottom:94,left:24,right:24,zIndex:5,
      display:'flex',gap:14}}>
      <div onClick={()=>{setRmvd(r=>r+1);next();}} style={{flex:1,height:52,borderRadius:14,
        background:'rgba(255,107,87,.14)',border:`1.5px solid ${CORAL}`,
        display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}>
        <span style={{fontSize:15,fontWeight:800,color:CORAL,letterSpacing:.4}}>Remove</span>
      </div>
      <div onClick={()=>{setKept(k=>k+1);next();}} style={{flex:1,height:52,borderRadius:14,
        background:'rgba(212,255,107,.14)',border:`1.5px solid ${LIME}`,
        display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}>
        <span style={{fontSize:15,fontWeight:800,color:LIME,letterSpacing:.4}}>Keep</span>
      </div>
    </div>
  </Shell>;
}

// ── P2 Staleness drawer ──────────────────────────────────────
function LikedSongsWithDrawer({onBack,defaultOpen=false}){
  const [open,setOpen]=useState(defaultOpen);
  const [stale,setStale]=useState([...SONGS,...SONGS.map(s=>({...s,id:s.id+'b'}))].slice(0,12));
  const removeOne=id=>setStale(p=>p.filter(s=>s.id!==id));

  return <Shell>
    <div style={{position:'absolute',inset:0,overflow:'hidden',
      filter:open?'brightness(.5) blur(1px)':'none',transition:'filter 280ms ease'}}>
      <div style={{position:'absolute',top:0,left:0,right:0,height:240,
        background:'linear-gradient(180deg,#4B3A9C 0%,#1F163E 65%,rgba(14,10,31,0) 100%)'}}/>
      <div style={{padding:'48px 20px 0',position:'relative',zIndex:2}}>
        <div onClick={onBack} style={{width:34,height:34,borderRadius:17,background:'rgba(0,0,0,.35)',
          display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}>
          <Ic d={P.back} sz={17}/>
        </div>
        <div style={{marginTop:26}}>
          <div style={{fontSize:38,color:CREAM,fontWeight:800}}>Liked Songs</div>
          <div style={{fontSize:13,color:'rgba(245,239,224,.6)',marginTop:4}}>2,091 songs</div>
        </div>
        <div style={{marginTop:14,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <Ic d={P.shuf} sz={19}/>
          <div style={{width:46,height:46,borderRadius:23,background:LIME,
            display:'flex',alignItems:'center',justifyContent:'center'}}>
            <Ic d={P.play} sz={19} fill={BG} st={BG} sw={0}/>
          </div>
        </div>
      </div>
      <div style={{marginTop:8}}>
        <div style={{display:'flex',alignItems:'center',gap:14,padding:'10px 20px'}}>
          <div style={{width:44,height:44,borderRadius:10,
            background:'rgba(245,239,224,.08)',display:'flex',alignItems:'center',justifyContent:'center',
            border:'1px solid rgba(245,239,224,.12)'}}>
            <Ic d={P.plus} sz={22} st={CREAM} sw={2}/>
          </div>
          <div style={{fontSize:15,color:CREAM,fontWeight:600}}>Add to this playlist</div>
        </div>
        {SONGS.slice(0,5).map(s=>(
          <div key={s.id} style={{display:'flex',alignItems:'center',gap:12,padding:'9px 20px'}}>
            <Art song={s} size={44} r={6}/>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:14,color:CREAM,fontWeight:500}}>{s.title}</div>
              <div style={{fontSize:12,color:'rgba(245,239,224,.5)'}}>{s.artist}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
    {open&&<div onClick={()=>setOpen(false)} style={{position:'absolute',inset:0,background:'rgba(0,0,0,.3)',zIndex:8,cursor:'pointer'}}/>}
    <div style={{position:'absolute',left:0,right:0,bottom:0,
      height:open?608:108,zIndex:9,
      background:'linear-gradient(180deg,#2A1E55 0%,#1A1232 100%)',
      borderTopLeftRadius:22,borderTopRightRadius:22,
      boxShadow:'0 -10px 40px rgba(0,0,0,.5)',
      border:`1px solid rgba(183,168,255,.18)`,borderBottom:'none',
      transition:'height 320ms cubic-bezier(.2,.7,.2,1)',overflow:'hidden'}}>
      <div onClick={()=>setOpen(o=>!o)} style={{padding:'12px 18px 8px',cursor:'pointer'}}>
        <div style={{width:36,height:4,borderRadius:2,background:'rgba(245,239,224,.3)',margin:'0 auto 10px'}}/>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <div style={{width:38,height:38,borderRadius:11,background:'rgba(183,168,255,.18)',
            display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
            <Ic d={P.spkl} sz={18} st={VIOLET}/>
          </div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:10,color:VIOLET,fontWeight:700,letterSpacing:.9,textTransform:'uppercase'}}>Staleness Report</div>
            <div style={{fontSize:13,color:CREAM,fontWeight:700,marginTop:2,lineHeight:1.3}}>
              You haven't played <span style={{color:VIOLET}}>300 songs</span> in the past year
            </div>
          </div>
          <button onClick={e=>{e.stopPropagation();setOpen(o=>!o);}}
            style={{padding:'7px 13px',borderRadius:999,border:'none',cursor:'pointer',
              background:CREAM,color:BG,fontSize:11,fontWeight:700,flexShrink:0}}>
            {open?'Close':'Review'}
          </button>
        </div>
        {!open&&<div style={{textAlign:'center',marginTop:10,fontSize:11,
          color:'rgba(245,239,224,.4)',fontWeight:600,display:'flex',alignItems:'center',justifyContent:'center',gap:6}}>
          <Ic d={P.chevU} sz={11} st="rgba(245,239,224,.4)" sw={2.4}/> Swipe up to review
        </div>}
      </div>
      {open&&<>
        <div style={{position:'absolute',top:90,left:0,right:0,bottom:76,overflowY:'auto'}}>
          <div style={{display:'flex',gap:8,padding:'6px 18px 12px'}}>
          </div>
          {stale.map(s=>(
            <div key={s.id} style={{display:'flex',alignItems:'center',gap:12,padding:'8px 18px'}}>
              <Art song={s} size={42} r={6}/>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:13,color:CREAM,fontWeight:500}}>{s.title}</div>
                <div style={{fontSize:11,color:'rgba(245,239,224,.5)'}}>{s.artist}</div>
              </div>
              <button onClick={()=>removeOne(s.id)} style={{width:28,height:28,borderRadius:14,border:'none',cursor:'pointer',
                background:CORAL,color:'#fff',
                display:'flex',alignItems:'center',justifyContent:'center'}}>
                <Ic d={P.x} sz={12} sw={2.6}/>
              </button>
            </div>
          ))}
        </div>
      </>}
    </div>
  </Shell>;
}

// ── P3 Profile menu ──────────────────────────────────────────
function ProfileMenu({onAlgo,onBack}){
  const items=[
    {icon:P.plus, label:'Add account'},
    {icon:P.heart,label:'Your Pulse+',badge:'Duo'},
    {icon:P.spkl, label:"What's new"},
    {icon:P.sort, label:'Listening stats'},
    {icon:P.clk,  label:'Recents'},
    {icon:P.slid, label:'Your Algorithm',accent:true,act:onAlgo},
    {icon:P.more, label:'Settings and privacy'},
  ];
  return <Shell>
    <div style={{padding:'56px 20px 0'}}>
      <div style={{display:'flex',alignItems:'center',gap:14}}>
        <div style={{width:50,height:50,borderRadius:25,
          background:'linear-gradient(135deg,#FF6B57,#FF9272)',
          display:'flex',alignItems:'center',justifyContent:'center',color:BG,fontWeight:800,fontSize:20}}>H</div>
        <div style={{flex:1}}>
          <div style={{fontSize:19,fontWeight:800,color:CREAM}}>Harsh</div>
          <div style={{fontSize:12,color:'rgba(245,239,224,.55)'}}>View profile</div>
        </div>
        <div style={{padding:'6px 11px',borderRadius:999,border:'1px solid rgba(245,239,224,.2)',
          fontSize:11,color:'rgba(245,239,224,.75)',fontWeight:600}}>Activity off</div>
      </div>
      <div style={{height:1,background:'rgba(245,239,224,.08)',marginTop:18}}/>
      {items.map(it=>(
        <div key={it.label} onClick={it.act} style={{display:'flex',alignItems:'center',gap:14,padding:'13px 4px',
          cursor:it.act?'pointer':'default',color:it.accent?VIOLET:CREAM}}>
          <Ic d={it.icon} sz={20} st={it.accent?VIOLET:CREAM}/>
          <div style={{fontSize:15,fontWeight:it.accent?700:600}}>{it.label}</div>
          {it.badge&&<div style={{marginLeft:'auto',padding:'4px 10px',borderRadius:999,
            background:LIME,color:BG,fontSize:11,fontWeight:800}}>{it.badge}</div>}
          {it.accent&&!it.badge&&<div style={{marginLeft:'auto',padding:'3px 8px',borderRadius:5,
            background:'rgba(183,168,255,.18)',color:VIOLET,fontSize:10,fontWeight:700}}>NEW</div>}
        </div>
      ))}
    </div>
  </Shell>;
}

function AlgorithmDashboard({onBack}){
  const [genres,setGenres]=useState(GENRES);
  const [artists,setArtists]=useState(ARTISTS);
  const [muted,setMuted]=useState(new Set());
  const [editing,setEditing]=useState(false);
  const toggleM=id=>setMuted(p=>{const n=new Set(p);n.has(id)?n.delete(id):n.add(id);return n;});

  return <Shell>
    <div style={{position:'absolute',top:0,left:0,right:0,height:220,
      background:'radial-gradient(circle at 20% 10%,#3B2470 0%,rgba(14,10,31,0) 70%)'}}/>
    <div style={{position:'relative',zIndex:2,padding:'48px 20px 0'}}>
      <div onClick={onBack} style={{width:34,height:34,borderRadius:17,
        background:'rgba(245,239,224,.08)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}>
        <Ic d={P.back} sz={17}/>
      </div>
      <div style={{marginTop:14}}>
        <div style={{fontSize:10,color:VIOLET,fontWeight:700,letterSpacing:1.2,textTransform:'uppercase'}}>Your Algorithm</div>
        <div style={{fontSize:28,lineHeight:1.1,color:CREAM,fontWeight:800,marginTop:5}}>What's shaping your recommendations</div>
        <div style={{fontSize:12,color:'rgba(245,239,224,.6)',marginTop:8,lineHeight:1.5}}>
          Remove anything you don't want to hear more of.
        </div>
      </div>
    </div>
    <div style={{position:'absolute',top:265,left:0,right:0,bottom:0,overflowY:'auto',paddingBottom:90}}>
      <div style={{padding:'16px 20px 10px',display:'flex',alignItems:'flex-end',justifyContent:'space-between'}}>
        <div>
          <div style={{fontSize:16,fontWeight:800,color:CREAM}}>Genres</div>
          <div style={{fontSize:11,color:'rgba(245,239,224,.5)',marginTop:1}}>Top influences</div>
        </div>
        <div style={{fontSize:11,color:'rgba(245,239,224,.4)',fontWeight:700}}>{genres.length}</div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,padding:'0 20px'}}>
        {genres.map(g=>(
          <div key={g.id} style={{position:'relative',borderRadius:13,padding:11,aspectRatio:'1/.68',
            background:`linear-gradient(135deg,hsl(${g.hue},48%,24%) 0%,hsl(${(g.hue+40)%360},38%,13%) 100%)`,
            overflow:'hidden'}}>
            <div style={{position:'absolute',top:10,right:10,display:'flex',gap:2}}>
              {[0,1,2,3,4].map(i=><div key={i} style={{width:3,height:9,borderRadius:1,
                background:i<Math.round(g.weight*5)?CREAM:'rgba(245,239,224,.22)'}}/>)}
            </div>
            <div style={{position:'absolute',bottom:10,left:10,right:42}}>
              <div style={{fontSize:12,fontWeight:700,color:CREAM,lineHeight:1.1}}>{g.name}</div>
              <div style={{fontSize:10,color:'rgba(245,239,224,.6)',marginTop:3}}>{Math.round(g.weight*100)}% influence</div>
            </div>
            {editing&&<button onClick={()=>setGenres(gs=>gs.filter(x=>x.id!==g.id))}
              style={{position:'absolute',bottom:9,right:9,width:26,height:26,borderRadius:13,
                border:'none',cursor:'pointer',background:CORAL,color:'#fff',
                display:'flex',alignItems:'center',justifyContent:'center'}}>
              <Ic d={P.x} sz={11} sw={2.6}/>
            </button>}
          </div>
        ))}
        {genres.length===0&&<div style={{gridColumn:'1/-1',padding:14,borderRadius:11,
          border:'1px dashed rgba(245,239,224,.15)',textAlign:'center',color:'rgba(245,239,224,.4)',fontSize:12}}>
          No genres influencing right now
        </div>}
      </div>
      <div style={{padding:'16px 20px 10px',display:'flex',alignItems:'flex-end',justifyContent:'space-between'}}>
        <div>
          <div style={{fontSize:16,fontWeight:800,color:CREAM}}>Artists</div>
          <div style={{fontSize:11,color:'rgba(245,239,224,.5)',marginTop:1}}>Heavily weighted</div>
        </div>
        <div style={{fontSize:11,color:'rgba(245,239,224,.4)',fontWeight:700}}>{artists.length}</div>
      </div>
      <div style={{display:'flex',gap:14,overflowX:'auto',padding:'0 20px 4px',scrollbarWidth:'none'}}>
        {artists.map(a=>(
          <div key={a.id} style={{width:96,flexShrink:0}}>
            <div style={{width:96,height:96,borderRadius:48,overflow:'hidden',
              background:`linear-gradient(135deg,hsl(${a.hue},52%,34%) 0%,hsl(${(a.hue+30)%360},42%,18%) 100%)`,
              position:'relative'}}>
              {editing&&<button onClick={()=>setArtists(as=>as.filter(x=>x.id!==a.id))}
                style={{position:'absolute',top:3,right:3,width:24,height:24,borderRadius:12,
                  border:'none',cursor:'pointer',background:CORAL,color:'#fff',
                  display:'flex',alignItems:'center',justifyContent:'center'}}>
                <Ic d={P.x} sz={11} sw={2.6}/>
              </button>}
            </div>
            <div style={{fontSize:11,fontWeight:700,color:CREAM,marginTop:6,textAlign:'center',lineHeight:1.2}}>{a.name}</div>
            <div style={{fontSize:10,color:'rgba(245,239,224,.5)',textAlign:'center',marginTop:1}}>{a.plays} plays</div>
          </div>
        ))}
      </div>
      <div style={{padding:'16px 20px 10px'}}>
        <div style={{fontSize:16,fontWeight:800,color:CREAM}}>Songs</div>
        <div style={{fontSize:11,color:'rgba(245,239,224,.5)',marginTop:1}}>Mute from seeds & repeats</div>
      </div>
      <div style={{padding:'0 20px'}}>
        {SONGS.slice(0,6).map(s=>{
          const m=muted.has(s.id);
          return <div key={s.id} style={{display:'flex',alignItems:'center',gap:12,padding:'8px 0',opacity:m?.45:1}}>
            <Art song={s} size={40} r={6}/>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:13,color:CREAM,fontWeight:500,textDecoration:m?'line-through':'none'}}>{s.title}</div>
              <div style={{fontSize:11,color:'rgba(245,239,224,.5)'}}>{s.artist}</div>
            </div>
            {editing&&<button onClick={()=>toggleM(s.id)} style={{padding:'5px 11px',borderRadius:999,border:'none',cursor:'pointer',
              background:m?'rgba(245,239,224,.1)':'rgba(255,107,87,.18)',color:m?CREAM:CORAL,fontSize:11,fontWeight:700}}>
              {m?'Unmute':'Mute'}
            </button>}
          </div>;
        })}
      </div>

    </div>
    {/* floating edit / save button */}
    <div style={{position:'absolute',bottom:24,left:24,right:24,zIndex:20}}>
      <button onClick={()=>setEditing(e=>!e)} style={{width:'100%',padding:'15px',borderRadius:16,border:'none',
        cursor:'pointer',fontFamily:"'Manrope','Inter',system-ui,sans-serif",
        background:editing?LIME:'rgba(245,239,224,.12)',
        backdropFilter:'blur(12px)',
        color:editing?BG:CREAM,fontSize:15,fontWeight:800,letterSpacing:.2,
        boxShadow:editing?`0 4px 20px rgba(212,255,107,.35)`:'0 4px 20px rgba(0,0,0,.4)',
        transition:'background 200ms ease, color 200ms ease, box-shadow 200ms ease'}}>
        {editing?'Save':'Edit your algorithm'}
      </button>
    </div>
  </Shell>;
}

// ── Flows ────────────────────────────────────────────────────
function FlowP1(){
  const [s,setS]=useState('lib');
  if(s==='lib')  return <LibraryScreen onLiked={()=>setS('liked')}/>;
  if(s==='liked')return <LikedSongsList onBack={()=>setS('lib')} onClean={()=>setS('clean')}/>;
  return <SpringCleaningScreen onBack={()=>setS('liked')}/>;
}
function FlowP2(){
  const [s,setS]=useState('lib');
  if(s==='lib')return <LibraryScreen onLiked={()=>setS('liked')}/>;
  return <LikedSongsWithDrawer onBack={()=>setS('lib')}/>;
}
function FlowP3(){
  const [s,setS]=useState('lib');
  if(s==='lib') return <LibraryScreen onLiked={()=>{}} onMenu={()=>setS('menu')}/>;
  if(s==='menu')return <ProfileMenu onBack={()=>setS('lib')} onAlgo={()=>setS('algo')}/>;
  return <AlgorithmDashboard onBack={()=>setS('menu')}/>;
}

// ── Design Canvas ────────────────────────────────────────────
const GRID=`url("data:image/svg+xml,%3Csvg width='80' height='80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M80 0H0v80' fill='none' stroke='rgba(0,0,0,.065)' stroke-width='1'/%3E%3C/svg%3E")`;

export default function App(){
  const [tf,setTf]=useState({x:56,y:56,scale:.52});
  const vpRef=useRef(null);
  const tfRef=useRef(tf);
  tfRef.current=tf;

  useEffect(()=>{
    const vp=vpRef.current;if(!vp)return;
    const zAt=(cx,cy,fac)=>{
      const r=vp.getBoundingClientRect();
      const px=cx-r.left,py=cy-r.top;
      setTf(prev=>{
        const nxt=Math.min(4,Math.max(.12,prev.scale*fac));
        const k=nxt/prev.scale;
        return{x:px-(px-prev.x)*k,y:py-(py-prev.y)*k,scale:nxt};
      });
    };
    const isMW=e=>e.deltaMode!==0||(e.deltaX===0&&Number.isInteger(e.deltaY)&&Math.abs(e.deltaY)>=40);
    let gest=false,gb=1;
    const onW=e=>{e.preventDefault();if(gest)return;
      if(e.ctrlKey)zAt(e.clientX,e.clientY,Math.exp(-e.deltaY*.01));
      else if(isMW(e))zAt(e.clientX,e.clientY,Math.exp(-Math.sign(e.deltaY)*.18));
      else setTf(p=>({...p,x:p.x-e.deltaX,y:p.y-e.deltaY}));};
    const onGS=e=>{e.preventDefault();gest=true;gb=tfRef.current.scale;};
    const onGC=e=>{e.preventDefault();zAt(e.clientX,e.clientY,(gb*e.scale)/tfRef.current.scale);};
    const onGE=e=>{e.preventDefault();gest=false;};
    let drag=null;
    const onPD=e=>{
      if(e.target.closest('[data-nocan]'))return;
      if(e.button!==0&&e.button!==1)return;
      e.preventDefault();vp.setPointerCapture(e.pointerId);
      drag={id:e.pointerId,lx:e.clientX,ly:e.clientY};vp.style.cursor='grabbing';
    };
    const onPM=e=>{
      if(!drag||e.pointerId!==drag.id)return;
      const dx=e.clientX-drag.lx, dy=e.clientY-drag.ly;
      drag.lx=e.clientX; drag.ly=e.clientY;
      setTf(p=>({...p,x:p.x+dx,y:p.y+dy}));
    };
    const onPU=e=>{if(!drag||e.pointerId!==drag.id)return;
      vp.releasePointerCapture(e.pointerId);drag=null;vp.style.cursor='';};
    vp.addEventListener('wheel',onW,{passive:false});
    vp.addEventListener('gesturestart',onGS,{passive:false});
    vp.addEventListener('gesturechange',onGC,{passive:false});
    vp.addEventListener('gestureend',onGE,{passive:false});
    vp.addEventListener('pointerdown',onPD);
    vp.addEventListener('pointermove',onPM);
    vp.addEventListener('pointerup',onPU);
    vp.addEventListener('pointercancel',onPU);
    return()=>{
      vp.removeEventListener('wheel',onW);
      vp.removeEventListener('gesturestart',onGS);
      vp.removeEventListener('gesturechange',onGC);
      vp.removeEventListener('gestureend',onGE);
      vp.removeEventListener('pointerdown',onPD);
      vp.removeEventListener('pointermove',onPM);
      vp.removeEventListener('pointerup',onPU);
      vp.removeEventListener('pointercancel',onPU);
    };
  },[]);

  const SECS=[
    {id:'p1',title:'P1 · Swipe Spring Cleaning',sub:'Tinder-style cards — swipe right to keep, left to remove',
      boards:[
        {id:'ia',label:'Interactive flow',el:<FlowP1/>},
        {id:'ib',label:'1 · Library',el:<LibraryScreen onLiked={()=>{}}/>},
        {id:'ic',label:'2 · Liked Songs',el:<LikedSongsList onBack={()=>{}} onClean={()=>{}}/>},
        {id:'id',label:'3 · Swipe cards',el:<SpringCleaningScreen onBack={()=>{}}/>},
      ]},
    {id:'p2',title:'P2 · Staleness Drawer',sub:'A bottom drawer peeks when Liked Songs opens — pull up to review unplayed songs',
      boards:[
        {id:'ia',label:'Interactive flow',el:<FlowP2/>},
        {id:'ib',label:'1 · Library',el:<LibraryScreen onLiked={()=>{}}/>},
        {id:'ic',label:'2 · Drawer (peek)',el:<LikedSongsWithDrawer onBack={()=>{}}/>},
        {id:'id',label:'3 · Drawer (open)',el:<LikedSongsWithDrawer onBack={()=>{}} defaultOpen/>},
      ]},
    {id:'p3',title:'P3 · Tune Your Algorithm',sub:'A dashboard from the profile menu — prune genres, artists & songs shaping recommendations',
      boards:[
        {id:'ia',label:'Interactive flow',el:<FlowP3/>},
        {id:'ib',label:'1 · Library',el:<LibraryScreen onLiked={()=>{}}/>},
        {id:'ic',label:'2 · Profile menu',el:<ProfileMenu onBack={()=>{}} onAlgo={()=>{}}/>},
        {id:'id',label:'3 · Algorithm dashboard',el:<AlgorithmDashboard onBack={()=>{}}/>},
      ]},
  ];

  return <>
    <style>{`*{box-sizing:border-box;}button,div,span{font-family:'Manrope','Inter',system-ui,sans-serif;}*::-webkit-scrollbar{display:none;}`}</style>
    <div style={{position:'fixed',bottom:16,right:16,zIndex:200,
      background:'rgba(20,14,38,.8)',backdropFilter:'blur(8px)',
      color:'rgba(255,255,255,.65)',fontSize:11,fontWeight:600,padding:'7px 12px',borderRadius:20,
      pointerEvents:'none',letterSpacing:.3}}>
      Drag to pan · Ctrl+scroll to zoom
    </div>
    <div ref={vpRef} style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'#f0eee9',
      overflow:'hidden',touchAction:'none',cursor:'default',userSelect:'none',
      backgroundImage:GRID,backgroundSize:'80px 80px'}}>
      <div style={{position:'absolute',top:0,left:0,transformOrigin:'0 0',
        transform:`translate3d(${tf.x}px,${tf.y}px,0) scale(${tf.scale})`,
        willChange:'transform',width:'max-content'}}>
        {SECS.map(sec=>(
          <div key={sec.id} style={{marginBottom:72}}>
            <div style={{padding:'0 52px 20px'}}>
              <div style={{fontSize:24,fontWeight:700,color:'rgba(40,28,18,.85)',letterSpacing:-.4}}>{sec.title}</div>
              <div style={{fontSize:13,color:'rgba(60,46,30,.58)',marginTop:4}}>{sec.sub}</div>
            </div>
            <div style={{display:'flex',gap:42,padding:'0 52px',alignItems:'flex-start'}}>
              {sec.boards.map(b=>(
                <div key={b.id} data-nocan style={{flexShrink:0,position:'relative'}}>
                  <div style={{position:'absolute',bottom:'100%',left:0,marginBottom:6,
                    fontSize:12,fontWeight:600,color:'rgba(60,46,30,.62)',whiteSpace:'nowrap'}}>
                    {b.label}
                  </div>
                  <div style={{width:390,height:800,borderRadius:3,overflow:'hidden',
                    boxShadow:'0 1px 4px rgba(0,0,0,.08),0 6px 24px rgba(0,0,0,.08)'}}>
                    {b.el}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </>;
}
