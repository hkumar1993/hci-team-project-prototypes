import { useState, useEffect, useRef } from "react";

const BG='#0E0A1F',CREAM='#F5EFE0',LIME='#D4FF6B',CORAL='#FF6B57',VIOLET='#B7A8FF';

const SONGS=[
  {id:'s1', title:'Paper Moons',          artist:'Jules Marin',      album:'Glass Nights EP',    genreId:'g4', years:2.1,hue:14, sat:82, influence:0.88},
  {id:'s2', title:'Low Tide Lullaby',     artist:'Harbour & Vane',   album:'Harbour Tapes',      genreId:'g1', years:1.8,hue:204,sat:68, influence:0.55},
  {id:'s3', title:'Caramel City',         artist:'Odette Roe',       album:'Warm Hours',         genreId:'g2', years:3.4,hue:34, sat:76, influence:0.42},
  {id:'s4', title:'Gridlock Choir',       artist:'Patchwork',        album:'Signal & Noise',     genreId:'g5', years:2.6,hue:276,sat:62, influence:0.71},
  {id:'s5', title:'Melt Slowly',          artist:'Neon Pilgrim',     album:'Peripheral Vision',  genreId:'g3', years:1.2,hue:162,sat:58, influence:0.60},
  {id:'s6', title:'Everything Is Quiet',  artist:'Saga Linde',       album:'Still Light',        genreId:'g1', years:4.1,hue:224,sat:54, influence:0.25},
  {id:'s7', title:'Postcard From You',    artist:'Fernand Kite',     album:'Aerogramme Vol.2',   genreId:'g4', years:1.5,hue:10, sat:72, influence:0.78},
  {id:'s8', title:'Cursive Sky',          artist:'Moss & Meridian',  album:'Overgrowth',         genreId:'g3', years:2.9,hue:132,sat:48, influence:0.33},
  {id:'s9', title:'Overgrown',            artist:'Wren Aldine',      album:'Overgrowth',         genreId:'g3', years:5.0,hue:88, sat:52, influence:0.18},
  {id:'s10',title:'Split the Difference', artist:'The Usual Quiet',  album:'Soft Machinery',     genreId:'g5', years:1.1,hue:300,sat:66, influence:0.48},
  {id:'s11',title:'Lemon Grove',          artist:'Clementine Hayes', album:'Citrus Archive',     genreId:'g2', years:2.3,hue:48, sat:78, influence:0.64},
  {id:'s12',title:'Static Prayer',        artist:'Vale Harper',      album:'Hollow Hours',       genreId:'g1', years:3.7,hue:252,sat:60, influence:0.30},
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
  {id:'a1',name:'Jules Marin',    plays:412,hue:14,  influence:1.00},
  {id:'a2',name:'Odette Roe',     plays:308,hue:34,  influence:0.75},
  {id:'a3',name:'Harbour & Vane', plays:289,hue:204, influence:0.70},
  {id:'a4',name:'The Usual Quiet',plays:12, hue:300, influence:0.03},
  {id:'a5',name:'Vale Harper',    plays:5,  hue:252, influence:0.01},
  {id:'a6',name:'Moss & Meridian',plays:174,hue:132, influence:0.42},
];

function influenceTier(v){
  if(v>=0.65)return'Heavy Influence';
  if(v>=0.35)return'Medium Influence';
  return'Occasional Influence';
}

// ── Primitives (self-contained, not imported from v2) ────────

function Img({id,size=56,r=8}){
  return <div style={{width:size,height:size,borderRadius:r,flexShrink:0,overflow:'hidden',
    boxShadow:'inset 0 0 0 1px rgba(255,255,255,.06)'}}>
    <img src={`https://picsum.photos/seed/${id}/200`} alt=""
      style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}}/>
  </div>;
}

const P={home:'M3 11l9-8 9 8v10a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1z',
  srch:['M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16z','M21 21l-4.5-4.5'],
  lib:['M4 4v16','M9 4v16','M14 4l5 16'],
  play:'M7 4v16l13-8z',pause:['M7 4v16','M17 4v16'],
  plus:['M12 5v14','M5 12h14'],
  x:['M6 6l12 12','M18 6L6 18'],back:['M15 18l-6-6 6-6'],
  more:['M5 12h.01','M12 12h.01','M19 12h.01'],
  sort:['M4 7h16','M6 12h12','M9 17h6'],
  heart:'M12 21s-7-4.35-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.65-9.5 9-9.5 9z',
  slid:['M4 6h10','M18 6h2','M4 12h4','M12 12h8','M4 18h14','M18 18h2','M16 4v4','M10 10v4','M16 16v4'],
};

