const children = {
  valentina:{name:'Valentina',age:12,city:'Iztapalapa, CDMX',diagnosis:'Escoliosis idiopática adolescente',story:'Valentina ama dibujar jardines y sueña con volver a bailar sin dolor. Su tratamiento ya cuenta con valoración especializada; el siguiente paso es reunir lo necesario para su cirugía y rehabilitación.',quote:'Quiero volver a girar sin tener miedo.',goal:1000000,raised:326800,portrait:0},
  mateo:{name:'Mateo',age:10,city:'Ecatepec, Estado de México',diagnosis:'Escoliosis neuromuscular',story:'Mateo es curioso, colecciona datos sobre planetas y nunca deja una pregunta sin respuesta. Su familia busca completar los estudios preoperatorios y el acompañamiento posterior a la cirugía.',quote:'Mi árbol va a llegar hasta Saturno.',goal:1000000,raised:212400,portrait:1},
  ximena:{name:'Ximena',age:15,city:'Tláhuac, CDMX',diagnosis:'Escoliosis torácica progresiva',story:'Ximena escribe canciones y comparte cada avance con sus amigas. Cada aportación la acerca a la meta que cubrirá material quirúrgico, hospitalización y una parte de su recuperación.',quote:'Cada persona que ayuda forma parte de mi canción.',goal:1000000,raised:399900,portrait:2},
  leo:{name:'Leo',age:9,city:'Nezahualcóyotl, Estado de México',diagnosis:'Escoliosis congénita',story:'Leo disfruta cuidar plantas con su abuela y jugar como portero. Su expediente está en etapa de valoración; cada aportación acerca a su familia a la ruta quirúrgica indicada.',quote:'Yo riego las plantas y ustedes riegan mi árbol.',goal:1000000,raised:147600,portrait:3}
};

const bosque = {
  metaPorCirugia: 805080,
  cirugias: [
    { id: 'c1', etiqueta: 'Sueño de correr', titulo: 'Mi sueño es correr sin límites', tituloLineas: ['Mi sueño es correr','sin límites'], porcentaje: 14, estado: 'en-proceso' },
    { id: 'c2', etiqueta: 'Sueño de graduarse', titulo: 'Mi sueño es graduarme y celebrar', tituloLineas: ['Mi sueño es graduarme','y celebrar'], porcentaje: 9, donativos: 41, estado: 'en-proceso' },
    { id: 'c3', etiqueta: 'Sueño de bailar', titulo: 'Mi sueño es bailar en un escenario', tituloLineas: ['Mi sueño es bailar','en un escenario'], porcentaje: 100, estado: 'asegurada' },
    { id: 'c4', etiqueta: 'Sueño de meter un gol', titulo: 'Mi sueño es meter un gol', tituloLineas: ['Mi sueño es','meter un gol'], porcentaje: 7, estado: 'por-iniciar' }
  ]
};

const comunidad = {
  cirugiasRealizadas: 20, // dato oficial de EC
  personasDonantes: 338, // DATOS DE EJEMPLO, pendiente de EC
  donantesAnonimos: 214, // DATOS DE EJEMPLO, pendiente de EC
  donantesVisibles: [ // DATOS DE EJEMPLO: solo quienes eligieron aparecer
    'Mariana R.', 'Sofía M.', 'Familia Torres', 'Carlos y Ana',
    'Omar G.', 'Luz Elena', 'Renata V.', 'Jorge M.', 'Colectivo Raíz', 'Diego P.'
  ]
};

