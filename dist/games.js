(()=>{var h=(t,e,r=".gas-list-entry")=>{let n={ps:{rgx:/playstation/gi},xbox:{rgx:/xbox/gi},steam:{rgx:/steam|pc|windows|mac|linux/gi}};return n.ps.rgx.test(t)&&(e=$(".gas-platform-psn",e).css("display","inherit").parents(r).prop("outerHTML")),n.steam.rgx.test(t)&&(e=$(".gas-platform-steam",e).css("display","inherit").parents(r).prop("outerHTML")),n.xbox.rgx.test(t)&&(e=$(".gas-platform-xbox",e).css("display","inherit").parents(r).prop("outerHTML")),e};var L=document.querySelector("meta[name=domain]")?.content,d="All",f,w,m;async function b(t,e){$(".gas-filters-sw-li",$(t)).removeClass("active"),$(e.target).addClass("active"),$(".ga-loader-container",$(t)).show(),$(".gas-list,.gas-list-results-info",t).hide(),d=$(e.target).text(),await u(t),$(".gas-list-results-info",t).show(),$(".ga-loader-container").hide()}function D({listData:t,elemId:e,numKeysToReplace:r,textKeysToReplace:n}){console.info(`=== ${e} results ===`,t);let l=$(e).prop("outerHTML"),a=$(`${e} .gas-list`);f||(m=$(".gas-list-empty",a),w=a.children().first(),f=$(".gas-list-entry",a).first().clone(),$(".gas-list-entry",a).first().remove()),t.length>0?(l=f.prop("outerHTML"),a.html(w),t.forEach((g,y)=>{let s=l;Object.entries(g).forEach(([o,i])=>{let p=g.iconURL||g.imageURL;if(p?.length&&!isSteamImage(p)){let c=$(".gas-list-entry-cover",s);c?.length&&(s=showImageFromSrc(c,p)||s)}if(n.includes(o))s=s.replaceAll(`{|${o}|}`,(o.endsWith("At")?gaDate(i):cleanupDoubleQuotes(i))||"");else if(r.includes(o))s=s.replaceAll(`{|${o}|}`,Math.round(i||0));else if(o==="importedFromPlatform")s=h(i,s);else if(o==="consoles"&&i?.length&&!i.includes("PC")){let c=$(`.gas-tags-${o}`,s);c?.length&&(s=c.html(i.map(x=>`<div class="console-tag" title="${x}"><div class="gas-text-overflow">${x}</div></div>`).join(`
`)).parents(".gas-list-entry").prop("outerHTML"))}}),a.append(s).children().last().removeClass(["bg-light","bg-dark"]).addClass(`bg-${y%2>0?"light":"dark"}`)})):(a.html(m),m.show()),a.css("display","flex")}async function u(t,e=""){let r={};d!=="All"&&(r.startsWith=d),e.length&&(r.q=e);let l=await(await fetch(`https://${L}/api/game/list${Object.keys(r)?.length?`?${new URLSearchParams(r).toString()}`:""}`)).json();$(`${t} .gas-list-results-info`).text((l?.length||0)+" result(s)"),D({listData:l,elemId:t,numKeysToReplace:["completion","achievementsCount"],textKeysToReplace:["id","name","description","updatedAt"]})}$().ready(async()=>{await auth0Bootstrap();let t="#gas-list-games";$(`${t} .gas-filters-sw-li`).on("click",e=>b(t,e)),setupListSearch(t,u),await u(t),$(".ga-loader-container").hide()});})();
