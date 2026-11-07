export const say=t=>{try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);u.lang="en-GB";u.rate=.9;speechSynthesis.speak(u)}catch{}};
export function listen(ok,fail){const R=window.SpeechRecognition||window.webkitSpeechRecognition;if(!R)return fail();const r=new R();r.lang="en-GB";r.onresult=e=>ok(e.results[0][0].transcript);r.onerror=fail;try{r.start()}catch{fail()}}
