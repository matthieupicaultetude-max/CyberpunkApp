// Retrieve actual wiki page images; never substitute unrelated stock/generated pictures.
// Live access is currently blocked in the development environment.
const articles={
'corp-arasaka-hq':'Arasaka_Tower',
'corp-arasaka-waterfront':'Arasaka_Waterfront',
'corp-arasaka-park':'Arasaka_Industrial_Park',
'corp-arasaka-konpeki':'Konpeki_Plaza',
'corp-arasaka-estate':'Arasaka_Estate',
'corp-arasaka-ebunike':'Ebunike',
'corp-militech-office':'Militech_Building',
'corp-militech-cynosure':'Cynosure_Facility',
'corp-kang-tao-tower':'Kang_Tao_Building',
'corp-biotechnica-tower':'Biotechnica_Building',
'corp-biotechnica-flats':'Biotechnica_Flats',
'corp-petrochem-tower':'Petrochem_Building',
'corp-zetatech-building':'Zetatech_Building',
'corp-kiroshi-building':'Kiroshi_Building',
'gang-maelstrom-allfoods':'All_Foods_Factory',
'gang-maelstrom-totentanz':'Totentanz',
'gang-tyger-clouds':'Clouds',
'gang-tyger-jigjig':'Jig-Jig_Street',
'gang-tyger-hooh':'Ho-Oh',
'gang-valentinos-coyote':'El_Coyote_Cojo',
'gang-valentinos-alley':'Valentino_Alley',
'gang-voodoo-chapel':'Chapel',
'gang-voodoo-battys':"Batty's_Hotel",
'gang-animals-gim':'Grand_Imperial_Mall',
'gang-mox-lizzies':"Lizzie's_Bar",
'gang-barghest-sapphire':'Black_Sapphire',
'gang-barghest-stadium':'EBM_Petrochem_Stadium',
'gang-aldecaldos-camp':'Aldecaldo_Camp',
'gang-aldecaldos-sunset':'Sunset_Motel',
'gang-wraiths-camp':'Wraith_Camp',
'gang-wraiths-rocky':'Rocky_Ridge'
};
export function placeImageView(place){if(!place.id.startsWith('corp-')&&!place.id.startsWith('gang-')&&!place.id.startsWith('merc-'))return '';return '<figure class="place-photo" data-place-photo aria-label="Photographie du lieu"><div class="place-photo-status" role="status">Recherche d’une photo sur le wiki…</div></figure>'}
export function bindPlaceImage(container,place){const figure=container.querySelector('[data-place-photo]');if(!figure)return ()=>{};const article=articles[place.id]||place.imageArticle;let stopped=false,imageTimer=null;const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),8000);const showStatus=text=>{figure.classList.remove('photo-loaded');figure.replaceChildren();const status=document.createElement('div');status.className='place-photo-status';status.setAttribute('role','status');status.textContent=text;figure.append(status)};
if(!article){clearTimeout(timer);showStatus('Photo non référencée pour ce lieu.');return ()=>{}}
const params=new URLSearchParams({action:'query',prop:'pageimages',titles:article,piprop:'original',format:'json',origin:'*',redirects:'1'});
(async()=>{try{const response=await fetch('https://cyberpunk.fandom.com/api.php?'+params,{signal:controller.signal,credentials:'omit',referrerPolicy:'no-referrer'});if(!response.ok)throw Error('Wiki unavailable');const data=await response.json();const page=Object.values(data?.query?.pages||{}).find(page=>page.original?.source);if(!page){showStatus('Aucune photo disponible sur cette page du wiki.');return}const source=new URL(page.original.source);if(source.protocol!=='https:'||!source.hostname.endsWith('.wikia.nocookie.net'))throw Error('Unexpected image host');if(stopped||!figure.isConnected)return;const img=document.createElement('img');imageTimer=setTimeout(()=>{if(!stopped&&figure.isConnected)showStatus('Le serveur d’images ne répond pas.');img.onload=img.onerror=null;img.removeAttribute('src')},10000);img.alt='Vue de '+place.name+' — Cyberpunk Wiki';img.decoding='async';img.referrerPolicy='no-referrer';const caption=document.createElement('figcaption');const link=document.createElement('a');link.href='https://cyberpunk.fandom.com/wiki/'+encodeURIComponent(page.title||article).replaceAll('%20','_');link.textContent='Image : Cyberpunk Wiki ↗';link.target='_blank';link.rel='noopener noreferrer';caption.append(link);img.onload=()=>{clearTimeout(imageTimer);if(stopped||!figure.isConnected)return;clearTimeout(timer);figure.classList.add('photo-loaded');figure.replaceChildren(img,caption)};img.onerror=()=>{clearTimeout(imageTimer);if(!stopped&&figure.isConnected)showStatus('La photo du wiki ne peut pas être chargée.')};img.src=source.href;
}catch{if(!stopped&&figure.isConnected)showStatus('Photo indisponible : accès au wiki ou au serveur d’images impossible.')}finally{clearTimeout(timer)}})();
return ()=>{stopped=true;clearTimeout(timer);clearTimeout(imageTimer);controller.abort()}
}
