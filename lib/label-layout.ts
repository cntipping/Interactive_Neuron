export const LABEL_LAYOUT = {
  gap: 32,             // Space between the model edge and its label, in pixels.
  margin: 16,          // Keep labels inside the viewport.
  topInset: 86,        // Leave the name and structure menu clear.
  bottomInset: 90,     // Leave rotation and zoom controls clear.
};
export const MAX_MODEL_SCREEN_FRACTION = 0.78;

export function activePart(hovered:number|null,pinned:number|null){return hovered ?? pinned;}
export type ModelBounds = {left:number;top:number;right:number;bottom:number};

/** Minimum camera distance: the model's bounding sphere fits within 78% of the tighter viewport dimension. */
export function minimumCameraDistance(radius:number,verticalFovDegrees:number,aspect:number){
  const halfFov=verticalFovDegrees*Math.PI/360;
  const usableHalfAngle=Math.atan(Math.tan(halfFov)*Math.min(1,aspect)*MAX_MODEL_SCREEN_FRACTION);
  return radius/Math.sin(usableHalfAngle);
}

/** Compare eight outward positions around the projected model, then choose the clearest on-screen label. */
export function labelPosition(x:number,y:number,width:number,height:number,labelWidth:number,labelHeight:number,model?:ModelBounds){
  const {gap,margin,topInset,bottomInset}=LABEL_LAYOUT;
  const clamp=(v:number,min:number,max:number)=>Math.max(min,Math.min(v,Math.max(min,max)));
  const b=model??{left:x-8,top:y-8,right:x+8,bottom:y+8};
  const centerX=(b.left+b.right)/2,centerY=(b.top+b.bottom)/2;
  const positions=[
    {direction:'left',left:b.left-gap-labelWidth,top:y-labelHeight/2},
    {direction:'right',left:b.right+gap,top:y-labelHeight/2},
    {direction:'above',left:x-labelWidth/2,top:b.top-gap-labelHeight},
    {direction:'below',left:x-labelWidth/2,top:b.bottom+gap},
    {direction:'upper-left',left:b.left-gap-labelWidth,top:b.top-gap-labelHeight},
    {direction:'upper-right',left:b.right+gap,top:b.top-gap-labelHeight},
    {direction:'lower-left',left:b.left-gap-labelWidth,top:b.bottom+gap},
    {direction:'lower-right',left:b.right+gap,top:b.bottom+gap},
  ];
  const overlap=(left:number,top:number,right:number,bottom:number)=>
    Math.max(0,Math.min(right,b.right)-Math.max(left,b.left))*Math.max(0,Math.min(bottom,b.bottom)-Math.max(top,b.top));
  const candidates=positions.map(p=>{
    const left=clamp(p.left,margin,width-labelWidth-margin);
    const top=clamp(p.top,topInset,height-labelHeight-bottomInset);
    const endX=clamp(x,left,left+labelWidth),endY=clamp(y,top,top+labelHeight);
    const coversTarget=x>=left-12&&x<=left+labelWidth+12&&y>=top-12&&y<=top+labelHeight+12;
    const dx=left+labelWidth/2-centerX,dy=top+labelHeight/2-centerY;
    const inward=(dx*(x-centerX)+dy*(y-centerY))<0;
    const score=overlap(left,top,left+labelWidth,top+labelHeight)*10
      +(coversTarget?1e7:0)+Math.hypot(x-endX,y-endY)
      +Math.hypot(left-p.left,top-p.top)*.3+(inward?60:0);
    return {...p,left,top,endX,endY,score};
  });
  candidates.sort((a,b)=>a.score-b.score);
  return candidates[0];
}