const money=value=>new Intl.NumberFormat('es-MX',{style:'currency',currency:'MXN',maximumFractionDigits:0}).format(value);
function rng(seed){return function(){seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function buildTree(seed,depth=5){
  const random=rng(seed);
  function branch(level,angle=0){
    const node={angle:angle+(random()-.5)*.09,length:.71+random()*.08,width:.64+random()*.06,phase:random()*Math.PI*2,hue:random(),children:[],leaves:[]};
    if(level<=0){for(let i=0;i<5;i++)node.leaves.push({a:random()*Math.PI*2,r:.13+random()*.12,d:.08+random()*.18,c:random()});return node}
    const spread=.31+random()*.13;
    node.children.push(branch(level-1,-spread));
    node.children.push(branch(level-1,spread));
    if(level>4&&random()>.82)node.children.push(branch(level-2,(random()-.5)*.18));
    return node;
  }
  return{root:branch(depth,0),seed,depth,phase:random()*Math.PI*2};
}

const leafColors=['#1d704c','#2e8a58','#4fa665','#6eb86d','#91ca78','#b6d77c','#d9e98b'];
function drawTree(ctx,tree,x,y,size,growth,time,options={}){
  const wind=(Math.sin(time*.00072+tree.phase)*.65+Math.sin(time*.00183+tree.phase*1.7)*.22)*(options.wind??1);
  const leafiness=Math.max(.08,Math.min(1,(growth-.18)/.62));
  ctx.save();ctx.translate(x,y);ctx.scale(growth,growth);ctx.globalAlpha=options.alpha??1;
  const rootSpread=size*.21;
  ctx.strokeStyle='rgba(61,55,32,.5)';ctx.lineCap='round';
  for(let i=-2;i<=2;i++){ctx.beginPath();ctx.lineWidth=Math.max(2,size*.012);ctx.moveTo(0,0);ctx.bezierCurveTo(i*rootSpread*.15,size*.025,i*rootSpread*.55,size*.04,i*rootSpread,size*.025);ctx.stroke()}
  function render(node,length,width,level){
    ctx.save();
    const tipFactor=(7-level)/7;
    const sway=wind*(.006+tipFactor*.018)*Math.sin(time*.00085+node.phase);
    ctx.rotate(node.angle+sway);
    const nextLength=length*node.length;
    const nextWidth=Math.max(.75,width*node.width);
    ctx.strokeStyle=level>3?'#594b2d':level>1?'#645537':'#52613c';ctx.lineWidth=width;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(wind*length*.018,-length*.48,0,-length);ctx.stroke();ctx.translate(0,-length);
    if(node.children.length){node.children.forEach(child=>render(child,nextLength,nextWidth,level-1))}
    else{
      ctx.globalAlpha=(options.alpha??1)*leafiness;
      node.leaves.forEach((leaf,index)=>{
        const flutter=Math.sin(time*.0022+node.phase+index)*wind*.12;
        ctx.save();ctx.rotate(leaf.a+flutter);ctx.translate(leaf.d*length,0);ctx.rotate(leaf.a*.3+flutter);
        ctx.fillStyle=leafColors[Math.min(leafColors.length-1,Math.floor(leaf.c*leafColors.length))];
        ctx.beginPath();ctx.ellipse(0,0,Math.max(2,size*leaf.r*.095),Math.max(1.5,size*leaf.r*.052),0,0,Math.PI*2);ctx.fill();ctx.restore();
      });
      ctx.globalAlpha=options.alpha??1;
    }
    ctx.restore();
  }
  render(tree.root,size*.245,size*.052,tree.depth);
  ctx.restore();
}

function canvasSurface(id){
  const canvas=document.getElementById(id);if(!canvas)return null;
  const ctx=canvas.getContext('2d');let width=0,height=0,dpr=1;
  function resize(){const rect=canvas.getBoundingClientRect();const cap=window.innerWidth<900?1:1.35;dpr=Math.min(cap,window.devicePixelRatio||1);width=Math.max(1,rect.width);height=Math.max(1,rect.height);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0)}
  resize();window.addEventListener('resize',resize);
  return{canvas,ctx,get width(){return width},get height(){return height},resize};
}

const scenes=[];
function addSingleTree(id,seed,settings){
  const surface=canvasSurface(id);if(!surface)return;
  const tree=buildTree(seed,settings.depth??5);
  scenes.push(time=>{
    const{ctx,width,height}=surface;ctx.clearRect(0,0,width,height);
    const x=width*(settings.x??.5),y=height*(settings.y??.94),size=Math.min(height*(settings.height??.86),width*(settings.width??.58));
    const shadow=ctx.createRadialGradient(x,y,0,x,y,size*.3);shadow.addColorStop(0,'rgba(29,73,48,.2)');shadow.addColorStop(1,'rgba(29,73,48,0)');ctx.fillStyle=shadow;ctx.beginPath();ctx.ellipse(x,y,size*.33,size*.045,0,0,Math.PI*2);ctx.fill();
    drawTree(ctx,tree,x,y,size,settings.growth??1,time,{wind:settings.wind??1});
  });
}

function setupStories(){
  const modal=document.querySelector('#storyModal');if(!modal)return;
  const portrait=document.querySelector('#modalPortrait'),fill=document.querySelector('#modalProgress');
  document.querySelectorAll('[data-story]').forEach(button=>button.addEventListener('click',()=>{
    const child=children[button.dataset.story],percent=Math.min(100,Math.round(child.raised/child.goal*100));
    portrait.className=`portrait portrait-${child.portrait}`;document.querySelector('#modalName').textContent=`${child.name}, ${child.age}`;document.querySelector('#modalMeta').textContent=`${child.city} · ${child.diagnosis}`;document.querySelector('#modalQuote').textContent=`“${child.quote}”`;document.querySelector('#modalTitle').textContent=`El camino de ${child.name}`;document.querySelector('#modalStory').textContent=child.story;document.querySelector('#modalRaised').textContent=money(child.raised);document.querySelector('#modalGoal').textContent=`de ${money(child.goal)} MXN`;document.querySelector('#modalPercent').textContent=`${percent}% reunido`;fill.style.width='0%';modal.showModal();requestAnimationFrame(()=>fill.style.width=`${percent}%`)
  }));
  modal.querySelector('.modal-close').addEventListener('click',()=>modal.close());modal.addEventListener('click',event=>{if(event.target===modal)modal.close()});
}

function setupGrowth(){
  const space=document.querySelector('#treeSpace'),surface=canvasSurface('forestCanvas');if(!space||!surface)return;
  const treesContainer=document.querySelector('#forestTrees'),treeAsset=new Image();if(!treesContainer)return;
  treeAsset.src='assets/svg/arbol.svg?v=official-motion-1';
  const labelTitle=cirugia=>cirugia.estado==='asegurada'?'+3 cirugías':'Cirugía en proceso';
  const statusText=cirugia=>cirugia.estado==='asegurada'?'ya aseguradas':`${cirugia.porcentaje}% reunido`;
  const accessibleText=cirugia=>cirugia.estado==='asegurada'?'+3 cirugías ya aseguradas':`${cirugia.etiqueta}, ${cirugia.porcentaje} por ciento reunido`;
  const amountFor=cirugia=>Math.round(cirugia.porcentaje/100*bosque.metaPorCirugia);
  const surgeryById=id=>bosque.cirugias.find(cirugia=>cirugia.id===id);
  const treeNodes=bosque.cirugias.map((cirugia,index)=>{
    const article=document.createElement('article');article.className='growth-tree';article.dataset.surgeryId=cirugia.id;article.dataset.index=String(index);
    const button=document.createElement('button');button.className='tree-label';button.type='button';button.setAttribute('aria-label',accessibleText(cirugia));
    const title=document.createElement('b');title.textContent=labelTitle(cirugia);
    const state=document.createElement('span');state.dataset.percent='';state.textContent=statusText(cirugia);
    button.append(title,state);article.append(button);return article
  });
  treesContainer.replaceChildren(...treeNodes);
  const labels=[...treesContainer.querySelectorAll('.growth-tree')];
  const initialDonationAmounts=new Set();
  const randomInitialDonation=()=>{let amount;do{amount=(Math.floor(Math.random()*196)+5)*10}while(initialDonationAmounts.has(amount));initialDonationAmounts.add(amount);return money(amount)};
  const lastDonationByTree=new Map(bosque.cirugias.filter(cirugia=>cirugia.estado!=='asegurada').map(cirugia=>[cirugia.id,randomInitialDonation()]));
  let selectedId=bosque.cirugias[0].id,pointer=.5,targetPointer=.5;
  function layout(){
    const{width,height}=surface;pointer+=(targetPointer-pointer)*.055;const focus=pointer*3;
    return labels.map((label,index)=>{const distance=Math.abs(index-focus),compact=width<600,wide=width>=900,edge=compact?48:width<900?76:70,start=Math.min(430,width*.42),end=width-100,rawX=compact?edge+index*(width-edge*2)/3:wide?start+index*(end-start)/3-(pointer-.5)*width*.1:width/2+(index-1.5)*width*.27-(pointer-.5)*width*.35,x=Math.max(edge,Math.min(width-edge,rawX+(compact?8:30))),y=height-76+distance*7,depth=1-distance*.14;return{label,index,distance,x,y,scale:Math.max(.62,depth)}}).sort((a,b)=>b.distance-a.distance)
  }
  function renderForest(time){
    const{ctx,width,height}=surface;ctx.clearRect(0,0,width,height);const positions=layout();
    ctx.fillStyle='rgba(126,190,145,.055)';ctx.fillRect(0,0,width,height);
    positions.forEach(pos=>{
      const id=pos.label.dataset.surgeryId,cirugia=surgeryById(id),value=cirugia.porcentaje/100,growth=.22+value*.78,size=Math.min(height*.79,width*.31)*pos.scale;
      const treeHeight=size*growth,treeWidth=treeHeight*(228.36/261.18);
      ctx.save();ctx.globalAlpha=Math.max(.48,1-pos.distance*.12);if(id===selectedId){ctx.shadowColor='rgba(126,214,145,.9)';ctx.shadowBlur=18}
      if(treeAsset.complete&&treeAsset.naturalWidth)ctx.drawImage(treeAsset,pos.x-treeWidth/2,pos.y-treeHeight,treeWidth,treeHeight);
      ctx.restore();
      pos.label.style.left=`${pos.x}px`;pos.label.style.top=`${Math.min(height-46,pos.y+42)}px`;pos.label.style.opacity=String(Math.max(.56,1-pos.distance*.12));
    });
  }
  function updatePanel(){
    labels.forEach(label=>{const cirugia=surgeryById(label.dataset.surgeryId);label.querySelector('b').textContent=labelTitle(cirugia);label.querySelector('[data-percent]').textContent=statusText(cirugia);label.querySelector('.tree-label').setAttribute('aria-label',accessibleText(cirugia));label.classList.toggle('active',cirugia.id===selectedId);label.classList.toggle('is-stalled',cirugia.estado==='por-iniciar');label.classList.toggle('is-complete',cirugia.estado==='asegurada')});
    const cirugia=surgeryById(selectedId),montoReunido=amountFor(cirugia),meta=money(bosque.metaPorCirugia);
    document.querySelector('#selectedSurgeryStatus').textContent=cirugia.estado==='asegurada'?'Cirugía asegurada:':'Sueño por cumplir:';
    const selectedSurgery=document.querySelector('#selectedSurgery'),titleLines=cirugia.tituloLineas||[cirugia.titulo];
    selectedSurgery.replaceChildren(...titleLines.map(line=>{const span=document.createElement('span');span.textContent=line;return span}));
    selectedSurgery.setAttribute('aria-label',cirugia.titulo);
    document.querySelector('#raisedAmount').textContent=`${money(montoReunido)} reunidos de ${meta}`;
    document.querySelector('#goalAmount').textContent='';
    document.querySelector('#progressEquation').textContent=cirugia.estado==='en-proceso'
      ?`${cirugia.porcentaje}% reunido${Number.isFinite(cirugia.donativos)?` · ${cirugia.donativos} donativos`:''}`
      :`${cirugia.porcentaje}% del fondo de esta cirugía`;
    document.querySelector('#selectedProgress').style.width=`${cirugia.porcentaje}%`;
    const lastDonation=lastDonationByTree.get(selectedId);
    document.querySelector('#liveDonationAmount').textContent=lastDonation||'—';
    document.querySelector('#liveDonationContext').textContent=lastDonation?`${lastDonation} se sumaron al fondo de cirugías.`:'Aún no hay un donativo reciente para este árbol.';
  }
  function celebrateTree(id){
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    const tree=labels.find(label=>label.dataset.surgeryId===id);if(!tree)return;
    tree.classList.remove('celebrating');void tree.offsetWidth;tree.classList.add('celebrating');
    setTimeout(()=>tree.classList.remove('celebrating'),1500)
  }
  function chooseTree(id){selectedId=id;updatePanel();if(surgeryById(id).estado==='asegurada')celebrateTree(id)}
  labels.forEach(label=>label.querySelector('.tree-label').addEventListener('click',()=>chooseTree(label.dataset.surgeryId)));
  space.addEventListener('mousemove',event=>{targetPointer=Math.max(0,Math.min(1,event.clientX/window.innerWidth))});space.addEventListener('mouseleave',()=>targetPointer=.5);space.addEventListener('touchmove',event=>{targetPointer=event.touches[0].clientX/window.innerWidth},{passive:true});
  treeAsset.addEventListener('load',()=>renderForest(performance.now()),{once:true});
  const eventLayer=document.querySelector('#donationEvents'),noticeAmounts=['$2,500','$70','$190'],donationTargets=labels.filter(label=>surgeryById(label.dataset.surgeryId).estado!=='asegurada');let noticeIndex=0;
  function showDonationNotice(){
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    if(!eventLayer||!donationTargets.length)return;
    const currentNotice=noticeIndex,tree=donationTargets[currentNotice%donationTargets.length],amount=noticeAmounts[currentNotice%noticeAmounts.length];noticeIndex+=1;
    const notice=document.createElement('span'),left=parseFloat(tree.style.left)||surface.width/2,top=parseFloat(tree.style.top)||surface.height*.72;
    notice.className='donation-bubble';notice.textContent=amount;notice.style.left=`${left}px`;notice.style.top=`${Math.max(110,top-118)}px`;
    lastDonationByTree.set(tree.dataset.surgeryId,amount);
    if(selectedId===tree.dataset.surgeryId)updatePanel();
    eventLayer.append(notice);celebrateTree(tree.dataset.surgeryId);notice.addEventListener('animationend',()=>notice.remove(),{once:true})
  }
  setTimeout(()=>{showDonationNotice();setInterval(showDonationNotice,9000)},2200);
  updatePanel();scenes.push(renderForest);
}

function setupGrowthBack(){
  const button=document.querySelector('[data-growth-back]');if(!button)return;
  button.addEventListener('click',()=>{
    let previous=null;
    try{previous=document.referrer?new URL(document.referrer):null}catch(error){}
    if(previous&&previous.origin===location.origin&&history.length>1)history.back();
    else location.href='index.html';
  });
}

function setupCommunityBack(){
  const button=document.querySelector('[data-community-back]');if(!button)return;
  button.addEventListener('click',()=>{
    let previous=null;
    try{previous=document.referrer?new URL(document.referrer):null}catch(error){}
    if(previous&&previous.origin===location.origin&&history.length>1)history.back();
    else location.href='crecimiento.html';
  });
}

function setupCommunity(){
  const cloud=document.querySelector('#donorCloud');if(!cloud)return;
  const visibleDonors=[...comunidad.donantesVisibles];
  try{
    const saved=JSON.parse(localStorage.getItem('ec-public-donors-v1')||'[]');
    saved.slice(-3).reverse().forEach(donor=>{if(typeof donor!=='string'||!donor.trim()||visibleDonors.includes(donor.trim()))return;visibleDonors.unshift(donor.trim())})
  }catch(error){}
  document.querySelector('#communitySurgeries').textContent=String(comunidad.cirugiasRealizadas);
  document.querySelector('#communityDonors').textContent=String(comunidad.personasDonantes);
  const positions=[[18,17],[39,18],[63,17],[27,45],[53,24],[77,48],[36,56],[65,58]];
  const anonymous=document.createElement('span');anonymous.className='donor-chip donor-anonymous visible';anonymous.textContent=`+${comunidad.donantesAnonimos} donantes anónimos`;anonymous.setAttribute('aria-label',`${comunidad.donantesAnonimos} donantes anónimos`);anonymous.style.left='50%';anonymous.style.top='73%';cloud.append(anonymous);
  const renderDonors=start=>{
    cloud.querySelectorAll('.donor-chip:not(.donor-anonymous)').forEach(chip=>chip.remove());
    const occupied=[anonymous.getBoundingClientRect()];
    const names=Array.from({length:Math.min(8,visibleDonors.length)},(_,index)=>visibleDonors[(start+index)%visibleDonors.length]);
    names.forEach((name,index)=>{
      const chip=document.createElement('span');chip.className='donor-chip';chip.textContent=name;chip.setAttribute('aria-label',`${name}, donante`);cloud.append(chip);
      for(let offset=0;offset<positions.length;offset++){
        const position=positions[(index+offset)%positions.length];chip.style.left=`${position[0]}%`;chip.style.top=`${position[1]}%`;
        const rect=chip.getBoundingClientRect(),collides=occupied.some(other=>!(rect.right+8<other.left||rect.left-8>other.right||rect.bottom+8<other.top||rect.top-8>other.bottom));
        if(!collides||offset===positions.length-1){occupied.push(rect);break}
      }
      requestAnimationFrame(()=>chip.classList.add('visible'))
    })
  };
  let rotationStart=0;renderDonors(rotationStart);
  if(!matchMedia('(prefers-reduced-motion: reduce)').matches&&visibleDonors.length>8)setInterval(()=>{cloud.classList.add('is-changing');setTimeout(()=>{rotationStart=(rotationStart+8)%visibleDonors.length;renderDonors(rotationStart);cloud.classList.remove('is-changing')},360)},4000)
}

function setupCampaignSurgeryCount(){
  const value=document.querySelector('#campaignSurgeryCount');
  if(!value)return;
  const finalValue=4;
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){value.textContent=String(finalValue);return}
  value.textContent='1';
  const delay=1420,duration=4050;
  setTimeout(()=>{
    const startedAt=performance.now();
    const update=now=>{
      const progress=Math.min(1,(now-startedAt)/duration);
      value.textContent=String(1+Math.floor(progress*3));
      if(progress<1)requestAnimationFrame(update);else value.textContent=String(finalValue)
    };
    requestAnimationFrame(update)
  },delay)
}

