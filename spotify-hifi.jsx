import { useState, useEffect, useRef } from "react";
import { GENRES, ARTISTS, SONGS } from './src/songData.js';

const BG='#0E0A1F',CREAM='#F5EFE0',LIME='#D4FF6B',CORAL='#FF6B57',VIOLET='#B7A8FF';

const RICK = {
  id:'s_rick', trackId:1559885421,
  title:'Never Gonna Give You Up', artist:'Rick Astley', artistId:'a_rick',
  album:'Whenever You Need Somebody', genreId:'g2', hue:0, sat:60, years:2.1, influence:0.88,
  artworkUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/ce/6d/5b/ce6d5b48-8c36-b990-3b9c-81862fadb459/0859381157694.jpg/400x400bb.jpg',
  previewUrl:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview116/v4/3a/d6/9a/3ad69a5b-1fdc-c0ca-069b-541cef78e9d6/mzaf_12029354858253493617.plus.aac.p.m4a',
};

// ── Helpers ──────────────────────────────────────────────────

function rankSongs(songs,genreInf,artistInf,songInf){
  return [...songs].sort((a,b)=>{
    const score=s=>(genreInf[s.genreId]??0)*0.4+(artistInf[s.artistId]??0)*0.35+(songInf[s.id]??0)*0.25;
    return score(b)-score(a);
  });
}

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

