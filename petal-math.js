// Parametric flower-organ growth. Dimensionless, illustrative, not a validated biomechanical solver.
// Inspired by surface growth and differential-growth literature; independently implemented.
// t = base-to-tip, u = transverse coordinate (-1..1), stage = developmental progress.
export const saturate=x=>Math.max(0,Math.min(1,x));
export const smoothstep=x=>{const v=saturate(x);return v*v*(3-2*v)};
export function petalGrowth({t,u,stage=1,seed=0,cupping=.5,edgeGrowth=.2,asymmetry=.1,reflex=0}){
 const growth=smoothstep(stage),tip=smoothstep((t-.62)/.38);
 const bell=Math.pow(Math.max(0,Math.sin(Math.PI*t)),.70);
 const width=bell*(.35+.65*growth)*(1+asymmetry*.18*Math.sin(seed*1.73+3*t));
 // Transverse curvature is highest across the blade, vanishes at the petal root.
 const cup=cupping*width*width*(u*u-.32)*Math.sin(Math.PI*t*.90);
 // Differential growth concentrates edge deformation toward the distal blade.
 const ripple=edgeGrowth*Math.pow(t,2.5)*Math.pow(Math.abs(u),3)*
   (Math.sin(9*u+seed*1.21+2*t)+.32*Math.sin(17*u-seed*.73));
 const torsion=asymmetry*.10*u*t*t*Math.sin(seed*1.9);
 return {width,displacement:cup+ripple-reflex*tip*tip,torsion,tip};
}
// Deterministic angular placement and stable variation, avoiding animation flicker.
export const flowerVariation=(seed,amount=.1)=>1+amount*(.64*Math.sin(seed*2.39996)+.36*Math.sin(seed*4.1414));
export function whorlAngle(index,count,whorl=0){return 2*Math.PI*(index/count+whorl/(2*count))}
export function roseTierRadius({tier,opening,t,cupping=.5}){
 const rise=smoothstep(t/.62),rim=smoothstep((t-.72)/.28);
 // Outer tiers are separated in radius; distal rim turns inward to cradle inner petals.
 return .11+t*.055+tier*(.23+.49*opening)*rise-
   tier*(.045+.10*cupping)*opening*rim;
}
