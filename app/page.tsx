'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Popover, PopoverContent, PopoverTitle, PopoverDescription, PopoverTrigger } from '@/components/ui/popover';
import { createHoverPreview } from '../lib/hover-preview';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RotateCcw, Plus, Minus, Move, List, Crosshair, Pin, X } from 'lucide-react';

const parts = [
 {name:'Dendrites',color:'#e6a875',verb:'Receive',text:'Branching extensions receive most of the neuron’s incoming synaptic signals. Receptors respond to neurotransmitters released by other cells.',whole:'These inputs change the membrane voltage. Their combined effects help determine whether the neuron sends an action potential.',note:'A neuron can receive thousands of inputs across its dendritic tree.'},
 {name:'Cell body',color:'#d78565',verb:'Maintain & integrate',text:'Also called the soma, the cell body contains the nucleus and organelles that keep the neuron alive. It also receives synaptic inputs.',whole:'The soma supports the whole cell and helps integrate signals arriving from dendrites before they influence the axon’s initial segment.',note:'The soma is the neuron’s metabolic center.'},
 {name:'Nucleus',color:'#e6b6da',verb:'Direct cell activity',text:'The nucleus houses DNA. Gene expression provides instructions for making proteins that the neuron needs to function and adapt.',whole:'Those proteins support receptors, ion channels, cell maintenance, and changes involved in learning.',note:'Shown through a translucent soma so you can see its position.'},
 {name:'Axon initial segment',color:'#f4cc73',verb:'Initiate',text:'Just beyond the axon hillock, this specialized region has a high density of voltage-gated ion channels. Action potentials usually begin here when threshold is reached.',whole:'It converts the combined influence of incoming signals into an electrical output that can travel down the axon.',note:'The hillock is the taper from soma to axon; the initial segment follows it.'},
 {name:'Axon',color:'#efb778',verb:'Conduct',text:'The axon carries action potentials away from the cell body toward its terminals. Its membrane regenerates the electrical signal as it travels.',whole:'It links the neuron’s input and integration regions to the cells that will receive its output.',note:'Axon length varies widely between neuron types.'},
 {name:'Myelin sheath',color:'#8bcbbb',verb:'Insulate',text:'Myelin is a fatty, multilayered wrapping made by glial cells around some axons. It reduces current leakage and speeds signal conduction.',whole:'Insulation lets electrical current spread rapidly between gaps, making long-distance communication more efficient.',note:'Oligodendrocytes form CNS myelin; Schwann cells form PNS myelin.'},
 {name:'Nodes of Ranvier',color:'#f1d481',verb:'Regenerate',text:'Nodes are small gaps between myelin segments. Concentrated ion channels regenerate the action potential at these exposed regions.',whole:'In saltatory conduction, current spreads beneath myelin and the action potential is renewed at successive nodes.',note:'The signal does not literally leap through empty space.'},
 {name:'Axon terminals',color:'#b39fe8',verb:'Transmit',text:'Terminal branches form connections with target cells. At chemical synapses, an arriving action potential triggers calcium entry and neurotransmitter release.',whole:'Neurotransmitters cross the synaptic cleft and bind receptors on the next cell, influencing its activity.',note:'A synapse includes the terminal, the cleft, and the receiving cell’s specialization.'},
];
type Anchor = {part:number; point:THREE.Vector3};
function Neuron({selected,onSelect,onHover,anchor,lockedAnchor,connector,popup,api}:{selected:number|null;onSelect:(n:number)=>void;onHover:(n:number|null)=>void;anchor:React.MutableRefObject<Anchor|null>;lockedAnchor:React.MutableRefObject<Anchor|null>;connector:React.RefObject<SVGSVGElement|null>;popup:React.RefObject<HTMLElement|null>;api:React.MutableRefObject<{reset:()=>void;zoom:(n:number)=>void}|null>}) {
 const host=useRef<HTMLDivElement>(null);const selection=useRef(selected);selection.current=selected; const [error,setError]=useState(false);
 useEffect(()=>{if(!host.current)return;const el=host.current;let renderer:THREE.WebGLRenderer;try{renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});}catch{setError(true);return;}
 renderer.setPixelRatio(Math.min(devicePixelRatio,2));el.appendChild(renderer.domElement);renderer.domElement.setAttribute('aria-label','Rotatable 3D neuron. Drag to rotate, scroll to zoom, or select a structure.');
 const scene=new THREE.Scene();const camera=new THREE.PerspectiveCamera(38,1,.1,100);camera.position.set(0,0,23);const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.enablePan=false;controls.minDistance=12;controls.maxDistance=65;controls.target.set(.3,0,0);
 scene.add(new THREE.HemisphereLight(0xd9e8ff,0x403e52,2.5));const light=new THREE.DirectionalLight(0xffe3c4,3);light.position.set(-3,6,10);scene.add(light);const rim=new THREE.DirectionalLight(0x92cfe8,2);rim.position.set(3,-2,-5);scene.add(rim);
 const group=new THREE.Group();scene.add(group);group.rotation.z=.12;const meshes:THREE.Mesh[]=[];
 function material(i:number){return new THREE.MeshStandardMaterial({color:parts[i].color,roughness:.37,metalness:.12,transparent:i===1,opacity:i===1?.65:1});}
 function ball(p:number[],r:number,i:number,scale=[1,1,1]){const m=new THREE.Mesh(new THREE.SphereGeometry(r,32,24),material(i));m.position.set(...p as [number,number,number]);m.scale.set(...scale as [number,number,number]);m.userData.part=i;group.add(m);meshes.push(m);return m;}
 function tube(points:number[][],radius:number,i:number){const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p as [number,number,number])));const m=new THREE.Mesh(new THREE.TubeGeometry(curve,32,radius,12,false),material(i));m.userData.part=i;group.add(m);meshes.push(m);return m;}
 ball([-3,0,0],1.12,1,[1.12,1,.86]);ball([-3,.04,.55],.43,2);
 const angles=[.8,1.45,2.05,2.65,3.3,3.9,4.55,5.05];angles.forEach((a,j)=>{const origin=[-3+Math.cos(a)*.65,Math.sin(a)*.65,0];const mid=[-3+Math.cos(a)*1.7,Math.sin(a)*1.7,Math.sin(j*2)*.45];const tip=[-3+Math.cos(a)*3,Math.sin(a)*3,Math.sin(j)*.8];tube([origin,mid,tip],.105,0);for(let k=0;k<2;k++){const b=a+(k===0?-.4:.4);const end=[tip[0]+Math.cos(b)*.95,tip[1]+Math.sin(b)*.95,tip[2]+(k-.5)*.6];tube([mid,tip,end],.047,0);const twig=[end[0]+Math.cos(b+.45)*.45,end[1]+Math.sin(b+.45)*.45,end[2]+.2];tube([end,twig],.024,0);}});
 tube([[-2.2,-.15,0],[-1.65,-.35,0],[-1.2,-.38,0]],.2,3);tube([[-1.2,-.38,0],[1,-.5,.15],[3,-.65,0],[5,-.9,.1]],.1,4);
 for(let j=0;j<5;j++){const x=-.9+j*1.12;const y=-.4-(x+.9)*.09;tube([[x,y,0],[x+.4,y-.02,.06],[x+.86,y-.075,.02]],.28,5);if(j<4)ball([x+.98,y-.085,.02],.135,6,[.8,1,1]);}
 for(let j=0;j<5;j++){const y=(j-2)*.62-1;const end=[6.3+Math.cos(j)*.28,y,Math.sin(j)*.65];tube([[4.7,-.86,.05],[5.4,y*.8,0],end],.065,7);ball(end,.16,7);}
 const ray=new THREE.Raycaster();const pointer=new THREE.Vector2();let down=[0,0];let dragging=false;
 const hover=createHoverPreview(onHover);
 const hitAt=(e:PointerEvent)=>{const b=el.getBoundingClientRect();pointer.set((e.clientX-b.left)/b.width*2-1,-(e.clientY-b.top)/b.height*2+1);ray.setFromCamera(pointer,camera);return ray.intersectObjects(meshes)[0];};
 const remember=(hit:THREE.Intersection)=>{anchor.current={part:hit.object.userData.part,point:group.worldToLocal(hit.point.clone())};};
 const start=(e:PointerEvent)=>{down=[e.clientX,e.clientY];dragging=true;hover.cancel();};
 const pick=(e:PointerEvent)=>{dragging=false;if(Math.hypot(e.clientX-down[0],e.clientY-down[1])>6)return;const hit=hitAt(e);if(hit){remember(hit);hover.cancel();onSelect(hit.object.userData.part);}};
 const move=(e:PointerEvent)=>{if(e.pointerType==='touch'||dragging){hover.cancel();return;}const hit=hitAt(e);renderer.domElement.style.cursor=hit?'pointer':'grab';if(hit)remember(hit);hover.move(hit?hit.object.userData.part:null);};
 const leave=()=>{dragging=false;hover.cancel();};const cancel=()=>hover.cancel();
 renderer.domElement.addEventListener('pointerdown',start);renderer.domElement.addEventListener('pointerup',pick);renderer.domElement.addEventListener('pointermove',move);renderer.domElement.addEventListener('pointerleave',leave);renderer.domElement.addEventListener('pointercancel',leave);renderer.domElement.addEventListener('wheel',cancel);
 api.current={reset:()=>{camera.position.set(.3,0,fitDistance);controls.target.set(.3,0,0);controls.update();},zoom:(n)=>{camera.position.sub(controls.target).multiplyScalar(n).clampLength(12,65).add(controls.target);controls.update();}};
 let fitDistance=23;
 const resize=()=>{const w=el.clientWidth,h=el.clientHeight;if(!w||!h)return;renderer.setSize(w,h);camera.aspect=w/h;const nextFit=Math.max(23,Math.min(55,23/camera.aspect));camera.position.sub(controls.target).multiplyScalar(nextFit/fitDistance).add(controls.target);fitDistance=nextFit;camera.updateProjectionMatrix();};const observer=new ResizeObserver(resize);observer.observe(el);resize();let frame=0;const animate=()=>{frame=requestAnimationFrame(animate);controls.update();meshes.forEach(m=>{const mat=m.material as THREE.MeshStandardMaterial;mat.emissive.set(m.userData.part===selection.current?parts[selection.current ?? 0].color:'#000000');mat.emissiveIntensity=m.userData.part===selection.current?.23:0;});renderer.render(scene,camera);
 const svg=connector.current;const label=popup.current;const chosen=selection.current;
 if(svg&&label&&chosen!==null){
   const defaults=[[-4.7,1.4,0],[-3,0,.8],[-3,.04,.98],[-1.65,-.35,0],[4.85,-.9,.1],[1.7,-.65,.15],[1.2,-.58,.02],[6.3,-1,.2]];
   const target=lockedAnchor.current?.part===chosen?lockedAnchor.current:anchor.current;
   const point=target?.part===chosen?target.point.clone():new THREE.Vector3(...defaults[chosen] as [number,number,number]);
   point.applyMatrix4(group.matrixWorld).project(camera);
   const bounds=el.getBoundingClientRect(), root=svg.getBoundingClientRect(), box=label.getBoundingClientRect();
   const x=(point.x+1)/2*bounds.width+bounds.left-root.left, y=(1-point.y)/2*bounds.height+bounds.top-root.top;
   const stacked=box.top>=bounds.bottom-1;const endX=stacked?box.left-root.left+24:box.left-root.left;const endY=stacked?box.top-root.top:box.top-root.top+54;
   const visible=point.z>-1&&point.z<1&&x>=0&&x<=bounds.width&&y>=0&&y<=bounds.height;
   svg.style.visibility=visible?'visible':'hidden';
   svg.querySelector('polyline')?.setAttribute('points',`${x},${y} ${stacked?x:endX-22},${stacked?endY-18:y} ${endX},${endY}`);
   svg.querySelector('circle')?.setAttribute('cx',String(x));svg.querySelector('circle')?.setAttribute('cy',String(y));
 }else if(svg){svg.style.visibility='hidden';}
 };animate();
 return()=>{cancelAnimationFrame(frame);hover.dispose();renderer.domElement.removeEventListener('pointerdown',start);renderer.domElement.removeEventListener('pointerup',pick);renderer.domElement.removeEventListener('pointermove',move);renderer.domElement.removeEventListener('pointerleave',leave);renderer.domElement.removeEventListener('pointercancel',leave);renderer.domElement.removeEventListener('wheel',cancel);observer.disconnect();controls.dispose();meshes.forEach(m=>{m.geometry.dispose();(m.material as THREE.Material).dispose();});renderer.dispose();renderer.domElement.remove();api.current=null;};
 },[onSelect,onHover,api,anchor,lockedAnchor,connector,popup]);
 return <div className="canvas" ref={host}>{error&&<p className="render-error">3D rendering is unavailable in this browser. Try a browser with WebGL enabled. You can still explore every structure using the Structure index button in the top-right corner.</p>}</div>;
}
export default function Home(){
 const [indexOpen,setIndexOpen]=useState(false);
 const [pinned,setPinned]=useState<number|null>(null);const [hovered,setHovered]=useState<number|null>(null);
 const selected=pinned ?? hovered;const p=selected===null?null:parts[selected];
 const api=useRef<{reset:()=>void;zoom:(n:number)=>void}|null>(null);const anchor=useRef<Anchor|null>(null);const connector=useRef<SVGSVGElement>(null);const popup=useRef<HTMLElement>(null);
 const pinnedAnchor=useRef<Anchor|null>(null);
 const pin=useCallback((n:number)=>{pinnedAnchor.current=anchor.current?.part===n?{part:n,point:anchor.current.point.clone()}:null;setPinned(n);setHovered(null);},[]);
 const onHover=useCallback((n:number|null)=>{setHovered(n);},[]);
 const close=useCallback(()=>{setPinned(null);setHovered(null);pinnedAnchor.current=null;},[]);
 useEffect(()=>{const escape=(e:KeyboardEvent)=>{if(e.key==='Escape'&&!indexOpen)close();};window.addEventListener('keydown',escape);return()=>window.removeEventListener('keydown',escape);},[close,indexOpen]);
 // Keep a pinned label attached to its original hit even as the pointer explores elsewhere.

 return <main>
 <h1 className="hud-name">neuron<span>_01</span></h1>
 <div className="hud-menu"><Popover open={indexOpen} onOpenChange={setIndexOpen}><PopoverTrigger className="index-trigger"><List size={17}/> <span>Structure index</span><span className="menu-count">08</span></PopoverTrigger><PopoverContent align="end" sideOffset={12} className="structure-popup"><div className="menu-heading"><PopoverTitle>STRUCTURE INDEX</PopoverTitle><button aria-label="Close structure index" onClick={()=>setIndexOpen(false)}><X size={17}/></button></div><PopoverDescription className="menu-description">Select a structure to pin its anatomy label.</PopoverDescription><div className="parts">{parts.map((part,i)=><button key={part.name} aria-pressed={pinned===i} onClick={()=>{anchor.current=null;pin(i);setIndexOpen(false);}} className={selected===i?'active':''} style={{'--part-color':part.color} as React.CSSProperties}><span className="index">0{i+1}</span><i/>{part.name}<span className="target-indicator">{pinned===i?'+':'⌁'}</span></button>)}</div></PopoverContent></Popover></div>
 <section className={`workspace ${p?'has-label':''}`} aria-label="Interactive neuron study model"><div className="viewer"><Neuron selected={selected} onSelect={pin} onHover={onHover} anchor={anchor} lockedAnchor={pinnedAnchor} connector={connector} popup={popup} api={api}/><div className="axis-mark" aria-hidden="true">Y +<br/>└── X +</div><div className="viewer-bottom"><span><Move size={16}/> <span>Drag to rotate · Scroll to zoom<br/><small>Hover 1.5s to inspect · Click to pin</small></span></span><div className="view-controls"><button aria-label="Zoom in" onClick={()=>api.current?.zoom(.85)}><Plus size={18}/></button><button aria-label="Zoom out" onClick={()=>api.current?.zoom(1.18)}><Minus size={18}/></button><button aria-label="Reset model view" onClick={()=>api.current?.reset()}><RotateCcw size={18}/></button></div></div></div>
 <svg ref={connector} className="connector" aria-hidden="true" style={{color:p?.color,visibility:'hidden'}}><polyline fill="none" stroke="currentColor" strokeWidth="1.3"/><circle r="5" fill="#041215" stroke="currentColor" strokeWidth="2"/></svg>
 <div className="label-zone" aria-live="polite">{p&&selected!==null?<aside ref={popup} className="label-popup" style={{'--accent':p.color} as React.CSSProperties} aria-label={`${p.name} information`}><div className="label-top"><span>{pinned!==null?<Pin size={14}/>:<Crosshair size={14}/>} {pinned!==null?'TARGET LOCKED':'HOVER PREVIEW'}</span><button onClick={close} aria-label="Close anatomy label"><X size={18}/></button></div><div className="label-id">STRUCTURE / 0{selected+1}</div><h2>{p.name}</h2><div className="function-label">{p.verb}</div><p>{p.text}</p><div className="relation"><h3>In the whole neuron</h3><p>{p.whole}</p></div><div className="remember"><span>FIELD NOTE</span><p>{p.note}</p></div><div className="label-foot">{pinned!==null?'Click another structure to change target.':'Click the structure to keep this label.'}</div></aside>:null}</div></section>
 </main>}
