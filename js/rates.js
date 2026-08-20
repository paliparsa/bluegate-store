(function(){
  const KEY="bg_market_rates_v2";
  function cache(){try{return JSON.parse(localStorage.getItem(KEY)||"null")}catch(_){return null}}
  function save(v){try{localStorage.setItem(KEY,JSON.stringify(v))}catch(_){}}
  async function json(url,ms=5500){const c=new AbortController(),t=setTimeout(()=>c.abort(),ms);try{const r=await fetch(url,{signal:c.signal,headers:{Accept:"application/json"},cache:"no-store"});if(!r.ok)throw new Error("HTTP "+r.status);return await r.json()}finally{clearTimeout(t)}}
  async function marketFallback(){try{const d=await json("https://api.coingecko.com/api/v3/simple/price?ids=the-open-network,tron&vs_currencies=usd");return {ton_usd:Number(d?.["the-open-network"]?.usd)||null,trx_usd:Number(d?.tron?.usd)||null}}catch(_){return {ton_usd:null,trx_usd:null}}}
  async function fetchRates(fallback){
    const c=window.BG_CONFIG||{};const fn=c.RATE_FUNCTION_NAME||"market-rates";const url=c.SUPABASE_URL?c.SUPABASE_URL.replace(/\/$/,"")+"/functions/v1/"+fn:null;
    if(url&&c.SUPABASE_PUBLISHABLE_KEY){
      try{
        const r=await fetch(url,{headers:{apikey:c.SUPABASE_PUBLISHABLE_KEY,Authorization:"Bearer "+c.SUPABASE_PUBLISHABLE_KEY},cache:"no-store"});
        if(!r.ok)throw new Error("rate "+r.status);const d=await r.json();if(!(Number(d.usdt_toman)>0))throw new Error("bad rate");
        const extra=await marketFallback();
        const out={...d,trx_usd:Number(d.trx_usd)||extra.trx_usd||null,ton_usd:Number(d.ton_usd)||extra.ton_usd||null,stale:false};
        delete out.gram_usd;save(out);return out;
      }catch(_){}
    }
    const old=cache();if(old?.usdt_toman)return {...old,stale:true,source:(old.source||"Cache")+" / cached"};
    const extra=await marketFallback();return {usdt_toman:Number(fallback||c.FALLBACK_USDT_TOMAN||192000),trx_usd:extra.trx_usd,ton_usd:extra.ton_usd,checked_at:new Date().toISOString(),source:"Fallback",stale:true};
  }
  function ceil(v,d=2){const p=10**d;return Math.ceil((Number(v)-Number.EPSILON)*p)/p}
  function amounts(toman,r){const usdt=Number(toman)/Number(r.usdt_toman);return {usdt:ceil(usdt,2),trx:r.trx_usd?ceil(usdt/Number(r.trx_usd),2):null,ton:r.ton_usd?ceil(usdt/Number(r.ton_usd),3):null}}
  window.BGRates={fetchRates,amounts};
})();
