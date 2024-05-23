var _=Object.defineProperty;var w=(u,c,e)=>c in u?_(u,c,{enumerable:!0,configurable:!0,writable:!0,value:e}):u[c]=e;var l=(u,c,e)=>(w(u,typeof c!="symbol"?c+"":c,e),e);import{V as f,c as L,e as K,M as E}from"./web-ifc-api-BC8YMRiS.js";import{J as S,U as F}from"./index-BmA4XTIx.js";import{M as g}from"./mark--YNYmWZ2.js";const d=class d extends S{constructor(e){super(e);l(this,"onDisposed",new F);l(this,"enabled",!0);l(this,"threshold",50);l(this,"autoCluster",!0);l(this,"list",new Map);l(this,"_worldEvents",new Map);l(this,"clusterLabels",new Set);l(this,"currentKeys",new Set);l(this,"_color","white");l(this,"_markerKey",0);l(this,"_clusterKey",0);l(this,"_setupWorlds",new Set);e.add(d.uuid,this)}get color(){return this._color}set color(e){this._color=e;for(const[t,r]of this.list)for(const[s,n]of r)n.label.three.element.style.color=e}create(e,t,r,s=!1){this.setupEvents(e,!0);const n=this._markerKey.toString(),o=this.getWorldMarkerList(e);if(o.has(n))return;const i=document.createElement("span");i.innerHTML=t,i.style.color=this._color;const a=new g(e,i);return a.three.position.copy(r),o.set(n,{key:n,label:a,merged:!1,static:s}),this._markerKey++,n}delete(e){for(const[t,r]of this.list){const s=r.get(e);s&&s.label.dispose(),r.delete(e)}}getWorldMarkerList(e){return this.list.has(e.uuid)||this.list.set(e.uuid,new Map),this.list.get(e.uuid)}dispose(e){for(const[t,r]of this.list){const s=[...r.keys()];for(const n of s){const o=r.get(n);e&&o.type!==e||(o.label.dispose(),r.delete(n))}}if(!e){this.list.clear(),this._markerKey=0;for(const t of this.clusterLabels)t.label.dispose();this.clusterLabels.clear(),this._clusterKey=0,this.currentKeys.clear()}this.onDisposed.trigger()}setupEvents(e,t){if(t&&this._setupWorlds.has(e.uuid)||!e.camera.hasCameraControls())return;const r=this.getWorldEvent(e);e.camera.controls.removeEventListener("sleep",r),e.camera.controls.removeEventListener("rest",r),t&&(e.camera.controls.addEventListener("sleep",r),e.camera.controls.addEventListener("rest",r))}getWorldEvent(e){if(!this._worldEvents.has(e.uuid)){const t=()=>{this.cluster(e)};this._worldEvents.set(e.uuid,t)}return this._worldEvents.get(e.uuid)}resetMarkers(){for(const[e,t]of this.list)for(const[r,s]of t)s.merged=!1;for(const e of this.clusterLabels)e.label.dispose();this.clusterLabels.clear(),this._clusterKey=0}removeMergeMarkers(e){const t=this.list.get(e.uuid);if(t){for(const[r,s]of t)s.merged?s.label.dispose():s.label.world.scene.three.add(s.label.three);for(const r of this.clusterLabels)if(r.markerKeys.length===1){for(const[s,n]of this.list){const o=n.get(r.markerKeys[0]);if(!o)continue;o.label.world.scene.three.add(o.label.three),o.merged=!1}r.label.dispose(),this.clusterLabels.delete(r)}}}cluster(e){if(!this.autoCluster)return;this.resetMarkers();const t=this.list.get(e.uuid);if(t){for(const[r,s]of t)if(!s.merged&&!s.static){this.currentKeys.clear();for(const[n,o]of t)o.static||s.key!==o.key&&!o.merged&&this.distance(s.label,o.label)<this.threshold&&(this.currentKeys.add(o.key),o.merged=!0);if(this.currentKeys.size>0){this.currentKeys.add(s.key),s.merged=!0;const n=Array.from(this.currentKeys),o=this.getAveragePositionFromLabels(n),i=new g(s.label.world,this.createClusterElement(this._clusterKey.toString())),{element:a}=i.three;a.textContent=n.length.toString(),i.three.position.copy(o),this.clusterLabels.add({key:this._clusterKey.toString(),markerKeys:n,label:i}),this._clusterKey++}}this.removeMergeMarkers(e)}}getAveragePositionFromLabels(e){const t=e.map(r=>{for(const[s,n]of this.list){const o=n.get(r);if(o)return o.label.three.position}return new f});return t.reduce((r,s)=>r.add(s),new f).divideScalar(t.length)}createClusterElement(e){const t=document.createElement("div");return t.textContent=e,t.style.color="#000000",t.style.background="#FFFFFF",t.style.fontSize="1.2rem",t.style.fontWeight="500",t.style.pointerEvents="auto",t.style.borderRadius="50%",t.style.padding="5px 11px",t.style.textAlign="center",t.style.cursor="pointer",t.addEventListener("pointerdown",()=>{this.navigateToCluster(e)}),t.addEventListener("pointerover",()=>{t.style.background="#BCF124"}),t.addEventListener("pointerout",()=>{t.style.background="#FFFFFF"}),t}getScreenPosition(e){const t=new f;if(!e.world.renderer)throw new Error("Renderer not found!");const r=e.three.position.clone();r.project(e.world.camera.three);const s=e.world.renderer.getSize();return t.x=r.x*s.x/2+s.x/2,t.y=-(r.y*s.y/2)+s.y/2,t}distance(e,t){const r=this.getScreenPosition(e),s=this.getScreenPosition(t),n=r.x-s.x,o=r.y-s.y,i=Math.sqrt(n*n+o*o)*.5;return i===0?this.threshold+1:i}navigateToCluster(e){const t=[],r=Array.from(this.clusterLabels).find(h=>h.key===e);if(!r)return;const s=r.label.world.camera;if(!s.hasCameraControls()){console.warn("Zoom to clusters only supported with Camera Controls!");return}for(const h of r.markerKeys)for(const[x,p]of this.list){const m=p.get(h);if(m){const{x:k,y:b,z:v}=m.label.three.position;t.push(k,b,v)}}r.label.dispose(),this.clusterLabels.delete(r);const n=new L,o=new Float32Array(t),i=new K(o,3);n.setAttribute("position",i);const a=new E(n);a.geometry.computeBoundingSphere(),a.geometry.boundingSphere&&s.controls.fitToSphere(a,!0),n.dispose(),a.clear(),t.length=0}};l(d,"uuid","4079eb91-79b0-4ede-bcf2-15b837129236");let y=d;export{y as M};
