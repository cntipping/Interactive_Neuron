import { test } from 'node:test';
import assert from 'node:assert/strict';
import { activePart, labelPosition } from '../lib/label-layout.ts';

test('hovering dendrites overrides a pinned nucleus and restores it when hover ends',()=>{
 assert.equal(activePart(null,2),2);
 assert.equal(activePart(0,2),0);
 assert.equal(activePart(null,2),2);
 assert.equal(activePart(null,null),null);
});
test('desktop labels move outward on both sides without leaving the viewport',()=>{
 const left=labelPosition(550,450,1600,1000,330,500);
 const right=labelPosition(1000,450,1600,1000,330,500);
 assert.ok(left.left+330<550);assert.ok(right.left>1000);
 for(const p of [left,right]){assert.ok(p.top>=86);assert.ok(p.top+500<=910);}
});
test('narrow-screen and corner targets keep labels inside usable bounds',()=>{
 for(const [x,y] of [[5,5],[380,790],[195,400]]){
  const p=labelPosition(x,y,390,800,330,440);
  assert.ok(p.left>=16);assert.ok(p.left+330<=374);assert.ok(p.top>=86);assert.ok(p.top+440<=710);
  assert.ok(p.endX>=p.left&&p.endX<=p.left+330);assert.ok(p.endY>=p.top&&p.endY<=p.top+440);
 }
});
