import{b as w,L as S,C as A}from"./web-ifc-api-x9swcCj5.js";import{p as L,C as x,s as F,n as B,d as P,u as D,T as M,A as T}from"./index-D_egKO7i.js";import{x as U,S as G,a as O,p as W}from"./index-QRK9uGds.js";import{p as $,J as u,m}from"./index-K5IA6oiZ.js";import{S as R}from"./stats.min-BpIepu9J.js";const _=document.getElementById("container"),n=new L,j=n.get(x),e=j.create();e.scene=new F(n);e.renderer=new U(n,_);e.camera=new B(n);e.camera._aaaaa="heyyyy";e.renderer.postproduction.enabled=!0;e.renderer.postproduction.customEffects.outlineEnabled=!0;n.init();e.camera.controls.setLookAt(12,6,8,0,0,-10);e.scene.setup();const y=n.get(P);y.config.color.setHex(6710886);const k=y.create(e);k.three.position.y-=1;e.renderer.postproduction.customEffects.excludedMeshes.push(k.three);e.scene.three.background=null;const f=n.get(D),v=await fetch("https://thatopen.github.io/engine_components/resources/small.frag"),J=await v.arrayBuffer(),N=new Uint8Array(J),s=f.load(N);e.scene.three.add(s);const q=await fetch("https://thatopen.github.io/engine_components/resources/small.json"),z=await q.json();s.setLocalProperties(z);const c=new R;c.showPanel(2);document.body.append(c.dom);c.dom.style.left="0px";c.dom.style.zIndex="unset";e.renderer.onBeforeUpdate.add(()=>c.begin());e.renderer.onAfterUpdate.add(()=>c.end());const i=n.get(G);i.world=e;await i.generate(s);const l=n.get(O);l.setup({world:e});const H=n.get(M),g=H.create(e);for(const t of s.items)g.add(t.mesh);g.needsUpdate=!0;e.camera.controls.addEventListener("sleep",()=>{g.needsUpdate=!0});const r=n.get(T),a=n.get(W);r.byModel(s.uuid,s);r.byEntity(s);const C=r.find({models:[s.uuid]}),h=r.find({entities:["IFCWALLSTANDARDCASE","IFCWALL"]}),b=r.find({entities:["IFCDOOR","IFCWINDOW","IFCPLATE","IFCMEMBER"]}),V=new w({color:"gray",side:2}),K=new S({color:"black"}),Q=new w({color:"black",opacity:.5,side:2,transparent:!0});a.styles.create("thick",new Set,e,K,V,Q);for(const t in h){const o=f.list.get(t);if(!o)continue;const{mesh:d}=o;a.styles.list.thick.fragments[t]=new Set(h[t]),a.styles.list.thick.meshes.add(d)}a.styles.create("thin",new Set,e);for(const t in b){const o=f.list.get(t);if(!o)continue;const{mesh:d}=o;a.styles.list.thin.fragments[t]=new Set(b[t]),a.styles.list.thin.meshes.add(d)}await a.update(!0);$.init();const E=u.create(()=>m`
  <bim-panel active label="Plans Tutorial" class="options-menu">
      <bim-panel-section collapsed name="floorPlans" label="Plan list">
      </bim-panel-section>
    </bim-panel>
    `);document.body.append(E);const X=e.renderer.postproduction.customEffects.minGloss,p=new A("white"),I=E.querySelector("bim-panel-section[name='floorPlans']");for(const t of i.list){const o=u.create(()=>m`
      <bim-button checked label="${t.name}"
        @click="${()=>{e.renderer.postproduction.customEffects.minGloss=.1,l.backupColor=p,r.setColor(C,p),e.scene.three.background=p,i.goTo(t.id)}}">
      </bim-button>
    `);I.append(o)}const Y=e.scene.three.background,Z=u.create(()=>m`
      <bim-button checked label="Exit"
        @click="${()=>{l.backupColor=null,l.clear(),e.renderer.postproduction.customEffects.minGloss=X,r.resetColor(C),e.scene.three.background=Y,i.exitPlanView()}}">
      </bim-button>
    `);I.append(Z);
