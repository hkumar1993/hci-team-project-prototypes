import { useState, useEffect, useRef } from "react";

const BG='#0E0A1F',CREAM='#F5EFE0',LIME='#D4FF6B',CORAL='#FF6B57',VIOLET='#B7A8FF';

// ── Data ─────────────────────────────────────────────────────

const GENRES=[
  {id:'g1', name:'Lo-fi Ambient',    weight:.82,hue:200},
  {id:'g2', name:'Bedroom Pop',      weight:.71,hue:320},
  {id:'g3', name:'Mid-90s R&B',      weight:.64,hue:14},
  {id:'g4', name:'Shoegaze',         weight:.55,hue:264},
  {id:'g5', name:'Country Pop',      weight:.28,hue:36},
  {id:'g6', name:'Holiday',          weight:.09,hue:140},
  {id:'g7', name:'Indie Folk',       weight:.67,hue:40},
  {id:'g8', name:'Dream Pop',        weight:.58,hue:280},
  {id:'g9', name:'Neo-Soul',         weight:.73,hue:20},
  {id:'g10',name:'Jazz Fusion',      weight:.44,hue:180},
  {id:'g11',name:'Alt-Country',      weight:.32,hue:30},
  {id:'g12',name:'Chillwave',        weight:.61,hue:190},
  {id:'g13',name:'Post-Rock',        weight:.38,hue:240},
  {id:'g14',name:'Synth-Pop',        weight:.49,hue:290},
  {id:'g15',name:'Acoustic Blues',   weight:.22,hue:60},
  {id:'g16',name:'Trip-Hop',         weight:.56,hue:210},
  {id:'g17',name:'Indie Electronic', weight:.69,hue:170},
  {id:'g18',name:'Soft Rock',        weight:.41,hue:10},
  {id:'g19',name:'Bossa Nova',       weight:.17,hue:80},
  {id:'g20',name:'Dark Folk',        weight:.53,hue:260},
];

const ARTISTS=[
  {id:'a1', name:'Jules Marin',      plays:412,hue:14, influence:.82},
  {id:'a2', name:'Odette Roe',       plays:308,hue:34, influence:.75},
  {id:'a3', name:'Harbour & Vane',   plays:289,hue:204,influence:.70},
  {id:'a4', name:'The Usual Quiet',  plays:12, hue:300,influence:.03},
  {id:'a5', name:'Vale Harper',      plays:5,  hue:252,influence:.01},
  {id:'a6', name:'Moss & Meridian',  plays:174,hue:132,influence:.42},
  {id:'a7', name:'Neon Pilgrim',     plays:240,hue:162,influence:.58},
  {id:'a8', name:'Saga Linde',       plays:195,hue:224,influence:.47},
  {id:'a9', name:'Wren Aldine',      plays:88, hue:88, influence:.21},
  {id:'a10',name:'Fernand Kite',     plays:320,hue:10, influence:.78},
  {id:'a11',name:'Clementine Hayes', plays:156,hue:48, influence:.38},
  {id:'a12',name:'Patchwork',        plays:67, hue:276,influence:.16},
  {id:'a13',name:'River & Stone',    plays:445,hue:40, influence:.90},
  {id:'a14',name:'Bright Archive',   plays:198,hue:100,influence:.48},
  {id:'a15',name:'The Slow Dial',    plays:310,hue:220,influence:.75},
  {id:'a16',name:'Cinnamon Static',  plays:89, hue:24, influence:.22},
  {id:'a17',name:'Folded Map',       plays:130,hue:60, influence:.32},
  {id:'a18',name:'Subway Hymn',      plays:267,hue:180,influence:.65},
  {id:'a19',name:'Blue Volta',       plays:144,hue:240,influence:.35},
  {id:'a20',name:'Salt & Ember',     plays:78, hue:350,influence:.19},
  {id:'a21',name:'Tangerine Tape',   plays:222,hue:30, influence:.54},
  {id:'a22',name:'Winter Garden',    plays:355,hue:200,influence:.86},
  {id:'a23',name:'Kodachrome Kid',   plays:102,hue:50, influence:.25},
  {id:'a24',name:'Glass Apartments', plays:176,hue:160,influence:.43},
  {id:'a25',name:'Mile Marker',      plays:290,hue:280,influence:.70},
  {id:'a26',name:'Quiet Season',     plays:134,hue:120,influence:.33},
  {id:'a27',name:'Ferris Wheel',     plays:210,hue:320,influence:.51},
  {id:'a28',name:'Neon Tiger',       plays:380,hue:340,influence:.92},
  {id:'a29',name:'Wishing Well',     plays:45, hue:80, influence:.11},
  {id:'a30',name:'Velvet Machine',   plays:167,hue:270,influence:.41},
];

const _W1=['Paper','Low Tide','Caramel','Gridlock','Melt','Static','Postcard','Cursive',
  'Overgrown','Split','Lemon','Hollow','Morning','Evening','Winter','Summer','Velvet',
  'Copper','Golden','Tangled','Floating','Glass','River','Echo','Smoke'];
const _W2=['Moons','Lullaby','City','Choir','Slowly','Prayer','You','Sky',
  'Highway','Grove','Hours','Road','Shore','Tide','Archive','Circuit','Letter',
  'Season','Mirror','Garden','Bridge','Window','Train','Bell','Stone',
  'Fire','Water','Night','Dream','Machine','Heat','Current','Drift','Frame','Wire',
  'Loop','Trail','Hymn','Tape','Maps'];
const _ALB=['Vol. 1','Vol. 2','Sessions','EP','Archives','Tapes','Works','Demos'];

