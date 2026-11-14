

const TAU=Math.PI*2, clamp=(x,a,b)=>Math.max(a,Math.min(b,x)),rad=d=>d*Math.PI/180;
const golden=137.507764;
const presets={
 rose:{petals:6,layers:8,open:64,width:92,curl:22,ruffle:12,twist:7,thickness:18,stem:68,size:105,angle:golden,dome:45,ray:40,color:'#c92839',roseStyle:'natural',kind:'whorl',note:'Rose growth here is staged after a real bud-to-bloom sequence: green sepals enclose the early bud, then peel back as outer red petals open first and inner petals unfurl later. It remains an experimental approximation rather than a precise developmental model.'},
 tulip:{petals:6,layers:1,open:33,width:80,curl:14,ruffle:0,twist:3,thickness:20,stem:78,size:95,angle:120,dome:22,ray:40,color:'#eb4b67',kind:'whorl',note:'Tulips form a cup from six gently curved tepals in two offset whorls of three. The illustrative animation shows a green bud elongating, developing pigment, and opening at its tips.'},
 lily:{petals:6,layers:1,open:80,width:46,curl:55,ruffle:10,twist:18,thickness:15,stem:74,size:105,angle:120,dome:15,ray:55,color:'#fff3d1',kind:'whorl',note:'Lilies have 6 showy tepals arranged in two sets of three, often with recurved tips and prominent stamens.'},
 sunflower:{petals:32,layers:1,open:88,width:55,curl:13,ruffle:8,twist:5,thickness:27,stem:79,size:110,angle:golden,dome:53,ray:30,color:'#f7bd38',kind:'disc',note:'Hundreds of small flowers (florets) form the sunflower head. The golden divergence angle packs florets into opposing Fibonacci spiral families.'},
 daisy:{petals:26,layers:1,open:92,width:45,curl:17,ruffle:7,twist:3,thickness:23,stem:70,size:98,angle:golden,dome:33,ray:50,color:'#f4f0ed',kind:'disc',note:'A daisy head is a cluster of small flowers. Spiral phyllotaxis occurs in its central disc, while the outer rays create a different, more radial pattern.'},
 gerbera:{petals:27,layers:2,open:90,width:75,curl:24,ruffle:8,twist:5,thickness:25,stem:74,size:110,angle:golden,dome:27,ray:45,color:'#f26539',kind:'disc',note:'Gerberas are composite flower heads, with a central disc and showy ray florets. This single-like form uses two overlapping tiers of broad rays with gentle variation in their downward bend. Semi-double and double cultivars can have additional inner rows. Golden-angle spirals apply to the packed disc florets, not the ray count.'},
 echinacea:{petals:18,layers:1,open:85,width:57,curl:22,ruffle:4,twist:6,thickness:20,stem:83,size:102,angle:golden,dome:92,ray:85,color:'#db83ab',kind:'disc',note:'Coneflowers have a noticeably domed central disc, making the 3D arrangement of florets especially visible from the side and top.'},
 poppy:{petals:4,layers:1,open:89,width:100,curl:33,ruffle:25,twist:13,thickness:15,stem:71,size:102,angle:90,dome:12,ray:22,color:'#e95742',kind:'whorl',note:'Many poppies show four broad petals in two overlapping pairs: fourfold symmetry, rather than the sunflower\'s dense seed spiral.'}
};
function hexToRGB(hex){const c=new THREE.Color(hex);return c;}
function material(c,side=THREE.DoubleSide){return new THREE.MeshStandardMaterial({color:c,side,roughness:1,metalness:0,flatShading:false});}
function meshOfSurface(fn,segT=18,segU=12,thickness=0.005){
 const pts=[],inds=[],stride=segU+1;
 for(let side=0;side<2;side++)for(let i=0;i<=segT;i++)for(let j=0;j<=segU;j++){
 const t=i/segT,u=j/segU*2-1,v=fn(t,u);
 // Thin leaf-like volume: thickness peaks at the centre, fades smoothly along its perimeter.
 const envelope=Math.max(0,Math.sin(Math.PI*t))**0.8*Math.max(0,1-u*u)**1.2;
 pts.push(v[0],v[1]+(side===0?1:-1)*thickness*envelope*.5,v[2]);
 }
 const base=stride*(segT+1);
 for(let i=0;i<segT;i++)for(let j=0;j<segU;j++){
 let a=i*stride+j,b=a+stride;
 inds.push(a,b,a+1,a+1,b,b+1);
 inds.push(base+a,base+a+1,base+b,base+a+1,base+b+1,base+b);
 }
 // Stitch the sides, for a sealed, rounded, tapering solid.
 for(let i=0;i<segT;i++)for(const j of [0,segU]){let a=i*stride+j,b=(i+1)*stride+j;inds.push(a,base+a,b,b,base+a,base+b);}
 for(const i of [0,segT])for(let j=0;j<segU;j++){let a=i*stride+j,b=a+1;inds.push(a,b,base+a,b,base+b,base+a);}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pts,3));g.setIndex(inds);g.computeVertexNormals();return g;
}
function petalSurface(spec){
 const {base,phi,length,width,opening,curl,ruffle,twist,tipRound,rose=false,q=0,seed=0}=spec;
 return (t,u)=>{
 const wShape=Math.pow(Math.max(0,Math.sin(Math.PI*Math.pow(t,.77))),.64);
 const wide=width*wShape*(.76+tipRound*.24);
 const lateral=u*wide;
 const ruffleWave=ruffle*Math.pow(t,2.4)*Math.pow(Math.abs(u),3)*Math.sin(5.2*u+seed*1.7);
 const lateralCurve=twist*Math.pow(t,1.6)*(u*u+.1);
 let r,y;
 if(rose){
   // Inner petals are upright, slender and tightly folded. Outer petals cradle them in a rounded cup.
   const spread=(.18+.82*q)*opening;
   r=.07+q*.72 + length*(.28+spread*.84)*Math.pow(t,.87);
   const baseY=.13+q*.13;
   const top=.80*(1-q)+.37*q;
   y=baseY+top*Math.sin(Math.PI*t*.77)-(.13+.22*q)*opening*Math.pow(t,2.4);
   y+=curl*.18*u*u*Math.pow(t,3)+ruffleWave;
 }else{
   r=.04+length*(.2+.8*opening)*Math.pow(t,.86);
   y=length*(.95-.60*opening)*t-curl*.34*Math.pow(t,2.6)+ruffleWave;
 }
 // transverse cupping and rippling. Width changes independently of radial spread.
 y+= (rose?.11:.09)*(1-u*u)*Math.sin(Math.PI*t);
 const theta=phi+lateral/(Math.max(.20,r+.18))*.46+lateralCurve;
 const R=r+.07*(1-u*u)*Math.sin(Math.PI*t);
 return [base[0]+R*Math.cos(theta),base[1]+y,base[2]+R*Math.sin(theta)];
 };
}
function newPetal(parent,opts,color,thickness){let geo=meshOfSurface(petalSurface(opts),30,18,thickness),m=new THREE.Mesh(geo,material(color));m.castShadow=true;m.receiveShadow=true;parent.add(m);}
function stemAndLeaves(group,p,headY,type){
 const adultLength=1.2+p.stem/100*2.0;
 const stage=clamp(p.growth??1,0,1);
 const rise=stage*stage*(3-2*stage);
 const len=type==='tulip'?adultLength*(.48+.52*rise):adultLength;
 const green=material('#438b52');
 const stem=new THREE.Mesh(new THREE.CylinderGeometry(.067,.075,len+.12,16),green);
 stem.position.y=headY-len/2+.06;stem.castShadow=true;group.add(stem);
 if(type==='tulip'){
   // Slim collar joins the stem to all six tepals without an artificial green sphere.
   const collar=new THREE.Mesh(
     new THREE.CylinderGeometry(.083,.067,.19,24,1),green);
   collar.position.y=headY+.085;collar.castShadow=true;group.add(collar);
 }
 if(type!=='tulip'){
 const receptacle=new THREE.Mesh(new THREE.SphereGeometry(type==='rose'?.125:.22,24,18),material('#458f4b'));
 receptacle.scale.set(1,1.10,1);receptacle.position.y=headY-.005;group.add(receptacle);
 }
 for(let k=0;k<2;k++){
 const h=headY-len*(.34+k*.29),a=.6+k*Math.PI;
 const fn=(t,u)=>{const reach=.9*t,ww=.27*Math.pow(Math.sin(Math.PI*t),.75),cu=.12*(1-u*u)*Math.sin(Math.PI*t);return [Math.cos(a)*reach-Math.sin(a)*ww*u,h+.15*Math.sin(Math.PI*t)-.21*t+cu,Math.sin(a)*reach+Math.cos(a)*ww*u]};
 const leaf=new THREE.Mesh(meshOfSurface(fn,18,12,.045),material(k?'#45965c':'#51a46a'));leaf.castShadow=true;leaf.receiveShadow=true;group.add(leaf);
 // midrib follows the leaf's centreline.
 const points=[];for(let j=0;j<=12;j++){const pp=fn(j/12,0);points.push(new THREE.Vector3(pp[0],pp[1]+.022,pp[2]));}
 const vein=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),16,.007,5,false),material('#91ba68'));group.add(vein);
 }
 return len;
}
// Build a softly shaded petal with subtle two-tone pigment variation. The
// geometry is still independent: no code from Floraison is included.
function organicPetal(parent,fn,hex,layer,seed,thickness=.012){
 const samplesT=52,samplesU=28;
 const geo=meshOfSurface(fn,samplesT,samplesU,thickness);
 const pos=geo.getAttribute('position'),col=[];
 const base=new THREE.Color(hex),stride=samplesU+1;
 for(let i=0;i<pos.count;i++){
   const t=Math.floor((i%((samplesT+1)*stride))/stride)/samplesT;
   const u=((i%stride)/samplesU)*2-1;
   const c=base.clone();
   // Pale base, slightly saturated rim, and faint natural irregularity.
   c.lerp(new THREE.Color('#ffede1'),(.32*(1-t)*(1-t)));
   // Pigment accumulates toward the curled lip; subtle separate shade for each overlapping petal.
   c.offsetHSL(.003*Math.sin(seed*1.9),-.015, .082*Math.sin(seed*1.5+layer*.83)+.075*t-.11*Math.abs(u)*t);
   col.push(c.r,c.g,c.b);
 }
 geo.setAttribute('color',new THREE.Float32BufferAttribute(col,3));
 const m=new THREE.MeshStandardMaterial({vertexColors:true,side:THREE.DoubleSide,roughness:1,metalness:0,flatShading:false});
 const mesh=new THREE.Mesh(geo,m);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;
}
function rose(group,p,headY){
 const age=clamp(p.growth??1,0,1);
 const smooth=x=>{x=clamp(x,0,1);return x*x*(3-2*x)};
 const phase=(start,end)=>smooth((age-start)/(end-start));
 const layers=Math.max(4,Math.round(p.layers));
 const style=p.roseStyle||'natural';
 const isCup=style==='cup',isRosette=style==='rosette',isSpiral=style==='spiral';
 const matureOpen=p.open/100,countBase=Math.max(5,Math.min(11,p.petals));
 // The green juvenile bud stays compact; sepals enlarge only slightly as they reflex.
 const juvenile=phase(.08,.34),sepalSpread=phase(.15,.39);
 const greenScale=.66+.17*juvenile;
 const hyp=new THREE.Mesh(new THREE.SphereGeometry(1,28,20),material('#53904c'));
 hyp.scale.set(.14,.17,.14);hyp.position.y=headY+.055;hyp.castShadow=true;group.add(hyp);
 for(let k=0;k<5;k++){
  const phi=k*TAU/5+.12;
  const fn=(t,u)=>{
   const e=Math.sin(Math.PI*Math.pow(t,.72));
   const w=greenScale*(.02+.155*Math.pow(Math.max(0,e),.78))*u;
   const closedR=greenScale*(.10+.145*Math.sin(Math.PI*t*.78)-.09*Math.pow(t,4));
   const reflexR=.11+.12*t+.27*Math.pow(t,1.7);
   const rr=closedR*(1-sepalSpread)+reflexR*sepalSpread;
   const closedY=headY+.09+greenScale*(.62*t-.08*t*t);
   const reflexY=headY+.09+.32*t-.40*Math.pow(t,2);
   const y=closedY*(1-sepalSpread)+reflexY*sepalSpread+.016*(1-u*u)*Math.sin(Math.PI*t);
   const a=phi+.03*u*t;
   return [rr*Math.cos(a)-w*Math.sin(a),y,rr*Math.sin(a)+w*Math.cos(a)];
  };
  const sep=new THREE.Mesh(meshOfSurface(fn,28,18,.012),material(k%2?'#649f57':'#75ad60'));
  sep.castShadow=true;sep.receiveShadow=true;group.add(sep);
 }
 const redReveal=phase(.18,.34);
 const core=new THREE.Mesh(new THREE.SphereGeometry(1,32,24),material(p.color));
 core.scale.set(.08+.065*redReveal,.13+.085*redReveal,.08+.065*redReveal);
 core.position.y=headY+.26;core.visible=redReveal>.02;group.add(core);
 // Petals are bounded angular sectors on nested radial shells, rather
 // than tangent planes that cross one another. Outer whorls cradle the centre.
 for(let layer=0;layer<layers;layer++){
  const q=layer/(layers-1),innerDelay=1-q;
  const emergence=phase(.19+.10*innerDelay,.37+.13*innerDelay);
  const opening=phase(.35+.23*innerDelay,.77+.19*innerDelay)*matureOpen;
  const petals=Math.max(4,Math.round(countBase*(.70+.22*q)));
  const sector=TAU/petals;
  const styleFlare=isCup?.83:isRosette?1.08:1;
  const height=(1.06-.28*q)*(isCup?1.11:isRosette?.91:1)*(.30+.70*emergence);
  const halfArc=sector*Math.min(.485,.43*(p.width/92));
  for(let j=0;j<petals;j++){
   const seed=layer*29+j,phi=j*sector+layer*(isSpiral?2.40:2.12)+.012*Math.sin(seed*1.47);
   const variation=1+.024*Math.sin(seed*1.53);
   const fn=(t,u)=>{
    const rise=smooth(t/.66),upper=smooth((t-.70)/.30);
    const az=phi+u*halfArc*(.06+.94*smooth(t/.36))*variation+
      (p.twist/100)*.012*t*t*(1-u*u);
    // Strict outward tier spacing prevents prominent self-intersections;
    // the rim's inward fold stays smaller than the shell separation.
    const outerRadius=q*(.20+.48*opening*styleFlare)*rise;
    const centralBulge=.085*(1-q)*Math.sin(Math.PI*t);
    const rimCurl=q*(.017+.025*(p.curl/100))*opening*upper;
    const rr=.09+.065*t+outerRadius+centralBulge-rimCurl+
      .022*(1-u*u)*Math.sin(Math.PI*t);
    let y=headY+.11+height*(t-.07*q*t*t)*variation;
    y+=.055*(1-u*u)*Math.sin(Math.PI*t);
    y-=opening*(.02+.075*q)*Math.pow(t,3);
    y-=.035*u*u*upper;
    y+=(p.ruffle/100)*.007*Math.sin(3*u+seed*.23)*upper;
    return [rr*Math.cos(az),y,rr*Math.sin(az)];
   };
   if(emergence>.005)organicPetal(group,fn,p.color,layer,seed,.007+p.thickness/100*.013);
  }
 }
}
function whorl(group,p,headY,type){
 const age=clamp(p.growth??1,0,1),smooth=x=>{x=clamp(x,0,1);return x*x*(3-2*x)};
 const count=Math.max(3,p.petals),rounds=type==='tulip'?2:p.layers;
 const per=type==='tulip'?Math.max(3,Math.round(count/2)):count;
 for(let k=0;k<rounds;k++)for(let j=0;j<per;j++){
   const theta=TAU*j/per+(k%2)*Math.PI/per+.018*Math.sin(j*7+k);
   const op=(p.open/100)*smooth(age);
   if(type==='tulip'){
     // Each tepal is a curved sector of the same cup, not a flat tangent panel.
     // Two offset whorls of three, each with a separate radial shell, prevent mesh crossings.
     const growth=clamp(age,0,1);
     // Green closed bud first; the colour develops only as the elongated bud
     // approaches opening. Two staggered three-tepal whorls form one cup.
     const paint=smooth((growth-.34)/.34);
     const unfurl=smooth((growth-.53)/.45)*(.55+.65*p.open/100);
     const outer=k===1,body=smooth((growth-.05)/.62);
     const height=.29+.77*body;
     const pigment=new THREE.Color('#619d55').lerp(new THREE.Color(p.color),paint);
     const halfArc=(outer?.82:.79)*(p.width/80)*(.48+.52*body);
     const fn=(t,u)=>{
       const upper=smooth((t-.54)/.46);
       const belly=Math.pow(Math.sin(Math.PI*t),1.15);
       // The rim narrows into the centre while the bud is green and closed.
       // With maturity the upper edge slowly folds outward into a rounded lip.
       const env=(.08+.92*smooth(t/.34))*(1-.30*smooth((t-.82)/.18)*(1-unfurl));
       const variation=1+.072*Math.sin(j*2.31+k*1.7);
       const az=theta+u*halfArc*env*variation+(p.twist/100)*.026*t*t
         +(.058*Math.sin(j*2.63+k*1.8)+.022*u*u*Math.sin(j+2*k))*t*t;
       const cupOpen=unfurl*(outer?1.09:.94);
       const rootR=outer?.090:.083;
       // Closed tulip: narrow base, rounded broad middle, gathered tips.
       // The nonzero middle radius produces a genuinely bulbous silhouette.
       let rr=rootR+.030*t+(.29+.035*Math.sin(j*2.24+k))*belly*(.30+.70*body);
       rr+=(.38+.085*Math.sin(j*1.96+k*2.3))*cupOpen*upper;
       rr+=.035*(1-u*u)*belly;
       let y=headY+.13+height*t*(1+.070*Math.sin(j*1.77+k*2.1));
       y+=.055*(1-u*u)*belly;
       y-=(.16+.035*Math.cos(j*2.11+k))*cupOpen*upper+.027*u*u*Math.pow(t,3);
       y+=.017*Math.sin(3*u+j*1.37+k)*upper;
       return [rr*Math.cos(az),y,rr*Math.sin(az)];
     };
     organicPetal(group,fn,pigment.getStyle(),k,j+11*k,.007+p.thickness/100*.010);
   }else{
     const opening=type==='lily'?.48+op*.55:op;
     const variance=1+.065*Math.sin(j*2.39+k*1.34);
     const length=(type==='poppy'?1.08:1.22)*(.62+.38*age)*variance;
     const w=(type==='poppy'?.66:.42)*(p.width/80)*Math.pow(6/per,.34)*(1+.05*Math.cos(j*1.83+k));
     newPetal(group,{base:[0,headY,0],phi:theta+.032*Math.sin(j*2.13+k),length,width:w,opening:opening*(1+.045*Math.sin(j*1.93+k)),curl:p.curl/100*(type==='lily'?1.25:.7),ruffle:p.ruffle/100*.13,twist:p.twist/100*.22,tipRound:1,seed:j+7*k},p.color,.007+p.thickness/100*.052);
   }
 }
 // Stamens emerge from the same receptacle, below the tall tulip rim.
 const sty=type==='tulip'?.60:.34;
 if(type==='tulip'&&age<.74)return;
 for(let j=0;j<(type==='poppy'?24:6);j++){
  const a=j*TAU/(type==='poppy'?24:6);
  const fil=new THREE.Mesh(new THREE.CylinderGeometry(.009,.014,sty,6),material('#dfd19c'));
  fil.position.set(.10*Math.cos(a),headY+sty/2,.10*Math.sin(a));group.add(fil);
  const an=new THREE.Mesh(new THREE.SphereGeometry(.035,8,7),material(type==='lily'?'#c56736':'#6c432e'));
  an.position.set(.15*Math.cos(a),headY+sty,.15*Math.sin(a));group.add(an);
 }
}
function discFlower(group,p,headY,type){
 const age=clamp(p.growth??1,0,1),n=Math.max(8,p.petals),radius=type==='echinacea'?.57:.52, dome=(p.dome/100)*(type==='echinacea'?.67:.40)+.08;
 // Ray florets begin more upright and swing out as they mature; the openness
 // slider controls the final inclination while the growth stage controls timing.
 const smooth=x=>x*x*(3-2*x);
 const spread=smooth(clamp(p.open/100,0,1))*smooth(age);

 const base=new THREE.Mesh(new THREE.CylinderGeometry(radius,radius*.87,.16,80),material(type==='sunflower'?'#544024':'#647635'));base.position.y=headY+.015;base.castShadow=true;group.add(base);
 const domeMesh=new THREE.Mesh(new THREE.SphereGeometry(1,64,36,0,TAU,0,Math.PI/2),material(type==='daisy'?'#d9ab27':type==='gerbera'?'#a87727':'#594022'));
 domeMesh.scale.set(radius,dome,radius);domeMesh.position.y=headY+.075;domeMesh.castShadow=true;group.add(domeMesh);
 // Vogel spiral placement of small florets on the 3D domed head.
 const total=type==='sunflower'?950:type==='gerbera'?680:type==='echinacea'?610:460;
 const sphere=new THREE.SphereGeometry(.015,6,5),mat=new THREE.MeshStandardMaterial({roughness:1,vertexColors:false,color:'#f4ba57'});
 const inst=new THREE.InstancedMesh(sphere,mat,total),dummy=new THREE.Object3D();const cl=new THREE.Color();
 for(let i=0;i<total;i++){
  const radiusN=Math.sqrt((i+.5)/total),a=rad(p.angle)*i,R=radius*radiusN;
  const domeY=dome*Math.sqrt(Math.max(0,1-radiusN*radiusN));
  dummy.position.set(R*Math.cos(a),headY+.075+domeY+.010,R*Math.sin(a));
  const sc=.65+1.2*radiusN;
  dummy.scale.setScalar(sc);dummy.updateMatrix();inst.setMatrixAt(i,dummy.matrix);
  cl.setHSL(type==='daisy'?.12:type==='gerbera'?.085:type==='echinacea'?.10:.105,.65,.28+.39*radiusN);
  inst.setColorAt(i,cl);
 }
 inst.instanceMatrix.needsUpdate=true;inst.instanceColor.needsUpdate=true;group.add(inst);
 for(let k=0;k<p.layers;k++)for(let i=0;i<n;i++){
  const phi=TAU*i/n + k*Math.PI/n;
  const cone=type==='echinacea',gerbera=type==='gerbera';
  // Two staggered, broader ray tiers in single-like gerberas. Small deterministic
  // differences keep the petals from forming an unnaturally flat uniform ring.
  const variance=gerbera?(.94+.085*Math.sin(i*2.17+k*1.41)+.04*Math.cos(i*.79+2*k)):(.97+.045*Math.sin(i*2.31+k*1.9));
  const tierLength=gerbera?(k===0?1.10:.88):1;
  // Coneflower rays are proportionally LONGER and characteristically hang down
  // from the rim of a raised cone. Other composites have fuller, rounded ray tips.
  const length=(cone?1.42:type==='sunflower'?1.09:gerbera?1.24:1.03)*(p.size/100)*(.31+.69*age)*tierLength*variance;
  const fn=(t,u)=>{
   const smoothstep=x=>{x=clamp(x,0,1);return x*x*(3-2*x)};
   // A rounded elliptical tip for coneflower rays: width smoothly closes to
   // zero across the final 22% of the petal, instead of ending in a flat cut.
   const tipStart=cone?.78:type==='sunflower'?.78:gerbera?.76:.88;
   const roundedTip=t>tipStart ? Math.sqrt(Math.max(0,1-Math.pow((t-tipStart)/(1-tipStart),2))) : 1;
   const env=(.18+.82*smoothstep(t/.40))*roundedTip;
   const w=(cone?.182:gerbera?.215:.15)*(p.width/(gerbera?72:55))*(36/n)**.54*env*u*(gerbera?(k===0?1:.93):1);
   const reach=.15+.85*spread;
   const rr=radius*.88+length*t*reach;
   const th=phi+w/(Math.max(.2,rr))*.78+(p.twist/100)*.04*t*t;
   const upright=length*t*(1-spread)*(gerbera?.64:.78);
   const droop=cone ? (.15+(.28+.70*p.ray/100)*spread+.06*Math.sin(i*2.12))*(t*t*(1.08-.08*t)) : gerbera ? (.07+(p.ray/100)*.19+.09*Math.sin(i*2.51+k*1.9)+.06*(k===0?1:-1))*spread*t*t : ((p.ray/100-.5)*.24+.046*Math.sin(i*2.4+k*1.37))*t*t*spread;
   const tipCurl=(p.curl/100)*(cone?.04:.10)*t*t*t*spread;
   const ridge=(gerbera?.075:.085)*(1-u*u)*Math.sin(Math.PI*t)+.024*Math.sin(Math.PI*t)+(gerbera?.018*Math.cos(u*7.3)*Math.sin(Math.PI*t):0);
   const edgeWave=(p.ruffle/100)*.010*Math.sin(5*u+2*t)*Math.pow(t,2);
   return [rr*Math.cos(th),headY+.075+upright+ridge+edgeWave-droop-tipCurl,rr*Math.sin(th)];
  };
  organicPetal(group,fn,p.color,k,i+103*k,.01+p.thickness/100*.024);
 }
}
function makeFlower(type,settings){const p={...settings},group=new THREE.Group();const headY=0;
 const stemGroup=new THREE.Group(),bloomGroup=new THREE.Group();group.add(stemGroup,bloomGroup);
 stemAndLeaves(stemGroup,p,headY,type);
 if(type==='rose')rose(bloomGroup,p,headY);
 else if(['sunflower','daisy','gerbera','echinacea'].includes(type))discFlower(bloomGroup,p,headY,type);
 else whorl(bloomGroup,p,headY,type);
 const development=clamp(p.growth??1,0,1);
 if(type==='tulip'){
  const rise=development*development*(3-2*development);
  // The stem geometry itself changes length; avoid scaling from its lower
  // origin, which previously pulled its tip away from the flower.
  group.position.y=-.40*(1-rise);
 }
 group.userData.stem=stemGroup;group.userData.bloom=bloomGroup;group.userData.stemLength=1.2+p.stem/100*2.0;
 group.scale.setScalar(p.size/100);
 return group;
}


