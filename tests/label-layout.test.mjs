import { test } from 'node:test';
import assert from 'node:assert/strict';
import { activePart, labelPosition, popupScale, initialCameraDistance, INITIAL_MODEL_SCREEN_FRACTION } from '../lib/label-layout.ts';

test('hovering dendrites overrides a pinned nucleus and restores it when hover ends',()=>{
 assert.equal(activePart(null,2),2);
 assert.equal(activePart(0,2),0);
 assert.equal(activePart(null,2),2);
 assert.equal(activePart(null,null),null);
});
test('labels can choose all four cardinal directions around the model',()=>{
 const bounds={left:500,top:500,right:1100,bottom:700};
 for(const [x,y,direction] of [[500,600,'left'],[1100,600,'right'],[800,500,'above'],[800,700,'below']]){
  const p=labelPosition(x,y,1600,1400,300,380,bounds);
  assert.equal(p.direction,direction);
  assert.ok(p.left>=16&&p.left+300<=1584);
  assert.ok(p.top>=86&&p.top+380<=1310);
 }
});
test('initial framing uses the same screen fraction across portrait and landscape',()=>{
 for(const aspect of [.4,1,1.8]){
  const distance=initialCameraDistance(8,38,aspect);
  const projectedRadius=Math.tan(Math.asin(8/distance))/Math.tan(38*Math.PI/360)/Math.min(1,aspect);
  assert.ok(Math.abs(projectedRadius-INITIAL_MODEL_SCREEN_FRACTION)<1e-10);
 }
 assert.ok(initialCameraDistance(8,38,.4)>initialCameraDistance(8,38,1.8));
});
test('narrow-screen and corner targets keep labels inside usable bounds',()=>{
 for(const [x,y] of [[5,5],[380,790],[195,400]]){
  const p=labelPosition(x,y,390,800,330,440);
  assert.ok(p.left>=16);assert.ok(p.left+330<=374);assert.ok(p.top>=86);assert.ok(p.top+440<=710);
  assert.ok(p.endX>=p.left&&p.endX<=p.left+330);assert.ok(p.endY>=p.top&&p.endY<=p.top+440);
 }
});

test('popup shrinks with zoom and returns to its original size on zoom-out',()=>{
 assert.equal(popupScale(30,30),1);
 assert.ok(popupScale(20,30)<1);
 assert.ok(popupScale(10,30)<popupScale(20,30));
 assert.equal(popupScale(0,30),.75);
 assert.equal(popupScale(60,30),1);
});