const Ic=({d,sz=20,st=CREAM,fill='none',sw=1.8})=>(
  <svg width={sz} height={sz} viewBox="0 0 24 24" fill={fill} stroke={st} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d)?d.map((pp,i)=><path key={i} d={pp}/>):<path d={d}/>}
  </svg>
);

const Pill=({children,on,onClick})=>(
  <button onClick={onClick} style={{border:'none',cursor:'pointer',whiteSpace:'nowrap',
    padding:'6px 13px',borderRadius:999,fontSize:12,fontWeight:600,
    background:on?CREAM:'rgba(245,239,224,.1)',color:on?BG:CREAM}}>{children}</button>
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

function MiniPlayer(){
  const s=SONGS[0];
  return <div style={{position:'absolute',left:8,right:8,bottom:76,height:56,borderRadius:14,
    background:'linear-gradient(90deg,#2A1E55,#3B2470)',
    display:'flex',alignItems:'center',padding:'0 10px',gap:10,
    boxShadow:'0 8px 28px rgba(0,0,0,.5)',zIndex:5}}>
    <Img id={s.id} size={40} r={6}/>
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

// ── HiFi Tab Bar ─────────────────────────────────────────────

function HiFiTabBar({active='home',onHome,onLibrary}){
  const tabs=[
    {id:'home',    l:'Home',    d:P.home, onClick:onHome},
    {id:'search',  l:'Search',  d:P.srch, onClick:null},
    {id:'library', l:'Library', d:P.lib,  onClick:onLibrary},
  ];
  return <div style={{position:'absolute',left:0,right:0,bottom:0,paddingBottom:20,paddingTop:10,
    background:`linear-gradient(to top,${BG} 65%,rgba(14,10,31,0))`,
    display:'flex',justifyContent:'space-around',zIndex:6}}>
    {tabs.map(t=>(
      <div key={t.id} onClick={t.onClick||undefined} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:4,
        color:t.id===active?CREAM:'rgba(245,239,224,.38)',fontSize:11,fontWeight:600,
        cursor:t.onClick?'pointer':'default'}}>
        <Ic d={t.d} sz={22} st={t.id===active?CREAM:'rgba(245,239,224,.38)'} sw={t.id===active?2.2:1.8}/>
        {t.l}
      </div>
    ))}
  </div>;
}

// ── Screen 1: Home ───────────────────────────────────────────

