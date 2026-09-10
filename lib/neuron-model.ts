import * as THREE from 'three';

/** An illustrative, procedurally sculpted neuron; dimensions and colors are teaching aids. */
export function buildNeuron(colors: string[]) {
  const group = new THREE.Group();
  group.rotation.z = .12;
  const meshes: THREE.Mesh[] = [];
  let seed = 391;
  const random = () => { seed = (1664525 * seed + 1013904223) >>> 0; return seed / 4294967296; };
  const size = 128;
  const pixels = new Uint8Array(size * size * 4);
  for (let y=0;y<size;y++) for(let x=0;x<size;x++) {
    const value = Math.floor(120 + 28*Math.sin(x*.47)*Math.cos(y*.39) + random()*48);
    const n=(y*size+x)*4;pixels[n]=pixels[n+1]=pixels[n+2]=value;pixels[n+3]=255;
  }
  const membrane = new THREE.DataTexture(pixels,size,size,THREE.RGBAFormat);
  membrane.wrapS = membrane.wrapT = THREE.RepeatWrapping;
  membrane.magFilter=THREE.LinearFilter;membrane.minFilter=THREE.LinearMipmapLinearFilter;
  membrane.generateMipmaps=true;membrane.needsUpdate=true;
  const materials = colors.map((color,i)=>new THREE.MeshPhysicalMaterial({
    color, metalness:0, roughness:i===5?.32:.49,
    clearcoat:i===5?.35:.16, clearcoatRoughness:.35,
    bumpMap:membrane,bumpScale:i===5?.022:.045,
    transparent:i===1,opacity:i===1?.42:1,depthWrite:i!==1,
    sheen:.3,sheenColor:new THREE.Color(color),sheenRoughness:.75,
  }));
  function add(geometry:THREE.BufferGeometry,i:number) {
    const m=new THREE.Mesh(geometry,materials[i]);m.userData.part=i;group.add(m);meshes.push(m);return m;
  }
  function ball(p:number[],r:number,i:number,scale=[1,1,1],organic=.04) {
    const g=new THREE.SphereGeometry(r,40,28),a=g.attributes.position;
    for(let j=0;j<a.count;j++){
      const x=a.getX(j)/r,y=a.getY(j)/r,z=a.getZ(j)/r;
      const k=1+organic*(Math.sin(x*7+y*3)*Math.cos(z*6-y*2)+.35*Math.sin(y*13+x*9));
      a.setXYZ(j,x*r*k,y*r*k,z*r*k);
    }
    g.computeVertexNormals();const m=add(g,i);m.position.set(...p as [number,number,number]);m.scale.set(...scale as [number,number,number]);return m;
  }
  function tube(points:number[][],radius:number,i:number,endRatio=1) {
    const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p as [number,number,number])));
    const segments=48, radial=12;
    const g=new THREE.TubeGeometry(curve,segments,radius,radial,false),a=g.attributes.position;
    for(let j=0;j<=segments;j++){
      const t=j/segments,c=curve.getPointAt(t);
      const taper=THREE.MathUtils.lerp(1,endRatio,t)*(1+.045*Math.sin(t*28));
      for(let k=0;k<=radial;k++){const n=j*(radial+1)+k;a.setXYZ(n,c.x+(a.getX(n)-c.x)*taper,c.y+(a.getY(n)-c.y)*taper,c.z+(a.getZ(n)-c.z)*taper);}
    }
    g.computeVertexNormals();return add(g,i);
  }
  ball([-3,0,0],1.12,1,[1.13,1,.9],.095);
  ball([-3,.04,.2],.5,2,[1,.93,.9],.045);
  const nucleolus=ball([-2.91,.11,.55],.13,2,[1,.85,1],.06);
  nucleolus.material=materials[2].clone();(nucleolus.material as THREE.MeshPhysicalMaterial).color.multiplyScalar(.58);
  // Small intracellular bodies, visible through the soma, use the soma's selection identity.
  for(let j=0;j<25;j++){
    const a=random()*Math.PI*2,r=.58+random()*.3;
    const m=ball([-3+Math.cos(a)*r,Math.sin(a)*r*.8,(random()-.5)*.8],.055+random()*.04,1,[1.7,.65,.7]);
    m.rotation.z=a;
  }
  const angles=[.72,1.4,2.04,2.67,3.3,3.91,4.55,5.06];
  angles.forEach((a,j)=>{
    const origin=[-3+Math.cos(a)*.67,Math.sin(a)*.67,0];
    const mid=[-3+Math.cos(a)*1.75,Math.sin(a)*1.72,Math.sin(j*2)*.43];
    const tip=[-3+Math.cos(a)*2.9,Math.sin(a)*2.8,Math.sin(j)*.77];
    tube([origin,mid,tip],.24,0,.21);
    for(let k=0;k<3;k++){
      const b=a+(k-1)*.49;
      const end=[tip[0]+Math.cos(b)*(.8+random()*.4),tip[1]+Math.sin(b)*.95,tip[2]+(k-1)*.48];
      tube([mid,tip,end],.083,0,.2);
      for(let q=0;q<2;q++){
        const c=b+(q-.5)*.65;
        tube([end,[end[0]+Math.cos(c)*.55,end[1]+Math.sin(c)*.55,end[2]+(q-.5)*.36]],.022,0,.15);
      }
    }
    // Dendritic spines add local detail without inventing a separate anatomical structure.
    for(let k=0;k<16;k++){
      const t=.15+random()*.8;
      const p=mid.map((v,n)=>THREE.MathUtils.lerp(v,tip[n],t));
      const sign=k%2?1:-1, length=.1+random()*.13;
      const end=[p[0]+Math.cos(a+Math.PI/2)*length*sign,p[1]+Math.sin(a+Math.PI/2)*length*sign,p[2]+(random()-.5)*.2];
      tube([p,end],.016,0,.55);ball(end,.029,0,[1,1.2,1]);
    }
  });
  tube([[-2.22,-.12,0],[-1.72,-.33,.02],[-1.2,-.38,0]],.32,3,.31);
  tube([[-1.2,-.38,0],[1,-.5,.08],[3,-.66,0],[5,-.9,.1]],.1,4,.85);
  for(let j=0;j<5;j++){
    const x=-.9+j*1.12,y=-.4-(x+.9)*.09;
    // Rounded wrapping with layered ends, leaving actual exposed axon at each node.
    const sheath=ball([x+.43,y-.035,.01],1,5,[.45,.28,.28],.022);
    sheath.rotation.z=-.085;
    for(const end of [0,.86]) for(let layer=0;layer<3;layer++){
      const ring=add(new THREE.TorusGeometry(.13+layer*.045,.017,8,40),5);
      ring.position.set(x+end,y-end*.09,.01);ring.rotation.y=Math.PI/2;ring.rotation.z=-.085;
    }
    if(j<4) tube([[x+.88,y-.079,.01],[x+1.1,y-.095,.01]],.105,6);
  }
  for(let j=0;j<5;j++){
    const y=(j-2)*.62-1,end=[6.3+Math.cos(j)*.28,y,Math.sin(j)*.65];
    tube([[4.7,-.86,.05],[5.4,y*.8,0],end],.08,7,.45);
    ball(end,.16,7,[1.12,.83,.95],.09);
  }
  return {group,meshes,dispose(){
    const used=new Set<THREE.Material>();meshes.forEach(m=>{m.geometry.dispose();used.add(m.material as THREE.Material);});used.forEach(m=>m.dispose());membrane.dispose();
  }};
}
