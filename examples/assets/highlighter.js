import{b as s}from"./web-ifc-api-BXZoUgQp.js";import{p as c,C as d,O as l,S as i,H as p,u as m,h as u,F as h,U as g}from"./index-Bt57B43I.js";import{S as f}from"./stats.min-GTpOrGrX.js";import"./_commonjsHelpers-Cpj98o6Y.js";const w=document.getElementById("container"),t=new c,b=t.get(d),e=b.create();e.scene=new l(t);e.renderer=new i(t,w);e.camera=new p(t);t.init();e.renderer.postproduction.enabled=!0;e.camera.controls.setLookAt(12,6,8,0,0,-10);e.scene.setup();const x=t.get(m),y=x.create(e);e.renderer.postproduction.customEffects.excludedMeshes.push(y.three);e.scene.three.background=null;const S=new u(t),U=await fetch("https://thatopen.github.io/engine_components/resources/small.frag"),B=await U.arrayBuffer(),A=new Uint8Array(B),C=S.load(A);e.scene.three.add(C);const r=t.get(h);r.setup({world:e});r.zoomToSelection=!0;const n=t.get(g);n.world=e;n.enabled=!0;n.create("example",new s({color:12382500,transparent:!0,opacity:.5}));r.events.select.onHighlight.add(a=>{n.clear("example"),n.add("example",a)});r.events.select.onClear.add(()=>{n.clear("example")});const o=new f;o.showPanel(2);document.body.append(o.dom);o.dom.style.left="0px";o.dom.style.zIndex="unset";e.renderer.onBeforeUpdate.add(()=>o.begin());e.renderer.onAfterUpdate.add(()=>o.end());