function setupDonationSection(){
  const section=document.querySelector('#ayudar'),checkout=document.querySelector('#donationCheckout');
  if(!section||!(checkout instanceof HTMLDialogElement))return;
  const methodButtons=[...section.querySelectorAll('[data-donation-method]')];
  const cardPanel=document.querySelector('#cardDonationPanel'),transferPanel=document.querySelector('#transferDonationPanel');
  const amountButtons=[...section.querySelectorAll('[data-donation-amount]')],customButton=section.querySelector('[data-custom-amount]');
  const customWrap=document.querySelector('#customDonationWrap'),customInput=document.querySelector('#customDonationAmount');
  const selection=document.querySelector('#donationSelection'),continueButton=document.querySelector('#openDonationCheckout');
  const checkoutAmount=document.querySelector('#checkoutAmount'),checkoutSubmit=document.querySelector('#checkoutSubmit');
  const form=document.querySelector('#donationForm'),formView=document.querySelector('#checkoutFormView'),success=document.querySelector('#donationSuccess');
  const successAmount=document.querySelector('#successAmount'),successCommunityNote=document.querySelector('#successCommunityNote');
  let selectedAmount=500;
  const formatAmount=value=>new Intl.NumberFormat('es-MX',{maximumFractionDigits:0}).format(value);
  function updateAmount(amount){
    selectedAmount=Math.max(50,Math.round(Number(amount)||50));
    const formatted=formatAmount(selectedAmount);
    selection.innerHTML=`♥&nbsp; Elegiste donar <strong>$ ${formatted} MXN</strong>. Openpay te mostrará las opciones disponibles.`;
    checkoutAmount.innerHTML=`$ ${formatted} <small>MXN</small>`;
    checkoutSubmit.textContent=`Continuar en Openpay · $ ${formatted} MXN ↗`;
    successAmount.textContent=`$ ${formatted} MXN`;
  }
  function setMethod(method){
    const useCard=method==='card';
    cardPanel.hidden=!useCard;transferPanel.hidden=useCard;
    methodButtons.forEach(button=>{const active=button.dataset.donationMethod===method;button.classList.toggle('is-active',active);button.setAttribute('aria-selected',String(active))});
  }
  methodButtons.forEach(button=>button.addEventListener('click',()=>setMethod(button.dataset.donationMethod)));
  amountButtons.forEach(button=>button.addEventListener('click',()=>{
    amountButtons.forEach(item=>item.classList.toggle('is-selected',item===button));customButton.classList.remove('is-selected');customWrap.hidden=true;updateAmount(button.dataset.donationAmount)
  }));
  customButton.addEventListener('click',()=>{
    amountButtons.forEach(item=>item.classList.remove('is-selected'));customButton.classList.add('is-selected');customWrap.hidden=false;customInput.focus();if(Number(customInput.value)>=50)updateAmount(customInput.value)
  });
  customInput.addEventListener('input',()=>{if(Number(customInput.value)>=50)updateAmount(customInput.value)});
  continueButton.addEventListener('click',()=>{
    if(!customWrap.hidden&&Number(customInput.value)<50){customInput.setCustomValidity('El monto mínimo es de $50 MXN.');customInput.reportValidity();return}
    customInput.setCustomValidity('');formView.hidden=false;success.hidden=true;checkout.showModal()
  });
  checkout.querySelector('.checkout-close').addEventListener('click',()=>checkout.close());
  checkout.addEventListener('click',event=>{if(event.target===checkout)checkout.close()});
  document.querySelector('#changeDonationAmount').addEventListener('click',()=>{checkout.close();section.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'})});
  form.addEventListener('submit',event=>{
    event.preventDefault();
    const data=new FormData(form),name=String(data.get('name')||'').trim(),isPublic=data.get('donorVisibility')==='public';
    if(isPublic&&name){
      try{const saved=JSON.parse(localStorage.getItem('ec-public-donors-v1')||'[]'),updated=[...saved.filter(item=>item!==name),name].slice(-12);localStorage.setItem('ec-public-donors-v1',JSON.stringify(updated))}catch(error){}
      successCommunityNote.textContent=`Gracias, ${name}. Tu nombre aparecerá en la comunidad de donantes.`
    }else successCommunityNote.textContent='Tu aportación se reconocerá de forma anónima en la comunidad de donantes.';
    formView.hidden=true;success.hidden=false
  });
  document.querySelector('#closeDonationSuccess').addEventListener('click',()=>checkout.close());
  updateAmount(selectedAmount)
}

function setupIntroHeaderState(){
  const impact=document.querySelector('[data-nav-impact]'),donation=document.querySelector('#ayudar'),header=document.querySelector('.site-header');
  if(!impact||!donation)return;
  const sentinel=document.createElement('span');
  sentinel.className='nav-section-sentinel';
  sentinel.setAttribute('aria-hidden','true');
  donation.prepend(sentinel);
  let observer,resizeFrame=0,scrollFrame=0,currentState=null;
  const update=donationIsCurrent=>{
    if(donationIsCurrent===currentState)return;
    currentState=donationIsCurrent;
    impact.classList.toggle('active',!donationIsCurrent);
    if(donationIsCurrent)impact.removeAttribute('aria-current');else impact.setAttribute('aria-current','page')
  };
  const evaluatePosition=()=>{
    scrollFrame=0;
    const headerHeight=Math.ceil(header?.getBoundingClientRect().height||76);
    update(sentinel.getBoundingClientRect().top<=headerHeight)
  };
  const queuePosition=()=>{if(!scrollFrame)scrollFrame=requestAnimationFrame(evaluatePosition)};
  const observe=()=>{
    observer?.disconnect();
    const headerHeight=Math.ceil(header?.getBoundingClientRect().height||76);
    evaluatePosition();
    observer=new IntersectionObserver(queuePosition,{rootMargin:`-${headerHeight+1}px 0px 0px 0px`,threshold:0});
    observer.observe(sentinel)
  };
  addEventListener('resize',()=>{cancelAnimationFrame(resizeFrame);resizeFrame=requestAnimationFrame(observe)},{passive:true});
  addEventListener('scroll',queuePosition,{passive:true});
  observe()
}

function setupHeaderIndicator(){
  const nav=document.querySelector('.header-nav');
  if(!nav)return;
  const items=[...nav.children].filter(item=>item.matches('a,button')&&!item.matches('.nav-help,.nav-apply'));
  if(!items.length)return;
  const indicator=document.createElement('span');
  indicator.className='nav-shared-indicator';
  indicator.setAttribute('aria-hidden','true');
  nav.append(indicator);
  let previewItem=null,frame=0;
  const activeItem=()=>items.find(item=>item.classList.contains('active')||item.hasAttribute('aria-current'))||null;
  const place=(item,animate=true)=>{
    cancelAnimationFrame(frame);
    if(!item){
      indicator.style.width='0px';
      indicator.classList.remove('is-visible');
      if(animate)indicator.classList.add('is-ready');
      return
    }
    const range=document.createRange();
    range.selectNodeContents(item);
    const textRect=range.getBoundingClientRect(),itemRect=item.getBoundingClientRect();
    const x=item.offsetLeft+Math.max(0,textRect.left-itemRect.left);
    const y=item.offsetTop+item.offsetHeight-4;
    indicator.style.width=`${Math.max(1,textRect.width)}px`;
    indicator.style.transform=`translate3d(${x}px,${y}px,0)`;
    indicator.classList.add('is-visible');
    if(animate)indicator.classList.add('is-ready')
  };
  const returnToActive=()=>{previewItem=null;place(activeItem())};
  items.forEach(item=>{
    item.addEventListener('pointerenter',()=>{previewItem=item;place(item)});
    item.addEventListener('focus',()=>{previewItem=item;place(item)});
    if(item.matches('a[href]'))item.addEventListener('click',()=>{
      const current=activeItem(),index=items.indexOf(current);
      try{if(index>=0)sessionStorage.setItem('ec-nav-indicator-from',String(index));else sessionStorage.removeItem('ec-nav-indicator-from')}catch{}
    })
  });
  nav.querySelectorAll('.nav-help,.nav-apply').forEach(item=>{
    item.addEventListener('pointerenter',returnToActive);
    item.addEventListener('focus',returnToActive)
  });
  nav.addEventListener('pointerleave',returnToActive);
  nav.addEventListener('focusout',()=>setTimeout(()=>{if(!items.includes(document.activeElement))returnToActive()},0));
  const mutationObserver=new MutationObserver(()=>{if(!previewItem)place(activeItem())});
  items.forEach(item=>mutationObserver.observe(item,{attributes:true,attributeFilter:['class','aria-current']}));
  const queuePlacement=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>place(previewItem||activeItem(),false))};
  addEventListener('resize',queuePlacement,{passive:true});
  document.fonts?.ready.then(queuePlacement);
  let previousIndex=-1;
  try{const storedIndex=sessionStorage.getItem('ec-nav-indicator-from');if(storedIndex!==null)previousIndex=Number(storedIndex);sessionStorage.removeItem('ec-nav-indicator-from')}catch{}
  const current=activeItem(),currentIndex=items.indexOf(current);
  if(previousIndex>=0&&previousIndex<items.length&&previousIndex!==currentIndex){
    place(items[previousIndex],false);
    requestAnimationFrame(()=>requestAnimationFrame(()=>{indicator.classList.add('is-ready');place(current)}))
  }else{
    place(current,false);
    requestAnimationFrame(()=>indicator.classList.add('is-ready'))
  }
}

