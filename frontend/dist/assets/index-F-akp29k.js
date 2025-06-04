import{r as c}from"./index-TKWuuJjr.js";let I={data:""},O=e=>typeof window=="object"?((e?e.querySelector("#_goober"):window._goober)||Object.assign((e||document.head).appendChild(document.createElement("style")),{innerHTML:" ",id:"_goober"})).firstChild:e||I,S=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,C=/\/\*[^]*?\*\/|  +/g,z=/\n+/g,g=(e,t)=>{let a="",o="",i="";for(let r in e){let s=e[r];r[0]=="@"?r[1]=="i"?a=r+" "+s+";":o+=r[1]=="f"?g(s,r):r+"{"+g(s,r[1]=="k"?"":t)+"}":typeof s=="object"?o+=g(s,t?t.replace(/([^,])+/g,n=>r.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,l=>/&/.test(l)?l.replace(/&/g,n):n?n+" "+l:l)):r):s!=null&&(r=/^--/.test(r)?r:r.replace(/[A-Z]/g,"-$&").toLowerCase(),i+=g.p?g.p(r,s):r+":"+s+";")}return a+(t&&i?t+"{"+i+"}":i)+o},f={},A=e=>{if(typeof e=="object"){let t="";for(let a in e)t+=a+A(e[a]);return t}return e},D=(e,t,a,o,i)=>{let r=A(e),s=f[r]||(f[r]=(l=>{let d=0,u=11;for(;d<l.length;)u=101*u+l.charCodeAt(d++)>>>0;return"go"+u})(r));if(!f[s]){let l=r!==e?e:(d=>{let u,b,h=[{}];for(;u=S.exec(d.replace(C,""));)u[4]?h.shift():u[3]?(b=u[3].replace(z," ").trim(),h.unshift(h[0][b]=h[0][b]||{})):h[0][u[1]]=u[2].replace(z," ").trim();return h[0]})(e);f[s]=g(i?{["@keyframes "+s]:l}:l,a?"":"."+s)}let n=a&&f.g?f.g:null;return a&&(f.g=f[s]),((l,d,u,b)=>{b?d.data=d.data.replace(b,l):d.data.indexOf(l)===-1&&(d.data=u?l+d.data:d.data+l)})(f[s],t,o,n),s},_=(e,t,a)=>e.reduce((o,i,r)=>{let s=t[r];if(s&&s.call){let n=s(a),l=n&&n.props&&n.props.className||/^go/.test(n)&&n;s=l?"."+l:n&&typeof n=="object"?n.props?"":g(n,""):n===!1?"":n}return o+i+(s??"")},"");function w(e){let t=this||{},a=e.call?e(t.p):e;return D(a.unshift?a.raw?_(a,[].slice.call(arguments,1),t.p):a.reduce((o,i)=>Object.assign(o,i&&i.call?i(t.p):i),{}):a,O(t.target),t.g,t.o,t.k)}let F,$,k;w.bind({g:1});let m=w.bind({k:1});function M(e,t,a,o){g.p=t,F=e,$=a,k=o}function y(e,t){let a=this||{};return function(){let o=arguments;function i(r,s){let n=Object.assign({},r),l=n.className||i.className;a.p=Object.assign({theme:$&&$()},n),a.o=/ *go\d+/.test(l),n.className=w.apply(a,o)+(l?" "+l:"");let d=e;return e[0]&&(d=n.as||e,delete n.as),k&&d[0]&&k(n),F(d,n)}return i}}var P=e=>typeof e=="function",E=(e,t)=>P(e)?e(t):e,T=(()=>{let e=0;return()=>(++e).toString()})(),L=(()=>{let e;return()=>{if(e===void 0&&typeof window<"u"){let t=matchMedia("(prefers-reduced-motion: reduce)");e=!t||t.matches}return e}})(),q=20,N=(e,t)=>{switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,q)};case 1:return{...e,toasts:e.toasts.map(r=>r.id===t.toast.id?{...r,...t.toast}:r)};case 2:let{toast:a}=t;return N(e,{type:e.toasts.find(r=>r.id===a.id)?1:0,toast:a});case 3:let{toastId:o}=t;return{...e,toasts:e.toasts.map(r=>r.id===o||o===void 0?{...r,dismissed:!0,visible:!1}:r)};case 4:return t.toastId===void 0?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(r=>r.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let i=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(r=>({...r,pauseDuration:r.pauseDuration+i}))}}},H=[],v={toasts:[],pausedAt:void 0},j=e=>{v=N(v,e),H.forEach(t=>{t(v)})},J=(e,t="blank",a)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...a,id:(a==null?void 0:a.id)||T()}),x=e=>(t,a)=>{let o=J(t,e,a);return j({type:2,toast:o}),o.id},p=(e,t)=>x("blank")(e,t);p.error=x("error");p.success=x("success");p.loading=x("loading");p.custom=x("custom");p.dismiss=e=>{j({type:3,toastId:e})};p.remove=e=>j({type:4,toastId:e});p.promise=(e,t,a)=>{let o=p.loading(t.loading,{...a,...a==null?void 0:a.loading});return typeof e=="function"&&(e=e()),e.then(i=>{let r=t.success?E(t.success,i):void 0;return r?p.success(r,{id:o,...a,...a==null?void 0:a.success}):p.dismiss(o),i}).catch(i=>{let r=t.error?E(t.error,i):void 0;r?p.error(r,{id:o,...a,...a==null?void 0:a.error}):p.dismiss(o)}),e};var U=m`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,V=m`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,W=m`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,Y=y("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${U} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${V} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${e=>e.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${W} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,Z=m`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,B=y("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${Z} 1s linear infinite;
`,G=m`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,K=m`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,Q=y("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${G} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${K} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${e=>e.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,R=y("div")`
  position: absolute;
`,X=y("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,ee=m`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,te=y("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${ee} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,ae=({toast:e})=>{let{icon:t,type:a,iconTheme:o}=e;return t!==void 0?typeof t=="string"?c.createElement(te,null,t):t:a==="blank"?null:c.createElement(X,null,c.createElement(B,{...o}),a!=="loading"&&c.createElement(R,null,a==="error"?c.createElement(Y,{...o}):c.createElement(Q,{...o})))},re=e=>`
0% {transform: translate3d(0,${e*-200}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,oe=e=>`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${e*-150}%,-1px) scale(.6); opacity:0;}
`,ie="0%{opacity:0;} 100%{opacity:1;}",se="0%{opacity:1;} 100%{opacity:0;}",ne=y("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,le=y("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,de=(e,t)=>{let a=e.includes("top")?1:-1,[o,i]=L()?[ie,se]:[re(a),oe(a)];return{animation:t?`${m(o)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${m(i)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}};c.memo(({toast:e,position:t,style:a,children:o})=>{let i=e.height?de(e.position||t||"top-center",e.visible):{opacity:0},r=c.createElement(ae,{toast:e}),s=c.createElement(le,{...e.ariaProps},E(e.message,e));return c.createElement(ne,{className:e.className,style:{...i,...a,...e.style}},typeof o=="function"?o({icon:r,message:s}):c.createElement(c.Fragment,null,r,s))});M(c.createElement);w`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`;var pe=p;export{p as c,pe as k};
