import {S,save,exportSave,importSave} from "./store.js";
import {say,listen} from "./speech.js";
import {addWord,dueWords,grade} from "./review.js";
const A=document.getElementById("app"),HP={A2:4,B1:3,B2:2},SK={c:"Чтение",a:"Аудирование",g:"Грамматика",s:"Говорение",w:"Письмо"};
let E=[],cur=null;
const $f=()=>document.getElementById("f"),sh=a=>[...a].sort(()=>Math.random()-.5),nv=Object.keys;
const fb=(t,g)=>{$f().innerHTML=`<div class="fb ${g?"g":"b"}">${g?"Верно. ":"Не совсем. "}${t}</div>`};
const hearts=()=>"♥".repeat(cur.h)+"<i>"+"♥".repeat(cur.t-cur.h)+"</i>";
function intro(){A.innerHTML=`<h1><span class="logo"></span>English Quest</h1><h2>Английский, который нужен, чтобы пройти сюжет</h2><p>Вы в Лондоне, багаж потерян. Чтение, аудирование, говорение и письмо встроены в историю, а ошибки стоят «доверия» персонажей.</p><button class="pri" style="width:100%" onclick="menu()">Начать игру</button>`}
function menu(){cur=null;
 let h=`<h1><span class="logo"></span>English Quest</h1><p class="stat">Монеты: ${S.coins} · Дней подряд: ${S.streak} · Слов: ${nv(S.vocab).length}</p><p class="stat">${nv(SK).map(k=>SK[k]+" "+(S.sk[SK[k]]||0)).join(" · ")}</p><h2>Уровень</h2><div class="lv">${["A2","B1","B2"].map(l=>`<button class="${S.lvl===l?"pri":""}" onclick="lvl('${l}')">${l}</button>`).join("")}</div><p class="tr">Уровень задаёт число «сердец» и наличие подсказок на русском.</p>`;
 let last="";E.forEach((e,i)=>{if(e.ch!==last){h+=`<h2>${e.ch}</h2>`;last=e.ch}h+=`<button class="ep ${S.done[i]?"done":""}" onclick="start(${i})">${e.t}<small>${S.done[i]?"Пройден":e.steps.length+" задания"}</small></button>`});
 h+=`<h2>Повторение</h2><button onclick="review()" style="width:100%">Повторить слова (к повторению: ${dueWords().length})</button><button onclick="diary()" style="margin-top:8px;width:100%">Дневник слов</button><h2>Прогресс</h2><div class="lv"><button onclick="exportSave()">Сохранить в файл</button><button onclick="document.getElementById('imp').click()">Загрузить</button></div><input id="imp" type="file" accept="application/json" hidden onchange="imp(this.files[0])"><button class="ghost" onclick="intro()">О проекте</button>`;
 A.innerHTML=h}
function lvl(l){S.lvl=l;S.tr=l!=="B2";save();menu()}
function imp(f){if(f)importSave(f,g=>{alert(g?"Прогресс загружен":"Не удалось прочитать файл");menu()})}
function start(i){const t=HP[S.lvl];cur={e:E[i],id:i,i:0,h:t,t,m:0,lock:0};step()}
function step(){const p=cur.e.steps[cur.i],n=cur.e.steps.length;cur.m=0;cur.lock=0;
 let h=`<div class="row"><button class="ghost" onclick="menu()">‹ Карта</button><span class="hearts" id="hp">${hearts()}</span><span class="tr">${cur.i+1} из ${n}</span></div><h3>${cur.e.ch}: ${cur.e.t}</h3><div class="card"><div class="who">${p.e} ${p.w}</div>`;
 if(p.k==="a")h+=`<button class="pri" onclick="speak()">▶ Прослушать</button><p class="tr" id="sub" hidden>${p.s}</p>${S.tr?`<button class="ghost" onclick="document.getElementById('sub').hidden=false">Показать субтитры</button>`:""}<p class="say">${p.q}</p>`;
 else if(p.k==="c")h+=`<p class="say">${p.s}</p>${S.tr?`<p class="tr">${p.r}</p>`:""}<button class="ghost" onclick="speak()">🔊 Озвучить</button>`;
 else if(p.k==="s")h+=`<p class="tr">Скажите вслух:</p><p class="say">${p.q}</p><button class="ghost" onclick="speak(1)">🔊 Образец</button>`;
 else if(p.k==="w")h+=`<p class="tr">${p.r}</p><p class="say">${p.q}</p>`;
 else h+=`<p class="say">${p.q}</p>`;
 h+=`</div>`;
 if(p.k==="s")h+=`<button class="pri" style="width:100%" onclick="mic()">🎤 Говорить</button>`;
 else if(p.k==="w")h+=`<textarea id="tx" rows="3" aria-label="Ваш ответ"></textarea><button class="pri" style="width:100%;margin-top:8px" onclick="chk()">Проверить</button>`;
 else h+=`<div class="opts">`+p.o.map((t,j)=>`<button onclick="pick(${j},this)">${t}</button>`).join("")+`</div>`;
 A.innerHTML=h+`<div id="f"></div>`;if(p.k==="c"||p.k==="a")say(p.s)}