function setupMobileNavigation(){
  const header=document.querySelector('.site-header'),toggle=header?.querySelector('.mobile-nav-toggle'),nav=header?.querySelector('.header-nav');
  if(!header||!toggle||!nav)return;
  const setOpen=open=>{
    header.classList.toggle('menu-open',open);
    document.body.classList.toggle('mobile-menu-open',open);
    toggle.setAttribute('aria-expanded',String(open));
    toggle.setAttribute('aria-label',open?'Cerrar menú':'Abrir menú');
  };
  toggle.addEventListener('click',()=>setOpen(!header.classList.contains('menu-open')));
  nav.addEventListener('click',event=>{if(event.target.closest('a,button'))setOpen(false)});
  document.addEventListener('keydown',event=>{if(event.key==='Escape')setOpen(false)});
  addEventListener('resize',()=>{if(innerWidth>1100)setOpen(false)},{passive:true});
}

function setupNatureAmbient(){
  if(!['stories','growth','community'].includes(document.body.dataset.page))return;const AudioEngine=window.AudioContext||window.webkitAudioContext;if(!AudioEngine)return;let audioContext=null,started=false,birdTimer=null;
  function birdCall(){if(!started||!audioContext||audioContext.state!=='running')return;const now=audioContext.currentTime+.03,notes=2+Math.floor(Math.random()*2);for(let note=0;note<notes;note++){const oscillator=audioContext.createOscillator(),gain=audioContext.createGain(),start=now+note*.16,base=1450+Math.random()*650;oscillator.type='sine';oscillator.frequency.setValueAtTime(base,start);oscillator.frequency.exponentialRampToValueAtTime(base*1.42,start+.08);oscillator.frequency.exponentialRampToValueAtTime(base*.92,start+.19);gain.gain.setValueAtTime(.0001,start);gain.gain.exponentialRampToValueAtTime(.027,start+.035);gain.gain.exponentialRampToValueAtTime(.0001,start+.22);oscillator.connect(gain);gain.connect(audioContext.destination);oscillator.start(start);oscillator.stop(start+.24)}birdTimer=setTimeout(birdCall,2800+Math.random()*5200)}
  function beginNature(){if(started||!audioContext||audioContext.state!=='running')return;started=true;const duration=4,buffer=audioContext.createBuffer(1,audioContext.sampleRate*duration,audioContext.sampleRate),data=buffer.getChannelData(0);let smooth=0;for(let i=0;i<data.length;i++){smooth=smooth*.985+(Math.random()*2-1)*.015;data[i]=smooth*3.2}const windSource=audioContext.createBufferSource(),filter=audioContext.createBiquadFilter(),windGain=audioContext.createGain();windSource.buffer=buffer;windSource.loop=true;filter.type='lowpass';filter.frequency.value=850;windGain.gain.setValueAtTime(.0001,audioContext.currentTime);windGain.gain.exponentialRampToValueAtTime(.038,audioContext.currentTime+.9);windSource.connect(filter);filter.connect(windGain);windGain.connect(audioContext.destination);windSource.start();birdTimer=setTimeout(birdCall,900);unlockEvents.forEach(event=>window.removeEventListener(event,unlock))}
  function unlock(){audioContext=audioContext||new AudioEngine();audioContext.resume().then(beginNature).catch(()=>{})}
  const unlockEvents=['pointerdown','pointermove','touchstart','keydown'];unlockEvents.forEach(event=>window.addEventListener(event,unlock,{passive:true}));unlock()
}

setupStories();setupGrowth();setupGrowthBack();setupCommunityBack();setupCommunity();setupCampaignSurgeryCount();setupDonationSection();setupIntroHeaderState();setupMobileNavigation();setupHeaderIndicator();setupNatureAmbient();

const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
let lastFrame=0;
function animate(time){if(time-lastFrame>=33||!lastFrame){lastFrame=time;scenes.forEach(scene=>scene(time))}if(!reducedMotion)requestAnimationFrame(animate)}
requestAnimationFrame(animate);
