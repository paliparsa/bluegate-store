(function(){
  const cfg=()=>window.BG_CONFIG||{};
  function configured(){return /^https:\/\/.+\.supabase\.co\/?$/.test(cfg().SUPABASE_URL||"")&&(cfg().SUPABASE_PUBLISHABLE_KEY||"").length>20}
  function headers(){const k=cfg().SUPABASE_PUBLISHABLE_KEY||"";return {apikey:k,Authorization:"Bearer "+k,"Content-Type":"application/json"}}
  async function rest(path,opts={}){if(!configured()) throw new Error("Supabase not configured");const r=await fetch(cfg().SUPABASE_URL.replace(/\/$/,"")+"/rest/v1/"+path,{headers:{...headers(),...(opts.headers||{})},cache:"no-store",...opts});if(!r.ok) throw new Error("API "+r.status+" "+(await r.text()));if(r.status===204)return null;return r.json()}
  async function rpc(name,body){return rest("rpc/"+name,{method:"POST",body:JSON.stringify(body||{})})}
  window.BGApi={configured,rest,rpc,headers};
})();
