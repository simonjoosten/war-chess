(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function t(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerPolicy&&(s.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?s.credentials="include":i.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function n(i){if(i.ep)return;i.ep=!0;const s=t(i);fetch(i.href,s)}})();const n$=()=>{};var dh={};const hp=function(r){const e=[];let t=0;for(let n=0;n<r.length;n++){let i=r.charCodeAt(n);i<128?e[t++]=i:i<2048?(e[t++]=i>>6|192,e[t++]=i&63|128):(i&64512)===55296&&n+1<r.length&&(r.charCodeAt(n+1)&64512)===56320?(i=65536+((i&1023)<<10)+(r.charCodeAt(++n)&1023),e[t++]=i>>18|240,e[t++]=i>>12&63|128,e[t++]=i>>6&63|128,e[t++]=i&63|128):(e[t++]=i>>12|224,e[t++]=i>>6&63|128,e[t++]=i&63|128)}return e},i$=function(r){const e=[];let t=0,n=0;for(;t<r.length;){const i=r[t++];if(i<128)e[n++]=String.fromCharCode(i);else if(i>191&&i<224){const s=r[t++];e[n++]=String.fromCharCode((i&31)<<6|s&63)}else if(i>239&&i<365){const s=r[t++],o=r[t++],c=r[t++],l=((i&7)<<18|(s&63)<<12|(o&63)<<6|c&63)-65536;e[n++]=String.fromCharCode(55296+(l>>10)),e[n++]=String.fromCharCode(56320+(l&1023))}else{const s=r[t++],o=r[t++];e[n++]=String.fromCharCode((i&15)<<12|(s&63)<<6|o&63)}}return e.join("")},fp={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(r,e){if(!Array.isArray(r))throw Error("encodeByteArray takes an array as a parameter");this.init_();const t=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,n=[];for(let i=0;i<r.length;i+=3){const s=r[i],o=i+1<r.length,c=o?r[i+1]:0,l=i+2<r.length,u=l?r[i+2]:0,f=s>>2,d=(s&3)<<4|c>>4;let h=(c&15)<<2|u>>6,p=u&63;l||(p=64,o||(h=64)),n.push(t[f],t[d],t[h],t[p])}return n.join("")},encodeString(r,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(r):this.encodeByteArray(hp(r),e)},decodeString(r,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(r):i$(this.decodeStringToByteArray(r,e))},decodeStringToByteArray(r,e){this.init_();const t=e?this.charToByteMapWebSafe_:this.charToByteMap_,n=[];for(let i=0;i<r.length;){const s=t[r.charAt(i++)],c=i<r.length?t[r.charAt(i)]:0;++i;const u=i<r.length?t[r.charAt(i)]:64;++i;const d=i<r.length?t[r.charAt(i)]:64;if(++i,s==null||c==null||u==null||d==null)throw new s$;const h=s<<2|c>>4;if(n.push(h),u!==64){const p=c<<4&240|u>>2;if(n.push(p),d!==64){const g=u<<6&192|d;n.push(g)}}}return n},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let r=0;r<this.ENCODED_VALS.length;r++)this.byteToCharMap_[r]=this.ENCODED_VALS.charAt(r),this.charToByteMap_[this.byteToCharMap_[r]]=r,this.byteToCharMapWebSafe_[r]=this.ENCODED_VALS_WEBSAFE.charAt(r),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[r]]=r,r>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(r)]=r,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(r)]=r)}}};class s$ extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const o$=function(r){const e=hp(r);return fp.encodeByteArray(e,!0)},Ia=function(r){return o$(r).replace(/\./g,"")},pp=function(r){try{return fp.decodeString(r,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};function a$(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}const l$=()=>a$().__FIREBASE_DEFAULTS__,c$=()=>{if(typeof process>"u"||typeof dh>"u")return;const r=dh.__FIREBASE_DEFAULTS__;if(r)return JSON.parse(r)},u$=()=>{if(typeof document>"u")return;let r;try{r=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=r&&pp(r[1]);return e&&JSON.parse(e)},Za=()=>{try{return n$()||l$()||c$()||u$()}catch(r){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${r}`);return}},mp=r=>Za()?.emulatorHosts?.[r],d$=r=>{const e=mp(r);if(!e)return;const t=e.lastIndexOf(":");if(t<=0||t+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const n=parseInt(e.substring(t+1),10);return e[0]==="["?[e.substring(1,t-1),n]:[e.substring(0,t),n]},gp=()=>Za()?.config,$p=r=>Za()?.[`_${r}`];class h${constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,n)=>{t?this.reject(t):this.resolve(n),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(t):e(t,n))}}}function hs(r){try{return(r.startsWith("http://")||r.startsWith("https://")?new URL(r).hostname:r).endsWith(".cloudworkstations.dev")}catch{return!1}}async function yp(r){return(await fetch(r,{credentials:"include"})).ok}function f$(r,e){if(r.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const t={alg:"none",type:"JWT"},n=e||"demo-project",i=r.iat||0,s=r.sub||r.user_id;if(!s)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const o={iss:`https://securetoken.google.com/${n}`,aud:n,iat:i,exp:i+3600,auth_time:i,sub:s,user_id:s,firebase:{sign_in_provider:"custom",identities:{}},...r};return[Ia(JSON.stringify(t)),Ia(JSON.stringify(o)),""].join(".")}const Ys={};function p$(){const r={prod:[],emulator:[]};for(const e of Object.keys(Ys))Ys[e]?r.emulator.push(e):r.prod.push(e);return r}function m$(r){let e=document.getElementById(r),t=!1;return e||(e=document.createElement("div"),e.setAttribute("id",r),t=!0),{created:t,element:e}}let hh=!1;function wp(r,e){if(typeof window>"u"||typeof document>"u"||!hs(window.location.host)||Ys[r]===e||Ys[r]||hh)return;Ys[r]=e;function t(h){return`__firebase__banner__${h}`}const n="__firebase__banner",s=p$().prod.length>0;function o(){const h=document.getElementById(n);h&&h.remove()}function c(h){h.style.display="flex",h.style.background="#7faaf0",h.style.position="fixed",h.style.bottom="5px",h.style.left="5px",h.style.padding=".5em",h.style.borderRadius="5px",h.style.alignItems="center"}function l(h,p){h.setAttribute("width","24"),h.setAttribute("id",p),h.setAttribute("height","24"),h.setAttribute("viewBox","0 0 24 24"),h.setAttribute("fill","none"),h.style.marginLeft="-6px"}function u(){const h=document.createElement("span");return h.style.cursor="pointer",h.style.marginLeft="16px",h.style.fontSize="24px",h.innerHTML=" &times;",h.onclick=()=>{hh=!0,o()},h}function f(h,p){h.setAttribute("id",p),h.innerText="Learn more",h.href="https://firebase.google.com/docs/studio/preview-apps#preview-backend",h.setAttribute("target","__blank"),h.style.paddingLeft="5px",h.style.textDecoration="underline"}function d(){const h=m$(n),p=t("text"),g=document.getElementById(p)||document.createElement("span"),w=t("learnmore"),b=document.getElementById(w)||document.createElement("a"),P=t("preprendIcon"),z=document.getElementById(P)||document.createElementNS("http://www.w3.org/2000/svg","svg");if(h.created){const G=h.element;c(G),f(b,w);const j=u();l(z,P),G.append(z,g,b,j),document.body.appendChild(G)}s?(g.innerText="Preview backend disconnected.",z.innerHTML=`<g clip-path="url(#clip0_6013_33858)">
<path d="M4.8 17.6L12 5.6L19.2 17.6H4.8ZM6.91667 16.4H17.0833L12 7.93333L6.91667 16.4ZM12 15.6C12.1667 15.6 12.3056 15.5444 12.4167 15.4333C12.5389 15.3111 12.6 15.1667 12.6 15C12.6 14.8333 12.5389 14.6944 12.4167 14.5833C12.3056 14.4611 12.1667 14.4 12 14.4C11.8333 14.4 11.6889 14.4611 11.5667 14.5833C11.4556 14.6944 11.4 14.8333 11.4 15C11.4 15.1667 11.4556 15.3111 11.5667 15.4333C11.6889 15.5444 11.8333 15.6 12 15.6ZM11.4 13.6H12.6V10.4H11.4V13.6Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6013_33858">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`):(z.innerHTML=`<g clip-path="url(#clip0_6083_34804)">
<path d="M11.4 15.2H12.6V11.2H11.4V15.2ZM12 10C12.1667 10 12.3056 9.94444 12.4167 9.83333C12.5389 9.71111 12.6 9.56667 12.6 9.4C12.6 9.23333 12.5389 9.09444 12.4167 8.98333C12.3056 8.86111 12.1667 8.8 12 8.8C11.8333 8.8 11.6889 8.86111 11.5667 8.98333C11.4556 9.09444 11.4 9.23333 11.4 9.4C11.4 9.56667 11.4556 9.71111 11.5667 9.83333C11.6889 9.94444 11.8333 10 12 10ZM12 18.4C11.1222 18.4 10.2944 18.2333 9.51667 17.9C8.73889 17.5667 8.05556 17.1111 7.46667 16.5333C6.88889 15.9444 6.43333 15.2611 6.1 14.4833C5.76667 13.7056 5.6 12.8778 5.6 12C5.6 11.1111 5.76667 10.2833 6.1 9.51667C6.43333 8.73889 6.88889 8.06111 7.46667 7.48333C8.05556 6.89444 8.73889 6.43333 9.51667 6.1C10.2944 5.76667 11.1222 5.6 12 5.6C12.8889 5.6 13.7167 5.76667 14.4833 6.1C15.2611 6.43333 15.9389 6.89444 16.5167 7.48333C17.1056 8.06111 17.5667 8.73889 17.9 9.51667C18.2333 10.2833 18.4 11.1111 18.4 12C18.4 12.8778 18.2333 13.7056 17.9 14.4833C17.5667 15.2611 17.1056 15.9444 16.5167 16.5333C15.9389 17.1111 15.2611 17.5667 14.4833 17.9C13.7167 18.2333 12.8889 18.4 12 18.4ZM12 17.2C13.4444 17.2 14.6722 16.6944 15.6833 15.6833C16.6944 14.6722 17.2 13.4444 17.2 12C17.2 10.5556 16.6944 9.32778 15.6833 8.31667C14.6722 7.30555 13.4444 6.8 12 6.8C10.5556 6.8 9.32778 7.30555 8.31667 8.31667C7.30556 9.32778 6.8 10.5556 6.8 12C6.8 13.4444 7.30556 14.6722 8.31667 15.6833C9.32778 16.6944 10.5556 17.2 12 17.2Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6083_34804">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`,g.innerText="Preview backend running in this workspace."),g.setAttribute("id",p)}document.readyState==="loading"?window.addEventListener("DOMContentLoaded",d):d()}function Ct(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function g$(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(Ct())}function $$(){const r=Za()?.forceEnvironment;if(r==="node")return!0;if(r==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function y$(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function w$(){const r=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof r=="object"&&r.id!==void 0}function b$(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function v$(){const r=Ct();return r.indexOf("MSIE ")>=0||r.indexOf("Trident/")>=0}function k$(){return!$$()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function T$(){try{return typeof indexedDB=="object"}catch{return!1}}function x$(){return new Promise((r,e)=>{try{let t=!0;const n="validate-browser-context-for-indexeddb-analytics-module",i=self.indexedDB.open(n);i.onsuccess=()=>{i.result.close(),t||self.indexedDB.deleteDatabase(n),r(!0)},i.onupgradeneeded=()=>{t=!1},i.onerror=()=>{e(i.error?.message||"")}}catch(t){e(t)}})}const _$="FirebaseError";class Zr extends Error{constructor(e,t,n){super(t),this.code=e,this.customData=n,this.name=_$,Object.setPrototypeOf(this,Zr.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,ko.prototype.create)}}class ko{constructor(e,t,n){this.service=e,this.serviceName=t,this.errors=n}create(e,...t){const n=t[0]||{},i=`${this.service}/${e}`,s=this.errors[e],o=s?E$(s,n):"Error",c=`${this.serviceName}: ${o} (${i}).`;return new Zr(i,c,n)}}function E$(r,e){return r.replace(A$,(t,n)=>{const i=e[n];return i!=null?String(i):`<${n}?>`})}const A$=/\{\$([^}]+)}/g;function I$(r){for(const e in r)if(Object.prototype.hasOwnProperty.call(r,e))return!1;return!0}function En(r,e){if(r===e)return!0;const t=Object.keys(r),n=Object.keys(e);for(const i of t){if(!n.includes(i))return!1;const s=r[i],o=e[i];if(fh(s)&&fh(o)){if(!En(s,o))return!1}else if(s!==o)return!1}for(const i of n)if(!t.includes(i))return!1;return!0}function fh(r){return r!==null&&typeof r=="object"}function To(r){const e=[];for(const[t,n]of Object.entries(r))Array.isArray(n)?n.forEach(i=>{e.push(encodeURIComponent(t)+"="+encodeURIComponent(i))}):e.push(encodeURIComponent(t)+"="+encodeURIComponent(n));return e.length?"&"+e.join("&"):""}function qs(r){const e={};return r.replace(/^\?/,"").split("&").forEach(n=>{if(n){const[i,s]=n.split("=");e[decodeURIComponent(i)]=decodeURIComponent(s)}}),e}function Gs(r){const e=r.indexOf("?");if(!e)return"";const t=r.indexOf("#",e);return r.substring(e,t>0?t:void 0)}function C$(r,e){const t=new S$(r,e);return t.subscribe.bind(t)}class S${constructor(e,t){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then(()=>{e(this)}).catch(n=>{this.error(n)})}next(e){this.forEachObserver(t=>{t.next(e)})}error(e){this.forEachObserver(t=>{t.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,t,n){let i;if(e===void 0&&t===void 0&&n===void 0)throw new Error("Missing Observer.");R$(e,["next","error","complete"])?i=e:i={next:e,error:t,complete:n},i.next===void 0&&(i.next=Ql),i.error===void 0&&(i.error=Ql),i.complete===void 0&&(i.complete=Ql);const s=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?i.error(this.finalError):i.complete()}catch{}}),this.observers.push(i),s}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let t=0;t<this.observers.length;t++)this.sendOne(t,e)}sendOne(e,t){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{t(this.observers[e])}catch(n){typeof console<"u"&&console.error&&console.error(n)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function R$(r,e){if(typeof r!="object"||r===null)return!1;for(const t of e)if(t in r&&typeof r[t]=="function")return!0;return!1}function Ql(){}function gt(r){return r&&r._delegate?r._delegate:r}class si{constructor(e,t,n){this.name=e,this.instanceFactory=t,this.type=n,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}const jn="[DEFAULT]";class P${constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){const n=new h$;if(this.instancesDeferred.set(t,n),this.isInitialized(t)||this.shouldAutoInitialize())try{const i=this.getOrInitializeService({instanceIdentifier:t});i&&n.resolve(i)}catch{}}return this.instancesDeferred.get(t).promise}getImmediate(e){const t=this.normalizeInstanceIdentifier(e?.identifier),n=e?.optional??!1;if(this.isInitialized(t)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:t})}catch(i){if(n)return null;throw i}else{if(n)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(M$(e))try{this.getOrInitializeService({instanceIdentifier:jn})}catch{}for(const[t,n]of this.instancesDeferred.entries()){const i=this.normalizeInstanceIdentifier(t);try{const s=this.getOrInitializeService({instanceIdentifier:i});n.resolve(s)}catch{}}}}clearInstance(e=jn){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(t=>"INTERNAL"in t).map(t=>t.INTERNAL.delete()),...e.filter(t=>"_delete"in t).map(t=>t._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=jn){return this.instances.has(e)}getOptions(e=jn){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:t={}}=e,n=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(n))throw Error(`${this.name}(${n}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const i=this.getOrInitializeService({instanceIdentifier:n,options:t});for(const[s,o]of this.instancesDeferred.entries()){const c=this.normalizeInstanceIdentifier(s);n===c&&o.resolve(i)}return i}onInit(e,t){const n=this.normalizeInstanceIdentifier(t),i=this.onInitCallbacks.get(n)??new Set;i.add(e),this.onInitCallbacks.set(n,i);const s=this.instances.get(n);return s&&e(s,n),()=>{i.delete(e)}}invokeOnInitCallbacks(e,t){const n=this.onInitCallbacks.get(t);if(n)for(const i of n)try{i(e,t)}catch{}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let n=this.instances.get(e);if(!n&&this.component&&(n=this.component.instanceFactory(this.container,{instanceIdentifier:L$(e),options:t}),this.instances.set(e,n),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(n,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,n)}catch{}return n||null}normalizeInstanceIdentifier(e=jn){return this.component?this.component.multipleInstances?e:jn:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function L$(r){return r===jn?void 0:r}function M$(r){return r.instantiationMode==="EAGER"}class V${constructor(e){this.name=e,this.providers=new Map}addComponent(e){const t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const t=new P$(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}}var ve;(function(r){r[r.DEBUG=0]="DEBUG",r[r.VERBOSE=1]="VERBOSE",r[r.INFO=2]="INFO",r[r.WARN=3]="WARN",r[r.ERROR=4]="ERROR",r[r.SILENT=5]="SILENT"})(ve||(ve={}));const D$={debug:ve.DEBUG,verbose:ve.VERBOSE,info:ve.INFO,warn:ve.WARN,error:ve.ERROR,silent:ve.SILENT},N$=ve.INFO,B$={[ve.DEBUG]:"log",[ve.VERBOSE]:"log",[ve.INFO]:"info",[ve.WARN]:"warn",[ve.ERROR]:"error"},O$=(r,e,...t)=>{if(e<r.logLevel)return;const n=new Date().toISOString(),i=B$[e];if(i)console[i](`[${n}]  ${r.name}:`,...t);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class nu{constructor(e){this.name=e,this._logLevel=N$,this._logHandler=O$,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in ve))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?D$[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,ve.DEBUG,...e),this._logHandler(this,ve.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,ve.VERBOSE,...e),this._logHandler(this,ve.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,ve.INFO,...e),this._logHandler(this,ve.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,ve.WARN,...e),this._logHandler(this,ve.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,ve.ERROR,...e),this._logHandler(this,ve.ERROR,...e)}}const F$=(r,e)=>e.some(t=>r instanceof t);let ph,mh;function z$(){return ph||(ph=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function q$(){return mh||(mh=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const bp=new WeakMap,vc=new WeakMap,vp=new WeakMap,Kl=new WeakMap,iu=new WeakMap;function G$(r){const e=new Promise((t,n)=>{const i=()=>{r.removeEventListener("success",s),r.removeEventListener("error",o)},s=()=>{t(bn(r.result)),i()},o=()=>{n(r.error),i()};r.addEventListener("success",s),r.addEventListener("error",o)});return e.then(t=>{t instanceof IDBCursor&&bp.set(t,r)}).catch(()=>{}),iu.set(e,r),e}function U$(r){if(vc.has(r))return;const e=new Promise((t,n)=>{const i=()=>{r.removeEventListener("complete",s),r.removeEventListener("error",o),r.removeEventListener("abort",o)},s=()=>{t(),i()},o=()=>{n(r.error||new DOMException("AbortError","AbortError")),i()};r.addEventListener("complete",s),r.addEventListener("error",o),r.addEventListener("abort",o)});vc.set(r,e)}let kc={get(r,e,t){if(r instanceof IDBTransaction){if(e==="done")return vc.get(r);if(e==="objectStoreNames")return r.objectStoreNames||vp.get(r);if(e==="store")return t.objectStoreNames[1]?void 0:t.objectStore(t.objectStoreNames[0])}return bn(r[e])},set(r,e,t){return r[e]=t,!0},has(r,e){return r instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in r}};function H$(r){kc=r(kc)}function j$(r){return r===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...t){const n=r.call(Yl(this),e,...t);return vp.set(n,e.sort?e.sort():[e]),bn(n)}:q$().includes(r)?function(...e){return r.apply(Yl(this),e),bn(bp.get(this))}:function(...e){return bn(r.apply(Yl(this),e))}}function W$(r){return typeof r=="function"?j$(r):(r instanceof IDBTransaction&&U$(r),F$(r,z$())?new Proxy(r,kc):r)}function bn(r){if(r instanceof IDBRequest)return G$(r);if(Kl.has(r))return Kl.get(r);const e=W$(r);return e!==r&&(Kl.set(r,e),iu.set(e,r)),e}const Yl=r=>iu.get(r);function Q$(r,e,{blocked:t,upgrade:n,blocking:i,terminated:s}={}){const o=indexedDB.open(r,e),c=bn(o);return n&&o.addEventListener("upgradeneeded",l=>{n(bn(o.result),l.oldVersion,l.newVersion,bn(o.transaction),l)}),t&&o.addEventListener("blocked",l=>t(l.oldVersion,l.newVersion,l)),c.then(l=>{s&&l.addEventListener("close",()=>s()),i&&l.addEventListener("versionchange",u=>i(u.oldVersion,u.newVersion,u))}).catch(()=>{}),c}const K$=["get","getKey","getAll","getAllKeys","count"],Y$=["put","add","delete","clear"],Zl=new Map;function gh(r,e){if(!(r instanceof IDBDatabase&&!(e in r)&&typeof e=="string"))return;if(Zl.get(e))return Zl.get(e);const t=e.replace(/FromIndex$/,""),n=e!==t,i=Y$.includes(t);if(!(t in(n?IDBIndex:IDBObjectStore).prototype)||!(i||K$.includes(t)))return;const s=async function(o,...c){const l=this.transaction(o,i?"readwrite":"readonly");let u=l.store;return n&&(u=u.index(c.shift())),(await Promise.all([u[t](...c),i&&l.done]))[0]};return Zl.set(e,s),s}H$(r=>({...r,get:(e,t,n)=>gh(e,t)||r.get(e,t,n),has:(e,t)=>!!gh(e,t)||r.has(e,t)}));class Z${constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(t=>{if(J$(t)){const n=t.getImmediate();return`${n.library}/${n.version}`}else return null}).filter(t=>t).join(" ")}}function J$(r){return r.getComponent()?.type==="VERSION"}const Tc="@firebase/app",$h="0.14.9";const Ur=new nu("@firebase/app"),X$="@firebase/app-compat",ey="@firebase/analytics-compat",ty="@firebase/analytics",ry="@firebase/app-check-compat",ny="@firebase/app-check",iy="@firebase/auth",sy="@firebase/auth-compat",oy="@firebase/database",ay="@firebase/data-connect",ly="@firebase/database-compat",cy="@firebase/functions",uy="@firebase/functions-compat",dy="@firebase/installations",hy="@firebase/installations-compat",fy="@firebase/messaging",py="@firebase/messaging-compat",my="@firebase/performance",gy="@firebase/performance-compat",$y="@firebase/remote-config",yy="@firebase/remote-config-compat",wy="@firebase/storage",by="@firebase/storage-compat",vy="@firebase/firestore",ky="@firebase/ai",Ty="@firebase/firestore-compat",xy="firebase",_y="12.10.0";const xc="[DEFAULT]",Ey={[Tc]:"fire-core",[X$]:"fire-core-compat",[ty]:"fire-analytics",[ey]:"fire-analytics-compat",[ny]:"fire-app-check",[ry]:"fire-app-check-compat",[iy]:"fire-auth",[sy]:"fire-auth-compat",[oy]:"fire-rtdb",[ay]:"fire-data-connect",[ly]:"fire-rtdb-compat",[cy]:"fire-fn",[uy]:"fire-fn-compat",[dy]:"fire-iid",[hy]:"fire-iid-compat",[fy]:"fire-fcm",[py]:"fire-fcm-compat",[my]:"fire-perf",[gy]:"fire-perf-compat",[$y]:"fire-rc",[yy]:"fire-rc-compat",[wy]:"fire-gcs",[by]:"fire-gcs-compat",[vy]:"fire-fst",[Ty]:"fire-fst-compat",[ky]:"fire-vertex","fire-js":"fire-js",[xy]:"fire-js-all"};const Ca=new Map,Ay=new Map,_c=new Map;function yh(r,e){try{r.container.addComponent(e)}catch(t){Ur.debug(`Component ${e.name} failed to register with FirebaseApp ${r.name}`,t)}}function Ji(r){const e=r.name;if(_c.has(e))return Ur.debug(`There were multiple attempts to register component ${e}.`),!1;_c.set(e,r);for(const t of Ca.values())yh(t,r);for(const t of Ay.values())yh(t,r);return!0}function su(r,e){const t=r.container.getProvider("heartbeat").getImmediate({optional:!0});return t&&t.triggerHeartbeat(),r.container.getProvider(e)}function Qt(r){return r==null?!1:r.settings!==void 0}const Iy={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},vn=new ko("app","Firebase",Iy);class Cy{constructor(e,t,n){this._isDeleted=!1,this._options={...e},this._config={...t},this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=n,this.container.addComponent(new si("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw vn.create("app-deleted",{appName:this._name})}}const fs=_y;function kp(r,e={}){let t=r;typeof e!="object"&&(e={name:e});const n={name:xc,automaticDataCollectionEnabled:!0,...e},i=n.name;if(typeof i!="string"||!i)throw vn.create("bad-app-name",{appName:String(i)});if(t||(t=gp()),!t)throw vn.create("no-options");const s=Ca.get(i);if(s){if(En(t,s.options)&&En(n,s.config))return s;throw vn.create("duplicate-app",{appName:i})}const o=new V$(i);for(const l of _c.values())o.addComponent(l);const c=new Cy(t,n,o);return Ca.set(i,c),c}function Tp(r=xc){const e=Ca.get(r);if(!e&&r===xc&&gp())return kp();if(!e)throw vn.create("no-app",{appName:r});return e}function kn(r,e,t){let n=Ey[r]??r;t&&(n+=`-${t}`);const i=n.match(/\s|\//),s=e.match(/\s|\//);if(i||s){const o=[`Unable to register library "${n}" with version "${e}":`];i&&o.push(`library name "${n}" contains illegal characters (whitespace or "/")`),i&&s&&o.push("and"),s&&o.push(`version name "${e}" contains illegal characters (whitespace or "/")`),Ur.warn(o.join(" "));return}Ji(new si(`${n}-version`,()=>({library:n,version:e}),"VERSION"))}const Sy="firebase-heartbeat-database",Ry=1,io="firebase-heartbeat-store";let Jl=null;function xp(){return Jl||(Jl=Q$(Sy,Ry,{upgrade:(r,e)=>{switch(e){case 0:try{r.createObjectStore(io)}catch(t){console.warn(t)}}}}).catch(r=>{throw vn.create("idb-open",{originalErrorMessage:r.message})})),Jl}async function Py(r){try{const t=(await xp()).transaction(io),n=await t.objectStore(io).get(_p(r));return await t.done,n}catch(e){if(e instanceof Zr)Ur.warn(e.message);else{const t=vn.create("idb-get",{originalErrorMessage:e?.message});Ur.warn(t.message)}}}async function wh(r,e){try{const n=(await xp()).transaction(io,"readwrite");await n.objectStore(io).put(e,_p(r)),await n.done}catch(t){if(t instanceof Zr)Ur.warn(t.message);else{const n=vn.create("idb-set",{originalErrorMessage:t?.message});Ur.warn(n.message)}}}function _p(r){return`${r.name}!${r.options.appId}`}const Ly=1024,My=30;class Vy{constructor(e){this.container=e,this._heartbeatsCache=null;const t=this.container.getProvider("app").getImmediate();this._storage=new Ny(t),this._heartbeatsCachePromise=this._storage.read().then(n=>(this._heartbeatsCache=n,n))}async triggerHeartbeat(){try{const t=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),n=bh();if(this._heartbeatsCache?.heartbeats==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,this._heartbeatsCache?.heartbeats==null)||this._heartbeatsCache.lastSentHeartbeatDate===n||this._heartbeatsCache.heartbeats.some(i=>i.date===n))return;if(this._heartbeatsCache.heartbeats.push({date:n,agent:t}),this._heartbeatsCache.heartbeats.length>My){const i=By(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(i,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(e){Ur.warn(e)}}async getHeartbeatsHeader(){try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,this._heartbeatsCache?.heartbeats==null||this._heartbeatsCache.heartbeats.length===0)return"";const e=bh(),{heartbeatsToSend:t,unsentEntries:n}=Dy(this._heartbeatsCache.heartbeats),i=Ia(JSON.stringify({version:2,heartbeats:t}));return this._heartbeatsCache.lastSentHeartbeatDate=e,n.length>0?(this._heartbeatsCache.heartbeats=n,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),i}catch(e){return Ur.warn(e),""}}}function bh(){return new Date().toISOString().substring(0,10)}function Dy(r,e=Ly){const t=[];let n=r.slice();for(const i of r){const s=t.find(o=>o.agent===i.agent);if(s){if(s.dates.push(i.date),vh(t)>e){s.dates.pop();break}}else if(t.push({agent:i.agent,dates:[i.date]}),vh(t)>e){t.pop();break}n=n.slice(1)}return{heartbeatsToSend:t,unsentEntries:n}}class Ny{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return T$()?x$().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const t=await Py(this.app);return t?.heartbeats?t:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){if(await this._canUseIndexedDBPromise){const n=await this.read();return wh(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??n.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){if(await this._canUseIndexedDBPromise){const n=await this.read();return wh(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??n.lastSentHeartbeatDate,heartbeats:[...n.heartbeats,...e.heartbeats]})}else return}}function vh(r){return Ia(JSON.stringify({version:2,heartbeats:r})).length}function By(r){if(r.length===0)return-1;let e=0,t=r[0].date;for(let n=1;n<r.length;n++)r[n].date<t&&(t=r[n].date,e=n);return e}function Oy(r){Ji(new si("platform-logger",e=>new Z$(e),"PRIVATE")),Ji(new si("heartbeat",e=>new Vy(e),"PRIVATE")),kn(Tc,$h,r),kn(Tc,$h,"esm2020"),kn("fire-js","")}Oy("");var Fy="firebase",zy="12.10.0";kn(Fy,zy,"app");function Ep(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const qy=Ep,Ap=new ko("auth","Firebase",Ep());const Sa=new nu("@firebase/auth");function Gy(r,...e){Sa.logLevel<=ve.WARN&&Sa.warn(`Auth (${fs}): ${r}`,...e)}function da(r,...e){Sa.logLevel<=ve.ERROR&&Sa.error(`Auth (${fs}): ${r}`,...e)}function cr(r,...e){throw ou(r,...e)}function kr(r,...e){return ou(r,...e)}function Ip(r,e,t){const n={...qy(),[e]:t};return new ko("auth","Firebase",n).create(e,{appName:r.name})}function Fr(r){return Ip(r,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function ou(r,...e){if(typeof r!="string"){const t=e[0],n=[...e.slice(1)];return n[0]&&(n[0].appName=r.name),r._errorFactory.create(t,...n)}return Ap.create(r,...e)}function de(r,e,...t){if(!r)throw ou(e,...t)}function Nr(r){const e="INTERNAL ASSERTION FAILED: "+r;throw da(e),new Error(e)}function Hr(r,e){r||Nr(e)}function Ec(){return typeof self<"u"&&self.location?.href||""}function Uy(){return kh()==="http:"||kh()==="https:"}function kh(){return typeof self<"u"&&self.location?.protocol||null}function Hy(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(Uy()||w$()||"connection"in navigator)?navigator.onLine:!0}function jy(){if(typeof navigator>"u")return null;const r=navigator;return r.languages&&r.languages[0]||r.language||null}class xo{constructor(e,t){this.shortDelay=e,this.longDelay=t,Hr(t>e,"Short delay should be less than long delay!"),this.isMobile=g$()||b$()}get(){return Hy()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}function au(r,e){Hr(r.emulator,"Emulator should always be set here");const{url:t}=r.emulator;return e?`${t}${e.startsWith("/")?e.slice(1):e}`:t}class Cp{static initialize(e,t,n){this.fetchImpl=e,t&&(this.headersImpl=t),n&&(this.responseImpl=n)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;Nr("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;Nr("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;Nr("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}const Wy={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};const Qy=["/v1/accounts:signInWithCustomToken","/v1/accounts:signInWithEmailLink","/v1/accounts:signInWithIdp","/v1/accounts:signInWithPassword","/v1/accounts:signInWithPhoneNumber","/v1/token"],Ky=new xo(3e4,6e4);function Vn(r,e){return r.tenantId&&!e.tenantId?{...e,tenantId:r.tenantId}:e}async function Dn(r,e,t,n,i={}){return Sp(r,i,async()=>{let s={},o={};n&&(e==="GET"?o=n:s={body:JSON.stringify(n)});const c=To({key:r.config.apiKey,...o}).slice(1),l=await r._getAdditionalHeaders();l["Content-Type"]="application/json",r.languageCode&&(l["X-Firebase-Locale"]=r.languageCode);const u={method:e,headers:l,...s};return y$()||(u.referrerPolicy="no-referrer"),r.emulatorConfig&&hs(r.emulatorConfig.host)&&(u.credentials="include"),Cp.fetch()(await Rp(r,r.config.apiHost,t,c),u)})}async function Sp(r,e,t){r._canInitEmulator=!1;const n={...Wy,...e};try{const i=new Zy(r),s=await Promise.race([t(),i.promise]);i.clearNetworkTimeout();const o=await s.json();if("needConfirmation"in o)throw Zo(r,"account-exists-with-different-credential",o);if(s.ok&&!("errorMessage"in o))return o;{const c=s.ok?o.errorMessage:o.error.message,[l,u]=c.split(" : ");if(l==="FEDERATED_USER_ID_ALREADY_LINKED")throw Zo(r,"credential-already-in-use",o);if(l==="EMAIL_EXISTS")throw Zo(r,"email-already-in-use",o);if(l==="USER_DISABLED")throw Zo(r,"user-disabled",o);const f=n[l]||l.toLowerCase().replace(/[_\s]+/g,"-");if(u)throw Ip(r,f,u);cr(r,f)}}catch(i){if(i instanceof Zr)throw i;cr(r,"network-request-failed",{message:String(i)})}}async function _o(r,e,t,n,i={}){const s=await Dn(r,e,t,n,i);return"mfaPendingCredential"in s&&cr(r,"multi-factor-auth-required",{_serverResponse:s}),s}async function Rp(r,e,t,n){const i=`${e}${t}?${n}`,s=r,o=s.config.emulator?au(r.config,i):`${r.config.apiScheme}://${i}`;return Qy.includes(t)&&(await s._persistenceManagerAvailable,s._getPersistenceType()==="COOKIE")?s._getPersistence()._getFinalTarget(o).toString():o}function Yy(r){switch(r){case"ENFORCE":return"ENFORCE";case"AUDIT":return"AUDIT";case"OFF":return"OFF";default:return"ENFORCEMENT_STATE_UNSPECIFIED"}}class Zy{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((t,n)=>{this.timer=setTimeout(()=>n(kr(this.auth,"network-request-failed")),Ky.get())})}}function Zo(r,e,t){const n={appName:r.name};t.email&&(n.email=t.email),t.phoneNumber&&(n.phoneNumber=t.phoneNumber);const i=kr(r,e,n);return i.customData._tokenResponse=t,i}function Th(r){return r!==void 0&&r.enterprise!==void 0}class Jy{constructor(e){if(this.siteKey="",this.recaptchaEnforcementState=[],e.recaptchaKey===void 0)throw new Error("recaptchaKey undefined");this.siteKey=e.recaptchaKey.split("/")[3],this.recaptchaEnforcementState=e.recaptchaEnforcementState}getProviderEnforcementState(e){if(!this.recaptchaEnforcementState||this.recaptchaEnforcementState.length===0)return null;for(const t of this.recaptchaEnforcementState)if(t.provider&&t.provider===e)return Yy(t.enforcementState);return null}isProviderEnabled(e){return this.getProviderEnforcementState(e)==="ENFORCE"||this.getProviderEnforcementState(e)==="AUDIT"}isAnyProviderEnabled(){return this.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")||this.isProviderEnabled("PHONE_PROVIDER")}}async function Xy(r,e){return Dn(r,"GET","/v2/recaptchaConfig",Vn(r,e))}async function e1(r,e){return Dn(r,"POST","/v1/accounts:delete",e)}async function Ra(r,e){return Dn(r,"POST","/v1/accounts:lookup",e)}function Zs(r){if(r)try{const e=new Date(Number(r));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function t1(r,e=!1){const t=gt(r),n=await t.getIdToken(e),i=lu(n);de(i&&i.exp&&i.auth_time&&i.iat,t.auth,"internal-error");const s=typeof i.firebase=="object"?i.firebase:void 0,o=s?.sign_in_provider;return{claims:i,token:n,authTime:Zs(Xl(i.auth_time)),issuedAtTime:Zs(Xl(i.iat)),expirationTime:Zs(Xl(i.exp)),signInProvider:o||null,signInSecondFactor:s?.sign_in_second_factor||null}}function Xl(r){return Number(r)*1e3}function lu(r){const[e,t,n]=r.split(".");if(e===void 0||t===void 0||n===void 0)return da("JWT malformed, contained fewer than 3 sections"),null;try{const i=pp(t);return i?JSON.parse(i):(da("Failed to decode base64 JWT payload"),null)}catch(i){return da("Caught error parsing JWT payload as JSON",i?.toString()),null}}function xh(r){const e=lu(r);return de(e,"internal-error"),de(typeof e.exp<"u","internal-error"),de(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}async function so(r,e,t=!1){if(t)return e;try{return await e}catch(n){throw n instanceof Zr&&r1(n)&&r.auth.currentUser===r&&await r.auth.signOut(),n}}function r1({code:r}){return r==="auth/user-disabled"||r==="auth/user-token-expired"}class n1{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){if(e){const t=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),t}else{this.errorBackoff=3e4;const n=(this.user.stsTokenManager.expirationTime??0)-Date.now()-3e5;return Math.max(0,n)}}schedule(e=!1){if(!this.isRunning)return;const t=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},t)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){e?.code==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}class Ac{constructor(e,t){this.createdAt=e,this.lastLoginAt=t,this._initializeTime()}_initializeTime(){this.lastSignInTime=Zs(this.lastLoginAt),this.creationTime=Zs(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}async function Pa(r){const e=r.auth,t=await r.getIdToken(),n=await so(r,Ra(e,{idToken:t}));de(n?.users.length,e,"internal-error");const i=n.users[0];r._notifyReloadListener(i);const s=i.providerUserInfo?.length?Pp(i.providerUserInfo):[],o=s1(r.providerData,s),c=r.isAnonymous,l=!(r.email&&i.passwordHash)&&!o?.length,u=c?l:!1,f={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:o,metadata:new Ac(i.createdAt,i.lastLoginAt),isAnonymous:u};Object.assign(r,f)}async function i1(r){const e=gt(r);await Pa(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function s1(r,e){return[...r.filter(n=>!e.some(i=>i.providerId===n.providerId)),...e]}function Pp(r){return r.map(({providerId:e,...t})=>({providerId:e,uid:t.rawId||"",displayName:t.displayName||null,email:t.email||null,phoneNumber:t.phoneNumber||null,photoURL:t.photoUrl||null}))}async function o1(r,e){const t=await Sp(r,{},async()=>{const n=To({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:i,apiKey:s}=r.config,o=await Rp(r,i,"/v1/token",`key=${s}`),c=await r._getAdditionalHeaders();c["Content-Type"]="application/x-www-form-urlencoded";const l={method:"POST",headers:c,body:n};return r.emulatorConfig&&hs(r.emulatorConfig.host)&&(l.credentials="include"),Cp.fetch()(o,l)});return{accessToken:t.access_token,expiresIn:t.expires_in,refreshToken:t.refresh_token}}async function a1(r,e){return Dn(r,"POST","/v2/accounts:revokeToken",Vn(r,e))}class Bi{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){de(e.idToken,"internal-error"),de(typeof e.idToken<"u","internal-error"),de(typeof e.refreshToken<"u","internal-error");const t="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):xh(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,t)}updateFromIdToken(e){de(e.length!==0,"internal-error");const t=xh(e);this.updateTokensAndExpiration(e,null,t)}async getToken(e,t=!1){return!t&&this.accessToken&&!this.isExpired?this.accessToken:(de(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,t){const{accessToken:n,refreshToken:i,expiresIn:s}=await o1(e,t);this.updateTokensAndExpiration(n,i,Number(s))}updateTokensAndExpiration(e,t,n){this.refreshToken=t||null,this.accessToken=e||null,this.expirationTime=Date.now()+n*1e3}static fromJSON(e,t){const{refreshToken:n,accessToken:i,expirationTime:s}=t,o=new Bi;return n&&(de(typeof n=="string","internal-error",{appName:e}),o.refreshToken=n),i&&(de(typeof i=="string","internal-error",{appName:e}),o.accessToken=i),s&&(de(typeof s=="number","internal-error",{appName:e}),o.expirationTime=s),o}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new Bi,this.toJSON())}_performRefresh(){return Nr("not implemented")}}function sn(r,e){de(typeof r=="string"||typeof r>"u","internal-error",{appName:e})}class rr{constructor({uid:e,auth:t,stsTokenManager:n,...i}){this.providerId="firebase",this.proactiveRefresh=new n1(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=e,this.auth=t,this.stsTokenManager=n,this.accessToken=n.accessToken,this.displayName=i.displayName||null,this.email=i.email||null,this.emailVerified=i.emailVerified||!1,this.phoneNumber=i.phoneNumber||null,this.photoURL=i.photoURL||null,this.isAnonymous=i.isAnonymous||!1,this.tenantId=i.tenantId||null,this.providerData=i.providerData?[...i.providerData]:[],this.metadata=new Ac(i.createdAt||void 0,i.lastLoginAt||void 0)}async getIdToken(e){const t=await so(this,this.stsTokenManager.getToken(this.auth,e));return de(t,this.auth,"internal-error"),this.accessToken!==t&&(this.accessToken=t,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),t}getIdTokenResult(e){return t1(this,e)}reload(){return i1(this)}_assign(e){this!==e&&(de(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(t=>({...t})),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const t=new rr({...this,auth:e,stsTokenManager:this.stsTokenManager._clone()});return t.metadata._copy(this.metadata),t}_onReload(e){de(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,t=!1){let n=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),n=!0),t&&await Pa(this),await this.auth._persistUserIfCurrent(this),n&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(Qt(this.auth.app))return Promise.reject(Fr(this.auth));const e=await this.getIdToken();return await so(this,e1(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return{uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>({...e})),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId,...this.metadata.toJSON(),apiKey:this.auth.config.apiKey,appName:this.auth.name}}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,t){const n=t.displayName??void 0,i=t.email??void 0,s=t.phoneNumber??void 0,o=t.photoURL??void 0,c=t.tenantId??void 0,l=t._redirectEventId??void 0,u=t.createdAt??void 0,f=t.lastLoginAt??void 0,{uid:d,emailVerified:h,isAnonymous:p,providerData:g,stsTokenManager:w}=t;de(d&&w,e,"internal-error");const b=Bi.fromJSON(this.name,w);de(typeof d=="string",e,"internal-error"),sn(n,e.name),sn(i,e.name),de(typeof h=="boolean",e,"internal-error"),de(typeof p=="boolean",e,"internal-error"),sn(s,e.name),sn(o,e.name),sn(c,e.name),sn(l,e.name),sn(u,e.name),sn(f,e.name);const P=new rr({uid:d,auth:e,email:i,emailVerified:h,displayName:n,isAnonymous:p,photoURL:o,phoneNumber:s,tenantId:c,stsTokenManager:b,createdAt:u,lastLoginAt:f});return g&&Array.isArray(g)&&(P.providerData=g.map(z=>({...z}))),l&&(P._redirectEventId=l),P}static async _fromIdTokenResponse(e,t,n=!1){const i=new Bi;i.updateFromServerResponse(t);const s=new rr({uid:t.localId,auth:e,stsTokenManager:i,isAnonymous:n});return await Pa(s),s}static async _fromGetAccountInfoResponse(e,t,n){const i=t.users[0];de(i.localId!==void 0,"internal-error");const s=i.providerUserInfo!==void 0?Pp(i.providerUserInfo):[],o=!(i.email&&i.passwordHash)&&!s?.length,c=new Bi;c.updateFromIdToken(n);const l=new rr({uid:i.localId,auth:e,stsTokenManager:c,isAnonymous:o}),u={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:s,metadata:new Ac(i.createdAt,i.lastLoginAt),isAnonymous:!(i.email&&i.passwordHash)&&!s?.length};return Object.assign(l,u),l}}const _h=new Map;function Br(r){Hr(r instanceof Function,"Expected a class definition");let e=_h.get(r);return e?(Hr(e instanceof r,"Instance stored in cache mismatched with class"),e):(e=new r,_h.set(r,e),e)}class Lp{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,t){this.storage[e]=t}async _get(e){const t=this.storage[e];return t===void 0?null:t}async _remove(e){delete this.storage[e]}_addListener(e,t){}_removeListener(e,t){}}Lp.type="NONE";const Eh=Lp;function ha(r,e,t){return`firebase:${r}:${e}:${t}`}class Oi{constructor(e,t,n){this.persistence=e,this.auth=t,this.userKey=n;const{config:i,name:s}=this.auth;this.fullUserKey=ha(this.userKey,i.apiKey,s),this.fullPersistenceKey=ha("persistence",i.apiKey,s),this.boundEventHandler=t._onStorageEvent.bind(t),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);if(!e)return null;if(typeof e=="string"){const t=await Ra(this.auth,{idToken:e}).catch(()=>{});return t?rr._fromGetAccountInfoResponse(this.auth,t,e):null}return rr._fromJSON(this.auth,e)}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const t=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,t)return this.setCurrentUser(t)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,t,n="authUser"){if(!t.length)return new Oi(Br(Eh),e,n);const i=(await Promise.all(t.map(async u=>{if(await u._isAvailable())return u}))).filter(u=>u);let s=i[0]||Br(Eh);const o=ha(n,e.config.apiKey,e.name);let c=null;for(const u of t)try{const f=await u._get(o);if(f){let d;if(typeof f=="string"){const h=await Ra(e,{idToken:f}).catch(()=>{});if(!h)break;d=await rr._fromGetAccountInfoResponse(e,h,f)}else d=rr._fromJSON(e,f);u!==s&&(c=d),s=u;break}}catch{}const l=i.filter(u=>u._shouldAllowMigration);return!s._shouldAllowMigration||!l.length?new Oi(s,e,n):(s=l[0],c&&await s._set(o,c.toJSON()),await Promise.all(t.map(async u=>{if(u!==s)try{await u._remove(o)}catch{}})),new Oi(s,e,n))}}function Ah(r){const e=r.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(Np(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(Mp(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(Op(e))return"Blackberry";if(Fp(e))return"Webos";if(Vp(e))return"Safari";if((e.includes("chrome/")||Dp(e))&&!e.includes("edge/"))return"Chrome";if(Bp(e))return"Android";{const t=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,n=r.match(t);if(n?.length===2)return n[1]}return"Other"}function Mp(r=Ct()){return/firefox\//i.test(r)}function Vp(r=Ct()){const e=r.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function Dp(r=Ct()){return/crios\//i.test(r)}function Np(r=Ct()){return/iemobile/i.test(r)}function Bp(r=Ct()){return/android/i.test(r)}function Op(r=Ct()){return/blackberry/i.test(r)}function Fp(r=Ct()){return/webos/i.test(r)}function cu(r=Ct()){return/iphone|ipad|ipod/i.test(r)||/macintosh/i.test(r)&&/mobile/i.test(r)}function l1(r=Ct()){return cu(r)&&!!window.navigator?.standalone}function c1(){return v$()&&document.documentMode===10}function zp(r=Ct()){return cu(r)||Bp(r)||Fp(r)||Op(r)||/windows phone/i.test(r)||Np(r)}function qp(r,e=[]){let t;switch(r){case"Browser":t=Ah(Ct());break;case"Worker":t=`${Ah(Ct())}-${r}`;break;default:t=r}const n=e.length?e.join(","):"FirebaseCore-web";return`${t}/JsCore/${fs}/${n}`}class u1{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,t){const n=s=>new Promise((o,c)=>{try{const l=e(s);o(l)}catch(l){c(l)}});n.onAbort=t,this.queue.push(n);const i=this.queue.length-1;return()=>{this.queue[i]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const t=[];try{for(const n of this.queue)await n(e),n.onAbort&&t.push(n.onAbort)}catch(n){t.reverse();for(const i of t)try{i()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:n?.message})}}}async function d1(r,e={}){return Dn(r,"GET","/v2/passwordPolicy",Vn(r,e))}const h1=6;class f1{constructor(e){const t=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=t.minPasswordLength??h1,t.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=t.maxPasswordLength),t.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=t.containsLowercaseCharacter),t.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=t.containsUppercaseCharacter),t.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=t.containsNumericCharacter),t.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=t.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=e.allowedNonAlphanumericCharacters?.join("")??"",this.forceUpgradeOnSignin=e.forceUpgradeOnSignin??!1,this.schemaVersion=e.schemaVersion}validatePassword(e){const t={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,t),this.validatePasswordCharacterOptions(e,t),t.isValid&&(t.isValid=t.meetsMinPasswordLength??!0),t.isValid&&(t.isValid=t.meetsMaxPasswordLength??!0),t.isValid&&(t.isValid=t.containsLowercaseLetter??!0),t.isValid&&(t.isValid=t.containsUppercaseLetter??!0),t.isValid&&(t.isValid=t.containsNumericCharacter??!0),t.isValid&&(t.isValid=t.containsNonAlphanumericCharacter??!0),t}validatePasswordLengthOptions(e,t){const n=this.customStrengthOptions.minPasswordLength,i=this.customStrengthOptions.maxPasswordLength;n&&(t.meetsMinPasswordLength=e.length>=n),i&&(t.meetsMaxPasswordLength=e.length<=i)}validatePasswordCharacterOptions(e,t){this.updatePasswordCharacterOptionsStatuses(t,!1,!1,!1,!1);let n;for(let i=0;i<e.length;i++)n=e.charAt(i),this.updatePasswordCharacterOptionsStatuses(t,n>="a"&&n<="z",n>="A"&&n<="Z",n>="0"&&n<="9",this.allowedNonAlphanumericCharacters.includes(n))}updatePasswordCharacterOptionsStatuses(e,t,n,i,s){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=t)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=n)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=i)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=s))}}class p1{constructor(e,t,n,i){this.app=e,this.heartbeatServiceProvider=t,this.appCheckServiceProvider=n,this.config=i,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new Ih(this),this.idTokenSubscription=new Ih(this),this.beforeStateQueue=new u1(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=Ap,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this._resolvePersistenceManagerAvailable=void 0,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=i.sdkClientVersion,this._persistenceManagerAvailable=new Promise(s=>this._resolvePersistenceManagerAvailable=s)}_initializeWithPersistence(e,t){return t&&(this._popupRedirectResolver=Br(t)),this._initializationPromise=this.queue(async()=>{if(!this._deleted&&(this.persistenceManager=await Oi.create(this,e),this._resolvePersistenceManagerAvailable?.(),!this._deleted)){if(this._popupRedirectResolver?._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(t),this.lastNotifiedUid=this.currentUser?.uid||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const t=await Ra(this,{idToken:e}),n=await rr._fromGetAccountInfoResponse(this,t,e);await this.directlySetCurrentUser(n)}catch(t){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",t),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){if(Qt(this.app)){const s=this.app.settings.authIdToken;return s?new Promise(o=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(s).then(o,o))}):this.directlySetCurrentUser(null)}const t=await this.assertedPersistence.getCurrentUser();let n=t,i=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const s=this.redirectUser?._redirectEventId,o=n?._redirectEventId,c=await this.tryRedirectSignIn(e);(!s||s===o)&&c?.user&&(n=c.user,i=!0)}if(!n)return this.directlySetCurrentUser(null);if(!n._redirectEventId){if(i)try{await this.beforeStateQueue.runMiddleware(n)}catch(s){n=t,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(s))}return n?this.reloadAndSetCurrentUserOrClear(n):this.directlySetCurrentUser(null)}return de(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===n._redirectEventId?this.directlySetCurrentUser(n):this.reloadAndSetCurrentUserOrClear(n)}async tryRedirectSignIn(e){let t=null;try{t=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return t}async reloadAndSetCurrentUserOrClear(e){try{await Pa(e)}catch(t){if(t?.code!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=jy()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(Qt(this.app))return Promise.reject(Fr(this));const t=e?gt(e):null;return t&&de(t.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(t&&t._clone(this))}async _updateCurrentUser(e,t=!1){if(!this._deleted)return e&&de(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),t||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return Qt(this.app)?Promise.reject(Fr(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return Qt(this.app)?Promise.reject(Fr(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(Br(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const t=this._getPasswordPolicyInternal();return t.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):t.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await d1(this),t=new f1(e);this.tenantId===null?this._projectPasswordPolicy=t:this._tenantPasswordPolicies[this.tenantId]=t}_getPersistenceType(){return this.assertedPersistence.persistence.type}_getPersistence(){return this.assertedPersistence.persistence}_updateErrorMap(e){this._errorFactory=new ko("auth","Firebase",e())}onAuthStateChanged(e,t,n){return this.registerStateListener(this.authStateSubscription,e,t,n)}beforeAuthStateChanged(e,t){return this.beforeStateQueue.pushCallback(e,t)}onIdTokenChanged(e,t,n){return this.registerStateListener(this.idTokenSubscription,e,t,n)}authStateReady(){return new Promise((e,t)=>{if(this.currentUser)e();else{const n=this.onAuthStateChanged(()=>{n(),e()},t)}})}async revokeAccessToken(e){if(this.currentUser){const t=await this.currentUser.getIdToken(),n={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:t};this.tenantId!=null&&(n.tenantId=this.tenantId),await a1(this,n)}}toJSON(){return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:this._currentUser?.toJSON()}}async _setRedirectUser(e,t){const n=await this.getOrInitRedirectPersistenceManager(t);return e===null?n.removeCurrentUser():n.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const t=e&&Br(e)||this._popupRedirectResolver;de(t,this,"argument-error"),this.redirectPersistenceManager=await Oi.create(this,[Br(t._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){return this._isInitialized&&await this.queue(async()=>{}),this._currentUser?._redirectEventId===e?this._currentUser:this.redirectUser?._redirectEventId===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const e=this.currentUser?.uid??null;this.lastNotifiedUid!==e&&(this.lastNotifiedUid=e,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,t,n,i){if(this._deleted)return()=>{};const s=typeof t=="function"?t:t.next.bind(t);let o=!1;const c=this._isInitialized?Promise.resolve():this._initializationPromise;if(de(c,this,"internal-error"),c.then(()=>{o||s(this.currentUser)}),typeof t=="function"){const l=e.addObserver(t,n,i);return()=>{o=!0,l()}}else{const l=e.addObserver(t);return()=>{o=!0,l()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return de(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=qp(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){const e={"X-Client-Version":this.clientVersion};this.app.options.appId&&(e["X-Firebase-gmpid"]=this.app.options.appId);const t=await this.heartbeatServiceProvider.getImmediate({optional:!0})?.getHeartbeatsHeader();t&&(e["X-Firebase-Client"]=t);const n=await this._getAppCheckToken();return n&&(e["X-Firebase-AppCheck"]=n),e}async _getAppCheckToken(){if(Qt(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const e=await this.appCheckServiceProvider.getImmediate({optional:!0})?.getToken();return e?.error&&Gy(`Error while retrieving App Check token: ${e.error}`),e?.token}}function pi(r){return gt(r)}class Ih{constructor(e){this.auth=e,this.observer=null,this.addObserver=C$(t=>this.observer=t)}get next(){return de(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}let Ja={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function m1(r){Ja=r}function Gp(r){return Ja.loadJS(r)}function g1(){return Ja.recaptchaEnterpriseScript}function $1(){return Ja.gapiScript}function y1(r){return`__${r}${Math.floor(Math.random()*1e6)}`}class w1{constructor(){this.enterprise=new b1}ready(e){e()}execute(e,t){return Promise.resolve("token")}render(e,t){return""}}class b1{ready(e){e()}execute(e,t){return Promise.resolve("token")}render(e,t){return""}}const v1="recaptcha-enterprise",Up="NO_RECAPTCHA";class k1{constructor(e){this.type=v1,this.auth=pi(e)}async verify(e="verify",t=!1){async function n(s){if(!t){if(s.tenantId==null&&s._agentRecaptchaConfig!=null)return s._agentRecaptchaConfig.siteKey;if(s.tenantId!=null&&s._tenantRecaptchaConfigs[s.tenantId]!==void 0)return s._tenantRecaptchaConfigs[s.tenantId].siteKey}return new Promise(async(o,c)=>{Xy(s,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}).then(l=>{if(l.recaptchaKey===void 0)c(new Error("recaptcha Enterprise site key undefined"));else{const u=new Jy(l);return s.tenantId==null?s._agentRecaptchaConfig=u:s._tenantRecaptchaConfigs[s.tenantId]=u,o(u.siteKey)}}).catch(l=>{c(l)})})}function i(s,o,c){const l=window.grecaptcha;Th(l)?l.enterprise.ready(()=>{l.enterprise.execute(s,{action:e}).then(u=>{o(u)}).catch(()=>{o(Up)})}):c(Error("No reCAPTCHA enterprise script loaded."))}return this.auth.settings.appVerificationDisabledForTesting?new w1().execute("siteKey",{action:"verify"}):new Promise((s,o)=>{n(this.auth).then(c=>{if(!t&&Th(window.grecaptcha))i(c,s,o);else{if(typeof window>"u"){o(new Error("RecaptchaVerifier is only supported in browser"));return}let l=g1();l.length!==0&&(l+=c),Gp(l).then(()=>{i(c,s,o)}).catch(u=>{o(u)})}}).catch(c=>{o(c)})})}}async function Ch(r,e,t,n=!1,i=!1){const s=new k1(r);let o;if(i)o=Up;else try{o=await s.verify(t)}catch{o=await s.verify(t,!0)}const c={...e};if(t==="mfaSmsEnrollment"||t==="mfaSmsSignIn"){if("phoneEnrollmentInfo"in c){const l=c.phoneEnrollmentInfo.phoneNumber,u=c.phoneEnrollmentInfo.recaptchaToken;Object.assign(c,{phoneEnrollmentInfo:{phoneNumber:l,recaptchaToken:u,captchaResponse:o,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}else if("phoneSignInInfo"in c){const l=c.phoneSignInInfo.recaptchaToken;Object.assign(c,{phoneSignInInfo:{recaptchaToken:l,captchaResponse:o,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}return c}return n?Object.assign(c,{captchaResp:o}):Object.assign(c,{captchaResponse:o}),Object.assign(c,{clientType:"CLIENT_TYPE_WEB"}),Object.assign(c,{recaptchaVersion:"RECAPTCHA_ENTERPRISE"}),c}async function Ic(r,e,t,n,i){if(r._getRecaptchaConfig()?.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")){const s=await Ch(r,e,t,t==="getOobCode");return n(r,s)}else return n(r,e).catch(async s=>{if(s.code==="auth/missing-recaptcha-token"){console.log(`${t} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);const o=await Ch(r,e,t,t==="getOobCode");return n(r,o)}else return Promise.reject(s)})}function T1(r,e){const t=su(r,"auth");if(t.isInitialized()){const i=t.getImmediate(),s=t.getOptions();if(En(s,e??{}))return i;cr(i,"already-initialized")}return t.initialize({options:e})}function x1(r,e){const t=e?.persistence||[],n=(Array.isArray(t)?t:[t]).map(Br);e?.errorMap&&r._updateErrorMap(e.errorMap),r._initializeWithPersistence(n,e?.popupRedirectResolver)}function _1(r,e,t){const n=pi(r);de(/^https?:\/\//.test(e),n,"invalid-emulator-scheme");const i=!1,s=Hp(e),{host:o,port:c}=E1(e),l=c===null?"":`:${c}`,u={url:`${s}//${o}${l}/`},f=Object.freeze({host:o,port:c,protocol:s.replace(":",""),options:Object.freeze({disableWarnings:i})});if(!n._canInitEmulator){de(n.config.emulator&&n.emulatorConfig,n,"emulator-config-failed"),de(En(u,n.config.emulator)&&En(f,n.emulatorConfig),n,"emulator-config-failed");return}n.config.emulator=u,n.emulatorConfig=f,n.settings.appVerificationDisabledForTesting=!0,hs(o)?(yp(`${s}//${o}${l}`),wp("Auth",!0)):A1()}function Hp(r){const e=r.indexOf(":");return e<0?"":r.substr(0,e+1)}function E1(r){const e=Hp(r),t=/(\/\/)?([^?#/]+)/.exec(r.substr(e.length));if(!t)return{host:"",port:null};const n=t[2].split("@").pop()||"",i=/^(\[[^\]]+\])(:|$)/.exec(n);if(i){const s=i[1];return{host:s,port:Sh(n.substr(s.length+1))}}else{const[s,o]=n.split(":");return{host:s,port:Sh(o)}}}function Sh(r){if(!r)return null;const e=Number(r);return isNaN(e)?null:e}function A1(){function r(){const e=document.createElement("p"),t=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",t.position="fixed",t.width="100%",t.backgroundColor="#ffffff",t.border=".1em solid #000000",t.color="#b50000",t.bottom="0px",t.left="0px",t.margin="0px",t.zIndex="10000",t.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",r):r())}class uu{constructor(e,t){this.providerId=e,this.signInMethod=t}toJSON(){return Nr("not implemented")}_getIdTokenResponse(e){return Nr("not implemented")}_linkToIdToken(e,t){return Nr("not implemented")}_getReauthenticationResolver(e){return Nr("not implemented")}}async function I1(r,e){return Dn(r,"POST","/v1/accounts:signUp",e)}async function C1(r,e){return _o(r,"POST","/v1/accounts:signInWithPassword",Vn(r,e))}async function S1(r,e){return _o(r,"POST","/v1/accounts:signInWithEmailLink",Vn(r,e))}async function R1(r,e){return _o(r,"POST","/v1/accounts:signInWithEmailLink",Vn(r,e))}class oo extends uu{constructor(e,t,n,i=null){super("password",n),this._email=e,this._password=t,this._tenantId=i}static _fromEmailAndPassword(e,t){return new oo(e,t,"password")}static _fromEmailAndCode(e,t,n=null){return new oo(e,t,"emailLink",n)}toJSON(){return{email:this._email,password:this._password,signInMethod:this.signInMethod,tenantId:this._tenantId}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e;if(t?.email&&t?.password){if(t.signInMethod==="password")return this._fromEmailAndPassword(t.email,t.password);if(t.signInMethod==="emailLink")return this._fromEmailAndCode(t.email,t.password,t.tenantId)}return null}async _getIdTokenResponse(e){switch(this.signInMethod){case"password":const t={returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Ic(e,t,"signInWithPassword",C1);case"emailLink":return S1(e,{email:this._email,oobCode:this._password});default:cr(e,"internal-error")}}async _linkToIdToken(e,t){switch(this.signInMethod){case"password":const n={idToken:t,returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Ic(e,n,"signUpPassword",I1);case"emailLink":return R1(e,{idToken:t,email:this._email,oobCode:this._password});default:cr(e,"internal-error")}}_getReauthenticationResolver(e){return this._getIdTokenResponse(e)}}async function Fi(r,e){return _o(r,"POST","/v1/accounts:signInWithIdp",Vn(r,e))}const P1="http://localhost";class oi extends uu{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const t=new oi(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(t.idToken=e.idToken),e.accessToken&&(t.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(t.nonce=e.nonce),e.pendingToken&&(t.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(t.accessToken=e.oauthToken,t.secret=e.oauthTokenSecret):cr("argument-error"),t}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e,{providerId:n,signInMethod:i,...s}=t;if(!n||!i)return null;const o=new oi(n,i);return o.idToken=s.idToken||void 0,o.accessToken=s.accessToken||void 0,o.secret=s.secret,o.nonce=s.nonce,o.pendingToken=s.pendingToken||null,o}_getIdTokenResponse(e){const t=this.buildRequest();return Fi(e,t)}_linkToIdToken(e,t){const n=this.buildRequest();return n.idToken=t,Fi(e,n)}_getReauthenticationResolver(e){const t=this.buildRequest();return t.autoCreate=!1,Fi(e,t)}buildRequest(){const e={requestUri:P1,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const t={};this.idToken&&(t.id_token=this.idToken),this.accessToken&&(t.access_token=this.accessToken),this.secret&&(t.oauth_token_secret=this.secret),t.providerId=this.providerId,this.nonce&&!this.pendingToken&&(t.nonce=this.nonce),e.postBody=To(t)}return e}}function L1(r){switch(r){case"recoverEmail":return"RECOVER_EMAIL";case"resetPassword":return"PASSWORD_RESET";case"signIn":return"EMAIL_SIGNIN";case"verifyEmail":return"VERIFY_EMAIL";case"verifyAndChangeEmail":return"VERIFY_AND_CHANGE_EMAIL";case"revertSecondFactorAddition":return"REVERT_SECOND_FACTOR_ADDITION";default:return null}}function M1(r){const e=qs(Gs(r)).link,t=e?qs(Gs(e)).deep_link_id:null,n=qs(Gs(r)).deep_link_id;return(n?qs(Gs(n)).link:null)||n||t||e||r}class du{constructor(e){const t=qs(Gs(e)),n=t.apiKey??null,i=t.oobCode??null,s=L1(t.mode??null);de(n&&i&&s,"argument-error"),this.apiKey=n,this.operation=s,this.code=i,this.continueUrl=t.continueUrl??null,this.languageCode=t.lang??null,this.tenantId=t.tenantId??null}static parseLink(e){const t=M1(e);try{return new du(t)}catch{return null}}}class ps{constructor(){this.providerId=ps.PROVIDER_ID}static credential(e,t){return oo._fromEmailAndPassword(e,t)}static credentialWithLink(e,t){const n=du.parseLink(t);return de(n,"argument-error"),oo._fromEmailAndCode(e,n.code,n.tenantId)}}ps.PROVIDER_ID="password";ps.EMAIL_PASSWORD_SIGN_IN_METHOD="password";ps.EMAIL_LINK_SIGN_IN_METHOD="emailLink";class jp{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}class Eo extends jp{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}class pn extends Eo{constructor(){super("facebook.com")}static credential(e){return oi._fromParams({providerId:pn.PROVIDER_ID,signInMethod:pn.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return pn.credentialFromTaggedObject(e)}static credentialFromError(e){return pn.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return pn.credential(e.oauthAccessToken)}catch{return null}}}pn.FACEBOOK_SIGN_IN_METHOD="facebook.com";pn.PROVIDER_ID="facebook.com";class mn extends Eo{constructor(){super("google.com"),this.addScope("profile")}static credential(e,t){return oi._fromParams({providerId:mn.PROVIDER_ID,signInMethod:mn.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:t})}static credentialFromResult(e){return mn.credentialFromTaggedObject(e)}static credentialFromError(e){return mn.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:t,oauthAccessToken:n}=e;if(!t&&!n)return null;try{return mn.credential(t,n)}catch{return null}}}mn.GOOGLE_SIGN_IN_METHOD="google.com";mn.PROVIDER_ID="google.com";class gn extends Eo{constructor(){super("github.com")}static credential(e){return oi._fromParams({providerId:gn.PROVIDER_ID,signInMethod:gn.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return gn.credentialFromTaggedObject(e)}static credentialFromError(e){return gn.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return gn.credential(e.oauthAccessToken)}catch{return null}}}gn.GITHUB_SIGN_IN_METHOD="github.com";gn.PROVIDER_ID="github.com";class $n extends Eo{constructor(){super("twitter.com")}static credential(e,t){return oi._fromParams({providerId:$n.PROVIDER_ID,signInMethod:$n.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:t})}static credentialFromResult(e){return $n.credentialFromTaggedObject(e)}static credentialFromError(e){return $n.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:t,oauthTokenSecret:n}=e;if(!t||!n)return null;try{return $n.credential(t,n)}catch{return null}}}$n.TWITTER_SIGN_IN_METHOD="twitter.com";$n.PROVIDER_ID="twitter.com";async function V1(r,e){return _o(r,"POST","/v1/accounts:signUp",Vn(r,e))}class ai{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,t,n,i=!1){const s=await rr._fromIdTokenResponse(e,n,i),o=Rh(n);return new ai({user:s,providerId:o,_tokenResponse:n,operationType:t})}static async _forOperation(e,t,n){await e._updateTokensIfNecessary(n,!0);const i=Rh(n);return new ai({user:e,providerId:i,_tokenResponse:n,operationType:t})}}function Rh(r){return r.providerId?r.providerId:"phoneNumber"in r?"phone":null}class La extends Zr{constructor(e,t,n,i){super(t.code,t.message),this.operationType=n,this.user=i,Object.setPrototypeOf(this,La.prototype),this.customData={appName:e.name,tenantId:e.tenantId??void 0,_serverResponse:t.customData._serverResponse,operationType:n}}static _fromErrorAndOperation(e,t,n,i){return new La(e,t,n,i)}}function Wp(r,e,t,n){return(e==="reauthenticate"?t._getReauthenticationResolver(r):t._getIdTokenResponse(r)).catch(s=>{throw s.code==="auth/multi-factor-auth-required"?La._fromErrorAndOperation(r,s,e,n):s})}async function D1(r,e,t=!1){const n=await so(r,e._linkToIdToken(r.auth,await r.getIdToken()),t);return ai._forOperation(r,"link",n)}async function N1(r,e,t=!1){const{auth:n}=r;if(Qt(n.app))return Promise.reject(Fr(n));const i="reauthenticate";try{const s=await so(r,Wp(n,i,e,r),t);de(s.idToken,n,"internal-error");const o=lu(s.idToken);de(o,n,"internal-error");const{sub:c}=o;return de(r.uid===c,n,"user-mismatch"),ai._forOperation(r,i,s)}catch(s){throw s?.code==="auth/user-not-found"&&cr(n,"user-mismatch"),s}}async function Qp(r,e,t=!1){if(Qt(r.app))return Promise.reject(Fr(r));const n="signIn",i=await Wp(r,n,e),s=await ai._fromIdTokenResponse(r,n,i);return t||await r._updateCurrentUser(s.user),s}async function B1(r,e){return Qp(pi(r),e)}async function Kp(r){const e=pi(r);e._getPasswordPolicyInternal()&&await e._updatePasswordPolicy()}async function O1(r,e,t){if(Qt(r.app))return Promise.reject(Fr(r));const n=pi(r),o=await Ic(n,{returnSecureToken:!0,email:e,password:t,clientType:"CLIENT_TYPE_WEB"},"signUpPassword",V1).catch(l=>{throw l.code==="auth/password-does-not-meet-requirements"&&Kp(r),l}),c=await ai._fromIdTokenResponse(n,"signIn",o);return await n._updateCurrentUser(c.user),c}function F1(r,e,t){return Qt(r.app)?Promise.reject(Fr(r)):B1(gt(r),ps.credential(e,t)).catch(async n=>{throw n.code==="auth/password-does-not-meet-requirements"&&Kp(r),n})}function z1(r,e,t,n){return gt(r).onIdTokenChanged(e,t,n)}function q1(r,e,t){return gt(r).beforeAuthStateChanged(e,t)}function G1(r){return gt(r).signOut()}const Ma="__sak";class Yp{constructor(e,t){this.storageRetriever=e,this.type=t}_isAvailable(){try{return this.storage?(this.storage.setItem(Ma,"1"),this.storage.removeItem(Ma),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,t){return this.storage.setItem(e,JSON.stringify(t)),Promise.resolve()}_get(e){const t=this.storage.getItem(e);return Promise.resolve(t?JSON.parse(t):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}const U1=1e3,H1=10;class Zp extends Yp{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,t)=>this.onStorageEvent(e,t),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=zp(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const t of Object.keys(this.listeners)){const n=this.storage.getItem(t),i=this.localCache[t];n!==i&&e(t,i,n)}}onStorageEvent(e,t=!1){if(!e.key){this.forAllChangedKeys((o,c,l)=>{this.notifyListeners(o,l)});return}const n=e.key;t?this.detachListener():this.stopPolling();const i=()=>{const o=this.storage.getItem(n);!t&&this.localCache[n]===o||this.notifyListeners(n,o)},s=this.storage.getItem(n);c1()&&s!==e.newValue&&e.newValue!==e.oldValue?setTimeout(i,H1):i()}notifyListeners(e,t){this.localCache[e]=t;const n=this.listeners[e];if(n)for(const i of Array.from(n))i(t&&JSON.parse(t))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,t,n)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:t,newValue:n}),!0)})},U1)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,t){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,t){await super._set(e,t),this.localCache[e]=JSON.stringify(t)}async _get(e){const t=await super._get(e);return this.localCache[e]=JSON.stringify(t),t}async _remove(e){await super._remove(e),delete this.localCache[e]}}Zp.type="LOCAL";const j1=Zp;class Jp extends Yp{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,t){}_removeListener(e,t){}}Jp.type="SESSION";const Xp=Jp;function W1(r){return Promise.all(r.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(t){return{fulfilled:!1,reason:t}}}))}class Xa{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const t=this.receivers.find(i=>i.isListeningto(e));if(t)return t;const n=new Xa(e);return this.receivers.push(n),n}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const t=e,{eventId:n,eventType:i,data:s}=t.data,o=this.handlersMap[i];if(!o?.size)return;t.ports[0].postMessage({status:"ack",eventId:n,eventType:i});const c=Array.from(o).map(async u=>u(t.origin,s)),l=await W1(c);t.ports[0].postMessage({status:"done",eventId:n,eventType:i,response:l})}_subscribe(e,t){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(t)}_unsubscribe(e,t){this.handlersMap[e]&&t&&this.handlersMap[e].delete(t),(!t||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}Xa.receivers=[];function hu(r="",e=10){let t="";for(let n=0;n<e;n++)t+=Math.floor(Math.random()*10);return r+t}class Q1{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,t,n=50){const i=typeof MessageChannel<"u"?new MessageChannel:null;if(!i)throw new Error("connection_unavailable");let s,o;return new Promise((c,l)=>{const u=hu("",20);i.port1.start();const f=setTimeout(()=>{l(new Error("unsupported_event"))},n);o={messageChannel:i,onMessage(d){const h=d;if(h.data.eventId===u)switch(h.data.status){case"ack":clearTimeout(f),s=setTimeout(()=>{l(new Error("timeout"))},3e3);break;case"done":clearTimeout(s),c(h.data.response);break;default:clearTimeout(f),clearTimeout(s),l(new Error("invalid_response"));break}}},this.handlers.add(o),i.port1.addEventListener("message",o.onMessage),this.target.postMessage({eventType:e,eventId:u,data:t},[i.port2])}).finally(()=>{o&&this.removeMessageHandler(o)})}}function Tr(){return window}function K1(r){Tr().location.href=r}function em(){return typeof Tr().WorkerGlobalScope<"u"&&typeof Tr().importScripts=="function"}async function Y1(){if(!navigator?.serviceWorker)return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function Z1(){return navigator?.serviceWorker?.controller||null}function J1(){return em()?self:null}const tm="firebaseLocalStorageDb",X1=1,Va="firebaseLocalStorage",rm="fbase_key";class Ao{constructor(e){this.request=e}toPromise(){return new Promise((e,t)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{t(this.request.error)})})}}function el(r,e){return r.transaction([Va],e?"readwrite":"readonly").objectStore(Va)}function e2(){const r=indexedDB.deleteDatabase(tm);return new Ao(r).toPromise()}function Cc(){const r=indexedDB.open(tm,X1);return new Promise((e,t)=>{r.addEventListener("error",()=>{t(r.error)}),r.addEventListener("upgradeneeded",()=>{const n=r.result;try{n.createObjectStore(Va,{keyPath:rm})}catch(i){t(i)}}),r.addEventListener("success",async()=>{const n=r.result;n.objectStoreNames.contains(Va)?e(n):(n.close(),await e2(),e(await Cc()))})})}async function Ph(r,e,t){const n=el(r,!0).put({[rm]:e,value:t});return new Ao(n).toPromise()}async function t2(r,e){const t=el(r,!1).get(e),n=await new Ao(t).toPromise();return n===void 0?null:n.value}function Lh(r,e){const t=el(r,!0).delete(e);return new Ao(t).toPromise()}const r2=800,n2=3;class nm{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await Cc(),this.db)}async _withRetries(e){let t=0;for(;;)try{const n=await this._openDb();return await e(n)}catch(n){if(t++>n2)throw n;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return em()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=Xa._getInstance(J1()),this.receiver._subscribe("keyChanged",async(e,t)=>({keyProcessed:(await this._poll()).includes(t.key)})),this.receiver._subscribe("ping",async(e,t)=>["keyChanged"])}async initializeSender(){if(this.activeServiceWorker=await Y1(),!this.activeServiceWorker)return;this.sender=new Q1(this.activeServiceWorker);const e=await this.sender._send("ping",{},800);e&&e[0]?.fulfilled&&e[0]?.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||Z1()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await Cc();return await Ph(e,Ma,"1"),await Lh(e,Ma),!0}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,t){return this._withPendingWrite(async()=>(await this._withRetries(n=>Ph(n,e,t)),this.localCache[e]=t,this.notifyServiceWorker(e)))}async _get(e){const t=await this._withRetries(n=>t2(n,e));return this.localCache[e]=t,t}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(t=>Lh(t,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(i=>{const s=el(i,!1).getAll();return new Ao(s).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];const t=[],n=new Set;if(e.length!==0)for(const{fbase_key:i,value:s}of e)n.add(i),JSON.stringify(this.localCache[i])!==JSON.stringify(s)&&(this.notifyListeners(i,s),t.push(i));for(const i of Object.keys(this.localCache))this.localCache[i]&&!n.has(i)&&(this.notifyListeners(i,null),t.push(i));return t}notifyListeners(e,t){this.localCache[e]=t;const n=this.listeners[e];if(n)for(const i of Array.from(n))i(t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),r2)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,t){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}}nm.type="LOCAL";const i2=nm;new xo(3e4,6e4);function s2(r,e){return e?Br(e):(de(r._popupRedirectResolver,r,"argument-error"),r._popupRedirectResolver)}class fu extends uu{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return Fi(e,this._buildIdpRequest())}_linkToIdToken(e,t){return Fi(e,this._buildIdpRequest(t))}_getReauthenticationResolver(e){return Fi(e,this._buildIdpRequest())}_buildIdpRequest(e){const t={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(t.idToken=e),t}}function o2(r){return Qp(r.auth,new fu(r),r.bypassAuthState)}function a2(r){const{auth:e,user:t}=r;return de(t,e,"internal-error"),N1(t,new fu(r),r.bypassAuthState)}async function l2(r){const{auth:e,user:t}=r;return de(t,e,"internal-error"),D1(t,new fu(r),r.bypassAuthState)}class im{constructor(e,t,n,i,s=!1){this.auth=e,this.resolver=n,this.user=i,this.bypassAuthState=s,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(t)?t:[t]}execute(){return new Promise(async(e,t)=>{this.pendingPromise={resolve:e,reject:t};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(n){this.reject(n)}})}async onAuthEvent(e){const{urlResponse:t,sessionId:n,postBody:i,tenantId:s,error:o,type:c}=e;if(o){this.reject(o);return}const l={auth:this.auth,requestUri:t,sessionId:n,tenantId:s||void 0,postBody:i||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(c)(l))}catch(u){this.reject(u)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return o2;case"linkViaPopup":case"linkViaRedirect":return l2;case"reauthViaPopup":case"reauthViaRedirect":return a2;default:cr(this.auth,"internal-error")}}resolve(e){Hr(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){Hr(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}const c2=new xo(2e3,1e4);class Mi extends im{constructor(e,t,n,i,s){super(e,t,i,s),this.provider=n,this.authWindow=null,this.pollId=null,Mi.currentPopupAction&&Mi.currentPopupAction.cancel(),Mi.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return de(e,this.auth,"internal-error"),e}async onExecution(){Hr(this.filter.length===1,"Popup operations only handle one event");const e=hu();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(t=>{this.reject(t)}),this.resolver._isIframeWebStorageSupported(this.auth,t=>{t||this.reject(kr(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){return this.authWindow?.associatedEvent||null}cancel(){this.reject(kr(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,Mi.currentPopupAction=null}pollUserCancellation(){const e=()=>{if(this.authWindow?.window?.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(kr(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,c2.get())};e()}}Mi.currentPopupAction=null;const u2="pendingRedirect",fa=new Map;class d2 extends im{constructor(e,t,n=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],t,void 0,n),this.eventId=null}async execute(){let e=fa.get(this.auth._key());if(!e){try{const n=await h2(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(n)}catch(t){e=()=>Promise.reject(t)}fa.set(this.auth._key(),e)}return this.bypassAuthState||fa.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const t=await this.auth._redirectUserForId(e.eventId);if(t)return this.user=t,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function h2(r,e){const t=m2(e),n=p2(r);if(!await n._isAvailable())return!1;const i=await n._get(t)==="true";return await n._remove(t),i}function f2(r,e){fa.set(r._key(),e)}function p2(r){return Br(r._redirectPersistence)}function m2(r){return ha(u2,r.config.apiKey,r.name)}async function g2(r,e,t=!1){if(Qt(r.app))return Promise.reject(Fr(r));const n=pi(r),i=s2(n,e),o=await new d2(n,i,t).execute();return o&&!t&&(delete o.user._redirectEventId,await n._persistUserIfCurrent(o.user),await n._setRedirectUser(null,e)),o}const $2=600*1e3;class y2{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let t=!1;return this.consumers.forEach(n=>{this.isEventForConsumer(e,n)&&(t=!0,this.sendToConsumer(e,n),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!w2(e)||(this.hasHandledPotentialRedirect=!0,t||(this.queuedRedirectEvent=e,t=!0)),t}sendToConsumer(e,t){if(e.error&&!sm(e)){const n=e.error.code?.split("auth/")[1]||"internal-error";t.onError(kr(this.auth,n))}else t.onAuthEvent(e)}isEventForConsumer(e,t){const n=t.eventId===null||!!e.eventId&&e.eventId===t.eventId;return t.filter.includes(e.type)&&n}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=$2&&this.cachedEventUids.clear(),this.cachedEventUids.has(Mh(e))}saveEventToCache(e){this.cachedEventUids.add(Mh(e)),this.lastProcessedEventTime=Date.now()}}function Mh(r){return[r.type,r.eventId,r.sessionId,r.tenantId].filter(e=>e).join("-")}function sm({type:r,error:e}){return r==="unknown"&&e?.code==="auth/no-auth-event"}function w2(r){switch(r.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return sm(r);default:return!1}}async function b2(r,e={}){return Dn(r,"GET","/v1/projects",e)}const v2=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,k2=/^https?/;async function T2(r){if(r.config.emulator)return;const{authorizedDomains:e}=await b2(r);for(const t of e)try{if(x2(t))return}catch{}cr(r,"unauthorized-domain")}function x2(r){const e=Ec(),{protocol:t,hostname:n}=new URL(e);if(r.startsWith("chrome-extension://")){const o=new URL(r);return o.hostname===""&&n===""?t==="chrome-extension:"&&r.replace("chrome-extension://","")===e.replace("chrome-extension://",""):t==="chrome-extension:"&&o.hostname===n}if(!k2.test(t))return!1;if(v2.test(r))return n===r;const i=r.replace(/\./g,"\\.");return new RegExp("^(.+\\."+i+"|"+i+")$","i").test(n)}const _2=new xo(3e4,6e4);function Vh(){const r=Tr().___jsl;if(r?.H){for(const e of Object.keys(r.H))if(r.H[e].r=r.H[e].r||[],r.H[e].L=r.H[e].L||[],r.H[e].r=[...r.H[e].L],r.CP)for(let t=0;t<r.CP.length;t++)r.CP[t]=null}}function E2(r){return new Promise((e,t)=>{function n(){Vh(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{Vh(),t(kr(r,"network-request-failed"))},timeout:_2.get()})}if(Tr().gapi?.iframes?.Iframe)e(gapi.iframes.getContext());else if(Tr().gapi?.load)n();else{const i=y1("iframefcb");return Tr()[i]=()=>{gapi.load?n():t(kr(r,"network-request-failed"))},Gp(`${$1()}?onload=${i}`).catch(s=>t(s))}}).catch(e=>{throw pa=null,e})}let pa=null;function A2(r){return pa=pa||E2(r),pa}const I2=new xo(5e3,15e3),C2="__/auth/iframe",S2="emulator/auth/iframe",R2={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},P2=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function L2(r){const e=r.config;de(e.authDomain,r,"auth-domain-config-required");const t=e.emulator?au(e,S2):`https://${r.config.authDomain}/${C2}`,n={apiKey:e.apiKey,appName:r.name,v:fs},i=P2.get(r.config.apiHost);i&&(n.eid=i);const s=r._getFrameworks();return s.length&&(n.fw=s.join(",")),`${t}?${To(n).slice(1)}`}async function M2(r){const e=await A2(r),t=Tr().gapi;return de(t,r,"internal-error"),e.open({where:document.body,url:L2(r),messageHandlersFilter:t.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:R2,dontclear:!0},n=>new Promise(async(i,s)=>{await n.restyle({setHideOnLeave:!1});const o=kr(r,"network-request-failed"),c=Tr().setTimeout(()=>{s(o)},I2.get());function l(){Tr().clearTimeout(c),i(n)}n.ping(l).then(l,()=>{s(o)})}))}const V2={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},D2=500,N2=600,B2="_blank",O2="http://localhost";class Dh{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function F2(r,e,t,n=D2,i=N2){const s=Math.max((window.screen.availHeight-i)/2,0).toString(),o=Math.max((window.screen.availWidth-n)/2,0).toString();let c="";const l={...V2,width:n.toString(),height:i.toString(),top:s,left:o},u=Ct().toLowerCase();t&&(c=Dp(u)?B2:t),Mp(u)&&(e=e||O2,l.scrollbars="yes");const f=Object.entries(l).reduce((h,[p,g])=>`${h}${p}=${g},`,"");if(l1(u)&&c!=="_self")return z2(e||"",c),new Dh(null);const d=window.open(e||"",c,f);de(d,r,"popup-blocked");try{d.focus()}catch{}return new Dh(d)}function z2(r,e){const t=document.createElement("a");t.href=r,t.target=e;const n=document.createEvent("MouseEvent");n.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),t.dispatchEvent(n)}const q2="__/auth/handler",G2="emulator/auth/handler",U2=encodeURIComponent("fac");async function Nh(r,e,t,n,i,s){de(r.config.authDomain,r,"auth-domain-config-required"),de(r.config.apiKey,r,"invalid-api-key");const o={apiKey:r.config.apiKey,appName:r.name,authType:t,redirectUrl:n,v:fs,eventId:i};if(e instanceof jp){e.setDefaultLanguage(r.languageCode),o.providerId=e.providerId||"",I$(e.getCustomParameters())||(o.customParameters=JSON.stringify(e.getCustomParameters()));for(const[f,d]of Object.entries({}))o[f]=d}if(e instanceof Eo){const f=e.getScopes().filter(d=>d!=="");f.length>0&&(o.scopes=f.join(","))}r.tenantId&&(o.tid=r.tenantId);const c=o;for(const f of Object.keys(c))c[f]===void 0&&delete c[f];const l=await r._getAppCheckToken(),u=l?`#${U2}=${encodeURIComponent(l)}`:"";return`${H2(r)}?${To(c).slice(1)}${u}`}function H2({config:r}){return r.emulator?au(r,G2):`https://${r.authDomain}/${q2}`}const ec="webStorageSupport";class j2{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=Xp,this._completeRedirectFn=g2,this._overrideRedirectResult=f2}async _openPopup(e,t,n,i){Hr(this.eventManagers[e._key()]?.manager,"_initialize() not called before _openPopup()");const s=await Nh(e,t,n,Ec(),i);return F2(e,s,hu())}async _openRedirect(e,t,n,i){await this._originValidation(e);const s=await Nh(e,t,n,Ec(),i);return K1(s),new Promise(()=>{})}_initialize(e){const t=e._key();if(this.eventManagers[t]){const{manager:i,promise:s}=this.eventManagers[t];return i?Promise.resolve(i):(Hr(s,"If manager is not set, promise should be"),s)}const n=this.initAndGetManager(e);return this.eventManagers[t]={promise:n},n.catch(()=>{delete this.eventManagers[t]}),n}async initAndGetManager(e){const t=await M2(e),n=new y2(e);return t.register("authEvent",i=>(de(i?.authEvent,e,"invalid-auth-event"),{status:n.onEvent(i.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:n},this.iframes[e._key()]=t,n}_isIframeWebStorageSupported(e,t){this.iframes[e._key()].send(ec,{type:ec},i=>{const s=i?.[0]?.[ec];s!==void 0&&t(!!s),cr(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const t=e._key();return this.originValidationPromises[t]||(this.originValidationPromises[t]=T2(e)),this.originValidationPromises[t]}get _shouldInitProactively(){return zp()||Vp()||cu()}}const W2=j2;var Bh="@firebase/auth",Oh="1.12.1";class Q2{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){return this.assertAuthConfigured(),this.auth.currentUser?.uid||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const t=this.auth.onIdTokenChanged(n=>{e(n?.stsTokenManager.accessToken||null)});this.internalListeners.set(e,t),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const t=this.internalListeners.get(e);t&&(this.internalListeners.delete(e),t(),this.updateProactiveRefresh())}assertAuthConfigured(){de(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}function K2(r){switch(r){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function Y2(r){Ji(new si("auth",(e,{options:t})=>{const n=e.getProvider("app").getImmediate(),i=e.getProvider("heartbeat"),s=e.getProvider("app-check-internal"),{apiKey:o,authDomain:c}=n.options;de(o&&!o.includes(":"),"invalid-api-key",{appName:n.name});const l={apiKey:o,authDomain:c,clientPlatform:r,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:qp(r)},u=new p1(n,i,s,l);return x1(u,t),u},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,t,n)=>{e.getProvider("auth-internal").initialize()})),Ji(new si("auth-internal",e=>{const t=pi(e.getProvider("auth").getImmediate());return(n=>new Q2(n))(t)},"PRIVATE").setInstantiationMode("EXPLICIT")),kn(Bh,Oh,K2(r)),kn(Bh,Oh,"esm2020")}const Z2=300,J2=$p("authIdTokenMaxAge")||Z2;let Fh=null;const X2=r=>async e=>{const t=e&&await e.getIdTokenResult(),n=t&&(new Date().getTime()-Date.parse(t.issuedAtTime))/1e3;if(n&&n>J2)return;const i=t?.token;Fh!==i&&(Fh=i,await fetch(r,{method:i?"POST":"DELETE",headers:i?{Authorization:`Bearer ${i}`}:{}}))};function ew(r=Tp()){const e=su(r,"auth");if(e.isInitialized())return e.getImmediate();const t=T1(r,{popupRedirectResolver:W2,persistence:[i2,j1,Xp]}),n=$p("authTokenSyncURL");if(n&&typeof isSecureContext=="boolean"&&isSecureContext){const s=new URL(n,location.origin);if(location.origin===s.origin){const o=X2(s.toString());q1(t,o,()=>o(t.currentUser)),z1(t,c=>o(c))}}const i=mp("auth");return i&&_1(t,`http://${i}`),t}function tw(){return document.getElementsByTagName("head")?.[0]??document}m1({loadJS(r){return new Promise((e,t)=>{const n=document.createElement("script");n.setAttribute("src",r),n.onload=e,n.onerror=i=>{const s=kr("internal-error");s.customData=i,t(s)},n.type="text/javascript",n.charset="UTF-8",tw().appendChild(n)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});Y2("Browser");var zh=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};var Tn,om;(function(){var r;function e(k,x){function _(){}_.prototype=x.prototype,k.F=x.prototype,k.prototype=new _,k.prototype.constructor=k,k.D=function(A,I,L){for(var v=Array(arguments.length-2),ee=2;ee<arguments.length;ee++)v[ee-2]=arguments[ee];return x.prototype[I].apply(A,v)}}function t(){this.blockSize=-1}function n(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.C=Array(this.blockSize),this.o=this.h=0,this.u()}e(n,t),n.prototype.u=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function i(k,x,_){_||(_=0);const A=Array(16);if(typeof x=="string")for(var I=0;I<16;++I)A[I]=x.charCodeAt(_++)|x.charCodeAt(_++)<<8|x.charCodeAt(_++)<<16|x.charCodeAt(_++)<<24;else for(I=0;I<16;++I)A[I]=x[_++]|x[_++]<<8|x[_++]<<16|x[_++]<<24;x=k.g[0],_=k.g[1],I=k.g[2];let L=k.g[3],v;v=x+(L^_&(I^L))+A[0]+3614090360&4294967295,x=_+(v<<7&4294967295|v>>>25),v=L+(I^x&(_^I))+A[1]+3905402710&4294967295,L=x+(v<<12&4294967295|v>>>20),v=I+(_^L&(x^_))+A[2]+606105819&4294967295,I=L+(v<<17&4294967295|v>>>15),v=_+(x^I&(L^x))+A[3]+3250441966&4294967295,_=I+(v<<22&4294967295|v>>>10),v=x+(L^_&(I^L))+A[4]+4118548399&4294967295,x=_+(v<<7&4294967295|v>>>25),v=L+(I^x&(_^I))+A[5]+1200080426&4294967295,L=x+(v<<12&4294967295|v>>>20),v=I+(_^L&(x^_))+A[6]+2821735955&4294967295,I=L+(v<<17&4294967295|v>>>15),v=_+(x^I&(L^x))+A[7]+4249261313&4294967295,_=I+(v<<22&4294967295|v>>>10),v=x+(L^_&(I^L))+A[8]+1770035416&4294967295,x=_+(v<<7&4294967295|v>>>25),v=L+(I^x&(_^I))+A[9]+2336552879&4294967295,L=x+(v<<12&4294967295|v>>>20),v=I+(_^L&(x^_))+A[10]+4294925233&4294967295,I=L+(v<<17&4294967295|v>>>15),v=_+(x^I&(L^x))+A[11]+2304563134&4294967295,_=I+(v<<22&4294967295|v>>>10),v=x+(L^_&(I^L))+A[12]+1804603682&4294967295,x=_+(v<<7&4294967295|v>>>25),v=L+(I^x&(_^I))+A[13]+4254626195&4294967295,L=x+(v<<12&4294967295|v>>>20),v=I+(_^L&(x^_))+A[14]+2792965006&4294967295,I=L+(v<<17&4294967295|v>>>15),v=_+(x^I&(L^x))+A[15]+1236535329&4294967295,_=I+(v<<22&4294967295|v>>>10),v=x+(I^L&(_^I))+A[1]+4129170786&4294967295,x=_+(v<<5&4294967295|v>>>27),v=L+(_^I&(x^_))+A[6]+3225465664&4294967295,L=x+(v<<9&4294967295|v>>>23),v=I+(x^_&(L^x))+A[11]+643717713&4294967295,I=L+(v<<14&4294967295|v>>>18),v=_+(L^x&(I^L))+A[0]+3921069994&4294967295,_=I+(v<<20&4294967295|v>>>12),v=x+(I^L&(_^I))+A[5]+3593408605&4294967295,x=_+(v<<5&4294967295|v>>>27),v=L+(_^I&(x^_))+A[10]+38016083&4294967295,L=x+(v<<9&4294967295|v>>>23),v=I+(x^_&(L^x))+A[15]+3634488961&4294967295,I=L+(v<<14&4294967295|v>>>18),v=_+(L^x&(I^L))+A[4]+3889429448&4294967295,_=I+(v<<20&4294967295|v>>>12),v=x+(I^L&(_^I))+A[9]+568446438&4294967295,x=_+(v<<5&4294967295|v>>>27),v=L+(_^I&(x^_))+A[14]+3275163606&4294967295,L=x+(v<<9&4294967295|v>>>23),v=I+(x^_&(L^x))+A[3]+4107603335&4294967295,I=L+(v<<14&4294967295|v>>>18),v=_+(L^x&(I^L))+A[8]+1163531501&4294967295,_=I+(v<<20&4294967295|v>>>12),v=x+(I^L&(_^I))+A[13]+2850285829&4294967295,x=_+(v<<5&4294967295|v>>>27),v=L+(_^I&(x^_))+A[2]+4243563512&4294967295,L=x+(v<<9&4294967295|v>>>23),v=I+(x^_&(L^x))+A[7]+1735328473&4294967295,I=L+(v<<14&4294967295|v>>>18),v=_+(L^x&(I^L))+A[12]+2368359562&4294967295,_=I+(v<<20&4294967295|v>>>12),v=x+(_^I^L)+A[5]+4294588738&4294967295,x=_+(v<<4&4294967295|v>>>28),v=L+(x^_^I)+A[8]+2272392833&4294967295,L=x+(v<<11&4294967295|v>>>21),v=I+(L^x^_)+A[11]+1839030562&4294967295,I=L+(v<<16&4294967295|v>>>16),v=_+(I^L^x)+A[14]+4259657740&4294967295,_=I+(v<<23&4294967295|v>>>9),v=x+(_^I^L)+A[1]+2763975236&4294967295,x=_+(v<<4&4294967295|v>>>28),v=L+(x^_^I)+A[4]+1272893353&4294967295,L=x+(v<<11&4294967295|v>>>21),v=I+(L^x^_)+A[7]+4139469664&4294967295,I=L+(v<<16&4294967295|v>>>16),v=_+(I^L^x)+A[10]+3200236656&4294967295,_=I+(v<<23&4294967295|v>>>9),v=x+(_^I^L)+A[13]+681279174&4294967295,x=_+(v<<4&4294967295|v>>>28),v=L+(x^_^I)+A[0]+3936430074&4294967295,L=x+(v<<11&4294967295|v>>>21),v=I+(L^x^_)+A[3]+3572445317&4294967295,I=L+(v<<16&4294967295|v>>>16),v=_+(I^L^x)+A[6]+76029189&4294967295,_=I+(v<<23&4294967295|v>>>9),v=x+(_^I^L)+A[9]+3654602809&4294967295,x=_+(v<<4&4294967295|v>>>28),v=L+(x^_^I)+A[12]+3873151461&4294967295,L=x+(v<<11&4294967295|v>>>21),v=I+(L^x^_)+A[15]+530742520&4294967295,I=L+(v<<16&4294967295|v>>>16),v=_+(I^L^x)+A[2]+3299628645&4294967295,_=I+(v<<23&4294967295|v>>>9),v=x+(I^(_|~L))+A[0]+4096336452&4294967295,x=_+(v<<6&4294967295|v>>>26),v=L+(_^(x|~I))+A[7]+1126891415&4294967295,L=x+(v<<10&4294967295|v>>>22),v=I+(x^(L|~_))+A[14]+2878612391&4294967295,I=L+(v<<15&4294967295|v>>>17),v=_+(L^(I|~x))+A[5]+4237533241&4294967295,_=I+(v<<21&4294967295|v>>>11),v=x+(I^(_|~L))+A[12]+1700485571&4294967295,x=_+(v<<6&4294967295|v>>>26),v=L+(_^(x|~I))+A[3]+2399980690&4294967295,L=x+(v<<10&4294967295|v>>>22),v=I+(x^(L|~_))+A[10]+4293915773&4294967295,I=L+(v<<15&4294967295|v>>>17),v=_+(L^(I|~x))+A[1]+2240044497&4294967295,_=I+(v<<21&4294967295|v>>>11),v=x+(I^(_|~L))+A[8]+1873313359&4294967295,x=_+(v<<6&4294967295|v>>>26),v=L+(_^(x|~I))+A[15]+4264355552&4294967295,L=x+(v<<10&4294967295|v>>>22),v=I+(x^(L|~_))+A[6]+2734768916&4294967295,I=L+(v<<15&4294967295|v>>>17),v=_+(L^(I|~x))+A[13]+1309151649&4294967295,_=I+(v<<21&4294967295|v>>>11),v=x+(I^(_|~L))+A[4]+4149444226&4294967295,x=_+(v<<6&4294967295|v>>>26),v=L+(_^(x|~I))+A[11]+3174756917&4294967295,L=x+(v<<10&4294967295|v>>>22),v=I+(x^(L|~_))+A[2]+718787259&4294967295,I=L+(v<<15&4294967295|v>>>17),v=_+(L^(I|~x))+A[9]+3951481745&4294967295,k.g[0]=k.g[0]+x&4294967295,k.g[1]=k.g[1]+(I+(v<<21&4294967295|v>>>11))&4294967295,k.g[2]=k.g[2]+I&4294967295,k.g[3]=k.g[3]+L&4294967295}n.prototype.v=function(k,x){x===void 0&&(x=k.length);const _=x-this.blockSize,A=this.C;let I=this.h,L=0;for(;L<x;){if(I==0)for(;L<=_;)i(this,k,L),L+=this.blockSize;if(typeof k=="string"){for(;L<x;)if(A[I++]=k.charCodeAt(L++),I==this.blockSize){i(this,A),I=0;break}}else for(;L<x;)if(A[I++]=k[L++],I==this.blockSize){i(this,A),I=0;break}}this.h=I,this.o+=x},n.prototype.A=function(){var k=Array((this.h<56?this.blockSize:this.blockSize*2)-this.h);k[0]=128;for(var x=1;x<k.length-8;++x)k[x]=0;x=this.o*8;for(var _=k.length-8;_<k.length;++_)k[_]=x&255,x/=256;for(this.v(k),k=Array(16),x=0,_=0;_<4;++_)for(let A=0;A<32;A+=8)k[x++]=this.g[_]>>>A&255;return k};function s(k,x){var _=c;return Object.prototype.hasOwnProperty.call(_,k)?_[k]:_[k]=x(k)}function o(k,x){this.h=x;const _=[];let A=!0;for(let I=k.length-1;I>=0;I--){const L=k[I]|0;A&&L==x||(_[I]=L,A=!1)}this.g=_}var c={};function l(k){return-128<=k&&k<128?s(k,function(x){return new o([x|0],x<0?-1:0)}):new o([k|0],k<0?-1:0)}function u(k){if(isNaN(k)||!isFinite(k))return d;if(k<0)return b(u(-k));const x=[];let _=1;for(let A=0;k>=_;A++)x[A]=k/_|0,_*=4294967296;return new o(x,0)}function f(k,x){if(k.length==0)throw Error("number format error: empty string");if(x=x||10,x<2||36<x)throw Error("radix out of range: "+x);if(k.charAt(0)=="-")return b(f(k.substring(1),x));if(k.indexOf("-")>=0)throw Error('number format error: interior "-" character');const _=u(Math.pow(x,8));let A=d;for(let L=0;L<k.length;L+=8){var I=Math.min(8,k.length-L);const v=parseInt(k.substring(L,L+I),x);I<8?(I=u(Math.pow(x,I)),A=A.j(I).add(u(v))):(A=A.j(_),A=A.add(u(v)))}return A}var d=l(0),h=l(1),p=l(16777216);r=o.prototype,r.m=function(){if(w(this))return-b(this).m();let k=0,x=1;for(let _=0;_<this.g.length;_++){const A=this.i(_);k+=(A>=0?A:4294967296+A)*x,x*=4294967296}return k},r.toString=function(k){if(k=k||10,k<2||36<k)throw Error("radix out of range: "+k);if(g(this))return"0";if(w(this))return"-"+b(this).toString(k);const x=u(Math.pow(k,6));var _=this;let A="";for(;;){const I=j(_,x).g;_=P(_,I.j(x));let L=((_.g.length>0?_.g[0]:_.h)>>>0).toString(k);if(_=I,g(_))return L+A;for(;L.length<6;)L="0"+L;A=L+A}},r.i=function(k){return k<0?0:k<this.g.length?this.g[k]:this.h};function g(k){if(k.h!=0)return!1;for(let x=0;x<k.g.length;x++)if(k.g[x]!=0)return!1;return!0}function w(k){return k.h==-1}r.l=function(k){return k=P(this,k),w(k)?-1:g(k)?0:1};function b(k){const x=k.g.length,_=[];for(let A=0;A<x;A++)_[A]=~k.g[A];return new o(_,~k.h).add(h)}r.abs=function(){return w(this)?b(this):this},r.add=function(k){const x=Math.max(this.g.length,k.g.length),_=[];let A=0;for(let I=0;I<=x;I++){let L=A+(this.i(I)&65535)+(k.i(I)&65535),v=(L>>>16)+(this.i(I)>>>16)+(k.i(I)>>>16);A=v>>>16,L&=65535,v&=65535,_[I]=v<<16|L}return new o(_,_[_.length-1]&-2147483648?-1:0)};function P(k,x){return k.add(b(x))}r.j=function(k){if(g(this)||g(k))return d;if(w(this))return w(k)?b(this).j(b(k)):b(b(this).j(k));if(w(k))return b(this.j(b(k)));if(this.l(p)<0&&k.l(p)<0)return u(this.m()*k.m());const x=this.g.length+k.g.length,_=[];for(var A=0;A<2*x;A++)_[A]=0;for(A=0;A<this.g.length;A++)for(let I=0;I<k.g.length;I++){const L=this.i(A)>>>16,v=this.i(A)&65535,ee=k.i(I)>>>16,C=k.i(I)&65535;_[2*A+2*I]+=v*C,z(_,2*A+2*I),_[2*A+2*I+1]+=L*C,z(_,2*A+2*I+1),_[2*A+2*I+1]+=v*ee,z(_,2*A+2*I+1),_[2*A+2*I+2]+=L*ee,z(_,2*A+2*I+2)}for(k=0;k<x;k++)_[k]=_[2*k+1]<<16|_[2*k];for(k=x;k<2*x;k++)_[k]=0;return new o(_,0)};function z(k,x){for(;(k[x]&65535)!=k[x];)k[x+1]+=k[x]>>>16,k[x]&=65535,x++}function G(k,x){this.g=k,this.h=x}function j(k,x){if(g(x))throw Error("division by zero");if(g(k))return new G(d,d);if(w(k))return x=j(b(k),x),new G(b(x.g),b(x.h));if(w(x))return x=j(k,b(x)),new G(b(x.g),x.h);if(k.g.length>30){if(w(k)||w(x))throw Error("slowDivide_ only works with positive integers.");for(var _=h,A=x;A.l(k)<=0;)_=te(_),A=te(A);var I=O(_,1),L=O(A,1);for(A=O(A,2),_=O(_,2);!g(A);){var v=L.add(A);v.l(k)<=0&&(I=I.add(_),L=v),A=O(A,1),_=O(_,1)}return x=P(k,I.j(x)),new G(I,x)}for(I=d;k.l(x)>=0;){for(_=Math.max(1,Math.floor(k.m()/x.m())),A=Math.ceil(Math.log(_)/Math.LN2),A=A<=48?1:Math.pow(2,A-48),L=u(_),v=L.j(x);w(v)||v.l(k)>0;)_-=A,L=u(_),v=L.j(x);g(L)&&(L=h),I=I.add(L),k=P(k,v)}return new G(I,k)}r.B=function(k){return j(this,k).h},r.and=function(k){const x=Math.max(this.g.length,k.g.length),_=[];for(let A=0;A<x;A++)_[A]=this.i(A)&k.i(A);return new o(_,this.h&k.h)},r.or=function(k){const x=Math.max(this.g.length,k.g.length),_=[];for(let A=0;A<x;A++)_[A]=this.i(A)|k.i(A);return new o(_,this.h|k.h)},r.xor=function(k){const x=Math.max(this.g.length,k.g.length),_=[];for(let A=0;A<x;A++)_[A]=this.i(A)^k.i(A);return new o(_,this.h^k.h)};function te(k){const x=k.g.length+1,_=[];for(let A=0;A<x;A++)_[A]=k.i(A)<<1|k.i(A-1)>>>31;return new o(_,k.h)}function O(k,x){const _=x>>5;x%=32;const A=k.g.length-_,I=[];for(let L=0;L<A;L++)I[L]=x>0?k.i(L+_)>>>x|k.i(L+_+1)<<32-x:k.i(L+_);return new o(I,k.h)}n.prototype.digest=n.prototype.A,n.prototype.reset=n.prototype.u,n.prototype.update=n.prototype.v,om=n,o.prototype.add=o.prototype.add,o.prototype.multiply=o.prototype.j,o.prototype.modulo=o.prototype.B,o.prototype.compare=o.prototype.l,o.prototype.toNumber=o.prototype.m,o.prototype.toString=o.prototype.toString,o.prototype.getBits=o.prototype.i,o.fromNumber=u,o.fromString=f,Tn=o}).apply(typeof zh<"u"?zh:typeof self<"u"?self:typeof window<"u"?window:{});var Jo=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};var am,Us,lm,ma,Sc,cm,um,dm;(function(){var r,e=Object.defineProperty;function t(a){a=[typeof globalThis=="object"&&globalThis,a,typeof window=="object"&&window,typeof self=="object"&&self,typeof Jo=="object"&&Jo];for(var m=0;m<a.length;++m){var y=a[m];if(y&&y.Math==Math)return y}throw Error("Cannot find global object")}var n=t(this);function i(a,m){if(m)e:{var y=n;a=a.split(".");for(var T=0;T<a.length-1;T++){var N=a[T];if(!(N in y))break e;y=y[N]}a=a[a.length-1],T=y[a],m=m(T),m!=T&&m!=null&&e(y,a,{configurable:!0,writable:!0,value:m})}}i("Symbol.dispose",function(a){return a||Symbol("Symbol.dispose")}),i("Array.prototype.values",function(a){return a||function(){return this[Symbol.iterator]()}}),i("Object.entries",function(a){return a||function(m){var y=[],T;for(T in m)Object.prototype.hasOwnProperty.call(m,T)&&y.push([T,m[T]]);return y}});var s=s||{},o=this||self;function c(a){var m=typeof a;return m=="object"&&a!=null||m=="function"}function l(a,m,y){return a.call.apply(a.bind,arguments)}function u(a,m,y){return u=l,u.apply(null,arguments)}function f(a,m){var y=Array.prototype.slice.call(arguments,1);return function(){var T=y.slice();return T.push.apply(T,arguments),a.apply(this,T)}}function d(a,m){function y(){}y.prototype=m.prototype,a.Z=m.prototype,a.prototype=new y,a.prototype.constructor=a,a.Ob=function(T,N,F){for(var Z=Array(arguments.length-2),we=2;we<arguments.length;we++)Z[we-2]=arguments[we];return m.prototype[N].apply(T,Z)}}var h=typeof AsyncContext<"u"&&typeof AsyncContext.Snapshot=="function"?a=>a&&AsyncContext.Snapshot.wrap(a):a=>a;function p(a){const m=a.length;if(m>0){const y=Array(m);for(let T=0;T<m;T++)y[T]=a[T];return y}return[]}function g(a,m){for(let T=1;T<arguments.length;T++){const N=arguments[T];var y=typeof N;if(y=y!="object"?y:N?Array.isArray(N)?"array":y:"null",y=="array"||y=="object"&&typeof N.length=="number"){y=a.length||0;const F=N.length||0;a.length=y+F;for(let Z=0;Z<F;Z++)a[y+Z]=N[Z]}else a.push(N)}}class w{constructor(m,y){this.i=m,this.j=y,this.h=0,this.g=null}get(){let m;return this.h>0?(this.h--,m=this.g,this.g=m.next,m.next=null):m=this.i(),m}}function b(a){o.setTimeout(()=>{throw a},0)}function P(){var a=k;let m=null;return a.g&&(m=a.g,a.g=a.g.next,a.g||(a.h=null),m.next=null),m}class z{constructor(){this.h=this.g=null}add(m,y){const T=G.get();T.set(m,y),this.h?this.h.next=T:this.g=T,this.h=T}}var G=new w(()=>new j,a=>a.reset());class j{constructor(){this.next=this.g=this.h=null}set(m,y){this.h=m,this.g=y,this.next=null}reset(){this.next=this.g=this.h=null}}let te,O=!1,k=new z,x=()=>{const a=Promise.resolve(void 0);te=()=>{a.then(_)}};function _(){for(var a;a=P();){try{a.h.call(a.g)}catch(y){b(y)}var m=G;m.j(a),m.h<100&&(m.h++,a.next=m.g,m.g=a)}O=!1}function A(){this.u=this.u,this.C=this.C}A.prototype.u=!1,A.prototype.dispose=function(){this.u||(this.u=!0,this.N())},A.prototype[Symbol.dispose]=function(){this.dispose()},A.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function I(a,m){this.type=a,this.g=this.target=m,this.defaultPrevented=!1}I.prototype.h=function(){this.defaultPrevented=!0};var L=(function(){if(!o.addEventListener||!Object.defineProperty)return!1;var a=!1,m=Object.defineProperty({},"passive",{get:function(){a=!0}});try{const y=()=>{};o.addEventListener("test",y,m),o.removeEventListener("test",y,m)}catch{}return a})();function v(a){return/^[\s\xa0]*$/.test(a)}function ee(a,m){I.call(this,a?a.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,a&&this.init(a,m)}d(ee,I),ee.prototype.init=function(a,m){const y=this.type=a.type,T=a.changedTouches&&a.changedTouches.length?a.changedTouches[0]:null;this.target=a.target||a.srcElement,this.g=m,m=a.relatedTarget,m||(y=="mouseover"?m=a.fromElement:y=="mouseout"&&(m=a.toElement)),this.relatedTarget=m,T?(this.clientX=T.clientX!==void 0?T.clientX:T.pageX,this.clientY=T.clientY!==void 0?T.clientY:T.pageY,this.screenX=T.screenX||0,this.screenY=T.screenY||0):(this.clientX=a.clientX!==void 0?a.clientX:a.pageX,this.clientY=a.clientY!==void 0?a.clientY:a.pageY,this.screenX=a.screenX||0,this.screenY=a.screenY||0),this.button=a.button,this.key=a.key||"",this.ctrlKey=a.ctrlKey,this.altKey=a.altKey,this.shiftKey=a.shiftKey,this.metaKey=a.metaKey,this.pointerId=a.pointerId||0,this.pointerType=a.pointerType,this.state=a.state,this.i=a,a.defaultPrevented&&ee.Z.h.call(this)},ee.prototype.h=function(){ee.Z.h.call(this);const a=this.i;a.preventDefault?a.preventDefault():a.returnValue=!1};var C="closure_listenable_"+(Math.random()*1e6|0),S=0;function R(a,m,y,T,N){this.listener=a,this.proxy=null,this.src=m,this.type=y,this.capture=!!T,this.ha=N,this.key=++S,this.da=this.fa=!1}function Q(a){a.da=!0,a.listener=null,a.proxy=null,a.src=null,a.ha=null}function q(a,m,y){for(const T in a)m.call(y,a[T],T,a)}function ce(a,m){for(const y in a)m.call(void 0,a[y],y,a)}function Ie(a){const m={};for(const y in a)m[y]=a[y];return m}const We="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function ot(a,m){let y,T;for(let N=1;N<arguments.length;N++){T=arguments[N];for(y in T)a[y]=T[y];for(let F=0;F<We.length;F++)y=We[F],Object.prototype.hasOwnProperty.call(T,y)&&(a[y]=T[y])}}function Rr(a){this.src=a,this.g={},this.h=0}Rr.prototype.add=function(a,m,y,T,N){const F=a.toString();a=this.g[F],a||(a=this.g[F]=[],this.h++);const Z=_l(a,m,T,N);return Z>-1?(m=a[Z],y||(m.fa=!1)):(m=new R(m,this.src,F,!!T,N),m.fa=y,a.push(m)),m};function Lt(a,m){const y=m.type;if(y in a.g){var T=a.g[y],N=Array.prototype.indexOf.call(T,m,void 0),F;(F=N>=0)&&Array.prototype.splice.call(T,N,1),F&&(Q(m),a.g[y].length==0&&(delete a.g[y],a.h--))}}function _l(a,m,y,T){for(let N=0;N<a.length;++N){const F=a[N];if(!F.da&&F.listener==m&&F.capture==!!y&&F.ha==T)return N}return-1}var El="closure_lm_"+(Math.random()*1e6|0),Al={};function fd(a,m,y,T,N){if(Array.isArray(m)){for(let F=0;F<m.length;F++)fd(a,m[F],y,T,N);return null}return y=gd(y),a&&a[C]?a.J(m,y,c(T)?!!T.capture:!1,N):I0(a,m,y,!1,T,N)}function I0(a,m,y,T,N,F){if(!m)throw Error("Invalid event type");const Z=c(N)?!!N.capture:!!N;let we=Cl(a);if(we||(a[El]=we=new Rr(a)),y=we.add(m,y,T,Z,F),y.proxy)return y;if(T=C0(),y.proxy=T,T.src=a,T.listener=y,a.addEventListener)L||(N=Z),N===void 0&&(N=!1),a.addEventListener(m.toString(),T,N);else if(a.attachEvent)a.attachEvent(md(m.toString()),T);else if(a.addListener&&a.removeListener)a.addListener(T);else throw Error("addEventListener and attachEvent are unavailable.");return y}function C0(){function a(y){return m.call(a.src,a.listener,y)}const m=S0;return a}function pd(a,m,y,T,N){if(Array.isArray(m))for(var F=0;F<m.length;F++)pd(a,m[F],y,T,N);else T=c(T)?!!T.capture:!!T,y=gd(y),a&&a[C]?(a=a.i,F=String(m).toString(),F in a.g&&(m=a.g[F],y=_l(m,y,T,N),y>-1&&(Q(m[y]),Array.prototype.splice.call(m,y,1),m.length==0&&(delete a.g[F],a.h--)))):a&&(a=Cl(a))&&(m=a.g[m.toString()],a=-1,m&&(a=_l(m,y,T,N)),(y=a>-1?m[a]:null)&&Il(y))}function Il(a){if(typeof a!="number"&&a&&!a.da){var m=a.src;if(m&&m[C])Lt(m.i,a);else{var y=a.type,T=a.proxy;m.removeEventListener?m.removeEventListener(y,T,a.capture):m.detachEvent?m.detachEvent(md(y),T):m.addListener&&m.removeListener&&m.removeListener(T),(y=Cl(m))?(Lt(y,a),y.h==0&&(y.src=null,m[El]=null)):Q(a)}}}function md(a){return a in Al?Al[a]:Al[a]="on"+a}function S0(a,m){if(a.da)a=!0;else{m=new ee(m,this);const y=a.listener,T=a.ha||a.src;a.fa&&Il(a),a=y.call(T,m)}return a}function Cl(a){return a=a[El],a instanceof Rr?a:null}var Sl="__closure_events_fn_"+(Math.random()*1e9>>>0);function gd(a){return typeof a=="function"?a:(a[Sl]||(a[Sl]=function(m){return a.handleEvent(m)}),a[Sl])}function kt(){A.call(this),this.i=new Rr(this),this.M=this,this.G=null}d(kt,A),kt.prototype[C]=!0,kt.prototype.removeEventListener=function(a,m,y,T){pd(this,a,m,y,T)};function Rt(a,m){var y,T=a.G;if(T)for(y=[];T;T=T.G)y.push(T);if(a=a.M,T=m.type||m,typeof m=="string")m=new I(m,a);else if(m instanceof I)m.target=m.target||a;else{var N=m;m=new I(T,a),ot(m,N)}N=!0;let F,Z;if(y)for(Z=y.length-1;Z>=0;Z--)F=m.g=y[Z],N=Oo(F,T,!0,m)&&N;if(F=m.g=a,N=Oo(F,T,!0,m)&&N,N=Oo(F,T,!1,m)&&N,y)for(Z=0;Z<y.length;Z++)F=m.g=y[Z],N=Oo(F,T,!1,m)&&N}kt.prototype.N=function(){if(kt.Z.N.call(this),this.i){var a=this.i;for(const m in a.g){const y=a.g[m];for(let T=0;T<y.length;T++)Q(y[T]);delete a.g[m],a.h--}}this.G=null},kt.prototype.J=function(a,m,y,T){return this.i.add(String(a),m,!1,y,T)},kt.prototype.K=function(a,m,y,T){return this.i.add(String(a),m,!0,y,T)};function Oo(a,m,y,T){if(m=a.i.g[String(m)],!m)return!0;m=m.concat();let N=!0;for(let F=0;F<m.length;++F){const Z=m[F];if(Z&&!Z.da&&Z.capture==y){const we=Z.listener,at=Z.ha||Z.src;Z.fa&&Lt(a.i,Z),N=we.call(at,T)!==!1&&N}}return N&&!T.defaultPrevented}function R0(a,m){if(typeof a!="function")if(a&&typeof a.handleEvent=="function")a=u(a.handleEvent,a);else throw Error("Invalid listener argument");return Number(m)>2147483647?-1:o.setTimeout(a,m||0)}function $d(a){a.g=R0(()=>{a.g=null,a.i&&(a.i=!1,$d(a))},a.l);const m=a.h;a.h=null,a.m.apply(null,m)}class P0 extends A{constructor(m,y){super(),this.m=m,this.l=y,this.h=null,this.i=!1,this.g=null}j(m){this.h=arguments,this.g?this.i=!0:$d(this)}N(){super.N(),this.g&&(o.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function bs(a){A.call(this),this.h=a,this.g={}}d(bs,A);var yd=[];function wd(a){q(a.g,function(m,y){this.g.hasOwnProperty(y)&&Il(m)},a),a.g={}}bs.prototype.N=function(){bs.Z.N.call(this),wd(this)},bs.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var Rl=o.JSON.stringify,L0=o.JSON.parse,M0=class{stringify(a){return o.JSON.stringify(a,void 0)}parse(a){return o.JSON.parse(a,void 0)}};function bd(){}function vd(){}var vs={OPEN:"a",hb:"b",ERROR:"c",tb:"d"};function Pl(){I.call(this,"d")}d(Pl,I);function Ll(){I.call(this,"c")}d(Ll,I);var On={},kd=null;function Fo(){return kd=kd||new kt}On.Ia="serverreachability";function Td(a){I.call(this,On.Ia,a)}d(Td,I);function ks(a){const m=Fo();Rt(m,new Td(m))}On.STAT_EVENT="statevent";function xd(a,m){I.call(this,On.STAT_EVENT,a),this.stat=m}d(xd,I);function Pt(a){const m=Fo();Rt(m,new xd(m,a))}On.Ja="timingevent";function _d(a,m){I.call(this,On.Ja,a),this.size=m}d(_d,I);function Ts(a,m){if(typeof a!="function")throw Error("Fn must not be null and must be a function");return o.setTimeout(function(){a()},m)}function xs(){this.g=!0}xs.prototype.ua=function(){this.g=!1};function V0(a,m,y,T,N,F){a.info(function(){if(a.g)if(F){var Z="",we=F.split("&");for(let Ve=0;Ve<we.length;Ve++){var at=we[Ve].split("=");if(at.length>1){const ft=at[0];at=at[1];const hr=ft.split("_");Z=hr.length>=2&&hr[1]=="type"?Z+(ft+"="+at+"&"):Z+(ft+"=redacted&")}}}else Z=null;else Z=F;return"XMLHTTP REQ ("+T+") [attempt "+N+"]: "+m+`
`+y+`
`+Z})}function D0(a,m,y,T,N,F,Z){a.info(function(){return"XMLHTTP RESP ("+T+") [ attempt "+N+"]: "+m+`
`+y+`
`+F+" "+Z})}function yi(a,m,y,T){a.info(function(){return"XMLHTTP TEXT ("+m+"): "+B0(a,y)+(T?" "+T:"")})}function N0(a,m){a.info(function(){return"TIMEOUT: "+m})}xs.prototype.info=function(){};function B0(a,m){if(!a.g)return m;if(!m)return null;try{const F=JSON.parse(m);if(F){for(a=0;a<F.length;a++)if(Array.isArray(F[a])){var y=F[a];if(!(y.length<2)){var T=y[1];if(Array.isArray(T)&&!(T.length<1)){var N=T[0];if(N!="noop"&&N!="stop"&&N!="close")for(let Z=1;Z<T.length;Z++)T[Z]=""}}}}return Rl(F)}catch{return m}}var zo={NO_ERROR:0,cb:1,qb:2,pb:3,kb:4,ob:5,rb:6,Ga:7,TIMEOUT:8,ub:9},Ed={ib:"complete",Fb:"success",ERROR:"error",Ga:"abort",xb:"ready",yb:"readystatechange",TIMEOUT:"timeout",sb:"incrementaldata",wb:"progress",lb:"downloadprogress",Nb:"uploadprogress"},Ad;function Ml(){}d(Ml,bd),Ml.prototype.g=function(){return new XMLHttpRequest},Ad=new Ml;function _s(a){return encodeURIComponent(String(a))}function O0(a){var m=1;a=a.split(":");const y=[];for(;m>0&&a.length;)y.push(a.shift()),m--;return a.length&&y.push(a.join(":")),y}function Jr(a,m,y,T){this.j=a,this.i=m,this.l=y,this.S=T||1,this.V=new bs(this),this.H=45e3,this.J=null,this.o=!1,this.u=this.B=this.A=this.M=this.F=this.T=this.D=null,this.G=[],this.g=null,this.C=0,this.m=this.v=null,this.X=-1,this.K=!1,this.P=0,this.O=null,this.W=this.L=this.U=this.R=!1,this.h=new Id}function Id(){this.i=null,this.g="",this.h=!1}var Cd={},Vl={};function Dl(a,m,y){a.M=1,a.A=Go(dr(m)),a.u=y,a.R=!0,Sd(a,null)}function Sd(a,m){a.F=Date.now(),qo(a),a.B=dr(a.A);var y=a.B,T=a.S;Array.isArray(T)||(T=[String(T)]),Gd(y.i,"t",T),a.C=0,y=a.j.L,a.h=new Id,a.g=ah(a.j,y?m:null,!a.u),a.P>0&&(a.O=new P0(u(a.Y,a,a.g),a.P)),m=a.V,y=a.g,T=a.ba;var N="readystatechange";Array.isArray(N)||(N&&(yd[0]=N.toString()),N=yd);for(let F=0;F<N.length;F++){const Z=fd(y,N[F],T||m.handleEvent,!1,m.h||m);if(!Z)break;m.g[Z.key]=Z}m=a.J?Ie(a.J):{},a.u?(a.v||(a.v="POST"),m["Content-Type"]="application/x-www-form-urlencoded",a.g.ea(a.B,a.v,a.u,m)):(a.v="GET",a.g.ea(a.B,a.v,null,m)),ks(),V0(a.i,a.v,a.B,a.l,a.S,a.u)}Jr.prototype.ba=function(a){a=a.target;const m=this.O;m&&tn(a)==3?m.j():this.Y(a)},Jr.prototype.Y=function(a){try{if(a==this.g)e:{const we=tn(this.g),at=this.g.ya(),Ve=this.g.ca();if(!(we<3)&&(we!=3||this.g&&(this.h.h||this.g.la()||Yd(this.g)))){this.K||we!=4||at==7||(at==8||Ve<=0?ks(3):ks(2)),Nl(this);var m=this.g.ca();this.X=m;var y=F0(this);if(this.o=m==200,D0(this.i,this.v,this.B,this.l,this.S,we,m),this.o){if(this.U&&!this.L){t:{if(this.g){var T,N=this.g;if((T=N.g?N.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!v(T)){var F=T;break t}}F=null}if(a=F)yi(this.i,this.l,a,"Initial handshake response via X-HTTP-Initial-Response"),this.L=!0,Bl(this,a);else{this.o=!1,this.m=3,Pt(12),Fn(this),Es(this);break e}}if(this.R){a=!0;let ft;for(;!this.K&&this.C<y.length;)if(ft=z0(this,y),ft==Vl){we==4&&(this.m=4,Pt(14),a=!1),yi(this.i,this.l,null,"[Incomplete Response]");break}else if(ft==Cd){this.m=4,Pt(15),yi(this.i,this.l,y,"[Invalid Chunk]"),a=!1;break}else yi(this.i,this.l,ft,null),Bl(this,ft);if(Rd(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),we!=4||y.length!=0||this.h.h||(this.m=1,Pt(16),a=!1),this.o=this.o&&a,!a)yi(this.i,this.l,y,"[Invalid Chunked Response]"),Fn(this),Es(this);else if(y.length>0&&!this.W){this.W=!0;var Z=this.j;Z.g==this&&Z.aa&&!Z.P&&(Z.j.info("Great, no buffering proxy detected. Bytes received: "+y.length),jl(Z),Z.P=!0,Pt(11))}}else yi(this.i,this.l,y,null),Bl(this,y);we==4&&Fn(this),this.o&&!this.K&&(we==4?nh(this.j,this):(this.o=!1,qo(this)))}else t$(this.g),m==400&&y.indexOf("Unknown SID")>0?(this.m=3,Pt(12)):(this.m=0,Pt(13)),Fn(this),Es(this)}}}catch{}};function F0(a){if(!Rd(a))return a.g.la();const m=Yd(a.g);if(m==="")return"";let y="";const T=m.length,N=tn(a.g)==4;if(!a.h.i){if(typeof TextDecoder>"u")return Fn(a),Es(a),"";a.h.i=new o.TextDecoder}for(let F=0;F<T;F++)a.h.h=!0,y+=a.h.i.decode(m[F],{stream:!(N&&F==T-1)});return m.length=0,a.h.g+=y,a.C=0,a.h.g}function Rd(a){return a.g?a.v=="GET"&&a.M!=2&&a.j.Aa:!1}function z0(a,m){var y=a.C,T=m.indexOf(`
`,y);return T==-1?Vl:(y=Number(m.substring(y,T)),isNaN(y)?Cd:(T+=1,T+y>m.length?Vl:(m=m.slice(T,T+y),a.C=T+y,m)))}Jr.prototype.cancel=function(){this.K=!0,Fn(this)};function qo(a){a.T=Date.now()+a.H,Pd(a,a.H)}function Pd(a,m){if(a.D!=null)throw Error("WatchDog timer not null");a.D=Ts(u(a.aa,a),m)}function Nl(a){a.D&&(o.clearTimeout(a.D),a.D=null)}Jr.prototype.aa=function(){this.D=null;const a=Date.now();a-this.T>=0?(N0(this.i,this.B),this.M!=2&&(ks(),Pt(17)),Fn(this),this.m=2,Es(this)):Pd(this,this.T-a)};function Es(a){a.j.I==0||a.K||nh(a.j,a)}function Fn(a){Nl(a);var m=a.O;m&&typeof m.dispose=="function"&&m.dispose(),a.O=null,wd(a.V),a.g&&(m=a.g,a.g=null,m.abort(),m.dispose())}function Bl(a,m){try{var y=a.j;if(y.I!=0&&(y.g==a||Ol(y.h,a))){if(!a.L&&Ol(y.h,a)&&y.I==3){try{var T=y.Ba.g.parse(m)}catch{T=null}if(Array.isArray(T)&&T.length==3){var N=T;if(N[0]==0){e:if(!y.v){if(y.g)if(y.g.F+3e3<a.F)Qo(y),jo(y);else break e;Hl(y),Pt(18)}}else y.xa=N[1],0<y.xa-y.K&&N[2]<37500&&y.F&&y.A==0&&!y.C&&(y.C=Ts(u(y.Va,y),6e3));Vd(y.h)<=1&&y.ta&&(y.ta=void 0)}else qn(y,11)}else if((a.L||y.g==a)&&Qo(y),!v(m))for(N=y.Ba.g.parse(m),m=0;m<N.length;m++){let Ve=N[m];const ft=Ve[0];if(!(ft<=y.K))if(y.K=ft,Ve=Ve[1],y.I==2)if(Ve[0]=="c"){y.M=Ve[1],y.ba=Ve[2];const hr=Ve[3];hr!=null&&(y.ka=hr,y.j.info("VER="+y.ka));const Gn=Ve[4];Gn!=null&&(y.za=Gn,y.j.info("SVER="+y.za));const rn=Ve[5];rn!=null&&typeof rn=="number"&&rn>0&&(T=1.5*rn,y.O=T,y.j.info("backChannelRequestTimeoutMs_="+T)),T=y;const nn=a.g;if(nn){const Yo=nn.g?nn.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(Yo){var F=T.h;F.g||Yo.indexOf("spdy")==-1&&Yo.indexOf("quic")==-1&&Yo.indexOf("h2")==-1||(F.j=F.l,F.g=new Set,F.h&&(Fl(F,F.h),F.h=null))}if(T.G){const Wl=nn.g?nn.g.getResponseHeader("X-HTTP-Session-Id"):null;Wl&&(T.wa=Wl,ze(T.J,T.G,Wl))}}y.I=3,y.l&&y.l.ra(),y.aa&&(y.T=Date.now()-a.F,y.j.info("Handshake RTT: "+y.T+"ms")),T=y;var Z=a;if(T.na=oh(T,T.L?T.ba:null,T.W),Z.L){Dd(T.h,Z);var we=Z,at=T.O;at&&(we.H=at),we.D&&(Nl(we),qo(we)),T.g=Z}else th(T);y.i.length>0&&Wo(y)}else Ve[0]!="stop"&&Ve[0]!="close"||qn(y,7);else y.I==3&&(Ve[0]=="stop"||Ve[0]=="close"?Ve[0]=="stop"?qn(y,7):Ul(y):Ve[0]!="noop"&&y.l&&y.l.qa(Ve),y.A=0)}}ks(4)}catch{}}var q0=class{constructor(a,m){this.g=a,this.map=m}};function Ld(a){this.l=a||10,o.PerformanceNavigationTiming?(a=o.performance.getEntriesByType("navigation"),a=a.length>0&&(a[0].nextHopProtocol=="hq"||a[0].nextHopProtocol=="h2")):a=!!(o.chrome&&o.chrome.loadTimes&&o.chrome.loadTimes()&&o.chrome.loadTimes().wasFetchedViaSpdy),this.j=a?this.l:1,this.g=null,this.j>1&&(this.g=new Set),this.h=null,this.i=[]}function Md(a){return a.h?!0:a.g?a.g.size>=a.j:!1}function Vd(a){return a.h?1:a.g?a.g.size:0}function Ol(a,m){return a.h?a.h==m:a.g?a.g.has(m):!1}function Fl(a,m){a.g?a.g.add(m):a.h=m}function Dd(a,m){a.h&&a.h==m?a.h=null:a.g&&a.g.has(m)&&a.g.delete(m)}Ld.prototype.cancel=function(){if(this.i=Nd(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const a of this.g.values())a.cancel();this.g.clear()}};function Nd(a){if(a.h!=null)return a.i.concat(a.h.G);if(a.g!=null&&a.g.size!==0){let m=a.i;for(const y of a.g.values())m=m.concat(y.G);return m}return p(a.i)}var Bd=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function G0(a,m){if(a){a=a.split("&");for(let y=0;y<a.length;y++){const T=a[y].indexOf("=");let N,F=null;T>=0?(N=a[y].substring(0,T),F=a[y].substring(T+1)):N=a[y],m(N,F?decodeURIComponent(F.replace(/\+/g," ")):"")}}}function Xr(a){this.g=this.o=this.j="",this.u=null,this.m=this.h="",this.l=!1;let m;a instanceof Xr?(this.l=a.l,As(this,a.j),this.o=a.o,this.g=a.g,Is(this,a.u),this.h=a.h,zl(this,Ud(a.i)),this.m=a.m):a&&(m=String(a).match(Bd))?(this.l=!1,As(this,m[1]||"",!0),this.o=Cs(m[2]||""),this.g=Cs(m[3]||"",!0),Is(this,m[4]),this.h=Cs(m[5]||"",!0),zl(this,m[6]||"",!0),this.m=Cs(m[7]||"")):(this.l=!1,this.i=new Rs(null,this.l))}Xr.prototype.toString=function(){const a=[];var m=this.j;m&&a.push(Ss(m,Od,!0),":");var y=this.g;return(y||m=="file")&&(a.push("//"),(m=this.o)&&a.push(Ss(m,Od,!0),"@"),a.push(_s(y).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),y=this.u,y!=null&&a.push(":",String(y))),(y=this.h)&&(this.g&&y.charAt(0)!="/"&&a.push("/"),a.push(Ss(y,y.charAt(0)=="/"?j0:H0,!0))),(y=this.i.toString())&&a.push("?",y),(y=this.m)&&a.push("#",Ss(y,Q0)),a.join("")},Xr.prototype.resolve=function(a){const m=dr(this);let y=!!a.j;y?As(m,a.j):y=!!a.o,y?m.o=a.o:y=!!a.g,y?m.g=a.g:y=a.u!=null;var T=a.h;if(y)Is(m,a.u);else if(y=!!a.h){if(T.charAt(0)!="/")if(this.g&&!this.h)T="/"+T;else{var N=m.h.lastIndexOf("/");N!=-1&&(T=m.h.slice(0,N+1)+T)}if(N=T,N==".."||N==".")T="";else if(N.indexOf("./")!=-1||N.indexOf("/.")!=-1){T=N.lastIndexOf("/",0)==0,N=N.split("/");const F=[];for(let Z=0;Z<N.length;){const we=N[Z++];we=="."?T&&Z==N.length&&F.push(""):we==".."?((F.length>1||F.length==1&&F[0]!="")&&F.pop(),T&&Z==N.length&&F.push("")):(F.push(we),T=!0)}T=F.join("/")}else T=N}return y?m.h=T:y=a.i.toString()!=="",y?zl(m,Ud(a.i)):y=!!a.m,y&&(m.m=a.m),m};function dr(a){return new Xr(a)}function As(a,m,y){a.j=y?Cs(m,!0):m,a.j&&(a.j=a.j.replace(/:$/,""))}function Is(a,m){if(m){if(m=Number(m),isNaN(m)||m<0)throw Error("Bad port number "+m);a.u=m}else a.u=null}function zl(a,m,y){m instanceof Rs?(a.i=m,K0(a.i,a.l)):(y||(m=Ss(m,W0)),a.i=new Rs(m,a.l))}function ze(a,m,y){a.i.set(m,y)}function Go(a){return ze(a,"zx",Math.floor(Math.random()*2147483648).toString(36)+Math.abs(Math.floor(Math.random()*2147483648)^Date.now()).toString(36)),a}function Cs(a,m){return a?m?decodeURI(a.replace(/%25/g,"%2525")):decodeURIComponent(a):""}function Ss(a,m,y){return typeof a=="string"?(a=encodeURI(a).replace(m,U0),y&&(a=a.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),a):null}function U0(a){return a=a.charCodeAt(0),"%"+(a>>4&15).toString(16)+(a&15).toString(16)}var Od=/[#\/\?@]/g,H0=/[#\?:]/g,j0=/[#\?]/g,W0=/[#\?@]/g,Q0=/#/g;function Rs(a,m){this.h=this.g=null,this.i=a||null,this.j=!!m}function zn(a){a.g||(a.g=new Map,a.h=0,a.i&&G0(a.i,function(m,y){a.add(decodeURIComponent(m.replace(/\+/g," ")),y)}))}r=Rs.prototype,r.add=function(a,m){zn(this),this.i=null,a=wi(this,a);let y=this.g.get(a);return y||this.g.set(a,y=[]),y.push(m),this.h+=1,this};function Fd(a,m){zn(a),m=wi(a,m),a.g.has(m)&&(a.i=null,a.h-=a.g.get(m).length,a.g.delete(m))}function zd(a,m){return zn(a),m=wi(a,m),a.g.has(m)}r.forEach=function(a,m){zn(this),this.g.forEach(function(y,T){y.forEach(function(N){a.call(m,N,T,this)},this)},this)};function qd(a,m){zn(a);let y=[];if(typeof m=="string")zd(a,m)&&(y=y.concat(a.g.get(wi(a,m))));else for(a=Array.from(a.g.values()),m=0;m<a.length;m++)y=y.concat(a[m]);return y}r.set=function(a,m){return zn(this),this.i=null,a=wi(this,a),zd(this,a)&&(this.h-=this.g.get(a).length),this.g.set(a,[m]),this.h+=1,this},r.get=function(a,m){return a?(a=qd(this,a),a.length>0?String(a[0]):m):m};function Gd(a,m,y){Fd(a,m),y.length>0&&(a.i=null,a.g.set(wi(a,m),p(y)),a.h+=y.length)}r.toString=function(){if(this.i)return this.i;if(!this.g)return"";const a=[],m=Array.from(this.g.keys());for(let T=0;T<m.length;T++){var y=m[T];const N=_s(y);y=qd(this,y);for(let F=0;F<y.length;F++){let Z=N;y[F]!==""&&(Z+="="+_s(y[F])),a.push(Z)}}return this.i=a.join("&")};function Ud(a){const m=new Rs;return m.i=a.i,a.g&&(m.g=new Map(a.g),m.h=a.h),m}function wi(a,m){return m=String(m),a.j&&(m=m.toLowerCase()),m}function K0(a,m){m&&!a.j&&(zn(a),a.i=null,a.g.forEach(function(y,T){const N=T.toLowerCase();T!=N&&(Fd(this,T),Gd(this,N,y))},a)),a.j=m}function Y0(a,m){const y=new xs;if(o.Image){const T=new Image;T.onload=f(en,y,"TestLoadImage: loaded",!0,m,T),T.onerror=f(en,y,"TestLoadImage: error",!1,m,T),T.onabort=f(en,y,"TestLoadImage: abort",!1,m,T),T.ontimeout=f(en,y,"TestLoadImage: timeout",!1,m,T),o.setTimeout(function(){T.ontimeout&&T.ontimeout()},1e4),T.src=a}else m(!1)}function Z0(a,m){const y=new xs,T=new AbortController,N=setTimeout(()=>{T.abort(),en(y,"TestPingServer: timeout",!1,m)},1e4);fetch(a,{signal:T.signal}).then(F=>{clearTimeout(N),F.ok?en(y,"TestPingServer: ok",!0,m):en(y,"TestPingServer: server error",!1,m)}).catch(()=>{clearTimeout(N),en(y,"TestPingServer: error",!1,m)})}function en(a,m,y,T,N){try{N&&(N.onload=null,N.onerror=null,N.onabort=null,N.ontimeout=null),T(y)}catch{}}function J0(){this.g=new M0}function ql(a){this.i=a.Sb||null,this.h=a.ab||!1}d(ql,bd),ql.prototype.g=function(){return new Uo(this.i,this.h)};function Uo(a,m){kt.call(this),this.H=a,this.o=m,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.A=new Headers,this.h=null,this.F="GET",this.D="",this.g=!1,this.B=this.j=this.l=null,this.v=new AbortController}d(Uo,kt),r=Uo.prototype,r.open=function(a,m){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.F=a,this.D=m,this.readyState=1,Ls(this)},r.send=function(a){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");if(this.v.signal.aborted)throw this.abort(),Error("Request was aborted.");this.g=!0;const m={headers:this.A,method:this.F,credentials:this.m,cache:void 0,signal:this.v.signal};a&&(m.body=a),(this.H||o).fetch(new Request(this.D,m)).then(this.Pa.bind(this),this.ga.bind(this))},r.abort=function(){this.response=this.responseText="",this.A=new Headers,this.status=0,this.v.abort(),this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),this.readyState>=1&&this.g&&this.readyState!=4&&(this.g=!1,Ps(this)),this.readyState=0},r.Pa=function(a){if(this.g&&(this.l=a,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=a.headers,this.readyState=2,Ls(this)),this.g&&(this.readyState=3,Ls(this),this.g)))if(this.responseType==="arraybuffer")a.arrayBuffer().then(this.Na.bind(this),this.ga.bind(this));else if(typeof o.ReadableStream<"u"&&"body"in a){if(this.j=a.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.B=new TextDecoder;Hd(this)}else a.text().then(this.Oa.bind(this),this.ga.bind(this))};function Hd(a){a.j.read().then(a.Ma.bind(a)).catch(a.ga.bind(a))}r.Ma=function(a){if(this.g){if(this.o&&a.value)this.response.push(a.value);else if(!this.o){var m=a.value?a.value:new Uint8Array(0);(m=this.B.decode(m,{stream:!a.done}))&&(this.response=this.responseText+=m)}a.done?Ps(this):Ls(this),this.readyState==3&&Hd(this)}},r.Oa=function(a){this.g&&(this.response=this.responseText=a,Ps(this))},r.Na=function(a){this.g&&(this.response=a,Ps(this))},r.ga=function(){this.g&&Ps(this)};function Ps(a){a.readyState=4,a.l=null,a.j=null,a.B=null,Ls(a)}r.setRequestHeader=function(a,m){this.A.append(a,m)},r.getResponseHeader=function(a){return this.h&&this.h.get(a.toLowerCase())||""},r.getAllResponseHeaders=function(){if(!this.h)return"";const a=[],m=this.h.entries();for(var y=m.next();!y.done;)y=y.value,a.push(y[0]+": "+y[1]),y=m.next();return a.join(`\r
`)};function Ls(a){a.onreadystatechange&&a.onreadystatechange.call(a)}Object.defineProperty(Uo.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(a){this.m=a?"include":"same-origin"}});function jd(a){let m="";return q(a,function(y,T){m+=T,m+=":",m+=y,m+=`\r
`}),m}function Gl(a,m,y){e:{for(T in y){var T=!1;break e}T=!0}T||(y=jd(y),typeof a=="string"?y!=null&&_s(y):ze(a,m,y))}function Qe(a){kt.call(this),this.headers=new Map,this.L=a||null,this.h=!1,this.g=null,this.D="",this.o=0,this.l="",this.j=this.B=this.v=this.A=!1,this.m=null,this.F="",this.H=!1}d(Qe,kt);var X0=/^https?$/i,e$=["POST","PUT"];r=Qe.prototype,r.Fa=function(a){this.H=a},r.ea=function(a,m,y,T){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+a);m=m?m.toUpperCase():"GET",this.D=a,this.l="",this.o=0,this.A=!1,this.h=!0,this.g=this.L?this.L.g():Ad.g(),this.g.onreadystatechange=h(u(this.Ca,this));try{this.B=!0,this.g.open(m,String(a),!0),this.B=!1}catch(F){Wd(this,F);return}if(a=y||"",y=new Map(this.headers),T)if(Object.getPrototypeOf(T)===Object.prototype)for(var N in T)y.set(N,T[N]);else if(typeof T.keys=="function"&&typeof T.get=="function")for(const F of T.keys())y.set(F,T.get(F));else throw Error("Unknown input type for opt_headers: "+String(T));T=Array.from(y.keys()).find(F=>F.toLowerCase()=="content-type"),N=o.FormData&&a instanceof o.FormData,!(Array.prototype.indexOf.call(e$,m,void 0)>=0)||T||N||y.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[F,Z]of y)this.g.setRequestHeader(F,Z);this.F&&(this.g.responseType=this.F),"withCredentials"in this.g&&this.g.withCredentials!==this.H&&(this.g.withCredentials=this.H);try{this.m&&(clearTimeout(this.m),this.m=null),this.v=!0,this.g.send(a),this.v=!1}catch(F){Wd(this,F)}};function Wd(a,m){a.h=!1,a.g&&(a.j=!0,a.g.abort(),a.j=!1),a.l=m,a.o=5,Qd(a),Ho(a)}function Qd(a){a.A||(a.A=!0,Rt(a,"complete"),Rt(a,"error"))}r.abort=function(a){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.o=a||7,Rt(this,"complete"),Rt(this,"abort"),Ho(this))},r.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),Ho(this,!0)),Qe.Z.N.call(this)},r.Ca=function(){this.u||(this.B||this.v||this.j?Kd(this):this.Xa())},r.Xa=function(){Kd(this)};function Kd(a){if(a.h&&typeof s<"u"){if(a.v&&tn(a)==4)setTimeout(a.Ca.bind(a),0);else if(Rt(a,"readystatechange"),tn(a)==4){a.h=!1;try{const F=a.ca();e:switch(F){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var m=!0;break e;default:m=!1}var y;if(!(y=m)){var T;if(T=F===0){let Z=String(a.D).match(Bd)[1]||null;!Z&&o.self&&o.self.location&&(Z=o.self.location.protocol.slice(0,-1)),T=!X0.test(Z?Z.toLowerCase():"")}y=T}if(y)Rt(a,"complete"),Rt(a,"success");else{a.o=6;try{var N=tn(a)>2?a.g.statusText:""}catch{N=""}a.l=N+" ["+a.ca()+"]",Qd(a)}}finally{Ho(a)}}}}function Ho(a,m){if(a.g){a.m&&(clearTimeout(a.m),a.m=null);const y=a.g;a.g=null,m||Rt(a,"ready");try{y.onreadystatechange=null}catch{}}}r.isActive=function(){return!!this.g};function tn(a){return a.g?a.g.readyState:0}r.ca=function(){try{return tn(this)>2?this.g.status:-1}catch{return-1}},r.la=function(){try{return this.g?this.g.responseText:""}catch{return""}},r.La=function(a){if(this.g){var m=this.g.responseText;return a&&m.indexOf(a)==0&&(m=m.substring(a.length)),L0(m)}};function Yd(a){try{if(!a.g)return null;if("response"in a.g)return a.g.response;switch(a.F){case"":case"text":return a.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in a.g)return a.g.mozResponseArrayBuffer}return null}catch{return null}}function t$(a){const m={};a=(a.g&&tn(a)>=2&&a.g.getAllResponseHeaders()||"").split(`\r
`);for(let T=0;T<a.length;T++){if(v(a[T]))continue;var y=O0(a[T]);const N=y[0];if(y=y[1],typeof y!="string")continue;y=y.trim();const F=m[N]||[];m[N]=F,F.push(y)}ce(m,function(T){return T.join(", ")})}r.ya=function(){return this.o},r.Ha=function(){return typeof this.l=="string"?this.l:String(this.l)};function Ms(a,m,y){return y&&y.internalChannelParams&&y.internalChannelParams[a]||m}function Zd(a){this.za=0,this.i=[],this.j=new xs,this.ba=this.na=this.J=this.W=this.g=this.wa=this.G=this.H=this.u=this.U=this.o=null,this.Ya=this.V=0,this.Sa=Ms("failFast",!1,a),this.F=this.C=this.v=this.m=this.l=null,this.X=!0,this.xa=this.K=-1,this.Y=this.A=this.D=0,this.Qa=Ms("baseRetryDelayMs",5e3,a),this.Za=Ms("retryDelaySeedMs",1e4,a),this.Ta=Ms("forwardChannelMaxRetries",2,a),this.va=Ms("forwardChannelRequestTimeoutMs",2e4,a),this.ma=a&&a.xmlHttpFactory||void 0,this.Ua=a&&a.Rb||void 0,this.Aa=a&&a.useFetchStreams||!1,this.O=void 0,this.L=a&&a.supportsCrossDomainXhr||!1,this.M="",this.h=new Ld(a&&a.concurrentRequestLimit),this.Ba=new J0,this.S=a&&a.fastHandshake||!1,this.R=a&&a.encodeInitMessageHeaders||!1,this.S&&this.R&&(this.R=!1),this.Ra=a&&a.Pb||!1,a&&a.ua&&this.j.ua(),a&&a.forceLongPolling&&(this.X=!1),this.aa=!this.S&&this.X&&a&&a.detectBufferingProxy||!1,this.ia=void 0,a&&a.longPollingTimeout&&a.longPollingTimeout>0&&(this.ia=a.longPollingTimeout),this.ta=void 0,this.T=0,this.P=!1,this.ja=this.B=null}r=Zd.prototype,r.ka=8,r.I=1,r.connect=function(a,m,y,T){Pt(0),this.W=a,this.H=m||{},y&&T!==void 0&&(this.H.OSID=y,this.H.OAID=T),this.F=this.X,this.J=oh(this,null,this.W),Wo(this)};function Ul(a){if(Jd(a),a.I==3){var m=a.V++,y=dr(a.J);if(ze(y,"SID",a.M),ze(y,"RID",m),ze(y,"TYPE","terminate"),Vs(a,y),m=new Jr(a,a.j,m),m.M=2,m.A=Go(dr(y)),y=!1,o.navigator&&o.navigator.sendBeacon)try{y=o.navigator.sendBeacon(m.A.toString(),"")}catch{}!y&&o.Image&&(new Image().src=m.A,y=!0),y||(m.g=ah(m.j,null),m.g.ea(m.A)),m.F=Date.now(),qo(m)}sh(a)}function jo(a){a.g&&(jl(a),a.g.cancel(),a.g=null)}function Jd(a){jo(a),a.v&&(o.clearTimeout(a.v),a.v=null),Qo(a),a.h.cancel(),a.m&&(typeof a.m=="number"&&o.clearTimeout(a.m),a.m=null)}function Wo(a){if(!Md(a.h)&&!a.m){a.m=!0;var m=a.Ea;te||x(),O||(te(),O=!0),k.add(m,a),a.D=0}}function r$(a,m){return Vd(a.h)>=a.h.j-(a.m?1:0)?!1:a.m?(a.i=m.G.concat(a.i),!0):a.I==1||a.I==2||a.D>=(a.Sa?0:a.Ta)?!1:(a.m=Ts(u(a.Ea,a,m),ih(a,a.D)),a.D++,!0)}r.Ea=function(a){if(this.m)if(this.m=null,this.I==1){if(!a){this.V=Math.floor(Math.random()*1e5),a=this.V++;const N=new Jr(this,this.j,a);let F=this.o;if(this.U&&(F?(F=Ie(F),ot(F,this.U)):F=this.U),this.u!==null||this.R||(N.J=F,F=null),this.S)e:{for(var m=0,y=0;y<this.i.length;y++){t:{var T=this.i[y];if("__data__"in T.map&&(T=T.map.__data__,typeof T=="string")){T=T.length;break t}T=void 0}if(T===void 0)break;if(m+=T,m>4096){m=y;break e}if(m===4096||y===this.i.length-1){m=y+1;break e}}m=1e3}else m=1e3;m=eh(this,N,m),y=dr(this.J),ze(y,"RID",a),ze(y,"CVER",22),this.G&&ze(y,"X-HTTP-Session-Id",this.G),Vs(this,y),F&&(this.R?m="headers="+_s(jd(F))+"&"+m:this.u&&Gl(y,this.u,F)),Fl(this.h,N),this.Ra&&ze(y,"TYPE","init"),this.S?(ze(y,"$req",m),ze(y,"SID","null"),N.U=!0,Dl(N,y,null)):Dl(N,y,m),this.I=2}}else this.I==3&&(a?Xd(this,a):this.i.length==0||Md(this.h)||Xd(this))};function Xd(a,m){var y;m?y=m.l:y=a.V++;const T=dr(a.J);ze(T,"SID",a.M),ze(T,"RID",y),ze(T,"AID",a.K),Vs(a,T),a.u&&a.o&&Gl(T,a.u,a.o),y=new Jr(a,a.j,y,a.D+1),a.u===null&&(y.J=a.o),m&&(a.i=m.G.concat(a.i)),m=eh(a,y,1e3),y.H=Math.round(a.va*.5)+Math.round(a.va*.5*Math.random()),Fl(a.h,y),Dl(y,T,m)}function Vs(a,m){a.H&&q(a.H,function(y,T){ze(m,T,y)}),a.l&&q({},function(y,T){ze(m,T,y)})}function eh(a,m,y){y=Math.min(a.i.length,y);const T=a.l?u(a.l.Ka,a.l,a):null;e:{var N=a.i;let we=-1;for(;;){const at=["count="+y];we==-1?y>0?(we=N[0].g,at.push("ofs="+we)):we=0:at.push("ofs="+we);let Ve=!0;for(let ft=0;ft<y;ft++){var F=N[ft].g;const hr=N[ft].map;if(F-=we,F<0)we=Math.max(0,N[ft].g-100),Ve=!1;else try{F="req"+F+"_"||"";try{var Z=hr instanceof Map?hr:Object.entries(hr);for(const[Gn,rn]of Z){let nn=rn;c(rn)&&(nn=Rl(rn)),at.push(F+Gn+"="+encodeURIComponent(nn))}}catch(Gn){throw at.push(F+"type="+encodeURIComponent("_badmap")),Gn}}catch{T&&T(hr)}}if(Ve){Z=at.join("&");break e}}Z=void 0}return a=a.i.splice(0,y),m.G=a,Z}function th(a){if(!a.g&&!a.v){a.Y=1;var m=a.Da;te||x(),O||(te(),O=!0),k.add(m,a),a.A=0}}function Hl(a){return a.g||a.v||a.A>=3?!1:(a.Y++,a.v=Ts(u(a.Da,a),ih(a,a.A)),a.A++,!0)}r.Da=function(){if(this.v=null,rh(this),this.aa&&!(this.P||this.g==null||this.T<=0)){var a=4*this.T;this.j.info("BP detection timer enabled: "+a),this.B=Ts(u(this.Wa,this),a)}},r.Wa=function(){this.B&&(this.B=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.P=!0,Pt(10),jo(this),rh(this))};function jl(a){a.B!=null&&(o.clearTimeout(a.B),a.B=null)}function rh(a){a.g=new Jr(a,a.j,"rpc",a.Y),a.u===null&&(a.g.J=a.o),a.g.P=0;var m=dr(a.na);ze(m,"RID","rpc"),ze(m,"SID",a.M),ze(m,"AID",a.K),ze(m,"CI",a.F?"0":"1"),!a.F&&a.ia&&ze(m,"TO",a.ia),ze(m,"TYPE","xmlhttp"),Vs(a,m),a.u&&a.o&&Gl(m,a.u,a.o),a.O&&(a.g.H=a.O);var y=a.g;a=a.ba,y.M=1,y.A=Go(dr(m)),y.u=null,y.R=!0,Sd(y,a)}r.Va=function(){this.C!=null&&(this.C=null,jo(this),Hl(this),Pt(19))};function Qo(a){a.C!=null&&(o.clearTimeout(a.C),a.C=null)}function nh(a,m){var y=null;if(a.g==m){Qo(a),jl(a),a.g=null;var T=2}else if(Ol(a.h,m))y=m.G,Dd(a.h,m),T=1;else return;if(a.I!=0){if(m.o)if(T==1){y=m.u?m.u.length:0,m=Date.now()-m.F;var N=a.D;T=Fo(),Rt(T,new _d(T,y)),Wo(a)}else th(a);else if(N=m.m,N==3||N==0&&m.X>0||!(T==1&&r$(a,m)||T==2&&Hl(a)))switch(y&&y.length>0&&(m=a.h,m.i=m.i.concat(y)),N){case 1:qn(a,5);break;case 4:qn(a,10);break;case 3:qn(a,6);break;default:qn(a,2)}}}function ih(a,m){let y=a.Qa+Math.floor(Math.random()*a.Za);return a.isActive()||(y*=2),y*m}function qn(a,m){if(a.j.info("Error code "+m),m==2){var y=u(a.bb,a),T=a.Ua;const N=!T;T=new Xr(T||"//www.google.com/images/cleardot.gif"),o.location&&o.location.protocol=="http"||As(T,"https"),Go(T),N?Y0(T.toString(),y):Z0(T.toString(),y)}else Pt(2);a.I=0,a.l&&a.l.pa(m),sh(a),Jd(a)}r.bb=function(a){a?(this.j.info("Successfully pinged google.com"),Pt(2)):(this.j.info("Failed to ping google.com"),Pt(1))};function sh(a){if(a.I=0,a.ja=[],a.l){const m=Nd(a.h);(m.length!=0||a.i.length!=0)&&(g(a.ja,m),g(a.ja,a.i),a.h.i.length=0,p(a.i),a.i.length=0),a.l.oa()}}function oh(a,m,y){var T=y instanceof Xr?dr(y):new Xr(y);if(T.g!="")m&&(T.g=m+"."+T.g),Is(T,T.u);else{var N=o.location;T=N.protocol,m=m?m+"."+N.hostname:N.hostname,N=+N.port;const F=new Xr(null);T&&As(F,T),m&&(F.g=m),N&&Is(F,N),y&&(F.h=y),T=F}return y=a.G,m=a.wa,y&&m&&ze(T,y,m),ze(T,"VER",a.ka),Vs(a,T),T}function ah(a,m,y){if(m&&!a.L)throw Error("Can't create secondary domain capable XhrIo object.");return m=a.Aa&&!a.ma?new Qe(new ql({ab:y})):new Qe(a.ma),m.Fa(a.L),m}r.isActive=function(){return!!this.l&&this.l.isActive(this)};function lh(){}r=lh.prototype,r.ra=function(){},r.qa=function(){},r.pa=function(){},r.oa=function(){},r.isActive=function(){return!0},r.Ka=function(){};function Ko(){}Ko.prototype.g=function(a,m){return new Ot(a,m)};function Ot(a,m){kt.call(this),this.g=new Zd(m),this.l=a,this.h=m&&m.messageUrlParams||null,a=m&&m.messageHeaders||null,m&&m.clientProtocolHeaderRequired&&(a?a["X-Client-Protocol"]="webchannel":a={"X-Client-Protocol":"webchannel"}),this.g.o=a,a=m&&m.initMessageHeaders||null,m&&m.messageContentType&&(a?a["X-WebChannel-Content-Type"]=m.messageContentType:a={"X-WebChannel-Content-Type":m.messageContentType}),m&&m.sa&&(a?a["X-WebChannel-Client-Profile"]=m.sa:a={"X-WebChannel-Client-Profile":m.sa}),this.g.U=a,(a=m&&m.Qb)&&!v(a)&&(this.g.u=a),this.A=m&&m.supportsCrossDomainXhr||!1,this.v=m&&m.sendRawJson||!1,(m=m&&m.httpSessionIdParam)&&!v(m)&&(this.g.G=m,a=this.h,a!==null&&m in a&&(a=this.h,m in a&&delete a[m])),this.j=new bi(this)}d(Ot,kt),Ot.prototype.m=function(){this.g.l=this.j,this.A&&(this.g.L=!0),this.g.connect(this.l,this.h||void 0)},Ot.prototype.close=function(){Ul(this.g)},Ot.prototype.o=function(a){var m=this.g;if(typeof a=="string"){var y={};y.__data__=a,a=y}else this.v&&(y={},y.__data__=Rl(a),a=y);m.i.push(new q0(m.Ya++,a)),m.I==3&&Wo(m)},Ot.prototype.N=function(){this.g.l=null,delete this.j,Ul(this.g),delete this.g,Ot.Z.N.call(this)};function ch(a){Pl.call(this),a.__headers__&&(this.headers=a.__headers__,this.statusCode=a.__status__,delete a.__headers__,delete a.__status__);var m=a.__sm__;if(m){e:{for(const y in m){a=y;break e}a=void 0}(this.i=a)&&(a=this.i,m=m!==null&&a in m?m[a]:void 0),this.data=m}else this.data=a}d(ch,Pl);function uh(){Ll.call(this),this.status=1}d(uh,Ll);function bi(a){this.g=a}d(bi,lh),bi.prototype.ra=function(){Rt(this.g,"a")},bi.prototype.qa=function(a){Rt(this.g,new ch(a))},bi.prototype.pa=function(a){Rt(this.g,new uh)},bi.prototype.oa=function(){Rt(this.g,"b")},Ko.prototype.createWebChannel=Ko.prototype.g,Ot.prototype.send=Ot.prototype.o,Ot.prototype.open=Ot.prototype.m,Ot.prototype.close=Ot.prototype.close,dm=function(){return new Ko},um=function(){return Fo()},cm=On,Sc={jb:0,mb:1,nb:2,Hb:3,Mb:4,Jb:5,Kb:6,Ib:7,Gb:8,Lb:9,PROXY:10,NOPROXY:11,Eb:12,Ab:13,Bb:14,zb:15,Cb:16,Db:17,fb:18,eb:19,gb:20},zo.NO_ERROR=0,zo.TIMEOUT=8,zo.HTTP_ERROR=6,ma=zo,Ed.COMPLETE="complete",lm=Ed,vd.EventType=vs,vs.OPEN="a",vs.CLOSE="b",vs.ERROR="c",vs.MESSAGE="d",kt.prototype.listen=kt.prototype.J,Us=vd,Qe.prototype.listenOnce=Qe.prototype.K,Qe.prototype.getLastError=Qe.prototype.Ha,Qe.prototype.getLastErrorCode=Qe.prototype.ya,Qe.prototype.getStatus=Qe.prototype.ca,Qe.prototype.getResponseJson=Qe.prototype.La,Qe.prototype.getResponseText=Qe.prototype.la,Qe.prototype.send=Qe.prototype.ea,Qe.prototype.setWithCredentials=Qe.prototype.Fa,am=Qe}).apply(typeof Jo<"u"?Jo:typeof self<"u"?self:typeof window<"u"?window:{});class Et{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}Et.UNAUTHENTICATED=new Et(null),Et.GOOGLE_CREDENTIALS=new Et("google-credentials-uid"),Et.FIRST_PARTY=new Et("first-party-uid"),Et.MOCK_USER=new Et("mock-user");let ms="12.10.0";function rw(r){ms=r}const li=new nu("@firebase/firestore");function Ii(){return li.logLevel}function oe(r,...e){if(li.logLevel<=ve.DEBUG){const t=e.map(pu);li.debug(`Firestore (${ms}): ${r}`,...t)}}function jr(r,...e){if(li.logLevel<=ve.ERROR){const t=e.map(pu);li.error(`Firestore (${ms}): ${r}`,...t)}}function ci(r,...e){if(li.logLevel<=ve.WARN){const t=e.map(pu);li.warn(`Firestore (${ms}): ${r}`,...t)}}function pu(r){if(typeof r=="string")return r;try{return(function(t){return JSON.stringify(t)})(r)}catch{return r}}function he(r,e,t){let n="Unexpected state";typeof e=="string"?n=e:t=e,hm(r,n,t)}function hm(r,e,t){let n=`FIRESTORE (${ms}) INTERNAL ASSERTION FAILED: ${e} (ID: ${r.toString(16)})`;if(t!==void 0)try{n+=" CONTEXT: "+JSON.stringify(t)}catch{n+=" CONTEXT: "+t}throw jr(n),new Error(n)}function Se(r,e,t,n){let i="Unexpected state";typeof t=="string"?i=t:n=t,r||hm(e,i,n)}function ge(r,e){return r}const H={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class ie extends Zr{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}class zr{constructor(){this.promise=new Promise(((e,t)=>{this.resolve=e,this.reject=t}))}}class fm{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class nw{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable((()=>t(Et.UNAUTHENTICATED)))}shutdown(){}}class iw{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,t){this.changeListener=t,e.enqueueRetryable((()=>t(this.token.user)))}shutdown(){this.changeListener=null}}class sw{constructor(e){this.t=e,this.currentUser=Et.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,t){Se(this.o===void 0,42304);let n=this.i;const i=l=>this.i!==n?(n=this.i,t(l)):Promise.resolve();let s=new zr;this.o=()=>{this.i++,this.currentUser=this.u(),s.resolve(),s=new zr,e.enqueueRetryable((()=>i(this.currentUser)))};const o=()=>{const l=s;e.enqueueRetryable((async()=>{await l.promise,await i(this.currentUser)}))},c=l=>{oe("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=l,this.o&&(this.auth.addAuthTokenListener(this.o),o())};this.t.onInit((l=>c(l))),setTimeout((()=>{if(!this.auth){const l=this.t.getImmediate({optional:!0});l?c(l):(oe("FirebaseAuthCredentialsProvider","Auth not yet detected"),s.resolve(),s=new zr)}}),0),o()}getToken(){const e=this.i,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then((n=>this.i!==e?(oe("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):n?(Se(typeof n.accessToken=="string",31837,{l:n}),new fm(n.accessToken,this.currentUser)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const e=this.auth&&this.auth.getUid();return Se(e===null||typeof e=="string",2055,{h:e}),new Et(e)}}class ow{constructor(e,t,n){this.P=e,this.T=t,this.I=n,this.type="FirstParty",this.user=Et.FIRST_PARTY,this.R=new Map}A(){return this.I?this.I():null}get headers(){this.R.set("X-Goog-AuthUser",this.P);const e=this.A();return e&&this.R.set("Authorization",e),this.T&&this.R.set("X-Goog-Iam-Authorization-Token",this.T),this.R}}class aw{constructor(e,t,n){this.P=e,this.T=t,this.I=n}getToken(){return Promise.resolve(new ow(this.P,this.T,this.I))}start(e,t){e.enqueueRetryable((()=>t(Et.FIRST_PARTY)))}shutdown(){}invalidateToken(){}}class qh{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class lw{constructor(e,t){this.V=t,this.forceRefresh=!1,this.appCheck=null,this.m=null,this.p=null,Qt(e)&&e.settings.appCheckToken&&(this.p=e.settings.appCheckToken)}start(e,t){Se(this.o===void 0,3512);const n=s=>{s.error!=null&&oe("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${s.error.message}`);const o=s.token!==this.m;return this.m=s.token,oe("FirebaseAppCheckTokenProvider",`Received ${o?"new":"existing"} token.`),o?t(s.token):Promise.resolve()};this.o=s=>{e.enqueueRetryable((()=>n(s)))};const i=s=>{oe("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=s,this.o&&this.appCheck.addTokenListener(this.o)};this.V.onInit((s=>i(s))),setTimeout((()=>{if(!this.appCheck){const s=this.V.getImmediate({optional:!0});s?i(s):oe("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}}),0)}getToken(){if(this.p)return Promise.resolve(new qh(this.p));const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then((t=>t?(Se(typeof t.token=="string",44558,{tokenResult:t}),this.m=t.token,new qh(t.token)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}function cw(r){const e=typeof self<"u"&&(self.crypto||self.msCrypto),t=new Uint8Array(r);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(t);else for(let n=0;n<r;n++)t[n]=Math.floor(256*Math.random());return t}class mu{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=62*Math.floor(4.129032258064516);let n="";for(;n.length<20;){const i=cw(40);for(let s=0;s<i.length;++s)n.length<20&&i[s]<t&&(n+=e.charAt(i[s]%62))}return n}}function Te(r,e){return r<e?-1:r>e?1:0}function Rc(r,e){const t=Math.min(r.length,e.length);for(let n=0;n<t;n++){const i=r.charAt(n),s=e.charAt(n);if(i!==s)return tc(i)===tc(s)?Te(i,s):tc(i)?1:-1}return Te(r.length,e.length)}const uw=55296,dw=57343;function tc(r){const e=r.charCodeAt(0);return e>=uw&&e<=dw}function Xi(r,e,t){return r.length===e.length&&r.every(((n,i)=>t(n,e[i])))}const Gh="__name__";class pr{constructor(e,t,n){t===void 0?t=0:t>e.length&&he(637,{offset:t,range:e.length}),n===void 0?n=e.length-t:n>e.length-t&&he(1746,{length:n,range:e.length-t}),this.segments=e,this.offset=t,this.len=n}get length(){return this.len}isEqual(e){return pr.comparator(this,e)===0}child(e){const t=this.segments.slice(this.offset,this.limit());return e instanceof pr?e.forEach((n=>{t.push(n)})):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,n=this.limit();t<n;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){const n=Math.min(e.length,t.length);for(let i=0;i<n;i++){const s=pr.compareSegments(e.get(i),t.get(i));if(s!==0)return s}return Te(e.length,t.length)}static compareSegments(e,t){const n=pr.isNumericId(e),i=pr.isNumericId(t);return n&&!i?-1:!n&&i?1:n&&i?pr.extractNumericId(e).compare(pr.extractNumericId(t)):Rc(e,t)}static isNumericId(e){return e.startsWith("__id")&&e.endsWith("__")}static extractNumericId(e){return Tn.fromString(e.substring(4,e.length-2))}}class Oe extends pr{construct(e,t,n){return new Oe(e,t,n)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const t=[];for(const n of e){if(n.indexOf("//")>=0)throw new ie(H.INVALID_ARGUMENT,`Invalid segment (${n}). Paths must not contain // in them.`);t.push(...n.split("/").filter((i=>i.length>0)))}return new Oe(t)}static emptyPath(){return new Oe([])}}const hw=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class bt extends pr{construct(e,t,n){return new bt(e,t,n)}static isValidIdentifier(e){return hw.test(e)}canonicalString(){return this.toArray().map((e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),bt.isValidIdentifier(e)||(e="`"+e+"`"),e))).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)===Gh}static keyField(){return new bt([Gh])}static fromServerFormat(e){const t=[];let n="",i=0;const s=()=>{if(n.length===0)throw new ie(H.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(n),n=""};let o=!1;for(;i<e.length;){const c=e[i];if(c==="\\"){if(i+1===e.length)throw new ie(H.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const l=e[i+1];if(l!=="\\"&&l!=="."&&l!=="`")throw new ie(H.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);n+=l,i+=2}else c==="`"?(o=!o,i++):c!=="."||o?(n+=c,i++):(s(),i++)}if(s(),o)throw new ie(H.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new bt(t)}static emptyPath(){return new bt([])}}class le{constructor(e){this.path=e}static fromPath(e){return new le(Oe.fromString(e))}static fromName(e){return new le(Oe.fromString(e).popFirst(5))}static empty(){return new le(Oe.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&Oe.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,t){return Oe.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new le(new Oe(e.slice()))}}function pm(r,e,t){if(!t)throw new ie(H.INVALID_ARGUMENT,`Function ${r}() cannot be called with an empty ${e}.`)}function fw(r,e,t,n){if(e===!0&&n===!0)throw new ie(H.INVALID_ARGUMENT,`${r} and ${t} cannot be used together.`)}function Uh(r){if(!le.isDocumentKey(r))throw new ie(H.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${r} has ${r.length}.`)}function Hh(r){if(le.isDocumentKey(r))throw new ie(H.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${r} has ${r.length}.`)}function mm(r){return typeof r=="object"&&r!==null&&(Object.getPrototypeOf(r)===Object.prototype||Object.getPrototypeOf(r)===null)}function tl(r){if(r===void 0)return"undefined";if(r===null)return"null";if(typeof r=="string")return r.length>20&&(r=`${r.substring(0,20)}...`),JSON.stringify(r);if(typeof r=="number"||typeof r=="boolean")return""+r;if(typeof r=="object"){if(r instanceof Array)return"an array";{const e=(function(n){return n.constructor?n.constructor.name:null})(r);return e?`a custom ${e} object`:"an object"}}return typeof r=="function"?"a function":he(12329,{type:typeof r})}function Gt(r,e){if("_delegate"in r&&(r=r._delegate),!(r instanceof e)){if(e.name===r.constructor.name)throw new ie(H.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const t=tl(r);throw new ie(H.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${t}`)}}return r}function nt(r,e){const t={typeString:r};return e&&(t.value=e),t}function Io(r,e){if(!mm(r))throw new ie(H.INVALID_ARGUMENT,"JSON must be an object");let t;for(const n in e)if(e[n]){const i=e[n].typeString,s="value"in e[n]?{value:e[n].value}:void 0;if(!(n in r)){t=`JSON missing required field: '${n}'`;break}const o=r[n];if(i&&typeof o!==i){t=`JSON field '${n}' must be a ${i}.`;break}if(s!==void 0&&o!==s.value){t=`Expected '${n}' field to equal '${s.value}'`;break}}if(t)throw new ie(H.INVALID_ARGUMENT,t);return!0}const jh=-62135596800,Wh=1e6;class Ge{static now(){return Ge.fromMillis(Date.now())}static fromDate(e){return Ge.fromMillis(e.getTime())}static fromMillis(e){const t=Math.floor(e/1e3),n=Math.floor((e-1e3*t)*Wh);return new Ge(t,n)}constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0)throw new ie(H.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(t>=1e9)throw new ie(H.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<jh)throw new ie(H.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new ie(H.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/Wh}_compareTo(e){return this.seconds===e.seconds?Te(this.nanoseconds,e.nanoseconds):Te(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{type:Ge._jsonSchemaVersion,seconds:this.seconds,nanoseconds:this.nanoseconds}}static fromJSON(e){if(Io(e,Ge._jsonSchema))return new Ge(e.seconds,e.nanoseconds)}valueOf(){const e=this.seconds-jh;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}Ge._jsonSchemaVersion="firestore/timestamp/1.0",Ge._jsonSchema={type:nt("string",Ge._jsonSchemaVersion),seconds:nt("number"),nanoseconds:nt("number")};class pe{static fromTimestamp(e){return new pe(e)}static min(){return new pe(new Ge(0,0))}static max(){return new pe(new Ge(253402300799,999999999))}constructor(e){this.timestamp=e}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}const ao=-1;function pw(r,e){const t=r.toTimestamp().seconds,n=r.toTimestamp().nanoseconds+1,i=pe.fromTimestamp(n===1e9?new Ge(t+1,0):new Ge(t,n));return new An(i,le.empty(),e)}function mw(r){return new An(r.readTime,r.key,ao)}class An{constructor(e,t,n){this.readTime=e,this.documentKey=t,this.largestBatchId=n}static min(){return new An(pe.min(),le.empty(),ao)}static max(){return new An(pe.max(),le.empty(),ao)}}function gw(r,e){let t=r.readTime.compareTo(e.readTime);return t!==0?t:(t=le.comparator(r.documentKey,e.documentKey),t!==0?t:Te(r.largestBatchId,e.largestBatchId))}const $w="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class yw{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach((e=>e()))}}async function gs(r){if(r.code!==H.FAILED_PRECONDITION||r.message!==$w)throw r;oe("LocalStore","Unexpectedly lost primary lease")}class W{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e((t=>{this.isDone=!0,this.result=t,this.nextCallback&&this.nextCallback(t)}),(t=>{this.isDone=!0,this.error=t,this.catchCallback&&this.catchCallback(t)}))}catch(e){return this.next(void 0,e)}next(e,t){return this.callbackAttached&&he(59440),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(t,this.error):this.wrapSuccess(e,this.result):new W(((n,i)=>{this.nextCallback=s=>{this.wrapSuccess(e,s).next(n,i)},this.catchCallback=s=>{this.wrapFailure(t,s).next(n,i)}}))}toPromise(){return new Promise(((e,t)=>{this.next(e,t)}))}wrapUserFunction(e){try{const t=e();return t instanceof W?t:W.resolve(t)}catch(t){return W.reject(t)}}wrapSuccess(e,t){return e?this.wrapUserFunction((()=>e(t))):W.resolve(t)}wrapFailure(e,t){return e?this.wrapUserFunction((()=>e(t))):W.reject(t)}static resolve(e){return new W(((t,n)=>{t(e)}))}static reject(e){return new W(((t,n)=>{n(e)}))}static waitFor(e){return new W(((t,n)=>{let i=0,s=0,o=!1;e.forEach((c=>{++i,c.next((()=>{++s,o&&s===i&&t()}),(l=>n(l)))})),o=!0,s===i&&t()}))}static or(e){let t=W.resolve(!1);for(const n of e)t=t.next((i=>i?W.resolve(i):n()));return t}static forEach(e,t){const n=[];return e.forEach(((i,s)=>{n.push(t.call(this,i,s))})),this.waitFor(n)}static mapArray(e,t){return new W(((n,i)=>{const s=e.length,o=new Array(s);let c=0;for(let l=0;l<s;l++){const u=l;t(e[u]).next((f=>{o[u]=f,++c,c===s&&n(o)}),(f=>i(f)))}}))}static doWhile(e,t){return new W(((n,i)=>{const s=()=>{e()===!0?t().next((()=>{s()}),i):n()};s()}))}}function ww(r){const e=r.match(/Android ([\d.]+)/i),t=e?e[1].split(".").slice(0,2).join("."):"-1";return Number(t)}function $s(r){return r.name==="IndexedDbTransactionError"}class rl{constructor(e,t){this.previousValue=e,t&&(t.sequenceNumberHandler=n=>this.ae(n),this.ue=n=>t.writeSequenceNumber(n))}ae(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this.ue&&this.ue(e),e}}rl.ce=-1;const gu=-1;function nl(r){return r==null}function Da(r){return r===0&&1/r==-1/0}function bw(r){return typeof r=="number"&&Number.isInteger(r)&&!Da(r)&&r<=Number.MAX_SAFE_INTEGER&&r>=Number.MIN_SAFE_INTEGER}const gm="";function vw(r){let e="";for(let t=0;t<r.length;t++)e.length>0&&(e=Qh(e)),e=kw(r.get(t),e);return Qh(e)}function kw(r,e){let t=e;const n=r.length;for(let i=0;i<n;i++){const s=r.charAt(i);switch(s){case"\0":t+="";break;case gm:t+="";break;default:t+=s}}return t}function Qh(r){return r+gm+""}function Kh(r){let e=0;for(const t in r)Object.prototype.hasOwnProperty.call(r,t)&&e++;return e}function Nn(r,e){for(const t in r)Object.prototype.hasOwnProperty.call(r,t)&&e(t,r[t])}function $m(r){for(const e in r)if(Object.prototype.hasOwnProperty.call(r,e))return!1;return!0}class je{constructor(e,t){this.comparator=e,this.root=t||yt.EMPTY}insert(e,t){return new je(this.comparator,this.root.insert(e,t,this.comparator).copy(null,null,yt.BLACK,null,null))}remove(e){return new je(this.comparator,this.root.remove(e,this.comparator).copy(null,null,yt.BLACK,null,null))}get(e){let t=this.root;for(;!t.isEmpty();){const n=this.comparator(e,t.key);if(n===0)return t.value;n<0?t=t.left:n>0&&(t=t.right)}return null}indexOf(e){let t=0,n=this.root;for(;!n.isEmpty();){const i=this.comparator(e,n.key);if(i===0)return t+n.left.size;i<0?n=n.left:(t+=n.left.size+1,n=n.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal(((t,n)=>(e(t,n),!1)))}toString(){const e=[];return this.inorderTraversal(((t,n)=>(e.push(`${t}:${n}`),!1))),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new Xo(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new Xo(this.root,e,this.comparator,!1)}getReverseIterator(){return new Xo(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new Xo(this.root,e,this.comparator,!0)}}class Xo{constructor(e,t,n,i){this.isReverse=i,this.nodeStack=[];let s=1;for(;!e.isEmpty();)if(s=t?n(e.key,t):1,t&&i&&(s*=-1),s<0)e=this.isReverse?e.left:e.right;else{if(s===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const t={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return t}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class yt{constructor(e,t,n,i,s){this.key=e,this.value=t,this.color=n??yt.RED,this.left=i??yt.EMPTY,this.right=s??yt.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,t,n,i,s){return new yt(e??this.key,t??this.value,n??this.color,i??this.left,s??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,n){let i=this;const s=n(e,i.key);return i=s<0?i.copy(null,null,null,i.left.insert(e,t,n),null):s===0?i.copy(null,t,null,null,null):i.copy(null,null,null,null,i.right.insert(e,t,n)),i.fixUp()}removeMin(){if(this.left.isEmpty())return yt.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,t){let n,i=this;if(t(e,i.key)<0)i.left.isEmpty()||i.left.isRed()||i.left.left.isRed()||(i=i.moveRedLeft()),i=i.copy(null,null,null,i.left.remove(e,t),null);else{if(i.left.isRed()&&(i=i.rotateRight()),i.right.isEmpty()||i.right.isRed()||i.right.left.isRed()||(i=i.moveRedRight()),t(e,i.key)===0){if(i.right.isEmpty())return yt.EMPTY;n=i.right.min(),i=i.copy(n.key,n.value,null,null,i.right.removeMin())}i=i.copy(null,null,null,null,i.right.remove(e,t))}return i.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,yt.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,yt.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed())throw he(43730,{key:this.key,value:this.value});if(this.right.isRed())throw he(14113,{key:this.key,value:this.value});const e=this.left.check();if(e!==this.right.check())throw he(27949);return e+(this.isRed()?0:1)}}yt.EMPTY=null,yt.RED=!0,yt.BLACK=!1;yt.EMPTY=new class{constructor(){this.size=0}get key(){throw he(57766)}get value(){throw he(16141)}get color(){throw he(16727)}get left(){throw he(29726)}get right(){throw he(36894)}copy(e,t,n,i,s){return this}insert(e,t,n){return new yt(e,t)}remove(e,t){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};class ht{constructor(e){this.comparator=e,this.data=new je(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal(((t,n)=>(e(t),!1)))}forEachInRange(e,t){const n=this.data.getIteratorFrom(e[0]);for(;n.hasNext();){const i=n.getNext();if(this.comparator(i.key,e[1])>=0)return;t(i.key)}}forEachWhile(e,t){let n;for(n=t!==void 0?this.data.getIteratorFrom(t):this.data.getIterator();n.hasNext();)if(!e(n.getNext().key))return}firstAfterOrEqual(e){const t=this.data.getIteratorFrom(e);return t.hasNext()?t.getNext().key:null}getIterator(){return new Yh(this.data.getIterator())}getIteratorFrom(e){return new Yh(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let t=this;return t.size<e.size&&(t=e,e=this),e.forEach((n=>{t=t.add(n)})),t}isEqual(e){if(!(e instanceof ht)||this.size!==e.size)return!1;const t=this.data.getIterator(),n=e.data.getIterator();for(;t.hasNext();){const i=t.getNext().key,s=n.getNext().key;if(this.comparator(i,s)!==0)return!1}return!0}toArray(){const e=[];return this.forEach((t=>{e.push(t)})),e}toString(){const e=[];return this.forEach((t=>e.push(t))),"SortedSet("+e.toString()+")"}copy(e){const t=new ht(this.comparator);return t.data=e,t}}class Yh{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}class qt{constructor(e){this.fields=e,e.sort(bt.comparator)}static empty(){return new qt([])}unionWith(e){let t=new ht(bt.comparator);for(const n of this.fields)t=t.add(n);for(const n of e)t=t.add(n);return new qt(t.toArray())}covers(e){for(const t of this.fields)if(t.isPrefixOf(e))return!0;return!1}isEqual(e){return Xi(this.fields,e.fields,((t,n)=>t.isEqual(n)))}}class ym extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}class vt{constructor(e){this.binaryString=e}static fromBase64String(e){const t=(function(i){try{return atob(i)}catch(s){throw typeof DOMException<"u"&&s instanceof DOMException?new ym("Invalid base64 string: "+s):s}})(e);return new vt(t)}static fromUint8Array(e){const t=(function(i){let s="";for(let o=0;o<i.length;++o)s+=String.fromCharCode(i[o]);return s})(e);return new vt(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return(function(t){return btoa(t)})(this.binaryString)}toUint8Array(){return(function(t){const n=new Uint8Array(t.length);for(let i=0;i<t.length;i++)n[i]=t.charCodeAt(i);return n})(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return Te(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}vt.EMPTY_BYTE_STRING=new vt("");const Tw=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function In(r){if(Se(!!r,39018),typeof r=="string"){let e=0;const t=Tw.exec(r);if(Se(!!t,46558,{timestamp:r}),t[1]){let i=t[1];i=(i+"000000000").substr(0,9),e=Number(i)}const n=new Date(r);return{seconds:Math.floor(n.getTime()/1e3),nanos:e}}return{seconds:Ze(r.seconds),nanos:Ze(r.nanos)}}function Ze(r){return typeof r=="number"?r:typeof r=="string"?Number(r):0}function Cn(r){return typeof r=="string"?vt.fromBase64String(r):vt.fromUint8Array(r)}const wm="server_timestamp",bm="__type__",vm="__previous_value__",km="__local_write_time__";function $u(r){return(r?.mapValue?.fields||{})[bm]?.stringValue===wm}function il(r){const e=r.mapValue.fields[vm];return $u(e)?il(e):e}function lo(r){const e=In(r.mapValue.fields[km].timestampValue);return new Ge(e.seconds,e.nanos)}class xw{constructor(e,t,n,i,s,o,c,l,u,f,d){this.databaseId=e,this.appId=t,this.persistenceKey=n,this.host=i,this.ssl=s,this.forceLongPolling=o,this.autoDetectLongPolling=c,this.longPollingOptions=l,this.useFetchStreams=u,this.isUsingEmulator=f,this.apiKey=d}}const Na="(default)";class co{constructor(e,t){this.projectId=e,this.database=t||Na}static empty(){return new co("","")}get isDefaultDatabase(){return this.database===Na}isEqual(e){return e instanceof co&&e.projectId===this.projectId&&e.database===this.database}}function _w(r,e){if(!Object.prototype.hasOwnProperty.apply(r.options,["projectId"]))throw new ie(H.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new co(r.options.projectId,e)}const Tm="__type__",Ew="__max__",ea={mapValue:{}},xm="__vector__",Ba="value";function Sn(r){return"nullValue"in r?0:"booleanValue"in r?1:"integerValue"in r||"doubleValue"in r?2:"timestampValue"in r?3:"stringValue"in r?5:"bytesValue"in r?6:"referenceValue"in r?7:"geoPointValue"in r?8:"arrayValue"in r?9:"mapValue"in r?$u(r)?4:Iw(r)?9007199254740991:Aw(r)?10:11:he(28295,{value:r})}function Cr(r,e){if(r===e)return!0;const t=Sn(r);if(t!==Sn(e))return!1;switch(t){case 0:case 9007199254740991:return!0;case 1:return r.booleanValue===e.booleanValue;case 4:return lo(r).isEqual(lo(e));case 3:return(function(i,s){if(typeof i.timestampValue=="string"&&typeof s.timestampValue=="string"&&i.timestampValue.length===s.timestampValue.length)return i.timestampValue===s.timestampValue;const o=In(i.timestampValue),c=In(s.timestampValue);return o.seconds===c.seconds&&o.nanos===c.nanos})(r,e);case 5:return r.stringValue===e.stringValue;case 6:return(function(i,s){return Cn(i.bytesValue).isEqual(Cn(s.bytesValue))})(r,e);case 7:return r.referenceValue===e.referenceValue;case 8:return(function(i,s){return Ze(i.geoPointValue.latitude)===Ze(s.geoPointValue.latitude)&&Ze(i.geoPointValue.longitude)===Ze(s.geoPointValue.longitude)})(r,e);case 2:return(function(i,s){if("integerValue"in i&&"integerValue"in s)return Ze(i.integerValue)===Ze(s.integerValue);if("doubleValue"in i&&"doubleValue"in s){const o=Ze(i.doubleValue),c=Ze(s.doubleValue);return o===c?Da(o)===Da(c):isNaN(o)&&isNaN(c)}return!1})(r,e);case 9:return Xi(r.arrayValue.values||[],e.arrayValue.values||[],Cr);case 10:case 11:return(function(i,s){const o=i.mapValue.fields||{},c=s.mapValue.fields||{};if(Kh(o)!==Kh(c))return!1;for(const l in o)if(o.hasOwnProperty(l)&&(c[l]===void 0||!Cr(o[l],c[l])))return!1;return!0})(r,e);default:return he(52216,{left:r})}}function uo(r,e){return(r.values||[]).find((t=>Cr(t,e)))!==void 0}function es(r,e){if(r===e)return 0;const t=Sn(r),n=Sn(e);if(t!==n)return Te(t,n);switch(t){case 0:case 9007199254740991:return 0;case 1:return Te(r.booleanValue,e.booleanValue);case 2:return(function(s,o){const c=Ze(s.integerValue||s.doubleValue),l=Ze(o.integerValue||o.doubleValue);return c<l?-1:c>l?1:c===l?0:isNaN(c)?isNaN(l)?0:-1:1})(r,e);case 3:return Zh(r.timestampValue,e.timestampValue);case 4:return Zh(lo(r),lo(e));case 5:return Rc(r.stringValue,e.stringValue);case 6:return(function(s,o){const c=Cn(s),l=Cn(o);return c.compareTo(l)})(r.bytesValue,e.bytesValue);case 7:return(function(s,o){const c=s.split("/"),l=o.split("/");for(let u=0;u<c.length&&u<l.length;u++){const f=Te(c[u],l[u]);if(f!==0)return f}return Te(c.length,l.length)})(r.referenceValue,e.referenceValue);case 8:return(function(s,o){const c=Te(Ze(s.latitude),Ze(o.latitude));return c!==0?c:Te(Ze(s.longitude),Ze(o.longitude))})(r.geoPointValue,e.geoPointValue);case 9:return Jh(r.arrayValue,e.arrayValue);case 10:return(function(s,o){const c=s.fields||{},l=o.fields||{},u=c[Ba]?.arrayValue,f=l[Ba]?.arrayValue,d=Te(u?.values?.length||0,f?.values?.length||0);return d!==0?d:Jh(u,f)})(r.mapValue,e.mapValue);case 11:return(function(s,o){if(s===ea.mapValue&&o===ea.mapValue)return 0;if(s===ea.mapValue)return 1;if(o===ea.mapValue)return-1;const c=s.fields||{},l=Object.keys(c),u=o.fields||{},f=Object.keys(u);l.sort(),f.sort();for(let d=0;d<l.length&&d<f.length;++d){const h=Rc(l[d],f[d]);if(h!==0)return h;const p=es(c[l[d]],u[f[d]]);if(p!==0)return p}return Te(l.length,f.length)})(r.mapValue,e.mapValue);default:throw he(23264,{he:t})}}function Zh(r,e){if(typeof r=="string"&&typeof e=="string"&&r.length===e.length)return Te(r,e);const t=In(r),n=In(e),i=Te(t.seconds,n.seconds);return i!==0?i:Te(t.nanos,n.nanos)}function Jh(r,e){const t=r.values||[],n=e.values||[];for(let i=0;i<t.length&&i<n.length;++i){const s=es(t[i],n[i]);if(s)return s}return Te(t.length,n.length)}function ts(r){return Pc(r)}function Pc(r){return"nullValue"in r?"null":"booleanValue"in r?""+r.booleanValue:"integerValue"in r?""+r.integerValue:"doubleValue"in r?""+r.doubleValue:"timestampValue"in r?(function(t){const n=In(t);return`time(${n.seconds},${n.nanos})`})(r.timestampValue):"stringValue"in r?r.stringValue:"bytesValue"in r?(function(t){return Cn(t).toBase64()})(r.bytesValue):"referenceValue"in r?(function(t){return le.fromName(t).toString()})(r.referenceValue):"geoPointValue"in r?(function(t){return`geo(${t.latitude},${t.longitude})`})(r.geoPointValue):"arrayValue"in r?(function(t){let n="[",i=!0;for(const s of t.values||[])i?i=!1:n+=",",n+=Pc(s);return n+"]"})(r.arrayValue):"mapValue"in r?(function(t){const n=Object.keys(t.fields||{}).sort();let i="{",s=!0;for(const o of n)s?s=!1:i+=",",i+=`${o}:${Pc(t.fields[o])}`;return i+"}"})(r.mapValue):he(61005,{value:r})}function ga(r){switch(Sn(r)){case 0:case 1:return 4;case 2:return 8;case 3:case 8:return 16;case 4:const e=il(r);return e?16+ga(e):16;case 5:return 2*r.stringValue.length;case 6:return Cn(r.bytesValue).approximateByteSize();case 7:return r.referenceValue.length;case 9:return(function(n){return(n.values||[]).reduce(((i,s)=>i+ga(s)),0)})(r.arrayValue);case 10:case 11:return(function(n){let i=0;return Nn(n.fields,((s,o)=>{i+=s.length+ga(o)})),i})(r.mapValue);default:throw he(13486,{value:r})}}function Xh(r,e){return{referenceValue:`projects/${r.projectId}/databases/${r.database}/documents/${e.path.canonicalString()}`}}function Lc(r){return!!r&&"integerValue"in r}function yu(r){return!!r&&"arrayValue"in r}function ef(r){return!!r&&"nullValue"in r}function tf(r){return!!r&&"doubleValue"in r&&isNaN(Number(r.doubleValue))}function $a(r){return!!r&&"mapValue"in r}function Aw(r){return(r?.mapValue?.fields||{})[Tm]?.stringValue===xm}function Js(r){if(r.geoPointValue)return{geoPointValue:{...r.geoPointValue}};if(r.timestampValue&&typeof r.timestampValue=="object")return{timestampValue:{...r.timestampValue}};if(r.mapValue){const e={mapValue:{fields:{}}};return Nn(r.mapValue.fields,((t,n)=>e.mapValue.fields[t]=Js(n))),e}if(r.arrayValue){const e={arrayValue:{values:[]}};for(let t=0;t<(r.arrayValue.values||[]).length;++t)e.arrayValue.values[t]=Js(r.arrayValue.values[t]);return e}return{...r}}function Iw(r){return(((r.mapValue||{}).fields||{}).__type__||{}).stringValue===Ew}class Nt{constructor(e){this.value=e}static empty(){return new Nt({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let t=this.value;for(let n=0;n<e.length-1;++n)if(t=(t.mapValue.fields||{})[e.get(n)],!$a(t))return null;return t=(t.mapValue.fields||{})[e.lastSegment()],t||null}}set(e,t){this.getFieldsMap(e.popLast())[e.lastSegment()]=Js(t)}setAll(e){let t=bt.emptyPath(),n={},i=[];e.forEach(((o,c)=>{if(!t.isImmediateParentOf(c)){const l=this.getFieldsMap(t);this.applyChanges(l,n,i),n={},i=[],t=c.popLast()}o?n[c.lastSegment()]=Js(o):i.push(c.lastSegment())}));const s=this.getFieldsMap(t);this.applyChanges(s,n,i)}delete(e){const t=this.field(e.popLast());$a(t)&&t.mapValue.fields&&delete t.mapValue.fields[e.lastSegment()]}isEqual(e){return Cr(this.value,e.value)}getFieldsMap(e){let t=this.value;t.mapValue.fields||(t.mapValue={fields:{}});for(let n=0;n<e.length;++n){let i=t.mapValue.fields[e.get(n)];$a(i)&&i.mapValue.fields||(i={mapValue:{fields:{}}},t.mapValue.fields[e.get(n)]=i),t=i}return t.mapValue.fields}applyChanges(e,t,n){Nn(t,((i,s)=>e[i]=s));for(const i of n)delete e[i]}clone(){return new Nt(Js(this.value))}}function _m(r){const e=[];return Nn(r.fields,((t,n)=>{const i=new bt([t]);if($a(n)){const s=_m(n.mapValue).fields;if(s.length===0)e.push(i);else for(const o of s)e.push(i.child(o))}else e.push(i)})),new qt(e)}class At{constructor(e,t,n,i,s,o,c){this.key=e,this.documentType=t,this.version=n,this.readTime=i,this.createTime=s,this.data=o,this.documentState=c}static newInvalidDocument(e){return new At(e,0,pe.min(),pe.min(),pe.min(),Nt.empty(),0)}static newFoundDocument(e,t,n,i){return new At(e,1,t,pe.min(),n,i,0)}static newNoDocument(e,t){return new At(e,2,t,pe.min(),pe.min(),Nt.empty(),0)}static newUnknownDocument(e,t){return new At(e,3,t,pe.min(),pe.min(),Nt.empty(),2)}convertToFoundDocument(e,t){return!this.createTime.isEqual(pe.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=t,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=Nt.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=Nt.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=pe.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof At&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new At(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}class Oa{constructor(e,t){this.position=e,this.inclusive=t}}function rf(r,e,t){let n=0;for(let i=0;i<r.position.length;i++){const s=e[i],o=r.position[i];if(s.field.isKeyField()?n=le.comparator(le.fromName(o.referenceValue),t.key):n=es(o,t.data.field(s.field)),s.dir==="desc"&&(n*=-1),n!==0)break}return n}function nf(r,e){if(r===null)return e===null;if(e===null||r.inclusive!==e.inclusive||r.position.length!==e.position.length)return!1;for(let t=0;t<r.position.length;t++)if(!Cr(r.position[t],e.position[t]))return!1;return!0}class Fa{constructor(e,t="asc"){this.field=e,this.dir=t}}function Cw(r,e){return r.dir===e.dir&&r.field.isEqual(e.field)}class Em{}class rt extends Em{constructor(e,t,n){super(),this.field=e,this.op=t,this.value=n}static create(e,t,n){return e.isKeyField()?t==="in"||t==="not-in"?this.createKeyFieldInFilter(e,t,n):new Rw(e,t,n):t==="array-contains"?new Mw(e,n):t==="in"?new Vw(e,n):t==="not-in"?new Dw(e,n):t==="array-contains-any"?new Nw(e,n):new rt(e,t,n)}static createKeyFieldInFilter(e,t,n){return t==="in"?new Pw(e,n):new Lw(e,n)}matches(e){const t=e.data.field(this.field);return this.op==="!="?t!==null&&t.nullValue===void 0&&this.matchesComparison(es(t,this.value)):t!==null&&Sn(this.value)===Sn(t)&&this.matchesComparison(es(t,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return he(47266,{operator:this.op})}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class ur extends Em{constructor(e,t){super(),this.filters=e,this.op=t,this.Pe=null}static create(e,t){return new ur(e,t)}matches(e){return Am(this)?this.filters.find((t=>!t.matches(e)))===void 0:this.filters.find((t=>t.matches(e)))!==void 0}getFlattenedFilters(){return this.Pe!==null||(this.Pe=this.filters.reduce(((e,t)=>e.concat(t.getFlattenedFilters())),[])),this.Pe}getFilters(){return Object.assign([],this.filters)}}function Am(r){return r.op==="and"}function Im(r){return Sw(r)&&Am(r)}function Sw(r){for(const e of r.filters)if(e instanceof ur)return!1;return!0}function Mc(r){if(r instanceof rt)return r.field.canonicalString()+r.op.toString()+ts(r.value);if(Im(r))return r.filters.map((e=>Mc(e))).join(",");{const e=r.filters.map((t=>Mc(t))).join(",");return`${r.op}(${e})`}}function Cm(r,e){return r instanceof rt?(function(n,i){return i instanceof rt&&n.op===i.op&&n.field.isEqual(i.field)&&Cr(n.value,i.value)})(r,e):r instanceof ur?(function(n,i){return i instanceof ur&&n.op===i.op&&n.filters.length===i.filters.length?n.filters.reduce(((s,o,c)=>s&&Cm(o,i.filters[c])),!0):!1})(r,e):void he(19439)}function Sm(r){return r instanceof rt?(function(t){return`${t.field.canonicalString()} ${t.op} ${ts(t.value)}`})(r):r instanceof ur?(function(t){return t.op.toString()+" {"+t.getFilters().map(Sm).join(" ,")+"}"})(r):"Filter"}class Rw extends rt{constructor(e,t,n){super(e,t,n),this.key=le.fromName(n.referenceValue)}matches(e){const t=le.comparator(e.key,this.key);return this.matchesComparison(t)}}class Pw extends rt{constructor(e,t){super(e,"in",t),this.keys=Rm("in",t)}matches(e){return this.keys.some((t=>t.isEqual(e.key)))}}class Lw extends rt{constructor(e,t){super(e,"not-in",t),this.keys=Rm("not-in",t)}matches(e){return!this.keys.some((t=>t.isEqual(e.key)))}}function Rm(r,e){return(e.arrayValue?.values||[]).map((t=>le.fromName(t.referenceValue)))}class Mw extends rt{constructor(e,t){super(e,"array-contains",t)}matches(e){const t=e.data.field(this.field);return yu(t)&&uo(t.arrayValue,this.value)}}class Vw extends rt{constructor(e,t){super(e,"in",t)}matches(e){const t=e.data.field(this.field);return t!==null&&uo(this.value.arrayValue,t)}}class Dw extends rt{constructor(e,t){super(e,"not-in",t)}matches(e){if(uo(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const t=e.data.field(this.field);return t!==null&&t.nullValue===void 0&&!uo(this.value.arrayValue,t)}}class Nw extends rt{constructor(e,t){super(e,"array-contains-any",t)}matches(e){const t=e.data.field(this.field);return!(!yu(t)||!t.arrayValue.values)&&t.arrayValue.values.some((n=>uo(this.value.arrayValue,n)))}}class Bw{constructor(e,t=null,n=[],i=[],s=null,o=null,c=null){this.path=e,this.collectionGroup=t,this.orderBy=n,this.filters=i,this.limit=s,this.startAt=o,this.endAt=c,this.Te=null}}function sf(r,e=null,t=[],n=[],i=null,s=null,o=null){return new Bw(r,e,t,n,i,s,o)}function wu(r){const e=ge(r);if(e.Te===null){let t=e.path.canonicalString();e.collectionGroup!==null&&(t+="|cg:"+e.collectionGroup),t+="|f:",t+=e.filters.map((n=>Mc(n))).join(","),t+="|ob:",t+=e.orderBy.map((n=>(function(s){return s.field.canonicalString()+s.dir})(n))).join(","),nl(e.limit)||(t+="|l:",t+=e.limit),e.startAt&&(t+="|lb:",t+=e.startAt.inclusive?"b:":"a:",t+=e.startAt.position.map((n=>ts(n))).join(",")),e.endAt&&(t+="|ub:",t+=e.endAt.inclusive?"a:":"b:",t+=e.endAt.position.map((n=>ts(n))).join(",")),e.Te=t}return e.Te}function bu(r,e){if(r.limit!==e.limit||r.orderBy.length!==e.orderBy.length)return!1;for(let t=0;t<r.orderBy.length;t++)if(!Cw(r.orderBy[t],e.orderBy[t]))return!1;if(r.filters.length!==e.filters.length)return!1;for(let t=0;t<r.filters.length;t++)if(!Cm(r.filters[t],e.filters[t]))return!1;return r.collectionGroup===e.collectionGroup&&!!r.path.isEqual(e.path)&&!!nf(r.startAt,e.startAt)&&nf(r.endAt,e.endAt)}function Vc(r){return le.isDocumentKey(r.path)&&r.collectionGroup===null&&r.filters.length===0}class Co{constructor(e,t=null,n=[],i=[],s=null,o="F",c=null,l=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=n,this.filters=i,this.limit=s,this.limitType=o,this.startAt=c,this.endAt=l,this.Ie=null,this.Ee=null,this.Re=null,this.startAt,this.endAt}}function Ow(r,e,t,n,i,s,o,c){return new Co(r,e,t,n,i,s,o,c)}function sl(r){return new Co(r)}function of(r){return r.filters.length===0&&r.limit===null&&r.startAt==null&&r.endAt==null&&(r.explicitOrderBy.length===0||r.explicitOrderBy.length===1&&r.explicitOrderBy[0].field.isKeyField())}function Fw(r){return le.isDocumentKey(r.path)&&r.collectionGroup===null&&r.filters.length===0}function Pm(r){return r.collectionGroup!==null}function Xs(r){const e=ge(r);if(e.Ie===null){e.Ie=[];const t=new Set;for(const s of e.explicitOrderBy)e.Ie.push(s),t.add(s.field.canonicalString());const n=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(o){let c=new ht(bt.comparator);return o.filters.forEach((l=>{l.getFlattenedFilters().forEach((u=>{u.isInequality()&&(c=c.add(u.field))}))})),c})(e).forEach((s=>{t.has(s.canonicalString())||s.isKeyField()||e.Ie.push(new Fa(s,n))})),t.has(bt.keyField().canonicalString())||e.Ie.push(new Fa(bt.keyField(),n))}return e.Ie}function xr(r){const e=ge(r);return e.Ee||(e.Ee=zw(e,Xs(r))),e.Ee}function zw(r,e){if(r.limitType==="F")return sf(r.path,r.collectionGroup,e,r.filters,r.limit,r.startAt,r.endAt);{e=e.map((i=>{const s=i.dir==="desc"?"asc":"desc";return new Fa(i.field,s)}));const t=r.endAt?new Oa(r.endAt.position,r.endAt.inclusive):null,n=r.startAt?new Oa(r.startAt.position,r.startAt.inclusive):null;return sf(r.path,r.collectionGroup,e,r.filters,r.limit,t,n)}}function Dc(r,e){const t=r.filters.concat([e]);return new Co(r.path,r.collectionGroup,r.explicitOrderBy.slice(),t,r.limit,r.limitType,r.startAt,r.endAt)}function Nc(r,e,t){return new Co(r.path,r.collectionGroup,r.explicitOrderBy.slice(),r.filters.slice(),e,t,r.startAt,r.endAt)}function ol(r,e){return bu(xr(r),xr(e))&&r.limitType===e.limitType}function Lm(r){return`${wu(xr(r))}|lt:${r.limitType}`}function Ci(r){return`Query(target=${(function(t){let n=t.path.canonicalString();return t.collectionGroup!==null&&(n+=" collectionGroup="+t.collectionGroup),t.filters.length>0&&(n+=`, filters: [${t.filters.map((i=>Sm(i))).join(", ")}]`),nl(t.limit)||(n+=", limit: "+t.limit),t.orderBy.length>0&&(n+=`, orderBy: [${t.orderBy.map((i=>(function(o){return`${o.field.canonicalString()} (${o.dir})`})(i))).join(", ")}]`),t.startAt&&(n+=", startAt: ",n+=t.startAt.inclusive?"b:":"a:",n+=t.startAt.position.map((i=>ts(i))).join(",")),t.endAt&&(n+=", endAt: ",n+=t.endAt.inclusive?"a:":"b:",n+=t.endAt.position.map((i=>ts(i))).join(",")),`Target(${n})`})(xr(r))}; limitType=${r.limitType})`}function al(r,e){return e.isFoundDocument()&&(function(n,i){const s=i.key.path;return n.collectionGroup!==null?i.key.hasCollectionId(n.collectionGroup)&&n.path.isPrefixOf(s):le.isDocumentKey(n.path)?n.path.isEqual(s):n.path.isImmediateParentOf(s)})(r,e)&&(function(n,i){for(const s of Xs(n))if(!s.field.isKeyField()&&i.data.field(s.field)===null)return!1;return!0})(r,e)&&(function(n,i){for(const s of n.filters)if(!s.matches(i))return!1;return!0})(r,e)&&(function(n,i){return!(n.startAt&&!(function(o,c,l){const u=rf(o,c,l);return o.inclusive?u<=0:u<0})(n.startAt,Xs(n),i)||n.endAt&&!(function(o,c,l){const u=rf(o,c,l);return o.inclusive?u>=0:u>0})(n.endAt,Xs(n),i))})(r,e)}function qw(r){return r.collectionGroup||(r.path.length%2==1?r.path.lastSegment():r.path.get(r.path.length-2))}function Mm(r){return(e,t)=>{let n=!1;for(const i of Xs(r)){const s=Gw(i,e,t);if(s!==0)return s;n=n||i.field.isKeyField()}return 0}}function Gw(r,e,t){const n=r.field.isKeyField()?le.comparator(e.key,t.key):(function(s,o,c){const l=o.data.field(s),u=c.data.field(s);return l!==null&&u!==null?es(l,u):he(42886)})(r.field,e,t);switch(r.dir){case"asc":return n;case"desc":return-1*n;default:return he(19790,{direction:r.dir})}}class mi{constructor(e,t){this.mapKeyFn=e,this.equalsFn=t,this.inner={},this.innerSize=0}get(e){const t=this.mapKeyFn(e),n=this.inner[t];if(n!==void 0){for(const[i,s]of n)if(this.equalsFn(i,e))return s}}has(e){return this.get(e)!==void 0}set(e,t){const n=this.mapKeyFn(e),i=this.inner[n];if(i===void 0)return this.inner[n]=[[e,t]],void this.innerSize++;for(let s=0;s<i.length;s++)if(this.equalsFn(i[s][0],e))return void(i[s]=[e,t]);i.push([e,t]),this.innerSize++}delete(e){const t=this.mapKeyFn(e),n=this.inner[t];if(n===void 0)return!1;for(let i=0;i<n.length;i++)if(this.equalsFn(n[i][0],e))return n.length===1?delete this.inner[t]:n.splice(i,1),this.innerSize--,!0;return!1}forEach(e){Nn(this.inner,((t,n)=>{for(const[i,s]of n)e(i,s)}))}isEmpty(){return $m(this.inner)}size(){return this.innerSize}}const Uw=new je(le.comparator);function Wr(){return Uw}const Vm=new je(le.comparator);function Hs(...r){let e=Vm;for(const t of r)e=e.insert(t.key,t);return e}function Dm(r){let e=Vm;return r.forEach(((t,n)=>e=e.insert(t,n.overlayedDocument))),e}function Jn(){return eo()}function Nm(){return eo()}function eo(){return new mi((r=>r.toString()),((r,e)=>r.isEqual(e)))}const Hw=new je(le.comparator),jw=new ht(le.comparator);function xe(...r){let e=jw;for(const t of r)e=e.add(t);return e}const Ww=new ht(Te);function Qw(){return Ww}function vu(r,e){if(r.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:Da(e)?"-0":e}}function Bm(r){return{integerValue:""+r}}function Kw(r,e){return bw(e)?Bm(e):vu(r,e)}class ll{constructor(){this._=void 0}}function Yw(r,e,t){return r instanceof ho?(function(i,s){const o={fields:{[bm]:{stringValue:wm},[km]:{timestampValue:{seconds:i.seconds,nanos:i.nanoseconds}}}};return s&&$u(s)&&(s=il(s)),s&&(o.fields[vm]=s),{mapValue:o}})(t,e):r instanceof rs?Fm(r,e):r instanceof fo?zm(r,e):(function(i,s){const o=Om(i,s),c=af(o)+af(i.Ae);return Lc(o)&&Lc(i.Ae)?Bm(c):vu(i.serializer,c)})(r,e)}function Zw(r,e,t){return r instanceof rs?Fm(r,e):r instanceof fo?zm(r,e):t}function Om(r,e){return r instanceof za?(function(n){return Lc(n)||(function(s){return!!s&&"doubleValue"in s})(n)})(e)?e:{integerValue:0}:null}class ho extends ll{}class rs extends ll{constructor(e){super(),this.elements=e}}function Fm(r,e){const t=qm(e);for(const n of r.elements)t.some((i=>Cr(i,n)))||t.push(n);return{arrayValue:{values:t}}}class fo extends ll{constructor(e){super(),this.elements=e}}function zm(r,e){let t=qm(e);for(const n of r.elements)t=t.filter((i=>!Cr(i,n)));return{arrayValue:{values:t}}}class za extends ll{constructor(e,t){super(),this.serializer=e,this.Ae=t}}function af(r){return Ze(r.integerValue||r.doubleValue)}function qm(r){return yu(r)&&r.arrayValue.values?r.arrayValue.values.slice():[]}class Gm{constructor(e,t){this.field=e,this.transform=t}}function Jw(r,e){return r.field.isEqual(e.field)&&(function(n,i){return n instanceof rs&&i instanceof rs||n instanceof fo&&i instanceof fo?Xi(n.elements,i.elements,Cr):n instanceof za&&i instanceof za?Cr(n.Ae,i.Ae):n instanceof ho&&i instanceof ho})(r.transform,e.transform)}class Xw{constructor(e,t){this.version=e,this.transformResults=t}}class sr{constructor(e,t){this.updateTime=e,this.exists=t}static none(){return new sr}static exists(e){return new sr(void 0,e)}static updateTime(e){return new sr(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function ya(r,e){return r.updateTime!==void 0?e.isFoundDocument()&&e.version.isEqual(r.updateTime):r.exists===void 0||r.exists===e.isFoundDocument()}class cl{}function Um(r,e){if(!r.hasLocalMutations||e&&e.fields.length===0)return null;if(e===null)return r.isNoDocument()?new ku(r.key,sr.none()):new So(r.key,r.data,sr.none());{const t=r.data,n=Nt.empty();let i=new ht(bt.comparator);for(let s of e.fields)if(!i.has(s)){let o=t.field(s);o===null&&s.length>1&&(s=s.popLast(),o=t.field(s)),o===null?n.delete(s):n.set(s,o),i=i.add(s)}return new Bn(r.key,n,new qt(i.toArray()),sr.none())}}function eb(r,e,t){r instanceof So?(function(i,s,o){const c=i.value.clone(),l=cf(i.fieldTransforms,s,o.transformResults);c.setAll(l),s.convertToFoundDocument(o.version,c).setHasCommittedMutations()})(r,e,t):r instanceof Bn?(function(i,s,o){if(!ya(i.precondition,s))return void s.convertToUnknownDocument(o.version);const c=cf(i.fieldTransforms,s,o.transformResults),l=s.data;l.setAll(Hm(i)),l.setAll(c),s.convertToFoundDocument(o.version,l).setHasCommittedMutations()})(r,e,t):(function(i,s,o){s.convertToNoDocument(o.version).setHasCommittedMutations()})(0,e,t)}function to(r,e,t,n){return r instanceof So?(function(s,o,c,l){if(!ya(s.precondition,o))return c;const u=s.value.clone(),f=uf(s.fieldTransforms,l,o);return u.setAll(f),o.convertToFoundDocument(o.version,u).setHasLocalMutations(),null})(r,e,t,n):r instanceof Bn?(function(s,o,c,l){if(!ya(s.precondition,o))return c;const u=uf(s.fieldTransforms,l,o),f=o.data;return f.setAll(Hm(s)),f.setAll(u),o.convertToFoundDocument(o.version,f).setHasLocalMutations(),c===null?null:c.unionWith(s.fieldMask.fields).unionWith(s.fieldTransforms.map((d=>d.field)))})(r,e,t,n):(function(s,o,c){return ya(s.precondition,o)?(o.convertToNoDocument(o.version).setHasLocalMutations(),null):c})(r,e,t)}function tb(r,e){let t=null;for(const n of r.fieldTransforms){const i=e.data.field(n.field),s=Om(n.transform,i||null);s!=null&&(t===null&&(t=Nt.empty()),t.set(n.field,s))}return t||null}function lf(r,e){return r.type===e.type&&!!r.key.isEqual(e.key)&&!!r.precondition.isEqual(e.precondition)&&!!(function(n,i){return n===void 0&&i===void 0||!(!n||!i)&&Xi(n,i,((s,o)=>Jw(s,o)))})(r.fieldTransforms,e.fieldTransforms)&&(r.type===0?r.value.isEqual(e.value):r.type!==1||r.data.isEqual(e.data)&&r.fieldMask.isEqual(e.fieldMask))}class So extends cl{constructor(e,t,n,i=[]){super(),this.key=e,this.value=t,this.precondition=n,this.fieldTransforms=i,this.type=0}getFieldMask(){return null}}class Bn extends cl{constructor(e,t,n,i,s=[]){super(),this.key=e,this.data=t,this.fieldMask=n,this.precondition=i,this.fieldTransforms=s,this.type=1}getFieldMask(){return this.fieldMask}}function Hm(r){const e=new Map;return r.fieldMask.fields.forEach((t=>{if(!t.isEmpty()){const n=r.data.field(t);e.set(t,n)}})),e}function cf(r,e,t){const n=new Map;Se(r.length===t.length,32656,{Ve:t.length,de:r.length});for(let i=0;i<t.length;i++){const s=r[i],o=s.transform,c=e.data.field(s.field);n.set(s.field,Zw(o,c,t[i]))}return n}function uf(r,e,t){const n=new Map;for(const i of r){const s=i.transform,o=t.data.field(i.field);n.set(i.field,Yw(s,o,e))}return n}class ku extends cl{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class rb extends cl{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}class nb{constructor(e,t,n,i){this.batchId=e,this.localWriteTime=t,this.baseMutations=n,this.mutations=i}applyToRemoteDocument(e,t){const n=t.mutationResults;for(let i=0;i<this.mutations.length;i++){const s=this.mutations[i];s.key.isEqual(e.key)&&eb(s,e,n[i])}}applyToLocalView(e,t){for(const n of this.baseMutations)n.key.isEqual(e.key)&&(t=to(n,e,t,this.localWriteTime));for(const n of this.mutations)n.key.isEqual(e.key)&&(t=to(n,e,t,this.localWriteTime));return t}applyToLocalDocumentSet(e,t){const n=Nm();return this.mutations.forEach((i=>{const s=e.get(i.key),o=s.overlayedDocument;let c=this.applyToLocalView(o,s.mutatedFields);c=t.has(i.key)?null:c;const l=Um(o,c);l!==null&&n.set(i.key,l),o.isValidDocument()||o.convertToNoDocument(pe.min())})),n}keys(){return this.mutations.reduce(((e,t)=>e.add(t.key)),xe())}isEqual(e){return this.batchId===e.batchId&&Xi(this.mutations,e.mutations,((t,n)=>lf(t,n)))&&Xi(this.baseMutations,e.baseMutations,((t,n)=>lf(t,n)))}}class Tu{constructor(e,t,n,i){this.batch=e,this.commitVersion=t,this.mutationResults=n,this.docVersions=i}static from(e,t,n){Se(e.mutations.length===n.length,58842,{me:e.mutations.length,fe:n.length});let i=(function(){return Hw})();const s=e.mutations;for(let o=0;o<s.length;o++)i=i.insert(s[o].key,n[o].version);return new Tu(e,t,n,i)}}class ib{constructor(e,t){this.largestBatchId=e,this.mutation=t}getKey(){return this.mutation.key}isEqual(e){return e!==null&&this.mutation===e.mutation}toString(){return`Overlay{
      largestBatchId: ${this.largestBatchId},
      mutation: ${this.mutation.toString()}
    }`}}class sb{constructor(e,t){this.count=e,this.unchangedNames=t}}var et,Ee;function ob(r){switch(r){case H.OK:return he(64938);case H.CANCELLED:case H.UNKNOWN:case H.DEADLINE_EXCEEDED:case H.RESOURCE_EXHAUSTED:case H.INTERNAL:case H.UNAVAILABLE:case H.UNAUTHENTICATED:return!1;case H.INVALID_ARGUMENT:case H.NOT_FOUND:case H.ALREADY_EXISTS:case H.PERMISSION_DENIED:case H.FAILED_PRECONDITION:case H.ABORTED:case H.OUT_OF_RANGE:case H.UNIMPLEMENTED:case H.DATA_LOSS:return!0;default:return he(15467,{code:r})}}function jm(r){if(r===void 0)return jr("GRPC error has no .code"),H.UNKNOWN;switch(r){case et.OK:return H.OK;case et.CANCELLED:return H.CANCELLED;case et.UNKNOWN:return H.UNKNOWN;case et.DEADLINE_EXCEEDED:return H.DEADLINE_EXCEEDED;case et.RESOURCE_EXHAUSTED:return H.RESOURCE_EXHAUSTED;case et.INTERNAL:return H.INTERNAL;case et.UNAVAILABLE:return H.UNAVAILABLE;case et.UNAUTHENTICATED:return H.UNAUTHENTICATED;case et.INVALID_ARGUMENT:return H.INVALID_ARGUMENT;case et.NOT_FOUND:return H.NOT_FOUND;case et.ALREADY_EXISTS:return H.ALREADY_EXISTS;case et.PERMISSION_DENIED:return H.PERMISSION_DENIED;case et.FAILED_PRECONDITION:return H.FAILED_PRECONDITION;case et.ABORTED:return H.ABORTED;case et.OUT_OF_RANGE:return H.OUT_OF_RANGE;case et.UNIMPLEMENTED:return H.UNIMPLEMENTED;case et.DATA_LOSS:return H.DATA_LOSS;default:return he(39323,{code:r})}}(Ee=et||(et={}))[Ee.OK=0]="OK",Ee[Ee.CANCELLED=1]="CANCELLED",Ee[Ee.UNKNOWN=2]="UNKNOWN",Ee[Ee.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",Ee[Ee.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",Ee[Ee.NOT_FOUND=5]="NOT_FOUND",Ee[Ee.ALREADY_EXISTS=6]="ALREADY_EXISTS",Ee[Ee.PERMISSION_DENIED=7]="PERMISSION_DENIED",Ee[Ee.UNAUTHENTICATED=16]="UNAUTHENTICATED",Ee[Ee.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",Ee[Ee.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",Ee[Ee.ABORTED=10]="ABORTED",Ee[Ee.OUT_OF_RANGE=11]="OUT_OF_RANGE",Ee[Ee.UNIMPLEMENTED=12]="UNIMPLEMENTED",Ee[Ee.INTERNAL=13]="INTERNAL",Ee[Ee.UNAVAILABLE=14]="UNAVAILABLE",Ee[Ee.DATA_LOSS=15]="DATA_LOSS";function ab(){return new TextEncoder}const lb=new Tn([4294967295,4294967295],0);function df(r){const e=ab().encode(r),t=new om;return t.update(e),new Uint8Array(t.digest())}function hf(r){const e=new DataView(r.buffer),t=e.getUint32(0,!0),n=e.getUint32(4,!0),i=e.getUint32(8,!0),s=e.getUint32(12,!0);return[new Tn([t,n],0),new Tn([i,s],0)]}class xu{constructor(e,t,n){if(this.bitmap=e,this.padding=t,this.hashCount=n,t<0||t>=8)throw new js(`Invalid padding: ${t}`);if(n<0)throw new js(`Invalid hash count: ${n}`);if(e.length>0&&this.hashCount===0)throw new js(`Invalid hash count: ${n}`);if(e.length===0&&t!==0)throw new js(`Invalid padding when bitmap length is 0: ${t}`);this.ge=8*e.length-t,this.pe=Tn.fromNumber(this.ge)}ye(e,t,n){let i=e.add(t.multiply(Tn.fromNumber(n)));return i.compare(lb)===1&&(i=new Tn([i.getBits(0),i.getBits(1)],0)),i.modulo(this.pe).toNumber()}we(e){return!!(this.bitmap[Math.floor(e/8)]&1<<e%8)}mightContain(e){if(this.ge===0)return!1;const t=df(e),[n,i]=hf(t);for(let s=0;s<this.hashCount;s++){const o=this.ye(n,i,s);if(!this.we(o))return!1}return!0}static create(e,t,n){const i=e%8==0?0:8-e%8,s=new Uint8Array(Math.ceil(e/8)),o=new xu(s,i,t);return n.forEach((c=>o.insert(c))),o}insert(e){if(this.ge===0)return;const t=df(e),[n,i]=hf(t);for(let s=0;s<this.hashCount;s++){const o=this.ye(n,i,s);this.be(o)}}be(e){const t=Math.floor(e/8),n=e%8;this.bitmap[t]|=1<<n}}class js extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}class ul{constructor(e,t,n,i,s){this.snapshotVersion=e,this.targetChanges=t,this.targetMismatches=n,this.documentUpdates=i,this.resolvedLimboDocuments=s}static createSynthesizedRemoteEventForCurrentChange(e,t,n){const i=new Map;return i.set(e,Ro.createSynthesizedTargetChangeForCurrentChange(e,t,n)),new ul(pe.min(),i,new je(Te),Wr(),xe())}}class Ro{constructor(e,t,n,i,s){this.resumeToken=e,this.current=t,this.addedDocuments=n,this.modifiedDocuments=i,this.removedDocuments=s}static createSynthesizedTargetChangeForCurrentChange(e,t,n){return new Ro(n,t,xe(),xe(),xe())}}class wa{constructor(e,t,n,i){this.Se=e,this.removedTargetIds=t,this.key=n,this.De=i}}class Wm{constructor(e,t){this.targetId=e,this.Ce=t}}class Qm{constructor(e,t,n=vt.EMPTY_BYTE_STRING,i=null){this.state=e,this.targetIds=t,this.resumeToken=n,this.cause=i}}class ff{constructor(){this.ve=0,this.Fe=pf(),this.Me=vt.EMPTY_BYTE_STRING,this.xe=!1,this.Oe=!0}get current(){return this.xe}get resumeToken(){return this.Me}get Ne(){return this.ve!==0}get Be(){return this.Oe}Le(e){e.approximateByteSize()>0&&(this.Oe=!0,this.Me=e)}ke(){let e=xe(),t=xe(),n=xe();return this.Fe.forEach(((i,s)=>{switch(s){case 0:e=e.add(i);break;case 2:t=t.add(i);break;case 1:n=n.add(i);break;default:he(38017,{changeType:s})}})),new Ro(this.Me,this.xe,e,t,n)}Ke(){this.Oe=!1,this.Fe=pf()}qe(e,t){this.Oe=!0,this.Fe=this.Fe.insert(e,t)}Ue(e){this.Oe=!0,this.Fe=this.Fe.remove(e)}$e(){this.ve+=1}We(){this.ve-=1,Se(this.ve>=0,3241,{ve:this.ve})}Qe(){this.Oe=!0,this.xe=!0}}class cb{constructor(e){this.Ge=e,this.ze=new Map,this.je=Wr(),this.He=ta(),this.Je=ta(),this.Ze=new je(Te)}Xe(e){for(const t of e.Se)e.De&&e.De.isFoundDocument()?this.Ye(t,e.De):this.et(t,e.key,e.De);for(const t of e.removedTargetIds)this.et(t,e.key,e.De)}tt(e){this.forEachTarget(e,(t=>{const n=this.nt(t);switch(e.state){case 0:this.rt(t)&&n.Le(e.resumeToken);break;case 1:n.We(),n.Ne||n.Ke(),n.Le(e.resumeToken);break;case 2:n.We(),n.Ne||this.removeTarget(t);break;case 3:this.rt(t)&&(n.Qe(),n.Le(e.resumeToken));break;case 4:this.rt(t)&&(this.it(t),n.Le(e.resumeToken));break;default:he(56790,{state:e.state})}}))}forEachTarget(e,t){e.targetIds.length>0?e.targetIds.forEach(t):this.ze.forEach(((n,i)=>{this.rt(i)&&t(i)}))}st(e){const t=e.targetId,n=e.Ce.count,i=this.ot(t);if(i){const s=i.target;if(Vc(s))if(n===0){const o=new le(s.path);this.et(t,o,At.newNoDocument(o,pe.min()))}else Se(n===1,20013,{expectedCount:n});else{const o=this._t(t);if(o!==n){const c=this.ut(e),l=c?this.ct(c,e,o):1;if(l!==0){this.it(t);const u=l===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.Ze=this.Ze.insert(t,u)}}}}}ut(e){const t=e.Ce.unchangedNames;if(!t||!t.bits)return null;const{bits:{bitmap:n="",padding:i=0},hashCount:s=0}=t;let o,c;try{o=Cn(n).toUint8Array()}catch(l){if(l instanceof ym)return ci("Decoding the base64 bloom filter in existence filter failed ("+l.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw l}try{c=new xu(o,i,s)}catch(l){return ci(l instanceof js?"BloomFilter error: ":"Applying bloom filter failed: ",l),null}return c.ge===0?null:c}ct(e,t,n){return t.Ce.count===n-this.Pt(e,t.targetId)?0:2}Pt(e,t){const n=this.Ge.getRemoteKeysForTarget(t);let i=0;return n.forEach((s=>{const o=this.Ge.ht(),c=`projects/${o.projectId}/databases/${o.database}/documents/${s.path.canonicalString()}`;e.mightContain(c)||(this.et(t,s,null),i++)})),i}Tt(e){const t=new Map;this.ze.forEach(((s,o)=>{const c=this.ot(o);if(c){if(s.current&&Vc(c.target)){const l=new le(c.target.path);this.It(l).has(o)||this.Et(o,l)||this.et(o,l,At.newNoDocument(l,e))}s.Be&&(t.set(o,s.ke()),s.Ke())}}));let n=xe();this.Je.forEach(((s,o)=>{let c=!0;o.forEachWhile((l=>{const u=this.ot(l);return!u||u.purpose==="TargetPurposeLimboResolution"||(c=!1,!1)})),c&&(n=n.add(s))})),this.je.forEach(((s,o)=>o.setReadTime(e)));const i=new ul(e,t,this.Ze,this.je,n);return this.je=Wr(),this.He=ta(),this.Je=ta(),this.Ze=new je(Te),i}Ye(e,t){if(!this.rt(e))return;const n=this.Et(e,t.key)?2:0;this.nt(e).qe(t.key,n),this.je=this.je.insert(t.key,t),this.He=this.He.insert(t.key,this.It(t.key).add(e)),this.Je=this.Je.insert(t.key,this.Rt(t.key).add(e))}et(e,t,n){if(!this.rt(e))return;const i=this.nt(e);this.Et(e,t)?i.qe(t,1):i.Ue(t),this.Je=this.Je.insert(t,this.Rt(t).delete(e)),this.Je=this.Je.insert(t,this.Rt(t).add(e)),n&&(this.je=this.je.insert(t,n))}removeTarget(e){this.ze.delete(e)}_t(e){const t=this.nt(e).ke();return this.Ge.getRemoteKeysForTarget(e).size+t.addedDocuments.size-t.removedDocuments.size}$e(e){this.nt(e).$e()}nt(e){let t=this.ze.get(e);return t||(t=new ff,this.ze.set(e,t)),t}Rt(e){let t=this.Je.get(e);return t||(t=new ht(Te),this.Je=this.Je.insert(e,t)),t}It(e){let t=this.He.get(e);return t||(t=new ht(Te),this.He=this.He.insert(e,t)),t}rt(e){const t=this.ot(e)!==null;return t||oe("WatchChangeAggregator","Detected inactive target",e),t}ot(e){const t=this.ze.get(e);return t&&t.Ne?null:this.Ge.At(e)}it(e){this.ze.set(e,new ff),this.Ge.getRemoteKeysForTarget(e).forEach((t=>{this.et(e,t,null)}))}Et(e,t){return this.Ge.getRemoteKeysForTarget(e).has(t)}}function ta(){return new je(le.comparator)}function pf(){return new je(le.comparator)}const ub={asc:"ASCENDING",desc:"DESCENDING"},db={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},hb={and:"AND",or:"OR"};class fb{constructor(e,t){this.databaseId=e,this.useProto3Json=t}}function Bc(r,e){return r.useProto3Json||nl(e)?e:{value:e}}function qa(r,e){return r.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function Km(r,e){return r.useProto3Json?e.toBase64():e.toUint8Array()}function pb(r,e){return qa(r,e.toTimestamp())}function _r(r){return Se(!!r,49232),pe.fromTimestamp((function(t){const n=In(t);return new Ge(n.seconds,n.nanos)})(r))}function _u(r,e){return Oc(r,e).canonicalString()}function Oc(r,e){const t=(function(i){return new Oe(["projects",i.projectId,"databases",i.database])})(r).child("documents");return e===void 0?t:t.child(e)}function Ym(r){const e=Oe.fromString(r);return Se(tg(e),10190,{key:e.toString()}),e}function Fc(r,e){return _u(r.databaseId,e.path)}function rc(r,e){const t=Ym(e);if(t.get(1)!==r.databaseId.projectId)throw new ie(H.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+t.get(1)+" vs "+r.databaseId.projectId);if(t.get(3)!==r.databaseId.database)throw new ie(H.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+t.get(3)+" vs "+r.databaseId.database);return new le(Jm(t))}function Zm(r,e){return _u(r.databaseId,e)}function mb(r){const e=Ym(r);return e.length===4?Oe.emptyPath():Jm(e)}function zc(r){return new Oe(["projects",r.databaseId.projectId,"databases",r.databaseId.database]).canonicalString()}function Jm(r){return Se(r.length>4&&r.get(4)==="documents",29091,{key:r.toString()}),r.popFirst(5)}function mf(r,e,t){return{name:Fc(r,e),fields:t.value.mapValue.fields}}function gb(r,e){let t;if("targetChange"in e){e.targetChange;const n=(function(u){return u==="NO_CHANGE"?0:u==="ADD"?1:u==="REMOVE"?2:u==="CURRENT"?3:u==="RESET"?4:he(39313,{state:u})})(e.targetChange.targetChangeType||"NO_CHANGE"),i=e.targetChange.targetIds||[],s=(function(u,f){return u.useProto3Json?(Se(f===void 0||typeof f=="string",58123),vt.fromBase64String(f||"")):(Se(f===void 0||f instanceof Buffer||f instanceof Uint8Array,16193),vt.fromUint8Array(f||new Uint8Array))})(r,e.targetChange.resumeToken),o=e.targetChange.cause,c=o&&(function(u){const f=u.code===void 0?H.UNKNOWN:jm(u.code);return new ie(f,u.message||"")})(o);t=new Qm(n,i,s,c||null)}else if("documentChange"in e){e.documentChange;const n=e.documentChange;n.document,n.document.name,n.document.updateTime;const i=rc(r,n.document.name),s=_r(n.document.updateTime),o=n.document.createTime?_r(n.document.createTime):pe.min(),c=new Nt({mapValue:{fields:n.document.fields}}),l=At.newFoundDocument(i,s,o,c),u=n.targetIds||[],f=n.removedTargetIds||[];t=new wa(u,f,l.key,l)}else if("documentDelete"in e){e.documentDelete;const n=e.documentDelete;n.document;const i=rc(r,n.document),s=n.readTime?_r(n.readTime):pe.min(),o=At.newNoDocument(i,s),c=n.removedTargetIds||[];t=new wa([],c,o.key,o)}else if("documentRemove"in e){e.documentRemove;const n=e.documentRemove;n.document;const i=rc(r,n.document),s=n.removedTargetIds||[];t=new wa([],s,i,null)}else{if(!("filter"in e))return he(11601,{Vt:e});{e.filter;const n=e.filter;n.targetId;const{count:i=0,unchangedNames:s}=n,o=new sb(i,s),c=n.targetId;t=new Wm(c,o)}}return t}function $b(r,e){let t;if(e instanceof So)t={update:mf(r,e.key,e.value)};else if(e instanceof ku)t={delete:Fc(r,e.key)};else if(e instanceof Bn)t={update:mf(r,e.key,e.data),updateMask:Eb(e.fieldMask)};else{if(!(e instanceof rb))return he(16599,{dt:e.type});t={verify:Fc(r,e.key)}}return e.fieldTransforms.length>0&&(t.updateTransforms=e.fieldTransforms.map((n=>(function(s,o){const c=o.transform;if(c instanceof ho)return{fieldPath:o.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(c instanceof rs)return{fieldPath:o.field.canonicalString(),appendMissingElements:{values:c.elements}};if(c instanceof fo)return{fieldPath:o.field.canonicalString(),removeAllFromArray:{values:c.elements}};if(c instanceof za)return{fieldPath:o.field.canonicalString(),increment:c.Ae};throw he(20930,{transform:o.transform})})(0,n)))),e.precondition.isNone||(t.currentDocument=(function(i,s){return s.updateTime!==void 0?{updateTime:pb(i,s.updateTime)}:s.exists!==void 0?{exists:s.exists}:he(27497)})(r,e.precondition)),t}function yb(r,e){return r&&r.length>0?(Se(e!==void 0,14353),r.map((t=>(function(i,s){let o=i.updateTime?_r(i.updateTime):_r(s);return o.isEqual(pe.min())&&(o=_r(s)),new Xw(o,i.transformResults||[])})(t,e)))):[]}function wb(r,e){return{documents:[Zm(r,e.path)]}}function bb(r,e){const t={structuredQuery:{}},n=e.path;let i;e.collectionGroup!==null?(i=n,t.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(i=n.popLast(),t.structuredQuery.from=[{collectionId:n.lastSegment()}]),t.parent=Zm(r,i);const s=(function(u){if(u.length!==0)return eg(ur.create(u,"and"))})(e.filters);s&&(t.structuredQuery.where=s);const o=(function(u){if(u.length!==0)return u.map((f=>(function(h){return{field:Si(h.field),direction:Tb(h.dir)}})(f)))})(e.orderBy);o&&(t.structuredQuery.orderBy=o);const c=Bc(r,e.limit);return c!==null&&(t.structuredQuery.limit=c),e.startAt&&(t.structuredQuery.startAt=(function(u){return{before:u.inclusive,values:u.position}})(e.startAt)),e.endAt&&(t.structuredQuery.endAt=(function(u){return{before:!u.inclusive,values:u.position}})(e.endAt)),{ft:t,parent:i}}function vb(r){let e=mb(r.parent);const t=r.structuredQuery,n=t.from?t.from.length:0;let i=null;if(n>0){Se(n===1,65062);const f=t.from[0];f.allDescendants?i=f.collectionId:e=e.child(f.collectionId)}let s=[];t.where&&(s=(function(d){const h=Xm(d);return h instanceof ur&&Im(h)?h.getFilters():[h]})(t.where));let o=[];t.orderBy&&(o=(function(d){return d.map((h=>(function(g){return new Fa(Ri(g.field),(function(b){switch(b){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}})(g.direction))})(h)))})(t.orderBy));let c=null;t.limit&&(c=(function(d){let h;return h=typeof d=="object"?d.value:d,nl(h)?null:h})(t.limit));let l=null;t.startAt&&(l=(function(d){const h=!!d.before,p=d.values||[];return new Oa(p,h)})(t.startAt));let u=null;return t.endAt&&(u=(function(d){const h=!d.before,p=d.values||[];return new Oa(p,h)})(t.endAt)),Ow(e,i,o,s,c,"F",l,u)}function kb(r,e){const t=(function(i){switch(i){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return he(28987,{purpose:i})}})(e.purpose);return t==null?null:{"goog-listen-tags":t}}function Xm(r){return r.unaryFilter!==void 0?(function(t){switch(t.unaryFilter.op){case"IS_NAN":const n=Ri(t.unaryFilter.field);return rt.create(n,"==",{doubleValue:NaN});case"IS_NULL":const i=Ri(t.unaryFilter.field);return rt.create(i,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const s=Ri(t.unaryFilter.field);return rt.create(s,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const o=Ri(t.unaryFilter.field);return rt.create(o,"!=",{nullValue:"NULL_VALUE"});case"OPERATOR_UNSPECIFIED":return he(61313);default:return he(60726)}})(r):r.fieldFilter!==void 0?(function(t){return rt.create(Ri(t.fieldFilter.field),(function(i){switch(i){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";case"OPERATOR_UNSPECIFIED":return he(58110);default:return he(50506)}})(t.fieldFilter.op),t.fieldFilter.value)})(r):r.compositeFilter!==void 0?(function(t){return ur.create(t.compositeFilter.filters.map((n=>Xm(n))),(function(i){switch(i){case"AND":return"and";case"OR":return"or";default:return he(1026)}})(t.compositeFilter.op))})(r):he(30097,{filter:r})}function Tb(r){return ub[r]}function xb(r){return db[r]}function _b(r){return hb[r]}function Si(r){return{fieldPath:r.canonicalString()}}function Ri(r){return bt.fromServerFormat(r.fieldPath)}function eg(r){return r instanceof rt?(function(t){if(t.op==="=="){if(tf(t.value))return{unaryFilter:{field:Si(t.field),op:"IS_NAN"}};if(ef(t.value))return{unaryFilter:{field:Si(t.field),op:"IS_NULL"}}}else if(t.op==="!="){if(tf(t.value))return{unaryFilter:{field:Si(t.field),op:"IS_NOT_NAN"}};if(ef(t.value))return{unaryFilter:{field:Si(t.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:Si(t.field),op:xb(t.op),value:t.value}}})(r):r instanceof ur?(function(t){const n=t.getFilters().map((i=>eg(i)));return n.length===1?n[0]:{compositeFilter:{op:_b(t.op),filters:n}}})(r):he(54877,{filter:r})}function Eb(r){const e=[];return r.fields.forEach((t=>e.push(t.canonicalString()))),{fieldPaths:e}}function tg(r){return r.length>=4&&r.get(0)==="projects"&&r.get(2)==="databases"}function rg(r){return!!r&&typeof r._toProto=="function"&&r._protoValueType==="ProtoValue"}class yn{constructor(e,t,n,i,s=pe.min(),o=pe.min(),c=vt.EMPTY_BYTE_STRING,l=null){this.target=e,this.targetId=t,this.purpose=n,this.sequenceNumber=i,this.snapshotVersion=s,this.lastLimboFreeSnapshotVersion=o,this.resumeToken=c,this.expectedCount=l}withSequenceNumber(e){return new yn(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,t){return new yn(this.target,this.targetId,this.purpose,this.sequenceNumber,t,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new yn(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new yn(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}}class Ab{constructor(e){this.yt=e}}function Ib(r){const e=vb({parent:r.parent,structuredQuery:r.structuredQuery});return r.limitType==="LAST"?Nc(e,e.limit,"L"):e}class Cb{constructor(){this.Sn=new Sb}addToCollectionParentIndex(e,t){return this.Sn.add(t),W.resolve()}getCollectionParents(e,t){return W.resolve(this.Sn.getEntries(t))}addFieldIndex(e,t){return W.resolve()}deleteFieldIndex(e,t){return W.resolve()}deleteAllFieldIndexes(e){return W.resolve()}createTargetIndexes(e,t){return W.resolve()}getDocumentsMatchingTarget(e,t){return W.resolve(null)}getIndexType(e,t){return W.resolve(0)}getFieldIndexes(e,t){return W.resolve([])}getNextCollectionGroupToUpdate(e){return W.resolve(null)}getMinOffset(e,t){return W.resolve(An.min())}getMinOffsetFromCollectionGroup(e,t){return W.resolve(An.min())}updateCollectionGroup(e,t,n){return W.resolve()}updateIndexEntries(e,t){return W.resolve()}}class Sb{constructor(){this.index={}}add(e){const t=e.lastSegment(),n=e.popLast(),i=this.index[t]||new ht(Oe.comparator),s=!i.has(n);return this.index[t]=i.add(n),s}has(e){const t=e.lastSegment(),n=e.popLast(),i=this.index[t];return i&&i.has(n)}getEntries(e){return(this.index[e]||new ht(Oe.comparator)).toArray()}}const gf={didRun:!1,sequenceNumbersCollected:0,targetsRemoved:0,documentsRemoved:0},ng=41943040;class Dt{static withCacheSize(e){return new Dt(e,Dt.DEFAULT_COLLECTION_PERCENTILE,Dt.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT)}constructor(e,t,n){this.cacheSizeCollectionThreshold=e,this.percentileToCollect=t,this.maximumSequenceNumbersToCollect=n}}Dt.DEFAULT_COLLECTION_PERCENTILE=10,Dt.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT=1e3,Dt.DEFAULT=new Dt(ng,Dt.DEFAULT_COLLECTION_PERCENTILE,Dt.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT),Dt.DISABLED=new Dt(-1,0,0);class ns{constructor(e){this.sr=e}next(){return this.sr+=2,this.sr}static _r(){return new ns(0)}static ar(){return new ns(-1)}}const $f="LruGarbageCollector",Rb=1048576;function yf([r,e],[t,n]){const i=Te(r,t);return i===0?Te(e,n):i}class Pb{constructor(e){this.Pr=e,this.buffer=new ht(yf),this.Tr=0}Ir(){return++this.Tr}Er(e){const t=[e,this.Ir()];if(this.buffer.size<this.Pr)this.buffer=this.buffer.add(t);else{const n=this.buffer.last();yf(t,n)<0&&(this.buffer=this.buffer.delete(n).add(t))}}get maxValue(){return this.buffer.last()[0]}}class Lb{constructor(e,t,n){this.garbageCollector=e,this.asyncQueue=t,this.localStore=n,this.Rr=null}start(){this.garbageCollector.params.cacheSizeCollectionThreshold!==-1&&this.Ar(6e4)}stop(){this.Rr&&(this.Rr.cancel(),this.Rr=null)}get started(){return this.Rr!==null}Ar(e){oe($f,`Garbage collection scheduled in ${e}ms`),this.Rr=this.asyncQueue.enqueueAfterDelay("lru_garbage_collection",e,(async()=>{this.Rr=null;try{await this.localStore.collectGarbage(this.garbageCollector)}catch(t){$s(t)?oe($f,"Ignoring IndexedDB error during garbage collection: ",t):await gs(t)}await this.Ar(3e5)}))}}class Mb{constructor(e,t){this.Vr=e,this.params=t}calculateTargetCount(e,t){return this.Vr.dr(e).next((n=>Math.floor(t/100*n)))}nthSequenceNumber(e,t){if(t===0)return W.resolve(rl.ce);const n=new Pb(t);return this.Vr.forEachTarget(e,(i=>n.Er(i.sequenceNumber))).next((()=>this.Vr.mr(e,(i=>n.Er(i))))).next((()=>n.maxValue))}removeTargets(e,t,n){return this.Vr.removeTargets(e,t,n)}removeOrphanedDocuments(e,t){return this.Vr.removeOrphanedDocuments(e,t)}collect(e,t){return this.params.cacheSizeCollectionThreshold===-1?(oe("LruGarbageCollector","Garbage collection skipped; disabled"),W.resolve(gf)):this.getCacheSize(e).next((n=>n<this.params.cacheSizeCollectionThreshold?(oe("LruGarbageCollector",`Garbage collection skipped; Cache size ${n} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`),gf):this.gr(e,t)))}getCacheSize(e){return this.Vr.getCacheSize(e)}gr(e,t){let n,i,s,o,c,l,u;const f=Date.now();return this.calculateTargetCount(e,this.params.percentileToCollect).next((d=>(d>this.params.maximumSequenceNumbersToCollect?(oe("LruGarbageCollector",`Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${d}`),i=this.params.maximumSequenceNumbersToCollect):i=d,o=Date.now(),this.nthSequenceNumber(e,i)))).next((d=>(n=d,c=Date.now(),this.removeTargets(e,n,t)))).next((d=>(s=d,l=Date.now(),this.removeOrphanedDocuments(e,n)))).next((d=>(u=Date.now(),Ii()<=ve.DEBUG&&oe("LruGarbageCollector",`LRU Garbage Collection
	Counted targets in ${o-f}ms
	Determined least recently used ${i} in `+(c-o)+`ms
	Removed ${s} targets in `+(l-c)+`ms
	Removed ${d} documents in `+(u-l)+`ms
Total Duration: ${u-f}ms`),W.resolve({didRun:!0,sequenceNumbersCollected:i,targetsRemoved:s,documentsRemoved:d}))))}}function Vb(r,e){return new Mb(r,e)}class Db{constructor(){this.changes=new mi((e=>e.toString()),((e,t)=>e.isEqual(t))),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,t){this.assertNotApplied(),this.changes.set(e,At.newInvalidDocument(e).setReadTime(t))}getEntry(e,t){this.assertNotApplied();const n=this.changes.get(t);return n!==void 0?W.resolve(n):this.getFromCache(e,t)}getEntries(e,t){return this.getAllFromCache(e,t)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}class Nb{constructor(e,t){this.overlayedDocument=e,this.mutatedFields=t}}class Bb{constructor(e,t,n,i){this.remoteDocumentCache=e,this.mutationQueue=t,this.documentOverlayCache=n,this.indexManager=i}getDocument(e,t){let n=null;return this.documentOverlayCache.getOverlay(e,t).next((i=>(n=i,this.remoteDocumentCache.getEntry(e,t)))).next((i=>(n!==null&&to(n.mutation,i,qt.empty(),Ge.now()),i)))}getDocuments(e,t){return this.remoteDocumentCache.getEntries(e,t).next((n=>this.getLocalViewOfDocuments(e,n,xe()).next((()=>n))))}getLocalViewOfDocuments(e,t,n=xe()){const i=Jn();return this.populateOverlays(e,i,t).next((()=>this.computeViews(e,t,i,n).next((s=>{let o=Hs();return s.forEach(((c,l)=>{o=o.insert(c,l.overlayedDocument)})),o}))))}getOverlayedDocuments(e,t){const n=Jn();return this.populateOverlays(e,n,t).next((()=>this.computeViews(e,t,n,xe())))}populateOverlays(e,t,n){const i=[];return n.forEach((s=>{t.has(s)||i.push(s)})),this.documentOverlayCache.getOverlays(e,i).next((s=>{s.forEach(((o,c)=>{t.set(o,c)}))}))}computeViews(e,t,n,i){let s=Wr();const o=eo(),c=(function(){return eo()})();return t.forEach(((l,u)=>{const f=n.get(u.key);i.has(u.key)&&(f===void 0||f.mutation instanceof Bn)?s=s.insert(u.key,u):f!==void 0?(o.set(u.key,f.mutation.getFieldMask()),to(f.mutation,u,f.mutation.getFieldMask(),Ge.now())):o.set(u.key,qt.empty())})),this.recalculateAndSaveOverlays(e,s).next((l=>(l.forEach(((u,f)=>o.set(u,f))),t.forEach(((u,f)=>c.set(u,new Nb(f,o.get(u)??null)))),c)))}recalculateAndSaveOverlays(e,t){const n=eo();let i=new je(((o,c)=>o-c)),s=xe();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,t).next((o=>{for(const c of o)c.keys().forEach((l=>{const u=t.get(l);if(u===null)return;let f=n.get(l)||qt.empty();f=c.applyToLocalView(u,f),n.set(l,f);const d=(i.get(c.batchId)||xe()).add(l);i=i.insert(c.batchId,d)}))})).next((()=>{const o=[],c=i.getReverseIterator();for(;c.hasNext();){const l=c.getNext(),u=l.key,f=l.value,d=Nm();f.forEach((h=>{if(!s.has(h)){const p=Um(t.get(h),n.get(h));p!==null&&d.set(h,p),s=s.add(h)}})),o.push(this.documentOverlayCache.saveOverlays(e,u,d))}return W.waitFor(o)})).next((()=>n))}recalculateAndSaveOverlaysForDocumentKeys(e,t){return this.remoteDocumentCache.getEntries(e,t).next((n=>this.recalculateAndSaveOverlays(e,n)))}getDocumentsMatchingQuery(e,t,n,i){return Fw(t)?this.getDocumentsMatchingDocumentQuery(e,t.path):Pm(t)?this.getDocumentsMatchingCollectionGroupQuery(e,t,n,i):this.getDocumentsMatchingCollectionQuery(e,t,n,i)}getNextDocuments(e,t,n,i){return this.remoteDocumentCache.getAllFromCollectionGroup(e,t,n,i).next((s=>{const o=i-s.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,t,n.largestBatchId,i-s.size):W.resolve(Jn());let c=ao,l=s;return o.next((u=>W.forEach(u,((f,d)=>(c<d.largestBatchId&&(c=d.largestBatchId),s.get(f)?W.resolve():this.remoteDocumentCache.getEntry(e,f).next((h=>{l=l.insert(f,h)}))))).next((()=>this.populateOverlays(e,u,s))).next((()=>this.computeViews(e,l,u,xe()))).next((f=>({batchId:c,changes:Dm(f)})))))}))}getDocumentsMatchingDocumentQuery(e,t){return this.getDocument(e,new le(t)).next((n=>{let i=Hs();return n.isFoundDocument()&&(i=i.insert(n.key,n)),i}))}getDocumentsMatchingCollectionGroupQuery(e,t,n,i){const s=t.collectionGroup;let o=Hs();return this.indexManager.getCollectionParents(e,s).next((c=>W.forEach(c,(l=>{const u=(function(d,h){return new Co(h,null,d.explicitOrderBy.slice(),d.filters.slice(),d.limit,d.limitType,d.startAt,d.endAt)})(t,l.child(s));return this.getDocumentsMatchingCollectionQuery(e,u,n,i).next((f=>{f.forEach(((d,h)=>{o=o.insert(d,h)}))}))})).next((()=>o))))}getDocumentsMatchingCollectionQuery(e,t,n,i){let s;return this.documentOverlayCache.getOverlaysForCollection(e,t.path,n.largestBatchId).next((o=>(s=o,this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,n,s,i)))).next((o=>{s.forEach(((l,u)=>{const f=u.getKey();o.get(f)===null&&(o=o.insert(f,At.newInvalidDocument(f)))}));let c=Hs();return o.forEach(((l,u)=>{const f=s.get(l);f!==void 0&&to(f.mutation,u,qt.empty(),Ge.now()),al(t,u)&&(c=c.insert(l,u))})),c}))}}class Ob{constructor(e){this.serializer=e,this.Nr=new Map,this.Br=new Map}getBundleMetadata(e,t){return W.resolve(this.Nr.get(t))}saveBundleMetadata(e,t){return this.Nr.set(t.id,(function(i){return{id:i.id,version:i.version,createTime:_r(i.createTime)}})(t)),W.resolve()}getNamedQuery(e,t){return W.resolve(this.Br.get(t))}saveNamedQuery(e,t){return this.Br.set(t.name,(function(i){return{name:i.name,query:Ib(i.bundledQuery),readTime:_r(i.readTime)}})(t)),W.resolve()}}class Fb{constructor(){this.overlays=new je(le.comparator),this.Lr=new Map}getOverlay(e,t){return W.resolve(this.overlays.get(t))}getOverlays(e,t){const n=Jn();return W.forEach(t,(i=>this.getOverlay(e,i).next((s=>{s!==null&&n.set(i,s)})))).next((()=>n))}saveOverlays(e,t,n){return n.forEach(((i,s)=>{this.bt(e,t,s)})),W.resolve()}removeOverlaysForBatchId(e,t,n){const i=this.Lr.get(n);return i!==void 0&&(i.forEach((s=>this.overlays=this.overlays.remove(s))),this.Lr.delete(n)),W.resolve()}getOverlaysForCollection(e,t,n){const i=Jn(),s=t.length+1,o=new le(t.child("")),c=this.overlays.getIteratorFrom(o);for(;c.hasNext();){const l=c.getNext().value,u=l.getKey();if(!t.isPrefixOf(u.path))break;u.path.length===s&&l.largestBatchId>n&&i.set(l.getKey(),l)}return W.resolve(i)}getOverlaysForCollectionGroup(e,t,n,i){let s=new je(((u,f)=>u-f));const o=this.overlays.getIterator();for(;o.hasNext();){const u=o.getNext().value;if(u.getKey().getCollectionGroup()===t&&u.largestBatchId>n){let f=s.get(u.largestBatchId);f===null&&(f=Jn(),s=s.insert(u.largestBatchId,f)),f.set(u.getKey(),u)}}const c=Jn(),l=s.getIterator();for(;l.hasNext()&&(l.getNext().value.forEach(((u,f)=>c.set(u,f))),!(c.size()>=i)););return W.resolve(c)}bt(e,t,n){const i=this.overlays.get(n.key);if(i!==null){const o=this.Lr.get(i.largestBatchId).delete(n.key);this.Lr.set(i.largestBatchId,o)}this.overlays=this.overlays.insert(n.key,new ib(t,n));let s=this.Lr.get(t);s===void 0&&(s=xe(),this.Lr.set(t,s)),this.Lr.set(t,s.add(n.key))}}class zb{constructor(){this.sessionToken=vt.EMPTY_BYTE_STRING}getSessionToken(e){return W.resolve(this.sessionToken)}setSessionToken(e,t){return this.sessionToken=t,W.resolve()}}class Eu{constructor(){this.kr=new ht(mt.Kr),this.qr=new ht(mt.Ur)}isEmpty(){return this.kr.isEmpty()}addReference(e,t){const n=new mt(e,t);this.kr=this.kr.add(n),this.qr=this.qr.add(n)}$r(e,t){e.forEach((n=>this.addReference(n,t)))}removeReference(e,t){this.Wr(new mt(e,t))}Qr(e,t){e.forEach((n=>this.removeReference(n,t)))}Gr(e){const t=new le(new Oe([])),n=new mt(t,e),i=new mt(t,e+1),s=[];return this.qr.forEachInRange([n,i],(o=>{this.Wr(o),s.push(o.key)})),s}zr(){this.kr.forEach((e=>this.Wr(e)))}Wr(e){this.kr=this.kr.delete(e),this.qr=this.qr.delete(e)}jr(e){const t=new le(new Oe([])),n=new mt(t,e),i=new mt(t,e+1);let s=xe();return this.qr.forEachInRange([n,i],(o=>{s=s.add(o.key)})),s}containsKey(e){const t=new mt(e,0),n=this.kr.firstAfterOrEqual(t);return n!==null&&e.isEqual(n.key)}}class mt{constructor(e,t){this.key=e,this.Hr=t}static Kr(e,t){return le.comparator(e.key,t.key)||Te(e.Hr,t.Hr)}static Ur(e,t){return Te(e.Hr,t.Hr)||le.comparator(e.key,t.key)}}class qb{constructor(e,t){this.indexManager=e,this.referenceDelegate=t,this.mutationQueue=[],this.Yn=1,this.Jr=new ht(mt.Kr)}checkEmpty(e){return W.resolve(this.mutationQueue.length===0)}addMutationBatch(e,t,n,i){const s=this.Yn;this.Yn++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const o=new nb(s,t,n,i);this.mutationQueue.push(o);for(const c of i)this.Jr=this.Jr.add(new mt(c.key,s)),this.indexManager.addToCollectionParentIndex(e,c.key.path.popLast());return W.resolve(o)}lookupMutationBatch(e,t){return W.resolve(this.Zr(t))}getNextMutationBatchAfterBatchId(e,t){const n=t+1,i=this.Xr(n),s=i<0?0:i;return W.resolve(this.mutationQueue.length>s?this.mutationQueue[s]:null)}getHighestUnacknowledgedBatchId(){return W.resolve(this.mutationQueue.length===0?gu:this.Yn-1)}getAllMutationBatches(e){return W.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,t){const n=new mt(t,0),i=new mt(t,Number.POSITIVE_INFINITY),s=[];return this.Jr.forEachInRange([n,i],(o=>{const c=this.Zr(o.Hr);s.push(c)})),W.resolve(s)}getAllMutationBatchesAffectingDocumentKeys(e,t){let n=new ht(Te);return t.forEach((i=>{const s=new mt(i,0),o=new mt(i,Number.POSITIVE_INFINITY);this.Jr.forEachInRange([s,o],(c=>{n=n.add(c.Hr)}))})),W.resolve(this.Yr(n))}getAllMutationBatchesAffectingQuery(e,t){const n=t.path,i=n.length+1;let s=n;le.isDocumentKey(s)||(s=s.child(""));const o=new mt(new le(s),0);let c=new ht(Te);return this.Jr.forEachWhile((l=>{const u=l.key.path;return!!n.isPrefixOf(u)&&(u.length===i&&(c=c.add(l.Hr)),!0)}),o),W.resolve(this.Yr(c))}Yr(e){const t=[];return e.forEach((n=>{const i=this.Zr(n);i!==null&&t.push(i)})),t}removeMutationBatch(e,t){Se(this.ei(t.batchId,"removed")===0,55003),this.mutationQueue.shift();let n=this.Jr;return W.forEach(t.mutations,(i=>{const s=new mt(i.key,t.batchId);return n=n.delete(s),this.referenceDelegate.markPotentiallyOrphaned(e,i.key)})).next((()=>{this.Jr=n}))}nr(e){}containsKey(e,t){const n=new mt(t,0),i=this.Jr.firstAfterOrEqual(n);return W.resolve(t.isEqual(i&&i.key))}performConsistencyCheck(e){return this.mutationQueue.length,W.resolve()}ei(e,t){return this.Xr(e)}Xr(e){return this.mutationQueue.length===0?0:e-this.mutationQueue[0].batchId}Zr(e){const t=this.Xr(e);return t<0||t>=this.mutationQueue.length?null:this.mutationQueue[t]}}class Gb{constructor(e){this.ti=e,this.docs=(function(){return new je(le.comparator)})(),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,t){const n=t.key,i=this.docs.get(n),s=i?i.size:0,o=this.ti(t);return this.docs=this.docs.insert(n,{document:t.mutableCopy(),size:o}),this.size+=o-s,this.indexManager.addToCollectionParentIndex(e,n.path.popLast())}removeEntry(e){const t=this.docs.get(e);t&&(this.docs=this.docs.remove(e),this.size-=t.size)}getEntry(e,t){const n=this.docs.get(t);return W.resolve(n?n.document.mutableCopy():At.newInvalidDocument(t))}getEntries(e,t){let n=Wr();return t.forEach((i=>{const s=this.docs.get(i);n=n.insert(i,s?s.document.mutableCopy():At.newInvalidDocument(i))})),W.resolve(n)}getDocumentsMatchingQuery(e,t,n,i){let s=Wr();const o=t.path,c=new le(o.child("__id-9223372036854775808__")),l=this.docs.getIteratorFrom(c);for(;l.hasNext();){const{key:u,value:{document:f}}=l.getNext();if(!o.isPrefixOf(u.path))break;u.path.length>o.length+1||gw(mw(f),n)<=0||(i.has(f.key)||al(t,f))&&(s=s.insert(f.key,f.mutableCopy()))}return W.resolve(s)}getAllFromCollectionGroup(e,t,n,i){he(9500)}ni(e,t){return W.forEach(this.docs,(n=>t(n)))}newChangeBuffer(e){return new Ub(this)}getSize(e){return W.resolve(this.size)}}class Ub extends Db{constructor(e){super(),this.Mr=e}applyChanges(e){const t=[];return this.changes.forEach(((n,i)=>{i.isValidDocument()?t.push(this.Mr.addEntry(e,i)):this.Mr.removeEntry(n)})),W.waitFor(t)}getFromCache(e,t){return this.Mr.getEntry(e,t)}getAllFromCache(e,t){return this.Mr.getEntries(e,t)}}class Hb{constructor(e){this.persistence=e,this.ri=new mi((t=>wu(t)),bu),this.lastRemoteSnapshotVersion=pe.min(),this.highestTargetId=0,this.ii=0,this.si=new Eu,this.targetCount=0,this.oi=ns._r()}forEachTarget(e,t){return this.ri.forEach(((n,i)=>t(i))),W.resolve()}getLastRemoteSnapshotVersion(e){return W.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return W.resolve(this.ii)}allocateTargetId(e){return this.highestTargetId=this.oi.next(),W.resolve(this.highestTargetId)}setTargetsMetadata(e,t,n){return n&&(this.lastRemoteSnapshotVersion=n),t>this.ii&&(this.ii=t),W.resolve()}lr(e){this.ri.set(e.target,e);const t=e.targetId;t>this.highestTargetId&&(this.oi=new ns(t),this.highestTargetId=t),e.sequenceNumber>this.ii&&(this.ii=e.sequenceNumber)}addTargetData(e,t){return this.lr(t),this.targetCount+=1,W.resolve()}updateTargetData(e,t){return this.lr(t),W.resolve()}removeTargetData(e,t){return this.ri.delete(t.target),this.si.Gr(t.targetId),this.targetCount-=1,W.resolve()}removeTargets(e,t,n){let i=0;const s=[];return this.ri.forEach(((o,c)=>{c.sequenceNumber<=t&&n.get(c.targetId)===null&&(this.ri.delete(o),s.push(this.removeMatchingKeysForTargetId(e,c.targetId)),i++)})),W.waitFor(s).next((()=>i))}getTargetCount(e){return W.resolve(this.targetCount)}getTargetData(e,t){const n=this.ri.get(t)||null;return W.resolve(n)}addMatchingKeys(e,t,n){return this.si.$r(t,n),W.resolve()}removeMatchingKeys(e,t,n){this.si.Qr(t,n);const i=this.persistence.referenceDelegate,s=[];return i&&t.forEach((o=>{s.push(i.markPotentiallyOrphaned(e,o))})),W.waitFor(s)}removeMatchingKeysForTargetId(e,t){return this.si.Gr(t),W.resolve()}getMatchingKeysForTargetId(e,t){const n=this.si.jr(t);return W.resolve(n)}containsKey(e,t){return W.resolve(this.si.containsKey(t))}}class ig{constructor(e,t){this._i={},this.overlays={},this.ai=new rl(0),this.ui=!1,this.ui=!0,this.ci=new zb,this.referenceDelegate=e(this),this.li=new Hb(this),this.indexManager=new Cb,this.remoteDocumentCache=(function(i){return new Gb(i)})((n=>this.referenceDelegate.hi(n))),this.serializer=new Ab(t),this.Pi=new Ob(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.ui=!1,Promise.resolve()}get started(){return this.ui}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let t=this.overlays[e.toKey()];return t||(t=new Fb,this.overlays[e.toKey()]=t),t}getMutationQueue(e,t){let n=this._i[e.toKey()];return n||(n=new qb(t,this.referenceDelegate),this._i[e.toKey()]=n),n}getGlobalsCache(){return this.ci}getTargetCache(){return this.li}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.Pi}runTransaction(e,t,n){oe("MemoryPersistence","Starting transaction:",e);const i=new jb(this.ai.next());return this.referenceDelegate.Ti(),n(i).next((s=>this.referenceDelegate.Ii(i).next((()=>s)))).toPromise().then((s=>(i.raiseOnCommittedEvent(),s)))}Ei(e,t){return W.or(Object.values(this._i).map((n=>()=>n.containsKey(e,t))))}}class jb extends yw{constructor(e){super(),this.currentSequenceNumber=e}}class Au{constructor(e){this.persistence=e,this.Ri=new Eu,this.Ai=null}static Vi(e){return new Au(e)}get di(){if(this.Ai)return this.Ai;throw he(60996)}addReference(e,t,n){return this.Ri.addReference(n,t),this.di.delete(n.toString()),W.resolve()}removeReference(e,t,n){return this.Ri.removeReference(n,t),this.di.add(n.toString()),W.resolve()}markPotentiallyOrphaned(e,t){return this.di.add(t.toString()),W.resolve()}removeTarget(e,t){this.Ri.Gr(t.targetId).forEach((i=>this.di.add(i.toString())));const n=this.persistence.getTargetCache();return n.getMatchingKeysForTargetId(e,t.targetId).next((i=>{i.forEach((s=>this.di.add(s.toString())))})).next((()=>n.removeTargetData(e,t)))}Ti(){this.Ai=new Set}Ii(e){const t=this.persistence.getRemoteDocumentCache().newChangeBuffer();return W.forEach(this.di,(n=>{const i=le.fromPath(n);return this.mi(e,i).next((s=>{s||t.removeEntry(i,pe.min())}))})).next((()=>(this.Ai=null,t.apply(e))))}updateLimboDocument(e,t){return this.mi(e,t).next((n=>{n?this.di.delete(t.toString()):this.di.add(t.toString())}))}hi(e){return 0}mi(e,t){return W.or([()=>W.resolve(this.Ri.containsKey(t)),()=>this.persistence.getTargetCache().containsKey(e,t),()=>this.persistence.Ei(e,t)])}}class Ga{constructor(e,t){this.persistence=e,this.fi=new mi((n=>vw(n.path)),((n,i)=>n.isEqual(i))),this.garbageCollector=Vb(this,t)}static Vi(e,t){return new Ga(e,t)}Ti(){}Ii(e){return W.resolve()}forEachTarget(e,t){return this.persistence.getTargetCache().forEachTarget(e,t)}dr(e){const t=this.pr(e);return this.persistence.getTargetCache().getTargetCount(e).next((n=>t.next((i=>n+i))))}pr(e){let t=0;return this.mr(e,(n=>{t++})).next((()=>t))}mr(e,t){return W.forEach(this.fi,((n,i)=>this.wr(e,n,i).next((s=>s?W.resolve():t(i)))))}removeTargets(e,t,n){return this.persistence.getTargetCache().removeTargets(e,t,n)}removeOrphanedDocuments(e,t){let n=0;const i=this.persistence.getRemoteDocumentCache(),s=i.newChangeBuffer();return i.ni(e,(o=>this.wr(e,o,t).next((c=>{c||(n++,s.removeEntry(o,pe.min()))})))).next((()=>s.apply(e))).next((()=>n))}markPotentiallyOrphaned(e,t){return this.fi.set(t,e.currentSequenceNumber),W.resolve()}removeTarget(e,t){const n=t.withSequenceNumber(e.currentSequenceNumber);return this.persistence.getTargetCache().updateTargetData(e,n)}addReference(e,t,n){return this.fi.set(n,e.currentSequenceNumber),W.resolve()}removeReference(e,t,n){return this.fi.set(n,e.currentSequenceNumber),W.resolve()}updateLimboDocument(e,t){return this.fi.set(t,e.currentSequenceNumber),W.resolve()}hi(e){let t=e.key.toString().length;return e.isFoundDocument()&&(t+=ga(e.data.value)),t}wr(e,t,n){return W.or([()=>this.persistence.Ei(e,t),()=>this.persistence.getTargetCache().containsKey(e,t),()=>{const i=this.fi.get(t);return W.resolve(i!==void 0&&i>n)}])}getCacheSize(e){return this.persistence.getRemoteDocumentCache().getSize(e)}}class Iu{constructor(e,t,n,i){this.targetId=e,this.fromCache=t,this.Ts=n,this.Is=i}static Es(e,t){let n=xe(),i=xe();for(const s of t.docChanges)switch(s.type){case 0:n=n.add(s.doc.key);break;case 1:i=i.add(s.doc.key)}return new Iu(e,t.fromCache,n,i)}}class Wb{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}}class Qb{constructor(){this.Rs=!1,this.As=!1,this.Vs=100,this.ds=(function(){return k$()?8:ww(Ct())>0?6:4})()}initialize(e,t){this.fs=e,this.indexManager=t,this.Rs=!0}getDocumentsMatchingQuery(e,t,n,i){const s={result:null};return this.gs(e,t).next((o=>{s.result=o})).next((()=>{if(!s.result)return this.ps(e,t,i,n).next((o=>{s.result=o}))})).next((()=>{if(s.result)return;const o=new Wb;return this.ys(e,t,o).next((c=>{if(s.result=c,this.As)return this.ws(e,t,o,c.size)}))})).next((()=>s.result))}ws(e,t,n,i){return n.documentReadCount<this.Vs?(Ii()<=ve.DEBUG&&oe("QueryEngine","SDK will not create cache indexes for query:",Ci(t),"since it only creates cache indexes for collection contains","more than or equal to",this.Vs,"documents"),W.resolve()):(Ii()<=ve.DEBUG&&oe("QueryEngine","Query:",Ci(t),"scans",n.documentReadCount,"local documents and returns",i,"documents as results."),n.documentReadCount>this.ds*i?(Ii()<=ve.DEBUG&&oe("QueryEngine","The SDK decides to create cache indexes for query:",Ci(t),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,xr(t))):W.resolve())}gs(e,t){if(of(t))return W.resolve(null);let n=xr(t);return this.indexManager.getIndexType(e,n).next((i=>i===0?null:(t.limit!==null&&i===1&&(t=Nc(t,null,"F"),n=xr(t)),this.indexManager.getDocumentsMatchingTarget(e,n).next((s=>{const o=xe(...s);return this.fs.getDocuments(e,o).next((c=>this.indexManager.getMinOffset(e,n).next((l=>{const u=this.bs(t,c);return this.Ss(t,u,o,l.readTime)?this.gs(e,Nc(t,null,"F")):this.Ds(e,u,t,l)}))))})))))}ps(e,t,n,i){return of(t)||i.isEqual(pe.min())?W.resolve(null):this.fs.getDocuments(e,n).next((s=>{const o=this.bs(t,s);return this.Ss(t,o,n,i)?W.resolve(null):(Ii()<=ve.DEBUG&&oe("QueryEngine","Re-using previous result from %s to execute query: %s",i.toString(),Ci(t)),this.Ds(e,o,t,pw(i,ao)).next((c=>c)))}))}bs(e,t){let n=new ht(Mm(e));return t.forEach(((i,s)=>{al(e,s)&&(n=n.add(s))})),n}Ss(e,t,n,i){if(e.limit===null)return!1;if(n.size!==t.size)return!0;const s=e.limitType==="F"?t.last():t.first();return!!s&&(s.hasPendingWrites||s.version.compareTo(i)>0)}ys(e,t,n){return Ii()<=ve.DEBUG&&oe("QueryEngine","Using full collection scan to execute query:",Ci(t)),this.fs.getDocumentsMatchingQuery(e,t,An.min(),n)}Ds(e,t,n,i){return this.fs.getDocumentsMatchingQuery(e,n,i).next((s=>(t.forEach((o=>{s=s.insert(o.key,o)})),s)))}}const Cu="LocalStore",Kb=3e8;class Yb{constructor(e,t,n,i){this.persistence=e,this.Cs=t,this.serializer=i,this.vs=new je(Te),this.Fs=new mi((s=>wu(s)),bu),this.Ms=new Map,this.xs=e.getRemoteDocumentCache(),this.li=e.getTargetCache(),this.Pi=e.getBundleCache(),this.Os(n)}Os(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new Bb(this.xs,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.xs.setIndexManager(this.indexManager),this.Cs.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",(t=>e.collect(t,this.vs)))}}function Zb(r,e,t,n){return new Yb(r,e,t,n)}async function sg(r,e){const t=ge(r);return await t.persistence.runTransaction("Handle user change","readonly",(n=>{let i;return t.mutationQueue.getAllMutationBatches(n).next((s=>(i=s,t.Os(e),t.mutationQueue.getAllMutationBatches(n)))).next((s=>{const o=[],c=[];let l=xe();for(const u of i){o.push(u.batchId);for(const f of u.mutations)l=l.add(f.key)}for(const u of s){c.push(u.batchId);for(const f of u.mutations)l=l.add(f.key)}return t.localDocuments.getDocuments(n,l).next((u=>({Ns:u,removedBatchIds:o,addedBatchIds:c})))}))}))}function Jb(r,e){const t=ge(r);return t.persistence.runTransaction("Acknowledge batch","readwrite-primary",(n=>{const i=e.batch.keys(),s=t.xs.newChangeBuffer({trackRemovals:!0});return(function(c,l,u,f){const d=u.batch,h=d.keys();let p=W.resolve();return h.forEach((g=>{p=p.next((()=>f.getEntry(l,g))).next((w=>{const b=u.docVersions.get(g);Se(b!==null,48541),w.version.compareTo(b)<0&&(d.applyToRemoteDocument(w,u),w.isValidDocument()&&(w.setReadTime(u.commitVersion),f.addEntry(w)))}))})),p.next((()=>c.mutationQueue.removeMutationBatch(l,d)))})(t,n,e,s).next((()=>s.apply(n))).next((()=>t.mutationQueue.performConsistencyCheck(n))).next((()=>t.documentOverlayCache.removeOverlaysForBatchId(n,i,e.batch.batchId))).next((()=>t.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(n,(function(c){let l=xe();for(let u=0;u<c.mutationResults.length;++u)c.mutationResults[u].transformResults.length>0&&(l=l.add(c.batch.mutations[u].key));return l})(e)))).next((()=>t.localDocuments.getDocuments(n,i)))}))}function og(r){const e=ge(r);return e.persistence.runTransaction("Get last remote snapshot version","readonly",(t=>e.li.getLastRemoteSnapshotVersion(t)))}function Xb(r,e){const t=ge(r),n=e.snapshotVersion;let i=t.vs;return t.persistence.runTransaction("Apply remote event","readwrite-primary",(s=>{const o=t.xs.newChangeBuffer({trackRemovals:!0});i=t.vs;const c=[];e.targetChanges.forEach(((f,d)=>{const h=i.get(d);if(!h)return;c.push(t.li.removeMatchingKeys(s,f.removedDocuments,d).next((()=>t.li.addMatchingKeys(s,f.addedDocuments,d))));let p=h.withSequenceNumber(s.currentSequenceNumber);e.targetMismatches.get(d)!==null?p=p.withResumeToken(vt.EMPTY_BYTE_STRING,pe.min()).withLastLimboFreeSnapshotVersion(pe.min()):f.resumeToken.approximateByteSize()>0&&(p=p.withResumeToken(f.resumeToken,n)),i=i.insert(d,p),(function(w,b,P){return w.resumeToken.approximateByteSize()===0||b.snapshotVersion.toMicroseconds()-w.snapshotVersion.toMicroseconds()>=Kb?!0:P.addedDocuments.size+P.modifiedDocuments.size+P.removedDocuments.size>0})(h,p,f)&&c.push(t.li.updateTargetData(s,p))}));let l=Wr(),u=xe();if(e.documentUpdates.forEach((f=>{e.resolvedLimboDocuments.has(f)&&c.push(t.persistence.referenceDelegate.updateLimboDocument(s,f))})),c.push(ev(s,o,e.documentUpdates).next((f=>{l=f.Bs,u=f.Ls}))),!n.isEqual(pe.min())){const f=t.li.getLastRemoteSnapshotVersion(s).next((d=>t.li.setTargetsMetadata(s,s.currentSequenceNumber,n)));c.push(f)}return W.waitFor(c).next((()=>o.apply(s))).next((()=>t.localDocuments.getLocalViewOfDocuments(s,l,u))).next((()=>l))})).then((s=>(t.vs=i,s)))}function ev(r,e,t){let n=xe(),i=xe();return t.forEach((s=>n=n.add(s))),e.getEntries(r,n).next((s=>{let o=Wr();return t.forEach(((c,l)=>{const u=s.get(c);l.isFoundDocument()!==u.isFoundDocument()&&(i=i.add(c)),l.isNoDocument()&&l.version.isEqual(pe.min())?(e.removeEntry(c,l.readTime),o=o.insert(c,l)):!u.isValidDocument()||l.version.compareTo(u.version)>0||l.version.compareTo(u.version)===0&&u.hasPendingWrites?(e.addEntry(l),o=o.insert(c,l)):oe(Cu,"Ignoring outdated watch update for ",c,". Current version:",u.version," Watch version:",l.version)})),{Bs:o,Ls:i}}))}function tv(r,e){const t=ge(r);return t.persistence.runTransaction("Get next mutation batch","readonly",(n=>(e===void 0&&(e=gu),t.mutationQueue.getNextMutationBatchAfterBatchId(n,e))))}function rv(r,e){const t=ge(r);return t.persistence.runTransaction("Allocate target","readwrite",(n=>{let i;return t.li.getTargetData(n,e).next((s=>s?(i=s,W.resolve(i)):t.li.allocateTargetId(n).next((o=>(i=new yn(e,o,"TargetPurposeListen",n.currentSequenceNumber),t.li.addTargetData(n,i).next((()=>i)))))))})).then((n=>{const i=t.vs.get(n.targetId);return(i===null||n.snapshotVersion.compareTo(i.snapshotVersion)>0)&&(t.vs=t.vs.insert(n.targetId,n),t.Fs.set(e,n.targetId)),n}))}async function qc(r,e,t){const n=ge(r),i=n.vs.get(e),s=t?"readwrite":"readwrite-primary";try{t||await n.persistence.runTransaction("Release target",s,(o=>n.persistence.referenceDelegate.removeTarget(o,i)))}catch(o){if(!$s(o))throw o;oe(Cu,`Failed to update sequence numbers for target ${e}: ${o}`)}n.vs=n.vs.remove(e),n.Fs.delete(i.target)}function wf(r,e,t){const n=ge(r);let i=pe.min(),s=xe();return n.persistence.runTransaction("Execute query","readwrite",(o=>(function(l,u,f){const d=ge(l),h=d.Fs.get(f);return h!==void 0?W.resolve(d.vs.get(h)):d.li.getTargetData(u,f)})(n,o,xr(e)).next((c=>{if(c)return i=c.lastLimboFreeSnapshotVersion,n.li.getMatchingKeysForTargetId(o,c.targetId).next((l=>{s=l}))})).next((()=>n.Cs.getDocumentsMatchingQuery(o,e,t?i:pe.min(),t?s:xe()))).next((c=>(nv(n,qw(e),c),{documents:c,ks:s})))))}function nv(r,e,t){let n=r.Ms.get(e)||pe.min();t.forEach(((i,s)=>{s.readTime.compareTo(n)>0&&(n=s.readTime)})),r.Ms.set(e,n)}class bf{constructor(){this.activeTargetIds=Qw()}Qs(e){this.activeTargetIds=this.activeTargetIds.add(e)}Gs(e){this.activeTargetIds=this.activeTargetIds.delete(e)}Ws(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class iv{constructor(){this.vo=new bf,this.Fo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,t,n){}addLocalQueryTarget(e,t=!0){return t&&this.vo.Qs(e),this.Fo[e]||"not-current"}updateQueryState(e,t,n){this.Fo[e]=t}removeLocalQueryTarget(e){this.vo.Gs(e)}isLocalQueryTarget(e){return this.vo.activeTargetIds.has(e)}clearQueryState(e){delete this.Fo[e]}getAllActiveQueryTargets(){return this.vo.activeTargetIds}isActiveQueryTarget(e){return this.vo.activeTargetIds.has(e)}start(){return this.vo=new bf,Promise.resolve()}handleUserChange(e,t,n){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}class sv{Mo(e){}shutdown(){}}const vf="ConnectivityMonitor";class kf{constructor(){this.xo=()=>this.Oo(),this.No=()=>this.Bo(),this.Lo=[],this.ko()}Mo(e){this.Lo.push(e)}shutdown(){window.removeEventListener("online",this.xo),window.removeEventListener("offline",this.No)}ko(){window.addEventListener("online",this.xo),window.addEventListener("offline",this.No)}Oo(){oe(vf,"Network connectivity changed: AVAILABLE");for(const e of this.Lo)e(0)}Bo(){oe(vf,"Network connectivity changed: UNAVAILABLE");for(const e of this.Lo)e(1)}static v(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}let ra=null;function Gc(){return ra===null?ra=(function(){return 268435456+Math.round(2147483648*Math.random())})():ra++,"0x"+ra.toString(16)}const nc="RestConnection",ov={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery",ExecutePipeline:"executePipeline"};class av{get Ko(){return!1}constructor(e){this.databaseInfo=e,this.databaseId=e.databaseId;const t=e.ssl?"https":"http",n=encodeURIComponent(this.databaseId.projectId),i=encodeURIComponent(this.databaseId.database);this.qo=t+"://"+e.host,this.Uo=`projects/${n}/databases/${i}`,this.$o=this.databaseId.database===Na?`project_id=${n}`:`project_id=${n}&database_id=${i}`}Wo(e,t,n,i,s){const o=Gc(),c=this.Qo(e,t.toUriEncodedString());oe(nc,`Sending RPC '${e}' ${o}:`,c,n);const l={"google-cloud-resource-prefix":this.Uo,"x-goog-request-params":this.$o};this.Go(l,i,s);const{host:u}=new URL(c),f=hs(u);return this.zo(e,c,l,n,f).then((d=>(oe(nc,`Received RPC '${e}' ${o}: `,d),d)),(d=>{throw ci(nc,`RPC '${e}' ${o} failed with error: `,d,"url: ",c,"request:",n),d}))}jo(e,t,n,i,s,o){return this.Wo(e,t,n,i,s)}Go(e,t,n){e["X-Goog-Api-Client"]=(function(){return"gl-js/ fire/"+ms})(),e["Content-Type"]="text/plain",this.databaseInfo.appId&&(e["X-Firebase-GMPID"]=this.databaseInfo.appId),t&&t.headers.forEach(((i,s)=>e[s]=i)),n&&n.headers.forEach(((i,s)=>e[s]=i))}Qo(e,t){const n=ov[e];let i=`${this.qo}/v1/${t}:${n}`;return this.databaseInfo.apiKey&&(i=`${i}?key=${encodeURIComponent(this.databaseInfo.apiKey)}`),i}terminate(){}}class lv{constructor(e){this.Ho=e.Ho,this.Jo=e.Jo}Zo(e){this.Xo=e}Yo(e){this.e_=e}t_(e){this.n_=e}onMessage(e){this.r_=e}close(){this.Jo()}send(e){this.Ho(e)}i_(){this.Xo()}s_(){this.e_()}o_(e){this.n_(e)}__(e){this.r_(e)}}const Tt="WebChannelConnection",Ds=(r,e,t)=>{r.listen(e,(n=>{try{t(n)}catch(i){setTimeout((()=>{throw i}),0)}}))};class zi extends av{constructor(e){super(e),this.a_=[],this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}static u_(){if(!zi.c_){const e=um();Ds(e,cm.STAT_EVENT,(t=>{t.stat===Sc.PROXY?oe(Tt,"STAT_EVENT: detected buffering proxy"):t.stat===Sc.NOPROXY&&oe(Tt,"STAT_EVENT: detected no buffering proxy")})),zi.c_=!0}}zo(e,t,n,i,s){const o=Gc();return new Promise(((c,l)=>{const u=new am;u.setWithCredentials(!0),u.listenOnce(lm.COMPLETE,(()=>{try{switch(u.getLastErrorCode()){case ma.NO_ERROR:const d=u.getResponseJson();oe(Tt,`XHR for RPC '${e}' ${o} received:`,JSON.stringify(d)),c(d);break;case ma.TIMEOUT:oe(Tt,`RPC '${e}' ${o} timed out`),l(new ie(H.DEADLINE_EXCEEDED,"Request time out"));break;case ma.HTTP_ERROR:const h=u.getStatus();if(oe(Tt,`RPC '${e}' ${o} failed with status:`,h,"response text:",u.getResponseText()),h>0){let p=u.getResponseJson();Array.isArray(p)&&(p=p[0]);const g=p?.error;if(g&&g.status&&g.message){const w=(function(P){const z=P.toLowerCase().replace(/_/g,"-");return Object.values(H).indexOf(z)>=0?z:H.UNKNOWN})(g.status);l(new ie(w,g.message))}else l(new ie(H.UNKNOWN,"Server responded with status "+u.getStatus()))}else l(new ie(H.UNAVAILABLE,"Connection failed."));break;default:he(9055,{l_:e,streamId:o,h_:u.getLastErrorCode(),P_:u.getLastError()})}}finally{oe(Tt,`RPC '${e}' ${o} completed.`)}}));const f=JSON.stringify(i);oe(Tt,`RPC '${e}' ${o} sending request:`,i),u.send(t,"POST",f,n,15)}))}T_(e,t,n){const i=Gc(),s=[this.qo,"/","google.firestore.v1.Firestore","/",e,"/channel"],o=this.createWebChannelTransport(),c={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},l=this.longPollingOptions.timeoutSeconds;l!==void 0&&(c.longPollingTimeout=Math.round(1e3*l)),this.useFetchStreams&&(c.useFetchStreams=!0),this.Go(c.initMessageHeaders,t,n),c.encodeInitMessageHeaders=!0;const u=s.join("");oe(Tt,`Creating RPC '${e}' stream ${i}: ${u}`,c);const f=o.createWebChannel(u,c);this.I_(f);let d=!1,h=!1;const p=new lv({Ho:g=>{h?oe(Tt,`Not sending because RPC '${e}' stream ${i} is closed:`,g):(d||(oe(Tt,`Opening RPC '${e}' stream ${i} transport.`),f.open(),d=!0),oe(Tt,`RPC '${e}' stream ${i} sending:`,g),f.send(g))},Jo:()=>f.close()});return Ds(f,Us.EventType.OPEN,(()=>{h||(oe(Tt,`RPC '${e}' stream ${i} transport opened.`),p.i_())})),Ds(f,Us.EventType.CLOSE,(()=>{h||(h=!0,oe(Tt,`RPC '${e}' stream ${i} transport closed`),p.o_(),this.E_(f))})),Ds(f,Us.EventType.ERROR,(g=>{h||(h=!0,ci(Tt,`RPC '${e}' stream ${i} transport errored. Name:`,g.name,"Message:",g.message),p.o_(new ie(H.UNAVAILABLE,"The operation could not be completed")))})),Ds(f,Us.EventType.MESSAGE,(g=>{if(!h){const w=g.data[0];Se(!!w,16349);const b=w,P=b?.error||b[0]?.error;if(P){oe(Tt,`RPC '${e}' stream ${i} received error:`,P);const z=P.status;let G=(function(O){const k=et[O];if(k!==void 0)return jm(k)})(z),j=P.message;z==="NOT_FOUND"&&j.includes("database")&&j.includes("does not exist")&&j.includes(this.databaseId.database)&&ci(`Database '${this.databaseId.database}' not found. Please check your project configuration.`),G===void 0&&(G=H.INTERNAL,j="Unknown error status: "+z+" with message "+P.message),h=!0,p.o_(new ie(G,j)),f.close()}else oe(Tt,`RPC '${e}' stream ${i} received:`,w),p.__(w)}})),zi.u_(),setTimeout((()=>{p.s_()}),0),p}terminate(){this.a_.forEach((e=>e.close())),this.a_=[]}I_(e){this.a_.push(e)}E_(e){this.a_=this.a_.filter((t=>t===e))}Go(e,t,n){super.Go(e,t,n),this.databaseInfo.apiKey&&(e["x-goog-api-key"]=this.databaseInfo.apiKey)}createWebChannelTransport(){return dm()}}function cv(r){return new zi(r)}function ic(){return typeof document<"u"?document:null}function dl(r){return new fb(r,!0)}zi.c_=!1;class ag{constructor(e,t,n=1e3,i=1.5,s=6e4){this.Ci=e,this.timerId=t,this.R_=n,this.A_=i,this.V_=s,this.d_=0,this.m_=null,this.f_=Date.now(),this.reset()}reset(){this.d_=0}g_(){this.d_=this.V_}p_(e){this.cancel();const t=Math.floor(this.d_+this.y_()),n=Math.max(0,Date.now()-this.f_),i=Math.max(0,t-n);i>0&&oe("ExponentialBackoff",`Backing off for ${i} ms (base delay: ${this.d_} ms, delay with jitter: ${t} ms, last attempt: ${n} ms ago)`),this.m_=this.Ci.enqueueAfterDelay(this.timerId,i,(()=>(this.f_=Date.now(),e()))),this.d_*=this.A_,this.d_<this.R_&&(this.d_=this.R_),this.d_>this.V_&&(this.d_=this.V_)}w_(){this.m_!==null&&(this.m_.skipDelay(),this.m_=null)}cancel(){this.m_!==null&&(this.m_.cancel(),this.m_=null)}y_(){return(Math.random()-.5)*this.d_}}const Tf="PersistentStream";class lg{constructor(e,t,n,i,s,o,c,l){this.Ci=e,this.b_=n,this.S_=i,this.connection=s,this.authCredentialsProvider=o,this.appCheckCredentialsProvider=c,this.listener=l,this.state=0,this.D_=0,this.C_=null,this.v_=null,this.stream=null,this.F_=0,this.M_=new ag(e,t)}x_(){return this.state===1||this.state===5||this.O_()}O_(){return this.state===2||this.state===3}start(){this.F_=0,this.state!==4?this.auth():this.N_()}async stop(){this.x_()&&await this.close(0)}B_(){this.state=0,this.M_.reset()}L_(){this.O_()&&this.C_===null&&(this.C_=this.Ci.enqueueAfterDelay(this.b_,6e4,(()=>this.k_())))}K_(e){this.q_(),this.stream.send(e)}async k_(){if(this.O_())return this.close(0)}q_(){this.C_&&(this.C_.cancel(),this.C_=null)}U_(){this.v_&&(this.v_.cancel(),this.v_=null)}async close(e,t){this.q_(),this.U_(),this.M_.cancel(),this.D_++,e!==4?this.M_.reset():t&&t.code===H.RESOURCE_EXHAUSTED?(jr(t.toString()),jr("Using maximum backoff delay to prevent overloading the backend."),this.M_.g_()):t&&t.code===H.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.W_(),this.stream.close(),this.stream=null),this.state=e,await this.listener.t_(t)}W_(){}auth(){this.state=1;const e=this.Q_(this.D_),t=this.D_;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then((([n,i])=>{this.D_===t&&this.G_(n,i)}),(n=>{e((()=>{const i=new ie(H.UNKNOWN,"Fetching auth token failed: "+n.message);return this.z_(i)}))}))}G_(e,t){const n=this.Q_(this.D_);this.stream=this.j_(e,t),this.stream.Zo((()=>{n((()=>this.listener.Zo()))})),this.stream.Yo((()=>{n((()=>(this.state=2,this.v_=this.Ci.enqueueAfterDelay(this.S_,1e4,(()=>(this.O_()&&(this.state=3),Promise.resolve()))),this.listener.Yo())))})),this.stream.t_((i=>{n((()=>this.z_(i)))})),this.stream.onMessage((i=>{n((()=>++this.F_==1?this.H_(i):this.onNext(i)))}))}N_(){this.state=5,this.M_.p_((async()=>{this.state=0,this.start()}))}z_(e){return oe(Tf,`close with error: ${e}`),this.stream=null,this.close(4,e)}Q_(e){return t=>{this.Ci.enqueueAndForget((()=>this.D_===e?t():(oe(Tf,"stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve())))}}}class uv extends lg{constructor(e,t,n,i,s,o){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",t,n,i,o),this.serializer=s}j_(e,t){return this.connection.T_("Listen",e,t)}H_(e){return this.onNext(e)}onNext(e){this.M_.reset();const t=gb(this.serializer,e),n=(function(s){if(!("targetChange"in s))return pe.min();const o=s.targetChange;return o.targetIds&&o.targetIds.length?pe.min():o.readTime?_r(o.readTime):pe.min()})(e);return this.listener.J_(t,n)}Z_(e){const t={};t.database=zc(this.serializer),t.addTarget=(function(s,o){let c;const l=o.target;if(c=Vc(l)?{documents:wb(s,l)}:{query:bb(s,l).ft},c.targetId=o.targetId,o.resumeToken.approximateByteSize()>0){c.resumeToken=Km(s,o.resumeToken);const u=Bc(s,o.expectedCount);u!==null&&(c.expectedCount=u)}else if(o.snapshotVersion.compareTo(pe.min())>0){c.readTime=qa(s,o.snapshotVersion.toTimestamp());const u=Bc(s,o.expectedCount);u!==null&&(c.expectedCount=u)}return c})(this.serializer,e);const n=kb(this.serializer,e);n&&(t.labels=n),this.K_(t)}X_(e){const t={};t.database=zc(this.serializer),t.removeTarget=e,this.K_(t)}}class dv extends lg{constructor(e,t,n,i,s,o){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",t,n,i,o),this.serializer=s}get Y_(){return this.F_>0}start(){this.lastStreamToken=void 0,super.start()}W_(){this.Y_&&this.ea([])}j_(e,t){return this.connection.T_("Write",e,t)}H_(e){return Se(!!e.streamToken,31322),this.lastStreamToken=e.streamToken,Se(!e.writeResults||e.writeResults.length===0,55816),this.listener.ta()}onNext(e){Se(!!e.streamToken,12678),this.lastStreamToken=e.streamToken,this.M_.reset();const t=yb(e.writeResults,e.commitTime),n=_r(e.commitTime);return this.listener.na(n,t)}ra(){const e={};e.database=zc(this.serializer),this.K_(e)}ea(e){const t={streamToken:this.lastStreamToken,writes:e.map((n=>$b(this.serializer,n)))};this.K_(t)}}class hv{}class fv extends hv{constructor(e,t,n,i){super(),this.authCredentials=e,this.appCheckCredentials=t,this.connection=n,this.serializer=i,this.ia=!1}sa(){if(this.ia)throw new ie(H.FAILED_PRECONDITION,"The client has already been terminated.")}Wo(e,t,n,i){return this.sa(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([s,o])=>this.connection.Wo(e,Oc(t,n),i,s,o))).catch((s=>{throw s.name==="FirebaseError"?(s.code===H.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),s):new ie(H.UNKNOWN,s.toString())}))}jo(e,t,n,i,s){return this.sa(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([o,c])=>this.connection.jo(e,Oc(t,n),i,o,c,s))).catch((o=>{throw o.name==="FirebaseError"?(o.code===H.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),o):new ie(H.UNKNOWN,o.toString())}))}terminate(){this.ia=!0,this.connection.terminate()}}function pv(r,e,t,n){return new fv(r,e,t,n)}class mv{constructor(e,t){this.asyncQueue=e,this.onlineStateHandler=t,this.state="Unknown",this.oa=0,this._a=null,this.aa=!0}ua(){this.oa===0&&(this.ca("Unknown"),this._a=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,(()=>(this._a=null,this.la("Backend didn't respond within 10 seconds."),this.ca("Offline"),Promise.resolve()))))}ha(e){this.state==="Online"?this.ca("Unknown"):(this.oa++,this.oa>=1&&(this.Pa(),this.la(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.ca("Offline")))}set(e){this.Pa(),this.oa=0,e==="Online"&&(this.aa=!1),this.ca(e)}ca(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}la(e){const t=`Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.aa?(jr(t),this.aa=!1):oe("OnlineStateTracker",t)}Pa(){this._a!==null&&(this._a.cancel(),this._a=null)}}const ui="RemoteStore";class gv{constructor(e,t,n,i,s){this.localStore=e,this.datastore=t,this.asyncQueue=n,this.remoteSyncer={},this.Ta=[],this.Ia=new Map,this.Ea=new Set,this.Ra=[],this.Aa=s,this.Aa.Mo((o=>{n.enqueueAndForget((async()=>{gi(this)&&(oe(ui,"Restarting streams for network reachability change."),await(async function(l){const u=ge(l);u.Ea.add(4),await Po(u),u.Va.set("Unknown"),u.Ea.delete(4),await hl(u)})(this))}))})),this.Va=new mv(n,i)}}async function hl(r){if(gi(r))for(const e of r.Ra)await e(!0)}async function Po(r){for(const e of r.Ra)await e(!1)}function cg(r,e){const t=ge(r);t.Ia.has(e.targetId)||(t.Ia.set(e.targetId,e),Lu(t)?Pu(t):ys(t).O_()&&Ru(t,e))}function Su(r,e){const t=ge(r),n=ys(t);t.Ia.delete(e),n.O_()&&ug(t,e),t.Ia.size===0&&(n.O_()?n.L_():gi(t)&&t.Va.set("Unknown"))}function Ru(r,e){if(r.da.$e(e.targetId),e.resumeToken.approximateByteSize()>0||e.snapshotVersion.compareTo(pe.min())>0){const t=r.remoteSyncer.getRemoteKeysForTarget(e.targetId).size;e=e.withExpectedCount(t)}ys(r).Z_(e)}function ug(r,e){r.da.$e(e),ys(r).X_(e)}function Pu(r){r.da=new cb({getRemoteKeysForTarget:e=>r.remoteSyncer.getRemoteKeysForTarget(e),At:e=>r.Ia.get(e)||null,ht:()=>r.datastore.serializer.databaseId}),ys(r).start(),r.Va.ua()}function Lu(r){return gi(r)&&!ys(r).x_()&&r.Ia.size>0}function gi(r){return ge(r).Ea.size===0}function dg(r){r.da=void 0}async function $v(r){r.Va.set("Online")}async function yv(r){r.Ia.forEach(((e,t)=>{Ru(r,e)}))}async function wv(r,e){dg(r),Lu(r)?(r.Va.ha(e),Pu(r)):r.Va.set("Unknown")}async function bv(r,e,t){if(r.Va.set("Online"),e instanceof Qm&&e.state===2&&e.cause)try{await(async function(i,s){const o=s.cause;for(const c of s.targetIds)i.Ia.has(c)&&(await i.remoteSyncer.rejectListen(c,o),i.Ia.delete(c),i.da.removeTarget(c))})(r,e)}catch(n){oe(ui,"Failed to remove targets %s: %s ",e.targetIds.join(","),n),await Ua(r,n)}else if(e instanceof wa?r.da.Xe(e):e instanceof Wm?r.da.st(e):r.da.tt(e),!t.isEqual(pe.min()))try{const n=await og(r.localStore);t.compareTo(n)>=0&&await(function(s,o){const c=s.da.Tt(o);return c.targetChanges.forEach(((l,u)=>{if(l.resumeToken.approximateByteSize()>0){const f=s.Ia.get(u);f&&s.Ia.set(u,f.withResumeToken(l.resumeToken,o))}})),c.targetMismatches.forEach(((l,u)=>{const f=s.Ia.get(l);if(!f)return;s.Ia.set(l,f.withResumeToken(vt.EMPTY_BYTE_STRING,f.snapshotVersion)),ug(s,l);const d=new yn(f.target,l,u,f.sequenceNumber);Ru(s,d)})),s.remoteSyncer.applyRemoteEvent(c)})(r,t)}catch(n){oe(ui,"Failed to raise snapshot:",n),await Ua(r,n)}}async function Ua(r,e,t){if(!$s(e))throw e;r.Ea.add(1),await Po(r),r.Va.set("Offline"),t||(t=()=>og(r.localStore)),r.asyncQueue.enqueueRetryable((async()=>{oe(ui,"Retrying IndexedDB access"),await t(),r.Ea.delete(1),await hl(r)}))}function hg(r,e){return e().catch((t=>Ua(r,t,e)))}async function fl(r){const e=ge(r),t=Rn(e);let n=e.Ta.length>0?e.Ta[e.Ta.length-1].batchId:gu;for(;vv(e);)try{const i=await tv(e.localStore,n);if(i===null){e.Ta.length===0&&t.L_();break}n=i.batchId,kv(e,i)}catch(i){await Ua(e,i)}fg(e)&&pg(e)}function vv(r){return gi(r)&&r.Ta.length<10}function kv(r,e){r.Ta.push(e);const t=Rn(r);t.O_()&&t.Y_&&t.ea(e.mutations)}function fg(r){return gi(r)&&!Rn(r).x_()&&r.Ta.length>0}function pg(r){Rn(r).start()}async function Tv(r){Rn(r).ra()}async function xv(r){const e=Rn(r);for(const t of r.Ta)e.ea(t.mutations)}async function _v(r,e,t){const n=r.Ta.shift(),i=Tu.from(n,e,t);await hg(r,(()=>r.remoteSyncer.applySuccessfulWrite(i))),await fl(r)}async function Ev(r,e){e&&Rn(r).Y_&&await(async function(n,i){if((function(o){return ob(o)&&o!==H.ABORTED})(i.code)){const s=n.Ta.shift();Rn(n).B_(),await hg(n,(()=>n.remoteSyncer.rejectFailedWrite(s.batchId,i))),await fl(n)}})(r,e),fg(r)&&pg(r)}async function xf(r,e){const t=ge(r);t.asyncQueue.verifyOperationInProgress(),oe(ui,"RemoteStore received new credentials");const n=gi(t);t.Ea.add(3),await Po(t),n&&t.Va.set("Unknown"),await t.remoteSyncer.handleCredentialChange(e),t.Ea.delete(3),await hl(t)}async function Av(r,e){const t=ge(r);e?(t.Ea.delete(2),await hl(t)):e||(t.Ea.add(2),await Po(t),t.Va.set("Unknown"))}function ys(r){return r.ma||(r.ma=(function(t,n,i){const s=ge(t);return s.sa(),new uv(n,s.connection,s.authCredentials,s.appCheckCredentials,s.serializer,i)})(r.datastore,r.asyncQueue,{Zo:$v.bind(null,r),Yo:yv.bind(null,r),t_:wv.bind(null,r),J_:bv.bind(null,r)}),r.Ra.push((async e=>{e?(r.ma.B_(),Lu(r)?Pu(r):r.Va.set("Unknown")):(await r.ma.stop(),dg(r))}))),r.ma}function Rn(r){return r.fa||(r.fa=(function(t,n,i){const s=ge(t);return s.sa(),new dv(n,s.connection,s.authCredentials,s.appCheckCredentials,s.serializer,i)})(r.datastore,r.asyncQueue,{Zo:()=>Promise.resolve(),Yo:Tv.bind(null,r),t_:Ev.bind(null,r),ta:xv.bind(null,r),na:_v.bind(null,r)}),r.Ra.push((async e=>{e?(r.fa.B_(),await fl(r)):(await r.fa.stop(),r.Ta.length>0&&(oe(ui,`Stopping write stream with ${r.Ta.length} pending writes`),r.Ta=[]))}))),r.fa}class Mu{constructor(e,t,n,i,s){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=n,this.op=i,this.removalCallback=s,this.deferred=new zr,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch((o=>{}))}get promise(){return this.deferred.promise}static createAndSchedule(e,t,n,i,s){const o=Date.now()+n,c=new Mu(e,t,o,i,s);return c.start(n),c}start(e){this.timerHandle=setTimeout((()=>this.handleDelayElapsed()),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new ie(H.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget((()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then((e=>this.deferred.resolve(e)))):Promise.resolve()))}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function Vu(r,e){if(jr("AsyncQueue",`${e}: ${r}`),$s(r))return new ie(H.UNAVAILABLE,`${e}: ${r}`);throw r}class qi{static emptySet(e){return new qi(e.comparator)}constructor(e){this.comparator=e?(t,n)=>e(t,n)||le.comparator(t.key,n.key):(t,n)=>le.comparator(t.key,n.key),this.keyedMap=Hs(),this.sortedSet=new je(this.comparator)}has(e){return this.keyedMap.get(e)!=null}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){const t=this.keyedMap.get(e);return t?this.sortedSet.indexOf(t):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal(((t,n)=>(e(t),!1)))}add(e){const t=this.delete(e.key);return t.copy(t.keyedMap.insert(e.key,e),t.sortedSet.insert(e,null))}delete(e){const t=this.get(e);return t?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(t)):this}isEqual(e){if(!(e instanceof qi)||this.size!==e.size)return!1;const t=this.sortedSet.getIterator(),n=e.sortedSet.getIterator();for(;t.hasNext();){const i=t.getNext().key,s=n.getNext().key;if(!i.isEqual(s))return!1}return!0}toString(){const e=[];return this.forEach((t=>{e.push(t.toString())})),e.length===0?"DocumentSet ()":`DocumentSet (
  `+e.join(`  
`)+`
)`}copy(e,t){const n=new qi;return n.comparator=this.comparator,n.keyedMap=e,n.sortedSet=t,n}}class _f{constructor(){this.ga=new je(le.comparator)}track(e){const t=e.doc.key,n=this.ga.get(t);n?e.type!==0&&n.type===3?this.ga=this.ga.insert(t,e):e.type===3&&n.type!==1?this.ga=this.ga.insert(t,{type:n.type,doc:e.doc}):e.type===2&&n.type===2?this.ga=this.ga.insert(t,{type:2,doc:e.doc}):e.type===2&&n.type===0?this.ga=this.ga.insert(t,{type:0,doc:e.doc}):e.type===1&&n.type===0?this.ga=this.ga.remove(t):e.type===1&&n.type===2?this.ga=this.ga.insert(t,{type:1,doc:n.doc}):e.type===0&&n.type===1?this.ga=this.ga.insert(t,{type:2,doc:e.doc}):he(63341,{Vt:e,pa:n}):this.ga=this.ga.insert(t,e)}ya(){const e=[];return this.ga.inorderTraversal(((t,n)=>{e.push(n)})),e}}class is{constructor(e,t,n,i,s,o,c,l,u){this.query=e,this.docs=t,this.oldDocs=n,this.docChanges=i,this.mutatedKeys=s,this.fromCache=o,this.syncStateChanged=c,this.excludesMetadataChanges=l,this.hasCachedResults=u}static fromInitialDocuments(e,t,n,i,s){const o=[];return t.forEach((c=>{o.push({type:0,doc:c})})),new is(e,t,qi.emptySet(t),o,n,i,!0,!1,s)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&ol(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;const t=this.docChanges,n=e.docChanges;if(t.length!==n.length)return!1;for(let i=0;i<t.length;i++)if(t[i].type!==n[i].type||!t[i].doc.isEqual(n[i].doc))return!1;return!0}}class Iv{constructor(){this.wa=void 0,this.ba=[]}Sa(){return this.ba.some((e=>e.Da()))}}class Cv{constructor(){this.queries=Ef(),this.onlineState="Unknown",this.Ca=new Set}terminate(){(function(t,n){const i=ge(t),s=i.queries;i.queries=Ef(),s.forEach(((o,c)=>{for(const l of c.ba)l.onError(n)}))})(this,new ie(H.ABORTED,"Firestore shutting down"))}}function Ef(){return new mi((r=>Lm(r)),ol)}async function Du(r,e){const t=ge(r);let n=3;const i=e.query;let s=t.queries.get(i);s?!s.Sa()&&e.Da()&&(n=2):(s=new Iv,n=e.Da()?0:1);try{switch(n){case 0:s.wa=await t.onListen(i,!0);break;case 1:s.wa=await t.onListen(i,!1);break;case 2:await t.onFirstRemoteStoreListen(i)}}catch(o){const c=Vu(o,`Initialization of query '${Ci(e.query)}' failed`);return void e.onError(c)}t.queries.set(i,s),s.ba.push(e),e.va(t.onlineState),s.wa&&e.Fa(s.wa)&&Bu(t)}async function Nu(r,e){const t=ge(r),n=e.query;let i=3;const s=t.queries.get(n);if(s){const o=s.ba.indexOf(e);o>=0&&(s.ba.splice(o,1),s.ba.length===0?i=e.Da()?0:1:!s.Sa()&&e.Da()&&(i=2))}switch(i){case 0:return t.queries.delete(n),t.onUnlisten(n,!0);case 1:return t.queries.delete(n),t.onUnlisten(n,!1);case 2:return t.onLastRemoteStoreUnlisten(n);default:return}}function Sv(r,e){const t=ge(r);let n=!1;for(const i of e){const s=i.query,o=t.queries.get(s);if(o){for(const c of o.ba)c.Fa(i)&&(n=!0);o.wa=i}}n&&Bu(t)}function Rv(r,e,t){const n=ge(r),i=n.queries.get(e);if(i)for(const s of i.ba)s.onError(t);n.queries.delete(e)}function Bu(r){r.Ca.forEach((e=>{e.next()}))}var Uc,Af;(Af=Uc||(Uc={})).Ma="default",Af.Cache="cache";class Ou{constructor(e,t,n){this.query=e,this.xa=t,this.Oa=!1,this.Na=null,this.onlineState="Unknown",this.options=n||{}}Fa(e){if(!this.options.includeMetadataChanges){const n=[];for(const i of e.docChanges)i.type!==3&&n.push(i);e=new is(e.query,e.docs,e.oldDocs,n,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let t=!1;return this.Oa?this.Ba(e)&&(this.xa.next(e),t=!0):this.La(e,this.onlineState)&&(this.ka(e),t=!0),this.Na=e,t}onError(e){this.xa.error(e)}va(e){this.onlineState=e;let t=!1;return this.Na&&!this.Oa&&this.La(this.Na,e)&&(this.ka(this.Na),t=!0),t}La(e,t){if(!e.fromCache||!this.Da())return!0;const n=t!=="Offline";return(!this.options.Ka||!n)&&(!e.docs.isEmpty()||e.hasCachedResults||t==="Offline")}Ba(e){if(e.docChanges.length>0)return!0;const t=this.Na&&this.Na.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!t)&&this.options.includeMetadataChanges===!0}ka(e){e=is.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.Oa=!0,this.xa.next(e)}Da(){return this.options.source!==Uc.Cache}}class mg{constructor(e){this.key=e}}class gg{constructor(e){this.key=e}}class Pv{constructor(e,t){this.query=e,this.Za=t,this.Xa=null,this.hasCachedResults=!1,this.current=!1,this.Ya=xe(),this.mutatedKeys=xe(),this.eu=Mm(e),this.tu=new qi(this.eu)}get nu(){return this.Za}ru(e,t){const n=t?t.iu:new _f,i=t?t.tu:this.tu;let s=t?t.mutatedKeys:this.mutatedKeys,o=i,c=!1;const l=this.query.limitType==="F"&&i.size===this.query.limit?i.last():null,u=this.query.limitType==="L"&&i.size===this.query.limit?i.first():null;if(e.inorderTraversal(((f,d)=>{const h=i.get(f),p=al(this.query,d)?d:null,g=!!h&&this.mutatedKeys.has(h.key),w=!!p&&(p.hasLocalMutations||this.mutatedKeys.has(p.key)&&p.hasCommittedMutations);let b=!1;h&&p?h.data.isEqual(p.data)?g!==w&&(n.track({type:3,doc:p}),b=!0):this.su(h,p)||(n.track({type:2,doc:p}),b=!0,(l&&this.eu(p,l)>0||u&&this.eu(p,u)<0)&&(c=!0)):!h&&p?(n.track({type:0,doc:p}),b=!0):h&&!p&&(n.track({type:1,doc:h}),b=!0,(l||u)&&(c=!0)),b&&(p?(o=o.add(p),s=w?s.add(f):s.delete(f)):(o=o.delete(f),s=s.delete(f)))})),this.query.limit!==null)for(;o.size>this.query.limit;){const f=this.query.limitType==="F"?o.last():o.first();o=o.delete(f.key),s=s.delete(f.key),n.track({type:1,doc:f})}return{tu:o,iu:n,Ss:c,mutatedKeys:s}}su(e,t){return e.hasLocalMutations&&t.hasCommittedMutations&&!t.hasLocalMutations}applyChanges(e,t,n,i){const s=this.tu;this.tu=e.tu,this.mutatedKeys=e.mutatedKeys;const o=e.iu.ya();o.sort(((f,d)=>(function(p,g){const w=b=>{switch(b){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return he(20277,{Vt:b})}};return w(p)-w(g)})(f.type,d.type)||this.eu(f.doc,d.doc))),this.ou(n),i=i??!1;const c=t&&!i?this._u():[],l=this.Ya.size===0&&this.current&&!i?1:0,u=l!==this.Xa;return this.Xa=l,o.length!==0||u?{snapshot:new is(this.query,e.tu,s,o,e.mutatedKeys,l===0,u,!1,!!n&&n.resumeToken.approximateByteSize()>0),au:c}:{au:c}}va(e){return this.current&&e==="Offline"?(this.current=!1,this.applyChanges({tu:this.tu,iu:new _f,mutatedKeys:this.mutatedKeys,Ss:!1},!1)):{au:[]}}uu(e){return!this.Za.has(e)&&!!this.tu.has(e)&&!this.tu.get(e).hasLocalMutations}ou(e){e&&(e.addedDocuments.forEach((t=>this.Za=this.Za.add(t))),e.modifiedDocuments.forEach((t=>{})),e.removedDocuments.forEach((t=>this.Za=this.Za.delete(t))),this.current=e.current)}_u(){if(!this.current)return[];const e=this.Ya;this.Ya=xe(),this.tu.forEach((n=>{this.uu(n.key)&&(this.Ya=this.Ya.add(n.key))}));const t=[];return e.forEach((n=>{this.Ya.has(n)||t.push(new gg(n))})),this.Ya.forEach((n=>{e.has(n)||t.push(new mg(n))})),t}cu(e){this.Za=e.ks,this.Ya=xe();const t=this.ru(e.documents);return this.applyChanges(t,!0)}lu(){return is.fromInitialDocuments(this.query,this.tu,this.mutatedKeys,this.Xa===0,this.hasCachedResults)}}const Fu="SyncEngine";class Lv{constructor(e,t,n){this.query=e,this.targetId=t,this.view=n}}class Mv{constructor(e){this.key=e,this.hu=!1}}class Vv{constructor(e,t,n,i,s,o){this.localStore=e,this.remoteStore=t,this.eventManager=n,this.sharedClientState=i,this.currentUser=s,this.maxConcurrentLimboResolutions=o,this.Pu={},this.Tu=new mi((c=>Lm(c)),ol),this.Iu=new Map,this.Eu=new Set,this.Ru=new je(le.comparator),this.Au=new Map,this.Vu=new Eu,this.du={},this.mu=new Map,this.fu=ns.ar(),this.onlineState="Unknown",this.gu=void 0}get isPrimaryClient(){return this.gu===!0}}async function Dv(r,e,t=!0){const n=kg(r);let i;const s=n.Tu.get(e);return s?(n.sharedClientState.addLocalQueryTarget(s.targetId),i=s.view.lu()):i=await $g(n,e,t,!0),i}async function Nv(r,e){const t=kg(r);await $g(t,e,!0,!1)}async function $g(r,e,t,n){const i=await rv(r.localStore,xr(e)),s=i.targetId,o=r.sharedClientState.addLocalQueryTarget(s,t);let c;return n&&(c=await Bv(r,e,s,o==="current",i.resumeToken)),r.isPrimaryClient&&t&&cg(r.remoteStore,i),c}async function Bv(r,e,t,n,i){r.pu=(d,h,p)=>(async function(w,b,P,z){let G=b.view.ru(P);G.Ss&&(G=await wf(w.localStore,b.query,!1).then((({documents:k})=>b.view.ru(k,G))));const j=z&&z.targetChanges.get(b.targetId),te=z&&z.targetMismatches.get(b.targetId)!=null,O=b.view.applyChanges(G,w.isPrimaryClient,j,te);return Cf(w,b.targetId,O.au),O.snapshot})(r,d,h,p);const s=await wf(r.localStore,e,!0),o=new Pv(e,s.ks),c=o.ru(s.documents),l=Ro.createSynthesizedTargetChangeForCurrentChange(t,n&&r.onlineState!=="Offline",i),u=o.applyChanges(c,r.isPrimaryClient,l);Cf(r,t,u.au);const f=new Lv(e,t,o);return r.Tu.set(e,f),r.Iu.has(t)?r.Iu.get(t).push(e):r.Iu.set(t,[e]),u.snapshot}async function Ov(r,e,t){const n=ge(r),i=n.Tu.get(e),s=n.Iu.get(i.targetId);if(s.length>1)return n.Iu.set(i.targetId,s.filter((o=>!ol(o,e)))),void n.Tu.delete(e);n.isPrimaryClient?(n.sharedClientState.removeLocalQueryTarget(i.targetId),n.sharedClientState.isActiveQueryTarget(i.targetId)||await qc(n.localStore,i.targetId,!1).then((()=>{n.sharedClientState.clearQueryState(i.targetId),t&&Su(n.remoteStore,i.targetId),Hc(n,i.targetId)})).catch(gs)):(Hc(n,i.targetId),await qc(n.localStore,i.targetId,!0))}async function Fv(r,e){const t=ge(r),n=t.Tu.get(e),i=t.Iu.get(n.targetId);t.isPrimaryClient&&i.length===1&&(t.sharedClientState.removeLocalQueryTarget(n.targetId),Su(t.remoteStore,n.targetId))}async function zv(r,e,t){const n=Qv(r);try{const i=await(function(o,c){const l=ge(o),u=Ge.now(),f=c.reduce(((p,g)=>p.add(g.key)),xe());let d,h;return l.persistence.runTransaction("Locally write mutations","readwrite",(p=>{let g=Wr(),w=xe();return l.xs.getEntries(p,f).next((b=>{g=b,g.forEach(((P,z)=>{z.isValidDocument()||(w=w.add(P))}))})).next((()=>l.localDocuments.getOverlayedDocuments(p,g))).next((b=>{d=b;const P=[];for(const z of c){const G=tb(z,d.get(z.key).overlayedDocument);G!=null&&P.push(new Bn(z.key,G,_m(G.value.mapValue),sr.exists(!0)))}return l.mutationQueue.addMutationBatch(p,u,P,c)})).next((b=>{h=b;const P=b.applyToLocalDocumentSet(d,w);return l.documentOverlayCache.saveOverlays(p,b.batchId,P)}))})).then((()=>({batchId:h.batchId,changes:Dm(d)})))})(n.localStore,e);n.sharedClientState.addPendingMutation(i.batchId),(function(o,c,l){let u=o.du[o.currentUser.toKey()];u||(u=new je(Te)),u=u.insert(c,l),o.du[o.currentUser.toKey()]=u})(n,i.batchId,t),await Lo(n,i.changes),await fl(n.remoteStore)}catch(i){const s=Vu(i,"Failed to persist write");t.reject(s)}}async function yg(r,e){const t=ge(r);try{const n=await Xb(t.localStore,e);e.targetChanges.forEach(((i,s)=>{const o=t.Au.get(s);o&&(Se(i.addedDocuments.size+i.modifiedDocuments.size+i.removedDocuments.size<=1,22616),i.addedDocuments.size>0?o.hu=!0:i.modifiedDocuments.size>0?Se(o.hu,14607):i.removedDocuments.size>0&&(Se(o.hu,42227),o.hu=!1))})),await Lo(t,n,e)}catch(n){await gs(n)}}function If(r,e,t){const n=ge(r);if(n.isPrimaryClient&&t===0||!n.isPrimaryClient&&t===1){const i=[];n.Tu.forEach(((s,o)=>{const c=o.view.va(e);c.snapshot&&i.push(c.snapshot)})),(function(o,c){const l=ge(o);l.onlineState=c;let u=!1;l.queries.forEach(((f,d)=>{for(const h of d.ba)h.va(c)&&(u=!0)})),u&&Bu(l)})(n.eventManager,e),i.length&&n.Pu.J_(i),n.onlineState=e,n.isPrimaryClient&&n.sharedClientState.setOnlineState(e)}}async function qv(r,e,t){const n=ge(r);n.sharedClientState.updateQueryState(e,"rejected",t);const i=n.Au.get(e),s=i&&i.key;if(s){let o=new je(le.comparator);o=o.insert(s,At.newNoDocument(s,pe.min()));const c=xe().add(s),l=new ul(pe.min(),new Map,new je(Te),o,c);await yg(n,l),n.Ru=n.Ru.remove(s),n.Au.delete(e),zu(n)}else await qc(n.localStore,e,!1).then((()=>Hc(n,e,t))).catch(gs)}async function Gv(r,e){const t=ge(r),n=e.batch.batchId;try{const i=await Jb(t.localStore,e);bg(t,n,null),wg(t,n),t.sharedClientState.updateMutationState(n,"acknowledged"),await Lo(t,i)}catch(i){await gs(i)}}async function Uv(r,e,t){const n=ge(r);try{const i=await(function(o,c){const l=ge(o);return l.persistence.runTransaction("Reject batch","readwrite-primary",(u=>{let f;return l.mutationQueue.lookupMutationBatch(u,c).next((d=>(Se(d!==null,37113),f=d.keys(),l.mutationQueue.removeMutationBatch(u,d)))).next((()=>l.mutationQueue.performConsistencyCheck(u))).next((()=>l.documentOverlayCache.removeOverlaysForBatchId(u,f,c))).next((()=>l.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(u,f))).next((()=>l.localDocuments.getDocuments(u,f)))}))})(n.localStore,e);bg(n,e,t),wg(n,e),n.sharedClientState.updateMutationState(e,"rejected",t),await Lo(n,i)}catch(i){await gs(i)}}function wg(r,e){(r.mu.get(e)||[]).forEach((t=>{t.resolve()})),r.mu.delete(e)}function bg(r,e,t){const n=ge(r);let i=n.du[n.currentUser.toKey()];if(i){const s=i.get(e);s&&(t?s.reject(t):s.resolve(),i=i.remove(e)),n.du[n.currentUser.toKey()]=i}}function Hc(r,e,t=null){r.sharedClientState.removeLocalQueryTarget(e);for(const n of r.Iu.get(e))r.Tu.delete(n),t&&r.Pu.yu(n,t);r.Iu.delete(e),r.isPrimaryClient&&r.Vu.Gr(e).forEach((n=>{r.Vu.containsKey(n)||vg(r,n)}))}function vg(r,e){r.Eu.delete(e.path.canonicalString());const t=r.Ru.get(e);t!==null&&(Su(r.remoteStore,t),r.Ru=r.Ru.remove(e),r.Au.delete(t),zu(r))}function Cf(r,e,t){for(const n of t)n instanceof mg?(r.Vu.addReference(n.key,e),Hv(r,n)):n instanceof gg?(oe(Fu,"Document no longer in limbo: "+n.key),r.Vu.removeReference(n.key,e),r.Vu.containsKey(n.key)||vg(r,n.key)):he(19791,{wu:n})}function Hv(r,e){const t=e.key,n=t.path.canonicalString();r.Ru.get(t)||r.Eu.has(n)||(oe(Fu,"New document in limbo: "+t),r.Eu.add(n),zu(r))}function zu(r){for(;r.Eu.size>0&&r.Ru.size<r.maxConcurrentLimboResolutions;){const e=r.Eu.values().next().value;r.Eu.delete(e);const t=new le(Oe.fromString(e)),n=r.fu.next();r.Au.set(n,new Mv(t)),r.Ru=r.Ru.insert(t,n),cg(r.remoteStore,new yn(xr(sl(t.path)),n,"TargetPurposeLimboResolution",rl.ce))}}async function Lo(r,e,t){const n=ge(r),i=[],s=[],o=[];n.Tu.isEmpty()||(n.Tu.forEach(((c,l)=>{o.push(n.pu(l,e,t).then((u=>{if((u||t)&&n.isPrimaryClient){const f=u?!u.fromCache:t?.targetChanges.get(l.targetId)?.current;n.sharedClientState.updateQueryState(l.targetId,f?"current":"not-current")}if(u){i.push(u);const f=Iu.Es(l.targetId,u);s.push(f)}})))})),await Promise.all(o),n.Pu.J_(i),await(async function(l,u){const f=ge(l);try{await f.persistence.runTransaction("notifyLocalViewChanges","readwrite",(d=>W.forEach(u,(h=>W.forEach(h.Ts,(p=>f.persistence.referenceDelegate.addReference(d,h.targetId,p))).next((()=>W.forEach(h.Is,(p=>f.persistence.referenceDelegate.removeReference(d,h.targetId,p)))))))))}catch(d){if(!$s(d))throw d;oe(Cu,"Failed to update sequence numbers: "+d)}for(const d of u){const h=d.targetId;if(!d.fromCache){const p=f.vs.get(h),g=p.snapshotVersion,w=p.withLastLimboFreeSnapshotVersion(g);f.vs=f.vs.insert(h,w)}}})(n.localStore,s))}async function jv(r,e){const t=ge(r);if(!t.currentUser.isEqual(e)){oe(Fu,"User change. New user:",e.toKey());const n=await sg(t.localStore,e);t.currentUser=e,(function(s,o){s.mu.forEach((c=>{c.forEach((l=>{l.reject(new ie(H.CANCELLED,o))}))})),s.mu.clear()})(t,"'waitForPendingWrites' promise is rejected due to a user change."),t.sharedClientState.handleUserChange(e,n.removedBatchIds,n.addedBatchIds),await Lo(t,n.Ns)}}function Wv(r,e){const t=ge(r),n=t.Au.get(e);if(n&&n.hu)return xe().add(n.key);{let i=xe();const s=t.Iu.get(e);if(!s)return i;for(const o of s){const c=t.Tu.get(o);i=i.unionWith(c.view.nu)}return i}}function kg(r){const e=ge(r);return e.remoteStore.remoteSyncer.applyRemoteEvent=yg.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=Wv.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=qv.bind(null,e),e.Pu.J_=Sv.bind(null,e.eventManager),e.Pu.yu=Rv.bind(null,e.eventManager),e}function Qv(r){const e=ge(r);return e.remoteStore.remoteSyncer.applySuccessfulWrite=Gv.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=Uv.bind(null,e),e}class Ha{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=dl(e.databaseInfo.databaseId),this.sharedClientState=this.Du(e),this.persistence=this.Cu(e),await this.persistence.start(),this.localStore=this.vu(e),this.gcScheduler=this.Fu(e,this.localStore),this.indexBackfillerScheduler=this.Mu(e,this.localStore)}Fu(e,t){return null}Mu(e,t){return null}vu(e){return Zb(this.persistence,new Qb,e.initialUser,this.serializer)}Cu(e){return new ig(Au.Vi,this.serializer)}Du(e){return new iv}async terminate(){this.gcScheduler?.stop(),this.indexBackfillerScheduler?.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}Ha.provider={build:()=>new Ha};class Kv extends Ha{constructor(e){super(),this.cacheSizeBytes=e}Fu(e,t){Se(this.persistence.referenceDelegate instanceof Ga,46915);const n=this.persistence.referenceDelegate.garbageCollector;return new Lb(n,e.asyncQueue,t)}Cu(e){const t=this.cacheSizeBytes!==void 0?Dt.withCacheSize(this.cacheSizeBytes):Dt.DEFAULT;return new ig((n=>Ga.Vi(n,t)),this.serializer)}}class jc{async initialize(e,t){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(t),this.remoteStore=this.createRemoteStore(t),this.eventManager=this.createEventManager(t),this.syncEngine=this.createSyncEngine(t,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=n=>If(this.syncEngine,n,1),this.remoteStore.remoteSyncer.handleCredentialChange=jv.bind(null,this.syncEngine),await Av(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return(function(){return new Cv})()}createDatastore(e){const t=dl(e.databaseInfo.databaseId),n=cv(e.databaseInfo);return pv(e.authCredentials,e.appCheckCredentials,n,t)}createRemoteStore(e){return(function(n,i,s,o,c){return new gv(n,i,s,o,c)})(this.localStore,this.datastore,e.asyncQueue,(t=>If(this.syncEngine,t,0)),(function(){return kf.v()?new kf:new sv})())}createSyncEngine(e,t){return(function(i,s,o,c,l,u,f){const d=new Vv(i,s,o,c,l,u);return f&&(d.gu=!0),d})(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,t)}async terminate(){await(async function(t){const n=ge(t);oe(ui,"RemoteStore shutting down."),n.Ea.add(5),await Po(n),n.Aa.shutdown(),n.Va.set("Unknown")})(this.remoteStore),this.datastore?.terminate(),this.eventManager?.terminate()}}jc.provider={build:()=>new jc};class qu{constructor(e){this.observer=e,this.muted=!1}next(e){this.muted||this.observer.next&&this.Ou(this.observer.next,e)}error(e){this.muted||(this.observer.error?this.Ou(this.observer.error,e):jr("Uncaught Error in snapshot listener:",e.toString()))}Nu(){this.muted=!0}Ou(e,t){setTimeout((()=>{this.muted||e(t)}),0)}}const Pn="FirestoreClient";class Yv{constructor(e,t,n,i,s){this.authCredentials=e,this.appCheckCredentials=t,this.asyncQueue=n,this._databaseInfo=i,this.user=Et.UNAUTHENTICATED,this.clientId=mu.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=s,this.authCredentials.start(n,(async o=>{oe(Pn,"Received user=",o.uid),await this.authCredentialListener(o),this.user=o})),this.appCheckCredentials.start(n,(o=>(oe(Pn,"Received new app check token=",o),this.appCheckCredentialListener(o,this.user))))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this._databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();const e=new zr;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted((async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(t){const n=Vu(t,"Failed to shutdown persistence");e.reject(n)}})),e.promise}}async function sc(r,e){r.asyncQueue.verifyOperationInProgress(),oe(Pn,"Initializing OfflineComponentProvider");const t=r.configuration;await e.initialize(t);let n=t.initialUser;r.setCredentialChangeListener((async i=>{n.isEqual(i)||(await sg(e.localStore,i),n=i)})),e.persistence.setDatabaseDeletedListener((()=>r.terminate())),r._offlineComponents=e}async function Sf(r,e){r.asyncQueue.verifyOperationInProgress();const t=await Zv(r);oe(Pn,"Initializing OnlineComponentProvider"),await e.initialize(t,r.configuration),r.setCredentialChangeListener((n=>xf(e.remoteStore,n))),r.setAppCheckTokenChangeListener(((n,i)=>xf(e.remoteStore,i))),r._onlineComponents=e}async function Zv(r){if(!r._offlineComponents)if(r._uninitializedComponentsProvider){oe(Pn,"Using user provided OfflineComponentProvider");try{await sc(r,r._uninitializedComponentsProvider._offline)}catch(e){const t=e;if(!(function(i){return i.name==="FirebaseError"?i.code===H.FAILED_PRECONDITION||i.code===H.UNIMPLEMENTED:!(typeof DOMException<"u"&&i instanceof DOMException)||i.code===22||i.code===20||i.code===11})(t))throw t;ci("Error using user provided cache. Falling back to memory cache: "+t),await sc(r,new Ha)}}else oe(Pn,"Using default OfflineComponentProvider"),await sc(r,new Kv(void 0));return r._offlineComponents}async function Tg(r){return r._onlineComponents||(r._uninitializedComponentsProvider?(oe(Pn,"Using user provided OnlineComponentProvider"),await Sf(r,r._uninitializedComponentsProvider._online)):(oe(Pn,"Using default OnlineComponentProvider"),await Sf(r,new jc))),r._onlineComponents}function Jv(r){return Tg(r).then((e=>e.syncEngine))}async function ja(r){const e=await Tg(r),t=e.eventManager;return t.onListen=Dv.bind(null,e.syncEngine),t.onUnlisten=Ov.bind(null,e.syncEngine),t.onFirstRemoteStoreListen=Nv.bind(null,e.syncEngine),t.onLastRemoteStoreUnlisten=Fv.bind(null,e.syncEngine),t}function Xv(r,e,t,n){const i=new qu(n),s=new Ou(e,i,t);return r.asyncQueue.enqueueAndForget((async()=>Du(await ja(r),s))),()=>{i.Nu(),r.asyncQueue.enqueueAndForget((async()=>Nu(await ja(r),s)))}}function ek(r,e,t={}){const n=new zr;return r.asyncQueue.enqueueAndForget((async()=>(function(s,o,c,l,u){const f=new qu({next:h=>{f.Nu(),o.enqueueAndForget((()=>Nu(s,d)));const p=h.docs.has(c);!p&&h.fromCache?u.reject(new ie(H.UNAVAILABLE,"Failed to get document because the client is offline.")):p&&h.fromCache&&l&&l.source==="server"?u.reject(new ie(H.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):u.resolve(h)},error:h=>u.reject(h)}),d=new Ou(sl(c.path),f,{includeMetadataChanges:!0,Ka:!0});return Du(s,d)})(await ja(r),r.asyncQueue,e,t,n))),n.promise}function tk(r,e,t={}){const n=new zr;return r.asyncQueue.enqueueAndForget((async()=>(function(s,o,c,l,u){const f=new qu({next:h=>{f.Nu(),o.enqueueAndForget((()=>Nu(s,d))),h.fromCache&&l.source==="server"?u.reject(new ie(H.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):u.resolve(h)},error:h=>u.reject(h)}),d=new Ou(c,f,{includeMetadataChanges:!0,Ka:!0});return Du(s,d)})(await ja(r),r.asyncQueue,e,t,n))),n.promise}function rk(r,e){const t=new zr;return r.asyncQueue.enqueueAndForget((async()=>zv(await Jv(r),e,t))),t.promise}function xg(r){const e={};return r.timeoutSeconds!==void 0&&(e.timeoutSeconds=r.timeoutSeconds),e}const nk="ComponentProvider",Rf=new Map;function ik(r,e,t,n,i){return new xw(r,e,t,i.host,i.ssl,i.experimentalForceLongPolling,i.experimentalAutoDetectLongPolling,xg(i.experimentalLongPollingOptions),i.useFetchStreams,i.isUsingEmulator,n)}const _g="firestore.googleapis.com",Pf=!0;class Lf{constructor(e){if(e.host===void 0){if(e.ssl!==void 0)throw new ie(H.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host=_g,this.ssl=Pf}else this.host=e.host,this.ssl=e.ssl??Pf;if(this.isUsingEmulator=e.emulatorOptions!==void 0,this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=ng;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<Rb)throw new ie(H.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}fw("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=xg(e.experimentalLongPollingOptions??{}),(function(n){if(n.timeoutSeconds!==void 0){if(isNaN(n.timeoutSeconds))throw new ie(H.INVALID_ARGUMENT,`invalid long polling timeout: ${n.timeoutSeconds} (must not be NaN)`);if(n.timeoutSeconds<5)throw new ie(H.INVALID_ARGUMENT,`invalid long polling timeout: ${n.timeoutSeconds} (minimum allowed value is 5)`);if(n.timeoutSeconds>30)throw new ie(H.INVALID_ARGUMENT,`invalid long polling timeout: ${n.timeoutSeconds} (maximum allowed value is 30)`)}})(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&(function(n,i){return n.timeoutSeconds===i.timeoutSeconds})(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class pl{constructor(e,t,n,i){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=n,this._app=i,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new Lf({}),this._settingsFrozen=!1,this._emulatorOptions={},this._terminateTask="notTerminated"}get app(){if(!this._app)throw new ie(H.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new ie(H.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new Lf(e),this._emulatorOptions=e.emulatorOptions||{},e.credentials!==void 0&&(this._authCredentials=(function(n){if(!n)return new nw;switch(n.type){case"firstParty":return new aw(n.sessionIndex||"0",n.iamToken||null,n.authTokenFactory||null);case"provider":return n.client;default:throw new ie(H.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}})(e.credentials))}_getSettings(){return this._settings}_getEmulatorOptions(){return this._emulatorOptions}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return(function(t){const n=Rf.get(t);n&&(oe(nk,"Removing Datastore"),Rf.delete(t),n.terminate())})(this),Promise.resolve()}}function sk(r,e,t,n={}){r=Gt(r,pl);const i=hs(e),s=r._getSettings(),o={...s,emulatorOptions:r._getEmulatorOptions()},c=`${e}:${t}`;i&&(yp(`https://${c}`),wp("Firestore",!0)),s.host!==_g&&s.host!==c&&ci("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used.");const l={...s,host:c,ssl:i,emulatorOptions:n};if(!En(l,o)&&(r._setSettings(l),n.mockUserToken)){let u,f;if(typeof n.mockUserToken=="string")u=n.mockUserToken,f=Et.MOCK_USER;else{u=f$(n.mockUserToken,r._app?.options.projectId);const d=n.mockUserToken.sub||n.mockUserToken.user_id;if(!d)throw new ie(H.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");f=new Et(d)}r._authCredentials=new iw(new fm(u,f))}}class $i{constructor(e,t,n){this.converter=t,this._query=n,this.type="query",this.firestore=e}withConverter(e){return new $i(this.firestore,e,this._query)}}class Ye{constructor(e,t,n){this.converter=t,this._key=n,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new xn(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new Ye(this.firestore,e,this._key)}toJSON(){return{type:Ye._jsonSchemaVersion,referencePath:this._key.toString()}}static fromJSON(e,t,n){if(Io(t,Ye._jsonSchema))return new Ye(e,n||null,new le(Oe.fromString(t.referencePath)))}}Ye._jsonSchemaVersion="firestore/documentReference/1.0",Ye._jsonSchema={type:nt("string",Ye._jsonSchemaVersion),referencePath:nt("string")};class xn extends $i{constructor(e,t,n){super(e,t,sl(n)),this._path=n,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new Ye(this.firestore,null,new le(e))}withConverter(e){return new xn(this.firestore,e,this._path)}}function Me(r,e,...t){if(r=gt(r),pm("collection","path",e),r instanceof pl){const n=Oe.fromString(e,...t);return Hh(n),new xn(r,null,n)}{if(!(r instanceof Ye||r instanceof xn))throw new ie(H.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const n=r._path.child(Oe.fromString(e,...t));return Hh(n),new xn(r.firestore,null,n)}}function re(r,e,...t){if(r=gt(r),arguments.length===1&&(e=mu.newId()),pm("doc","path",e),r instanceof pl){const n=Oe.fromString(e,...t);return Uh(n),new Ye(r,null,new le(n))}{if(!(r instanceof Ye||r instanceof xn))throw new ie(H.INVALID_ARGUMENT,"Expected first argument to doc() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const n=r._path.child(Oe.fromString(e,...t));return Uh(n),new Ye(r.firestore,r instanceof xn?r.converter:null,new le(n))}}const Mf="AsyncQueue";class Vf{constructor(e=Promise.resolve()){this.Yu=[],this.ec=!1,this.tc=[],this.nc=null,this.rc=!1,this.sc=!1,this.oc=[],this.M_=new ag(this,"async_queue_retry"),this._c=()=>{const n=ic();n&&oe(Mf,"Visibility state changed to "+n.visibilityState),this.M_.w_()},this.ac=e;const t=ic();t&&typeof t.addEventListener=="function"&&t.addEventListener("visibilitychange",this._c)}get isShuttingDown(){return this.ec}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.uc(),this.cc(e)}enterRestrictedMode(e){if(!this.ec){this.ec=!0,this.sc=e||!1;const t=ic();t&&typeof t.removeEventListener=="function"&&t.removeEventListener("visibilitychange",this._c)}}enqueue(e){if(this.uc(),this.ec)return new Promise((()=>{}));const t=new zr;return this.cc((()=>this.ec&&this.sc?Promise.resolve():(e().then(t.resolve,t.reject),t.promise))).then((()=>t.promise))}enqueueRetryable(e){this.enqueueAndForget((()=>(this.Yu.push(e),this.lc())))}async lc(){if(this.Yu.length!==0){try{await this.Yu[0](),this.Yu.shift(),this.M_.reset()}catch(e){if(!$s(e))throw e;oe(Mf,"Operation failed with retryable error: "+e)}this.Yu.length>0&&this.M_.p_((()=>this.lc()))}}cc(e){const t=this.ac.then((()=>(this.rc=!0,e().catch((n=>{throw this.nc=n,this.rc=!1,jr("INTERNAL UNHANDLED ERROR: ",Df(n)),n})).then((n=>(this.rc=!1,n))))));return this.ac=t,t}enqueueAfterDelay(e,t,n){this.uc(),this.oc.indexOf(e)>-1&&(t=0);const i=Mu.createAndSchedule(this,e,t,n,(s=>this.hc(s)));return this.tc.push(i),i}uc(){this.nc&&he(47125,{Pc:Df(this.nc)})}verifyOperationInProgress(){}async Tc(){let e;do e=this.ac,await e;while(e!==this.ac)}Ic(e){for(const t of this.tc)if(t.timerId===e)return!0;return!1}Ec(e){return this.Tc().then((()=>{this.tc.sort(((t,n)=>t.targetTimeMs-n.targetTimeMs));for(const t of this.tc)if(t.skipDelay(),e!=="all"&&t.timerId===e)break;return this.Tc()}))}Rc(e){this.oc.push(e)}hc(e){const t=this.tc.indexOf(e);this.tc.splice(t,1)}}function Df(r){let e=r.message||"";return r.stack&&(e=r.stack.includes(r.message)?r.stack:r.message+`
`+r.stack),e}class Ln extends pl{constructor(e,t,n,i){super(e,t,n,i),this.type="firestore",this._queue=new Vf,this._persistenceKey=i?.name||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new Vf(e),this._firestoreClient=void 0,await e}}}function ok(r,e){const t=typeof r=="object"?r:Tp(),n=typeof r=="string"?r:Na,i=su(t,"firestore").getImmediate({identifier:n});if(!i._initialized){const s=d$("firestore");s&&sk(i,...s)}return i}function ml(r){if(r._terminated)throw new ie(H.FAILED_PRECONDITION,"The client has already been terminated.");return r._firestoreClient||ak(r),r._firestoreClient}function ak(r){const e=r._freezeSettings(),t=ik(r._databaseId,r._app?.options.appId||"",r._persistenceKey,r._app?.options.apiKey,e);r._componentsProvider||e.localCache?._offlineComponentProvider&&e.localCache?._onlineComponentProvider&&(r._componentsProvider={_offline:e.localCache._offlineComponentProvider,_online:e.localCache._onlineComponentProvider}),r._firestoreClient=new Yv(r._authCredentials,r._appCheckCredentials,r._queue,t,r._componentsProvider&&(function(i){const s=i?._online.build();return{_offline:i?._offline.build(s),_online:s}})(r._componentsProvider))}class Kt{constructor(e){this._byteString=e}static fromBase64String(e){try{return new Kt(vt.fromBase64String(e))}catch(t){throw new ie(H.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+t)}}static fromUint8Array(e){return new Kt(vt.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}toJSON(){return{type:Kt._jsonSchemaVersion,bytes:this.toBase64()}}static fromJSON(e){if(Io(e,Kt._jsonSchema))return Kt.fromBase64String(e.bytes)}}Kt._jsonSchemaVersion="firestore/bytes/1.0",Kt._jsonSchema={type:nt("string",Kt._jsonSchemaVersion),bytes:nt("string")};class Gu{constructor(...e){for(let t=0;t<e.length;++t)if(e[t].length===0)throw new ie(H.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new bt(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}class Mo{constructor(e){this._methodName=e}}class Er{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new ie(H.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new ie(H.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}_compareTo(e){return Te(this._lat,e._lat)||Te(this._long,e._long)}toJSON(){return{latitude:this._lat,longitude:this._long,type:Er._jsonSchemaVersion}}static fromJSON(e){if(Io(e,Er._jsonSchema))return new Er(e.latitude,e.longitude)}}Er._jsonSchemaVersion="firestore/geoPoint/1.0",Er._jsonSchema={type:nt("string",Er._jsonSchemaVersion),latitude:nt("number"),longitude:nt("number")};class or{constructor(e){this._values=(e||[]).map((t=>t))}toArray(){return this._values.map((e=>e))}isEqual(e){return(function(n,i){if(n.length!==i.length)return!1;for(let s=0;s<n.length;++s)if(n[s]!==i[s])return!1;return!0})(this._values,e._values)}toJSON(){return{type:or._jsonSchemaVersion,vectorValues:this._values}}static fromJSON(e){if(Io(e,or._jsonSchema)){if(Array.isArray(e.vectorValues)&&e.vectorValues.every((t=>typeof t=="number")))return new or(e.vectorValues);throw new ie(H.INVALID_ARGUMENT,"Expected 'vectorValues' field to be a number array")}}}or._jsonSchemaVersion="firestore/vectorValue/1.0",or._jsonSchema={type:nt("string",or._jsonSchemaVersion),vectorValues:nt("object")};const lk=/^__.*__$/;class ck{constructor(e,t,n){this.data=e,this.fieldMask=t,this.fieldTransforms=n}toMutation(e,t){return this.fieldMask!==null?new Bn(e,this.data,this.fieldMask,t,this.fieldTransforms):new So(e,this.data,t,this.fieldTransforms)}}class Eg{constructor(e,t,n){this.data=e,this.fieldMask=t,this.fieldTransforms=n}toMutation(e,t){return new Bn(e,this.data,this.fieldMask,t,this.fieldTransforms)}}function Ag(r){switch(r){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw he(40011,{dataSource:r})}}class gl{constructor(e,t,n,i,s,o){this.settings=e,this.databaseId=t,this.serializer=n,this.ignoreUndefinedProperties=i,s===void 0&&this.validatePath(),this.fieldTransforms=s||[],this.fieldMask=o||[]}get path(){return this.settings.path}get dataSource(){return this.settings.dataSource}contextWith(e){return new gl({...this.settings,...e},this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}childContextForField(e){const t=this.path?.child(e),n=this.contextWith({path:t,arrayElement:!1});return n.validatePathSegment(e),n}childContextForFieldPath(e){const t=this.path?.child(e),n=this.contextWith({path:t,arrayElement:!1});return n.validatePath(),n}childContextForArray(e){return this.contextWith({path:void 0,arrayElement:!0})}createError(e){return Wa(e,this.settings.methodName,this.settings.hasConverter||!1,this.path,this.settings.targetDoc)}contains(e){return this.fieldMask.find((t=>e.isPrefixOf(t)))!==void 0||this.fieldTransforms.find((t=>e.isPrefixOf(t.field)))!==void 0}validatePath(){if(this.path)for(let e=0;e<this.path.length;e++)this.validatePathSegment(this.path.get(e))}validatePathSegment(e){if(e.length===0)throw this.createError("Document fields must not be empty");if(Ag(this.dataSource)&&lk.test(e))throw this.createError('Document fields cannot begin and end with "__"')}}class uk{constructor(e,t,n){this.databaseId=e,this.ignoreUndefinedProperties=t,this.serializer=n||dl(e)}createContext(e,t,n,i=!1){return new gl({dataSource:e,methodName:t,targetDoc:n,path:bt.emptyPath(),arrayElement:!1,hasConverter:i},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function Uu(r){const e=r._freezeSettings(),t=dl(r._databaseId);return new uk(r._databaseId,!!e.ignoreUndefinedProperties,t)}function dk(r,e,t,n,i,s={}){const o=r.createContext(s.merge||s.mergeFields?2:0,e,t,i);Wu("Data must be an object, but it was:",o,n);const c=Ig(n,o);let l,u;if(s.merge)l=new qt(o.fieldMask),u=o.fieldTransforms;else if(s.mergeFields){const f=[];for(const d of s.mergeFields){const h=ss(e,d,t);if(!o.contains(h))throw new ie(H.INVALID_ARGUMENT,`Field '${h}' is specified in your field mask but missing from your input data.`);Rg(f,h)||f.push(h)}l=new qt(f),u=o.fieldTransforms.filter((d=>l.covers(d.field)))}else l=null,u=o.fieldTransforms;return new ck(new Nt(c),l,u)}class $l extends Mo{_toFieldTransform(e){if(e.dataSource!==2)throw e.dataSource===1?e.createError(`${this._methodName}() can only appear at the top level of your update data`):e.createError(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return e.fieldMask.push(e.path),null}isEqual(e){return e instanceof $l}}function hk(r,e,t){return new gl({dataSource:3,targetDoc:e.settings.targetDoc,methodName:r._methodName,arrayElement:t},e.databaseId,e.serializer,e.ignoreUndefinedProperties)}class Hu extends Mo{_toFieldTransform(e){return new Gm(e.path,new ho)}isEqual(e){return e instanceof Hu}}class ju extends Mo{constructor(e,t){super(e),this.Ac=t}_toFieldTransform(e){const t=hk(this,e,!0),n=this.Ac.map((s=>ws(s,t))),i=new rs(n);return new Gm(e.path,i)}isEqual(e){return e instanceof ju&&En(this.Ac,e.Ac)}}function fk(r,e,t,n){const i=r.createContext(1,e,t);Wu("Data must be an object, but it was:",i,n);const s=[],o=Nt.empty();Nn(n,((l,u)=>{const f=Sg(e,l,t);u=gt(u);const d=i.childContextForFieldPath(f);if(u instanceof $l)s.push(f);else{const h=ws(u,d);h!=null&&(s.push(f),o.set(f,h))}}));const c=new qt(s);return new Eg(o,c,i.fieldTransforms)}function pk(r,e,t,n,i,s){const o=r.createContext(1,e,t),c=[ss(e,n,t)],l=[i];if(s.length%2!=0)throw new ie(H.INVALID_ARGUMENT,`Function ${e}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let h=0;h<s.length;h+=2)c.push(ss(e,s[h])),l.push(s[h+1]);const u=[],f=Nt.empty();for(let h=c.length-1;h>=0;--h)if(!Rg(u,c[h])){const p=c[h];let g=l[h];g=gt(g);const w=o.childContextForFieldPath(p);if(g instanceof $l)u.push(p);else{const b=ws(g,w);b!=null&&(u.push(p),f.set(p,b))}}const d=new qt(u);return new Eg(f,d,o.fieldTransforms)}function mk(r,e,t,n=!1){return ws(t,r.createContext(n?4:3,e))}function ws(r,e){if(Cg(r=gt(r)))return Wu("Unsupported field value:",e,r),Ig(r,e);if(r instanceof Mo)return(function(n,i){if(!Ag(i.dataSource))throw i.createError(`${n._methodName}() can only be used with update() and set()`);if(!i.path)throw i.createError(`${n._methodName}() is not currently supported inside arrays`);const s=n._toFieldTransform(i);s&&i.fieldTransforms.push(s)})(r,e),null;if(r===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),r instanceof Array){if(e.settings.arrayElement&&e.dataSource!==4)throw e.createError("Nested arrays are not supported");return(function(n,i){const s=[];let o=0;for(const c of n){let l=ws(c,i.childContextForArray(o));l==null&&(l={nullValue:"NULL_VALUE"}),s.push(l),o++}return{arrayValue:{values:s}}})(r,e)}return(function(n,i){if((n=gt(n))===null)return{nullValue:"NULL_VALUE"};if(typeof n=="number")return Kw(i.serializer,n);if(typeof n=="boolean")return{booleanValue:n};if(typeof n=="string")return{stringValue:n};if(n instanceof Date){const s=Ge.fromDate(n);return{timestampValue:qa(i.serializer,s)}}if(n instanceof Ge){const s=new Ge(n.seconds,1e3*Math.floor(n.nanoseconds/1e3));return{timestampValue:qa(i.serializer,s)}}if(n instanceof Er)return{geoPointValue:{latitude:n.latitude,longitude:n.longitude}};if(n instanceof Kt)return{bytesValue:Km(i.serializer,n._byteString)};if(n instanceof Ye){const s=i.databaseId,o=n.firestore._databaseId;if(!o.isEqual(s))throw i.createError(`Document reference is for database ${o.projectId}/${o.database} but should be for database ${s.projectId}/${s.database}`);return{referenceValue:_u(n.firestore._databaseId||i.databaseId,n._key.path)}}if(n instanceof or)return(function(o,c){const l=o instanceof or?o.toArray():o;return{mapValue:{fields:{[Tm]:{stringValue:xm},[Ba]:{arrayValue:{values:l.map((f=>{if(typeof f!="number")throw c.createError("VectorValues must only contain numeric values.");return vu(c.serializer,f)}))}}}}}})(n,i);if(rg(n))return n._toProto(i.serializer);throw i.createError(`Unsupported field value: ${tl(n)}`)})(r,e)}function Ig(r,e){const t={};return $m(r)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):Nn(r,((n,i)=>{const s=ws(i,e.childContextForField(n));s!=null&&(t[n]=s)})),{mapValue:{fields:t}}}function Cg(r){return!(typeof r!="object"||r===null||r instanceof Array||r instanceof Date||r instanceof Ge||r instanceof Er||r instanceof Kt||r instanceof Ye||r instanceof Mo||r instanceof or||rg(r))}function Wu(r,e,t){if(!Cg(t)||!mm(t)){const n=tl(t);throw n==="an object"?e.createError(r+" a custom object"):e.createError(r+" "+n)}}function ss(r,e,t){if((e=gt(e))instanceof Gu)return e._internalPath;if(typeof e=="string")return Sg(r,e);throw Wa("Field path arguments must be of type string or ",r,!1,void 0,t)}const gk=new RegExp("[~\\*/\\[\\]]");function Sg(r,e,t){if(e.search(gk)>=0)throw Wa(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,r,!1,void 0,t);try{return new Gu(...e.split("."))._internalPath}catch{throw Wa(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,r,!1,void 0,t)}}function Wa(r,e,t,n,i){const s=n&&!n.isEmpty(),o=i!==void 0;let c=`Function ${e}() called with invalid data`;t&&(c+=" (via `toFirestore()`)"),c+=". ";let l="";return(s||o)&&(l+=" (found",s&&(l+=` in field ${n}`),o&&(l+=` in document ${i}`),l+=")"),new ie(H.INVALID_ARGUMENT,c+r+l)}function Rg(r,e){return r.some((t=>t.isEqual(e)))}class $k{convertValue(e,t="none"){switch(Sn(e)){case 0:return null;case 1:return e.booleanValue;case 2:return Ze(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,t);case 5:return e.stringValue;case 6:return this.convertBytes(Cn(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,t);case 11:return this.convertObject(e.mapValue,t);case 10:return this.convertVectorValue(e.mapValue);default:throw he(62114,{value:e})}}convertObject(e,t){return this.convertObjectMap(e.fields,t)}convertObjectMap(e,t="none"){const n={};return Nn(e,((i,s)=>{n[i]=this.convertValue(s,t)})),n}convertVectorValue(e){const t=e.fields?.[Ba].arrayValue?.values?.map((n=>Ze(n.doubleValue)));return new or(t)}convertGeoPoint(e){return new Er(Ze(e.latitude),Ze(e.longitude))}convertArray(e,t){return(e.values||[]).map((n=>this.convertValue(n,t)))}convertServerTimestamp(e,t){switch(t){case"previous":const n=il(e);return n==null?null:this.convertValue(n,t);case"estimate":return this.convertTimestamp(lo(e));default:return null}}convertTimestamp(e){const t=In(e);return new Ge(t.seconds,t.nanos)}convertDocumentKey(e,t){const n=Oe.fromString(e);Se(tg(n),9688,{name:e});const i=new co(n.get(1),n.get(3)),s=new le(n.popFirst(5));return i.isEqual(t)||jr(`Document ${s} contains a document reference within a different database (${i.projectId}/${i.database}) which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`),s}}class Qu extends $k{constructor(e){super(),this.firestore=e}convertBytes(e){return new Kt(e)}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return new Ye(this.firestore,null,t)}}function di(){return new Hu("serverTimestamp")}function yk(...r){return new ju("arrayUnion",r)}const Nf="@firebase/firestore",Bf="4.12.0";function Of(r){return(function(t,n){if(typeof t!="object"||t===null)return!1;const i=t;for(const s of n)if(s in i&&typeof i[s]=="function")return!0;return!1})(r,["next","error","complete"])}class Pg{constructor(e,t,n,i,s){this._firestore=e,this._userDataWriter=t,this._key=n,this._document=i,this._converter=s}get id(){return this._key.path.lastSegment()}get ref(){return new Ye(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new wk(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}_fieldsProto(){return this._document?.data.clone().value.mapValue.fields??void 0}get(e){if(this._document){const t=this._document.data.field(ss("DocumentSnapshot.get",e));if(t!==null)return this._userDataWriter.convertValue(t)}}}class wk extends Pg{data(){return super.data()}}function Lg(r){if(r.limitType==="L"&&r.explicitOrderBy.length===0)throw new ie(H.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class Ku{}class bk extends Ku{}function Vo(r,e,...t){let n=[];e instanceof Ku&&n.push(e),n=n.concat(t),(function(s){const o=s.filter((l=>l instanceof Yu)).length,c=s.filter((l=>l instanceof yl)).length;if(o>1||o>0&&c>0)throw new ie(H.INVALID_ARGUMENT,"InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.")})(n);for(const i of n)r=i._apply(r);return r}class yl extends bk{constructor(e,t,n){super(),this._field=e,this._op=t,this._value=n,this.type="where"}static _create(e,t,n){return new yl(e,t,n)}_apply(e){const t=this._parse(e);return Mg(e._query,t),new $i(e.firestore,e.converter,Dc(e._query,t))}_parse(e){const t=Uu(e.firestore);return(function(s,o,c,l,u,f,d){let h;if(u.isKeyField()){if(f==="array-contains"||f==="array-contains-any")throw new ie(H.INVALID_ARGUMENT,`Invalid Query. You can't perform '${f}' queries on documentId().`);if(f==="in"||f==="not-in"){zf(d,f);const g=[];for(const w of d)g.push(Ff(l,s,w));h={arrayValue:{values:g}}}else h=Ff(l,s,d)}else f!=="in"&&f!=="not-in"&&f!=="array-contains-any"||zf(d,f),h=mk(c,o,d,f==="in"||f==="not-in");return rt.create(u,f,h)})(e._query,"where",t,e.firestore._databaseId,this._field,this._op,this._value)}}function po(r,e,t){const n=e,i=ss("where",r);return yl._create(i,n,t)}class Yu extends Ku{constructor(e,t){super(),this.type=e,this._queryConstraints=t}static _create(e,t){return new Yu(e,t)}_parse(e){const t=this._queryConstraints.map((n=>n._parse(e))).filter((n=>n.getFilters().length>0));return t.length===1?t[0]:ur.create(t,this._getOperator())}_apply(e){const t=this._parse(e);return t.getFilters().length===0?e:((function(i,s){let o=i;const c=s.getFlattenedFilters();for(const l of c)Mg(o,l),o=Dc(o,l)})(e._query,t),new $i(e.firestore,e.converter,Dc(e._query,t)))}_getQueryConstraints(){return this._queryConstraints}_getOperator(){return this.type==="and"?"and":"or"}}function Ff(r,e,t){if(typeof(t=gt(t))=="string"){if(t==="")throw new ie(H.INVALID_ARGUMENT,"Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");if(!Pm(e)&&t.indexOf("/")!==-1)throw new ie(H.INVALID_ARGUMENT,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${t}' contains a '/' character.`);const n=e.path.child(Oe.fromString(t));if(!le.isDocumentKey(n))throw new ie(H.INVALID_ARGUMENT,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${n}' is not because it has an odd number of segments (${n.length}).`);return Xh(r,new le(n))}if(t instanceof Ye)return Xh(r,t._key);throw new ie(H.INVALID_ARGUMENT,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${tl(t)}.`)}function zf(r,e){if(!Array.isArray(r)||r.length===0)throw new ie(H.INVALID_ARGUMENT,`Invalid Query. A non-empty array is required for '${e.toString()}' filters.`)}function Mg(r,e){const t=(function(i,s){for(const o of i)for(const c of o.getFlattenedFilters())if(s.indexOf(c.op)>=0)return c.op;return null})(r.filters,(function(i){switch(i){case"!=":return["!=","not-in"];case"array-contains-any":case"in":return["not-in"];case"not-in":return["array-contains-any","in","not-in","!="];default:return[]}})(e.op));if(t!==null)throw t===e.op?new ie(H.INVALID_ARGUMENT,`Invalid query. You cannot use more than one '${e.op.toString()}' filter.`):new ie(H.INVALID_ARGUMENT,`Invalid query. You cannot use '${e.op.toString()}' filters with '${t.toString()}' filters.`)}function vk(r,e,t){let n;return n=r?r.toFirestore(e):e,n}class Ws{constructor(e,t){this.hasPendingWrites=e,this.fromCache=t}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class ti extends Pg{constructor(e,t,n,i,s,o){super(e,t,n,i,o),this._firestore=e,this._firestoreImpl=e,this.metadata=s}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const t=new ba(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(t,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,t={}){if(this._document){const n=this._document.data.field(ss("DocumentSnapshot.get",e));if(n!==null)return this._userDataWriter.convertValue(n,t.serverTimestamps)}}toJSON(){if(this.metadata.hasPendingWrites)throw new ie(H.FAILED_PRECONDITION,"DocumentSnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e=this._document,t={};return t.type=ti._jsonSchemaVersion,t.bundle="",t.bundleSource="DocumentSnapshot",t.bundleName=this._key.toString(),!e||!e.isValidDocument()||!e.isFoundDocument()?t:(this._userDataWriter.convertObjectMap(e.data.value.mapValue.fields,"previous"),t.bundle=(this._firestore,this.ref.path,"NOT SUPPORTED"),t)}}ti._jsonSchemaVersion="firestore/documentSnapshot/1.0",ti._jsonSchema={type:nt("string",ti._jsonSchemaVersion),bundleSource:nt("string","DocumentSnapshot"),bundleName:nt("string"),bundle:nt("string")};class ba extends ti{data(e={}){return super.data(e)}}class ri{constructor(e,t,n,i){this._firestore=e,this._userDataWriter=t,this._snapshot=i,this.metadata=new Ws(i.hasPendingWrites,i.fromCache),this.query=n}get docs(){const e=[];return this.forEach((t=>e.push(t))),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,t){this._snapshot.docs.forEach((n=>{e.call(t,new ba(this._firestore,this._userDataWriter,n.key,n,new Ws(this._snapshot.mutatedKeys.has(n.key),this._snapshot.fromCache),this.query.converter))}))}docChanges(e={}){const t=!!e.includeMetadataChanges;if(t&&this._snapshot.excludesMetadataChanges)throw new ie(H.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===t||(this._cachedChanges=(function(i,s){if(i._snapshot.oldDocs.isEmpty()){let o=0;return i._snapshot.docChanges.map((c=>{const l=new ba(i._firestore,i._userDataWriter,c.doc.key,c.doc,new Ws(i._snapshot.mutatedKeys.has(c.doc.key),i._snapshot.fromCache),i.query.converter);return c.doc,{type:"added",doc:l,oldIndex:-1,newIndex:o++}}))}{let o=i._snapshot.oldDocs;return i._snapshot.docChanges.filter((c=>s||c.type!==3)).map((c=>{const l=new ba(i._firestore,i._userDataWriter,c.doc.key,c.doc,new Ws(i._snapshot.mutatedKeys.has(c.doc.key),i._snapshot.fromCache),i.query.converter);let u=-1,f=-1;return c.type!==0&&(u=o.indexOf(c.doc.key),o=o.delete(c.doc.key)),c.type!==1&&(o=o.add(c.doc),f=o.indexOf(c.doc.key)),{type:kk(c.type),doc:l,oldIndex:u,newIndex:f}}))}})(this,t),this._cachedChangesIncludeMetadataChanges=t),this._cachedChanges}toJSON(){if(this.metadata.hasPendingWrites)throw new ie(H.FAILED_PRECONDITION,"QuerySnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e={};e.type=ri._jsonSchemaVersion,e.bundleSource="QuerySnapshot",e.bundleName=mu.newId(),this._firestore._databaseId.database,this._firestore._databaseId.projectId;const t=[],n=[],i=[];return this.docs.forEach((s=>{s._document!==null&&(t.push(s._document),n.push(this._userDataWriter.convertObjectMap(s._document.data.value.mapValue.fields,"previous")),i.push(s.ref.path))})),e.bundle=(this._firestore,this.query._query,e.bundleName,"NOT SUPPORTED"),e}}function kk(r){switch(r){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return he(61501,{type:r})}}ri._jsonSchemaVersion="firestore/querySnapshot/1.0",ri._jsonSchema={type:nt("string",ri._jsonSchemaVersion),bundleSource:nt("string","QuerySnapshot"),bundleName:nt("string"),bundle:nt("string")};function Xe(r){r=Gt(r,Ye);const e=Gt(r.firestore,Ln),t=ml(e);return ek(t,r._key).then((n=>Vg(e,r,n)))}function St(r){r=Gt(r,$i);const e=Gt(r.firestore,Ln),t=ml(e),n=new Qu(e);return Lg(r._query),tk(t,r._query).then((i=>new ri(e,n,r,i)))}function Ut(r,e,t){r=Gt(r,Ye);const n=Gt(r.firestore,Ln),i=vk(r.converter,e),s=Uu(n);return Zu(n,[dk(s,"setDoc",r._key,i,r.converter!==null,t).toMutation(r._key,sr.none())])}function Re(r,e,t,...n){r=Gt(r,Ye);const i=Gt(r.firestore,Ln),s=Uu(i);let o;return o=typeof(e=gt(e))=="string"||e instanceof Gu?pk(s,"updateDoc",r._key,e,t,n):fk(s,"updateDoc",r._key,e),Zu(i,[o.toMutation(r._key,sr.exists(!0))])}function qr(r){return Zu(Gt(r.firestore,Ln),[new ku(r._key,sr.none())])}function Do(r,...e){r=gt(r);let t={includeMetadataChanges:!1,source:"default"},n=0;typeof e[n]!="object"||Of(e[n])||(t=e[n++]);const i={includeMetadataChanges:t.includeMetadataChanges,source:t.source};if(Of(e[n])){const u=e[n];e[n]=u.next?.bind(u),e[n+1]=u.error?.bind(u),e[n+2]=u.complete?.bind(u)}let s,o,c;if(r instanceof Ye)o=Gt(r.firestore,Ln),c=sl(r._key.path),s={next:u=>{e[n]&&e[n](Vg(o,r,u))},error:e[n+1],complete:e[n+2]};else{const u=Gt(r,$i);o=Gt(u.firestore,Ln),c=u._query;const f=new Qu(o);s={next:d=>{e[n]&&e[n](new ri(o,f,u,d))},error:e[n+1],complete:e[n+2]},Lg(r._query)}const l=ml(o);return Xv(l,c,i,s)}function Zu(r,e){const t=ml(r);return rk(t,e)}function Vg(r,e,t){const n=t.docs.get(e._key),i=new Qu(r);return new ti(r,i,e._key,n,new Ws(t.hasPendingWrites,t.fromCache),e.converter)}(function(e,t=!0){rw(fs),Ji(new si("firestore",((n,{instanceIdentifier:i,options:s})=>{const o=n.getProvider("app").getImmediate(),c=new Ln(new sw(n.getProvider("auth-internal")),new lw(o,n.getProvider("app-check-internal")),_w(o,i),o);return s={useFetchStreams:t,...s},c._setSettings(s),c}),"PUBLIC").setMultipleInstances(!0)),kn(Nf,Bf,e),kn(Nf,Bf,"esm2020")})();const qf={apiKey:"AIzaSyBpqBsE7bqflFdor3544DSc6HbYEAT_uxw",authDomain:"war-chess-fa10a.firebaseapp.com",projectId:"war-chess-fa10a",storageBucket:"war-chess-fa10a.firebasestorage.app",messagingSenderId:"27892295459",appId:"1:27892295459:web:0d5ce47d3a4f226e86ce96"};let oc=null,hi=null,B=null;function Tk(){try{return qf.apiKey==="YOUR_API_KEY"?(console.warn("Firebase not configured - running in offline mode"),!1):(oc=kp(qf),hi=ew(oc),B=ok(oc),!0)}catch(r){return console.error("Firebase init error:",r),!1}}const Dg=["lijndersromijn@gmail.com","sptjoosten@icloud.com"],Pe=[{id:"theme_desert",name:"Desert Camo",description:"Sandy desert battlefield theme",price:100,type:"theme",icon:"🏜️",colors:{light:"#d4a574",dark:"#8b6914",accent:"#c4a35a",water:"#4a90a4"}},{id:"theme_arctic",name:"Arctic Snow",description:"Cold snowy battlefield theme",price:100,type:"theme",icon:"❄️",colors:{light:"#e8f4f8",dark:"#a8c8d8",accent:"#c0dce8",water:"#5588aa"}},{id:"theme_jungle",name:"Jungle Warfare",description:"Dense jungle battlefield theme",price:150,type:"theme",icon:"🌴",colors:{light:"#7cb342",dark:"#33691e",accent:"#558b2f",water:"#00695c"}},{id:"theme_night",name:"Night Ops",description:"Dark nighttime tactical theme",price:200,type:"theme",icon:"🌙",colors:{light:"#37474f",dark:"#1a237e",accent:"#263238",water:"#0d47a1"}},{id:"theme_ocean",name:"Ocean Assault",description:"Deep sea naval theme",price:150,type:"theme",icon:"🌊",colors:{light:"#4fc3f7",dark:"#0277bd",accent:"#29b6f6",water:"#01579b"}},{id:"theme_lava",name:"Volcanic",description:"Fiery volcanic battlefield",price:200,type:"theme",icon:"🌋",colors:{light:"#ff7043",dark:"#bf360c",accent:"#e64a19",water:"#ff5722"}},{id:"theme_space",name:"Space Battle",description:"Galactic warfare theme",price:250,type:"theme",icon:"🚀",colors:{light:"#7c4dff",dark:"#311b92",accent:"#651fff",water:"#6200ea"}},{id:"theme_candy",name:"Candy Land",description:"Sweet colorful theme",price:150,type:"theme",icon:"🍬",colors:{light:"#ffb6c1",dark:"#ff69b4",accent:"#ff1493",water:"#87ceeb"}},{id:"theme_forest",name:"Enchanted Forest",description:"Magical forest theme",price:175,type:"theme",icon:"🌲",colors:{light:"#90ee90",dark:"#228b22",accent:"#006400",water:"#20b2aa"}},{id:"theme_sunset",name:"Sunset",description:"Beautiful sunset colors",price:125,type:"theme",icon:"🌅",colors:{light:"#ffa07a",dark:"#ff6347",accent:"#ff4500",water:"#4169e1"}},{id:"skin_robot",name:"Robot Army",description:"Mechanical robot pieces with gears and lights",price:350,type:"piece_skin",icon:"🤖",skinStyle:"robot",pieceColor:{yellow:"#00ffff",green:"#ff00ff",accent:"#ffffff"}},{id:"skin_medieval",name:"Medieval Knights",description:"Classic medieval armor and weapons",price:300,type:"piece_skin",icon:"⚔️",skinStyle:"medieval",pieceColor:{yellow:"#c0c0c0",green:"#8b4513",accent:"#ffd700"}},{id:"skin_scifi",name:"Sci-Fi Troopers",description:"Futuristic space soldiers with laser weapons",price:400,type:"piece_skin",icon:"🚀",skinStyle:"scifi",pieceColor:{yellow:"#00ff00",green:"#0080ff",accent:"#ff0080"}},{id:"skin_pixel",name:"Pixel Warriors",description:"Retro 8-bit pixelated pieces",price:250,type:"piece_skin",icon:"👾",skinStyle:"pixel",pieceColor:{yellow:"#ffff00",green:"#00ff00",accent:"#ff0000"}},{id:"skin_minimal",name:"Minimalist",description:"Clean simple geometric shapes",price:200,type:"piece_skin",icon:"⬜",skinStyle:"minimal",pieceColor:{yellow:"#ffd700",green:"#32cd32",accent:"#000000"}},{id:"skin_cartoon",name:"Cartoon Army",description:"Fun cartoon style with big eyes",price:275,type:"piece_skin",icon:"😊",skinStyle:"cartoon",pieceColor:{yellow:"#ffcc00",green:"#66cc66",accent:"#ffffff"}},{id:"skin_military",name:"Modern Military",description:"Realistic military equipment",price:325,type:"piece_skin",icon:"🎖️",skinStyle:"military",pieceColor:{yellow:"#556b2f",green:"#2f4f4f",accent:"#d2691e"}},{id:"skin_fantasy",name:"Fantasy Heroes",description:"Magical wizards, dragons and heroes",price:450,type:"piece_skin",icon:"🧙",skinStyle:"fantasy",pieceColor:{yellow:"#9400d3",green:"#00ced1",accent:"#ffd700"}},{id:"effect_fire",name:"Fire Trail",description:"Pieces leave fire particles when moving",price:250,type:"effect",icon:"🔥",effectType:"fire"},{id:"effect_lightning",name:"Lightning Strike",description:"Electric bolts on captures",price:300,type:"effect",icon:"⚡",effectType:"lightning"},{id:"effect_sparkle",name:"Sparkle",description:"Sparkly star effects on moves",price:150,type:"effect",icon:"✨",effectType:"sparkle"},{id:"effect_smoke",name:"Smoke Trail",description:"Smoky trail behind pieces",price:175,type:"effect",icon:"💨",effectType:"smoke"},{id:"effect_hearts",name:"Love Trail",description:"Hearts appear when moving",price:200,type:"effect",icon:"❤️",effectType:"hearts"},{id:"effect_stars",name:"Stardust",description:"Star particles on all actions",price:225,type:"effect",icon:"⭐",effectType:"stars"},{id:"effect_explosion",name:"Big Boom",description:"Extra explosion effects on captures",price:275,type:"effect",icon:"💥",effectType:"explosion"},{id:"effect_ghost",name:"Ghost Trail",description:"Ghostly afterimages when moving",price:300,type:"effect",icon:"👻",effectType:"ghost"},{id:"sound_retro",name:"Retro Sounds",description:"8-bit arcade style sound effects",price:150,type:"sound_pack",icon:"🕹️",packId:"retro"},{id:"sound_scifi",name:"Sci-Fi Sounds",description:"Futuristic laser and tech sounds",price:175,type:"sound_pack",icon:"🛸",packId:"scifi"},{id:"sound_cartoon",name:"Cartoon Sounds",description:"Fun bouncy cartoon sounds",price:125,type:"sound_pack",icon:"🎪",packId:"cartoon"},{id:"sound_war",name:"War Sounds",description:"Realistic military sound effects",price:200,type:"sound_pack",icon:"💣",packId:"war"},{id:"sound_nature",name:"Nature Sounds",description:"Calm natural ambient sounds",price:150,type:"sound_pack",icon:"🌿",packId:"nature"},{id:"sound_horror",name:"Horror Sounds",description:"Creepy scary sound effects",price:200,type:"sound_pack",icon:"👻",packId:"horror"},{id:"sound_medieval",name:"Medieval Sounds",description:"Swords, shields and battle horns",price:175,type:"sound_pack",icon:"🏰",packId:"medieval"},{id:"music_electronic",name:"Electronic Beats",description:"Pumping electronic music",price:200,type:"music_pack",icon:"🎧",packId:"electronic"},{id:"music_orchestral",name:"Orchestral",description:"Epic orchestral soundtrack",price:250,type:"music_pack",icon:"🎻",packId:"orchestral"},{id:"music_chiptune",name:"Chiptune",description:"Retro 8-bit music",price:175,type:"music_pack",icon:"🎮",packId:"chiptune"},{id:"music_jazz",name:"Smooth Jazz",description:"Relaxing jazz music",price:200,type:"music_pack",icon:"🎷",packId:"jazz"},{id:"music_rock",name:"Rock & Roll",description:"Energetic rock music",price:225,type:"music_pack",icon:"🎸",packId:"rock"},{id:"music_lofi",name:"Lo-Fi Beats",description:"Chill lo-fi hip hop vibes",price:175,type:"music_pack",icon:"🎵",packId:"lofi"},{id:"music_epic",name:"Epic Battle",description:"Intense cinematic battle music",price:275,type:"music_pack",icon:"⚔️",packId:"epic"},{id:"music_ambient",name:"Ambient",description:"Peaceful ambient soundscapes",price:150,type:"music_pack",icon:"🌌",packId:"ambient"},{id:"theme_neon",name:"Neon City",description:"Cyberpunk neon lights theme",price:300,type:"theme",icon:"🌃",colors:{light:"#ff00ff",dark:"#00ffff",accent:"#ffff00",water:"#ff1493"}},{id:"theme_steampunk",name:"Steampunk",description:"Victorian steampunk aesthetic",price:275,type:"theme",icon:"⚙️",colors:{light:"#cd853f",dark:"#8b4513",accent:"#d4af37",water:"#708090"}},{id:"theme_underwater",name:"Underwater",description:"Deep ocean floor theme",price:225,type:"theme",icon:"🐠",colors:{light:"#00ced1",dark:"#008b8b",accent:"#20b2aa",water:"#006994"}},{id:"theme_autumn",name:"Autumn Forest",description:"Beautiful fall colors",price:175,type:"theme",icon:"🍂",colors:{light:"#daa520",dark:"#8b4513",accent:"#cd853f",water:"#4682b4"}},{id:"theme_winter",name:"Winter Wonderland",description:"Snowy winter theme",price:200,type:"theme",icon:"⛄",colors:{light:"#f0f8ff",dark:"#b0c4de",accent:"#87ceeb",water:"#4169e1"}},{id:"effect_confetti",name:"Confetti",description:"Colorful confetti on wins",price:175,type:"effect",icon:"🎊",effectType:"sparkle"},{id:"effect_rainbow",name:"Rainbow Trail",description:"Rainbow colors follow your pieces",price:250,type:"effect",icon:"🌈",effectType:"sparkle"},{id:"effect_snow",name:"Snowfall",description:"Gentle snowflakes falling",price:200,type:"effect",icon:"❄️",effectType:"sparkle"},{id:"effect_sakura",name:"Cherry Blossoms",description:"Beautiful sakura petals",price:225,type:"effect",icon:"🌸",effectType:"sparkle"},{id:"theme_tropical",name:"Tropical Beach",description:"Sandy beach with palm trees",price:200,type:"theme",icon:"🏝️",colors:{light:"#f4e8c1",dark:"#2e8b57",accent:"#ff6b6b",water:"#40e0d0"}},{id:"theme_haunted",name:"Haunted",description:"Spooky halloween theme",price:225,type:"theme",icon:"🎃",colors:{light:"#2d1b4e",dark:"#1a0a2e",accent:"#ff6600",water:"#4a0080"}},{id:"theme_rainbow",name:"Rainbow",description:"Colorful rainbow theme",price:175,type:"theme",icon:"🌈",colors:{light:"#ffb3ba",dark:"#bae1ff",accent:"#baffc9",water:"#ffffba"}},{id:"theme_gold",name:"Gold Rush",description:"Luxurious golden theme",price:300,type:"theme",icon:"💎",colors:{light:"#ffd700",dark:"#b8860b",accent:"#daa520",water:"#cd853f"}},{id:"theme_ice",name:"Ice Cave",description:"Frozen ice cave theme",price:225,type:"theme",icon:"🧊",colors:{light:"#e0ffff",dark:"#4169e1",accent:"#00bfff",water:"#1e90ff"}},{id:"skin_zombie",name:"Zombie Army",description:"Undead zombie versions of pieces",price:375,type:"piece_skin",icon:"🧟",skinStyle:"fantasy",pieceColor:{yellow:"#556b2f",green:"#8b4513",accent:"#ff0000"}},{id:"skin_steampunk",name:"Steampunk Units",description:"Gears and steam powered units",price:400,type:"piece_skin",icon:"⚙️",skinStyle:"robot",pieceColor:{yellow:"#cd853f",green:"#8b4513",accent:"#ffd700"}},{id:"skin_crystal",name:"Crystal Warriors",description:"Beautiful crystal/diamond pieces",price:450,type:"piece_skin",icon:"💎",skinStyle:"minimal",pieceColor:{yellow:"#e0ffff",green:"#98fb98",accent:"#ff69b4"}},{id:"effect_bubble",name:"Bubble Pop",description:"Floating bubbles effect",price:175,type:"effect",icon:"🫧",effectType:"sparkle"},{id:"effect_pixel",name:"Pixel Burst",description:"Retro pixel explosion effect",price:200,type:"effect",icon:"👾",effectType:"sparkle"},{id:"effect_runes",name:"Magic Runes",description:"Magical symbols appear",price:250,type:"effect",icon:"🔮",effectType:"sparkle"},{id:"effect_money",name:"Money Rain",description:"War Bucks falling effect",price:300,type:"effect",icon:"💵",effectType:"sparkle"},{id:"music_tropical",name:"Tropical Vibes",description:"Chill beach music",price:200,type:"music_pack",icon:"🏖️",packId:"tropical"},{id:"music_dark",name:"Dark Orchestra",description:"Dark cinematic orchestra",price:275,type:"music_pack",icon:"🦇",packId:"dark"}],xk=[{id:"play_1",name:"First Steps",description:"Play 1 game",icon:"🎮",requirement:1,stat:"gamesPlayed",reward:{type:"warBucks",amount:25}},{id:"win_1",name:"First Victory",description:"Win 1 game",icon:"🏆",requirement:1,stat:"gamesWon",reward:{type:"warBucks",amount:50}},{id:"eliminate_5",name:"Rookie Hunter",description:"Eliminate 5 pieces",icon:"🎯",requirement:5,stat:"piecesEliminated",reward:{type:"warBucks",amount:30}},{id:"points_25",name:"Point Starter",description:"Score 25 total points",icon:"📊",requirement:25,stat:"totalPointsScored",reward:{type:"warBucks",amount:35}},{id:"play_5",name:"Getting Started",description:"Play 5 games",icon:"🎲",requirement:5,stat:"gamesPlayed",reward:{type:"warBucks",amount:75}},{id:"win_3",name:"Hat Trick",description:"Win 3 games",icon:"🥉",requirement:3,stat:"gamesWon",reward:{type:"warBucks",amount:100}},{id:"eliminate_25",name:"Skilled Hunter",description:"Eliminate 25 pieces",icon:"💥",requirement:25,stat:"piecesEliminated",reward:{type:"item",itemId:"effect_sparkle"}},{id:"engineer_3",name:"Engineer Hunter",description:"Capture 3 engineers",icon:"🔧",requirement:3,stat:"engineersCaptured",reward:{type:"warBucks",amount:100}},{id:"points_50",name:"Point Collector",description:"Score 50 total points",icon:"💎",requirement:50,stat:"totalPointsScored",reward:{type:"warBucks",amount:80}},{id:"eliminate_15",name:"Hunter",description:"Eliminate 15 pieces",icon:"🏹",requirement:15,stat:"piecesEliminated",reward:{type:"warBucks",amount:60}},{id:"play_10",name:"Dedicated Player",description:"Play 10 games",icon:"⭐",requirement:10,stat:"gamesPlayed",reward:{type:"item",itemId:"theme_desert"}},{id:"win_5",name:"Champion",description:"Win 5 games",icon:"🏅",requirement:5,stat:"gamesWon",reward:{type:"item",itemId:"skin_pixel"}},{id:"eliminate_50",name:"Elite Hunter",description:"Eliminate 50 pieces",icon:"🔥",requirement:50,stat:"piecesEliminated",reward:{type:"warBucks",amount:200}},{id:"points_100",name:"Point Master",description:"Score 100 total points",icon:"💯",requirement:100,stat:"totalPointsScored",reward:{type:"item",itemId:"theme_arctic"}},{id:"engineer_5",name:"Engineer Expert",description:"Capture 5 engineers",icon:"🛠️",requirement:5,stat:"engineersCaptured",reward:{type:"item",itemId:"effect_smoke"}},{id:"play_15",name:"Regular Player",description:"Play 15 games",icon:"🎯",requirement:15,stat:"gamesPlayed",reward:{type:"warBucks",amount:150}},{id:"win_10",name:"War Hero",description:"Win 10 games",icon:"🎖️",requirement:10,stat:"gamesWon",reward:{type:"item",itemId:"skin_robot"}},{id:"eliminate_100",name:"Legendary Hunter",description:"Eliminate 100 pieces",icon:"👑",requirement:100,stat:"piecesEliminated",reward:{type:"item",itemId:"effect_fire"}},{id:"engineer_10",name:"Engineer Master",description:"Capture 10 engineers",icon:"⚙️",requirement:10,stat:"engineersCaptured",reward:{type:"item",itemId:"theme_night"}},{id:"points_500",name:"Score Legend",description:"Score 500 total points",icon:"🌟",requirement:500,stat:"totalPointsScored",reward:{type:"item",itemId:"skin_scifi"}},{id:"play_25",name:"Veteran",description:"Play 25 games",icon:"🎗️",requirement:25,stat:"gamesPlayed",reward:{type:"item",itemId:"theme_jungle"}},{id:"win_15",name:"Commander",description:"Win 15 games",icon:"⚔️",requirement:15,stat:"gamesWon",reward:{type:"item",itemId:"effect_lightning"}},{id:"eliminate_200",name:"Destroyer",description:"Eliminate 200 pieces",icon:"💀",requirement:200,stat:"piecesEliminated",reward:{type:"item",itemId:"skin_fantasy"}},{id:"points_1000",name:"Point God",description:"Score 1000 total points",icon:"🔱",requirement:1e3,stat:"totalPointsScored",reward:{type:"item",itemId:"theme_space"}},{id:"win_25",name:"General",description:"Win 25 games",icon:"🏛️",requirement:25,stat:"gamesWon",reward:{type:"item",itemId:"effect_explosion"}},{id:"engineer_25",name:"Engineer Legend",description:"Capture 25 engineers",icon:"🔩",requirement:25,stat:"engineersCaptured",reward:{type:"item",itemId:"theme_lava"}}];function _k(r){const e=1+r*.5;return xk.map(t=>({...t,requirement:Math.ceil(t.requirement*e),description:t.description.replace(/\d+/,String(Math.ceil(t.requirement*e)))}))}function Ng(r,e){return{username:r,email:e,createdAt:Date.now(),lastLogin:Date.now(),isAdmin:Dg.includes(e.toLowerCase()),stats:{gamesPlayed:0,gamesWon:0,gamesLost:0,totalPointsScored:0,piecesEliminated:0,engineersCaptured:0,timePlayed:0,tanksDestroyed:0,rocketsDestroyed:0,shipsDestroyed:0,helicoptersDestroyed:0,hackersDestroyed:0,multiplayerWins:0,multiplayerGames:0,chatMessagesSent:0,totalWarBucksEarned:0,totalWarBucksSpent:0},badges:[],warBucks:0,settings:{language:"en",soundEnabled:!0,musicEnabled:!1,masterVolume:.8,musicVolume:.5,sfxVolume:.8,musicStyle:"epic",boardTheme:"classic",animationSpeed:"normal",screenShakeEnabled:!0,showCoordinates:!0,colorBlindMode:!1,highContrastMode:!1,largeUIMode:!1},botLearning:{},purchasedItems:[],equippedItems:{theme:null,pieceSkin:null,effect:null,soundPack:null,musicPack:null},warPass:{claimedRewards:[],completedCount:0,lastResetTime:Date.now()},puzzleStats:{puzzlesSolved:0,puzzlesAttempted:0,perfectSolves:0,dailyStreak:0,lastPuzzleDate:0,solvedPuzzleIds:[]}}}let ae=null,fe=null,wl=!1;function Xt(){return ae}function Zt(){return fe}function Wc(){return wl}function va(r){wl=r}async function Ek(r,e,t){if(!hi||!B)return{success:!1,error:"Firebase not initialized"};try{const i=(await O1(hi,r,e)).user,s=Ng(t,r);await Ut(re(B,"users",i.uid),s);try{await Ut(re(B,"usernames",t.toLowerCase()),{email:r,uid:i.uid})}catch{console.log("Could not create username mapping")}return ae=i,fe=s,{success:!0}}catch(n){const i=n;let s="Registration failed";return i.code==="auth/email-already-in-use"?s="Email already in use":i.code==="auth/weak-password"?s="Password too weak (min 6 characters)":i.code==="auth/invalid-email"&&(s="Invalid email address"),{success:!1,error:s}}}async function Ak(r){if(!B)return null;try{const e=await Xe(re(B,"usernames",r.toLowerCase()));return e.exists()?e.data().email:null}catch(e){return console.error("Error finding email by username:",e),null}}async function Ik(r,e){if(!hi||!B)return{success:!1,error:"Firebase not initialized"};try{let t=r;if(!r.includes("@")){const o=await Ak(r);if(!o)return{success:!1,error:"Username not found. Try your email."};t=o}const i=(await F1(hi,t,e)).user,s=await Xe(re(B,"users",i.uid));if(s.exists()){fe=s.data(),await Re(re(B,"users",i.uid),{lastLogin:Date.now()});try{(await Xe(re(B,"usernames",fe.username.toLowerCase()))).exists()||await Ut(re(B,"usernames",fe.username.toLowerCase()),{email:fe.email,uid:i.uid})}catch{console.log("Could not create username mapping, will retry later")}}else fe=Ng(t.split("@")[0],t),await Ut(re(B,"users",i.uid),fe);return ae=i,{success:!0}}catch(t){const n=t;let i="Login failed";return n.code==="auth/user-not-found"?i="User not found":n.code==="auth/wrong-password"?i="Wrong password":n.code==="auth/invalid-email"?i="Invalid email address":n.code==="auth/invalid-credential"&&(i="Invalid username or password"),{success:!1,error:i}}}async function Ck(){hi&&await G1(hi),ae=null,fe=null}async function cn(r){if(!B||!ae||wl)return!1;try{return await Re(re(B,"users",ae.uid),r),fe&&(fe={...fe,...r}),!0}catch(e){return console.error("Error saving user data:",e),!1}}async function Pi(){if(!B||!ae)return null;try{const r=await Xe(re(B,"users",ae.uid));return r.exists()?(fe=r.data(),fe):null}catch(r){return console.error("Error loading user data:",r),null}}const Sk={FIRST_WIN:{id:"first_win",name:"First Victory",description:"Win your first game",icon:"🏆"},ENGINEER_HUNTER:{id:"engineer_hunter",name:"Engineer Hunter",description:"Capture 10 Engineers",icon:"🔧"},SHARPSHOOTER:{id:"sharpshooter",name:"Sharpshooter",description:"Eliminate 100 pieces",icon:"🎯"},VETERAN:{id:"veteran",name:"Veteran",description:"Play 50 games",icon:"⭐"},MASTER:{id:"master",name:"Master",description:"Win 25 games",icon:"👑"},RICH:{id:"rich",name:"War Profiteer",description:"Earn 1000 War Bucks",icon:"💰"},STRATEGIST:{id:"strategist",name:"Strategist",description:"Score 500 total points",icon:"🧠"},SPEEDRUNNER:{id:"speedrunner",name:"Speedrunner",description:"Win a game in under 5 minutes",icon:"⚡"},SURVIVOR:{id:"survivor",name:"Survivor",description:"Win with less than 10 points difference",icon:"💪"},DOMINATOR:{id:"dominator",name:"Dominator",description:"Win with over 50 points difference",icon:"🔥"},WAR_PASS_1:{id:"war_pass_1",name:"War Pass Rookie",description:"Complete the War Pass 1 time",icon:"🎖️"},WAR_PASS_5:{id:"war_pass_5",name:"War Pass Veteran",description:"Complete the War Pass 5 times",icon:"🏅"},WAR_PASS_10:{id:"war_pass_10",name:"War Pass Legend",description:"Complete the War Pass 10 times",icon:"🥇"},PUZZLE_FIRST:{id:"puzzle_first",name:"Puzzle Beginner",description:"Solve your first puzzle",icon:"🧩"},PUZZLE_10:{id:"puzzle_10",name:"Puzzle Solver",description:"Solve 10 puzzles",icon:"🧠"},PUZZLE_50:{id:"puzzle_50",name:"Puzzle Master",description:"Solve 50 puzzles",icon:"🎓"},PUZZLE_100:{id:"puzzle_100",name:"Puzzle Legend",description:"Solve 100 puzzles",icon:"🏆"},PUZZLE_PERFECT_5:{id:"puzzle_perfect_5",name:"Quick Thinker",description:"Solve 5 puzzles on first try",icon:"⚡"},PUZZLE_PERFECT_25:{id:"puzzle_perfect_25",name:"Genius",description:"Solve 25 puzzles on first try",icon:"💡"},PUZZLE_STREAK_7:{id:"puzzle_streak_7",name:"Week Warrior",description:"7 day puzzle streak",icon:"📅"},PUZZLE_STREAK_30:{id:"puzzle_streak_30",name:"Month Master",description:"30 day puzzle streak",icon:"🗓️"},TANK_DESTROYER:{id:"tank_destroyer",name:"Tank Destroyer",description:"Destroy 25 tanks",icon:"💣"},ROCKET_CATCHER:{id:"rocket_catcher",name:"Rocket Catcher",description:"Capture 10 rockets",icon:"🚀"},SHIP_SINKER:{id:"ship_sinker",name:"Ship Sinker",description:"Destroy 20 ships",icon:"⚓"},HELICOPTER_HUNTER:{id:"helicopter_hunter",name:"Heli Hunter",description:"Shoot down 15 helicopters",icon:"🚁"},BUILDER_NEMESIS:{id:"builder_nemesis",name:"Builder Nemesis",description:"Capture 25 builders",icon:"🔨"},HACKER_BLOCKER:{id:"hacker_blocker",name:"Hacker Blocker",description:"Eliminate 10 hackers",icon:"💻"},MP_FIRST:{id:"mp_first",name:"First Online Win",description:"Win your first multiplayer game",icon:"🌐"},MP_10:{id:"mp_10",name:"Online Warrior",description:"Win 10 multiplayer games",icon:"⚔️"},MP_50:{id:"mp_50",name:"Online Champion",description:"Win 50 multiplayer games",icon:"🏅"},FRIENDLY_PLAYER:{id:"friendly_player",name:"Friendly Player",description:"Send 50 chat messages",icon:"💬"},QUICK_MATCH:{id:"quick_match",name:"Speed Demon",description:"Win a match in under 3 minutes",icon:"⏱️"},COLLECTOR_THEMES:{id:"collector_themes",name:"Theme Collector",description:"Buy all themes",icon:"🎨"},COLLECTOR_SKINS:{id:"collector_skins",name:"Skin Collector",description:"Buy all skins",icon:"👔"},COLLECTOR_EFFECTS:{id:"collector_effects",name:"Effect Collector",description:"Buy all effects",icon:"✨"},COLLECTOR_ALL:{id:"collector_all",name:"Ultimate Collector",description:"Buy EVERYTHING in the shop",icon:"👑"},BIG_SPENDER:{id:"big_spender",name:"Big Spender",description:"Spend 5000 War Bucks",icon:"💸"},WAR_MILLIONAIRE:{id:"war_millionaire",name:"War Millionaire",description:"Earn 10000 War Bucks total",icon:"💰"},GAMES_100:{id:"games_100",name:"Centurion",description:"Play 100 games",icon:"💯"},GAMES_500:{id:"games_500",name:"Dedicated",description:"Play 500 games",icon:"🎖️"},WINS_50:{id:"wins_50",name:"Half Century",description:"Win 50 games",icon:"5️⃣"},WINS_100:{id:"wins_100",name:"Century Winner",description:"Win 100 games",icon:"🏆"},PLAYTIME_10H:{id:"playtime_10h",name:"Time Invested",description:"Play for 10 hours total",icon:"⏰"},PLAYTIME_50H:{id:"playtime_50h",name:"Hardcore",description:"Play for 50 hours total",icon:"🔥"}};function Bg(r){const e=[],t=r.stats,n=r.puzzleStats||{puzzlesSolved:0,perfectSolves:0,dailyStreak:0};!r.badges.includes("first_win")&&t.gamesWon>=1&&e.push("first_win"),!r.badges.includes("engineer_hunter")&&t.engineersCaptured>=10&&e.push("engineer_hunter"),!r.badges.includes("sharpshooter")&&t.piecesEliminated>=100&&e.push("sharpshooter"),!r.badges.includes("veteran")&&t.gamesPlayed>=50&&e.push("veteran"),!r.badges.includes("master")&&t.gamesWon>=25&&e.push("master"),!r.badges.includes("rich")&&r.warBucks>=1e3&&e.push("rich"),!r.badges.includes("strategist")&&t.totalPointsScored>=500&&e.push("strategist");const i=r.warPass?.completedCount||0;!r.badges.includes("war_pass_1")&&i>=1&&e.push("war_pass_1"),!r.badges.includes("war_pass_5")&&i>=5&&e.push("war_pass_5"),!r.badges.includes("war_pass_10")&&i>=10&&e.push("war_pass_10"),!r.badges.includes("puzzle_first")&&n.puzzlesSolved>=1&&e.push("puzzle_first"),!r.badges.includes("puzzle_10")&&n.puzzlesSolved>=10&&e.push("puzzle_10"),!r.badges.includes("puzzle_50")&&n.puzzlesSolved>=50&&e.push("puzzle_50"),!r.badges.includes("puzzle_100")&&n.puzzlesSolved>=100&&e.push("puzzle_100"),!r.badges.includes("puzzle_perfect_5")&&n.perfectSolves>=5&&e.push("puzzle_perfect_5"),!r.badges.includes("puzzle_perfect_25")&&n.perfectSolves>=25&&e.push("puzzle_perfect_25"),!r.badges.includes("puzzle_streak_7")&&n.dailyStreak>=7&&e.push("puzzle_streak_7"),!r.badges.includes("puzzle_streak_30")&&n.dailyStreak>=30&&e.push("puzzle_streak_30"),!r.badges.includes("tank_destroyer")&&(t.tanksDestroyed||0)>=25&&e.push("tank_destroyer"),!r.badges.includes("rocket_catcher")&&(t.rocketsDestroyed||0)>=10&&e.push("rocket_catcher"),!r.badges.includes("ship_sinker")&&(t.shipsDestroyed||0)>=20&&e.push("ship_sinker"),!r.badges.includes("helicopter_hunter")&&(t.helicoptersDestroyed||0)>=15&&e.push("helicopter_hunter"),!r.badges.includes("builder_nemesis")&&t.engineersCaptured>=25&&e.push("builder_nemesis"),!r.badges.includes("hacker_blocker")&&(t.hackersDestroyed||0)>=10&&e.push("hacker_blocker"),!r.badges.includes("mp_first")&&(t.multiplayerWins||0)>=1&&e.push("mp_first"),!r.badges.includes("mp_10")&&(t.multiplayerWins||0)>=10&&e.push("mp_10"),!r.badges.includes("mp_50")&&(t.multiplayerWins||0)>=50&&e.push("mp_50"),!r.badges.includes("friendly_player")&&(t.chatMessagesSent||0)>=50&&e.push("friendly_player");const s=Pe.filter(f=>f.type==="theme").map(f=>f.id),o=Pe.filter(f=>f.type==="piece_skin").map(f=>f.id),c=Pe.filter(f=>f.type==="effect").map(f=>f.id),l=Pe.map(f=>f.id),u=r.purchasedItems||[];return!r.badges.includes("collector_themes")&&s.every(f=>u.includes(f))&&e.push("collector_themes"),!r.badges.includes("collector_skins")&&o.every(f=>u.includes(f))&&e.push("collector_skins"),!r.badges.includes("collector_effects")&&c.every(f=>u.includes(f))&&e.push("collector_effects"),!r.badges.includes("collector_all")&&l.every(f=>u.includes(f))&&e.push("collector_all"),!r.badges.includes("big_spender")&&(t.totalWarBucksSpent||0)>=5e3&&e.push("big_spender"),!r.badges.includes("war_millionaire")&&(t.totalWarBucksEarned||0)>=1e4&&e.push("war_millionaire"),!r.badges.includes("games_100")&&t.gamesPlayed>=100&&e.push("games_100"),!r.badges.includes("games_500")&&t.gamesPlayed>=500&&e.push("games_500"),!r.badges.includes("wins_50")&&t.gamesWon>=50&&e.push("wins_50"),!r.badges.includes("wins_100")&&t.gamesWon>=100&&e.push("wins_100"),!r.badges.includes("playtime_10h")&&t.timePlayed>=36e3&&e.push("playtime_10h"),!r.badges.includes("playtime_50h")&&t.timePlayed>=18e4&&e.push("playtime_50h"),e}function Rk(r,e){let t=10;return r&&(t+=25,t+=Math.floor(e/5)),t}let Gi=null,Ui=null,Hi=null,ac=[],lc=null,cc=[],uc=null,ka=null,dc=null;async function Pk(){if(!(!B||!ae||!fe||wl))try{await Ut(re(B,"online",ae.uid),{id:ae.uid,username:fe.username,lastSeen:di(),status:"available"})}catch(r){console.error("Error setting online:",r)}}async function Og(){if(!(!B||!ae))try{await qr(re(B,"online",ae.uid))}catch(r){console.error("Error setting offline:",r)}}function Lk(r){if(!B)return;lc=r,Gi&&Gi();const e=Vo(Me(B,"online"));Gi=Do(e,t=>{ac=[],t.forEach(n=>{const i=n.data();ae&&n.id!==ae.uid&&ac.push({id:n.id,username:i.username,lastSeen:i.lastSeen?.toMillis()||Date.now(),status:i.status})}),lc&&lc(ac)})}function Fg(){Gi&&(Gi(),Gi=null)}async function Mk(r,e=!1,t=10){if(!B||!ae||!fe)return null;try{const n=re(Me(B,"invites"));return await Ut(n,{fromUserId:ae.uid,fromUsername:fe.username,toUserId:r,createdAt:di(),status:"pending",timerEnabled:e,timerMinutes:t}),n.id}catch(n){return console.error("Error sending invite:",n),null}}function Vk(r){if(!B||!ae)return;uc=r,Ui&&Ui();const e=Vo(Me(B,"invites"),po("toUserId","==",ae.uid),po("status","==","pending"));Ui=Do(e,t=>{cc=[],t.forEach(n=>{cc.push({id:n.id,...n.data()})}),uc&&uc(cc)})}function zg(){Ui&&(Ui(),Ui=null)}let ji=null,hc=null;function Dk(r){if(!B||!ae)return;hc=r,ji&&ji();const e=Vo(Me(B,"invites"),po("fromUserId","==",ae.uid));ji=Do(e,t=>{t.docChanges().forEach(n=>{if(n.type==="modified"){const i=n.doc.data();(i.status==="accepted"||i.status==="declined")&&hc&&hc({id:n.doc.id,...i})}})})}function qg(){ji&&(ji(),ji=null)}async function Nk(r){if(!B||!ae||!fe)return null;try{const e=await Xe(re(B,"invites",r));if(!e.exists())return null;const t=e.data(),n=Math.random()<.5,i=n?ae.uid:t.fromUserId,s=n?fe.username:t.fromUsername,o=n?t.fromUserId:ae.uid,c=n?t.fromUsername:fe.username,l=re(Me(B,"games"));return await Ut(l,{yellowPlayerId:i,yellowUsername:s,greenPlayerId:o,greenUsername:c,currentTurn:"yellow",createdAt:di(),lastMove:di(),status:"waiting",gameState:null,timerEnabled:t.timerEnabled||!1,timerMinutes:t.timerMinutes||10,yellowJoined:!1,greenJoined:!1}),await Re(re(B,"invites",r),{status:"accepted",gameId:l.id}),{gameId:l.id,myTeam:n?"yellow":"green"}}catch(e){return console.error("Error accepting invite:",e),null}}async function Bk(r){if(B)try{await Re(re(B,"invites",r),{status:"declined"})}catch(e){console.error("Error declining invite:",e)}}function Ta(r,e){B&&(dc=e,Hi&&Hi(),Hi=Do(re(B,"games",r),t=>{if(console.log("[FB SNAPSHOT] Game snapshot received for:",r,"exists:",t.exists()),t.exists()){const n=t.data();console.log("[FB SNAPSHOT] Game data:",{moveCount:n.moveCount,currentTurn:n.currentTurn,lastMoveBy:n.lastMoveBy,status:n.status}),ka={id:t.id,...n}}else ka=null;dc&&dc(ka)}))}function Qc(){Hi&&(Hi(),Hi=null),ka=null}async function Ok(r,e,t,n){if(!B)return console.error("[FB UPDATE] No database connection"),!1;try{const i=await Xe(re(B,"games",r));if(!i.exists())return console.error("[FB UPDATE] Game document does not exist:",r),!1;const o=(i.data().moveCount||0)+1;return await Re(re(B,"games",r),{gameState:e,currentTurn:t,lastMoveBy:n,moveCount:o,lastMove:di()}),!0}catch(i){return console.error("[FB UPDATE] Error updating game:",i),!1}}async function Fk(r,e){if(!B)return!1;try{return await Re(re(B,"games",r),{status:"finished",winner:e}),!0}catch(t){return console.error("Error ending game:",t),!1}}async function zk(r,e){if(!B)return!1;try{const t={status:"abandoned",leftBy:e};return e==="yellow"?t.yellowLeft=!0:t.greenLeft=!0,await Re(re(B,"games",r),t),!0}catch(t){return console.error("Error leaving game:",t),!1}}function Gf(r){return ae?r.yellowPlayerId===ae.uid?"yellow":r.greenPlayerId===ae.uid?"green":null:null}async function fc(r){if(!B||!ae)return!1;try{const e=await Xe(re(B,"games",r));if(!e.exists())return!1;const t=e.data(),n=t.yellowPlayerId===ae.uid,i={};return n?i.yellowJoined=!0:i.greenJoined=!0,(n?t.greenJoined:t.yellowJoined)&&(i.status="playing"),await Re(re(B,"games",r),i),!0}catch(e){return console.error("Error joining game:",e),!1}}function Be(){return fe?fe.isAdmin===!0||Dg.includes(fe.email.toLowerCase()):!1}async function qk(){if(!B||!Be())return[];try{return(await St(Me(B,"users"))).docs.map(e=>({odataId:e.id,...e.data()}))}catch(r){return console.error("Error getting all users:",r),[]}}async function Uf(r,e){if(!B||!Be())return!1;try{return await Re(re(B,"users",r),e),!0}catch(t){return console.error("Error updating user:",t),!1}}async function pc(r,e){if(!B||!Be())return!1;try{const t=await Xe(re(B,"users",r));if(!t.exists())return!1;const i=(t.data().warBucks||0)+e;return await Re(re(B,"users",r),{warBucks:i}),!0}catch(t){return console.error("Error giving war bucks:",t),!1}}async function Gk(r,e){if(!B||!Be())return!1;try{const t=await Xe(re(B,"users",r));if(!t.exists())return!1;const i=t.data().purchasedItems||[];return i.includes(e)||(i.push(e),await Re(re(B,"users",r),{purchasedItems:i})),!0}catch(t){return console.error("Error giving item:",t),!1}}async function Hf(r,e){if(!B||!Be())return!1;try{return await Re(re(B,"users",r),{isAdmin:e}),!0}catch(t){return console.error("Error setting admin:",t),!1}}async function Uk(r){if(!B||!Be())return!1;try{const e=Pe.map(t=>t.id);return await Re(re(B,"users",r),{purchasedItems:e}),!0}catch(e){return console.error("Error giving all items:",e),!1}}async function Hk(r){if(!B||!Be())return!1;try{if(!(await Xe(re(B,"users",r))).exists())return!1;const t={stats:{gamesPlayed:0,gamesWon:0,gamesLost:0,totalPointsScored:0,piecesEliminated:0,engineersCaptured:0,timePlayed:0,tanksDestroyed:0,rocketsDestroyed:0,shipsDestroyed:0,helicoptersDestroyed:0,hackersDestroyed:0,multiplayerWins:0,multiplayerGames:0,chatMessagesSent:0,totalWarBucksEarned:0,totalWarBucksSpent:0},badges:[],warBucks:0,purchasedItems:[],equippedItems:{theme:null,pieceSkin:null,effect:null,soundPack:null,musicPack:null},warPass:{claimedRewards:[],completedCount:0,lastResetTime:0},puzzleStats:{puzzlesSolved:0,puzzlesAttempted:0,perfectSolves:0,dailyStreak:0,lastPuzzleDate:0,solvedPuzzleIds:[]}};return await Re(re(B,"users",r),t),!0}catch(e){return console.error("Error resetting user:",e),!1}}async function na(r){if(!B||!Be())return 0;try{const e=await St(Me(B,"users"));let t=0;for(const n of e.docs){const s=(n.data().warBucks||0)+r;await Re(re(B,"users",n.id),{warBucks:s}),t++}return t}catch(e){return console.error("Error giving war bucks to all:",e),0}}const ia={disco:{name:"Disco Mode",icon:"🪩",description:"Flashing colors and party vibes!"},jumpscare:{name:"Jumpscare Mode",icon:"👻",description:"Random scary surprises!"},chaos:{name:"Chaos Mode",icon:"🌀",description:"Everything is unpredictable!"},mirror:{name:"Mirror Mode",icon:"🪞",description:"Board is mirrored!"},speed:{name:"Speed Mode",icon:"⚡",description:"Everything moves faster!"},giant:{name:"Giant Mode",icon:"🦖",description:"Pieces are huge!"},tiny:{name:"Tiny Mode",icon:"🐜",description:"Pieces are tiny!"},rainbow:{name:"Rainbow Mode",icon:"🌈",description:"Rainbow colors everywhere!"},matrix:{name:"Matrix Mode",icon:"💊",description:"Enter the Matrix!"},earthquake:{name:"Earthquake Mode",icon:"🌋",description:"The board is shaking!"}};async function jf(r){if(!B||!Be()||!fe)return null;try{const e=re(Me(B,"events")),t={...r,createdAt:Date.now(),createdBy:fe.username,claimedBy:[]};return await Ut(e,t),e.id}catch(e){return console.error("Error creating event:",e),null}}async function Wf(){if(!B)return[];try{const r=await St(Me(B,"events")),e=Date.now();return r.docs.map(t=>({id:t.id,...t.data()})).filter(t=>t.active&&(!t.expiresAt||t.expiresAt>e)).sort((t,n)=>n.createdAt-t.createdAt)}catch(r){return console.error("Error getting events:",r),[]}}async function Gg(){if(!B)return[];try{const r=await St(Me(B,"events")),e=Date.now();return r.docs.map(t=>({id:t.id,...t.data()})).filter(t=>t.active&&t.type==="gamemode"&&t.gameMode&&(!t.expiresAt||t.expiresAt>e)).map(t=>t.gameMode)}catch(r){return console.error("Error getting game modes:",r),[]}}async function jk(){if(!B||!Be())return[];try{return(await St(Me(B,"events"))).docs.map(e=>({id:e.id,...e.data()})).sort((e,t)=>t.createdAt-e.createdAt)}catch(r){return console.error("Error getting all events:",r),[]}}async function Wk(r){if(!B||!Be())return!1;try{return await qr(re(B,"events",r)),!0}catch(e){return console.error("Error deleting event:",e),!1}}async function Qk(r,e){if(!B||!Be())return!1;try{return await Re(re(B,"events",r),{active:e}),!0}catch(t){return console.error("Error toggling event:",t),!1}}async function Kk(r){if(!B||!ae||!fe)return!1;try{const e=await Xe(re(B,"events",r));if(!e.exists())return!1;const t={id:e.id,...e.data()};if(t.claimedBy?.includes(ae.uid)||!t.active||t.expiresAt&&t.expiresAt<Date.now())return!1;if(t.rewardType==="warBucks"&&t.rewardAmount){const i=(fe.warBucks||0)+t.rewardAmount;await Re(re(B,"users",ae.uid),{warBucks:i})}else if(t.rewardType==="item"&&t.rewardItemId){const i=fe.purchasedItems||[];i.includes(t.rewardItemId)||(i.push(t.rewardItemId),await Re(re(B,"users",ae.uid),{purchasedItems:i}))}const n=t.claimedBy||[];return n.push(ae.uid),await Re(re(B,"events",r),{claimedBy:n}),await Pi(),!0}catch(e){return console.error("Error claiming reward:",e),!1}}async function Yk(r,e="info",t=60){if(!B||!Be()||!fe)return null;try{const n=re(Me(B,"globalMessages"));return await Ut(n,{message:r,type:e,createdAt:Date.now(),createdBy:fe.username,expiresAt:Date.now()+t*60*1e3,seenBy:[]}),n.id}catch(n){return console.error("Error sending global message:",n),null}}async function Ug(){if(!B||!ae)return[];try{const r=await St(Me(B,"globalMessages")),e=Date.now();return r.docs.map(t=>({id:t.id,...t.data()})).filter(t=>t.expiresAt>e&&!t.seenBy?.includes(ae.uid)).sort((t,n)=>n.createdAt-t.createdAt)}catch(r){return console.error("Error getting global messages:",r),[]}}async function Zk(r){if(!B||!ae)return!1;try{const e=await Xe(re(B,"globalMessages",r));if(!e.exists())return!1;const t=e.data().seenBy||[];return t.includes(ae.uid)||(t.push(ae.uid),await Re(re(B,"globalMessages",r),{seenBy:t})),!0}catch(e){return console.error("Error marking message seen:",e),!1}}async function Jk(){if(!B||!Be())return 0;try{const r=await St(Me(B,"globalMessages"));let e=0;for(const t of r.docs)await qr(re(B,"globalMessages",t.id)),e++;return e}catch(r){return console.error("Error deleting messages:",r),0}}async function Xk(r,e){if(!B||!ae)return!1;try{const t=await Xe(re(B,"events",r));if(!t.exists())return!1;const n=t.data();if(n.type!=="poll")return!1;const i=n.pollVotes||{};return i[ae.uid]=String(e),await Re(re(B,"events",r),{pollVotes:i}),!0}catch(t){return console.error("Error voting:",t),!1}}async function e4(r){if(!B)return{};try{const e=await Xe(re(B,"events",r));if(!e.exists())return{};const n=e.data().pollVotes||{},i={};return Object.values(n).forEach(s=>{i[s]=(i[s]||0)+1}),i}catch(e){return console.error("Error getting poll results:",e),{}}}async function t4(){if(!B||!Be())return 0;try{const r=await St(Me(B,"users"));let e=0;for(const t of r.docs)await Re(re(B,"users",t.id),{stats:{gamesPlayed:0,gamesWon:0,gamesLost:0,totalPointsScored:0,piecesEliminated:0,engineersCaptured:0,timePlayed:0,tanksDestroyed:0,rocketsDestroyed:0,shipsDestroyed:0,helicoptersDestroyed:0,hackersDestroyed:0,multiplayerWins:0,multiplayerGames:0,chatMessagesSent:0,totalWarBucksEarned:0,totalWarBucksSpent:0},puzzleStats:{puzzlesSolved:0,puzzlesAttempted:0,perfectSolves:0,dailyStreak:0,lastPuzzleDate:0,solvedPuzzleIds:[]}}),e++;return e}catch(r){return console.error("Error resetting all stats:",r),0}}async function r4(){if(!B||!Be())return 0;try{const r=await St(Me(B,"users"));let e=0;for(const t of r.docs)await Re(re(B,"users",t.id),{warBucks:0}),e++;return e}catch(r){return console.error("Error resetting all war bucks:",r),0}}async function n4(){if(!B||!Be())return 0;try{const r=await St(Me(B,"events"));let e=0;for(const t of r.docs)await qr(re(B,"events",t.id)),e++;return e}catch(r){return console.error("Error deleting all events:",r),0}}async function i4(){if(!B||!Be())return 0;try{const r=await St(Me(B,"games"));let e=0;for(const t of r.docs)await qr(re(B,"games",t.id)),e++;return e}catch(r){return console.error("Error deleting all games:",r),0}}async function s4(){if(!B||!Be())return 0;try{const r=await St(Me(B,"users")),e=Pe.map(n=>n.id);let t=0;for(const n of r.docs)await Re(re(B,"users",n.id),{purchasedItems:e}),t++;return t}catch(r){return console.error("Error giving all items to all:",r),0}}async function o4(){if(!B||!Be()||!fe)return 0;const r=[{type:"gamemode",title:"Disco Mode Active!",message:"Party time! Flashing colors everywhere!",icon:"🪩",active:!0,gameMode:"disco"},{type:"gamemode",title:"Jumpscare Mode!",message:"Beware of random scary surprises...",icon:"👻",active:!1,gameMode:"jumpscare"},{type:"gamemode",title:"Chaos Mode!",message:"Everything is unpredictable!",icon:"🌀",active:!1,gameMode:"chaos"},{type:"gamemode",title:"Rainbow Mode!",message:"Beautiful rainbow colors!",icon:"🌈",active:!1,gameMode:"rainbow"},{type:"gamemode",title:"Matrix Mode!",message:"Enter the Matrix...",icon:"💊",active:!1,gameMode:"matrix"},{type:"gamemode",title:"Earthquake Mode!",message:"The board is shaking!",icon:"🌋",active:!1,gameMode:"earthquake"},{type:"gamemode",title:"Mirror Mode!",message:"Everything is reversed!",icon:"🪞",active:!1,gameMode:"mirror"},{type:"gamemode",title:"Speed Mode!",message:"Everything moves faster!",icon:"⚡",active:!1,gameMode:"speed"},{type:"gamemode",title:"Giant Mode!",message:"Pieces are huge!",icon:"🦖",active:!1,gameMode:"giant"},{type:"gamemode",title:"Tiny Mode!",message:"Pieces are tiny!",icon:"🐜",active:!1,gameMode:"tiny"},{type:"reward",title:"Welcome Bonus!",message:"Claim your free War Bucks!",icon:"🎁",active:!0,rewardType:"warBucks",rewardAmount:100},{type:"reward",title:"Weekend Special!",message:"Extra War Bucks for everyone!",icon:"💰",active:!1,rewardType:"warBucks",rewardAmount:250},{type:"reward",title:"Daily Login!",message:"Thanks for playing today!",icon:"📅",active:!0,rewardType:"warBucks",rewardAmount:50},{type:"reward",title:"Lucky Day!",message:"You got extra lucky today!",icon:"🍀",active:!1,rewardType:"warBucks",rewardAmount:500},{type:"reward",title:"Free Theme!",message:"Get a free desert theme!",icon:"🏜️",active:!1,rewardType:"item",rewardItemId:"theme_desert"},{type:"announcement",title:"Welcome to War Chess!",message:"Thanks for playing! Have fun and good luck!",icon:"👋",active:!0},{type:"update",title:"New Features!",message:"Check out the shop for new items and skins!",icon:"🆕",active:!0},{type:"announcement",title:"Multiplayer is Live!",message:"Challenge your friends to a match!",icon:"🎮",active:!0},{type:"maintenance",title:"Server Update",message:"Brief maintenance scheduled for tonight.",icon:"🔧",active:!1},{type:"event",title:"Tournament Coming!",message:"Big tournament next week with prizes!",icon:"🏆",active:!1},{type:"poll",title:"Favorite Game Mode?",message:"Vote for your favorite!",icon:"📊",active:!0,pollOptions:["Disco 🪩","Matrix 💊","Chaos 🌀","Rainbow 🌈"]},{type:"poll",title:"Next Feature?",message:"What should we add next?",icon:"🗳️",active:!0,pollOptions:["More maps","New pieces","Chat system","Tournaments"]},{type:"poll",title:"Best Team?",message:"Which team do you prefer?",icon:"⚔️",active:!1,pollOptions:["Yellow 💛","Green 💚"]}];let e=0;for(const t of r)try{const n=re(Me(B,"events"));await Ut(n,{...t,createdAt:Date.now(),createdBy:fe.username,claimedBy:[]}),e++}catch(n){console.error("Error creating sample event:",n)}return e}async function a4(r){if(console.log("[ADMIN] Attempting to delete user:",r),!B)return console.error("[ADMIN] Database not initialized"),!1;if(!Be())return console.error("[ADMIN] Not an admin, cannot delete user"),!1;try{const e=await Xe(re(B,"users",r));if(console.log("[ADMIN] User document exists:",e.exists()),e.exists()){const t=e.data();console.log("[ADMIN] Deleting user:",t.username);try{await qr(re(B,"usernames",t.username.toLowerCase())),console.log("[ADMIN] Deleted username mapping")}catch(n){console.log("[ADMIN] Could not delete username mapping (might not exist):",n)}await qr(re(B,"users",r)),console.log("[ADMIN] Deleted user document")}else console.log("[ADMIN] User document does not exist, nothing to delete");try{await qr(re(B,"online",r)),console.log("[ADMIN] Removed from online collection")}catch{}return console.log("[ADMIN] User deletion successful"),!0}catch(e){console.error("[ADMIN] Error deleting user:",e);try{if(!(await Xe(re(B,"users",r))).exists())return console.log("[ADMIN] User does not exist after error, treating as success"),!0}catch(t){console.error("[ADMIN] Could not verify user existence:",t)}return!1}}const l4=["kut","lul","eikel","klootzak","hoer","slet","kanker","tyfus","tering","godver","kak","stront","pik","neuken","flikker","homo","mongool","debiel","idioot","sukkel","stomkop","drol","poep","schijt","fuck","shit","ass","bitch","damn","hell","crap","dick","cock","pussy","whore","slut","bastard","cunt","nigger","faggot","retard","idiot","stupid","dumb"];function c4(r){let e=r,t=!1;for(const n of l4){const i=new RegExp(`\\b${n}\\b`,"gi");i.test(e)&&(t=!0,e=e.replace(i,"*".repeat(n.length)))}return{filtered:e,wasFiltered:t}}const Hg=[{id:"gg",text:"Good game!",textNL:"Goed gespeeld!"},{id:"nice",text:"Nice move!",textNL:"Goede zet!"},{id:"think",text:"Thinking...",textNL:"Ik denk na..."},{id:"gl",text:"Good luck!",textNL:"Succes!"},{id:"thanks",text:"Thanks!",textNL:"Bedankt!"},{id:"sorry",text:"Sorry!",textNL:"Sorry!"},{id:"wow",text:"Wow!",textNL:"Wow!"},{id:"oops",text:"Oops!",textNL:"Oeps!"}];let Wi=null,mc=null;async function gc(r,e,t,n=!1,i){if(!B||!ae||!fe)return!1;try{let s=e;if(!n){const{filtered:l}=c4(e);s=l}const o=re(Me(B,"gameChats"));await Ut(o,{gameId:r,fromPlayerId:ae.uid,fromUsername:fe.username,message:s,timestamp:Date.now(),team:t,isQuickChat:n,quickChatId:i||null});const c=(fe.stats.chatMessagesSent||0)+1;return await Re(re(B,"users",ae.uid),{"stats.chatMessagesSent":c}),!0}catch(s){return console.error("Error sending chat message:",s),!1}}function u4(r,e){if(!B)return;mc=e,Wi&&Wi();const t=Vo(Me(B,"gameChats"),po("gameId","==",r));Wi=Do(t,n=>{const i=[];n.forEach(s=>{i.push({id:s.id,...s.data()})}),i.sort((s,o)=>s.timestamp-o.timestamp),mc&&mc(i)})}function jg(){Wi&&(Wi(),Wi=null)}async function d4(){if(!B)return[];try{const e=(await St(Me(B,"puzzles"))).docs.map(o=>({id:o.id,...o.data()})),t=e.filter(o=>o.difficulty==="easy"),n=e.filter(o=>o.difficulty==="medium"),i=e.filter(o=>o.difficulty==="hard"),s=[];return t.length>0&&s.push(t[Math.floor(Math.random()*t.length)]),n.length>0&&s.push(n[Math.floor(Math.random()*n.length)]),i.length>0&&s.push(i[Math.floor(Math.random()*i.length)]),s}catch(r){return console.error("Error getting puzzles:",r),[]}}async function h4(r,e,t){if(!B||!ae||!fe)return{warBucks:0,perfect:!1};try{const n=re(B,"puzzles",r),i=await Xe(n);if(i.exists()){const h=i.data();await Re(n,{timesAttempted:h.timesAttempted+1,timesSolved:e?h.timesSolved+1:h.timesSolved})}let s=0;const o=t===1;t===1?s=50:t===2?s=30:s=15;const c=fe.puzzleStats||{puzzlesSolved:0,puzzlesAttempted:0,perfectSolves:0,dailyStreak:0,lastPuzzleDate:0,solvedPuzzleIds:[]},l=new Date().setHours(0,0,0,0),u=new Date(c.lastPuzzleDate).setHours(0,0,0,0),f=l-864e5;let d=c.dailyStreak;return u===f?d+=1:u!==l&&(d=1),await Re(re(B,"users",ae.uid),{warBucks:fe.warBucks+s,"stats.totalWarBucksEarned":(fe.stats.totalWarBucksEarned||0)+s,"puzzleStats.puzzlesSolved":c.puzzlesSolved+1,"puzzleStats.puzzlesAttempted":c.puzzlesAttempted+t,"puzzleStats.perfectSolves":o?c.perfectSolves+1:c.perfectSolves,"puzzleStats.dailyStreak":d,"puzzleStats.lastPuzzleDate":Date.now(),"puzzleStats.solvedPuzzleIds":yk(r)}),{warBucks:s,perfect:o}}catch(n){return console.error("Error recording puzzle attempt:",n),{warBucks:0,perfect:!1}}}async function f4(r){if(!B||!Be()||!fe)return null;try{const e=re(Me(B,"puzzles"));return await Ut(e,{...r,createdAt:Date.now(),createdBy:fe.username,timesAttempted:0,timesSolved:0,rating:r.difficulty==="easy"?1:r.difficulty==="medium"?2:3}),e.id}catch(e){return console.error("Error creating puzzle:",e),null}}async function p4(){if(!B||!Be())return[];try{return(await St(Me(B,"puzzles"))).docs.map(e=>({id:e.id,...e.data()}))}catch(r){return console.error("Error getting puzzles:",r),[]}}async function m4(r){if(!B||!Be())return!1;try{return await qr(re(B,"puzzles",r)),!0}catch(e){return console.error("Error deleting puzzle:",e),!1}}async function g4(){if(!B||!Be()||!fe)return 0;const r=[{name:"Capture the Tank",icon:"🎯",difficulty:"easy",maxMoves:1,objective:"Capture the enemy tank in one move",objectiveType:"capture",targetPieceType:"tank",initialBoard:[{type:"soldier",position:{row:4,col:3},team:"blue"},{type:"tank",position:{row:3,col:3},team:"red"},{type:"base",position:{row:7,col:4},team:"blue"},{type:"base",position:{row:0,col:4},team:"red"}],aiMoves:[],rewards:{warBucks:50,xp:25}},{name:"Sniper Shot",icon:"🎯",difficulty:"easy",maxMoves:1,objective:"Use your soldier to capture the enemy soldier",objectiveType:"capture",targetPieceType:"soldier",initialBoard:[{type:"soldier",position:{row:5,col:2},team:"blue"},{type:"soldier",position:{row:3,col:2},team:"red"},{type:"base",position:{row:7,col:4},team:"blue"},{type:"base",position:{row:0,col:4},team:"red"}],aiMoves:[],rewards:{warBucks:50,xp:25}},{name:"Helicopter Hunt",icon:"🚁",difficulty:"easy",maxMoves:1,objective:"Shoot down the helicopter",objectiveType:"capture",targetPieceType:"helicopter",initialBoard:[{type:"soldier",position:{row:4,col:4},team:"blue"},{type:"helicopter",position:{row:2,col:4},team:"red"},{type:"base",position:{row:7,col:4},team:"blue"},{type:"base",position:{row:0,col:4},team:"red"}],aiMoves:[],rewards:{warBucks:50,xp:25}},{name:"Tank Trap",icon:"💣",difficulty:"medium",maxMoves:2,objective:"Position and capture the enemy tank",objectiveType:"capture",targetPieceType:"tank",initialBoard:[{type:"soldier",position:{row:6,col:2},team:"blue"},{type:"tank",position:{row:3,col:4},team:"red"},{type:"soldier",position:{row:4,col:5},team:"red"},{type:"base",position:{row:7,col:4},team:"blue"},{type:"base",position:{row:0,col:4},team:"red"}],aiMoves:[{from:{row:4,col:5},to:{row:5,col:5}}],rewards:{warBucks:75,xp:40}},{name:"Builder Elimination",icon:"🔨",difficulty:"medium",maxMoves:2,objective:"Capture the enemy builder before it can build",objectiveType:"capture",targetPieceType:"builder",initialBoard:[{type:"soldier",position:{row:5,col:1},team:"blue"},{type:"soldier",position:{row:5,col:7},team:"blue"},{type:"builder",position:{row:3,col:4},team:"red"},{type:"soldier",position:{row:2,col:3},team:"red"},{type:"base",position:{row:7,col:4},team:"blue"},{type:"base",position:{row:0,col:4},team:"red"}],aiMoves:[{from:{row:2,col:3},to:{row:3,col:3}}],rewards:{warBucks:75,xp:40}},{name:"Ship Destroyer",icon:"⚓",difficulty:"hard",maxMoves:3,objective:"Sink the enemy ship - watch out for defenders!",objectiveType:"capture",targetPieceType:"ship",initialBoard:[{type:"soldier",position:{row:6,col:0},team:"blue"},{type:"soldier",position:{row:6,col:2},team:"blue"},{type:"ship",position:{row:2,col:1},team:"red"},{type:"soldier",position:{row:3,col:1},team:"red"},{type:"soldier",position:{row:4,col:2},team:"red"},{type:"base",position:{row:7,col:4},team:"blue"},{type:"base",position:{row:0,col:4},team:"red"}],aiMoves:[{from:{row:3,col:1},to:{row:4,col:1}},{from:{row:4,col:2},to:{row:5,col:2}}],rewards:{warBucks:100,xp:60}},{name:"Rocket Launcher Assault",icon:"🚀",difficulty:"hard",maxMoves:3,objective:"Destroy the rocket launcher while avoiding enemy fire",objectiveType:"capture",targetPieceType:"rocketLauncher",initialBoard:[{type:"soldier",position:{row:7,col:3},team:"blue"},{type:"soldier",position:{row:7,col:5},team:"blue"},{type:"rocketLauncher",position:{row:1,col:4},team:"red"},{type:"soldier",position:{row:2,col:3},team:"red"},{type:"soldier",position:{row:2,col:5},team:"red"},{type:"tank",position:{row:3,col:4},team:"red"},{type:"base",position:{row:7,col:4},team:"blue"},{type:"base",position:{row:0,col:4},team:"red"}],aiMoves:[{from:{row:2,col:3},to:{row:3,col:3}},{from:{row:2,col:5},to:{row:3,col:5}}],rewards:{warBucks:100,xp:60}}];let e=0;for(const t of r)await f4(t)&&e++;return e}async function $4(){if(!B)return[];try{const r=await St(Me(B,"tournaments")),e=Date.now();return r.docs.map(t=>({id:t.id,...t.data()})).filter(t=>t.status!=="cancelled"&&t.status!=="finished").sort((t,n)=>t.startTime-n.startTime)}catch(r){return console.error("Error getting tournaments:",r),[]}}async function Wg(r){if(!B)return null;try{const e=await Xe(re(B,"tournaments",r));return e.exists()?{id:e.id,...e.data()}:null}catch(e){return console.error("Error getting tournament:",e),null}}async function y4(r){if(!B||!ae||!fe)return{success:!1,error:"Not logged in"};try{const e=await Xe(re(B,"tournaments",r));if(!e.exists())return{success:!1,error:"Tournament not found"};const t=e.data();if(t.status!=="registration")return{success:!1,error:"Registration is closed"};if(t.currentPlayers>=t.maxPlayers)return{success:!1,error:"Tournament is full"};if(t.registeredPlayers.some(i=>i.odataId===ae.uid))return{success:!1,error:"Already registered"};const n=[...t.registeredPlayers,{odataId:ae.uid,odataUsername:fe.username,registeredAt:Date.now()}];return await Re(re(B,"tournaments",r),{registeredPlayers:n,currentPlayers:n.length}),{success:!0}}catch(e){return console.error("Error registering for tournament:",e),{success:!1,error:"Failed to register"}}}async function w4(r){if(!B||!ae)return!1;try{const e=await Xe(re(B,"tournaments",r));if(!e.exists())return!1;const t=e.data();if(t.status!=="registration")return!1;const n=t.registeredPlayers.filter(i=>i.odataId!==ae.uid);return await Re(re(B,"tournaments",r),{registeredPlayers:n,currentPlayers:n.length}),!0}catch(e){return console.error("Error unregistering from tournament:",e),!1}}async function Qg(r){if(!B)return[];try{const e=Vo(Me(B,"tournamentMatches"),po("tournamentId","==",r));return(await St(e)).docs.map(n=>({id:n.id,...n.data()})).sort((n,i)=>n.round!==i.round?i.round-n.round:n.matchNumber-i.matchNumber)}catch(e){return console.error("Error getting tournament matches:",e),[]}}async function b4(r){if(!B||!ae)return null;try{return(await Qg(r)).find(t=>(t.player1Id===ae.uid||t.player2Id===ae.uid)&&(t.status==="ready"||t.status==="playing"))||null}catch(e){return console.error("Error getting my tournament match:",e),null}}async function v4(r){if(!B||!ae||!fe)return null;try{const e=await Xe(re(B,"tournamentMatches",r));if(!e.exists())return null;const t=e.data();if(!t.player1Id||!t.player2Id)return null;const n=await Wg(t.tournamentId);if(!n)return null;const i=re(Me(B,"games"));return await Ut(i,{yellowPlayerId:t.player1Id,yellowUsername:t.player1Username,greenPlayerId:t.player2Id,greenUsername:t.player2Username,currentTurn:"yellow",createdAt:di(),lastMove:di(),status:"waiting",gameState:null,timerEnabled:n.timerEnabled,timerMinutes:n.timerMinutes,yellowJoined:!1,greenJoined:!1,tournamentMatchId:r}),await Re(re(B,"tournamentMatches",r),{gameId:i.id,status:"playing"}),i.id}catch(e){return console.error("Error creating tournament game:",e),null}}let ye="none",vi="none",Ht="",fr=!1,Kg=!1,on=!1,an=null,sa=[],oa=[],Wn=!1,Ne=null,Ae=null,wn=null,aa=null,ki=null,Ti=!1,ln=10,Bt=!1,Qr=!1,mr=!1,os=!1,Vi=!1,Xn=[],xa="",ni=!1,Qa=!1,ct=null,Kc=0,mo=0,Qi=0,as=!1,go=!1,Qf=[],Yc=null,_t=[],Kf=0,Di=[],Zc=[],Lr=null,$c=[];function Yg(){Di.forEach(n=>clearInterval(n)),Di=[];const r=document.getElementById("game-mode-styles");if(r&&r.remove(),document.querySelectorAll(".game-mode-overlay").forEach(n=>n.remove()),_t.length===0)return;const e=document.createElement("style");e.id="game-mode-styles",e.textContent=`
    /* Disco Mode */
    @keyframes disco-bg {
      0% { filter: hue-rotate(0deg); }
      100% { filter: hue-rotate(360deg); }
    }
    .disco-mode #app {
      animation: disco-bg 2s linear infinite;
    }
    .disco-mode .disco-ball {
      position: fixed;
      top: 10px;
      right: 10px;
      font-size: 40px;
      animation: disco-spin 1s linear infinite;
      z-index: 1000;
      pointer-events: none;
    }
    @keyframes disco-spin {
      0% { transform: rotate(0deg) scale(1); }
      50% { transform: rotate(180deg) scale(1.2); }
      100% { transform: rotate(360deg) scale(1); }
    }

    /* Rainbow Mode */
    @keyframes rainbow-border {
      0% { border-color: red; }
      14% { border-color: orange; }
      28% { border-color: yellow; }
      42% { border-color: green; }
      57% { border-color: blue; }
      71% { border-color: indigo; }
      85% { border-color: violet; }
      100% { border-color: red; }
    }
    .rainbow-mode svg {
      border: 4px solid red;
      animation: rainbow-border 3s linear infinite;
      border-radius: 8px;
    }

    /* Earthquake Mode */
    @keyframes earthquake {
      0%, 100% { transform: translate(0, 0) rotate(0deg); }
      10% { transform: translate(-2px, -1px) rotate(-0.5deg); }
      20% { transform: translate(2px, 1px) rotate(0.5deg); }
      30% { transform: translate(-1px, 2px) rotate(-0.3deg); }
      40% { transform: translate(1px, -2px) rotate(0.3deg); }
      50% { transform: translate(-2px, 1px) rotate(-0.5deg); }
      60% { transform: translate(2px, -1px) rotate(0.5deg); }
      70% { transform: translate(-1px, -2px) rotate(-0.3deg); }
      80% { transform: translate(1px, 2px) rotate(0.3deg); }
      90% { transform: translate(-2px, -1px) rotate(-0.5deg); }
    }
    .earthquake-mode #board-container {
      animation: earthquake 0.5s ease-in-out infinite;
    }

    /* Matrix Mode */
    .matrix-mode #app {
      background: black !important;
    }
    .matrix-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
      z-index: 999;
      overflow: hidden;
      opacity: 0.3;
    }
    .matrix-drop {
      position: absolute;
      color: #00ff00;
      font-family: monospace;
      font-size: 14px;
      text-shadow: 0 0 5px #00ff00;
      white-space: pre;
      line-height: 1.2;
    }

    /* Giant Mode */
    .giant-mode svg {
      transform: scale(1.3);
      transform-origin: center top;
    }

    /* Tiny Mode */
    .tiny-mode svg {
      transform: scale(0.6);
    }

    /* Chaos Mode */
    @keyframes chaos-glitch {
      0%, 100% { filter: none; transform: none; }
      10% { filter: invert(1); }
      20% { transform: skewX(5deg); }
      30% { filter: hue-rotate(90deg); }
      40% { transform: skewY(-3deg); }
      50% { filter: saturate(3); }
      60% { transform: scale(1.02); }
      70% { filter: contrast(1.5); }
      80% { transform: translateX(2px); }
      90% { filter: blur(1px); }
    }
    .chaos-mode #board-container {
      animation: chaos-glitch 3s ease-in-out infinite;
    }

    /* Mirror Mode */
    .mirror-mode svg {
      transform: scaleX(-1);
    }

    /* Speed Mode */
    .speed-mode * {
      transition-duration: 0.1s !important;
      animation-duration: 0.5s !important;
    }
    .speed-mode::after {
      content: '⚡ SPEED MODE ⚡';
      position: fixed;
      top: 5px;
      left: 50%;
      transform: translateX(-50%);
      color: yellow;
      font-weight: bold;
      font-size: 12px;
      z-index: 1000;
      text-shadow: 0 0 5px orange;
      pointer-events: none;
    }

    /* Jumpscare overlay */
    .jumpscare-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: black;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      animation: jumpscare-flash 0.3s ease-out;
    }
    .jumpscare-overlay span {
      font-size: 200px;
      animation: jumpscare-shake 0.3s ease-out;
    }
    @keyframes jumpscare-flash {
      0% { opacity: 0; }
      50% { opacity: 1; }
      100% { opacity: 0; }
    }
    @keyframes jumpscare-shake {
      0%, 100% { transform: scale(1) rotate(0deg); }
      25% { transform: scale(1.5) rotate(-10deg); }
      50% { transform: scale(2) rotate(10deg); }
      75% { transform: scale(1.5) rotate(-5deg); }
    }
  `,document.head.appendChild(e);const t=document.body;if(_t.includes("disco")){t.classList.add("disco-mode");const n=document.createElement("div");n.className="disco-ball game-mode-overlay",n.textContent="🪩",document.body.appendChild(n)}if(_t.includes("rainbow")&&t.classList.add("rainbow-mode"),_t.includes("earthquake")&&t.classList.add("earthquake-mode"),_t.includes("giant")&&t.classList.add("giant-mode"),_t.includes("tiny")&&t.classList.add("tiny-mode"),_t.includes("chaos")&&t.classList.add("chaos-mode"),_t.includes("mirror")&&t.classList.add("mirror-mode"),_t.includes("speed")&&t.classList.add("speed-mode"),_t.includes("matrix")){t.classList.add("matrix-mode");const n=document.createElement("div");n.className="matrix-overlay game-mode-overlay",n.id="matrix-rain",document.body.appendChild(n),$c=[];for(let s=0;s<30;s++)$c.push({x:Math.random()*window.innerWidth,y:Math.random()*-500,speed:2+Math.random()*5,chars:Array(15).fill(0).map(()=>String.fromCharCode(12448+Math.random()*96))});const i=setInterval(()=>{const s=document.getElementById("matrix-rain");if(!s||!_t.includes("matrix")){clearInterval(i);return}s.innerHTML=$c.map(o=>(o.y+=o.speed,o.y>window.innerHeight&&(o.y=-200,o.x=Math.random()*window.innerWidth),Math.random()<.1&&(o.chars[Math.floor(Math.random()*o.chars.length)]=String.fromCharCode(12448+Math.random()*96)),`<div class="matrix-drop" style="left:${o.x}px;top:${o.y}px">${o.chars.join(`
`)}</div>`)).join("")},50);Di.push(i)}if(_t.includes("jumpscare")){const n=setInterval(()=>{if(!_t.includes("jumpscare")||Ce!=="playing"){clearInterval(n);return}const i=Date.now();i-Kf>3e4&&Math.random()<.02&&(Kf=i,k4())},1e3);Di.push(n)}}function k4(){const r=["👻","💀","👹","🎃","😱","🤡","👽","☠️"],e=r[Math.floor(Math.random()*r.length)],t=document.createElement("div");t.className="jumpscare-overlay",t.innerHTML=`<span>${e}</span>`,document.body.appendChild(t),be("capture"),setTimeout(()=>t.remove(),300)}function T4(){Di.forEach(t=>clearInterval(t)),Di=[],document.body.classList.remove("disco-mode","rainbow-mode","earthquake-mode","giant-mode","tiny-mode","chaos-mode","mirror-mode","speed-mode","matrix-mode"),document.querySelectorAll(".game-mode-overlay").forEach(t=>t.remove());const e=document.getElementById("game-mode-styles");e&&e.remove()}async function x4(){Xt()&&(Zc=await Ug(),Ju())}function Ju(){if(Zc.length===0){Lr=null;return}Lr=Zc.shift(),_4()}function _4(){if(!Lr)return;document.getElementById("global-message-popup")?.remove();const r={info:"from-blue-600 to-blue-800",warning:"from-yellow-600 to-yellow-800",success:"from-green-600 to-green-800",error:"from-red-600 to-red-800"},e={info:"📢",warning:"⚠️",success:"✅",error:"❌"},t=document.createElement("div");if(t.id="global-message-popup",t.className="fixed inset-0 bg-black/70 flex items-center justify-center z-[10000] p-4",t.innerHTML=`
    <div class="bg-gradient-to-br ${r[Lr.type]} p-6 rounded-xl max-w-md w-full shadow-2xl animate-bounce-in">
      <div class="flex items-center gap-3 mb-4">
        <span class="text-4xl">${e[Lr.type]}</span>
        <h2 class="text-xl font-bold text-white">Global Message</h2>
      </div>
      <p class="text-white text-lg mb-4">${Lr.message}</p>
      <p class="text-white/70 text-sm mb-4">From: ${Lr.createdBy}</p>
      <button id="dismiss-global-msg" class="w-full bg-white/20 hover:bg-white/30 text-white font-bold py-3 px-6 rounded-lg transition-colors">
        OK
      </button>
    </div>
  `,document.body.appendChild(t),!document.getElementById("global-msg-style")){const n=document.createElement("style");n.id="global-msg-style",n.textContent=`
      @keyframes bounce-in {
        0% { transform: scale(0.5); opacity: 0; }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); opacity: 1; }
      }
      .animate-bounce-in { animation: bounce-in 0.3s ease-out; }
    `,document.head.appendChild(n)}document.getElementById("dismiss-global-msg")?.addEventListener("click",async()=>{Lr&&await Zk(Lr.id),t.remove(),Ju()})}let er=null,gr=null,dn=null,hn=null,Mr=null,ls=[];function Vt(){return gr&&Pe.find(e=>e.id===gr)?.skinStyle||null}function xt(r){const e=Vt(),t={yellow:{primary:"#fde047",secondary:"#facc15",accent:"#eab308",dark:"#a16207",helmet:"#6b5a2f",uniform:"#5c4a1f",uniformDark:"#3d3214"},green:{primary:"#4ade80",secondary:"#22c55e",accent:"#16a34a",dark:"#15803d",helmet:"#3d5a3d",uniform:"#2d4a2d",uniformDark:"#1e331e"}};if(!e)return t[r];switch(e){case"robot":return r==="yellow"?{primary:"#00ffff",secondary:"#0891b2",accent:"#06b6d4",dark:"#0e7490",helmet:"#1e3a5f",uniform:"#0f172a",uniformDark:"#020617"}:{primary:"#ff00ff",secondary:"#a855f7",accent:"#c026d3",dark:"#7e22ce",helmet:"#4a1d5f",uniform:"#1e1b4b",uniformDark:"#0c0a1d"};case"medieval":return r==="yellow"?{primary:"#ffd700",secondary:"#daa520",accent:"#b8860b",dark:"#8b6914",helmet:"#8b4513",uniform:"#654321",uniformDark:"#3d2817"}:{primary:"#c0c0c0",secondary:"#a8a8a8",accent:"#808080",dark:"#606060",helmet:"#4a4a4a",uniform:"#2d2d2d",uniformDark:"#1a1a1a"};case"scifi":return r==="yellow"?{primary:"#00ff66",secondary:"#22c55e",accent:"#10b981",dark:"#059669",helmet:"#064e3b",uniform:"#022c22",uniformDark:"#011a13"}:{primary:"#00ffff",secondary:"#06b6d4",accent:"#0891b2",dark:"#0e7490",helmet:"#164e63",uniform:"#083344",uniformDark:"#042f2e"};case"pixel":return r==="yellow"?{primary:"#ffff00",secondary:"#ff8800",accent:"#ff4400",dark:"#cc3300",helmet:"#884400",uniform:"#664422",uniformDark:"#442211"}:{primary:"#00ff00",secondary:"#00cc88",accent:"#00aa66",dark:"#008844",helmet:"#006633",uniform:"#004422",uniformDark:"#002211"};case"minimal":return r==="yellow"?{primary:"#f5f5f5",secondary:"#e5e5e5",accent:"#fde047",dark:"#a3a3a3",helmet:"#737373",uniform:"#525252",uniformDark:"#404040"}:{primary:"#f5f5f5",secondary:"#e5e5e5",accent:"#4ade80",dark:"#a3a3a3",helmet:"#737373",uniform:"#525252",uniformDark:"#404040"};case"cartoon":return r==="yellow"?{primary:"#ffeb3b",secondary:"#ffc107",accent:"#ff9800",dark:"#f57c00",helmet:"#e65100",uniform:"#bf360c",uniformDark:"#8d2600"}:{primary:"#8bc34a",secondary:"#4caf50",accent:"#43a047",dark:"#2e7d32",helmet:"#1b5e20",uniform:"#194d19",uniformDark:"#0d3d0d"};case"military":return r==="yellow"?{primary:"#8b8b00",secondary:"#6b6b00",accent:"#4b4b00",dark:"#3b3b00",helmet:"#2d2d00",uniform:"#1f1f00",uniformDark:"#0f0f00"}:{primary:"#556b2f",secondary:"#4a5d2a",accent:"#3d4f22",dark:"#2f3d1a",helmet:"#222d12",uniform:"#1a2210",uniformDark:"#0f1508"};case"fantasy":return r==="yellow"?{primary:"#9400d3",secondary:"#8b008b",accent:"#800080",dark:"#4b0082",helmet:"#2e0854",uniform:"#1a0330",uniformDark:"#0d011a"}:{primary:"#00ced1",secondary:"#20b2aa",accent:"#008b8b",dark:"#006666",helmet:"#004d4d",uniform:"#003333",uniformDark:"#001a1a"};default:return t[r]}}function E4(){return dn&&Pe.find(e=>e.id===dn)?.effectType||null}function Ns(r,e,t,n){const i=Vt();if(!i)return r;let s="",o="";const c=e+25,l=t+25,u=n==="yellow"?"#ffff00":"#00ff00",f=n==="yellow"?"#ff8800":"#00cc88";switch(i){case"robot":o=`
        <rect x="${e+5}" y="${t+5}" width="40" height="40" rx="5" fill="none" stroke="${n==="yellow"?"#00ffff":"#ff00ff"}" stroke-width="3" opacity="0.8" class="pointer-events-none" />
        <rect x="${e+8}" y="${t+8}" width="34" height="34" rx="3" fill="${n==="yellow"?"rgba(0,255,255,0.15)":"rgba(255,0,255,0.15)"}" class="pointer-events-none" />
      `,s=`
        <circle cx="${e+12}" cy="${t+12}" r="4" fill="${n==="yellow"?"#00ffff":"#ff00ff"}" class="pointer-events-none">
          <animate attributeName="opacity" values="1;0.3;1" dur="0.8s" repeatCount="indefinite" />
        </circle>
        <circle cx="${e+38}" cy="${t+12}" r="4" fill="${n==="yellow"?"#00ffff":"#ff00ff"}" class="pointer-events-none">
          <animate attributeName="opacity" values="0.3;1;0.3" dur="0.8s" repeatCount="indefinite" />
        </circle>
        <line x1="${e+12}" y1="${t+16}" x2="${e+12}" y2="${t+38}" stroke="${n==="yellow"?"#00ffff":"#ff00ff"}" stroke-width="2" opacity="0.5" class="pointer-events-none" />
        <line x1="${e+38}" y1="${t+16}" x2="${e+38}" y2="${t+38}" stroke="${n==="yellow"?"#00ffff":"#ff00ff"}" stroke-width="2" opacity="0.5" class="pointer-events-none" />
        <rect x="${e+18}" y="${t+40}" width="14" height="4" fill="${n==="yellow"?"#00ffff":"#ff00ff"}" opacity="0.7" class="pointer-events-none" />
      `;break;case"medieval":o=`
        <path d="M${c} ${t+2} L${e+42} ${t+12} L${e+42} ${t+35} L${c} ${t+48} L${e+8} ${t+35} L${e+8} ${t+12} Z" fill="none" stroke="#ffd700" stroke-width="3" opacity="0.8" class="pointer-events-none" />
        <path d="M${c} ${t+5} L${e+39} ${t+14} L${e+39} ${t+33} L${c} ${t+44} L${e+11} ${t+33} L${e+11} ${t+14} Z" fill="rgba(255,215,0,0.15)" class="pointer-events-none" />
      `,s=`
        <path d="M${c-12} ${t} L${c-8} ${t-6} L${c-4} ${t} L${c} ${t-8} L${c+4} ${t} L${c+8} ${t-6} L${c+12} ${t}" stroke="#ffd700" fill="#ffd700" stroke-width="2" class="pointer-events-none" />
        <circle cx="${c}" cy="${t-2}" r="2" fill="#ff0000" class="pointer-events-none" />
      `;break;case"scifi":o=`
        <rect x="${e+3}" y="${t+3}" width="44" height="44" rx="3" fill="rgba(0,255,100,0.1)" stroke="#00ff66" stroke-width="2" class="pointer-events-none" />
      `,s=`
        <line x1="${e}" y1="${t+8}" x2="${e+50}" y2="${t+8}" stroke="#00ff66" stroke-width="1" opacity="0.6" class="pointer-events-none">
          <animate attributeName="y1" values="${t+8};${t+42};${t+8}" dur="2s" repeatCount="indefinite" />
          <animate attributeName="y2" values="${t+8};${t+42};${t+8}" dur="2s" repeatCount="indefinite" />
        </line>
        <circle cx="${e+8}" cy="${t+8}" r="3" fill="#00ff66" opacity="0.8" class="pointer-events-none" />
        <circle cx="${e+42}" cy="${t+8}" r="3" fill="#00ff66" opacity="0.8" class="pointer-events-none" />
        <circle cx="${e+8}" cy="${t+42}" r="3" fill="#00ff66" opacity="0.8" class="pointer-events-none" />
        <circle cx="${e+42}" cy="${t+42}" r="3" fill="#00ff66" opacity="0.8" class="pointer-events-none" />
        <text x="${e+5}" y="${t+48}" font-size="6" fill="#00ff66" font-family="monospace" class="pointer-events-none">SCI-FI</text>
      `;break;case"pixel":const d=6;o=`
        <!-- Pixel border top -->
        <rect x="${e}" y="${t}" width="${d}" height="${d}" fill="${u}" class="pointer-events-none" />
        <rect x="${e+d}" y="${t}" width="${d}" height="${d}" fill="${f}" class="pointer-events-none" />
        <rect x="${e+d*2}" y="${t}" width="${d}" height="${d}" fill="${u}" class="pointer-events-none" />
        <rect x="${e+50-d*3}" y="${t}" width="${d}" height="${d}" fill="${u}" class="pointer-events-none" />
        <rect x="${e+50-d*2}" y="${t}" width="${d}" height="${d}" fill="${f}" class="pointer-events-none" />
        <rect x="${e+50-d}" y="${t}" width="${d}" height="${d}" fill="${u}" class="pointer-events-none" />
        <!-- Pixel border left -->
        <rect x="${e}" y="${t+d}" width="${d}" height="${d}" fill="${f}" class="pointer-events-none" />
        <rect x="${e}" y="${t+d*2}" width="${d}" height="${d}" fill="${u}" class="pointer-events-none" />
        <!-- Pixel border right -->
        <rect x="${e+50-d}" y="${t+d}" width="${d}" height="${d}" fill="${f}" class="pointer-events-none" />
        <rect x="${e+50-d}" y="${t+d*2}" width="${d}" height="${d}" fill="${u}" class="pointer-events-none" />
        <!-- Pixel border bottom -->
        <rect x="${e}" y="${t+50-d}" width="${d}" height="${d}" fill="${u}" class="pointer-events-none" />
        <rect x="${e+d}" y="${t+50-d}" width="${d}" height="${d}" fill="${f}" class="pointer-events-none" />
        <rect x="${e+d*2}" y="${t+50-d}" width="${d}" height="${d}" fill="${u}" class="pointer-events-none" />
        <rect x="${e+50-d*3}" y="${t+50-d}" width="${d}" height="${d}" fill="${u}" class="pointer-events-none" />
        <rect x="${e+50-d*2}" y="${t+50-d}" width="${d}" height="${d}" fill="${f}" class="pointer-events-none" />
        <rect x="${e+50-d}" y="${t+50-d}" width="${d}" height="${d}" fill="${u}" class="pointer-events-none" />
        <!-- Pixel border bottom-left corner -->
        <rect x="${e}" y="${t+50-d*2}" width="${d}" height="${d}" fill="${f}" class="pointer-events-none" />
        <rect x="${e}" y="${t+50-d*3}" width="${d}" height="${d}" fill="${u}" class="pointer-events-none" />
        <!-- Pixel border bottom-right corner -->
        <rect x="${e+50-d}" y="${t+50-d*2}" width="${d}" height="${d}" fill="${f}" class="pointer-events-none" />
        <rect x="${e+50-d}" y="${t+50-d*3}" width="${d}" height="${d}" fill="${u}" class="pointer-events-none" />
      `,s=`
        <text x="${c}" y="${t+48}" font-size="8" fill="${u}" text-anchor="middle" font-family="monospace" font-weight="bold" class="pointer-events-none">8-BIT</text>
      `;break;case"minimal":o=`
        <circle cx="${c}" cy="${l}" r="24" fill="none" stroke="${u}" stroke-width="3" class="pointer-events-none" />
        <circle cx="${c}" cy="${l}" r="20" fill="none" stroke="${f}" stroke-width="1" stroke-dasharray="4,4" class="pointer-events-none" />
      `,s=`
        <line x1="${c-18}" y1="${l}" x2="${c+18}" y2="${l}" stroke="${u}" stroke-width="1" opacity="0.5" class="pointer-events-none" />
        <line x1="${c}" y1="${l-18}" x2="${c}" y2="${l+18}" stroke="${u}" stroke-width="1" opacity="0.5" class="pointer-events-none" />
      `;break;case"cartoon":o=`
        <ellipse cx="${c+2}" cy="${l+3}" rx="24" ry="22" fill="rgba(0,0,0,0.3)" class="pointer-events-none" />
        <ellipse cx="${c}" cy="${l}" rx="24" ry="22" fill="none" stroke="#000000" stroke-width="4" class="pointer-events-none" />
        <ellipse cx="${c}" cy="${l}" rx="22" ry="20" fill="rgba(255,255,255,0.2)" class="pointer-events-none" />
      `,s=`
        <text x="${e+40}" y="${t+12}" font-size="12" class="pointer-events-none">✨</text>
        <text x="${e+5}" y="${t+15}" font-size="10" class="pointer-events-none">⭐</text>
        <ellipse cx="${c-8}" cy="${t+15}" rx="4" ry="6" fill="#ffffff" opacity="0.6" class="pointer-events-none" />
      `;break;case"military":o=`
        <rect x="${e+3}" y="${t+3}" width="44" height="44" fill="none" stroke="#556b2f" stroke-width="3" class="pointer-events-none" />
        <rect x="${e+6}" y="${t+6}" width="38" height="38" fill="none" stroke="#8b4513" stroke-width="1" stroke-dasharray="8,4" class="pointer-events-none" />
      `,s=`
        <circle cx="${c}" cy="${l}" r="16" fill="none" stroke="#ff0000" stroke-width="2" opacity="0.6" class="pointer-events-none" />
        <line x1="${c-20}" y1="${l}" x2="${c-8}" y2="${l}" stroke="#ff0000" stroke-width="2" opacity="0.6" class="pointer-events-none" />
        <line x1="${c+8}" y1="${l}" x2="${c+20}" y2="${l}" stroke="#ff0000" stroke-width="2" opacity="0.6" class="pointer-events-none" />
        <line x1="${c}" y1="${l-20}" x2="${c}" y2="${l-8}" stroke="#ff0000" stroke-width="2" opacity="0.6" class="pointer-events-none" />
        <line x1="${c}" y1="${l+8}" x2="${c}" y2="${l+20}" stroke="#ff0000" stroke-width="2" opacity="0.6" class="pointer-events-none" />
        <text x="${e+3}" y="${t+48}" font-size="6" fill="#556b2f" font-family="monospace" class="pointer-events-none">TACTICAL</text>
      `;break;case"fantasy":o=`
        <defs>
          <radialGradient id="magicAura${e}${t}" cx="50%" cy="50%" r="50%">
            <stop offset="0%" style="stop-color:${n==="yellow"?"#9400d3":"#00ced1"};stop-opacity:0.4" />
            <stop offset="100%" style="stop-color:${n==="yellow"?"#9400d3":"#00ced1"};stop-opacity:0" />
          </radialGradient>
        </defs>
        <circle cx="${c}" cy="${l}" r="28" fill="url(#magicAura${e}${t})" class="pointer-events-none">
          <animate attributeName="r" values="28;32;28" dur="1.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="${c}" cy="${l}" r="24" fill="none" stroke="${n==="yellow"?"#9400d3":"#00ced1"}" stroke-width="2" opacity="0.6" class="pointer-events-none">
          <animate attributeName="stroke-opacity" values="0.6;1;0.6" dur="1s" repeatCount="indefinite" />
        </circle>
      `,s=`
        <text x="${e+5}" y="${t+12}" font-size="10" class="pointer-events-none">✨</text>
        <text x="${e+38}" y="${t+10}" font-size="12" class="pointer-events-none">⭐</text>
        <text x="${e+8}" y="${t+45}" font-size="8" class="pointer-events-none">🔮</text>
        <text x="${e+35}" y="${t+48}" font-size="10" class="pointer-events-none">✨</text>
        <text x="${c}" y="${t-2}" font-size="8" text-anchor="middle" fill="${n==="yellow"?"#ffd700":"#00ffff"}" class="pointer-events-none">♦</text>
      `;break}return o+r+s}function Jc(r,e,t=10){const n=E4();if(n)for(let i=0;i<t;i++){const s=Math.random()*Math.PI*2,o=Math.random()*3+1;let c="#ff6600",l="fire",u=Math.random()*4+2;switch(n){case"fire":c=["#ff4500","#ff6600","#ff8800","#ffaa00"][Math.floor(Math.random()*4)],l="fire";break;case"lightning":c=["#00ffff","#ffffff","#88ffff","#aaffff"][Math.floor(Math.random()*4)],l="lightning",u=Math.random()*6+3;break;case"sparkle":c=["#ffff00","#ffffff","#ffdd00","#ffffaa"][Math.floor(Math.random()*4)],l="sparkle",u=Math.random()*3+1;break;case"smoke":c=["#555555","#666666","#777777","#888888"][Math.floor(Math.random()*4)],l="smoke",u=Math.random()*5+3;break;case"hearts":c=["#ff0066","#ff3388","#ff6699","#ff99aa"][Math.floor(Math.random()*4)],l="heart",u=Math.random()*4+3;break;case"stars":c=["#ffff00","#ffaa00","#ffffff","#ffdd66"][Math.floor(Math.random()*4)],l="star",u=Math.random()*4+2;break;case"explosion":c=["#ff0000","#ff4400","#ff8800","#ffcc00"][Math.floor(Math.random()*4)],l="fire",u=Math.random()*6+4;break;case"ghost":c=["rgba(200,200,255,0.8)","rgba(180,180,255,0.6)","rgba(220,220,255,0.7)"][Math.floor(Math.random()*3)],l="ghost",u=Math.random()*8+5;break}ls.push({x:r,y:e,vx:Math.cos(s)*o,vy:Math.sin(s)*o-(n==="fire"||n==="smoke"?2:0),life:1,maxLife:1,size:u,color:c,type:l})}}function Zg(r){ls=ls.filter(e=>(e.x+=e.vx*r*60,e.y+=e.vy*r*60,e.life-=r*2,(e.type==="fire"||e.type==="smoke")&&(e.vy-=r*3),e.type==="ghost"&&(e.vx*=.98,e.vy*=.98),e.life>0))}function A4(){return ls.length===0?"":ls.map(r=>{const e=r.life,t=r.life*.5+.5,n=r.size*t;switch(r.type){case"fire":return`<circle cx="${r.x}" cy="${r.y}" r="${n}" fill="${r.color}" opacity="${e}" />`;case"smoke":return`<circle cx="${r.x}" cy="${r.y}" r="${n}" fill="${r.color}" opacity="${e*.6}" />`;case"sparkle":return`<polygon points="${r.x},${r.y-n} ${r.x+n*.3},${r.y-n*.3} ${r.x+n},${r.y} ${r.x+n*.3},${r.y+n*.3} ${r.x},${r.y+n} ${r.x-n*.3},${r.y+n*.3} ${r.x-n},${r.y} ${r.x-n*.3},${r.y-n*.3}" fill="${r.color}" opacity="${e}" />`;case"heart":return`<text x="${r.x}" y="${r.y}" font-size="${n*2}" fill="${r.color}" opacity="${e}" text-anchor="middle" dominant-baseline="middle">❤</text>`;case"star":return`<text x="${r.x}" y="${r.y}" font-size="${n*2}" fill="${r.color}" opacity="${e}" text-anchor="middle" dominant-baseline="middle">★</text>`;case"lightning":return`<line x1="${r.x}" y1="${r.y}" x2="${r.x+(Math.random()-.5)*n*3}" y2="${r.y+(Math.random()-.5)*n*3}" stroke="${r.color}" stroke-width="${n*.5}" opacity="${e}" />`;case"ghost":return`<ellipse cx="${r.x}" cy="${r.y}" rx="${n}" ry="${n*1.2}" fill="${r.color}" opacity="${e*.5}" />`;default:return`<circle cx="${r.x}" cy="${r.y}" r="${n}" fill="${r.color}" opacity="${e}" />`}}).join("")}let Qs=[],Yf=0;function I4(r,e){if(!er)return"";const t=Date.now(),n=(t-Yf)/1e3;Yf=t;const i=er;return Qs.length<30&&Math.random()>.7&&C4(r,e,i),Qs=Qs.filter(o=>(o.x+=o.vx*n*60,o.y+=o.vy*n*60,o.life-=n*.3,o.x<-20&&(o.x=r+10),o.x>r+20&&(o.x=-10),o.y<-20&&(o.y=e+10),o.y>e+20&&(o.y=-10),o.life>0)),Qs.map(o=>{const c=Math.min(1,o.life);switch(o.type){case"sand":return`<circle cx="${o.x}" cy="${o.y}" r="${o.size}" fill="#d4a574" opacity="${c*.6}" class="pointer-events-none" />`;case"snow":return`<circle cx="${o.x}" cy="${o.y}" r="${o.size}" fill="#ffffff" opacity="${c*.8}" class="pointer-events-none" />`;case"leaf":return`<ellipse cx="${o.x}" cy="${o.y}" rx="${o.size}" ry="${o.size*.5}" fill="#228b22" opacity="${c*.7}" transform="rotate(${o.life*360}, ${o.x}, ${o.y})" class="pointer-events-none" />`;case"star":return`<circle cx="${o.x}" cy="${o.y}" r="${o.size*.5}" fill="#ffffff" opacity="${c*(.5+Math.sin(t/200+o.x)*.3)}" class="pointer-events-none" />`;case"bubble":return`<circle cx="${o.x}" cy="${o.y}" r="${o.size}" fill="none" stroke="#4fc3f7" stroke-width="1" opacity="${c*.5}" class="pointer-events-none" />`;case"ember":return`<circle cx="${o.x}" cy="${o.y}" r="${o.size}" fill="${Math.random()>.5?"#ff5722":"#ff9800"}" opacity="${c*.8}" class="pointer-events-none" />`;case"sparkle":return`<circle cx="${o.x}" cy="${o.y}" r="${o.size*(.5+Math.sin(t/100+o.y)*.5)}" fill="#ff69b4" opacity="${c}" class="pointer-events-none" />`;case"firefly":return`<circle cx="${o.x}" cy="${o.y}" r="${o.size*(.5+Math.sin(t/150+o.x*o.y)*.5)}" fill="#90ee90" opacity="${c*.9}" class="pointer-events-none" />`;case"ray":return`<line x1="${o.x}" y1="${o.y}" x2="${o.x+o.vx*50}" y2="${o.y+o.vy*50}" stroke="#ff6347" stroke-width="${o.size*.5}" opacity="${c*.3}" class="pointer-events-none" />`;case"neon":return`<circle cx="${o.x}" cy="${o.y}" r="${o.size*(1+Math.sin(t/100)*.3)}" fill="${["#ff00ff","#00ffff","#ffff00"][Math.floor(o.x+o.y)%3]}" opacity="${c*.7}" class="pointer-events-none" />`;case"gear":return`<circle cx="${o.x}" cy="${o.y}" r="${o.size}" fill="none" stroke="#d4af37" stroke-width="2" opacity="${c*.5}" stroke-dasharray="2 2" transform="rotate(${t/20+o.x}, ${o.x}, ${o.y})" class="pointer-events-none" />`;case"autumn":return`<ellipse cx="${o.x}" cy="${o.y}" rx="${o.size}" ry="${o.size*.6}" fill="${["#daa520","#cd853f","#8b4513"][Math.floor(o.x)%3]}" opacity="${c*.7}" transform="rotate(${o.life*180}, ${o.x}, ${o.y})" class="pointer-events-none" />`;default:return""}}).join("")}function C4(r,e,t){const n=Math.floor(Math.random()*4);let i=0,s=0,o=0,c=0,l="sparkle",u=2+Math.random()*4;switch(n){case 0:i=Math.random()*r,s=-10;break;case 1:i=r+10,s=Math.random()*e;break;case 2:i=Math.random()*r,s=e+10;break;case 3:i=-10,s=Math.random()*e;break}switch(t){case"theme_desert":l="sand",o=1+Math.random(),c=.2+Math.random()*.3;break;case"theme_arctic":case"theme_winter":l="snow",o=Math.random()*.5-.25,c=.5+Math.random()*.5,u=2+Math.random()*3;break;case"theme_jungle":case"theme_forest":l=t==="theme_forest"?"firefly":"leaf",o=Math.random()*.5-.25,c=.3+Math.random()*.3;break;case"theme_night":case"theme_space":l="star",o=0,c=0,i=Math.random()*r,s=Math.random()*e,u=1+Math.random()*2;break;case"theme_ocean":case"theme_underwater":l="bubble",o=Math.random()*.3-.15,c=-.3-Math.random()*.3;break;case"theme_lava":l="ember",o=Math.random()*.6-.3,c=-.5-Math.random()*.5;break;case"theme_candy":l="sparkle",o=Math.random()-.5,c=Math.random()-.5;break;case"theme_sunset":l="ray",o=.5,c=.3,i=0,s=Math.random()*e*.5;break;case"theme_neon":l="neon",o=Math.random()-.5,c=Math.random()-.5;break;case"theme_steampunk":l="gear",o=0,c=0,i=10+Math.random()*30,s=10+Math.random()*30,u=5+Math.random()*10;break;case"theme_autumn":l="autumn",o=.3+Math.random()*.3,c=.4+Math.random()*.3;break;default:return}Qs.push({x:i,y:s,vx:o,vy:c,size:u,life:1+Math.random()*2,type:l})}let _a="en",xi=!1,yc=!1,fn=!1,Gr=10,Vr=0,Dr=0,Ki=null,Xu=0,ed=0;const Zf=10;let Qn=!0,K=!1,Ft=.8,jt=.5,un=.8,Pr="epic",V=null,it=null,Yn=0,Kn="classic",Zn="normal",Li=!0,Bs=!0,yr=!1,_i=!1,Ei=!1,Wt=!1,$r="medium",Ks=!1,wt={gamesPlayed:0,gamesWon:0,moveWeights:{},captureSuccess:{},threatAvoidance:1,aggressionLevel:1};function S4(){try{const r=localStorage.getItem("warChessBotLearning");r&&(wt=JSON.parse(r))}catch{console.log("Could not load bot learning data")}}function Jg(){try{localStorage.setItem("warChessBotLearning",JSON.stringify(wt))}catch{console.log("Could not save bot learning data")}}function Xg(r){wt.gamesPlayed++,r?(wt.gamesWon++,wt.aggressionLevel=Math.min(2,wt.aggressionLevel+.05)):(wt.threatAvoidance=Math.min(2,wt.threatAvoidance+.1),wt.aggressionLevel=Math.max(.5,wt.aggressionLevel-.05)),Jg()}function R4(r,e){const t=`${r}:${e}`;return wt.moveWeights[t]||1}function e0(r,e,t){const n=`${r}:${e}`,i=wt.moveWeights[n]||1;wt.moveWeights[n]=Math.min(2,i+.02)}let la=!1;function P4(){if(er){const r=Pe.find(e=>e.id===er&&e.colors);if(r?.colors)return{light:r.colors.light,dark:r.colors.dark}}switch(Kn){case"dark":return{light:"#4a5568",dark:"#2d3748"};case"light":return{light:"#e2e8f0",dark:"#cbd5e0"};case"wood":return{light:"#d4a574",dark:"#8b6914"};default:return{light:"#86a876",dark:"#d4c87a"}}}function L4(r){if(Vt())return xt(r).primary;if(gr){const t=Pe.find(n=>n.id===gr&&n.pieceColor);if(t?.pieceColor)return r==="yellow"?t.pieceColor.yellow:t.pieceColor.green}return yr?r==="yellow"?"#f97316":"#3b82f6":r==="yellow"?"#eab308":"#22c55e"}function M4(){switch(Zn){case"fast":return 150;case"slow":return 500;default:return 250}}function Ar(){switch(Zn){case"fast":return .5;case"slow":return 2;default:return 1}}function No(){if(!Li)return;const r=document.getElementById("app");r&&(r.classList.add("shake"),setTimeout(()=>r.classList.remove("shake"),300))}function cs(r,e){const t=X.indexOf(r),n=He-e;return{x:Mt+t*J+J/2,y:n*J+J/2}}function V4(r,e,t,n){const i=cs(r,e),s=cs(t,n),o=[];for(let l=0;l<12;l++){const u=Math.PI*2*l/12+Math.random()*.5,f=2+Math.random()*4;o.push({x:s.x,y:s.y,vx:Math.cos(u)*f,vy:Math.sin(u)*f,life:1})}const c=[];for(let l=0;l<5;l++)c.push({x:s.x+(Math.random()-.5)*15,y:s.y+(Math.random()-.5)*10,size:8+Math.random()*12,opacity:.7,vy:-.5-Math.random()*1.5});ro.push({x:i.x+5,y:i.y-5,vx:3+Math.random()*2,vy:-4-Math.random()*2,rotation:0,rotationSpeed:15+Math.random()*10,life:1}),se={shooterCol:r,shooterRow:e,targetCol:t,targetRow:n,phase:"muzzleFlash",progress:0,bulletTrailPoints:[],sparks:o,smokeParticles:c},D4()}function D4(){if(!se)return;const r=Ar(),e={muzzleFlash:80*r,bulletTravel:150*r,impact:100*r,smoke:400*r},t=cs(se.shooterCol,se.shooterRow),n=cs(se.targetCol,se.targetRow);function i(){if(se){switch(se.phase){case"muzzleFlash":se.progress+=1/(e.muzzleFlash/16),se.progress>=1&&(se.phase="bulletTravel",se.progress=0);break;case"bulletTravel":se.progress+=1/(e.bulletTravel/16);const s=t.x+(n.x-t.x)*se.progress,o=t.y+(n.y-t.y)*se.progress;se.bulletTrailPoints.push({x:s,y:o,opacity:1}),se.bulletTrailPoints.forEach(c=>c.opacity*=.85),se.bulletTrailPoints=se.bulletTrailPoints.filter(c=>c.opacity>.1),se.progress>=1&&(se.phase="impact",se.progress=0,No());break;case"impact":se.progress+=1/(e.impact/16),se.sparks.forEach(c=>{c.x+=c.vx,c.y+=c.vy,c.vy+=.3,c.life-=.05}),se.sparks=se.sparks.filter(c=>c.life>0),se.progress>=1&&(se.phase="smoke",se.progress=0);break;case"smoke":if(se.progress+=1/(e.smoke/16),se.smokeParticles.forEach(c=>{c.y+=c.vy,c.size*=1.02,c.opacity-=.02}),se.smokeParticles=se.smokeParticles.filter(c=>c.opacity>0),se.progress>=1||se.smokeParticles.length===0){se=null,M();return}break}ro.forEach(s=>{s.x+=s.vx,s.y+=s.vy,s.vy+=.5,s.rotation+=s.rotationSpeed,s.life-=.02}),ro=ro.filter(s=>s.life>0),M(),se&&requestAnimationFrame(i)}}requestAnimationFrame(i)}let ne=0,$=null;async function Yi(){$||($=new AudioContext),$.state==="suspended"&&await $.resume()}async function t0(){await Yi(),$&&$.state==="suspended"&&await $.resume()}async function Ni(){if(await t0(),!$||it)return;V=$.createGain(),V.gain.value=.12*jt*Ft,V.connect($.destination),ne=0,Yn=0;const r=N4(),e=!!Mr;switch(r){case"ambient":e?Z4():O4();break;case"lofi":j4();break;case"tension":F4();break;case"jazz":H4();break;case"electronic":e?W4():z4();break;case"orchestral":e?Q4():q4();break;case"retro":case"chiptune":e?K4():G4();break;case"rock":U4();break;case"epic":e?Y4():Jf();break;default:Jf();break}}function N4(){if(Mr){const r=Pe.find(e=>e.id===Mr);if(r?.packId)return r.packId}return Pr}function B4(){if(hn){const r=Pe.find(e=>e.id===hn);if(r?.packId)return r.packId}return null}function O4(){if(!$||!V)return;const r={C2:65.41,D2:73.42,E2:82.41,F2:87.31,G2:98,A2:110,B2:123.47,C3:130.81,D3:146.83,E3:164.81,F3:174.61,G3:196,A3:220,B3:246.94,C4:261.63,D4:293.66,E4:329.63,F4:349.23,G4:392,A4:440,B4:493.88,C5:523.25,D5:587.33,E5:659.25,F5:698.46,G5:783.99,A5:880};function e(){const d=$.createConvolver(),h=$.sampleRate,p=h*2.5,g=$.createBuffer(2,p,h);for(let w=0;w<2;w++){const b=g.getChannelData(w);for(let P=0;P<p;P++)b[P]=(Math.random()*2-1)*Math.pow(1-P/p,2.5)}return d.buffer=g,d}const t=e(),n=$.createGain();n.gain.value=.3,t.connect(n),n.connect(V);function i(d,h,p,g=.8){if(!$||!K||!V)return;const w=$.createGain(),b=$.createBiquadFilter();b.type="lowpass",b.frequency.value=4e3+g*2e3,b.Q.value=.5;const P=[1,2,3,4,5,6],z=[1,.5,.25,.15,.08,.04];P.forEach((G,j)=>{const te=$.createOscillator(),O=$.createGain();te.type=j===0?"triangle":"sine",te.frequency.value=d*G,G>1&&(te.detune.value=G*.5),O.gain.value=z[j]*g*.02,te.connect(O),O.connect(b),te.start(h),te.stop(h+p+.5)}),w.gain.setValueAtTime(.001,h),w.gain.linearRampToValueAtTime(g*.15,h+.008),w.gain.exponentialRampToValueAtTime(g*.08,h+.1),w.gain.exponentialRampToValueAtTime(.001,h+p),b.connect(w),w.connect(V),w.connect(t)}function s(d,h,p){!$||!K||!V||d.forEach((g,w)=>{const b=$.createOscillator(),P=$.createOscillator(),z=$.createGain(),G=$.createBiquadFilter();b.type="sawtooth",P.type="sawtooth",b.frequency.value=g,P.frequency.value=g*1.003,G.type="lowpass",G.frequency.value=800,G.Q.value=.7,z.gain.setValueAtTime(.001,h+w*.1),z.gain.linearRampToValueAtTime(.012,h+w*.1+1.5),z.gain.setValueAtTime(.01,h+p-2),z.gain.linearRampToValueAtTime(.001,h+p),b.connect(G),P.connect(G),G.connect(z),z.connect(V),z.connect(t),b.start(h+w*.1),P.start(h+w*.1),b.stop(h+p+.5),P.stop(h+p+.5)})}const o=[{note:"E4",time:0,dur:1.5},{note:"G4",time:1.5,dur:.5},{note:"A4",time:2,dur:2},{note:"G4",time:4,dur:1},{note:"E4",time:5,dur:1},{note:"D4",time:6,dur:2},{note:"C4",time:8,dur:1.5},{note:"D4",time:9.5,dur:.5},{note:"E4",time:10,dur:2},{note:"D4",time:12,dur:1},{note:"C4",time:13,dur:1},{note:"B3",time:14,dur:2},{note:"C4",time:16,dur:1},{note:"E4",time:17,dur:1},{note:"G4",time:18,dur:2},{note:"A4",time:20,dur:1.5},{note:"G4",time:21.5,dur:.5},{note:"E4",time:22,dur:2},{note:"F4",time:24,dur:1},{note:"E4",time:25,dur:1},{note:"D4",time:26,dur:2},{note:"E4",time:28,dur:2},{note:"C4",time:30,dur:2},{note:"G4",time:32,dur:1},{note:"A4",time:33,dur:1},{note:"C5",time:34,dur:2},{note:"B4",time:36,dur:1},{note:"A4",time:37,dur:1},{note:"G4",time:38,dur:2},{note:"A4",time:40,dur:1.5},{note:"G4",time:41.5,dur:.5},{note:"E4",time:42,dur:2},{note:"D4",time:44,dur:2},{note:"E4",time:46,dur:2},{note:"C4",time:48,dur:1},{note:"D4",time:49,dur:1},{note:"E4",time:50,dur:2},{note:"G4",time:52,dur:1},{note:"F4",time:53,dur:1},{note:"E4",time:54,dur:2},{note:"D4",time:56,dur:1.5},{note:"E4",time:57.5,dur:.5},{note:"C4",time:58,dur:2},{note:"C4",time:60,dur:4}],c=[{note:"C2",time:0},{note:"G2",time:2},{note:"A2",time:4},{note:"E2",time:6},{note:"F2",time:8},{note:"C3",time:10},{note:"G2",time:12},{note:"D2",time:14}],l=[{chords:["C3","E3","G3"],time:0},{chords:["A2","C3","E3"],time:8},{chords:["F2","A2","C3"],time:16},{chords:["G2","B2","D3"],time:24},{chords:["E2","G2","B2"],time:32},{chords:["A2","C3","E3"],time:40},{chords:["D2","F2","A2"],time:48},{chords:["G2","B2","D3"],time:56}],u=64;function f(){if(!$||!K)return;const d=$.currentTime;o.forEach(h=>{const p=r[h.note];if(p){const g=.6+Math.random()*.2;i(p,d+h.time*.5,h.dur*.5,g)}});for(let h=0;h<8;h++)c.forEach(p=>{const g=r[p.note];g&&i(g,d+(h*8+p.time)*.5,1.5,.5)});l.forEach(h=>{const p=h.chords.map(g=>r[g]).filter(g=>g);s(p,d+h.time*.5,8*.5)})}f(),it=window.setInterval(()=>{if(!K){dt();return}ne++,f()},u*500)}function F4(){if(!$||!V)return;const r={C2:65.41,C3:130.81,Db3:138.59,D3:146.83,Gb3:185,Ab3:207.65,A3:220,C4:261.63};function e(){if(!$||!K||!V)return;const l=$.currentTime,u=$.createOscillator(),f=$.createGain(),d=$.createBiquadFilter();u.type="sawtooth",u.frequency.value=r.C2,d.type="lowpass",d.frequency.setValueAtTime(80,l),d.frequency.linearRampToValueAtTime(150,l+2),d.frequency.linearRampToValueAtTime(60,l+3.8),d.Q.value=2,f.gain.setValueAtTime(.001,l),f.gain.linearRampToValueAtTime(.1,l+.8),f.gain.setValueAtTime(.08,l+3),f.gain.linearRampToValueAtTime(.001,l+4),u.connect(d),d.connect(f),f.connect(V),u.start(l),u.stop(l+4.2);const h=$.createOscillator(),p=$.createGain();h.type="sine",h.frequency.value=r.C2*1.01,p.gain.setValueAtTime(.001,l+.3),p.gain.linearRampToValueAtTime(.04,l+1),p.gain.linearRampToValueAtTime(.001,l+3.8),h.connect(p),p.connect(V),h.start(l+.3),h.stop(l+4)}function t(){if(!$||!K||!V)return;const l=$.currentTime;[0,.15,1,1.15].forEach((f,d)=>{const h=$.createOscillator(),p=$.createGain(),g=d%2===0;h.type="sine",h.frequency.setValueAtTime(g?50:40,l+f),h.frequency.exponentialRampToValueAtTime(g?30:25,l+f+.12),p.gain.setValueAtTime(g?.25:.15,l+f),p.gain.exponentialRampToValueAtTime(.001,l+f+.2),h.connect(p),p.connect(V),h.start(l+f),h.stop(l+f+.25)})}function n(){if(!$||!K||!V)return;const l=$.currentTime;for(let u=0;u<4;u++){const f=$.createOscillator(),d=$.createGain();f.type="sine",f.frequency.value=u%2===0?1200:900,d.gain.setValueAtTime(.08,l+u*.5),d.gain.exponentialRampToValueAtTime(.001,l+u*.5+.03),f.connect(d),d.connect(V),f.start(l+u*.5),f.stop(l+u*.5+.05)}}function i(){if(!$||!K||!V)return;const l=$.currentTime,u=$.createOscillator(),f=$.createGain(),d=$.createBiquadFilter();u.type="sawtooth",u.frequency.setValueAtTime(r.C3,l),u.frequency.exponentialRampToValueAtTime(r.C4,l+3),d.type="lowpass",d.frequency.setValueAtTime(200,l),d.frequency.linearRampToValueAtTime(800,l+2.5),d.Q.value=3,f.gain.setValueAtTime(.001,l),f.gain.linearRampToValueAtTime(.05,l+1),f.gain.linearRampToValueAtTime(.08,l+2.5),f.gain.linearRampToValueAtTime(.001,l+3),u.connect(d),d.connect(f),f.connect(V),u.start(l),u.stop(l+3.2)}function s(){if(!$||!K||!V)return;const l=$.currentTime;[r.C3,r.Db3,r.D3,r.Gb3,r.Ab3].forEach((f,d)=>{const h=$.createOscillator(),p=$.createGain(),g=$.createBiquadFilter();h.type="triangle",h.frequency.value=f,g.type="lowpass",g.frequency.value=600,p.gain.setValueAtTime(.001,l+d*.02),p.gain.linearRampToValueAtTime(.04,l+d*.02+.05),p.gain.linearRampToValueAtTime(.001,l+2),h.connect(g),g.connect(p),p.connect(V),h.start(l+d*.02),h.stop(l+2.2)})}function o(){if(!$||!K||!V)return;const l=$.currentTime,u=$.createOscillator(),f=$.createGain(),d=$.createOscillator(),h=$.createGain();u.type="sawtooth",u.frequency.value=r.A3,d.type="sine",d.frequency.value=8,h.gain.value=.015,d.connect(h),h.connect(f.gain),f.gain.setValueAtTime(.001,l),f.gain.linearRampToValueAtTime(.03,l+.3),f.gain.setValueAtTime(.03,l+1.5),f.gain.linearRampToValueAtTime(.001,l+2),u.connect(f),f.connect(V),d.start(l),u.start(l),d.stop(l+2.1),u.stop(l+2.1)}e(),t(),n(),it=window.setInterval(()=>{if(!K){dt();return}ne++,t(),ne%2===0&&n(),ne%2===0&&e(),ne%4===2&&i(),ne%3===0&&o(),ne%8===7&&s()},2e3)}function z4(){if(!$||!V)return;const r={E2:82.41,G2:98,A2:110,C3:130.81,D3:146.83,E3:164.81,G3:196,A3:220,C4:261.63,D4:293.66,E4:329.63,G4:392,A4:440,C5:523.25,E5:659.25};function e(){if(!$||!K||!V)return;const u=$.currentTime,f=[[r.A2,r.A2,r.C3,r.D3,r.A2,r.E3,r.D3,r.C3],[r.A2,r.C3,r.A2,r.G2,r.A2,r.D3,r.C3,r.A2],[r.A2,r.A2,r.A2,r.G2,r.E2,r.G2,r.A2,r.C3]];f[ne%f.length].forEach((h,p)=>{const g=$.createOscillator(),w=$.createGain(),b=$.createBiquadFilter();g.type="sawtooth",g.frequency.value=h,b.type="lowpass",b.Q.value=15,b.frequency.setValueAtTime(2e3,u+p*.125),b.frequency.exponentialRampToValueAtTime(300,u+p*.125+.08),b.frequency.exponentialRampToValueAtTime(800,u+p*.125+.12),w.gain.setValueAtTime(.12,u+p*.125),w.gain.exponentialRampToValueAtTime(.001,u+p*.125+.12),g.connect(b),b.connect(w),w.connect(V),g.start(u+p*.125),g.stop(u+p*.125+.15)})}function t(){if(!$||!K||!V)return;const u=$.currentTime;for(let f=0;f<4;f++){const d=$.createOscillator(),h=$.createGain();d.type="sine",d.frequency.setValueAtTime(150,u+f*.25),d.frequency.exponentialRampToValueAtTime(35,u+f*.25+.1),h.gain.setValueAtTime(.35,u+f*.25),h.gain.exponentialRampToValueAtTime(.001,u+f*.25+.2),d.connect(h),h.connect(V),d.start(u+f*.25),d.stop(u+f*.25+.25);const p=$.createOscillator(),g=$.createGain(),w=$.createBiquadFilter();p.type="triangle",p.frequency.value=1500,w.type="highpass",w.frequency.value=800,g.gain.setValueAtTime(.15,u+f*.25),g.gain.exponentialRampToValueAtTime(.001,u+f*.25+.02),p.connect(w),w.connect(g),g.connect(V),p.start(u+f*.25),p.stop(u+f*.25+.03)}}function n(){if(!$||!K||!V)return;const u=$.currentTime;for(let f=0;f<8;f++){const d=f===2||f===6,h=$.createBufferSource(),p=$.createGain(),g=$.createBiquadFilter();h.buffer=qe(d?.15:.03),g.type="highpass",g.frequency.value=d?6e3:9e3,p.gain.setValueAtTime(d?.06:.1,u+f*.125),p.gain.exponentialRampToValueAtTime(.001,u+f*.125+(d?.12:.03)),h.connect(g),g.connect(p),p.connect(V),h.start(u+f*.125),h.stop(u+f*.125+(d?.15:.05))}}function i(){if(!$||!K||!V)return;const u=$.currentTime;[.25,.75].forEach(f=>{for(let d=0;d<3;d++){const h=$.createBufferSource(),p=$.createGain(),g=$.createBiquadFilter();h.buffer=qe(.08),g.type="bandpass",g.frequency.value=1500,g.Q.value=.5,p.gain.setValueAtTime(.15,u+f+d*.01),p.gain.exponentialRampToValueAtTime(.001,u+f+d*.01+.06),h.connect(g),g.connect(p),p.connect(V),h.start(u+f+d*.01),h.stop(u+f+d*.01+.08)}})}function s(){if(!$||!K||!V)return;const u=$.currentTime,f=[[r.A3,r.C4,r.E4],[r.G3,r.C4,r.E4],[r.A3,r.D4,r.E4]],d=f[ne%f.length];[0,.375,.5].forEach(p=>{d.forEach(g=>{const w=$.createOscillator(),b=$.createGain(),P=$.createBiquadFilter();w.type="sawtooth",w.frequency.value=g,P.type="lowpass",P.frequency.setValueAtTime(3e3,u+p),P.frequency.exponentialRampToValueAtTime(500,u+p+.1),b.gain.setValueAtTime(.03,u+p),b.gain.exponentialRampToValueAtTime(.001,u+p+.08),w.connect(P),P.connect(b),b.connect(V),w.start(u+p),w.stop(u+p+.12)})})}function o(){if(!$||!K||!V)return;const u=$.currentTime,f=[[r.A4,r.E4,r.C4,r.E4,r.A4,r.C5,r.A4,r.E4],[r.A4,r.C5,r.E5,r.C5,r.A4,r.E4,r.G4,r.E4]];f[ne%f.length].forEach((h,p)=>{const g=$.createOscillator(),w=$.createGain(),b=$.createBiquadFilter();g.type="square",g.frequency.value=h,b.type="lowpass",b.frequency.value=2500+Math.sin(p*.5)*1e3,w.gain.setValueAtTime(.001,u+p*.125),w.gain.linearRampToValueAtTime(.04,u+p*.125+.01),w.gain.exponentialRampToValueAtTime(.001,u+p*.125+.1),g.connect(b),b.connect(w),w.connect(V),g.start(u+p*.125),g.stop(u+p*.125+.12)})}function c(){if(!$||!K||!V)return;const u=$.currentTime,f=$.createOscillator(),d=$.createGain(),h=$.createBiquadFilter();f.type="sawtooth",f.frequency.setValueAtTime(200,u),f.frequency.exponentialRampToValueAtTime(2e3,u+2),h.type="lowpass",h.frequency.setValueAtTime(500,u),h.frequency.exponentialRampToValueAtTime(4e3,u+2),h.Q.value=5,d.gain.setValueAtTime(.001,u),d.gain.linearRampToValueAtTime(.08,u+1.8),d.gain.linearRampToValueAtTime(.001,u+2),f.connect(h),h.connect(d),d.connect(V),f.start(u),f.stop(u+2.2)}t(),e(),n(),it=window.setInterval(()=>{if(!K){dt();return}ne++,t(),n(),e(),ne%2===0&&i(),ne%2===1&&s(),ne%4===0&&o(),ne%8===6&&c()},1e3)}function q4(){if(!$||!V)return;const r={G2:98,C3:130.81,D3:146.83,E3:164.81,Fs3:185,G3:196,A3:220,B3:246.94,C4:261.63,D4:293.66,E4:329.63,Fs4:369.99,G4:392,A4:440,B4:493.88,D5:587.33};function e(){if(!$||!K||!V)return;const l=$.currentTime,u=[[r.G4,r.A4,r.B4,r.D5,r.B4,r.A4,r.G4,r.Fs4],[r.E4,r.Fs4,r.G4,r.A4,r.G4,r.Fs4,r.E4,r.D4],[r.D4,r.E4,r.Fs4,r.G4,r.A4,r.B4,r.A4,r.G4],[r.B4,r.A4,r.G4,r.Fs4,r.E4,r.D4,r.E4,r.G4]];u[ne%u.length].forEach((d,h)=>{const p=$.createOscillator(),g=$.createOscillator(),w=$.createGain(),b=$.createBiquadFilter();p.type="sawtooth",p.frequency.value=d,g.type="sawtooth",g.frequency.value=d*1.002,b.type="lowpass",b.frequency.value=3e3,b.Q.value=1;const P=l+h*.25;w.gain.setValueAtTime(.001,P),w.gain.linearRampToValueAtTime(.05,P+.03),w.gain.setValueAtTime(.04,P+.15),w.gain.linearRampToValueAtTime(.001,P+.23),p.connect(b),g.connect(b),b.connect(w),w.connect(V),p.start(P),g.start(P),p.stop(P+.25),g.stop(P+.25)})}function t(){if(!$||!K||!V)return;const l=$.currentTime,u=[r.G2,r.D3,r.E3,r.C3],f=u[ne%u.length],d=$.createOscillator(),h=$.createOscillator(),p=$.createGain(),g=$.createBiquadFilter();d.type="sawtooth",d.frequency.value=f,h.type="triangle",h.frequency.value=f,g.type="lowpass",g.frequency.value=800,g.Q.value=.5,p.gain.setValueAtTime(.001,l),p.gain.linearRampToValueAtTime(.08,l+.1),p.gain.setValueAtTime(.06,l+1.5),p.gain.linearRampToValueAtTime(.001,l+2),d.connect(g),h.connect(g),g.connect(p),p.connect(V),d.start(l),h.start(l),d.stop(l+2.1),h.stop(l+2.1)}function n(){if(!$||!K||!V)return;const l=$.currentTime;[r.G3,r.B3,r.D4,r.G4].forEach((f,d)=>{const h=$.createOscillator(),p=$.createOscillator(),g=$.createGain(),w=$.createBiquadFilter();h.type="sine",h.frequency.value=f,p.type="sine",p.frequency.value=f*2,w.type="lowpass",w.frequency.value=1200;const b=l+d*.3;g.gain.setValueAtTime(.001,b),g.gain.linearRampToValueAtTime(.06,b+.05),g.gain.setValueAtTime(.05,b+.4),g.gain.linearRampToValueAtTime(.001,b+.5),h.connect(w),p.connect(w),w.connect(g),g.connect(V),h.start(b),p.start(b),h.stop(b+.55),p.stop(b+.55)})}function i(){if(!$||!K||!V)return;const l=$.currentTime;for(let u=0;u<8;u++){const f=$.createOscillator(),d=$.createGain();f.type="sine",f.frequency.setValueAtTime(80,l+u*.08),f.frequency.exponentialRampToValueAtTime(60,l+u*.08+.1),d.gain.setValueAtTime(.15+u*.02,l+u*.08),d.gain.exponentialRampToValueAtTime(.001,l+u*.08+.12),f.connect(d),d.connect(V),f.start(l+u*.08),f.stop(l+u*.08+.15)}}function s(){if(!$||!K||!V)return;const l=$.currentTime;[r.G3,r.A3,r.B3,r.C4,r.D4,r.E4,r.Fs4,r.G4,r.A4,r.B4].forEach((f,d)=>{const h=$.createOscillator(),p=$.createGain();h.type="sine",h.frequency.value=f;const g=l+d*.08;p.gain.setValueAtTime(.001,g),p.gain.linearRampToValueAtTime(.04,g+.01),p.gain.exponentialRampToValueAtTime(.001,g+.6),h.connect(p),p.connect(V),h.start(g),h.stop(g+.7)})}function o(){if(!$||!K||!V)return;const l=$.currentTime,u=[[r.G3,r.B3,r.D4,r.G4],[r.E3,r.G3,r.B3,r.E4],[r.C3,r.E3,r.G3,r.C4],[r.D3,r.Fs3,r.A3,r.D4]];u[ne%u.length].forEach((d,h)=>{const p=$.createOscillator(),g=$.createOscillator(),w=$.createGain(),b=$.createBiquadFilter();p.type="sawtooth",p.frequency.value=d,g.type="sawtooth",g.frequency.value=d*1.003,b.type="lowpass",b.frequency.setValueAtTime(500,l),b.frequency.linearRampToValueAtTime(1200,l+1),b.frequency.linearRampToValueAtTime(600,l+3),w.gain.setValueAtTime(.001,l+h*.1),w.gain.linearRampToValueAtTime(.03,l+h*.1+.5),w.gain.setValueAtTime(.025,l+3),w.gain.linearRampToValueAtTime(.001,l+4),p.connect(b),g.connect(b),b.connect(w),w.connect(V),p.start(l+h*.1),g.start(l+h*.1),p.stop(l+4.2),g.stop(l+4.2)})}o(),t(),it=window.setInterval(()=>{if(!K){dt();return}ne++,e(),t(),ne%2===0&&o(),ne%4===3&&n(),ne%8===7&&i(),ne%6===5&&s()},2e3)}function G4(){if(!$||!V)return;const r={C3:130.81,G3:196,A3:220,C4:261.63,D4:293.66,E4:329.63,G4:392,A4:440,C5:523.25,E5:659.25,G5:783.99};function e(){if(!$||!K||!V)return;const l=$.currentTime,u=[[r.C4,r.E4,r.G4,r.E4,r.C4,r.D4,r.E4,r.G4],[r.A4,r.G4,r.E4,r.D4,r.C4,r.E4,r.G4,r.A4],[r.G4,r.A4,r.C5,r.A4,r.G4,r.E4,r.D4,r.E4],[r.E4,r.G4,r.A4,r.G4,r.E4,r.D4,r.C4,r.D4]];u[ne%u.length].forEach((d,h)=>{const p=$.createOscillator(),g=$.createGain();p.type="square",p.frequency.value=d;const w=l+h*.125;g.gain.setValueAtTime(.08,w),g.gain.setValueAtTime(.06,w+.02),g.gain.setValueAtTime(.001,w+.12),p.connect(g),g.connect(V),p.start(w),p.stop(w+.13)})}function t(){if(!$||!K||!V)return;const l=$.currentTime;[r.C3,r.C3,r.G3,r.G3,r.A3,r.A3,r.G3,0].forEach((f,d)=>{if(f===0)return;const h=$.createOscillator(),p=$.createGain();h.type="triangle",h.frequency.value=f;const g=l+d*.125;p.gain.setValueAtTime(.12,g),p.gain.setValueAtTime(.001,g+.12),h.connect(p),p.connect(V),h.start(g),h.stop(g+.13)})}function n(){if(!$||!K||!V)return;const l=$.currentTime;for(let u=0;u<8;u++){const f=u%2===0,d=l+u*.125;if(f){const h=$.createOscillator(),p=$.createGain();h.type="square",h.frequency.setValueAtTime(150,d),h.frequency.exponentialRampToValueAtTime(50,d+.05),p.gain.setValueAtTime(.15,d),p.gain.exponentialRampToValueAtTime(.001,d+.08),h.connect(p),p.connect(V),h.start(d),h.stop(d+.1)}else{const h=$.createBufferSource(),p=$.createGain(),g=$.createBiquadFilter();h.buffer=qe(.06),g.type="highpass",g.frequency.value=4e3,p.gain.setValueAtTime(.1,d),p.gain.exponentialRampToValueAtTime(.001,d+.05),h.connect(g),g.connect(p),p.connect(V),h.start(d),h.stop(d+.07)}}}function i(){if(!$||!K||!V)return;const l=$.currentTime,u=[[r.C4,r.E4,r.G4],[r.A3,r.C4,r.E4],[r.G3,r.C4,r.E4],[r.G3,r.D4,r.G4]],f=u[ne%u.length];for(let d=0;d<8;d++)f.forEach((h,p)=>{const g=$.createOscillator(),w=$.createGain();g.type="square",g.frequency.value=h;const b=l+d*.125+p*.04;w.gain.setValueAtTime(.04,b),w.gain.setValueAtTime(.001,b+.035),g.connect(w),w.connect(V),g.start(b),g.stop(b+.04)})}function s(){if(!$||!K||!V)return;const l=$.currentTime;[r.C4,r.E4,r.G4,r.C5,r.E5,r.G5].forEach((f,d)=>{const h=$.createOscillator(),p=$.createGain();h.type="square",h.frequency.value=f;const g=l+d*.08;p.gain.setValueAtTime(.06,g),p.gain.exponentialRampToValueAtTime(.001,g+.15),h.connect(p),p.connect(V),h.start(g),h.stop(g+.18)})}function o(){if(!$||!K||!V)return;const l=$.currentTime,u=[[r.C4,r.G4],[r.A3,r.E4],[r.G3,r.D4],[r.G3,r.E4]];u[ne%u.length].forEach(d=>{const h=$.createOscillator(),p=$.createGain();h.type="square",h.frequency.value=d,p.gain.setValueAtTime(.001,l),p.gain.linearRampToValueAtTime(.04,l+.1),p.gain.setValueAtTime(.03,l+.8),p.gain.linearRampToValueAtTime(.001,l+1),h.connect(p),p.connect(V),h.start(l),h.stop(l+1.1)})}n(),t(),it=window.setInterval(()=>{if(!K){dt();return}ne++,n(),t(),e(),ne%2===0&&i(),ne%2===1&&o(),ne%8===7&&s()},1e3)}function Jf(){if(!$||!V)return;const r={D2:73.42,G2:98,A2:110,Bb2:116.54,C3:130.81,D3:146.83,E3:164.81,F3:174.61,G3:196,A3:220,D4:293.66};function e(l){if(!$||!K||!V)return;const u=$.currentTime,f=.5,d=[[1,0,0,1,1,0,0,0],[1,0,1,0,1,1,0,0],[1,1,0,1,1,1,0,1],[1,1,1,0,1,1,1,1]];d[l%d.length].forEach((p,g)=>{if(p){const w=u+g*f/2,b=$.createOscillator(),P=$.createGain(),z=$.createBiquadFilter();b.type="sine",b.frequency.setValueAtTime(100,w),b.frequency.exponentialRampToValueAtTime(35,w+.2),z.type="lowpass",z.frequency.value=150,P.gain.setValueAtTime(.5,w),P.gain.exponentialRampToValueAtTime(.001,w+.3),b.connect(z),z.connect(P),P.connect(V),b.start(w),b.stop(w+.35);const G=$.createOscillator(),j=$.createGain();G.type="triangle",G.frequency.setValueAtTime(55,w),G.frequency.exponentialRampToValueAtTime(30,w+.25),j.gain.setValueAtTime(.3,w),j.gain.exponentialRampToValueAtTime(.001,w+.4),G.connect(j),j.connect(V),G.start(w),G.stop(w+.45)}}),l>=1&&[1,3,5,7].forEach(p=>{if(Math.random()>.5){const g=u+p*f/2,w=$.createBufferSource(),b=$.createGain(),P=$.createBiquadFilter();w.buffer=qe(.1),P.type="highpass",P.frequency.value=2e3,b.gain.setValueAtTime(.15,g),b.gain.exponentialRampToValueAtTime(.001,g+.08),w.connect(P),P.connect(b),b.connect(V),w.start(g),w.stop(g+.12)}}),l>=2&&ne%4===3&&[180,150,120,90].forEach((g,w)=>{const b=u+1.5+w*.12,P=$.createOscillator(),z=$.createGain();P.type="sine",P.frequency.setValueAtTime(g,b),P.frequency.exponentialRampToValueAtTime(g*.6,b+.15),z.gain.setValueAtTime(.25,b),z.gain.exponentialRampToValueAtTime(.001,b+.2),P.connect(z),z.connect(V),P.start(b),P.stop(b+.25)})}function t(l){if(!$||!K||!V)return;const u=$.currentTime,f=[[r.D3,r.F3,r.A3],[r.Bb2,r.D3,r.F3],[r.C3,r.E3,r.G3],[r.A2,r.C3,r.E3],[r.G2,r.Bb2,r.D3],[r.D3,r.F3,r.A3,r.D4]],d=f[l%f.length],h=4;d.forEach((p,g)=>{const w=$.createOscillator(),b=$.createOscillator(),P=$.createOscillator(),z=$.createGain(),G=$.createBiquadFilter();w.type="sawtooth",w.frequency.value=p,b.type="sawtooth",b.frequency.value=p*1.003,P.type="triangle",P.frequency.value=p*.998,G.type="lowpass",G.frequency.setValueAtTime(400,u),G.frequency.linearRampToValueAtTime(800,u+1),G.frequency.linearRampToValueAtTime(500,u+h-.5),G.Q.value=1,z.gain.setValueAtTime(.001,u),z.gain.linearRampToValueAtTime(.06,u+.8),z.gain.setValueAtTime(.05,u+h-1),z.gain.linearRampToValueAtTime(.001,u+h),w.connect(G),b.connect(G),P.connect(G),G.connect(z),z.connect(V),w.start(u+g*.05),b.start(u+g*.05),P.start(u+g*.05),w.stop(u+h+.5),b.stop(u+h+.5),P.stop(u+h+.5)})}function n(l){if(!$||!K||!V)return;const u=$.currentTime,f=(d,h,p,g)=>{const w=$.createOscillator(),b=$.createOscillator(),P=$.createOscillator(),z=$.createGain(),G=$.createBiquadFilter();w.type="sine",w.frequency.value=d,b.type="sine",b.frequency.value=d*2,P.type="sine",P.frequency.value=d*3,G.type="lowpass",G.frequency.setValueAtTime(500,h),G.frequency.linearRampToValueAtTime(900,h+.08),G.frequency.linearRampToValueAtTime(600,h+p),G.Q.value=.5,z.gain.setValueAtTime(.001,h),z.gain.linearRampToValueAtTime(g,h+.06),z.gain.setValueAtTime(g*.9,h+p*.5),z.gain.linearRampToValueAtTime(.001,h+p);const j=$.createGain(),te=$.createGain(),O=$.createGain();j.gain.value=1,te.gain.value=.3,O.gain.value=.1,w.connect(j),b.connect(te),P.connect(O),j.connect(G),te.connect(G),O.connect(G),G.connect(z),z.connect(V),w.start(h),b.start(h),P.start(h),w.stop(h+p+.1),b.stop(h+p+.1),P.stop(h+p+.1)};l==="short"?(f(r.D3,u,.4,.15),f(r.A2,u,.4,.12)):(f(r.D3,u,.5,.12),f(r.A2,u,.5,.1),f(r.D3,u+.5,.3,.14),f(r.F3,u+.8,.7,.16),f(r.D3,u+.8,.7,.12),f(r.A2,u+.8,.7,.1))}function i(l){if(!$||!K||!V)return;const u=$.currentTime,f=[r.D2,r.Bb2,r.C3,r.A2,r.G2,r.D2],d=f[l%f.length],h=$.createOscillator(),p=$.createGain();h.type="sine",h.frequency.value=d,p.gain.setValueAtTime(.001,u),p.gain.linearRampToValueAtTime(.2,u+.1),p.gain.setValueAtTime(.15,u+1.5),p.gain.linearRampToValueAtTime(.001,u+2),h.connect(p),p.connect(V),h.start(u),h.stop(u+2.1);const g=$.createOscillator(),w=$.createGain(),b=$.createBiquadFilter();g.type="sawtooth",g.frequency.value=d*2,b.type="lowpass",b.frequency.value=250,w.gain.setValueAtTime(.001,u),w.gain.linearRampToValueAtTime(.08,u+.1),w.gain.linearRampToValueAtTime(.001,u+1.8),g.connect(b),b.connect(w),w.connect(V),g.start(u),g.stop(u+2)}function s(){if(!$||!K||!V)return;const l=$.currentTime,u=$.createBufferSource(),f=$.createGain(),d=$.createBiquadFilter();u.buffer=qe(6),d.type="bandpass",d.frequency.setValueAtTime(400,l),d.frequency.linearRampToValueAtTime(800,l+3),d.frequency.linearRampToValueAtTime(300,l+5.5),d.Q.value=2,f.gain.setValueAtTime(.001,l),f.gain.linearRampToValueAtTime(.04,l+1),f.gain.setValueAtTime(.03,l+4),f.gain.linearRampToValueAtTime(.001,l+5.8),u.connect(d),d.connect(f),f.connect(V),u.start(l),u.stop(l+6)}function o(){if(!$||!K||!V)return;const l=$.currentTime,u=$.createOscillator(),f=$.createGain();u.type="sine",u.frequency.setValueAtTime(60,l),u.frequency.exponentialRampToValueAtTime(20,l+.5),f.gain.setValueAtTime(.5,l),f.gain.exponentialRampToValueAtTime(.001,l+.8),u.connect(f),f.connect(V),u.start(l),u.stop(l+.9);const d=$.createBufferSource(),h=$.createGain(),p=$.createBiquadFilter();d.buffer=qe(1.5),p.type="highpass",p.frequency.value=1e3,h.gain.setValueAtTime(.25,l),h.gain.exponentialRampToValueAtTime(.001,l+1.2),d.connect(p),p.connect(h),h.connect(V),d.start(l),d.stop(l+1.5),n("short")}s(),t(0),i(0),it=window.setInterval(()=>{if(!K){dt();return}ne++;const l=ne%16;l<4?Yn=0:l<8?Yn=1:l<12?Yn=2:Yn=3,e(Yn),ne%2===0&&t(Math.floor(ne/2)%6),i(ne%6),l===7&&n("short"),l===11&&n("epic"),l===15&&o(),ne%8===0&&s()},2e3)}function U4(){if(!$||!V)return;const r={E2:82.41,G2:98,A2:110,B2:123.47,D3:146.83,E3:164.81,G3:196,A3:220,B3:246.94,D4:293.66,E4:329.63,G4:392,A4:440,B4:493.88,D5:587.33,E5:659.25};function e(u,f,d,h=!1){if(!(!$||!K||!V))for(let p=0;p<3;p++){const g=$.createOscillator(),w=$.createGain(),b=$.createWaveShaper(),P=$.createBiquadFilter();g.type="sawtooth",g.frequency.value=u*(1+(p-1)*.005);const z=new Float32Array(256);for(let j=0;j<256;j++){const te=j/128-1;z[j]=Math.tanh(te*3)}b.curve=z,P.type="lowpass",P.frequency.value=h?800:2500,P.Q.value=2;const G=h?.03:.05;w.gain.setValueAtTime(.001,f),w.gain.linearRampToValueAtTime(G,f+.01),w.gain.setValueAtTime(G*.8,f+d*.3),w.gain.exponentialRampToValueAtTime(.001,f+d),g.connect(b),b.connect(P),P.connect(w),w.connect(V),g.start(f),g.stop(f+d+.1)}}function t(u){if(!$||!K||!V)return;const f=$.currentTime,d=.25;(u%2===0?[0,4,8,10,12]:[0,3,6,8,12,14]).forEach(p=>{const g=f+p*d,w=$.createOscillator(),b=$.createGain();w.type="sine",w.frequency.setValueAtTime(150,g),w.frequency.exponentialRampToValueAtTime(40,g+.1),b.gain.setValueAtTime(.4,g),b.gain.exponentialRampToValueAtTime(.001,g+.2),w.connect(b),b.connect(V),w.start(g),w.stop(g+.25)}),[4,12].forEach(p=>{const g=f+p*d,w=$.createBufferSource(),b=$.createGain(),P=$.createBiquadFilter();w.buffer=qe(.15),P.type="highpass",P.frequency.value=1500,b.gain.setValueAtTime(.25,g),b.gain.exponentialRampToValueAtTime(.001,g+.12),w.connect(P),P.connect(b),b.connect(V),w.start(g),w.stop(g+.2);const z=$.createOscillator(),G=$.createGain();z.type="triangle",z.frequency.value=180,G.gain.setValueAtTime(.15,g),G.gain.exponentialRampToValueAtTime(.001,g+.08),z.connect(G),G.connect(V),z.start(g),z.stop(g+.1)});for(let p=0;p<16;p+=2){const g=f+p*d,w=$.createBufferSource(),b=$.createGain(),P=$.createBiquadFilter();w.buffer=qe(.05),P.type="highpass",P.frequency.value=8e3,b.gain.setValueAtTime(.08,g),b.gain.exponentialRampToValueAtTime(.001,g+.04),w.connect(P),P.connect(b),b.connect(V),w.start(g),w.stop(g+.06)}}function n(u,f,d){if(!$||!K||!V)return;const h=$.createOscillator(),p=$.createGain(),g=$.createBiquadFilter();h.type="sawtooth",h.frequency.value=u,g.type="lowpass",g.frequency.value=400,p.gain.setValueAtTime(.001,f),p.gain.linearRampToValueAtTime(.15,f+.02),p.gain.setValueAtTime(.12,f+d*.5),p.gain.exponentialRampToValueAtTime(.001,f+d),h.connect(g),g.connect(p),p.connect(V),h.start(f),h.stop(f+d+.1)}const i=[{note:"E2",time:0,dur:.4,palm:!0},{note:"E2",time:.5,dur:.2,palm:!0},{note:"G2",time:.75,dur:.2,palm:!0},{note:"A2",time:1,dur:.4,palm:!0},{note:"E2",time:1.5,dur:.2,palm:!0},{note:"B2",time:2,dur:.4,palm:!1},{note:"A2",time:2.5,dur:.4,palm:!1},{note:"G2",time:3,dur:.8,palm:!1}],s=[{note:"E3",time:0,dur:.8,palm:!1},{note:"G3",time:1,dur:.8,palm:!1},{note:"A3",time:2,dur:.8,palm:!1},{note:"B3",time:3,dur:.8,palm:!1}],o=["E2","E2","G2","A2","E2","B2","A2","G2"];function c(u){if(!$||!K)return;const f=$.currentTime;(u?s:i).forEach(h=>{e(r[h.note],f+h.time,h.dur,h.palm)}),o.forEach((h,p)=>{n(r[h],f+p*.5,.45)}),t(ne)}c(!1),it=window.setInterval(()=>{if(!K){dt();return}ne++;const u=ne%10,f=u>=4&&u<8;if(u>=8){t(ne);const h=$.currentTime;o.forEach((p,g)=>{n(r[p],h+g*.5,.45)})}else c(f)},4e3)}function H4(){if(!$||!V)return;const r={C2:65.41,D2:73.42,E2:82.41,F2:87.31,G2:98,A2:110,Bb2:116.54,B2:123.47,C3:130.81,D3:146.83,Eb3:155.56,E3:164.81,F3:174.61,G3:196,A3:220,Bb3:233.08,B3:246.94,C4:261.63,D4:293.66,Eb4:311.13,E4:329.63,F4:349.23,G4:392,A4:440,Bb4:466.16,B4:493.88,C5:523.25,D5:587.33,Eb5:622.25,E5:659.25,F5:698.46,G5:783.99};function e(d,h,p){if(!$||!K||!V)return;for(let P=1;P<=6;P++){const z=$.createOscillator(),G=$.createGain(),j=$.createBiquadFilter(),te=$.createOscillator(),O=$.createGain();z.type=P<=2?"sawtooth":"sine",z.frequency.value=d*P,te.type="sine",te.frequency.value=5+Math.random()*.5,O.gain.value=d*.015,te.connect(O),O.connect(z.frequency),j.type="bandpass",j.frequency.value=1200+P*200,j.Q.value=2;const k=.04/(P*1.2);G.gain.setValueAtTime(.001,h),G.gain.linearRampToValueAtTime(k,h+.08),G.gain.setValueAtTime(k*.9,h+p*.7),G.gain.exponentialRampToValueAtTime(.001,h+p),z.connect(j),j.connect(G),G.connect(V),te.start(h),z.start(h),te.stop(h+p+.1),z.stop(h+p+.1)}const g=$.createBufferSource(),w=$.createGain(),b=$.createBiquadFilter();g.buffer=qe(p),b.type="bandpass",b.frequency.value=2e3,b.Q.value=1,w.gain.setValueAtTime(.008,h),w.gain.exponentialRampToValueAtTime(.001,h+p),g.connect(b),b.connect(w),w.connect(V),g.start(h),g.stop(h+p)}function t(d,h,p){if(!(!$||!K||!V))for(let g=1;g<=8;g++){const w=$.createOscillator(),b=$.createGain(),P=$.createBiquadFilter(),z=$.createOscillator(),G=$.createGain();w.type="sawtooth",w.frequency.value=d*g,z.type="sine",z.frequency.value=4,G.gain.value=d*.01,z.connect(G),G.connect(w.frequency),P.type="lowpass",P.frequency.setValueAtTime(800,h),P.frequency.linearRampToValueAtTime(3e3,h+.05),P.Q.value=1;const j=(g%2===1?.035:.02)/g;b.gain.setValueAtTime(.001,h),b.gain.linearRampToValueAtTime(j,h+.03),b.gain.setValueAtTime(j*.85,h+p*.6),b.gain.exponentialRampToValueAtTime(.001,h+p),w.connect(P),P.connect(b),b.connect(V),z.start(h),w.start(h),z.stop(h+p+.1),w.stop(h+p+.1)}}function n(d,h,p,g=.8){if(!$||!K||!V)return;const w=[1,2,3,4,6],b=[1,.5,.3,.15,.08];w.forEach((P,z)=>{const G=$.createOscillator(),j=$.createGain();G.type="sine",G.frequency.value=d*P;const te=b[z]*g*.025;j.gain.setValueAtTime(.001,h),j.gain.linearRampToValueAtTime(te,h+.005),j.gain.exponentialRampToValueAtTime(te*.6,h+.1),j.gain.exponentialRampToValueAtTime(.001,h+p),G.connect(j),j.connect(V),G.start(h),G.stop(h+p+.1)})}function i(d,h){if(!$||!K||!V)return;const p=$.createOscillator(),g=$.createGain(),w=$.createBiquadFilter();p.type="triangle",p.frequency.value=d,w.type="lowpass",w.frequency.value=500,g.gain.setValueAtTime(.001,h),g.gain.linearRampToValueAtTime(.15,h+.02),g.gain.exponentialRampToValueAtTime(.001,h+.9),p.connect(w),w.connect(g),g.connect(V),p.start(h),p.stop(h+1)}function s(){if(!$||!K||!V)return;const d=$.currentTime;[1,3].forEach(h=>{const p=$.createBufferSource(),g=$.createGain(),w=$.createBiquadFilter();p.buffer=qe(.3),w.type="bandpass",w.frequency.value=3e3,w.Q.value=.5,g.gain.setValueAtTime(.001,d+h),g.gain.linearRampToValueAtTime(.05,d+h+.1),g.gain.exponentialRampToValueAtTime(.001,d+h+.6),p.connect(w),w.connect(g),g.connect(V),p.start(d+h),p.stop(d+h+1)});for(let h=0;h<4;h++){const p=$.createOscillator(),g=$.createGain();p.type="triangle",p.frequency.value=400,g.gain.setValueAtTime(.02,d+h+.5),g.gain.exponentialRampToValueAtTime(.001,d+h+.9),p.connect(g),g.connect(V),p.start(d+h+.5),p.stop(d+h+1)}}const o=[[["D3","F3","A3","C4"],["G3","B3","D4","F4"],["C3","E3","G3","B3"],["C3","E3","G3","B3"]],[["A3","C4","E4","G4"],["D3","F3","A3","C4"],["G3","B3","D4","F4"],["G3","B3","D4","F4"]]],c=[["C2","E2","G2","A2","G2","F2","E2","D2"],["A2","C3","D3","E3","D3","C3","Bb2","A2"]],l=[["G4","A4","B4","C5","D5","C5","B4","G4"],["E4","G4","A4","C5","B4","A4","G4","E4"],["C5","D5","E5","D5","C5","A4","G4","F4"],["A4","B4","C5","E5","D5","C5","B4","A4"]];let u=0;function f(){if(!$||!K)return;const d=$.currentTime,h=o[u%o.length],p=c[u%c.length],g=l[ne%l.length];h.forEach((b,P)=>{(P===0||P===2)&&b.forEach((z,G)=>{r[z]&&n(r[z],d+P+G*.02,.8,.5)})}),p.forEach((b,P)=>{r[b]&&i(r[b],d+P*.5)});const w=ne%4<2;g.forEach((b,P)=>{if(r[b]){const z=d+.25+P*.45,G=.4;w?t(r[b],z,G):e(r[b],z,G)}}),s(),u++}f(),it=window.setInterval(()=>{if(!K){dt();return}ne++,f()},4e3)}function j4(){if(!$||!V)return;const r={C3:130.81,D3:146.83,E3:164.81,F3:174.61,G3:196,A3:220,B3:246.94,C4:261.63,D4:293.66,E4:329.63,F4:349.23,G4:392,A4:440,B4:493.88,C5:523.25,D5:587.33,E5:659.25};let e=null;function t(){if(!$||!V)return;e=$.createBufferSource();const l=$.createGain(),u=$.createBiquadFilter(),f=$.createBuffer(1,$.sampleRate*10,$.sampleRate),d=f.getChannelData(0);for(let h=0;h<d.length;h++)d[h]=Math.random()>.997?(Math.random()*2-1)*.3:0;e.buffer=f,e.loop=!0,u.type="highpass",u.frequency.value=1e3,l.gain.value=.08,e.connect(u),u.connect(l),l.connect(V),e.start()}t();function n(l,u,f){if(!$||!K||!V)return;const d=$.createOscillator(),h=$.createGain(),p=$.createBiquadFilter();d.type="sine",d.frequency.value=l,p.type="lowpass",p.frequency.value=1500,p.Q.value=.5,h.gain.setValueAtTime(.001,u),h.gain.linearRampToValueAtTime(.06,u+.02),h.gain.exponentialRampToValueAtTime(.001,u+f),d.connect(p),p.connect(h),h.connect(V),d.start(u),d.stop(u+f+.1);const g=$.createOscillator(),w=$.createGain();g.type="sine",g.frequency.value=l*2,w.gain.setValueAtTime(.001,u),w.gain.linearRampToValueAtTime(.02,u+.02),w.gain.exponentialRampToValueAtTime(.001,u+f*.7),g.connect(p),p.connect(w),w.connect(V),g.start(u),g.stop(u+f)}function i(){if(!$||!K||!V)return;const l=$.currentTime;[0,2].forEach(u=>{const f=l+u,d=$.createOscillator(),h=$.createGain(),p=$.createBiquadFilter();d.type="sine",d.frequency.setValueAtTime(80,f),d.frequency.exponentialRampToValueAtTime(40,f+.1),p.type="lowpass",p.frequency.value=200,h.gain.setValueAtTime(.25,f),h.gain.exponentialRampToValueAtTime(.001,f+.3),d.connect(p),p.connect(h),h.connect(V),d.start(f),d.stop(f+.35)}),[1,3].forEach(u=>{const f=l+u,d=$.createBufferSource(),h=$.createGain(),p=$.createBiquadFilter();d.buffer=qe(.2),p.type="bandpass",p.frequency.value=2e3,p.Q.value=.5,h.gain.setValueAtTime(.08,f),h.gain.exponentialRampToValueAtTime(.001,f+.15),d.connect(p),p.connect(h),h.connect(V),d.start(f),d.stop(f+.25)});for(let u=0;u<8;u++){const f=l+u*.5,d=$.createBufferSource(),h=$.createGain(),p=$.createBiquadFilter();d.buffer=qe(.02),p.type="highpass",p.frequency.value=7e3,h.gain.setValueAtTime(.03,f),h.gain.exponentialRampToValueAtTime(.001,f+.05),d.connect(p),p.connect(h),h.connect(V),d.start(f),d.stop(f+.1)}}const s=[["C4","E4","G4","B4"],["A3","C4","E4","G4"],["F3","A3","C4","E4"],["G3","B3","D4","F4"]],o=[["E5","D5","C5","B4"],["G4","A4","B4","C5"],["C5","B4","A4","G4"],["D5","E5","D5","C5"]];function c(){if(!$||!K)return;const l=$.currentTime;s[ne%s.length].forEach((f,d)=>{n(r[f],l+d*.1,3.5)}),ne%2===0&&o[ne%o.length].forEach((d,h)=>{n(r[d],l+.5+h*.75,.6)}),i()}c(),it=window.setInterval(()=>{if(!K){dt();return}ne++,c()},4e3)}function W4(){if(!$||!V)return;const r={E2:82.41,A2:110,B2:123.47,E3:164.81,A3:220,B3:246.94,E4:329.63,G4:392,A4:440,B4:493.88,D5:587.33,E5:659.25};function e(o,c,l){if(!(!$||!K||!V))for(let u=0;u<5;u++){const f=$.createOscillator(),d=$.createGain(),h=$.createBiquadFilter();f.type="sawtooth",f.frequency.value=o*(1+(u-2)*.01),h.type="lowpass",h.frequency.setValueAtTime(2e3,c),h.frequency.linearRampToValueAtTime(8e3,c+.1),h.frequency.linearRampToValueAtTime(2e3,c+l),h.Q.value=2,d.gain.setValueAtTime(.001,c),d.gain.linearRampToValueAtTime(.03,c+.01),d.gain.setValueAtTime(.025,c+l*.8),d.gain.exponentialRampToValueAtTime(.001,c+l),f.connect(h),h.connect(d),d.connect(V),f.start(c),f.stop(c+l+.1)}}function t(o,c,l){if(!$||!K||!V)return;const u=$.createOscillator(),f=$.createGain(),d=$.createBiquadFilter(),h=$.createOscillator(),p=$.createGain();u.type="sawtooth",u.frequency.value=o,d.type="lowpass",d.frequency.value=500,d.Q.value=10,h.type="sine",h.frequency.value=4,p.gain.value=400,h.connect(p),p.connect(d.frequency),f.gain.setValueAtTime(.15,c),f.gain.setValueAtTime(.12,c+l*.8),f.gain.exponentialRampToValueAtTime(.001,c+l),u.connect(d),d.connect(f),f.connect(V),h.start(c),u.start(c),h.stop(c+l),u.stop(c+l+.1)}function n(o){if(!$||!K||!V)return;const c=$.createOscillator(),l=$.createGain(),u=$.createOscillator(),f=$.createGain();c.type="sine",c.frequency.setValueAtTime(150,o),c.frequency.exponentialRampToValueAtTime(30,o+.15),l.gain.setValueAtTime(.5,o),l.gain.exponentialRampToValueAtTime(.001,o+.3),u.type="square",u.frequency.value=1500,f.gain.setValueAtTime(.1,o),f.gain.exponentialRampToValueAtTime(.001,o+.01),c.connect(l),l.connect(V),u.connect(f),f.connect(V),c.start(o),c.stop(o+.35),u.start(o),u.stop(o+.02)}const i=["E4","G4","A4","B4","A4","G4","E4","B3"];function s(){if(!$||!K)return;const o=$.currentTime,c=ne>=8&&ne<16,l=ne>=4&&ne<8;for(let u=0;u<4;u++)n(o+u);if(c?(t(r.E2,o,2),t(r.A2,o+2,2)):t(r.E2,o,4),(l||c)&&(i.forEach((u,f)=>{e(r[u],o+f*.25,.2)}),i.forEach((u,f)=>{e(r[u],o+2+f*.25,.2)})),ne===8){const u=$.createBufferSource(),f=$.createGain(),d=$.createBiquadFilter();u.buffer=qe(2),d.type="highpass",d.frequency.value=5e3,f.gain.setValueAtTime(.2,o),f.gain.exponentialRampToValueAtTime(.001,o+1.5),u.connect(d),d.connect(f),f.connect(V),u.start(o),u.stop(o+2)}ne>=16&&(ne=0)}s(),it=window.setInterval(()=>{if(!K){dt();return}ne++,s()},4e3)}function Q4(){if(!$||!V)return;const r={C2:65.41,G2:98,C3:130.81,E3:164.81,G3:196,C4:261.63,E4:329.63,G4:392,A4:440,C5:523.25,E5:659.25,G5:783.99};function e(c,l,u){!$||!K||!V||c.forEach((f,d)=>{for(let h=0;h<3;h++){const p=$.createOscillator(),g=$.createGain(),w=$.createOscillator(),b=$.createGain();p.type="sawtooth",p.frequency.value=f*(1+(h-1)*.002),w.type="sine",w.frequency.value=5+Math.random(),b.gain.value=f*.005,w.connect(b),b.connect(p.frequency);const P=.02/(d+1);g.gain.setValueAtTime(.001,l),g.gain.linearRampToValueAtTime(P,l+.3),g.gain.setValueAtTime(P,l+u-.3),g.gain.linearRampToValueAtTime(.001,l+u);const z=$.createBiquadFilter();z.type="lowpass",z.frequency.value=4e3,p.connect(z),z.connect(g),g.connect(V),w.start(l),p.start(l),w.stop(l+u),p.stop(l+u+.1)}})}function t(c,l,u){if(!(!$||!K||!V))for(let f=1;f<=4;f++){const d=$.createOscillator(),h=$.createGain();d.type="sawtooth",d.frequency.value=c*f;const p=.04/(f*f);h.gain.setValueAtTime(.001,l),h.gain.linearRampToValueAtTime(p,l+.05),h.gain.setValueAtTime(p*.9,l+u*.5),h.gain.exponentialRampToValueAtTime(.001,l+u);const g=$.createBiquadFilter();g.type="lowpass",g.frequency.value=2e3+f*500,d.connect(g),g.connect(h),h.connect(V),d.start(l),d.stop(l+u+.1)}}function n(c,l){if(!$||!K||!V)return;const u=$.createOscillator(),f=$.createGain(),d=$.createBiquadFilter();u.type="sine",u.frequency.setValueAtTime(c,l),u.frequency.exponentialRampToValueAtTime(c*.8,l+.5),d.type="lowpass",d.frequency.value=300,f.gain.setValueAtTime(.3,l),f.gain.exponentialRampToValueAtTime(.001,l+1),u.connect(d),d.connect(f),f.connect(V),u.start(l),u.stop(l+1.2)}function i(c,l){if(!$||!K||!V)return;["C4","E4","G4","C5","E5","G5"].forEach((f,d)=>{const h=$.createOscillator(),p=$.createGain();h.type="triangle",h.frequency.value=r[f];const g=c+d*.08;p.gain.setValueAtTime(.001,g),p.gain.linearRampToValueAtTime(.04,g+.01),p.gain.exponentialRampToValueAtTime(.001,g+.8),h.connect(p),p.connect(V),h.start(g),h.stop(g+1)})}const s=[{strings:[[r.C3,r.E3,r.G3,r.C4]],brass:!1,timpani:"C2"},{strings:[[r.G2,r.C3,r.E3,r.G3]],brass:!1,timpani:null},{strings:[[r.C3,r.E3,r.G3],[r.E3,r.G3,r.C4]],brass:!0,timpani:"G2"},{strings:[[r.G2,r.C3,r.E3]],brass:!0,timpani:"C2"}];function o(){if(!$||!K)return;const c=$.currentTime,l=s[ne%s.length];l.strings.forEach((u,f)=>{e(u,c+f*2,4)}),l.timpani&&(n(r[l.timpani],c),n(r[l.timpani],c+3)),l.brass&&ne%2===0&&(t(r.C4,c+1,1),t(r.G4,c+1,1),t(r.E4,c+2,1.5)),ne%4===3&&i(c+3)}o(),it=window.setInterval(()=>{if(!K){dt();return}ne++,o()},4e3)}function K4(){if(!$||!V)return;const r={C3:130.81,D3:146.83,E3:164.81,F3:174.61,G3:196,A3:220,B3:246.94,C4:261.63,D4:293.66,E4:329.63,F4:349.23,G4:392,A4:440,B4:493.88,C5:523.25,D5:587.33,E5:659.25,F5:698.46,G5:783.99};function e(l,u,f,d=!1){if(!$||!K||!V)return;const h=$.createOscillator(),p=$.createGain();h.type="square",h.frequency.value=l;const g=d?.06:.04;p.gain.setValueAtTime(g,u),p.gain.setValueAtTime(g*.8,u+f*.9),p.gain.setValueAtTime(0,u+f),h.connect(p),p.connect(V),h.start(u),h.stop(u+f+.01)}function t(l,u,f){if(!$||!K||!V)return;const d=$.createOscillator(),h=$.createGain();d.type="triangle",d.frequency.value=l,h.gain.setValueAtTime(.12,u),h.gain.setValueAtTime(.1,u+f*.8),h.gain.setValueAtTime(0,u+f),d.connect(h),h.connect(V),d.start(u),d.stop(u+f+.01)}function n(l,u){if(!$||!K||!V)return;const f=$.createBufferSource(),d=$.createGain(),h=$.createBiquadFilter();f.buffer=qe(.15),u?(h.type="highpass",h.frequency.value=3e3,d.gain.setValueAtTime(.15,l)):(h.type="lowpass",h.frequency.value=500,d.gain.setValueAtTime(.2,l)),d.gain.exponentialRampToValueAtTime(.001,l+.1),f.connect(h),h.connect(d),d.connect(V),f.start(l),f.stop(l+.15)}function i(l,u,f){if(!$||!K||!V)return;[0,4,7,12].forEach((h,p)=>{const g=l*Math.pow(2,h/12);e(g,u+p*f,f*.9,!0)})}const s=[["E4","E4","F4","G4","G4","F4","E4","D4"],["C4","C4","D4","E4","E4","D4","D4","rest"],["E4","E4","F4","G4","G4","F4","E4","D4"],["C4","D4","E4","C4","A3","A3","rest","rest"]],o=[["C3","G3","C3","G3"],["A3","E3","A3","E3"],["F3","C3","F3","C3"],["G3","D3","G3","D3"]];function c(){if(!$||!K)return;const l=$.currentTime,u=.25;s[ne%s.length].forEach((h,p)=>{h!=="rest"&&e(r[h],l+p*u*2,u*1.8)}),o[ne%o.length].forEach((h,p)=>{t(r[h],l+p,.9)});for(let h=0;h<4;h++)n(l+h,!1),n(l+h+.5,!0);ne%4===3&&i(r.C4,l+3.5,.06)}c(),it=window.setInterval(()=>{if(!K){dt();return}ne++,c()},4e3)}function Y4(){if(!$||!V)return;const r={C3:130.81,E3:164.81,G3:196};function e(c,l,u){!$||!K||!V||c.forEach(f=>{[700,1200,2500].forEach((h,p)=>{const g=$.createOscillator(),w=$.createGain(),b=$.createBiquadFilter();g.type="sawtooth",g.frequency.value=f,b.type="bandpass",b.frequency.value=h,b.Q.value=10;const P=.02/(p+1);w.gain.setValueAtTime(.001,l),w.gain.linearRampToValueAtTime(P,l+.5),w.gain.setValueAtTime(P,l+u-.5),w.gain.linearRampToValueAtTime(.001,l+u),g.connect(b),b.connect(w),w.connect(V),g.start(l),g.stop(l+u+.1)})})}function t(c,l){if(!$||!K||!V)return;const u=$.createOscillator(),f=$.createGain();if(u.type="sine",u.frequency.setValueAtTime(l?80:120,c),u.frequency.exponentialRampToValueAtTime(l?40:60,c+.3),f.gain.setValueAtTime(l?.4:.25,c),f.gain.exponentialRampToValueAtTime(.001,c+(l?.8:.4)),u.connect(f),f.connect(V),u.start(c),u.stop(c+1),l){const d=$.createBufferSource(),h=$.createGain();d.buffer=qe(.05),h.gain.setValueAtTime(.15,c),h.gain.exponentialRampToValueAtTime(.001,c+.05),d.connect(h),h.connect(V),d.start(c),d.stop(c+.1)}}function n(c,l,u){if(!(!$||!K||!V))for(let f=1;f<=5;f++){const d=$.createOscillator(),h=$.createGain();d.type="sawtooth",d.frequency.value=c*f;const p=.05/(f*1.5);h.gain.setValueAtTime(.001,l),h.gain.linearRampToValueAtTime(p,l+.1),h.gain.setValueAtTime(p*.9,l+u*.7),h.gain.exponentialRampToValueAtTime(.001,l+u);const g=$.createBiquadFilter();g.type="lowpass",g.frequency.value=1500,d.connect(g),g.connect(h),h.connect(V),d.start(l),d.stop(l+u+.1)}}function i(c,l){if(!$||!K||!V)return;const u=$.createOscillator(),f=$.createGain();u.type="sawtooth",u.frequency.setValueAtTime(100,c),u.frequency.exponentialRampToValueAtTime(400,c+l),f.gain.setValueAtTime(.001,c),f.gain.linearRampToValueAtTime(.08,c+l*.8),f.gain.exponentialRampToValueAtTime(.001,c+l);const d=$.createBiquadFilter();d.type="lowpass",d.frequency.setValueAtTime(500,c),d.frequency.exponentialRampToValueAtTime(3e3,c+l),u.connect(d),d.connect(f),f.connect(V),u.start(c),u.stop(c+l+.1)}const s=[{drums:[0,2],choir:[r.C3,r.G3],brass:null},{drums:[0,1,2],choir:[r.C3,r.E3,r.G3],brass:null},{drums:[0,1,2,3],choir:[r.C3,r.G3],brass:r.C3},{drums:[0,.5,1,1.5,2,2.5,3,3.5],choir:null,brass:r.G3,rise:!0}];function o(){if(!$||!K)return;const c=$.currentTime,l=s[ne%s.length];l.drums.forEach((u,f)=>{t(c+u,f===0)}),l.choir&&e(l.choir,c,4),l.brass&&n(l.brass,c+2,2),l.rise&&i(c,4)}o(),it=window.setInterval(()=>{if(!K){dt();return}ne++,o()},4e3)}function Z4(){if(!$||!V)return;const r={C2:65.41,E2:82.41,G2:98,C3:130.81,E3:164.81,G3:196,C4:261.63,E4:329.63,G4:392,C5:523.25,G5:783.99};function e(l,u,f){if(!(!$||!K||!V))for(let d=0;d<4;d++){const h=$.createOscillator(),p=$.createGain(),g=$.createBiquadFilter(),w=$.createOscillator(),b=$.createGain();h.type="sine",h.frequency.value=l*(1+(d-1.5)*.003),w.type="sine",w.frequency.value=.2+d*.1,b.gain.value=l*.005,w.connect(b),b.connect(h.frequency),g.type="lowpass",g.frequency.value=2e3,p.gain.setValueAtTime(.001,u),p.gain.linearRampToValueAtTime(.015,u+f*.3),p.gain.setValueAtTime(.015,u+f*.7),p.gain.linearRampToValueAtTime(.001,u+f),h.connect(g),g.connect(p),p.connect(V),w.start(u),h.start(u),w.stop(u+f),h.stop(u+f+.1)}}let t=null;function n(){if(!$||!V)return;t=$.createBufferSource();const l=$.createGain(),u=$.createBiquadFilter(),f=$.createOscillator(),d=$.createGain(),h=$.createBuffer(1,$.sampleRate*20,$.sampleRate),p=h.getChannelData(0);for(let g=0;g<p.length;g++)p[g]=Math.random()*2-1;t.buffer=h,t.loop=!0,u.type="bandpass",u.frequency.value=800,u.Q.value=.5,f.type="sine",f.frequency.value=.15,d.gain.value=.01,f.connect(d),d.connect(l.gain),l.gain.value=.03,t.connect(u),u.connect(l),l.connect(V),f.start(),t.start()}n();function i(l){if(!$||!K||!V)return;const u=2e3+Math.random()*2e3,f=$.createOscillator(),d=$.createGain();f.type="sine",f.frequency.setValueAtTime(u,l),f.frequency.exponentialRampToValueAtTime(u*.5,l+.1),d.gain.setValueAtTime(.02,l),d.gain.exponentialRampToValueAtTime(.001,l+.3),f.connect(d),d.connect(V),f.start(l),f.stop(l+.35)}function s(l,u){if(!(!$||!K||!V))for(let f=0;f<3;f++){const d=$.createOscillator(),h=$.createGain();d.type="sine",d.frequency.value=r.G5*(1+f*.5),h.gain.setValueAtTime(.001,l),h.gain.linearRampToValueAtTime(.005,l+u*.3),h.gain.linearRampToValueAtTime(.001,l+u),d.connect(h),h.connect(V),d.start(l+f*.3),d.stop(l+u)}}const o=[[r.C3,r.G3,r.C4,r.E4],[r.E2,r.G3,r.C4,r.G4],[r.G2,r.C3,r.E4,r.G4],[r.C2,r.E3,r.G3,r.C5]];function c(){if(!$||!K)return;const l=$.currentTime;o[ne%o.length].forEach((f,d)=>{e(f,l+d*.5,8)});for(let f=0;f<3;f++)Math.random()>.5&&i(l+Math.random()*4);ne%3===0&&s(l+2,4)}c(),it=window.setInterval(()=>{if(!K){dt();return}ne++,c()},8e3)}function dt(){it&&(clearInterval(it),it=null),ne=0,Yn=0}function qe(r){const e=$.sampleRate,t=e*r,n=$.createBuffer(1,t,e),i=n.getChannelData(0);for(let s=0;s<t;s++)i[s]=Math.random()*2-1;return n}let Un=null,De=null,Hn=null,Xf=null;function ep(r){const t=new Float32Array(44100);for(let n=0;n<44100;n++){const i=n*2/44100-1;t[n]=(3+r)*i*20*(Math.PI/180)/(Math.PI+r*Math.abs(i))}return t}function J4(){if(!$)return null;const r=B4();if(r!==Xf&&(Xf=r,Un=null,De=null,Hn=null),!Un)if(Un=$.createGain(),r){switch(De=$.createBiquadFilter(),Hn=$.createWaveShaper(),r){case"retro":De.type="lowpass",De.frequency.value=2e3,De.Q.value=2,Hn.curve=ep(20);break;case"scifi":De.type="highpass",De.frequency.value=400,De.Q.value=4;break;case"cartoon":De.type="highshelf",De.frequency.value=2e3,De.gain.value=6;break;case"war":De.type="lowshelf",De.frequency.value=200,De.gain.value=8;break;case"nature":De.type="lowpass",De.frequency.value=4e3,De.Q.value=.5;break;case"horror":De.type="bandpass",De.frequency.value=800,De.Q.value=3,Hn.curve=ep(50);break;case"medieval":De.type="peaking",De.frequency.value=1200,De.Q.value=8,De.gain.value=4;break}Un.connect(De),Hn.curve?(De.connect(Hn),Hn.connect($.destination)):De.connect($.destination)}else Un.connect($.destination);return Un.gain.value=un*Ft,Un}async function be(r){if(!Qn||(await t0(),!$))return;const e=J4();if(!e)return;const t=$.currentTime;switch(r){case"move":case"walk":{for(let n=0;n<3;n++){const i=$.createBufferSource(),s=$.createBiquadFilter(),o=$.createGain();i.buffer=qe(.08),s.type="lowpass",s.frequency.value=800,o.gain.setValueAtTime(.15,t+n*.12),o.gain.exponentialRampToValueAtTime(.001,t+n*.12+.08),i.connect(s),s.connect(o),o.connect(e),i.start(t+n*.12),i.stop(t+n*.12+.1)}break}case"engine":{const n=$.createOscillator(),i=$.createOscillator(),s=$.createGain(),o=$.createBiquadFilter();n.type="sawtooth",n.frequency.setValueAtTime(40,t),n.frequency.exponentialRampToValueAtTime(80,t+.15),n.frequency.setValueAtTime(70,t+.2),n.frequency.exponentialRampToValueAtTime(90,t+.4),i.type="square",i.frequency.setValueAtTime(20,t),i.frequency.exponentialRampToValueAtTime(40,t+.15),o.type="lowpass",o.frequency.value=300,s.gain.setValueAtTime(.001,t),s.gain.exponentialRampToValueAtTime(.25,t+.1),s.gain.setValueAtTime(.2,t+.25),s.gain.exponentialRampToValueAtTime(.001,t+.5),n.connect(o),i.connect(o),o.connect(s),s.connect(e),n.start(t),i.start(t),n.stop(t+.55),i.stop(t+.55);break}case"capture":{const n=$.createOscillator(),i=$.createBufferSource(),s=$.createGain(),o=$.createGain(),c=$.createBiquadFilter();n.type="sine",n.frequency.setValueAtTime(150,t),n.frequency.exponentialRampToValueAtTime(50,t+.15),s.gain.setValueAtTime(.3,t),s.gain.exponentialRampToValueAtTime(.001,t+.2),i.buffer=qe(.1),c.type="bandpass",c.frequency.value=1e3,c.Q.value=1,o.gain.setValueAtTime(.15,t),o.gain.exponentialRampToValueAtTime(.001,t+.1),n.connect(s),s.connect(e),i.connect(c),c.connect(o),o.connect(e),n.start(t),i.start(t),n.stop(t+.25),i.stop(t+.15);break}case"shoot":{const n=$.createBufferSource(),i=$.createBiquadFilter(),s=$.createGain(),o=$.createOscillator(),c=$.createGain();n.buffer=qe(.12),i.type="bandpass",i.frequency.setValueAtTime(3e3,t),i.frequency.exponentialRampToValueAtTime(800,t+.05),i.Q.value=2,s.gain.setValueAtTime(.35,t),s.gain.exponentialRampToValueAtTime(.001,t+.08),o.type="sine",o.frequency.setValueAtTime(200,t),o.frequency.exponentialRampToValueAtTime(40,t+.1),c.gain.setValueAtTime(.3,t),c.gain.exponentialRampToValueAtTime(.001,t+.12),n.connect(i),i.connect(s),s.connect(e),o.connect(c),c.connect(e),n.start(t),o.start(t),n.stop(t+.12),o.stop(t+.15);const l=.18,u=$.createOscillator(),f=$.createGain();u.type="square",u.frequency.setValueAtTime(1200,t+l),u.frequency.exponentialRampToValueAtTime(400,t+l+.03),f.gain.setValueAtTime(.2,t+l),f.gain.exponentialRampToValueAtTime(.001,t+l+.05),u.connect(f),f.connect(e),u.start(t+l),u.stop(t+l+.06);const d=$.createOscillator(),h=$.createGain();d.type="triangle",d.frequency.setValueAtTime(2500,t+l+.08),d.frequency.exponentialRampToValueAtTime(800,t+l+.15),h.gain.setValueAtTime(.25,t+l+.08),h.gain.exponentialRampToValueAtTime(.001,t+l+.2),d.connect(h),h.connect(e),d.start(t+l+.08),d.stop(t+l+.25);break}case"explosion":{const n=$.createBufferSource(),i=$.createBiquadFilter(),s=$.createGain();n.buffer=qe(.1),i.type="highpass",i.frequency.value=1500,s.gain.setValueAtTime(.5,t),s.gain.exponentialRampToValueAtTime(.001,t+.08),n.connect(i),i.connect(s),s.connect(e),n.start(t),n.stop(t+.1);const o=$.createOscillator(),c=$.createOscillator(),l=$.createGain();o.type="sine",o.frequency.setValueAtTime(60,t+.03),o.frequency.exponentialRampToValueAtTime(25,t+.6),c.type="sine",c.frequency.setValueAtTime(45,t+.03),c.frequency.exponentialRampToValueAtTime(18,t+.7),l.gain.setValueAtTime(.5,t+.03),l.gain.setValueAtTime(.6,t+.1),l.gain.exponentialRampToValueAtTime(.001,t+.8),o.connect(l),c.connect(l),l.connect(e),o.start(t+.03),c.start(t+.03),o.stop(t+.9),c.stop(t+.9);const u=$.createBufferSource(),f=$.createBiquadFilter(),d=$.createGain();u.buffer=qe(1),f.type="lowpass",f.frequency.setValueAtTime(400,t),f.frequency.exponentialRampToValueAtTime(80,t+.8),d.gain.setValueAtTime(.4,t+.05),d.gain.exponentialRampToValueAtTime(.001,t+1),u.connect(f),f.connect(d),d.connect(e),u.start(t+.05),u.stop(t+1.1);break}case"rocket":{const n=$.createBufferSource(),i=$.createBiquadFilter(),s=$.createGain();n.buffer=qe(1.5),i.type="bandpass",i.frequency.setValueAtTime(200,t),i.frequency.exponentialRampToValueAtTime(2e3,t+.3),i.frequency.setValueAtTime(1500,t+.5),i.Q.value=2,s.gain.setValueAtTime(.001,t),s.gain.exponentialRampToValueAtTime(.4,t+.2),s.gain.setValueAtTime(.3,t+.8),s.gain.exponentialRampToValueAtTime(.001,t+1.4),n.connect(i),i.connect(s),s.connect(e),n.start(t),n.stop(t+1.5);for(let o=0;o<8;o++){const c=$.createOscillator(),l=$.createGain();c.type="sawtooth",c.frequency.setValueAtTime(80+o*10,t+o*.12),c.frequency.setValueAtTime(60+o*5,t+o*.12+.06),l.gain.setValueAtTime(.12,t+o*.12),l.gain.exponentialRampToValueAtTime(.001,t+o*.12+.1),c.connect(l),l.connect(e),c.start(t+o*.12),c.stop(t+o*.12+.12)}break}case"train":{const n=$.createOscillator(),i=$.createOscillator(),s=$.createGain();n.type="sine",n.frequency.setValueAtTime(800,t),n.frequency.setValueAtTime(750,t+.3),i.type="sine",i.frequency.setValueAtTime(600,t),i.frequency.setValueAtTime(570,t+.3),s.gain.setValueAtTime(.001,t),s.gain.exponentialRampToValueAtTime(.2,t+.05),s.gain.setValueAtTime(.18,t+.4),s.gain.exponentialRampToValueAtTime(.001,t+.5),n.connect(s),i.connect(s),s.connect(e),n.start(t),i.start(t),n.stop(t+.55),i.stop(t+.55);for(let o=0;o<4;o++){const c=$.createBufferSource(),l=$.createBiquadFilter(),u=$.createGain();c.buffer=qe(.1),l.type="lowpass",l.frequency.value=400,u.gain.setValueAtTime(.2,t+.1+o*.15),u.gain.exponentialRampToValueAtTime(.001,t+.1+o*.15+.1),c.connect(l),l.connect(u),u.connect(e),c.start(t+.1+o*.15),c.stop(t+.1+o*.15+.12)}break}case"hack":{for(let l=0;l<8;l++){const u=$.createOscillator(),f=$.createGain();u.type="square",u.frequency.value=1800+Math.random()*400,f.gain.setValueAtTime(.06,t+l*.04),f.gain.exponentialRampToValueAtTime(.001,t+l*.04+.02),u.connect(f),f.connect(e),u.start(t+l*.04),u.stop(t+l*.04+.03)}const n=$.createOscillator(),i=$.createGain();n.type="sine",n.frequency.setValueAtTime(1200,t+.35),n.frequency.setValueAtTime(1600,t+.4),i.gain.setValueAtTime(.15,t+.35),i.gain.exponentialRampToValueAtTime(.001,t+.5),n.connect(i),i.connect(e),n.start(t+.35),n.stop(t+.55);const s=$.createOscillator(),o=$.createOscillator(),c=$.createGain();s.type="square",s.frequency.value=440,o.type="square",o.frequency.value=880,c.gain.setValueAtTime(.12,t+.55),c.gain.setValueAtTime(.001,t+.6),c.gain.setValueAtTime(.12,t+.65),c.gain.exponentialRampToValueAtTime(.001,t+.75),s.connect(c),o.connect(c),c.connect(e),s.start(t+.55),o.start(t+.55),s.stop(t+.8),o.stop(t+.8);break}case"build":{for(let s=0;s<3;s++){const o=$.createOscillator(),c=$.createBufferSource(),l=$.createGain(),u=$.createGain();o.type="sine",o.frequency.setValueAtTime(200,t+s*.18),o.frequency.exponentialRampToValueAtTime(100,t+s*.18+.05),l.gain.setValueAtTime(.25,t+s*.18),l.gain.exponentialRampToValueAtTime(.001,t+s*.18+.08),c.buffer=qe(.05),u.gain.setValueAtTime(.2,t+s*.18),u.gain.exponentialRampToValueAtTime(.001,t+s*.18+.05),o.connect(l),l.connect(e),c.connect(u),u.connect(e),o.start(t+s*.18),c.start(t+s*.18),o.stop(t+s*.18+.1),c.stop(t+s*.18+.06)}const n=$.createOscillator(),i=$.createGain();n.type="sine",n.frequency.value=1200,i.gain.setValueAtTime(.15,t+.6),i.gain.exponentialRampToValueAtTime(.001,t+.9),n.connect(i),i.connect(e),n.start(t+.6),n.stop(t+.95);break}case"boat":{const n=$.createBufferSource(),i=$.createBiquadFilter(),s=$.createGain();n.buffer=qe(.4),i.type="bandpass",i.frequency.setValueAtTime(1e3,t),i.frequency.exponentialRampToValueAtTime(300,t+.3),i.Q.value=1,s.gain.setValueAtTime(.25,t),s.gain.exponentialRampToValueAtTime(.001,t+.35),n.connect(i),i.connect(s),s.connect(e),n.start(t),n.stop(t+.4);const o=$.createOscillator(),c=$.createGain(),l=$.createBiquadFilter();o.type="sawtooth",o.frequency.setValueAtTime(60,t+.1),o.frequency.setValueAtTime(80,t+.3),o.frequency.setValueAtTime(70,t+.5),l.type="lowpass",l.frequency.value=200,c.gain.setValueAtTime(.001,t+.1),c.gain.exponentialRampToValueAtTime(.2,t+.2),c.gain.setValueAtTime(.15,t+.5),c.gain.exponentialRampToValueAtTime(.001,t+.7),o.connect(l),l.connect(c),c.connect(e),o.start(t+.1),o.stop(t+.75);break}case"helicopter":{for(let s=0;s<6;s++){const o=$.createOscillator(),c=$.createGain(),l=$.createBiquadFilter();o.type="sawtooth",o.frequency.setValueAtTime(80,t+s*.08),o.frequency.exponentialRampToValueAtTime(40,t+s*.08+.04),l.type="lowpass",l.frequency.value=300,c.gain.setValueAtTime(.2,t+s*.08),c.gain.exponentialRampToValueAtTime(.001,t+s*.08+.06),o.connect(l),l.connect(c),c.connect(e),o.start(t+s*.08),o.stop(t+s*.08+.08)}const n=$.createOscillator(),i=$.createGain();n.type="sine",n.frequency.setValueAtTime(400,t),n.frequency.setValueAtTime(500,t+.2),n.frequency.setValueAtTime(450,t+.4),i.gain.setValueAtTime(.08,t),i.gain.exponentialRampToValueAtTime(.001,t+.5),n.connect(i),i.connect(e),n.start(t),n.stop(t+.55);break}case"plane":{const n=$.createBufferSource(),i=$.createBiquadFilter(),s=$.createGain();n.buffer=qe(.8),i.type="bandpass",i.frequency.setValueAtTime(500,t),i.frequency.exponentialRampToValueAtTime(2e3,t+.2),i.frequency.exponentialRampToValueAtTime(800,t+.6),i.Q.value=2,s.gain.setValueAtTime(.001,t),s.gain.exponentialRampToValueAtTime(.35,t+.15),s.gain.setValueAtTime(.3,t+.4),s.gain.exponentialRampToValueAtTime(.001,t+.7),n.connect(i),i.connect(s),s.connect(e),n.start(t),n.stop(t+.8);const o=$.createOscillator(),c=$.createGain();o.type="sine",o.frequency.setValueAtTime(1500,t+.3),o.frequency.exponentialRampToValueAtTime(300,t+.7),c.gain.setValueAtTime(.001,t+.3),c.gain.exponentialRampToValueAtTime(.2,t+.4),c.gain.exponentialRampToValueAtTime(.001,t+.7),o.connect(c),c.connect(e),o.start(t+.3),o.stop(t+.75);break}case"click":{const n=$.createOscillator(),i=$.createGain(),s=$.createBiquadFilter();n.type="square",n.frequency.setValueAtTime(3e3,t),n.frequency.exponentialRampToValueAtTime(1500,t+.008),s.type="highpass",s.frequency.value=1e3,i.gain.setValueAtTime(.12,t),i.gain.exponentialRampToValueAtTime(.001,t+.015),n.connect(s),s.connect(i),i.connect(e),n.start(t),n.stop(t+.02);const o=$.createOscillator(),c=$.createGain();o.type="sine",o.frequency.setValueAtTime(800,t),o.frequency.exponentialRampToValueAtTime(400,t+.02),c.gain.setValueAtTime(.06,t),c.gain.exponentialRampToValueAtTime(.001,t+.025),o.connect(c),c.connect(e),o.start(t),o.stop(t+.03);break}case"win":{const n=(i,s,o)=>{const c=$.createOscillator(),l=$.createOscillator(),u=$.createGain();c.type="triangle",c.frequency.value=i,l.type="sine",l.frequency.value=i*2,u.gain.setValueAtTime(.001,s),u.gain.exponentialRampToValueAtTime(.12,s+.02),u.gain.setValueAtTime(.1,s+o*.7),u.gain.exponentialRampToValueAtTime(.001,s+o),c.connect(u),l.connect(u),u.connect($.destination),c.start(s),l.start(s),c.stop(s+o),l.stop(s+o)};n(523,t,.15),n(659,t+.1,.15),n(784,t+.2,.15),n(1047,t+.3,.4),n(523,t+.35,.5),n(659,t+.35,.5),n(784,t+.35,.5);break}case"tick":{const n=$.createOscillator(),i=$.createGain(),s=$.createBiquadFilter();n.type="square",n.frequency.setValueAtTime(2500,t),n.frequency.setValueAtTime(1500,t+.01),s.type="bandpass",s.frequency.value=2e3,s.Q.value=5,i.gain.setValueAtTime(.06,t),i.gain.exponentialRampToValueAtTime(.001,t+.025),n.connect(s),s.connect(i),i.connect(e),n.start(t),n.stop(t+.03);break}}}const tp={en:{startTitle:"War Chess",startButton:"Start Game",startVsPlayer:"vs Player",startVsBot:"vs Bot",botDifficultyLabel:"Bot Difficulty",botEasy:"Easy",botMedium:"Medium",botHard:"Hard",botThinking:"Bot is thinking...",settingsButton:"Settings",backButton:"Back",languageLabel:"Language",timerLabel:"Chess Clock",timerOff:"Off",timerOn:"On",timerMinutesLabel:"Minutes per player",timeUp:"Time is up!",timeUpPenalty:"{team} ran out of time! (-10 points)",soundLabel:"Sound Effects",musicLabel:"Music",masterVolumeLabel:"Master Volume",musicVolumeLabel:"Music Volume",sfxVolumeLabel:"Effects Volume",musicStyleLabel:"Music Style",styleEpic:"Epic War",styleAmbient:"Calm",styleTension:"Suspense",styleElectronic:"Electronic",styleOrchestral:"Orchestral",styleRetro:"8-Bit Retro",on:"On",off:"Off",visualSettingsTitle:"Visual",boardThemeLabel:"Board Theme",themeClassic:"Classic",themeDark:"Dark",themeLight:"Light",themeWood:"Wood",animationSpeedLabel:"Animation Speed",speedFast:"Fast",speedNormal:"Normal",speedSlow:"Slow",screenShakeLabel:"Screen Shake",showCoordinatesLabel:"Show Coordinates",accessibilityTitle:"Accessibility",colorBlindLabel:"Colorblind Mode",highContrastLabel:"High Contrast",largeUILabel:"Large UI",fullscreenLabel:"Fullscreen",yellowTurn:"YELLOW's turn",greenTurn:"GREEN's turn",resetButton:"Reset",moveButton:"Move",shootButton:"Shoot",exitButton:"Exit",launchHelicopter:"Launch Helicopter",noTargetsInRange:"No targets in range!",selectTarget:"Select target to shoot",mustLeaveTrench:"Soldier MUST leave the trench! Click a valid destination.",enteredTrench:"Entered the trench!",enteredTrenchTurn:"Entered the trench! (Turn {0}/3)",leftTrench:"Left the trench!",enteredTunnel:"Entered the tunnel!",exitedTunnel:"Exited the tunnel!",soldierTrapped:"Soldier trapped in trench - eliminated!",helicopterLaunched:"Helicopter launched!",helicopterLanded:"Helicopter landed on carrier!",selectHelipad:"Select helipad to land helicopter",noHelipads:"No available helipads to land on!",cannotMoveThere:"You cannot move there!",cannotShootThere:"You cannot shoot there!",noTargetToShoot:"No target to shoot!",teamPieceBlocking:"There is already a piece of your team there!",notYourTurn:"It's not your turn!",pieceFrozen:"This piece is frozen!",rocketNotReady:"Rocket not ready yet!",rocketUsed:"This rocket has already been used!",selectRocketTarget:"Select target for rocket (3x3 explosion area)",rocketLaunching:"Rocket launching...",rocketExploded:"Rocket exploded!",selectHackTarget:"Select enemy piece to hack",noHackTargets:"No targets to hack",selectBombTarget:"Select enemy piece to bomb",noBombTargets:"No targets in range",cannotHackWater:"Cannot hack into water!",cannotHackOccupied:"Cannot hack - square occupied!",cannotHackEdge:"Cannot hack - edge of board!",hackerCooldown:"Hacker on cooldown!",hackerNotReady:"Hacker not ready yet!",fighterIncoming:"Fighter incoming...",droppingBomb:"Dropping bomb!",targetDestroyed:"Target destroyed!",builderChooseAction:"Builder: choose action",builderWaitCooldown:"Builder: move or wait for cooldown",selectWhereToMove:"Select where to move",cannotBuildBarricade:"Cannot build barricade now",selectPlaceBarricade:"Select where to place barricade",cannotBuildArtillery:"Cannot build artillery now",selectPlaceArtillery:"Select where to place artillery",cannotBuildSpike:"Cannot build spike now",selectPlaceSpike:"Select where to place spike",artilleryNoTargets:"Artillery has no valid targets!",clickToFireArtillery:"Click to fire artillery (random target)",barricadeInfo:"Barricade: blocks movement and shots",noValidMoves:"No valid moves",charging:"Charging...",gameOverPoints:"wins by points!",gameOverBuilder:"wins by capturing the Builder!",playAgain:"Play Again",mainMenu:"Main Menu",confirmReset:"Are you sure you want to reset the game?",confirmYes:"Yes",confirmNo:"No",confirmEnterTunnel:"Enter the tunnel?",confirmExitTunnel:"Exit the tunnel?",score:"Score",moves:"Moves",captured:"Captured",yellowTeam:"Yellow",greenTeam:"Green",yellowTurns:"Yellow turns",greenTurns:"Green turns",manualButton:"How to Play",manualTitle:"How to Play",manualWinTitle:"How to Win?",manualWinText:`There are two ways to win:
• Have the most points after 80 moves each.
• Capture the Engineer.`,manualClockTitle:"How Does the Clock Work?",manualClockText:"The chess clock can be enabled in settings. While you think, your time runs down. When you make a move, the clock switches to your opponent. If your time runs out, 10 points are deducted from your score and the game ends. Available timers: 1, 3, 5, 10, 15, 30 minutes.",manualPointsTitle:"Points",manualPointsText:"You earn points by capturing opponent pieces. After 80 moves each, the player with the most points wins. Each piece has its own point value; for example, a soldier is worth 5 points.",manualMovesTitle:"Move History",manualMovesText:"All moves are recorded below the scoreboard. You can review your game to analyze your strategies and decisions.",manualBigThreeTitle:"The Big Three",manualBigThreeText:"The Big Three are the most important pieces in the game:",manualHackerTitle:"The Hacker",manualHackerText:"The Hacker can hack a piece after 10 moves. Press the Hacker, then press an opponent's piece (highlighted in purple), then choose: Freeze the piece for 5 moves, move it one square forward, or move it one square backward. The Hacker has a cooldown of 15 moves.",manualEngineerTitle:"The Engineer",manualEngineerText:`The Engineer can place barricades, spikes, or artillery. Press the Engineer, then choose what to build:

• Barricade: A shield to hide behind. You have 5. Has cooldown.
• Artillery: A cannon that shoots one random square when activated. Great chance of hitting opponents, but won't eliminate your own pieces. You have 5. Has cooldown.
• Spike: If an opponent steps on it, they're eliminated. Useful for endgame. You have 3. Has cooldown.`,manualBomberTitle:"Bomber Plane",manualBomberText:"When an opponent's piece enters your half (before the river), the Bomber Plane can strike! Press the Bomber, select a target (highlighted in orange), then choose a landing spot (green square with plane). The plane flies to the target, drops a bomb, and lands at your chosen spot.",manualRulesTitle:"Rules",manualRulesText:`• A Bomber cannot take a Bomber
• An Engineer cannot take an Engineer
• A Machine Gunner cannot take a Machine Gunner
• A Submarine cannot take a Submarine
• A Train cannot take a Train
• A Helicopter cannot take a Helicopter
• A Hacker cannot hack or take a Hacker
• A Rocket cannot take a Rocket`,manualSpecialTitle:"Special Locations",manualSpecialText:`• Helicopter: Can only land on helipads (white squares) or the aircraft carrier.
• Train: Can only move on train stations (orange squares).
• Soldier: Can enter the trench (wood square) and tunnel (gray vertical lines). No other piece can enter these.`,manualTrenchTitle:"Trench & Tunnel",manualTrenchText:`• Trench: Soldiers can stay for 3 moves maximum. While inside, they cannot be eliminated but can still shoot opponents. After 3 moves, they must leave.
• Tunnel: A way to transport soldiers. You cannot shoot while inside the tunnel. Use the "move" and "shoot" buttons to switch actions.`,manualOtherTitle:"Other Pieces",manualOtherText:`• Machine Gunner: Cannot move. Can only shoot 4 squares in front.
• Rocket: Cannot move until move 45. When ready, press it to see the launch range. It eliminates all pieces in the explosion area. A sign shows when it's ready.

Have fun!`,authLogin:"Login",authRegister:"Create Account",authLogout:"Logout",authOffline:"Play Offline",authEmail:"Email",authPassword:"Password",authUsername:"Username",authUsernameOrEmail:"Username or Email",authLoginWithEmail:"Login with email instead",authLoginWithUsername:"Login with username instead",authLoginButton:"Login",authRegisterButton:"Create Account",authLoading:"Loading...",authNoAccount:"Don't have an account?",authHaveAccount:"Already have an account?",authOfflineWarning:"Playing offline - progress will not be saved",authWelcome:"Welcome",profileTitle:"Profile",profileStats:"Statistics",profileBadges:"Badges",profileWarBucks:"War Bucks",statsGamesPlayed:"Games Played",statsGamesWon:"Games Won",statsGamesLost:"Games Lost",statsWinRate:"Win Rate",statsTotalPoints:"Total Points",statsPiecesEliminated:"Pieces Eliminated",statsEngineers:"Engineers Captured",noBadges:"No badges yet. Keep playing!",multiplayerButton:"Play Online",multiplayerTitle:"Play Online",onlinePlayers:"Online Players",noPlayersOnline:"No other players online",sendInvite:"Send Invite",inviteSent:"Invite sent!",pendingInvites:"Incoming Invites",acceptInvite:"Accept",declineInvite:"Decline",inviteFrom:"Invite from",waitingForPlayers:"Waiting for players...",waitingForOpponent:"Waiting for opponent to join...",inviteDeclined:"declined your invite",inviteSettings:"Game Settings",youAreYellow:"You are Yellow",youAreGreen:"You are Green",yourTurn:"Your turn!",opponentsTurn:"Opponent's turn",playerAvailable:"Available",playerPlaying:"In Game",refreshList:"Refresh",goOnline:"Go Online",goOfflineMulti:"Go Offline",youAreOnline:"You are online",youAreOfflineMulti:"You are offline",shopTitle:"War Shop",shopBalance:"Balance",shopBuy:"Buy",shopOwned:"Owned",shopEquip:"Equip",shopUnequip:"Unequip",shopEquipped:"Equipped",noEquipped:"No cosmetics equipped",shopPurchased:"Purchased!",shopNotEnough:"Not enough War Bucks",shopThemes:"Board Themes",shopSkins:"Piece Skins",shopEffects:"Effects",shopSounds:"Sound Packs",shopMusic:"Music Packs",warPassTitle:"War Pass",warPassChallenges:"Challenges",warPassProgress:"Progress",warPassClaim:"Claim",warPassClaimed:"Claimed",warPassReward:"Reward",warPassCompleted:"Completed!"},nl:{startTitle:"Oorlog Schaak",startButton:"Start Spel",startVsPlayer:"vs Speler",startVsBot:"vs Bot",botDifficultyLabel:"Bot Moeilijkheid",botEasy:"Makkelijk",botMedium:"Gemiddeld",botHard:"Moeilijk",botThinking:"Bot is aan het denken...",settingsButton:"Instellingen",backButton:"Terug",languageLabel:"Taal",timerLabel:"Schaakklok",timerOff:"Uit",timerOn:"Aan",timerMinutesLabel:"Minuten per speler",timeUp:"Tijd is op!",timeUpPenalty:"{team} heeft geen tijd meer! (-10 punten)",soundLabel:"Geluidseffecten",musicLabel:"Muziek",masterVolumeLabel:"Hoofdvolume",musicVolumeLabel:"Muziekvolume",sfxVolumeLabel:"Effectenvolume",musicStyleLabel:"Muziekstijl",styleEpic:"Episch",styleAmbient:"Rustig",styleTension:"Spanning",styleElectronic:"Elektronisch",styleOrchestral:"Orkest",styleRetro:"8-Bit Retro",on:"Aan",off:"Uit",visualSettingsTitle:"Visueel",boardThemeLabel:"Bordthema",themeClassic:"Klassiek",themeDark:"Donker",themeLight:"Licht",themeWood:"Hout",animationSpeedLabel:"Animatiesnelheid",speedFast:"Snel",speedNormal:"Normaal",speedSlow:"Langzaam",screenShakeLabel:"Scherm Schudden",showCoordinatesLabel:"Coördinaten Tonen",accessibilityTitle:"Toegankelijkheid",colorBlindLabel:"Kleurenblind Modus",highContrastLabel:"Hoog Contrast",largeUILabel:"Grote UI",fullscreenLabel:"Volledig Scherm",yellowTurn:"GEEL aan zet",greenTurn:"GROEN aan zet",resetButton:"Reset",moveButton:"Bewegen",shootButton:"Schieten",exitButton:"Uitgang",launchHelicopter:"Lanceer Helicopter",noTargetsInRange:"Geen doelen in bereik!",selectTarget:"Selecteer doel om te schieten",mustLeaveTrench:"Soldaat MOET de loopgraaf verlaten! Klik op een geldige bestemming.",enteredTrench:"Loopgraaf betreden!",enteredTrenchTurn:"Loopgraaf betreden! (Beurt {0}/3)",leftTrench:"Loopgraaf verlaten!",enteredTunnel:"Tunnel betreden!",exitedTunnel:"Tunnel verlaten!",soldierTrapped:"Soldaat vast in loopgraaf - uitgeschakeld!",helicopterLaunched:"Helicopter gelanceerd!",helicopterLanded:"Helicopter geland op carrier!",selectHelipad:"Selecteer helipad om te landen",noHelipads:"Geen beschikbare helipads om te landen!",cannotMoveThere:"Je kunt daar niet heen!",cannotShootThere:"Je kunt daar niet schieten!",noTargetToShoot:"Geen doel om te schieten!",teamPieceBlocking:"Er staat al een stuk van jouw team!",notYourTurn:"Het is niet jouw beurt!",pieceFrozen:"Dit stuk is bevroren!",rocketNotReady:"Raket nog niet klaar!",rocketUsed:"Deze raket is al gebruikt!",selectRocketTarget:"Selecteer doel voor raket (3x3 explosie)",rocketLaunching:"Raket lanceren...",rocketExploded:"Raket ontploft!",selectHackTarget:"Selecteer vijandelijk stuk om te hacken",noHackTargets:"Geen doelen om te hacken",selectBombTarget:"Selecteer vijandelijk stuk om te bombarderen",noBombTargets:"Geen doelen in bereik",cannotHackWater:"Kan niet in water hacken!",cannotHackOccupied:"Kan niet hacken - veld bezet!",cannotHackEdge:"Kan niet hacken - rand van bord!",hackerCooldown:"Hacker aan het opladen!",hackerNotReady:"Hacker nog niet klaar!",fighterIncoming:"Gevechtsvliegtuig nadert...",droppingBomb:"Bom laten vallen!",targetDestroyed:"Doel vernietigd!",builderChooseAction:"Bouwer: kies actie",builderWaitCooldown:"Bouwer: bewegen of wachten",selectWhereToMove:"Selecteer waar te bewegen",cannotBuildBarricade:"Kan nu geen barricade bouwen",selectPlaceBarricade:"Selecteer plek voor barricade",cannotBuildArtillery:"Kan nu geen artillerie bouwen",selectPlaceArtillery:"Selecteer plek voor artillerie",cannotBuildSpike:"Kan nu geen spike bouwen",selectPlaceSpike:"Selecteer plek voor spike",artilleryNoTargets:"Artillerie heeft geen doelen!",clickToFireArtillery:"Klik om artillerie te vuren",barricadeInfo:"Barricade: blokkeert beweging en schoten",noValidMoves:"Geen geldige zetten",charging:"Opladen...",gameOverPoints:"wint op punten!",gameOverBuilder:"wint door de Bouwer te vangen!",playAgain:"Opnieuw Spelen",mainMenu:"Hoofdmenu",confirmReset:"Weet je zeker dat je het spel wilt resetten?",confirmYes:"Ja",confirmNo:"Nee",confirmEnterTunnel:"Tunnel betreden?",confirmExitTunnel:"Tunnel verlaten?",score:"Score",moves:"Zetten",captured:"Gevangen",yellowTeam:"Geel",greenTeam:"Groen",yellowTurns:"Gele beurten",greenTurns:"Groene beurten",manualButton:"Speluitleg",manualTitle:"Speluitleg",manualWinTitle:"Hoe win je?",manualWinText:`Er zijn twee manieren om te winnen:
• De meeste punten hebben na 80 zetten per speler.
• De Ingenieur vangen.`,manualClockTitle:"Hoe werkt de klok?",manualClockText:"De schaakklok kan worden ingeschakeld in de instellingen. Terwijl je nadenkt, loopt je tijd af. Als je een zet doet, schakelt de klok over naar je tegenstander. Als je tijd op is, worden 10 punten van je score afgetrokken en eindigt het spel. Beschikbare timers: 1, 3, 5, 10, 15, 30 minuten.",manualPointsTitle:"Punten",manualPointsText:"Je verdient punten door stukken van je tegenstander te slaan. Na 80 zetten per speler wint de speler met de meeste punten. Elk stuk heeft zijn eigen puntenwaarde; een soldaat is bijvoorbeeld 5 punten waard.",manualMovesTitle:"Zetgeschiedenis",manualMovesText:"Alle zetten worden opgeslagen onder het scorebord. Je kunt je spel terugkijken om je strategieën en beslissingen te analyseren.",manualBigThreeTitle:"De Grote Drie",manualBigThreeText:"De Grote Drie zijn de belangrijkste stukken in het spel:",manualHackerTitle:"De Hacker",manualHackerText:"De Hacker kan een stuk hacken na 10 zetten. Druk op de Hacker, dan op een stuk van de tegenstander (paars gemarkeerd), en kies: Bevries het stuk voor 5 zetten, verplaats het één vak vooruit, of verplaats het één vak achteruit. De Hacker heeft een cooldown van 15 zetten.",manualEngineerTitle:"De Ingenieur",manualEngineerText:`De Ingenieur kan barricades, spikes of artillerie plaatsen. Druk op de Ingenieur en kies wat je wilt bouwen:

• Barricade: Een schild om achter te schuilen. Je hebt er 5. Heeft cooldown.
• Artillerie: Een kanon dat één willekeurig vak beschiet wanneer geactiveerd. Grote kans om tegenstanders te raken, maar elimineert je eigen stukken niet. Je hebt er 5. Heeft cooldown.
• Spike: Als een tegenstander erop stapt, wordt deze geëlimineerd. Handig voor de eindfase. Je hebt er 3. Heeft cooldown.`,manualBomberTitle:"Bommenwerper",manualBomberText:"Wanneer een stuk van de tegenstander jouw helft betreedt (voor de rivier), kan de Bommenwerper toeslaan! Druk op de Bommenwerper, selecteer een doelwit (oranje gemarkeerd), en kies een landingsplaats (groen vak met vliegtuig). Het vliegtuig vliegt naar het doelwit, gooit een bom, en landt op je gekozen plek.",manualRulesTitle:"Regels",manualRulesText:`• Een Bommenwerper kan geen Bommenwerper pakken
• Een Ingenieur kan geen Ingenieur pakken
• Een Mitrailleur kan geen Mitrailleur pakken
• Een Onderzeeër kan geen Onderzeeër pakken
• Een Trein kan geen Trein pakken
• Een Helikopter kan geen Helikopter pakken
• Een Hacker kan geen Hacker hacken of pakken
• Een Raket kan geen Raket pakken`,manualSpecialTitle:"Speciale Locaties",manualSpecialText:`• Helikopter: Kan alleen landen op helikopterplatforms (witte vakken) of het vliegdekschip.
• Trein: Kan alleen bewegen op treinstations (oranje vakken).
• Soldaat: Kan de loopgraaf (houten vak) en tunnel (grijze verticale lijnen) betreden. Geen ander stuk kan deze betreden.`,manualTrenchTitle:"Loopgraaf & Tunnel",manualTrenchText:`• Loopgraaf: Soldaten kunnen maximaal 3 zetten blijven. Terwijl ze erin zitten, kunnen ze niet geëlimineerd worden maar kunnen nog wel schieten. Na 3 zetten moeten ze vertrekken.
• Tunnel: Een manier om soldaten te vervoeren. Je kunt niet schieten in de tunnel. Gebruik de "verplaats" en "schiet" knoppen om te wisselen.`,manualOtherTitle:"Andere Stukken",manualOtherText:`• Mitrailleur: Kan niet bewegen. Kan alleen 4 vakken vooruit schieten.
• Raket: Kan niet bewegen tot zet 45. Wanneer klaar, druk erop om het lanceerbereik te zien. Het elimineert alle stukken in het explosiegebied. Een teken toont wanneer het klaar is.

Veel plezier!`,authLogin:"Inloggen",authRegister:"Account Aanmaken",authLogout:"Uitloggen",authOffline:"Offline Spelen",authEmail:"E-mail",authPassword:"Wachtwoord",authUsername:"Gebruikersnaam",authUsernameOrEmail:"Gebruikersnaam of E-mail",authLoginWithEmail:"Inloggen met e-mail",authLoginWithUsername:"Inloggen met gebruikersnaam",authLoginButton:"Inloggen",authRegisterButton:"Account Aanmaken",authLoading:"Laden...",authNoAccount:"Nog geen account?",authHaveAccount:"Al een account?",authOfflineWarning:"Offline spelen - voortgang wordt niet opgeslagen",authWelcome:"Welkom",profileTitle:"Profiel",profileStats:"Statistieken",profileBadges:"Badges",profileWarBucks:"War Bucks",statsGamesPlayed:"Gespeelde Potjes",statsGamesWon:"Gewonnen",statsGamesLost:"Verloren",statsWinRate:"Winstpercentage",statsTotalPoints:"Totaal Punten",statsPiecesEliminated:"Stukken Geëlimineerd",statsEngineers:"Ingenieurs Gevangen",noBadges:"Nog geen badges. Blijf spelen!",multiplayerButton:"Online Spelen",multiplayerTitle:"Online Spelen",onlinePlayers:"Online Spelers",noPlayersOnline:"Geen andere spelers online",sendInvite:"Uitnodiging Sturen",inviteSent:"Uitnodiging verstuurd!",pendingInvites:"Inkomende Uitnodigingen",acceptInvite:"Accepteren",declineInvite:"Afwijzen",inviteFrom:"Uitnodiging van",waitingForPlayers:"Wachten op spelers...",waitingForOpponent:"Wachten tot tegenstander deelneemt...",inviteDeclined:"heeft je uitnodiging afgewezen",inviteSettings:"Spel Instellingen",youAreYellow:"Jij bent Geel",youAreGreen:"Jij bent Groen",yourTurn:"Jouw beurt!",opponentsTurn:"Tegenstander is aan zet",playerAvailable:"Beschikbaar",playerPlaying:"In Spel",refreshList:"Vernieuwen",goOnline:"Ga Online",goOfflineMulti:"Ga Offline",youAreOnline:"Je bent online",youAreOfflineMulti:"Je bent offline",shopTitle:"Oorlog Winkel",shopBalance:"Saldo",shopBuy:"Kopen",shopOwned:"In bezit",shopEquip:"Uitrusten",shopUnequip:"Afdoen",shopEquipped:"Uitgerust",noEquipped:"Geen cosmetica uitgerust",shopPurchased:"Gekocht!",shopNotEnough:"Niet genoeg War Bucks",shopThemes:"Bord Thema's",shopSkins:"Stuk Skins",shopEffects:"Effecten",shopSounds:"Geluidspakketten",shopMusic:"Muziekpakketten",warPassTitle:"War Pass",warPassChallenges:"Uitdagingen",warPassProgress:"Voortgang",warPassClaim:"Claim",warPassClaimed:"Geclaimed",warPassReward:"Beloning",warPassCompleted:"Voltooid!"},de:{startTitle:"Kriegsschach",startButton:"Spiel Starten",startVsPlayer:"vs Spieler",startVsBot:"vs Bot",botDifficultyLabel:"Bot Schwierigkeit",botEasy:"Einfach",botMedium:"Mittel",botHard:"Schwer",botThinking:"Bot denkt nach...",settingsButton:"Einstellungen",backButton:"Zurück",languageLabel:"Sprache",timerLabel:"Schachuhr",timerOff:"Aus",timerOn:"An",timerMinutesLabel:"Minuten pro Spieler",timeUp:"Zeit ist um!",timeUpPenalty:"{team} hat keine Zeit mehr! (-10 Punkte)",soundLabel:"Soundeffekte",musicLabel:"Musik",masterVolumeLabel:"Gesamtlautstärke",musicVolumeLabel:"Musiklautstärke",sfxVolumeLabel:"Effektlautstärke",musicStyleLabel:"Musikstil",styleEpic:"Episch",styleAmbient:"Ruhig",styleTension:"Spannung",styleElectronic:"Elektronisch",styleOrchestral:"Orchester",styleRetro:"8-Bit Retro",on:"An",off:"Aus",visualSettingsTitle:"Visuell",boardThemeLabel:"Spielbrettthema",themeClassic:"Klassisch",themeDark:"Dunkel",themeLight:"Hell",themeWood:"Holz",animationSpeedLabel:"Animationsgeschwindigkeit",speedFast:"Schnell",speedNormal:"Normal",speedSlow:"Langsam",screenShakeLabel:"Bildschirmschütteln",showCoordinatesLabel:"Koordinaten anzeigen",accessibilityTitle:"Barrierefreiheit",colorBlindLabel:"Farbenblindmodus",highContrastLabel:"Hoher Kontrast",largeUILabel:"Große UI",fullscreenLabel:"Vollbild",yellowTurn:"GELB ist dran",greenTurn:"GRÜN ist dran",resetButton:"Zurücksetzen",moveButton:"Bewegen",shootButton:"Schießen",exitButton:"Ausgang",launchHelicopter:"Hubschrauber starten",noTargetsInRange:"Keine Ziele in Reichweite!",selectTarget:"Ziel zum Schießen auswählen",mustLeaveTrench:"Soldat MUSS den Graben verlassen! Klicke auf ein gültiges Ziel.",enteredTrench:"Graben betreten!",enteredTrenchTurn:"Graben betreten! (Zug {0}/3)",leftTrench:"Graben verlassen!",enteredTunnel:"Tunnel betreten!",exitedTunnel:"Tunnel verlassen!",soldierTrapped:"Soldat im Graben gefangen - eliminiert!",helicopterLaunched:"Hubschrauber gestartet!",helicopterLanded:"Hubschrauber auf Träger gelandet!",selectHelipad:"Hubschrauberlandeplatz auswählen",noHelipads:"Keine verfügbaren Landeplätze!",cannotMoveThere:"Du kannst dich nicht dorthin bewegen!",cannotShootThere:"Du kannst dort nicht schießen!",noTargetToShoot:"Kein Ziel zum Schießen!",teamPieceBlocking:"Dort steht bereits eine Figur deines Teams!",notYourTurn:"Du bist nicht dran!",pieceFrozen:"Diese Figur ist eingefroren!",rocketNotReady:"Rakete noch nicht bereit!",rocketUsed:"Diese Rakete wurde bereits benutzt!",selectRocketTarget:"Ziel für Rakete auswählen (3x3 Explosion)",rocketLaunching:"Rakete startet...",rocketExploded:"Rakete explodiert!",selectHackTarget:"Feindliche Figur zum Hacken auswählen",noHackTargets:"Keine Ziele zum Hacken",selectBombTarget:"Feindliche Figur zum Bombardieren auswählen",noBombTargets:"Keine Ziele in Reichweite",cannotHackWater:"Kann nicht ins Wasser hacken!",cannotHackOccupied:"Kann nicht hacken - Feld besetzt!",cannotHackEdge:"Kann nicht hacken - Rand des Spielfelds!",hackerCooldown:"Hacker lädt auf!",hackerNotReady:"Hacker noch nicht bereit!",fighterIncoming:"Kampfjet im Anflug...",droppingBomb:"Bombe abwerfen!",targetDestroyed:"Ziel zerstört!",builderChooseAction:"Bauer: Aktion wählen",builderWaitCooldown:"Bauer: bewegen oder warten",selectWhereToMove:"Wähle wohin bewegen",cannotBuildBarricade:"Kann jetzt keine Barrikade bauen",selectPlaceBarricade:"Wähle Platz für Barrikade",cannotBuildArtillery:"Kann jetzt keine Artillerie bauen",selectPlaceArtillery:"Wähle Platz für Artillerie",cannotBuildSpike:"Kann jetzt keine Spikes bauen",selectPlaceSpike:"Wähle Platz für Spikes",artilleryNoTargets:"Artillerie hat keine Ziele!",clickToFireArtillery:"Klicken um Artillerie zu feuern",barricadeInfo:"Barrikade: blockiert Bewegung und Schüsse",noValidMoves:"Keine gültigen Züge",charging:"Aufladen...",gameOverPoints:"gewinnt nach Punkten!",gameOverBuilder:"gewinnt durch Eroberung des Bauers!",playAgain:"Nochmal Spielen",mainMenu:"Hauptmenü",confirmReset:"Möchtest du das Spiel wirklich zurücksetzen?",confirmYes:"Ja",confirmNo:"Nein",confirmEnterTunnel:"Tunnel betreten?",confirmExitTunnel:"Tunnel verlassen?",score:"Punktzahl",moves:"Züge",captured:"Erobert",yellowTeam:"Gelb",greenTeam:"Grün",yellowTurns:"Gelbe Züge",greenTurns:"Grüne Züge",manualButton:"Spielanleitung",manualTitle:"Spielanleitung",manualWinTitle:"Wie gewinnt man?",manualWinText:`Es gibt zwei Möglichkeiten zu gewinnen:
• Nach je 80 Zügen die meisten Punkte haben.
• Den Ingenieur erobern.`,manualClockTitle:"Wie funktioniert die Uhr?",manualClockText:"Die Schachuhr kann in den Einstellungen aktiviert werden. Während du nachdenkst, läuft deine Zeit ab. Wenn du einen Zug machst, wechselt die Uhr zu deinem Gegner. Wenn deine Zeit abläuft, werden 10 Punkte von deiner Punktzahl abgezogen und das Spiel endet. Verfügbare Timer: 1, 3, 5, 10, 15, 30 Minuten.",manualPointsTitle:"Punkte",manualPointsText:"Du verdienst Punkte, indem du gegnerische Figuren schlägst. Nach je 80 Zügen gewinnt der Spieler mit den meisten Punkten. Jede Figur hat ihren eigenen Punktwert; ein Soldat ist zum Beispiel 5 Punkte wert.",manualMovesTitle:"Zughistorie",manualMovesText:"Alle Züge werden unter der Punktetafel aufgezeichnet. Du kannst dein Spiel überprüfen, um deine Strategien und Entscheidungen zu analysieren.",manualBigThreeTitle:"Die Großen Drei",manualBigThreeText:"Die Großen Drei sind die wichtigsten Figuren im Spiel:",manualHackerTitle:"Der Hacker",manualHackerText:"Der Hacker kann eine Figur nach 10 Zügen hacken. Drücke auf den Hacker, dann auf eine gegnerische Figur (lila markiert), und wähle: Figur für 5 Züge einfrieren, ein Feld vorwärts bewegen, oder ein Feld rückwärts bewegen. Der Hacker hat eine Abklingzeit von 15 Zügen.",manualEngineerTitle:"Der Ingenieur",manualEngineerText:`Der Ingenieur kann Barrikaden, Spikes oder Artillerie platzieren. Drücke auf den Ingenieur und wähle:

• Barrikade: Ein Schild zum Verstecken. Du hast 5. Hat Abklingzeit.
• Artillerie: Eine Kanone, die ein zufälliges Feld beschießt. Hohe Trefferchance, aber eliminiert eigene Figuren nicht. Du hast 5. Hat Abklingzeit.
• Spike: Wenn ein Gegner darauf tritt, wird er eliminiert. Nützlich im Endspiel. Du hast 3. Hat Abklingzeit.`,manualBomberTitle:"Bomber",manualBomberText:"Wenn eine gegnerische Figur deine Hälfte betritt (vor dem Fluss), kann der Bomber zuschlagen! Drücke auf den Bomber, wähle ein Ziel (orange markiert), dann einen Landeplatz (grünes Feld mit Flugzeug). Das Flugzeug fliegt zum Ziel, wirft eine Bombe und landet an deinem gewählten Ort.",manualRulesTitle:"Regeln",manualRulesText:`• Ein Bomber kann keinen Bomber schlagen
• Ein Ingenieur kann keinen Ingenieur schlagen
• Ein MG-Schütze kann keinen MG-Schützen schlagen
• Ein U-Boot kann kein U-Boot schlagen
• Ein Zug kann keinen Zug schlagen
• Ein Helikopter kann keinen Helikopter schlagen
• Ein Hacker kann keinen Hacker hacken oder schlagen
• Eine Rakete kann keine Rakete schlagen`,manualSpecialTitle:"Besondere Orte",manualSpecialText:`• Helikopter: Kann nur auf Hubschrauberlandeplätzen (weiße Felder) oder dem Flugzeugträger landen.
• Zug: Kann sich nur auf Bahnhöfen (orange Felder) bewegen.
• Soldat: Kann den Schützengraben (Holzfeld) und Tunnel (graue vertikale Linien) betreten. Keine andere Figur kann diese betreten.`,manualTrenchTitle:"Schützengraben & Tunnel",manualTrenchText:`• Schützengraben: Soldaten können maximal 3 Züge bleiben. Drinnen können sie nicht eliminiert werden, aber noch schießen. Nach 3 Zügen müssen sie raus.
• Tunnel: Ein Transportweg für Soldaten. Du kannst im Tunnel nicht schießen. Benutze die "Bewegen" und "Schießen" Tasten zum Wechseln.`,manualOtherTitle:"Andere Figuren",manualOtherText:`• MG-Schütze: Kann sich nicht bewegen. Kann nur 4 Felder nach vorne schießen.
• Rakete: Kann sich erst ab Zug 45 bewegen. Wenn bereit, drücke darauf um die Reichweite zu sehen. Sie eliminiert alle Figuren im Explosionsbereich. Ein Zeichen zeigt, wann sie bereit ist.

Viel Spaß!`,authLogin:"Anmelden",authRegister:"Konto erstellen",authLogout:"Abmelden",authOffline:"Offline spielen",authEmail:"E-Mail",authPassword:"Passwort",authUsername:"Benutzername",authUsernameOrEmail:"Benutzername oder E-Mail",authLoginWithEmail:"Mit E-Mail anmelden",authLoginWithUsername:"Mit Benutzername anmelden",authLoginButton:"Anmelden",authRegisterButton:"Konto erstellen",authLoading:"Laden...",authNoAccount:"Noch kein Konto?",authHaveAccount:"Schon ein Konto?",authOfflineWarning:"Offline spielen - Fortschritt wird nicht gespeichert",authWelcome:"Willkommen",profileTitle:"Profil",profileStats:"Statistiken",profileBadges:"Abzeichen",profileWarBucks:"War Bucks",statsGamesPlayed:"Gespielte Spiele",statsGamesWon:"Gewonnen",statsGamesLost:"Verloren",statsWinRate:"Gewinnrate",statsTotalPoints:"Gesamtpunkte",statsPiecesEliminated:"Figuren eliminiert",statsEngineers:"Ingenieure erobert",noBadges:"Noch keine Abzeichen. Weiterspielen!",multiplayerButton:"Online Spielen",multiplayerTitle:"Online Spielen",onlinePlayers:"Spieler Online",noPlayersOnline:"Keine anderen Spieler online",sendInvite:"Einladung Senden",inviteSent:"Einladung gesendet!",pendingInvites:"Eingehende Einladungen",acceptInvite:"Annehmen",declineInvite:"Ablehnen",inviteFrom:"Einladung von",waitingForPlayers:"Warte auf Spieler...",waitingForOpponent:"Warte auf Gegner...",inviteDeclined:"hat deine Einladung abgelehnt",inviteSettings:"Spieleinstellungen",youAreYellow:"Du bist Gelb",youAreGreen:"Du bist Grün",yourTurn:"Du bist dran!",opponentsTurn:"Gegner ist am Zug",playerAvailable:"Verfügbar",playerPlaying:"Im Spiel",refreshList:"Aktualisieren",goOnline:"Online Gehen",goOfflineMulti:"Offline Gehen",youAreOnline:"Du bist online",youAreOfflineMulti:"Du bist offline",shopTitle:"Kriegsladen",shopBalance:"Guthaben",shopBuy:"Kaufen",shopOwned:"Besitz",shopEquip:"Ausrüsten",shopUnequip:"Ablegen",shopEquipped:"Ausgerüstet",noEquipped:"Keine Kosmetik ausgerüstet",shopPurchased:"Gekauft!",shopNotEnough:"Nicht genug War Bucks",shopThemes:"Brettthemen",shopSkins:"Figur-Skins",shopEffects:"Effekte",shopSounds:"Soundpakete",shopMusic:"Musikpakete",warPassTitle:"War Pass",warPassChallenges:"Herausforderungen",warPassProgress:"Fortschritt",warPassClaim:"Einlösen",warPassClaimed:"Eingelöst",warPassReward:"Belohnung",warPassCompleted:"Abgeschlossen!"},fr:{startTitle:"Échecs de Guerre",startButton:"Commencer",startVsPlayer:"vs Joueur",startVsBot:"vs Bot",botDifficultyLabel:"Difficulté Bot",botEasy:"Facile",botMedium:"Moyen",botHard:"Difficile",botThinking:"Le bot réfléchit...",settingsButton:"Paramètres",backButton:"Retour",languageLabel:"Langue",timerLabel:"Pendule d'échecs",timerOff:"Désactivé",timerOn:"Activé",timerMinutesLabel:"Minutes par joueur",timeUp:"Temps écoulé!",timeUpPenalty:"{team} n'a plus de temps! (-10 points)",soundLabel:"Effets sonores",musicLabel:"Musique",masterVolumeLabel:"Volume principal",musicVolumeLabel:"Volume musique",sfxVolumeLabel:"Volume effets",musicStyleLabel:"Style musique",styleEpic:"Épique",styleAmbient:"Calme",styleTension:"Suspense",styleElectronic:"Électronique",styleOrchestral:"Orchestral",styleRetro:"8-Bit Rétro",on:"Activé",off:"Désactivé",visualSettingsTitle:"Visuel",boardThemeLabel:"Thème du plateau",themeClassic:"Classique",themeDark:"Sombre",themeLight:"Clair",themeWood:"Bois",animationSpeedLabel:"Vitesse animation",speedFast:"Rapide",speedNormal:"Normal",speedSlow:"Lent",screenShakeLabel:"Secousse écran",showCoordinatesLabel:"Afficher coordonnées",accessibilityTitle:"Accessibilité",colorBlindLabel:"Mode daltonien",highContrastLabel:"Contraste élevé",largeUILabel:"Grande interface",fullscreenLabel:"Plein écran",yellowTurn:"Tour de JAUNE",greenTurn:"Tour de VERT",resetButton:"Réinitialiser",moveButton:"Déplacer",shootButton:"Tirer",exitButton:"Sortie",launchHelicopter:"Lancer Hélicoptère",noTargetsInRange:"Pas de cibles à portée!",selectTarget:"Sélectionnez une cible",mustLeaveTrench:"Le soldat DOIT quitter la tranchée! Cliquez sur une destination.",enteredTrench:"Tranchée entrée!",enteredTrenchTurn:"Tranchée entrée! (Tour {0}/3)",leftTrench:"Tranchée quittée!",enteredTunnel:"Tunnel entré!",exitedTunnel:"Tunnel quitté!",soldierTrapped:"Soldat piégé dans la tranchée - éliminé!",helicopterLaunched:"Hélicoptère lancé!",helicopterLanded:"Hélicoptère atterri sur le porte-avions!",selectHelipad:"Sélectionnez un héliport",noHelipads:"Pas d'héliports disponibles!",cannotMoveThere:"Vous ne pouvez pas aller là!",cannotShootThere:"Vous ne pouvez pas tirer là!",noTargetToShoot:"Pas de cible à tirer!",teamPieceBlocking:"Il y a déjà une pièce de votre équipe!",notYourTurn:"Ce n'est pas votre tour!",pieceFrozen:"Cette pièce est gelée!",rocketNotReady:"Fusée pas encore prête!",rocketUsed:"Cette fusée a déjà été utilisée!",selectRocketTarget:"Sélectionnez la cible (explosion 3x3)",rocketLaunching:"Fusée en lancement...",rocketExploded:"Fusée explosée!",selectHackTarget:"Sélectionnez une pièce ennemie à pirater",noHackTargets:"Pas de cibles à pirater",selectBombTarget:"Sélectionnez une pièce ennemie à bombarder",noBombTargets:"Pas de cibles à portée",cannotHackWater:"Impossible de pirater dans l'eau!",cannotHackOccupied:"Impossible de pirater - case occupée!",cannotHackEdge:"Impossible de pirater - bord du plateau!",hackerCooldown:"Pirate en recharge!",hackerNotReady:"Pirate pas encore prêt!",fighterIncoming:"Chasseur en approche...",droppingBomb:"Largage de bombe!",targetDestroyed:"Cible détruite!",builderChooseAction:"Constructeur: choisir action",builderWaitCooldown:"Constructeur: déplacer ou attendre",selectWhereToMove:"Sélectionnez où déplacer",cannotBuildBarricade:"Impossible de construire maintenant",selectPlaceBarricade:"Sélectionnez où placer barricade",cannotBuildArtillery:"Impossible de construire artillerie",selectPlaceArtillery:"Sélectionnez où placer artillerie",cannotBuildSpike:"Impossible de construire spike",selectPlaceSpike:"Sélectionnez où placer spike",artilleryNoTargets:"L'artillerie n'a pas de cibles!",clickToFireArtillery:"Cliquez pour tirer artillerie",barricadeInfo:"Barricade: bloque mouvement et tirs",noValidMoves:"Pas de mouvements valides",charging:"Chargement...",gameOverPoints:"gagne aux points!",gameOverBuilder:"gagne en capturant le Constructeur!",playAgain:"Rejouer",mainMenu:"Menu Principal",confirmReset:"Voulez-vous vraiment réinitialiser?",confirmYes:"Oui",confirmNo:"Non",confirmEnterTunnel:"Entrer dans le tunnel?",confirmExitTunnel:"Quitter le tunnel?",score:"Score",moves:"Coups",captured:"Capturé",yellowTeam:"Jaune",greenTeam:"Vert",yellowTurns:"Tours jaunes",greenTurns:"Tours verts",manualButton:"Comment jouer",manualTitle:"Comment jouer",manualWinTitle:"Comment gagner?",manualWinText:`Il y a deux façons de gagner:
• Avoir le plus de points après 80 coups chacun.
• Capturer l'Ingénieur.`,manualClockTitle:"Comment fonctionne l'horloge?",manualClockText:"L'horloge d'échecs peut être activée dans les paramètres. Pendant que vous réfléchissez, votre temps s'écoule. Quand vous jouez un coup, l'horloge passe à votre adversaire. Si votre temps est écoulé, 10 points sont déduits de votre score et la partie se termine. Minuteries disponibles: 1, 3, 5, 10, 15, 30 minutes.",manualPointsTitle:"Points",manualPointsText:"Vous gagnez des points en capturant les pièces adverses. Après 80 coups chacun, le joueur avec le plus de points gagne. Chaque pièce a sa propre valeur; par exemple, un soldat vaut 5 points.",manualMovesTitle:"Historique des coups",manualMovesText:"Tous les coups sont enregistrés sous le tableau des scores. Vous pouvez revoir votre partie pour analyser vos stratégies et décisions.",manualBigThreeTitle:"Les Trois Grands",manualBigThreeText:"Les Trois Grands sont les pièces les plus importantes du jeu:",manualHackerTitle:"Le Hacker",manualHackerText:"Le Hacker peut pirater une pièce après 10 coups. Appuyez sur le Hacker, puis sur une pièce adverse (surlignée en violet), et choisissez: Geler la pièce pendant 5 coups, la déplacer d'une case en avant, ou la déplacer d'une case en arrière. Le Hacker a un temps de recharge de 15 coups.",manualEngineerTitle:"L'Ingénieur",manualEngineerText:`L'Ingénieur peut placer des barricades, des pièges ou de l'artillerie. Appuyez sur l'Ingénieur et choisissez:

• Barricade: Un bouclier pour se cacher. Vous en avez 5. A un temps de recharge.
• Artillerie: Un canon qui tire sur une case aléatoire. Grande chance de toucher les adversaires, mais n'élimine pas vos pièces. Vous en avez 5. A un temps de recharge.
• Piège: Si un adversaire marche dessus, il est éliminé. Utile en fin de partie. Vous en avez 3. A un temps de recharge.`,manualBomberTitle:"Bombardier",manualBomberText:"Quand une pièce adverse entre dans votre moitié (avant la rivière), le Bombardier peut frapper! Appuyez sur le Bombardier, sélectionnez une cible (surlignée en orange), puis choisissez un lieu d'atterrissage (case verte avec avion). L'avion vole vers la cible, largue une bombe et atterrit à l'endroit choisi.",manualRulesTitle:"Règles",manualRulesText:`• Un Bombardier ne peut pas prendre un Bombardier
• Un Ingénieur ne peut pas prendre un Ingénieur
• Un Mitrailleur ne peut pas prendre un Mitrailleur
• Un Sous-marin ne peut pas prendre un Sous-marin
• Un Train ne peut pas prendre un Train
• Un Hélicoptère ne peut pas prendre un Hélicoptère
• Un Hacker ne peut pas pirater ou prendre un Hacker
• Une Fusée ne peut pas prendre une Fusée`,manualSpecialTitle:"Emplacements Spéciaux",manualSpecialText:`• Hélicoptère: Ne peut atterrir que sur les héliports (cases blanches) ou le porte-avions.
• Train: Ne peut se déplacer que sur les gares (cases orange).
• Soldat: Peut entrer dans la tranchée (case en bois) et le tunnel (lignes grises verticales). Aucune autre pièce ne peut y entrer.`,manualTrenchTitle:"Tranchée & Tunnel",manualTrenchText:`• Tranchée: Les soldats peuvent rester maximum 3 coups. À l'intérieur, ils ne peuvent pas être éliminés mais peuvent encore tirer. Après 3 coups, ils doivent sortir.
• Tunnel: Un moyen de transport pour les soldats. Vous ne pouvez pas tirer dans le tunnel. Utilisez les boutons "déplacer" et "tirer" pour changer.`,manualOtherTitle:"Autres Pièces",manualOtherText:`• Mitrailleur: Ne peut pas se déplacer. Peut seulement tirer 4 cases en avant.
• Fusée: Ne peut pas se déplacer avant le coup 45. Quand prête, appuyez dessus pour voir la portée. Elle élimine toutes les pièces dans la zone d'explosion. Un signe indique quand elle est prête.

Amusez-vous bien!`,authLogin:"Connexion",authRegister:"Créer un compte",authLogout:"Déconnexion",authOffline:"Jouer hors ligne",authEmail:"E-mail",authPassword:"Mot de passe",authUsername:"Nom d'utilisateur",authUsernameOrEmail:"Nom d'utilisateur ou E-mail",authLoginWithEmail:"Se connecter avec e-mail",authLoginWithUsername:"Se connecter avec nom d'utilisateur",authLoginButton:"Se connecter",authRegisterButton:"Créer un compte",authLoading:"Chargement...",authNoAccount:"Pas de compte?",authHaveAccount:"Déjà un compte?",authOfflineWarning:"Jeu hors ligne - la progression ne sera pas sauvegardée",authWelcome:"Bienvenue",profileTitle:"Profil",profileStats:"Statistiques",profileBadges:"Badges",profileWarBucks:"War Bucks",statsGamesPlayed:"Parties jouées",statsGamesWon:"Victoires",statsGamesLost:"Défaites",statsWinRate:"Taux de victoire",statsTotalPoints:"Points totaux",statsPiecesEliminated:"Pièces éliminées",statsEngineers:"Ingénieurs capturés",noBadges:"Pas encore de badges. Continuez à jouer!",multiplayerButton:"Jouer en Ligne",multiplayerTitle:"Jouer en Ligne",onlinePlayers:"Joueurs en Ligne",noPlayersOnline:"Aucun autre joueur en ligne",sendInvite:"Envoyer Invitation",inviteSent:"Invitation envoyée!",pendingInvites:"Invitations Reçues",acceptInvite:"Accepter",declineInvite:"Refuser",inviteFrom:"Invitation de",waitingForPlayers:"En attente de joueurs...",waitingForOpponent:"En attente de l'adversaire...",inviteDeclined:"a refusé votre invitation",inviteSettings:"Paramètres de jeu",youAreYellow:"Vous êtes Jaune",youAreGreen:"Vous êtes Vert",yourTurn:"À vous de jouer!",opponentsTurn:"Tour de l'adversaire",playerAvailable:"Disponible",playerPlaying:"En Jeu",refreshList:"Actualiser",goOnline:"Se Connecter",goOfflineMulti:"Se Déconnecter",youAreOnline:"Vous êtes en ligne",youAreOfflineMulti:"Vous êtes hors ligne",shopTitle:"Boutique de Guerre",shopBalance:"Solde",shopBuy:"Acheter",shopOwned:"Possédé",shopEquip:"Équiper",shopUnequip:"Déséquiper",shopEquipped:"Équipé",noEquipped:"Aucun cosmétique équipé",shopPurchased:"Acheté!",shopNotEnough:"Pas assez de War Bucks",shopThemes:"Thèmes de plateau",shopSkins:"Skins de pièces",shopEffects:"Effets",shopSounds:"Packs de sons",shopMusic:"Packs de musique",warPassTitle:"War Pass",warPassChallenges:"Défis",warPassProgress:"Progrès",warPassClaim:"Réclamer",warPassClaimed:"Réclamé",warPassReward:"Récompense",warPassCompleted:"Terminé!"},es:{startTitle:"Ajedrez de Guerra",startButton:"Iniciar Juego",startVsPlayer:"vs Jugador",startVsBot:"vs Bot",botDifficultyLabel:"Dificultad Bot",botEasy:"Fácil",botMedium:"Medio",botHard:"Difícil",botThinking:"El bot está pensando...",settingsButton:"Configuración",backButton:"Volver",languageLabel:"Idioma",timerLabel:"Reloj de ajedrez",timerOff:"Apagado",timerOn:"Encendido",timerMinutesLabel:"Minutos por jugador",timeUp:"¡Se acabó el tiempo!",timeUpPenalty:"¡{team} se quedó sin tiempo! (-10 puntos)",soundLabel:"Efectos de sonido",musicLabel:"Música",masterVolumeLabel:"Volumen principal",musicVolumeLabel:"Volumen música",sfxVolumeLabel:"Volumen efectos",musicStyleLabel:"Estilo música",styleEpic:"Épico",styleAmbient:"Tranquilo",styleTension:"Suspenso",styleElectronic:"Electrónico",styleOrchestral:"Orquestal",styleRetro:"8-Bit Retro",on:"Encendido",off:"Apagado",visualSettingsTitle:"Visual",boardThemeLabel:"Tema del tablero",themeClassic:"Clásico",themeDark:"Oscuro",themeLight:"Claro",themeWood:"Madera",animationSpeedLabel:"Velocidad animación",speedFast:"Rápido",speedNormal:"Normal",speedSlow:"Lento",screenShakeLabel:"Vibración pantalla",showCoordinatesLabel:"Mostrar coordenadas",accessibilityTitle:"Accesibilidad",colorBlindLabel:"Modo daltónico",highContrastLabel:"Alto contraste",largeUILabel:"UI grande",fullscreenLabel:"Pantalla completa",yellowTurn:"Turno de AMARILLO",greenTurn:"Turno de VERDE",resetButton:"Reiniciar",moveButton:"Mover",shootButton:"Disparar",exitButton:"Salida",launchHelicopter:"Lanzar Helicóptero",noTargetsInRange:"¡No hay objetivos en rango!",selectTarget:"Selecciona un objetivo",mustLeaveTrench:"¡El soldado DEBE salir de la trinchera! Haz clic en un destino.",enteredTrench:"¡Trinchera entrada!",enteredTrenchTurn:"¡Trinchera entrada! (Turno {0}/3)",leftTrench:"¡Trinchera abandonada!",enteredTunnel:"¡Túnel entrado!",exitedTunnel:"¡Túnel salido!",soldierTrapped:"¡Soldado atrapado en trinchera - eliminado!",helicopterLaunched:"¡Helicóptero lanzado!",helicopterLanded:"¡Helicóptero aterrizó en el portaaviones!",selectHelipad:"Selecciona un helipuerto",noHelipads:"¡No hay helipuertos disponibles!",cannotMoveThere:"¡No puedes ir ahí!",cannotShootThere:"¡No puedes disparar ahí!",noTargetToShoot:"¡No hay objetivo para disparar!",teamPieceBlocking:"¡Ya hay una pieza de tu equipo ahí!",notYourTurn:"¡No es tu turno!",pieceFrozen:"¡Esta pieza está congelada!",rocketNotReady:"¡Cohete no está listo!",rocketUsed:"¡Este cohete ya fue usado!",selectRocketTarget:"Selecciona objetivo (explosión 3x3)",rocketLaunching:"Cohete lanzando...",rocketExploded:"¡Cohete explotó!",selectHackTarget:"Selecciona pieza enemiga para hackear",noHackTargets:"No hay objetivos para hackear",selectBombTarget:"Selecciona pieza enemiga para bombardear",noBombTargets:"No hay objetivos en rango",cannotHackWater:"¡No se puede hackear al agua!",cannotHackOccupied:"¡No se puede hackear - casilla ocupada!",cannotHackEdge:"¡No se puede hackear - borde del tablero!",hackerCooldown:"¡Hacker recargando!",hackerNotReady:"¡Hacker no está listo!",fighterIncoming:"Caza en camino...",droppingBomb:"¡Lanzando bomba!",targetDestroyed:"¡Objetivo destruido!",builderChooseAction:"Constructor: elegir acción",builderWaitCooldown:"Constructor: mover o esperar",selectWhereToMove:"Selecciona dónde mover",cannotBuildBarricade:"No se puede construir barricada ahora",selectPlaceBarricade:"Selecciona dónde colocar barricada",cannotBuildArtillery:"No se puede construir artillería ahora",selectPlaceArtillery:"Selecciona dónde colocar artillería",cannotBuildSpike:"No se puede construir spike ahora",selectPlaceSpike:"Selecciona dónde colocar spike",artilleryNoTargets:"¡La artillería no tiene objetivos!",clickToFireArtillery:"Haz clic para disparar artillería",barricadeInfo:"Barricada: bloquea movimiento y disparos",noValidMoves:"No hay movimientos válidos",charging:"Cargando...",gameOverPoints:"¡gana por puntos!",gameOverBuilder:"¡gana capturando al Constructor!",playAgain:"Jugar de Nuevo",mainMenu:"Menú Principal",confirmReset:"¿Seguro que quieres reiniciar?",confirmYes:"Sí",confirmNo:"No",confirmEnterTunnel:"¿Entrar al túnel?",confirmExitTunnel:"¿Salir del túnel?",score:"Puntuación",moves:"Movimientos",captured:"Capturado",yellowTeam:"Amarillo",greenTeam:"Verde",yellowTurns:"Turnos amarillos",greenTurns:"Turnos verdes",manualButton:"Cómo jugar",manualTitle:"Cómo jugar",manualWinTitle:"¿Cómo ganar?",manualWinText:`Hay dos formas de ganar:
• Tener más puntos después de 80 movimientos cada uno.
• Capturar al Ingeniero.`,manualClockTitle:"¿Cómo funciona el reloj?",manualClockText:"El reloj de ajedrez se puede activar en configuración. Mientras piensas, tu tiempo corre. Cuando haces un movimiento, el reloj cambia a tu oponente. Si tu tiempo se agota, se deducen 10 puntos de tu puntuación y el juego termina. Temporizadores disponibles: 1, 3, 5, 10, 15, 30 minutos.",manualPointsTitle:"Puntos",manualPointsText:"Ganas puntos capturando piezas del oponente. Después de 80 movimientos cada uno, el jugador con más puntos gana. Cada pieza tiene su propio valor; por ejemplo, un soldado vale 5 puntos.",manualMovesTitle:"Historial de movimientos",manualMovesText:"Todos los movimientos se registran debajo del marcador. Puedes revisar tu partida para analizar tus estrategias y decisiones.",manualBigThreeTitle:"Los Tres Grandes",manualBigThreeText:"Los Tres Grandes son las piezas más importantes del juego:",manualHackerTitle:"El Hacker",manualHackerText:"El Hacker puede hackear una pieza después de 10 movimientos. Presiona el Hacker, luego una pieza enemiga (resaltada en púrpura), y elige: Congelar la pieza por 5 movimientos, moverla una casilla adelante, o moverla una casilla atrás. El Hacker tiene un tiempo de espera de 15 movimientos.",manualEngineerTitle:"El Ingeniero",manualEngineerText:`El Ingeniero puede colocar barricadas, trampas o artillería. Presiona el Ingeniero y elige:

• Barricada: Un escudo para esconderte. Tienes 5. Tiene tiempo de espera.
• Artillería: Un cañón que dispara a una casilla aleatoria. Gran probabilidad de golpear enemigos, pero no elimina tus piezas. Tienes 5. Tiene tiempo de espera.
• Trampa: Si un enemigo la pisa, es eliminado. Útil para el final. Tienes 3. Tiene tiempo de espera.`,manualBomberTitle:"Bombardero",manualBomberText:"Cuando una pieza enemiga entra en tu mitad (antes del río), ¡el Bombardero puede atacar! Presiona el Bombardero, selecciona un objetivo (resaltado en naranja), luego elige un lugar de aterrizaje (casilla verde con avión). El avión vuela hacia el objetivo, suelta una bomba y aterriza en tu lugar elegido.",manualRulesTitle:"Reglas",manualRulesText:`• Un Bombardero no puede capturar un Bombardero
• Un Ingeniero no puede capturar un Ingeniero
• Un Ametrallador no puede capturar un Ametrallador
• Un Submarino no puede capturar un Submarino
• Un Tren no puede capturar un Tren
• Un Helicóptero no puede capturar un Helicóptero
• Un Hacker no puede hackear o capturar un Hacker
• Un Cohete no puede capturar un Cohete`,manualSpecialTitle:"Ubicaciones Especiales",manualSpecialText:`• Helicóptero: Solo puede aterrizar en helipuertos (casillas blancas) o el portaaviones.
• Tren: Solo puede moverse en estaciones (casillas naranjas).
• Soldado: Puede entrar en la trinchera (casilla de madera) y el túnel (líneas grises verticales). Ninguna otra pieza puede entrar.`,manualTrenchTitle:"Trinchera & Túnel",manualTrenchText:`• Trinchera: Los soldados pueden quedarse máximo 3 movimientos. Adentro, no pueden ser eliminados pero pueden disparar. Después de 3 movimientos, deben salir.
• Túnel: Una forma de transportar soldados. No puedes disparar en el túnel. Usa los botones "mover" y "disparar" para cambiar.`,manualOtherTitle:"Otras Piezas",manualOtherText:`• Ametrallador: No puede moverse. Solo puede disparar 4 casillas adelante.
• Cohete: No puede moverse hasta el movimiento 45. Cuando esté listo, presiónalo para ver el alcance. Elimina todas las piezas en el área de explosión. Una señal muestra cuándo está listo.

¡Diviértete!`,authLogin:"Iniciar sesión",authRegister:"Crear cuenta",authLogout:"Cerrar sesión",authOffline:"Jugar sin conexión",authEmail:"Correo electrónico",authPassword:"Contraseña",authUsername:"Nombre de usuario",authUsernameOrEmail:"Usuario o correo electrónico",authLoginWithEmail:"Iniciar con correo electrónico",authLoginWithUsername:"Iniciar con nombre de usuario",authLoginButton:"Iniciar sesión",authRegisterButton:"Crear cuenta",authLoading:"Cargando...",authNoAccount:"¿No tienes cuenta?",authHaveAccount:"¿Ya tienes cuenta?",authOfflineWarning:"Jugando sin conexión - el progreso no se guardará",authWelcome:"Bienvenido",profileTitle:"Perfil",profileStats:"Estadísticas",profileBadges:"Insignias",profileWarBucks:"War Bucks",statsGamesPlayed:"Partidas jugadas",statsGamesWon:"Ganadas",statsGamesLost:"Perdidas",statsWinRate:"Tasa de victoria",statsTotalPoints:"Puntos totales",statsPiecesEliminated:"Piezas eliminadas",statsEngineers:"Ingenieros capturados",noBadges:"Sin insignias aún. ¡Sigue jugando!",multiplayerButton:"Jugar en Línea",multiplayerTitle:"Jugar en Línea",onlinePlayers:"Jugadores en Línea",noPlayersOnline:"No hay otros jugadores en línea",sendInvite:"Enviar Invitación",inviteSent:"¡Invitación enviada!",pendingInvites:"Invitaciones Pendientes",acceptInvite:"Aceptar",declineInvite:"Rechazar",inviteFrom:"Invitación de",waitingForPlayers:"Esperando jugadores...",waitingForOpponent:"Esperando al oponente...",inviteDeclined:"rechazó tu invitación",inviteSettings:"Ajustes del juego",youAreYellow:"Eres Amarillo",youAreGreen:"Eres Verde",yourTurn:"¡Tu turno!",opponentsTurn:"Turno del oponente",playerAvailable:"Disponible",playerPlaying:"En Juego",refreshList:"Actualizar",goOnline:"Conectarse",goOfflineMulti:"Desconectarse",youAreOnline:"Estás en línea",youAreOfflineMulti:"Estás desconectado",shopTitle:"Tienda de Guerra",shopBalance:"Saldo",shopBuy:"Comprar",shopOwned:"Comprado",shopEquip:"Equipar",shopUnequip:"Desequipar",shopEquipped:"Equipado",noEquipped:"Sin cosméticos equipados",shopPurchased:"¡Comprado!",shopNotEnough:"No hay suficientes War Bucks",shopThemes:"Temas de tablero",shopSkins:"Skins de piezas",shopEffects:"Efectos",shopSounds:"Paquetes de sonido",shopMusic:"Paquetes de música",warPassTitle:"War Pass",warPassChallenges:"Desafíos",warPassProgress:"Progreso",warPassClaim:"Reclamar",warPassClaimed:"Reclamado",warPassReward:"Recompensa",warPassCompleted:"¡Completado!"}},rp={en:"English",nl:"Nederlands",de:"Deutsch",fr:"Français",es:"Español"};function E(r){return tp[_a][r]||tp.en[r]||r}const He=11,J=50,Mt=30,X=["A","B","C","D","E","F","G","H","I","J","K"];let tt=null;function X4(){const r=t=>{const n={type:t.type,team:t.team,col:t.col,row:t.row,points:t.points};return t.inTrench&&(n.inTrench=t.inTrench),t.trenchEnteredOnTurn!==void 0&&(n.trenchEnteredOnTurn=t.trenchEnteredOnTurn),t.inTunnel&&(n.inTunnel=t.inTunnel),t.hp!==void 0&&(n.hp=t.hp),t.hasHelicopter&&(n.hasHelicopter=t.hasHelicopter),t.onCarrier&&(n.onCarrierId=Y.indexOf(t.onCarrier)),t.used&&(n.used=t.used),t.cooldownTurns!==void 0&&(n.cooldownTurns=t.cooldownTurns),t.frozenTurns!==void 0&&(n.frozenTurns=t.frozenTurns),t.barricadesBuilt!==void 0&&(n.barricadesBuilt=t.barricadesBuilt),t.artilleryBuilt!==void 0&&(n.artilleryBuilt=t.artilleryBuilt),t.spikesBuilt!==void 0&&(n.spikesBuilt=t.spikesBuilt),t.barricadeCooldown!==void 0&&(n.barricadeCooldown=t.barricadeCooldown),t.artilleryCooldown!==void 0&&(n.artilleryCooldown=t.artilleryCooldown),t.spikeCooldown!==void 0&&(n.spikeCooldown=t.spikeCooldown),t.turnsRemaining!==void 0&&(n.turnsRemaining=t.turnsRemaining),n},e={pieces:Y.map(r),capturedPieces:Fe.map(r),currentTurn:_e,yellowTurnCount:$e,greenTurnCount:me,gameState:Ce,moveLog:Le};return Je&&(e.winner=Je),Kr&&(e.winReason=Kr),JSON.parse(JSON.stringify(e))}function np(r){const e=(n,i)=>{const s={type:n.type,team:n.team,col:n.col,row:n.row,points:n.points};return n.inTrench&&(s.inTrench=n.inTrench),n.trenchEnteredOnTurn!==void 0&&(s.trenchEnteredOnTurn=n.trenchEnteredOnTurn),n.inTunnel&&(s.inTunnel=n.inTunnel),n.hp!==void 0&&(s.hp=n.hp),n.hasHelicopter&&(s.hasHelicopter=n.hasHelicopter),n.used&&(s.used=n.used),n.cooldownTurns!==void 0&&(s.cooldownTurns=n.cooldownTurns),n.frozenTurns!==void 0&&(s.frozenTurns=n.frozenTurns),n.barricadesBuilt!==void 0&&(s.barricadesBuilt=n.barricadesBuilt),n.artilleryBuilt!==void 0&&(s.artilleryBuilt=n.artilleryBuilt),n.spikesBuilt!==void 0&&(s.spikesBuilt=n.spikesBuilt),n.barricadeCooldown!==void 0&&(s.barricadeCooldown=n.barricadeCooldown),n.artilleryCooldown!==void 0&&(s.artilleryCooldown=n.artilleryCooldown),n.spikeCooldown!==void 0&&(s.spikeCooldown=n.spikeCooldown),n.turnsRemaining!==void 0&&(s.turnsRemaining=n.turnsRemaining),s};Y.length=0;const t=r.pieces.map(n=>e(n));r.pieces.forEach((n,i)=>{n.onCarrierId!==void 0&&n.onCarrierId>=0&&(t[i].onCarrier=t[n.onCarrierId])}),t.forEach(n=>Y.push(n)),Fe.length=0,r.capturedPieces.forEach(n=>Fe.push(e(n))),_e=r.currentTurn,$e=r.yellowTurnCount,me=r.greenTurnCount,Ce=r.gameState,Je=r.winner||null,Kr=r.winReason||null,r.moveLog&&(Le.length=0,r.moveLog.forEach(n=>Le.push(n))),Ae&&(Bt=_e===Ae,Qr=!Bt)}async function ip(){if(!Ne||!Ae)return;const r=X4(),e=Ae;console.log("[MP SYNC] Syncing state:",{gameId:Ne,currentTurn:_e,lastMoveBy:e,piecesCount:r.pieces.length}),U="⏳ Syncing move...",M();const t=await Ok(Ne,r,_e,e);console.log("[MP SYNC] Sync result:",t),t?U="✅ Waiting for opponent...":U="❌ Sync failed! Try refreshing.",M(),Ce==="gameOver"&&Je&&await Fk(Ne,Je)}function Sr(r){return Fe.filter(n=>n.team!==r).reduce((n,i)=>n+i.points,0)-(r==="yellow"?Xu:ed)}let Le=[],Fe=[],Ce="start",Je=null,Kr=null;const Ka=80;let $e=0,me=0,D=null,ue=[],ut=[],U=null,_e="yellow",tr=null,Jt=null,ar=null,se=null,ro=[],zt=null,pt=null,ii=[],Ue=null,lt=null;const td=45,r0=10,eT=15,n0=10,tT=7,rT=4,Os=3,Ea=3,Zi=10,nT=5,iT=10,wr=5,i0=5,sT=3,s0=5,oT=1,aT=4,lT=10,cT=15,sp=5,o0=3,uT=1;let br=[],It=null,Mn=!1,vr=[],nr=null,Or=[],$o=!1,fi=!1,Ke=null,Yr=!1,lr=[],ir=[];function rd(r){return(r==="yellow"?$e:me)>=td}function a0(r){return(r==="yellow"?$e:me)>=r0}function dT(r){for(const e of Y)e.team===r&&e.frozenTurns&&e.frozenTurns>0&&(e.frozenTurns-=1,e.frozenTurns===0&&(e.frozenTurns=void 0))}function hT(r){for(const e of Y)(e.type==="hacker"||e.type==="fighter")&&e.team===r&&e.cooldownTurns&&e.cooldownTurns>0&&(e.cooldownTurns-=1,e.cooldownTurns===0&&(e.cooldownTurns=void 0))}function fT(r){for(const e of Y)e.type==="builder"&&e.team===r&&(e.barricadeCooldown&&e.barricadeCooldown>0&&(e.barricadeCooldown-=1,e.barricadeCooldown===0&&(e.barricadeCooldown=void 0)),e.artilleryCooldown&&e.artilleryCooldown>0&&(e.artilleryCooldown-=1,e.artilleryCooldown===0&&(e.artilleryCooldown=void 0)),e.spikeCooldown&&e.spikeCooldown>0&&(e.spikeCooldown-=1,e.spikeCooldown===0&&(e.spikeCooldown=void 0)))}function pT(r){for(let e=Y.length-1;e>=0;e--){const t=Y[e];t.type==="spike"&&t.team===r&&t.turnsRemaining&&(t.turnsRemaining-=1,t.turnsRemaining<=0&&Y.splice(e,1))}}function l0(){if(Ce!=="playing"||_e!=="green"||!Wt)return;Ks=!0,U=E("botThinking"),M();const r=kl();if(r){const o=_n(r).filter(c=>!yo(c.col,c.row));if(o.length>0){let c=o[0],l=-1/0;for(const u of o){let f=0;if(u.canCapture){const d=ke(u.col,u.row);d&&(f+=$t(d))}Fs(r,u.col,u.row)||(f+=10),f>l&&(l=f,c=u)}setTimeout(()=>{Ks=!1,D=r;const u=ke(c.col,c.row);if(u&&u.team!==r.team){const f=Y.indexOf(u);f!==-1&&(Y.splice(f,1),Fe.push(u),Ir(u,r.team))}ei(c.col,c.row,u||null)},300*Ar());return}else{setTimeout(()=>{Ks=!1,U=E("soldierTrapped");const c=Y.indexOf(r);Y.splice(c,1),Fe.push(r),Le.push({from:`${r.col}${r.row}`,to:`${r.col}${r.row}`,piece:r.type,team:r.team,captured:"trapped"}),me++,st(),M()},300*Ar());return}}const e=Y.filter(o=>o.team==="green"&&!o.frozenTurns),t=Y.filter(o=>o.team==="yellow"),n=[],i=gT("green");for(const o of e){let c=[];switch(o.type){case"soldier":c=_n(o);const l=wo(o);for(const h of l){const p=ke(h.col,h.row);if(p&&p.team==="yellow"){let g=$t(p)*1.8;no(p,o.col,o.row)&&(g+=$t(o)*.5),i.some(b=>b.piece===o)||(g+=5),n.push({piece:o,action:"shoot",target:h,score:g})}}break;case"train":c=ld(o);break;case"tank":c=xl(o);const u=bo(o);for(const h of u){const p=ke(h.col,h.row);if(p&&p.team==="yellow"){let g=$t(p)*1.5;no(p,o.col,o.row)&&(g+=$t(o)*.5),i.some(b=>b.piece===o)||(g+=5),n.push({piece:o,action:"shoot",target:h,score:g})}}break;case"ship":c=cd(o);break;case"carrier":c=w0(o);break;case"helicopter":c=dd(o);break;case"machinegun":const f=vo(o);for(const h of f){const p=ke(h.col,h.row);if(p&&p.team==="yellow"){let g=$t(p)*1.5;no(p,o.col,o.row)&&(g+=$t(o)*.5),i.some(b=>b.piece===o)||(g+=5),n.push({piece:o,action:"shoot",target:h,score:g})}}break;case"suv":c=$0(o);break;case"sub":c=y0(o);break;case"rocket":const d=b0(o);for(const h of d){const p=ud(h.col,h.row);let g=0;for(const w of p){const b=ke(w.col,w.row);b&&b.team==="yellow"&&(g+=$t(b))}g>0&&n.push({piece:o,action:"launch",target:h,score:g*1.2})}break;case"artillery":n.push({piece:o,action:"artillery",score:8});break;case"fighter":if(u0("green")&&!d0(o)){const h=h0(o);for(const p of h){const g=f0(p.col,p.row);if(g.length>0){let w=g[0],b=-1e3;for(const P of g){let z=0;Fs(o,P.col,P.row)||(z+=10),z+=P.row*.5,z>b&&(b=z,w=P)}n.push({piece:o,action:"bomb",bombTarget:p,landingSpot:w,score:$t(p)*2})}}}break;case"hacker":if(a0("green")&&!c0(o)){const h=t.filter(p=>p.type!=="hacker"&&p.type!=="rocket"&&p.type!=="machinegun"&&!(p.type==="soldier"&&(p.inTunnel||p.inTrench)));for(const p of h){n.push({piece:o,action:"hack",hackTarget:p,hackAction:"freeze",score:$t(p)*.8});const g=p.team==="yellow"?1:-1,w=p.row+g,b=p.row-g;if(w>=1&&w<=11){const P=w===6&&p.col!=="F"&&p.type!=="ship"&&p.type!=="carrier"&&p.type!=="sub",z=ke(p.col,w);!P&&!z&&n.push({piece:o,action:"hack",hackTarget:p,hackAction:"forward",score:$t(p)*.6})}if(b>=1&&b<=11){const P=b===6&&p.col!=="F"&&p.type!=="ship"&&p.type!=="carrier"&&p.type!=="sub",z=ke(p.col,b);!P&&!z&&n.push({piece:o,action:"hack",hackTarget:p,hackAction:"backward",score:$t(p)*.6})}}}break;case"builder":if(c=id(o),bl(o)){const h=Ya(o);for(const p of h){let g=5;for(const w of e)w.col===p.col&&Math.abs(w.row-p.row)<=2&&(g+=$t(w)*.3);for(const w of t)(w.type==="machinegun"||w.type==="soldier")&&p.col===w.col&&e.filter(P=>P.col===p.col).length>0&&(g+=8);n.push({piece:o,action:"build",target:p,buildType:"barricade",score:g})}}if(vl(o)){const h=Ya(o);for(const p of h){let g=15;p.row>=8&&(g+=5),n.push({piece:o,action:"build",target:p,buildType:"artillery",score:g})}}break}for(const l of c){let u=0;const f=ke(l.col,l.row);f&&f.team==="yellow"&&(u+=$t(f)*wt.aggressionLevel,e0(o.type,"capture"),Fs(o,l.col,l.row)||(u+=$t(f)*.5)),i.some(P=>P.piece===o)&&(Fs(o,l.col,l.row)?u-=5:u+=$t(o)*.8*wt.threatAvoidance);const h=Fs(o,l.col,l.row);h&&!f&&(u-=$t(o)*.6*wt.threatAvoidance),(o.type==="soldier"||o.type==="tank")&&(h||(u+=(11-l.row)*.5*wt.aggressionLevel));const p=o.col,g=o.row;o.col=l.col,o.row=l.row;let w=0;o.type==="soldier"?w=wo(o).length:o.type==="tank"?w=bo(o).length:o.type==="machinegun"&&(w=vo(o).length),o.col=p,o.row=g,w>0&&!h&&(u+=w*3),u*=R4(o.type,"move");const b=$r==="easy"?15:$r==="medium"?8:2;u+=Math.random()*b,n.push({piece:o,action:"move",target:l,score:u})}}n.sort((o,c)=>c.score-o.score);let s=null;if(n.length>0)if($r==="easy")if(Math.random()<.3)s=n[0];else{const o=n.slice(0,Math.max(1,Math.floor(n.length*.6)));s=o[Math.floor(Math.random()*o.length)]}else if($r==="medium")if(Math.random()<.6)s=n[0];else{const o=n.slice(0,Math.max(1,Math.floor(n.length*.3)));s=o[Math.floor(Math.random()*o.length)]}else Math.random()<.9||n.length===1?s=n[0]:s=n[1];setTimeout(()=>{Ks=!1,mT(s)},300*Ar())}function mT(r){if(!r){wc();return}if(!Y.includes(r.piece)){console.log("Bot: piece no longer exists, skipping"),wc();return}let e=!1;try{if(r.action==="move"&&r.target){D=r.piece;const t=ke(r.target.col,r.target.row);if(t&&t.team!==r.piece.team){if(t.type==="carrier"&&t.hp&&t.hp>1){t.hp-=1,t.hasHelicopter&&(t.hasHelicopter=!1),U=`Bot rammed carrier! (${t.hp} HP left)`,Le.push({from:`${r.piece.col}${r.piece.row}`,to:`${r.target.col}${r.target.row}`,piece:r.piece.type,team:r.piece.team,captured:"hit"}),r.piece.team==="yellow"?$e++:me++,st(),D=null,M(),e=!0;return}const n=Y.indexOf(t);n!==-1&&(Y.splice(n,1),Fe.push(t),Ir(t,r.piece.team))}ei(r.target.col,r.target.row,t||null),e=!0}else if(r.action==="shoot"&&r.target){D=r.piece,r.piece.type==="tank"?ut=bo(r.piece):r.piece.type==="machinegun"?ut=vo(r.piece):r.piece.type==="soldier"&&(ut=wo(r.piece));const t=ut.some(i=>i.col===r.target.col&&i.row===r.target.row),n=ke(r.target.col,r.target.row)||Bo(r.target.col,r.target.row);t&&n&&(k0(r.target.col,r.target.row),e=!0)}else r.action==="launch"&&r.target?(T0(r.piece,r.target.col,r.target.row),e=!0):r.action==="artillery"?(Xc(r.piece),e=!0):r.action==="hack"&&r.hackTarget&&r.hackAction?Y.includes(r.hackTarget)&&(D=r.piece,It=r.hackTarget,Aa(r.hackAction),e=!0):r.action==="bomb"&&r.bombTarget&&r.landingSpot?Y.includes(r.bombTarget)&&(D=r.piece,x0(r.piece,r.bombTarget,r.landingSpot.col,r.landingSpot.row),e=!0):r.action==="build"&&r.target&&r.buildType&&(D=r.piece,Ke=r.buildType,E0(r.target.col,r.target.row),e=!0)}catch(t){console.error("Bot move error:",t)}e?(e0(r.piece.type,r.action),Jg()):(console.log("Bot: move failed, skipping turn"),wc())}function wc(){_e==="green"&&me++,st(),M()}function gT(r){const e=[],t=Y.filter(i=>i.team===r),n=Y.filter(i=>i.team!==r);for(const i of t){const s=[];for(const o of n)no(o,i.col,i.row)&&s.push(o);s.length>0&&e.push({piece:i,threats:s})}return e}function no(r,e,t){if(r.frozenTurns)return!1;switch(r.type){case"soldier":{const n=_n(r),i=wo(r);return n.some(s=>s.col===e&&s.row===t&&s.canCapture)||i.some(s=>s.col===e&&s.row===t)}case"tank":{const n=xl(r),i=bo(r);return n.some(s=>s.col===e&&s.row===t)||i.some(s=>s.col===e&&s.row===t)}case"train":return ld(r).some(i=>i.col===e&&i.row===t&&i.canCapture);case"machinegun":return vo(r).some(i=>i.col===e&&i.row===t);case"helicopter":return dd(r).some(i=>i.col===e&&i.row===t&&i.canCapture);default:return!1}}function Fs(r,e,t){const n=Y.filter(i=>i.team!==r.team);for(const i of n)if(no(i,e,t))return!0;return!1}function $t(r){return{soldier:5,tank:15,ship:12,carrier:20,helicopter:10,train:15,machinegun:10,suv:8,sub:12,rocket:18,fighter:15,hacker:15,builder:100,artillery:8,barricade:2,spike:1}[r.type]||r.points}function st(){if(as&&ct){const e=Yc;Yc=null,ET(e||void 0);return}const r=_e==="yellow"?"green":"yellow";if(_e=r,dT(r),hT(r),fT(r),pT(r),Ne&&Ae&&(Bt=_e===Ae,Qr=!Bt,Qr&&ip()),$e>=Ka&&me>=Ka){const e=Sr("yellow"),t=Sr("green");e>t?Je="yellow":t>e?Je="green":Je="yellow",Kr="points",Ce="gameOver",us(),be("win"),Wt&&Xg(Je==="green"),nd(),Ne&&ip()}Wt&&_e==="green"&&Ce==="playing"&&setTimeout(()=>{l0()},500*Ar())}function Ir(r,e){r.type==="builder"&&(Je=e,Kr="builder",Ce="gameOver",us(),be("win"),Wt&&Xg(Je==="green"),nd())}async function nd(){if(Wc()||!Xt()||!Zt())return;const r=Zt(),e=Sr("yellow"),t=Sr("green"),n=Je==="yellow",i=e,o=Math.abs(i-t),c=Fe.filter(w=>w.team==="green").length,l=Fe.filter(w=>w.team==="green"&&w.type==="builder").length,u={...r.stats,gamesPlayed:r.stats.gamesPlayed+1,gamesWon:r.stats.gamesWon+(n?1:0),gamesLost:r.stats.gamesLost+(n?0:1),totalPointsScored:r.stats.totalPointsScored+i,piecesEliminated:r.stats.piecesEliminated+c,engineersCaptured:r.stats.engineersCaptured+l},f=Rk(n,o),d=r.warBucks+f,h={...r,stats:u,warBucks:d},p=Bg(h),g=[...r.badges,...p];await cn({stats:u,warBucks:d,badges:g}),console.log(`Game saved! +${f} War Bucks${p.length>0?`, New badges: ${p.join(", ")}`:""}`)}function c0(r){return(r.cooldownTurns??0)>0}function $T(r){return r.cooldownTurns??0}function u0(r){return(r==="yellow"?$e:me)>=n0}function d0(r){return(r.cooldownTurns??0)>0}function yT(r){return r.cooldownTurns??0}function h0(r){const e=[],t=X.indexOf(r.col),n=[{dc:0,dr:1},{dc:0,dr:-1},{dc:1,dr:0},{dc:-1,dr:0},{dc:1,dr:1},{dc:-1,dr:1},{dc:1,dr:-1},{dc:-1,dr:-1}];for(const i of n)for(let s=1;s<=rT;s++){const o=t+i.dc*s,c=r.row+i.dr*s;if(o<0||o>=11||c<1||c>11)break;const l=X[o],u=ke(l,c);if(u){u.team!==r.team&&e.push(u);break}}return e}function f0(r,e){const t=[],n=X.indexOf(r);for(let i=-Os;i<=Os;i++)for(let s=-Os;s<=Os;s++){const o=e+i,c=n+s;if(c<0||c>=11||o<1||o>11||Math.max(Math.abs(i),Math.abs(s))>Os)continue;const u=X[c];o===6&&u!=="F"||ke(u,o)||t.push({col:u,row:o})}return t}function id(r){const e=[],t=X.indexOf(r.col),n=[{dc:0,dr:1},{dc:0,dr:-1},{dc:1,dr:0},{dc:-1,dr:0},{dc:1,dr:1},{dc:-1,dr:1},{dc:1,dr:-1},{dc:-1,dr:-1}];for(const i of n){const s=t+i.dc,o=r.row+i.dr;if(s<0||s>=11||o<1||o>11)continue;const c=X[s];if(o===6&&c!=="F")continue;Yt(c,o)?ds(r,c,o)&&e.push({col:c,row:o,canCapture:!1}):e.push({col:c,row:o,canCapture:!1})}return e}function bl(r){return!((r.team==="yellow"?$e:me)<Ea||(r.barricadesBuilt??0)>=i0||(r.barricadeCooldown??0)>0||Y.filter(n=>n.type==="barricade"&&n.team===r.team).length>=sT)}function vl(r){return!((r.team==="yellow"?$e:me)<Zi||(r.artilleryBuilt??0)>=s0||(r.artilleryCooldown??0)>0||Y.filter(n=>n.type==="artillery"&&n.team===r.team).length>=oT)}function Ya(r){const e=[],t=X.indexOf(r.col);for(let n=-wr;n<=wr;n++)for(let i=-wr;i<=wr;i++){const s=r.row+n,o=t+i;if(o<0||o>=11||s<1||s>11)continue;const c=Math.max(Math.abs(n),Math.abs(i));if(c>wr||c===0)continue;const l=X[o];s===6&&l!=="F"||ke(l,s)||e.push({col:l,row:s})}return e}function wT(r){return Y.filter(e=>e.type==="spike"&&e.team===r).length}function sd(r){return!((r.team==="yellow"?$e:me)<lT||(r.spikesBuilt??0)>=o0||(r.spikeCooldown??0)>0||wT(r.team)>=uT)}function bT(r,e){const t=r;return!!(e===6||r==="F"&&(e===5||e===6||e===7)||(r==="E"||r==="G")&&e===6||(t==="C"||t==="I")&&(e===5||e===7)||(t==="E"||t==="G")&&(e===4||e===8)||t==="F"&&(e===3||e===9)||(t==="A"||t==="K")&&(e===1||e===2||e===10||e===11)||["A","B","C"].includes(t)&&e>=3&&e<=4||["I","J","K"].includes(t)&&e>=3&&e<=4||["A","B","C"].includes(t)&&e>=8&&e<=9||["I","J","K"].includes(t)&&e>=8&&e<=9)}function vT(r){const e=[],t=X.indexOf(r.col);for(let n=-wr;n<=wr;n++)for(let i=-wr;i<=wr;i++){const s=r.row+n,o=t+i;if(o<0||o>=11||s<1||s>11)continue;const c=Math.max(Math.abs(n),Math.abs(i));if(c>wr||c===0)continue;const l=X[o];bT(l,s)||ke(l,s)||e.push({col:l,row:s})}return e}function od(r,e,t,n){const i=X.indexOf(r),s=X.indexOf(t),o=Math.sign(s-i),c=Math.sign(n-e);let l=i+o,u=e+c;for(;l!==s||u!==n;){if(Bo(X[l],u))return!0;l+=o,u+=c}return!1}function ad(r,e,t,n){return!!(od(r,e,t,n)||Bo(t,n))}function Xc(r){const e=r.team,t=e==="yellow"?[7,8,9,10,11]:[1,2,3,4,5],n=X.indexOf(r.col),i=[];for(const l of t)for(let u=0;u<11;u++){const f=X[u];if(Math.max(Math.abs(u-n),Math.abs(l-r.row))>aT||l===6&&f!=="F")continue;const h=ke(f,l);i.push({col:f,row:l,piece:h||void 0})}if(i.length===0){U=E("artilleryNoTargets");return}const s=i[Math.floor(Math.random()*i.length)],o=["train","helicopter","tank","ship","sub","soldier","suv","hacker","fighter","builder","carrier"],c=Y.indexOf(r);c!==-1&&Y.splice(c,1),ar={col:s.col,row:s.row},D=null,be("explosion"),No(),M(),setTimeout(()=>{const l=ke(s.col,s.row);if(l&&o.includes(l.type))if(Math.random()<.33){const d=Y.indexOf(l);d!==-1&&(Y.splice(d,1),Fe.push(l),U=`🎯 Artillery HIT ${l.type} at ${s.col}${s.row}! (+${l.points} points)`)}else U=`💨 Artillery fired at ${l.type} at ${s.col}${s.row} - missed! (33% accuracy)`;else l?U=`💥 Artillery fired at ${s.col}${s.row} - ${l.type} is immune!`:U=`💥 Artillery fired at empty square ${s.col}${s.row}`;ar=null,e==="yellow"?$e++:me++,st(),M()},500*Ar())}function kl(){const r=_e==="yellow"?$e:me;for(const e of Y)if(e.team===_e&&e.type==="soldier"&&e.inTrench&&e.trenchEnteredOnTurn!==void 0&&r-e.trenchEnteredOnTurn>=3)return e;return null}function Tl(){return[{type:"train",team:"yellow",col:"K",row:1,points:10},{type:"train",team:"yellow",col:"A",row:1,points:10},{type:"train",team:"green",col:"A",row:11,points:10},{type:"train",team:"green",col:"K",row:11,points:10},{type:"tank",team:"yellow",col:"B",row:2,points:15},{type:"tank",team:"yellow",col:"J",row:2,points:15},{type:"tank",team:"green",col:"B",row:10,points:15},{type:"tank",team:"green",col:"J",row:10,points:15},{type:"ship",team:"yellow",col:"B",row:1,points:12},{type:"ship",team:"yellow",col:"J",row:1,points:12},{type:"ship",team:"green",col:"B",row:11,points:12},{type:"ship",team:"green",col:"J",row:11,points:12},{type:"carrier",team:"yellow",col:"C",row:1,points:20,hp:1,hasHelicopter:!1},{type:"carrier",team:"yellow",col:"I",row:1,points:20,hp:1,hasHelicopter:!1},{type:"carrier",team:"green",col:"C",row:11,points:20,hp:1,hasHelicopter:!1},{type:"carrier",team:"green",col:"I",row:11,points:20,hp:1,hasHelicopter:!1},{type:"helicopter",team:"yellow",col:"A",row:2,points:8},{type:"helicopter",team:"yellow",col:"K",row:2,points:8},{type:"helicopter",team:"green",col:"A",row:10,points:8},{type:"helicopter",team:"green",col:"K",row:10,points:8},{type:"rocket",team:"yellow",col:"D",row:1,points:25,used:!1},{type:"rocket",team:"yellow",col:"H",row:1,points:25,used:!1},{type:"rocket",team:"green",col:"D",row:11,points:25,used:!1},{type:"rocket",team:"green",col:"H",row:11,points:25,used:!1},{type:"machinegun",team:"yellow",col:"D",row:2,points:25},{type:"machinegun",team:"yellow",col:"H",row:2,points:25},{type:"machinegun",team:"green",col:"D",row:10,points:25},{type:"machinegun",team:"green",col:"H",row:10,points:25},{type:"suv",team:"yellow",col:"C",row:2,points:20},{type:"suv",team:"yellow",col:"I",row:2,points:20},{type:"suv",team:"green",col:"C",row:10,points:20},{type:"suv",team:"green",col:"I",row:10,points:20},{type:"hacker",team:"yellow",col:"E",row:1,points:30},{type:"hacker",team:"green",col:"E",row:11,points:30},{type:"sub",team:"yellow",col:"A",row:6,points:12},{type:"sub",team:"green",col:"K",row:6,points:12},{type:"fighter",team:"yellow",col:"G",row:1,points:40},{type:"fighter",team:"green",col:"G",row:11,points:40},{type:"builder",team:"yellow",col:"F",row:1,points:0,barricadesBuilt:0,artilleryBuilt:0,spikesBuilt:0},{type:"builder",team:"green",col:"F",row:11,points:0,barricadesBuilt:0,artilleryBuilt:0,spikesBuilt:0},{type:"soldier",team:"yellow",col:"E",row:2,points:5},{type:"soldier",team:"yellow",col:"F",row:2,points:5},{type:"soldier",team:"yellow",col:"G",row:2,points:5},{type:"soldier",team:"green",col:"E",row:10,points:5},{type:"soldier",team:"green",col:"F",row:10,points:5},{type:"soldier",team:"green",col:"G",row:10,points:5}]}async function op(){Ce="playing",await Yi(),_t=await Gg(),Yg(),fn&&(Vr=Gr*60,Dr=Gr*60,p0()),K&&await Ni(),M()}async function bc(){if(!wn||!Ae||!Ne||mr)return;mr=!0,Fg(),zg(),qg(),Og(),Wt=!1,Y.length=0,Tl().forEach(e=>Y.push(e)),Fe.length=0,Le.length=0,$e=0,me=0,Ce="playing",_e="yellow",Je=null,Kr=null,ye="none",Wn=!1,Bt=Ae==="yellow",Qr=!Bt,wn.timerEnabled&&(fn=!0,Gr=wn.timerMinutes||10,Vr=Gr*60,Dr=Gr*60,p0()),Qa||(Qa=!0,ni=!0,Xn=[],u4(Ne,e=>{Xn=e;const t=document.getElementById("chat-messages");t&&(t.scrollTop=t.scrollHeight),M()})),await Yi(),_t=await Gg(),Yg(),K&&await Ni();let r=0;Ta(Ne,e=>{if(!e){console.log("[MP LISTEN] No game data received");return}console.log("[MP LISTEN] Game update received:",{moveCount:e.moveCount,lastMoveBy:e.lastMoveBy,currentTurn:e.currentTurn,myTeam:Ae,lastSeenMoveCount:r});const t=e.lastMoveBy&&e.lastMoveBy!==Ae,n=(e.moveCount||0)>r;if(console.log("[MP LISTEN] Move check:",{opponentMoved:t,isNewMove:n,hasGameState:!!e.gameState}),e.gameState&&t&&n){r=e.moveCount||0,console.log("[MP LISTEN] Applying opponent move, new lastSeenMoveCount:",r);const i=e.gameState,s=i.moveLog||[],o=s[s.length-1];if(o&&o.from&&o.to&&o.from!==o.to){let c=function(){const P=Date.now()-w,z=Math.min(P/b,1);pt&&(pt.progress=z),M(),z<1?requestAnimationFrame(c):(pt=null,ar=null,np(i),U=Ae==="yellow"?`✅ ${E("youAreYellow")} - ${E("yourTurn")}`:`✅ ${E("youAreGreen")} - ${E("yourTurn")}`,M())};const l=o.from[0],u=parseInt(o.from.slice(1)),f=o.to[0],d=parseInt(o.to.slice(1));U="📥 Opponent moving...",M();const h=o.piece,p=o.team;if(pt={piece:{type:h,team:p,col:l,row:u,points:0},fromCol:l,fromRow:u,toCol:f,toRow:d,progress:0},o.captured)be("capture");else switch(h){case"soldier":be("walk");break;case"tank":case"suv":be("engine");break;case"train":be("train");break;case"ship":case"sub":case"carrier":be("boat");break;case"helicopter":be("helicopter");break;case"hacker":be("hack");break;default:be("move")}o.captured&&(ar={col:f,row:d},Jc(30+X.indexOf(f)*50+25,(11-d)*50+25,20)),M();const w=Date.now(),b=300*Ar();requestAnimationFrame(c)}else np(i),be("move"),U=Ae==="yellow"?`✅ ${E("youAreYellow")} - ${E("yourTurn")}`:`✅ ${E("youAreGreen")} - ${E("yourTurn")}`,M()}else!t&&!n&&e.gameState&&console.log("[MP LISTEN] Ignoring: own move or old move");if(e.currentTurn&&Ae){const i=e.currentTurn===Ae;Bt!==i&&(Bt=i,Qr=!i,M())}e.status==="finished"&&e.winner&&Ce!=="gameOver"&&(Je=e.winner,Ce="gameOver",us(),be("win"),M()),e.status==="abandoned"&&e.leftBy&&e.leftBy!==Ae&&(os||(os=!0,Vi=!0,us(),be("click"),M()))}),U=Ae==="yellow"?`${E("youAreYellow")} - ${E("yourTurn")}`:`${E("youAreGreen")} - ${E("opponentsTurn")}`,M()}function p0(){Ki&&clearInterval(Ki),Ki=window.setInterval(()=>{Ce==="playing"&&(_e==="yellow"?(Vr--,Vr<=10&&Vr>0&&be("tick"),Vr<=0&&(Vr=0,ap("yellow"))):(Dr--,Dr<=10&&Dr>0&&be("tick"),Dr<=0&&(Dr=0,ap("green"))),M())},1e3)}function us(){Ki&&(clearInterval(Ki),Ki=null)}function ap(r){us(),be("explosion"),No(),r==="yellow"?Xu+=Zf:ed+=Zf;const e=Sr("yellow"),t=Sr("green");e>t?Je="yellow":t>e?Je="green":Je=r==="yellow"?"green":"yellow",Kr="points",Ce="gameOver",U=E("timeUpPenalty").replace("{team}",E(r==="yellow"?"yellowTeam":"greenTeam")),be("win"),nd(),M()}function lp(r){const e=Math.floor(r/60),t=r%60;return`${e}:${t.toString().padStart(2,"0")}`}function kT(){Ce="confirmReset",M()}function TT(){Ce="playing",M()}const eu=r=>X[r]||"A";function m0(r){ct=r,Kc=0,mo=r.maxMoves,Qi=0,as=!0,go=!1,Y.length=0;for(const e of r.initialBoard){const t=e.team==="blue"?"yellow":"green";Y.push({type:e.type,col:eu(e.position.col),row:e.position.row,team:t,points:1})}_e="yellow",Ce="playing",D=null,ue=[],ut=[],U=null,Fe=[],Le=[],ye="none",M()}function tu(){as&&(as=!1,ct=null,mo=0,Qi=0,go=!1,ye="puzzles",Y.length=0,Y.push(...Tl()),_e="yellow",M())}function xT(){if(!ct||Qi>=ct.aiMoves.length)return;const r=ct.aiMoves[Qi],e=eu(r.from.col),t=eu(r.to.col),n=Y.find(i=>i.row===r.from.row&&i.col===e&&i.team==="green");if(n){const i=Y.find(s=>s.row===r.to.row&&s.col===t&&s.team!=="green");if(i){const s=Y.indexOf(i);s>-1&&Y.splice(s,1)}n.col=t,n.row=r.to.row}Qi++,_T()}function _T(){return ct&&ct.objectiveType==="capture"&&!Y.some(e=>e.type===ct.targetPieceType&&e.team==="green")?(go=!0,!0):!1}async function ET(r){if(!(!ct||!as)){if(Kc++,mo--,ct.objectiveType==="capture"&&r===ct.targetPieceType){go=!0;const e=await h4(ct.id,!0,Kc);setTimeout(()=>{alert(`🎉 Puzzle Solved!

You earned ${e.warBucks} War Bucks!${e.perfect?`
⭐ Perfect Solve!`:""}`),tu()},500);return}Qi<ct.aiMoves.length&&setTimeout(()=>{xT(),_e="yellow",M()},500),mo<=0&&!go&&setTimeout(()=>{confirm(`❌ Out of moves!

Try again?`)?m0(ct):tu()},500)}}async function ca(){Ne&&Ae&&!os&&(await zk(Ne,Ae),Qc(),jg(),Qa=!1,Xn=[],ni=!1),os=!1,Vi=!1,Y.length=0,Y.push(...Tl()),Le=[],Fe=[],D=null,ue=[],ut=[],ii=[],Ue=null,lt=null,br=[],It=null,Mn=!1,vr=[],nr=null,Or=[],$o=!1,fi=!1,Ke=null,ir=[],Yr=!1,lr=[],U=null,_e="yellow",Ce="start",tt=null,$e=0,me=0,Je=null,Kr=null,us(),Vr=Gr*60,Dr=Gr*60,Xu=0,ed=0,Ne=null,Ae=null,wn=null,mr=!1,Bt=!1,Qr=!1,dt(),T4(),_t=[],M()}function AT(r){return X.indexOf(r.col)<=2?"left":"right"}function IT(r,e,t){const n=X.indexOf(r);return t==="left"?n>2?!1:r==="A"&&(e===1||e===2||e===10||e===11)||e>=3&&e<=4&&n<=2||e>=8&&e<=9&&n<=2:n<8?!1:r==="K"&&(e===1||e===2||e===10||e===11)||e>=3&&e<=4&&n>=8||e>=8&&e<=9&&n>=8}function ld(r){const e=[],t=AT(r),n=X.indexOf(r.col),i=[{dc:0,dr:1},{dc:0,dr:-1},{dc:1,dr:0},{dc:-1,dr:0}];for(const s of i){let o=n+s.dc,c=r.row+s.dr;for(;o>=0&&o<11&&c>=1&&c<=11;){const l=X[o];if(!IT(l,c,t))break;const u=Yt(l,c);if(u){ds(r,l,c)?e.push({col:l,row:c,canCapture:!1}):u.team!==r.team&&e.push({col:l,row:c,canCapture:!0});break}else e.push({col:l,row:c,canCapture:!1});o+=s.dc,c+=s.dr}}return e}function ru(r,e){return r==="E"&&e>=4&&e<=8||r==="G"&&e>=4&&e<=8}function yo(r,e){return r==="F"&&(e===3||e===9)}function _n(r){const e=[],t=X.indexOf(r.col);if(r.inTunnel){const i=r.col,s=r.row+1,o=r.row-1;if(ru(i,s)){const c=ke(i,s);(!c||!c.inTunnel)&&e.push({col:i,row:s,canCapture:!1})}if(ru(i,o)){const c=ke(i,o);(!c||!c.inTunnel)&&e.push({col:i,row:o,canCapture:!1})}return e}const n=[{dc:0,dr:1},{dc:0,dr:-1},{dc:1,dr:0},{dc:-1,dr:0}];for(const i of n){const s=t+i.dc,o=r.row+i.dr;if(s<0||s>=11||o<1||o>11)continue;const c=X[s],l=Yt(c,o);if(!(o===6&&c!=="F")){if(l){ds(r,c,o)&&e.push({col:c,row:o,canCapture:!1});continue}e.push({col:c,row:o,canCapture:!1})}}return e}function g0(r){return r.inTunnel?v0(r.col,r.row):!1}function wo(r){const e=[];if(r.inTunnel){const n=r.col,i=r.team==="yellow"?1:-1;for(const s of[1,2]){const o=r.row+s*i;if(!ru(n,o))continue;const c=ke(n,o);c&&c.team!==r.team&&c.type==="soldier"&&c.inTunnel&&e.push({col:n,row:o})}return e}const t=r.team==="yellow"?1:-1;for(const n of[1,2]){const i=r.row+n*t;if(i<1||i>11)continue;const s=Bo(r.col,i);if(s&&s.team!==r.team){od(r.col,r.row,r.col,i)||e.push({col:r.col,row:i});continue}if(ad(r.col,r.row,r.col,i))continue;const o=ke(r.col,i);o&&o.team!==r.team&&!o.inTrench&&!o.inTunnel&&e.push({col:r.col,row:i})}return e}function xl(r){const e=[],t=X.indexOf(r.col),n=[{dc:0,dr:1},{dc:0,dr:-1},{dc:1,dr:0},{dc:-1,dr:0}];for(const i of n)for(let s=1;s<=2;s++){const o=t+i.dc*s,c=r.row+i.dr*s;if(o<0||o>=11||c<1||c>11)break;const l=X[o];if(c===6&&l!=="F")break;if(s===2){const f=t+i.dc,d=r.row+i.dr,h=X[f];if(d===6&&h!=="F"||Yt(h,d))break}if(Yt(l,c)){ds(r,l,c)&&e.push({col:l,row:c,canCapture:!1});break}e.push({col:l,row:c,canCapture:!1})}return e}function $0(r){const e=[],t=X.indexOf(r.col),n=[{dc:0,dr:1},{dc:0,dr:-1},{dc:1,dr:0},{dc:-1,dr:0}],i=[{dc:1,dr:1},{dc:-1,dr:1},{dc:1,dr:-1},{dc:-1,dr:-1}];for(const s of n)for(let o=1;o<=2;o++){const c=t+s.dc*o,l=r.row+s.dr*o;if(c<0||c>=11||l<1||l>11)break;const u=X[c];if(l===6&&u!=="F")break;if(o===2){const d=t+s.dc,h=r.row+s.dr,p=X[d];if(h===6&&p!=="F"||Yt(p,h))break}const f=Yt(u,l);if(f){ds(r,u,l)?e.push({col:u,row:l,canCapture:!1}):f.team!==r.team&&e.push({col:u,row:l,canCapture:!0});break}e.push({col:u,row:l,canCapture:!1})}for(const s of i)for(let o=1;o<=2;o++){const c=t+s.dc*o,l=r.row+s.dr*o;if(c<0||c>=11||l<1||l>11)break;const u=X[c];if(l===6&&u!=="F")break;if(o===2){const d=t+s.dc,h=r.row+s.dr,p=X[d];if(h===6&&p!=="F"||Yt(p,h))break}if(Yt(u,l)){ds(r,u,l)&&e.push({col:u,row:l,canCapture:!1});break}e.push({col:u,row:l,canCapture:!1})}return e}function y0(r){const e=[],t=X.indexOf(r.col),n=[-1,1];for(const i of n)for(let s=1;s<=2;s++){const o=t+s*i;if(o<0||o>=11)break;const c=X[o];if(s===2){const u=t+i,f=X[u];if(ke(f,6)&&f!=="F")break}const l=ke(c,6);if(l){l.team!==r.team&&e.push({col:c,row:6,canCapture:!0});break}else e.push({col:c,row:6,canCapture:!1})}return e}function bo(r){const e=[],t=X.indexOf(r.col),n=[{dc:1,dr:1},{dc:-1,dr:1},{dc:1,dr:-1},{dc:-1,dr:-1}];for(const i of n)for(const s of[1,2]){const o=t+i.dc*s,c=r.row+i.dr*s;if(o<0||o>=11||c<1||c>11)continue;const l=X[o];if(od(r.col,r.row,l,c))continue;const u=ke(l,c);u&&u.team!==r.team&&(u.type==="barricade"||!u.inTrench&&!u.inTunnel)&&e.push({col:l,row:c})}return e}function cd(r){const e=[],t=X.indexOf(r.col),n=[{dc:0,dr:1},{dc:0,dr:-1},{dc:1,dr:0},{dc:-1,dr:0}];for(const i of n)for(let s=1;s<=2;s++){const o=t+i.dc*s,c=r.row+i.dr*s;if(o<0||o>=11||c<1||c>11)break;const l=X[o];if(s===2){const f=t+i.dc,d=r.row+i.dr,h=X[f];if(ke(h,d))break}if(ke(l,c))break;e.push({col:l,row:c,canCapture:!1})}return e}function CT(r){const e=[],t=X.indexOf(r.col),n=[{dc:0,dr:1},{dc:0,dr:-1},{dc:1,dr:0},{dc:-1,dr:0}];for(const i of n)for(const s of[1,2]){const o=t+i.dc*s,c=r.row+i.dr*s;if(o<0||o>=11||c<1||c>11)continue;const l=X[o];if(ad(r.col,r.row,l,c))continue;const u=ke(l,c);u&&u.team!==r.team&&!u.inTrench&&!u.inTunnel&&e.push({col:l,row:c})}return e}function w0(r){const e=[],t=X.indexOf(r.col),n=[{dc:0,dr:1},{dc:0,dr:-1},{dc:1,dr:0},{dc:-1,dr:0}];for(const i of n)for(let s=1;s<=2;s++){const o=t+i.dc*s,c=r.row+i.dr*s;if(o<0||o>=11||c<1||c>11)break;const l=X[o];if(s===2){const f=t+i.dc,d=r.row+i.dr,h=X[f];if(ke(h,d))break}const u=ke(l,c);if(u){u.team!==r.team&&e.push({col:l,row:c,canCapture:!0});break}e.push({col:l,row:c,canCapture:!1})}return e}function vo(r){const e=[],t=r.team==="yellow"?1:-1;for(let n=1;n<=4;n++){const i=r.row+n*t;if(i<1||i>11||ad(r.col,r.row,r.col,i))break;const s=ke(r.col,i);if(s){s.team!==r.team&&!s.inTrench&&!s.inTunnel&&e.push({col:r.col,row:i});break}}return e}function b0(r){if(r.used)return[];if(!rd(r.team))return[];const e=[];for(let t=2;t<=10;t++)for(let n=1;n<=9;n++){const i=X[n];e.push({col:i,row:t})}return e}function ud(r,e){const t=[],n=X.indexOf(r);for(let i=-1;i<=1;i++)for(let s=-1;s<=1;s++){const o=e+i,c=n+s;o>=1&&o<=11&&c>=0&&c<11&&t.push({col:X[c],row:o})}return t}function dd(r){const e=[],t=[{col:"C",row:5},{col:"C",row:7},{col:"I",row:5},{col:"I",row:7}];for(const n of t){if(n.col===r.col&&n.row===r.row)continue;const i=Yt(n.col,n.row);i?i.team!==r.team&&i.type!=="helicopter"&&e.push({col:n.col,row:n.row,canCapture:!0}):e.push({col:n.col,row:n.row,canCapture:!1})}for(const n of Y)if(n.type==="carrier"&&n.team===r.team){if(n.col===r.col&&n.row===r.row)continue;n.hasHelicopter||e.push({col:n.col,row:n.row,canCapture:!1})}return e}function ST(){if(!D||D.type!=="carrier"||!D.hasHelicopter)return;const r=[{col:"C",row:5},{col:"C",row:7},{col:"I",row:5},{col:"I",row:7}];lr=[];for(const e of r){const t=Yt(e.col,e.row);(!t||t.team!==D.team&&t.type!=="helicopter")&&lr.push(e)}if(lr.length===0){U=E("noHelipads"),M();return}Yr=!0,fi=!1,ue=[],U=E("selectHelipad"),M()}function RT(r,e){if(!D||D.type!=="carrier"||!Yr)return;be("helicopter");const t=D,n=Yt(r,e);if(n&&n.team!==t.team){const s=Y.indexOf(n);s!==-1&&(Y.splice(s,1),Fe.push(n),Ir(n,t.team))}const i={type:"helicopter",team:t.team,col:r,row:e,points:8};Y.push(i),t.hasHelicopter=!1,t.hp!==void 0&&t.hp>1&&(t.hp-=1),Le.push({from:`${t.col}${t.row}`,to:`${r}${e}`,piece:"helicopter",team:t.team,captured:n?n.type:"launched"}),U=n?`Helicopter launched and captured ${n.type}!`:"Helicopter launched!",t.team==="yellow"?$e++:me++,st(),D=null,ue=[],Yr=!1,lr=[],fi=!1,M()}function PT(r){if(r.team!==_e){U=`It's ${_e}'s turn! You cannot move ${r.team}'s pieces.`,M();return}if(r.frozenTurns&&r.frozenTurns>0){U=`This piece is frozen! (${r.frozenTurns} turns left)`,M();return}const e=kl();if(e&&r!==e){U=`Soldier at ${e.col}${e.row} MUST leave the trench first!`,M();return}if(D=r,U=null,tt=null,ut=[],br=[],be("click"),It=null,Mn=!1,vr=[],nr=null,Or=[],$o=!1,fi=!1,Ke=null,ir=[],Yr=!1,lr=[],r.type==="train")ue=ld(r);else if(r.type==="soldier"){const t=r.team==="yellow"?$e:me,n=r.inTrench&&r.trenchEnteredOnTurn!==void 0?t-r.trenchEnteredOnTurn:0;if(r.inTrench&&n>=3)if(tt="move",ue=_n(r).filter(i=>!yo(i.col,i.row)),ue.length===0){U=E("soldierTrapped");const i=Y.indexOf(r);Y.splice(i,1),Fe.push(r),Le.push({from:`${r.col}${r.row}`,to:`${r.col}${r.row}`,piece:r.type,team:r.team,captured:"trapped"}),D=null,_e==="yellow"?$e++:me++,st(),M();return}else U="⚠️ MUST leave trench NOW! (3 turns reached)";else r.inTrench?(tt="move",ue=_n(r),U=`In trench (${n}/3 turns) - Click to exit`):(tt="move",ue=_n(r))}else if(r.type==="tank")tt="move",ue=xl(r);else if(r.type==="ship")tt="move",ue=cd(r);else if(r.type==="carrier")ue=w0(r),fi=r.hasHelicopter===!0;else if(r.type==="helicopter")ue=dd(r);else if(r.type==="rocket")r.used?(U=E("rocketUsed"),ue=[]):rd(r.team)?(ii=b0(r).map(t=>({col:t.col,row:t.row})),U=E("selectRocketTarget"),ue=[]):(U=`Rocket not ready yet! (${r.team==="yellow"?$e:me}/${td} turns)`,ue=[]);else if(r.type==="machinegun")ue=[],ut=vo(r),ut.length===0?U=E("noBombTargets"):U=E("selectTarget"),tt="shoot";else if(r.type==="suv")ue=$0(r);else if(r.type==="sub")ue=y0(r),ue.length===0&&(U=E("noValidMoves"));else if(r.type==="hacker")ue=[],br=[],It=null,Mn=!1,a0(r.team)?c0(r)?U=`Hacker on cooldown! (${$T(r)} turns)`:(br=Y.filter(t=>t.team!==r.team&&t.type!=="hacker"&&t.type!=="rocket"&&t.type!=="machinegun"&&!(t.type==="soldier"&&t.inTunnel)),br.length===0?U=E("noHackTargets"):U=E("selectHackTarget")):U=`Hacker not ready yet! (${r.team==="yellow"?$e:me}/${r0} turns)`;else if(r.type==="fighter")ue=[],vr=[],nr=null,Or=[],u0(r.team)?d0(r)?U=`Fighter on cooldown! (${yT(r)} turns)`:(vr=h0(r),vr.length===0?U=E("noBombTargets"):U=E("selectBombTarget")):U=`Fighter not ready yet! (${r.team==="yellow"?$e:me}/${n0} turns)`;else if(r.type==="builder"){ue=id(r),$o=!0,Ke=null,ir=[],Yr=!1,lr=[];const t=bl(r),n=vl(r),i=sd(r);if(!t&&!n&&!i){const s=r.team==="yellow"?$e:me;s<Ea?U=`Builder ready at turn ${Ea} (${s}/${Ea})`:U=E("builderWaitCooldown")}else U=E("builderChooseAction")}else if(r.type==="artillery"){ue=[];const t=r.team==="yellow"?$e:me;t<Zi?U=`Artillery ready at turn ${Zi} (${t}/${Zi})`:U=E("clickToFireArtillery")}else r.type==="barricade"&&(ue=[],U=E("barricadeInfo"));M()}function cp(r){D&&(D.type!=="soldier"&&D.type!=="tank"&&D.type!=="ship"||(tt=r,r==="move"?(D.type==="soldier"?ue=_n(D):D.type==="tank"?ue=xl(D):D.type==="ship"&&(ue=cd(D)),ut=[],U=null):r==="shoot"&&(ue=[],D.type==="soldier"?ut=wo(D):D.type==="tank"?ut=bo(D):D.type==="ship"&&(ut=CT(D)),ut.length===0?U=E("noTargetsInRange"):U=null),M()))}function v0(r,e){return(r==="E"||r==="G")&&(e===4||e===8)}function LT(r,e){if(!D)return;const t=ue.find(i=>i.col===r&&i.row===e);if(!t){U=E("cannotMoveThere"),M();return}const n=ke(r,e);if(n){if(D.type==="helicopter"&&n.type==="carrier"&&n.team===D.team){n.hasHelicopter=!0,n.hp!==void 0&&(n.hp+=1);const i=Y.indexOf(D);Y.splice(i,1),U=E("helicopterLanded"),Le.push({from:`${D.col}${D.row}`,to:`${r}${e}`,piece:D.type,team:D.team}),D.team==="yellow"?$e++:me++,st(),D=null,ue=[],M();return}if(n.type==="barricade"&&n.team===D.team){ei(r,e,null);return}if(D.type==="soldier"&&D.inTunnel&&!t.canCapture){ei(r,e,null);return}if(n.type==="soldier"&&n.inTunnel){ei(r,e,null);return}if(n.team===D.team){U=E("teamPieceBlocking"),M();return}else if(D.type==="train"){MT(D,n,r,e);return}else if(D.type==="carrier"){const i=Y.indexOf(n);Y.splice(i,1),Fe.push(n),Ir(n,D.team),U=`Rammed enemy ${n.type} (+${n.points} points)!`;const s=X.indexOf(D.col),c=X.indexOf(r)-s,l=e-D.row;let u=r,f=e;Math.abs(c)===2?u=X[s+c/2]:Math.abs(l)===2?f=D.row+l/2:(u=D.col,f=D.row),Le.push({from:`${D.col}${D.row}`,to:`${u}${f}`,piece:D.type,team:D.team,captured:n.type,capturedPoints:n.points}),D.col=u,D.row=f,D.team==="yellow"?$e++:me++,st(),D=null,ue=[],M();return}else if(n.type==="carrier")if(n.hp&&n.hp>1){n.hp-=1,n.hasHelicopter?(n.hasHelicopter=!1,U=`Rammed carrier! Helicopter destroyed! (${n.hp} HP left)`):U=`Rammed carrier! (${n.hp} HP left)`,Le.push({from:`${D.col}${D.row}`,to:`${r}${e}`,piece:D.type,team:D.team,captured:"hit"});const i=X.indexOf(D.col),o=X.indexOf(r)-i,c=e-D.row;let l=D.col,u=D.row;Math.abs(o)===2?l=X[i+o/2]:Math.abs(c)===2&&(u=D.row+c/2),D.col=l,D.row=u,D.team==="yellow"?$e++:me++,st(),D=null,ue=[],M();return}else{const i=Y.indexOf(n);Y.splice(i,1),Fe.push(n),Ir(n,D.team),U=`Destroyed carrier! (+${n.points} points)!`}else{const i=Y.indexOf(n);Y.splice(i,1),Fe.push(n),Ir(n,D.team),U=`Captured enemy ${n.type} (+${n.points} points)!`}}if(D.type==="soldier"&&!D.inTunnel&&v0(r,e)){tr={col:r,row:e},Ce="confirmTunnel",M();return}ei(r,e,null)}function MT(r,e,t,n){const i=r.team,s=r.col,o=r.row;zt={train:r,targetCol:t,targetRow:n,phase:"moving"},U=E("charging"),M();const c=400,l=Date.now();function u(){const f=Date.now()-l,d=Math.min(f/c,1);if(zt&&(zt.phase="moving",zt.progress=d),M(),d<1)requestAnimationFrame(u);else{zt={...zt,phase:"impact"},ar={col:t,row:n},be("explosion"),No();const h=Y.indexOf(e);Y.splice(h,1),Fe.push(e),Ir(e,i),M(),setTimeout(()=>{zt=null,ar=null,r.col=t,r.row=n,U=`Ran over enemy ${e.type} (+${e.points} points)!`,Le.push({from:`${s}${o}`,to:`${t}${n}`,piece:r.type,team:i,captured:e.type,capturedPoints:e.points}),i==="yellow"?$e++:me++,st(),D=null,ue=[],tt=null,M()},500*Ar())}}requestAnimationFrame(u)}function ei(r,e,t){if(!D)return;const n=D,i=n.team,s=n.col,o=n.row;if(t&&(Yc=t.type),t){be("capture");const h=30+X.indexOf(r)*50+25,p=(11-e)*50+25;Jc(h,p,20)}else switch(n.type){case"soldier":be("walk");break;case"tank":case"suv":be("engine");break;case"train":be("train");break;case"ship":case"sub":case"carrier":be("boat");break;case"helicopter":be("helicopter");break;case"hacker":be("hack");break;case"builder":be("build");break;default:be("move")}pt={piece:n,fromCol:s,fromRow:o,toCol:r,toRow:e,progress:0},D=null,ue=[],tt=null,M();const c=M4(),l=Date.now();let u=0;function f(){const d=Date.now()-l,h=Math.min(d/c,1);if(pt&&(pt.progress=h,d-u>50)){u=d;const p=X.indexOf(s),g=X.indexOf(r),w=p+(g-p)*h,b=o+(e-o)*h,P=30+w*50+25,z=(11-b)*50+25;Jc(P,z,3)}if(Zg(1/60),M(),h<1)requestAnimationFrame(f);else{if(pt=null,Le.push({from:`${s}${o}`,to:`${r}${e}`,piece:n.type,team:i,captured:t?.type,capturedPoints:t?.points}),n.type==="soldier"&&!n.inTrench&&yo(r,e)){const p=i==="yellow"?$e:me;n.inTrench=!0,n.trenchEnteredOnTurn=p,U=E("enteredTrenchTurn").replace("{0}","0")}else n.type==="soldier"&&n.inTrench&&!yo(r,e)&&(n.inTrench=!1,n.trenchEnteredOnTurn=void 0,U=E("leftTrench"));n.col=r,n.row=e,i==="yellow"?$e++:me++,st(),M(),ar&&setTimeout(()=>{ar=null,M()},500*Ar())}}requestAnimationFrame(f)}function VT(){if(!D||!tr)return;const r=D.team,e=`${D.col}${D.row}`;D.col=tr.col,D.row=tr.row,D.inTunnel=!0,Le.push({from:e,to:`${tr.col}${tr.row}`,piece:D.type,team:r}),U=E("enteredTunnel"),r==="yellow"?$e++:me++,D=null,ue=[],tt=null,tr=null,Ce="playing",st(),M()}function DT(){if(!D||!tr)return;U=null,Ce="playing";const r=tr.col,e=tr.row;tr=null,ei(r,e,null)}function NT(){!D||!g0(D)||(Jt=D,Ce="confirmTunnelExit",M())}function BT(){if(!Jt)return;const r=Jt.team;Jt.inTunnel=!1,Le.push({from:`${Jt.col}${Jt.row} (tunnel)`,to:`${Jt.col}${Jt.row}`,piece:Jt.type,team:r}),U=E("exitedTunnel"),r==="yellow"?$e++:me++,D=null,ue=[],tt=null,Jt=null,Ce="playing",st(),M()}function OT(){Jt=null,Ce="playing",M()}function k0(r,e){if(!D)return;if(!ut.find(c=>c.col===r&&c.row===e)){U=E("cannotShootThere"),M();return}const i=Bo(r,e)||GT(r,e);if(!i){U=E("noTargetToShoot"),M();return}const s=D,o=s.team;if(be("shoot"),V4(s.col,s.row,r,e),i.type==="barricade"){const c=Y.indexOf(i);Y.splice(c,1),U="Destroyed enemy barricade!",Le.push({from:`${s.col}${s.row}`,to:`${r}${e}`,piece:s.type,team:o,captured:"barricade"}),o==="yellow"?$e++:me++,st(),D=null,ue=[],ut=[],tt=null,M();return}if(i.type==="carrier"&&i.hp&&i.hp>1)i.hp-=1,i.hasHelicopter?(i.hasHelicopter=!1,U=`Hit carrier! Helicopter destroyed! (${i.hp} HP left)`):U=`Hit carrier! (${i.hp} HP left)`,Le.push({from:`${s.col}${s.row}`,to:`${r}${e}`,piece:s.type,team:o,captured:"hit"});else{const c=Y.indexOf(i);Y.splice(c,1),Fe.push(i),Ir(i,o),U=`Shot enemy ${i.type} (+${i.points} points)!`,Le.push({from:`${s.col}${s.row}`,to:`${r}${e}`,piece:s.type,team:o,captured:i.type,capturedPoints:i.points})}o==="yellow"?$e++:me++,st(),D=null,ue=[],ut=[],tt=null,M()}function T0(r,e,t){const n=r.team;be("rocket"),Ue={rocket:r,targetCol:e,targetRow:t,phase:"launching",progress:0},U=E("rocketLaunching"),M();const i=Ar(),s=600*i,o=400*i,c=800*i,l=Date.now();function u(){const f=Date.now()-l;if(f<s)Ue.phase="launching",Ue.progress=f/s,M(),requestAnimationFrame(u);else if(f<s+o)Ue.phase="flying",Ue.progress=(f-s)/o,M(),requestAnimationFrame(u);else if(f<s+o+c)Ue.phase="exploding",Ue.progress=(f-s-o)/c,Ue.progress<.1&&FT(e,t,n),M(),requestAnimationFrame(u);else{Ue=null;const d=Y.indexOf(r);d!==-1&&Y.splice(d,1),Le.push({from:`${r.col}${r.row}`,to:`${e}${t}`,piece:r.type,team:n,captured:"explosion"}),n==="yellow"?$e++:me++,st(),D=null,ii=[],U=null,M()}}requestAnimationFrame(u)}function FT(r,e,t){const n=ud(r,e),i=[];for(const o of n){const c=ke(o.col,o.row);c&&i.push(c)}let s=0;for(const o of i)if(o.team!==t&&!(o.type==="builder"||o.type==="fighter"||o.type==="hacker"||o.type==="rocket")){if(o.type==="soldier"||o.type==="helicopter"||o.type==="ship"||o.type==="train"||o.type==="tank"||o.type==="machinegun"||o.type==="suv"||o.type==="sub"){const c=Y.indexOf(o);c!==-1&&(Y.splice(c,1),Fe.push(o),Ir(o,t),o.team!==t&&(s+=o.points))}else if(o.type==="carrier")if(o.hp&&o.hp>1)o.hp-=1,o.hasHelicopter&&(o.hasHelicopter=!1);else{const c=Y.indexOf(o);c!==-1&&(Y.splice(c,1),Fe.push(o),o.team!==t&&(s+=o.points))}}be("explosion"),No(),s>0?U=`Rocket exploded! (+${s} points)`:U=E("rocketExploded")}function Aa(r){if(!D||D.type!=="hacker"||!It)return;const e=D,t=It,n=e.team;if(t.type==="soldier"&&t.inTrench){U="Cannot hack soldier in trench!",M();return}if(t.type==="sub")if(r==="forward"){const s=X.indexOf(t.col)+1;if(s<11){const o=X[s];if(!ke(o,6))t.col=o,t.frozenTurns=1,U=`Hacked ${t.type} right! (frozen 1 turn)`;else{U=E("cannotHackOccupied"),M();return}}else{U=E("cannotHackEdge"),M();return}}else if(r==="backward"){const s=X.indexOf(t.col)-1;if(s>=0){const o=X[s];if(!ke(o,6))t.col=o,t.frozenTurns=1,U=`Hacked ${t.type} left! (frozen 1 turn)`;else{U=E("cannotHackOccupied"),M();return}}else{U=E("cannotHackEdge"),M();return}}else r==="freeze"&&(t.frozenTurns=5,U=`Froze ${t.type} for 5 turns!`);else{const i=t.team==="yellow"?1:-1;if(r==="forward"){const s=t.row+i;if(s>=1&&s<=11)if(ke(t.col,s)){U=E("cannotHackOccupied"),M();return}else{if(s===6&&t.col!=="F"&&t.type!=="ship"&&t.type!=="carrier"){U=E("cannotHackWater"),M();return}t.row=s,t.frozenTurns=1,U=`Hacked ${t.type} forward! (frozen 1 turn)`}else{U=E("cannotHackEdge"),M();return}}else if(r==="backward"){const s=t.row-i;if(s>=1&&s<=11)if(ke(t.col,s)){U=E("cannotHackOccupied"),M();return}else{if(s===6&&t.col!=="F"&&t.type!=="ship"&&t.type!=="carrier"){U=E("cannotHackWater"),M();return}t.row=s,t.frozenTurns=1,U=`Hacked ${t.type} backward! (frozen 1 turn)`}else{U=E("cannotHackEdge"),M();return}}else r==="freeze"&&(t.frozenTurns=5,U=`Froze ${t.type} for 5 turns!`)}be("hack"),Le.push({from:`${e.col}${e.row}`,to:`${t.col}${t.row}`,piece:e.type,team:n,captured:`hack-${r}`}),e.cooldownTurns=eT,n==="yellow"?$e++:me++,st(),D=null,br=[],It=null,Mn=!1,M()}function zT(){It=null,Mn=!1,U=E("selectHackTarget"),M()}function x0(r,e,t,n){const i=r.col,s=r.row;D=null,vr=[],nr=null,Or=[],be("plane"),lt={fighter:r,startCol:i,startRow:s,targetCol:e.col,targetRow:e.row,landingCol:t,landingRow:n,target:e,phase:"flyToTarget",progress:0},U=E("fighterIncoming"),_0()}function _0(){if(!lt)return;const{fighter:r,startCol:e,startRow:t,targetCol:n,targetRow:i,landingCol:s,landingRow:o,target:c,phase:l}=lt;if(lt.progress+=.05,l==="flyToTarget")lt.progress>=1&&(lt.phase="bombing",lt.progress=0,U=E("droppingBomb"));else if(l==="bombing"){if(lt.progress>=1){const u=Y.indexOf(c);u!==-1&&(Y.splice(u,1),Fe.push(c),Ir(c,r.team)),lt.phase="flyToLanding",lt.progress=0,U=E("targetDestroyed")}}else if(l==="flyToLanding"&&lt.progress>=1){qT();return}M(),requestAnimationFrame(_0)}function qT(){if(!lt)return;const{fighter:r,startCol:e,startRow:t,landingCol:n,landingRow:i,target:s}=lt,o=r.team;r.col=n,r.row=i,Le.push({from:`${e}${t}`,to:`${n}${i}`,piece:r.type,team:o,captured:s.type,capturedPoints:s.points}),U=`Fighter bombed ${s.type}! (+${s.points} points)`,r.cooldownTurns=tT,o==="yellow"?$e++:me++,st(),lt=null,M()}function ua(r){if(!(!D||D.type!=="builder")){if(r==="move")Ke=null,ir=[],Yr=!1,lr=[],ue=id(D),U=E("selectWhereToMove");else if(r==="barricade"){if(!bl(D)){U=E("cannotBuildBarricade"),M();return}Ke="barricade",ir=Ya(D),ue=[],U=E("selectPlaceBarricade")}else if(r==="artillery"){if(!vl(D)){U=E("cannotBuildArtillery"),M();return}Ke="artillery",ir=Ya(D),ue=[],U=E("selectPlaceArtillery")}else if(r==="spike"){if(!sd(D)){U=E("cannotBuildSpike"),M();return}Ke="spike",ir=vT(D),ue=[],U=E("selectPlaceSpike")}M()}}function E0(r,e){if(!D||D.type!=="builder"||!Ke)return;const t=D,n=t.team;be("build"),Ke==="barricade"?(Y.push({type:"barricade",team:n,col:r,row:e,points:0}),t.barricadesBuilt=(t.barricadesBuilt??0)+1,t.barricadeCooldown=nT,U=`Barricade placed at ${r}${e}!`,Le.push({from:`${t.col}${t.row}`,to:`${r}${e}`,piece:"builder",team:n,captured:"build-barricade"})):Ke==="artillery"?(Y.push({type:"artillery",team:n,col:r,row:e,points:0}),t.artilleryBuilt=(t.artilleryBuilt??0)+1,t.artilleryCooldown=iT,U=`Artillery placed at ${r}${e}!`,Le.push({from:`${t.col}${t.row}`,to:`${r}${e}`,piece:"builder",team:n,captured:"build-artillery"})):Ke==="spike"&&(Y.push({type:"spike",team:n,col:r,row:e,points:0,turnsRemaining:sp}),t.spikesBuilt=(t.spikesBuilt??0)+1,t.spikeCooldown=cT,U=`Spike placed at ${r}${e}! (${sp} turns)`,Le.push({from:`${t.col}${t.row}`,to:`${r}${e}`,piece:"builder",team:n,captured:"build-spike"})),n==="yellow"?$e++:me++,st(),D=null,ue=[],$o=!1,fi=!1,Ke=null,ir=[],Yr=!1,lr=[],M()}function up(r,e){if(Ks||Wt&&_e==="green")return;if(Ne&&Ae&&!(Bt||_e===Ae)){U=E("opponentsTurn"),M();return}Ne&&Ae&&_e===Ae&&!Bt&&(Bt=!0,Qr=!1);const n=hd(r,e),i=n.find(s=>s.team===_e&&s.type!=="barricade")||n.find(s=>s.type!=="barricade")||n[0];if(D){if(Yr&&D.type==="carrier"&&lr.some(o=>o.col===r&&o.row===e)){RT(r,e);return}if(D.type==="artillery"&&i===D&&(D.team==="yellow"?$e:me)>=Zi){Xc(D);return}if(i===D){const s=kl();if(s&&i===s){U="⚠️ Soldier MUST leave the trench! Click a valid destination.",M();return}D=null,ue=[],ut=[],ii=[],br=[],It=null,Mn=!1,vr=[],nr=null,Or=[],U=null,tt=null,M();return}if(D.type==="rocket"&&ii.length>0&&ii.some(o=>o.col===r&&o.row===e)){T0(D,r,e);return}if(D.type==="hacker"&&br.length>0&&i&&br.some(o=>o===i)){It=i,Mn=!0,U=`Hack ${i.type}: choose action`,M();return}if(D.type==="fighter"){if(nr&&Or.length>0&&Or.some(o=>o.col===r&&o.row===e)){x0(D,nr,r,e);return}if(vr.length>0&&i&&vr.some(o=>o===i)){nr=i,Or=f0(i.col,i.row),U=`Bomb ${i.type}: select landing spot (0-3 squares)`,M();return}}if(D.type==="builder"&&Ke&&ir.length>0&&ir.some(o=>o.col===r&&o.row===e)){E0(r,e);return}if(D.type==="artillery"&&(D.team==="yellow"?$e:me)>=Zi&&i===D){Xc(D),D=null;return}if(tt==="shoot"){k0(r,e);return}LT(r,e)}else i&&PT(i)}const Y=Tl();function ke(r,e){return Y.find(t=>t.col===r&&t.row===e)}function Yt(r,e){return Y.find(t=>t.col===r&&t.row===e&&!(t.type==="soldier"&&t.inTunnel))}function hd(r,e){return Y.filter(t=>t.col===r&&t.row===e)}function GT(r,e){return Y.find(t=>t.col===r&&t.row===e&&t.type!=="barricade")}function Bo(r,e){return Y.find(t=>t.col===r&&t.row===e&&t.type==="barricade")}function ds(r,e,t){const n=hd(e,t);return n.length===1&&n[0].type==="barricade"&&n[0].team===r.team}function UT(r,e,t){if(!yr)return"";const n="#ffffff",i=r==="yellow"?"#ea580c":"#2563eb";return r==="yellow"?`
      <circle cx="${e+8}" cy="${t+8}" r="6" fill="${i}" stroke="${n}" stroke-width="1.5" class="pointer-events-none" />
      <circle cx="${e+8}" cy="${t+8}" r="3" fill="${n}" class="pointer-events-none" />
    `:`
      <polygon points="${e+8},${t+3} ${e+14},${t+13} ${e+2},${t+13}" fill="${i}" stroke="${n}" stroke-width="1.5" class="pointer-events-none" />
    `}function zs(r,e,t){const n=L4(r.team),i=yr?r.team==="yellow"?"#c2410c":"#1d4ed8":r.team==="yellow"?"#b45309":"#15803d",s=UT(r.team,e,t);if(r.type==="train"){const o=xt(r.team),c=Vt(),l=yr?r.team==="yellow"?"#fb923c":"#60a5fa":r.team==="yellow"?"#fde047":"#4ade80",u=yr?r.team==="yellow"?"#9a3412":"#1e40af":r.team==="yellow"?"#92400e":"#166534";if(c==="robot"){const f=o.primary,d=o.uniform;return`
        <g class="cursor-pointer" data-piece="${r.type}" data-team="${r.team}" data-col="${r.col}" data-row="${r.row}">
          <!-- Hover glow -->
          <ellipse cx="${e+25}" cy="${t+46}" rx="20" ry="3" fill="${f}" opacity="0.5">
            <animate attributeName="opacity" values="0.5;0.3;0.5" dur="0.8s" repeatCount="indefinite" />
          </ellipse>
          <!-- Hover pods -->
          <ellipse cx="${e+12}" cy="${t+42}" rx="6" ry="3" fill="${d}" stroke="${f}" stroke-width="1" />
          <ellipse cx="${e+38}" cy="${t+42}" rx="6" ry="3" fill="${d}" stroke="${f}" stroke-width="1" />
          <!-- Main body -->
          <rect x="${e+6}" y="${t+22}" width="38" height="18" rx="8" fill="${d}" stroke="${f}" stroke-width="1.5" />
          <!-- Cockpit window -->
          <path d="M${e+6} ${t+28} Q${e+2} ${t+24} ${e+6} ${t+20} L${e+16} ${t+20} L${e+16} ${t+36} L${e+6} ${t+36} Z" fill="#111" stroke="${f}" stroke-width="0.5" />
          <path d="M${e+8} ${t+22} L${e+14} ${t+22} L${e+14} ${t+28} L${e+8} ${t+26} Z" fill="${f}" opacity="0.6" />
          <!-- Side panels -->
          <rect x="${e+20}" y="${t+24}" width="6" height="4" rx="1" fill="${f}" opacity="0.4" />
          <rect x="${e+30}" y="${t+24}" width="6" height="4" rx="1" fill="${f}" opacity="0.4" />
          <!-- Energy line -->
          <line x1="${e+18}" y1="${t+32}" x2="${e+42}" y2="${t+32}" stroke="${f}" stroke-width="2">
            <animate attributeName="opacity" values="1;0.3;1" dur="0.5s" repeatCount="indefinite" />
          </line>
          <!-- Top sensor -->
          <rect x="${e+22}" y="${t+16}" width="6" height="6" rx="1" fill="${d}" stroke="${f}" stroke-width="1" />
          <circle cx="${e+25}" cy="${t+19}" r="2" fill="${f}">
            <animate attributeName="opacity" values="1;0.5;1" dur="1s" repeatCount="indefinite" />
          </circle>
          <!-- Antenna -->
          <line x1="${e+25}" y1="${t+16}" x2="${e+25}" y2="${t+10}" stroke="${f}" stroke-width="1" />
          <circle cx="${e+25}" cy="${t+9}" r="2" fill="${f}" />
          <circle cx="${e+25}" cy="${t+5}" r="3" fill="${n}" stroke="${i}" stroke-width="1" />
          ${s}
        </g>
      `}if(c==="medieval"){const f=o.secondary,d=o.dark;return`
        <g class="cursor-pointer" data-piece="${r.type}" data-team="${r.team}" data-col="${r.col}" data-row="${r.row}">
          <!-- Shadow -->
          <ellipse cx="${e+25}" cy="${t+46}" rx="20" ry="3" fill="rgba(0,0,0,0.3)" />
          <!-- Wheels -->
          <circle cx="${e+14}" cy="${t+40}" r="6" fill="${d}" stroke="#3d2817" stroke-width="2" />
          <circle cx="${e+36}" cy="${t+40}" r="6" fill="${d}" stroke="#3d2817" stroke-width="2" />
          <line x1="${e+8}" y1="${t+40}" x2="${e+20}" y2="${t+40}" stroke="#3d2817" stroke-width="1" />
          <line x1="${e+14}" y1="${t+34}" x2="${e+14}" y2="${t+46}" stroke="#3d2817" stroke-width="1" />
          <line x1="${e+30}" y1="${t+40}" x2="${e+42}" y2="${t+40}" stroke="#3d2817" stroke-width="1" />
          <line x1="${e+36}" y1="${t+34}" x2="${e+36}" y2="${t+46}" stroke="#3d2817" stroke-width="1" />
          <!-- Wagon body -->
          <rect x="${e+8}" y="${t+22}" width="34" height="16" fill="${f}" stroke="${d}" stroke-width="1.5" />
          <!-- Wood grain -->
          <line x1="${e+10}" y1="${t+26}" x2="${e+40}" y2="${t+26}" stroke="${d}" stroke-width="0.5" />
          <line x1="${e+10}" y1="${t+32}" x2="${e+40}" y2="${t+32}" stroke="${d}" stroke-width="0.5" />
          <!-- Armored front -->
          <rect x="${e+6}" y="${t+24}" width="6" height="10" fill="${o.primary}" stroke="${d}" stroke-width="1" />
          <!-- Banner pole -->
          <line x1="${e+38}" y1="${t+22}" x2="${e+38}" y2="${t+10}" stroke="${d}" stroke-width="2" />
          <path d="M${e+38} ${t+10} L${e+48} ${t+14} L${e+38} ${t+18} Z" fill="${n}" />
          <!-- Horse silhouette (simplified) -->
          <ellipse cx="${e-2}" cy="${t+32}" rx="6" ry="8" fill="#8b7355" stroke="#5c4033" stroke-width="1" />
          <ellipse cx="${e-6}" cy="${t+26}" rx="4" ry="5" fill="#8b7355" stroke="#5c4033" stroke-width="1" />
          <!-- Horse legs -->
          <line x1="${e-4}" y1="${t+38}" x2="${e-6}" y2="${t+46}" stroke="#5c4033" stroke-width="2" />
          <line x1="${e}" y1="${t+38}" x2="${e+2}" y2="${t+46}" stroke="#5c4033" stroke-width="2" />
          <!-- Reins -->
          <line x1="${e-2}" y1="${t+26}" x2="${e+8}" y2="${t+28}" stroke="#3d2817" stroke-width="1" />
          <circle cx="${e+25}" cy="${t+5}" r="3" fill="${n}" stroke="${i}" stroke-width="1" />
          ${s}
        </g>
      `}if(c==="pixel"){const f=o.primary,d=o.secondary,h=o.uniform;return`
        <g class="cursor-pointer" data-piece="${r.type}" data-team="${r.team}" data-col="${r.col}" data-row="${r.row}">
          <!-- Shadow -->
          <rect x="${e+6}" y="${t+44}" width="38" height="4" fill="rgba(0,0,0,0.3)" />
          <!-- Wheels -->
          <rect x="${e+8}" y="${t+38}" width="8" height="8" fill="#222" />
          <rect x="${e+10}" y="${t+40}" width="4" height="4" fill="#444" />
          <rect x="${e+24}" y="${t+38}" width="8" height="8" fill="#222" />
          <rect x="${e+26}" y="${t+40}" width="4" height="4" fill="#444" />
          <rect x="${e+36}" y="${t+38}" width="8" height="8" fill="#222" />
          <rect x="${e+38}" y="${t+40}" width="4" height="4" fill="#444" />
          <!-- Boiler -->
          <rect x="${e+6}" y="${t+22}" width="24" height="16" fill="${f}" />
          <rect x="${e+8}" y="${t+24}" width="20" height="4" fill="${d}" />
          <!-- Cabin -->
          <rect x="${e+30}" y="${t+16}" width="14" height="22" fill="${f}" />
          <rect x="${e+32}" y="${t+18}" width="10" height="6" fill="#222" />
          <rect x="${e+34}" y="${t+20}" width="6" height="2" fill="#88ccff" />
          <!-- Chimney -->
          <rect x="${e+10}" y="${t+14}" width="6" height="8" fill="${h}" />
          <!-- Smoke -->
          <rect x="${e+8}" y="${t+8}" width="4" height="4" fill="#ccc" />
          <rect x="${e+14}" y="${t+4}" width="4" height="4" fill="#ddd" />
          <!-- Cow catcher -->
          <rect x="${e+2}" y="${t+34}" width="6" height="4" fill="#444" />
          <circle cx="${e+25}" cy="${t+5}" r="3" fill="${n}" stroke="${i}" stroke-width="1" />
          ${s}
        </g>
      `}if(c==="fantasy"){const f=o.primary,d=o.uniform;return`
        <g class="cursor-pointer" data-piece="${r.type}" data-team="${r.team}" data-col="${r.col}" data-row="${r.row}">
          <!-- Magic glow -->
          <ellipse cx="${e+25}" cy="${t+44}" rx="22" ry="4" fill="${f}" opacity="0.4">
            <animate attributeName="opacity" values="0.4;0.6;0.4" dur="1.5s" repeatCount="indefinite" />
          </ellipse>
          <!-- Flying carpet base -->
          <path d="M${e+2} ${t+40} Q${e+25} ${t+46} ${e+48} ${t+40} L${e+46} ${t+36} Q${e+25} ${t+42} ${e+4} ${t+36} Z" fill="${d}" stroke="${o.uniformDark}" stroke-width="1" />
          <!-- Carpet pattern -->
          <path d="M${e+10} ${t+38} Q${e+25} ${t+42} ${e+40} ${t+38}" stroke="${f}" stroke-width="1" fill="none" />
          <!-- Ornate carriage -->
          <path d="M${e+8} ${t+36} L${e+10} ${t+20} Q${e+25} ${t+16} ${e+40} ${t+20} L${e+42} ${t+36} Z" fill="${d}" stroke="${o.uniformDark}" stroke-width="1" />
          <!-- Carriage windows -->
          <ellipse cx="${e+18}" cy="${t+26}" rx="4" ry="5" fill="${f}" opacity="0.6" />
          <ellipse cx="${e+32}" cy="${t+26}" rx="4" ry="5" fill="${f}" opacity="0.6" />
          <!-- Dome roof -->
          <path d="M${e+12} ${t+20} Q${e+25} ${t+8} ${e+38} ${t+20} Z" fill="${d}" stroke="${o.uniformDark}" stroke-width="1" />
          <!-- Magic crystals -->
          <circle cx="${e+8}" cy="${t+32}" r="3" fill="${f}">
            <animate attributeName="opacity" values="1;0.4;1" dur="1s" repeatCount="indefinite" />
          </circle>
          <circle cx="${e+42}" cy="${t+32}" r="3" fill="${f}">
            <animate attributeName="opacity" values="0.4;1;0.4" dur="1s" repeatCount="indefinite" />
          </circle>
          <!-- Top ornament -->
          <circle cx="${e+25}" cy="${t+12}" r="4" fill="${f}" stroke="${n}" stroke-width="1">
            <animate attributeName="r" values="4;5;4" dur="2s" repeatCount="indefinite" />
          </circle>
          <!-- Magic sparkles -->
          <circle cx="${e+15}" cy="${t+42}" r="1" fill="#fff">
            <animate attributeName="opacity" values="1;0;1" dur="0.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="${e+35}" cy="${t+42}" r="1" fill="#fff">
            <animate attributeName="opacity" values="0;1;0" dur="0.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="${e+25}" cy="${t+5}" r="3" fill="${n}" stroke="${i}" stroke-width="1" />
          ${s}
        </g>
      `}if(c==="minimal"){const f=o.primary;return`
        <g class="cursor-pointer" data-piece="${r.type}" data-team="${r.team}" data-col="${r.col}" data-row="${r.row}">
          <ellipse cx="${e+25}" cy="${t+46}" rx="18" ry="3" fill="rgba(0,0,0,0.2)" />
          <!-- Simple wheels -->
          <circle cx="${e+14}" cy="${t+40}" r="5" fill="#333" stroke="#000" stroke-width="2" />
          <circle cx="${e+36}" cy="${t+40}" r="5" fill="#333" stroke="#000" stroke-width="2" />
          <!-- Simple body -->
          <rect x="${e+6}" y="${t+22}" width="38" height="16" fill="${f}" stroke="#000" stroke-width="2" />
          <!-- Simple cabin -->
          <rect x="${e+32}" y="${t+14}" width="12" height="22" fill="${f}" stroke="#000" stroke-width="2" />
          <!-- Simple chimney -->
          <rect x="${e+10}" y="${t+14}" width="6" height="10" fill="#333" stroke="#000" stroke-width="1.5" />
          <circle cx="${e+25}" cy="${t+8}" r="3" fill="${n}" stroke="${i}" stroke-width="1" />
          ${s}
        </g>
      `}if(c==="cartoon"){const f=o.primary,d=o.secondary;return`
        <g class="cursor-pointer" data-piece="${r.type}" data-team="${r.team}" data-col="${r.col}" data-row="${r.row}">
          <ellipse cx="${e+25}" cy="${t+46}" rx="18" ry="4" fill="rgba(0,0,0,0.3)" />
          <!-- Bouncy wheels -->
          <circle cx="${e+14}" cy="${t+40}" r="6" fill="#444" stroke="#000" stroke-width="2" />
          <circle cx="${e+36}" cy="${t+40}" r="6" fill="#444" stroke="#000" stroke-width="2" />
          <circle cx="${e+14}" cy="${t+40}" r="2" fill="#888" />
          <circle cx="${e+36}" cy="${t+40}" r="2" fill="#888" />
          <!-- Cute body -->
          <ellipse cx="${e+22}" cy="${t+30}" rx="16" ry="10" fill="${f}" stroke="#000" stroke-width="2" />
          <!-- Train face on front -->
          <circle cx="${e+10}" cy="${t+28}" r="8" fill="${d}" stroke="#000" stroke-width="2" />
          <!-- Big cute eyes -->
          <ellipse cx="${e+8}" cy="${t+26}" rx="3" ry="4" fill="#fff" stroke="#000" stroke-width="1" />
          <circle cx="${e+9}" cy="${t+27}" r="2" fill="#000" />
          <circle cx="${e+10}" cy="${t+26}" r="0.5" fill="#fff" />
          <!-- Cute smile -->
          <path d="M${e+5} ${t+32} Q${e+10} ${t+36} ${e+15} ${t+32}" stroke="#000" stroke-width="1.5" fill="none" />
          <!-- Chimney with puff -->
          <rect x="${e+16}" y="${t+14}" width="8" height="12" rx="2" fill="${d}" stroke="#000" stroke-width="1.5" />
          <ellipse cx="${e+20}" cy="${t+10}" rx="5" ry="4" fill="#ddd" stroke="#000" stroke-width="1" />
          <ellipse cx="${e+18}" cy="${t+6}" rx="3" ry="2" fill="#eee" />
          <!-- Cabin -->
          <rect x="${e+32}" y="${t+18}" width="14" height="16" rx="2" fill="${d}" stroke="#000" stroke-width="2" />
          <rect x="${e+34}" y="${t+20}" width="10" height="6" fill="#88ccff" stroke="#000" stroke-width="1" />
          <circle cx="${e+25}" cy="${t+6}" r="3" fill="${n}" stroke="${i}" stroke-width="1" />
          ${s}
        </g>
      `}if(c==="military"){const f=o.primary,d=o.secondary;return`
        <g class="cursor-pointer" data-piece="${r.type}" data-team="${r.team}" data-col="${r.col}" data-row="${r.row}">
          <ellipse cx="${e+25}" cy="${t+46}" rx="18" ry="4" fill="rgba(0,0,0,0.4)" />
          <!-- Heavy wheels -->
          <circle cx="${e+12}" cy="${t+40}" r="6" fill="#222" stroke="#111" stroke-width="2" />
          <circle cx="${e+28}" cy="${t+40}" r="6" fill="#222" stroke="#111" stroke-width="2" />
          <circle cx="${e+40}" cy="${t+40}" r="5" fill="#222" stroke="#111" stroke-width="2" />
          <!-- Armored body -->
          <rect x="${e+4}" y="${t+22}" width="42" height="16" rx="2" fill="${f}" stroke="#222" stroke-width="1.5" />
          <rect x="${e+8}" y="${t+26}" width="10" height="8" fill="${d}" />
          <rect x="${e+28}" y="${t+24}" width="8" height="6" fill="${d}" />
          <!-- Gun turret -->
          <rect x="${e+16}" y="${t+14}" width="14" height="10" rx="2" fill="${f}" stroke="#222" stroke-width="1" />
          <rect x="${e+28}" y="${t+18}" width="12" height="4" fill="#333" />
          <!-- Armored cabin -->
          <rect x="${e+34}" y="${t+14}" width="10" height="10" fill="${f}" stroke="#222" stroke-width="1" />
          <rect x="${e+36}" y="${t+16}" width="6" height="4" fill="#333" />
          <circle cx="${e+25}" cy="${t+6}" r="3" fill="${n}" stroke="${i}" stroke-width="1" />
          ${s}
        </g>
      `}if(c==="scifi"){const f=o.primary,d=o.secondary;return`
        <g class="cursor-pointer" data-piece="${r.type}" data-team="${r.team}" data-col="${r.col}" data-row="${r.row}">
          <!-- Magnetic field -->
          <ellipse cx="${e+25}" cy="${t+46}" rx="20" ry="4" fill="${d}" opacity="0.4"><animate attributeName="opacity" values="0.4;0.6;0.4" dur="0.8s" repeatCount="indefinite" /></ellipse>
          <!-- Sleek body -->
          <path d="M${e+2} ${t+38} Q${e-2} ${t+26} ${e+8} ${t+20} L${e+42} ${t+20} Q${e+52} ${t+26} ${e+48} ${t+38} Z" fill="${f}" stroke="${d}" stroke-width="1.5" />
          <!-- Cockpit -->
          <path d="M${e+2} ${t+30} Q${e+6} ${t+24} ${e+16} ${t+22} L${e+16} ${t+34} Z" fill="#111" stroke="${d}" stroke-width="0.5" />
          <path d="M${e+4} ${t+28} L${e+14} ${t+24}" stroke="${d}" stroke-width="1" />
          <!-- Energy line -->
          <line x1="${e+8}" y1="${t+30}" x2="${e+46}" y2="${t+30}" stroke="${d}" stroke-width="2"><animate attributeName="opacity" values="1;0.4;1" dur="0.5s" repeatCount="indefinite" /></line>
          <!-- Hover pads -->
          <ellipse cx="${e+14}" cy="${t+40}" rx="6" ry="2" fill="${d}" opacity="0.6" />
          <ellipse cx="${e+36}" cy="${t+40}" rx="6" ry="2" fill="${d}" opacity="0.6" />
          <!-- Top sensor -->
          <rect x="${e+30}" y="${t+14}" width="8" height="8" rx="2" fill="${f}" stroke="${d}" stroke-width="1" />
          <circle cx="${e+34}" cy="${t+18}" r="2" fill="${d}"><animate attributeName="opacity" values="1;0.3;1" dur="1s" repeatCount="indefinite" /></circle>
          <circle cx="${e+25}" cy="${t+8}" r="3" fill="${n}" stroke="${i}" stroke-width="1" />
          ${s}
        </g>
      `}return`
      <g class="cursor-pointer" data-piece="${r.type}" data-team="${r.team}" data-col="${r.col}" data-row="${r.row}">
        <!-- Shadow -->
        <ellipse cx="${e+25}" cy="${t+44}" rx="18" ry="4" fill="rgba(0,0,0,0.3)" />
        <!-- Wheels -->
        <circle cx="${e+14}" cy="${t+38}" r="6" fill="#1f1f1f" />
        <circle cx="${e+14}" cy="${t+38}" r="4" fill="#3f3f3f" />
        <circle cx="${e+14}" cy="${t+38}" r="1.5" fill="#6b6b6b" />
        <circle cx="${e+28}" cy="${t+38}" r="6" fill="#1f1f1f" />
        <circle cx="${e+28}" cy="${t+38}" r="4" fill="#3f3f3f" />
        <circle cx="${e+28}" cy="${t+38}" r="1.5" fill="#6b6b6b" />
        <circle cx="${e+40}" cy="${t+38}" r="5" fill="#1f1f1f" />
        <circle cx="${e+40}" cy="${t+38}" r="3" fill="#3f3f3f" />
        <!-- Boiler -->
        <rect x="${e+6}" y="${t+22}" width="26" height="14" rx="7" fill="${n}" stroke="${i}" stroke-width="1.5" />
        <rect x="${e+8}" y="${t+24}" width="22" height="4" rx="2" fill="${l}" opacity="0.5" />
        <!-- Cabin -->
        <rect x="${e+30}" y="${t+14}" width="14" height="22" rx="2" fill="${n}" stroke="${i}" stroke-width="1.5" />
        <rect x="${e+32}" y="${t+16}" width="10" height="6" rx="1" fill="${u}" />
        <rect x="${e+33}" y="${t+17}" width="8" height="4" rx="1" fill="#87ceeb" opacity="0.7" />
        <!-- Roof -->
        <rect x="${e+29}" y="${t+12}" width="16" height="4" rx="1" fill="${i}" />
        <!-- Chimney -->
        <rect x="${e+10}" y="${t+14}" width="6" height="9" rx="1" fill="${i}" />
        <ellipse cx="${e+13}" cy="${t+14}" rx="4" ry="2" fill="${u}" />
        <!-- Smoke puffs -->
        <circle cx="${e+13}" cy="${t+9}" r="3" fill="#d1d5db" opacity="0.6" />
        <circle cx="${e+16}" cy="${t+5}" r="2.5" fill="#e5e7eb" opacity="0.4" />
        <circle cx="${e+11}" cy="${t+4}" r="2" fill="#f3f4f6" opacity="0.3" />
        <!-- Front light -->
        <circle cx="${e+7}" cy="${t+26}" r="2.5" fill="#fef9c3" stroke="#eab308" stroke-width="0.5" />
        <!-- Cow catcher -->
        <path d="M${e+4} ${t+36} L${e+6} ${t+32} L${e+10} ${t+36} Z" fill="#4b5563" />
        ${s}
      </g>
    `}if(r.type==="soldier"){const o=r.inTrench,c=r.inTunnel,l=xt(r.team),u=Vt(),f=o?`<rect x="${e+20}" y="${t+44}" width="10" height="4" fill="#5c4033" rx="1" /><text x="${e+25}" y="${t+47}" text-anchor="middle" font-size="6" fill="#fff">⚔</text>`:"",d=c?`<rect x="${e+20}" y="${t+44}" width="10" height="4" fill="#333" rx="1" /><text x="${e+25}" y="${t+47}" text-anchor="middle" font-size="6" fill="#fff">🚇</text>`:"";if(u==="robot"){const w=l.primary,b=l.uniform,P=l.primary;return`
        <g class="cursor-pointer" data-piece="${r.type}" data-team="${r.team}" data-col="${r.col}" data-row="${r.row}">
          <ellipse cx="${e+25}" cy="${t+47}" rx="12" ry="3" fill="rgba(0,0,0,0.4)" />
          <!-- Robot feet -->
          <rect x="${e+16}" y="${t+42}" width="8" height="5" rx="1" fill="${b}" stroke="${w}" stroke-width="1" />
          <rect x="${e+26}" y="${t+42}" width="8" height="5" rx="1" fill="${b}" stroke="${w}" stroke-width="1" />
          <!-- Robot legs -->
          <rect x="${e+17}" y="${t+32}" width="6" height="11" fill="${b}" stroke="${w}" stroke-width="0.5" />
          <rect x="${e+27}" y="${t+32}" width="6" height="11" fill="${b}" stroke="${w}" stroke-width="0.5" />
          <!-- Hydraulic joints -->
          <circle cx="${e+20}" cy="${t+37}" r="2" fill="${w}" />
          <circle cx="${e+30}" cy="${t+37}" r="2" fill="${w}" />
          <!-- Robot torso -->
          <rect x="${e+14}" y="${t+18}" width="22" height="14" rx="3" fill="${b}" stroke="${w}" stroke-width="1.5" />
          <!-- Chest panel -->
          <rect x="${e+18}" y="${t+20}" width="14" height="8" rx="1" fill="#111" stroke="${w}" stroke-width="0.5" />
          <!-- Chest lights -->
          <circle cx="${e+22}" cy="${t+24}" r="2" fill="${P}">
            <animate attributeName="opacity" values="1;0.3;1" dur="1s" repeatCount="indefinite" />
          </circle>
          <circle cx="${e+28}" cy="${t+24}" r="2" fill="${P}">
            <animate attributeName="opacity" values="0.3;1;0.3" dur="1s" repeatCount="indefinite" />
          </circle>
          <!-- Robot arms -->
          <rect x="${e+8}" y="${t+19}" width="6" height="12" rx="2" fill="${b}" stroke="${w}" stroke-width="0.5" />
          <rect x="${e+36}" y="${t+19}" width="6" height="12" rx="2" fill="${b}" stroke="${w}" stroke-width="0.5" />
          <!-- Robot hands/claws -->
          <rect x="${e+9}" y="${t+31}" width="4" height="4" fill="${w}" />
          <rect x="${e+37}" y="${t+31}" width="4" height="4" fill="${w}" />
          <!-- Robot head -->
          <rect x="${e+16}" y="${t+6}" width="18" height="14" rx="3" fill="${b}" stroke="${w}" stroke-width="1.5" />
          <!-- Visor -->
          <rect x="${e+18}" y="${t+9}" width="14" height="5" rx="1" fill="${P}" opacity="0.8">
            <animate attributeName="opacity" values="0.8;0.4;0.8" dur="2s" repeatCount="indefinite" />
          </rect>
          <!-- Antenna -->
          <rect x="${e+24}" y="${t+2}" width="2" height="5" fill="${w}" />
          <circle cx="${e+25}" cy="${t+2}" r="2" fill="${P}">
            <animate attributeName="opacity" values="1;0;1" dur="0.5s" repeatCount="indefinite" />
          </circle>
          <!-- Laser gun -->
          <rect x="${e+38}" y="${t+24}" width="10" height="4" rx="1" fill="${w}" />
          <rect x="${e+46}" y="${t+25}" width="4" height="2" fill="${P}" />
          <circle cx="${e+25}" cy="${t+5}" r="3" fill="${n}" stroke="${i}" stroke-width="1" />
          ${f}${d}${s}
        </g>
      `}if(u==="medieval"){const w=l.primary,b=l.dark;return`
        <g class="cursor-pointer" data-piece="${r.type}" data-team="${r.team}" data-col="${r.col}" data-row="${r.row}">
          <ellipse cx="${e+25}" cy="${t+47}" rx="12" ry="3" fill="rgba(0,0,0,0.4)" />
          <!-- Armored boots -->
          <rect x="${e+16}" y="${t+42}" width="8" height="5" rx="1" fill="${b}" stroke="#1a1a1a" stroke-width="0.5" />
          <rect x="${e+26}" y="${t+42}" width="8" height="5" rx="1" fill="${b}" stroke="#1a1a1a" stroke-width="0.5" />
          <!-- Leg armor -->
          <rect x="${e+17}" y="${t+32}" width="6" height="11" fill="${w}" stroke="${b}" stroke-width="0.5" />
          <rect x="${e+27}" y="${t+32}" width="6" height="11" fill="${w}" stroke="${b}" stroke-width="0.5" />
          <!-- Chainmail skirt -->
          <rect x="${e+14}" y="${t+28}" width="22" height="6" fill="${b}" />
          <line x1="${e+16}" y1="${t+30}" x2="${e+34}" y2="${t+30}" stroke="${w}" stroke-width="0.5" stroke-dasharray="2,1" />
          <line x1="${e+16}" y1="${t+32}" x2="${e+34}" y2="${t+32}" stroke="${w}" stroke-width="0.5" stroke-dasharray="2,1" />
          <!-- Chest plate -->
          <path d="M${e+14} ${t+28} L${e+14} ${t+18} Q${e+25} ${t+14} ${e+36} ${t+18} L${e+36} ${t+28} Z" fill="${w}" stroke="${b}" stroke-width="1" />
          <!-- Cross emblem -->
          <rect x="${e+23}" y="${t+18}" width="4" height="10" fill="${n}" />
          <rect x="${e+19}" y="${t+21}" width="12" height="4" fill="${n}" />
          <!-- Pauldrons (shoulder armor) -->
          <ellipse cx="${e+12}" cy="${t+20}" rx="5" ry="4" fill="${w}" stroke="${b}" stroke-width="1" />
          <ellipse cx="${e+38}" cy="${t+20}" rx="5" ry="4" fill="${w}" stroke="${b}" stroke-width="1" />
          <!-- Arms -->
          <rect x="${e+8}" y="${t+22}" width="5" height="10" fill="${b}" />
          <rect x="${e+37}" y="${t+22}" width="5" height="10" fill="${b}" />
          <!-- Gauntlets -->
          <rect x="${e+7}" y="${t+31}" width="6" height="4" rx="1" fill="${w}" />
          <rect x="${e+37}" y="${t+31}" width="6" height="4" rx="1" fill="${w}" />
          <!-- Knight helmet -->
          <ellipse cx="${e+25}" cy="${t+10}" rx="11" ry="9" fill="${w}" stroke="${b}" stroke-width="1" />
          <!-- Helmet visor -->
          <rect x="${e+18}" y="${t+10}" width="14" height="6" fill="${b}" />
          <line x1="${e+18}" y1="${t+11}" x2="${e+32}" y2="${t+11}" stroke="${w}" stroke-width="1" />
          <line x1="${e+18}" y1="${t+13}" x2="${e+32}" y2="${t+13}" stroke="${w}" stroke-width="1" />
          <line x1="${e+18}" y1="${t+15}" x2="${e+32}" y2="${t+15}" stroke="${w}" stroke-width="1" />
          <!-- Helmet plume -->
          <path d="M${e+25} ${t+1} Q${e+30} ${t+3} ${e+28} ${t+6} Q${e+25} ${t+4} ${e+22} ${t+6} Q${e+20} ${t+3} ${e+25} ${t+1}" fill="${n}" />
          <!-- Sword -->
          <rect x="${e+40}" y="${t+12}" width="2" height="22" fill="${w}" />
          <rect x="${e+37}" y="${t+32}" width="8" height="3" rx="1" fill="${b}" />
          <rect x="${e+40}" y="${t+10}" width="2" height="4" fill="${n}" />
          <circle cx="${e+25}" cy="${t+5}" r="3" fill="${n}" stroke="${i}" stroke-width="1" />
          ${f}${d}${s}
        </g>
      `}if(u==="pixel"){const w=l.primary,b=l.secondary,P=l.uniform;return`
        <g class="cursor-pointer" data-piece="${r.type}" data-team="${r.team}" data-col="${r.col}" data-row="${r.row}">
          <ellipse cx="${e+25}" cy="${t+47}" rx="12" ry="3" fill="rgba(0,0,0,0.4)" />
          <!-- Pixel feet -->
          <rect x="${e+16}" y="${t+42}" width="6" height="6" fill="#222" />
          <rect x="${e+28}" y="${t+42}" width="6" height="6" fill="#222" />
          <!-- Pixel legs -->
          <rect x="${e+16}" y="${t+32}" width="6" height="10" fill="${P}" />
          <rect x="${e+28}" y="${t+32}" width="6" height="10" fill="${P}" />
          <!-- Pixel body -->
          <rect x="${e+12}" y="${t+18}" width="26" height="14" fill="${b}" />
          <rect x="${e+14}" y="${t+20}" width="22" height="10" fill="${w}" />
          <!-- Pixel arms -->
          <rect x="${e+6}" y="${t+18}" width="6" height="14" fill="${b}" />
          <rect x="${e+38}" y="${t+18}" width="6" height="14" fill="${b}" />
          <!-- Pixel hands -->
          <rect x="${e+6}" y="${t+32}" width="6" height="4" fill="#dba574" />
          <rect x="${e+38}" y="${t+32}" width="6" height="4" fill="#dba574" />
          <!-- Pixel head -->
          <rect x="${e+14}" y="${t+4}" width="22" height="14" fill="${w}" />
          <!-- Pixel face -->
          <rect x="${e+16}" y="${t+10}" width="18" height="6" fill="#dba574" />
          <!-- Pixel eyes -->
          <rect x="${e+18}" y="${t+12}" width="4" height="2" fill="#000" />
          <rect x="${e+28}" y="${t+12}" width="4" height="2" fill="#000" />
          <!-- Pixel helmet stripe -->
          <rect x="${e+14}" y="${t+6}" width="22" height="4" fill="${b}" />
          <!-- Pixel gun -->
          <rect x="${e+42}" y="${t+22}" width="8" height="4" fill="#444" />
          <rect x="${e+46}" y="${t+18}" width="4" height="4" fill="#444" />
          <circle cx="${e+25}" cy="${t+2}" r="3" fill="${n}" stroke="${i}" stroke-width="1" />
          ${f}${d}${s}
        </g>
      `}if(u==="fantasy"){const w=l.primary,b=l.uniform,P=l.uniformDark;return`
        <g class="cursor-pointer" data-piece="${r.type}" data-team="${r.team}" data-col="${r.col}" data-row="${r.row}">
          <ellipse cx="${e+25}" cy="${t+47}" rx="12" ry="3" fill="rgba(0,0,0,0.4)" />
          <!-- Boots -->
          <rect x="${e+17}" y="${t+42}" width="6" height="5" rx="1" fill="#3d2817" />
          <rect x="${e+27}" y="${t+42}" width="6" height="5" rx="1" fill="#3d2817" />
          <!-- Robe bottom -->
          <path d="M${e+12} ${t+46} L${e+16} ${t+28} L${e+34} ${t+28} L${e+38} ${t+46} Z" fill="${b}" stroke="${P}" stroke-width="1" />
          <!-- Robe body -->
          <path d="M${e+14} ${t+28} L${e+14} ${t+16} Q${e+25} ${t+12} ${e+36} ${t+16} L${e+36} ${t+28} Z" fill="${b}" stroke="${P}" stroke-width="1" />
          <!-- Magic runes on robe -->
          <text x="${e+25}" y="${t+24}" text-anchor="middle" font-size="8" fill="${w}" opacity="0.8">✧</text>
          <!-- Sleeves -->
          <path d="M${e+14} ${t+18} L${e+6} ${t+28} L${e+10} ${t+32} L${e+16} ${t+24} Z" fill="${b}" stroke="${P}" stroke-width="0.5" />
          <path d="M${e+36} ${t+18} L${e+44} ${t+28} L${e+40} ${t+32} L${e+34} ${t+24} Z" fill="${b}" stroke="${P}" stroke-width="0.5" />
          <!-- Hands -->
          <circle cx="${e+8}" cy="${t+30}" r="3" fill="#d4a574" />
          <circle cx="${e+42}" cy="${t+30}" r="3" fill="#d4a574" />
          <!-- Hood -->
          <path d="M${e+14} ${t+16} Q${e+14} ${t+4} ${e+25} ${t+2} Q${e+36} ${t+4} ${e+36} ${t+16} Q${e+25} ${t+12} ${e+14} ${t+16}" fill="${b}" stroke="${P}" stroke-width="1" />
          <!-- Face in shadow -->
          <ellipse cx="${e+25}" cy="${t+14}" rx="6" ry="5" fill="#2a2a2a" />
          <!-- Glowing eyes -->
          <circle cx="${e+22}" cy="${t+13}" r="1.5" fill="${w}">
            <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="${e+28}" cy="${t+13}" r="1.5" fill="${w}">
            <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
          </circle>
          <!-- Magic staff -->
          <rect x="${e+44}" y="${t+10}" width="2" height="28" fill="#5c3d1e" />
          <circle cx="${e+45}" cy="${t+8}" r="4" fill="${w}" opacity="0.8">
            <animate attributeName="r" values="4;5;4" dur="1.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="${e+45}" cy="${t+8}" r="2" fill="#fff" />
          <!-- Magic aura -->
          <circle cx="${e+25}" cy="${t+25}" r="18" fill="none" stroke="${w}" stroke-width="1" opacity="0.3">
            <animate attributeName="r" values="18;22;18" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.3;0.1;0.3" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="${e+25}" cy="${t+5}" r="3" fill="${n}" stroke="${i}" stroke-width="1" />
          ${f}${d}${s}
        </g>
      `}if(u==="minimal"){const w=l.primary;return`
        <g class="cursor-pointer" data-piece="${r.type}" data-team="${r.team}" data-col="${r.col}" data-row="${r.row}">
          <ellipse cx="${e+25}" cy="${t+47}" rx="12" ry="3" fill="rgba(0,0,0,0.2)" />
          <!-- Simple body - just circles and rectangles -->
          <rect x="${e+18}" y="${t+32}" width="14" height="14" fill="${w}" stroke="#000" stroke-width="2" />
          <circle cx="${e+25}" cy="${t+20}" r="10" fill="${w}" stroke="#000" stroke-width="2" />
          <!-- Minimal face -->
          <line x1="${e+21}" y1="${t+18}" x2="${e+23}" y2="${t+18}" stroke="#000" stroke-width="2" />
          <line x1="${e+27}" y1="${t+18}" x2="${e+29}" y2="${t+18}" stroke="#000" stroke-width="2" />
          <!-- Simple gun -->
          <rect x="${e+32}" y="${t+32}" width="14" height="4" fill="#333" stroke="#000" stroke-width="1" />
          <circle cx="${e+25}" cy="${t+8}" r="3" fill="${n}" stroke="${i}" stroke-width="1" />
          ${f}${d}${s}
        </g>
      `}if(u==="cartoon"){const w=l.primary,b=l.secondary;return`
        <g class="cursor-pointer" data-piece="${r.type}" data-team="${r.team}" data-col="${r.col}" data-row="${r.row}">
          <ellipse cx="${e+25}" cy="${t+47}" rx="14" ry="4" fill="rgba(0,0,0,0.3)" />
          <!-- Bouncy body -->
          <ellipse cx="${e+25}" cy="${t+36}" rx="12" ry="10" fill="${w}" stroke="#000" stroke-width="2" />
          <!-- Big head -->
          <circle cx="${e+25}" cy="${t+18}" r="14" fill="${b}" stroke="#000" stroke-width="2" />
          <!-- Helmet -->
          <ellipse cx="${e+25}" cy="${t+14}" rx="12" ry="8" fill="${w}" stroke="#000" stroke-width="2" />
          <!-- Giant cute eyes -->
          <ellipse cx="${e+20}" cy="${t+20}" rx="5" ry="6" fill="#fff" stroke="#000" stroke-width="1" />
          <ellipse cx="${e+30}" cy="${t+20}" rx="5" ry="6" fill="#fff" stroke="#000" stroke-width="1" />
          <circle cx="${e+21}" cy="${t+21}" r="3" fill="#000" />
          <circle cx="${e+31}" cy="${t+21}" r="3" fill="#000" />
          <circle cx="${e+22}" cy="${t+20}" r="1" fill="#fff" />
          <circle cx="${e+32}" cy="${t+20}" r="1" fill="#fff" />
          <!-- Cute smile -->
          <path d="M${e+21} ${t+28} Q${e+25} ${t+32} ${e+29} ${t+28}" stroke="#000" stroke-width="2" fill="none" />
          <!-- Tiny arms -->
          <ellipse cx="${e+12}" cy="${t+34}" rx="4" ry="6" fill="${b}" stroke="#000" stroke-width="1.5" />
          <ellipse cx="${e+38}" cy="${t+34}" rx="4" ry="6" fill="${b}" stroke="#000" stroke-width="1.5" />
          <!-- Little gun -->
          <rect x="${e+40}" y="${t+32}" width="8" height="4" rx="2" fill="#666" stroke="#000" stroke-width="1" />
          <circle cx="${e+25}" cy="${t+4}" r="3" fill="${n}" stroke="${i}" stroke-width="1" />
          ${f}${d}${s}
        </g>
      `}if(u==="military"){const w=l.primary,b=l.secondary;return`
        <g class="cursor-pointer" data-piece="${r.type}" data-team="${r.team}" data-col="${r.col}" data-row="${r.row}">
          <ellipse cx="${e+25}" cy="${t+47}" rx="12" ry="3" fill="rgba(0,0,0,0.4)" />
          <!-- Tactical boots -->
          <rect x="${e+16}" y="${t+42}" width="8" height="6" rx="1" fill="#1a1a1a" />
          <rect x="${e+26}" y="${t+42}" width="8" height="6" rx="1" fill="#1a1a1a" />
          <!-- Camo pants -->
          <rect x="${e+16}" y="${t+30}" width="8" height="13" fill="${w}" />
          <rect x="${e+26}" y="${t+30}" width="8" height="13" fill="${w}" />
          <rect x="${e+18}" y="${t+34}" width="3" height="4" fill="${b}" />
          <rect x="${e+29}" y="${t+36}" width="3" height="4" fill="${b}" />
          <!-- Tactical vest -->
          <rect x="${e+12}" y="${t+16}" width="26" height="16" rx="2" fill="${w}" stroke="#222" stroke-width="1" />
          <rect x="${e+14}" y="${t+18}" width="6" height="8" fill="${b}" rx="1" />
          <rect x="${e+30}" y="${t+18}" width="6" height="8" fill="${b}" rx="1" />
          <rect x="${e+22}" y="${t+20}" width="6" height="10" fill="#333" />
          <!-- Arms -->
          <rect x="${e+8}" y="${t+18}" width="6" height="12" rx="2" fill="${w}" />
          <rect x="${e+36}" y="${t+18}" width="6" height="12" rx="2" fill="${w}" />
          <!-- Tactical helmet with NVG mount -->
          <ellipse cx="${e+25}" cy="${t+11}" rx="11" ry="9" fill="${w}" stroke="#222" stroke-width="1" />
          <rect x="${e+22}" y="${t+4}" width="6" height="4" fill="#333" />
          <!-- Face paint -->
          <ellipse cx="${e+25}" cy="${t+16}" rx="5" ry="4" fill="#8b7355" />
          <line x1="${e+20}" y1="${t+15}" x2="${e+24}" y2="${t+17}" stroke="${b}" stroke-width="1.5" />
          <line x1="${e+26}" y1="${t+17}" x2="${e+30}" y2="${t+15}" stroke="${b}" stroke-width="1.5" />
          <!-- M4 rifle -->
          <rect x="${e+40}" y="${t+22}" width="12" height="3" fill="#222" />
          <rect x="${e+38}" y="${t+20}" width="4" height="8" fill="#333" />
          <rect x="${e+50}" y="${t+22}" width="4" height="2" fill="#111" />
          <circle cx="${e+25}" cy="${t+3}" r="3" fill="${n}" stroke="${i}" stroke-width="1" />
          ${f}${d}${s}
        </g>
      `}if(u==="scifi"){const w=l.primary,b=l.secondary;return`
        <g class="cursor-pointer" data-piece="${r.type}" data-team="${r.team}" data-col="${r.col}" data-row="${r.row}">
          <ellipse cx="${e+25}" cy="${t+47}" rx="12" ry="3" fill="rgba(0,0,0,0.4)" />
          <!-- Power armor boots -->
          <rect x="${e+15}" y="${t+40}" width="9" height="7" rx="2" fill="${w}" stroke="${b}" stroke-width="1" />
          <rect x="${e+26}" y="${t+40}" width="9" height="7" rx="2" fill="${w}" stroke="${b}" stroke-width="1" />
          <!-- Power armor legs -->
          <rect x="${e+16}" y="${t+30}" width="7" height="11" fill="${w}" stroke="${b}" stroke-width="0.5" />
          <rect x="${e+27}" y="${t+30}" width="7" height="11" fill="${w}" stroke="${b}" stroke-width="0.5" />
          <!-- Power armor torso -->
          <rect x="${e+12}" y="${t+16}" width="26" height="16" rx="3" fill="${w}" stroke="${b}" stroke-width="1.5" />
          <!-- Chest reactor -->
          <circle cx="${e+25}" cy="${t+24}" r="4" fill="${b}"><animate attributeName="opacity" values="1;0.5;1" dur="1s" repeatCount="indefinite" /></circle>
          <!-- Shoulder pads -->
          <ellipse cx="${e+10}" cy="${t+18}" rx="6" ry="4" fill="${w}" stroke="${b}" stroke-width="1" />
          <ellipse cx="${e+40}" cy="${t+18}" rx="6" ry="4" fill="${w}" stroke="${b}" stroke-width="1" />
          <!-- Arms -->
          <rect x="${e+6}" y="${t+20}" width="6" height="12" rx="2" fill="${w}" stroke="${b}" stroke-width="0.5" />
          <rect x="${e+38}" y="${t+20}" width="6" height="12" rx="2" fill="${w}" stroke="${b}" stroke-width="0.5" />
          <!-- Space helmet -->
          <ellipse cx="${e+25}" cy="${t+10}" rx="12" ry="10" fill="${w}" stroke="${b}" stroke-width="1.5" />
          <!-- Visor -->
          <ellipse cx="${e+25}" cy="${t+12}" rx="8" ry="5" fill="${b}" opacity="0.7" />
          <!-- Plasma rifle -->
          <rect x="${e+42}" y="${t+22}" width="10" height="5" rx="2" fill="${w}" stroke="${b}" stroke-width="0.5" />
          <circle cx="${e+50}" cy="${t+24.5}" r="2" fill="${b}"><animate attributeName="r" values="2;3;2" dur="0.5s" repeatCount="indefinite" /></circle>
          <circle cx="${e+25}" cy="${t+2}" r="3" fill="${n}" stroke="${i}" stroke-width="1" />
          ${f}${d}${s}
        </g>
      `}const h=l.uniform,p=l.uniformDark,g=l.helmet;return`
      <g class="cursor-pointer" data-piece="${r.type}" data-team="${r.team}" data-col="${r.col}" data-row="${r.row}">
        <!-- Shadow -->
        <ellipse cx="${e+25}" cy="${t+47}" rx="12" ry="3" fill="rgba(0,0,0,0.4)" />
        <!-- Combat boots -->
        <rect x="${e+17}" y="${t+42}" width="6" height="5" rx="1" fill="#1a1a1a" />
        <rect x="${e+27}" y="${t+42}" width="6" height="5" rx="1" fill="#1a1a1a" />
        <!-- Legs with cargo pants -->
        <rect x="${e+17}" y="${t+32}" width="6" height="11" fill="${h}" />
        <rect x="${e+27}" y="${t+32}" width="6" height="11" fill="${h}" />
        <rect x="${e+18}" y="${t+36}" width="4" height="3" fill="${p}" />
        <rect x="${e+28}" y="${t+36}" width="4" height="3" fill="${p}" />
        <!-- Belt -->
        <rect x="${e+14}" y="${t+30}" width="22" height="3" fill="#2d2d2d" />
        <rect x="${e+23}" y="${t+30}" width="4" height="3" fill="#b8860b" />
        <!-- Body/Torso with tactical vest -->
        <rect x="${e+14}" y="${t+18}" width="22" height="13" rx="2" fill="${h}" stroke="${p}" stroke-width="1" />
        <!-- Vest details -->
        <rect x="${e+15}" y="${t+19}" width="8" height="5" fill="${p}" rx="1" />
        <rect x="${e+27}" y="${t+19}" width="8" height="5" fill="${p}" rx="1" />
        <line x1="${e+25}" y1="${t+18}" x2="${e+25}" y2="${t+30}" stroke="${p}" stroke-width="1" />
        <!-- Shoulders/epaulettes -->
        <rect x="${e+12}" y="${t+18}" width="4" height="3" fill="${n}" stroke="${i}" stroke-width="0.5" />
        <rect x="${e+34}" y="${t+18}" width="4" height="3" fill="${n}" stroke="${i}" stroke-width="0.5" />
        <!-- Arms -->
        <rect x="${e+8}" y="${t+20}" width="6" height="10" rx="2" fill="${h}" stroke="${p}" stroke-width="0.5" />
        <rect x="${e+36}" y="${t+20}" width="6" height="10" rx="2" fill="${h}" stroke="${p}" stroke-width="0.5" />
        <!-- Hands -->
        <circle cx="${e+11}" cy="${t+32}" r="2.5" fill="#d4a574" />
        <circle cx="${e+39}" cy="${t+32}" r="2.5" fill="#d4a574" />
        <!-- Combat helmet -->
        <ellipse cx="${e+25}" cy="${t+12}" rx="11" ry="8" fill="${g}" />
        <ellipse cx="${e+25}" cy="${t+10}" rx="9" ry="6" fill="${g}" />
        <path d="M${e+14} ${t+14} Q${e+25} ${t+8} ${e+36} ${t+14}" stroke="${p}" stroke-width="1.5" fill="none" />
        <!-- Helmet band -->
        <rect x="${e+15}" y="${t+11}" width="20" height="2" fill="${p}" />
        <!-- Face -->
        <ellipse cx="${e+25}" cy="${t+17}" rx="5" ry="4" fill="#d4a574" />
        <!-- Eyes -->
        <circle cx="${e+23}" cy="${t+16}" r="1" fill="#1f1f1f" />
        <circle cx="${e+27}" cy="${t+16}" r="1" fill="#1f1f1f" />
        <!-- Assault Rifle -->
        <g transform="rotate(-25 ${e+10} ${t+28})">
          <rect x="${e-2}" y="${t+28}" width="10" height="4" rx="1" fill="#3d2817" />
          <rect x="${e-4}" y="${t+29}" width="4" height="5" rx="1" fill="#3d2817" />
          <rect x="${e+6}" y="${t+26}" width="14" height="6" rx="1" fill="#2d2d2d" />
          <rect x="${e+18}" y="${t+27}" width="12" height="3" fill="#1a1a1a" />
          <rect x="${e+28}" y="${t+25}" width="2" height="3" fill="#1a1a1a" />
          <rect x="${e+10}" y="${t+31}" width="4" height="8" rx="1" fill="#2d2d2d" />
          <rect x="${e+4}" y="${t+31}" width="3" height="6" rx="1" fill="#3d2817" />
          <rect x="${e+8}" y="${t+24}" width="10" height="2" fill="#1f1f1f" />
          <path d="M${e+6} ${t+32} Q${e+8} ${t+36} ${e+10} ${t+32}" stroke="#2d2d2d" stroke-width="1.5" fill="none" />
        </g>
        <!-- Team indicator dot -->
        <circle cx="${e+25}" cy="${t+5}" r="3" fill="${n}" stroke="${i}" stroke-width="1" />
        ${f}${d}${s}
      </g>
    `}if(r.type==="tank"){const o=xt(r.team),c=Vt(),l=o.helmet,u=o.uniform;if(c==="robot"){const d=o.primary,h=o.uniform;return`
        <g class="cursor-pointer" data-piece="${r.type}" data-team="${r.team}" data-col="${r.col}" data-row="${r.row}">
          <ellipse cx="${e+25}" cy="${t+46}" rx="20" ry="4" fill="rgba(0,0,0,0.4)" />
          <!-- Mech legs -->
          <rect x="${e+8}" y="${t+38}" width="8" height="8" fill="${h}" stroke="${d}" stroke-width="1" />
          <rect x="${e+34}" y="${t+38}" width="8" height="8" fill="${h}" stroke="${d}" stroke-width="1" />
          <!-- Leg joints -->
          <circle cx="${e+12}" cy="${t+34}" r="4" fill="${d}" />
          <circle cx="${e+38}" cy="${t+34}" r="4" fill="${d}" />
          <!-- Upper legs -->
          <rect x="${e+10}" y="${t+26}" width="4" height="10" fill="${h}" stroke="${d}" stroke-width="0.5" />
          <rect x="${e+36}" y="${t+26}" width="4" height="10" fill="${h}" stroke="${d}" stroke-width="0.5" />
          <!-- Main body -->
          <rect x="${e+12}" y="${t+16}" width="26" height="14" rx="2" fill="${h}" stroke="${d}" stroke-width="1.5" />
          <!-- Cockpit -->
          <rect x="${e+16}" y="${t+18}" width="18" height="8" rx="1" fill="#111" stroke="${d}" stroke-width="0.5" />
          <rect x="${e+18}" y="${t+19}" width="14" height="4" fill="${d}" opacity="0.6">
            <animate attributeName="opacity" values="0.6;0.3;0.6" dur="1.5s" repeatCount="indefinite" />
          </rect>
          <!-- Shoulder cannons -->
          <rect x="${e+6}" y="${t+14}" width="8" height="6" rx="1" fill="${h}" stroke="${d}" stroke-width="1" />
          <rect x="${e+36}" y="${t+14}" width="8" height="6" rx="1" fill="${h}" stroke="${d}" stroke-width="1" />
          <!-- Cannon barrels -->
          <rect x="${e+2}" y="${t+15}" width="6" height="2" fill="${d}" />
          <rect x="${e+42}" y="${t+15}" width="6" height="2" fill="${d}" />
          <!-- Energy core -->
          <circle cx="${e+25}" cy="${t+22}" r="3" fill="${d}">
            <animate attributeName="opacity" values="1;0.4;1" dur="0.8s" repeatCount="indefinite" />
          </circle>
          <!-- Head/sensor -->
          <rect x="${e+20}" y="${t+8}" width="10" height="8" rx="1" fill="${h}" stroke="${d}" stroke-width="1" />
          <rect x="${e+22}" y="${t+10}" width="6" height="3" fill="${d}" opacity="0.8" />
          <circle cx="${e+25}" cy="${t+5}" r="3" fill="${n}" stroke="${i}" stroke-width="1" />
          ${s}
        </g>
      `}if(c==="medieval"){const d=o.secondary,h=o.dark;return`
        <g class="cursor-pointer" data-piece="${r.type}" data-team="${r.team}" data-col="${r.col}" data-row="${r.row}">
          <ellipse cx="${e+25}" cy="${t+46}" rx="20" ry="4" fill="rgba(0,0,0,0.4)" />
          <!-- Wooden wheels -->
          <circle cx="${e+12}" cy="${t+42}" r="6" fill="${h}" stroke="#3d2817" stroke-width="2" />
          <circle cx="${e+38}" cy="${t+42}" r="6" fill="${h}" stroke="#3d2817" stroke-width="2" />
          <circle cx="${e+12}" cy="${t+42}" r="2" fill="#3d2817" />
          <circle cx="${e+38}" cy="${t+42}" r="2" fill="#3d2817" />
          <!-- Wheel spokes -->
          <line x1="${e+12}" y1="${t+36}" x2="${e+12}" y2="${t+48}" stroke="#3d2817" stroke-width="1" />
          <line x1="${e+6}" y1="${t+42}" x2="${e+18}" y2="${t+42}" stroke="#3d2817" stroke-width="1" />
          <line x1="${e+38}" y1="${t+36}" x2="${e+38}" y2="${t+48}" stroke="#3d2817" stroke-width="1" />
          <line x1="${e+32}" y1="${t+42}" x2="${e+44}" y2="${t+42}" stroke="#3d2817" stroke-width="1" />
          <!-- Wooden frame -->
          <rect x="${e+8}" y="${t+24}" width="34" height="14" fill="${d}" stroke="${h}" stroke-width="1" />
          <!-- Wood grain -->
          <line x1="${e+10}" y1="${t+28}" x2="${e+40}" y2="${t+28}" stroke="${h}" stroke-width="0.5" />
          <line x1="${e+10}" y1="${t+32}" x2="${e+40}" y2="${t+32}" stroke="${h}" stroke-width="0.5" />
          <!-- Catapult arm base -->
          <rect x="${e+20}" y="${t+18}" width="10" height="8" fill="${h}" stroke="#3d2817" stroke-width="1" />
          <!-- Catapult arm -->
          <rect x="${e+23}" y="${t+6}" width="4" height="16" fill="${d}" stroke="${h}" stroke-width="1" />
          <!-- Throwing bucket -->
          <path d="M${e+18} ${t+4} L${e+25} ${t+6} L${e+32} ${t+4} L${e+30} ${t+8} L${e+20} ${t+8} Z" fill="${h}" stroke="#3d2817" stroke-width="1" />
          <!-- Stone in bucket -->
          <circle cx="${e+25}" cy="${t+5}" r="3" fill="#666" />
          <!-- Metal bands -->
          <rect x="${e+8}" y="${t+26}" width="34" height="2" fill="${o.primary}" />
          <rect x="${e+8}" y="${t+34}" width="34" height="2" fill="${o.primary}" />
          <!-- Team banner -->
          <rect x="${e+40}" y="${t+14}" width="1" height="14" fill="#3d2817" />
          <path d="M${e+41} ${t+14} L${e+48} ${t+17} L${e+41} ${t+20} Z" fill="${n}" />
          <circle cx="${e+25}" cy="${t+2}" r="3" fill="${n}" stroke="${i}" stroke-width="1" />
          ${s}
        </g>
      `}if(c==="pixel"){const d=o.primary,h=o.secondary,p=o.uniform;return`
        <g class="cursor-pointer" data-piece="${r.type}" data-team="${r.team}" data-col="${r.col}" data-row="${r.row}">
          <ellipse cx="${e+25}" cy="${t+46}" rx="20" ry="4" fill="rgba(0,0,0,0.4)" />
          <!-- Pixel tracks -->
          <rect x="${e+4}" y="${t+36}" width="42" height="10" fill="#222" />
          <rect x="${e+6}" y="${t+38}" width="4" height="6" fill="#444" />
          <rect x="${e+14}" y="${t+38}" width="4" height="6" fill="#444" />
          <rect x="${e+22}" y="${t+38}" width="6" height="6" fill="#444" />
          <rect x="${e+32}" y="${t+38}" width="4" height="6" fill="#444" />
          <rect x="${e+40}" y="${t+38}" width="4" height="6" fill="#444" />
          <!-- Pixel hull -->
          <rect x="${e+6}" y="${t+24}" width="38" height="12" fill="${h}" />
          <rect x="${e+8}" y="${t+26}" width="34" height="8" fill="${d}" />
          <!-- Pixel turret -->
          <rect x="${e+14}" y="${t+14}" width="22" height="10" fill="${h}" />
          <rect x="${e+16}" y="${t+16}" width="18" height="6" fill="${d}" />
          <!-- Pixel cannon -->
          <rect x="${e+34}" y="${t+16}" width="14" height="4" fill="${p}" />
          <rect x="${e+46}" y="${t+18}" width="4" height="2" fill="#ff0" />
          <!-- Pixel details -->
          <rect x="${e+18}" y="${t+18}" width="4" height="2" fill="#000" />
          <rect x="${e+26}" y="${t+18}" width="4" height="2" fill="#000" />
          <circle cx="${e+25}" cy="${t+8}" r="3" fill="${n}" stroke="${i}" stroke-width="1" />
          ${s}
        </g>
      `}if(c==="fantasy"){const d=o.primary,h=o.dark;return`
        <g class="cursor-pointer" data-piece="${r.type}" data-team="${r.team}" data-col="${r.col}" data-row="${r.row}">
          <ellipse cx="${e+25}" cy="${t+46}" rx="20" ry="4" fill="rgba(0,0,0,0.4)" />
          <!-- Dragon legs -->
          <path d="M${e+10} ${t+46} L${e+14} ${t+36} L${e+18} ${t+38} L${e+14} ${t+46} Z" fill="${h}" />
          <path d="M${e+36} ${t+46} L${e+32} ${t+36} L${e+36} ${t+38} L${e+40} ${t+46} Z" fill="${h}" />
          <!-- Dragon claws -->
          <circle cx="${e+10}" cy="${t+46}" r="2" fill="#333" />
          <circle cx="${e+14}" cy="${t+46}" r="2" fill="#333" />
          <circle cx="${e+36}" cy="${t+46}" r="2" fill="#333" />
          <circle cx="${e+40}" cy="${t+46}" r="2" fill="#333" />
          <!-- Dragon body -->
          <ellipse cx="${e+25}" cy="${t+32}" rx="18" ry="10" fill="${d}" stroke="${h}" stroke-width="1" />
          <!-- Scale pattern -->
          <ellipse cx="${e+18}" cy="${t+30}" rx="4" ry="3" fill="${h}" opacity="0.5" />
          <ellipse cx="${e+25}" cy="${t+32}" rx="4" ry="3" fill="${h}" opacity="0.5" />
          <ellipse cx="${e+32}" cy="${t+30}" rx="4" ry="3" fill="${h}" opacity="0.5" />
          <!-- Wings -->
          <path d="M${e+8} ${t+28} Q${e} ${t+18} ${e+4} ${t+10} L${e+14} ${t+24} Z" fill="${d}" stroke="${h}" stroke-width="0.5" opacity="0.8" />
          <path d="M${e+42} ${t+28} Q${e+50} ${t+18} ${e+46} ${t+10} L${e+36} ${t+24} Z" fill="${d}" stroke="${h}" stroke-width="0.5" opacity="0.8" />
          <!-- Dragon neck -->
          <path d="M${e+30} ${t+26} Q${e+38} ${t+20} ${e+42} ${t+14}" stroke="${d}" stroke-width="6" fill="none" />
          <path d="M${e+30} ${t+26} Q${e+38} ${t+20} ${e+42} ${t+14}" stroke="${h}" stroke-width="3" fill="none" />
          <!-- Dragon head -->
          <ellipse cx="${e+44}" cy="${t+12}" rx="6" ry="5" fill="${d}" stroke="${h}" stroke-width="1" />
          <!-- Dragon eye -->
          <circle cx="${e+46}" cy="${t+11}" r="2" fill="#ff4400" />
          <circle cx="${e+46}" cy="${t+11}" r="1" fill="#000" />
          <!-- Fire breath -->
          <ellipse cx="${e+52}" cy="${t+12}" rx="4" ry="2" fill="#ff6600" opacity="0.8">
            <animate attributeName="rx" values="4;6;4" dur="0.3s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="${e+54}" cy="${t+12}" rx="2" ry="1" fill="#ffff00" />
          <!-- Horns -->
          <path d="M${e+42} ${t+8} L${e+40} ${t+2} L${e+44} ${t+6} Z" fill="${h}" />
          <path d="M${e+46} ${t+8} L${e+48} ${t+2} L${e+44} ${t+6} Z" fill="${h}" />
          <circle cx="${e+25}" cy="${t+5}" r="3" fill="${n}" stroke="${i}" stroke-width="1" />
          ${s}
        </g>
      `}if(c==="minimal"){const d=o.primary;return`
        <g class="cursor-pointer" data-piece="${r.type}" data-team="${r.team}" data-col="${r.col}" data-row="${r.row}">
          <ellipse cx="${e+25}" cy="${t+46}" rx="20" ry="4" fill="rgba(0,0,0,0.2)" />
          <!-- Simple tracks -->
          <rect x="${e+4}" y="${t+36}" width="42" height="10" fill="#333" stroke="#000" stroke-width="2" />
          <!-- Simple hull -->
          <rect x="${e+8}" y="${t+22}" width="34" height="14" fill="${d}" stroke="#000" stroke-width="2" />
          <!-- Simple turret -->
          <circle cx="${e+25}" cy="${t+22}" r="10" fill="${d}" stroke="#000" stroke-width="2" />
          <!-- Simple cannon -->
          <rect x="${e+33}" y="${t+20}" width="16" height="4" fill="#333" stroke="#000" stroke-width="1.5" />
          <circle cx="${e+25}" cy="${t+8}" r="3" fill="${n}" stroke="${i}" stroke-width="1" />
          ${s}
        </g>
      `}if(c==="cartoon"){const d=o.primary,h=o.secondary;return`
        <g class="cursor-pointer" data-piece="${r.type}" data-team="${r.team}" data-col="${r.col}" data-row="${r.row}">
          <ellipse cx="${e+25}" cy="${t+46}" rx="20" ry="4" fill="rgba(0,0,0,0.3)" />
          <!-- Bouncy wheels -->
          <circle cx="${e+12}" cy="${t+40}" r="7" fill="#444" stroke="#000" stroke-width="2" />
          <circle cx="${e+25}" cy="${t+40}" r="7" fill="#444" stroke="#000" stroke-width="2" />
          <circle cx="${e+38}" cy="${t+40}" r="7" fill="#444" stroke="#000" stroke-width="2" />
          <!-- Cute body -->
          <ellipse cx="${e+25}" cy="${t+30}" rx="20" ry="10" fill="${d}" stroke="#000" stroke-width="2" />
          <!-- Big face turret -->
          <circle cx="${e+25}" cy="${t+22}" r="14" fill="${h}" stroke="#000" stroke-width="2" />
          <!-- Giant cute eyes -->
          <ellipse cx="${e+18}" cy="${t+20}" rx="5" ry="6" fill="#fff" stroke="#000" stroke-width="1" />
          <ellipse cx="${e+32}" cy="${t+20}" rx="5" ry="6" fill="#fff" stroke="#000" stroke-width="1" />
          <circle cx="${e+19}" cy="${t+21}" r="3" fill="#000" />
          <circle cx="${e+33}" cy="${t+21}" r="3" fill="#000" />
          <circle cx="${e+20}" cy="${t+20}" r="1" fill="#fff" />
          <circle cx="${e+34}" cy="${t+20}" r="1" fill="#fff" />
          <!-- Funny cannon -->
          <rect x="${e+38}" y="${t+18}" width="12" height="6" rx="3" fill="#666" stroke="#000" stroke-width="1.5" />
          <circle cx="${e+25}" cy="${t+6}" r="3" fill="${n}" stroke="${i}" stroke-width="1" />
          ${s}
        </g>
      `}if(c==="military"){const d=o.primary,h=o.secondary;return`
        <g class="cursor-pointer" data-piece="${r.type}" data-team="${r.team}" data-col="${r.col}" data-row="${r.row}">
          <ellipse cx="${e+25}" cy="${t+46}" rx="20" ry="4" fill="rgba(0,0,0,0.4)" />
          <!-- Realistic tracks -->
          <rect x="${e+2}" y="${t+34}" width="46" height="12" rx="3" fill="#1a1a1a" />
          <rect x="${e+4}" y="${t+36}" width="42" height="8" rx="2" fill="#0a0a0a" />
          <!-- Road wheels -->
          <circle cx="${e+10}" cy="${t+40}" r="4" fill="#333" />
          <circle cx="${e+20}" cy="${t+40}" r="4" fill="#333" />
          <circle cx="${e+30}" cy="${t+40}" r="4" fill="#333" />
          <circle cx="${e+40}" cy="${t+40}" r="4" fill="#333" />
          <!-- Hull with camo -->
          <path d="M${e+4} ${t+34} L${e+8} ${t+22} L${e+42} ${t+22} L${e+46} ${t+34} Z" fill="${d}" stroke="#222" stroke-width="1" />
          <path d="M${e+12} ${t+28} L${e+20} ${t+24} L${e+30} ${t+28} Z" fill="${h}" />
          <!-- Turret -->
          <rect x="${e+12}" y="${t+14}" width="26" height="10" rx="2" fill="${d}" stroke="#222" stroke-width="1" />
          <rect x="${e+16}" y="${t+16}" width="8" height="4" fill="${h}" />
          <!-- Long cannon -->
          <rect x="${e+36}" y="${t+16}" width="18" height="4" fill="#333" stroke="#222" stroke-width="0.5" />
          <rect x="${e+52}" y="${t+17}" width="4" height="2" fill="#222" />
          <!-- ERA blocks -->
          <rect x="${e+8}" y="${t+24}" width="4" height="6" fill="#444" />
          <rect x="${e+38}" y="${t+24}" width="4" height="6" fill="#444" />
          <circle cx="${e+25}" cy="${t+6}" r="3" fill="${n}" stroke="${i}" stroke-width="1" />
          ${s}
        </g>
      `}if(c==="scifi"){const d=o.primary,h=o.secondary;return`
        <g class="cursor-pointer" data-piece="${r.type}" data-team="${r.team}" data-col="${r.col}" data-row="${r.row}">
          <!-- Hover glow -->
          <ellipse cx="${e+25}" cy="${t+46}" rx="20" ry="4" fill="${h}" opacity="0.5"><animate attributeName="opacity" values="0.5;0.3;0.5" dur="0.8s" repeatCount="indefinite" /></ellipse>
          <!-- Hover pads -->
          <ellipse cx="${e+12}" cy="${t+42}" rx="8" ry="3" fill="${d}" stroke="${h}" stroke-width="1" />
          <ellipse cx="${e+38}" cy="${t+42}" rx="8" ry="3" fill="${d}" stroke="${h}" stroke-width="1" />
          <!-- Sleek hull -->
          <path d="M${e+4} ${t+38} L${e+10} ${t+22} L${e+40} ${t+22} L${e+46} ${t+38} Z" fill="${d}" stroke="${h}" stroke-width="1.5" />
          <!-- Energy core -->
          <circle cx="${e+25}" cy="${t+30}" r="4" fill="${h}"><animate attributeName="r" values="4;5;4" dur="1s" repeatCount="indefinite" /></circle>
          <!-- Turret dome -->
          <ellipse cx="${e+25}" cy="${t+18}" rx="12" ry="8" fill="${d}" stroke="${h}" stroke-width="1.5" />
          <ellipse cx="${e+25}" cy="${t+16}" rx="8" ry="4" fill="${h}" opacity="0.5" />
          <!-- Plasma cannon -->
          <rect x="${e+35}" y="${t+14}" width="14" height="6" rx="2" fill="${d}" stroke="${h}" stroke-width="1" />
          <circle cx="${e+48}" cy="${t+17}" r="3" fill="${h}"><animate attributeName="opacity" values="1;0.4;1" dur="0.5s" repeatCount="indefinite" /></circle>
          <circle cx="${e+25}" cy="${t+6}" r="3" fill="${n}" stroke="${i}" stroke-width="1" />
          ${s}
        </g>
      `}return`
      <g class="cursor-pointer" data-piece="${r.type}" data-team="${r.team}" data-col="${r.col}" data-row="${r.row}">
        <!-- Shadow -->
        <ellipse cx="${e+25}" cy="${t+46}" rx="20" ry="4" fill="rgba(0,0,0,0.4)" />
        <!-- Tracks -->
        <rect x="${e+4}" y="${t+34}" width="42" height="10" rx="5" fill="#2d2d2d" />
        <rect x="${e+6}" y="${t+36}" width="38" height="6" rx="3" fill="#1a1a1a" />
        <!-- Track wheels -->
        <circle cx="${e+12}" cy="${t+39}" r="3" fill="#3f3f3f" />
        <circle cx="${e+25}" cy="${t+39}" r="3" fill="#3f3f3f" />
        <circle cx="${e+38}" cy="${t+39}" r="3" fill="#3f3f3f" />
        <!-- Track details -->
        <line x1="${e+8}" y1="${t+36}" x2="${e+8}" y2="${t+42}" stroke="#4a4a4a" stroke-width="1" />
        <line x1="${e+15}" y1="${t+36}" x2="${e+15}" y2="${t+42}" stroke="#4a4a4a" stroke-width="1" />
        <line x1="${e+22}" y1="${t+36}" x2="${e+22}" y2="${t+42}" stroke="#4a4a4a" stroke-width="1" />
        <line x1="${e+29}" y1="${t+36}" x2="${e+29}" y2="${t+42}" stroke="#4a4a4a" stroke-width="1" />
        <line x1="${e+36}" y1="${t+36}" x2="${e+36}" y2="${t+42}" stroke="#4a4a4a" stroke-width="1" />
        <line x1="${e+42}" y1="${t+36}" x2="${e+42}" y2="${t+42}" stroke="#4a4a4a" stroke-width="1" />
        <!-- Hull -->
        <path d="M${e+6} ${t+34} L${e+10} ${t+24} L${e+40} ${t+24} L${e+44} ${t+34} Z" fill="${l}" stroke="${u}" stroke-width="1" />
        <!-- Hull top -->
        <rect x="${e+12}" y="${t+20}" width="26" height="6" fill="${l}" stroke="${u}" stroke-width="1" />
        <!-- Turret -->
        <ellipse cx="${e+25}" cy="${t+18}" rx="12" ry="8" fill="${l}" stroke="${u}" stroke-width="1.5" />
        <ellipse cx="${e+25}" cy="${t+16}" rx="10" ry="6" fill="${u}" />
        <!-- Cannon -->
        <rect x="${e+32}" y="${t+14}" width="16" height="4" rx="2" fill="#4a4a4a" />
        <rect x="${e+46}" y="${t+15}" width="4" height="2" fill="#2d2d2d" />
        <!-- Hatch -->
        <ellipse cx="${e+25}" cy="${t+14}" rx="4" ry="3" fill="${u}" stroke="#1a1a1a" stroke-width="0.5" />
        <!-- Commander cupola -->
        <circle cx="${e+20}" cy="${t+12}" r="3" fill="${l}" stroke="${u}" stroke-width="1" />
        <!-- Machine gun -->
        <rect x="${e+18}" y="${t+10}" width="8" height="2" fill="#3f3f3f" />
        <!-- Team indicator -->
        <circle cx="${e+25}" cy="${t+5}" r="3" fill="${n}" stroke="${i}" stroke-width="1" />
        <!-- Antenna -->
        <line x1="${e+35}" y1="${t+12}" x2="${e+38}" y2="${t+4}" stroke="#4a4a4a" stroke-width="1" />
        <circle cx="${e+38}" cy="${t+4}" r="1" fill="#ef4444" />
        ${s}
      </g>
    `}if(r.type==="ship"){const o=xt(r.team),c=o.helmet,l=o.uniform,u=o.accent,f=Vt();if(f==="robot"){const d=o.primary,h=o.uniform;return`
        <g class="cursor-pointer" data-piece="${r.type}" data-team="${r.team}" data-col="${r.col}" data-row="${r.row}">
          <!-- Hover effect -->
          <ellipse cx="${e+25}" cy="${t+47}" rx="20" ry="3" fill="${d}" opacity="0.4">
            <animate attributeName="ry" values="3;4;3" dur="0.5s" repeatCount="indefinite" />
          </ellipse>
          <!-- Hover cushion -->
          <ellipse cx="${e+25}" cy="${t+42}" rx="22" ry="6" fill="${h}" stroke="${d}" stroke-width="1" />
          <!-- Main body -->
          <rect x="${e+6}" y="${t+24}" width="38" height="16" rx="4" fill="${h}" stroke="${d}" stroke-width="1.5" />
          <!-- Cockpit dome -->
          <ellipse cx="${e+25}" cy="${t+22}" rx="12" ry="8" fill="${h}" stroke="${d}" stroke-width="1" />
          <ellipse cx="${e+25}" cy="${t+20}" rx="8" ry="5" fill="${d}" opacity="0.6">
            <animate attributeName="opacity" values="0.6;0.3;0.6" dur="1.5s" repeatCount="indefinite" />
          </ellipse>
          <!-- Engine pods -->
          <rect x="${e+4}" y="${t+28}" width="6" height="10" rx="2" fill="${d}" />
          <rect x="${e+40}" y="${t+28}" width="6" height="10" rx="2" fill="${d}" />
          <!-- Thrust effects -->
          <ellipse cx="${e+7}" cy="${t+40}" rx="2" ry="4" fill="#00ffff" opacity="0.6">
            <animate attributeName="ry" values="4;6;4" dur="0.3s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="${e+43}" cy="${t+40}" rx="2" ry="4" fill="#00ffff" opacity="0.6">
            <animate attributeName="ry" values="4;6;4" dur="0.3s" repeatCount="indefinite" />
          </ellipse>
          <!-- Laser cannons -->
          <rect x="${e+14}" y="${t+18}" width="3" height="8" fill="${d}" />
          <rect x="${e+33}" y="${t+18}" width="3" height="8" fill="${d}" />
          <circle cx="${e+15.5}" cy="${t+16}" r="2" fill="#ff0000" />
          <circle cx="${e+34.5}" cy="${t+16}" r="2" fill="#ff0000" />
          <circle cx="${e+25}" cy="${t+5}" r="3" fill="${n}" stroke="${i}" stroke-width="1" />
          ${s}
        </g>
      `}if(f==="medieval"){const d=o.secondary,h=o.dark;return`
        <g class="cursor-pointer" data-piece="${r.type}" data-team="${r.team}" data-col="${r.col}" data-row="${r.row}">
          <!-- Water ripples -->
          <ellipse cx="${e+25}" cy="${t+46}" rx="22" ry="4" fill="#6bb3e8" opacity="0.5" />
          <!-- Hull -->
          <path d="M${e+2} ${t+40} Q${e+5} ${t+46} ${e+25} ${t+46} Q${e+45} ${t+46} ${e+48} ${t+40} L${e+44} ${t+30} L${e+6} ${t+30} Z" fill="${d}" stroke="${h}" stroke-width="1.5" />
          <!-- Shield row -->
          <circle cx="${e+12}" cy="${t+34}" r="4" fill="${o.primary}" stroke="${h}" stroke-width="1" />
          <circle cx="${e+22}" cy="${t+34}" r="4" fill="${n}" stroke="${h}" stroke-width="1" />
          <circle cx="${e+32}" cy="${t+34}" r="4" fill="${o.primary}" stroke="${h}" stroke-width="1" />
          <circle cx="${e+42}" cy="${t+34}" r="4" fill="${n}" stroke="${h}" stroke-width="1" />
          <!-- Oars -->
          <line x1="${e+8}" y1="${t+38}" x2="${e}" y2="${t+46}" stroke="${h}" stroke-width="1.5" />
          <line x1="${e+18}" y1="${t+38}" x2="${e+10}" y2="${t+46}" stroke="${h}" stroke-width="1.5" />
          <line x1="${e+32}" y1="${t+38}" x2="${e+40}" y2="${t+46}" stroke="${h}" stroke-width="1.5" />
          <line x1="${e+42}" y1="${t+38}" x2="${e+50}" y2="${t+46}" stroke="${h}" stroke-width="1.5" />
          <!-- Mast -->
          <rect x="${e+23}" y="${t+8}" width="4" height="24" fill="${h}" />
          <!-- Sail -->
          <path d="M${e+10} ${t+10} L${e+25} ${t+8} L${e+40} ${t+10} L${e+38} ${t+26} L${e+12} ${t+26} Z" fill="${n}" stroke="${h}" stroke-width="1" />
          <!-- Sail stripes -->
          <line x1="${e+12}" y1="${t+16}" x2="${e+38}" y2="${t+16}" stroke="${o.primary}" stroke-width="2" />
          <line x1="${e+12}" y1="${t+22}" x2="${e+38}" y2="${t+22}" stroke="${o.primary}" stroke-width="2" />
          <!-- Dragon head prow -->
          <path d="M${e+2} ${t+30} Q${e-4} ${t+22} ${e-2} ${t+14} L${e+2} ${t+18} Q${e} ${t+24} ${e+4} ${t+28} Z" fill="${d}" stroke="${h}" stroke-width="1" />
          <circle cx="${e-1}" cy="${t+16}" r="1.5" fill="#ff0000" />
          <!-- Dragon tail -->
          <path d="M${e+48} ${t+30} Q${e+52} ${t+24} ${e+50} ${t+18} L${e+46} ${t+26} Z" fill="${d}" stroke="${h}" stroke-width="1" />
          <circle cx="${e+25}" cy="${t+5}" r="3" fill="${n}" stroke="${i}" stroke-width="1" />
          ${s}
        </g>
      `}if(f==="pixel"){const d=o.primary,h=o.secondary,p=o.uniform;return`
        <g class="cursor-pointer" data-piece="${r.type}" data-team="${r.team}" data-col="${r.col}" data-row="${r.row}">
          <!-- Water -->
          <rect x="${e+4}" y="${t+44}" width="42" height="4" fill="#4488cc" />
          <!-- Hull -->
          <rect x="${e+6}" y="${t+32}" width="38" height="12" fill="${h}" />
          <rect x="${e+4}" y="${t+36}" width="4" height="8" fill="${h}" />
          <rect x="${e+42}" y="${t+36}" width="4" height="8" fill="${h}" />
          <!-- Deck -->
          <rect x="${e+8}" y="${t+28}" width="34" height="4" fill="${d}" />
          <!-- Bridge -->
          <rect x="${e+18}" y="${t+16}" width="14" height="12" fill="${h}" />
          <rect x="${e+20}" y="${t+18}" width="10" height="4" fill="#88ccff" />
          <!-- Guns -->
          <rect x="${e+8}" y="${t+24}" width="8" height="4" fill="${p}" />
          <rect x="${e+4}" y="${t+24}" width="6" height="2" fill="#444" />
          <rect x="${e+34}" y="${t+24}" width="8" height="4" fill="${p}" />
          <rect x="${e+40}" y="${t+24}" width="6" height="2" fill="#444" />
          <!-- Antenna -->
          <rect x="${e+24}" y="${t+10}" width="2" height="6" fill="#444" />
          <rect x="${e+22}" y="${t+8}" width="6" height="2" fill="#444" />
          <circle cx="${e+25}" cy="${t+5}" r="3" fill="${n}" stroke="${i}" stroke-width="1" />
          ${s}
        </g>
      `}if(f==="fantasy"){const d=o.primary,h=o.dark;return`
        <g class="cursor-pointer" data-piece="${r.type}" data-team="${r.team}" data-col="${r.col}" data-row="${r.row}">
          <!-- Water splash -->
          <ellipse cx="${e+25}" cy="${t+46}" rx="22" ry="4" fill="#6bb3e8" opacity="0.6" />
          <!-- Serpent body coils in water -->
          <ellipse cx="${e+15}" cy="${t+40}" rx="8" ry="5" fill="${d}" stroke="${h}" stroke-width="1" />
          <ellipse cx="${e+35}" cy="${t+40}" rx="8" ry="5" fill="${d}" stroke="${h}" stroke-width="1" />
          <ellipse cx="${e+25}" cy="${t+36}" rx="10" ry="6" fill="${d}" stroke="${h}" stroke-width="1" />
          <!-- Serpent neck rising -->
          <path d="M${e+25} ${t+30} Q${e+30} ${t+20} ${e+25} ${t+10}" stroke="${d}" stroke-width="10" fill="none" />
          <path d="M${e+25} ${t+30} Q${e+30} ${t+20} ${e+25} ${t+10}" stroke="${h}" stroke-width="5" fill="none" />
          <!-- Serpent head -->
          <ellipse cx="${e+25}" cy="${t+12}" rx="8" ry="6" fill="${d}" stroke="${h}" stroke-width="1" />
          <!-- Eyes -->
          <circle cx="${e+22}" cy="${t+10}" r="2" fill="#ffff00" />
          <circle cx="${e+28}" cy="${t+10}" r="2" fill="#ffff00" />
          <circle cx="${e+22}" cy="${t+10}" r="1" fill="#000" />
          <circle cx="${e+28}" cy="${t+10}" r="1" fill="#000" />
          <!-- Fangs -->
          <path d="M${e+21} ${t+16} L${e+23} ${t+20} L${e+25} ${t+16}" fill="#ffffff" />
          <path d="M${e+25} ${t+16} L${e+27} ${t+20} L${e+29} ${t+16}" fill="#ffffff" />
          <!-- Fins/spines -->
          <path d="M${e+20} ${t+8} L${e+18} ${t+2} L${e+22} ${t+6} Z" fill="${h}" />
          <path d="M${e+25} ${t+6} L${e+25} ${t} L${e+28} ${t+5} Z" fill="${h}" />
          <path d="M${e+30} ${t+8} L${e+32} ${t+2} L${e+28} ${t+6} Z" fill="${h}" />
          <!-- Magic aura -->
          <circle cx="${e+25}" cy="${t+25}" r="15" fill="none" stroke="${d}" stroke-width="1" opacity="0.4">
            <animate attributeName="r" values="15;18;15" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="${e+25}" cy="${t+5}" r="3" fill="${n}" stroke="${i}" stroke-width="1" />
          ${s}
        </g>
      `}if(f==="minimal"){const d=o.primary;return`
        <g class="cursor-pointer" data-piece="${r.type}" data-team="${r.team}" data-col="${r.col}" data-row="${r.row}">
          <ellipse cx="${e+25}" cy="${t+46}" rx="20" ry="3" fill="#4488cc" opacity="0.4" />
          <!-- Simple hull -->
          <path d="M${e+6} ${t+38} L${e+10} ${t+44} L${e+40} ${t+44} L${e+44} ${t+38} L${e+42} ${t+28} L${e+8} ${t+28} Z" fill="${d}" stroke="#000" stroke-width="2" />
          <!-- Simple deck -->
          <rect x="${e+10}" y="${t+24}" width="30" height="6" fill="${d}" stroke="#000" stroke-width="1.5" />
          <!-- Simple bridge -->
          <rect x="${e+20}" y="${t+14}" width="10" height="12" fill="${d}" stroke="#000" stroke-width="1.5" />
          <circle cx="${e+25}" cy="${t+8}" r="3" fill="${n}" stroke="${i}" stroke-width="1" />
          ${s}
        </g>
      `}if(f==="cartoon"){const d=o.primary,h=o.secondary;return`
        <g class="cursor-pointer" data-piece="${r.type}" data-team="${r.team}" data-col="${r.col}" data-row="${r.row}">
          <ellipse cx="${e+25}" cy="${t+46}" rx="22" ry="4" fill="#7ec8f0" opacity="0.6" />
          <!-- Cute rounded hull -->
          <ellipse cx="${e+25}" cy="${t+40}" rx="20" ry="8" fill="${d}" stroke="#000" stroke-width="2" />
          <!-- Cute cabin -->
          <rect x="${e+16}" y="${t+24}" width="18" height="14" rx="4" fill="${h}" stroke="#000" stroke-width="2" />
          <!-- Big cute eyes (windows) -->
          <ellipse cx="${e+20}" cy="${t+30}" rx="3" ry="4" fill="#fff" stroke="#000" stroke-width="1" />
          <ellipse cx="${e+30}" cy="${t+30}" rx="3" ry="4" fill="#fff" stroke="#000" stroke-width="1" />
          <circle cx="${e+21}" cy="${t+31}" r="2" fill="#000" />
          <circle cx="${e+31}" cy="${t+31}" r="2" fill="#000" />
          <circle cx="${e+22}" cy="${t+30}" r="0.5" fill="#fff" />
          <circle cx="${e+32}" cy="${t+30}" r="0.5" fill="#fff" />
          <!-- Cute smokestack -->
          <rect x="${e+22}" y="${t+12}" width="6" height="14" rx="2" fill="${d}" stroke="#000" stroke-width="1.5" />
          <!-- Smoke puff -->
          <ellipse cx="${e+25}" cy="${t+8}" rx="6" ry="4" fill="#ddd" stroke="#000" stroke-width="1" />
          <ellipse cx="${e+28}" cy="${t+5}" rx="4" ry="3" fill="#eee" />
          <!-- Cute smile -->
          <path d="M${e+18} ${t+44} Q${e+25} ${t+48} ${e+32} ${t+44}" stroke="#000" stroke-width="1.5" fill="none" />
          <circle cx="${e+25}" cy="${t+6}" r="3" fill="${n}" stroke="${i}" stroke-width="1" />
          ${s}
        </g>
      `}if(f==="military"){const d=o.primary,h=o.secondary;return`
        <g class="cursor-pointer" data-piece="${r.type}" data-team="${r.team}" data-col="${r.col}" data-row="${r.row}">
          <ellipse cx="${e+25}" cy="${t+46}" rx="22" ry="4" fill="#4466aa" opacity="0.5" />
          <!-- Angular hull -->
          <path d="M${e+2} ${t+38} L${e+8} ${t+44} L${e+42} ${t+44} L${e+48} ${t+38} L${e+44} ${t+28} L${e+6} ${t+28} Z" fill="${d}" stroke="#222" stroke-width="1.5" />
          <rect x="${e+10}" y="${t+30}" width="10" height="6" fill="${h}" />
          <rect x="${e+30}" y="${t+32}" width="8" height="4" fill="${h}" />
          <!-- Armored deck -->
          <rect x="${e+8}" y="${t+24}" width="34" height="6" fill="${d}" stroke="#222" stroke-width="1" />
          <!-- Bridge tower -->
          <rect x="${e+18}" y="${t+12}" width="14" height="14" fill="${d}" stroke="#222" stroke-width="1" />
          <rect x="${e+20}" y="${t+14}" width="10" height="4" fill="#333" />
          <rect x="${e+22}" y="${t+22}" width="6" height="4" fill="${h}" />
          <!-- Main gun turrets -->
          <rect x="${e+6}" y="${t+20}" width="8" height="6" fill="#333" stroke="#222" stroke-width="0.5" />
          <rect x="${e+2}" y="${t+22}" width="6" height="2" fill="#444" />
          <rect x="${e+36}" y="${t+20}" width="8" height="6" fill="#333" stroke="#222" stroke-width="0.5" />
          <rect x="${e+42}" y="${t+22}" width="6" height="2" fill="#444" />
          <!-- Radar array -->
          <line x1="${e+25}" y1="${t+12}" x2="${e+25}" y2="${t+6}" stroke="#444" stroke-width="2" />
          <rect x="${e+21}" y="${t+4}" width="8" height="4" fill="#333" />
          <circle cx="${e+25}" cy="${t+6}" r="3" fill="${n}" stroke="${i}" stroke-width="1" />
          ${s}
        </g>
      `}if(f==="scifi"){const d=o.primary,h=o.secondary;return`
        <g class="cursor-pointer" data-piece="${r.type}" data-team="${r.team}" data-col="${r.col}" data-row="${r.row}">
          <!-- Hover field -->
          <ellipse cx="${e+25}" cy="${t+46}" rx="22" ry="5" fill="${h}" opacity="0.4">
            <animate attributeName="ry" values="5;7;5" dur="0.8s" repeatCount="indefinite" />
          </ellipse>
          <!-- Sleek hull -->
          <path d="M${e+2} ${t+36} Q${e+25} ${t+44} ${e+48} ${t+36} L${e+44} ${t+28} Q${e+25} ${t+32} ${e+6} ${t+28} Z" fill="${d}" stroke="${h}" stroke-width="1.5" />
          <!-- Energy line -->
          <path d="M${e+8} ${t+32} Q${e+25} ${t+36} ${e+42} ${t+32}" stroke="${h}" stroke-width="2">
            <animate attributeName="opacity" values="1;0.4;1" dur="0.5s" repeatCount="indefinite" />
          </path>
          <!-- Command deck -->
          <path d="M${e+12} ${t+28} L${e+16} ${t+18} L${e+34} ${t+18} L${e+38} ${t+28} Z" fill="${d}" stroke="${h}" stroke-width="1" />
          <ellipse cx="${e+25}" cy="${t+22}" rx="8" ry="4" fill="#111" stroke="${h}" stroke-width="0.5" />
          <ellipse cx="${e+25}" cy="${t+22}" rx="6" ry="3" fill="${h}" opacity="0.3" />
          <!-- Side thrusters -->
          <ellipse cx="${e+8}" cy="${t+32}" rx="4" ry="6" fill="${h}" opacity="0.6">
            <animate attributeName="rx" values="4;5;4" dur="0.4s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="${e+42}" cy="${t+32}" rx="4" ry="6" fill="${h}" opacity="0.6">
            <animate attributeName="rx" values="4;5;4" dur="0.4s" repeatCount="indefinite" />
          </ellipse>
          <!-- Sensor array -->
          <rect x="${e+22}" y="${t+12}" width="6" height="6" rx="1" fill="${d}" stroke="${h}" stroke-width="1" />
          <circle cx="${e+25}" cy="${t+15}" r="2" fill="${h}">
            <animate attributeName="opacity" values="1;0.3;1" dur="1s" repeatCount="indefinite" />
          </circle>
          <circle cx="${e+25}" cy="${t+6}" r="3" fill="${n}" stroke="${i}" stroke-width="1" />
          ${s}
        </g>
      `}return`
      <g class="cursor-pointer" data-piece="${r.type}" data-team="${r.team}" data-col="${r.col}" data-row="${r.row}">
        <!-- Water ripples -->
        <ellipse cx="${e+25}" cy="${t+46}" rx="22" ry="4" fill="#6bb3e8" opacity="0.5" />
        <ellipse cx="${e+25}" cy="${t+44}" rx="18" ry="3" fill="#7ec8f0" opacity="0.4" />
        <!-- Hull (boat shape) -->
        <path d="M${e+5} ${t+38} L${e+10} ${t+44} L${e+40} ${t+44} L${e+45} ${t+38} L${e+42} ${t+30} L${e+8} ${t+30} Z" fill="${c}" stroke="${l}" stroke-width="1.5" />
        <!-- Hull stripe -->
        <path d="M${e+8} ${t+36} L${e+42} ${t+36}" stroke="${l}" stroke-width="1" />
        <!-- Deck -->
        <rect x="${e+10}" y="${t+26}" width="30" height="6" rx="1" fill="${u}" stroke="${l}" stroke-width="1" />
        <!-- Bridge/Command tower -->
        <rect x="${e+20}" y="${t+16}" width="12" height="12" rx="1" fill="${c}" stroke="${l}" stroke-width="1" />
        <rect x="${e+22}" y="${t+18}" width="8" height="4" rx="1" fill="#87ceeb" opacity="0.7" />
        <!-- Bridge roof -->
        <rect x="${e+19}" y="${t+14}" width="14" height="3" rx="1" fill="${l}" />
        <!-- Main cannon (front) -->
        <rect x="${e+12}" y="${t+22}" width="6" height="6" rx="1" fill="#4a4a4a" stroke="#2d2d2d" stroke-width="0.5" />
        <rect x="${e+6}" y="${t+24}" width="8" height="2" rx="1" fill="#3d3d3d" />
        <!-- Main cannon (back) -->
        <rect x="${e+32}" y="${t+22}" width="6" height="6" rx="1" fill="#4a4a4a" stroke="#2d2d2d" stroke-width="0.5" />
        <rect x="${e+36}" y="${t+24}" width="8" height="2" rx="1" fill="#3d3d3d" />
        <!-- Side guns -->
        <rect x="${e+8}" y="${t+28}" width="4" height="2" fill="#3d3d3d" />
        <rect x="${e+38}" y="${t+28}" width="4" height="2" fill="#3d3d3d" />
        <!-- Radar/Antenna -->
        <line x1="${e+26}" y1="${t+14}" x2="${e+26}" y2="${t+8}" stroke="#4a4a4a" stroke-width="1.5" />
        <ellipse cx="${e+26}" cy="${t+7}" rx="4" ry="2" fill="none" stroke="#4a4a4a" stroke-width="1" />
        <!-- Flag -->
        <line x1="${e+40}" y1="${t+26}" x2="${e+40}" y2="${t+18}" stroke="#4a4a4a" stroke-width="1" />
        <rect x="${e+40}" y="${t+18}" width="6" height="4" fill="${n}" stroke="${i}" stroke-width="0.5" />
        <!-- Team indicator -->
        <circle cx="${e+25}" cy="${t+5}" r="3" fill="${n}" stroke="${i}" stroke-width="1" />
        ${s}
      </g>
    `}if(r.type==="carrier"){const o=xt(r.team),c=o.helmet,l=o.uniform,u=o.accent,f=r.hp===1,d=Vt();if(d==="robot"){const h=o.primary,p=o.uniform;return`
        <g class="cursor-pointer" data-piece="${r.type}" data-team="${r.team}" data-col="${r.col}" data-row="${r.row}">
          <!-- Hover field -->
          <ellipse cx="${e+25}" cy="${t+47}" rx="24" ry="4" fill="${h}" opacity="0.3">
            <animate attributeName="opacity" values="0.3;0.5;0.3" dur="1s" repeatCount="indefinite" />
          </ellipse>
          <!-- Main platform -->
          <rect x="${e+2}" y="${t+30}" width="46" height="14" rx="3" fill="${p}" stroke="${h}" stroke-width="1.5" />
          <!-- Landing deck -->
          <rect x="${e+4}" y="${t+22}" width="42" height="10" fill="#111" stroke="${h}" stroke-width="1" />
          <!-- Landing lights -->
          <circle cx="${e+10}" cy="${t+27}" r="2" fill="${h}"><animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite" /></circle>
          <circle cx="${e+25}" cy="${t+27}" r="2" fill="${h}"><animate attributeName="opacity" values="0;1;0" dur="1s" repeatCount="indefinite" /></circle>
          <circle cx="${e+40}" cy="${t+27}" r="2" fill="${h}"><animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite" /></circle>
          <!-- Control tower -->
          <rect x="${e+38}" y="${t+10}" width="8" height="14" rx="1" fill="${p}" stroke="${h}" stroke-width="1" />
          <rect x="${e+39}" y="${t+12}" width="6" height="4" fill="${h}" opacity="0.6" />
          <!-- Sensor array -->
          <rect x="${e+40}" y="${t+4}" width="4" height="6" fill="${h}" />
          <circle cx="${e+42}" cy="${t+3}" r="3" fill="${h}" opacity="0.8">
            <animate attributeName="r" values="3;4;3" dur="0.5s" repeatCount="indefinite" />
          </circle>
          <!-- Side thrusters -->
          <rect x="${e}" y="${t+34}" width="4" height="6" rx="1" fill="${h}" />
          <rect x="${e+46}" y="${t+34}" width="4" height="6" rx="1" fill="${h}" />
          <circle cx="${e+25}" cy="${t+5}" r="3" fill="${n}" stroke="${i}" stroke-width="1" />
          ${f?`<rect x="${e+10}" y="${t+24}" width="20" height="6" fill="#ff0000" opacity="0.3"><animate attributeName="opacity" values="0.3;0.6;0.3" dur="0.5s" repeatCount="indefinite" /></rect>`:""}
          ${r.hasHelicopter?`<ellipse cx="${e+20}" cy="${t+27}" rx="6" ry="4" fill="${h}" opacity="0.8" /><line x1="${e+14}" y1="${t+27}" x2="${e+26}" y2="${t+27}" stroke="${p}" stroke-width="1" />`:""}
          ${s}
        </g>
      `}if(d==="medieval"){const h=o.secondary,p=o.dark,g=o.primary;return`
        <g class="cursor-pointer" data-piece="${r.type}" data-team="${r.team}" data-col="${r.col}" data-row="${r.row}">
          <!-- Water -->
          <ellipse cx="${e+25}" cy="${t+47}" rx="24" ry="4" fill="#6bb3e8" opacity="0.5" />
          <!-- Wooden hull -->
          <path d="M${e+2} ${t+42} Q${e+5} ${t+48} ${e+25} ${t+48} Q${e+45} ${t+48} ${e+48} ${t+42} L${e+48} ${t+32} L${e+2} ${t+32} Z" fill="${h}" stroke="${p}" stroke-width="1.5" />
          <!-- Castle base on ship -->
          <rect x="${e+6}" y="${t+18}" width="38" height="16" fill="${g}" stroke="${p}" stroke-width="1" />
          <!-- Battlements -->
          <rect x="${e+6}" y="${t+14}" width="6" height="6" fill="${g}" stroke="${p}" stroke-width="0.5" />
          <rect x="${e+16}" y="${t+14}" width="6" height="6" fill="${g}" stroke="${p}" stroke-width="0.5" />
          <rect x="${e+28}" y="${t+14}" width="6" height="6" fill="${g}" stroke="${p}" stroke-width="0.5" />
          <rect x="${e+38}" y="${t+14}" width="6" height="6" fill="${g}" stroke="${p}" stroke-width="0.5" />
          <!-- Tower -->
          <rect x="${e+20}" y="${t+6}" width="10" height="14" fill="${g}" stroke="${p}" stroke-width="1" />
          <rect x="${e+18}" y="${t+4}" width="14" height="4" fill="${g}" stroke="${p}" stroke-width="0.5" />
          <!-- Banner -->
          <line x1="${e+25}" y1="${t+4}" x2="${e+25}" y2="${t-2}" stroke="${p}" stroke-width="1" />
          <path d="M${e+25} ${t-2} L${e+34} ${t+1} L${e+25} ${t+4} Z" fill="${n}" />
          <circle cx="${e+25}" cy="${t+5}" r="3" fill="${n}" stroke="${i}" stroke-width="1" />
          ${f?`<path d="M${e+15} ${t+20} L${e+25} ${t+30} M${e+25} ${t+20} L${e+15} ${t+30}" stroke="#8b0000" stroke-width="2" />`:""}
          ${r.hasHelicopter?`<text x="${e+35}" y="${t+26}" font-size="10" fill="${n}">🦅</text>`:""}
          ${s}
        </g>
      `}if(d==="pixel"){const h=o.primary,p=o.secondary,g=o.uniform;return`
        <g class="cursor-pointer" data-piece="${r.type}" data-team="${r.team}" data-col="${r.col}" data-row="${r.row}">
          <!-- Water -->
          <rect x="${e+2}" y="${t+44}" width="46" height="4" fill="#4488cc" />
          <!-- Hull -->
          <rect x="${e+2}" y="${t+32}" width="46" height="12" fill="${p}" />
          <!-- Deck -->
          <rect x="${e+4}" y="${t+22}" width="42" height="10" fill="${g}" />
          <!-- Runway markings -->
          <rect x="${e+8}" y="${t+26}" width="30" height="2" fill="#ffffff" />
          <!-- Control tower -->
          <rect x="${e+38}" y="${t+12}" width="8" height="10" fill="${p}" />
          <rect x="${e+40}" y="${t+14}" width="4" height="4" fill="#88ccff" />
          <!-- Antenna -->
          <rect x="${e+41}" y="${t+6}" width="2" height="6" fill="#444" />
          <rect x="${e+39}" y="${t+4}" width="6" height="2" fill="#444" />
          <circle cx="${e+25}" cy="${t+5}" r="3" fill="${n}" stroke="${i}" stroke-width="1" />
          ${f?`<rect x="${e+14}" y="${t+24}" width="8" height="4" fill="#ff0000" />`:""}
          ${r.hasHelicopter?`<rect x="${e+18}" y="${t+24}" width="10" height="4" fill="${h}" /><rect x="${e+16}" y="${t+26}" width="14" height="2" fill="#444" />`:""}
          ${s}
        </g>
      `}if(d==="fantasy"){const h=o.primary,p=o.dark,g=o.secondary;return`
        <g class="cursor-pointer" data-piece="${r.type}" data-team="${r.team}" data-col="${r.col}" data-row="${r.row}">
          <!-- Water ripples -->
          <ellipse cx="${e+25}" cy="${t+47}" rx="24" ry="4" fill="#6bb3e8" opacity="0.5" />
          <!-- Turtle flippers -->
          <ellipse cx="${e+8}" cy="${t+40}" rx="6" ry="4" fill="${g}" stroke="${p}" stroke-width="1" />
          <ellipse cx="${e+42}" cy="${t+40}" rx="6" ry="4" fill="${g}" stroke="${p}" stroke-width="1" />
          <!-- Turtle body -->
          <ellipse cx="${e+25}" cy="${t+36}" rx="22" ry="10" fill="${g}" stroke="${p}" stroke-width="1" />
          <!-- Giant shell (platform) -->
          <ellipse cx="${e+25}" cy="${t+28}" rx="22" ry="12" fill="${h}" stroke="${p}" stroke-width="1.5" />
          <!-- Shell pattern -->
          <ellipse cx="${e+25}" cy="${t+26}" rx="10" ry="6" fill="${p}" opacity="0.5" />
          <ellipse cx="${e+14}" cy="${t+30}" rx="5" ry="4" fill="${p}" opacity="0.4" />
          <ellipse cx="${e+36}" cy="${t+30}" rx="5" ry="4" fill="${p}" opacity="0.4" />
          <!-- Platform structures on shell -->
          <rect x="${e+18}" y="${t+16}" width="14" height="8" rx="2" fill="${h}" stroke="${p}" stroke-width="1" />
          <!-- Turtle head -->
          <ellipse cx="${e+6}" cy="${t+28}" rx="6" ry="5" fill="${g}" stroke="${p}" stroke-width="1" />
          <circle cx="${e+4}" cy="${t+26}" r="1.5" fill="#000" />
          <!-- Magic crystals on shell -->
          <path d="M${e+25} ${t+12} L${e+28} ${t+20} L${e+22} ${t+20} Z" fill="${h}" stroke="${n}" stroke-width="1" />
          <circle cx="${e+25}" cy="${t+14}" r="3" fill="${n}" opacity="0.8">
            <animate attributeName="opacity" values="0.8;0.4;0.8" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="${e+25}" cy="${t+5}" r="3" fill="${n}" stroke="${i}" stroke-width="1" />
          ${f?`<path d="M${e+20} ${t+24} L${e+30} ${t+32} M${e+30} ${t+24} L${e+20} ${t+32}" stroke="#8b0000" stroke-width="2" />`:""}
          ${r.hasHelicopter?`<text x="${e+32}" y="${t+22}" font-size="8" fill="${n}">🦋</text>`:""}
          ${s}
        </g>
      `}if(d==="minimal"){const h=o.primary;return`
        <g class="cursor-pointer" data-piece="${r.type}" data-team="${r.team}" data-col="${r.col}" data-row="${r.row}">
          <ellipse cx="${e+25}" cy="${t+46}" rx="22" ry="3" fill="#4488cc" opacity="0.4" />
          <!-- Simple hull -->
          <rect x="${e+4}" y="${t+30}" width="42" height="14" fill="${h}" stroke="#000" stroke-width="2" />
          <!-- Simple deck -->
          <rect x="${e+6}" y="${t+22}" width="38" height="10" fill="${h}" stroke="#000" stroke-width="1.5" />
          <!-- Simple tower -->
          <rect x="${e+38}" y="${t+12}" width="8" height="12" fill="${h}" stroke="#000" stroke-width="1.5" />
          <circle cx="${e+25}" cy="${t+6}" r="3" fill="${n}" stroke="${i}" stroke-width="1" />
          ${f?`<line x1="${e+15}" y1="${t+20}" x2="${e+30}" y2="${t+35}" stroke="#ff0000" stroke-width="2" />`:""}
          ${r.hasHelicopter?`<ellipse cx="${e+20}" cy="${t+27}" rx="6" ry="4" fill="#333" stroke="#000" stroke-width="1" />`:""}
          ${s}
        </g>
      `}if(d==="cartoon"){const h=o.primary,p=o.secondary;return`
        <g class="cursor-pointer" data-piece="${r.type}" data-team="${r.team}" data-col="${r.col}" data-row="${r.row}">
          <ellipse cx="${e+25}" cy="${t+46}" rx="24" ry="4" fill="#7ec8f0" opacity="0.6" />
          <!-- Cute whale body -->
          <ellipse cx="${e+25}" cy="${t+36}" rx="24" ry="12" fill="${h}" stroke="#000" stroke-width="2" />
          <!-- Whale tail -->
          <path d="M${e+46} ${t+36} Q${e+54} ${t+30} ${e+50} ${t+24} Q${e+48} ${t+28} ${e+46} ${t+30}" fill="${h}" stroke="#000" stroke-width="1.5" />
          <path d="M${e+46} ${t+36} Q${e+54} ${t+42} ${e+50} ${t+48} Q${e+48} ${t+44} ${e+46} ${t+42}" fill="${h}" stroke="#000" stroke-width="1.5" />
          <!-- Platform on whale back -->
          <rect x="${e+10}" y="${t+22}" width="30" height="8" rx="2" fill="${p}" stroke="#000" stroke-width="1.5" />
          <!-- Cute eye -->
          <ellipse cx="${e+10}" cy="${t+34}" rx="4" ry="5" fill="#fff" stroke="#000" stroke-width="1" />
          <circle cx="${e+11}" cy="${t+35}" r="2.5" fill="#000" />
          <circle cx="${e+12}" cy="${t+34}" r="0.8" fill="#fff" />
          <!-- Water spout -->
          <ellipse cx="${e+25}" cy="${t+14}" rx="4" ry="6" fill="#88ccff" stroke="#000" stroke-width="1" />
          <ellipse cx="${e+25}" cy="${t+8}" rx="3" ry="4" fill="#aaddff" />
          <!-- Cute smile -->
          <path d="M${e+6} ${t+40} Q${e+10} ${t+44} ${e+16} ${t+40}" stroke="#000" stroke-width="1.5" fill="none" />
          <circle cx="${e+25}" cy="${t+4}" r="3" fill="${n}" stroke="${i}" stroke-width="1" />
          ${f?`<text x="${e+25}" y="${t+30}" text-anchor="middle" font-size="10">💔</text>`:""}
          ${r.hasHelicopter?`<ellipse cx="${e+20}" cy="${t+26}" rx="5" ry="3" fill="#444" stroke="#000" stroke-width="1" />`:""}
          ${s}
        </g>
      `}if(d==="military"){const h=o.primary,p=o.secondary;return`
        <g class="cursor-pointer" data-piece="${r.type}" data-team="${r.team}" data-col="${r.col}" data-row="${r.row}">
          <ellipse cx="${e+25}" cy="${t+46}" rx="24" ry="4" fill="#4466aa" opacity="0.5" />
          <!-- Armored hull -->
          <path d="M${e+2} ${t+40} L${e+6} ${t+46} L${e+44} ${t+46} L${e+48} ${t+40} L${e+48} ${t+28} L${e+2} ${t+28} Z" fill="${h}" stroke="#222" stroke-width="1.5" />
          <rect x="${e+6}" y="${t+30}" width="14" height="8" fill="${p}" />
          <rect x="${e+28}" y="${t+32}" width="10" height="6" fill="${p}" />
          <!-- Armored deck -->
          <rect x="${e+4}" y="${t+20}" width="42" height="10" fill="${h}" stroke="#222" stroke-width="1" />
          <rect x="${e+8}" y="${t+22}" width="10" height="4" fill="${p}" />
          <!-- Runway -->
          <line x1="${e+8}" y1="${t+25}" x2="${e+42}" y2="${t+25}" stroke="#fff" stroke-width="1" stroke-dasharray="4,2" />
          <!-- Armored island -->
          <rect x="${e+36}" y="${t+10}" width="10" height="12" fill="${h}" stroke="#222" stroke-width="1" />
          <rect x="${e+38}" y="${t+12}" width="6" height="4" fill="#333" />
          <!-- CIWS guns -->
          <rect x="${e+6}" y="${t+18}" width="6" height="4" fill="#333" stroke="#222" stroke-width="0.5" />
          <rect x="${e+3}" y="${t+19}" width="4" height="2" fill="#444" />
          <!-- Radar -->
          <rect x="${e+39}" y="${t+4}" width="4" height="6" fill="#333" />
          <rect x="${e+37}" y="${t+2}" width="8" height="4" fill="#444" />
          <circle cx="${e+25}" cy="${t+6}" r="3" fill="${n}" stroke="${i}" stroke-width="1" />
          ${f?`<rect x="${e+15}" y="${t+22}" width="15" height="6" fill="#ff0000" opacity="0.3"><animate attributeName="opacity" values="0.3;0.6;0.3" dur="0.5s" repeatCount="indefinite" /></rect>`:""}
          ${r.hasHelicopter?`<ellipse cx="${e+20}" cy="${t+25}" rx="6" ry="4" fill="#333" stroke="#222" stroke-width="1" />`:""}
          ${s}
        </g>
      `}if(d==="scifi"){const h=o.primary,p=o.secondary;return`
        <g class="cursor-pointer" data-piece="${r.type}" data-team="${r.team}" data-col="${r.col}" data-row="${r.row}">
          <!-- Hover field -->
          <ellipse cx="${e+25}" cy="${t+46}" rx="24" ry="5" fill="${p}" opacity="0.4">
            <animate attributeName="ry" values="5;7;5" dur="0.8s" repeatCount="indefinite" />
          </ellipse>
          <!-- Main platform -->
          <rect x="${e+2}" y="${t+28}" width="46" height="14" rx="3" fill="${h}" stroke="${p}" stroke-width="1.5" />
          <!-- Energy lines -->
          <line x1="${e+6}" y1="${t+35}" x2="${e+44}" y2="${t+35}" stroke="${p}" stroke-width="2">
            <animate attributeName="opacity" values="1;0.4;1" dur="0.6s" repeatCount="indefinite" />
          </line>
          <!-- Landing deck -->
          <rect x="${e+4}" y="${t+20}" width="42" height="10" fill="#111" stroke="${p}" stroke-width="1" />
          <!-- Landing guides -->
          <circle cx="${e+12}" cy="${t+25}" r="2" fill="${p}"><animate attributeName="opacity" values="1;0.3;1" dur="0.8s" repeatCount="indefinite" /></circle>
          <circle cx="${e+25}" cy="${t+25}" r="2" fill="${p}"><animate attributeName="opacity" values="0.3;1;0.3" dur="0.8s" repeatCount="indefinite" /></circle>
          <circle cx="${e+38}" cy="${t+25}" r="2" fill="${p}"><animate attributeName="opacity" values="1;0.3;1" dur="0.8s" repeatCount="indefinite" /></circle>
          <!-- Command module -->
          <rect x="${e+36}" y="${t+10}" width="10" height="12" rx="2" fill="${h}" stroke="${p}" stroke-width="1" />
          <ellipse cx="${e+41}" cy="${t+14}" rx="4" ry="2" fill="${p}" opacity="0.5" />
          <!-- Sensor array -->
          <circle cx="${e+41}" cy="${t+4}" r="4" fill="none" stroke="${p}" stroke-width="1.5">
            <animate attributeName="r" values="4;6;4" dur="1s" repeatCount="indefinite" />
          </circle>
          <circle cx="${e+41}" cy="${t+4}" r="2" fill="${p}" />
          <circle cx="${e+25}" cy="${t+6}" r="3" fill="${n}" stroke="${i}" stroke-width="1" />
          ${f?`<rect x="${e+10}" y="${t+22}" width="20" height="6" fill="#ff0000" opacity="0.4"><animate attributeName="opacity" values="0.4;0.7;0.4" dur="0.4s" repeatCount="indefinite" /></rect>`:""}
          ${r.hasHelicopter?`<ellipse cx="${e+20}" cy="${t+25}" rx="6" ry="3" fill="${p}" opacity="0.6" />`:""}
          ${s}
        </g>
      `}return`
      <g class="cursor-pointer" data-piece="${r.type}" data-team="${r.team}" data-col="${r.col}" data-row="${r.row}">
        <!-- Water ripples -->
        <ellipse cx="${e+25}" cy="${t+47}" rx="24" ry="4" fill="#6bb3e8" opacity="0.5" />
        <ellipse cx="${e+25}" cy="${t+45}" rx="20" ry="3" fill="#7ec8f0" opacity="0.4" />
        <!-- Hull (long flat carrier shape) -->
        <path d="M${e+2} ${t+40} L${e+6} ${t+45} L${e+44} ${t+45} L${e+48} ${t+40} L${e+48} ${t+28} L${e+2} ${t+28} Z" fill="${c}" stroke="${l}" stroke-width="1.5" />
        <!-- Flight deck (flat top) -->
        <rect x="${e+4}" y="${t+22}" width="42" height="8" rx="1" fill="${u}" stroke="${l}" stroke-width="1" />
        <!-- Deck markings (landing strip) -->
        <line x1="${e+8}" y1="${t+26}" x2="${e+42}" y2="${t+26}" stroke="#ffffff" stroke-width="1" stroke-dasharray="4,2" />
        <rect x="${e+10}" y="${t+24}" width="8" height="4" fill="none" stroke="#ffffff" stroke-width="0.5" />
        <!-- Helipad circle -->
        <circle cx="${e+30}" cy="${t+26}" r="3" fill="none" stroke="#ffffff" stroke-width="0.5" />
        <text x="${e+30}" y="${t+27.5}" text-anchor="middle" font-size="4" fill="#ffffff">H</text>
        <!-- Command tower (island) - on the side -->
        <rect x="${e+38}" y="${t+12}" width="8" height="12" rx="1" fill="${c}" stroke="${l}" stroke-width="1" />
        <rect x="${e+39}" y="${t+14}" width="6" height="3" rx="0.5" fill="#87ceeb" opacity="0.7" />
        <!-- Radar on tower -->
        <line x1="${e+42}" y1="${t+12}" x2="${e+42}" y2="${t+6}" stroke="#4a4a4a" stroke-width="1" />
        <ellipse cx="${e+42}" cy="${t+5}" rx="3" ry="1.5" fill="none" stroke="#4a4a4a" stroke-width="1" />
        <!-- Small gun on deck -->
        <rect x="${e+6}" y="${t+20}" width="4" height="3" fill="#4a4a4a" />
        <rect x="${e+3}" y="${t+21}" width="4" height="1.5" fill="#3d3d3d" />
        <!-- Team indicator -->
        <circle cx="${e+25}" cy="${t+5}" r="3" fill="${n}" stroke="${i}" stroke-width="1" />
        <!-- Damage indicator -->
        ${f?`
          <line x1="${e+15}" y1="${t+20}" x2="${e+25}" y2="${t+30}" stroke="#ef4444" stroke-width="2" />
          <line x1="${e+25}" y1="${t+20}" x2="${e+15}" y2="${t+30}" stroke="#ef4444" stroke-width="2" />
          <circle cx="${e+20}" cy="${t+25}" r="6" fill="#ef4444" opacity="0.3" />
        `:""}
        <!-- Helicopter on deck (if present) -->
        ${r.hasHelicopter?`
          <!-- Mini helicopter on carrier deck -->
          <ellipse cx="${e+20}" cy="${t+26}" rx="8" ry="5" fill="${o.uniformDark}" stroke="${o.uniformDark}" stroke-width="1" />
          <ellipse cx="${e+17}" cy="${t+25}" rx="4" ry="3" fill="#87ceeb" opacity="0.6" />
          <rect x="${e+26}" y="${t+25}" width="8" height="2" fill="${o.uniformDark}" />
          <line x1="${e+10}" y1="${t+23}" x2="${e+30}" y2="${t+23}" stroke="${o.uniform}" stroke-width="1.5" />
          <line x1="${e+15}" y1="${t+21}" x2="${e+25}" y2="${t+25}" stroke="${o.uniform}" stroke-width="1.5" />
          <circle cx="${e+20}" cy="${t+18}" r="2" fill="${n}" />
        `:""}
        ${s}
      </g>
    `}if(r.type==="helicopter"){const o=xt(r.team),c=Vt(),l=o.helmet,u=o.uniform;if(c==="robot"){const f=o.primary,d=o.uniform;return`
        <g class="cursor-pointer" data-piece="${r.type}" data-team="${r.team}" data-col="${r.col}" data-row="${r.row}">
          <ellipse cx="${e+25}" cy="${t+46}" rx="15" ry="4" fill="rgba(0,0,0,0.3)" />
          <!-- Drone body -->
          <rect x="${e+15}" y="${t+26}" width="20" height="14" rx="3" fill="${d}" stroke="${f}" stroke-width="1.5" />
          <!-- Camera/sensor -->
          <circle cx="${e+20}" cy="${t+33}" r="4" fill="#111" stroke="${f}" stroke-width="1" />
          <circle cx="${e+20}" cy="${t+33}" r="2" fill="${f}">
            <animate attributeName="opacity" values="1;0.3;1" dur="1s" repeatCount="indefinite" />
          </circle>
          <!-- Drone arms -->
          <rect x="${e+6}" y="${t+30}" width="10" height="3" fill="${d}" stroke="${f}" stroke-width="0.5" />
          <rect x="${e+34}" y="${t+30}" width="10" height="3" fill="${d}" stroke="${f}" stroke-width="0.5" />
          <rect x="${e+12}" y="${t+18}" width="3" height="12" fill="${d}" stroke="${f}" stroke-width="0.5" />
          <rect x="${e+35}" y="${t+18}" width="3" height="12" fill="${d}" stroke="${f}" stroke-width="0.5" />
          <!-- Rotors -->
          <circle cx="${e+8}" cy="${t+20}" r="6" fill="${f}" opacity="0.4" />
          <circle cx="${e+8}" cy="${t+20}" r="2" fill="${d}" />
          <circle cx="${e+42}" cy="${t+20}" r="6" fill="${f}" opacity="0.4" />
          <circle cx="${e+42}" cy="${t+20}" r="2" fill="${d}" />
          <circle cx="${e+8}" cy="${t+38}" r="6" fill="${f}" opacity="0.4" />
          <circle cx="${e+8}" cy="${t+38}" r="2" fill="${d}" />
          <circle cx="${e+42}" cy="${t+38}" r="6" fill="${f}" opacity="0.4" />
          <circle cx="${e+42}" cy="${t+38}" r="2" fill="${d}" />
          <!-- LED lights -->
          <circle cx="${e+15}" cy="${t+26}" r="1.5" fill="#00ff00">
            <animate attributeName="opacity" values="1;0;1" dur="0.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="${e+35}" cy="${t+26}" r="1.5" fill="#ff0000">
            <animate attributeName="opacity" values="0;1;0" dur="0.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="${e+25}" cy="${t+5}" r="3" fill="${n}" stroke="${i}" stroke-width="1" />
          ${s}
        </g>
      `}if(c==="medieval"){const f=o.primary,d=o.dark;return`
        <g class="cursor-pointer" data-piece="${r.type}" data-team="${r.team}" data-col="${r.col}" data-row="${r.row}">
          <ellipse cx="${e+25}" cy="${t+46}" rx="15" ry="4" fill="rgba(0,0,0,0.3)" />
          <!-- Griffin body -->
          <ellipse cx="${e+25}" cy="${t+34}" rx="12" ry="10" fill="${f}" stroke="${d}" stroke-width="1" />
          <!-- Feather pattern -->
          <ellipse cx="${e+20}" cy="${t+32}" rx="4" ry="6" fill="${d}" opacity="0.3" />
          <ellipse cx="${e+30}" cy="${t+32}" rx="4" ry="6" fill="${d}" opacity="0.3" />
          <!-- Wings spread -->
          <path d="M${e+14} ${t+30} Q${e} ${t+20} ${e+2} ${t+10} L${e+8} ${t+16} L${e+12} ${t+12} L${e+16} ${t+18} L${e+14} ${t+26} Z" fill="${f}" stroke="${d}" stroke-width="0.5" />
          <path d="M${e+36} ${t+30} Q${e+50} ${t+20} ${e+48} ${t+10} L${e+42} ${t+16} L${e+38} ${t+12} L${e+34} ${t+18} L${e+36} ${t+26} Z" fill="${f}" stroke="${d}" stroke-width="0.5" />
          <!-- Eagle head -->
          <ellipse cx="${e+25}" cy="${t+22}" rx="6" ry="5" fill="${f}" stroke="${d}" stroke-width="1" />
          <!-- Beak -->
          <path d="M${e+25} ${t+22} L${e+30} ${t+24} L${e+25} ${t+26} Z" fill="#f59e0b" stroke="#d97706" stroke-width="0.5" />
          <!-- Eyes -->
          <circle cx="${e+23}" cy="${t+20}" r="1.5" fill="#000" />
          <circle cx="${e+23}" cy="${t+20}" r="0.5" fill="#fff" />
          <!-- Crown/crest -->
          <path d="M${e+20} ${t+17} L${e+22} ${t+14} L${e+25} ${t+16} L${e+28} ${t+14} L${e+30} ${t+17}" fill="${n}" stroke="${d}" stroke-width="0.5" />
          <!-- Lion legs -->
          <rect x="${e+18}" y="${t+40}" width="4" height="6" fill="${d}" />
          <rect x="${e+28}" y="${t+40}" width="4" height="6" fill="${d}" />
          <!-- Claws -->
          <path d="M${e+17} ${t+46} L${e+19} ${t+44} L${e+21} ${t+46}" stroke="#333" stroke-width="1" fill="none" />
          <path d="M${e+27} ${t+46} L${e+29} ${t+44} L${e+31} ${t+46}" stroke="#333" stroke-width="1" fill="none" />
          <!-- Tail -->
          <path d="M${e+35} ${t+38} Q${e+45} ${t+36} ${e+48} ${t+42}" stroke="${f}" stroke-width="4" fill="none" />
          <circle cx="${e+25}" cy="${t+5}" r="3" fill="${n}" stroke="${i}" stroke-width="1" />
          ${s}
        </g>
      `}if(c==="pixel"){const f=o.primary,d=o.secondary,h=o.uniform;return`
        <g class="cursor-pointer" data-piece="${r.type}" data-team="${r.team}" data-col="${r.col}" data-row="${r.row}">
          <ellipse cx="${e+25}" cy="${t+46}" rx="15" ry="4" fill="rgba(0,0,0,0.3)" />
          <!-- Pixel body -->
          <rect x="${e+14}" y="${t+26}" width="22" height="14" fill="${d}" />
          <rect x="${e+16}" y="${t+28}" width="18" height="10" fill="${f}" />
          <!-- Pixel cockpit -->
          <rect x="${e+14}" y="${t+28}" width="8" height="8" fill="#7cf" />
          <rect x="${e+16}" y="${t+30}" width="4" height="4" fill="#aef" />
          <!-- Pixel tail -->
          <rect x="${e+36}" y="${t+30}" width="10" height="4" fill="${d}" />
          <rect x="${e+44}" y="${t+26}" width="4" height="12" fill="${h}" />
          <!-- Pixel rotors -->
          <rect x="${e+6}" y="${t+18}" width="38" height="4" fill="${h}" />
          <rect x="${e+22}" y="${t+14}" width="6" height="4" fill="${d}" />
          <!-- Pixel skids -->
          <rect x="${e+12}" y="${t+40}" width="4" height="6" fill="#222" />
          <rect x="${e+34}" y="${t+40}" width="4" height="6" fill="#222" />
          <rect x="${e+10}" y="${t+44}" width="8" height="2" fill="#222" />
          <rect x="${e+32}" y="${t+44}" width="8" height="2" fill="#222" />
          <circle cx="${e+25}" cy="${t+8}" r="3" fill="${n}" stroke="${i}" stroke-width="1" />
          ${s}
        </g>
      `}if(c==="fantasy"){const f=o.primary,d=o.dark;return`
        <g class="cursor-pointer" data-piece="${r.type}" data-team="${r.team}" data-col="${r.col}" data-row="${r.row}">
          <ellipse cx="${e+25}" cy="${t+46}" rx="15" ry="4" fill="rgba(0,0,0,0.3)" />
          <!-- Magic carpet -->
          <path d="M${e+5} ${t+34} Q${e+25} ${t+26} ${e+45} ${t+34} Q${e+42} ${t+42} ${e+25} ${t+38} Q${e+8} ${t+42} ${e+5} ${t+34}" fill="${f}" stroke="${d}" stroke-width="1">
            <animate attributeName="d" values="M${e+5} ${t+34} Q${e+25} ${t+26} ${e+45} ${t+34} Q${e+42} ${t+42} ${e+25} ${t+38} Q${e+8} ${t+42} ${e+5} ${t+34};M${e+5} ${t+36} Q${e+25} ${t+28} ${e+45} ${t+36} Q${e+42} ${t+40} ${e+25} ${t+36} Q${e+8} ${t+40} ${e+5} ${t+36};M${e+5} ${t+34} Q${e+25} ${t+26} ${e+45} ${t+34} Q${e+42} ${t+42} ${e+25} ${t+38} Q${e+8} ${t+42} ${e+5} ${t+34}" dur="2s" repeatCount="indefinite" />
          </path>
          <!-- Carpet pattern -->
          <rect x="${e+12}" y="${t+32}" width="26" height="6" fill="none" stroke="${d}" stroke-width="0.5" />
          <line x1="${e+18}" y1="${t+32}" x2="${e+18}" y2="${t+38}" stroke="${d}" stroke-width="0.5" />
          <line x1="${e+25}" y1="${t+32}" x2="${e+25}" y2="${t+38}" stroke="${d}" stroke-width="0.5" />
          <line x1="${e+32}" y1="${t+32}" x2="${e+32}" y2="${t+38}" stroke="${d}" stroke-width="0.5" />
          <!-- Tassels -->
          <line x1="${e+6}" y1="${t+36}" x2="${e+4}" y2="${t+42}" stroke="${n}" stroke-width="2" />
          <line x1="${e+44}" y1="${t+36}" x2="${e+46}" y2="${t+42}" stroke="${n}" stroke-width="2" />
          <!-- Magic glow -->
          <ellipse cx="${e+25}" cy="${t+35}" rx="18" ry="8" fill="${f}" opacity="0.3">
            <animate attributeName="opacity" values="0.3;0.1;0.3" dur="1.5s" repeatCount="indefinite" />
          </ellipse>
          <!-- Wizard sitting -->
          <ellipse cx="${e+25}" cy="${t+26}" rx="6" ry="4" fill="${o.uniform}" />
          <circle cx="${e+25}" cy="${t+20}" r="4" fill="#d4a574" />
          <!-- Wizard hat -->
          <path d="M${e+20} ${t+18} L${e+25} ${t+8} L${e+30} ${t+18} Z" fill="${f}" stroke="${d}" stroke-width="0.5" />
          <!-- Magic sparkles -->
          <circle cx="${e+12}" cy="${t+28}" r="1" fill="#fff">
            <animate attributeName="opacity" values="1;0;1" dur="0.8s" repeatCount="indefinite" />
          </circle>
          <circle cx="${e+38}" cy="${t+30}" r="1" fill="#fff">
            <animate attributeName="opacity" values="0;1;0" dur="0.8s" repeatCount="indefinite" />
          </circle>
          <circle cx="${e+25}" cy="${t+24}" r="1" fill="#fff">
            <animate attributeName="opacity" values="0.5;1;0.5" dur="0.6s" repeatCount="indefinite" />
          </circle>
          <circle cx="${e+25}" cy="${t+5}" r="3" fill="${n}" stroke="${i}" stroke-width="1" />
          ${s}
        </g>
      `}if(c==="minimal"){const f=o.primary;return`
        <g class="cursor-pointer" data-piece="${r.type}" data-team="${r.team}" data-col="${r.col}" data-row="${r.row}">
          <ellipse cx="${e+25}" cy="${t+46}" rx="15" ry="3" fill="rgba(0,0,0,0.2)" />
          <!-- Simple body -->
          <ellipse cx="${e+23}" cy="${t+32}" rx="12" ry="8" fill="${f}" stroke="#000" stroke-width="2" />
          <!-- Simple tail -->
          <rect x="${e+33}" y="${t+30}" width="12" height="4" fill="${f}" stroke="#000" stroke-width="1.5" />
          <rect x="${e+44}" y="${t+26}" width="3" height="12" fill="#333" stroke="#000" stroke-width="1" />
          <!-- Simple rotor -->
          <line x1="${e+5}" y1="${t+20}" x2="${e+45}" y2="${t+20}" stroke="#333" stroke-width="3" />
          <rect x="${e+22}" y="${t+20}" width="6" height="8" fill="#333" />
          <!-- Simple skids -->
          <rect x="${e+14}" y="${t+40}" width="2" height="6" fill="#333" />
          <rect x="${e+34}" y="${t+40}" width="2" height="6" fill="#333" />
          <rect x="${e+12}" y="${t+44}" width="26" height="2" fill="#333" />
          <circle cx="${e+25}" cy="${t+8}" r="3" fill="${n}" stroke="${i}" stroke-width="1" />
          ${s}
        </g>
      `}if(c==="cartoon"){const f=o.primary,d=o.secondary;return`
        <g class="cursor-pointer" data-piece="${r.type}" data-team="${r.team}" data-col="${r.col}" data-row="${r.row}">
          <ellipse cx="${e+25}" cy="${t+46}" rx="15" ry="4" fill="rgba(0,0,0,0.3)" />
          <!-- Cute round body -->
          <ellipse cx="${e+23}" cy="${t+32}" rx="14" ry="12" fill="${f}" stroke="#000" stroke-width="2" />
          <!-- Big cute eyes (cockpit windows) -->
          <ellipse cx="${e+18}" cy="${t+28}" rx="5" ry="6" fill="#fff" stroke="#000" stroke-width="1.5" />
          <ellipse cx="${e+28}" cy="${t+28}" rx="5" ry="6" fill="#fff" stroke="#000" stroke-width="1.5" />
          <circle cx="${e+19}" cy="${t+29}" r="3" fill="#000" />
          <circle cx="${e+29}" cy="${t+29}" r="3" fill="#000" />
          <circle cx="${e+20}" cy="${t+28}" r="1" fill="#fff" />
          <circle cx="${e+30}" cy="${t+28}" r="1" fill="#fff" />
          <!-- Cute smile -->
          <path d="M${e+17} ${t+38} Q${e+23} ${t+42} ${e+29} ${t+38}" stroke="#000" stroke-width="1.5" fill="none" />
          <!-- Blush -->
          <ellipse cx="${e+12}" cy="${t+34}" rx="3" ry="2" fill="#ffaaaa" opacity="0.6" />
          <ellipse cx="${e+34}" cy="${t+34}" rx="3" ry="2" fill="#ffaaaa" opacity="0.6" />
          <!-- Cute tail -->
          <ellipse cx="${e+42}" cy="${t+30}" rx="6" ry="4" fill="${d}" stroke="#000" stroke-width="1.5" />
          <!-- Bouncy rotor -->
          <ellipse cx="${e+25}" cy="${t+16}" rx="20" ry="4" fill="${d}" stroke="#000" stroke-width="2" />
          <ellipse cx="${e+25}" cy="${t+16}" rx="4" ry="2" fill="#333" />
          <!-- Cute skids -->
          <ellipse cx="${e+15}" cy="${t+44}" rx="5" ry="2" fill="#444" stroke="#000" stroke-width="1" />
          <ellipse cx="${e+35}" cy="${t+44}" rx="5" ry="2" fill="#444" stroke="#000" stroke-width="1" />
          <circle cx="${e+25}" cy="${t+6}" r="3" fill="${n}" stroke="${i}" stroke-width="1" />
          ${s}
        </g>
      `}if(c==="military"){const f=o.primary,d=o.secondary;return`
        <g class="cursor-pointer" data-piece="${r.type}" data-team="${r.team}" data-col="${r.col}" data-row="${r.row}">
          <ellipse cx="${e+25}" cy="${t+46}" rx="15" ry="4" fill="rgba(0,0,0,0.4)" />
          <!-- Angular armored body -->
          <path d="M${e+8} ${t+34} L${e+12} ${t+24} L${e+38} ${t+24} L${e+42} ${t+34} Z" fill="${f}" stroke="#222" stroke-width="1.5" />
          <rect x="${e+14}" y="${t+26}" width="10" height="6" fill="${d}" />
          <rect x="${e+28}" y="${t+28}" width="8" height="4" fill="${d}" />
          <!-- Armored cockpit -->
          <path d="M${e+8} ${t+34} L${e+4} ${t+28} L${e+12} ${t+24}" fill="#333" stroke="#222" stroke-width="0.5" />
          <!-- Tail boom -->
          <rect x="${e+38}" y="${t+28}" width="10" height="4" fill="${f}" stroke="#222" stroke-width="0.5" />
          <rect x="${e+46}" y="${t+24}" width="3" height="12" fill="#333" />
          <!-- Stubby wings with rockets -->
          <rect x="${e+2}" y="${t+30}" width="8" height="3" fill="${f}" stroke="#222" stroke-width="0.5" />
          <rect x="${e+40}" y="${t+30}" width="8" height="3" fill="${f}" stroke="#222" stroke-width="0.5" />
          <rect x="${e} ${t+32}" width="4" height="8" fill="#555" />
          <rect x="${e+46}" y="${t+32}" width="4" height="8" fill="#555" />
          <!-- Military rotor -->
          <line x1="${e+3}" y1="${t+18}" x2="${e+47}" y2="${t+18}" stroke="#333" stroke-width="3" />
          <rect x="${e+22}" y="${t+18}" width="6" height="6" fill="#333" />
          <!-- Targeting sensor -->
          <circle cx="${e+8}" cy="${t+28}" r="3" fill="#111" stroke="#ff0000" stroke-width="1" />
          <circle cx="${e+25}" cy="${t+6}" r="3" fill="${n}" stroke="${i}" stroke-width="1" />
          ${s}
        </g>
      `}if(c==="scifi"){const f=o.primary,d=o.secondary;return`
        <g class="cursor-pointer" data-piece="${r.type}" data-team="${r.team}" data-col="${r.col}" data-row="${r.row}">
          <!-- Hover glow -->
          <ellipse cx="${e+25}" cy="${t+44}" rx="18" ry="6" fill="${d}" opacity="0.4">
            <animate attributeName="opacity" values="0.4;0.6;0.4" dur="0.8s" repeatCount="indefinite" />
          </ellipse>
          <!-- Sleek body -->
          <path d="M${e+5} ${t+32} Q${e+10} ${t+22} ${e+25} ${t+20} Q${e+40} ${t+22} ${e+45} ${t+32} Q${e+40} ${t+40} ${e+25} ${t+42} Q${e+10} ${t+40} ${e+5} ${t+32}" fill="${f}" stroke="${d}" stroke-width="1.5" />
          <!-- Cockpit -->
          <ellipse cx="${e+25}" cy="${t+28}" rx="8" ry="6" fill="#111" stroke="${d}" stroke-width="0.5" />
          <ellipse cx="${e+25}" cy="${t+28}" rx="6" ry="4" fill="${d}" opacity="0.3" />
          <!-- Energy rings -->
          <circle cx="${e+12}" cy="${t+32}" r="5" fill="none" stroke="${d}" stroke-width="1.5" opacity="0.7">
            <animate attributeName="r" values="5;7;5" dur="1s" repeatCount="indefinite" />
          </circle>
          <circle cx="${e+38}" cy="${t+32}" r="5" fill="none" stroke="${d}" stroke-width="1.5" opacity="0.7">
            <animate attributeName="r" values="5;7;5" dur="1s" repeatCount="indefinite" />
          </circle>
          <!-- Thruster pads -->
          <ellipse cx="${e+12}" cy="${t+32}" rx="3" ry="2" fill="${d}" opacity="0.8" />
          <ellipse cx="${e+38}" cy="${t+32}" rx="3" ry="2" fill="${d}" opacity="0.8" />
          <!-- Top sensor -->
          <rect x="${e+22}" y="${t+14}" width="6" height="6" rx="1" fill="${f}" stroke="${d}" stroke-width="1" />
          <circle cx="${e+25}" cy="${t+17}" r="2" fill="${d}">
            <animate attributeName="opacity" values="1;0.4;1" dur="0.8s" repeatCount="indefinite" />
          </circle>
          <circle cx="${e+25}" cy="${t+6}" r="3" fill="${n}" stroke="${i}" stroke-width="1" />
          ${s}
        </g>
      `}return`
      <g class="cursor-pointer" data-piece="${r.type}" data-team="${r.team}" data-col="${r.col}" data-row="${r.row}">
        <!-- Shadow -->
        <ellipse cx="${e+25}" cy="${t+46}" rx="15" ry="4" fill="rgba(0,0,0,0.3)" />
        <!-- Tail boom -->
        <rect x="${e+35}" y="${t+28}" width="12" height="3" fill="${l}" stroke="${u}" stroke-width="0.5" />
        <!-- Tail rotor -->
        <rect x="${e+45}" y="${t+24}" width="2" height="10" fill="${u}" />
        <ellipse cx="${e+46}" cy="${t+24}" rx="1" ry="4" fill="#6b7280" />
        <ellipse cx="${e+46}" cy="${t+34}" rx="1" ry="4" fill="#6b7280" />
        <!-- Main body -->
        <ellipse cx="${e+25}" cy="${t+32}" rx="14" ry="10" fill="${l}" stroke="${u}" stroke-width="1" />
        <!-- Cockpit window -->
        <ellipse cx="${e+20}" cy="${t+30}" rx="6" ry="5" fill="#87ceeb" opacity="0.8" stroke="${u}" stroke-width="0.5" />
        <!-- Cockpit frame -->
        <line x1="${e+20}" y1="${t+25}" x2="${e+20}" y2="${t+35}" stroke="${u}" stroke-width="0.5" />
        <!-- Skids (landing gear) -->
        <rect x="${e+12}" y="${t+40}" width="26" height="2" rx="1" fill="${u}" />
        <rect x="${e+14}" y="${t+38}" width="2" height="4" fill="${u}" />
        <rect x="${e+34}" y="${t+38}" width="2" height="4" fill="${u}" />
        <!-- Main rotor mast -->
        <rect x="${e+24}" y="${t+18}" width="2" height="6" fill="${u}" />
        <!-- Main rotor blades -->
        <ellipse cx="${e+25}" cy="${t+17}" rx="20" ry="3" fill="#6b7280" opacity="0.7" />
        <line x1="${e+5}" y1="${t+17}" x2="${e+45}" y2="${t+17}" stroke="#4b5563" stroke-width="2" />
        <line x1="${e+15}" y1="${t+12}" x2="${e+35}" y2="${t+22}" stroke="#4b5563" stroke-width="2" />
        <!-- Team indicator -->
        <circle cx="${e+25}" cy="${t+5}" r="3" fill="${n}" stroke="${i}" stroke-width="1" />
        <!-- Side marking -->
        <circle cx="${e+30}" cy="${t+32}" r="3" fill="${n}" opacity="0.8" />
        ${s}
      </g>
    `}if(r.type==="machinegun"){const o=xt(r.team),c=o.uniform,l=o.uniformDark,u="#4a4a4a",f="#2d2d2d",d=Vt();if(d==="robot"){const h=o.primary,p=o.uniform;return`
        <g class="cursor-pointer" data-piece="${r.type}" data-team="${r.team}" data-col="${r.col}" data-row="${r.row}">
          <ellipse cx="${e+25}" cy="${t+46}" rx="18" ry="4" fill="rgba(0,0,0,0.3)" />
          <!-- Base platform -->
          <ellipse cx="${e+25}" cy="${t+40}" rx="14" ry="6" fill="${p}" stroke="${h}" stroke-width="1.5" />
          <!-- Rotating base -->
          <ellipse cx="${e+25}" cy="${t+36}" rx="10" ry="4" fill="${p}" stroke="${h}" stroke-width="1" />
          <!-- Turret body -->
          <rect x="${e+16}" y="${t+20}" width="18" height="14" rx="3" fill="${p}" stroke="${h}" stroke-width="1.5" />
          <!-- Sensor array -->
          <rect x="${e+18}" y="${t+22}" width="14" height="6" fill="#111" stroke="${h}" stroke-width="0.5" />
          <rect x="${e+20}" y="${t+24}" width="10" height="2" fill="${h}" opacity="0.7"><animate attributeName="opacity" values="0.7;0.3;0.7" dur="1s" repeatCount="indefinite" /></rect>
          <!-- Dual laser barrels -->
          <rect x="${e+18}" y="${t+6}" width="4" height="16" rx="1" fill="${h}" />
          <rect x="${e+28}" y="${t+6}" width="4" height="16" rx="1" fill="${h}" />
          <!-- Laser tips -->
          <circle cx="${e+20}" cy="${t+6}" r="2" fill="#ff0000"><animate attributeName="opacity" values="1;0.3;1" dur="0.5s" repeatCount="indefinite" /></circle>
          <circle cx="${e+30}" cy="${t+6}" r="2" fill="#ff0000"><animate attributeName="opacity" values="0.3;1;0.3" dur="0.5s" repeatCount="indefinite" /></circle>
          <circle cx="${e+25}" cy="${t+12}" r="3" fill="${n}" stroke="${i}" stroke-width="1" />
          ${s}
        </g>
      `}if(d==="medieval"){const h=o.secondary,p=o.dark;return`
        <g class="cursor-pointer" data-piece="${r.type}" data-team="${r.team}" data-col="${r.col}" data-row="${r.row}">
          <ellipse cx="${e+25}" cy="${t+46}" rx="18" ry="4" fill="rgba(0,0,0,0.3)" />
          <!-- Wooden base -->
          <rect x="${e+10}" y="${t+38}" width="30" height="6" fill="${h}" stroke="${p}" stroke-width="1" />
          <!-- Crossbeam -->
          <rect x="${e+6}" y="${t+28}" width="38" height="8" fill="${h}" stroke="${p}" stroke-width="1.5" />
          <!-- Bow arms -->
          <path d="M${e+6} ${t+32} Q${e-4} ${t+24} ${e+4} ${t+16}" stroke="${p}" stroke-width="4" fill="none" />
          <path d="M${e+44} ${t+32} Q${e+54} ${t+24} ${e+46} ${t+16}" stroke="${p}" stroke-width="4" fill="none" />
          <!-- Bowstring -->
          <line x1="${e+4}" y1="${t+16}" x2="${e+25}" y2="${t+26}" stroke="#8b7355" stroke-width="1.5" />
          <line x1="${e+46}" y1="${t+16}" x2="${e+25}" y2="${t+26}" stroke="#8b7355" stroke-width="1.5" />
          <!-- Arrow channel -->
          <rect x="${e+22}" y="${t+10}" width="6" height="20" fill="${h}" stroke="${p}" stroke-width="1" />
          <!-- Giant arrow/bolt -->
          <rect x="${e+23}" y="${t+4}" width="4" height="18" fill="${p}" />
          <path d="M${e+21} ${t+4} L${e+25} ${t-2} L${e+29} ${t+4} Z" fill="#666" />
          <circle cx="${e+25}" cy="${t+10}" r="3" fill="${n}" stroke="${i}" stroke-width="1" />
          ${s}
        </g>
      `}if(d==="pixel"){const h=o.primary,p=o.secondary;return`
        <g class="cursor-pointer" data-piece="${r.type}" data-team="${r.team}" data-col="${r.col}" data-row="${r.row}">
          <rect x="${e+8}" y="${t+44}" width="34" height="4" fill="rgba(0,0,0,0.3)" />
          <!-- Base -->
          <rect x="${e+10}" y="${t+36}" width="30" height="10" fill="${p}" />
          <rect x="${e+12}" y="${t+38}" width="26" height="6" fill="${h}" />
          <!-- Gun body -->
          <rect x="${e+16}" y="${t+24}" width="18" height="12" fill="${p}" />
          <rect x="${e+18}" y="${t+26}" width="14" height="8" fill="${h}" />
          <!-- Barrel -->
          <rect x="${e+22}" y="${t+8}" width="6" height="18" fill="#444" />
          <rect x="${e+20}" y="${t+4}" width="10" height="4" fill="#666" />
          <!-- Muzzle flash -->
          <rect x="${e+22}" y="${t+2}" width="6" height="4" fill="#ff0" />
          <circle cx="${e+25}" cy="${t+14}" r="3" fill="${n}" stroke="${i}" stroke-width="1" />
          ${s}
        </g>
      `}if(d==="fantasy"){const h=o.primary,p=o.dark;return`
        <g class="cursor-pointer" data-piece="${r.type}" data-team="${r.team}" data-col="${r.col}" data-row="${r.row}">
          <ellipse cx="${e+25}" cy="${t+46}" rx="18" ry="4" fill="rgba(0,0,0,0.3)" />
          <!-- Stone pedestal -->
          <rect x="${e+12}" y="${t+36}" width="26" height="10" rx="2" fill="#666" stroke="#444" stroke-width="1" />
          <!-- Rune markings -->
          <text x="${e+25}" y="${t+44}" text-anchor="middle" font-size="8" fill="${h}">✧</text>
          <!-- Crystal holder -->
          <rect x="${e+18}" y="${t+24}" width="14" height="14" rx="2" fill="#444" stroke="${p}" stroke-width="1" />
          <!-- Large magic crystal -->
          <path d="M${e+25} ${t+6} L${e+32} ${t+20} L${e+28} ${t+34} L${e+22} ${t+34} L${e+18} ${t+20} Z" fill="${h}" stroke="${p}" stroke-width="1" opacity="0.9" />
          <!-- Crystal inner glow -->
          <path d="M${e+25} ${t+10} L${e+29} ${t+20} L${e+27} ${t+30} L${e+23} ${t+30} L${e+21} ${t+20} Z" fill="#fff" opacity="0.3" />
          <!-- Magic aura -->
          <circle cx="${e+25}" cy="${t+20}" r="12" fill="none" stroke="${h}" stroke-width="1" opacity="0.5">
            <animate attributeName="r" values="12;15;12" dur="1.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.5;0.2;0.5" dur="1.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="${e+25}" cy="${t+12}" r="3" fill="${n}" stroke="${i}" stroke-width="1" />
          ${s}
        </g>
      `}if(d==="minimal"){const h=o.primary;return`
        <g class="cursor-pointer" data-piece="${r.type}" data-team="${r.team}" data-col="${r.col}" data-row="${r.row}">
          <ellipse cx="${e+25}" cy="${t+46}" rx="16" ry="3" fill="rgba(0,0,0,0.2)" />
          <!-- Simple base -->
          <ellipse cx="${e+25}" cy="${t+40}" rx="14" ry="5" fill="${h}" stroke="#000" stroke-width="2" />
          <!-- Simple body -->
          <rect x="${e+18}" y="${t+26}" width="14" height="14" fill="${h}" stroke="#000" stroke-width="2" />
          <!-- Simple barrel -->
          <rect x="${e+22}" y="${t+8}" width="6" height="20" fill="#333" stroke="#000" stroke-width="1.5" />
          <circle cx="${e+25}" cy="${t+14}" r="3" fill="${n}" stroke="${i}" stroke-width="1" />
          ${s}
        </g>
      `}if(d==="cartoon"){const h=o.primary,p=o.secondary;return`
        <g class="cursor-pointer" data-piece="${r.type}" data-team="${r.team}" data-col="${r.col}" data-row="${r.row}">
          <ellipse cx="${e+25}" cy="${t+46}" rx="16" ry="4" fill="rgba(0,0,0,0.3)" />
          <!-- Round base -->
          <ellipse cx="${e+25}" cy="${t+40}" rx="14" ry="6" fill="${h}" stroke="#000" stroke-width="2" />
          <!-- Cute turret body with face -->
          <ellipse cx="${e+25}" cy="${t+28}" rx="12" ry="10" fill="${p}" stroke="#000" stroke-width="2" />
          <!-- Big eyes on turret -->
          <ellipse cx="${e+20}" cy="${t+26}" rx="4" ry="5" fill="#fff" stroke="#000" stroke-width="1" />
          <ellipse cx="${e+30}" cy="${t+26}" rx="4" ry="5" fill="#fff" stroke="#000" stroke-width="1" />
          <circle cx="${e+21}" cy="${t+27}" r="2" fill="#000" />
          <circle cx="${e+31}" cy="${t+27}" r="2" fill="#000" />
          <circle cx="${e+22}" cy="${t+26}" r="0.5" fill="#fff" />
          <circle cx="${e+32}" cy="${t+26}" r="0.5" fill="#fff" />
          <!-- Cute barrel -->
          <ellipse cx="${e+25}" cy="${t+12}" rx="6" ry="3" fill="${h}" stroke="#000" stroke-width="2" />
          <rect x="${e+21}" y="${t+6}" width="8" height="10" fill="${h}" stroke="#000" stroke-width="1.5" />
          <!-- Little puff -->
          <ellipse cx="${e+25}" cy="${t+4}" rx="5" ry="3" fill="#ddd" stroke="#000" stroke-width="1" />
          <circle cx="${e+25}" cy="${t+14}" r="3" fill="${n}" stroke="${i}" stroke-width="1" />
          ${s}
        </g>
      `}if(d==="military"){const h=o.primary,p=o.secondary;return`
        <g class="cursor-pointer" data-piece="${r.type}" data-team="${r.team}" data-col="${r.col}" data-row="${r.row}">
          <ellipse cx="${e+25}" cy="${t+46}" rx="18" ry="4" fill="rgba(0,0,0,0.4)" />
          <!-- Sandbag fortification -->
          <ellipse cx="${e+25}" cy="${t+42}" rx="18" ry="6" fill="#8b7355" stroke="#5c4033" stroke-width="1" />
          <ellipse cx="${e+25}" cy="${t+38}" rx="16" ry="5" fill="#9b8365" stroke="#5c4033" stroke-width="0.5" />
          <!-- Shield plate -->
          <rect x="${e+12}" y="${t+24}" width="26" height="12" rx="1" fill="${h}" stroke="#222" stroke-width="1.5" />
          <rect x="${e+14}" y="${t+26}" width="8" height="6" fill="${p}" />
          <rect x="${e+28}" y="${t+28}" width="6" height="4" fill="${p}" />
          <!-- Heavy barrel -->
          <rect x="${e+20}" y="${t+6}" width="10" height="20" fill="#333" stroke="#222" stroke-width="1" />
          <rect x="${e+18}" y="${t+4}" width="14" height="4" fill="#444" />
          <!-- Cooling jacket -->
          <rect x="${e+21}" y="${t+10}" width="8" height="2" fill="#555" />
          <rect x="${e+21}" y="${t+14}" width="8" height="2" fill="#555" />
          <!-- Ammo box -->
          <rect x="${e+36}" y="${t+28}" width="8" height="10" fill="#556b2f" stroke="#222" stroke-width="0.5" />
          <circle cx="${e+25}" cy="${t+14}" r="3" fill="${n}" stroke="${i}" stroke-width="1" />
          ${s}
        </g>
      `}if(d==="scifi"){const h=o.primary,p=o.secondary;return`
        <g class="cursor-pointer" data-piece="${r.type}" data-team="${r.team}" data-col="${r.col}" data-row="${r.row}">
          <ellipse cx="${e+25}" cy="${t+46}" rx="16" ry="4" fill="${p}" opacity="0.3" />
          <!-- Hovering base -->
          <ellipse cx="${e+25}" cy="${t+42}" rx="14" ry="5" fill="${h}" stroke="${p}" stroke-width="1.5" />
          <ellipse cx="${e+25}" cy="${t+40}" rx="10" ry="3" fill="${p}" opacity="0.3" />
          <!-- Turret body -->
          <rect x="${e+16}" y="${t+24}" width="18" height="14" rx="3" fill="${h}" stroke="${p}" stroke-width="1.5" />
          <!-- Energy core -->
          <circle cx="${e+25}" cy="${t+31}" r="5" fill="${p}" opacity="0.6">
            <animate attributeName="opacity" values="0.6;0.9;0.6" dur="1s" repeatCount="indefinite" />
          </circle>
          <!-- Plasma barrel -->
          <rect x="${e+20}" y="${t+8}" width="10" height="18" rx="2" fill="${h}" stroke="${p}" stroke-width="1" />
          <!-- Plasma tip -->
          <ellipse cx="${e+25}" cy="${t+6}" rx="5" ry="3" fill="${p}">
            <animate attributeName="ry" values="3;4;3" dur="0.5s" repeatCount="indefinite" />
          </ellipse>
          <!-- Energy rings -->
          <circle cx="${e+25}" cy="${t+16}" r="3" fill="none" stroke="${p}" stroke-width="1">
            <animate attributeName="r" values="3;5;3" dur="0.8s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="1;0.3;1" dur="0.8s" repeatCount="indefinite" />
          </circle>
          <circle cx="${e+25}" cy="${t+14}" r="3" fill="${n}" stroke="${i}" stroke-width="1" />
          ${s}
        </g>
      `}return`
      <g class="cursor-pointer" data-piece="${r.type}" data-team="${r.team}" data-col="${r.col}" data-row="${r.row}">
        <!-- Shadow -->
        <ellipse cx="${e+25}" cy="${t+46}" rx="18" ry="4" fill="rgba(0,0,0,0.3)" />
        <!-- Sandbag base -->
        <ellipse cx="${e+15}" cy="${t+42}" rx="10" ry="5" fill="#c2a878" stroke="#8b7355" stroke-width="1" />
        <ellipse cx="${e+35}" cy="${t+42}" rx="10" ry="5" fill="#c2a878" stroke="#8b7355" stroke-width="1" />
        <ellipse cx="${e+25}" cy="${t+40}" rx="12" ry="6" fill="#c2a878" stroke="#8b7355" stroke-width="1" />
        <ellipse cx="${e+20}" cy="${t+38}" rx="8" ry="4" fill="#d4b896" stroke="#8b7355" stroke-width="1" />
        <ellipse cx="${e+30}" cy="${t+38}" rx="8" ry="4" fill="#d4b896" stroke="#8b7355" stroke-width="1" />
        <!-- Tripod legs -->
        <line x1="${e+25}" y1="${t+30}" x2="${e+12}" y2="${t+38}" stroke="${f}" stroke-width="3" />
        <line x1="${e+25}" y1="${t+30}" x2="${e+38}" y2="${t+38}" stroke="${f}" stroke-width="3" />
        <line x1="${e+25}" y1="${t+30}" x2="${e+25}" y2="${t+36}" stroke="${f}" stroke-width="3" />
        <!-- Gun body -->
        <rect x="${e+18}" y="${t+22}" width="14" height="10" rx="2" fill="${u}" stroke="${f}" stroke-width="1" />
        <!-- Barrel -->
        <rect x="${e+22}" y="${t+8}" width="6" height="16" rx="2" fill="${u}" stroke="${f}" stroke-width="1" />
        <rect x="${e+23}" y="${t+6}" width="4" height="4" fill="${f}" />
        <!-- Barrel holes (muzzle) -->
        <circle cx="${e+25}" cy="${t+7}" r="1.5" fill="#1a1a1a" />
        <!-- Ammunition box -->
        <rect x="${e+32}" y="${t+24}" width="8" height="6" rx="1" fill="${c}" stroke="${l}" stroke-width="1" />
        <!-- Handle -->
        <rect x="${e+10}" y="${t+24}" width="8" height="4" rx="1" fill="${l}" />
        <circle cx="${e+12}" cy="${t+26}" r="2" fill="${f}" />
        <!-- Team indicator -->
        <circle cx="${e+25}" cy="${t+14}" r="3" fill="${n}" stroke="${i}" stroke-width="1" />
        ${s}
      </g>
    `}if(r.type==="suv"){const o=xt(r.team),c=o.helmet,l=o.uniform,u="#87ceeb",f=Vt();if(f==="robot"){const d=o.primary,h=o.uniform;return`
        <g class="cursor-pointer" data-piece="${r.type}" data-team="${r.team}" data-col="${r.col}" data-row="${r.row}">
          <ellipse cx="${e+25}" cy="${t+46}" rx="18" ry="3" fill="${d}" opacity="0.4"><animate attributeName="opacity" values="0.4;0.6;0.4" dur="0.6s" repeatCount="indefinite" /></ellipse>
          <!-- Hover pads -->
          <ellipse cx="${e+12}" cy="${t+42}" rx="6" ry="3" fill="${h}" stroke="${d}" stroke-width="1" />
          <ellipse cx="${e+38}" cy="${t+42}" rx="6" ry="3" fill="${h}" stroke="${d}" stroke-width="1" />
          <!-- Body -->
          <path d="M${e+6} ${t+38} L${e+10} ${t+24} L${e+40} ${t+24} L${e+44} ${t+38} Z" fill="${h}" stroke="${d}" stroke-width="1.5" />
          <!-- Cockpit -->
          <ellipse cx="${e+25}" cy="${t+26}" rx="12" ry="8" fill="${h}" stroke="${d}" stroke-width="1" />
          <ellipse cx="${e+25}" cy="${t+24}" rx="8" ry="5" fill="${d}" opacity="0.5" />
          <!-- Engine pods -->
          <rect x="${e+4}" y="${t+30}" width="6" height="8" rx="2" fill="${d}" />
          <rect x="${e+40}" y="${t+30}" width="6" height="8" rx="2" fill="${d}" />
          <!-- Speed lines -->
          <line x1="${e+46}" y1="${t+32}" x2="${e+52}" y2="${t+32}" stroke="${d}" stroke-width="1" opacity="0.6"><animate attributeName="opacity" values="0.6;0;0.6" dur="0.3s" repeatCount="indefinite" /></line>
          <line x1="${e+46}" y1="${t+36}" x2="${e+54}" y2="${t+36}" stroke="${d}" stroke-width="1" opacity="0.4"><animate attributeName="opacity" values="0.4;0;0.4" dur="0.4s" repeatCount="indefinite" /></line>
          <circle cx="${e+25}" cy="${t+14}" r="3" fill="${n}" stroke="${i}" stroke-width="1" />
          ${s}
        </g>
      `}if(f==="medieval"){const d=o.secondary,h=o.dark;return`
        <g class="cursor-pointer" data-piece="${r.type}" data-team="${r.team}" data-col="${r.col}" data-row="${r.row}">
          <ellipse cx="${e+25}" cy="${t+46}" rx="18" ry="4" fill="rgba(0,0,0,0.3)" />
          <!-- Wheels -->
          <circle cx="${e+12}" cy="${t+40}" r="7" fill="${h}" stroke="#3d2817" stroke-width="2" />
          <circle cx="${e+38}" cy="${t+40}" r="7" fill="${h}" stroke="#3d2817" stroke-width="2" />
          <!-- Spokes -->
          <line x1="${e+5}" y1="${t+40}" x2="${e+19}" y2="${t+40}" stroke="#3d2817" stroke-width="1" />
          <line x1="${e+12}" y1="${t+33}" x2="${e+12}" y2="${t+47}" stroke="#3d2817" stroke-width="1" />
          <line x1="${e+31}" y1="${t+40}" x2="${e+45}" y2="${t+40}" stroke="#3d2817" stroke-width="1" />
          <line x1="${e+38}" y1="${t+33}" x2="${e+38}" y2="${t+47}" stroke="#3d2817" stroke-width="1" />
          <!-- Chariot body -->
          <rect x="${e+16}" y="${t+26}" width="18" height="12" fill="${d}" stroke="${h}" stroke-width="1.5" />
          <!-- Front shield -->
          <path d="M${e+14} ${t+38} L${e+10} ${t+24} L${e+16} ${t+24} L${e+16} ${t+38} Z" fill="${o.primary}" stroke="${h}" stroke-width="1" />
          <!-- Side armor -->
          <rect x="${e+34}" y="${t+26}" width="4" height="12" fill="${o.primary}" stroke="${h}" stroke-width="1" />
          <!-- Axle -->
          <line x1="${e+12}" y1="${t+40}" x2="${e+38}" y2="${t+40}" stroke="#3d2817" stroke-width="3" />
          <!-- Reins to horse -->
          <line x1="${e+10}" y1="${t+26}" x2="${e-4}" y2="${t+30}" stroke="#8b7355" stroke-width="1" />
          <!-- Horse (simplified) -->
          <ellipse cx="${e-4}" cy="${t+34}" rx="6" ry="8" fill="#8b7355" stroke="#5c4033" stroke-width="1" />
          <ellipse cx="${e-8}" cy="${t+26}" rx="4" ry="5" fill="#8b7355" stroke="#5c4033" stroke-width="1" />
          <circle cx="${e+25}" cy="${t+14}" r="3" fill="${n}" stroke="${i}" stroke-width="1" />
          ${s}
        </g>
      `}if(f==="pixel"){const d=o.primary,h=o.secondary;return`
        <g class="cursor-pointer" data-piece="${r.type}" data-team="${r.team}" data-col="${r.col}" data-row="${r.row}">
          <rect x="${e+6}" y="${t+44}" width="38" height="4" fill="rgba(0,0,0,0.3)" />
          <!-- Wheels -->
          <rect x="${e+8}" y="${t+38}" width="8" height="8" fill="#222" />
          <rect x="${e+34}" y="${t+38}" width="8" height="8" fill="#222" />
          <!-- Body -->
          <rect x="${e+6}" y="${t+26}" width="38" height="12" fill="${h}" />
          <rect x="${e+8}" y="${t+28}" width="34" height="8" fill="${d}" />
          <!-- Roof -->
          <rect x="${e+12}" y="${t+18}" width="26" height="8" fill="${h}" />
          <!-- Windows -->
          <rect x="${e+14}" y="${t+20}" width="8" height="6" fill="#88ccff" />
          <rect x="${e+28}" y="${t+20}" width="8" height="6" fill="#88ccff" />
          <!-- Headlights -->
          <rect x="${e+6}" y="${t+28}" width="4" height="4" fill="#ff0" />
          <rect x="${e+40}" y="${t+30}" width="4" height="4" fill="#f00" />
          <circle cx="${e+25}" cy="${t+12}" r="3" fill="${n}" stroke="${i}" stroke-width="1" />
          ${s}
        </g>
      `}if(f==="fantasy"){const d=o.primary,h=o.uniform;return`
        <g class="cursor-pointer" data-piece="${r.type}" data-team="${r.team}" data-col="${r.col}" data-row="${r.row}">
          <ellipse cx="${e+25}" cy="${t+46}" rx="18" ry="4" fill="rgba(0,0,0,0.3)" />
          <!-- Magic steed body -->
          <ellipse cx="${e+28}" cy="${t+34}" rx="14" ry="10" fill="${h}" stroke="${o.uniformDark}" stroke-width="1" />
          <!-- Legs -->
          <rect x="${e+16}" y="${t+40}" width="4" height="8" fill="${h}" stroke="${o.uniformDark}" stroke-width="0.5" />
          <rect x="${e+24}" y="${t+40}" width="4" height="8" fill="${h}" stroke="${o.uniformDark}" stroke-width="0.5" />
          <rect x="${e+32}" y="${t+40}" width="4" height="8" fill="${h}" stroke="${o.uniformDark}" stroke-width="0.5" />
          <rect x="${e+38}" y="${t+40}" width="4" height="8" fill="${h}" stroke="${o.uniformDark}" stroke-width="0.5" />
          <!-- Neck -->
          <path d="M${e+14} ${t+30} Q${e+8} ${t+20} ${e+10} ${t+12}" stroke="${h}" stroke-width="8" fill="none" />
          <!-- Head -->
          <ellipse cx="${e+10}" cy="${t+12}" rx="6" ry="5" fill="${h}" stroke="${o.uniformDark}" stroke-width="1" />
          <!-- Horn (unicorn) -->
          <path d="M${e+8} ${t+8} L${e+10} ${t} L${e+12} ${t+8}" fill="${d}" stroke="${o.dark}" stroke-width="0.5" />
          <!-- Eye -->
          <circle cx="${e+8}" cy="${t+11}" r="1.5" fill="${d}" />
          <!-- Magic mane -->
          <path d="M${e+14} ${t+26} Q${e+6} ${t+22} ${e+12} ${t+18}" stroke="${d}" stroke-width="2" fill="none" />
          <path d="M${e+16} ${t+28} Q${e+8} ${t+24} ${e+14} ${t+20}" stroke="${d}" stroke-width="2" fill="none" />
          <!-- Magic sparkles -->
          <circle cx="${e+10}" cy="${t+4}" r="2" fill="${d}"><animate attributeName="opacity" values="1;0.3;1" dur="1s" repeatCount="indefinite" /></circle>
          <circle cx="${e+25}" cy="${t+8}" r="3" fill="${n}" stroke="${i}" stroke-width="1" />
          ${s}
        </g>
      `}if(f==="minimal"){const d=o.primary;return`
        <g class="cursor-pointer" data-piece="${r.type}" data-team="${r.team}" data-col="${r.col}" data-row="${r.row}">
          <ellipse cx="${e+25}" cy="${t+46}" rx="16" ry="3" fill="rgba(0,0,0,0.2)" />
          <!-- Simple wheels -->
          <circle cx="${e+14}" cy="${t+40}" r="5" fill="#333" stroke="#000" stroke-width="2" />
          <circle cx="${e+36}" cy="${t+40}" r="5" fill="#333" stroke="#000" stroke-width="2" />
          <!-- Simple body -->
          <rect x="${e+8}" y="${t+28}" width="34" height="12" fill="${d}" stroke="#000" stroke-width="2" />
          <!-- Simple roof -->
          <rect x="${e+14}" y="${t+18}" width="22" height="12" fill="${d}" stroke="#000" stroke-width="1.5" />
          <circle cx="${e+25}" cy="${t+10}" r="3" fill="${n}" stroke="${i}" stroke-width="1" />
          ${s}
        </g>
      `}if(f==="cartoon"){const d=o.primary,h=o.secondary;return`
        <g class="cursor-pointer" data-piece="${r.type}" data-team="${r.team}" data-col="${r.col}" data-row="${r.row}">
          <ellipse cx="${e+25}" cy="${t+46}" rx="18" ry="4" fill="rgba(0,0,0,0.3)" />
          <!-- Big bouncy wheels -->
          <circle cx="${e+12}" cy="${t+40}" r="7" fill="#333" stroke="#000" stroke-width="2" />
          <circle cx="${e+12}" cy="${t+40}" r="3" fill="#666" />
          <circle cx="${e+38}" cy="${t+40}" r="7" fill="#333" stroke="#000" stroke-width="2" />
          <circle cx="${e+38}" cy="${t+40}" r="3" fill="#666" />
          <!-- Cute rounded body -->
          <ellipse cx="${e+25}" cy="${t+32}" rx="18" ry="10" fill="${d}" stroke="#000" stroke-width="2" />
          <!-- Cute cabin -->
          <ellipse cx="${e+25}" cy="${t+24}" rx="12" ry="8" fill="${h}" stroke="#000" stroke-width="1.5" />
          <!-- Big cute eyes (headlights) -->
          <ellipse cx="${e+10}" cy="${t+30}" rx="4" ry="5" fill="#fff" stroke="#000" stroke-width="1" />
          <circle cx="${e+11}" cy="${t+31}" r="2.5" fill="#000" />
          <circle cx="${e+12}" cy="${t+30}" r="0.8" fill="#fff" />
          <!-- Cute smile (grille) -->
          <path d="M${e+8} ${t+38} Q${e+14} ${t+42} ${e+20} ${t+38}" stroke="#000" stroke-width="1.5" fill="none" />
          <!-- Blush -->
          <ellipse cx="${e+40}" cy="${t+32}" rx="3" ry="2" fill="#ffaaaa" opacity="0.6" />
          <circle cx="${e+25}" cy="${t+10}" r="3" fill="${n}" stroke="${i}" stroke-width="1" />
          ${s}
        </g>
      `}if(f==="military"){const d=o.primary,h=o.secondary;return`
        <g class="cursor-pointer" data-piece="${r.type}" data-team="${r.team}" data-col="${r.col}" data-row="${r.row}">
          <ellipse cx="${e+25}" cy="${t+46}" rx="18" ry="4" fill="rgba(0,0,0,0.4)" />
          <!-- Heavy-duty wheels -->
          <circle cx="${e+12}" cy="${t+40}" r="6" fill="#222" stroke="#111" stroke-width="2" />
          <circle cx="${e+38}" cy="${t+40}" r="6" fill="#222" stroke="#111" stroke-width="2" />
          <!-- Armored body -->
          <rect x="${e+4}" y="${t+26}" width="42" height="16" fill="${d}" stroke="#222" stroke-width="1.5" />
          <rect x="${e+8}" y="${t+28}" width="12" height="8" fill="${h}" />
          <rect x="${e+28}" y="${t+30}" width="10" height="6" fill="${h}" />
          <!-- Armored cabin -->
          <rect x="${e+10}" y="${t+16}" width="30" height="12" fill="${d}" stroke="#222" stroke-width="1" />
          <!-- Small windows -->
          <rect x="${e+12}" y="${t+18}" width="8" height="4" fill="#333" />
          <rect x="${e+30}" y="${t+18}" width="8" height="4" fill="#333" />
          <!-- Roof turret mount -->
          <rect x="${e+20}" y="${t+12}" width="10" height="6" fill="#333" stroke="#222" stroke-width="0.5" />
          <rect x="${e+23}" y="${t+6}" width="4" height="8" fill="#444" />
          <!-- Antenna -->
          <line x1="${e+40}" y1="${t+16}" x2="${e+44}" y2="${t+6}" stroke="#333" stroke-width="1.5" />
          <circle cx="${e+25}" cy="${t+8}" r="3" fill="${n}" stroke="${i}" stroke-width="1" />
          ${s}
        </g>
      `}if(f==="scifi"){const d=o.primary,h=o.secondary;return`
        <g class="cursor-pointer" data-piece="${r.type}" data-team="${r.team}" data-col="${r.col}" data-row="${r.row}">
          <!-- Hover field -->
          <ellipse cx="${e+25}" cy="${t+46}" rx="18" ry="4" fill="${h}" opacity="0.4">
            <animate attributeName="ry" values="4;6;4" dur="0.6s" repeatCount="indefinite" />
          </ellipse>
          <!-- Hover pads -->
          <ellipse cx="${e+12}" cy="${t+42}" rx="5" ry="2" fill="${h}" opacity="0.7" />
          <ellipse cx="${e+38}" cy="${t+42}" rx="5" ry="2" fill="${h}" opacity="0.7" />
          <!-- Sleek body -->
          <path d="M${e+4} ${t+38} Q${e+8} ${t+26} ${e+25} ${t+24} Q${e+42} ${t+26} ${e+46} ${t+38} Z" fill="${d}" stroke="${h}" stroke-width="1.5" />
          <!-- Cockpit -->
          <ellipse cx="${e+25}" cy="${t+28}" rx="10" ry="6" fill="#111" stroke="${h}" stroke-width="0.5" />
          <ellipse cx="${e+25}" cy="${t+27}" rx="7" ry="4" fill="${h}" opacity="0.3" />
          <!-- Energy line -->
          <line x1="${e+8}" y1="${t+34}" x2="${e+42}" y2="${t+34}" stroke="${h}" stroke-width="2">
            <animate attributeName="opacity" values="1;0.4;1" dur="0.5s" repeatCount="indefinite" />
          </line>
          <!-- Thrusters -->
          <ellipse cx="${e+46}" cy="${t+34}" rx="2" ry="4" fill="${h}" opacity="0.8">
            <animate attributeName="rx" values="2;3;2" dur="0.3s" repeatCount="indefinite" />
          </ellipse>
          <circle cx="${e+25}" cy="${t+14}" r="3" fill="${n}" stroke="${i}" stroke-width="1" />
          ${s}
        </g>
      `}return`
      <g class="cursor-pointer" data-piece="${r.type}" data-team="${r.team}" data-col="${r.col}" data-row="${r.row}">
        <!-- Shadow -->
        <ellipse cx="${e+25}" cy="${t+46}" rx="18" ry="4" fill="rgba(0,0,0,0.3)" />
        <!-- Wheels -->
        <circle cx="${e+12}" cy="${t+40}" r="6" fill="#1f1f1f" />
        <circle cx="${e+12}" cy="${t+40}" r="4" fill="#3f3f3f" />
        <circle cx="${e+12}" cy="${t+40}" r="2" fill="#5f5f5f" />
        <circle cx="${e+38}" cy="${t+40}" r="6" fill="#1f1f1f" />
        <circle cx="${e+38}" cy="${t+40}" r="4" fill="#3f3f3f" />
        <circle cx="${e+38}" cy="${t+40}" r="2" fill="#5f5f5f" />
        <!-- Body -->
        <rect x="${e+6}" y="${t+26}" width="38" height="16" rx="3" fill="${c}" stroke="${l}" stroke-width="1.5" />
        <!-- Roof -->
        <rect x="${e+10}" y="${t+16}" width="30" height="12" rx="2" fill="${c}" stroke="${l}" stroke-width="1" />
        <!-- Front windshield -->
        <path d="M${e+10} ${t+26} L${e+12} ${t+18} L${e+22} ${t+18} L${e+22} ${t+26} Z" fill="${u}" opacity="0.8" stroke="${l}" stroke-width="0.5" />
        <!-- Rear window -->
        <path d="M${e+28} ${t+26} L${e+28} ${t+18} L${e+38} ${t+18} L${e+40} ${t+26} Z" fill="${u}" opacity="0.8" stroke="${l}" stroke-width="0.5" />
        <!-- Side windows -->
        <rect x="${e+23}" y="${t+18}" width="4" height="7" fill="${u}" opacity="0.7" />
        <!-- Front grille -->
        <rect x="${e+6}" y="${t+30}" width="4" height="8" rx="1" fill="#2d2d2d" />
        <line x1="${e+7}" y1="${t+32}" x2="${e+9}" y2="${t+32}" stroke="#4a4a4a" stroke-width="1" />
        <line x1="${e+7}" y1="${t+34}" x2="${e+9}" y2="${t+34}" stroke="#4a4a4a" stroke-width="1" />
        <line x1="${e+7}" y1="${t+36}" x2="${e+9}" y2="${t+36}" stroke="#4a4a4a" stroke-width="1" />
        <!-- Headlights -->
        <circle cx="${e+8}" cy="${t+28}" r="2" fill="#fef9c3" stroke="#eab308" stroke-width="0.5" />
        <!-- Taillights -->
        <rect x="${e+42}" y="${t+28}" width="2" height="3" fill="#ef4444" />
        <rect x="${e+42}" y="${t+33}" width="2" height="3" fill="#ef4444" />
        <!-- Door handles -->
        <rect x="${e+18}" y="${t+30}" width="3" height="1" fill="#4a4a4a" />
        <rect x="${e+29}" y="${t+30}" width="3" height="1" fill="#4a4a4a" />
        <!-- Roof rack -->
        <line x1="${e+14}" y1="${t+16}" x2="${e+36}" y2="${t+16}" stroke="${l}" stroke-width="2" />
        <line x1="${e+16}" y1="${t+14}" x2="${e+16}" y2="${t+16}" stroke="${l}" stroke-width="1.5" />
        <line x1="${e+34}" y1="${t+14}" x2="${e+34}" y2="${t+16}" stroke="${l}" stroke-width="1.5" />
        <!-- Team indicator -->
        <circle cx="${e+25}" cy="${t+8}" r="3" fill="${n}" stroke="${i}" stroke-width="1" />
        ${s}
      </g>
    `}if(r.type==="rocket"){const o=xt(r.team),c=o.helmet,l=o.uniform,u="#ef4444",f=r.used,d=Vt();if(d==="robot"){const h=o.primary,p=o.uniform;return`
        <g class="cursor-pointer ${f?"opacity-50":""}" data-piece="${r.type}" data-team="${r.team}" data-col="${r.col}" data-row="${r.row}">
          <ellipse cx="${e+25}" cy="${t+46}" rx="10" ry="3" fill="rgba(0,0,0,0.3)" />
          <!-- Launch pad -->
          <rect x="${e+10}" y="${t+38}" width="30" height="8" rx="2" fill="${p}" stroke="${h}" stroke-width="1" />
          <rect x="${e+14}" y="${t+40}" width="22" height="4" fill="#111" stroke="${h}" stroke-width="0.5" />
          <!-- Plasma core -->
          <circle cx="${e+25}" cy="${t+24}" r="12" fill="${p}" stroke="${h}" stroke-width="2" />
          <circle cx="${e+25}" cy="${t+24}" r="8" fill="${h}" opacity="0.8"><animate attributeName="r" values="8;10;8" dur="1s" repeatCount="indefinite" /></circle>
          <circle cx="${e+25}" cy="${t+24}" r="4" fill="#fff" opacity="0.8" />
          <!-- Energy field -->
          <circle cx="${e+25}" cy="${t+24}" r="14" fill="none" stroke="${h}" stroke-width="1" opacity="0.5"><animate attributeName="r" values="14;18;14" dur="1.5s" repeatCount="indefinite" /></circle>
          <!-- Support arms -->
          <line x1="${e+25}" y1="${t+36}" x2="${e+25}" y2="${t+38}" stroke="${h}" stroke-width="3" />
          <line x1="${e+17}" y1="${t+32}" x2="${e+14}" y2="${t+38}" stroke="${h}" stroke-width="2" />
          <line x1="${e+33}" y1="${t+32}" x2="${e+36}" y2="${t+38}" stroke="${h}" stroke-width="2" />
          <circle cx="${e+25}" cy="${t+10}" r="3" fill="${n}" stroke="${i}" stroke-width="1" />
          ${f?`<line x1="${e+15}" y1="${t+15}" x2="${e+35}" y2="${t+35}" stroke="${h}" stroke-width="3" /><line x1="${e+35}" y1="${t+15}" x2="${e+15}" y2="${t+35}" stroke="${h}" stroke-width="3" />`:""}
          ${s}
        </g>
      `}if(d==="medieval"){const h=o.secondary,p=o.dark;return`
        <g class="cursor-pointer ${f?"opacity-50":""}" data-piece="${r.type}" data-team="${r.team}" data-col="${r.col}" data-row="${r.row}">
          <ellipse cx="${e+25}" cy="${t+46}" rx="16" ry="4" fill="rgba(0,0,0,0.3)" />
          <!-- Trebuchet frame -->
          <rect x="${e+10}" y="${t+38}" width="30" height="8" fill="${h}" stroke="${p}" stroke-width="1" />
          <!-- A-frame supports -->
          <path d="M${e+14} ${t+38} L${e+20} ${t+20} L${e+26} ${t+38}" stroke="${p}" stroke-width="3" fill="none" />
          <path d="M${e+24} ${t+38} L${e+30} ${t+20} L${e+36} ${t+38}" stroke="${p}" stroke-width="3" fill="none" />
          <!-- Arm pivot -->
          <circle cx="${e+25}" cy="${t+20}" r="3" fill="${p}" />
          <!-- Throwing arm -->
          <line x1="${e+10}" y1="${t+28}" x2="${e+40}" y2="${t+12}" stroke="${h}" stroke-width="4" />
          <!-- Boulder -->
          <circle cx="${e+38}" cy="${t+10}" r="8" fill="#666" stroke="#444" stroke-width="1" />
          <circle cx="${e+36}" cy="${t+8}" r="2" fill="#888" />
          <!-- Counterweight -->
          <rect x="${e+6}" y="${t+26}" width="8" height="8" fill="${p}" stroke="#3d2817" stroke-width="1" />
          <circle cx="${e+25}" cy="${t+5}" r="3" fill="${n}" stroke="${i}" stroke-width="1" />
          ${f?`<path d="M${e+15} ${t+15} L${e+35} ${t+35} M${e+35} ${t+15} L${e+15} ${t+35}" stroke="#8b0000" stroke-width="3" />`:""}
          ${s}
        </g>
      `}if(d==="pixel"){const h=o.primary,p=o.secondary;return`
        <g class="cursor-pointer ${f?"opacity-50":""}" data-piece="${r.type}" data-team="${r.team}" data-col="${r.col}" data-row="${r.row}">
          <rect x="${e+12}" y="${t+44}" width="26" height="4" fill="rgba(0,0,0,0.3)" />
          <!-- Base -->
          <rect x="${e+12}" y="${t+38}" width="26" height="8" fill="#444" />
          <!-- Bomb body -->
          <rect x="${e+16}" y="${t+14}" width="18" height="24" fill="${p}" />
          <rect x="${e+18}" y="${t+16}" width="14" height="20" fill="${h}" />
          <!-- Fuse -->
          <rect x="${e+24}" y="${t+6}" width="2" height="8" fill="#444" />
          <!-- Spark -->
          <rect x="${e+22}" y="${t+4}" width="6" height="4" fill="#ff0"><animate attributeName="opacity" values="1;0;1" dur="0.3s" repeatCount="indefinite" /></rect>
          <!-- Markings -->
          <rect x="${e+20}" y="${t+22}" width="10" height="4" fill="${n}" />
          <rect x="${e+20}" y="${t+30}" width="10" height="4" fill="${n}" />
          <circle cx="${e+25}" cy="${t+12}" r="3" fill="${n}" stroke="${i}" stroke-width="1" />
          ${f?`<rect x="${e+14}" y="${t+24}" width="22" height="4" fill="#f00" /><rect x="${e+24}" y="${t+14}" width="4" height="24" fill="#f00" />`:""}
          ${s}
        </g>
      `}if(d==="fantasy"){const h=o.primary,p=o.dark;return`
        <g class="cursor-pointer ${f?"opacity-50":""}" data-piece="${r.type}" data-team="${r.team}" data-col="${r.col}" data-row="${r.row}">
          <ellipse cx="${e+25}" cy="${t+46}" rx="14" ry="4" fill="rgba(0,0,0,0.3)" />
          <!-- Magic circle -->
          <circle cx="${e+25}" cy="${t+40}" r="12" fill="none" stroke="${h}" stroke-width="1.5" />
          <circle cx="${e+25}" cy="${t+40}" r="8" fill="none" stroke="${h}" stroke-width="1" />
          <!-- Rune marks -->
          <text x="${e+25}" y="${t+43}" text-anchor="middle" font-size="8" fill="${h}">✧</text>
          <!-- Floating meteor -->
          <ellipse cx="${e+25}" cy="${t+20}" rx="10" ry="8" fill="#8b4513" stroke="${p}" stroke-width="1" />
          <ellipse cx="${e+22}" cy="${t+18}" rx="3" ry="2" fill="#a0522d" />
          <!-- Fire trail -->
          <path d="M${e+25} ${t+28} Q${e+30} ${t+34} ${e+25} ${t+38} Q${e+20} ${t+34} ${e+25} ${t+28}" fill="#ff6600" opacity="0.8"><animate attributeName="d" values="M${e+25} ${t+28} Q${e+30} ${t+34} ${e+25} ${t+38} Q${e+20} ${t+34} ${e+25} ${t+28};M${e+25} ${t+28} Q${e+32} ${t+36} ${e+25} ${t+42} Q${e+18} ${t+36} ${e+25} ${t+28};M${e+25} ${t+28} Q${e+30} ${t+34} ${e+25} ${t+38} Q${e+20} ${t+34} ${e+25} ${t+28}" dur="0.5s" repeatCount="indefinite" /></path>
          <!-- Magical levitation glow -->
          <circle cx="${e+25}" cy="${t+20}" r="12" fill="none" stroke="${h}" stroke-width="1" opacity="0.5"><animate attributeName="r" values="12;15;12" dur="1s" repeatCount="indefinite" /></circle>
          <circle cx="${e+25}" cy="${t+8}" r="3" fill="${n}" stroke="${i}" stroke-width="1" />
          ${f?`<circle cx="${e+25}" cy="${t+25}" r="15" fill="${p}" opacity="0.5" />`:""}
          ${s}
        </g>
      `}if(d==="minimal"){const h=o.primary;return`
        <g class="cursor-pointer ${f?"opacity-50":""}" data-piece="${r.type}" data-team="${r.team}" data-col="${r.col}" data-row="${r.row}">
          <ellipse cx="${e+25}" cy="${t+46}" rx="10" ry="3" fill="rgba(0,0,0,0.2)" />
          <!-- Simple base -->
          <rect x="${e+14}" y="${t+40}" width="22" height="6" fill="#333" stroke="#000" stroke-width="1.5" />
          <!-- Simple body -->
          <rect x="${e+18}" y="${t+14}" width="14" height="28" fill="${h}" stroke="#000" stroke-width="2" />
          <!-- Simple nose -->
          <path d="M${e+18} ${t+14} L${e+25} ${t+4} L${e+32} ${t+14} Z" fill="#ff4444" stroke="#000" stroke-width="1.5" />
          <circle cx="${e+25}" cy="${t+20}" r="3" fill="${n}" stroke="${i}" stroke-width="1" />
          ${f?`<line x1="${e+15}" y1="${t+15}" x2="${e+35}" y2="${t+35}" stroke="#ff0000" stroke-width="3" /><line x1="${e+35}" y1="${t+15}" x2="${e+15}" y2="${t+35}" stroke="#ff0000" stroke-width="3" />`:""}
          ${s}
        </g>
      `}if(d==="cartoon"){const h=o.primary,p=o.secondary;return`
        <g class="cursor-pointer ${f?"opacity-50":""}" data-piece="${r.type}" data-team="${r.team}" data-col="${r.col}" data-row="${r.row}">
          <ellipse cx="${e+25}" cy="${t+46}" rx="12" ry="4" fill="rgba(0,0,0,0.3)" />
          <!-- Cute launch pad -->
          <ellipse cx="${e+25}" cy="${t+42}" rx="14" ry="5" fill="#666" stroke="#000" stroke-width="1.5" />
          <!-- Cute round body -->
          <ellipse cx="${e+25}" cy="${t+26}" rx="12" ry="16" fill="${h}" stroke="#000" stroke-width="2" />
          <!-- Cute face window -->
          <ellipse cx="${e+25}" cy="${t+22}" rx="7" ry="8" fill="#88ccff" stroke="#000" stroke-width="1" />
          <!-- Cute eyes in window -->
          <circle cx="${e+22}" cy="${t+21}" r="2" fill="#000" />
          <circle cx="${e+28}" cy="${t+21}" r="2" fill="#000" />
          <circle cx="${e+23}" cy="${t+20}" r="0.5" fill="#fff" />
          <circle cx="${e+29}" cy="${t+20}" r="0.5" fill="#fff" />
          <!-- Cute smile -->
          <path d="M${e+22} ${t+26} Q${e+25} ${t+29} ${e+28} ${t+26}" stroke="#000" stroke-width="1" fill="none" />
          <!-- Cute nose -->
          <path d="M${e+20} ${t+10} L${e+25} ${t+2} L${e+30} ${t+10}" fill="#ff6666" stroke="#000" stroke-width="1.5" />
          <!-- Cute fins -->
          <ellipse cx="${e+14}" cy="${t+38}" rx="4" ry="6" fill="${p}" stroke="#000" stroke-width="1" />
          <ellipse cx="${e+36}" cy="${t+38}" rx="4" ry="6" fill="${p}" stroke="#000" stroke-width="1" />
          <!-- Exhaust puff -->
          <ellipse cx="${e+25}" cy="${t+44}" rx="6" ry="3" fill="#ddd" stroke="#000" stroke-width="0.5" />
          <circle cx="${e+25}" cy="${t+10}" r="3" fill="${n}" stroke="${i}" stroke-width="1" />
          ${f?`<text x="${e+25}" y="${t+24}" text-anchor="middle" font-size="12">😵</text>`:""}
          ${s}
        </g>
      `}if(d==="military"){const h=o.primary,p=o.secondary;return`
        <g class="cursor-pointer ${f?"opacity-50":""}" data-piece="${r.type}" data-team="${r.team}" data-col="${r.col}" data-row="${r.row}">
          <ellipse cx="${e+25}" cy="${t+46}" rx="12" ry="4" fill="rgba(0,0,0,0.4)" />
          <!-- Launch rail -->
          <rect x="${e+10}" y="${t+38}" width="30" height="8" fill="#333" stroke="#222" stroke-width="1" />
          <rect x="${e+14}" y="${t+40}" width="22" height="4" fill="#444" />
          <!-- Missile body -->
          <rect x="${e+18}" y="${t+12}" width="14" height="28" fill="${h}" stroke="#222" stroke-width="1.5" />
          <rect x="${e+20}" y="${t+16}" width="6" height="10" fill="${p}" />
          <rect x="${e+22}" y="${t+30}" width="4" height="6" fill="${p}" />
          <!-- Warhead -->
          <path d="M${e+18} ${t+12} L${e+25} ${t+2} L${e+32} ${t+12} Z" fill="#333" stroke="#222" stroke-width="1" />
          <!-- Guidance fins -->
          <rect x="${e+14}" y="${t+32}" width="4" height="8" fill="#444" stroke="#222" stroke-width="0.5" />
          <rect x="${e+32}" y="${t+32}" width="4" height="8" fill="#444" stroke="#222" stroke-width="0.5" />
          <!-- Markings -->
          <line x1="${e+20}" y1="${t+20}" x2="${e+30}" y2="${t+20}" stroke="#ff0" stroke-width="1" />
          <line x1="${e+20}" y1="${t+24}" x2="${e+30}" y2="${t+24}" stroke="#ff0" stroke-width="1" />
          <circle cx="${e+25}" cy="${t+10}" r="3" fill="${n}" stroke="${i}" stroke-width="1" />
          ${f?`<rect x="${e+15}" y="${t+20}" width="20" height="15" fill="#ff0000" opacity="0.4" /><line x1="${e+15}" y1="${t+15}" x2="${e+35}" y2="${t+35}" stroke="#ff0000" stroke-width="3" />`:""}
          ${s}
        </g>
      `}if(d==="scifi"){const h=o.primary,p=o.secondary;return`
        <g class="cursor-pointer ${f?"opacity-50":""}" data-piece="${r.type}" data-team="${r.team}" data-col="${r.col}" data-row="${r.row}">
          <!-- Launch field -->
          <ellipse cx="${e+25}" cy="${t+44}" rx="14" ry="5" fill="${p}" opacity="0.3">
            <animate attributeName="ry" values="5;7;5" dur="0.8s" repeatCount="indefinite" />
          </ellipse>
          <!-- Launch platform -->
          <rect x="${e+12}" y="${t+38}" width="26" height="8" rx="2" fill="${h}" stroke="${p}" stroke-width="1" />
          <!-- Torpedo body -->
          <ellipse cx="${e+25}" cy="${t+24}" rx="10" ry="16" fill="${h}" stroke="${p}" stroke-width="1.5" />
          <!-- Energy core -->
          <ellipse cx="${e+25}" cy="${t+24}" rx="6" ry="10" fill="${p}" opacity="0.6">
            <animate attributeName="opacity" values="0.6;0.9;0.6" dur="0.8s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="${e+25}" cy="${t+24}" rx="3" ry="5" fill="#fff" opacity="0.8" />
          <!-- Warhead -->
          <ellipse cx="${e+25}" cy="${t+6}" rx="6" ry="4" fill="${p}">
            <animate attributeName="ry" values="4;5;4" dur="0.5s" repeatCount="indefinite" />
          </ellipse>
          <!-- Stabilizers -->
          <rect x="${e+12}" y="${t+32}" width="4" height="8" rx="1" fill="${p}" />
          <rect x="${e+34}" y="${t+32}" width="4" height="8" rx="1" fill="${p}" />
          <!-- Thruster glow -->
          <ellipse cx="${e+25}" cy="${t+42}" rx="4" ry="2" fill="${p}">
            <animate attributeName="ry" values="2;4;2" dur="0.3s" repeatCount="indefinite" />
          </ellipse>
          <circle cx="${e+25}" cy="${t+10}" r="3" fill="${n}" stroke="${i}" stroke-width="1" />
          ${f?`<ellipse cx="${e+25}" cy="${t+24}" rx="12" ry="18" fill="#ff0000" opacity="0.3" /><line x1="${e+15}" y1="${t+15}" x2="${e+35}" y2="${t+35}" stroke="#ff0000" stroke-width="2" />`:""}
          ${s}
        </g>
      `}return`
      <g class="cursor-pointer ${f?"opacity-50":""}" data-piece="${r.type}" data-team="${r.team}" data-col="${r.col}" data-row="${r.row}">
        <!-- Shadow -->
        <ellipse cx="${e+25}" cy="${t+46}" rx="10" ry="3" fill="rgba(0,0,0,0.3)" />
        <!-- Launch platform/base -->
        <rect x="${e+12}" y="${t+40}" width="26" height="6" rx="2" fill="#4a4a4a" stroke="#2d2d2d" stroke-width="1" />
        <rect x="${e+14}" y="${t+42}" width="22" height="2" fill="#3d3d3d" />
        <!-- Rocket body -->
        <rect x="${e+20}" y="${t+14}" width="10" height="28" rx="3" fill="${c}" stroke="${l}" stroke-width="1" />
        <!-- Body stripes -->
        <rect x="${e+20}" y="${t+26}" width="10" height="3" fill="${n}" />
        <rect x="${e+20}" y="${t+32}" width="10" height="3" fill="${n}" />
        <!-- Nose cone -->
        <path d="M${e+20} ${t+14} L${e+25} ${t+4} L${e+30} ${t+14} Z" fill="${u}" stroke="#b91c1c" stroke-width="1" />
        <!-- Fins -->
        <path d="M${e+18} ${t+38} L${e+20} ${t+34} L${e+20} ${t+40} Z" fill="${c}" stroke="${l}" stroke-width="0.5" />
        <path d="M${e+32} ${t+38} L${e+30} ${t+34} L${e+30} ${t+40} Z" fill="${c}" stroke="${l}" stroke-width="0.5" />
        <path d="M${e+25} ${t+42} L${e+25} ${t+34} L${e+28} ${t+40} Z" fill="${c}" stroke="${l}" stroke-width="0.5" />
        <!-- Exhaust nozzle -->
        <ellipse cx="${e+25}" cy="${t+42}" rx="4" ry="2" fill="#2d2d2d" />
        <!-- Team indicator -->
        <circle cx="${e+25}" cy="${t+20}" r="3" fill="${n}" stroke="${i}" stroke-width="1" />
        ${f?`
          <!-- Used X mark -->
          <line x1="${e+15}" y1="${t+15}" x2="${e+35}" y2="${t+35}" stroke="#ef4444" stroke-width="3" />
          <line x1="${e+35}" y1="${t+15}" x2="${e+15}" y2="${t+35}" stroke="#ef4444" stroke-width="3" />
        `:""}
        ${s}
      </g>
    `}if(r.type==="sub"){const o=xt(r.team),c=o.helmet,l=o.uniform,u=r.frozenTurns&&r.frozenTurns>0,f=Vt();if(f==="robot"){const d=o.primary,h=o.uniform;return`
        <g class="cursor-pointer" data-piece="${r.type}" data-team="${r.team}" data-col="${r.col}" data-row="${r.row}">
          <!-- Energy trail -->
          <ellipse cx="${e+45}" cy="${t+28}" rx="4" ry="8" fill="${d}" opacity="0.4"><animate attributeName="rx" values="4;6;4" dur="0.3s" repeatCount="indefinite" /></ellipse>
          <!-- Main body -->
          <ellipse cx="${e+25}" cy="${t+28}" rx="20" ry="8" fill="${h}" stroke="${d}" stroke-width="1.5" />
          <!-- Sensor array front -->
          <ellipse cx="${e+6}" cy="${t+28}" rx="4" ry="6" fill="${d}" stroke="${h}" stroke-width="1" />
          <circle cx="${e+6}" cy="${t+28}" r="2" fill="#ff0000"><animate attributeName="opacity" values="1;0.3;1" dur="1s" repeatCount="indefinite" /></circle>
          <!-- Cockpit dome -->
          <ellipse cx="${e+20}" cy="${t+22}" rx="8" ry="5" fill="${h}" stroke="${d}" stroke-width="1" />
          <ellipse cx="${e+20}" cy="${t+21}" rx="5" ry="3" fill="${d}" opacity="0.6" />
          <!-- Thrusters -->
          <rect x="${e+42}" y="${t+24}" width="6" height="8" rx="2" fill="${d}" />
          <!-- Stabilizers -->
          <rect x="${e+35}" y="${t+18}" width="6" height="4" fill="${d}" />
          <rect x="${e+35}" y="${t+34}" width="6" height="4" fill="${d}" />
          <circle cx="${e+25}" cy="${t+12}" r="3" fill="${n}" stroke="${i}" stroke-width="1" />
          ${u?`<rect x="${e+5}" y="${t+10}" width="40" height="30" fill="${d}" opacity="0.3" rx="4" />`:""}
          ${s}
        </g>
      `}if(f==="medieval"){const d=o.primary,h=o.dark;return`
        <g class="cursor-pointer" data-piece="${r.type}" data-team="${r.team}" data-col="${r.col}" data-row="${r.row}">
          <!-- Water splashes -->
          <circle cx="${e+10}" cy="${t+14}" r="2" fill="#87ceeb" opacity="0.5" />
          <circle cx="${e+40}" cy="${t+12}" r="1.5" fill="#87ceeb" opacity="0.4" />
          <!-- Serpent body -->
          <ellipse cx="${e+25}" cy="${t+30}" rx="18" ry="10" fill="${d}" stroke="${h}" stroke-width="1.5" />
          <!-- Scale pattern -->
          <ellipse cx="${e+18}" cy="${t+28}" rx="4" ry="3" fill="${h}" opacity="0.4" />
          <ellipse cx="${e+28}" cy="${t+30}" rx="4" ry="3" fill="${h}" opacity="0.4" />
          <ellipse cx="${e+38}" cy="${t+28}" rx="3" ry="2" fill="${h}" opacity="0.4" />
          <!-- Serpent head -->
          <ellipse cx="${e+8}" cy="${t+26}" rx="6" ry="5" fill="${d}" stroke="${h}" stroke-width="1" />
          <!-- Eyes -->
          <circle cx="${e+6}" cy="${t+24}" r="2" fill="#ff0" />
          <circle cx="${e+6}" cy="${t+24}" r="1" fill="#000" />
          <!-- Fangs -->
          <path d="M${e+3} ${t+28} L${e+5} ${t+32} Z" stroke="#fff" stroke-width="1.5" />
          <!-- Tail fin -->
          <path d="M${e+42} ${t+26} L${e+50} ${t+22} L${e+48} ${t+30} L${e+50} ${t+38} L${e+42} ${t+34} Z" fill="${d}" stroke="${h}" stroke-width="1" />
          <!-- Dorsal fins -->
          <path d="M${e+20} ${t+20} L${e+24} ${t+12} L${e+28} ${t+20}" fill="${d}" stroke="${h}" stroke-width="0.5" />
          <circle cx="${e+25}" cy="${t+10}" r="3" fill="${n}" stroke="${i}" stroke-width="1" />
          ${u?`<rect x="${e+5}" y="${t+10}" width="40" height="30" fill="#4488cc" opacity="0.4" rx="4" />`:""}
          ${s}
        </g>
      `}if(f==="pixel"){const d=o.primary,h=o.secondary;return`
        <g class="cursor-pointer" data-piece="${r.type}" data-team="${r.team}" data-col="${r.col}" data-row="${r.row}">
          <!-- Bubbles -->
          <rect x="${e+8}" y="${t+10}" width="4" height="4" fill="#88ccff" />
          <rect x="${e+14}" y="${t+6}" width="4" height="4" fill="#88ccff" />
          <!-- Hull -->
          <rect x="${e+6}" y="${t+22}" width="38" height="16" fill="${h}" />
          <rect x="${e+8}" y="${t+24}" width="34" height="12" fill="${d}" />
          <!-- Nose -->
          <rect x="${e+2}" y="${t+26}" width="6" height="8" fill="${h}" />
          <!-- Tower -->
          <rect x="${e+18}" y="${t+14}" width="12" height="8" fill="${h}" />
          <rect x="${e+20}" y="${t+16}" width="8" height="4" fill="#88ccff" />
          <!-- Periscope -->
          <rect x="${e+24}" y="${t+8}" width="2" height="6" fill="#444" />
          <rect x="${e+22}" y="${t+6}" width="6" height="4" fill="#666" />
          <!-- Propeller -->
          <rect x="${e+44}" y="${t+26}" width="4" height="8" fill="#444" />
          <circle cx="${e+25}" cy="${t+10}" r="3" fill="${n}" stroke="${i}" stroke-width="1" />
          ${u?`<rect x="${e+4}" y="${t+12}" width="42" height="28" fill="#4488ff" opacity="0.4" />`:""}
          ${s}
        </g>
      `}if(f==="fantasy"){const d=o.primary,h=o.dark;return`
        <g class="cursor-pointer" data-piece="${r.type}" data-team="${r.team}" data-col="${r.col}" data-row="${r.row}">
          <!-- Water form -->
          <ellipse cx="${e+25}" cy="${t+30}" rx="18" ry="12" fill="${d}" opacity="0.7" stroke="${h}" stroke-width="1" />
          <!-- Inner glow -->
          <ellipse cx="${e+25}" cy="${t+28}" rx="12" ry="8" fill="#fff" opacity="0.3" />
          <!-- Water streams -->
          <path d="M${e+8} ${t+26} Q${e+2} ${t+20} ${e+6} ${t+14}" stroke="${d}" stroke-width="4" fill="none" opacity="0.8"><animate attributeName="d" values="M${e+8} ${t+26} Q${e+2} ${t+20} ${e+6} ${t+14};M${e+8} ${t+26} Q${e} ${t+18} ${e+4} ${t+10};M${e+8} ${t+26} Q${e+2} ${t+20} ${e+6} ${t+14}" dur="1s" repeatCount="indefinite" /></path>
          <path d="M${e+42} ${t+26} Q${e+48} ${t+20} ${e+44} ${t+14}" stroke="${d}" stroke-width="4" fill="none" opacity="0.8" />
          <!-- Eyes -->
          <circle cx="${e+20}" cy="${t+26}" r="3" fill="#fff" />
          <circle cx="${e+30}" cy="${t+26}" r="3" fill="#fff" />
          <circle cx="${e+20}" cy="${t+26}" r="1.5" fill="${h}" />
          <circle cx="${e+30}" cy="${t+26}" r="1.5" fill="${h}" />
          <!-- Magic droplets -->
          <circle cx="${e+12}" cy="${t+16}" r="2" fill="${d}" opacity="0.6"><animate attributeName="cy" values="${t+16};${t+10};${t+16}" dur="1.5s" repeatCount="indefinite" /></circle>
          <circle cx="${e+38}" cy="${t+18}" r="2" fill="${d}" opacity="0.6"><animate attributeName="cy" values="${t+18};${t+12};${t+18}" dur="1.2s" repeatCount="indefinite" /></circle>
          <circle cx="${e+25}" cy="${t+10}" r="3" fill="${n}" stroke="${i}" stroke-width="1" />
          ${u?`<rect x="${e+5}" y="${t+10}" width="40" height="30" fill="#88ccff" opacity="0.5" rx="4" />`:""}
          ${s}
        </g>
      `}if(f==="minimal"){const d=o.primary;return`
        <g class="cursor-pointer" data-piece="${r.type}" data-team="${r.team}" data-col="${r.col}" data-row="${r.row}">
          <!-- Simple hull -->
          <ellipse cx="${e+25}" cy="${t+30}" rx="20" ry="10" fill="${d}" stroke="#000" stroke-width="2" />
          <!-- Simple tower -->
          <rect x="${e+18}" y="${t+16}" width="14" height="12" fill="${d}" stroke="#000" stroke-width="1.5" />
          <!-- Simple periscope -->
          <rect x="${e+23}" y="${t+6}" width="4" height="12" fill="#333" stroke="#000" stroke-width="1" />
          <circle cx="${e+25}" cy="${t+10}" r="3" fill="${n}" stroke="${i}" stroke-width="1" />
          ${u?`<rect x="${e+5}" y="${t+10}" width="40" height="30" fill="#4488ff" opacity="0.4" rx="4" />`:""}
          ${s}
        </g>
      `}if(f==="cartoon"){const d=o.primary,h=o.secondary;return`
        <g class="cursor-pointer" data-piece="${r.type}" data-team="${r.team}" data-col="${r.col}" data-row="${r.row}">
          <!-- Cute bubbles -->
          <circle cx="${e+10}" cy="${t+10}" r="3" fill="#88ccff" stroke="#000" stroke-width="0.5" />
          <circle cx="${e+16}" cy="${t+6}" r="2" fill="#aaddff" />
          <!-- Cute round body -->
          <ellipse cx="${e+25}" cy="${t+30}" rx="20" ry="12" fill="${d}" stroke="#000" stroke-width="2" />
          <!-- Cute face -->
          <ellipse cx="${e+14}" cy="${t+28}" rx="4" ry="5" fill="#fff" stroke="#000" stroke-width="1" />
          <circle cx="${e+15}" cy="${t+29}" r="2.5" fill="#000" />
          <circle cx="${e+16}" cy="${t+28}" r="0.8" fill="#fff" />
          <!-- Cute smile -->
          <path d="M${e+8} ${t+34} Q${e+14} ${t+38} ${e+20} ${t+34}" stroke="#000" stroke-width="1.5" fill="none" />
          <!-- Cute tower -->
          <ellipse cx="${e+30}" cy="${t+20}" rx="8" ry="6" fill="${h}" stroke="#000" stroke-width="1.5" />
          <!-- Cute periscope -->
          <rect x="${e+28}" y="${t+8}" width="4" height="10" rx="1" fill="${d}" stroke="#000" stroke-width="1" />
          <ellipse cx="${e+30}" cy="${t+6}" rx="4" ry="3" fill="${h}" stroke="#000" stroke-width="1" />
          <!-- Propeller -->
          <ellipse cx="${e+46}" cy="${t+30}" rx="3" ry="6" fill="#666" stroke="#000" stroke-width="1" />
          <circle cx="${e+25}" cy="${t+10}" r="3" fill="${n}" stroke="${i}" stroke-width="1" />
          ${u?`<text x="${e+25}" y="${t+32}" text-anchor="middle" font-size="10">🥶</text>`:""}
          ${s}
        </g>
      `}if(f==="military"){const d=o.primary,h=o.secondary;return`
        <g class="cursor-pointer" data-piece="${r.type}" data-team="${r.team}" data-col="${r.col}" data-row="${r.row}">
          <!-- Hull -->
          <ellipse cx="${e+25}" cy="${t+30}" rx="22" ry="10" fill="${d}" stroke="#222" stroke-width="1.5" />
          <ellipse cx="${e+18}" cy="${t+28}" rx="8" ry="5" fill="${h}" />
          <ellipse cx="${e+35}" cy="${t+32}" rx="6" ry="4" fill="${h}" />
          <!-- Conning tower -->
          <rect x="${e+16}" y="${t+14}" width="16" height="14" fill="${d}" stroke="#222" stroke-width="1" />
          <rect x="${e+18}" y="${t+16}" width="6" height="4" fill="${h}" />
          <!-- Periscope array -->
          <rect x="${e+22}" y="${t+4}" width="3" height="12" fill="#333" />
          <rect x="${e+27}" y="${t+6}" width="2" height="10" fill="#444" />
          <rect x="${e+20}" y="${t+2}" width="6" height="4" fill="#444" />
          <!-- Torpedo tubes -->
          <circle cx="${e+4}" cy="${t+28}" r="2" fill="#333" />
          <circle cx="${e+4}" cy="${t+32}" r="2" fill="#333" />
          <!-- Propeller -->
          <ellipse cx="${e+46}" cy="${t+30}" rx="3" ry="6" fill="#333" />
          <circle cx="${e+25}" cy="${t+10}" r="3" fill="${n}" stroke="${i}" stroke-width="1" />
          ${u?`<rect x="${e+3}" y="${t+8}" width="44" height="32" fill="#4466aa" opacity="0.4" rx="4" />`:""}
          ${s}
        </g>
      `}if(f==="scifi"){const d=o.primary,h=o.secondary;return`
        <g class="cursor-pointer" data-piece="${r.type}" data-team="${r.team}" data-col="${r.col}" data-row="${r.row}">
          <!-- Energy trail -->
          <ellipse cx="${e+46}" cy="${t+30}" rx="4" ry="8" fill="${h}" opacity="0.5">
            <animate attributeName="rx" values="4;6;4" dur="0.4s" repeatCount="indefinite" />
          </ellipse>
          <!-- Sleek hull -->
          <path d="M${e+4} ${t+30} Q${e+25} ${t+18} ${e+46} ${t+30} Q${e+25} ${t+42} ${e+4} ${t+30}" fill="${d}" stroke="${h}" stroke-width="1.5" />
          <!-- Energy line -->
          <line x1="${e+8}" y1="${t+30}" x2="${e+42}" y2="${t+30}" stroke="${h}" stroke-width="2">
            <animate attributeName="opacity" values="1;0.4;1" dur="0.6s" repeatCount="indefinite" />
          </line>
          <!-- Cockpit dome -->
          <ellipse cx="${e+20}" cy="${t+26}" rx="8" ry="5" fill="#111" stroke="${h}" stroke-width="0.5" />
          <ellipse cx="${e+20}" cy="${t+25}" rx="5" ry="3" fill="${h}" opacity="0.4" />
          <!-- Sensor array -->
          <rect x="${e+30}" y="${t+16}" width="8" height="10" rx="2" fill="${d}" stroke="${h}" stroke-width="1" />
          <circle cx="${e+34}" cy="${t+21}" r="2" fill="${h}">
            <animate attributeName="opacity" values="1;0.3;1" dur="1s" repeatCount="indefinite" />
          </circle>
          <!-- Stealth fins -->
          <path d="M${e+8} ${t+24} L${e+4} ${t+18} L${e+12} ${t+22}" fill="${h}" opacity="0.6" />
          <path d="M${e+8} ${t+36} L${e+4} ${t+42} L${e+12} ${t+38}" fill="${h}" opacity="0.6" />
          <circle cx="${e+25}" cy="${t+10}" r="3" fill="${n}" stroke="${i}" stroke-width="1" />
          ${u?`<ellipse cx="${e+25}" cy="${t+30}" rx="22" ry="14" fill="${h}" opacity="0.3" />`:""}
          ${s}
        </g>
      `}return`
      <g class="cursor-pointer" data-piece="${r.type}" data-team="${r.team}" data-col="${r.col}" data-row="${r.row}">
        <!-- Water/bubbles -->
        <circle cx="${e+10}" cy="${t+12}" r="2" fill="#87ceeb" opacity="0.6" />
        <circle cx="${e+15}" cy="${t+8}" r="1.5" fill="#87ceeb" opacity="0.5" />
        <circle cx="${e+8}" cy="${t+6}" r="1" fill="#87ceeb" opacity="0.4" />
        <!-- Hull (submarine body) -->
        <ellipse cx="${e+25}" cy="${t+30}" rx="20" ry="10" fill="${c}" stroke="${l}" stroke-width="1.5" />
        <!-- Hull top highlight -->
        <ellipse cx="${e+25}" cy="${t+26}" rx="16" ry="5" fill="${c}" opacity="0.8" />
        <!-- Conning tower (sail) -->
        <rect x="${e+18}" y="${t+16}" width="14" height="12" rx="2" fill="${c}" stroke="${l}" stroke-width="1" />
        <!-- Periscope -->
        <rect x="${e+24}" y="${t+6}" width="2" height="12" fill="#3d3d3d" />
        <rect x="${e+22}" y="${t+4}" width="6" height="4" rx="1" fill="#2d2d2d" />
        <!-- Periscope lens -->
        <rect x="${e+23}" y="${t+5}" width="4" height="2" fill="#87ceeb" opacity="0.8" />
        <!-- Windows on tower -->
        <circle cx="${e+22}" cy="${t+20}" r="2" fill="#87ceeb" opacity="0.6" />
        <circle cx="${e+28}" cy="${t+20}" r="2" fill="#87ceeb" opacity="0.6" />
        <!-- Hull details -->
        <line x1="${e+8}" y1="${t+30}" x2="${e+42}" y2="${t+30}" stroke="${l}" stroke-width="1" />
        <!-- Propeller area -->
        <ellipse cx="${e+44}" cy="${t+30}" rx="3" ry="6" fill="${l}" />
        <!-- Front torpedo tubes -->
        <circle cx="${e+6}" cy="${t+28}" r="2" fill="#2d2d2d" />
        <circle cx="${e+6}" cy="${t+32}" r="2" fill="#2d2d2d" />
        <!-- Dive planes -->
        <rect x="${e+5}" y="${t+26}" width="6" height="2" fill="${l}" />
        <rect x="${e+39}" y="${t+26}" width="6" height="2" fill="${l}" />
        <!-- Team indicator -->
        <circle cx="${e+25}" cy="${t+10}" r="3" fill="${n}" stroke="${i}" stroke-width="1" />
        ${u?`
          <!-- Frozen indicator -->
          <rect x="${e+5}" y="${t+5}" width="40" height="40" fill="#60a5fa" opacity="0.3" rx="4" />
          <text x="${e+25}" y="${t+28}" text-anchor="middle" font-size="16" fill="#3b82f6">❄</text>
        `:""}
        ${s}
      </g>
    `}if(r.type==="fighter"){const o=xt(r.team),c=o.helmet,l=o.uniform,u="#87ceeb",f=r.frozenTurns&&r.frozenTurns>0,d=r.cooldownTurns&&r.cooldownTurns>0,h=Vt();if(h==="robot"){const p=o.primary,g=o.uniform;return`
        <g class="cursor-pointer" data-piece="${r.type}" data-team="${r.team}" data-col="${r.col}" data-row="${r.row}">
          <ellipse cx="${e+25}" cy="${t+46}" rx="18" ry="4" fill="rgba(0,0,0,0.3)" />
          <!-- Main body disc -->
          <ellipse cx="${e+25}" cy="${t+26}" rx="16" ry="10" fill="${g}" stroke="${p}" stroke-width="1.5" />
          <!-- Central dome -->
          <ellipse cx="${e+25}" cy="${t+22}" rx="8" ry="6" fill="${g}" stroke="${p}" stroke-width="1" />
          <ellipse cx="${e+25}" cy="${t+20}" rx="4" ry="3" fill="${p}" opacity="0.6" />
          <!-- Wing pods -->
          <ellipse cx="${e+8}" cy="${t+28}" rx="6" ry="4" fill="${g}" stroke="${p}" stroke-width="1" />
          <ellipse cx="${e+42}" cy="${t+28}" rx="6" ry="4" fill="${g}" stroke="${p}" stroke-width="1" />
          <!-- Weapon barrels -->
          <rect x="${e+4}" y="${t+32}" width="2" height="8" fill="${p}" />
          <rect x="${e+44}" y="${t+32}" width="2" height="8" fill="${p}" />
          <!-- Energy core -->
          <circle cx="${e+25}" cy="${t+26}" r="4" fill="${p}"><animate attributeName="opacity" values="1;0.4;1" dur="1s" repeatCount="indefinite" /></circle>
          <!-- Thrusters -->
          <ellipse cx="${e+25}" cy="${t+38}" rx="6" ry="3" fill="${p}" opacity="0.6"><animate attributeName="ry" values="3;5;3" dur="0.5s" repeatCount="indefinite" /></ellipse>
          <circle cx="${e+25}" cy="${t+8}" r="3" fill="${n}" stroke="${i}" stroke-width="1" />
          ${d?`<circle cx="${e+40}" cy="${t+10}" r="6" fill="${p}" opacity="0.8" /><text x="${e+40}" y="${t+13}" text-anchor="middle" font-size="8" fill="#000">${r.cooldownTurns}</text>`:""}
          ${f?`<rect x="${e+5}" y="${t+5}" width="40" height="40" fill="${p}" opacity="0.3" rx="4" />`:""}
          ${s}
        </g>
      `}if(h==="medieval"){const p=o.primary,g=o.dark;return`
        <g class="cursor-pointer" data-piece="${r.type}" data-team="${r.team}" data-col="${r.col}" data-row="${r.row}">
          <ellipse cx="${e+25}" cy="${t+46}" rx="18" ry="4" fill="rgba(0,0,0,0.3)" />
          <!-- Body -->
          <ellipse cx="${e+25}" cy="${t+28}" rx="8" ry="12" fill="${p}" stroke="${g}" stroke-width="1" />
          <!-- Head -->
          <ellipse cx="${e+25}" cy="${t+14}" rx="6" ry="5" fill="${p}" stroke="${g}" stroke-width="1" />
          <!-- Beak -->
          <path d="M${e+25} ${t+16} L${e+22} ${t+22} L${e+25} ${t+20} L${e+28} ${t+22} Z" fill="#ffa500" stroke="${g}" stroke-width="0.5" />
          <!-- Eyes -->
          <circle cx="${e+22}" cy="${t+13}" r="2" fill="#000" />
          <circle cx="${e+28}" cy="${t+13}" r="2" fill="#000" />
          <circle cx="${e+22}" cy="${t+12.5}" r="0.5" fill="#fff" />
          <circle cx="${e+28}" cy="${t+12.5}" r="0.5" fill="#fff" />
          <!-- Wings spread -->
          <path d="M${e+17} ${t+24} Q${e+2} ${t+18} ${e} ${t+30} L${e+8} ${t+36} L${e+17} ${t+32} Z" fill="${p}" stroke="${g}" stroke-width="1" />
          <path d="M${e+33} ${t+24} Q${e+48} ${t+18} ${e+50} ${t+30} L${e+42} ${t+36} L${e+33} ${t+32} Z" fill="${p}" stroke="${g}" stroke-width="1" />
          <!-- Tail feathers -->
          <path d="M${e+22} ${t+38} L${e+20} ${t+46} L${e+25} ${t+44} L${e+30} ${t+46} L${e+28} ${t+38} Z" fill="${p}" stroke="${g}" stroke-width="0.5" />
          <!-- Talons -->
          <path d="M${e+20} ${t+40} L${e+18} ${t+46}" stroke="${g}" stroke-width="2" />
          <path d="M${e+30} ${t+40} L${e+32} ${t+46}" stroke="${g}" stroke-width="2" />
          <circle cx="${e+25}" cy="${t+6}" r="3" fill="${n}" stroke="${i}" stroke-width="1" />
          ${d?`<circle cx="${e+40}" cy="${t+10}" r="6" fill="#ef4444" opacity="0.8" /><text x="${e+40}" y="${t+13}" text-anchor="middle" font-size="8" fill="white">${r.cooldownTurns}</text>`:""}
          ${f?`<rect x="${e+5}" y="${t+5}" width="40" height="40" fill="#60a5fa" opacity="0.3" rx="4" />`:""}
          ${s}
        </g>
      `}if(h==="pixel"){const p=o.primary,g=o.secondary;return`
        <g class="cursor-pointer" data-piece="${r.type}" data-team="${r.team}" data-col="${r.col}" data-row="${r.row}">
          <rect x="${e+10}" y="${t+44}" width="30" height="4" fill="rgba(0,0,0,0.3)" />
          <!-- Body -->
          <rect x="${e+20}" y="${t+10}" width="10" height="32" fill="${g}" />
          <rect x="${e+22}" y="${t+12}" width="6" height="28" fill="${p}" />
          <!-- Nose -->
          <rect x="${e+22}" y="${t+6}" width="6" height="6" fill="#888" />
          <!-- Cockpit -->
          <rect x="${e+22}" y="${t+14}" width="6" height="6" fill="#88ccff" />
          <!-- Wings -->
          <rect x="${e+4}" y="${t+26}" width="16" height="6" fill="${g}" />
          <rect x="${e+30}" y="${t+26}" width="16" height="6" fill="${g}" />
          <!-- Missiles -->
          <rect x="${e+8}" y="${t+32}" width="4" height="8" fill="#f00" />
          <rect x="${e+38}" y="${t+32}" width="4" height="8" fill="#f00" />
          <!-- Tail -->
          <rect x="${e+18}" y="${t+38}" width="4" height="6" fill="${g}" />
          <rect x="${e+28}" y="${t+38}" width="4" height="6" fill="${g}" />
          <circle cx="${e+25}" cy="${t+6}" r="3" fill="${n}" stroke="${i}" stroke-width="1" />
          ${d?`<rect x="${e+36}" y="${t+6}" width="12" height="12" fill="#f00" /><text x="${e+42}" y="${t+15}" text-anchor="middle" font-size="8" fill="#fff">${r.cooldownTurns}</text>`:""}
          ${f?`<rect x="${e+6}" y="${t+6}" width="38" height="38" fill="#4488ff" opacity="0.4" />`:""}
          ${s}
        </g>
      `}if(h==="fantasy"){const p=o.primary,g=o.dark;return`
        <g class="cursor-pointer" data-piece="${r.type}" data-team="${r.team}" data-col="${r.col}" data-row="${r.row}">
          <ellipse cx="${e+25}" cy="${t+46}" rx="18" ry="4" fill="rgba(0,0,0,0.3)" />
          <!-- Fire trail -->
          <ellipse cx="${e+25}" cy="${t+44}" rx="10" ry="6" fill="#ff6600" opacity="0.6"><animate attributeName="ry" values="6;8;6" dur="0.3s" repeatCount="indefinite" /></ellipse>
          <!-- Body -->
          <ellipse cx="${e+25}" cy="${t+26}" rx="8" ry="14" fill="${p}" stroke="${g}" stroke-width="1" />
          <!-- Head -->
          <ellipse cx="${e+25}" cy="${t+10}" rx="6" ry="5" fill="${p}" stroke="${g}" stroke-width="1" />
          <!-- Head plume -->
          <path d="M${e+22} ${t+6} L${e+20} ${t} L${e+25} ${t+4} L${e+30} ${t} L${e+28} ${t+6}" fill="#ff6600" stroke="${g}" stroke-width="0.5" />
          <!-- Eyes -->
          <circle cx="${e+22}" cy="${t+9}" r="2" fill="#ff0" />
          <circle cx="${e+28}" cy="${t+9}" r="2" fill="#ff0" />
          <!-- Flaming wings -->
          <path d="M${e+17} ${t+20} Q${e} ${t+14} ${e-4} ${t+28} Q${e+4} ${t+36} ${e+17} ${t+34} Z" fill="${p}" stroke="${g}" stroke-width="1" />
          <path d="M${e+33} ${t+20} Q${e+50} ${t+14} ${e+54} ${t+28} Q${e+46} ${t+36} ${e+33} ${t+34} Z" fill="${p}" stroke="${g}" stroke-width="1" />
          <!-- Wing flames -->
          <path d="M${e} ${t+26} Q${e-6} ${t+22} ${e-4} ${t+18}" stroke="#ff6600" stroke-width="2" fill="none"><animate attributeName="d" dur="0.5s" repeatCount="indefinite" values="M${e} ${t+26} Q${e-6} ${t+22} ${e-4} ${t+18};M${e} ${t+26} Q${e-8} ${t+20} ${e-6} ${t+14};M${e} ${t+26} Q${e-6} ${t+22} ${e-4} ${t+18}" /></path>
          <path d="M${e+50} ${t+26} Q${e+56} ${t+22} ${e+54} ${t+18}" stroke="#ff6600" stroke-width="2" fill="none" />
          <!-- Tail flames -->
          <path d="M${e+22} ${t+38} Q${e+18} ${t+48} ${e+25} ${t+46} Q${e+32} ${t+48} ${e+28} ${t+38}" fill="#ff6600" stroke="${g}" stroke-width="0.5"><animate attributeName="d" dur="0.3s" repeatCount="indefinite" values="M${e+22} ${t+38} Q${e+18} ${t+48} ${e+25} ${t+46} Q${e+32} ${t+48} ${e+28} ${t+38};M${e+22} ${t+38} Q${e+16} ${t+52} ${e+25} ${t+50} Q${e+34} ${t+52} ${e+28} ${t+38};M${e+22} ${t+38} Q${e+18} ${t+48} ${e+25} ${t+46} Q${e+32} ${t+48} ${e+28} ${t+38}" /></path>
          <circle cx="${e+25}" cy="${t+4}" r="3" fill="${n}" stroke="${i}" stroke-width="1" />
          ${d?`<circle cx="${e+40}" cy="${t+10}" r="6" fill="#ff6600" opacity="0.8" /><text x="${e+40}" y="${t+13}" text-anchor="middle" font-size="8" fill="#000">${r.cooldownTurns}</text>`:""}
          ${f?`<rect x="${e+5}" y="${t+5}" width="40" height="40" fill="#60a5fa" opacity="0.3" rx="4" />`:""}
          ${s}
        </g>
      `}if(h==="minimal"){const p=o.primary;return`
        <g class="cursor-pointer" data-piece="${r.type}" data-team="${r.team}" data-col="${r.col}" data-row="${r.row}">
          <ellipse cx="${e+25}" cy="${t+46}" rx="16" ry="3" fill="rgba(0,0,0,0.2)" />
          <!-- Simple body -->
          <ellipse cx="${e+25}" cy="${t+26}" rx="8" ry="18" fill="${p}" stroke="#000" stroke-width="2" />
          <!-- Simple nose -->
          <path d="M${e+20} ${t+10} L${e+25} ${t+2} L${e+30} ${t+10} Z" fill="${p}" stroke="#000" stroke-width="1.5" />
          <!-- Simple wings -->
          <path d="M${e+17} ${t+26} L${e+4} ${t+34} L${e+6} ${t+38} L${e+17} ${t+32} Z" fill="${p}" stroke="#000" stroke-width="1.5" />
          <path d="M${e+33} ${t+26} L${e+46} ${t+34} L${e+44} ${t+38} L${e+33} ${t+32} Z" fill="${p}" stroke="#000" stroke-width="1.5" />
          <circle cx="${e+25}" cy="${t+6}" r="3" fill="${n}" stroke="${i}" stroke-width="1" />
          ${d?`<circle cx="${e+40}" cy="${t+10}" r="6" fill="#ff0000" opacity="0.8" /><text x="${e+40}" y="${t+13}" text-anchor="middle" font-size="8" fill="#fff">${r.cooldownTurns}</text>`:""}
          ${f?`<rect x="${e+5}" y="${t+5}" width="40" height="40" fill="#4488ff" opacity="0.4" rx="4" />`:""}
          ${s}
        </g>
      `}if(h==="cartoon"){const p=o.primary,g=o.secondary;return`
        <g class="cursor-pointer" data-piece="${r.type}" data-team="${r.team}" data-col="${r.col}" data-row="${r.row}">
          <ellipse cx="${e+25}" cy="${t+46}" rx="18" ry="4" fill="rgba(0,0,0,0.3)" />
          <!-- Cute round body -->
          <ellipse cx="${e+25}" cy="${t+26}" rx="10" ry="16" fill="${p}" stroke="#000" stroke-width="2" />
          <!-- Big cute eyes (cockpit) -->
          <ellipse cx="${e+22}" cy="${t+16}" rx="4" ry="5" fill="#fff" stroke="#000" stroke-width="1" />
          <ellipse cx="${e+28}" cy="${t+16}" rx="4" ry="5" fill="#fff" stroke="#000" stroke-width="1" />
          <circle cx="${e+23}" cy="${t+17}" r="2.5" fill="#000" />
          <circle cx="${e+29}" cy="${t+17}" r="2.5" fill="#000" />
          <circle cx="${e+24}" cy="${t+16}" r="0.8" fill="#fff" />
          <circle cx="${e+30}" cy="${t+16}" r="0.8" fill="#fff" />
          <!-- Cute nose -->
          <ellipse cx="${e+25}" cy="${t+6}" rx="4" ry="3" fill="${g}" stroke="#000" stroke-width="1" />
          <!-- Cute smile -->
          <path d="M${e+20} ${t+26} Q${e+25} ${t+30} ${e+30} ${t+26}" stroke="#000" stroke-width="1.5" fill="none" />
          <!-- Blush -->
          <ellipse cx="${e+16}" cy="${t+22}" rx="3" ry="2" fill="#ffaaaa" opacity="0.6" />
          <ellipse cx="${e+34}" cy="${t+22}" rx="3" ry="2" fill="#ffaaaa" opacity="0.6" />
          <!-- Cute wings -->
          <ellipse cx="${e+8}" cy="${t+30}" rx="8" ry="4" fill="${g}" stroke="#000" stroke-width="1.5" />
          <ellipse cx="${e+42}" cy="${t+30}" rx="8" ry="4" fill="${g}" stroke="#000" stroke-width="1.5" />
          <!-- Cute tail -->
          <ellipse cx="${e+25}" cy="${t+44}" rx="6" ry="4" fill="${g}" stroke="#000" stroke-width="1" />
          <circle cx="${e+25}" cy="${t+6}" r="3" fill="${n}" stroke="${i}" stroke-width="1" />
          ${d?`<text x="${e+42}" y="${t+14}" font-size="10">💤</text>`:""}
          ${f?`<text x="${e+25}" y="${t+28}" text-anchor="middle" font-size="10">🥶</text>`:""}
          ${s}
        </g>
      `}if(h==="military"){const p=o.primary,g=o.secondary;return`
        <g class="cursor-pointer" data-piece="${r.type}" data-team="${r.team}" data-col="${r.col}" data-row="${r.row}">
          <ellipse cx="${e+25}" cy="${t+46}" rx="18" ry="4" fill="rgba(0,0,0,0.4)" />
          <!-- Angular stealth body -->
          <path d="M${e+18} ${t+38} L${e+16} ${t+28} L${e+22} ${t+10} L${e+28} ${t+10} L${e+34} ${t+28} L${e+32} ${t+38} Z" fill="${p}" stroke="#222" stroke-width="1.5" />
          <path d="M${e+20} ${t+14} L${e+24} ${t+24} L${e+28} ${t+20} Z" fill="${g}" />
          <path d="M${e+24} ${t+30} L${e+30} ${t+36} L${e+22} ${t+36} Z" fill="${g}" />
          <!-- Nose -->
          <path d="M${e+22} ${t+10} L${e+25} ${t+2} L${e+28} ${t+10} Z" fill="#333" stroke="#222" stroke-width="1" />
          <!-- Cockpit -->
          <path d="M${e+22} ${t+12} L${e+25} ${t+8} L${e+28} ${t+12} L${e+26} ${t+18} L${e+24} ${t+18} Z" fill="#333" stroke="#222" stroke-width="0.5" />
          <!-- Delta wings -->
          <path d="M${e+16} ${t+28} L${e+2} ${t+38} L${e+8} ${t+42} L${e+20} ${t+36} Z" fill="${p}" stroke="#222" stroke-width="1" />
          <path d="M${e+34} ${t+28} L${e+48} ${t+38} L${e+42} ${t+42} L${e+30} ${t+36} Z" fill="${p}" stroke="#222" stroke-width="1" />
          <path d="M${e+6} ${t+36}" width="6" height="4" fill="${g}" />
          <!-- Missiles -->
          <rect x="${e+6}" y="${t+38}" width="3" height="8" fill="#555" stroke="#222" stroke-width="0.5" />
          <rect x="${e+41}" y="${t+38}" width="3" height="8" fill="#555" stroke="#222" stroke-width="0.5" />
          <!-- Twin tails -->
          <path d="M${e+18} ${t+36} L${e+16} ${t+46} L${e+20} ${t+44} Z" fill="${p}" stroke="#222" stroke-width="0.5" />
          <path d="M${e+32} ${t+36} L${e+34} ${t+46} L${e+30} ${t+44} Z" fill="${p}" stroke="#222" stroke-width="0.5" />
          <circle cx="${e+25}" cy="${t+6}" r="3" fill="${n}" stroke="${i}" stroke-width="1" />
          ${d?`<rect x="${e+36}" y="${t+6}" width="12" height="12" fill="#ff0000" opacity="0.7" /><text x="${e+42}" y="${t+15}" text-anchor="middle" font-size="8" fill="#fff">${r.cooldownTurns}</text>`:""}
          ${f?`<rect x="${e+5}" y="${t+5}" width="40" height="40" fill="#4466aa" opacity="0.4" rx="4" />`:""}
          ${s}
        </g>
      `}if(h==="scifi"){const p=o.primary,g=o.secondary;return`
        <g class="cursor-pointer" data-piece="${r.type}" data-team="${r.team}" data-col="${r.col}" data-row="${r.row}">
          <!-- Thruster trail -->
          <ellipse cx="${e+25}" cy="${t+46}" rx="8" ry="6" fill="${g}" opacity="0.5">
            <animate attributeName="ry" values="6;10;6" dur="0.3s" repeatCount="indefinite" />
          </ellipse>
          <!-- Sleek body -->
          <path d="M${e+17} ${t+40} Q${e+15} ${t+26} ${e+25} ${t+4} Q${e+35} ${t+26} ${e+33} ${t+40} Z" fill="${p}" stroke="${g}" stroke-width="1.5" />
          <!-- Cockpit -->
          <ellipse cx="${e+25}" cy="${t+18}" rx="5" ry="8" fill="#111" stroke="${g}" stroke-width="0.5" />
          <ellipse cx="${e+25}" cy="${t+16}" rx="3" ry="5" fill="${g}" opacity="0.4" />
          <!-- Energy wings -->
          <path d="M${e+17} ${t+28} L${e+2} ${t+36} L${e+6} ${t+42} L${e+19} ${t+36} Z" fill="${p}" stroke="${g}" stroke-width="1" />
          <path d="M${e+33} ${t+28} L${e+48} ${t+36} L${e+44} ${t+42} L${e+31} ${t+36} Z" fill="${p}" stroke="${g}" stroke-width="1" />
          <!-- Wing energy -->
          <line x1="${e+8}" y1="${t+36}" x2="${e+16}" y2="${t+32}" stroke="${g}" stroke-width="2">
            <animate attributeName="opacity" values="1;0.4;1" dur="0.5s" repeatCount="indefinite" />
          </line>
          <line x1="${e+42}" y1="${t+36}" x2="${e+34}" y2="${t+32}" stroke="${g}" stroke-width="2">
            <animate attributeName="opacity" values="0.4;1;0.4" dur="0.5s" repeatCount="indefinite" />
          </line>
          <!-- Plasma cannons -->
          <circle cx="${e+6}" cy="${t+40}" r="3" fill="${g}">
            <animate attributeName="r" values="3;4;3" dur="0.4s" repeatCount="indefinite" />
          </circle>
          <circle cx="${e+44}" cy="${t+40}" r="3" fill="${g}">
            <animate attributeName="r" values="3;4;3" dur="0.4s" repeatCount="indefinite" />
          </circle>
          <circle cx="${e+25}" cy="${t+6}" r="3" fill="${n}" stroke="${i}" stroke-width="1" />
          ${d?`<circle cx="${e+40}" cy="${t+10}" r="6" fill="${g}" opacity="0.8" /><text x="${e+40}" y="${t+13}" text-anchor="middle" font-size="8" fill="#000">${r.cooldownTurns}</text>`:""}
          ${f?`<ellipse cx="${e+25}" cy="${t+26}" rx="18" ry="22" fill="${g}" opacity="0.3" />`:""}
          ${s}
        </g>
      `}return`
      <g class="cursor-pointer" data-piece="${r.type}" data-team="${r.team}" data-col="${r.col}" data-row="${r.row}">
        <!-- Shadow -->
        <ellipse cx="${e+25}" cy="${t+46}" rx="18" ry="4" fill="rgba(0,0,0,0.3)" />
        <!-- Fuselage (body) -->
        <ellipse cx="${e+25}" cy="${t+28}" rx="8" ry="18" fill="${c}" stroke="${l}" stroke-width="1" />
        <!-- Nose cone -->
        <path d="M${e+20} ${t+10} L${e+25} ${t+2} L${e+30} ${t+10} Z" fill="${c}" stroke="${l}" stroke-width="1" />
        <!-- Cockpit -->
        <ellipse cx="${e+25}" cy="${t+16}" rx="5" ry="6" fill="${u}" stroke="#5a9ab8" stroke-width="1" opacity="0.9" />
        <ellipse cx="${e+25}" cy="${t+14}" rx="3" ry="3" fill="white" opacity="0.3" />
        <!-- Wings -->
        <path d="M${e+17} ${t+26} L${e+3} ${t+34} L${e+5} ${t+38} L${e+17} ${t+32} Z" fill="${c}" stroke="${l}" stroke-width="1" />
        <path d="M${e+33} ${t+26} L${e+47} ${t+34} L${e+45} ${t+38} L${e+33} ${t+32} Z" fill="${c}" stroke="${l}" stroke-width="1" />
        <!-- Wing missiles -->
        <ellipse cx="${e+8}" cy="${t+36}" rx="2" ry="5" fill="#ef4444" stroke="#b91c1c" stroke-width="0.5" />
        <ellipse cx="${e+42}" cy="${t+36}" rx="2" ry="5" fill="#ef4444" stroke="#b91c1c" stroke-width="0.5" />
        <!-- Tail fins -->
        <path d="M${e+22} ${t+42} L${e+18} ${t+48} L${e+22} ${t+46} Z" fill="${c}" stroke="${l}" stroke-width="0.5" />
        <path d="M${e+28} ${t+42} L${e+32} ${t+48} L${e+28} ${t+46} Z" fill="${c}" stroke="${l}" stroke-width="0.5" />
        <!-- Vertical stabilizer -->
        <path d="M${e+23} ${t+38} L${e+25} ${t+32} L${e+27} ${t+38} Z" fill="${l}" />
        <!-- Engine exhaust -->
        <ellipse cx="${e+25}" cy="${t+46}" rx="4" ry="2" fill="#2d2d2d" />
        <!-- Team indicator -->
        <circle cx="${e+25}" cy="${t+6}" r="3" fill="${n}" stroke="${i}" stroke-width="1" />
        <!-- Cooldown indicator -->
        ${d?`
          <circle cx="${e+40}" cy="${t+10}" r="6" fill="#ef4444" opacity="0.8" />
          <text x="${e+40}" y="${t+13}" text-anchor="middle" font-size="8" fill="white">${r.cooldownTurns}</text>
        `:""}
        ${f?`
          <!-- Frozen indicator -->
          <rect x="${e+5}" y="${t+5}" width="40" height="40" fill="#60a5fa" opacity="0.3" rx="4" />
          <text x="${e+25}" y="${t+28}" text-anchor="middle" font-size="16" fill="#3b82f6">❄</text>
        `:""}
        ${s}
      </g>
    `}if(r.type==="hacker"){const o=xt(r.team),c=o.uniformDark,l=o.uniformDark,u=o.primary,f=r.frozenTurns&&r.frozenTurns>0;return`
      <g class="cursor-pointer" data-piece="${r.type}" data-team="${r.team}" data-col="${r.col}" data-row="${r.row}">
        <!-- Shadow -->
        <ellipse cx="${e+25}" cy="${t+46}" rx="16" ry="4" fill="rgba(0,0,0,0.3)" />
        <!-- Desk -->
        <rect x="${e+8}" y="${t+36}" width="34" height="8" rx="1" fill="#4a3728" stroke="#2d1f14" stroke-width="1" />
        <!-- Chair back -->
        <rect x="${e+14}" y="${t+24}" width="22" height="14" rx="2" fill="#2d2d2d" stroke="#1a1a1a" stroke-width="1" />
        <!-- Monitor -->
        <rect x="${e+18}" y="${t+26}" width="14" height="10" rx="1" fill="#1a1a1a" stroke="#333" stroke-width="1" />
        <!-- Screen -->
        <rect x="${e+19}" y="${t+27}" width="12" height="8" fill="${c}" />
        <!-- Code on screen -->
        <line x1="${e+20}" y1="${t+29}" x2="${e+26}" y2="${t+29}" stroke="${u}" stroke-width="1" opacity="0.8" />
        <line x1="${e+20}" y1="${t+31}" x2="${e+29}" y2="${t+31}" stroke="${u}" stroke-width="1" opacity="0.6" />
        <line x1="${e+20}" y1="${t+33}" x2="${e+24}" y2="${t+33}" stroke="${u}" stroke-width="1" opacity="0.7" />
        <!-- Monitor stand -->
        <rect x="${e+23}" y="${t+36}" width="4" height="2" fill="#333" />
        <!-- Keyboard -->
        <rect x="${e+10}" y="${t+38}" width="12" height="4" rx="1" fill="#333" />
        <rect x="${e+11}" y="${t+39}" width="10" height="2" fill="#4a4a4a" />
        <!-- Person body (hoodie) -->
        <ellipse cx="${e+25}" cy="${t+20}" rx="8" ry="6" fill="${c}" stroke="${l}" stroke-width="1" />
        <!-- Hood -->
        <path d="M${e+17} ${t+22} Q${e+25} ${t+10} ${e+33} ${t+22}" fill="${c}" stroke="${l}" stroke-width="1" />
        <!-- Face (shadowed) -->
        <ellipse cx="${e+25}" cy="${t+18}" rx="5" ry="4" fill="#2d2d2d" />
        <!-- Glasses/eyes glow -->
        <rect x="${e+21}" y="${t+16}" width="3" height="2" fill="${u}" opacity="0.8" />
        <rect x="${e+26}" y="${t+16}" width="3" height="2" fill="${u}" opacity="0.8" />
        <!-- Arms on keyboard -->
        <ellipse cx="${e+16}" cy="${t+34}" rx="3" ry="2" fill="${c}" />
        <ellipse cx="${e+34}" cy="${t+34}" rx="3" ry="2" fill="${c}" />
        <!-- Team indicator -->
        <circle cx="${e+25}" cy="${t+6}" r="3" fill="${n}" stroke="${i}" stroke-width="1" />
        <!-- Cooldown indicator -->
        ${r.cooldownTurns&&r.cooldownTurns>0?`
          <circle cx="${e+40}" cy="${t+10}" r="6" fill="#ef4444" opacity="0.8" />
          <text x="${e+40}" y="${t+13}" text-anchor="middle" font-size="8" fill="white">${r.cooldownTurns}</text>
        `:""}
        ${f?`
          <!-- Frozen indicator -->
          <rect x="${e+5}" y="${t+5}" width="40" height="40" fill="#60a5fa" opacity="0.3" rx="4" />
          <text x="${e+25}" y="${t+28}" text-anchor="middle" font-size="16" fill="#3b82f6">❄</text>
        `:""}
        ${s}
      </g>
    `}if(r.type==="builder"){const o=xt(r.team),c=o.primary,l=o.secondary,u="#e8c39e",f="#d4a574",d=r.frozenTurns&&r.frozenTurns>0;return`
      <g class="cursor-pointer" data-piece="${r.type}" data-team="${r.team}" data-col="${r.col}" data-row="${r.row}">
        <!-- Shadow -->
        <ellipse cx="${e+25}" cy="${t+47}" rx="16" ry="4" fill="rgba(0,0,0,0.3)" />

        <!-- Boots -->
        <ellipse cx="${e+19}" cy="${t+45}" rx="5" ry="3" fill="#4a3728" stroke="#2d1f14" stroke-width="1" />
        <ellipse cx="${e+31}" cy="${t+45}" rx="5" ry="3" fill="#4a3728" stroke="#2d1f14" stroke-width="1" />

        <!-- Legs (jeans) -->
        <rect x="${e+16}" y="${t+34}" width="7" height="12" rx="1" fill="#1e40af" stroke="#1e3a8a" stroke-width="0.5" />
        <rect x="${e+27}" y="${t+34}" width="7" height="12" rx="1" fill="#1e40af" stroke="#1e3a8a" stroke-width="0.5" />

        <!-- Torso (safety vest) -->
        <rect x="${e+14}" y="${t+20}" width="22" height="16" rx="2" fill="${c}" stroke="${l}" stroke-width="1" />
        <!-- Reflective stripes -->
        <rect x="${e+14}" y="${t+24}" width="22" height="2" fill="#fef9c3" opacity="0.9" />
        <rect x="${e+14}" y="${t+30}" width="22" height="2" fill="#fef9c3" opacity="0.9" />
        <!-- Vest opening (shirt underneath) -->
        <rect x="${e+22}" y="${t+20}" width="6" height="8" fill="#374151" />

        <!-- Arms -->
        <rect x="${e+8}" y="${t+22}" width="6" height="12" rx="2" fill="${c}" stroke="${l}" stroke-width="0.5" />
        <rect x="${e+36}" y="${t+22}" width="6" height="12" rx="2" fill="${c}" stroke="${l}" stroke-width="0.5" />
        <!-- Hands -->
        <ellipse cx="${e+11}" cy="${t+36}" rx="3" ry="2.5" fill="${u}" stroke="${f}" stroke-width="0.5" />
        <ellipse cx="${e+39}" cy="${t+36}" rx="3" ry="2.5" fill="${u}" stroke="${f}" stroke-width="0.5" />

        <!-- Neck -->
        <rect x="${e+22}" y="${t+14}" width="6" height="6" fill="${u}" />

        <!-- Head -->
        <ellipse cx="${e+25}" cy="${t+12}" rx="7" ry="6" fill="${u}" stroke="${f}" stroke-width="0.5" />

        <!-- Hard hat -->
        <ellipse cx="${e+25}" cy="${t+8}" rx="9" ry="4" fill="#fcd34d" stroke="#f59e0b" stroke-width="1" />
        <rect x="${e+16}" y="${t+6}" width="18" height="4" rx="1" fill="#fcd34d" stroke="#f59e0b" stroke-width="1" />
        <!-- Hard hat brim -->
        <rect x="${e+14}" y="${t+10}" width="22" height="2" fill="#f59e0b" />

        <!-- Face -->
        <circle cx="${e+22}" cy="${t+12}" r="1" fill="#1a1a1a" />
        <circle cx="${e+28}" cy="${t+12}" r="1" fill="#1a1a1a" />
        <path d="M${e+23} ${t+15} Q${e+25} ${t+16} ${e+27} ${t+15}" fill="none" stroke="#1a1a1a" stroke-width="0.8" />

        <!-- Tool belt -->
        <rect x="${e+13}" y="${t+34}" width="24" height="3" fill="#5c4033" stroke="#3d2817" stroke-width="0.5" />
        <rect x="${e+15}" y="${t+33}" width="4" height="5" fill="#6b7280" rx="1" />
        <rect x="${e+31}" y="${t+33}" width="4" height="5" fill="#6b7280" rx="1" />

        <!-- Hammer in hand -->
        <rect x="${e+38}" y="${t+28}" width="2" height="10" fill="#8b4513" stroke="#5c3d1e" stroke-width="0.5" />
        <rect x="${e+36}" y="${t+26}" width="6" height="4" rx="1" fill="#6b7280" stroke="#4b5563" stroke-width="0.5" />

        <!-- Team indicator -->
        <circle cx="${e+25}" cy="${t+2}" r="3" fill="${n}" stroke="${i}" stroke-width="1" />

        ${d?`
          <rect x="${e+5}" y="${t+5}" width="40" height="40" fill="#60a5fa" opacity="0.3" rx="4" />
          <text x="${e+25}" y="${t+28}" text-anchor="middle" font-size="16" fill="#3b82f6">❄</text>
        `:""}
        ${s}
      </g>
    `}if(r.type==="barricade"){const o=xt(r.team),c=o.helmet,l=o.uniform;return`
      <g class="cursor-pointer" data-piece="${r.type}" data-team="${r.team}" data-col="${r.col}" data-row="${r.row}">
        <!-- Shadow -->
        <ellipse cx="${e+25}" cy="${t+46}" rx="18" ry="3" fill="rgba(0,0,0,0.3)" />
        <!-- Vertical posts -->
        <rect x="${e+8}" y="${t+15}" width="6" height="30" fill="${c}" stroke="${l}" stroke-width="1" />
        <rect x="${e+36}" y="${t+15}" width="6" height="30" fill="${c}" stroke="${l}" stroke-width="1" />
        <!-- Horizontal planks -->
        <rect x="${e+6}" y="${t+18}" width="38" height="6" rx="1" fill="${c}" stroke="${l}" stroke-width="1" />
        <rect x="${e+6}" y="${t+28}" width="38" height="6" rx="1" fill="${c}" stroke="${l}" stroke-width="1" />
        <rect x="${e+6}" y="${t+38}" width="38" height="6" rx="1" fill="${c}" stroke="${l}" stroke-width="1" />
        <!-- Wood grain -->
        <line x1="${e+10}" y1="${t+20}" x2="${e+40}" y2="${t+20}" stroke="${l}" stroke-width="0.5" opacity="0.5" />
        <line x1="${e+10}" y1="${t+30}" x2="${e+40}" y2="${t+30}" stroke="${l}" stroke-width="0.5" opacity="0.5" />
        <line x1="${e+10}" y1="${t+40}" x2="${e+40}" y2="${t+40}" stroke="${l}" stroke-width="0.5" opacity="0.5" />
        <!-- Team indicator -->
        <circle cx="${e+25}" cy="${t+8}" r="3" fill="${n}" stroke="${i}" stroke-width="1" />
        ${s}
      </g>
    `}if(r.type==="artillery"){const o=xt(r.team),c=o.helmet,l=o.uniform;return`
      <g class="cursor-pointer" data-piece="${r.type}" data-team="${r.team}" data-col="${r.col}" data-row="${r.row}">
        <!-- Shadow -->
        <ellipse cx="${e+25}" cy="${t+46}" rx="16" ry="4" fill="rgba(0,0,0,0.3)" />
        <!-- Base/platform -->
        <rect x="${e+8}" y="${t+38}" width="34" height="8" rx="2" fill="${c}" stroke="${l}" stroke-width="1" />
        <!-- Wheels -->
        <circle cx="${e+14}" cy="${t+44}" r="5" fill="#4a4a4a" stroke="#2d2d2d" stroke-width="1" />
        <circle cx="${e+36}" cy="${t+44}" r="5" fill="#4a4a4a" stroke="#2d2d2d" stroke-width="1" />
        <circle cx="${e+14}" cy="${t+44}" r="2" fill="#2d2d2d" />
        <circle cx="${e+36}" cy="${t+44}" r="2" fill="#2d2d2d" />
        <!-- Cannon base -->
        <rect x="${e+18}" y="${t+28}" width="14" height="12" rx="2" fill="${c}" stroke="${l}" stroke-width="1" />
        <!-- Cannon barrel -->
        <rect x="${e+20}" y="${t+8}" width="10" height="24" rx="2" fill="${c}" stroke="${l}" stroke-width="1.5" />
        <ellipse cx="${e+25}" cy="${t+8}" rx="6" ry="3" fill="${l}" />
        <!-- Muzzle -->
        <ellipse cx="${e+25}" cy="${t+6}" rx="4" ry="2" fill="#1a1a1a" />
        <!-- Team indicator -->
        <circle cx="${e+40}" cy="${t+10}" r="3" fill="${n}" stroke="${i}" stroke-width="1" />
        ${s}
      </g>
    `}if(r.type==="spike"){const o="#6b7280",c="#4b5563";return`
      <g class="cursor-pointer" data-piece="${r.type}" data-team="${r.team}" data-col="${r.col}" data-row="${r.row}">
        <!-- Base -->
        <rect x="${e+8}" y="${t+38}" width="34" height="8" rx="1" fill="#4b5563" stroke="#374151" stroke-width="1" />
        <!-- Spikes -->
        <polygon points="${e+12},${t+38} ${e+15},${t+18} ${e+18},${t+38}" fill="${o}" stroke="${c}" stroke-width="1" />
        <polygon points="${e+20},${t+38} ${e+23},${t+14} ${e+26},${t+38}" fill="${o}" stroke="${c}" stroke-width="1" />
        <polygon points="${e+28},${t+38} ${e+31},${t+18} ${e+34},${t+38}" fill="${o}" stroke="${c}" stroke-width="1" />
        <!-- Sharp tips -->
        <circle cx="${e+15}" cy="${t+16}" r="2" fill="#ef4444" />
        <circle cx="${e+23}" cy="${t+12}" r="2" fill="#ef4444" />
        <circle cx="${e+31}" cy="${t+16}" r="2" fill="#ef4444" />
        <!-- Team indicator -->
        <circle cx="${e+25}" cy="${t+6}" r="3" fill="${n}" stroke="${i}" stroke-width="1" />
        <!-- Timer -->
        ${r.turnsRemaining?`
          <circle cx="${e+40}" cy="${t+10}" r="6" fill="#6b7280" opacity="0.8" />
          <text x="${e+40}" y="${t+13}" text-anchor="middle" font-size="8" fill="white">${r.turnsRemaining}</text>
        `:""}
        ${s}
      </g>
    `}return""}function HT(){const r=er;return r==="theme_sunset"?{background:`
        <div class="absolute inset-0 pointer-events-none overflow-hidden rounded-xl" style="z-index: -1;">
          <div class="absolute inset-0" style="background: linear-gradient(180deg, #ff6b35 0%, #f7931e 30%, #ffcc02 60%, #87ceeb 100%);"></div>
          <div class="absolute" style="bottom: 20%; left: 50%; transform: translateX(-50%); width: 80px; height: 80px; background: radial-gradient(circle, #fff700 0%, #ff6b00 50%, transparent 70%); border-radius: 50%; box-shadow: 0 0 60px 30px rgba(255,150,0,0.5);"></div>
          <div class="absolute bottom-0 left-0 right-0 h-16" style="background: linear-gradient(180deg, transparent, rgba(0,0,0,0.3));"></div>
        </div>`,left:`
        <div class="hidden lg:flex flex-col justify-end h-full pb-8 pr-4" style="width: 60px;">
          <svg width="50" height="120" viewBox="0 0 50 120">
            <!-- Palm tree silhouette -->
            <rect x="22" y="50" width="6" height="70" fill="#1a1a1a"/>
            <ellipse cx="25" cy="45" rx="20" ry="15" fill="#1a1a1a"/>
            <path d="M25 30 Q10 40 5 55 Q20 45 25 35" fill="#1a1a1a"/>
            <path d="M25 30 Q40 40 45 55 Q30 45 25 35" fill="#1a1a1a"/>
            <path d="M25 32 Q15 50 8 70 Q22 50 25 38" fill="#1a1a1a"/>
            <path d="M25 32 Q35 50 42 70 Q28 50 25 38" fill="#1a1a1a"/>
          </svg>
        </div>`,right:`
        <div class="hidden lg:flex flex-col justify-center h-full pl-4" style="width: 60px;">
          <svg width="50" height="100" viewBox="0 0 50 100">
            <!-- Birds flying -->
            <path d="M10 20 Q15 15 20 20 Q25 15 30 20" stroke="#1a1a1a" stroke-width="2" fill="none"/>
            <path d="M25 35 Q30 30 35 35 Q40 30 45 35" stroke="#1a1a1a" stroke-width="2" fill="none"/>
            <path d="M5 50 Q10 45 15 50 Q20 45 25 50" stroke="#1a1a1a" stroke-width="1.5" fill="none"/>
          </svg>
        </div>`}:r==="theme_forest"?{background:`
        <div class="absolute inset-0 pointer-events-none overflow-hidden rounded-xl" style="z-index: -1;">
          <div class="absolute inset-0" style="background: linear-gradient(180deg, #1a472a 0%, #2d5a3a 50%, #1e3d2a 100%);"></div>
          <div class="absolute inset-0" style="background: radial-gradient(ellipse at 30% 20%, rgba(144,238,144,0.2) 0%, transparent 50%);"></div>
        </div>`,left:`
        <div class="hidden lg:flex flex-col justify-between h-full py-4 pr-2" style="width: 70px;">
          <svg width="60" height="200" viewBox="0 0 60 200">
            <!-- Swaying tree 1 -->
            <g style="transform-origin: 30px 180px; animation: sway 4s ease-in-out infinite;">
              <rect x="27" y="120" width="6" height="80" fill="#4a3728"/>
              <path d="M30 40 L10 120 L50 120 Z" fill="#228b22"/>
              <path d="M30 20 L15 80 L45 80 Z" fill="#2e8b2e"/>
              <path d="M30 5 L20 50 L40 50 Z" fill="#32cd32"/>
            </g>
            <!-- Mushroom -->
            <ellipse cx="15" cy="185" rx="8" ry="5" fill="#ff6b6b"/>
            <rect x="13" y="185" width="4" height="10" fill="#f5f5dc"/>
            <circle cx="12" cy="183" r="2" fill="#fff"/>
            <circle cx="18" cy="182" r="1.5" fill="#fff"/>
          </svg>
          <style>@keyframes sway { 0%, 100% { transform: rotate(-2deg); } 50% { transform: rotate(2deg); } }</style>
        </div>`,right:`
        <div class="hidden lg:flex flex-col justify-between h-full py-4 pl-2" style="width: 70px;">
          <svg width="60" height="200" viewBox="0 0 60 200">
            <!-- Swaying tree 2 -->
            <g style="transform-origin: 30px 180px; animation: sway 3.5s ease-in-out infinite 0.5s;">
              <rect x="27" y="130" width="6" height="70" fill="#3d2817"/>
              <path d="M30 50 L12 130 L48 130 Z" fill="#006400"/>
              <path d="M30 30 L18 90 L42 90 Z" fill="#228b22"/>
              <path d="M30 15 L22 60 L38 60 Z" fill="#32cd32"/>
            </g>
            <!-- Fairy lights -->
            <circle cx="20" cy="60" r="3" fill="#ffff00" opacity="0.8"><animate attributeName="opacity" values="0.8;0.3;0.8" dur="2s" repeatCount="indefinite"/></circle>
            <circle cx="40" cy="90" r="2" fill="#00ff00" opacity="0.6"><animate attributeName="opacity" values="0.6;0.2;0.6" dur="1.5s" repeatCount="indefinite"/></circle>
            <circle cx="25" cy="110" r="2.5" fill="#ff69b4" opacity="0.7"><animate attributeName="opacity" values="0.7;0.3;0.7" dur="1.8s" repeatCount="indefinite"/></circle>
          </svg>
        </div>`}:r==="theme_desert"?{background:`
        <div class="absolute inset-0 pointer-events-none overflow-hidden rounded-xl" style="z-index: -1;">
          <div class="absolute inset-0" style="background: linear-gradient(180deg, #87ceeb 0%, #f4a460 40%, #d4a574 100%);"></div>
          <div class="absolute bottom-0 left-0 right-0 h-32" style="background: linear-gradient(180deg, transparent, #c2a878);"></div>
        </div>`,left:`
        <div class="hidden lg:flex flex-col justify-end h-full pb-4 pr-2" style="width: 60px;">
          <svg width="50" height="150" viewBox="0 0 50 150">
            <!-- Cactus -->
            <rect x="20" y="50" width="10" height="80" rx="5" fill="#228b22"/>
            <rect x="5" y="70" width="20" height="8" rx="4" fill="#228b22"/>
            <rect x="5" y="60" width="8" height="18" rx="4" fill="#228b22"/>
            <rect x="30" y="80" width="15" height="8" rx="4" fill="#228b22"/>
            <rect x="37" y="70" width="8" height="18" rx="4" fill="#228b22"/>
            <!-- Sand dune -->
            <ellipse cx="25" cy="145" rx="30" ry="10" fill="#d4a574"/>
          </svg>
        </div>`,right:`
        <div class="hidden lg:flex flex-col justify-end h-full pb-4 pl-2" style="width: 60px;">
          <svg width="50" height="150" viewBox="0 0 50 150">
            <!-- Small cactus -->
            <rect x="18" y="90" width="8" height="40" rx="4" fill="#2e8b2e"/>
            <rect x="10" y="100" width="12" height="6" rx="3" fill="#2e8b2e"/>
            <rect x="10" y="95" width="6" height="12" rx="3" fill="#2e8b2e"/>
            <!-- Tumbleweed -->
            <circle cx="35" cy="130" r="10" fill="none" stroke="#8b7355" stroke-width="1.5" stroke-dasharray="3,2"/>
            <circle cx="35" cy="130" r="6" fill="none" stroke="#8b7355" stroke-width="1"/>
          </svg>
        </div>`}:r==="theme_arctic"?{background:`
        <div class="absolute inset-0 pointer-events-none overflow-hidden rounded-xl" style="z-index: -1;">
          <div class="absolute inset-0" style="background: linear-gradient(180deg, #87ceeb 0%, #e0f4ff 50%, #ffffff 100%);"></div>
          <div class="absolute inset-0 snowfall"></div>
        </div>
        <style>
          .snowfall { background-image:
            radial-gradient(circle, #fff 1px, transparent 1px),
            radial-gradient(circle, #fff 1px, transparent 1px),
            radial-gradient(circle, rgba(255,255,255,0.5) 2px, transparent 2px);
            background-size: 50px 50px, 30px 30px, 70px 70px;
            background-position: 0 0, 25px 25px, 15px 35px;
            animation: snow 8s linear infinite;
          }
          @keyframes snow { from { background-position: 0 0, 25px 25px, 15px 35px; } to { background-position: 0 100px, 25px 125px, 15px 135px; } }
        </style>`,left:`
        <div class="hidden lg:flex flex-col justify-center h-full pr-2" style="width: 60px;">
          <svg width="50" height="150" viewBox="0 0 50 150">
            <!-- Snowman -->
            <circle cx="25" cy="120" r="20" fill="#fff" stroke="#ddd" stroke-width="1"/>
            <circle cx="25" cy="85" r="15" fill="#fff" stroke="#ddd" stroke-width="1"/>
            <circle cx="25" cy="58" r="12" fill="#fff" stroke="#ddd" stroke-width="1"/>
            <!-- Face -->
            <circle cx="21" cy="55" r="2" fill="#000"/>
            <circle cx="29" cy="55" r="2" fill="#000"/>
            <path d="M25 58 L28 63 L22 63 Z" fill="#ff6600"/>
            <!-- Hat -->
            <rect x="15" y="42" width="20" height="4" fill="#000"/>
            <rect x="18" y="30" width="14" height="14" fill="#000"/>
          </svg>
        </div>`,right:`
        <div class="hidden lg:flex flex-col justify-center h-full pl-2" style="width: 60px;">
          <svg width="50" height="150" viewBox="0 0 50 150">
            <!-- Ice crystals -->
            <g transform="translate(25, 50)">
              <line x1="0" y1="-20" x2="0" y2="20" stroke="#a0d8ef" stroke-width="2"/>
              <line x1="-17" y1="-10" x2="17" y2="10" stroke="#a0d8ef" stroke-width="2"/>
              <line x1="-17" y1="10" x2="17" y2="-10" stroke="#a0d8ef" stroke-width="2"/>
              <circle cx="0" cy="-20" r="3" fill="#e0f4ff"/>
              <circle cx="0" cy="20" r="3" fill="#e0f4ff"/>
              <circle cx="-17" cy="-10" r="3" fill="#e0f4ff"/>
              <circle cx="17" cy="10" r="3" fill="#e0f4ff"/>
            </g>
            <!-- Penguin -->
            <ellipse cx="25" cy="120" rx="12" ry="18" fill="#000"/>
            <ellipse cx="25" cy="120" rx="8" ry="14" fill="#fff"/>
            <circle cx="25" cy="105" r="10" fill="#000"/>
            <circle cx="22" cy="103" r="2" fill="#fff"/>
            <circle cx="28" cy="103" r="2" fill="#fff"/>
            <circle cx="22" cy="103" r="1" fill="#000"/>
            <circle cx="28" cy="103" r="1" fill="#000"/>
            <path d="M25 106 L27 110 L23 110 Z" fill="#ff6600"/>
          </svg>
        </div>`}:r==="theme_jungle"?{background:`
        <div class="absolute inset-0 pointer-events-none overflow-hidden rounded-xl" style="z-index: -1;">
          <div class="absolute inset-0" style="background: linear-gradient(180deg, #1a3d1a 0%, #2d5a2d 50%, #1e4d1e 100%);"></div>
          <div class="absolute inset-0" style="background: radial-gradient(ellipse at 70% 30%, rgba(100,200,100,0.15) 0%, transparent 40%);"></div>
        </div>`,left:`
        <div class="hidden lg:flex flex-col h-full pr-2" style="width: 60px;">
          <svg width="50" height="250" viewBox="0 0 50 250">
            <!-- Hanging vines -->
            <path d="M10 0 Q5 50 15 100 Q25 150 10 200" stroke="#228b22" stroke-width="3" fill="none"/>
            <path d="M30 0 Q40 40 25 80 Q15 120 30 160" stroke="#2e8b2e" stroke-width="2" fill="none"/>
            <!-- Leaves on vines -->
            <ellipse cx="12" cy="60" rx="8" ry="4" fill="#32cd32" transform="rotate(-20 12 60)"/>
            <ellipse cx="18" cy="110" rx="7" ry="3" fill="#228b22" transform="rotate(15 18 110)"/>
            <ellipse cx="8" cy="160" rx="8" ry="4" fill="#2e8b2e" transform="rotate(-10 8 160)"/>
            <!-- Exotic flower -->
            <circle cx="35" cy="200" r="8" fill="#ff1493"/>
            <circle cx="35" cy="200" r="4" fill="#ffff00"/>
          </svg>
        </div>`,right:`
        <div class="hidden lg:flex flex-col h-full pl-2" style="width: 60px;">
          <svg width="50" height="250" viewBox="0 0 50 250">
            <!-- More vines -->
            <path d="M40 0 Q45 60 30 120 Q20 180 40 240" stroke="#228b22" stroke-width="3" fill="none"/>
            <!-- Parrot -->
            <ellipse cx="25" cy="80" rx="10" ry="15" fill="#ff0000"/>
            <circle cx="25" cy="65" r="8" fill="#ff0000"/>
            <path d="M18 65 L12 68 L18 70 Z" fill="#ffcc00"/>
            <circle cx="22" cy="63" r="2" fill="#000"/>
            <!-- Banana -->
            <path d="M30 150 Q45 160 40 180 Q35 190 25 185" stroke="#ffcc00" stroke-width="6" fill="none"/>
          </svg>
        </div>`}:r==="theme_night"?{background:`
        <div class="absolute inset-0 pointer-events-none overflow-hidden rounded-xl" style="z-index: -1;">
          <div class="absolute inset-0" style="background: linear-gradient(180deg, #0a0a1a 0%, #1a1a3a 50%, #2a2a4a 100%);"></div>
          <div class="absolute inset-0 stars"></div>
        </div>
        <style>
          .stars { background-image:
            radial-gradient(circle, #fff 1px, transparent 1px),
            radial-gradient(circle, #fff 0.5px, transparent 0.5px),
            radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px);
            background-size: 80px 80px, 40px 40px, 60px 60px;
            background-position: 0 0, 20px 30px, 40px 10px;
            animation: twinkle 3s ease-in-out infinite;
          }
          @keyframes twinkle { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
        </style>`,left:`
        <div class="hidden lg:flex flex-col justify-start h-full py-4 pr-2" style="width: 60px;">
          <svg width="50" height="150" viewBox="0 0 50 150">
            <!-- Moon -->
            <circle cx="30" cy="40" r="20" fill="#f5f5dc" />
            <circle cx="38" cy="35" r="18" fill="#0a0a1a" />
            <!-- Moon craters -->
            <circle cx="22" cy="38" r="3" fill="#d4d4a0" opacity="0.5" />
            <circle cx="28" cy="48" r="2" fill="#d4d4a0" opacity="0.4" />
            <!-- Owl silhouette -->
            <ellipse cx="25" cy="110" rx="10" ry="12" fill="#1a1a1a" />
            <ellipse cx="25" cy="100" rx="8" ry="8" fill="#1a1a1a" />
            <circle cx="22" cy="98" r="3" fill="#ff0" opacity="0.8" />
            <circle cx="28" cy="98" r="3" fill="#ff0" opacity="0.8" />
            <circle cx="22" cy="98" r="1.5" fill="#000" />
            <circle cx="28" cy="98" r="1.5" fill="#000" />
            <!-- Ears -->
            <path d="M18 92 L20 86 L22 92" fill="#1a1a1a" />
            <path d="M28 92 L30 86 L32 92" fill="#1a1a1a" />
          </svg>
        </div>`,right:`
        <div class="hidden lg:flex flex-col justify-center h-full pl-2" style="width: 60px;">
          <svg width="50" height="150" viewBox="0 0 50 150">
            <!-- Stars constellation -->
            <circle cx="15" cy="30" r="2" fill="#fff"><animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" /></circle>
            <circle cx="35" cy="45" r="1.5" fill="#fff"><animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" repeatCount="indefinite" /></circle>
            <circle cx="20" cy="60" r="2" fill="#fff"><animate attributeName="opacity" values="0.6;1;0.6" dur="2.5s" repeatCount="indefinite" /></circle>
            <circle cx="40" cy="80" r="1" fill="#fff" />
            <circle cx="10" cy="100" r="1.5" fill="#fff"><animate attributeName="opacity" values="1;0.5;1" dur="1.8s" repeatCount="indefinite" /></circle>
            <!-- Night vision goggles silhouette -->
            <rect x="15" y="120" width="20" height="15" rx="3" fill="#1a3a1a" />
            <circle cx="20" cy="127" r="4" fill="#00ff00" opacity="0.6"><animate attributeName="opacity" values="0.6;0.3;0.6" dur="1s" repeatCount="indefinite" /></circle>
            <circle cx="30" cy="127" r="4" fill="#00ff00" opacity="0.6"><animate attributeName="opacity" values="0.3;0.6;0.3" dur="1s" repeatCount="indefinite" /></circle>
          </svg>
        </div>`}:r==="theme_ocean"?{background:`
        <div class="absolute inset-0 pointer-events-none overflow-hidden rounded-xl" style="z-index: -1;">
          <div class="absolute inset-0" style="background: linear-gradient(180deg, #87ceeb 0%, #4a90b8 30%, #1e5080 70%, #0a2040 100%);"></div>
          <div class="absolute bottom-0 left-0 right-0 h-32 waves"></div>
        </div>
        <style>
          .waves { background: linear-gradient(180deg, transparent 0%, rgba(30,80,128,0.5) 50%, rgba(10,32,64,0.8) 100%); }
        </style>`,left:`
        <div class="hidden lg:flex flex-col justify-end h-full pb-8 pr-2" style="width: 70px;">
          <svg width="60" height="180" viewBox="0 0 60 180">
            <!-- Lighthouse -->
            <rect x="22" y="60" width="16" height="100" fill="#fff" stroke="#cc0000" stroke-width="0" />
            <rect x="22" y="80" width="16" height="10" fill="#cc0000" />
            <rect x="22" y="110" width="16" height="10" fill="#cc0000" />
            <rect x="22" y="140" width="16" height="10" fill="#cc0000" />
            <!-- Lighthouse top -->
            <rect x="20" y="50" width="20" height="12" fill="#333" />
            <rect x="24" y="54" width="12" height="6" fill="#ff0">
              <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
            </rect>
            <path d="M20 50 L30 40 L40 50 Z" fill="#333" />
            <!-- Waves at base -->
            <path d="M5 165 Q15 160 25 165 Q35 170 45 165 Q55 160 60 165" stroke="#4a90b8" stroke-width="3" fill="none"><animate attributeName="d" values="M5 165 Q15 160 25 165 Q35 170 45 165 Q55 160 60 165;M5 165 Q15 170 25 165 Q35 160 45 165 Q55 170 60 165;M5 165 Q15 160 25 165 Q35 170 45 165 Q55 160 60 165" dur="2s" repeatCount="indefinite" /></path>
          </svg>
        </div>`,right:`
        <div class="hidden lg:flex flex-col justify-between h-full py-4 pl-2" style="width: 70px;">
          <svg width="60" height="200" viewBox="0 0 60 200">
            <!-- Seagulls -->
            <path d="M10 30 Q15 25 20 30 Q25 25 30 30" stroke="#fff" stroke-width="2" fill="none" />
            <path d="M25 45 Q30 40 35 45 Q40 40 45 45" stroke="#fff" stroke-width="1.5" fill="none" />
            <!-- Fish -->
            <ellipse cx="30" cy="120" rx="12" ry="6" fill="#ff6b35">
              <animate attributeName="cx" values="30;40;30" dur="3s" repeatCount="indefinite" />
            </ellipse>
            <path d="M42 120 L50 114 L50 126 Z" fill="#ff6b35">
              <animate attributeName="d" values="M42 120 L50 114 L50 126 Z;M52 120 L60 114 L60 126 Z;M42 120 L50 114 L50 126 Z" dur="3s" repeatCount="indefinite" />
            </path>
            <!-- Bubbles -->
            <circle cx="20" cy="150" r="3" fill="#fff" opacity="0.5"><animate attributeName="cy" values="150;130;150" dur="2s" repeatCount="indefinite" /><animate attributeName="opacity" values="0.5;0;0.5" dur="2s" repeatCount="indefinite" /></circle>
            <circle cx="35" cy="160" r="2" fill="#fff" opacity="0.4"><animate attributeName="cy" values="160;140;160" dur="1.5s" repeatCount="indefinite" /></circle>
            <!-- Anchor -->
            <path d="M30 175 L30 195 M20 195 L40 195 M25 190 Q30 195 35 190" stroke="#444" stroke-width="3" fill="none" />
            <circle cx="30" cy="172" r="4" fill="none" stroke="#444" stroke-width="2" />
          </svg>
        </div>`}:r==="theme_lava"?{background:`
        <div class="absolute inset-0 pointer-events-none overflow-hidden rounded-xl" style="z-index: -1;">
          <div class="absolute inset-0" style="background: linear-gradient(180deg, #2a1a0a 0%, #4a2a1a 40%, #8b3a1a 70%, #ff4500 100%);"></div>
          <div class="absolute bottom-0 left-0 right-0 h-20" style="background: linear-gradient(180deg, transparent, rgba(255,69,0,0.5));"></div>
        </div>`,left:`
        <div class="hidden lg:flex flex-col justify-end h-full pb-4 pr-2" style="width: 70px;">
          <svg width="60" height="180" viewBox="0 0 60 180">
            <!-- Volcano -->
            <path d="M10 180 L25 80 L35 80 L50 180 Z" fill="#3a2a1a" stroke="#2a1a0a" stroke-width="1" />
            <!-- Lava crater -->
            <ellipse cx="30" cy="80" rx="10" ry="5" fill="#ff4500" />
            <ellipse cx="30" cy="80" rx="6" ry="3" fill="#ff6600">
              <animate attributeName="ry" values="3;4;3" dur="0.5s" repeatCount="indefinite" />
            </ellipse>
            <!-- Lava eruption -->
            <ellipse cx="30" cy="70" rx="4" ry="6" fill="#ff6600" opacity="0.8">
              <animate attributeName="cy" values="70;60;70" dur="1s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.8;0.4;0.8" dur="1s" repeatCount="indefinite" />
            </ellipse>
            <ellipse cx="25" cy="65" rx="2" ry="4" fill="#ff8800" opacity="0.6">
              <animate attributeName="cy" values="65;55;65" dur="0.8s" repeatCount="indefinite" />
            </ellipse>
            <!-- Smoke -->
            <ellipse cx="30" cy="50" rx="8" ry="6" fill="#555" opacity="0.5">
              <animate attributeName="cy" values="50;40;50" dur="2s" repeatCount="indefinite" />
            </ellipse>
            <ellipse cx="35" cy="40" rx="6" ry="4" fill="#666" opacity="0.4">
              <animate attributeName="cy" values="40;30;40" dur="2.5s" repeatCount="indefinite" />
            </ellipse>
            <!-- Lava rocks -->
            <ellipse cx="15" cy="170" rx="8" ry="5" fill="#2a1a0a" />
            <ellipse cx="45" cy="175" rx="6" ry="4" fill="#3a2a1a" />
          </svg>
        </div>`,right:`
        <div class="hidden lg:flex flex-col justify-end h-full pb-4 pl-2" style="width: 60px;">
          <svg width="50" height="150" viewBox="0 0 50 150">
            <!-- Lava pool -->
            <ellipse cx="25" cy="130" rx="20" ry="10" fill="#ff4500">
              <animate attributeName="rx" values="20;22;20" dur="1s" repeatCount="indefinite" />
            </ellipse>
            <ellipse cx="25" cy="130" rx="12" ry="6" fill="#ff6600" />
            <!-- Lava bubbles -->
            <circle cx="20" cy="128" r="3" fill="#ff8800">
              <animate attributeName="r" values="3;4;3" dur="0.5s" repeatCount="indefinite" />
            </circle>
            <circle cx="30" cy="132" r="2" fill="#ff8800">
              <animate attributeName="r" values="2;3;2" dur="0.4s" repeatCount="indefinite" />
            </circle>
            <!-- Fire spirit -->
            <path d="M25 80 Q20 90 25 100 Q30 90 25 80" fill="#ff6600">
              <animate attributeName="d" values="M25 80 Q20 90 25 100 Q30 90 25 80;M25 75 Q18 88 25 105 Q32 88 25 75;M25 80 Q20 90 25 100 Q30 90 25 80" dur="0.6s" repeatCount="indefinite" />
            </path>
            <circle cx="22" cy="88" r="2" fill="#ff0" />
            <circle cx="28" cy="88" r="2" fill="#ff0" />
          </svg>
        </div>`}:r==="theme_space"?{background:`
        <div class="absolute inset-0 pointer-events-none overflow-hidden rounded-xl" style="z-index: -1;">
          <div class="absolute inset-0" style="background: linear-gradient(180deg, #000010 0%, #0a0a2a 50%, #1a1a4a 100%);"></div>
          <div class="absolute inset-0 space-stars"></div>
        </div>
        <style>
          .space-stars { background-image:
            radial-gradient(circle, #fff 1px, transparent 1px),
            radial-gradient(circle, #88f 0.5px, transparent 0.5px),
            radial-gradient(circle, #ff8 1px, transparent 1px);
            background-size: 100px 100px, 60px 60px, 80px 80px;
            background-position: 0 0, 30px 40px, 50px 20px;
          }
        </style>`,left:`
        <div class="hidden lg:flex flex-col justify-center h-full pr-2" style="width: 70px;">
          <svg width="60" height="180" viewBox="0 0 60 180">
            <!-- Planet with rings (Saturn-like) -->
            <ellipse cx="30" cy="60" rx="35" ry="8" fill="none" stroke="#d4a574" stroke-width="3" transform="rotate(-20 30 60)" />
            <circle cx="30" cy="60" r="18" fill="#e8c39e" />
            <ellipse cx="30" cy="60" rx="18" ry="4" fill="#d4a574" opacity="0.5" />
            <ellipse cx="30" cy="55" rx="15" ry="3" fill="#c9a464" opacity="0.3" />
            <!-- Rocket -->
            <rect x="22" y="110" width="16" height="40" rx="4" fill="#ccc" stroke="#999" stroke-width="1" />
            <path d="M22 110 L30 95 L38 110 Z" fill="#ff4444" stroke="#cc0000" stroke-width="1" />
            <rect x="24" y="115" width="12" height="8" fill="#88ccff" />
            <rect x="18" y="140" width="6" height="12" fill="#ff4444" />
            <rect x="36" y="140" width="6" height="12" fill="#ff4444" />
            <!-- Rocket flame -->
            <ellipse cx="30" cy="155" rx="4" ry="8" fill="#ff6600">
              <animate attributeName="ry" values="8;12;8" dur="0.2s" repeatCount="indefinite" />
            </ellipse>
            <ellipse cx="30" cy="155" rx="2" ry="5" fill="#ff0" />
          </svg>
        </div>`,right:`
        <div class="hidden lg:flex flex-col justify-between h-full py-8 pl-2" style="width: 60px;">
          <svg width="50" height="160" viewBox="0 0 50 160">
            <!-- Earth-like planet -->
            <circle cx="25" cy="40" r="15" fill="#4488cc" />
            <ellipse cx="20" cy="35" rx="6" ry="4" fill="#22aa44" />
            <ellipse cx="30" cy="42" rx="5" ry="3" fill="#22aa44" />
            <ellipse cx="22" cy="48" rx="4" ry="2" fill="#fff" opacity="0.6" />
            <!-- UFO -->
            <ellipse cx="25" cy="100" rx="18" ry="6" fill="#888" stroke="#666" stroke-width="1" />
            <ellipse cx="25" cy="95" rx="10" ry="8" fill="#aaa" stroke="#888" stroke-width="1" />
            <ellipse cx="25" cy="92" rx="6" ry="4" fill="#88ffff" opacity="0.8" />
            <!-- UFO lights -->
            <circle cx="12" cy="100" r="2" fill="#00ff00"><animate attributeName="opacity" values="1;0.3;1" dur="0.5s" repeatCount="indefinite" /></circle>
            <circle cx="25" cy="102" r="2" fill="#ff0000"><animate attributeName="opacity" values="0.3;1;0.3" dur="0.5s" repeatCount="indefinite" /></circle>
            <circle cx="38" cy="100" r="2" fill="#0000ff"><animate attributeName="opacity" values="1;0.3;1" dur="0.5s" repeatCount="indefinite" /></circle>
            <!-- Shooting star -->
            <line x1="40" y1="130" x2="10" y2="150" stroke="#fff" stroke-width="2" opacity="0.8">
              <animate attributeName="opacity" values="0.8;0;0.8" dur="3s" repeatCount="indefinite" />
            </line>
          </svg>
        </div>`}:r==="theme_candy"?{background:`
        <div class="absolute inset-0 pointer-events-none overflow-hidden rounded-xl" style="z-index: -1;">
          <div class="absolute inset-0" style="background: linear-gradient(180deg, #ffccee 0%, #ffaadd 30%, #ff88cc 60%, #ff66bb 100%);"></div>
          <div class="absolute bottom-0 left-0 right-0 h-16" style="background: linear-gradient(180deg, transparent, rgba(255,255,255,0.3));"></div>
        </div>`,left:`
        <div class="hidden lg:flex flex-col justify-between h-full py-4 pr-2" style="width: 70px;">
          <svg width="60" height="200" viewBox="0 0 60 200">
            <!-- Candy cane -->
            <path d="M30 40 L30 140 Q30 160 15 160" stroke="#ff0000" stroke-width="10" fill="none" />
            <path d="M30 40 L30 140 Q30 160 15 160" stroke="#fff" stroke-width="10" fill="none" stroke-dasharray="10,10" />
            <!-- Lollipop -->
            <circle cx="30" cy="25" r="18" fill="#ff66aa" stroke="#ff3388" stroke-width="2" />
            <path d="M30 10 Q40 15 38 25 Q40 35 30 40 Q20 35 22 25 Q20 15 30 10" fill="#ff88cc" opacity="0.6" />
            <!-- Cotton candy -->
            <ellipse cx="45" cy="180" rx="12" ry="15" fill="#88ccff" opacity="0.8" />
            <ellipse cx="40" cy="175" rx="8" ry="10" fill="#aaddff" opacity="0.7" />
            <rect x="43" y="190" width="4" height="15" fill="#ddd" />
          </svg>
        </div>`,right:`
        <div class="hidden lg:flex flex-col justify-between h-full py-4 pl-2" style="width: 70px;">
          <svg width="60" height="200" viewBox="0 0 60 200">
            <!-- Gummy bear -->
            <ellipse cx="30" cy="50" rx="15" ry="18" fill="#ff4444" />
            <circle cx="30" cy="35" r="10" fill="#ff4444" />
            <ellipse cx="22" cy="32" rx="3" ry="4" fill="#ff4444" />
            <ellipse cx="38" cy="32" rx="3" ry="4" fill="#ff4444" />
            <circle cx="26" cy="34" r="2" fill="#000" />
            <circle cx="34" cy="34" r="2" fill="#000" />
            <ellipse cx="30" cy="40" rx="3" ry="2" fill="#ff6666" />
            <ellipse cx="22" cy="55" rx="5" ry="8" fill="#ff4444" />
            <ellipse cx="38" cy="55" rx="5" ry="8" fill="#ff4444" />
            <!-- Donut -->
            <circle cx="30" cy="120" r="18" fill="#d4a574" stroke="#8b6914" stroke-width="2" />
            <circle cx="30" cy="120" r="7" fill="#ffccee" />
            <ellipse cx="25" cy="115" rx="4" ry="2" fill="#ff66aa" />
            <ellipse cx="35" cy="118" rx="3" ry="2" fill="#66ff66" />
            <ellipse cx="28" cy="125" rx="3" ry="2" fill="#6666ff" />
            <ellipse cx="36" cy="112" rx="2" ry="1.5" fill="#ffff66" />
            <!-- Cupcake -->
            <path d="M15 180 L20 160 L40 160 L45 180 Z" fill="#d4a574" stroke="#8b6914" stroke-width="1" />
            <ellipse cx="30" cy="155" rx="14" ry="10" fill="#ff88cc" />
            <ellipse cx="30" cy="150" rx="10" ry="6" fill="#ffaadd" />
            <circle cx="30" cy="145" r="4" fill="#ff0000" />
          </svg>
        </div>`}:{left:"",right:"",background:""}}function Ai(){const r=He*J,e=He*J,t=r+Mt,n=e+Mt;let i=`<svg width="${t}" height="${n}" viewBox="0 0 ${t} ${n}" class="max-h-[50vh] sm:max-h-[60vh] lg:max-h-[80vh] w-auto touch-manipulation">`;const s=(p,g)=>p===5&&g!==5,o=(p,g)=>p===5&&g===5,c=(p,g)=>{const w=X[g],b=He-p;return w==="E"&&b>=4&&b<=5||w==="G"&&b>=4&&b<=5||w==="E"&&b>=7&&b<=8||w==="G"&&b>=7&&b<=8},l=(p,g)=>{const w=X[g],b=He-p;return["A","B","C"].includes(w)&&b>=3&&b<=4||["I","J","K"].includes(w)&&b>=3&&b<=4||["A","B","C"].includes(w)&&b>=8&&b<=9||["I","J","K"].includes(w)&&b>=8&&b<=9},u=(p,g)=>{const w=X[g],b=He-p;return w==="C"&&(b===5||b===7)||w==="I"&&(b===5||b===7)},f=(p,g)=>{const w=X[g],b=He-p;return w==="A"&&(b===1||b===2)||w==="K"&&(b===1||b===2)||w==="A"&&(b===10||b===11)||w==="K"&&(b===10||b===11)},d=(p,g)=>{const w=X[g],b=He-p;return w==="E"&&(b===4||b===8)||w==="G"&&(b===4||b===8)},h=(p,g)=>{const w=X[g],b=He-p;return w==="F"&&(b===3||b===9)};for(let p=0;p<He;p++)for(let g=0;g<He;g++){const w=Mt+g*J,b=p*J,P=(p+g)%2===0;let z;if(s(p,g))z="#4a90d9";else if(o(p,g))z="#8b7355";else if(c(p,g))z="#6b7280";else if(l(p,g))z="#f59e0b";else if(u(p,g))z="#ffffff";else{const S=P4();z=P?S.light:S.dark}if(i+=`<rect
        x="${w}"
        y="${b}"
        width="${J}"
        height="${J}"
        fill="${z}"
        data-row="${He-p}"
        data-col="${X[g]}"
        class="cursor-pointer hover:brightness-110 transition-all"
      />`,s(p,g)&&(i+=`<path
          d="M${w+3} ${b+12} q8 -4 16 0 q8 4 16 0"
          stroke="#6bb3e8"
          stroke-width="2"
          fill="none"
          class="pointer-events-none"
        />`,i+=`<path
          d="M${w+8} ${b+25} q10 -5 20 0 q10 5 15 0"
          stroke="#7ec8f0"
          stroke-width="1.5"
          fill="none"
          class="pointer-events-none"
        />`,i+=`<path
          d="M${w+2} ${b+38} q12 -4 24 0 q12 4 18 0"
          stroke="#6bb3e8"
          stroke-width="2"
          fill="none"
          class="pointer-events-none"
        />`),o(p,g)){i+=`<rect
          x="${w}"
          y="${b}"
          width="${J}"
          height="${J}"
          fill="#4a90d9"
          class="pointer-events-none"
        />`,i+=`<path
          d="M${w+3} ${b+15} q8 -4 16 0 q8 4 16 0"
          stroke="#6bb3e8"
          stroke-width="1.5"
          fill="none"
          class="pointer-events-none"
        />`,i+=`<path
          d="M${w+5} ${b+35} q10 -4 20 0 q10 4 15 0"
          stroke="#7ec8f0"
          stroke-width="1.5"
          fill="none"
          class="pointer-events-none"
        />`;for(let S=0;S<5;S++)i+=`<rect
            x="${w+5}"
            y="${b+5+S*10}"
            width="40"
            height="6"
            fill="#a08060"
            stroke="#6b5344"
            stroke-width="1"
            class="pointer-events-none"
          />`}if(l(p,g)&&(i+=`<path
          d="M${w+10} ${b+40} q5 -15 0 -20 q-5 -5 5 -10 q3 5 8 0 q5 5 0 10 q-5 5 0 20"
          stroke="#1a1a1a"
          stroke-width="2"
          fill="none"
          class="pointer-events-none"
        />`,i+=`<path
          d="M${w+30} ${b+42} q3 -10 -2 -15 q-4 -8 4 -12 q4 4 8 2 q6 6 2 12 q-3 8 -4 15"
          stroke="#1a1a1a"
          stroke-width="2"
          fill="none"
          class="pointer-events-none"
        />`,i+=`<circle cx="${w+12}" cy="${b+15}" r="4" fill="#2d2d2d" class="pointer-events-none" />`,i+=`<circle cx="${w+38}" cy="${b+18}" r="3" fill="#2d2d2d" class="pointer-events-none" />`,i+=`<circle cx="${w+25}" cy="${b+12}" r="5" fill="#1a1a1a" class="pointer-events-none" />`),u(p,g)){const S=w+J/2,R=b+J/2;i+=`<circle cx="${S}" cy="${R}" r="20" fill="none" stroke="#333" stroke-width="2" class="pointer-events-none" />`,i+=`<text
          x="${S}"
          y="${R+6}"
          text-anchor="middle"
          font-size="20"
          font-weight="bold"
          fill="#333"
          class="pointer-events-none select-none"
        >H</text>`}if(f(p,g)){i+=`<line x1="${w+15}" y1="${b}" x2="${w+15}" y2="${b+J}" stroke="#4a4a4a" stroke-width="3" class="pointer-events-none" />`,i+=`<line x1="${w+35}" y1="${b}" x2="${w+35}" y2="${b+J}" stroke="#4a4a4a" stroke-width="3" class="pointer-events-none" />`;for(let S=0;S<5;S++){const R=b+5+S*10;i+=`<rect x="${w+10}" y="${R}" width="30" height="4" fill="#8b5a2b" class="pointer-events-none" />`}}if(d(p,g)){const S=w+J/2,R=b+J/2;i+=`<ellipse cx="${S}" cy="${R}" rx="18" ry="14" fill="#1a1a1a" class="pointer-events-none" />`,i+=`<ellipse cx="${S}" cy="${R-2}" rx="16" ry="11" fill="#2d2d2d" class="pointer-events-none" />`,i+=`<ellipse cx="${S}" cy="${R-4}" rx="12" ry="7" fill="#0a0a0a" class="pointer-events-none" />`,i+=`<ellipse cx="${S}" cy="${R}" rx="20" ry="16" fill="none" stroke="#6b6b6b" stroke-width="3" class="pointer-events-none" />`,i+=`<ellipse cx="${S}" cy="${R}" rx="22" ry="18" fill="none" stroke="#4a4a4a" stroke-width="2" class="pointer-events-none" />`}h(p,g)&&(i+=`<rect x="${w+5}" y="${b+15}" width="40" height="20" fill="#5c4033" class="pointer-events-none" />`,i+=`<rect x="${w+7}" y="${b+17}" width="36" height="16" fill="#3d2817" class="pointer-events-none" />`,i+=`<ellipse cx="${w+12}" cy="${b+14}" rx="6" ry="4" fill="#c2a878" stroke="#8b7355" stroke-width="1" class="pointer-events-none" />`,i+=`<ellipse cx="${w+25}" cy="${b+13}" rx="6" ry="4" fill="#c2a878" stroke="#8b7355" stroke-width="1" class="pointer-events-none" />`,i+=`<ellipse cx="${w+38}" cy="${b+14}" rx="6" ry="4" fill="#c2a878" stroke="#8b7355" stroke-width="1" class="pointer-events-none" />`,i+=`<ellipse cx="${w+12}" cy="${b+36}" rx="6" ry="4" fill="#c2a878" stroke="#8b7355" stroke-width="1" class="pointer-events-none" />`,i+=`<ellipse cx="${w+25}" cy="${b+37}" rx="6" ry="4" fill="#c2a878" stroke="#8b7355" stroke-width="1" class="pointer-events-none" />`,i+=`<ellipse cx="${w+38}" cy="${b+36}" rx="6" ry="4" fill="#c2a878" stroke="#8b7355" stroke-width="1" class="pointer-events-none" />`);const G=X[g],j=He-p,te=hd(G,j),O=te.find(S=>S.type==="barricade"),k=te.find(S=>S.type!=="barricade");if(k)if(zt&&zt.train===k&&zt.phase==="moving"){const S=zt.progress||0,R=X.indexOf(zt.targetCol),Q=Mt+R*J,q=(He-zt.targetRow)*J,ce=w+(Q-w)*S,Ie=b+(q-b)*S,We=S>.8?Math.sin(S*50)*3:0;i+=Ns(zs(k,ce+We,Ie),ce+We,Ie,k.team)}else pt&&pt.piece===k||lt&&lt.fighter===k||(D===k&&(i+=`<rect x="${w+2}" y="${b+2}" width="${J-4}" height="${J-4}" fill="none" stroke="#3b82f6" stroke-width="3" rx="4" class="pointer-events-none" />`),O?i+=Ns(zs(k,w,b-8),w,b-8,k.team):i+=Ns(zs(k,w,b),w,b,k.team));if(O&&(D===O&&(i+=`<rect x="${w+2}" y="${b+2}" width="${J-4}" height="${J-4}" fill="none" stroke="#3b82f6" stroke-width="3" rx="4" class="pointer-events-none" />`),i+=Ns(zs(O,w,b+10),w,b+10,O.team)),pt&&pt.fromCol===G&&pt.fromRow===j){const S=pt.progress,R=X.indexOf(pt.toCol),Q=Mt+R*J,q=(He-pt.toRow)*J,ce=1-Math.pow(1-S,3),Ie=w+(Q-w)*ce,We=b+(q-b)*ce,ot=S>.8?Math.sin((S-.8)*25)*2*(1-S):0;i+=Ns(zs(pt.piece,Ie,We+ot),Ie,We+ot,pt.piece.team)}if(ue.some(S=>S.col===G&&S.row===j)){const S=ue.find(ce=>ce.col===G&&ce.row===j),R=w+J/2,Q=b+J/2,q=S.canCapture?"#ef4444":"#3b82f6";i+=`<g class="pointer-events-none">
          <line x1="${R-10}" y1="${Q-10}" x2="${R+10}" y2="${Q+10}" stroke="${q}" stroke-width="4" stroke-linecap="round" />
          <line x1="${R+10}" y1="${Q-10}" x2="${R-10}" y2="${Q+10}" stroke="${q}" stroke-width="4" stroke-linecap="round" />
        </g>`}if(ut.some(S=>S.col===G&&S.row===j)){const S=w+J/2,R=b+J/2;i+=`<g class="pointer-events-none">
          <circle cx="${S}" cy="${R}" r="15" fill="none" stroke="#ef4444" stroke-width="3" />
          <circle cx="${S}" cy="${R}" r="5" fill="#ef4444" />
          <line x1="${S-20}" y1="${R}" x2="${S-8}" y2="${R}" stroke="#ef4444" stroke-width="3" />
          <line x1="${S+8}" y1="${R}" x2="${S+20}" y2="${R}" stroke="#ef4444" stroke-width="3" />
          <line x1="${S}" y1="${R-20}" x2="${S}" y2="${R-8}" stroke="#ef4444" stroke-width="3" />
          <line x1="${S}" y1="${R+8}" x2="${S}" y2="${R+20}" stroke="#ef4444" stroke-width="3" />
        </g>`}if(ii.some(S=>S.col===G&&S.row===j)){const S=w+J/2,R=b+J/2;i+=`<g class="pointer-events-none">
          <rect x="${w+5}" y="${b+5}" width="${J-10}" height="${J-10}" fill="#ef4444" opacity="0.3" rx="4" />
          <circle cx="${S}" cy="${R}" r="12" fill="none" stroke="#ef4444" stroke-width="2" stroke-dasharray="4,2" />
          <text x="${S}" y="${R+4}" text-anchor="middle" font-size="12" fill="#ef4444" font-weight="bold">💥</text>
        </g>`}if(br.some(S=>S.col===G&&S.row===j)){const S=w+J/2,R=b+J/2;i+=`<g class="pointer-events-none">
          <rect x="${w+3}" y="${b+3}" width="${J-6}" height="${J-6}" fill="#a855f7" opacity="0.3" rx="4" />
          <circle cx="${S}" cy="${R}" r="14" fill="none" stroke="#a855f7" stroke-width="2" stroke-dasharray="3,3" />
        </g>`}if(It&&It.col===G&&It.row===j&&(i+=`<g class="pointer-events-none">
          <rect x="${w+2}" y="${b+2}" width="${J-4}" height="${J-4}" fill="none" stroke="#a855f7" stroke-width="3" rx="4" />
        </g>`),vr.some(S=>S.col===G&&S.row===j)){const S=w+J/2,R=b+J/2;i+=`<g class="pointer-events-none">
          <rect x="${w+3}" y="${b+3}" width="${J-6}" height="${J-6}" fill="#f97316" opacity="0.3" rx="4" />
          <circle cx="${S}" cy="${R}" r="14" fill="none" stroke="#f97316" stroke-width="2" stroke-dasharray="3,3" />
          <text x="${S}" y="${R+4}" text-anchor="middle" font-size="14" fill="#f97316">💣</text>
        </g>`}if(nr&&nr.col===G&&nr.row===j&&(i+=`<g class="pointer-events-none">
          <rect x="${w+2}" y="${b+2}" width="${J-4}" height="${J-4}" fill="#f97316" opacity="0.4" stroke="#f97316" stroke-width="3" rx="4" />
        </g>`),Or.some(S=>S.col===G&&S.row===j)){const S=w+J/2,R=b+J/2;i+=`<g class="pointer-events-none">
          <rect x="${w+4}" y="${b+4}" width="${J-8}" height="${J-8}" fill="#22c55e" opacity="0.3" rx="4" />
          <circle cx="${S}" cy="${R}" r="10" fill="none" stroke="#22c55e" stroke-width="2" />
          <text x="${S}" y="${R+4}" text-anchor="middle" font-size="10" fill="#22c55e">✈</text>
        </g>`}if(ir.some(S=>S.col===G&&S.row===j)){const S=w+J/2,R=b+J/2,Q=Ke==="barricade"?"#8b4513":Ke==="artillery"?"#4a4a4a":"#ef4444",q=Ke==="barricade"?"🧱":Ke==="artillery"?"💥":"⚠";i+=`<g class="pointer-events-none">
          <rect x="${w+4}" y="${b+4}" width="${J-8}" height="${J-8}" fill="${Q}" opacity="0.3" rx="4" />
          <circle cx="${S}" cy="${R}" r="12" fill="none" stroke="${Q}" stroke-width="2" stroke-dasharray="4,2" />
          <text x="${S}" y="${R+5}" text-anchor="middle" font-size="14">${q}</text>
        </g>`}if(lr.some(S=>S.col===G&&S.row===j)){const S=w+J/2,R=b+J/2;i+=`<g class="pointer-events-none">
          <rect x="${w+4}" y="${b+4}" width="${J-8}" height="${J-8}" fill="#0ea5e9" opacity="0.3" rx="4" />
          <circle cx="${S}" cy="${R}" r="12" fill="none" stroke="#0ea5e9" stroke-width="2" stroke-dasharray="4,2" />
          <text x="${S}" y="${R+5}" text-anchor="middle" font-size="14">🚁</text>
        </g>`}if(k&&k.frozenTurns&&k.frozenTurns>0){const S=w+J/2;i+=`<g class="pointer-events-none">
          <rect x="${w+2}" y="${b+2}" width="${J-4}" height="${J-4}" fill="#60a5fa" opacity="0.4" rx="4" />
          <text x="${S}" y="${b+12}" text-anchor="middle" font-size="10" fill="#1e40af">❄${k.frozenTurns}</text>
        </g>`}if(Ue&&Ue.phase==="exploding"&&ud(Ue.targetCol,Ue.targetRow).some(Q=>Q.col===G&&Q.row===j)){const Q=w+J/2,q=b+J/2,ce=.5+Ue.progress*.5,Ie=1-Ue.progress*.7;i+=`<g class="pointer-events-none">
            <circle cx="${Q}" cy="${q}" r="${20*ce}" fill="#ef4444" opacity="${Ie*.8}" />
            <circle cx="${Q}" cy="${q}" r="${15*ce}" fill="#f97316" opacity="${Ie*.9}" />
            <circle cx="${Q}" cy="${q}" r="${8*ce}" fill="#fbbf24" opacity="${Ie}" />
          </g>`}if(ar&&ar.col===G&&ar.row===j){const S=w+J/2,R=b+J/2;i+=`<g class="pointer-events-none animate-explosion">
          <circle cx="${S}" cy="${R}" r="20" fill="#ef4444" opacity="0.8" />
          <circle cx="${S}" cy="${R}" r="15" fill="#f97316" opacity="0.9" />
          <circle cx="${S}" cy="${R}" r="8" fill="#fbbf24" />
          <!-- Explosion particles -->
          <circle cx="${S-12}" cy="${R-8}" r="4" fill="#ef4444" opacity="0.7" />
          <circle cx="${S+10}" cy="${R-10}" r="3" fill="#f97316" opacity="0.6" />
          <circle cx="${S+8}" cy="${R+12}" r="5" fill="#ef4444" opacity="0.7" />
          <circle cx="${S-10}" cy="${R+8}" r="3" fill="#fbbf24" opacity="0.8" />
          <!-- Smoke -->
          <circle cx="${S}" cy="${R-5}" r="8" fill="#6b7280" opacity="0.6" class="animate-smoke" />
          <circle cx="${S-8}" cy="${R}" r="6" fill="#4b5563" opacity="0.5" class="animate-smoke" />
          <circle cx="${S+8}" cy="${R+3}" r="7" fill="#6b7280" opacity="0.5" class="animate-smoke" />
        </g>`}}if(Ue){const p=Ue.rocket,g=X.indexOf(p.col),w=Mt+g*J,b=(He-p.row)*J,P=X.indexOf(Ue.targetCol),z=Mt+P*J,G=(He-Ue.targetRow)*J;if(Ue.phase==="launching"){const j=Ue.progress,te=b-j*200,O=1-j*.3;for(let k=0;k<5;k++){const x=te+40+k*15,_=(1-k*.15)*(1-j*.5);i+=`<circle cx="${w+25}" cy="${x}" r="${8-k}" fill="#f97316" opacity="${_}" class="pointer-events-none" />`,i+=`<circle cx="${w+25}" cy="${x+5}" r="${6-k}" fill="#fbbf24" opacity="${_*.8}" class="pointer-events-none" />`}i+=`<g class="pointer-events-none" transform="translate(${w}, ${te}) scale(${O})">
        <rect x="20" y="14" width="10" height="28" rx="3" fill="#5a5a5a" stroke="#3a3a3a" stroke-width="1" />
        <path d="M20 14 L25 4 L30 14 Z" fill="#ef4444" stroke="#b91c1c" stroke-width="1" />
        <ellipse cx="25" cy="42" rx="4" ry="2" fill="#f97316" />
      </g>`}else if(Ue.phase==="flying"){const j=Ue.progress,te=b-200,O=w+(z-w)*j,k=te+(G-te)*j;for(let x=0;x<3;x++){const _=O-(z-w)*.1*x,A=k-(G-te)*.1*x+30;i+=`<circle cx="${_+25}" cy="${A}" r="${6-x*2}" fill="#f97316" opacity="${.6-x*.15}" class="pointer-events-none" />`}i+=`<g class="pointer-events-none" transform="translate(${O}, ${k})">
        <rect x="22" y="10" width="6" height="20" rx="2" fill="#5a5a5a" />
        <path d="M22 30 L25 38 L28 30 Z" fill="#ef4444" />
      </g>`}}if(lt){const{fighter:p,startCol:g,startRow:w,targetCol:b,targetRow:P,landingCol:z,landingRow:G,phase:j,progress:te}=lt,O=X.indexOf(g),k=Mt+O*J,x=(He-w)*J,_=X.indexOf(b),A=Mt+_*J,I=(He-P)*J,L=X.indexOf(z),v=Mt+L*J,ee=(He-G)*J,C=p.team==="yellow"?"#fbbf24":"#22c55e",S=p.team==="yellow"?"#5a5a5a":"#4a5a4a";let R,Q;if(j==="flyToTarget"?(R=k+(A-k)*te,Q=x+(I-x)*te):j==="bombing"?(R=A,Q=I):(R=A+(v-A)*te,Q=I+(ee-I)*te),i+=`<g class="pointer-events-none" transform="translate(${R}, ${Q})">
      <!-- Fuselage -->
      <ellipse cx="25" cy="28" rx="8" ry="18" fill="${S}" stroke="#3a3a3a" stroke-width="1" />
      <!-- Nose -->
      <path d="M20 10 L25 2 L30 10 Z" fill="${S}" stroke="#3a3a3a" stroke-width="1" />
      <!-- Cockpit -->
      <ellipse cx="25" cy="16" rx="5" ry="6" fill="#87ceeb" stroke="#5a9ab8" stroke-width="1" opacity="0.9" />
      <!-- Wings -->
      <path d="M17 26 L3 34 L5 38 L17 32 Z" fill="${S}" stroke="#3a3a3a" stroke-width="1" />
      <path d="M33 26 L47 34 L45 38 L33 32 Z" fill="${S}" stroke="#3a3a3a" stroke-width="1" />
      <!-- Team indicator -->
      <circle cx="25" cy="6" r="3" fill="${C}" stroke="${p.team==="yellow"?"#b45309":"#15803d"}" stroke-width="1" />
    </g>`,j==="bombing"){const q=I+10+te*30,ce=1-te*.3;if(i+=`<g class="pointer-events-none">
        <ellipse cx="${A+25}" cy="${q}" rx="4" ry="6" fill="#1a1a1a" opacity="${ce}" />
        <path d="M${A+21} ${q-4} L${A+25} ${q-10} L${A+29} ${q-4}" fill="#ef4444" opacity="${ce}" />
      </g>`,te>.7){const Ie=(te-.7)/.3,We=A+25,ot=I+25;i+=`<g class="pointer-events-none">
          <circle cx="${We}" cy="${ot}" r="${15*Ie}" fill="#ef4444" opacity="${.8*(1-Ie*.5)}" />
          <circle cx="${We}" cy="${ot}" r="${10*Ie}" fill="#f97316" opacity="${.9*(1-Ie*.3)}" />
          <circle cx="${We}" cy="${ot}" r="${5*Ie}" fill="#fbbf24" opacity="1" />
        </g>`}}}for(let p=0;p<He;p++){const g=Mt+p*J+J/2,w=e+Mt/2+6;i+=`<text
      x="${g}"
      y="${w}"
      text-anchor="middle"
      class="fill-gray-300 text-sm font-semibold select-none"
    >${X[p]}</text>`}for(let p=0;p<He;p++){const g=Mt/2,w=p*J+J/2+5,b=He-p;i+=`<text
      x="${g}"
      y="${w}"
      text-anchor="middle"
      class="fill-gray-300 text-sm font-semibold select-none"
    >${b}</text>`}if(se){const p=cs(se.shooterCol,se.shooterRow),g=cs(se.targetCol,se.targetRow),w=Math.atan2(g.y-p.y,g.x-p.x);if(se.phase==="muzzleFlash"||se.phase==="bulletTravel"){const b=se.phase==="muzzleFlash"?15*(1-se.progress*.5):5,P=se.phase==="muzzleFlash"?1-se.progress:.3,z=p.x+Math.cos(w)*15,G=p.y+Math.sin(w)*15;if(i+=`<circle cx="${z}" cy="${G}" r="${b}" fill="#ffd700" opacity="${P}" class="pointer-events-none">
        <animate attributeName="r" values="${b};${b*1.5};${b}" dur="0.1s" repeatCount="1" />
      </circle>`,i+=`<circle cx="${z}" cy="${G}" r="${b*2}" fill="#ff8c00" opacity="${P*.5}" class="pointer-events-none" />`,se.phase==="muzzleFlash")for(let j=0;j<6;j++){const te=w+(Math.random()-.5)*.8,O=10+Math.random()*15*se.progress,k=p.x+Math.cos(te)*O,x=p.y+Math.sin(te)*O;i+=`<circle cx="${k}" cy="${x}" r="${2+Math.random()*2}" fill="#ffff00" opacity="${.8-se.progress*.6}" class="pointer-events-none" />`}}if((se.phase==="bulletTravel"||se.phase==="impact")&&(se.bulletTrailPoints.forEach((b,P)=>{const z=3+P/se.bulletTrailPoints.length*4;i+=`<circle cx="${b.x}" cy="${b.y}" r="${z}" fill="#ffcc00" opacity="${b.opacity*.8}" class="pointer-events-none" />`,i+=`<circle cx="${b.x}" cy="${b.y}" r="${z*1.5}" fill="#ff6600" opacity="${b.opacity*.3}" class="pointer-events-none" />`}),se.phase==="bulletTravel")){const b=p.x+(g.x-p.x)*se.progress,P=p.y+(g.y-p.y)*se.progress;i+=`<ellipse cx="${b}" cy="${P}" rx="6" ry="3" transform="rotate(${w*180/Math.PI} ${b} ${P})" fill="#ffd700" class="pointer-events-none" />`,i+=`<ellipse cx="${b}" cy="${P}" rx="10" ry="5" transform="rotate(${w*180/Math.PI} ${b} ${P})" fill="#ff8800" opacity="0.5" class="pointer-events-none" />`}if((se.phase==="impact"||se.phase==="smoke")&&(se.sparks.forEach(b=>{const P=b.life>.5?"#ffff00":"#ff6600";i+=`<circle cx="${b.x}" cy="${b.y}" r="${2+b.life*3}" fill="${P}" opacity="${b.life}" class="pointer-events-none" />`}),se.phase==="impact")){const b=20*(1-se.progress);i+=`<circle cx="${g.x}" cy="${g.y}" r="${b}" fill="#ffffff" opacity="${.8-se.progress*.8}" class="pointer-events-none" />`,i+=`<circle cx="${g.x}" cy="${g.y}" r="${b*1.5}" fill="#ff4400" opacity="${.5-se.progress*.5}" class="pointer-events-none" />`}(se.phase==="smoke"||se.phase==="impact")&&se.smokeParticles.forEach(b=>{i+=`<circle cx="${b.x}" cy="${b.y}" r="${b.size}" fill="#555555" opacity="${b.opacity}" class="pointer-events-none" />`,i+=`<circle cx="${b.x+3}" cy="${b.y-2}" r="${b.size*.7}" fill="#666666" opacity="${b.opacity*.7}" class="pointer-events-none" />`})}return ro.forEach(p=>{i+=`<g transform="translate(${p.x}, ${p.y}) rotate(${p.rotation})" opacity="${p.life}">
      <ellipse cx="0" cy="0" rx="4" ry="2" fill="#c9a227" class="pointer-events-none" />
      <ellipse cx="0" cy="0" rx="3" ry="1.5" fill="#e6c84a" class="pointer-events-none" />
    </g>`}),i+=A4(),i+=I4(t,n),i+="</svg>",i}function jT(){const r=Sr("yellow"),e=Sr("green"),t=Fe.filter(i=>i.team==="green"),n=Fe.filter(i=>i.team==="yellow");return`
    <div class="bg-gray-800 rounded-lg p-3 sm:p-4 w-full lg:w-64 flex flex-col gap-3 sm:gap-4">
      <h2 class="text-gray-200 font-bold text-base sm:text-lg border-b border-gray-700 pb-2">${E("score")}</h2>

      <!-- Yellow Team -->
      <div class="flex flex-col gap-2">
        <div class="flex items-center justify-between">
          <span class="text-yellow-400 font-bold text-sm sm:text-base">${E("yellowTeam")}</span>
          <span class="text-yellow-400 font-bold text-lg sm:text-xl">${r}</span>
        </div>
        <div class="flex flex-wrap gap-1 min-h-[24px]">
          ${t.map(i=>`
            <div class="w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded border border-green-700 flex items-center justify-center text-xs" title="${i.type} (${i.points}pts)">
              ${i.type==="train"?"💥":i.type==="soldier"?"🩹":i.type==="tank"?"💣":i.type==="ship"?"⚓":i.type==="carrier"?"🛫":i.type==="helicopter"?"🚁":i.type==="rocket"?"🚀":i.type==="machinegun"?"🔫":i.type==="suv"?"🚙":i.type==="hacker"?"💻":"?"}
            </div>
          `).join("")}
          ${t.length===0?'<span class="text-gray-500 text-xs sm:text-sm italic">-</span>':""}
        </div>
      </div>

      <!-- Green Team -->
      <div class="flex flex-col gap-2">
        <div class="flex items-center justify-between">
          <span class="text-green-400 font-bold text-sm sm:text-base">${E("greenTeam")}</span>
          <span class="text-green-400 font-bold text-lg sm:text-xl">${e}</span>
        </div>
        <div class="flex flex-wrap gap-1 min-h-[24px]">
          ${n.map(i=>`
            <div class="w-5 h-5 sm:w-6 sm:h-6 bg-yellow-400 rounded border border-yellow-600 flex items-center justify-center text-xs" title="${i.type} (${i.points}pts)">
              ${i.type==="train"?"💥":i.type==="soldier"?"🩹":i.type==="tank"?"💣":i.type==="ship"?"⚓":i.type==="carrier"?"🛫":i.type==="helicopter"?"🚁":i.type==="rocket"?"🚀":i.type==="machinegun"?"🔫":i.type==="suv"?"🚙":i.type==="hacker"?"💻":"?"}
            </div>
          `).join("")}
          ${n.length===0?'<span class="text-gray-500 text-xs sm:text-sm italic">-</span>':""}
        </div>
      </div>

      <!-- Turns Remaining -->
      <div class="border-t border-gray-700 pt-2 mt-1">
        <div class="flex items-center justify-between text-xs sm:text-sm">
          <span class="text-gray-400">Turns</span>
          <span class="text-gray-300">${Math.max($e,me)} / ${Ka}</span>
        </div>
        <div class="w-full bg-gray-700 rounded-full h-2 mt-1">
          <div class="bg-blue-500 h-2 rounded-full transition-all" style="width: ${Math.min(100,Math.max($e,me)/Ka*100)}%"></div>
        </div>
      </div>
    </div>
  `}function WT(){return`
    <div class="bg-gray-800 rounded-lg p-3 sm:p-4 w-full lg:w-64 flex-1 flex flex-col min-h-0 max-h-40 lg:max-h-none">
      <h2 class="text-gray-200 font-bold text-base sm:text-lg mb-2 sm:mb-3 border-b border-gray-700 pb-2">${E("moveButton")}s</h2>
      <div id="move-list" class="flex-1 overflow-y-auto space-y-1 text-xs sm:text-sm font-mono min-h-0">
        ${Le.length===0?'<p class="text-gray-500 italic text-xs sm:text-sm">No moves yet</p>':Le.map((r,e)=>{const t=r.team==="yellow"?"text-yellow-400":r.team==="green"?"text-green-400":"text-gray-300",n=r.piece==="train"?"🚂":r.piece==="soldier"?"🎖️":r.piece==="tank"?"🛡️":r.piece==="ship"?"🚢":r.piece==="carrier"?"🛫":r.piece==="helicopter"?"🚁":r.piece==="rocket"?"🚀":r.piece==="machinegun"?"🔫":r.piece==="suv"?"🚙":r.piece==="hacker"?"💻":"";return`
              <div class="${t} flex flex-col">
                <div class="flex">
                  <span class="text-gray-500 w-6 sm:w-8">${e+1}.</span>
                  <span>${r.piece} ${n} ${r.from}→${r.to}</span>
                </div>
                ${r.captured==="trapped"?'<span class="text-red-400 text-xs ml-6 sm:ml-8">☠ trapped</span>':r.captured?`<span class="text-red-400 text-xs ml-6 sm:ml-8">✕ ${r.captured}</span>`:""}
              </div>
            `}).join("")}
      </div>
    </div>
  `}function QT(){return!Ne||!Ae?"":`
    <div class="bg-gray-800 rounded-lg p-3 sm:p-4 w-full lg:w-64 flex flex-col ${ni?"h-64":"h-auto"}">
      <div class="flex items-center justify-between mb-2 border-b border-gray-700 pb-2">
        <h2 class="text-gray-200 font-bold text-base sm:text-lg flex items-center gap-2">
          💬 Chat
          ${Xn.length>0?`<span class="bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full">${Xn.length}</span>`:""}
        </h2>
        <button id="toggle-chat" class="text-gray-400 hover:text-white text-sm px-2 py-1 rounded bg-gray-700 hover:bg-gray-600">
          ${ni?"▼ Hide":"▲ Show"}
        </button>
      </div>
      ${ni?`
        <div id="chat-messages" class="flex-1 overflow-y-auto space-y-1 text-xs mb-2 min-h-0 max-h-32">
          ${Xn.length===0?'<p class="text-gray-500 italic">No messages yet</p>':Xn.map(r=>{const e=r.team==="yellow"?"text-yellow-400":"text-green-400",t=r.fromPlayerId===Xt()?.uid;return`
                  <div class="flex flex-col ${t?"items-end":"items-start"}">
                    <span class="${e} text-xs font-bold">${r.fromUsername}</span>
                    <span class="bg-gray-700 px-2 py-1 rounded ${t?"bg-${teamColor}-900":""}">${r.message}</span>
                  </div>
                `}).join("")}
        </div>
        <div class="flex flex-col gap-1">
          <div class="flex gap-1 flex-wrap">
            ${Hg.slice(0,4).map(r=>`
              <button class="quick-chat-btn bg-gray-700 hover:bg-gray-600 text-white text-xs px-2 py-1 rounded" data-msg="${r.id}">
                ${r.text.split("!")[0]}
              </button>
            `).join("")}
          </div>
          <div class="flex gap-1">
            <input type="text" id="chat-input" class="flex-1 bg-gray-700 text-white text-sm px-2 py-1 rounded border border-gray-600 focus:border-blue-500 focus:outline-none" placeholder="Type message..." maxlength="100" value="${xa}">
            <button id="send-chat" class="bg-blue-600 hover:bg-blue-500 text-white text-xs px-3 py-1 rounded">
              Send
            </button>
          </div>
        </div>
      `:""}
    </div>
  `}function M(){const r=document.querySelector("#app");r.classList.toggle("large-ui",Ei),r.classList.toggle("high-contrast",_i);const e=_e==="yellow"?"text-yellow-400 border-yellow-400":"text-green-400 border-green-400";if(Ce==="gameOver"&&Je){const j=Sr("yellow"),te=Sr("green"),O=Je==="yellow"?"#fbbf24":"#22c55e",k=E(Je==="yellow"?"yellowTeam":"greenTeam"),x=Kr==="builder"?`${k} ${E("gameOverBuilder")}`:`${k} ${E("gameOverPoints")}`;r.innerHTML=`
      <div class="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 gap-4 sm:gap-8">
        <h1 class="text-3xl sm:text-5xl font-bold" style="color: ${O}">
          ${k} Wins!
        </h1>
        <p class="text-white text-lg sm:text-xl text-center">${x}</p>
        <div class="flex gap-8 text-white text-lg">
          <div class="text-center">
            <div class="text-2xl font-bold" style="color: #fbbf24">${j}</div>
            <div class="text-sm opacity-70">${E("yellowTeam")}</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold" style="color: #22c55e">${te}</div>
            <div class="text-sm opacity-70">${E("greenTeam")}</div>
          </div>
        </div>
        <div class="text-white text-sm opacity-70">
          ${E("yellowTurns")}: ${$e} | ${E("greenTurns")}: ${me}
        </div>
        <div class="flex gap-3">
          <button id="play-again-btn" class="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-3 px-6 sm:px-8 rounded-lg text-lg sm:text-xl transition-colors touch-manipulation">
            ${E("playAgain")||"Play Again"}
          </button>
          <button id="main-menu-btn" class="bg-gray-600 hover:bg-gray-500 active:bg-gray-700 text-white font-bold py-3 px-6 sm:px-8 rounded-lg text-lg sm:text-xl transition-colors touch-manipulation">
            ${E("mainMenu")||"Main Menu"}
          </button>
        </div>
        <div class="flex items-start gap-4 sm:gap-8 opacity-50">
          <div class="flex-shrink-0" id="board-container">
            ${Ai()}
          </div>
        </div>
      </div>
    `,document.getElementById("play-again-btn")?.addEventListener("click",()=>{ca(),op()}),document.getElementById("main-menu-btn")?.addEventListener("click",()=>{ca(),Ce="start",M()});return}if(Ce==="start"){if(xi){r.innerHTML=`
        <div class="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 gap-4 sm:gap-8 overflow-y-auto">
          <h1 class="text-2xl sm:text-4xl font-bold text-white">${E("settingsButton")}</h1>
          <div class="bg-gray-800 p-6 rounded-lg flex flex-col gap-6 min-w-[280px] max-w-[400px]">

            <!-- Language -->
            <div class="flex flex-col gap-2">
              <label class="text-white font-bold">${E("languageLabel")}</label>
              <div class="flex flex-wrap gap-2">
                ${Object.keys(rp).map(O=>`
                  <button
                    data-lang="${O}"
                    class="lang-btn py-2 px-4 rounded ${_a===O?"bg-blue-600 text-white":"bg-gray-600 hover:bg-gray-500 text-gray-200"} transition-colors"
                  >
                    ${rp[O]}
                  </button>
                `).join("")}
              </div>
            </div>

            <!-- Chess Clock Timer -->
            <div class="flex flex-col gap-2 border-t border-gray-700 pt-4">
              <label class="text-white font-bold">⏱️ ${E("timerLabel")}</label>
              <div class="flex gap-2">
                <button
                  id="timer-off-btn"
                  class="py-2 px-4 rounded ${fn?"bg-gray-600 hover:bg-gray-500 text-gray-200":"bg-blue-600 text-white"} transition-colors"
                >
                  ${E("timerOff")}
                </button>
                <button
                  id="timer-on-btn"
                  class="py-2 px-4 rounded ${fn?"bg-blue-600 text-white":"bg-gray-600 hover:bg-gray-500 text-gray-200"} transition-colors"
                >
                  ${E("timerOn")}
                </button>
              </div>
              ${fn?`
                <div class="flex flex-col gap-2 mt-2">
                  <label class="text-gray-300 text-sm">${E("timerMinutesLabel")}</label>
                  <div class="flex gap-2">
                    ${[1,3,5,10,15,30].map(O=>`
                      <button
                        data-minutes="${O}"
                        class="timer-mins-btn py-1 px-3 rounded text-sm ${Gr===O?"bg-green-600 text-white":"bg-gray-600 hover:bg-gray-500 text-gray-200"} transition-colors"
                      >
                        ${O}
                      </button>
                    `).join("")}
                  </div>
                </div>
              `:""}
            </div>

            <!-- Sound Effects -->
            <div class="flex flex-col gap-2 border-t border-gray-700 pt-4">
              <label class="text-white font-bold">🔊 ${E("soundLabel")}</label>
              <div class="flex gap-2 items-center">
                <button
                  id="sound-off-btn"
                  class="py-2 px-4 rounded ${Qn?"bg-gray-600 hover:bg-gray-500 text-gray-200":"bg-blue-600 text-white"} transition-colors"
                >
                  ${E("off")}
                </button>
                <button
                  id="sound-on-btn"
                  class="py-2 px-4 rounded ${Qn?"bg-blue-600 text-white":"bg-gray-600 hover:bg-gray-500 text-gray-200"} transition-colors"
                >
                  ${E("on")}
                </button>
                <button
                  id="sound-test-btn"
                  class="py-2 px-4 rounded bg-purple-600 hover:bg-purple-500 text-white transition-colors text-sm"
                >
                  🔈 Test
                </button>
              </div>
            </div>

            <!-- Music setting -->
            <div class="flex flex-col gap-2">
              <label class="text-white font-bold">🎵 ${E("musicLabel")}</label>
              <div class="flex gap-2">
                <button
                  id="music-off-btn"
                  class="py-2 px-4 rounded ${K?"bg-gray-600 hover:bg-gray-500 text-gray-200":"bg-blue-600 text-white"} transition-colors"
                >
                  ${E("off")}
                </button>
                <button
                  id="music-on-btn"
                  class="py-2 px-4 rounded ${K?"bg-blue-600 text-white":"bg-gray-600 hover:bg-gray-500 text-gray-200"} transition-colors"
                >
                  ${E("on")}
                </button>
              </div>
            </div>

            <!-- Volume Controls with + - buttons -->
            <div class="flex flex-col gap-4 ${!Qn&&!K?"opacity-50":""}">
              <!-- Master Volume -->
              <div class="flex flex-col gap-1">
                <label class="text-gray-300 text-sm">${E("masterVolumeLabel")}</label>
                <div class="flex items-center gap-2">
                  <button id="master-vol-down" class="w-10 h-10 rounded bg-gray-600 hover:bg-gray-500 text-white text-xl font-bold">−</button>
                  <div class="flex-1 h-8 bg-gray-700 rounded overflow-hidden relative">
                    <div class="h-full bg-blue-500 transition-all" style="width: ${Ft*100}%"></div>
                    <span class="absolute inset-0 flex items-center justify-center text-white text-sm font-bold">${Math.round(Ft*100)}%</span>
                  </div>
                  <button id="master-vol-up" class="w-10 h-10 rounded bg-gray-600 hover:bg-gray-500 text-white text-xl font-bold">+</button>
                </div>
              </div>

              <!-- Music Volume -->
              <div class="flex flex-col gap-1">
                <label class="text-gray-300 text-sm">${E("musicVolumeLabel")}</label>
                <div class="flex items-center gap-2">
                  <button id="music-vol-down" class="w-10 h-10 rounded bg-gray-600 hover:bg-gray-500 text-white text-xl font-bold">−</button>
                  <div class="flex-1 h-8 bg-gray-700 rounded overflow-hidden relative">
                    <div class="h-full bg-purple-500 transition-all" style="width: ${jt*100}%"></div>
                    <span class="absolute inset-0 flex items-center justify-center text-white text-sm font-bold">${Math.round(jt*100)}%</span>
                  </div>
                  <button id="music-vol-up" class="w-10 h-10 rounded bg-gray-600 hover:bg-gray-500 text-white text-xl font-bold">+</button>
                </div>
              </div>

              <!-- SFX Volume -->
              <div class="flex flex-col gap-1">
                <label class="text-gray-300 text-sm">${E("sfxVolumeLabel")}</label>
                <div class="flex items-center gap-2">
                  <button id="sfx-vol-down" class="w-10 h-10 rounded bg-gray-600 hover:bg-gray-500 text-white text-xl font-bold">−</button>
                  <div class="flex-1 h-8 bg-gray-700 rounded overflow-hidden relative">
                    <div class="h-full bg-green-500 transition-all" style="width: ${un*100}%"></div>
                    <span class="absolute inset-0 flex items-center justify-center text-white text-sm font-bold">${Math.round(un*100)}%</span>
                  </div>
                  <button id="sfx-vol-up" class="w-10 h-10 rounded bg-gray-600 hover:bg-gray-500 text-white text-xl font-bold">+</button>
                </div>
              </div>
            </div>

            <!-- Music Style -->
            <div class="flex flex-col gap-2">
              <label class="text-gray-300 text-sm">${E("musicStyleLabel")}</label>
              <div class="flex flex-wrap gap-2">
                <button data-style="epic" class="style-btn py-1 px-3 rounded text-sm ${Pr==="epic"?"bg-red-600 text-white":"bg-gray-600 hover:bg-gray-500 text-gray-200"}">${E("styleEpic")}</button>
                <button data-style="ambient" class="style-btn py-1 px-3 rounded text-sm ${Pr==="ambient"?"bg-blue-600 text-white":"bg-gray-600 hover:bg-gray-500 text-gray-200"}">${E("styleAmbient")}</button>
                <button data-style="tension" class="style-btn py-1 px-3 rounded text-sm ${Pr==="tension"?"bg-orange-600 text-white":"bg-gray-600 hover:bg-gray-500 text-gray-200"}">${E("styleTension")}</button>
                <button data-style="electronic" class="style-btn py-1 px-3 rounded text-sm ${Pr==="electronic"?"bg-cyan-600 text-white":"bg-gray-600 hover:bg-gray-500 text-gray-200"}">${E("styleElectronic")}</button>
                <button data-style="orchestral" class="style-btn py-1 px-3 rounded text-sm ${Pr==="orchestral"?"bg-purple-600 text-white":"bg-gray-600 hover:bg-gray-500 text-gray-200"}">${E("styleOrchestral")}</button>
                <button data-style="retro" class="style-btn py-1 px-3 rounded text-sm ${Pr==="retro"?"bg-green-600 text-white":"bg-gray-600 hover:bg-gray-500 text-gray-200"}">${E("styleRetro")}</button>
              </div>
            </div>

            <!-- Visual Settings -->
            <div class="flex flex-col gap-3 border-t border-gray-700 pt-4">
              <label class="text-white font-bold">🎨 ${E("visualSettingsTitle")}</label>

              <!-- Board Theme -->
              <div class="flex flex-col gap-1">
                <label class="text-gray-300 text-sm">${E("boardThemeLabel")}</label>
                <div class="flex flex-wrap gap-2">
                  <button data-theme="classic" class="theme-btn py-1 px-3 rounded text-sm ${Kn==="classic"?"bg-blue-600 text-white":"bg-gray-600 hover:bg-gray-500 text-gray-200"}">${E("themeClassic")}</button>
                  <button data-theme="dark" class="theme-btn py-1 px-3 rounded text-sm ${Kn==="dark"?"bg-blue-600 text-white":"bg-gray-600 hover:bg-gray-500 text-gray-200"}">${E("themeDark")}</button>
                  <button data-theme="light" class="theme-btn py-1 px-3 rounded text-sm ${Kn==="light"?"bg-blue-600 text-white":"bg-gray-600 hover:bg-gray-500 text-gray-200"}">${E("themeLight")}</button>
                  <button data-theme="wood" class="theme-btn py-1 px-3 rounded text-sm ${Kn==="wood"?"bg-blue-600 text-white":"bg-gray-600 hover:bg-gray-500 text-gray-200"}">${E("themeWood")}</button>
                </div>
              </div>

              <!-- Animation Speed -->
              <div class="flex flex-col gap-1">
                <label class="text-gray-300 text-sm">${E("animationSpeedLabel")}</label>
                <div class="flex gap-2">
                  <button data-speed="fast" class="speed-btn py-1 px-3 rounded text-sm ${Zn==="fast"?"bg-blue-600 text-white":"bg-gray-600 hover:bg-gray-500 text-gray-200"}">${E("speedFast")}</button>
                  <button data-speed="normal" class="speed-btn py-1 px-3 rounded text-sm ${Zn==="normal"?"bg-blue-600 text-white":"bg-gray-600 hover:bg-gray-500 text-gray-200"}">${E("speedNormal")}</button>
                  <button data-speed="slow" class="speed-btn py-1 px-3 rounded text-sm ${Zn==="slow"?"bg-blue-600 text-white":"bg-gray-600 hover:bg-gray-500 text-gray-200"}">${E("speedSlow")}</button>
                </div>
              </div>

              <!-- Screen Shake -->
              <div class="flex items-center justify-between">
                <label class="text-gray-300 text-sm">${E("screenShakeLabel")}</label>
                <button id="screen-shake-btn" class="py-1 px-3 rounded text-sm ${Li?"bg-green-600 text-white":"bg-gray-600 text-gray-200"}">${E(Li?"on":"off")}</button>
              </div>

              <!-- Show Coordinates -->
              <div class="flex items-center justify-between">
                <label class="text-gray-300 text-sm">${E("showCoordinatesLabel")}</label>
                <button id="show-coords-btn" class="py-1 px-3 rounded text-sm ${Bs?"bg-green-600 text-white":"bg-gray-600 text-gray-200"}">${E(Bs?"on":"off")}</button>
              </div>
            </div>

            <!-- Accessibility Settings -->
            <div class="flex flex-col gap-3 border-t border-gray-700 pt-4">
              <label class="text-white font-bold">♿ ${E("accessibilityTitle")}</label>

              <!-- Colorblind Mode -->
              <div class="flex items-center justify-between">
                <label class="text-gray-300 text-sm">${E("colorBlindLabel")}</label>
                <button id="colorblind-btn" class="py-1 px-3 rounded text-sm ${yr?"bg-green-600 text-white":"bg-gray-600 text-gray-200"}">${E(yr?"on":"off")}</button>
              </div>

              <!-- High Contrast -->
              <div class="flex items-center justify-between">
                <label class="text-gray-300 text-sm">${E("highContrastLabel")}</label>
                <button id="high-contrast-btn" class="py-1 px-3 rounded text-sm ${_i?"bg-green-600 text-white":"bg-gray-600 text-gray-200"}">${E(_i?"on":"off")}</button>
              </div>

              <!-- Large UI -->
              <div class="flex items-center justify-between">
                <label class="text-gray-300 text-sm">${E("largeUILabel")}</label>
                <button id="large-ui-btn" class="py-1 px-3 rounded text-sm ${Ei?"bg-green-600 text-white":"bg-gray-600 text-gray-200"}">${E(Ei?"on":"off")}</button>
              </div>
            </div>

            <!-- Fullscreen -->
            <div class="flex flex-col gap-2 border-t border-gray-700 pt-4">
              <div class="flex items-center justify-between">
                <label class="text-white font-bold">🖥️ ${E("fullscreenLabel")}</label>
                <button id="fullscreen-btn" class="py-2 px-4 rounded ${la?"bg-green-600 text-white":"bg-gray-600 hover:bg-gray-500 text-gray-200"} transition-colors">${E(la?"on":"off")}</button>
              </div>
            </div>

            <!-- How to Play -->
            <div class="flex flex-col gap-2 border-t border-gray-700 pt-4">
              <button id="manual-btn" class="w-full py-3 px-4 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors">
                📖 ${E("manualButton")}
              </button>
            </div>

          </div>
          <button id="back-btn" class="bg-gray-600 hover:bg-gray-700 active:bg-gray-800 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors touch-manipulation">
            ${E("backButton")}
          </button>
        </div>
      `,document.querySelectorAll(".lang-btn").forEach(O=>{O.addEventListener("click",k=>{_a=k.target.getAttribute("data-lang"),M()})}),document.getElementById("timer-off-btn")?.addEventListener("click",()=>{fn=!1,M()}),document.getElementById("timer-on-btn")?.addEventListener("click",()=>{fn=!0,M()}),document.querySelectorAll(".timer-mins-btn").forEach(O=>{O.addEventListener("click",k=>{Gr=parseInt(k.target.getAttribute("data-minutes")||"10"),M()})}),document.getElementById("sound-off-btn")?.addEventListener("click",()=>{Qn=!1,M()}),document.getElementById("sound-on-btn")?.addEventListener("click",async()=>{Qn=!0,await Yi(),M()}),document.getElementById("sound-test-btn")?.addEventListener("click",async()=>{await Yi(),await be("capture")}),document.getElementById("music-off-btn")?.addEventListener("click",()=>{K=!1,dt(),M()}),document.getElementById("music-on-btn")?.addEventListener("click",async()=>{K=!0,await Yi(),await Ni(),M()}),document.getElementById("master-vol-down")?.addEventListener("click",()=>{Ft=Math.max(0,Ft-.1),V&&(V.gain.value=.12*jt*Ft),M()}),document.getElementById("master-vol-up")?.addEventListener("click",()=>{Ft=Math.min(1,Ft+.1),V&&(V.gain.value=.12*jt*Ft),M()}),document.getElementById("music-vol-down")?.addEventListener("click",()=>{jt=Math.max(0,jt-.1),V&&(V.gain.value=.12*jt*Ft),M()}),document.getElementById("music-vol-up")?.addEventListener("click",()=>{jt=Math.min(1,jt+.1),V&&(V.gain.value=.12*jt*Ft),M()}),document.getElementById("sfx-vol-down")?.addEventListener("click",()=>{un=Math.max(0,un-.1),M()}),document.getElementById("sfx-vol-up")?.addEventListener("click",()=>{un=Math.min(1,un+.1),M()}),document.querySelectorAll(".style-btn").forEach(O=>{O.addEventListener("click",k=>{const _=k.currentTarget.getAttribute("data-style");_&&(Pr=_,K&&(dt(),Ni()),M())})}),document.querySelectorAll(".theme-btn").forEach(O=>{O.addEventListener("click",k=>{Kn=k.target.getAttribute("data-theme"),M()})}),document.querySelectorAll(".speed-btn").forEach(O=>{O.addEventListener("click",k=>{Zn=k.target.getAttribute("data-speed"),M()})}),document.getElementById("screen-shake-btn")?.addEventListener("click",()=>{Li=!Li,M()}),document.getElementById("show-coords-btn")?.addEventListener("click",()=>{Bs=!Bs,M()}),document.getElementById("colorblind-btn")?.addEventListener("click",()=>{yr=!yr,M()}),document.getElementById("high-contrast-btn")?.addEventListener("click",()=>{_i=!_i,M()}),document.getElementById("large-ui-btn")?.addEventListener("click",()=>{Ei=!Ei,M()}),document.getElementById("fullscreen-btn")?.addEventListener("click",()=>{document.fullscreenElement?(document.exitFullscreen(),la=!1):(document.documentElement.requestFullscreen(),la=!0),M()}),document.getElementById("manual-btn")?.addEventListener("click",()=>{yc=!0,xi=!1,M()}),document.getElementById("back-btn")?.addEventListener("click",()=>{xi=!1,vi==="multiplayer"&&(ye="multiplayer",vi="none"),M()});return}if(yc){r.innerHTML=`
        <div class="min-h-screen flex flex-col items-center justify-start p-4 sm:p-8 gap-4 sm:gap-6 overflow-y-auto">
          <h1 class="text-2xl sm:text-4xl font-bold text-white">📖 ${E("manualTitle")}</h1>
          <div class="bg-gray-800 p-6 rounded-lg flex flex-col gap-6 max-w-[600px] w-full">

            <!-- How to Win -->
            <div class="flex flex-col gap-2">
              <h2 class="text-xl font-bold text-yellow-400">🏆 ${E("manualWinTitle")}</h2>
              <p class="text-gray-200 whitespace-pre-line">${E("manualWinText")}</p>
            </div>

            <!-- Clock -->
            <div class="flex flex-col gap-2 border-t border-gray-700 pt-4">
              <h2 class="text-xl font-bold text-blue-400">⏱️ ${E("manualClockTitle")}</h2>
              <p class="text-gray-200 whitespace-pre-line">${E("manualClockText")}</p>
            </div>

            <!-- Points -->
            <div class="flex flex-col gap-2 border-t border-gray-700 pt-4">
              <h2 class="text-xl font-bold text-green-400">⭐ ${E("manualPointsTitle")}</h2>
              <p class="text-gray-200 whitespace-pre-line">${E("manualPointsText")}</p>
            </div>

            <!-- Moves -->
            <div class="flex flex-col gap-2 border-t border-gray-700 pt-4">
              <h2 class="text-xl font-bold text-purple-400">📋 ${E("manualMovesTitle")}</h2>
              <p class="text-gray-200 whitespace-pre-line">${E("manualMovesText")}</p>
            </div>

            <!-- The Big Three -->
            <div class="flex flex-col gap-2 border-t border-gray-700 pt-4">
              <h2 class="text-xl font-bold text-red-400">⚔️ ${E("manualBigThreeTitle")}</h2>
              <p class="text-gray-200 whitespace-pre-line">${E("manualBigThreeText")}</p>
            </div>

            <!-- Hacker -->
            <div class="flex flex-col gap-2 border-t border-gray-700 pt-4">
              <h2 class="text-lg font-bold text-purple-300">💻 ${E("manualHackerTitle")}</h2>
              <p class="text-gray-200 whitespace-pre-line">${E("manualHackerText")}</p>
            </div>

            <!-- Engineer -->
            <div class="flex flex-col gap-2 border-t border-gray-700 pt-4">
              <h2 class="text-lg font-bold text-orange-300">🔧 ${E("manualEngineerTitle")}</h2>
              <p class="text-gray-200 whitespace-pre-line">${E("manualEngineerText")}</p>
            </div>

            <!-- Bomber -->
            <div class="flex flex-col gap-2 border-t border-gray-700 pt-4">
              <h2 class="text-lg font-bold text-red-300">✈️ ${E("manualBomberTitle")}</h2>
              <p class="text-gray-200 whitespace-pre-line">${E("manualBomberText")}</p>
            </div>

            <!-- Rules -->
            <div class="flex flex-col gap-2 border-t border-gray-700 pt-4">
              <h2 class="text-xl font-bold text-cyan-400">📜 ${E("manualRulesTitle")}</h2>
              <p class="text-gray-200 whitespace-pre-line">${E("manualRulesText")}</p>
            </div>

            <!-- Special Locations -->
            <div class="flex flex-col gap-2 border-t border-gray-700 pt-4">
              <h2 class="text-xl font-bold text-amber-400">📍 ${E("manualSpecialTitle")}</h2>
              <p class="text-gray-200 whitespace-pre-line">${E("manualSpecialText")}</p>
            </div>

            <!-- Trench & Tunnel -->
            <div class="flex flex-col gap-2 border-t border-gray-700 pt-4">
              <h2 class="text-xl font-bold text-stone-400">🕳️ ${E("manualTrenchTitle")}</h2>
              <p class="text-gray-200 whitespace-pre-line">${E("manualTrenchText")}</p>
            </div>

            <!-- Other Pieces -->
            <div class="flex flex-col gap-2 border-t border-gray-700 pt-4">
              <h2 class="text-xl font-bold text-pink-400">🎯 ${E("manualOtherTitle")}</h2>
              <p class="text-gray-200 whitespace-pre-line">${E("manualOtherText")}</p>
            </div>

          </div>
          <button id="manual-back-btn" class="bg-gray-600 hover:bg-gray-700 active:bg-gray-800 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors touch-manipulation">
            ${E("backButton")}
          </button>
        </div>
      `,document.getElementById("manual-back-btn")?.addEventListener("click",()=>{yc=!1,xi=!0,M()});return}if(ye==="login"){r.innerHTML=`
        <div class="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 gap-4">
          <h1 class="text-2xl sm:text-4xl font-bold text-white">${E("authLogin")}</h1>
          <div class="bg-gray-800 p-6 rounded-lg flex flex-col gap-4 w-full max-w-[350px]">
            ${Ht?`<div class="bg-red-600 text-white p-3 rounded text-sm">${Ht}</div>`:""}
            <div class="flex flex-col gap-2">
              <label class="text-gray-300 text-sm">${E(on?"authEmail":"authUsername")}</label>
              <input type="${on?"email":"text"}" id="login-input" name="${on?"email":"username"}" autocomplete="${on?"email":"username"}" class="bg-gray-700 text-white p-3 rounded border border-gray-600 focus:border-blue-500 outline-none" placeholder="${on?"email@example.com":E("authUsername")}">
            </div>
            <div class="flex flex-col gap-2">
              <label class="text-gray-300 text-sm">${E("authPassword")}</label>
              <input type="password" id="login-password" name="password" autocomplete="current-password" class="bg-gray-700 text-white p-3 rounded border border-gray-600 focus:border-blue-500 outline-none" placeholder="••••••••">
            </div>
            <button id="login-btn" class="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded transition-colors ${fr?"opacity-50":""}" ${fr?"disabled":""}>
              ${E(fr?"authLoading":"authLoginButton")}
            </button>
            <div class="text-center">
              <button id="toggle-login-mode" class="text-blue-400 hover:underline text-sm">
                ${E(on?"authLoginWithUsername":"authLoginWithEmail")}
              </button>
            </div>
            <div class="text-center text-gray-400 text-sm">
              ${E("authNoAccount")} <button id="goto-register" class="text-blue-400 hover:underline">${E("authRegister")}</button>
            </div>
          </div>
          <button id="offline-btn" class="bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded transition-colors">
            ${E("authOffline")}
          </button>
        </div>
      `,document.getElementById("toggle-login-mode")?.addEventListener("click",()=>{on=!on,M()}),document.getElementById("login-btn")?.addEventListener("click",async()=>{const O=document.getElementById("login-input")?.value,k=document.getElementById("login-password")?.value;if(!O||!k){Ht="Please fill in all fields",M();return}fr=!0,Ht="",M();const x=await Ik(O,k);if(fr=!1,x.success){ye="none";const _=Zt();_&&(_a=_.settings.language,Qn=_.settings.soundEnabled,K=_.settings.musicEnabled,Ft=_.settings.masterVolume,jt=_.settings.musicVolume,un=_.settings.sfxVolume,Pr=_.settings.musicStyle,Kn=_.settings.boardTheme,Zn=_.settings.animationSpeed,Li=_.settings.screenShakeEnabled,Bs=_.settings.showCoordinates,yr=_.settings.colorBlindMode,_i=_.settings.highContrastMode,Ei=_.settings.largeUIMode,er=_.equippedItems?.theme||null,gr=_.equippedItems?.pieceSkin||null,dn=_.equippedItems?.effect||null,hn=_.equippedItems?.soundPack||null,Mr=_.equippedItems?.musicPack||null),x4()}else Ht=x.error||"Login failed";M()}),document.getElementById("goto-register")?.addEventListener("click",()=>{ye="register",Ht="",M()}),document.getElementById("offline-btn")?.addEventListener("click",()=>{va(!0),ye="none",M()});return}if(ye==="register"){r.innerHTML=`
        <div class="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 gap-4">
          <h1 class="text-2xl sm:text-4xl font-bold text-white">${E("authRegister")}</h1>
          <div class="bg-gray-800 p-6 rounded-lg flex flex-col gap-4 w-full max-w-[350px]">
            ${Ht?`<div class="bg-red-600 text-white p-3 rounded text-sm">${Ht}</div>`:""}
            <div class="flex flex-col gap-2">
              <label class="text-gray-300 text-sm">${E("authUsername")}</label>
              <input type="text" id="register-username" name="username" autocomplete="username" class="bg-gray-700 text-white p-3 rounded border border-gray-600 focus:border-blue-500 outline-none" placeholder="Player123">
            </div>
            <div class="flex flex-col gap-2">
              <label class="text-gray-300 text-sm">${E("authEmail")}</label>
              <input type="email" id="register-email" name="email" autocomplete="email" class="bg-gray-700 text-white p-3 rounded border border-gray-600 focus:border-blue-500 outline-none" placeholder="email@example.com">
            </div>
            <div class="flex flex-col gap-2">
              <label class="text-gray-300 text-sm">${E("authPassword")}</label>
              <input type="password" id="register-password" name="new-password" autocomplete="new-password" class="bg-gray-700 text-white p-3 rounded border border-gray-600 focus:border-blue-500 outline-none" placeholder="••••••••">
            </div>
            <button id="register-btn" class="bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded transition-colors ${fr?"opacity-50":""}" ${fr?"disabled":""}>
              ${E(fr?"authLoading":"authRegisterButton")}
            </button>
            <div class="text-center text-gray-400 text-sm">
              ${E("authHaveAccount")} <button id="goto-login" class="text-blue-400 hover:underline">${E("authLogin")}</button>
            </div>
          </div>
          <button id="offline-btn2" class="bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded transition-colors">
            ${E("authOffline")}
          </button>
        </div>
      `,document.getElementById("register-btn")?.addEventListener("click",async()=>{const O=document.getElementById("register-username")?.value,k=document.getElementById("register-email")?.value,x=document.getElementById("register-password")?.value;if(!O||!k||!x){Ht="Please fill in all fields",M();return}fr=!0,Ht="",M();const _=await Ek(k,x,O);fr=!1,_.success?ye="none":Ht=_.error||"Registration failed",M()}),document.getElementById("goto-login")?.addEventListener("click",()=>{ye="login",Ht="",M()}),document.getElementById("offline-btn2")?.addEventListener("click",()=>{va(!0),ye="none",M()});return}if(ye==="profile"){const O=Zt(),k=O&&O.stats.gamesPlayed>0?Math.round(O.stats.gamesWon/O.stats.gamesPlayed*100):0;(async()=>{const _=await Wf(),A=await Ug(),I=Xt()?.uid||"",L=_.filter(R=>R.type==="reward"&&!R.claimedBy?.includes(I)).length,v=_.filter(R=>R.type==="poll"&&!R.pollVotes?.[I]).length,ee=_.filter(R=>R.type==="gamemode").length,C=L+v,S=A.length;r.innerHTML=`
        <div class="min-h-screen flex flex-col items-center justify-start p-4 sm:p-8 gap-4 overflow-y-auto">
          <h1 class="text-2xl sm:text-4xl font-bold text-white">👤 ${E("profileTitle")}</h1>
          ${O?`
          <div class="text-xl text-blue-400 font-bold">${O.username}</div>
          <div class="text-yellow-400 font-bold">💰 ${O.warBucks} ${E("profileWarBucks")}</div>

          <div class="bg-gray-800 p-6 rounded-lg flex flex-col gap-4 w-full max-w-[400px]">
            <h2 class="text-lg font-bold text-white">📊 ${E("profileStats")}</h2>
            <div class="grid grid-cols-2 gap-3 text-sm">
              <div class="text-gray-400">${E("statsGamesPlayed")}</div>
              <div class="text-white font-bold">${O.stats.gamesPlayed}</div>
              <div class="text-gray-400">${E("statsGamesWon")}</div>
              <div class="text-green-400 font-bold">${O.stats.gamesWon}</div>
              <div class="text-gray-400">${E("statsGamesLost")}</div>
              <div class="text-red-400 font-bold">${O.stats.gamesLost}</div>
              <div class="text-gray-400">${E("statsWinRate")}</div>
              <div class="text-white font-bold">${k}%</div>
              <div class="text-gray-400">${E("statsTotalPoints")}</div>
              <div class="text-yellow-400 font-bold">${O.stats.totalPointsScored}</div>
              <div class="text-gray-400">${E("statsPiecesEliminated")}</div>
              <div class="text-white font-bold">${O.stats.piecesEliminated}</div>
              <div class="text-gray-400">${E("statsEngineers")}</div>
              <div class="text-orange-400 font-bold">${O.stats.engineersCaptured}</div>
            </div>
          </div>

          <div class="bg-gray-800 p-6 rounded-lg flex flex-col gap-4 w-full max-w-[400px]">
            <h2 class="text-lg font-bold text-white">🏅 ${E("profileBadges")}</h2>
            ${O.badges.length>0?`
              <div class="flex flex-wrap gap-2">
                ${O.badges.map(R=>{const Q=Object.values(Sk).find(q=>q.id===R);return Q?`<div class="bg-gray-700 px-3 py-2 rounded flex items-center gap-2" title="${Q.description}">
                    <span class="text-xl">${Q.icon}</span>
                    <span class="text-white text-sm">${Q.name}</span>
                  </div>`:""}).join("")}
              </div>
            `:`<div class="text-gray-400 text-sm">${E("noBadges")}</div>`}
          </div>
          `:'<div class="text-gray-400">Loading...</div>'}

          <!-- Shop, War Pass and Events buttons -->
          <div class="flex flex-wrap gap-4 mt-2 justify-center">
            <button id="shop-btn" class="w-28 h-28 sm:w-32 sm:h-32 bg-gradient-to-br from-yellow-500 to-yellow-700 hover:from-yellow-400 hover:to-yellow-600 text-white font-bold rounded-xl transition-all shadow-lg flex flex-col items-center justify-center gap-2">
              <span class="text-3xl sm:text-4xl">🛒</span>
              <span class="text-sm sm:text-base">${E("shopTitle")}</span>
            </button>
            <button id="warpass-btn" class="w-28 h-28 sm:w-32 sm:h-32 bg-gradient-to-br from-purple-500 to-purple-700 hover:from-purple-400 hover:to-purple-600 text-white font-bold rounded-xl transition-all shadow-lg flex flex-col items-center justify-center gap-2">
              <span class="text-3xl sm:text-4xl">🎖️</span>
              <span class="text-sm sm:text-base">${E("warPassTitle")}</span>
            </button>
            <button id="events-btn" class="relative w-28 h-28 sm:w-32 sm:h-32 bg-gradient-to-br from-green-500 to-green-700 hover:from-green-400 hover:to-green-600 text-white font-bold rounded-xl transition-all shadow-lg flex flex-col items-center justify-center gap-2">
              ${C>0?`<span class="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse">${C}</span>`:""}
              <span class="text-3xl sm:text-4xl">📢</span>
              <span class="text-sm sm:text-base">Events</span>
              ${ee>0?`<span class="text-xs bg-purple-500 px-2 rounded-full">${ee} modes</span>`:""}
            </button>
            <button id="puzzles-btn" class="relative w-28 h-28 sm:w-32 sm:h-32 bg-gradient-to-br from-orange-500 to-orange-700 hover:from-orange-400 hover:to-orange-600 text-white font-bold rounded-xl transition-all shadow-lg flex flex-col items-center justify-center gap-2">
              <span class="text-3xl sm:text-4xl">🧩</span>
              <span class="text-sm sm:text-base">Puzzles</span>
              ${O?.puzzleStats?.dailyStreak?`<span class="text-xs bg-yellow-500 px-2 rounded-full">🔥 ${O.puzzleStats.dailyStreak}</span>`:""}
            </button>
            <button id="tournaments-btn" class="relative w-28 h-28 sm:w-32 sm:h-32 bg-gradient-to-br from-cyan-500 to-cyan-700 hover:from-cyan-400 hover:to-cyan-600 text-white font-bold rounded-xl transition-all shadow-lg flex flex-col items-center justify-center gap-2">
              <span class="text-3xl sm:text-4xl">🏆</span>
              <span class="text-sm sm:text-base">Tournaments</span>
            </button>
            ${Be()?`
            <button id="admin-btn" class="w-28 h-28 sm:w-32 sm:h-32 bg-gradient-to-br from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white font-bold rounded-xl transition-all shadow-lg flex flex-col items-center justify-center gap-2">
              <span class="text-3xl sm:text-4xl">🔧</span>
              <span class="text-sm sm:text-base">Admin</span>
            </button>
            `:""}
          </div>

          <div class="flex gap-3 mt-2">
            <button id="profile-back-btn" class="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded transition-colors">
              ${E("backButton")}
            </button>
            <button id="logout-btn" class="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-6 rounded transition-colors">
              ${E("authLogout")}
            </button>
          </div>
        </div>
      `,S>0&&Ju(),document.getElementById("shop-btn")?.addEventListener("click",()=>{ye="shop",M()}),document.getElementById("warpass-btn")?.addEventListener("click",()=>{ye="warpass",M()}),document.getElementById("events-btn")?.addEventListener("click",()=>{ye="events",M()}),document.getElementById("puzzles-btn")?.addEventListener("click",()=>{ye="puzzles",M()}),document.getElementById("tournaments-btn")?.addEventListener("click",()=>{ye="tournaments",M()}),document.getElementById("admin-btn")?.addEventListener("click",()=>{ye="admin",M()}),document.getElementById("profile-back-btn")?.addEventListener("click",()=>{ye="none",M()}),document.getElementById("logout-btn")?.addEventListener("click",async()=>{await Ck(),va(!1),ye="login",M()})})();return}if(ye==="shop"){const O=Zt(),k=O?.purchasedItems||[],x=O?.equippedItems||{theme:null,pieceSkin:null,effect:null,soundPack:null,musicPack:null},_=(C,S)=>C.map(R=>{const Q=k.includes(R.id),q=S==="theme"&&x.theme===R.id||S==="piece_skin"&&x.pieceSkin===R.id||S==="effect"&&x.effect===R.id||S==="sound_pack"&&x.soundPack===R.id||S==="music_pack"&&x.musicPack===R.id;return`
            <div class="bg-gray-700 p-4 rounded-lg flex flex-col gap-2 ${q?"ring-2 ring-green-400":""}">
              <div class="flex items-center gap-2">
                <span class="text-2xl">${R.icon}</span>
                <span class="text-white font-bold">${R.name}</span>
                ${q?'<span class="text-green-400 text-xs ml-auto">✓ '+E("shopEquipped")+"</span>":""}
              </div>
              <p class="text-gray-400 text-sm">${R.description}</p>
              <div class="flex items-center justify-between mt-2">
                <span class="text-yellow-400 font-bold">💰 ${R.price}</span>
                ${Q?q?`<button class="unequip-item-btn bg-red-600 hover:bg-red-500 text-white font-bold py-1 px-4 rounded text-sm transition-colors" data-item="${R.id}" data-type="${S}">
                        ${E("shopUnequip")}
                      </button>`:`<button class="equip-item-btn bg-green-600 hover:bg-green-500 text-white font-bold py-1 px-4 rounded text-sm transition-colors" data-item="${R.id}" data-type="${S}">
                        ${E("shopEquip")}
                      </button>`:`<button class="buy-item-btn bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-1 px-4 rounded text-sm transition-colors" data-item="${R.id}" data-price="${R.price}">
                      ${E("shopBuy")}
                    </button>`}
              </div>
            </div>
          `}).join(""),A=Pe.filter(C=>C.type==="theme"),I=Pe.filter(C=>C.type==="piece_skin"),L=Pe.filter(C=>C.type==="effect"),v=Pe.filter(C=>C.type==="sound_pack"),ee=Pe.filter(C=>C.type==="music_pack");r.innerHTML=`
        <div class="min-h-screen flex flex-col items-center justify-start p-4 sm:p-8 gap-4 overflow-y-auto">
          <h1 class="text-2xl sm:text-4xl font-bold text-white">🛒 ${E("shopTitle")}</h1>
          <div class="text-yellow-400 font-bold text-xl">${E("shopBalance")}: 💰 ${O?.warBucks||0}</div>

          <div class="w-full max-w-[600px] flex flex-col gap-6">
            <div>
              <h2 class="text-lg font-bold text-white mb-3">🎨 ${E("shopThemes")}</h2>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                ${_(A,"theme")}
              </div>
            </div>

            <div>
              <h2 class="text-lg font-bold text-white mb-3">⚔️ ${E("shopSkins")}</h2>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                ${_(I,"piece_skin")}
              </div>
            </div>

            <div>
              <h2 class="text-lg font-bold text-white mb-3">✨ ${E("shopEffects")}</h2>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                ${_(L,"effect")}
              </div>
            </div>

            <div>
              <h2 class="text-lg font-bold text-white mb-3">🔊 ${E("shopSounds")}</h2>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                ${_(v,"sound_pack")}
              </div>
            </div>

            <div>
              <h2 class="text-lg font-bold text-white mb-3">🎵 ${E("shopMusic")}</h2>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                ${_(ee,"music_pack")}
              </div>
            </div>
          </div>

          <button id="shop-back-btn" class="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded transition-colors mt-4">
            ${E("backButton")}
          </button>
        </div>
      `,document.getElementById("shop-back-btn")?.addEventListener("click",()=>{ye=vi==="multiplayer"?"multiplayer":"profile",vi="none",M()}),document.querySelectorAll(".buy-item-btn").forEach(C=>{C.addEventListener("click",async S=>{const R=S.target,Q=R.dataset.item,q=parseInt(R.dataset.price||"0");if(!O||!Q)return;if(O.warBucks<q){alert(E("shopNotEnough"));return}const ce=O.warBucks-q,Ie=[...O.purchasedItems||[],Q];await cn({warBucks:ce,purchasedItems:Ie}),await Pi(),alert(E("shopPurchased")),M()})}),document.querySelectorAll(".equip-item-btn").forEach(C=>{C.addEventListener("click",async S=>{const R=S.target,Q=R.dataset.item,q=R.dataset.type;if(!O||!Q)return;const ce={...O.equippedItems||{theme:null,pieceSkin:null,effect:null,soundPack:null,musicPack:null}};q==="theme"?(ce.theme=Q,er=Q):q==="piece_skin"?(ce.pieceSkin=Q,gr=Q):q==="effect"?(ce.effect=Q,dn=Q):q==="sound_pack"?(ce.soundPack=Q,hn=Q):q==="music_pack"&&(ce.musicPack=Q,Mr=Q,K&&it&&(dt(),Ni())),await cn({equippedItems:ce}),await Pi(),M()})}),document.querySelectorAll(".unequip-item-btn").forEach(C=>{C.addEventListener("click",async S=>{const Q=S.target.dataset.type;if(!O)return;const q={...O.equippedItems||{theme:null,pieceSkin:null,effect:null,soundPack:null,musicPack:null}};Q==="theme"?(q.theme=null,er=null):Q==="piece_skin"?(q.pieceSkin=null,gr=null):Q==="effect"?(q.effect=null,dn=null):Q==="sound_pack"?(q.soundPack=null,hn=null):Q==="music_pack"&&(q.musicPack=null,Mr=null,K&&it&&(dt(),Ni())),await cn({equippedItems:q}),await Pi(),M()})});return}if(ye==="warpass"){const O=Zt();let k=O?.warPass?.claimedRewards||[];const x=O?.warPass?.lastResetTime||0,_=O?.warPass?.completedCount||0,A=O?.stats||{gamesPlayed:0,gamesWon:0,piecesEliminated:0,engineersCaptured:0,totalPointsScored:0},I=_k(_),L=1440*60*1e3,v=Date.now()-x,ee=I.every(q=>k.includes(q.id)),C=Math.max(0,L-v),S=Math.floor(C/(3600*1e3)),R=Math.floor(C%(3600*1e3)/(60*1e3));if(ee&&v>=L&&O){(async()=>{await cn({warPass:{claimedRewards:[],completedCount:_+1,lastResetTime:Date.now()}}),await Pi();const q=Zt();if(q){const ce=Bg(q);ce.length>0&&await cn({badges:[...q.badges,...ce]})}M()})();return}const Q=q=>{const ce=A[q.stat]||0,Ie=Math.min(100,ce/q.requirement*100),We=ce>=q.requirement,ot=k.includes(q.id),Rr=q.reward.type==="warBucks"?`💰 ${q.reward.amount}`:`🎁 ${Pe.find(Lt=>Lt.id===q.reward.itemId)?.name||"Item"}`;return`
          <div class="bg-gray-700 p-4 rounded-lg flex flex-col gap-2 ${ot?"opacity-60":""}">
            <div class="flex items-center gap-2">
              <span class="text-2xl">${q.icon}</span>
              <div class="flex-1">
                <span class="text-white font-bold">${q.name}</span>
                <p class="text-gray-400 text-sm">${q.description}</p>
              </div>
            </div>
            <div class="w-full bg-gray-600 rounded-full h-3 mt-2">
              <div class="bg-gradient-to-r from-purple-500 to-purple-400 h-3 rounded-full transition-all" style="width: ${Ie}%"></div>
            </div>
            <div class="flex items-center justify-between mt-1">
              <span class="text-gray-300 text-sm">${ce} / ${q.requirement}</span>
              <span class="text-yellow-400 text-sm">${E("warPassReward")}: ${Rr}</span>
            </div>
            <div class="flex justify-end mt-2">
              ${ot?`<span class="text-gray-400 font-bold">${E("warPassClaimed")}</span>`:We?`<button class="claim-reward-btn bg-green-600 hover:bg-green-500 text-white font-bold py-1 px-4 rounded text-sm transition-colors" data-challenge="${q.id}">
                      ${E("warPassClaim")}
                    </button>`:`<span class="text-gray-500 text-sm">${E("warPassProgress")}: ${Math.round(Ie)}%</span>`}
            </div>
          </div>
        `};r.innerHTML=`
        <div class="min-h-screen flex flex-col items-center justify-start p-4 sm:p-8 gap-4 overflow-y-auto">
          <h1 class="text-2xl sm:text-4xl font-bold text-white">🎖️ ${E("warPassTitle")}</h1>
          <div class="text-yellow-400 font-bold text-xl">💰 ${O?.warBucks||0} War Bucks</div>

          <!-- War Pass stats -->
          <div class="flex gap-4 text-center">
            <div class="bg-purple-900/50 px-4 py-2 rounded-lg">
              <div class="text-purple-300 text-sm">Completed</div>
              <div class="text-white font-bold text-xl">${_}x</div>
            </div>
            ${ee?`
              <div class="bg-green-900/50 px-4 py-2 rounded-lg">
                <div class="text-green-300 text-sm">Reset in</div>
                <div class="text-white font-bold text-xl">${S}h ${R}m</div>
              </div>
            `:""}
          </div>

          ${ee?`
            <div class="bg-green-600/20 border border-green-500 rounded-lg p-4 text-center">
              <span class="text-green-400 font-bold text-lg">🎉 All challenges completed!</span>
              <p class="text-green-300 text-sm mt-1">New challenges in ${S}h ${R}m</p>
            </div>
          `:""}

          <div class="w-full max-w-[600px] flex flex-col gap-4">
            <h2 class="text-lg font-bold text-white">🎯 ${E("warPassChallenges")}</h2>
            ${I.map(Q).join("")}
          </div>

          <button id="warpass-back-btn" class="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded transition-colors mt-4">
            ${E("backButton")}
          </button>
        </div>
      `,document.getElementById("warpass-back-btn")?.addEventListener("click",()=>{ye="profile",M()}),document.querySelectorAll(".claim-reward-btn").forEach(q=>{q.addEventListener("click",async ce=>{const We=ce.target.dataset.challenge;if(!O||!We)return;const ot=I.find(Lt=>Lt.id===We);if(!ot)return;const Rr=[...O.warPass?.claimedRewards||[],We];if(I.every(Lt=>Lt.id===We||(O.warPass?.claimedRewards||[]).includes(Lt.id)),ot.reward.type==="warBucks"){const Lt=(O.warBucks||0)+(ot.reward.amount||0);await cn({warBucks:Lt,warPass:{claimedRewards:Rr,completedCount:O.warPass?.completedCount||0,lastResetTime:O.warPass?.lastResetTime||Date.now()}})}else if(ot.reward.type==="item"&&ot.reward.itemId){const Lt=[...O.purchasedItems||[],ot.reward.itemId];await cn({purchasedItems:Lt,warPass:{claimedRewards:Rr,completedCount:O.warPass?.completedCount||0,lastResetTime:O.warPass?.lastResetTime||Date.now()}})}await Pi(),alert(E("warPassCompleted")),M()})});return}if(ye==="events"){const O=async()=>{const k=await Wf(),x=k.filter(v=>v.type==="gamemode"),_=k.filter(v=>v.type==="reward"),A=k.filter(v=>v.type==="poll"),I=k.filter(v=>v.type!=="gamemode"&&v.type!=="reward"&&v.type!=="poll"),L={};for(const v of A)L[v.id]=await e4(v.id);r.innerHTML=`
          <div class="min-h-screen flex flex-col items-center justify-start p-4 sm:p-8 gap-4 overflow-y-auto">
            <h1 class="text-2xl sm:text-4xl font-bold text-white">📢 Events</h1>

            ${x.length>0?`
            <div class="bg-gray-800 p-4 rounded-lg w-full max-w-[600px]">
              <h2 class="text-lg font-bold text-white mb-3">🎮 Active Game Modes</h2>
              <div class="flex flex-wrap gap-2">
                ${x.map(v=>`
                  <div class="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                    <span class="text-xl">${v.icon}</span>
                    <span class="font-bold">${v.title}</span>
                  </div>
                `).join("")}
              </div>
              <p class="text-gray-400 text-sm mt-3">These modes are active for everyone in all games!</p>
            </div>
            `:""}

            ${_.length>0?`
            <div class="bg-gray-800 p-4 rounded-lg w-full max-w-[600px]">
              <h2 class="text-lg font-bold text-white mb-3">🎁 Rewards</h2>
              <div class="flex flex-col gap-3">
                ${_.map(v=>{const ee=v.claimedBy?.includes(Xt()?.uid||"")||!1;return`
                  <div class="bg-gray-700 p-4 rounded-lg">
                    <div class="flex items-center gap-3">
                      <span class="text-3xl">${v.icon}</span>
                      <div class="flex-1">
                        <div class="text-white font-bold">${v.title}</div>
                        <div class="text-gray-400 text-sm">${v.message}</div>
                        <div class="text-yellow-400 text-sm mt-1">
                          ${v.rewardType==="warBucks"?`💰 ${v.rewardAmount} War Bucks`:"🎁 Free Item"}
                        </div>
                      </div>
                      ${ee?'<span class="text-gray-400 font-bold text-sm">Claimed ✓</span>':`<button class="claim-event-btn bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded transition-colors" data-eventid="${v.id}">
                            Claim!
                          </button>`}
                    </div>
                  </div>
                `}).join("")}
              </div>
            </div>
            `:""}

            ${A.length>0?`
            <div class="bg-gray-800 p-4 rounded-lg w-full max-w-[600px]">
              <h2 class="text-lg font-bold text-white mb-3">📊 Polls</h2>
              <div class="flex flex-col gap-4">
                ${A.map(v=>{const ee=v.pollVotes?.[Xt()?.uid||""],C=ee!==void 0,S=L[v.id]||{},R=Object.values(S).reduce((Q,q)=>Q+q,0);return`
                  <div class="bg-gray-700 p-4 rounded-lg">
                    <div class="flex items-center gap-2 mb-3">
                      <span class="text-2xl">${v.icon}</span>
                      <span class="text-white font-bold">${v.title}</span>
                    </div>
                    <div class="flex flex-col gap-2">
                      ${(v.pollOptions||[]).map((Q,q)=>{const ce=S[String(q)]||0,Ie=R>0?Math.round(ce/R*100):0,We=ee===String(q);return C?`
                            <div class="relative">
                              <div class="bg-gray-600 rounded-lg overflow-hidden">
                                <div class="bg-purple-600 h-10 transition-all" style="width: ${Ie}%"></div>
                                <div class="absolute inset-0 flex items-center justify-between px-3">
                                  <span class="text-white font-medium ${We?"underline":""}">${Q} ${We?"✓":""}</span>
                                  <span class="text-white font-bold">${Ie}% (${ce})</span>
                                </div>
                              </div>
                            </div>
                          `:`
                            <button class="poll-vote-btn bg-gray-600 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded-lg text-left transition-colors" data-pollid="${v.id}" data-option="${q}">
                              ${Q}
                            </button>
                          `}).join("")}
                    </div>
                    ${C?`<div class="text-gray-400 text-sm mt-2">Total votes: ${R}</div>`:""}
                  </div>
                `}).join("")}
              </div>
            </div>
            `:""}

            ${I.length>0?`
            <div class="bg-gray-800 p-4 rounded-lg w-full max-w-[600px]">
              <h2 class="text-lg font-bold text-white mb-3">📣 Announcements</h2>
              <div class="flex flex-col gap-3">
                ${I.map(v=>`
                  <div class="bg-gray-700 p-4 rounded-lg">
                    <div class="flex items-center gap-3">
                      <span class="text-2xl">${v.icon}</span>
                      <div class="flex-1">
                        <div class="text-white font-bold">${v.title}</div>
                        <div class="text-gray-300 text-sm">${v.message}</div>
                        <div class="text-gray-500 text-xs mt-1">${new Date(v.createdAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </div>
                `).join("")}
              </div>
            </div>
            `:""}

            ${k.length===0?`
            <div class="bg-gray-800 p-8 rounded-lg text-center">
              <span class="text-4xl">📭</span>
              <p class="text-gray-400 mt-4">No active events right now.</p>
              <p class="text-gray-500 text-sm">Check back later for special events and rewards!</p>
            </div>
            `:""}

            <button id="events-back-btn" class="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded transition-colors mt-4">
              Back
            </button>
          </div>
        `,document.querySelectorAll(".claim-event-btn").forEach(v=>{v.addEventListener("click",async ee=>{const C=ee.target.dataset.eventid;C&&(await Kk(C)?(alert("Reward claimed!"),O()):alert("Could not claim reward."))})}),document.querySelectorAll(".poll-vote-btn").forEach(v=>{v.addEventListener("click",async ee=>{const C=ee.target.dataset.pollid,S=parseInt(ee.target.dataset.option||"0");C&&(await Xk(C,S)?O():alert("Could not vote."))})}),document.getElementById("events-back-btn")?.addEventListener("click",()=>{ye="profile",M()})};O();return}if(ye==="puzzles"){const O=Zt();(async()=>{const x=await d4();Qf=x;const _=I=>{switch(I){case"easy":return"bg-green-600";case"medium":return"bg-yellow-600";case"hard":return"bg-red-600";default:return"bg-gray-600"}},A=I=>{switch(I){case"easy":return"⭐";case"medium":return"⭐⭐";case"hard":return"⭐⭐⭐";default:return"⭐"}};r.innerHTML=`
          <div class="flex flex-col items-center justify-center min-h-screen p-4 gap-6">
            <h1 class="text-2xl sm:text-4xl font-bold text-white">🧩 Daily Puzzles</h1>

            <!-- Puzzle Stats -->
            <div class="bg-gray-800 rounded-lg p-4 w-full max-w-md">
              <div class="grid grid-cols-4 gap-4 text-center">
                <div>
                  <div class="text-2xl font-bold text-green-400">${O?.puzzleStats?.puzzlesSolved||0}</div>
                  <div class="text-gray-400 text-xs">Solved</div>
                </div>
                <div>
                  <div class="text-2xl font-bold text-yellow-400">${O?.puzzleStats?.perfectSolves||0}</div>
                  <div class="text-gray-400 text-xs">Perfect</div>
                </div>
                <div>
                  <div class="text-2xl font-bold text-orange-400">🔥 ${O?.puzzleStats?.dailyStreak||0}</div>
                  <div class="text-gray-400 text-xs">Streak</div>
                </div>
                <div>
                  <div class="text-2xl font-bold text-blue-400">${O?.puzzleStats?.puzzlesAttempted||0}</div>
                  <div class="text-gray-400 text-xs">Attempted</div>
                </div>
              </div>
            </div>

            <!-- Daily Puzzles -->
            <div class="bg-gray-800 rounded-lg p-4 w-full max-w-2xl">
              <h2 class="text-lg font-bold text-white mb-4">Today's Puzzles</h2>
              ${x.length===0?`
                <div class="text-center py-8">
                  <div class="text-4xl mb-4">🧩</div>
                  <p class="text-gray-400">No puzzles available yet.</p>
                  <p class="text-gray-500 text-sm mt-2">Check back soon for new puzzles!</p>
                </div>
              `:`
                <div class="grid gap-4">
                  ${x.map((I,L)=>{const v=O?.puzzleStats?.solvedPuzzleIds?.includes(I.id);return`
                      <div class="bg-gray-700 rounded-lg p-4 flex items-center justify-between ${v?"opacity-60":""}">
                        <div class="flex items-center gap-4">
                          <div class="text-3xl">${I.icon||"🧩"}</div>
                          <div>
                            <h3 class="text-white font-bold">${I.name||`Puzzle ${L+1}`}</h3>
                            <p class="text-gray-400 text-sm">${I.objective}</p>
                            <div class="flex gap-2 mt-1">
                              <span class="${_(I.difficulty)} text-white text-xs px-2 py-1 rounded">${A(I.difficulty)} ${I.difficulty}</span>
                              <span class="bg-gray-600 text-gray-300 text-xs px-2 py-1 rounded">${I.maxMoves} moves</span>
                              <span class="bg-yellow-600 text-white text-xs px-2 py-1 rounded">💰 ${I.rewards.warBucks}</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          ${v?`
                            <span class="text-green-400 font-bold">✓ Solved</span>
                          `:`
                            <button class="puzzle-play-btn bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded" data-puzzleid="${I.id}">
                              Play
                            </button>
                          `}
                        </div>
                      </div>
                    `}).join("")}
                </div>
              `}
            </div>

            <!-- How to Play -->
            <div class="bg-gray-800 rounded-lg p-4 w-full max-w-2xl">
              <h2 class="text-lg font-bold text-white mb-3">How to Play</h2>
              <div class="grid sm:grid-cols-3 gap-4 text-center">
                <div class="bg-gray-700 rounded-lg p-3">
                  <div class="text-2xl mb-2">🎯</div>
                  <p class="text-gray-300 text-sm">Complete the objective within the move limit</p>
                </div>
                <div class="bg-gray-700 rounded-lg p-3">
                  <div class="text-2xl mb-2">⚡</div>
                  <p class="text-gray-300 text-sm">First try = max reward, each retry = less reward</p>
                </div>
                <div class="bg-gray-700 rounded-lg p-3">
                  <div class="text-2xl mb-2">🔥</div>
                  <p class="text-gray-300 text-sm">Solve daily puzzles to build your streak!</p>
                </div>
              </div>
            </div>

            <button id="puzzles-back-btn" class="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded transition-colors">
              Back
            </button>
          </div>
        `,document.querySelectorAll(".puzzle-play-btn").forEach(I=>{I.addEventListener("click",async L=>{const v=L.target.dataset.puzzleid;if(v){const ee=Qf.find(C=>C.id===v);ee&&m0(ee)}})}),document.getElementById("puzzles-back-btn")?.addEventListener("click",()=>{ye="profile",M()})})();return}if(ye==="tournaments"){const O=Zt(),k=async()=>{const _=await $4(),A=v=>{const ee=new Date(v);return ee.toLocaleDateString()+" "+ee.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})},I=v=>{switch(v){case"registration":return"bg-green-600";case"starting":return"bg-yellow-600";case"in_progress":return"bg-blue-600";case"finished":return"bg-gray-600";default:return"bg-gray-600"}},L=v=>{switch(v){case"registration":return"Open for Registration";case"starting":return"Starting Soon";case"in_progress":return"In Progress";case"finished":return"Finished";default:return v}};r.innerHTML=`
          <div class="min-h-screen flex flex-col items-center justify-start p-4 sm:p-8 gap-4 overflow-y-auto">
            <h1 class="text-2xl sm:text-4xl font-bold text-white">🏆 Tournaments</h1>

            ${O?`<div class="text-blue-400 font-bold">👤 ${O.username}</div>`:""}

            ${_.length>0?`
              <div class="w-full max-w-[700px] flex flex-col gap-4">
                ${_.map(v=>{const ee=v.registeredPlayers.some(R=>R.odataId===Xt()?.uid),C=v.currentPlayers>=v.maxPlayers,S=v.status==="registration"&&!ee&&!C;return`
                    <div class="bg-gray-800 p-4 rounded-lg">
                      <div class="flex items-start justify-between gap-4">
                        <div class="flex items-center gap-3">
                          <span class="text-4xl">${v.icon}</span>
                          <div>
                            <h3 class="text-white font-bold text-lg">${v.name}</h3>
                            <p class="text-gray-400 text-sm">${v.description}</p>
                          </div>
                        </div>
                        <span class="${I(v.status)} text-white text-xs px-2 py-1 rounded font-bold">
                          ${L(v.status)}
                        </span>
                      </div>

                      <div class="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
                        <div class="bg-gray-700 p-2 rounded text-center">
                          <div class="text-gray-400">Players</div>
                          <div class="text-white font-bold">${v.currentPlayers}/${v.maxPlayers}</div>
                        </div>
                        <div class="bg-gray-700 p-2 rounded text-center">
                          <div class="text-gray-400">Starts</div>
                          <div class="text-white font-bold text-xs">${A(v.startTime)}</div>
                        </div>
                        <div class="bg-gray-700 p-2 rounded text-center">
                          <div class="text-gray-400">1st Prize</div>
                          <div class="text-yellow-400 font-bold">💰 ${v.prizes.first.warBucks}</div>
                        </div>
                        <div class="bg-gray-700 p-2 rounded text-center">
                          <div class="text-gray-400">Timer</div>
                          <div class="text-white font-bold">${v.timerEnabled?v.timerMinutes+"min":"Off"}</div>
                        </div>
                      </div>

                      <div class="mt-4 flex gap-2">
                        ${S?`
                          <button class="tournament-register-btn bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded flex-1" data-tournamentid="${v.id}">
                            Register
                          </button>
                        `:""}
                        ${ee&&v.status==="registration"?`
                          <button class="tournament-unregister-btn bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded flex-1" data-tournamentid="${v.id}">
                            Unregister
                          </button>
                        `:""}
                        ${ee&&v.status!=="registration"?`
                          <span class="bg-blue-600 text-white font-bold py-2 px-4 rounded flex-1 text-center">
                            ✓ Registered
                          </span>
                        `:""}
                        ${C&&!ee?`
                          <span class="bg-gray-600 text-gray-400 font-bold py-2 px-4 rounded flex-1 text-center">
                            Full
                          </span>
                        `:""}
                        <button class="tournament-view-btn bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded" data-tournamentid="${v.id}">
                          View Bracket
                        </button>
                      </div>

                      ${ee?`
                        <div class="mt-2 text-green-400 text-sm text-center">✓ You are registered for this tournament</div>
                      `:""}
                    </div>
                  `}).join("")}
              </div>
            `:`
              <div class="bg-gray-800 p-8 rounded-lg text-center">
                <span class="text-4xl">🏆</span>
                <p class="text-gray-400 mt-4">No active tournaments right now.</p>
                <p class="text-gray-500 text-sm">Check back later for upcoming tournaments!</p>
              </div>
            `}

            <button id="tournaments-back-btn" class="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded transition-colors mt-4">
              Back
            </button>
          </div>
        `,document.querySelectorAll(".tournament-register-btn").forEach(v=>{v.addEventListener("click",async ee=>{const C=ee.currentTarget.dataset.tournamentid;if(C){const S=await y4(C);S.success?(alert("Successfully registered!"),k()):alert(S.error||"Could not register")}})}),document.querySelectorAll(".tournament-unregister-btn").forEach(v=>{v.addEventListener("click",async ee=>{const C=ee.currentTarget.dataset.tournamentid;C&&confirm("Unregister from this tournament?")&&(await w4(C)?k():alert("Could not unregister"))})}),document.querySelectorAll(".tournament-view-btn").forEach(v=>{v.addEventListener("click",async ee=>{const C=ee.currentTarget.dataset.tournamentid;C&&await x(C)})}),document.getElementById("tournaments-back-btn")?.addEventListener("click",()=>{ye="profile",M()})},x=async _=>{const A=await Wg(_);if(!A)return;const I=await Qg(_);an=await b4(_);const L={};I.forEach(ee=>{L[ee.round]||(L[ee.round]=[]),L[ee.round].push(ee)});const v={1:"Finals",2:"Semi-Finals",3:"Quarter-Finals",4:"Round of 16",5:"Round of 32"};r.innerHTML=`
          <div class="min-h-screen flex flex-col items-center justify-start p-4 sm:p-8 gap-4 overflow-y-auto">
            <h1 class="text-2xl sm:text-4xl font-bold text-white">${A.icon} ${A.name}</h1>
            <p class="text-gray-400">${A.description}</p>

            <div class="flex items-center gap-4 text-sm">
              <span class="bg-gray-700 px-3 py-1 rounded text-white">👥 ${A.currentPlayers}/${A.maxPlayers}</span>
              <span class="bg-${A.status==="in_progress"?"blue":A.status==="registration"?"green":"gray"}-600 px-3 py-1 rounded text-white font-bold">
                ${A.status==="registration"?"Registration Open":A.status==="in_progress"?"In Progress":A.status}
              </span>
            </div>

            ${an?`
              <div class="bg-yellow-600 p-4 rounded-lg w-full max-w-[500px] text-center">
                <div class="text-white font-bold text-lg">🎮 Your match is ready!</div>
                <div class="text-yellow-200 mt-2">
                  vs ${an.player1Id===Xt()?.uid?an.player2Username:an.player1Username}
                </div>
                <button id="start-tournament-match" class="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-6 rounded mt-3">
                  Start Match
                </button>
              </div>
            `:""}

            ${A.status==="in_progress"||A.status==="finished"?`
              <div class="w-full max-w-[800px] overflow-x-auto">
                <div class="flex gap-4 min-w-max p-4">
                  ${Object.keys(L).sort((ee,C)=>Number(C)-Number(ee)).map(ee=>{const C=Number(ee),S=L[C]||[];return`
                      <div class="flex flex-col gap-2 min-w-[200px]">
                        <h3 class="text-white font-bold text-center mb-2">${v[C]||"Round "+C}</h3>
                        ${S.map(R=>`
                            <div class="bg-gray-800 rounded-lg p-3 ${R.player1Id===Xt()?.uid||R.player2Id===Xt()?.uid?"ring-2 ring-yellow-400":""}">
                              <div class="flex items-center gap-2 ${R.winnerId===R.player1Id?"text-green-400 font-bold":"text-white"}">
                                ${R.player1Username||"TBD"}
                                ${R.winnerId===R.player1Id?" 🏆":""}
                              </div>
                              <div class="text-gray-500 text-center text-xs my-1">vs</div>
                              <div class="flex items-center gap-2 ${R.winnerId===R.player2Id?"text-green-400 font-bold":"text-white"}">
                                ${R.player2Username||"TBD"}
                                ${R.winnerId===R.player2Id?" 🏆":""}
                              </div>
                              <div class="text-xs text-center mt-2 ${R.status==="ready"?"text-yellow-400":R.status==="playing"?"text-blue-400":R.status==="finished"?"text-green-400":"text-gray-500"}">
                                ${R.status==="ready"?"⏳ Ready":R.status==="playing"?"🎮 Playing":R.status==="finished"?"✓ Complete":R.status==="bye"?"Bye":"Pending"}
                              </div>
                            </div>
                          `).join("")}
                      </div>
                    `}).join("")}
                </div>
              </div>
            `:`
              <div class="bg-gray-800 p-6 rounded-lg w-full max-w-[500px] text-center">
                <div class="text-gray-400">Tournament hasn't started yet</div>
                <div class="text-white mt-2">Registered Players:</div>
                <div class="flex flex-wrap gap-2 justify-center mt-3">
                  ${A.registeredPlayers.map(ee=>`
                    <span class="bg-gray-700 text-white px-3 py-1 rounded text-sm">${ee.odataUsername}</span>
                  `).join("")}
                </div>
              </div>
            `}

            ${A.winnerId?`
              <div class="bg-yellow-600 p-6 rounded-lg w-full max-w-[500px] text-center">
                <div class="text-4xl">🏆</div>
                <div class="text-white font-bold text-xl mt-2">${A.winnerUsername} Wins!</div>
                <div class="text-yellow-200">Prize: 💰 ${A.prizes.first.warBucks} War Bucks</div>
              </div>
            `:""}

            <button id="bracket-back-btn" class="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded transition-colors mt-4">
              Back to Tournaments
            </button>
          </div>
        `,document.getElementById("start-tournament-match")?.addEventListener("click",async()=>{if(an){const ee=await v4(an.id);ee?(Ne=ee,await fc(ee),Ta(ee,C=>{C&&(wn=C,Ae=Gf(C),(C.status==="playing"||C.yellowJoined&&C.greenJoined)&&!mr?bc():mr||M())}),M()):alert("Could not start match")}}),document.getElementById("bracket-back-btn")?.addEventListener("click",()=>{an=null,k()})};k();return}if(ye==="admin"){if(!Be()){ye="profile",M();return}let O="users",k="",x=!1,_=null;const A=async()=>{const I=await qk(),L=await jk(),v=k?I.filter(C=>C.username.toLowerCase().includes(k.toLowerCase())||C.email.toLowerCase().includes(k.toLowerCase())):I,ee=C=>O===C?"bg-blue-600 text-white":"bg-gray-700 text-gray-300 hover:bg-gray-600";r.innerHTML=`
          <div class="min-h-screen flex flex-col items-center justify-start p-4 sm:p-8 gap-4 overflow-y-auto">
            <h1 class="text-2xl sm:text-4xl font-bold text-white">🔧 Admin Panel</h1>

            <!-- Tabs -->
            <div class="flex flex-wrap gap-2">
              <button id="tab-users" class="${ee("users")} font-bold py-2 px-4 rounded transition-colors">
                👥 Users
              </button>
              <button id="tab-events" class="${ee("events")} font-bold py-2 px-4 rounded transition-colors">
                📢 Events
              </button>
              <button id="tab-puzzles" class="${ee("puzzles")} font-bold py-2 px-4 rounded transition-colors">
                🧩 Puzzles
              </button>
              <button id="tab-system" class="${ee("system")} font-bold py-2 px-4 rounded transition-colors">
                🖥️ System
              </button>
            </div>

            <div class="w-full max-w-[800px] flex flex-col gap-4">
              ${O==="users"?`
                <!-- Users Tab -->
                <div class="w-full">
                  <input type="text" id="admin-search" placeholder="Search users..."
                    class="w-full bg-gray-700 text-white px-4 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none mb-4"
                    value="${k}">
                </div>
                <div class="bg-gray-800 p-4 rounded-lg">
                  <h2 class="text-lg font-bold text-white mb-4">👥 Users (${v.length}${k?` of ${I.length}`:""})</h2>
                  ${v.length===0?`
                    <div class="text-gray-400 text-center py-4">
                      ${k?"No users found.":"No users found. Check Firebase rules."}
                    </div>
                  `:`
                    <div class="flex flex-col gap-3 max-h-[60vh] overflow-y-auto">
                      ${v.map(C=>{const S=_===C.odataId,R=C.purchasedItems?.length||0,Q=C.stats||{gamesPlayed:0,gamesWon:0,piecesEliminated:0};return`
                        <div class="bg-gray-700 rounded-lg">
                          <div class="p-3 flex flex-col sm:flex-row sm:items-center gap-2 cursor-pointer admin-user-expand" data-userid="${C.odataId}">
                            <div class="flex-1">
                              <div class="flex items-center gap-2">
                                <span class="text-white font-bold">${C.username}</span>
                                ${C.isAdmin?'<span class="text-red-400 text-xs bg-red-900/50 px-2 py-0.5 rounded">ADMIN</span>':""}
                                <span class="text-gray-500 text-xs">${S?"▼":"▶"}</span>
                              </div>
                              <div class="text-gray-400 text-xs">${C.email}</div>
                              <div class="flex gap-3 text-xs mt-1">
                                <span class="text-yellow-400">💰 ${C.warBucks||0}</span>
                                <span class="text-blue-400">🎮 ${Q.gamesPlayed} games</span>
                                <span class="text-green-400">🏆 ${Q.gamesWon} wins</span>
                                <span class="text-purple-400">🛒 ${R} items</span>
                              </div>
                            </div>
                            <div class="flex flex-wrap gap-1">
                              <button class="admin-give-bucks bg-yellow-600 hover:bg-yellow-500 text-white text-xs py-1 px-2 rounded" data-userid="${C.odataId}">+100💰</button>
                              <button class="admin-give-all-items bg-purple-600 hover:bg-purple-500 text-white text-xs py-1 px-2 rounded" data-userid="${C.odataId}">All Items</button>
                              ${C.isAdmin?`<button class="admin-remove-admin bg-gray-600 hover:bg-gray-500 text-white text-xs py-1 px-2 rounded" data-userid="${C.odataId}">-Admin</button>`:`<button class="admin-make-admin bg-red-600 hover:bg-red-500 text-white text-xs py-1 px-2 rounded" data-userid="${C.odataId}">+Admin</button>`}
                              <button class="admin-delete-user bg-red-800 hover:bg-red-700 text-white text-xs py-1 px-2 rounded" data-userid="${C.odataId}" data-username="${C.username}">🗑️</button>
                            </div>
                          </div>
                          ${S?`
                          <div class="bg-gray-800 p-3 border-t border-gray-600">
                            <!-- Custom War Bucks -->
                            <div class="flex flex-wrap items-center gap-2 mb-3">
                              <span class="text-white text-sm">💰 Give War Bucks:</span>
                              <input type="number" class="admin-custom-bucks-input bg-gray-600 text-white px-2 py-1 rounded w-24 text-sm" placeholder="Amount" data-userid="${C.odataId}">
                              <button class="admin-custom-bucks-btn bg-yellow-600 hover:bg-yellow-500 text-white text-xs py-1 px-2 rounded" data-userid="${C.odataId}">Give</button>
                              <button class="admin-take-bucks-btn bg-red-600 hover:bg-red-500 text-white text-xs py-1 px-2 rounded" data-userid="${C.odataId}">Take</button>
                            </div>
                            <!-- Give Specific Item -->
                            <div class="flex flex-wrap items-center gap-2 mb-3">
                              <span class="text-white text-sm">🎁 Give Item:</span>
                              <select class="admin-item-select bg-gray-600 text-white px-2 py-1 rounded text-sm" data-userid="${C.odataId}">
                                <option value="">Select item...</option>
                                <optgroup label="🎨 Themes">
                                  ${Pe.filter(q=>q.type==="theme").map(q=>`<option value="${q.id}" ${C.purchasedItems?.includes(q.id)?"disabled":""}>${q.icon} ${q.name}${C.purchasedItems?.includes(q.id)?" ✓":""}</option>`).join("")}
                                </optgroup>
                                <optgroup label="⚔️ Skins">
                                  ${Pe.filter(q=>q.type==="piece_skin").map(q=>`<option value="${q.id}" ${C.purchasedItems?.includes(q.id)?"disabled":""}>${q.icon} ${q.name}${C.purchasedItems?.includes(q.id)?" ✓":""}</option>`).join("")}
                                </optgroup>
                                <optgroup label="✨ Effects">
                                  ${Pe.filter(q=>q.type==="effect").map(q=>`<option value="${q.id}" ${C.purchasedItems?.includes(q.id)?"disabled":""}>${q.icon} ${q.name}${C.purchasedItems?.includes(q.id)?" ✓":""}</option>`).join("")}
                                </optgroup>
                                <optgroup label="🔊 Sound Packs">
                                  ${Pe.filter(q=>q.type==="sound_pack").map(q=>`<option value="${q.id}" ${C.purchasedItems?.includes(q.id)?"disabled":""}>${q.icon} ${q.name}${C.purchasedItems?.includes(q.id)?" ✓":""}</option>`).join("")}
                                </optgroup>
                                <optgroup label="🎵 Music Packs">
                                  ${Pe.filter(q=>q.type==="music_pack").map(q=>`<option value="${q.id}" ${C.purchasedItems?.includes(q.id)?"disabled":""}>${q.icon} ${q.name}${C.purchasedItems?.includes(q.id)?" ✓":""}</option>`).join("")}
                                </optgroup>
                              </select>
                              <button class="admin-give-item-btn bg-purple-600 hover:bg-purple-500 text-white text-xs py-1 px-2 rounded" data-userid="${C.odataId}">Give</button>
                            </div>
                            <!-- User Stats -->
                            <div class="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-3">
                              <div class="bg-gray-700 p-2 rounded text-center">
                                <div class="text-lg font-bold text-white">${Q.gamesPlayed}</div>
                                <div class="text-gray-400 text-xs">Games</div>
                              </div>
                              <div class="bg-gray-700 p-2 rounded text-center">
                                <div class="text-lg font-bold text-green-400">${Q.gamesWon}</div>
                                <div class="text-gray-400 text-xs">Wins</div>
                              </div>
                              <div class="bg-gray-700 p-2 rounded text-center">
                                <div class="text-lg font-bold text-red-400">${Q.gamesLost||0}</div>
                                <div class="text-gray-400 text-xs">Losses</div>
                              </div>
                              <div class="bg-gray-700 p-2 rounded text-center">
                                <div class="text-lg font-bold text-orange-400">${Q.piecesEliminated}</div>
                                <div class="text-gray-400 text-xs">Kills</div>
                              </div>
                              <div class="bg-gray-700 p-2 rounded text-center">
                                <div class="text-lg font-bold text-blue-400">${Q.totalPointsScored||0}</div>
                                <div class="text-gray-400 text-xs">Points</div>
                              </div>
                              <div class="bg-gray-700 p-2 rounded text-center">
                                <div class="text-lg font-bold text-purple-400">${Math.floor((Q.timePlayed||0)/60)}m</div>
                                <div class="text-gray-400 text-xs">Playtime</div>
                              </div>
                            </div>
                            <!-- Owned Items Preview -->
                            <div class="mb-2">
                              <span class="text-white text-sm">Owned Items:</span>
                              <div class="flex flex-wrap gap-1 mt-1">
                                ${(C.purchasedItems||[]).length===0?'<span class="text-gray-500 text-xs">No items owned</span>':(C.purchasedItems||[]).slice(0,10).map(q=>{const ce=Pe.find(Ie=>Ie.id===q);return ce?`<span class="bg-gray-600 px-2 py-0.5 rounded text-xs" title="${ce.name}">${ce.icon}</span>`:""}).join("")+((C.purchasedItems||[]).length>10?`<span class="text-gray-400 text-xs">+${(C.purchasedItems||[]).length-10} more</span>`:"")}
                              </div>
                            </div>
                            <!-- Reset / Danger -->
                            <div class="flex gap-2 mt-3 pt-3 border-t border-gray-600">
                              <button class="admin-reset-user bg-orange-600 hover:bg-orange-500 text-white text-xs py-1 px-2 rounded" data-userid="${C.odataId}">Reset Stats</button>
                              <button class="admin-reset-items bg-orange-700 hover:bg-orange-600 text-white text-xs py-1 px-2 rounded" data-userid="${C.odataId}">Reset Items</button>
                              <button class="admin-reset-bucks bg-orange-800 hover:bg-orange-700 text-white text-xs py-1 px-2 rounded" data-userid="${C.odataId}">Reset Bucks</button>
                            </div>
                          </div>
                          `:""}
                        </div>
                      `}).join("")}
                    </div>
                  `}
                </div>
                <!-- Global User Actions -->
                <div class="bg-gray-800 p-4 rounded-lg">
                  <h2 class="text-lg font-bold text-white mb-3">🌐 Global Actions</h2>
                  <div class="flex flex-wrap gap-2">
                    <button id="admin-give-all-bucks" class="bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-2 px-3 rounded text-sm">Everyone +100💰</button>
                    <button id="admin-give-all-bucks-1000" class="bg-yellow-700 hover:bg-yellow-600 text-white font-bold py-2 px-3 rounded text-sm">Everyone +1000💰</button>
                  </div>
                </div>
              `:""}

              ${O==="events"?`
                <!-- Events Tab -->
                <div class="bg-gray-800 p-4 rounded-lg">
                  <div class="flex justify-between items-center mb-4">
                    <h2 class="text-lg font-bold text-white">📢 Events (${L.length})</h2>
                    <div class="flex gap-2">
                      <button id="create-sample-events" class="bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-4 rounded text-sm">
                        🎮 Sample Events
                      </button>
                      <button id="toggle-create-event" class="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded text-sm">
                        ${x?"✕ Cancel":"+ New Event"}
                      </button>
                    </div>
                  </div>

                  ${x?`
                    <div class="bg-gray-700 p-4 rounded-lg mb-4">
                      <h3 class="text-white font-bold mb-3">Create New Event</h3>
                      <div class="flex flex-col gap-3">
                        <select id="event-type" class="bg-gray-600 text-white px-3 py-2 rounded">
                          <option value="announcement">📢 Announcement</option>
                          <option value="event">🎉 Event</option>
                          <option value="reward">🎁 Reward</option>
                          <option value="maintenance">🔧 Maintenance</option>
                          <option value="update">🆕 Update</option>
                          <option value="gamemode">🎮 Game Mode</option>
                        </select>
                        <div id="gamemode-select-container" class="hidden">
                          <label class="text-white text-sm mb-1 block">Select Game Mode:</label>
                          <select id="event-gamemode" class="bg-gray-600 text-white px-3 py-2 rounded w-full">
                            ${Object.entries(ia).map(([C,S])=>`<option value="${C}">${S.icon} ${S.name} - ${S.description}</option>`).join("")}
                          </select>
                        </div>
                        <input type="text" id="event-title" placeholder="Event title..." class="bg-gray-600 text-white px-3 py-2 rounded">
                        <textarea id="event-message" placeholder="Event message..." class="bg-gray-600 text-white px-3 py-2 rounded h-20"></textarea>
                        <div class="flex gap-2 items-center">
                          <label class="text-white text-sm">Reward:</label>
                          <select id="event-reward-type" class="bg-gray-600 text-white px-2 py-1 rounded text-sm">
                            <option value="">No reward</option>
                            <option value="warBucks">War Bucks</option>
                            <option value="item">Item</option>
                          </select>
                          <input type="number" id="event-reward-amount" placeholder="Amount" class="bg-gray-600 text-white px-2 py-1 rounded w-20 text-sm">
                        </div>
                        <button id="create-event-btn" class="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded">Create Event</button>
                      </div>
                    </div>
                  `:""}

                  <div class="flex flex-col gap-3 max-h-[50vh] overflow-y-auto">
                    ${L.length===0?`
                      <div class="text-gray-400 text-center py-4">No events yet.</div>
                    `:L.map(C=>`
                      <div class="bg-gray-700 p-3 rounded-lg ${C.active?"":"opacity-50"}">
                        <div class="flex justify-between items-start">
                          <div>
                            <div class="flex items-center gap-2">
                              <span class="text-xl">${C.icon||"📢"}</span>
                              <span class="text-white font-bold">${C.title}</span>
                              <span class="text-xs ${C.active?"text-green-400":"text-gray-400"}">${C.active?"Active":"Inactive"}</span>
                            </div>
                            <div class="text-gray-300 text-sm mt-1">${C.message}</div>
                            <div class="text-gray-400 text-xs mt-1">By ${C.createdBy} • ${new Date(C.createdAt).toLocaleDateString()}</div>
                            ${C.rewardType?`<div class="text-yellow-400 text-xs">Reward: ${C.rewardType==="warBucks"?`${C.rewardAmount}💰`:"Item"} • Claimed: ${C.claimedBy?.length||0}</div>`:""}
                          </div>
                          <div class="flex gap-1">
                            <button class="toggle-event-btn ${C.active?"bg-gray-600":"bg-green-600"} hover:opacity-80 text-white text-xs py-1 px-2 rounded" data-eventid="${C.id}" data-active="${C.active}">
                              ${C.active?"Disable":"Enable"}
                            </button>
                            <button class="delete-event-btn bg-red-600 hover:bg-red-500 text-white text-xs py-1 px-2 rounded" data-eventid="${C.id}">Delete</button>
                          </div>
                        </div>
                      </div>
                    `).join("")}
                  </div>
                </div>
              `:""}

              ${O==="puzzles"?`
                <!-- Puzzles Tab -->
                <div class="bg-gray-800 p-4 rounded-lg">
                  <div class="flex justify-between items-center mb-4">
                    <h2 class="text-lg font-bold text-white">🧩 Puzzles</h2>
                    <button id="create-sample-puzzles" class="bg-orange-600 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded text-sm">
                      🎮 Create Sample Puzzles
                    </button>
                  </div>
                  <div id="puzzles-list" class="flex flex-col gap-3 max-h-[50vh] overflow-y-auto">
                    <div class="text-gray-400 text-center py-4">Loading puzzles...</div>
                  </div>
                </div>
              `:""}

              ${O==="system"?`
                <!-- System Tab -->
                <div class="bg-gray-800 p-4 rounded-lg">
                  <h2 class="text-lg font-bold text-white mb-4">🖥️ System Stats</h2>
                  <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div class="bg-gray-700 p-4 rounded-lg text-center">
                      <div class="text-3xl font-bold text-white">${I.length}</div>
                      <div class="text-gray-400 text-sm">Total Users</div>
                    </div>
                    <div class="bg-gray-700 p-4 rounded-lg text-center">
                      <div class="text-3xl font-bold text-red-400">${I.filter(C=>C.isAdmin).length}</div>
                      <div class="text-gray-400 text-sm">Admins</div>
                    </div>
                    <div class="bg-gray-700 p-4 rounded-lg text-center">
                      <div class="text-3xl font-bold text-green-400">${L.filter(C=>C.active).length}</div>
                      <div class="text-gray-400 text-sm">Active Events</div>
                    </div>
                    <div class="bg-gray-700 p-4 rounded-lg text-center">
                      <div class="text-3xl font-bold text-yellow-400">${I.reduce((C,S)=>C+(S.warBucks||0),0)}</div>
                      <div class="text-gray-400 text-sm">Total War Bucks</div>
                    </div>
                  </div>
                </div>
                <div class="bg-gray-800 p-4 rounded-lg">
                  <h2 class="text-lg font-bold text-white mb-4">🎮 Active Game Modes</h2>
                  <div class="flex flex-wrap gap-2">
                    ${L.filter(C=>C.active&&C.type==="gamemode"&&C.gameMode).map(C=>`<span class="bg-purple-600 text-white px-3 py-1 rounded-full text-sm">${ia[C.gameMode]?.icon||"🎮"} ${ia[C.gameMode]?.name||C.gameMode}</span>`).join("")||'<span class="text-gray-400">No active game modes</span>'}
                  </div>
                </div>
                <div class="bg-gray-800 p-4 rounded-lg">
                  <h2 class="text-lg font-bold text-white mb-4">💰 Global Rewards</h2>
                  <div class="flex flex-wrap gap-2">
                    <button id="admin-give-all-bucks-sys" class="bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded text-sm">Give All +100💰</button>
                    <button id="admin-give-all-bucks-500" class="bg-yellow-700 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded text-sm">Give All +500💰</button>
                    <button id="admin-give-all-items-sys" class="bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-4 rounded text-sm">Give All Items to Everyone</button>
                  </div>
                </div>
                <div class="bg-gray-800 p-4 rounded-lg">
                  <h2 class="text-lg font-bold text-white mb-4">📢 Global Message</h2>
                  <p class="text-gray-400 text-sm mb-3">Send a popup message to ALL players</p>
                  <div class="flex flex-col gap-3">
                    <textarea id="global-msg-text" placeholder="Your message to all players..." class="bg-gray-600 text-white px-3 py-2 rounded h-20"></textarea>
                    <div class="flex gap-2">
                      <select id="global-msg-type" class="bg-gray-600 text-white px-3 py-2 rounded">
                        <option value="info">📢 Info</option>
                        <option value="success">✅ Success</option>
                        <option value="warning">⚠️ Warning</option>
                        <option value="error">❌ Error</option>
                      </select>
                      <select id="global-msg-duration" class="bg-gray-600 text-white px-3 py-2 rounded">
                        <option value="60">1 hour</option>
                        <option value="180">3 hours</option>
                        <option value="720">12 hours</option>
                        <option value="1440">24 hours</option>
                      </select>
                    </div>
                    <button id="send-global-msg" class="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded">Send to Everyone</button>
                  </div>
                </div>
                <div class="bg-gray-800 p-4 rounded-lg">
                  <h2 class="text-lg font-bold text-white mb-4">📊 Create Poll</h2>
                  <p class="text-gray-400 text-sm mb-3">Create a vote for all players</p>
                  <div class="flex flex-col gap-3">
                    <input type="text" id="poll-question" placeholder="Poll question..." class="bg-gray-600 text-white px-3 py-2 rounded">
                    <input type="text" id="poll-option-1" placeholder="Option 1" class="bg-gray-600 text-white px-3 py-2 rounded">
                    <input type="text" id="poll-option-2" placeholder="Option 2" class="bg-gray-600 text-white px-3 py-2 rounded">
                    <input type="text" id="poll-option-3" placeholder="Option 3 (optional)" class="bg-gray-600 text-white px-3 py-2 rounded">
                    <input type="text" id="poll-option-4" placeholder="Option 4 (optional)" class="bg-gray-600 text-white px-3 py-2 rounded">
                    <button id="create-poll" class="bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-4 rounded">Create Poll</button>
                  </div>
                </div>
                <div class="bg-gray-800 p-4 rounded-lg">
                  <h2 class="text-lg font-bold text-red-400 mb-4">⚠️ Danger Zone</h2>
                  <div class="flex flex-wrap gap-2">
                    <button id="admin-reset-all-stats" class="bg-orange-600 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded text-sm">Reset All User Stats</button>
                    <button id="admin-reset-all-bucks" class="bg-orange-700 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded text-sm">Reset All War Bucks</button>
                    <button id="admin-delete-all-events" class="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded text-sm">Delete All Events</button>
                    <button id="admin-delete-all-games" class="bg-red-700 hover:bg-red-600 text-white font-bold py-2 px-4 rounded text-sm">Clear All Games</button>
                    <button id="admin-delete-all-msgs" class="bg-red-800 hover:bg-red-700 text-white font-bold py-2 px-4 rounded text-sm">Delete All Messages</button>
                  </div>
                </div>
              `:""}
            </div>

            <button id="admin-back-btn" class="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded transition-colors mt-4">Back</button>
          </div>
        `,document.getElementById("tab-users")?.addEventListener("click",()=>{O="users",A()}),document.getElementById("tab-events")?.addEventListener("click",()=>{O="events",A()}),document.getElementById("tab-puzzles")?.addEventListener("click",()=>{O="puzzles",A()}),document.getElementById("tab-system")?.addEventListener("click",()=>{O="system",A()}),document.getElementById("admin-back-btn")?.addEventListener("click",()=>{ye="profile",M()}),document.getElementById("create-sample-puzzles")?.addEventListener("click",async()=>{const C=await g4();alert(`Created ${C} sample puzzles!`),A()}),O==="puzzles"&&p4().then(C=>{const S=document.getElementById("puzzles-list");S&&(C.length===0?S.innerHTML='<div class="text-gray-400 text-center py-4">No puzzles yet. Click "Create Sample Puzzles" to add some!</div>':(S.innerHTML=C.map(R=>`
                  <div class="bg-gray-700 p-3 rounded-lg flex justify-between items-center">
                    <div class="flex items-center gap-3">
                      <span class="text-2xl">${R.icon||"🧩"}</span>
                      <div>
                        <h3 class="text-white font-bold">${R.name}</h3>
                        <p class="text-gray-400 text-sm">${R.objective}</p>
                        <div class="flex gap-2 mt-1">
                          <span class="bg-${R.difficulty==="easy"?"green":R.difficulty==="medium"?"yellow":"red"}-600 text-white text-xs px-2 py-1 rounded">${R.difficulty}</span>
                          <span class="bg-gray-600 text-gray-300 text-xs px-2 py-1 rounded">${R.maxMoves} moves</span>
                          <span class="text-gray-400 text-xs">Solved: ${R.timesSolved}/${R.timesAttempted}</span>
                        </div>
                      </div>
                    </div>
                    <button class="admin-delete-puzzle bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded text-sm" data-puzzleid="${R.id}">
                      🗑️
                    </button>
                  </div>
                `).join(""),document.querySelectorAll(".admin-delete-puzzle").forEach(R=>{R.addEventListener("click",async Q=>{const q=Q.currentTarget.dataset.puzzleid;q&&confirm("Delete this puzzle?")&&(await m4(q),A())})})))}),document.querySelectorAll(".admin-user-expand").forEach(C=>{C.addEventListener("click",S=>{if(S.target.tagName==="BUTTON")return;const R=S.currentTarget.dataset.userid;R&&(_=_===R?null:R,A())})}),document.querySelectorAll(".admin-give-bucks").forEach(C=>{C.addEventListener("click",async S=>{S.stopPropagation();const R=S.currentTarget.dataset.userid;R&&(await pc(R,100),A())})}),document.querySelectorAll(".admin-give-all-items").forEach(C=>{C.addEventListener("click",async S=>{S.stopPropagation();const R=S.currentTarget.dataset.userid;R&&confirm("Give ALL items?")&&(await Uk(R),A())})}),document.querySelectorAll(".admin-reset-user").forEach(C=>{C.addEventListener("click",async S=>{S.stopPropagation();const R=S.currentTarget.dataset.userid;R&&confirm("Reset user stats?")&&(await Hk(R),A())})}),document.querySelectorAll(".admin-custom-bucks-btn").forEach(C=>{C.addEventListener("click",async S=>{S.stopPropagation();const R=S.currentTarget.dataset.userid,Q=document.querySelector(`.admin-custom-bucks-input[data-userid="${R}"]`),q=parseInt(Q?.value||"0");R&&q>0?(await pc(R,q),Q.value="",A()):alert("Enter a valid amount")})}),document.querySelectorAll(".admin-take-bucks-btn").forEach(C=>{C.addEventListener("click",async S=>{S.stopPropagation();const R=S.currentTarget.dataset.userid,Q=document.querySelector(`.admin-custom-bucks-input[data-userid="${R}"]`),q=parseInt(Q?.value||"0");R&&q>0?(await pc(R,-q),Q.value="",A()):alert("Enter a valid amount")})}),document.querySelectorAll(".admin-give-item-btn").forEach(C=>{C.addEventListener("click",async S=>{S.stopPropagation();const R=S.currentTarget.dataset.userid,Q=document.querySelector(`.admin-item-select[data-userid="${R}"]`),q=Q?.value;R&&q?(await Gk(R,q),Q.value="",A()):alert("Select an item")})}),document.querySelectorAll(".admin-reset-items").forEach(C=>{C.addEventListener("click",async S=>{S.stopPropagation();const R=S.currentTarget.dataset.userid;R&&confirm("Remove ALL items from this user?")&&(await Uf(R,{purchasedItems:[],equippedItems:{theme:null,pieceSkin:null,effect:null,soundPack:null,musicPack:null}}),A())})}),document.querySelectorAll(".admin-reset-bucks").forEach(C=>{C.addEventListener("click",async S=>{S.stopPropagation();const R=S.currentTarget.dataset.userid;R&&confirm("Reset War Bucks to 0?")&&(await Uf(R,{warBucks:0}),A())})}),document.querySelectorAll(".admin-make-admin").forEach(C=>{C.addEventListener("click",async S=>{S.stopPropagation();const R=S.currentTarget.dataset.userid;R&&(await Hf(R,!0),A())})}),document.querySelectorAll(".admin-remove-admin").forEach(C=>{C.addEventListener("click",async S=>{S.stopPropagation();const R=S.currentTarget.dataset.userid;R&&(await Hf(R,!1),A())})}),document.querySelectorAll(".admin-delete-user").forEach(C=>{C.addEventListener("click",async S=>{S.stopPropagation();const R=S.currentTarget,Q=R.dataset.userid,q=R.dataset.username;if(Q&&confirm(`⚠️ DELETE user "${q}"? This cannot be undone!`)&&confirm("Are you REALLY sure? This will permanently delete the account!")){const ce=await a4(Q);alert(ce?`User "${q}" deleted successfully!`:"Failed to delete user. Check console for errors."),A()}})}),document.getElementById("admin-give-all-bucks")?.addEventListener("click",async()=>{if(confirm("Give +100 to ALL?")){const C=await na(100);alert(`Gave to ${C} users!`),A()}}),document.getElementById("admin-give-all-bucks-1000")?.addEventListener("click",async()=>{if(confirm("Give +1000 to ALL?")){const C=await na(1e3);alert(`Gave to ${C} users!`),A()}}),document.getElementById("admin-give-all-bucks-sys")?.addEventListener("click",async()=>{if(confirm("Give +100 to ALL?")){const C=await na(100);alert(`Gave to ${C} users!`),A()}}),document.getElementById("admin-give-all-bucks-500")?.addEventListener("click",async()=>{if(confirm("Give +500 to ALL?")){const C=await na(500);alert(`Gave to ${C} users!`),A()}}),document.getElementById("admin-give-all-items-sys")?.addEventListener("click",async()=>{if(confirm("Give ALL ITEMS to ALL users? This is a lot!")){const C=await s4();alert(`Gave all items to ${C} users!`),A()}}),document.getElementById("admin-reset-all-stats")?.addEventListener("click",async()=>{if(confirm("⚠️ RESET ALL USER STATS? This cannot be undone!")&&confirm("Are you REALLY sure?")){const C=await t4();alert(`Reset stats for ${C} users!`),A()}}),document.getElementById("admin-reset-all-bucks")?.addEventListener("click",async()=>{if(confirm("⚠️ RESET ALL WAR BUCKS TO 0? This cannot be undone!")&&confirm("Are you REALLY sure?")){const C=await r4();alert(`Reset war bucks for ${C} users!`),A()}}),document.getElementById("admin-delete-all-events")?.addEventListener("click",async()=>{if(confirm("⚠️ DELETE ALL EVENTS? This cannot be undone!")){const C=await n4();alert(`Deleted ${C} events!`),A()}}),document.getElementById("admin-delete-all-games")?.addEventListener("click",async()=>{if(confirm("⚠️ DELETE ALL GAMES? This will end all active games!")){const C=await i4();alert(`Deleted ${C} games!`),A()}}),document.getElementById("admin-delete-all-msgs")?.addEventListener("click",async()=>{if(confirm("⚠️ DELETE ALL GLOBAL MESSAGES?")){const C=await Jk();alert(`Deleted ${C} messages!`),A()}}),document.getElementById("send-global-msg")?.addEventListener("click",async()=>{const C=document.getElementById("global-msg-text").value,S=document.getElementById("global-msg-type").value,R=parseInt(document.getElementById("global-msg-duration").value);if(!C.trim()){alert("Please enter a message");return}await Yk(C,S,R)?(alert("Global message sent!"),document.getElementById("global-msg-text").value=""):alert("Failed to send message")}),document.getElementById("create-poll")?.addEventListener("click",async()=>{const C=document.getElementById("poll-question").value,S=document.getElementById("poll-option-1").value,R=document.getElementById("poll-option-2").value,Q=document.getElementById("poll-option-3").value,q=document.getElementById("poll-option-4").value;if(!C.trim()||!S.trim()||!R.trim()){alert("Question and at least 2 options required");return}const ce=[S,R];Q.trim()&&ce.push(Q),q.trim()&&ce.push(q),await jf({type:"poll",title:C,message:"Vote for your choice!",icon:"📊",active:!0,pollOptions:ce})?(alert("Poll created!"),document.getElementById("poll-question").value="",document.getElementById("poll-option-1").value="",document.getElementById("poll-option-2").value="",document.getElementById("poll-option-3").value="",document.getElementById("poll-option-4").value="",A()):alert("Failed to create poll")}),document.getElementById("admin-search")?.addEventListener("input",C=>{k=C.target.value,A()}),document.getElementById("toggle-create-event")?.addEventListener("click",()=>{x=!x,A()}),document.getElementById("create-sample-events")?.addEventListener("click",async()=>{if(confirm("Create sample events (game modes, rewards, announcements)?")){const C=await o4();alert(`Created ${C} sample events!`),A()}}),document.getElementById("event-type")?.addEventListener("change",C=>{const S=document.getElementById("gamemode-select-container");S&&S.classList.toggle("hidden",C.target.value!=="gamemode")}),document.getElementById("create-event-btn")?.addEventListener("click",async()=>{const C=document.getElementById("event-type").value,S=document.getElementById("event-title").value,R=document.getElementById("event-message").value,Q=document.getElementById("event-reward-type").value,q=parseInt(document.getElementById("event-reward-amount").value)||0,ce=document.getElementById("event-gamemode")?.value;if(!S||!R){alert("Title and message required!");return}await jf({type:C,title:S,message:R,icon:C==="gamemode"&&ce?ia[ce]?.icon||"🎮":{announcement:"📢",event:"🎉",reward:"🎁",maintenance:"🔧",update:"🆕",gamemode:"🎮"}[C]||"📢",active:!0,...Q&&q?{rewardType:Q,rewardAmount:q}:{},...C==="gamemode"&&ce?{gameMode:ce}:{}}),x=!1,A()}),document.querySelectorAll(".toggle-event-btn").forEach(C=>{C.addEventListener("click",async S=>{const R=S.currentTarget.dataset.eventid,Q=S.currentTarget.dataset.active==="true";R&&(await Qk(R,!Q),A())})}),document.querySelectorAll(".delete-event-btn").forEach(C=>{C.addEventListener("click",async S=>{const R=S.currentTarget.dataset.eventid;R&&confirm("Delete event?")&&(await Wk(R),A())})})};r.innerHTML='<div class="min-h-screen flex items-center justify-center"><div class="text-white text-xl">Loading...</div></div>',A();return}if(ye==="multiplayer"){const O=Zt();!Wn&&!Wc()&&(Wn=!0,Pk(),Lk(k=>{sa=k,M()}),Vk(k=>{oa=k,M()}),Dk(async k=>{k.status==="declined"?(aa=`${k.toUserId} ${E("inviteDeclined")}`,setTimeout(()=>{aa=null,M()},3e3),M()):k.status==="accepted"&&k.gameId&&(Ne=k.gameId,await fc(k.gameId),Ta(k.gameId,x=>{x&&(wn=x,Ae=Gf(x),(x.status==="playing"||x.yellowJoined&&x.greenJoined)&&!mr?bc():mr||M())}),mr||M())})),r.innerHTML=`
        <div class="min-h-screen flex flex-col items-center justify-start p-4 sm:p-8 gap-4 overflow-y-auto">
          <h1 class="text-2xl sm:text-4xl font-bold text-white">🌐 ${E("multiplayerTitle")}</h1>

          ${O?`
          <div class="text-blue-400 font-bold">👤 ${O.username}</div>
          <div class="${Wn?"text-green-400":"text-gray-400"} text-sm">
            ${Wn?"🟢 "+E("youAreOnline"):"⚫ "+E("youAreOfflineMulti")}
          </div>

          <!-- Cosmetics Quick Access -->
          <div class="flex gap-2">
            <button id="mp-shop-btn" class="bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-4 rounded flex items-center gap-2">
              🛒 ${E("shopTitle")}
            </button>
            <button id="mp-settings-btn" class="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded flex items-center gap-2">
              ⚙️ ${E("settingsButton")}
            </button>
          </div>

          <!-- Currently Equipped -->
          <div class="bg-gray-800 p-3 rounded-lg text-sm flex flex-wrap gap-2 justify-center">
            ${er?`<span class="bg-gray-700 px-2 py-1 rounded text-purple-300">🎨 ${Pe.find(k=>k.id===er)?.name||"Theme"}</span>`:""}
            ${gr?`<span class="bg-gray-700 px-2 py-1 rounded text-blue-300">⚔️ ${Pe.find(k=>k.id===gr)?.name||"Skin"}</span>`:""}
            ${dn?`<span class="bg-gray-700 px-2 py-1 rounded text-yellow-300">✨ ${Pe.find(k=>k.id===dn)?.name||"Effect"}</span>`:""}
            ${hn?`<span class="bg-gray-700 px-2 py-1 rounded text-green-300">🔊 ${Pe.find(k=>k.id===hn)?.name||"Sounds"}</span>`:""}
            ${Mr?`<span class="bg-gray-700 px-2 py-1 rounded text-red-300">🎵 ${Pe.find(k=>k.id===Mr)?.name||"Music"}</span>`:""}
            ${!er&&!gr&&!dn&&!hn&&!Mr?`<span class="text-gray-500">${E("noEquipped")||"No cosmetics equipped"}</span>`:""}
          </div>
          `:""}

          ${aa?`
          <div class="bg-red-600 text-white p-3 rounded text-sm">
            ❌ ${aa}
          </div>
          `:""}

          ${Ne?`
          <div class="bg-green-600 text-white p-4 rounded-lg text-center">
            ⏳ ${E("waitingForOpponent")}
          </div>
          `:""}

          <!-- Pending Invites -->
          ${oa.length>0?`
          <div class="bg-yellow-900 p-4 rounded-lg flex flex-col gap-3 w-full max-w-[400px]">
            <h2 class="text-lg font-bold text-yellow-200">📩 ${E("pendingInvites")}</h2>
            <div class="flex flex-col gap-2">
              ${oa.map(k=>`
                <div class="bg-yellow-800 p-3 rounded flex flex-col gap-2">
                  <span class="text-white">${E("inviteFrom")} <strong>${k.fromUsername}</strong></span>
                  <div class="flex gap-2">
                    <button class="accept-invite-btn bg-green-600 hover:bg-green-500 text-white px-3 py-1 rounded text-sm" data-id="${k.id}">
                      ${E("acceptInvite")}
                    </button>
                    <button class="decline-invite-btn bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded text-sm" data-id="${k.id}">
                      ${E("declineInvite")}
                    </button>
                  </div>
                </div>
              `).join("")}
            </div>
          </div>
          `:""}

          ${ki?`
          <!-- Invite Settings Dialog -->
          <div class="bg-blue-900 p-4 rounded-lg flex flex-col gap-3 w-full max-w-[400px]">
            <h2 class="text-lg font-bold text-white">⚙️ ${E("inviteSettings")}</h2>
            <div class="flex items-center justify-between">
              <span class="text-white">${E("timerLabel")}</span>
              <button id="invite-timer-toggle" class="${Ti?"bg-green-600":"bg-gray-600"} text-white px-3 py-1 rounded text-sm">
                ${E(Ti?"on":"off")}
              </button>
            </div>
            ${Ti?`
            <div class="flex items-center justify-between">
              <span class="text-white">${E("timerMinutesLabel")}</span>
              <select id="invite-timer-minutes" class="bg-gray-700 text-white p-2 rounded">
                <option value="1" ${ln===1?"selected":""}>1</option>
                <option value="3" ${ln===3?"selected":""}>3</option>
                <option value="5" ${ln===5?"selected":""}>5</option>
                <option value="10" ${ln===10?"selected":""}>10</option>
                <option value="15" ${ln===15?"selected":""}>15</option>
                <option value="30" ${ln===30?"selected":""}>30</option>
              </select>
            </div>
            `:""}
            <div class="flex gap-2">
              <button id="confirm-invite-btn" class="flex-1 bg-green-600 hover:bg-green-500 text-white py-2 rounded">
                ${E("sendInvite")}
              </button>
              <button id="cancel-invite-btn" class="flex-1 bg-gray-600 hover:bg-gray-500 text-white py-2 rounded">
                ${E("confirmNo")}
              </button>
            </div>
          </div>
          `:`
          <!-- Online Players -->
          <div class="bg-gray-800 p-4 rounded-lg flex flex-col gap-3 w-full max-w-[400px]">
            <h2 class="text-lg font-bold text-white">👥 ${E("onlinePlayers")}</h2>
            ${sa.length>0?`
            <div class="flex flex-col gap-2">
              ${sa.map(k=>`
                <div class="bg-gray-700 p-3 rounded flex items-center justify-between">
                  <div>
                    <span class="text-white font-bold">${k.username}</span>
                    <span class="text-xs ml-2 ${k.status==="available"?"text-green-400":"text-yellow-400"}">
                      ${k.status==="available"?E("playerAvailable"):E("playerPlaying")}
                    </span>
                  </div>
                  ${k.status==="available"?`
                  <button class="send-invite-btn bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded text-sm" data-id="${k.id}">
                    ${E("sendInvite")}
                  </button>
                  `:""}
                </div>
              `).join("")}
            </div>
            `:`
            <div class="text-gray-400 text-center py-4">
              ${E("noPlayersOnline")}
            </div>
            `}
          </div>
          `}

          <div class="flex gap-3">
            <button id="multiplayer-back-btn" class="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded transition-colors">
              ${E("backButton")}
            </button>
          </div>
        </div>
      `,document.getElementById("multiplayer-back-btn")?.addEventListener("click",()=>{Wn&&(Og(),Fg(),zg(),qg(),Wn=!1,sa=[],oa=[]),ye="none",M()}),document.querySelectorAll(".send-invite-btn").forEach(k=>{k.addEventListener("click",x=>{const _=x.target.getAttribute("data-id");_&&(ki=_,M())})}),document.getElementById("invite-timer-toggle")?.addEventListener("click",()=>{Ti=!Ti,M()}),document.getElementById("invite-timer-minutes")?.addEventListener("change",k=>{ln=parseInt(k.target.value)}),document.getElementById("confirm-invite-btn")?.addEventListener("click",async()=>{ki&&(await Mk(ki,Ti,ln),ki=null,M())}),document.getElementById("cancel-invite-btn")?.addEventListener("click",()=>{ki=null,M()}),document.querySelectorAll(".accept-invite-btn").forEach(k=>{k.addEventListener("click",async x=>{const _=x.target.getAttribute("data-id");if(_){const A=await Nk(_);A&&(Ne=A.gameId,Ae=A.myTeam,await fc(A.gameId),Ta(A.gameId,I=>{I&&(wn=I,(I.status==="playing"||I.yellowJoined&&I.greenJoined)&&!mr?bc():M())}),M())}})}),document.querySelectorAll(".decline-invite-btn").forEach(k=>{k.addEventListener("click",async x=>{const _=x.target.getAttribute("data-id");_&&await Bk(_)})}),document.getElementById("mp-shop-btn")?.addEventListener("click",()=>{vi="multiplayer",ye="shop",M()}),document.getElementById("mp-settings-btn")?.addEventListener("click",()=>{vi="multiplayer",xi=!0,M()});return}const j=Xt(),te=Zt();r.innerHTML=`
      <div class="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 gap-4 sm:gap-8">
        <h1 class="text-2xl sm:text-4xl font-bold text-white">${E("startTitle")}</h1>

        ${j&&te?`
        <div class="flex items-center gap-3 bg-gray-800 px-4 py-2 rounded-lg">
          <span class="text-blue-400">👤 ${te.username}</span>
          <span class="text-yellow-400">💰 ${te.warBucks}</span>
          <button id="profile-btn" class="bg-blue-600 hover:bg-blue-500 text-white font-bold py-1 px-3 rounded flex items-center gap-1 text-sm">
            📊 ${E("profileStats")||"Stats"}
          </button>
        </div>
        `:Wc()?`
        <div class="bg-yellow-900 text-yellow-200 px-4 py-2 rounded text-sm">
          ⚠️ ${E("authOfflineWarning")}
        </div>
        `:`
        <button id="login-start-btn" class="bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded transition-colors">
          ${E("authLogin")}
        </button>
        `}

        <!-- Game Mode Selection -->
        <div class="bg-gray-800 rounded-lg p-4 flex flex-col gap-3">
          <div class="flex gap-2">
            <button id="mode-player-btn" class="${Wt?"bg-gray-600 hover:bg-gray-500":"bg-green-600"} text-white font-bold py-2 px-4 rounded-lg transition-colors touch-manipulation">
              👥 ${E("startVsPlayer")}
            </button>
            <button id="mode-bot-btn" class="${Wt?"bg-blue-600":"bg-gray-600 hover:bg-gray-500"} text-white font-bold py-2 px-4 rounded-lg transition-colors touch-manipulation">
              🤖 ${E("startVsBot")}
            </button>
          </div>

          ${Wt?`
          <div class="flex flex-col gap-2">
            <span class="text-gray-300 text-sm">${E("botDifficultyLabel")}:</span>
            <div class="flex gap-2">
              <button id="diff-easy-btn" class="${$r==="easy"?"bg-green-600":"bg-gray-600 hover:bg-gray-500"} text-white font-bold py-1 px-3 rounded transition-colors touch-manipulation text-sm">
                ${E("botEasy")}
              </button>
              <button id="diff-medium-btn" class="${$r==="medium"?"bg-yellow-600":"bg-gray-600 hover:bg-gray-500"} text-white font-bold py-1 px-3 rounded transition-colors touch-manipulation text-sm">
                ${E("botMedium")}
              </button>
              <button id="diff-hard-btn" class="${$r==="hard"?"bg-red-600":"bg-gray-600 hover:bg-gray-500"} text-white font-bold py-1 px-3 rounded transition-colors touch-manipulation text-sm">
                ${E("botHard")}
              </button>
            </div>
          </div>
          `:""}
        </div>

        <div class="flex flex-col gap-3">
          <button id="start-btn" class="bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-bold py-3 px-6 sm:px-8 rounded-lg text-lg sm:text-xl transition-colors touch-manipulation">
            ${E("startButton")}
          </button>
          ${j&&te?`
          <button id="multiplayer-btn" class="bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-bold py-2 px-6 rounded-lg text-base transition-colors touch-manipulation">
            🌐 ${E("multiplayerButton")}
          </button>
          `:""}
          <button id="settings-btn" class="bg-gray-600 hover:bg-gray-700 active:bg-gray-800 text-white font-bold py-2 px-6 rounded-lg text-base transition-colors touch-manipulation">
            ⚙️ ${E("settingsButton")}
          </button>
        </div>
        <div class="flex items-start gap-4 sm:gap-8 opacity-50">
          <div class="flex-shrink-0" id="board-container">
            ${Ai()}
          </div>
        </div>
      </div>
    `,document.getElementById("start-btn")?.addEventListener("click",op),document.getElementById("mode-player-btn")?.addEventListener("click",()=>{Wt=!1,M()}),document.getElementById("mode-bot-btn")?.addEventListener("click",()=>{Wt=!0,M()}),document.getElementById("diff-easy-btn")?.addEventListener("click",()=>{$r="easy",M()}),document.getElementById("diff-medium-btn")?.addEventListener("click",()=>{$r="medium",M()}),document.getElementById("diff-hard-btn")?.addEventListener("click",()=>{$r="hard",M()}),document.getElementById("settings-btn")?.addEventListener("click",()=>{xi=!0,M()}),document.getElementById("profile-btn")?.addEventListener("click",()=>{ye="profile",M()}),document.getElementById("multiplayer-btn")?.addEventListener("click",()=>{ye="multiplayer",M()}),document.getElementById("login-start-btn")?.addEventListener("click",()=>{ye="login",M()});return}if(Ce==="confirmReset"){r.innerHTML=`
      <div class="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 gap-4">
        <div class="bg-gray-800 p-4 sm:p-6 rounded-lg flex flex-col items-center gap-4 mx-4">
          <p class="text-white text-base sm:text-lg text-center">${E("confirmReset")}</p>
          <div class="flex gap-3 sm:gap-4">
            <button id="confirm-reset-btn" class="bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold py-2 px-4 sm:px-6 rounded-lg transition-colors touch-manipulation">
              ${E("confirmYes")}
            </button>
            <button id="cancel-reset-btn" class="bg-gray-600 hover:bg-gray-700 active:bg-gray-800 text-white font-bold py-2 px-4 sm:px-6 rounded-lg transition-colors touch-manipulation">
              ${E("confirmNo")}
            </button>
          </div>
        </div>
        <div class="flex items-start gap-4 sm:gap-8 opacity-50">
          <div class="flex-shrink-0" id="board-container">
            ${Ai()}
          </div>
        </div>
      </div>
    `,document.getElementById("confirm-reset-btn")?.addEventListener("click",ca),document.getElementById("cancel-reset-btn")?.addEventListener("click",TT);return}if(Ce==="confirmTunnel"){r.innerHTML=`
      <div class="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 gap-4">
        <div class="bg-gray-800 p-4 sm:p-6 rounded-lg flex flex-col items-center gap-4 border-2 border-gray-600 mx-4">
          <p class="text-white text-base sm:text-lg text-center">🚇 Enter the tunnel?</p>
          <div class="flex gap-3 sm:gap-4">
            <button id="confirm-tunnel-btn" class="bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-bold py-2 px-4 sm:px-6 rounded-lg transition-colors touch-manipulation">
              Yes
            </button>
            <button id="decline-tunnel-btn" class="bg-gray-600 hover:bg-gray-700 active:bg-gray-800 text-white font-bold py-2 px-4 sm:px-6 rounded-lg transition-colors touch-manipulation">
              No
            </button>
          </div>
        </div>
        <div class="flex items-start gap-4">
          <div class="flex-shrink-0" id="board-container">
            ${Ai()}
          </div>
        </div>
      </div>
    `,document.getElementById("confirm-tunnel-btn")?.addEventListener("click",VT),document.getElementById("decline-tunnel-btn")?.addEventListener("click",DT);return}if(Ce==="confirmTunnelExit"){r.innerHTML=`
      <div class="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 gap-4">
        <div class="bg-gray-800 p-4 sm:p-6 rounded-lg flex flex-col items-center gap-4 border-2 border-gray-600 mx-4">
          <p class="text-white text-base sm:text-lg text-center">🚇 Exit the tunnel?</p>
          <div class="flex gap-3 sm:gap-4">
            <button id="confirm-exit-btn" class="bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-bold py-2 px-4 sm:px-6 rounded-lg transition-colors touch-manipulation">
              Yes
            </button>
            <button id="decline-exit-btn" class="bg-gray-600 hover:bg-gray-700 active:bg-gray-800 text-white font-bold py-2 px-4 sm:px-6 rounded-lg transition-colors touch-manipulation">
              No
            </button>
          </div>
        </div>
        <div class="flex items-start gap-4">
          <div class="flex-shrink-0" id="board-container">
            ${Ai()}
          </div>
        </div>
      </div>
    `,document.getElementById("confirm-exit-btn")?.addEventListener("click",BT),document.getElementById("decline-exit-btn")?.addEventListener("click",OT);return}const t=kl();if(t&&!D&&(D=t,tt="move",ue=_n(t).filter(j=>!yo(j.col,j.row)),U=`⚠️ Soldier at ${t.col}${t.row} MUST leave the trench! (3 turns reached)`,ue.length===0)){U=E("soldierTrapped");const j=Y.indexOf(t);Y.splice(j,1),Fe.push(t),Le.push({from:`${t.col}${t.row}`,to:`${t.col}${t.row}`,piece:t.type,team:t.team,captured:"trapped"}),D=null,_e==="yellow"?$e++:me++,st(),setTimeout(()=>M(),100)}const n=t?`
    <div class="bg-red-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold text-sm sm:text-lg animate-pulse text-center">
      ⚠️ Soldier ${t.col}${t.row} MUST leave trench!
    </div>
  `:"",s=(_e==="yellow"?$e:me)===td,o=Y.some(j=>j.type==="rocket"&&j.team===_e),c=s||rd(_e)&&o&&D?.type==="rocket"?`
    <div class="bg-orange-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold text-sm sm:text-lg text-center">
      🚀 Rocket is ready for use!
    </div>
  `:"",l=(D?.type==="soldier"||D?.type==="tank"||D?.type==="ship")&&!t,u=D&&g0(D),f=tt==="move"?"bg-blue-800 ring-2 ring-blue-400":"bg-blue-600 hover:bg-blue-700 active:bg-blue-800",d=tt==="shoot"?"bg-red-800 ring-2 ring-red-400":"bg-red-600 hover:bg-red-700 active:bg-red-800",h=l?`
    <div class="bg-gray-800 px-2 sm:px-4 py-2 rounded-lg flex gap-1 sm:gap-2">
      <button id="action-move" class="${f} text-white font-bold py-2 px-3 sm:px-4 rounded text-xs sm:text-sm transition-colors touch-manipulation">
        ${E("moveButton")}
      </button>
      ${D?.inTunnel?"":`
        <button id="action-shoot" class="${d} text-white font-bold py-2 px-3 sm:px-4 rounded text-xs sm:text-sm transition-colors touch-manipulation">
          ${E("shootButton")}
        </button>
      `}
      ${u?`
        <button id="action-exit" class="bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-bold py-2 px-3 sm:px-4 rounded text-xs sm:text-sm transition-colors touch-manipulation">
          ${E("exitButton")}
        </button>
      `:""}
    </div>
  `:"",p=It?.type==="sub",g=Mn&&It?`
    <div class="bg-purple-900 px-2 sm:px-4 py-2 rounded-lg flex flex-wrap gap-1 sm:gap-2 items-center">
      <span class="text-purple-200 text-xs sm:text-sm">Hack ${It.type}:</span>
      <button id="hack-forward" class="bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-bold py-2 px-3 sm:px-4 rounded text-xs sm:text-sm transition-colors touch-manipulation">
        ${p?"→ Right":"↑ Forward"}
      </button>
      <button id="hack-backward" class="bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-bold py-2 px-3 sm:px-4 rounded text-xs sm:text-sm transition-colors touch-manipulation">
        ${p?"← Left":"↓ Backward"}
      </button>
      <button id="hack-freeze" class="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-2 px-3 sm:px-4 rounded text-xs sm:text-sm transition-colors touch-manipulation">
        ❄ Freeze 5
      </button>
      <button id="hack-cancel" class="bg-gray-600 hover:bg-gray-700 active:bg-gray-800 text-white font-bold py-2 px-3 sm:px-4 rounded text-xs sm:text-sm transition-colors touch-manipulation">
        Cancel
      </button>
    </div>
  `:"",w=$o&&D?.type==="builder"?`
    <div class="bg-amber-900 px-2 sm:px-4 py-2 rounded-lg flex flex-wrap gap-1 sm:gap-2 items-center">
      <button id="builder-move" class="${Ke===null?"bg-blue-600":"bg-gray-600"} hover:bg-blue-700 text-white font-bold py-2 px-3 rounded text-xs sm:text-sm transition-colors touch-manipulation">
        🚶 Move
      </button>
      <button id="builder-barricade" class="${Ke==="barricade"?"bg-amber-700":bl(D)?"bg-amber-600 hover:bg-amber-700":"bg-gray-500 cursor-not-allowed"} text-white font-bold py-2 px-3 rounded text-xs sm:text-sm transition-colors touch-manipulation">
        🧱 Barricade ${D.barricadesBuilt||0}/${i0}
      </button>
      <button id="builder-artillery" class="${Ke==="artillery"?"bg-gray-700":vl(D)?"bg-gray-600 hover:bg-gray-700":"bg-gray-500 cursor-not-allowed"} text-white font-bold py-2 px-3 rounded text-xs sm:text-sm transition-colors touch-manipulation">
        💥 Artillery ${D.artilleryBuilt||0}/${s0}
      </button>
      <button id="builder-spike" class="${Ke==="spike"?"bg-red-700":sd(D)?"bg-red-600 hover:bg-red-700":"bg-gray-500 cursor-not-allowed"} text-white font-bold py-2 px-3 rounded text-xs sm:text-sm transition-colors touch-manipulation">
        ⚠ Spike ${D.spikesBuilt||0}/${o0}
      </button>
    </div>
  `:"",b=fi&&D?.type==="carrier"&&D.hasHelicopter?`
    <div class="bg-sky-900 px-2 sm:px-4 py-2 rounded-lg flex flex-wrap gap-1 sm:gap-2 items-center">
      <button id="carrier-launch" class="bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white font-bold py-2 px-3 sm:px-4 rounded text-xs sm:text-sm transition-colors touch-manipulation">
        🚁 ${E("launchHelicopter")}
      </button>
    </div>
  `:"",P=Vi?`
    <div class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div class="bg-gray-800 p-6 rounded-lg max-w-md mx-4 border-2 border-red-500">
        <h2 class="text-xl font-bold text-red-400 mb-4">Opponent Left</h2>
        <p class="text-white mb-6">Your opponent has left the game. What would you like to do?</p>
        <div class="flex flex-col gap-3">
          <button id="opponent-left-menu" class="bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-4 rounded transition-colors">
            Back to Menu
          </button>
          <button id="opponent-left-continue" class="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded transition-colors">
            Continue Playing (Alone)
          </button>
          <button id="opponent-left-bot" class="bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-4 rounded transition-colors">
            Continue with Bot
          </button>
        </div>
      </div>
    </div>
  `:"",z=as&&ct?`
    <div class="fixed top-0 left-0 right-0 bg-gradient-to-r from-orange-600 to-orange-800 p-3 z-40 shadow-lg">
      <div class="max-w-4xl mx-auto flex items-center justify-between">
        <div class="flex items-center gap-4">
          <span class="text-2xl">${ct.icon||"🧩"}</span>
          <div>
            <h2 class="text-white font-bold">${ct.name}</h2>
            <p class="text-orange-200 text-sm">${ct.objective}</p>
          </div>
        </div>
        <div class="flex items-center gap-4">
          <div class="bg-orange-900 px-4 py-2 rounded-lg">
            <span class="text-orange-200 text-sm">Moves Left:</span>
            <span class="text-white font-bold text-xl ml-2">${mo}</span>
          </div>
          <button id="stop-puzzle-btn" class="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded transition-colors">
            Stop Solving
          </button>
        </div>
      </div>
    </div>
    <div class="h-16"></div>
  `:"";r.innerHTML=`
    <div class="min-h-screen flex flex-col items-center justify-start p-2 sm:p-4 lg:p-8 gap-2 sm:gap-4">
      ${z}
      ${P}
      ${n}
      ${c}
      <div class="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
        <div class="bg-gray-800 px-3 py-2 rounded-lg border-2 ${e} flex items-center gap-3">
          <span class="${e} font-bold text-sm sm:text-base">${E(_e==="yellow"?"yellowTurn":"greenTurn")}</span>
          ${fn?`
            <div class="flex gap-2 text-xs sm:text-sm">
              <span class="px-2 py-1 rounded ${_e==="yellow"?"bg-yellow-600 text-black font-bold":"bg-gray-700 text-yellow-400"}">${lp(Vr)}</span>
              <span class="px-2 py-1 rounded ${_e==="green"?"bg-green-600 text-black font-bold":"bg-gray-700 text-green-400"}">${lp(Dr)}</span>
            </div>
          `:""}
        </div>
        ${h}
        ${g}
        ${w}
        ${b}
        ${U&&!t?`<div class="bg-gray-800 text-white px-3 py-2 rounded-lg text-xs sm:text-sm">${U}</div>`:""}
        <button id="reset-btn" class="bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold py-2 px-3 sm:px-4 rounded-lg text-xs sm:text-sm transition-colors">
          ${E("resetButton")}
        </button>
      </div>
      <div class="flex flex-col lg:flex-row items-center lg:items-start gap-4 w-full max-w-4xl">
        ${(()=>{const j=HT();return`
            <div class="flex-shrink-0 w-full lg:w-auto flex justify-center items-center relative" id="board-container">
              ${j.background}
              ${j.left}
              <div class="relative z-10">
                ${Ai()}
              </div>
              ${j.right}
            </div>
          `})()}
        <div class="flex flex-row lg:flex-col gap-4 w-full lg:w-64 lg:h-[80vh]">
          ${jT()}
          ${WT()}
          ${Ne?QT():""}
        </div>
      </div>
    </div>
  `,document.getElementById("reset-btn")?.addEventListener("click",kT),document.getElementById("stop-puzzle-btn")?.addEventListener("click",tu),document.getElementById("opponent-left-menu")?.addEventListener("click",()=>{Vi=!1,os=!1,Qc(),ca()}),document.getElementById("opponent-left-continue")?.addEventListener("click",()=>{Vi=!1,Bt=!0,Qr=!1,M()}),document.getElementById("opponent-left-bot")?.addEventListener("click",()=>{Vi=!1,os=!1,Wt=!0,Ne=null,Ae=null,wn=null,mr=!1,Bt=!1,Qr=!1,Qc(),jg(),Qa=!1,_e==="green"&&setTimeout(()=>l0(),500),U="Continuing with Bot...",M()}),document.getElementById("toggle-chat")?.addEventListener("click",()=>{ni=!ni,M()}),document.getElementById("send-chat")?.addEventListener("click",async()=>{const j=document.getElementById("chat-input");j&&j.value.trim()&&Ne&&Ae&&(await gc(Ne,j.value.trim(),Ae),xa="",j.value="")}),document.getElementById("chat-input")?.addEventListener("keypress",async j=>{if(j.key==="Enter"){const te=j.target;te.value.trim()&&Ne&&Ae&&(await gc(Ne,te.value.trim(),Ae),xa="",te.value="")}}),document.getElementById("chat-input")?.addEventListener("input",j=>{xa=j.target.value}),document.querySelectorAll(".quick-chat-btn").forEach(j=>{j.addEventListener("click",async te=>{const O=te.currentTarget.dataset.msg;if(O&&Ne&&Ae){const k=Hg.find(x=>x.id===O);k&&await gc(Ne,k.text,Ae,!0,O)}})}),document.getElementById("action-move")?.addEventListener("click",()=>cp("move")),document.getElementById("action-shoot")?.addEventListener("click",()=>cp("shoot")),document.getElementById("action-exit")?.addEventListener("click",NT),document.getElementById("hack-forward")?.addEventListener("click",()=>Aa("forward")),document.getElementById("hack-backward")?.addEventListener("click",()=>Aa("backward")),document.getElementById("hack-freeze")?.addEventListener("click",()=>Aa("freeze")),document.getElementById("hack-cancel")?.addEventListener("click",zT),document.getElementById("builder-move")?.addEventListener("click",()=>ua("move")),document.getElementById("builder-barricade")?.addEventListener("click",()=>ua("barricade")),document.getElementById("builder-artillery")?.addEventListener("click",()=>ua("artillery")),document.getElementById("builder-spike")?.addEventListener("click",()=>ua("spike")),document.getElementById("carrier-launch")?.addEventListener("click",ST);const G=document.querySelector("#board-container svg");G&&(G.querySelectorAll("rect[data-row]").forEach(j=>{j.addEventListener("click",te=>{const O=te.currentTarget,k=O.getAttribute("data-col"),x=parseInt(O.getAttribute("data-row"));up(k,x)})}),G.querySelectorAll("g[data-piece]").forEach(j=>{j.addEventListener("click",te=>{te.stopPropagation();const O=te.currentTarget,k=O.getAttribute("data-col"),x=parseInt(O.getAttribute("data-row"));up(k,x)})}))}S4();let dp=Date.now();function A0(){const r=Date.now(),e=(r-dp)/1e3;dp=r,ls.length>0&&(Zg(e),M()),requestAnimationFrame(A0)}A0();Kg=Tk();Kg?ye="login":va(!0);M();
