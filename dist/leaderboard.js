(()=>{var m=(r,t,o=".gas-list-entry")=>{let i={ps:{rgx:/playstation/gi},xbox:{rgx:/xbox/gi},steam:{rgx:/steam|pc|windows|mac|linux/gi}};return i.ps.rgx.test(r)&&(t=$(".gas-platform-psn",t).css("display","inherit").parents(o).prop("outerHTML")),i.steam.rgx.test(r)&&(t=$(".gas-platform-steam",t).css("display","inherit").parents(o).prop("outerHTML")),i.xbox.rgx.test(r)&&(t=$(".gas-platform-xbox",t).css("display","inherit").parents(o).prop("outerHTML")),t};var x=document.querySelector("meta[name=domain]")?.content,g="leaderboard";var h,u,f;$(".ga-loader-container").show();$("#ga-sections-container").hide();var n=0;switch(window.location.pathname){case`/playstation-${g}`:n=1;break;case`/xbox-${g}`:n=2;break;case`/steam-${g}`:n=3;break;default:break}function b({listData:r,elemId:t,numKeysToReplace:o,textKeysToReplace:i}){console.info(`=== ${t} results ===`,r);let p=$(t).prop("outerHTML"),s=$(`${t} .gas-list`);h||(f=$(".gas-list-empty",s),u=s.children().first(),h=$(".gas-list-entry",s).first().clone(),$(".gas-list-entry",s).first().remove()),r?.length?(p=h.prop("outerHTML"),s.html(u),r.forEach((w,d)=>{let e=p;e=e.replaceAll("{|idx|}",d+1),Object.entries(w).forEach(([c,a])=>{if(c==="iconURL"){let l=$(".gas-list-entry-cover",e);l?.length&&a?.length&&(e=showImageFromSrc(l,a)||e)}else if(c==="recentlyPlayed"){!n&&a?.platform?.length&&(e=m(a?.platform,e));let l=$(".gas-list-entry-cover-game",e);l?.length&&a?.iconURL?.length&&(e=showImageFromSrc(l,a.iconURL)||e)}else i.includes(c)?e=e.replaceAll(`{|${c}|}`,a||""):o.includes(c)&&(e=e.replaceAll(`{|${c}|}`,Math.round(a||0)))}),s.append(e).children().last().removeClass(["bg-light","bg-dark"]).addClass(`bg-${d%2>0?"light":"dark"}`)})):(s.html(f),f.show()),s.css("display","flex")}async function y(r,t=""){let o={};n&&(o.type=n),t.length&&(o.q=t);let p=await(await fetch(`https://${x}/api/${g}${Object.keys(o)?.length?`?${new URLSearchParams(o).toString()}`:""}`)).json(),s=["totalAchievements","gaPoints"];switch(n){case 1:s.push("silver","bronze","gold","platinum");break;case 2:s.push("gamescore");break;case 3:s.push("games");break}b({listData:p.results,elemId:r,numKeysToReplace:s,textKeysToReplace:["profileId","name"]})}$().ready(async()=>{await auth0Bootstrap();let r=`#gas-${g}`;setupListSearch(r,y),await y(r),$(".ga-loader-container").hide(),$("#ga-sections-container").show()});})();
