import"./web-ifc-api-C62xsSvk.js";import{S as b}from"./stats.min-BpIepu9J.js";import{p as w,J as f,m as u}from"./index-K5IA6oiZ.js";import{p as y,C as g,i as h,n as B,k,u as F,a as L,c as S,W as U}from"./index-CTnQ5y92.js";const v=document.getElementById("container"),s=new y,x=s.get(g),n=x.create();n.scene=new h(s);n.renderer=new B(s,v);n.camera=new k(s);s.init();n.camera.controls.setLookAt(12,6,8,0,0,-10);n.scene.setup();const I=s.get(F);I.create(n);n.scene.three.background=null;const R=new L(s),A=await fetch("https://thatopen.github.io/engine_components/resources/small.frag"),P=await A.arrayBuffer(),j=new Uint8Array(P),C=R.load(j);n.scene.three.add(C);function J(e,o){const t=new File([o],e),a=document.createElement("a"),m=URL.createObjectURL(t);a.href=m,a.download=t.name,a.click(),URL.revokeObjectURL(m)}async function O(e){for(const{name:o,bits:t}of e)J(o,t),await new Promise(a=>{setTimeout(a,100)})}const r=s.get(S);r.settings.wasm={path:"https://unpkg.com/web-ifc@0.0.53/",absolute:!0};const c={types:{},ids:{},indexesFile:"small.ifc-processed-properties-indexes"};let l=0;const d=[];r.onPropertiesStreamed.add(async e=>{c.types[e.type]||(c.types[e.type]=[]),c.types[e.type].push(l);for(const a in e.data)c.ids[a]=l;const o=`small.ifc-processed-properties-${l}`,t=new Blob([JSON.stringify(e.data)]);d.push({bits:t,name:o}),l++});r.onProgress.add(async e=>{console.log(e)});r.onIndicesStreamed.add(async e=>{d.push({name:"small.ifc-processed-properties.json",bits:new Blob([JSON.stringify(c)])});const t=s.get(U).serializeRelations(e);d.push({name:"small.ifc-processed-properties-indexes",bits:new Blob([t])}),await O(d)});async function $(){const o=await(await fetch("https://thatopen.github.io/engine_components/resources/small.ifc")).arrayBuffer(),t=new Uint8Array(o);await r.streamFromBuffer(t)}const i=new b;i.showPanel(2);document.body.append(i.dom);i.dom.style.left="0px";i.dom.style.zIndex="unset";n.renderer.onBeforeUpdate.add(()=>i.begin());n.renderer.onAfterUpdate.add(()=>i.end());w.init();const p=f.create(()=>u`
  <bim-panel active label="Property Tiles Tutorial" class="options-menu">
   <bim-panel-section collapsed label="Controls">
      
      <bim-panel-section style="padding-top: 12px;">
      
        <bim-button label="Load IFC"
          @click="${()=>{$()}}">
        </bim-button>  
      
      </bim-panel-section>
      
    </bim-panel>
  `);document.body.append(p);const z=f.create(()=>u`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{p.classList.contains("options-menu-visible")?p.classList.remove("options-menu-visible"):p.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(z);
