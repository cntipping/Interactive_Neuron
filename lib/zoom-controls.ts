import * as THREE from 'three';

export const DETAIL_ZOOM = {
  minimumDistance: 3.5, // Close enough to inspect spines and myelin without an extreme field of view.
  surfaceClearance: 0.65, // Keep the camera outside the first membrane on its zoom path.
  speed: 0.8,
};

/** Stop a zoom-in before it crosses a visible surface; shift the orbit target equally. */
export function guardZoomPath(previous:THREE.Vector3,position:THREE.Vector3,target:THREE.Vector3,objects:THREE.Object3D[]){
  const movement=position.clone().sub(previous);
  const length=movement.length();
  if(length<1e-8)return;
  const ray=new THREE.Raycaster(previous,movement.normalize(),0,length+DETAIL_ZOOM.surfaceClearance);
  const hit=ray.intersectObjects(objects,false)[0];
  if(!hit)return;
  const allowed=Math.max(0,hit.distance-DETAIL_ZOOM.surfaceClearance);
  if(allowed>=length)return;
  const corrected=previous.clone().addScaledVector(movement,allowed);
  const correction=corrected.sub(position);
  position.add(correction);
  target.add(correction);
}
