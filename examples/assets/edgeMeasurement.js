import{a as c}from"./web-ifc-api-BXZoUgQp.js";import{S as i}from"./stats.min-GTpOrGrX.js";import{p as l,C as f,O as m,S as p,H as w,u as h,h as u,x as g}from"./index-Bt57B43I.js";import"./_commonjsHelpers-Cpj98o6Y.js";const r=document.getElementById("container"),t=new l,y=t.get(f),e=y.create();e.scene=new m(t);e.renderer=new p(t,r);e.camera=new w(t);t.init();e.camera.controls.setLookAt(5,5,5,0,0,0);e.scene.setup();const b=t.get(h);b.create(e);e.scene.three.background=null;const S=new u(t),k=await fetch("https://thatopen.github.io/engine_components/resources/small.frag"),x=await k.arrayBuffer(),A=new Uint8Array(x),d=S.load(A);e.scene.three.add(d);for(const o of d.children)o instanceof c&&e.meshes.add(o);const n=t.get(g);n.world=e;n.enabled=!0;r.ondblclick=()=>n.create();let a;window.addEventListener("keydown",o=>{o.code==="KeyO"?n.delete():o.code==="KeyS"?(a=n.get(),n.deleteAll()):o.code==="KeyL"&&a&&n.set(a)});const s=new i;s.showPanel(2);document.body.append(s.dom);s.dom.style.left="0px";s.dom.style.zIndex="unset";e.renderer.onBeforeUpdate.add(()=>s.begin());e.renderer.onAfterUpdate.add(()=>s.end());
