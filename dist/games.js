(()=>{function F(e,t,s){$(".gas-filters-sw-li.btn-page",$(e)).remove(),$(".btn-ellipsis",$(e)).remove();let r=$(".gas-filters-sw-li.duplicate-btn",$(e));t===1&&$("#btn-page-next").addClass("disabled");let n=t>s?s-1:t;for(let l=1;l<=t;l++){let p=l>=n&&l!==t;U(r,l,p?"hidden":"",{place:"before",elementId:"#btn-page-next"}),l===t&&t>s&&x({place:"before",elementId:`#btn-page-${l}`})}}function U(e,t,s,r={place:"before",elementId:"#btn-page-next"}){let a=e.clone();a.text(t).removeClass("duplicate-btn").addClass(`btn-page ${s??""}`).attr("id",`btn-page-${t}`),r.place==="before"?a.insertBefore(r.elementId):a.insertAfter(r.elementId)}function x(e={place:"before",elementId:"#btn-page-next"}){let t=$('<span class="btn-ellipsis">...</span>');e.place==="before"?t.insertBefore(e.elementId):t.insertAfter(e.elementId)}var H=1,w=5;function k(e,t,s){let r=t-w+1,a=e<=w-1,n=e>=r+1,l=-1;$(".btn-ellipsis",$(s)).remove(),$(".gas-filters-sw",$(s)).children(":not(#btn-page-previous):not(#btn-page-next):not(.duplicate-btn)").each((p,i)=>{let o=p+1,c=$(i);o===1||o===t||a&&o<=w||n&&o>=r||o===e-H||o===e||o===e+H?c.removeClass("hidden"):(c.addClass("hidden"),(l===-1||!a&&!n&&$("span.btn-ellipsis",s).length<2&&o>e)&&(l=o,x({place:"after",elementId:i})))})}async function S(e,t,s,r){let a=$(".gas-filters-sw-li.active",$(e)).first().text();console.log("currentPage",a);let n=s.target.innerText.toLowerCase()==="next"?Number(a)+1:s.target.innerText.toLowerCase()==="previous"?Number(a)-1:Number(s.target.innerText);$(".gas-filters-sw-li:not(.btn-ellipsis)",$(e)).removeClass("active").removeClass("disabled"),$(`#btn-page-${n}`,$(e)).addClass("active"),n===t?$("#btn-page-next",$(e)).addClass("disabled"):n===1&&$("#btn-page-previous",$(e)).addClass("disabled"),k(Number(n),t,e),await r()}function d({elemId:e,fetchFn:t,pageBreakpoint:s,totalPages:r}){$(`${e} .gas-filters-sw-li`).off("click"),F(e,r,s),$(`${e} .gas-filters-sw-li`).on("click",a=>{console.log("here"),S(e,r,a,()=>t())}),$("#btn-page-1").addClass("active")}function D(e,t,s){let r=$(".gas-list-total-pages-info"),a=window.MutationObserver,n=new a(l);r.each(function(){n.observe(this,{childList:!0})});function l(p){for(let i of p)if(i.addedNodes.length>0){let o=Number(i.addedNodes[0].data);d({elemId:`${e}-pagination`,fetchFn:t,pageBreakpoint:s,totalPages:o})}}}var f=e=>{let t=r=>`0${r}`.slice(-2),s=new Date(e);return`${s.getFullYear()} . ${t(s.getMonth()+1)} . ${t(s.getDate())}`};var b=e=>e?.length?e.replace(/"(\w)/g,"\u201C$1").replace(/(\w)"/g,"$1\u201D").replaceAll('"',"'"):e;var C=e=>e?.includes("steamstatic")||e?.includes("steampowered");var v=(e,t,s=".gas-list-entry")=>{let r=t,a={ps:{rgx:/playstation/gi},xbox:{rgx:/xbox/gi},steam:{rgx:/steam|pc|windows|mac|linux/gi}};return a.ps.rgx.test(e)&&(r=$(".gas-platform-psn",r).css("display","inherit").parents(s).prop("outerHTML")),a.steam.rgx.test(e)&&(r=$(".gas-platform-steam",r).css("display","inherit").parents(s).prop("outerHTML")),a.xbox.rgx.test(e)&&(r=$(".gas-platform-xbox",r).css("display","inherit").parents(s).prop("outerHTML")),r};var y=(e,t,s=".gas-list-entry")=>e.removeAttr("srcset").removeAttr("sizes").attr("src",t).parents(s).prop("outerHTML");var T=(e,t,s={})=>{$(`${e} .search-input`).removeAttr("required"),$(`${e} form.search`).on("submit",async function(r){r.preventDefault(),searchTerm=new URLSearchParams($(this).serialize()).get("query"),$(".ga-loader-container",e).show(),$(".gas-list,.gas-list-results-info",e).hide(),await t(e,searchTerm,s),$(".gas-list-results-info",e).show(),$(".ga-loader-container").hide()})};var A,R,M;function B({listData:e,elemId:t,numKeysToReplace:s,textKeysToReplace:r}){console.info(`=== ${t} results ===`,e);let a=$(t).prop("outerHTML"),n=$(`${t} .gas-list`);A||(M=$(".gas-list-empty",n),R=n.children().first(),A=$(".gas-list-entry",n).first().clone(),$(".gas-list-entry",n).first().remove()),e.length>0?(a=A.prop("outerHTML"),n.html(R),e.forEach((l,p)=>{let i=a;for(let[o,c]of Object.entries(l)){let h=l.iconURL||l.imageURL;if(h?.length&&!C(h)){let g=$(".gas-list-entry-cover",i);g?.length&&(i=y(g,h)||i)}if(r.includes(o))i=i.replaceAll(`{|${o}|}`,(o.endsWith("At")?f(c):b(c))||"");else if(s.includes(o))i=i.replaceAll(`{|${o}|}`,Math.round(c||0));else if(o==="importedFromPlatform"||o==="platform")i=v(c,i);else if(o==="consoles"&&c?.length&&!c.includes("PC")){let g=$(`.gas-tags-${o}`,i);g?.length&&(i=g.html(c.map(L=>`<div class="console-tag" title="${L}"><div class="gas-text-overflow">${L}</div></div>`).join(`
`)).parents(".gas-list-entry").prop("outerHTML"))}}n.append(i).children().last().removeClass(["bg-light","bg-dark"]).addClass(`bg-${p%2>0?"light":"dark"}`)})):(n.html(M),M.show()),n.css("display","flex")}var u=1,O=7,N=20,j=document.querySelector("meta[name=domain]")?.content;async function m(e,t=""){let s=$(`${e}-pagination .gas-filters-sw-li.active`).text()||1,r=$(`${e} .gas-filters-sw-li.active`).first().text(),a={};r!=="All"&&(a.startsWith=r),t.length&&(a.q=t);let n=`https://${j}/api/game/list?perPage=${N}&offset=${s-1}${Object.keys(a)?.length?`&${new URLSearchParams(a).toString()}`:""}`,l=await fetch(n),p=[],i=u;if(l.ok){let o=await l.json();u=Math.ceil((o?.count||1)/N),p=o.results}$(`${e} .gas-list-results-info`).text(`${p?.length||0} result(s)`),i!==u&&$(`${e} .gas-list-total-pages-info`).text(u),B({listData:p,elemId:e,numKeysToReplace:["completion","achievementsCount"],textKeysToReplace:["id","name","description","updatedAt"]})}async function P(e){await m(e),d({elemId:`${e}-pagination`,fetchFn:()=>m(e),pageBreakpoint:O,totalPages:u}),D(e,()=>m(e),O)}async function V(e,t){$(".gas-filters-sw-li",$(e)).filter(function(){return $(this).parents(`${e}-pagination`).length===0}).removeClass("active"),$(t.target).addClass("active"),$(".ga-loader-container",$(e)).show(),$(".gas-list,.gas-list-results-info",e).hide(),await m(e),$(".gas-list-results-info",e).show(),$(".ga-loader-container").hide()}$(async()=>{await auth0Bootstrap();let e="#gas-list-games";$(`${e} .gas-filters-sw-li`).filter(function(){return $(this).parents(`${e}-pagination`).length===0}).on("click",t=>V(e,t)),T(e,m),await P(e),$(".ga-loader-container").hide()});})();
