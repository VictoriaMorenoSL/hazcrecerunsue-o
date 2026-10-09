const traceScroller=document.querySelector('[data-trace-scroll]');

function setupHeroTreeVideo(){
  const video=document.querySelector('.companies-hero-tree video');if(!video)return;
  const play=()=>video.play().catch(()=>{});
  if(video.readyState>=2)play();else video.addEventListener('canplay',play,{once:true});
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)play()});
}

function setupCompanyAccordions(){
  const root=document.querySelector('[data-company-accordions]');
  if(!root)return;
  const items=[...root.querySelectorAll('.company-accordion')];
  const setState=(item,open)=>{
    const trigger=item.querySelector('.company-accordion-trigger');
    const panel=item.querySelector('.company-accordion-panel');
    item.classList.toggle('is-open',open);
    trigger.setAttribute('aria-expanded',String(open));
    panel.setAttribute('aria-hidden',String(!open));
    panel.inert=!open;
    panel.querySelectorAll('video').forEach(video=>{
      if(open)video.play().catch(()=>{});
      else video.pause();
    });
  };
  items.forEach(item=>{
    const trigger=item.querySelector('.company-accordion-trigger');
    trigger.addEventListener('click',()=>{
      const willOpen=!item.classList.contains('is-open');
      items.forEach(other=>setState(other,other===item&&willOpen));
    });
  });
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
    if(!item){indicator.style.width='0px';indicator.classList.remove('is-visible');if(animate)indicator.classList.add('is-ready');return}
    const range=document.createRange();
    range.selectNodeContents(item);
    const textRect=range.getBoundingClientRect(),itemRect=item.getBoundingClientRect();
    const x=item.offsetLeft+Math.max(0,textRect.left-itemRect.left),y=item.offsetTop+item.offsetHeight-4;
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
      const index=items.indexOf(activeItem());
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
  if(previousIndex>=0&&previousIndex<items.length&&previousIndex!==currentIndex){place(items[previousIndex],false);requestAnimationFrame(()=>requestAnimationFrame(()=>{indicator.classList.add('is-ready');place(current)}))}
  else{place(current,false);requestAnimationFrame(()=>indicator.classList.add('is-ready'))}
}

if(traceScroller){
  traceScroller.addEventListener('wheel',event=>{
    const maxScroll=traceScroller.scrollWidth-traceScroller.clientWidth;
    if(maxScroll<=0)return;
    const movement=Math.abs(event.deltaX)>Math.abs(event.deltaY)?event.deltaX:event.deltaY;
    const movingForward=movement>0&&traceScroller.scrollLeft<maxScroll;
    const movingBack=movement<0&&traceScroller.scrollLeft>0;
    if(movingForward||movingBack){event.preventDefault();traceScroller.scrollLeft+=movement}
  },{passive:false});

  traceScroller.addEventListener('keydown',event=>{
    if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
    event.preventDefault();
    const amount=Math.max(220,traceScroller.clientWidth*.55);
    if(event.key==='ArrowLeft')traceScroller.scrollBy({left:-amount,behavior:'smooth'});
    if(event.key==='ArrowRight')traceScroller.scrollBy({left:amount,behavior:'smooth'});
    if(event.key==='Home')traceScroller.scrollTo({left:0,behavior:'smooth'});
    if(event.key==='End')traceScroller.scrollTo({left:traceScroller.scrollWidth,behavior:'smooth'});
  });
}

setupMobileNavigation();
setupHeaderIndicator();
setupHeroTreeVideo();
setupCompanyAccordions();