function HiFiHomeScreen({onLibrary}){
  const quickItems=[
    {label:'Liked Songs',     song:SONGS[0], liked:true},
    {label:'Discover Weekly', song:SONGS[1]},
    {label:'Made For You',    song:SONGS[2]},
    {label:'Daily Mix 1',     song:SONGS[3]},
    {label:'Release Radar',   song:SONGS[4]},
    {label:'Chill Vibes',     song:SONGS[5]},
  ];

  return <Shell>
    <div style={{position:'absolute',inset:0,overflowY:'auto',paddingBottom:148,scrollbarWidth:'none'}}>
      <div style={{padding:'52px 20px 18px'}}>
        <div style={{fontSize:12,color:'rgba(245,239,224,.55)',fontWeight:600,marginBottom:3}}>Good evening</div>
        <div style={{fontSize:26,fontWeight:800,color:CREAM,letterSpacing:-.3}}>Harsh</div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,padding:'0 12px 22px'}}>
        {quickItems.map(item=>(
          <div key={item.label} style={{height:52,borderRadius:8,overflow:'hidden',
            background:'rgba(245,239,224,.07)',display:'flex',alignItems:'center'}}>
            {item.liked
              ? <div style={{width:52,height:52,flexShrink:0,
                  background:'linear-gradient(145deg,#8ba6ff,#2B1F5E)',
                  display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <Ic d={P.heart} sz={18} fill={CREAM} st={CREAM}/>
                </div>
              : <Img id={item.song.id} size={52} r={0}/>}
            <div style={{flex:1,padding:'0 10px',fontSize:12,fontWeight:700,color:CREAM,
              overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{item.label}</div>
          </div>
        ))}
      </div>

      <div style={{padding:'2px 20px 12px',fontSize:16,fontWeight:800,color:CREAM}}>Jump back in</div>
      <div style={{display:'flex',gap:12,overflowX:'auto',padding:'0 20px 22px',scrollbarWidth:'none'}}>
        {SONGS.slice(0,5).map(s=>(
          <div key={s.id} style={{flexShrink:0,width:128}}>
            <Img id={s.id} size={128} r={10}/>
            <div style={{fontSize:12,fontWeight:600,color:CREAM,marginTop:7,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{s.title}</div>
            <div style={{fontSize:11,color:'rgba(245,239,224,.5)',marginTop:2,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{s.artist}</div>
          </div>
        ))}
      </div>

      <div style={{padding:'2px 20px 12px',fontSize:16,fontWeight:800,color:CREAM}}>Made for you</div>
      <div style={{display:'flex',gap:12,overflowX:'auto',padding:'0 20px 22px',scrollbarWidth:'none'}}>
        {SONGS.slice(5,10).map(s=>(
          <div key={s.id} style={{flexShrink:0,width:128}}>
            <Img id={s.id} size={128} r={10}/>
            <div style={{fontSize:12,fontWeight:600,color:CREAM,marginTop:7,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{s.title}</div>
            <div style={{fontSize:11,color:'rgba(245,239,224,.5)',marginTop:2,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{s.artist}</div>
          </div>
        ))}
      </div>
    </div>
    <MiniPlayer/>
    <HiFiTabBar active='home' onLibrary={onLibrary}/>
  </Shell>;
}

// ── Screen 2: Library ────────────────────────────────────────

function HiFiLibraryScreen({onBack,onAlgo}){
  return <Shell>
    <div style={{position:'absolute',inset:0,overflowY:'auto',paddingBottom:148,scrollbarWidth:'none'}}>
      <div style={{padding:'50px 20px 0'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div style={{display:'flex',alignItems:'center',gap:12}}>
            <div style={{width:34,height:34,borderRadius:17,
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

      {/* Liked Songs */}
      <div style={{display:'flex',alignItems:'center',gap:14,padding:'10px 20px'}}>
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

      {/* Tune your algorithm */}
      <div onClick={onAlgo} style={{display:'flex',alignItems:'center',gap:14,padding:'10px 20px',cursor:'pointer'}}>
        <div style={{width:52,height:52,borderRadius:8,
          background:'linear-gradient(145deg,rgba(183,168,255,.35),rgba(43,30,85,.8))',
          display:'flex',alignItems:'center',justifyContent:'center'}}>
          <Ic d={P.slid} sz={22} st={VIOLET}/>
        </div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:14,fontWeight:700,color:VIOLET}}>Tune your algorithm</div>
          <div style={{fontSize:12,color:'rgba(245,239,224,.5)',marginTop:2}}>
            <span style={{color:VIOLET,marginRight:6}}>◆</span>Playlist · Your Taste Profile
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
          <Img id={s.id} size={52} r={8}/>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:14,fontWeight:600,color:CREAM,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{t}</div>
            <div style={{fontSize:12,color:'rgba(245,239,224,.5)',marginTop:2}}>{sub}</div>
          </div>
        </div>
      ))}
    </div>
    <MiniPlayer/>
    <HiFiTabBar active='library' onHome={onBack}/>
  </Shell>;
}

// ── Screen 3: Algorithm Dashboard ───────────────────────────

function InfluenceRow({label,sublabel,artEl,influence,tierLabel,onMore,onLess}){
  const pct=Math.round(influence*100);
  return (
    <div style={{display:'flex',alignItems:'center',gap:12,padding:'9px 20px'}}>
      {artEl}
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:13,fontWeight:700,color:CREAM,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{label}</div>
        {sublabel&&<div style={{fontSize:11,color:'rgba(245,239,224,.45)',marginTop:1}}>{sublabel}</div>}
        <div style={{fontSize:11,color:VIOLET,marginTop:2,fontWeight:600}}>{tierLabel}</div>
        <div style={{height:3,background:'rgba(245,239,224,.1)',borderRadius:2,marginTop:5,overflow:'hidden'}}>
          <div style={{width:`${pct}%`,height:'100%',background:VIOLET,borderRadius:2,transition:'width 220ms ease'}}/>
        </div>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:5,flexShrink:0}}>
        <button onClick={onMore} style={{padding:'5px 9px',borderRadius:999,border:'none',cursor:'pointer',
          background:'rgba(212,255,107,.18)',color:LIME,fontSize:10,fontWeight:700,whiteSpace:'nowrap',
          fontFamily:"'Manrope','Inter',system-ui,sans-serif"}}>
          More of this
        </button>
        <button onClick={onLess} style={{padding:'5px 9px',borderRadius:999,border:'none',cursor:'pointer',
          background:'rgba(255,107,87,.18)',color:CORAL,fontSize:10,fontWeight:700,whiteSpace:'nowrap',
          fontFamily:"'Manrope','Inter',system-ui,sans-serif"}}>
          Less of this
        </button>
      </div>
    </div>
  );
}

function HiFiAlgorithmDashboard({onBack,onTuning,genreInfluence,artistInfluence,songInfluence,adjustGenre,adjustArtist,adjustSong}){
  const sortedGenres  = [...GENRES].sort((a,b)=>genreInfluence[b.id]-genreInfluence[a.id]);
  const sortedArtists = [...ARTISTS].sort((a,b)=>artistInfluence[b.id]-artistInfluence[a.id]);
  const sortedSongs   = [...SONGS].sort((a,b)=>songInfluence[b.id]-songInfluence[a.id]);

  return <Shell>
    <div style={{position:'absolute',top:0,left:0,right:0,height:210,
      background:'radial-gradient(circle at 20% 10%,#3B2470 0%,rgba(14,10,31,0) 70%)'}}/>
    <div style={{position:'relative',zIndex:2,padding:'48px 20px 0'}}>
      <div onClick={onBack} style={{width:34,height:34,borderRadius:17,
        background:'rgba(245,239,224,.08)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}>
        <Ic d={P.back} sz={17}/>
      </div>
      <div style={{marginTop:12}}>
        <div style={{fontSize:10,color:VIOLET,fontWeight:700,letterSpacing:1.2,textTransform:'uppercase'}}>Your Algorithm</div>
        <div style={{fontSize:24,lineHeight:1.15,color:CREAM,fontWeight:800,marginTop:4}}>What's shaping your recommendations</div>
      </div>
    </div>

    <div style={{position:'absolute',top:220,left:0,right:0,bottom:0,overflowY:'auto',paddingBottom:90,scrollbarWidth:'none'}}>
      {/* Genres — 2-col card grid */}
      <div style={{padding:'10px 20px 8px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div style={{fontSize:15,fontWeight:800,color:CREAM}}>Genres</div>
        <div style={{fontSize:11,color:'rgba(245,239,224,.4)',fontWeight:700}}>{sortedGenres.length}</div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,padding:'0 20px'}}>
        {sortedGenres.map(g=>{
          const inf=genreInfluence[g.id];
          return (
            <div key={g.id} style={{borderRadius:13,padding:'10px 11px 10px',
              background:`linear-gradient(135deg,hsl(${g.hue},48%,24%) 0%,hsl(${(g.hue+40)%360},38%,13%) 100%)`,
              display:'flex',flexDirection:'column',gap:0,position:'relative',overflow:'hidden'}}>
              <div style={{fontSize:12,fontWeight:700,color:CREAM,lineHeight:1.15}}>{g.name}</div>
              <div style={{fontSize:10,color:VIOLET,fontWeight:600,marginTop:3}}>{influenceTier(inf)}</div>
              <div style={{display:'flex',gap:5,marginTop:9}}>
                <button onClick={()=>adjustGenre(g.id,-0.12)} style={{flex:1,padding:'5px 0',borderRadius:999,
                  border:'none',cursor:'pointer',background:'rgba(255,107,87,.2)',color:CORAL,
                  fontSize:10,fontWeight:700,fontFamily:"'Manrope','Inter',system-ui,sans-serif"}}>Less</button>
                <button onClick={()=>adjustGenre(g.id,+0.12)} style={{flex:1,padding:'5px 0',borderRadius:999,
                  border:'none',cursor:'pointer',background:'rgba(212,255,107,.2)',color:LIME,
                  fontSize:10,fontWeight:700,fontFamily:"'Manrope','Inter',system-ui,sans-serif"}}>More</button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Artists — horizontal scroll with circle avatars */}
      <div style={{padding:'14px 20px 8px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div style={{fontSize:15,fontWeight:800,color:CREAM}}>Artists</div>
        <div style={{fontSize:11,color:'rgba(245,239,224,.4)',fontWeight:700}}>{sortedArtists.length}</div>
      </div>
      <div style={{display:'flex',gap:12,overflowX:'auto',padding:'0 20px 4px',scrollbarWidth:'none'}}>
        {sortedArtists.map(a=>{
          const inf=artistInfluence[a.id];
          return (
            <div key={a.id} style={{flexShrink:0,width:90,display:'flex',flexDirection:'column',alignItems:'center'}}>
              <Img id={a.id} size={80} r={40}/>
              <div style={{fontSize:11,fontWeight:700,color:CREAM,marginTop:6,textAlign:'center',lineHeight:1.2,width:'100%',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{a.name}</div>
              <div style={{fontSize:10,color:VIOLET,fontWeight:600,marginTop:2,textAlign:'center'}}>{influenceTier(inf)}</div>
              <div style={{display:'flex',gap:4,marginTop:7,width:'100%'}}>
                <button onClick={()=>adjustArtist(a.id,-0.12)} style={{flex:1,padding:'5px 0',borderRadius:999,
                  border:'none',cursor:'pointer',background:'rgba(255,107,87,.2)',color:CORAL,
                  fontSize:9,fontWeight:700,fontFamily:"'Manrope','Inter',system-ui,sans-serif"}}>Less</button>
                <button onClick={()=>adjustArtist(a.id,+0.12)} style={{flex:1,padding:'5px 0',borderRadius:999,
                  border:'none',cursor:'pointer',background:'rgba(212,255,107,.2)',color:LIME,
                  fontSize:9,fontWeight:700,fontFamily:"'Manrope','Inter',system-ui,sans-serif"}}>More</button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Songs */}
      <div style={{padding:'14px 20px 2px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div style={{fontSize:15,fontWeight:800,color:CREAM}}>Songs</div>
        <div style={{fontSize:11,color:'rgba(245,239,224,.4)',fontWeight:700}}>{sortedSongs.length}</div>
      </div>
      {sortedSongs.map(s=>(
        <InfluenceRow key={s.id}
          label={s.title}
          sublabel={s.artist}
          influence={songInfluence[s.id]}
          tierLabel={influenceTier(songInfluence[s.id])}
          artEl={<Img id={s.id} size={40} r={6}/>}
          onMore={()=>adjustSong(s.id,+0.12)}
          onLess={()=>adjustSong(s.id,-0.12)}/>
      ))}
    </div>

    <div style={{position:'absolute',bottom:24,left:24,right:24,zIndex:20}}>
      <button onClick={onTuning} style={{width:'100%',padding:'15px',borderRadius:16,border:'none',cursor:'pointer',
        fontFamily:"'Manrope','Inter',system-ui,sans-serif",
        background:VIOLET,color:BG,fontSize:15,fontWeight:800,letterSpacing:.2,
        boxShadow:`0 4px 20px rgba(183,168,255,.4)`}}>
        Guided Tuning
      </button>
    </div>
  </Shell>;
}

// ── Screen 4: Guided Tuning (swipe) ──────────────────────────

function HiFiSwipeCard({song,zIndex,offset=0,isTop=true,songInfluence,onMore,onLess}){
  const [drag,setDrag]=useState({x:0,y:0});
  const [exit,setExit]=useState(null);
  const startRef=useRef(null);
  const activeRef=useRef(false);
  const exitRef=useRef(false);
  const genre=GENRES.find(g=>g.id===song.genreId)?.name??'Unknown';
  const tier=influenceTier(songInfluence[song.id]??song.influence);

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
      if(dx>90){exitRef.current=true;setExit('m');setTimeout(()=>onMore&&onMore(),280);}
      else if(dx<-90){exitRef.current=true;setExit('l');setTimeout(()=>onLess&&onLess(),280);}
      else setDrag({x:0,y:0});
    };
    window.addEventListener('mousemove',move);window.addEventListener('mouseup',end);
    window.addEventListener('touchmove',move,{passive:false});window.addEventListener('touchend',end);
    return()=>{window.removeEventListener('mousemove',move);window.removeEventListener('mouseup',end);
      window.removeEventListener('touchmove',move);window.removeEventListener('touchend',end);};
  },[isTop,song.id,onMore,onLess]);

  const onStart=e=>{
    if(!isTop||exitRef.current)return;
    const p=e.touches?.[0]?{x:e.touches[0].clientX,y:e.touches[0].clientY}:{x:e.clientX,y:e.clientY};
    startRef.current=p;activeRef.current=true;setDrag({x:0,y:0});
  };

  let tx=drag.x,ty=drag.y,rot=drag.x/16;
  if(exit==='m'){tx=520;ty=-40;rot=22;}
  if(exit==='l'){tx=-520;ty=-40;rot=-22;}
  const mOp=Math.min(1,Math.max(0,drag.x/90));
  const lOp=Math.min(1,Math.max(0,-drag.x/90));

  return <div onMouseDown={onStart} onTouchStart={onStart} style={{
    position:'absolute',left:22,right:22,top:124+offset,height:450,
    borderRadius:28,zIndex,
    background:`linear-gradient(155deg,hsl(${song.hue},${song.sat}%,28%) 0%,hsl(${(song.hue+40)%360},${song.sat*.55}%,13%) 100%)`,
    boxShadow:'0 22px 55px rgba(0,0,0,.6)',
    transform:`translate(${tx}px,${ty}px) rotate(${rot}deg) scale(${1-offset*.018})`,
    transition:activeRef.current?'none':'transform 270ms cubic-bezier(.2,.7,.2,1)',
    touchAction:'none',cursor:isTop?'grab':'default',userSelect:'none',overflow:'hidden'}}>

    {/* Album art */}
    <div style={{position:'absolute',top:22,left:'50%',transform:'translateX(-50%)',
      width:195,height:195,borderRadius:16,overflow:'hidden',boxShadow:'0 10px 30px rgba(0,0,0,.5)'}}>
      <Img id={song.id} size={195} r={16}/>
    </div>

    {/* Song info */}
    <div style={{position:'absolute',left:22,right:22,top:234}}>
      <div style={{fontSize:21,lineHeight:1.15,color:CREAM,fontWeight:800,marginBottom:8}}>{song.title}</div>
      <div style={{display:'flex',alignItems:'baseline',gap:6,marginBottom:4}}>
        <span style={{fontSize:13,color:'rgba(245,239,224,.8)',fontWeight:600}}>{song.artist}</span>
        <span style={{fontSize:11,color:VIOLET,fontWeight:600}}>· {tier}</span>
      </div>
      <div style={{display:'flex',alignItems:'baseline',gap:6,marginBottom:4}}>
        <span style={{fontSize:12,color:'rgba(245,239,224,.55)'}}>{song.album}</span>
        <span style={{fontSize:10,color:'rgba(183,168,255,.65)'}}>· {tier}</span>
      </div>
      <div style={{display:'flex',alignItems:'baseline',gap:6}}>
        <span style={{fontSize:12,color:'rgba(245,239,224,.55)'}}>{genre}</span>
        <span style={{fontSize:10,color:'rgba(183,168,255,.65)'}}>· {tier}</span>
      </div>
    </div>

    {/* Playback bar */}
    <div style={{position:'absolute',left:22,right:22,bottom:18,display:'flex',alignItems:'center',gap:10}}>
      <div style={{width:30,height:30,borderRadius:15,background:'rgba(245,239,224,.12)',
        display:'flex',alignItems:'center',justifyContent:'center'}}>
        <Ic d={P.play} sz={13} fill={CREAM} st={CREAM} sw={0}/>
      </div>
      <div style={{flex:1,height:2,background:'rgba(245,239,224,.2)',borderRadius:1,overflow:'hidden'}}>
        <div style={{width:'22%',height:'100%',background:CREAM}}/>
      </div>
      <span style={{fontSize:11,color:'rgba(245,239,224,.6)'}}>0:42</span>
    </div>

    {/* Swipe labels */}
    <div style={{position:'absolute',top:18,left:14,padding:'4px 10px',borderRadius:7,
      border:`2.5px solid ${CORAL}`,color:CORAL,fontSize:14,fontWeight:900,letterSpacing:1.5,
      transform:'rotate(-14deg)',opacity:lOp}}>LESS OF THIS</div>
    <div style={{position:'absolute',top:18,right:14,padding:'4px 10px',borderRadius:7,
      border:`2.5px solid ${LIME}`,color:LIME,fontSize:14,fontWeight:900,letterSpacing:1.5,
      transform:'rotate(14deg)',opacity:mOp}}>MORE OF THIS</div>
  </div>;
}

function HiFiGuidedTuning({onBack,songInfluence,adjustSong}){
  const N=SONGS.length;
  const [idx,setIdx]=useState(0);
  const cur=SONGS[idx%N];
  const next=()=>setIdx(i=>(i+1)%N);

  return <Shell>
    <div style={{position:'absolute',inset:0,
      background:`radial-gradient(circle at 50% 28%,hsla(${cur.hue},${cur.sat}%,33%,.5) 0%,${BG} 58%)`,
      transition:'background 480ms ease'}}/>
    <div style={{position:'absolute',top:50,left:20,right:20,
      display:'flex',alignItems:'center',justifyContent:'space-between',zIndex:5}}>
      <div onClick={onBack} style={{display:'flex',alignItems:'center',gap:6,cursor:'pointer',
        padding:'7px 12px',borderRadius:999,background:'rgba(0,0,0,.4)',color:CREAM}}>
        <Ic d={P.back} sz={14} sw={2.2}/><span style={{fontSize:12,fontWeight:700}}>Back</span>
      </div>
      <span style={{fontSize:11,color:'rgba(245,239,224,.5)',fontWeight:700,letterSpacing:1.2,textTransform:'uppercase'}}>Guided Tuning</span>
      <div style={{width:60}}/>
    </div>

    {[0,1,2].map(off=>(
      <HiFiSwipeCard key={SONGS[(idx+off)%N].id+String(off)} song={SONGS[(idx+off)%N]}
        zIndex={3-off} offset={off*14} isTop={off===0}
        songInfluence={songInfluence}
        onMore={off===0?()=>{adjustSong(cur.id,+0.12);next();}:undefined}
        onLess={off===0?()=>{adjustSong(cur.id,-0.12);next();}:undefined}/>
    ))}

    <div style={{position:'absolute',bottom:94,left:24,right:24,zIndex:5,display:'flex',gap:14}}>
      <div onClick={()=>{adjustSong(cur.id,-0.12);next();}} style={{flex:1,height:52,borderRadius:14,
        background:'rgba(255,107,87,.14)',border:`1.5px solid ${CORAL}`,
        display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}>
        <span style={{fontSize:14,fontWeight:800,color:CORAL,letterSpacing:.3}}>Less of this</span>
      </div>
      <div onClick={()=>{adjustSong(cur.id,+0.12);next();}} style={{flex:1,height:52,borderRadius:14,
        background:'rgba(212,255,107,.14)',border:`1.5px solid ${LIME}`,
        display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}>
        <span style={{fontSize:14,fontWeight:800,color:LIME,letterSpacing:.3}}>More of this</span>
      </div>
    </div>
  </Shell>;
}

// ── HiFi View (flow controller) ──────────────────────────────

export default function HiFiView({genreInfluence,artistInfluence,songInfluence,adjustGenre,adjustArtist,adjustSong}){
  const [screen,setScreen]=useState('home');

  return (
    <div style={{width:'100%',height:'100%',background:'#000',
      display:'flex',alignItems:'center',justifyContent:'center'}}>
      {screen==='home'&&<HiFiHomeScreen onLibrary={()=>setScreen('library')}/>}
      {screen==='library'&&<HiFiLibraryScreen onBack={()=>setScreen('home')} onAlgo={()=>setScreen('algo')}/>}
      {screen==='algo'&&<HiFiAlgorithmDashboard
        onBack={()=>setScreen('library')} onTuning={()=>setScreen('tuning')}
        genreInfluence={genreInfluence} artistInfluence={artistInfluence}
        songInfluence={songInfluence} adjustGenre={adjustGenre}
        adjustArtist={adjustArtist} adjustSong={adjustSong}/>}
      {screen==='tuning'&&<HiFiGuidedTuning
        onBack={()=>setScreen('algo')}
        songInfluence={songInfluence} adjustSong={adjustSong}/>}
    </div>
  );
}
