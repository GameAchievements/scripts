(()=>{var m=e=>{let t=o=>`0${o}`.slice(-2),r=new Date(e);return`${r.getFullYear()} . ${t(r.getMonth()+1)} . ${t(r.getDate())}`};var g=e=>e?.length?e.replace(/"(\w)/g,"\u201C$1").replace(/(\w)"/g,"$1\u201D").replaceAll('"',"'"):e;var u=e=>e?.includes("steamstatic")||e?.includes("steampowered");var d=e=>{if(!e)return"N.A.";let t=e.lastIndexOf(" | ");return t>0?e.slice(0,t):e};var f=(e,t,r=".gas-list-entry")=>{let o=t,a={ps:{rgx:/playstation/gi},xbox:{rgx:/xbox/gi},steam:{rgx:/steam|pc|windows|mac|linux/gi}};return a.ps.rgx.test(e)&&(o=$(".gas-platform-psn",o).css("display","inherit").parents(r).prop("outerHTML")),a.steam.rgx.test(e)&&(o=$(".gas-platform-steam",o).css("display","inherit").parents(r).prop("outerHTML")),a.xbox.rgx.test(e)&&(o=$(".gas-platform-xbox",o).css("display","inherit").parents(r).prop("outerHTML")),o};var h=(e,t,r=".gas-list-entry")=>e.removeAttr("srcset").removeAttr("sizes").attr("src",t).parents(r).prop("outerHTML");var x=(e,t,r={})=>{$(`${e} .search-input`).removeAttr("required"),$(`${e} form.search`).on("submit",async function(o){o.preventDefault(),searchTerm=new URLSearchParams($(this).serialize()).get("query"),$(".ga-loader-container",e).show(),$(".gas-list,.gas-list-results-info",e).hide(),await t(e,searchTerm,r),$(".gas-list-results-info",e).show(),$(".ga-loader-container").hide()})};function T({listData:e,elemId:t,numKeysToReplace:r,textKeysToReplace:o}){let a=$(t).prop("outerHTML"),l=$(`${t} .gas-list`),y=$(`${t} .gas-list-empty`);if(e?.length){let c=$(".gas-list-entry",l).first();c.show(),a=c.prop("outerHTML"),c.hide(),l.html(c),e.forEach((n,b)=>{let s=a;s=s.replaceAll("{|idx|}",b+1);for(let[i,p]of Object.entries(n)){if(n.gameIconURL?.length&&!u(n.gameIconURL)){let C=$(".gas-list-entry-cover-game",s);if(C.length){let v=`For achievement: ${d(n.achievementName)}`;s=h(C.attr("alt",v).attr("title",v),n.gameIconURL)||s}}n.iconURL?.length&&!u(n.iconURL)&&($entryImg=$(".gas-list-entry-cover",s),$entryImg.length&&n.iconURL?.length&&(s=h($entryImg,n.iconURL)||s)),o.includes(i)?s=s.replaceAll(`{|${i}|}`,(i.endsWith("At")?m(p):g(p))||""):r.includes(i)?s=s.replaceAll(`{|${i}|}`,Math.round(p||0)):i==="platform"&&(s=f(p,s))}l.append(s)})}else $(t).html(y),y.show();l.css("display","flex")}var M=document.querySelector("meta[name=domain]")?.content;async function w(e,t=""){let r={};t.length&&(r.q=t);let a=await(await fetch(`https://${M}/api/guide/list${Object.keys(r)?.length?`?${new URLSearchParams(r).toString()}`:""}`)).json();$(`${e} .gas-list-results-info`).text(`${a?.count||0} result(s)`),T({listData:a.results,elemId:e,numKeysToReplace:["likes","comments"],textKeysToReplace:["id","name","author","description","achievementId","achievementName","profileId"]})}var A="#gas-list-guides";$(async()=>{await auth0Bootstrap(),x(A,w),await w(A),$(".ga-loader-container").hide()});})();
