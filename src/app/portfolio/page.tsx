"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import catalog from "@/lib/product-catalog.json";
import "./portfolio.css";

type Build = (typeof catalog)[number];
type Group = "Agent safety" | "Local AI" | "People" | "Builder tools" | "Hardware" | "Business";
const groups: Group[] = ["Agent safety", "Local AI", "People", "Builder tools", "Hardware", "Business"];
const colors: Record<Group, string> = {"Agent safety":"#f99a68","Local AI":"#63e4cf","People":"#ebc779","Builder tools":"#9da7ff","Hardware":"#d48df5","Business":"#e878a8"};
const centers: Record<Group, [number,number]> = {"Agent safety":[.30,.28],"Local AI":[.72,.30],"People":[.75,.70],"Builder tools":[.30,.72],"Hardware":[.13,.49],"Business":[.88,.50]};
function groupFor(b: Build): Group {
  const t=`${b.name} ${b.does} ${b.purpose}`.toLowerCase();
  if (/sandbox|injection|tamper|safety|malicious|attack|threat|audit|trust|proof|containment|exploit|risk|fraud|security|provenance|attestation/.test(t)) return "Agent safety";
  if (/solar|sensor|analog|silicon|hardware|metasurface|vibration|device|battery|scheduler/.test(t)) return "Hardware";
  if (/local|offline|edge|model|inference|compute|mesh|voice|runtime/.test(t)) return "Local AI";
  if (/market|license|chargeback|commerce|domain|revenue|gig|business|estate|investor|pricing/.test(t)) return "Business";
  if (/agent|code|prompt|build|developer|tool|package|compiler|test|fork|replay|version/.test(t)) return "Builder tools";
  return "People";
}
function hash(n:number){return ((Math.sin(n*127.1+83.9)*43758.5453)%1+1)%1}
const nodes=catalog.map((b,i)=>{const g=groupFor(b),center=centers[g], angle=hash(i+11)*Math.PI*2, radius=Math.sqrt(hash(i+88))*.15;return {b,g,x:center[0]+Math.cos(angle)*radius,y:center[1]+Math.sin(angle)*radius,phase:hash(i+123)*Math.PI*2}});
const high=["T21-100","T21-094","T21-124","T21-087","T21-086","T21-054"];

function BuildField({selected,onPick,filter}:{selected:Build,onPick:(b:Build)=>void,filter:Group|"All"}){
  const ref=useRef<HTMLCanvasElement>(null);
  const coords=useRef<{x:number,y:number,b:Build}[]>([]);
  useEffect(()=>{
    const canvas=ref.current;if(!canvas)return;
    const ctx=canvas.getContext("2d");if(!ctx)return;
    let raf=0, width=0,height=0,dpr=1;
    const resize=()=>{const r=canvas.getBoundingClientRect();width=r.width;height=r.height;dpr=Math.min(window.devicePixelRatio||1,2);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr)};
    const observer=new ResizeObserver(resize);observer.observe(canvas);resize();
    const reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const draw=(time:number)=>{
      const t=reduce?0:time*.001;ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,width,height);
      const bg=ctx.createRadialGradient(width*.51,height*.49,20,width*.51,height*.49,width*.6);bg.addColorStop(0,"#152331");bg.addColorStop(1,"#070b13");ctx.fillStyle=bg;ctx.fillRect(0,0,width,height);
      ctx.strokeStyle="rgba(155,188,210,.055)";ctx.lineWidth=1;
      for(let x=0;x<width;x+=38){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,height);ctx.stroke()}
      for(let y=0;y<height;y+=38){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(width,y);ctx.stroke()}
      for(const g of groups){const [cx,cy]=centers[g],x=cx*width,y=cy*height;ctx.beginPath();ctx.arc(x,y,Math.min(width,height)*.17,0,Math.PI*2);ctx.strokeStyle=filter==="All"||filter===g?colors[g]+"30":"#ffffff0a";ctx.stroke();ctx.fillStyle=filter==="All"||filter===g?colors[g]:"#647582";ctx.font="600 10px monospace";ctx.textAlign="center";ctx.fillText(g.toUpperCase(),x,y-Math.min(width,height)*.18)}
      coords.current=[];
      for(const n of nodes){const fade=filter!=="All"&&filter!==n.g;const active=selected.id===n.b.id;const x=(n.x+Math.sin(t*.48+n.phase)*.006)*width,y=(n.y+Math.cos(t*.39+n.phase)*.008)*height;coords.current.push({x,y,b:n.b});
        if(active){ctx.beginPath();ctx.arc(x,y,19+Math.sin(t*2)*3,0,7);ctx.strokeStyle=colors[n.g];ctx.lineWidth=1.5;ctx.stroke();ctx.beginPath();ctx.arc(x,y,34,0,7);ctx.strokeStyle=colors[n.g]+"44";ctx.stroke()}
        ctx.beginPath();ctx.arc(x,y,active?7:3.3,0,7);ctx.fillStyle=fade?"#34434e":colors[n.g];ctx.shadowColor=fade?"transparent":colors[n.g];ctx.shadowBlur=active?24:10;ctx.fill();ctx.shadowBlur=0;
      }
      raf=requestAnimationFrame(draw);
    };raf=requestAnimationFrame(draw);
    return()=>{cancelAnimationFrame(raf);observer.disconnect()};
  },[selected,filter]);
  function locate(e:React.PointerEvent<HTMLCanvasElement>){const r=e.currentTarget.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;let best:typeof coords.current[number]|null=null,dist=18;for(const p of coords.current){const d=Math.hypot(p.x-x,p.y-y);if(d<dist){best=p;dist=d}}return best}
  return <canvas ref={ref} className="build-field" aria-label="Interactive map of 116 builds. Use the build list below for keyboard access." onPointerMove={e=>{e.currentTarget.style.cursor=locate(e)?"pointer":"crosshair"}} onClick={e=>{const n=locate(e);if(n)onPick(n.b)}}/>;
}

