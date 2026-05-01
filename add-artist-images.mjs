// add-artist-images.mjs — enriches ARTISTS in src/songData.js with iTunes artist images
// Run: node add-artist-images.mjs
// Requires: Node 18+

import { readFileSync, writeFileSync } from 'fs';
import { ARTISTS } from './src/songData.js';

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function fetchArtistImage(name, attempt = 0) {
  const url = `https://itunes.apple.com/search?term=${encodeURIComponent(name)}&entity=musicArtist&limit=5`;
  const res = await fetch(url);
  if (res.status === 429 || res.status === 403) {
    if (attempt >= 4) throw new Error(`HTTP ${res.status} after ${attempt + 1} attempts`);
    const wait = 2000 * (attempt + 1);
    process.stderr.write(`  rate limited (${res.status}), waiting ${wait}ms...\n`);
    await sleep(wait);
    return fetchArtistImage(name, attempt + 1);
  }
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  const results = data.results ?? [];
  // prefer exact name match (case-insensitive), fall back to first result
  const match = results.find(r => r.artistName?.toLowerCase() === name.toLowerCase()) ?? results[0];
  if (!match?.artworkUrl100) return null;
  return match.artworkUrl100.replace(/\d+x\d+bb/, '400x400bb');
}

async function main() {
  const enriched = [];
  for (const artist of ARTISTS) {
    if (artist.imageUrl) {
      process.stderr.write(`Skipping "${artist.name}" (already have image)\n`);
      enriched.push(artist);
      continue;
    }
    process.stderr.write(`Fetching image for "${artist.name}"...\n`);
    let imageUrl = null;
    try {
      imageUrl = await fetchArtistImage(artist.name);
    } catch (e) {
      process.stderr.write(`  ERROR: ${e.message}\n`);
    }
    if (imageUrl) {
      process.stderr.write(`  → ${imageUrl}\n`);
    } else {
      process.stderr.write(`  → not found\n`);
    }
    enriched.push({ ...artist, imageUrl: imageUrl ?? null });
    await sleep(300);
  }

  // patch songData.js: replace the ARTISTS block
  const src = readFileSync('./src/songData.js', 'utf8');
  const newArtistsBlock = `export const ARTISTS = ${JSON.stringify(enriched, null, 2)};`;
  const patched = src.replace(/export const ARTISTS = \[[\s\S]*?\];/, newArtistsBlock);
  writeFileSync('./src/songData.js', patched, 'utf8');
  process.stderr.write(`\nDone: updated ${enriched.length} artists in src/songData.js\n`);
}

main().catch(e => { process.stderr.write(e.stack + '\n'); process.exit(1); });
