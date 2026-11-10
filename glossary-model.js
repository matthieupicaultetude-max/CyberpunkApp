import {corporations} from './corporations.js';
export const glossaryKey='fia-glossary-editor-v1';
export const receivedKey=player=>'fia-glossary-received-'+player;
export function loadGlossary(player='mj'){
  if(player!=='mj'){
    const received=localStorage.getItem(receivedKey(player));
    if(received){try{return JSON.parse(received)}catch{}}
  }
  const saved=localStorage.getItem(glossaryKey);
  if(saved){try{return JSON.parse(saved)}catch{}}
  let legacy={};try{legacy=JSON.parse(localStorage.getItem('fia-corporation-knowledge-v1'))||{}}catch{}
  return corporations.map(c=>({...c,blocks:c.blocks.map((block,index)=>({...block,visible:Object.fromEntries(['j1','j2'].map(j=>{const raw=legacy[j]?.[c.id],level=Number.isInteger(raw)&&raw>=1&&raw<=3?raw:1;return [j,index<level*2]}))}))}));
}
export function saveGlossary(data){localStorage.setItem(glossaryKey,JSON.stringify(data));for(const j of ['j1','j2'])localStorage.removeItem(receivedKey(j))}
export function playerExport(player){return {type:'fia-glossary-blocks',version:1,player,corporations:loadGlossary().map(c=>({...c,blocks:c.blocks.filter(b=>b.visible[player]).map(({id,title,text})=>({id,title,text}))}))}}
export function validateImport(data,player){
  if(data?.type!=='fia-glossary-blocks'||data.version!==1||data.player!==player||!Array.isArray(data.corporations))throw Error('Fichier incompatible avec ce joueur.');
  const ids=new Set(corporations.map(c=>c.id));
  if(data.corporations.length!==ids.size||new Set(data.corporations.map(c=>c?.id)).size!==ids.size)throw Error('Liste de corporations invalide.');
  return data.corporations.map(c=>{
    const base=corporations.find(b=>b.id===c?.id);
    if(!base||!['name','sector','origin','source'].every(k=>typeof c[k]==='string'&&c[k].length<=500)||!Array.isArray(c.blocks)||c.blocks.length>200)throw Error('Dossier invalide.');
    if(c.source&&!/^https:\/\//i.test(c.source))throw Error('La source doit être une adresse HTTPS.');
    const seen=new Set();
    const blocks=c.blocks.map(b=>{if(!b||typeof b.id!=='string'||!b.id||b.id.length>100||seen.has(b.id)||typeof b.title!=='string'||!b.title.trim()||b.title.length>150||typeof b.text!=='string'||b.text.length>20000)throw Error('Bloc invalide.');seen.add(b.id);return {id:b.id,title:b.title,text:b.text,visible:{j1:player==='j1',j2:player==='j2'}}});
    return {...base,name:c.name,sector:c.sector,origin:c.origin,source:c.source,blocks};
  });
}