export default function Portfolio(){
  const [selected,setSelected]=useState<Build>(catalog.find(b=>b.id==="T21-100")||catalog[0]);
  const [filter,setFilter]=useState<Group|"All">("All");
  const [query,setQuery]=useState("");
  const [showMarket,setShowMarket]=useState(false);
  const visible=useMemo(()=>catalog.filter(b=>(filter==="All"||groupFor(b)===filter)&&`${b.id} ${b.name} ${b.does} ${b.purpose}`.toLowerCase().includes(query.toLowerCase().trim())),[filter,query]);
  function pick(b:Build){setSelected(b);window.history.replaceState(null,"",`#${b.id}`)}
  useEffect(()=>{const id=decodeURIComponent(location.hash.slice(1));const found=catalog.find(b=>b.id===id);if(found)setSelected(found)},[]);
  return <main className="universe">
    <header className="universe-top"><Link href="/" className="brand"><span className="brand-icon">T<span>:</span>U</span><span>MOVING WITH CLARITY</span></Link><nav><a href="https://www.titanuai.com" target="_blank" rel="noreferrer">Ask TitanU ↗</a><a href="#explore">Explore 116</a><a href="#vision">The vision</a><Link href="/marathon">Marathon archive</Link><a href="/WHAT_I_BUILT_PRODUCT_CLARITY_CATALOG.pdf" target="_blank" rel="noreferrer">Source PDF ↗</a></nav><span className="live-pill"><i/> PUBLIC EVIDENCE LAYER</span></header>
    <section className="universe-intro"><div className="intro-copy"><div className="micro"><span className="line"/> JULIUS CAMERON HILL / TITAN UNIVERSAL AI LLC</div><h1><span className="huge">143</span><span className="intro-stack">BUILDS<span>IN 7 DAYS.</span></span></h1><p>Moving With Clarity is the public proof layer: what was built, why it exists, and what can be verified. TitanU is the intelligence layer that makes the wider estate interrogable without exposing the machine.</p></div><div className="intro-aside"><span>01 — THE TARGET</span><b>143 / 21 days</b><span>02 — THE MILESTONE</span><b>143 / 7 days</b><span>03 — PUBLIC CATALOG</span><b>116 active records</b><span>04 — INTELLIGENCE LAYER</span><b>TitanU / 243-repo index</b></div></section>
    <section className="explorer" id="explore"><div className="explorer-top"><div><span className="micro">EXPLORE THE WORK / 001—182</span><h2>Pick a signal.</h2></div><div className="explorer-counter"><b>{visible.length}</b><span>visible builds</span></div></div>
      <div className="filter-bar" aria-label="Filter builds">{(["All",...groups] as const).map(g=><button key={g} onClick={()=>setFilter(g)} className={filter===g?"active":""} style={{"--chip":g==="All"?"#e8f2fa":colors[g]} as React.CSSProperties}>{g}</button>)}</div>
      <div className="stage"><div className="map-wrap"><BuildField selected={selected} onPick={pick} filter={filter}/><div className="map-corner top-left">TITAN / PRODUCT FIELD <span>116 NODES</span></div><div className="map-corner bottom-left">DRAG YOUR EYES. TAP A POINT.</div><div className="map-corner bottom-right">":"</div></div>
      <article className="signal" key={selected.id}><div className="signal-top"><span>{selected.id} / {groupFor(selected).toUpperCase()}</span><span className="signal-pulse">● SELECTED</span></div><div className="signal-number">{selected.id.slice(4)}</div><h3>{selected.name}</h3><p className="signal-does">{selected.does}</p><div className="signal-rule"/><span className="signal-label">WHY IT EXISTS</span><p>{selected.purpose}</p>{selected.audience&&<><span className="signal-label">WHO NEEDS IT</span><p>{selected.audience}</p></>}
      <div className="signal-actions"><a href="https://www.titanuai.com" target="_blank" rel="noreferrer">ASK TITANU ABOUT THIS BUILD ↗</a><span>SOURCE ACCESS BY REVIEW</span><button onClick={()=>setShowMarket(!showMarket)}>{showMarket?"HIDE":"SHOW"} PDF ESTIMATES ↗</button></div>{showMarket&&<div className="market"><div><span>AS-IS ESTIMATE</span><b>{selected.asIsEstimate}</b></div><div><span>CONDITIONAL CEILING</span><b>{selected.conditionalCeiling}</b></div><p>Author estimates in the PDF. No appraisal, offer, revenue, users, or target-runtime proof.</p></div>}</article></div>
      <div className="search-row"><label htmlFor="build-search">FIND A BUILD</label><input id="build-search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search ID, name, problem…"/><span>{visible.length} / 116</span></div>
      <div className="build-strip">{visible.length?visible.map(b=><button id={b.id} key={b.id} onClick={()=>pick(b)} className={selected.id===b.id?"chosen":""} style={{"--stripe":colors[groupFor(b)]} as React.CSSProperties}><span>{b.id}</span><strong>{b.name}</strong><small>{groupFor(b)}</small></button>):<p>No matching build. Try another term.</p>}</div>
    </section>
    <section id="vision" className="vision-stage"><div className="micro">ONE ESTATE / TWO PUBLIC SURFACES</div><h2>Moving With Clarity shows the work.<br/>TitanU interrogates the estate.<br/><em>The implementation stays controlled.</em></h2><p className="vision-note">The public layer proves scope, purpose, and evidence. The intelligence layer helps visitors understand the portfolio. Source access is no longer the default path.</p><div className="micro">THE BILLION-DOLLAR GOAL / A PATH, NOT A PRICE TAG</div><h2>AI that works on your hardware.<br/>Agents that answer for what they do.<br/><em>Tools people can actually use.</em></h2><div className="vision-steps"><div><b>01</b><strong>RUN IT</strong><p>Turn the build scripts into working products with visible controls.</p></div><div><b>02</b><strong>PROVE IT</strong><p>Show each product running, what it does, and where it fails.</p></div><div><b>03</b><strong>PUT IT TO WORK</strong><p>Find users, earn trust, and build repeatable revenue.</p></div></div><p className="vision-note">The 116-record PDF catalogs intended products and estimates. The 143-build milestone is founder-reported. Public catalog entries describe purpose and evidence; implementation access is intentionally controlled.</p></section>
    <footer className="universe-footer"><span>TITAN UNIVERSAL AI LLC · JULIUS CAMERON HILL</span><a href="/WHAT_I_BUILT_PRODUCT_CLARITY_CATALOG.pdf" download>DOWNLOAD THE 36-PAGE CATALOG ↓</a><span>© 2026 · ":"</span></footer>
  </main>
}