const SONGS=Array.from({length:200},(_,i)=>{
  const art=ARTISTS[i%30];
  return {
    id:`s${i+1}`,
    title:`${_W1[Math.floor(i/8)]} ${_W2[i%40]}`,
    artist:art.name,
    artistId:art.id,
    album:`${art.name.split(' ')[0]} ${_ALB[Math.floor(i/25)%8]}`,
    genreId:`g${(i%20)+1}`,
    hue:(i*37+14)%360,
    sat:50+(i*13)%30,
    years:1+((i*7)%40)/10,
    influence:Math.min(1,Math.round((0.05+((i*73+11)%97)/100)*100)/100),
  };
});

// ── Helpers ──────────────────────────────────────────────────

function influenceTier(v){
  if(v>=0.65)return'Heavy Influence';
  if(v>=0.35)return'Medium Influence';
  return'Occasional Influence';
}
function tierShort(t){
  if(t==='Heavy Influence')return'Heavy';
  if(t==='Medium Influence')return'Medium';
  return'Occasional';
}

// ── Primitives ───────────────────────────────────────────────

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
  back:['M15 18l-6-6 6-6'],
  sort:['M4 7h16','M6 12h12','M9 17h6'],
  heart:'M12 21s-7-4.35-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.65-9.5 9-9.5 9z',
  slid:['M4 6h10','M18 6h2','M4 12h4','M12 12h8','M4 18h14','M18 18h2','M16 4v4','M10 10v4','M16 16v4'],
  chk:'M5 12l5 5L20 7',
  more:['M5 12h.01','M12 12h.01','M19 12h.01'],
  shuf:['M16 3h5v5','M21 3l-7 7','M3 21l7-7','M21 21h-5v-5'],
  dl:['M12 3v12','M7 10l5 5 5-5','M4 21h16'],
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

