// fetch-songs.mjs — fetches 20 songs × 20 genres from iTunes Search API
// Run: node fetch-songs.mjs > src/songData.js
// Requires: Node 18+

const GENRES_META = [
  { id:'g1',  name:'Pop',                 term:'pop',               weight:.85, hue:340 },
  { id:'g2',  name:'Rock',                term:'rock',              weight:.72, hue:10  },
  { id:'g3',  name:'Hip-Hop / Rap',       term:'hip hop',           weight:.78, hue:30  },
  { id:'g4',  name:'Electronic / EDM',    term:'electronic',        weight:.65, hue:190 },
  { id:'g5',  name:'R&B / Soul',          term:'r&b',               weight:.74, hue:20  },
  { id:'g6',  name:'Country',             term:'country',           weight:.35, hue:40  },
  { id:'g7',  name:'Jazz',                term:'jazz',              weight:.52, hue:200 },
  { id:'g8',  name:'Classical',           term:'classical',         weight:.28, hue:230 },
  { id:'g9',  name:'Blues',               term:'blues',             weight:.38, hue:220 },
  { id:'g10', name:'Reggae',              term:'reggae',            weight:.44, hue:130 },
  { id:'g11', name:'Metal',               term:'metal',             weight:.31, hue:270 },
  { id:'g12', name:'Folk',                term:'folk',              weight:.42, hue:50  },
  { id:'g13', name:'Punk',                term:'punk',              weight:.26, hue:0   },
  { id:'g14', name:'Latin',               term:'latin',             weight:.58, hue:15  },
  { id:'g15', name:'Indie / Alternative', term:'indie alternative', weight:.69, hue:300 },
  { id:'g16', name:'Dancehall',           term:'dancehall',         weight:.47, hue:80  },
  { id:'g17', name:'World / Global',      term:'afrobeat',          weight:.33, hue:90  },
  { id:'g18', name:'Gospel / Christian',  term:'gospel',            weight:.21, hue:55  },
  { id:'g19', name:'K-Pop',               term:'kpop',              weight:.61, hue:320 },
  { id:'g20', name:'Ambient / Chillout',  term:'ambient',           weight:.76, hue:210 },
];

const sleep = ms => new Promise(r => setTimeout(r, ms));

// deterministic pseudo-random integer in [min, max] from a seed integer
function seededInt(seed, min, max) {
  let x = (seed ^ (seed >>> 16)) * 0x45d9f3b;
  x = (x ^ (x >>> 16)) >>> 0;
  return min + (x % (max - min + 1));
}

async function fetchGenre(term, wantCount = 20) {
  // fetch 2× to have headroom after filtering
  const url = `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&media=music&limit=${wantCount * 2}&entity=song`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return (data.results ?? []).filter(t => t.previewUrl && t.artworkUrl100);
}

async function main() {
  const artistCount = new Map(); // artistName → # songs already added globally
  const artistIndex = new Map(); // artistName → sequential index (0-based)
  const rawSongs = [];           // { track, genreId }

  for (const genre of GENRES_META) {
    process.stderr.write(`Fetching "${genre.name}" (${genre.term})...\n`);
    let results = [];
    try {
      results = await fetchGenre(genre.term);
    } catch (e) {
      process.stderr.write(`  ERROR: ${e.message} — skipping\n`);
      await sleep(350);
      continue;
    }

    let added = 0;
    for (const track of results) {
      if (added >= 20) break;
      const name = track.artistName;
      const count = artistCount.get(name) ?? 0;
      if (count >= 3) continue; // max 3 songs per artist across the whole dataset
      artistCount.set(name, count + 1);
      if (!artistIndex.has(name)) artistIndex.set(name, artistIndex.size);
      rawSongs.push({ track, genreId: genre.id });
      added++;
    }
    process.stderr.write(`  → ${added} songs added (${results.length} candidates)\n`);
    await sleep(350);
  }

  // ── Build ARTISTS ──────────────────────────────────────────
  const artists = [];
  for (const [name, idx] of artistIndex.entries()) {
    const s = idx * 173 + 23;
    artists.push({
      id:        `a${idx + 1}`,
      name,
      plays:     seededInt(s,      5, 500),
      hue:       (idx * 37 + 14) % 360,
      influence: Math.round(seededInt(s + 7, 1, 99)) / 100,
    });
  }

  // ── Build SONGS ────────────────────────────────────────────
  const songs = rawSongs.map(({ track, genreId }, i) => {
    const artistIdx = artistIndex.get(track.artistName);
    const tid = track.trackId;
    // upgrade artwork from 100px → 400px thumbnail
    const artworkUrl = (track.artworkUrl100 ?? '').replace(/\d+x\d+bb/, '400x400bb');
    return {
      id:         `s${i + 1}`,
      trackId:    tid,
      title:      track.trackName,
      artist:     track.artistName,
      artistId:   `a${artistIdx + 1}`,
      album:      track.collectionName ?? '',
      genreId,
      hue:        (tid * 37 + 14) % 360,
      sat:        50 + (tid * 13) % 30,
      years:      Math.round((1 + ((tid * 7) % 40) / 10) * 10) / 10,
      influence:  Math.min(0.99, Math.max(0.01,
                    Math.round((0.05 + ((tid * 73 + 11) % 97) / 100) * 100) / 100)),
      artworkUrl,
    };
  });

  // ── Output ─────────────────────────────────────────────────
  const genresOut = GENRES_META.map(({ id, name, weight, hue }) => ({ id, name, weight, hue }));

  process.stdout.write([
    '// AUTO-GENERATED by fetch-songs.mjs — do not edit by hand',
    '',
    `export const GENRES = ${JSON.stringify(genresOut, null, 2)};`,
    '',
    `export const ARTISTS = ${JSON.stringify(artists, null, 2)};`,
    '',
    `export const SONGS = ${JSON.stringify(songs, null, 2)};`,
    '',
  ].join('\n'));

  process.stderr.write(`\nDone: ${songs.length} songs across ${artists.length} artists\n`);
}

main().catch(e => { process.stderr.write(e.stack + '\n'); process.exit(1); });