import * as THREE from 'three';


const names={rose:'Rose',tulip:'Tulip',lily:'Lily',sunflower:'Sunflower',daisy:'Daisy',gerbera:'Gerbera',echinacea:'Coneflower',poppy:'Poppy'};
const defs=[
 ['petals','Petals / rays',3,64,1,'Outer petal or ray count'],['layers','Petal layers',1,9,1,'Number of overlapping whorls'],
 ['open','Bloom openness',0,100,1,'How much the petals spread'],['width','Petal width',20,130,1,'Wider petals create fuller blooms'],
 ['curl','Petal curl',0,100,1,'How petal tips turn back'],['thickness','Soft thickness',0,100,1,'Rounded tissue rather than flat paper'],
 ['ruffle','Edge ruffling',0,100,1,'Gentle undulation along the edge'],['twist','Petal twist',0,100,1,'Rotation along the petal'],
 ['stem','Stem length',20,85,1,'Capped to keep the flower in view'],
 ['angle','Divergence angle',90,160,.1,'Golden angle ≈ 137.508°'],['dome','Disc dome',0,100,1,'Height of the central flower head'],['ray','Ray droop',0,100,1,'Downward or upward angle of daisy-like rays']
];
const $=id=>document.getElementById(id), controls=$('controls');let family='rose',p={...presets[family]};let mode='perspective',angleX=.47,angleY=.27,zoom=5.0;
const canvas=$('scene'),renderer=new THREE.WebGLRenderer({canvas,antialias:true,preserveDrawingBuffer:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setClearColor('#0d1b1b');renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.shadowMap.autoUpdate=true;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.03;
const scene=new THREE.Scene();scene.background=new THREE.Color('#112722');
const camera=new THREE.PerspectiveCamera(38,1,.1,100);
const hemi=new THREE.HemisphereLight('#fff2ec','#314f42',.95);scene.add(hemi);
const key=new THREE.DirectionalLight('#fff3eb',2.2);key.position.set(-3,7,6);key.castShadow=true;
key.shadow.mapSize.set(2048,2048);
key.shadow.camera.left=-3.8;key.shadow.camera.right=3.8;
key.shadow.camera.top=4.3;key.shadow.camera.bottom=-4.3;
key.shadow.camera.near=.5;key.shadow.camera.far=24;
key.shadow.bias=-0.00008;key.shadow.normalBias=.025;
key.shadow.radius=3.5;key.shadow.blurSamples=12;
key.target.position.set(0,0,0);scene.add(key.target);scene.add(key);
const fill=new THREE.DirectionalLight('#bcd6e0',.30);fill.position.set(4,2,-4);scene.add(fill);
let flower;let animationId=0;let animationToken=0;
function disposeFlower(){if(!flower)return;scene.remove(flower);flower.traverse(x=>{if(x.geometry)x.geometry.dispose();if(x.material){if(Array.isArray(x.material))x.material.forEach(m=>m.dispose());else x.material.dispose();}})}
function renderFlower(stage=1){disposeFlower();flower=makeFlower(family,{...p,growth:stage});scene.add(flower);
 $('flowerLabel').textContent=names[family];$('science').textContent=p.note;
 $('angleTitle').textContent='Floret spiral / phyllotaxis';
 $('angleHelp').textContent='The angle changes the arrangement of small florets in the flower head. 137.508° is the golden angle. Flowers with just a few petals use whorl symmetry instead.';
 $('symmetry').textContent=p.kind==='disc'?'Vogel spiral, many florets':`${p.petals}-part outer symmetry`;
 if($('growthStage')){$('growthStage').value=Math.round(stage*100);$('growthValue').textContent=Math.round(stage*100)+'%';}
 const roseStage=$('roseStageLabel');if(roseStage){roseStage.hidden=!['rose','tulip'].includes(family);if(family==='rose')roseStage.textContent=stage<.12?'1 · Closed green bud':stage<.30?'2 · Green sepals peel back':stage<.48?'3 · Red bud emerges':stage<.70?'4 · Outer petals unfurl':stage<.90?'5 · Inner layers revealed':'6 · Layered open rose';else if(family==='tulip')roseStage.textContent=stage<.24?'1 · Green bud growing':stage<.49?'2 · Petal colour emerging':stage<.76?'3 · Tulip tepals opening':'4 · Open tulip cup';}
 refreshOverview();render();}
function replayGrowth(){cancelAnimationFrame(animationId);const token=++animationToken;const start=performance.now(),duration=3000;let last=-1000;
 function frame(now){if(token!==animationToken)return;const stage=Math.min(1,(now-start)/duration);if(now-last>65||stage===1){renderFlower(stage);last=now;}if(stage<1)animationId=requestAnimationFrame(frame)}animationId=requestAnimationFrame(frame)}
function stopGrowth(){animationToken++;cancelAnimationFrame(animationId)}
function setMode(v){mode=v;$('topBtn').classList.toggle('selected',v==='top');$('sideBtn').classList.toggle('selected',v==='perspective');render();}
function adjustCamera(){const target=new THREE.Vector3(0,.12,0);if(mode==='top'){camera.position.set(.001,zoom,0.001);camera.up.set(0,0,-1)}else{camera.up.set(0,1,0);camera.position.set(Math.sin(angleY)*Math.cos(angleX)*zoom,Math.sin(angleX)*zoom,Math.cos(angleY)*Math.cos(angleX)*zoom)}camera.lookAt(target);camera.updateProjectionMatrix()}
function render(){adjustCamera();renderer.render(scene,camera);const zv=document.getElementById('zoomValue');if(zv)zv.textContent=Math.round(500/zoom)+'%'}
function resize(){const w=canvas.clientWidth,h=canvas.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();render()}
new ResizeObserver(resize).observe(canvas);
// Track active pointers so one finger rotates and two fingers pinch to zoom.
const activePointers=new Map();let pinchDistance=null;
function distanceBetweenPointers(){const [a,b]=[...activePointers.values()];return Math.hypot(a.x-b.x,a.y-b.y)}
canvas.addEventListener('pointerdown',e=>{
 if(e.pointerType==='mouse'&&e.button!==0)return;
 activePointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
 canvas.setPointerCapture(e.pointerId);
 if(activePointers.size===2)pinchDistance=distanceBetweenPointers();
});
canvas.addEventListener('pointermove',e=>{
 const previous=activePointers.get(e.pointerId);if(!previous)return;
 activePointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
 if(activePointers.size===2){
  const nextDistance=distanceBetweenPointers();
  if(pinchDistance!==null&&nextDistance>0){zoom=Math.max(3.2,Math.min(8.5,zoom*pinchDistance/nextDistance));render()}
  pinchDistance=nextDistance;return;
 }
 if(activePointers.size!==1)return;
 const dx=e.clientX-previous.x,dy=e.clientY-previous.y;
 if(mode==='top'){angleY+=dx*.004;}else{angleY+=dx*.009;angleX=Math.max(-.18,Math.min(1.3,angleX+dy*.007))}render();
});
function endPointer(e){activePointers.delete(e.pointerId);pinchDistance=null;
 if(activePointers.size===2)pinchDistance=distanceBetweenPointers();
}
canvas.addEventListener('pointerup',endPointer);
canvas.addEventListener('pointercancel',endPointer);
canvas.addEventListener('lostpointercapture',endPointer);canvas.addEventListener('wheel',e=>{e.preventDefault();zoom=Math.max(3.2,Math.min(8.5,zoom+e.deltaY*.003));render()},{passive:false});
$('zoomOut').onclick=()=>{zoom=Math.min(8.5,zoom*.90**-1);render()};$('zoomIn').onclick=()=>{zoom=Math.max(3.2,zoom*.90);render()};
$('topBtn').onclick=()=>setMode('top');$('sideBtn').onclick=()=>setMode('perspective');$('resetView').onclick=()=>{zoom=5.0;angleX=.47;angleY=.27;setMode('perspective');render()};
function setFlower(type){stopGrowth();family=type;p={...presets[family]};zoom=type==='gerbera'?5.65:5.0;[...$('families').children].forEach(b=>b.classList.toggle('selected',b.dataset.id===type));buildControls();renderFlower()}
for(const [id,label] of Object.entries(names)){const b=document.createElement('button');b.dataset.id=id;b.textContent=label;b.className='family';b.onclick=()=>setFlower(id);$('families').append(b)}
// Only expose controls that actually change the selected flower's geometry.
const groupings=[['Shape','petals','layers','open','width','curl','thickness','ruffle','twist'],['Growth','stem','dome','ray']];
const visibleByFamily={
 rose:['petals','layers','open','width','curl','thickness','ruffle','twist','stem'],
 tulip:['petals','open','width','curl','thickness','ruffle','twist','stem'],
 lily:['petals','layers','open','width','curl','thickness','ruffle','twist','stem'],
 poppy:['petals','layers','open','width','curl','thickness','ruffle','twist','stem'],
 sunflower:['petals','layers','open','width','curl','thickness','ruffle','twist','stem','dome','ray','angle'],
 daisy:['petals','layers','open','width','curl','thickness','ruffle','twist','stem','dome','ray','angle'],
 gerbera:['petals','layers','open','width','curl','thickness','ruffle','twist','stem','dome','ray','angle'],
 echinacea:['petals','layers','open','width','curl','thickness','ruffle','twist','stem','dome','ray','angle']
};

const roseStyles={
 natural:{label:'Garden rose',help:'Rounded bloom inspired by rose growth, with staggered unfurling and overlapping cups.'},
 spiral:{label:'Spiral rose',help:'Sculptural geometry with a clearly readable spiral centre and angularly offset petals.'},
 rosette:{label:'Full rosette',help:'Dense, lower-profile rose with broad layers and a packed centre.'},
 cup:{label:'Cupped rose',help:'An upright bud-shaped cup whose outer petals open more slowly.'}
};
function updateRoseStyleButtons(){
 const section=$('roseStyles');section.hidden=family!=='rose';if(section.hidden)return;
 const root=$('roseStyleButtons');root.replaceChildren();
 for(const [id,entry] of Object.entries(roseStyles)){
   const b=document.createElement('button');b.textContent=entry.label;b.classList.toggle('selected',(p.roseStyle||'natural')===id);
   b.onclick=()=>{p.roseStyle=id;stopGrowth();buildControls();renderFlower()};root.append(b);
 }
 $('roseStyleHelp').textContent=roseStyles[p.roseStyle||'natural'].help;
}
function buildControls(){
 controls.replaceChildren();updateRoseStyleButtons();
 const visible=new Set(visibleByFamily[family]);
 const angleVisible=visible.has('angle');
 for(const id of ['angleTitle','angles','angleDirect','angleHelp'])$(id).hidden=!angleVisible;
 if(angleVisible){const angleRoot=$('angleDirect');angleRoot.replaceChildren();const row=document.createElement('div');row.className='control';const h=document.createElement('div');h.className='controlHead';const lab=document.createElement('label');lab.textContent='Divergence angle';lab.htmlFor='angleSlider';const out=document.createElement('output');out.textContent=Number(p.angle).toFixed(1)+'°';out.id='angleSliderValue';h.append(lab,out);const slider=document.createElement('input');slider.id='angleSlider';slider.type='range';slider.min='90';slider.max='160';slider.step='.1';slider.value=p.angle;slider.oninput=()=>{p.angle=Number(slider.value);out.textContent=p.angle.toFixed(1)+'°';stopGrowth();renderFlower()};row.append(h,slider);angleRoot.append(row)}
 for(const [group,...allKeys] of groupings){
 const keys=allKeys.filter(k=>visible.has(k));if(!keys.length)continue;
const section=document.createElement('section');section.className='controlGroup';const heading=document.createElement('h3');heading.textContent=group;section.append(heading);for(const key of keys){const [_,label,min,max,step,hint]=defs.find(x=>x[0]===key);const row=document.createElement('div');row.className='control';
 // Roses use a limited, functional petal-count range instead of a 64-petal no-op plateau.
 const realMax=key==='petals'&&family==='rose'?11:max;
const h=document.createElement('div');h.className='controlHead';const title=document.createElement('label');title.textContent=label;const val=document.createElement('output');val.textContent=key==='angle'?Number(p[key]).toFixed(1)+'°':p[key];h.append(title,val);const slider=document.createElement('input');slider.type='range';slider.min=min;slider.max=realMax;slider.step=step;slider.value=p[key];slider.oninput=()=>{p[key]=Number(slider.value);val.textContent=key==='angle'?p[key].toFixed(1)+'°':p[key];stopGrowth();renderFlower()};const info=document.createElement('small');info.textContent=hint;row.append(h,slider,info);section.append(row)}controls.append(section)}const color=document.createElement('div');color.className='colorbox';color.innerHTML='<label for="petalColor">Petal colour</label><input id="petalColor" type="color">';controls.prepend(color);$('petalColor').value=p.color;$('petalColor').oninput=e=>{p.color=e.target.value;stopGrowth();renderFlower()}}
for(const [label,value] of [['Golden 137.5°',golden],['137°',137],['140°',140],['144°',144],['120°',120],['90°',90]]){const b=document.createElement('button');b.className='preset';b.textContent=label;b.onclick=()=>{p.angle=value;if($('angleSlider')){$('angleSlider').value=value;$('angleSliderValue').textContent=Number(value).toFixed(1)+'°';}stopGrowth();renderFlower()};$('angles').append(b)}
$('resetFlower').onclick=()=>setFlower(family);
$('replayGrowth').onclick=replayGrowth;
$('growthStage').oninput=e=>{stopGrowth();renderFlower(Number(e.target.value)/100)};
$('download').onclick=()=>{render();const a=document.createElement('a');a.download=`flower-shape-lab-${family}.png`;a.href=renderer.domElement.toDataURL('image/png');a.click()};
// Dedicated orthographic 2D representation of the same divergence-angle rule.
function refreshOverview(){const c=$('patternCanvas'),ctx=c.getContext('2d'),size=300;c.width=size*2;c.height=size*2;ctx.setTransform(2,0,0,2,0,0);ctx.clearRect(0,0,300,300);ctx.fillStyle='#101d1d';ctx.fillRect(0,0,300,300);ctx.translate(150,150);if(p.kind==='disc'){
 const N=550;for(let i=0;i<N;i++){const r=Math.sqrt((i+.4)/N)*133,th=i*rad(p.angle);const x=r*Math.cos(th),y=r*Math.sin(th);ctx.beginPath();ctx.fillStyle=`hsl(${36+i/N*30} 78% ${35+i/N*30}%)`;ctx.arc(x,y,1.5+i/N*1.25,0,TAU);ctx.fill()}
 }else{const count=p.petals;for(let j=0;j<count;j++){const a=TAU*j/count;ctx.save();ctx.rotate(a);ctx.fillStyle=p.color;ctx.beginPath();ctx.ellipse(0,-68,Math.max(5,80/count),65,0,0,TAU);ctx.fill();ctx.restore()}ctx.beginPath();ctx.fillStyle='#e9b954';ctx.arc(0,0,10,0,TAU);ctx.fill()}}
$('copySettings').onclick=()=>{const json=JSON.stringify({flower:family,settings:p},null,2);navigator.clipboard?.writeText(json).then(()=>{$('copied').textContent='Copied';setTimeout(()=>{$('copied').textContent=''},1500)}).catch(()=>prompt('Copy settings:',json))};
// Reuse shared TAU and rad helpers declared at the top.
setFlower(family);setMode('perspective');resize();
// Card viewer uses the same Three.js flower engine; no duplicate geometry.
window.addEventListener('message',event=>{
 if(event.origin!==location.origin||!event.data||event.data.type!=='statflowers-card')return;
 const d=event.data;
 if(!Object.prototype.hasOwnProperty.call(presets,d.flower))return;
 if(family!==d.flower)setFlower(d.flower);
 if(/^#[0-9a-fA-F]{6}$/.test(d.color||''))p.color=d.color;
 if(Number.isFinite(d.open))p.open=clamp(d.open,0,100);
 if(Number.isFinite(d.curl))p.curl=clamp(d.curl,0,100);
 if(Number.isFinite(d.width))p.width=clamp(d.width,20,130);
 if(d.bloom){replayGrowth()}else{stopGrowth();renderFlower(1)}
});

