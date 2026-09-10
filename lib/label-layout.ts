export function activePart(hovered:number|null,pinned:number|null){return hovered ?? pinned;}
/** Keep labels outward from the viewport center and inside the usable HUD area. */
export function labelPosition(x:number,y:number,width:number,height:number,labelWidth:number,labelHeight:number){
 const margin=16,top=86,bottom=90;
 const clamp=(v:number,min:number,max:number)=>Math.max(min,Math.min(v,Math.max(min,max)));
 const narrow=width<760;
 let left=narrow?(width-labelWidth)/2:x<width/2?x-labelWidth-55:x+55;
 let yTop=narrow?(y<height/2?y+65:y-labelHeight-65):y-labelHeight*.38;
 left=clamp(left,margin,width-labelWidth-margin);
 yTop=clamp(yTop,top,height-labelHeight-bottom);
 return {left,top:yTop,endX:clamp(x,left,left+labelWidth),endY:clamp(y,yTop,yTop+labelHeight)};
}