function MiniPlayer({nowPlaying,isPlaying,progress,onToggle,onSeek}){
  if(!nowPlaying) return null;
  return <div style={{position:'absolute',left:8,right:8,bottom:76,height:56,borderRadius:14,
    background:'linear-gradient(90deg,#2A1E55,#3B2470)',
    display:'flex',alignItems:'center',padding:'0 10px',gap:10,
    boxShadow:'0 8px 28px rgba(0,0,0,.5)',zIndex:5}}>
    <Img id={nowPlaying.id} size={40} r={6}/>
    <div style={{flex:1,minWidth:0}}>
      <div style={{fontSize:13,fontWeight:700,color:CREAM,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{nowPlaying.title}</div>
      <div style={{fontSize:11,color:'rgba(245,239,224,.6)'}}>{nowPlaying.artist}</div>
    </div>
    <div style={{display:'flex',alignItems:'center',gap:12}}>
      <Ic d={P.heart} sz={18} fill={CORAL} st={CORAL}/>
      <div onClick={onToggle} style={{cursor:'pointer'}}>
        <Ic d={isPlaying?P.pause:P.play} sz={18} sw={2.4}/>
      </div>
    </div>
    <div onClick={onSeek} style={{position:'absolute',left:10,right:10,bottom:4,height:6,background:'rgba(245,239,224,.15)',borderRadius:3,overflow:'hidden',cursor:'pointer'}}>
      <div style={{width:`${Math.round(progress*100)}%`,height:'100%',background:CREAM,borderRadius:3,transition:'width 200ms linear'}}/>
    </div>
  </div>;
}

function HiFiTabBar({active='home',onHome,onLibrary}){
  const tabs=[
    {id:'home',   l:'Home',   d:P.home, onClick:onHome},
    {id:'search', l:'Search', d:P.srch, onClick:null},
    {id:'library',l:'Library',d:P.lib,  onClick:onLibrary},
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

// ── Toast ─────────────────────────────────────────────────────

function AlgoToast({onTune}){
  const [show,setShow]=useState(false);
  useEffect(()=>{
    const t1=setTimeout(()=>setShow(true),60);
    const t2=setTimeout(()=>setShow(false),5500);
    return()=>{clearTimeout(t1);clearTimeout(t2);};
  },[]);
  return(
    <div onClick={()=>{setShow(false);onTune();}} style={{
      position:'absolute',bottom:150,left:14,right:14,zIndex:10,cursor:'pointer',
      background:'rgba(14,10,31,0.93)',border:'1px solid rgba(183,168,255,.4)',
      borderRadius:14,padding:'13px 16px',
      display:'flex',alignItems:'center',gap:12,
      transition:'opacity 280ms,transform 280ms',
      opacity:show?1:0,transform:show?'translateY(0)':'translateY(16px)',
      pointerEvents:show?'auto':'none',
    }}>
      <div style={{width:36,height:36,borderRadius:10,flexShrink:0,
        background:'rgba(183,168,255,.15)',
        display:'flex',alignItems:'center',justifyContent:'center'}}>
        <Ic d={P.slid} sz={18} st={VIOLET}/>
      </div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:13,color:CREAM,fontWeight:600,lineHeight:1.3}}>Not feeling these songs?</div>
        <div style={{fontSize:12,color:VIOLET,fontWeight:700,marginTop:2}}>Tune your algorithm →</div>
      </div>
    </div>
  );
}

// ── Screen 1: Home ───────────────────────────────────────────

function HiFiHomeScreen({onLibrary,onPlaylist,playSong,audioProps}){
  const quickItems=[
    {label:'Liked Songs',    song:SONGS[0],liked:true},
    {label:'Discover Weekly',song:SONGS[1]},
    {label:'Made For You',   song:SONGS[2]},
    {label:'Daily Mix 1',    song:SONGS[3]},
    {label:'Release Radar',  song:SONGS[4]},
    {label:'Chill Vibes',    song:SONGS[5]},
  ];
  return <Shell>
    <div style={{position:'absolute',inset:0,overflowY:'auto',paddingBottom:148,scrollbarWidth:'none'}}>
      <div style={{padding:'52px 20px 18px'}}>
        <div style={{fontSize:12,color:'rgba(245,239,224,.55)',fontWeight:600,marginBottom:3}}>Good evening</div>
        <div style={{fontSize:26,fontWeight:800,color:CREAM,letterSpacing:-.3}}>Harsh</div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,padding:'0 12px 22px'}}>
        {quickItems.map(item=>(
          <div key={item.label}
            onClick={()=>onPlaylist(item)}
            style={{height:52,borderRadius:8,overflow:'hidden',
              background:'rgba(245,239,224,.07)',display:'flex',alignItems:'center',
              cursor:'pointer'}}>
            {item.liked
              ?<div style={{width:52,height:52,flexShrink:0,
                  background:'linear-gradient(145deg,#8ba6ff,#2B1F5E)',
                  display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <Ic d={P.heart} sz={18} fill={CREAM} st={CREAM}/>
                </div>
              :<Img id={item.song.id} size={52} r={0}/>}
            <div style={{flex:1,padding:'0 10px',fontSize:12,fontWeight:700,color:CREAM,
              overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{item.label}</div>
          </div>
        ))}
      </div>
      <div style={{padding:'2px 20px 12px',fontSize:16,fontWeight:800,color:CREAM}}>Jump back in</div>
      <div style={{display:'flex',gap:12,overflowX:'auto',padding:'0 20px 22px',scrollbarWidth:'none'}}>
        {SONGS.slice(0,5).map(s=>(
          <div key={s.id} onClick={()=>playSong(s)} style={{flexShrink:0,width:128,cursor:'pointer'}}>
            <Img id={s.id} size={128} r={10}/>
            <div style={{fontSize:12,fontWeight:600,color:CREAM,marginTop:7,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{s.title}</div>
            <div style={{fontSize:11,color:'rgba(245,239,224,.5)',marginTop:2,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{s.artist}</div>
          </div>
        ))}
      </div>
      <div style={{padding:'2px 20px 12px',fontSize:16,fontWeight:800,color:CREAM}}>Made for you</div>
      <div style={{display:'flex',gap:12,overflowX:'auto',padding:'0 20px 22px',scrollbarWidth:'none'}}>
        {SONGS.slice(5,10).map(s=>(
          <div key={s.id} onClick={()=>playSong(s)} style={{flexShrink:0,width:128,cursor:'pointer'}}>
            <Img id={s.id} size={128} r={10}/>
            <div style={{fontSize:12,fontWeight:600,color:CREAM,marginTop:7,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{s.title}</div>
            <div style={{fontSize:11,color:'rgba(245,239,224,.5)',marginTop:2,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{s.artist}</div>
          </div>
        ))}
      </div>
    </div>
    <MiniPlayer {...audioProps}/>
    <HiFiTabBar active='home' onLibrary={onLibrary}/>
  </Shell>;
}

// ── Screen 2: Playlist ───────────────────────────────────────

const PLAYLIST_DESCS={
  'Discover Weekly':'Your weekly mixtape of fresh music. New discoveries and deep cuts picked just for you. Updated every Monday.',
  'Release Radar':'Catch all the latest music from artists you follow, plus new picks for you. Updated every Friday.',
  'Made For You':'A daily mix of songs you love and new tracks we think you\'ll like.',
  'Daily Mix 1':'Familiar favorites mixed with similar artists you might not have heard yet.',
  'Liked Songs':'Songs you\'ve saved from across Spotify.',
  'Chill Vibes':'Easy listening for any moment.',
};

function HiFiPlaylistScreen({label,isAlgo,seed,liked,onBack,onAlgo,playSong,audioProps}){
  const seedIdx=SONGS.findIndex(s=>s.id===seed);
  const songs=Array.from({length:20},(_,i)=>SONGS[(seedIdx+i*9+i)%SONGS.length]);
  const desc=PLAYLIST_DESCS[label]||'A playlist made for you.';
  const stats=isAlgo?'Updated weekly • 2h 28min':'2,091 songs • 5 days 4 hr';

  return <Shell>
    <div style={{position:'absolute',inset:0,overflowY:'auto',paddingBottom:148,scrollbarWidth:'none'}}>
      {/* back button — sticky overlay */}
      <div style={{position:'sticky',top:0,zIndex:9,padding:'52px 20px 8px',
        background:`linear-gradient(to bottom,${BG} 50%,transparent)`,pointerEvents:'none'}}>
        <div onClick={onBack} style={{width:32,height:32,borderRadius:16,cursor:'pointer',
          background:'rgba(14,10,31,.55)',backdropFilter:'blur(6px)',pointerEvents:'auto',
          display:'inline-flex',alignItems:'center',justifyContent:'center'}}>
          <Ic d={P.back} sz={20}/>
        </div>
      </div>

      {/* hero image */}
      <div style={{padding:'0 36px 22px',marginTop:'-12px'}}>
        <div style={{width:'100%',aspectRatio:'1',borderRadius:6,overflow:'hidden',
          boxShadow:'0 12px 40px rgba(0,0,0,.65)'}}>
          {liked
            ?<div style={{width:'100%',height:'100%',
                background:'linear-gradient(145deg,#8ba6ff,#2B1F5E)',
                display:'flex',alignItems:'center',justifyContent:'center'}}>
                <Ic d={P.heart} sz={72} fill={CREAM} st={CREAM}/>
              </div>
            :<img src={`https://picsum.photos/seed/${seed}/400`} alt=""
               style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}}/>
          }
        </div>
      </div>

      {/* info */}
      <div style={{padding:'0 20px 10px'}}>
        <div style={{fontSize:22,fontWeight:800,color:CREAM,letterSpacing:-.3,marginBottom:6}}>{label}</div>
        <div style={{fontSize:13,color:'rgba(245,239,224,.5)',lineHeight:1.4,marginBottom:10}}>{desc}</div>
        <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4}}>
          <div style={{width:22,height:22,borderRadius:11,background:'#1DB954',flexShrink:0,
            display:'flex',alignItems:'center',justifyContent:'center'}}>
            <span style={{color:'#000',fontSize:11,fontWeight:900,lineHeight:1}}>♪</span>
          </div>
          <span style={{fontSize:13,fontWeight:700,color:CREAM}}>Spotify</span>
        </div>
        <div style={{fontSize:12,color:'rgba(245,239,224,.4)'}}>{stats}</div>
      </div>

      {/* controls row */}
      <div style={{padding:'8px 20px 16px',display:'flex',alignItems:'center',gap:16}}>
        <div style={{width:34,height:34,borderRadius:4,overflow:'hidden',flexShrink:0}}>
          <img src={`https://picsum.photos/seed/${seed}/80`} alt=""
            style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}}/>
        </div>
        <Ic d={P.chk} sz={22} st='#1DB954' sw={2.5}/>
        <Ic d={P.dl} sz={20} st='rgba(245,239,224,.55)'/>
        <Ic d={P.more} sz={20} st='rgba(245,239,224,.55)'/>
        <div style={{flex:1}}/>
        <Ic d={P.shuf} sz={22} st='rgba(245,239,224,.45)'/>
        <div onClick={()=>playSong(songs[0])} style={{width:52,height:52,borderRadius:26,background:'#1DB954',flexShrink:0,
          display:'flex',alignItems:'center',justifyContent:'center',
          boxShadow:'0 4px 20px rgba(29,185,84,.35)',cursor:'pointer'}}>
          <Ic d={P.play} sz={22} fill='#000' st='#000'/>
        </div>
      </div>

      {/* song list */}
      {songs.map(s=>(
        <div key={s.id} onClick={()=>playSong(s)} style={{display:'flex',alignItems:'center',gap:12,padding:'8px 20px',cursor:'pointer'}}>
          <Img id={s.id} size={50} r={4}/>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:14,fontWeight:600,color:CREAM,overflow:'hidden',
              textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{s.title}</div>
            <div style={{fontSize:12,color:'rgba(245,239,224,.5)',marginTop:2,overflow:'hidden',
              textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{s.artist}</div>
          </div>
          <Ic d={P.more} sz={16} st='rgba(245,239,224,.3)'/>
        </div>
      ))}
    </div>
    {isAlgo&&<AlgoToast onTune={onAlgo}/>}
    <MiniPlayer {...audioProps}/>
    <HiFiTabBar active='home' onHome={onBack}/>
  </Shell>;
}

// ── Screen 3: Library ────────────────────────────────────────

function HiFiLibraryScreen({onBack,onAlgo,audioProps}){
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
          <div style={{display:'flex',gap:16}}><Ic d={P.srch} sz={20}/><Ic d={P.plus} sz={20}/></div>
        </div>
        <div style={{display:'flex',gap:8,marginTop:14,overflowX:'auto',scrollbarWidth:'none'}}>
          {['Playlists','Albums','Artists','Podcasts'].map(t=><Pill key={t}>{t}</Pill>)}
        </div>
      </div>
      <div style={{padding:'14px 20px 8px',display:'flex',alignItems:'center',gap:8,fontSize:13,color:CREAM,fontWeight:600}}>
        <Ic d={P.sort} sz={15}/> Recents
      </div>
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
    <MiniPlayer {...audioProps}/>
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
          fontFamily:"'Manrope','Inter',system-ui,sans-serif"}}>More of this</button>
        <button onClick={onLess} style={{padding:'5px 9px',borderRadius:999,border:'none',cursor:'pointer',
          background:'rgba(255,107,87,.18)',color:CORAL,fontSize:10,fontWeight:700,whiteSpace:'nowrap',
          fontFamily:"'Manrope','Inter',system-ui,sans-serif"}}>Less of this</button>
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
      {/* Genres grid */}
      <div style={{padding:'10px 20px 8px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div style={{fontSize:15,fontWeight:800,color:CREAM}}>Genres</div>
        <div style={{fontSize:11,color:'rgba(245,239,224,.4)',fontWeight:700}}>{sortedGenres.length}</div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,padding:'0 20px'}}>
        {sortedGenres.map(g=>{
          const inf=genreInfluence[g.id];
          return (
            <div key={g.id} style={{borderRadius:13,padding:'10px 11px',
              background:`linear-gradient(135deg,hsl(${g.hue},48%,24%) 0%,hsl(${(g.hue+40)%360},38%,13%) 100%)`,
              display:'flex',flexDirection:'column'}}>
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
      {/* Artists scroll */}
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
      {/* Songs list */}
      <div style={{padding:'14px 20px 2px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div style={{fontSize:15,fontWeight:800,color:CREAM}}>Songs</div>
        <div style={{fontSize:11,color:'rgba(245,239,224,.4)',fontWeight:700}}>{sortedSongs.length}</div>
      </div>
      {sortedSongs.map(s=>(
        <InfluenceRow key={s.id}
          label={s.title} sublabel={s.artist}
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

// ── Screen 4: Guided Tuning ──────────────────────────────────

function HiFiSwipeCard({song,zIndex,offset=0,isTop=true,songInfluence,artistInfluence,genreInfluence,onMore,onLess,isPlaying=false,progress=0,onToggle}){
  const [drag,setDrag]=useState({x:0,y:0});
  const [exit,setExit]=useState(null);
  const startRef=useRef(null);
  const activeRef=useRef(false);
  const exitRef=useRef(false);
  const genre=GENRES.find(g=>g.id===song.genreId)?.name??'Unknown';
  const songTier=influenceTier(songInfluence[song.id]??song.influence);
  const artistTier=influenceTier(artistInfluence[song.artistId]??0.5);
  const genreTier=influenceTier(genreInfluence[song.genreId]??0.5);

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
    position:'absolute',left:22,right:22,top:124+offset,height:450,borderRadius:28,zIndex,
    background:`linear-gradient(155deg,hsl(${song.hue},${song.sat}%,28%) 0%,hsl(${(song.hue+40)%360},${song.sat*.55}%,13%) 100%)`,
    boxShadow:'0 22px 55px rgba(0,0,0,.6)',
    transform:`translate(${tx}px,${ty}px) rotate(${rot}deg) scale(${1-offset*.018})`,
    transition:activeRef.current?'none':'transform 270ms cubic-bezier(.2,.7,.2,1)',
    touchAction:'none',cursor:isTop?'grab':'default',userSelect:'none',overflow:'hidden'}}>
    <div style={{position:'absolute',top:22,left:'50%',transform:'translateX(-50%)',
      width:195,height:195,borderRadius:16,overflow:'hidden',boxShadow:'0 10px 30px rgba(0,0,0,.5)'}}>
      <Img id={song.id} size={195} r={16}/>
    </div>
    <div style={{position:'absolute',left:22,right:22,top:234}}>
      <div style={{fontSize:20,lineHeight:1.15,color:CREAM,fontWeight:800,marginBottom:8}}>{song.title}</div>
      <div style={{display:'flex',alignItems:'baseline',gap:5,marginBottom:4}}>
        <span style={{fontSize:13,color:'rgba(245,239,224,.8)',fontWeight:600}}>{song.artist}</span>
        <span style={{fontSize:10,color:VIOLET,fontWeight:600}}>· {artistTier}</span>
      </div>
      <div style={{display:'flex',alignItems:'baseline',gap:5,marginBottom:4}}>
        <span style={{fontSize:12,color:'rgba(245,239,224,.55)'}}>{song.album}</span>
        <span style={{fontSize:10,color:'rgba(183,168,255,.6)'}}>· {songTier}</span>
      </div>
      <div style={{display:'flex',alignItems:'baseline',gap:5}}>
        <span style={{fontSize:12,color:'rgba(245,239,224,.55)'}}>{genre}</span>
        <span style={{fontSize:10,color:'rgba(183,168,255,.6)'}}>· {genreTier}</span>
      </div>
    </div>
    <div style={{position:'absolute',left:22,right:22,bottom:18,display:'flex',alignItems:'center',gap:10}}>
      <div onClick={isTop?onToggle:undefined} style={{width:30,height:30,borderRadius:15,background:'rgba(245,239,224,.12)',
        display:'flex',alignItems:'center',justifyContent:'center',cursor:isTop?'pointer':'default'}}>
        <Ic d={isPlaying?P.pause:P.play} sz={13} fill={CREAM} st={CREAM} sw={0}/>
      </div>
      <div style={{flex:1,height:2,background:'rgba(245,239,224,.2)',borderRadius:1,overflow:'hidden'}}>
        <div style={{width:`${Math.round(progress*100)}%`,height:'100%',background:CREAM,transition:'width 200ms linear'}}/>
      </div>
      <span style={{fontSize:11,color:'rgba(245,239,224,.6)'}}>0:{String(Math.round(progress*30)).padStart(2,'0')}</span>
    </div>
    <div style={{position:'absolute',top:18,left:14,padding:'4px 10px',borderRadius:7,
      border:`2.5px solid ${CORAL}`,color:CORAL,fontSize:13,fontWeight:900,letterSpacing:1.5,
      transform:'rotate(-14deg)',opacity:lOp}}>LESS OF THIS</div>
    <div style={{position:'absolute',top:18,right:14,padding:'4px 10px',borderRadius:7,
      border:`2.5px solid ${LIME}`,color:LIME,fontSize:13,fontWeight:900,letterSpacing:1.5,
      transform:'rotate(14deg)',opacity:mOp}}>MORE OF THIS</div>
  </div>;
}

function HiFiGuidedTuning({onBack,onFinish,songInfluence,artistInfluence,genreInfluence,adjustSong,adjustArtist,adjustGenre,playSong,audioProps}){
  const N=SONGS.length;
  const [idx,setIdx]=useState(0);
  const cur=SONGS[idx%N];
  const next=()=>setIdx(i=>(i+1)%N);

  useEffect(()=>{ playSong&&playSong(cur); },[idx]);

  const handleMore=()=>{
    adjustSong(cur.id,+0.10);
    adjustArtist(cur.artistId,+0.06);
    adjustGenre(cur.genreId,+0.04);
    next();
  };
  const handleLess=()=>{
    adjustSong(cur.id,-0.10);
    adjustArtist(cur.artistId,-0.06);
    adjustGenre(cur.genreId,-0.04);
    next();
  };

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
      <div onClick={onFinish} style={{display:'flex',alignItems:'center',gap:6,cursor:'pointer',
        padding:'7px 12px',borderRadius:999,background:`rgba(212,255,107,.18)`,color:LIME,
        border:`1px solid rgba(212,255,107,.4)`}}>
        <span style={{fontSize:12,fontWeight:700}}>Finish</span>
      </div>
    </div>
    {[0,1,2].map(off=>(
      <HiFiSwipeCard key={SONGS[(idx+off)%N].id+String(off)} song={SONGS[(idx+off)%N]}
        zIndex={3-off} offset={off*14} isTop={off===0}
        songInfluence={songInfluence} artistInfluence={artistInfluence} genreInfluence={genreInfluence}
        onMore={off===0?handleMore:undefined}
        onLess={off===0?handleLess:undefined}
        isPlaying={off===0?audioProps?.isPlaying:false}
        progress={off===0?audioProps?.progress:0}
        onToggle={off===0?audioProps?.onToggle:undefined}/>
    ))}
    <div style={{position:'absolute',bottom:94,left:24,right:24,zIndex:5,display:'flex',gap:14}}>
      <div onClick={handleLess} style={{flex:1,height:52,borderRadius:14,
        background:'rgba(255,107,87,.14)',border:`1.5px solid ${CORAL}`,
        display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}>
        <span style={{fontSize:14,fontWeight:800,color:CORAL,letterSpacing:.3}}>Less of this</span>
      </div>
      <div onClick={handleMore} style={{flex:1,height:52,borderRadius:14,
        background:'rgba(212,255,107,.14)',border:`1.5px solid ${LIME}`,
        display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}>
        <span style={{fontSize:14,fontWeight:800,color:LIME,letterSpacing:.3}}>More of this</span>
      </div>
    </div>
  </Shell>;
}

// ── Screen 5: Summary ────────────────────────────────────────

function StatRow({icon,label,color}){
  return (
    <div style={{display:'flex',alignItems:'center',gap:10,padding:'8px 12px',
      borderRadius:10,background:'rgba(245,239,224,.05)'}}>
      <span style={{fontSize:15,color,fontWeight:800,width:18,textAlign:'center',lineHeight:1}}>{icon}</span>
      <span style={{fontSize:13,color:CREAM,fontWeight:500}}>{label}</span>
    </div>
  );
}

function HiFiTuningSummary({snapshot,genreInfluence,artistInfluence,songInfluence,onDone}){
  const tierMoves=[];
  GENRES.forEach(g=>{
    const o=influenceTier(snapshot.genre[g.id]),n=influenceTier(genreInfluence[g.id]);
    if(o!==n)tierMoves.push({name:g.name,category:'Genre',oldTier:o,newTier:n,
      delta:genreInfluence[g.id]-snapshot.genre[g.id],hue:g.hue});
  });
  ARTISTS.forEach(a=>{
    const o=influenceTier(snapshot.artist[a.id]),n=influenceTier(artistInfluence[a.id]);
    if(o!==n)tierMoves.push({name:a.name,category:'Artist',oldTier:o,newTier:n,
      delta:artistInfluence[a.id]-snapshot.artist[a.id],hue:a.hue});
  });
  SONGS.forEach(s=>{
    const o=influenceTier(snapshot.song[s.id]),n=influenceTier(songInfluence[s.id]);
    if(o!==n)tierMoves.push({name:s.title,category:'Song',oldTier:o,newTier:n,
      delta:songInfluence[s.id]-snapshot.song[s.id],hue:s.hue});
  });
  tierMoves.sort((a,b)=>Math.abs(b.delta)-Math.abs(a.delta));
  const biggestMoves=tierMoves.slice(0,6);

  let songsUp=0,songsDown=0,artistsUp=0,artistsDown=0,genresUp=0,genresDown=0;
  SONGS.forEach(s=>{
    const d=songInfluence[s.id]-snapshot.song[s.id];
    if(d>0.005)songsUp++;else if(d<-0.005)songsDown++;
  });
  ARTISTS.forEach(a=>{
    const d=artistInfluence[a.id]-snapshot.artist[a.id];
    if(d>0.005)artistsUp++;else if(d<-0.005)artistsDown++;
  });
  GENRES.forEach(g=>{
    const d=genreInfluence[g.id]-snapshot.genre[g.id];
    if(d>0.005)genresUp++;else if(d<-0.005)genresDown++;
  });

  const allChanges=[
    ...GENRES.map(g=>({name:g.name,type:'Genre',hue:g.hue,delta:genreInfluence[g.id]-snapshot.genre[g.id]})),
    ...ARTISTS.map(a=>({name:a.name,type:'Artist',hue:a.hue,delta:artistInfluence[a.id]-snapshot.artist[a.id]})),
    ...SONGS.map(s=>({name:s.title,type:'Song',hue:s.hue,delta:songInfluence[s.id]-snapshot.song[s.id]})),
  ].filter(c=>Math.abs(c.delta)>0.005)
   .sort((a,b)=>Math.abs(b.delta)-Math.abs(a.delta))
   .slice(0,5);

  const noChanges=songsUp+songsDown+artistsUp+artistsDown+genresUp+genresDown===0;

  return <Shell>
    <div style={{position:'absolute',inset:0,overflowY:'auto',paddingBottom:100,scrollbarWidth:'none'}}>
      <div style={{padding:'52px 20px 20px',
        background:'radial-gradient(circle at 20% 10%,#2A4B2A 0%,rgba(14,10,31,0) 65%)'}}>
        <div style={{width:46,height:46,borderRadius:23,
          background:'rgba(212,255,107,.15)',border:`1.5px solid ${LIME}`,
          display:'flex',alignItems:'center',justifyContent:'center',marginBottom:14}}>
          <Ic d={P.chk} sz={20} st={LIME} sw={2.5}/>
        </div>
        <div style={{fontSize:10,color:LIME,fontWeight:700,letterSpacing:1.2,textTransform:'uppercase'}}>Guided Tuning</div>
        <div style={{fontSize:26,fontWeight:800,color:CREAM,marginTop:4}}>Tuning Complete</div>
        <div style={{fontSize:13,color:'rgba(245,239,224,.55)',marginTop:4}}>Here's what changed in your algorithm</div>
      </div>

      {biggestMoves.length>0&&<>
        <div style={{padding:'16px 20px 8px',fontSize:15,fontWeight:800,color:CREAM}}>Biggest Moves</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,padding:'0 20px'}}>
          {biggestMoves.map((m,i)=>(
            <div key={i} style={{borderRadius:12,padding:'10px 12px',
              background:`linear-gradient(135deg,hsl(${m.hue},40%,18%) 0%,hsl(${(m.hue+40)%360},30%,11%) 100%)`,
              border:'1px solid rgba(255,255,255,.06)'}}>
              <div style={{fontSize:9,color:'rgba(245,239,224,.4)',fontWeight:700,textTransform:'uppercase',
                letterSpacing:.8,marginBottom:4}}>{m.category}</div>
              <div style={{fontSize:12,fontWeight:700,color:CREAM,lineHeight:1.2,marginBottom:7,
                overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{m.name}</div>
              <div style={{display:'flex',alignItems:'center',gap:4}}>
                <span style={{fontSize:10,color:'rgba(245,239,224,.45)',fontWeight:600}}>{tierShort(m.oldTier)}</span>
                <span style={{fontSize:10,color:'rgba(245,239,224,.3)'}}>→</span>
                <span style={{fontSize:10,color:m.delta>0?LIME:CORAL,fontWeight:700}}>{tierShort(m.newTier)}</span>
              </div>
            </div>
          ))}
        </div>
      </>}

      <div style={{padding:'16px 20px 8px',fontSize:15,fontWeight:800,color:CREAM}}>Summary</div>
      <div style={{padding:'0 20px',display:'flex',flexDirection:'column',gap:6}}>
        {noChanges&&<StatRow icon='–' label='No changes made yet' color='rgba(245,239,224,.35)'/>}
        {songsUp>0&&<StatRow icon='↑' label={`${songsUp} song${songsUp>1?'s':''} increased influence`} color={LIME}/>}
        {songsDown>0&&<StatRow icon='↓' label={`${songsDown} song${songsDown>1?'s':''} reduced influence`} color={CORAL}/>}
        {artistsUp>0&&<StatRow icon='↑' label={`${artistsUp} artist${artistsUp>1?'s':''} increased influence`} color={LIME}/>}
        {artistsDown>0&&<StatRow icon='↓' label={`${artistsDown} artist${artistsDown>1?'s':''} reduced influence`} color={CORAL}/>}
        {genresUp>0&&<StatRow icon='↑' label={`${genresUp} genre${genresUp>1?'s':''} increased influence`} color={LIME}/>}
        {genresDown>0&&<StatRow icon='↓' label={`${genresDown} genre${genresDown>1?'s':''} reduced influence`} color={CORAL}/>}
      </div>

      {allChanges.length>0&&<>
        <div style={{padding:'16px 20px 8px',fontSize:15,fontWeight:800,color:CREAM}}>Top Moves</div>
        <div style={{padding:'0 20px',display:'flex',flexDirection:'column',gap:6}}>
          {allChanges.map((c,i)=>(
            <div key={i} style={{display:'flex',alignItems:'center',gap:10,padding:'9px 12px',
              borderRadius:10,background:'rgba(245,239,224,.05)'}}>
              <div style={{width:8,height:8,borderRadius:4,background:c.delta>0?LIME:CORAL,flexShrink:0}}/>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:13,fontWeight:600,color:CREAM,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{c.name}</div>
              </div>
              <span style={{fontSize:10,padding:'2px 6px',borderRadius:999,
                background:'rgba(245,239,224,.08)',color:'rgba(245,239,224,.45)',fontWeight:600,flexShrink:0}}>{c.type}</span>
              <span style={{fontSize:12,fontWeight:700,color:c.delta>0?LIME:CORAL,flexShrink:0,minWidth:36,textAlign:'right'}}>
                {c.delta>0?'+':''}{Math.round(c.delta*100)}%
              </span>
            </div>
          ))}
        </div>
      </>}
    </div>
    <div style={{position:'absolute',bottom:24,left:24,right:24,zIndex:20}}>
      <button onClick={onDone} style={{width:'100%',padding:'15px',borderRadius:16,border:'none',cursor:'pointer',
        fontFamily:"'Manrope','Inter',system-ui,sans-serif",
        background:LIME,color:BG,fontSize:15,fontWeight:800,letterSpacing:.2,
        boxShadow:`0 4px 20px rgba(212,255,107,.35)`}}>
        Done
      </button>
    </div>
  </Shell>;
}

// ── HiFi View (flow controller + state owner) ────────────────

export default function HiFiView(){
  const [genreInfluence,setGenreInfluence]=useState(
    ()=>Object.fromEntries(GENRES.map(g=>[g.id,g.weight]))
  );
  const [artistInfluence,setArtistInfluence]=useState(
    ()=>Object.fromEntries(ARTISTS.map(a=>[a.id,a.influence]))
  );
  const [songInfluence,setSongInfluence]=useState(
    ()=>Object.fromEntries(SONGS.map(s=>[s.id,s.influence]))
  );

  const clamp=v=>Math.min(1,Math.max(0,v));
  const adjustGenre =(id,d)=>setGenreInfluence (p=>({...p,[id]:clamp(p[id]+d)}));
  const adjustArtist=(id,d)=>setArtistInfluence(p=>({...p,[id]:clamp(p[id]+d)}));
  const adjustSong  =(id,d)=>setSongInfluence  (p=>({...p,[id]:clamp(p[id]+d)}));

  const [screen,setScreen]=useState('home');
  const [snapshot,setSnapshot]=useState(null);
  const [playlistInfo,setPlaylistInfo]=useState(null);

  const audioRef    = useRef(null);
  const previewUrls = useRef([]);
  const [nowPlaying,setNowPlaying] = useState(null);
  const [isPlaying, setIsPlaying]  = useState(false);
  const [progress,  setProgress]   = useState(0);

  useEffect(()=>{
    const TERMS=['indie','electronic','soul','folk'];
    const BASE='https://itunes.apple.com/search?media=music&limit=50&entity=song&term=';
    Promise.allSettled(
      TERMS.map(t=>fetch(BASE+encodeURIComponent(t)).then(r=>r.json()).then(d=>d.results??[]))
    ).then(results=>{
      const seen=new Set(), urls=[];
      for(const r of results){
        if(r.status!=='fulfilled') continue;
        for(const track of r.value){
          if(track.previewUrl&&!seen.has(track.trackId)){
            seen.add(track.trackId);
            urls.push(track.previewUrl);
          }
        }
      }
      previewUrls.current=urls;
    });
  },[]);

  useEffect(()=>{
    const audio=new Audio();
    audioRef.current=audio;
    const onTimeUpdate=()=>{ if(audio.duration) setProgress(audio.currentTime/audio.duration); };
    const onEnded =()=>{ setIsPlaying(false); setProgress(0); };
    const onPlay  =()=>setIsPlaying(true);
    const onPause =()=>setIsPlaying(false);
    audio.addEventListener('timeupdate',onTimeUpdate);
    audio.addEventListener('ended',onEnded);
    audio.addEventListener('play',onPlay);
    audio.addEventListener('pause',onPause);
    return ()=>{
      audio.pause();
      audio.removeEventListener('timeupdate',onTimeUpdate);
      audio.removeEventListener('ended',onEnded);
      audio.removeEventListener('play',onPlay);
      audio.removeEventListener('pause',onPause);
    };
  },[]);

  const playSong=(song)=>{
    if(!audioRef.current) return;
    const idx=SONGS.findIndex(s=>s.id===song.id);
    const urls=previewUrls.current;
    const url=urls.length>0?urls[idx%urls.length]:null;
    setNowPlaying(song);
    setProgress(0);
    if(!url) return;
    audioRef.current.pause();
    audioRef.current.src=url;
    audioRef.current.currentTime=0;
    audioRef.current.play().catch(()=>{});
  };

  const togglePlay=()=>{
    if(!audioRef.current||!nowPlaying) return;
    isPlaying?audioRef.current.pause():audioRef.current.play().catch(()=>{});
  };

  const seekTo=(e)=>{
    if(!audioRef.current||!nowPlaying) return;
    const rect=e.currentTarget.getBoundingClientRect();
    const ratio=(e.clientX-rect.left)/rect.width;
    if(audioRef.current.duration) audioRef.current.currentTime=ratio*audioRef.current.duration;
  };

  const ALGO_LIBS=new Set(['Discover Weekly','Release Radar','Made For You','Daily Mix 1']);
  const openPlaylist=item=>{
    setPlaylistInfo({label:item.label,isAlgo:ALGO_LIBS.has(item.label),seed:item.song.id,liked:!!item.liked});
    setScreen('playlist');
  };

  const goToTuning=()=>{
    setSnapshot({
      genre:{...genreInfluence},
      artist:{...artistInfluence},
      song:{...songInfluence},
    });
    setScreen('tuning');
  };

  const audioProps={nowPlaying,isPlaying,progress,onToggle:togglePlay,onSeek:seekTo};

  return (
    <div style={{width:'100%',height:'100%',background:'#000',
      display:'flex',alignItems:'center',justifyContent:'center'}}>
      {screen==='home'&&<HiFiHomeScreen onLibrary={()=>setScreen('library')} onPlaylist={openPlaylist} playSong={playSong} audioProps={audioProps}/>}
      {screen==='playlist'&&playlistInfo&&<HiFiPlaylistScreen {...playlistInfo} onBack={()=>setScreen('home')} onAlgo={()=>setScreen('algo')} playSong={playSong} audioProps={audioProps}/>}
      {screen==='library'&&<HiFiLibraryScreen onBack={()=>setScreen('home')} onAlgo={()=>setScreen('algo')} audioProps={audioProps}/>}
      {screen==='algo'&&<HiFiAlgorithmDashboard
        onBack={()=>setScreen('library')} onTuning={goToTuning}
        genreInfluence={genreInfluence} artistInfluence={artistInfluence} songInfluence={songInfluence}
        adjustGenre={adjustGenre} adjustArtist={adjustArtist} adjustSong={adjustSong}/>}
      {screen==='tuning'&&<HiFiGuidedTuning
        onBack={()=>setScreen('algo')} onFinish={()=>setScreen('summary')}
        songInfluence={songInfluence} artistInfluence={artistInfluence} genreInfluence={genreInfluence}
        adjustSong={adjustSong} adjustArtist={adjustArtist} adjustGenre={adjustGenre}
        playSong={playSong} audioProps={audioProps}/>}
      {screen==='summary'&&snapshot&&<HiFiTuningSummary
        snapshot={snapshot}
        genreInfluence={genreInfluence} artistInfluence={artistInfluence} songInfluence={songInfluence}
        onDone={()=>setScreen('algo')}/>}
    </div>
  );
}
