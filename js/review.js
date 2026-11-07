import {S,save} from "./store.js";
const DAYS=[0,1,2,4,8,16]; // интервалы по коробкам Лейтнера, дни
export const addWord=(en,ru)=>{if(!S.vocab[en])S.vocab[en]={ru,box:1,due:Date.now()}};
export const dueWords=()=>Object.keys(S.vocab).filter(w=>S.vocab[w].due<=Date.now());
export function grade(w,ok){const v=S.vocab[w];v.box=ok?Math.min(v.box+1,5):1;v.due=Date.now()+DAYS[v.box]*864e5;save()}
