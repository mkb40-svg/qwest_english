const K="eq2";
const load=()=>{try{return JSON.parse(localStorage.getItem(K))||{}}catch{return{}}};
export const S=Object.assign({coins:0,done:{},vocab:{},streak:0,sk:{},lvl:"A2",tr:true},load());
export const save=()=>{try{localStorage.setItem(K,JSON.stringify(S))}catch{}};
(()=>{const t=new Date().toDateString();if(S.last!==t){S.streak=S.last===new Date(Date.now()-864e5).toDateString()?S.streak+1:1;S.last=t;save()}})();
export function exportSave(){const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([JSON.stringify(S)],{type:"application/json"}));a.download="english-quest-save.json";a.click()}
export function importSave(f,cb){f.text().then(t=>{try{Object.assign(S,JSON.parse(t));save();cb(true)}catch{cb(false)}})}
