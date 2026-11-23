// Gemensamt: prestationer, lagring, notiser, hemligheter
const ACH = {
  forsta:  {i:"🚪", n:"Första besöket",       d:"Du kom hit. Ingen vet varför."},
  knapp10: {i:"🔴", n:"Lyder inte",           d:"Tryckte på knappen 10 gånger."},
  knapp100:{i:"🧨", n:"Allvarligt talat",     d:"100 tryck på knappen."},
  orakel:  {i:"🔮", n:"Sökande själ",         d:"Frågade oraklet något."},
  orakel10:{i:"🧘", n:"Det beror på",         d:"Frågade oraklet 10 gånger."},
  anka:    {i:"🦆", n:"Ankskådare",           d:"Hittade ankan som inte är en anka."},
  ko:      {i:"🧍", n:"Tålamodets mästare",   d:"Kom först i kön."},
  panel:   {i:"🎛️", n:"Ingenjör",             d:"Fick kontrollpanelen att göra något."},
  intyg:   {i:"📜", n:"Certifierad",          d:"Laddade ner ett intyg."},
  natt:    {i:"🦉", n:"Nattuggla",            d:"Var här mellan 02 och 04."},
  konami:  {i:"🕹️", n:"Gammal skola",         d:"↑ ↑ ↓ ↓ ← → ← → B A"},
  pixel:   {i:"🔍", n:"Pixelpetare",          d:"Hittade den hemliga pixeln."},
  allt:    {i:"🏆", n:"Komplettist",          d:"Låste upp allt. Gå ut nu."}
};

function store(){ try{ return JSON.parse(localStorage.getItem("nonsens")||"{}"); }catch(e){ return {}; } }
function save(s){ try{ localStorage.setItem("nonsens", JSON.stringify(s)); }catch(e){} }
function getVal(k, def){ const s=store(); return (s[k]===undefined)?def:s[k]; }
function setVal(k, v){ const s=store(); s[k]=v; save(s); }

function toast(title, desc){
  let box=document.querySelector(".toast-box");
  if(!box){ box=document.createElement("div"); box.className="toast-box"; document.body.appendChild(box); }
  const t=document.createElement("div"); t.className="toast";
  t.innerHTML="<b></b><span></span>";
  t.querySelector("b").textContent=title; t.querySelector("span").textContent=desc||"";
  box.appendChild(t); setTimeout(()=>t.remove(), 4200);
}

function unlock(id){
  const s=store(); s.ach=s.ach||{};
  if(s.ach[id] || !ACH[id]) return;
  s.ach[id]=Date.now(); save(s);
  toast(ACH[id].i+" "+ACH[id].n, ACH[id].d);
  const others=Object.keys(ACH).filter(k=>k!=="allt");
  if(id!=="allt" && others.every(k=>s.ach[k])) setTimeout(()=>unlock("allt"), 1200);
  document.dispatchEvent(new Event("ach"));
}

(function(){
  // Nattuggla
  const h=new Date().getHours(); if(h>=2 && h<4) setTimeout(()=>unlock("natt"), 800);
  // Konami
  const code=["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"]; let p=0;
  addEventListener("keydown", e=>{
    const k=e.key.length===1?e.key.toLowerCase():e.key;
    p = (k===code[p]) ? p+1 : (k===code[0]?1:0);
    if(p===code.length){ p=0; unlock("konami"); document.body.style.transition="transform 1s"; document.body.style.transform="rotate(360deg)"; setTimeout(()=>{document.body.style.transform="";},1100); }
  });
  // Hemlig pixel
  addEventListener("DOMContentLoaded", ()=>{
    const px=document.createElement("div"); px.id="secret-pixel"; let c=0;
    px.addEventListener("click", ()=>{ c++; if(c>=5) unlock("pixel"); });
    document.body.appendChild(px);
  });
})();