const speak=q=>{const p=cur.e.steps[cur.i];say(q?p.q:p.s)};
function nxt(){const last=cur.i===cur.e.steps.length-1;$f().insertAdjacentHTML("beforeend",`<button class="pri" style="width:100%;margin-top:8px" onclick="${last?"fin()":"cur.i++;step()"}">${last?"Завершить эпизод":"Дальше"}</button>`)}
function ok(p,pre=""){cur.lock=1;S.coins+=cur.m?3:10;S.sk[SK[p.k]]=(S.sk[SK[p.k]]||0)+1;p.v.forEach(w=>addWord(w[0],w[1]));save();fb(pre+p.y,1);nxt()}
function bad(p,pre=""){cur.m=1;cur.h--;document.getElementById("hp").innerHTML=hearts();
 if(cur.h<=0){cur.lock=1;$f().innerHTML=`<div class="fb b">Доверие потеряно. ${p.y} Эпизод начнётся заново.</div><button class="pri" style="width:100%" onclick="start(${cur.id})">Попробовать снова</button>`}else fb(pre+p.y,0)}
function pick(j,b){if(cur.lock)return;const p=cur.e.steps[cur.i];if(j===p.a){b.classList.add("ok");ok(p)}else{b.classList.add("no");b.disabled=true;bad(p)}}
function noMic(){$f().innerHTML=`<div class="fb">Распознавание речи недоступно. Откройте игру в Chrome или подтвердите вручную.</div><button class="pri" style="width:100%" onclick="ok(cur.e.steps[cur.i])">Я произнёс(ла) фразу</button>`}
function mic(){const p=cur.e.steps[cur.i];if(cur.lock)return;$f().innerHTML=`<div class="fb">Слушаю… произнесите фразу.</div>`;
 const n=s=>s.toLowerCase().replace(/’/g,"'").replace(/[^a-z' ]/g,"").split(/\s+/).filter(Boolean);
 listen(h=>{const T=n(p.q),H=n(h),pre=`Услышано: «${h}». `;T.filter(w=>H.includes(w)).length/T.length>=.7?ok(p,pre):bad(p,pre)},noMic)}
function chk(){const p=cur.e.steps[cur.i],t=document.getElementById("tx").value.toLowerCase();if(!cur.lock){t.length>=15&&p.kw.every(k=>t.includes(k))?ok(p):bad(p)}}
function fin(){const id=cur.id,e=cur.e;if(!S.done[id]){S.coins+=20;S.done[id]=1}save();
 A.innerHTML=`<h1>Эпизод пройден</h1><p class="tr">«${e.t}». Бонус +20 монет. Монет: ${S.coins}.</p><h2>Новые слова</h2>${e.steps.flatMap(s=>s.v).map(x=>`<div class="w"><span>${x[0]}</span><span class="tr">${x[1]}</span></div>`).join("")}<div class="opts">${E[id+1]?`<button class="pri" onclick="start(${id+1})">Следующий эпизод</button>`:""}<button onclick="menu()">К карте</button></div>`}
function diary(){const k=nv(S.vocab);A.innerHTML=`<button class="ghost" onclick="menu()">‹ Карта</button><h1>Дневник слов</h1>${k.length?k.map(x=>`<div class="w"><span>${x}</span><span class="tr">${S.vocab[x].ru} · коробка ${S.vocab[x].box}</span><button class="ghost" aria-label="Озвучить ${x}" onclick="say('${x}')">🔊</button></div>`).join(""):`<p class="tr">Слова появятся после первых правильных ответов.</p>`}`}
function review(){const ws=nv(S.vocab);
 if(ws.length<4){A.innerHTML=`<button class="ghost" onclick="menu()">‹ Карта</button><h1>Повторение</h1><p class="tr">Нужно минимум 4 слова. Пройдите ещё один эпизод.</p>`;return}
 const d=dueWords(),pool=d.length?d:ws,w=pool[Math.random()*pool.length|0],o=sh([w,...sh(ws.filter(x=>x!==w)).slice(0,3)]);
 A.innerHTML=`<button class="ghost" onclick="menu()">‹ Карта</button><h1>Повторение</h1><p class="tr">К повторению: ${d.length}</p><div class="card"><p class="say">${S.vocab[w].ru}</p></div><div class="opts">${o.map(x=>`<button onclick="rv('${x}','${w}',this)">${x}</button>`).join("")}</div><div id="f"></div>`}
function rv(x,w,b){document.querySelectorAll(".opts button").forEach(k=>k.disabled=true);const g=x===w;grade(w,g);if(g){S.coins+=2;save()}b.classList.add(g?"ok":"no");
 $f().innerHTML=`<div class="fb ${g?"g":"b"}">${g?"Верно.":"Правильный ответ: "+w+"."}</div><button class="pri" style="width:100%" onclick="review()">Дальше</button>`}
Object.assign(window,{intro,menu,lvl,imp,start,speak,nxt,ok,bad,pick,mic,chk,fin,diary,review,rv,say,exportSave});
Object.defineProperty(window,"cur",{get:()=>cur});
fetch("content/chapters.json").then(r=>r.json()).then(D=>{E=D.flatMap(c=>c.e.map(e=>({...e,ch:c.n})));intro()}).catch(()=>{A.innerHTML=`<div class="fb b">Не удалось загрузить контент. Запустите проект через веб-сервер (см. README).</div>`});
if("serviceWorker"in navigator)navigator.serviceWorker.register("sw.js").catch(()=>{});
