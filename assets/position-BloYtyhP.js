import{i as f,c as d,P as g,Q as b,R as h,S as x,x as R}from"./NavBar.vue_vue_type_script_setup_true_lang-RALJZWwy.js";/**
 * Anime.js - timeline - ESM
 * @version v4.4.1
 * @license MIT
 * @copyright 2026 - Julian Garnier
 */const S=(r,e)=>{if(b(e,"<")){const s=e[1]==="<",t=r._tail,a=t?t._offset+t._delay:0;return s?a:a+t.duration}},N=(r,e)=>{let s=r.iterationDuration;if(s===R&&(s=0),f(e))return s;if(d(+e))return+e;const t=e,a=r?r.labels:null,n=!x(a),l=S(r,t),c=!f(l),i=h.exec(t);if(i){const u=i[0],o=t.split(u),p=n&&o[0]?a[o[0]]:s,O=c?l:n?p:s,v=+o[1];return g(O,v,u[0])}else return c?l:n?f(a[t])?s:a[t]:s};export{N as p};
