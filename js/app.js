(function(){
const $=id=>document.getElementById(id);
const state={settings:null,content:null,vpnPlans:[],vpnPackages:[],premium:[],rates:null,stars:1000,activeProduct:'vpn',selectedVpnPlan:null,selectedVpnPackage:null,selectedPremium:null,stickyAction:null};
const fallback={settings:{brand_name:'BlueGate',brand_subtitle:'Digital Services',hero_title:'سرویس‌های دیجیتال، ساده و سریع',hero_text:'VPN، تلگرام استارز و تلگرام پرمیوم با قیمت شفاف و سفارش مستقیم از پشتیبانی.',telegram_support:'bluegatesupport',telegram_channel:'BllueGate',announcement_enabled:true,announcement_text:'سرویس موردنظرت رو انتخاب کن و سفارش رو مستقیم بفرست پشتیبانی.',footer_text:'سرویس‌های دیجیتال با پشتیبانی واقعی.',stars_price_basis:'usdt',star_base_usdt:.015,star_base_toman:2880,star_sell_per_unit_usdt:.018,star_sell_per_unit_toman:3456,stars_markup:20,premium_markup:20,slider_min:50,slider_max:10000,slider_step:25,slider_presets:[100,500,1000,2500,5000],smart_rounding_enabled:true,round_small:5000,round_medium:10000,round_large:20000,fallback_usdt_toman:192000,show_reviews:true,show_tutorials:false,show_comparison:true},premium:[{id:1,months:3,label:'3 ماهه',base_usdt:11.99,sell_usdt:14.388,featured:false},{id:2,months:6,label:'6 ماهه',base_usdt:15.99,sell_usdt:19.188,featured:true},{id:3,months:12,label:'12 ماهه',base_usdt:28.99,sell_usdt:34.788,featured:false}]};
function fmt(n,d=0){return Number(n||0).toLocaleString('en-US',{maximumFractionDigits:d})}
function crypto(n,d){return n==null?'—':Number(n).toLocaleString('en-US',{maximumFractionDigits:d})}
function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
function tg(u){return 'https://t.me/'+String(u||'').replace(/^@/,'')}
function safeRate(){return state.rates?.usdt_toman||state.settings?.fallback_usdt_toman||192000}
async function load(){if(!window.BGApi.configured()){demo();return}try{const [s,c,v,p,pr]=await Promise.all([BGApi.rest('public_settings?select=*&id=eq.1'),BGApi.rest('content_settings?select=*&id=eq.1'),BGApi.rest('vpn_plans?select=*&active=eq.true&order=sort_order.asc'),BGApi.rest('vpn_packages?select=*&active=eq.true&order=sort_order.asc'),BGApi.rest('premium_public?select=*&active=eq.true&order=months.asc')]);state.settings={...fallback.settings,...s[0]};state.content=c[0]||{};state.vpnPlans=v||[];state.vpnPackages=p||[];state.premium=pr?.length?pr:fallback.premium}catch(e){console.warn(e);demo()}}
function demo(){state.settings=fallback.settings;state.content={features:[{icon:'⚡',title:'تحویل سریع',text:'بعد از هماهنگی با پشتیبانی، سفارش بدون مسیر اضافه انجام می‌شود.'},{icon:'🎧',title:'پشتیبانی مستقیم',text:'قبل و بعد از خرید می‌توانی مستقیم با پشتیبانی تلگرام در ارتباط باشی.'},{icon:'📈',title:'قیمت لحظه‌ای',text:'برای سرویس‌های ارزی، نرخ بازار به‌صورت زنده در محاسبه استفاده می‌شود.'},{icon:'✓',title:'انتخاب شفاف',text:'قیمت و جزئیات هر محصول قبل از ثبت سفارش واضح نمایش داده می‌شود.'}],faq:[{q:'سرویس‌ها روی چه دستگاه‌هایی کار می‌کنند؟',a:'بسته به سرویس، روی اندروید، iOS، ویندوز، مک و لینوکس قابل استفاده‌اند.'},{q:'بعد از ثبت سفارش چه اتفاقی می‌افتد؟',a:'تلگرام با یک رسید آماده باز می‌شود. پیام را برای پشتیبانی ارسال می‌کنی و ادامه فرایند از همانجا انجام می‌شود.'}],reviews:[{name:'مشتری BlueGate',rating:5,text:'فرایند انتخاب و سفارش سریع بود و پشتیبانی هم جواب داد.'},{name:'کاربر BluePing',rating:5,text:'پلن‌ها واضح بودن و برای انتخاب سرویس گیج نشدم.'},{name:'مشتری Telegram',rating:5,text:'قیمت لحظه‌ای و رسید آماده تلگرام خیلی کاربردی بود.'}],tutorials:[],comparison:[]};state.vpnPlans=[{id:1,slug:'standard',title:'BlueGate Standard',subtitle:'مولتی لوکیشن • مناسب استفاده روزمره',note:'اقتصادی و مناسب مصرف عادی',theme:'green',icon:'🛡️',sort_order:1},{id:2,slug:'pro',title:'BlueGate Pro',subtitle:'آی‌پی ثابت • مناسب ترید و استفاده حرفه‌ای',note:'پایداری و سرعت بالا',theme:'purple',icon:'🚀',sort_order:2},{id:3,slug:'emergency',title:'BlueGate Emergency',subtitle:'ویژه قطعی یا اختلال شدید اینترنت',note:'مخصوص شرایط بحرانی',theme:'blue',icon:'⚡',sort_order:3}];state.vpnPackages=[{id:1,plan_id:1,label:'20 گیگ',price_toman:99000,sort_order:1},{id:2,plan_id:1,label:'30 گیگ',price_toman:149000,sort_order:2},{id:3,plan_id:1,label:'50 گیگ',price_toman:199000,sort_order:3},{id:4,plan_id:1,label:'نامحدود (تک کاربر)',price_toman:249000,sort_order:4},{id:5,plan_id:2,label:'5 گیگ',price_toman:69000,sort_order:1},{id:6,plan_id:2,label:'10 گیگ',price_toman:139000,sort_order:2},{id:7,plan_id:2,label:'20 گیگ',price_toman:249000,sort_order:3},{id:8,plan_id:3,label:'5 گیگ',price_toman:195000,sort_order:1},{id:9,plan_id:3,label:'10 گیگ',price_toman:390000,sort_order:2}];state.premium=fallback.premium}
async function refreshRates(){const s=state.settings||fallback.settings;$('rateState').textContent='در حال دریافت نرخ‌ها';$('rateDot').className='live-dot loading';try{state.rates=await BGRates.fetchRates(s.fallback_usdt_toman);$('usdtRate').textContent=fmt(state.rates.usdt_toman)+' ت';$('trxRate').textContent=state.rates.trx_usd?'$'+Number(state.rates.trx_usd).toFixed(4):'—';$('tonRate').textContent=state.rates.ton_usd?'$'+Number(state.rates.ton_usd).toFixed(4):'—';['usdtRate','trxRate','tonRate'].forEach(id=>$(id).classList.remove('rate-loading'));$('rateState').textContent=state.rates.stale?'آخرین نرخ معتبر':'نرخ زنده بازار';$('rateDot').className='live-dot '+(state.rates.stale?'':'ok');$('rateAge').textContent=state.rates.source||state.rates.selected_source||'Market';renderDynamicPrices()}catch(e){$('rateState').textContent='نرخ لحظه‌ای در دسترس نیست';$('rateAge').textContent='استفاده از نرخ پشتیبان';renderDynamicPrices()}}
function renderShell(){const s=state.settings;$('brandName').textContent=s.brand_name;$('brandSubtitle').textContent=s.brand_subtitle;$('heroTitle').textContent=s.hero_title;$('heroText').textContent=s.hero_text;$('footerText').textContent=s.footer_text;['supportTop','mobileSupport','heroSupport','footerSupport','faqSupport'].forEach(id=>{if($(id))$(id).href=tg(s.telegram_support)});$('footerChannel').href=tg(s.telegram_channel);if(s.announcement_enabled&&s.announcement_text){$('announcement').textContent=s.announcement_text;$('announcement').classList.remove('hidden')}}
function renderVpn(){
  const wrap=$('vpnPlans');
  wrap.innerHTML='';
  if(!state.vpnPlans.length){
    wrap.innerHTML='<div class="empty-state">فعلاً پلن VPN فعالی برای نمایش وجود ندارد.</div>';
    return
  }
  const hasSelection=!!state.selectedVpnPlan;
  state.vpnPlans.forEach(plan=>{
    const pk=state.vpnPackages.filter(x=>String(x.plan_id)===String(plan.id));
    const slug=String(plan.slug||plan.title||'').toLowerCase();
    const selected=String(state.selectedVpnPlan?.id)===String(plan.id);
    const tag=slug.includes('pro')?'پیشنهاد BlueGate':slug.includes('emergency')?'شرایط خاص':'اقتصادی';
    const benefits=slug.includes('pro')
      ?['آی‌پی ثابت','پایداری بالا','مناسب فعالیت حساس']
      :slug.includes('emergency')
        ?['ویژه اختلال','دسترسی اضطراری','زمان استفاده منعطف']
        :['چند لوکیشن','مناسب روزمره','ارزش خرید بالا'];
    const c=document.createElement('button');
    c.type='button';
    c.className='vpn-choice'+(selected?' selected':'')+(hasSelection&&!selected?' de-emphasized':'');
    c.dataset.theme=plan.theme||'blue';
    c.dataset.plan=plan.id;
    c.setAttribute('aria-pressed',selected?'true':'false');
    c.innerHTML=`<span class="vpn-ribbon">${tag}</span><div class="vpn-choice-head"><div><h4>${esc(plan.title)}</h4><p>${esc(plan.subtitle||'')}</p><div class="vpn-choice-note">${esc(plan.note||'')}</div></div><div class="vpn-choice-icon">${esc(plan.icon||'🛡️')}</div></div><div class="vpn-benefits">${benefits.map(x=>`<span><i>✓</i>${esc(x)}</span>`).join('')}</div><div class="vpn-choice-pills">${(plan.pills||[]).slice(0,3).map(x=>`<span>${esc(x.title||x)}</span>`).join('')}<span>${pk.length} پکیج</span></div><div class="vpn-choice-action"><span>${selected?'انتخاب شد — پکیج رو بردار':'مشاهده پکیج‌ها'}</span><b>${selected?'✓':'←'}</b></div>`;
    c.addEventListener('click',()=>selectVpnPlan(plan));
    wrap.appendChild(c)
  })
}
function selectVpnPlan(plan){
  state.selectedVpnPlan=plan;
  state.selectedVpnPackage=null;
  renderVpn();
  renderVpnPackages();
  const stage=$('vpnPackageStage');
  stage.classList.remove('hidden');
  stage.classList.remove('stage-enter');
  void stage.offsetWidth;
  stage.classList.add('stage-enter');
  stage.scrollIntoView({behavior:'smooth',block:'nearest'});
  syncSticky()
}
function renderVpnPackages(){
  const plan=state.selectedVpnPlan;
  if(!plan)return;
  const slug=String(plan.slug||plan.title||'').toLowerCase();
  const theme=plan.theme||'blue';

  $('vpnPackageStage').dataset.theme=theme;
  $('vpnSelectedTitle').textContent=plan.title;
  $('vpnSelectedSubtitle').textContent=plan.subtitle||'';
  $('vpnSelectedIcon').textContent=plan.icon||'🛡️';

  const bestFor=slug.includes('pro')
    ?['ترید','گیم','استریم','فعالیت حساس']
    :slug.includes('emergency')
      ?['قطعی اینترنت','اختلال شدید','دسترسی ضروری']
      :['وب‌گردی','پیام‌رسان','استفاده روزمره'];
  $('vpnBestFor').innerHTML=bestFor.map(x=>`<span>${esc(x)}</span>`).join('');

  $('vpnCompareHint').textContent=slug.includes('pro')
    ?'پایداری بیشتر و آی‌پی ثابت برای استفاده حرفه‌ای'
    :slug.includes('emergency')
      ?'گزینه مخصوص شرایط اختلال و دسترسی ضروری'
      :'انتخاب اقتصادی برای مصرف عادی و روزمره';

  const list=$('vpnPackageList');
  list.innerHTML='';
  const pk=state.vpnPackages.filter(x=>String(x.plan_id)===String(plan.id));
  $('vpnPackageCount').textContent=pk.length+' پکیج';

  if(!pk.length){
    list.innerHTML='<div class="empty-state">برای این پلن هنوز پکیجی فعال نشده.</div>';
    $('vpnBuy').disabled=true;
    updateVpnSelection();
    return
  }

  const parsed=pk.map(pkg=>{
    const m=String(pkg.label||'').match(/([0-9۰-۹]+)\s*(?:GB|گیگ)/i);
    if(!m)return {pkg,gb:null,perGb:null};
    const digits=m[1].replace(/[۰-۹]/g,d=>'۰۱۲۳۴۵۶۷۸۹'.indexOf(d));
    const gb=Number(digits);
    return {pkg,gb:gb>0?gb:null,perGb:gb>0?Number(pkg.price_toman||0)/gb:null}
  });
  const perGbValues=parsed.filter(x=>x.perGb).map(x=>x.perGb);
  const worstPerGb=perGbValues.length?Math.max(...perGbValues):null;
  const bestPerGb=perGbValues.length?Math.min(...perGbValues):null;

  parsed.forEach((item,i)=>{
    const pkg=item.pkg;
    const selected=String(state.selectedVpnPackage?.id)===String(pkg.id);
    let unit='';
    let saving='';
    if(item.perGb){
      unit=fmt(Math.ceil(item.perGb))+' تومان / گیگ';
      if(worstPerGb&&item.perGb<worstPerGb){
        const pct=Math.max(1,Math.round((1-item.perGb/worstPerGb)*100));
        saving=pct+'٪ به‌صرفه‌تر'
      }
    }
    const balanced=i===Math.floor(pk.length/2)&&pk.length>2;
    const best=item.perGb&&bestPerGb&&Math.abs(item.perGb-bestPerGb)<0.01&&perGbValues.length>1;
    const kicker=best?'بهترین ارزش خرید':balanced?'انتخاب متعادل':'پکیج';
    const b=document.createElement('button');
    b.type='button';
    b.className='vpn-package'+(selected?' selected':'')+(best?' best-package':'');
    b.innerHTML=`<span class="package-kicker">${kicker}</span>${saving?`<span class="package-saving">${saving}</span>`:''}<span class="package-label">${esc(pkg.label)}</span><strong>${fmt(pkg.price_toman)}</strong><small>تومان</small>${unit?`<em>${unit}</em>`:''}<span class="package-cta-copy">${selected?'انتخاب شد':'انتخاب این پکیج'}</span><i class="package-check">✓</i>`;
    b.addEventListener('click',()=>{
      state.selectedVpnPackage=pkg;
      renderVpnPackages();
      updateVpnSelection();
      syncSticky()
    });
    list.appendChild(b)
  });
  updateVpnSelection()
}
function updateVpnSelection(){
  const pkg=state.selectedVpnPackage;
  $('vpnAction').classList.toggle('muted-selection',!pkg);
  $('vpnBuy').disabled=!pkg;
  $('vpnSelectionPrice').textContent=pkg?fmt(pkg.price_toman)+' تومان':'—';
  if($('vpnSelectionLabel'))$('vpnSelectionLabel').textContent=pkg?`${state.selectedVpnPlan?.title||''} · ${pkg.label}`:'یک پکیج انتخاب کن';
  $('vpnBuy').textContent=pkg?`ادامه با ${pkg.label}`:'انتخاب پکیج'
}
function vpnCheckout(){if(!state.selectedVpnPlan||!state.selectedVpnPackage)return;const p=state.selectedVpnPackage;BGCheckout.open({scope:'vpn',product:state.selectedVpnPlan.title,variant:p.label,toman:BGPricing.vpn(p),rates:state.rates||{usdt_toman:safeRate()},telegram:state.settings.telegram_support})}
function setupStars(){const s=state.settings,input=$('starsInput'),slider=$('starsSlider');slider.min=input.min=s.slider_min;slider.max=input.max=s.slider_max;slider.step=s.slider_step;state.stars=Math.min(s.slider_max,Math.max(s.slider_min,1000));slider.value=input.value=state.stars;$('starsMin').textContent=fmt(s.slider_min);$('starsMax').textContent=fmt(s.slider_max);const p=$('starsPresets');p.innerHTML='';(s.slider_presets||[]).forEach(n=>{const b=document.createElement('button');b.className='preset';b.type='button';b.dataset.stars=n;b.textContent=fmt(n)+' ★';b.addEventListener('click',()=>{state.stars=Number(n);input.value=slider.value=state.stars;renderStars();syncSticky()});p.appendChild(b)});renderStars()}
function renderStars(){const r=state.rates||{usdt_toman:safeRate()};const s=state.settings,toman=BGPricing.stars(state.stars,s,r),a=BGRates.amounts(toman,r);$('starsToman').textContent=fmt(toman);$('starsUsdt').textContent=crypto(a.usdt,2);$('starsTrx').textContent=crypto(a.trx,2);$('starsTon').textContent=crypto(a.ton,3);$('starsReceive')&&($('starsReceive').textContent=fmt(state.stars));$('starsMinimum')&&($('starsMinimum').textContent=fmt(s.slider_min));document.querySelectorAll('.preset').forEach(b=>b.classList.toggle('active',Number(b.dataset.stars)===Number(state.stars)));syncSticky()}
function starsCheckout(){const r=state.rates||{usdt_toman:safeRate()};const toman=BGPricing.stars(state.stars,state.settings,r);BGCheckout.open({scope:'stars',product:'Telegram Stars',variant:fmt(state.stars)+' Stars',toman,rates:r,telegram:state.settings.telegram_support})}
function renderPremium(){const w=$('premiumPlans');w.innerHTML='';if(!state.premium.length){w.innerHTML='<div class="empty-state">فعلاً پلن Premium فعالی برای نمایش وجود ندارد.</div>';return}const maxMonths=Math.max(...state.premium.map(x=>Number(x.months||0)));state.premium.forEach(plan=>{const toman=premiumToman(plan),a=BGRates.amounts(toman,state.rates||{usdt_toman:safeRate()});const selected=String(state.selectedPremium?.id)===String(plan.id);const c=document.createElement('button');c.type='button';c.className='premium-choice'+(plan.featured?' featured':'')+(Number(plan.months)===maxMonths?' best-value':'')+(selected?' selected':'');c.dataset.id=plan.id;const badge=plan.featured?'پیشنهاد ما':Number(plan.months)===maxMonths?'ارزش خرید بیشتر':'شروع سریع';const monthly=Number(plan.months)>0?Math.ceil(toman/Number(plan.months)):0;c.innerHTML=`<span class="premium-badge">${badge}</span><div class="premium-symbol">✈️</div><h4>${esc(plan.label||plan.months+' ماهه')}</h4><p>${esc(plan.badge||'اشتراک Telegram Premium')}</p><div class="premium-main-price">${fmt(toman)} <small>تومان</small></div><div class="monthly-equivalent">معادل ماهی <b>${fmt(monthly)}</b> تومان</div><div class="premium-benefits"><span>✓ فعال‌سازی رسمی</span><span>✓ تحویل سریع</span><span>✓ پشتیبانی مستقیم</span></div><div class="premium-secondary"><span>${crypto(a.usdt,2)} USDT</span><span>${crypto(a.trx,2)} TRX</span><span>${crypto(a.ton,3)} TON</span></div><div class="premium-select-copy">انتخاب این پلن <b>←</b></div><div class="premium-check">✓</div>`;c.addEventListener('click',()=>selectPremium(plan));w.appendChild(c)});updatePremiumSummary()}
function premiumToman(plan){const r=state.rates||{usdt_toman:safeRate()};if(plan.sell_usdt!=null)return BGPricing.roundUp(Number(plan.sell_usdt)*Number(r.usdt_toman),state.settings);return BGPricing.premium(plan,state.settings,r)}
function selectPremium(plan){state.selectedPremium=plan;renderPremium();syncSticky()}
function updatePremiumSummary(){const p=state.selectedPremium;if(!p){$('premiumSelectedLabel').textContent='هنوز انتخاب نشده';$('premiumSelectedPrice').textContent='—';$('premiumBuy').disabled=true;return}$('premiumSelectedLabel').textContent=p.label||p.months+' ماهه';$('premiumSelectedPrice').textContent=fmt(premiumToman(p));$('premiumBuy').disabled=false}
function premiumCheckout(){if(!state.selectedPremium)return;const p=state.selectedPremium;BGCheckout.open({scope:'premium',product:'Telegram Premium',variant:p.label||p.months+' ماهه',toman:premiumToman(p),rates:state.rates||{usdt_toman:safeRate()},telegram:state.settings.telegram_support})}
function renderContent(){const c=state.content||{};const f=$('featureGrid');f.innerHTML='';const features=(c.features||[]).length?c.features:demoFeatures();features.slice(0,6).forEach(x=>f.insertAdjacentHTML('beforeend',`<article class="feature-card"><div class="feature-icon">${esc(x.icon||'✓')}</div><h3>${esc(x.title||'')}</h3><p>${esc(x.text||'')}</p></article>`));const q=$('faqList');q.innerHTML='';(c.faq||[]).forEach(x=>{const d=document.createElement('div');d.className='faq-item';d.innerHTML=`<button class="faq-q" type="button"><span>${esc(x.q)}</span><b>+</b></button><div class="faq-a hidden">${esc(x.a)}</div>`;d.querySelector('button').addEventListener('click',()=>{const willOpen=!d.classList.contains('open');q.querySelectorAll('.faq-item.open').forEach(item=>{item.classList.remove('open');item.querySelector('.faq-a')?.classList.add('hidden')});if(willOpen){d.classList.add('open');d.querySelector('.faq-a').classList.remove('hidden')}});q.appendChild(d)});if(!q.children.length)q.innerHTML='<div class="empty-state">سوالی ثبت نشده؛ از پشتیبانی بپرس.</div>';const reviews=(c.reviews||[]);if(state.settings.show_reviews&&reviews.length){$('reviewsSection').classList.remove('hidden');$('reviewsGrid').innerHTML=reviews.map(x=>`<article class="review-card"><div class="review-quote">“</div><div class="stars">${'★'.repeat(Number(x.rating||5))}</div><h3>${esc(x.name||'مشتری BlueGate')}</h3><p>${esc(x.text||'')}</p></article>`).join('')}if(state.settings.show_tutorials&&(c.tutorials||[]).length){$('tutorialsSection').classList.remove('hidden');$('tutorialsGrid').innerHTML=(c.tutorials||[]).map(x=>`<article class="tutorial-card"><h3>${esc(x.os||'')} — ${esc(x.app||'')}</h3><ol>${(x.steps||[]).map(s=>`<li>${esc(s)}</li>`).join('')}</ol></article>`).join('')}if(state.settings.show_comparison&&(c.comparison||[]).length){$('comparisonSection').classList.remove('hidden');const headers=state.vpnPlans.map(p=>p.title);$('comparisonTable').innerHTML=`<thead><tr><th>ویژگی</th>${headers.map(h=>`<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${c.comparison.map(r=>`<tr><td>${esc(r.feature||'')}</td>${state.vpnPlans.map(p=>`<td>${esc(r[p.slug]||'')}</td>`).join('')}</tr>`).join('')}</tbody>`}}
function demoFeatures(){return [{icon:'⚡',title:'تحویل سریع',text:'فرایند سفارش کوتاه و مستقیم است.'},{icon:'🎧',title:'پشتیبانی مستقیم',text:'ارتباط با پشتیبانی از طریق تلگرام.'},{icon:'📈',title:'قیمت لحظه‌ای',text:'محاسبه سرویس‌های ارزی با نرخ تازه بازار.'},{icon:'✓',title:'انتخاب شفاف',text:'جزئیات و قیمت قبل از سفارش کاملاً مشخص است.'}]}
function renderDynamicPrices(){renderStars();renderPremium();if(state.selectedVpnPackage)updateVpnSelection();syncSticky()}
function activateProduct(product,scroll=false){state.activeProduct=product;const map={vpn:'vpnPanel',stars:'starsPanel',premium:'premiumPanel'};document.querySelectorAll('.product-tab').forEach(x=>x.classList.toggle('active',x.dataset.product===product));document.querySelectorAll('.product-panel').forEach(x=>x.classList.toggle('active',x.id===map[product]));document.querySelectorAll('#serviceNav button').forEach(x=>x.classList.toggle('active',x.dataset.service===product));syncSticky();if(scroll)$('products').scrollIntoView({behavior:'smooth',block:'start'})}
function syncSticky(){const bar=$('stickyCheckout');let product='',variant='',price=0,action=null;if(state.activeProduct==='vpn'&&state.selectedVpnPlan&&state.selectedVpnPackage){product=state.selectedVpnPlan.title;variant=state.selectedVpnPackage.label;price=BGPricing.vpn(state.selectedVpnPackage);action=vpnCheckout}else if(state.activeProduct==='stars'){const r=state.rates||{usdt_toman:safeRate()};product='Telegram Stars';variant=fmt(state.stars)+' Stars';price=BGPricing.stars(state.stars,state.settings,r);action=starsCheckout}else if(state.activeProduct==='premium'&&state.selectedPremium){product='Telegram Premium';variant=state.selectedPremium.label||state.selectedPremium.months+' ماهه';price=premiumToman(state.selectedPremium);action=premiumCheckout}state.stickyAction=action;if(!action){bar.classList.add('hidden');return}$('stickyProduct').textContent=product;$('stickyVariant').textContent=variant;$('stickyPrice').textContent=fmt(price);bar.classList.remove('hidden')}
function bind(){document.querySelectorAll('.product-tab').forEach(b=>b.addEventListener('click',()=>activateProduct(b.dataset.product,true)));document.querySelectorAll('#serviceNav button').forEach(b=>b.addEventListener('click',()=>activateProduct(b.dataset.service,true)));$('changeVpnPlan').addEventListener('click',()=>{const stage=$('vpnPackageStage');stage.classList.add('hidden');stage.classList.remove('stage-enter');state.selectedVpnPlan=null;state.selectedVpnPackage=null;renderVpn();syncSticky();$('vpnPlans').scrollIntoView({behavior:'smooth',block:'center'})});$('vpnBuy').addEventListener('click',vpnCheckout);$('premiumBuy').addEventListener('click',premiumCheckout);$('starsSlider').addEventListener('input',e=>{state.stars=Number(e.target.value);$('starsInput').value=state.stars;renderStars()});$('starsInput').addEventListener('input',e=>{if(e.target.value!==''){state.stars=Math.min(state.settings.slider_max,Math.max(state.settings.slider_min,Number(e.target.value)));$('starsSlider').value=state.stars;renderStars()}});$('starsMinus').addEventListener('click',()=>{state.stars=Math.max(state.settings.slider_min,state.stars-state.settings.slider_step);$('starsInput').value=$('starsSlider').value=state.stars;renderStars()});$('starsPlus').addEventListener('click',()=>{state.stars=Math.min(state.settings.slider_max,state.stars+state.settings.slider_step);$('starsInput').value=$('starsSlider').value=state.stars;renderStars()});$('starsBuy').addEventListener('click',starsCheckout);$('stickyBuy').addEventListener('click',()=>state.stickyAction?.());$('themeBtn').addEventListener('click',()=>{document.body.classList.toggle('light');localStorage.setItem('bg_theme',document.body.classList.contains('light')?'light':'dark')});if(localStorage.getItem('bg_theme')==='light')document.body.classList.add('light');$('mobileMenuBtn').addEventListener('click',()=>$('mobileMenu').classList.toggle('hidden'));$('mobileMenu').querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>$('mobileMenu').classList.add('hidden')));$('reviewsPrev').addEventListener('click',()=>$('reviewsGrid').scrollBy({left:380,behavior:'smooth'}));$('reviewsNext').addEventListener('click',()=>$('reviewsGrid').scrollBy({left:-380,behavior:'smooth'}));const navLinks=[...document.querySelectorAll('[data-nav-link]')];const observed=['products','why','reviewsSection','faq'].map(id=>$(id)).filter(Boolean);if('IntersectionObserver'in window){const io=new IntersectionObserver(entries=>{const e=entries.filter(x=>x.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];if(!e)return;navLinks.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+e.target.id))},{rootMargin:'-25% 0px -60% 0px',threshold:[0,.15,.4]});observed.forEach(x=>io.observe(x))}const header=$('siteHeader');const onScroll=()=>header?.classList.toggle('scrolled',window.scrollY>24);onScroll();window.addEventListener('scroll',onScroll,{passive:true});document.addEventListener('keydown',e=>{if(e.key==='Escape'){$('mobileMenu')?.classList.add('hidden');document.querySelector('#checkoutModal:not(.hidden) #modalClose')?.click()}})}
async function init(){await load();renderShell();renderVpn();setupStars();renderPremium();renderContent();bind();await refreshRates();setInterval(refreshRates,Math.max(30,Number(BG_CONFIG.RATE_REFRESH_SECONDS||60))*1000);if('serviceWorker'in navigator&&location.protocol.startsWith('http'))navigator.serviceWorker.register('sw.js').catch(()=>{})}
document.addEventListener('DOMContentLoaded',init);
})();
