import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { DETAIL_ZOOM, guardZoomPath } from '../lib/zoom-controls.ts';

test('close-up zoom stops outside a membrane and preserves viewing direction',()=>{
 const mesh=new THREE.Mesh(new THREE.PlaneGeometry(10,10),new THREE.MeshBasicMaterial());mesh.position.z=1;mesh.updateMatrixWorld();
 const previous=new THREE.Vector3(0,0,5),position=new THREE.Vector3(0,0,.1),target=new THREE.Vector3(0,0,-2);
 const direction=target.clone().sub(position);
 guardZoomPath(previous,position,target,[mesh]);
 assert.ok(Math.abs(position.z-(1+DETAIL_ZOOM.surfaceClearance))<1e-5);
 assert.ok(target.clone().sub(position).distanceTo(direction)<1e-8);
 mesh.geometry.dispose();mesh.material.dispose();
});
test('zoom in clear space proceeds unchanged',()=>{
 const position=new THREE.Vector3(3,0,2),target=new THREE.Vector3(3,0,0);
 guardZoomPath(new THREE.Vector3(3,0,5),position,target,[]);
 assert.deepEqual(position.toArray(),[3,0,2]);assert.deepEqual(target.toArray(),[3,0,0]);
});
test('already at the clearance boundary cannot zoom through the surface',()=>{
 const mesh=new THREE.Mesh(new THREE.PlaneGeometry(10,10),new THREE.MeshBasicMaterial());mesh.position.z=1;mesh.updateMatrixWorld();
 const previous=new THREE.Vector3(0,0,1+DETAIL_ZOOM.surfaceClearance),position=new THREE.Vector3(0,0,1.2),target=new THREE.Vector3();
 guardZoomPath(previous,position,target,[mesh]);assert.ok(position.distanceTo(previous)<1e-5);
 mesh.geometry.dispose();mesh.material.dispose();
});
