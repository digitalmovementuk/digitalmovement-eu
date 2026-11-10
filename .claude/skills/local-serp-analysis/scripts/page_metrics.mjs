#!/usr/bin/env node
// Page metrics for SERP briefs, counted the same way every time.
//
// Usage:
//   node page_metrics.mjs page1.json page2.json ...   (Firecrawl scrape responses)
//   node page_metrics.mjs --csv *.json > metrics.csv
//
// Accepts Firecrawl REST responses ({ data: { markdown, rawHtml, metadata } }),
// connector results ({ markdown, rawHtml, metadata }), or plain .md / .html files.
// `words` and headings come from the markdown (main content when scraped with
// onlyMainContent: true). `words_full_page` and schema types come from the raw
// HTML (whole page incl. navigation and footer; JSON-LD and microdata).
// Always report the URL and which word count you quote: the two differ a lot.

import { readFileSync } from 'node:fs';
import { extname, basename } from 'node:path';

const args = process.argv.slice(2);
const csv = args.includes('--csv');
const files = args.filter((a) => a !== '--csv');
if (!files.length) {
  console.error('Usage: node page_metrics.mjs [--csv] <file.json|file.md|file.html> ...');
  process.exit(1);
}

function load(path) {
  const raw = readFileSync(path, 'utf8');
  const ext = extname(path).toLowerCase();
  if (ext === '.md') return { markdown: raw, rawHtml: '', metadata: {} };
  if (ext === '.html' || ext === '.htm') return { markdown: '', rawHtml: raw, metadata: {} };
  const j = JSON.parse(raw);
  const d = j.data && (j.data.markdown || j.data.rawHtml || j.data.html) ? j.data : j;
  return { markdown: d.markdown || '', rawHtml: d.rawHtml || d.html || '', metadata: d.metadata || {} };
}

function countWords(md) {
  const text = md
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')          // images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')        // links -> text
    .replace(/https?:\/\/\S+/g, ' ')                // bare URLs
    .replace(/<[^>]+>/g, ' ')                       // stray HTML
    .replace(/[#>*_`|~=-]+/g, ' ');
  return text.split(/\s+/).filter((t) => /[\p{L}\p{N}]/u.test(t)).length;
}

function mdHeadings(md) {
  const c = { h1: 0, h2: 0, h3: 0 };
  let inCode = false;
  for (const line of md.split('\n')) {
    if (line.trim().startsWith('```')) inCode = !inCode;
    if (inCode) continue;
    const m = /^(#{1,3})\s+\S/.exec(line);
    if (m) c['h' + m[1].length]++;
  }
  return c;
}

function htmlHeadings(html) {
  const n = (tag) => (html.match(new RegExp(`<${tag}[\\s>]`, 'gi')) || []).length;
  return { h1: n('h1'), h2: n('h2'), h3: n('h3') };
}

function schemaTypes(html) {
  const types = new Set();
  const add = (t) => (Array.isArray(t) ? t : [t]).forEach((x) => x && types.add(String(x).replace(/^https?:\/\/schema\.org\//, '')));
  const re = /<script[^>]*type\s*=\s*["']?application\/ld\+json["']?[^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html))) {
    try {
      const j = JSON.parse(m[1].trim());
      for (const node of Array.isArray(j) ? j : [j]) {
        if (!node || typeof node !== 'object') continue;
        if (node['@type']) add(node['@type']);
        if (Array.isArray(node['@graph'])) node['@graph'].forEach((g) => g && g['@type'] && add(g['@type']));
      }
    } catch {
      types.add('(invalid JSON-LD)');
    }
  }
  const mi = html.match(/itemtype\s*=\s*["']https?:\/\/schema\.org\/[A-Za-z]+/gi) || [];
  mi.forEach((x) => types.add(x.replace(/.*schema\.org\//i, '') + ' (microdata)'));
  return [...types];
}

function visibleWords(html) {
  const text = html
    .replace(/<head[\s>][\s\S]*?<\/head>/gi, ' ')
    .replace(/<(script|style|noscript|svg|template)[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;|&#160;/g, ' ')
    .replace(/&[a-z]+;|&#\d+;/gi, ' ');
  return text.split(/\s+/).filter((t) => /[\p{L}\p{N}]/u.test(t)).length;
}

function tagText(html, re) {
  const m = re.exec(html);
  return m ? m[1].replace(/\s+/g, ' ').trim() : '';
}

const rows = files.map((f) => {
  const { markdown, rawHtml, metadata: md } = load(f);
  const title = md.title || md.ogTitle || tagText(rawHtml, /<title[^>]*>([\s\S]*?)<\/title>/i);
  const description = md.description || md.ogDescription ||
    tagText(rawHtml, /<meta[^>]+name\s*=\s*["']description["'][^>]*content\s*=\s*["']([^"']*)["']/i);
  const h = markdown ? mdHeadings(markdown) : htmlHeadings(rawHtml);
  return {
    file: basename(f),
    final_url: md.url || md.sourceURL || '',
    status: md.statusCode || '',
    words: markdown ? countWords(markdown) : '',
    words_full_page: rawHtml ? visibleWords(rawHtml) : '',
    h1: h.h1, h2: h.h2, h3: h.h3,
    headings_from: markdown ? 'markdown' : 'html',
    title,
    title_length: title.length,
    meta_description: description,
    schema_types: rawHtml ? schemaTypes(rawHtml).join('; ') : '(no raw HTML)',
    credits_used: md.creditsUsed ?? '',
  };
});

if (csv) {
  const cols = Object.keys(rows[0]);
  const esc = (v) => `"${String(v).replace(/"/g, '""')}"`;
  console.log(cols.join(','));
  rows.forEach((r) => console.log(cols.map((c) => esc(r[c])).join(',')));
} else {
  console.log(JSON.stringify(rows, null, 2));
}