function Img({id,src,size=56,r=8}){
  const url=src||`https://picsum.photos/seed/${id}/200`;
  return <div style={{width:size,height:size,borderRadius:r,flexShrink:0,overflow:'hidden',
    boxShadow:'inset 0 0 0 1px rgba(255,255,255,.06)'}}>
    <img src={url} alt=""
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
  skipf:['M5 4l10 8-10 8V4','M19 4v16'],
  skipb:['M19 4l-10 8 10 8V4','M5 4v16'],
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

function MiniPlayer({nowPlaying,isPlaying,progress,onToggle,onSeek,onNext,onPrev}){
  if(!nowPlaying) return null;
  return <div style={{position:'absolute',left:8,right:8,bottom:76,height:56,borderRadius:14,
    background:'linear-gradient(90deg,#2A1E55,#3B2470)',
    display:'flex',alignItems:'center',padding:'0 10px',gap:10,
    boxShadow:'0 8px 28px rgba(0,0,0,.5)',zIndex:5}}>
    <Img id={nowPlaying.id} src={nowPlaying.artworkUrl} size={40} r={6}/>
    <div style={{flex:1,minWidth:0}}>
      <div style={{fontSize:13,fontWeight:700,color:CREAM,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{nowPlaying.title}</div>
      <div style={{fontSize:11,color:'rgba(245,239,224,.6)'}}>{nowPlaying.artist}</div>
    </div>
    <div style={{display:'flex',alignItems:'center',gap:14}}>
      <div onClick={onPrev} style={{cursor:'pointer',opacity:.75}}>
        <Ic d={P.skipb} sz={16} sw={2.2}/>
      </div>
      <div onClick={onToggle} style={{cursor:'pointer'}}>
        <Ic d={isPlaying?P.pause:P.play} sz={18} sw={2.4}/>
      </div>
      <div onClick={onNext} style={{cursor:'pointer',opacity:.75}}>
        <Ic d={P.skipf} sz={16} sw={2.2}/>
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

function HiFiHomeScreen({onLibrary,onPlaylist,playSong,audioProps,genreInfluence,artistInfluence,songInfluence}){
  const ranked=rankSongs(SONGS,genreInfluence,artistInfluence,songInfluence);
  const quickItems=[
    {label:'Liked Songs',    song:ranked[0],liked:true},
    {label:'Discover Weekly',song:ranked[1]},
    {label:'Made For You',   song:ranked[2]},
    {label:'Daily Mix 1',    song:ranked[3]},
    {label:'Release Radar',  song:ranked[4]},
    {label:'Chill Vibes',    song:ranked[5]},
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
              :<Img id={item.song.id} src={item.song.artworkUrl} size={52} r={0}/>}
            <div style={{flex:1,padding:'0 10px',fontSize:12,fontWeight:700,color:CREAM,
              overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{item.label}</div>
          </div>
        ))}
      </div>
      <div style={{padding:'2px 20px 12px',fontSize:16,fontWeight:800,color:CREAM}}>Jump back in</div>
      <div style={{display:'flex',gap:12,overflowX:'auto',padding:'0 20px 22px',scrollbarWidth:'none'}}>
        {ranked.slice(0,5).map(s=>(
          <div key={s.id} onClick={()=>playSong(s)} style={{flexShrink:0,width:128,cursor:'pointer'}}>
            <Img id={s.id} src={s.artworkUrl} size={128} r={10}/>
            <div style={{fontSize:12,fontWeight:600,color:CREAM,marginTop:7,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{s.title}</div>
            <div style={{fontSize:11,color:'rgba(245,239,224,.5)',marginTop:2,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{s.artist}</div>
          </div>
        ))}
      </div>
      <div style={{padding:'2px 20px 12px',fontSize:16,fontWeight:800,color:CREAM}}>Made for you</div>
      <div style={{display:'flex',gap:12,overflowX:'auto',padding:'0 20px 22px',scrollbarWidth:'none'}}>
        {ranked.slice(5,10).map(s=>(
          <div key={s.id} onClick={()=>playSong(s)} style={{flexShrink:0,width:128,cursor:'pointer'}}>
            <Img id={s.id} src={s.artworkUrl} size={128} r={10}/>
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

function HiFiPlaylistScreen({label,isAlgo,seed,liked,onBack,onLibrary,onAlgo,playSong,audioProps}){
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
            :<img src={songs[0]?.artworkUrl||`https://picsum.photos/seed/${seed}/400`} alt=""
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
          <img src={songs[0]?.artworkUrl||`https://picsum.photos/seed/${seed}/80`} alt=""
            style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}}/>
        </div>
        <Ic d={P.chk} sz={22} st='#1DB954' sw={2.5}/>
        <Ic d={P.dl} sz={20} st='rgba(245,239,224,.55)'/>
        <Ic d={P.more} sz={20} st='rgba(245,239,224,.55)'/>
        <div style={{flex:1}}/>
        <Ic d={P.shuf} sz={22} st='rgba(245,239,224,.45)'/>
        <div onClick={()=>playSong(songs[0],songs)} style={{width:52,height:52,borderRadius:26,background:'#1DB954',flexShrink:0,
          display:'flex',alignItems:'center',justifyContent:'center',
          boxShadow:'0 4px 20px rgba(29,185,84,.35)',cursor:'pointer'}}>
          <Ic d={P.play} sz={22} fill='#000' st='#000'/>
        </div>
      </div>

      {/* song list */}
      {songs.map(s=>(
        <div key={s.id} onClick={()=>playSong(s,songs)} style={{display:'flex',alignItems:'center',gap:12,padding:'8px 20px',cursor:'pointer'}}>
          <Img id={s.id} src={s.artworkUrl} size={50} r={4}/>
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
    <HiFiTabBar active='home' onHome={onBack} onLibrary={onLibrary}/>
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
          <Img id={s.id} src={s.artworkUrl} size={52} r={8}/>
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

function InfluenceRow({label,sublabel,artEl,influence,tierLabel,onMore,onLess,loading}){
  const pct=Math.round(influence*100);
  const btnBase={padding:'5px 9px',borderRadius:999,border:'none',whiteSpace:'nowrap',fontSize:10,fontWeight:700,
    fontFamily:"'Manrope','Inter',system-ui,sans-serif"};
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
        {loading
          ?<button disabled style={{...btnBase,cursor:'default',background:'rgba(183,168,255,.15)',color:VIOLET}}>Tuning…</button>
          :<><button onClick={onMore} style={{...btnBase,cursor:'pointer',background:'rgba(212,255,107,.18)',color:LIME}}>More of this</button>
            <button onClick={onLess} style={{...btnBase,cursor:'pointer',background:'rgba(255,107,87,.18)',color:CORAL}}>Less of this</button></>
        }
      </div>
    </div>
  );
}

const MIN_INF=0.01;
function HiFiAlgorithmDashboard({onBack,onTuning,genreInfluence,artistInfluence,songInfluence,adjustGenre,adjustArtist,adjustSong}){
  const sortedGenres  = [...GENRES].sort((a,b)=>genreInfluence[b.id]-genreInfluence[a.id]);
  const topPerTier=(items,getVal)=>{
    const tiers=['Heavy Influence','Medium Influence','Occasional Influence'];
    return tiers.flatMap(t=>items.filter(x=>influenceTier(getVal(x))===t).sort((a,b)=>getVal(b)-getVal(a)).slice(0,15));
  };
  const sortedArtists = topPerTier(ARTISTS, a=>artistInfluence[a.id]);
  const _songsSorted  = topPerTier(SONGS, s=>songInfluence[s.id]);
  const sortedSongs   = [_songsSorted[0], RICK, ..._songsSorted.slice(1).filter(s=>s.id!=='s_rick')];

  const [zeroConfirm,setZeroConfirm]=useState(null); // {kind:'genre'|'artist'|'song',id,cur}
  const [tuning,setTuning]=useState({});

  const markTuning=(kind,id)=>{
    const key=`${kind}-${id}`;
    setTuning(t=>({...t,[key]:true}));
    setTimeout(()=>setTuning(t=>{const r={...t};delete r[key];return r;}),1500);
  };
  const tryLess=(kind,id,cur)=>{
    if(cur<=0) return;
    if(cur-0.12<=0){ setZeroConfirm({kind,id,cur}); return; }
    if(kind==='genre') adjustGenre(id,-0.12);
    else if(kind==='artist') adjustArtist(id,-0.12);
    else adjustSong(id,-0.12);
    markTuning(kind,id);
  };
  const tryMore=(kind,id)=>{
    if(kind==='genre') adjustGenre(id,+0.12);
    else if(kind==='artist') adjustArtist(id,+0.12);
    else adjustSong(id,+0.12);
    markTuning(kind,id);
  };
  const confirmRemove=()=>{
    const {kind,id}=zeroConfirm;
    if(kind==='genre') adjustGenre(id,-1);
    else if(kind==='artist') adjustArtist(id,-1);
    else adjustSong(id,-1);
    markTuning(kind,id);
    setZeroConfirm(null);
  };
  const confirmKeep=()=>{
    const {kind,id,cur}=zeroConfirm;
    if(kind==='genre') adjustGenre(id,MIN_INF-cur);
    else if(kind==='artist') adjustArtist(id,MIN_INF-cur);
    else adjustSong(id,MIN_INF-cur);
    markTuning(kind,id);
    setZeroConfirm(null);
  };

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
                {tuning[`genre-${g.id}`]
                  ?<button disabled style={{flex:1,padding:'5px 0',borderRadius:999,border:'none',cursor:'default',
                      background:'rgba(183,168,255,.15)',color:VIOLET,fontSize:10,fontWeight:700,
                      fontFamily:"'Manrope','Inter',system-ui,sans-serif"}}>Tuning…</button>
                  :<><button onClick={()=>tryLess('genre',g.id,inf)} style={{flex:1,padding:'5px 0',borderRadius:999,
                      border:'none',cursor:'pointer',background:'rgba(255,107,87,.2)',color:CORAL,
                      fontSize:10,fontWeight:700,fontFamily:"'Manrope','Inter',system-ui,sans-serif"}}>Less</button>
                    <button onClick={()=>tryMore('genre',g.id)} style={{flex:1,padding:'5px 0',borderRadius:999,
                      border:'none',cursor:'pointer',background:'rgba(212,255,107,.2)',color:LIME,
                      fontSize:10,fontWeight:700,fontFamily:"'Manrope','Inter',system-ui,sans-serif"}}>More</button></>
                }
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
              <Img id={a.id} src={a.imageUrl} size={80} r={40}/>
              <div style={{fontSize:11,fontWeight:700,color:CREAM,marginTop:6,textAlign:'center',lineHeight:1.2,width:'100%',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{a.name}</div>
              <div style={{fontSize:10,color:VIOLET,fontWeight:600,marginTop:2,textAlign:'center'}}>{influenceTier(inf)}</div>
              <div style={{display:'flex',gap:4,marginTop:7,width:'100%'}}>
                {tuning[`artist-${a.id}`]
                  ?<button disabled style={{flex:1,padding:'5px 0',borderRadius:999,border:'none',cursor:'default',
                      background:'rgba(183,168,255,.15)',color:VIOLET,fontSize:9,fontWeight:700,
                      fontFamily:"'Manrope','Inter',system-ui,sans-serif"}}>Tuning…</button>
                  :<><button onClick={()=>tryLess('artist',a.id,inf)} style={{flex:1,padding:'5px 0',borderRadius:999,
                      border:'none',cursor:'pointer',background:'rgba(255,107,87,.2)',color:CORAL,
                      fontSize:9,fontWeight:700,fontFamily:"'Manrope','Inter',system-ui,sans-serif"}}>Less</button>
                    <button onClick={()=>tryMore('artist',a.id)} style={{flex:1,padding:'5px 0',borderRadius:999,
                      border:'none',cursor:'pointer',background:'rgba(212,255,107,.2)',color:LIME,
                      fontSize:9,fontWeight:700,fontFamily:"'Manrope','Inter',system-ui,sans-serif"}}>More</button></>
                }
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
          influence={s.id==='s_rick'?RICK.influence:songInfluence[s.id]}
          tierLabel={s.id==='s_rick'?'🔒 Always Here':influenceTier(songInfluence[s.id])}
          artEl={<Img id={s.id} src={s.artworkUrl} size={40} r={6}/>}
          onMore={s.id==='s_rick'?()=>{}:()=>tryMore('song',s.id)}
          onLess={s.id==='s_rick'?()=>{}:()=>tryLess('song',s.id,songInfluence[s.id])}
          loading={s.id!=='s_rick'&&!!tuning[`song-${s.id}`]}/>
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
    {zeroConfirm&&<div style={{position:'absolute',inset:0,background:'rgba(14,10,31,.85)',
      display:'flex',alignItems:'center',justifyContent:'center',zIndex:30,padding:'0 28px'}}>
      <div style={{background:'#1a1535',borderRadius:20,padding:'28px 24px',
        textAlign:'center',border:'1px solid rgba(183,168,255,.25)'}}>
        <div style={{color:CREAM,fontWeight:700,fontSize:16,lineHeight:1.45,marginBottom:24}}>
          Reducing influence will completely remove this from your recommendations, is that okay?
        </div>
        <div style={{display:'flex',gap:12}}>
          <div onClick={confirmKeep} style={{flex:1,padding:'12px 0',borderRadius:999,textAlign:'center',
            background:'rgba(245,239,224,.12)',color:CREAM,fontWeight:700,fontSize:14,cursor:'pointer'}}>Keep</div>
          <div onClick={confirmRemove} style={{flex:1,padding:'12px 0',borderRadius:999,textAlign:'center',
            background:'rgba(255,107,87,.18)',border:'1px solid rgba(255,107,87,.4)',
            color:CORAL,fontWeight:700,fontSize:14,cursor:'pointer'}}>Remove</div>
        </div>
      </div>
    </div>}
  </Shell>;
}

// ── Screen 4: Guided Tuning ──────────────────────────────────

function HiFiSwipeCard({song,zIndex,offset=0,isTop=true,songInfluence,artistInfluence,genreInfluence,onMore,onLess,isPlaying=false,progress=0,onToggle}){
  const [drag,setDrag]=useState({x:0,y:0});
  const [exit,setExit]=useState(null);
  const startRef=useRef(null);
  const draggingRef=useRef(false);
  const exitRef=useRef(false);
  const onMoreRef=useRef(onMore);
  const onLessRef=useRef(onLess);
  useEffect(()=>{onMoreRef.current=onMore;},[onMore]);
  useEffect(()=>{onLessRef.current=onLess;},[onLess]);
  const genre=GENRES.find(g=>g.id===song.genreId)?.name??'Unknown';
  const songTier=influenceTier(songInfluence[song.id]??song.influence);
  const artistTier=influenceTier(artistInfluence[song.artistId]??0.5);
  const genreTier=influenceTier(genreInfluence[song.genreId]??0.5);

  const onPointerDown=e=>{
    if(!isTop||exitRef.current)return;
    e.currentTarget.setPointerCapture(e.pointerId);
    startRef.current={x:e.clientX,y:e.clientY};
    draggingRef.current=true;
    setDrag({x:0,y:0});
  };
  const onPointerMove=e=>{
    if(!draggingRef.current||exitRef.current||!startRef.current)return;
    setDrag({x:e.clientX-startRef.current.x,y:e.clientY-startRef.current.y});
  };
  const onPointerUp=e=>{
    if(!draggingRef.current||exitRef.current||!startRef.current)return;
    const dx=e.clientX-startRef.current.x;
    draggingRef.current=false;startRef.current=null;
    if(dx>45){exitRef.current=true;setExit('m');setTimeout(()=>onMoreRef.current?.(),280);}
    else if(dx<-45){exitRef.current=true;setExit('l');setTimeout(()=>onLessRef.current?.(),280);}
    else setDrag({x:0,y:0});
  };

  let tx=drag.x,ty=drag.y,rot=drag.x/16;
  if(exit==='m'){tx=520;ty=-40;rot=22;}
  if(exit==='l'){tx=-520;ty=-40;rot=-22;}
  const mOp=Math.min(1,Math.max(0,drag.x/45));
  const lOp=Math.min(1,Math.max(0,-drag.x/45));

  return <div onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} style={{
    position:'absolute',left:22,right:22,top:124+offset,height:450,borderRadius:28,zIndex,
    background:`linear-gradient(155deg,hsl(${song.hue},${song.sat}%,28%) 0%,hsl(${(song.hue+40)%360},${song.sat*.55}%,13%) 100%)`,
    boxShadow:'0 22px 55px rgba(0,0,0,.6)',
    transform:`translate(${tx}px,${ty}px) rotate(${rot}deg) scale(${1-offset*.018})`,
    transition:draggingRef.current?'none':'transform 270ms cubic-bezier(.2,.7,.2,1)',
    touchAction:'none',cursor:isTop?'grab':'default',userSelect:'none',overflow:'hidden'}}>
    <div style={{position:'absolute',top:22,left:'50%',transform:'translateX(-50%)',
      width:195,height:195,borderRadius:16,overflow:'hidden',boxShadow:'0 10px 30px rgba(0,0,0,.5)'}}>
      <Img id={song.id} src={song.artworkUrl} size={195} r={16}/>
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
  const [shuffled]=useState(()=>{
    const s=[...SONGS].sort(()=>Math.random()-.5);
    s.splice(1,0,RICK);
    return s;
  });
  const N=shuffled.length;
  const [idx,setIdx]=useState(0);
  const [swipeCount,setSwipeCount]=useState(0);
  const [showMilestone,setShowMilestone]=useState(false);
  const cur=shuffled[idx%N];
  const next=()=>setIdx(i=>(i+1)%N);

  useEffect(()=>{ playSong&&playSong(cur); },[idx]);

  const handleMore=()=>{
    adjustSong(cur.id,+0.10);
    adjustArtist(cur.artistId,+0.06);
    adjustGenre(cur.genreId,+0.04);
    next();
    const nc=swipeCount+1; setSwipeCount(nc); if(nc===20) setShowMilestone(true);
  };
  const handleLess=()=>{
    adjustSong(cur.id,-0.10);
    adjustArtist(cur.artistId,-0.06);
    adjustGenre(cur.genreId,-0.04);
    next();
    const nc=swipeCount+1; setSwipeCount(nc); if(nc===20) setShowMilestone(true);
  };

  return <Shell>
    <div style={{position:'absolute',inset:0,
      background:`radial-gradient(circle at 50% 28%,hsla(${cur.hue},${cur.sat}%,33%,.5) 0%,${BG} 58%)`,
      transition:'background 480ms ease'}}/>
    <div style={{position:'absolute',top:50,left:20,right:20,
      display:'flex',alignItems:'center',justifyContent:'space-between',zIndex:5}}>
      <span style={{fontSize:11,color:'rgba(245,239,224,.5)',fontWeight:700,letterSpacing:1.2,textTransform:'uppercase'}}>Guided Tuning</span>
      <div onClick={onFinish} style={{display:'flex',alignItems:'center',gap:6,cursor:'pointer',
        padding:'7px 12px',borderRadius:999,background:`rgba(212,255,107,.18)`,color:LIME,
        border:`1px solid rgba(212,255,107,.4)`}}>
        <span style={{fontSize:12,fontWeight:700}}>Finish Tuning</span>
      </div>
    </div>
    {[0,1,2].map(off=>(
      <HiFiSwipeCard key={shuffled[(idx+off)%N].id+String(off)} song={shuffled[(idx+off)%N]}
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
    {showMilestone&&<div style={{position:'absolute',inset:0,background:'rgba(14,10,31,.85)',
      display:'flex',alignItems:'center',justifyContent:'center',zIndex:20,padding:'0 28px'}}>
      <div style={{background:'#1a1535',borderRadius:20,padding:'32px 24px',
        textAlign:'center',border:'1px solid rgba(183,168,255,.25)'}}>
        <div style={{fontSize:28,marginBottom:8}}>🎉</div>
        <div style={{color:CREAM,fontWeight:700,fontSize:18,marginBottom:10}}>Look at you go!</div>
        <div style={{color:'rgba(245,239,224,.65)',fontSize:14,lineHeight:1.5,marginBottom:24}}>
          You can continue to tune or stop here and come back later.
        </div>
        <div style={{display:'flex',gap:12}}>
          <div onClick={onFinish} style={{flex:1,padding:'12px 0',borderRadius:999,textAlign:'center',
            background:'rgba(212,255,107,.18)',border:'1px solid rgba(212,255,107,.4)',
            color:LIME,fontWeight:700,fontSize:14,cursor:'pointer'}}>Stop here</div>
          <div onClick={()=>setShowMilestone(false)} style={{flex:1,padding:'12px 0',borderRadius:999,
            textAlign:'center',background:'rgba(245,239,224,.12)',color:CREAM,
            fontWeight:700,fontSize:14,cursor:'pointer'}}>Continue</div>
        </div>
      </div>
    </div>}
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
  const [scale,setScale]=useState(()=>(window.innerHeight*0.9)/800);
  useEffect(()=>{
    const onResize=()=>setScale((window.innerHeight*0.9)/800);
    window.addEventListener('resize',onResize);
    return ()=>window.removeEventListener('resize',onResize);
  },[]);

  const [genreInfluence,setGenreInfluence]=useState(
    ()=>Object.fromEntries(GENRES.map(g=>[g.id,g.weight]))
  );
  const [artistInfluence,setArtistInfluence]=useState(
    ()=>Object.fromEntries(ARTISTS.map(a=>[a.id,a.influence]))
  );
  const [songInfluence,setSongInfluence]=useState(
    ()=>({...Object.fromEntries(SONGS.map(s=>[s.id,s.influence])), [RICK.id]:RICK.influence})
  );

  const clamp=v=>Math.min(1,Math.max(0,v));
  const adjustGenre =(id,d)=>setGenreInfluence (p=>({...p,[id]:clamp(p[id]+d)}));
  const adjustArtist=(id,d)=>setArtistInfluence(p=>({...p,[id]:clamp(p[id]+d)}));
  const adjustSong  =(id,d)=>setSongInfluence  (p=>({...p,[id]:clamp(p[id]+d)}));

  const [screen,setScreen]=useState('home');
  const [snapshot,setSnapshot]=useState(null);
  const [playlistInfo,setPlaylistInfo]=useState(null);

  const audioRef      = useRef(null);
  const nowPlayingRef = useRef(null);
  const queueRef      = useRef([SONGS[0], RICK, ...SONGS.slice(1)]);
  const [nowPlaying,setNowPlaying] = useState(null);
  const [isPlaying, setIsPlaying]  = useState(false);
  const [progress,  setProgress]   = useState(0);

  useEffect(()=>{
    const audio=new Audio();
    audioRef.current=audio;
    const onTimeUpdate=()=>{ if(audio.duration) setProgress(audio.currentTime/audio.duration); };
    const onEnded =()=>{
      const cur=nowPlayingRef.current;
      if(cur){
        const queue=queueRef.current;
        const i=queue.findIndex(s=>s.id===cur.id);
        const nextSong=queue[(i+1)%queue.length];
        nowPlayingRef.current=nextSong;
        setNowPlaying(nextSong);
        setProgress(0);
        if(nextSong.previewUrl&&audio){ audio.src=nextSong.previewUrl; audio.currentTime=0; audio.play().catch(()=>{}); }
      } else { setIsPlaying(false); setProgress(0); }
    };
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

  const playSong=(song,queue=null)=>{
    if(!audioRef.current) return;
    if(queue) queueRef.current=queue;
    nowPlayingRef.current=song;
    const url=song.previewUrl||null;
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
  const playNext=()=>{
    if(!nowPlaying) return;
    const queue=queueRef.current;
    const i=queue.findIndex(s=>s.id===nowPlaying.id);
    playSong(queue[(i+1)%queue.length]);
  };
  const playPrev=()=>{
    if(!nowPlaying) return;
    const queue=queueRef.current;
    const i=queue.findIndex(s=>s.id===nowPlaying.id);
    playSong(queue[(i-1+queue.length)%queue.length]);
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

  const audioProps={nowPlaying,isPlaying,progress,onToggle:togglePlay,onSeek:seekTo,onNext:playNext,onPrev:playPrev};

  return (
    <div style={{width:'100%',height:'100%',background:'#000',
      display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{transform:`scale(${scale})`,transformOrigin:'center center'}}>
        {screen==='home'&&<HiFiHomeScreen onLibrary={()=>setScreen('library')} onPlaylist={openPlaylist} playSong={playSong} audioProps={audioProps} genreInfluence={genreInfluence} artistInfluence={artistInfluence} songInfluence={songInfluence}/>}
        {screen==='playlist'&&playlistInfo&&<HiFiPlaylistScreen {...playlistInfo} onBack={()=>setScreen('home')} onLibrary={()=>setScreen('library')} onAlgo={()=>setScreen('algo')} playSong={playSong} audioProps={audioProps}/>}
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
    </div>
  );
}
