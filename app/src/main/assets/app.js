const K="rp6_history";
const wheel=[0,32,15,19,4,21,2,25,17,34,6,27,13,36,11,30,8,23,10,5,24,16,33,1,20,14,31,9,22,18,29,7,28,12,35,3,26];
let h=JSON.parse(localStorage.getItem(K)||localStorage.getItem("rp5_history")||"[]");
const D=n=>n?Math.ceil(n/12):0,C=n=>n?((n-1)%3)+1:0,S=n=>n?`D${D(n)}C${C(n)}`:"0";
function N(n){let i=wheel.indexOf(n);return[-2,-1,0,1,2].map(d=>wheel[(i+d+37)%37])}
function rank(o,k){return k.map(x=>[x,o[x]||0]).sort((a,b)=>b[1]-a[1])}
function save(){h=h.slice(0,500);localStorage.setItem(K,JSON.stringify(h));render()}
function render(){
 sample.textContent=h.length; hist.innerHTML=h.slice(0,35).map(n=>`<span class=ball>${n}</span>`).join("");
 if(!h.length){sig.textContent="COLETANDO";sigsub.textContent="Insira os resultados";return}
 let x=h[0]; last.textContent=x; lastmeta.textContent=x?`D${D(x)} • C${C(x)}`:"ZERO";
 let q=h.slice(0,Math.min(120,h.length)),d={D1:0,D2:0,D3:0},c={C1:0,C2:0,C3:0};
 q.forEach(n=>{if(n){d["D"+D(n)]++;c["C"+C(n)]++}});
 let rd=rank(d,["D1","D2","D3"]),rc=rank(c,["C1","C2","C3"]);
 dz.textContent=rd.slice(0,2).map(v=>v[0]).join(" + "); cl.textContent=rc.slice(0,2).map(v=>v[0]).join(" + ");
 dzm.textContent=rd.map(v=>v.join(":")).join(" • "); clm.textContent=rc.map(v=>v.join(":")).join(" • ");

 // D×C transition: include ZERO as a valid current state.
 let nx={},cur=S(x);
 for(let i=1;i<h.length;i++){ if(S(h[i])===cur){let nxt=S(h[i-1]);nx[nxt]=(nx[nxt]||0)+1} }
 let ar=Object.entries(nx).sort((a,b)=>b[1]-a[1]),tot=ar.reduce((s,v)=>s+v[1],0);
 tr.textContent=ar.length?ar.slice(0,3).map(v=>v[0]).join(" / "):"Pouca amostra";
 trm.textContent=ar.length?ar.slice(0,3).map(v=>`${v[0]} ${(100*v[1]/tot).toFixed(0)}%`).join(" • ")+` (${tot} casos)`:"";

 // Base score: recent frequency + physical-sector activity + exact-number transitions.
 let f=Array(37).fill(0), fol=Array(37).fill(0); q.forEach(n=>f[n]++);
 for(let i=1;i<h.length;i++) if(h[i]===x) fol[h[i-1]]++;
 let ranked=[...Array(37).keys()].map(n=>[n,f[n]+N(n).reduce((s,z)=>s+f[z],0)*.35+fol[n]*1.8]).sort((a,b)=>b[1]-a[1]);
 let bs=[]; for(let [n] of ranked){if(!bs.some(b=>N(b).filter(z=>N(n).includes(z)).length>=3))bs.push(n);if(bs.length===3)break}
 bases.textContent=bs.join(" • "); blines.innerHTML=bs.map(n=>`<div class=line><b>${n}</b> → ${N(n).join(" · ")}</div>`).join("");

 // V6: three evidence levels. Does not force a signal every spin.
 let dg=rd[1][1]-rd[2][1], cg=rc[1][1]-rc[2][1];
 let recentD=dg>=3, recentC=cg>=3;
 let transStrong=tot>=8 && ar.length && (ar[0][1]/tot)>=0.22;
 let exactCount=fol.reduce((a,b)=>a+b,0), exactStrong=exactCount>=5 && Math.max(...fol)/exactCount>=0.20;
 let evidence=(recentD?1:0)+(recentC?1:0)+(transStrong?1:0)+(exactStrong?1:0);
 let ready=h.length>=25 && evidence>=2;
 sig.textContent=ready?"ENTRADA DETECTADA":"AGUARDAR";
 sig.className="main "+(ready?"go":"wait");
 sigsub.textContent=ready?`DÚZIAS ${rd[0][0]} + ${rd[1][0]} • COLUNAS ${rc[0][0]} + ${rc[1][0]} • VIZINHOS ${bs.join("/")}`:
   (h.length<25?`Coletando histórico: ${h.length}/25`:"Sem 2 confirmações independentes");
 reason.textContent=`Evidências ${evidence}/4 • ΔD ${dg} • ΔC ${cg} • transições ${tot} • pós-${x}: ${exactCount}`;
 if(ready && navigator.vibrate) navigator.vibrate([100,70,100]);
}
let z=document.createElement("button");z.className="key zero";z.textContent="0";z.onclick=()=>{h.unshift(0);save()};keys.appendChild(z);
for(let n=1;n<=36;n++){let b=document.createElement("button");b.className="key";b.textContent=n;b.onclick=()=>{h.unshift(n);save()};keys.appendChild(b)}
undo.onclick=()=>{h.shift();save()};clear.onclick=()=>{if(confirm("Limpar histórico?")){h=[];save()}};render();