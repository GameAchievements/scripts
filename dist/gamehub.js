(()=>{var R=e=>{let t=a=>`0${a}`.slice(-2),s=new Date(e);return`${s.getFullYear()} . ${t(s.getMonth()+1)} . ${t(s.getDate())}`},B=e=>{let t=a=>`0${a}`.slice(-2),s=new Date(e);return`${t(s.getHours())}h${t(s.getMinutes())}`},G=e=>{let t=new Date(e),s=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],a=`${t.getDate()} ${s[t.getMonth()]}, ${t.getFullYear()}`,o=t.toLocaleTimeString().toLowerCase();return{date:a,time:o}};var K=e=>{switch(e){case"playstation":return 1;case"xbox":return 2;default:return 3}};var V=e=>e?.length?e.replace(/"(\w)/g,"\u201C$1").replace(/(\w)"/g,"$1\u201D").replaceAll('"',"'"):e;var F=e=>e?.includes("steamstatic")||e?.includes("steampowered"),E=e=>e?.includes("images-eds.xboxlive.com");var U=e=>{if(!e)return"N.A.";let t=e.lastIndexOf(" | ");return t>0?e.slice(0,t):e};var ae=e=>{if(e<25)return"common";if(e<50)return"rare";if(e<75)return"very-rare";if(e>=75)return"ultra-rare"},W=(e,t,s=".hero-section-achievement")=>{let a=t,o=ae(e);return a=$(".rarity-tag-wrapper",a).children(`:not(.gas-rarity-tag-${o})`).hide().parents(s).prop("outerHTML"),a};var A=(e,t,s,a=!1)=>{e.append(t).children().last().removeClass(["bg-light","bg-dark","locked","unlocked"]).addClass(`bg-${s%2>0?"light":"dark"}`).addClass(`${a?"unlocked":"locked"}`)};var L=(e,t,s=".gas-list-entry")=>{let a=t,o={ps:{rgx:/playstation/gi},xbox:{rgx:/xbox/gi},steam:{rgx:/steam|pc|windows|mac|linux/gi}};return o.ps.rgx.test(e)&&(a=$(".gas-platform-psn",a).css("display","inherit").parents(s).prop("outerHTML")),o.steam.rgx.test(e)&&(a=$(".gas-platform-steam",a).css("display","inherit").parents(s).prop("outerHTML")),o.xbox.rgx.test(e)&&(a=$(".gas-platform-xbox",a).css("display","inherit").parents(s).prop("outerHTML")),a};var _=(e,t,s=".gh-row")=>{let a=t,o=e?.unlocked;return o&&(a=a.replaceAll("{|unlockedAt|}",`${B(e.unlockedAt)}<br />${R(e.unlockedAt)}`)),a=$(".status-wrapper",a).children(`:not(.${o?"unlocked":"locked"}-status)`).hide().parents(s).prop("outerHTML"),a};var q=(e,t,s=".gh-row")=>{let a=t;return a=$(".trophy-wrapper",a).children(`:not(.trophy-${e.toLowerCase()})`).hide().parents(s).prop("outerHTML"),a};var T=(e,t,s=".gas-list-entry")=>e.removeAttr("srcset").removeAttr("sizes").attr("src",t).parents(s).prop("outerHTML");var z=(e,t)=>{let s=t,a=rarityClassCalc(e);return s=s.replaceAll("{|rarity|}",a.replace("-"," ")),s=$(".gas-rarity-tag",s).removeClass("gas-rarity-tag").addClass(`gas-rarity-tag-${a}`).children(".p1").addClass(a).parents(".gas-list-entry").prop("outerHTML"),s};var X=(e,t,s={})=>{$(`${e} .search-input`).removeAttr("required"),$(`${e} form.search`).on("submit",async function(a){a.preventDefault(),searchTerm=new URLSearchParams($(this).serialize()).get("query"),$(".ga-loader-container",e).show(),$(".gas-list,.gas-list-results-info",e).hide(),await t(e,searchTerm,s),$(".gas-list-results-info",e).show(),$(".ga-loader-container").hide()})};function Q(e){switch(e){case 1:return"#FF6C6C";case 2:return"#FF876C";case 3:return"#FFB36C";case 4:return"#FFD66C";case 5:return"#D0FF6C";case 6:return"#6CFFCA";case 7:return"#69E4FF";case 8:return"#99A3FF";case 9:return"#C699FF";case 10:return"#FFA0EA";default:return"#5663BA"}}function oe(e=""){return`<svg ${e} viewBox="0 0 400 283" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M396.063 200.058C387.286 177.198 388.232 171.375 363.69 113.777C342.879 64.745 324.486 39.1518 302.256 32.5827V16.449C302.256 7.35738 294.899 0 285.807 0H260.74C251.648 0 244.291 7.35738 244.291 16.449V30.7959H155.687V16.449C155.687 7.35738 148.277 0 139.238 0H114.17C105.079 0 97.7212 7.35738 97.7212 16.449V32.5827C75.4388 39.1518 57.098 64.745 36.2345 113.777C11.6925 171.427 12.5859 177.25 3.80958 200.058C-4.91416 222.919 0.341103 257.656 30.0859 275.104C59.8833 292.499 89.6806 279.36 114.17 246.568C138.712 213.775 148.329 215.414 169.35 215.414H230.679C251.701 215.414 261.265 213.775 285.807 246.568C310.297 279.36 340.094 292.446 369.891 275.104C399.636 257.709 404.944 222.919 396.168 200.058H396.063Z" />
    </svg>`}function N(){$("svg",this).css("fill",Q(Number($(this).data("rate")))),$("p",this).show()}function J(){$("svg",this).css("fill","#5663BA"),$("p",this).hide()}function Y(e,t){for(let s=1;s<11;s++)e.append(`<li data-rate="${s}" role="button"><p>${s}</p>${oe()}</li>`);$("li",e).click(function(){$(this).siblings().removeClass("rating-active"),$(this).addClass("rating-active");let s=Number($(this).data("rate"));t.data("rate",s).text(`${s}/10`).css("color",Q(s))}),$("li",e).on("mouseenter",function(){N.apply(this),$(this).nextAll().each(J),$(this).prevAll().each(N)}),$("li",e).on("mouseleave",()=>{let s=$(".rating-active",e);s.length?(N.apply(s),s.prevAll().each(N),s.nextAll().each(J)):$("li",e).each(J)})}function k(e){return oe(`class="bg-review-score" fill="${Q(e)}"`)}var Ae="#gas-gh";function Le({listsData:e,elemId:t,numKeysToReplace:s,textKeysToReplace:a}){console.info(`=== ${t} results ===`,e),$(`${t} .gas-list-first, ${t} .gas-list-latest`).each((r,i)=>{let p=$(i),g=p.prop("outerHTML"),n=$(".gas-list-empty",p),x=p.children().first(),l=$(".gas-list-entry",p).first();p.html(x);let f=e[r===0?"firstAchievers":"latestAchievers"];f?.length>0?(l.show(),p.append(l),g=l.prop("outerHTML"),l.hide(),f.forEach((m,u)=>{let c=g;for(let[d,w]of Object.entries(m)){let h=$(".gas-list-entry-cover",c);if(h&&m.iconURL?.length&&(c=T(h,m.avatar)||c),c=c.replaceAll("{|idx|}",u+1),d==="unlockedAt"){let{date:y,time:v}=G(w);c=c.replaceAll("{|unlockedDt|}",y||"N.A."),c=c.replaceAll(`{|${d}|}`,v||"N.A.")}else a.includes(d)?c=c.replaceAll(`{|${d}|}`,w||""):s.includes(d)&&(c=c.replaceAll(`{|${d}|}`,Math.round(w||0)))}A(p,c,u)})):(p.append(n),n.show())})}async function Ce({gamehubURL:e},{listName:t,numKeysToReplace:s,textKeysToReplace:a}){let o=`${Ae}-${t}`,i=await(await fetch(`${e}/${t}`)).json();Le({listsData:i,elemId:o,numKeysToReplace:s,textKeysToReplace:a})}async function re(e){await Ce({gamehubURL:e},{listName:"achievers",numKeysToReplace:["id","achievementId"],textKeysToReplace:["profileId","achievementName","playerName","name"]})}function ne(e,t){let s=e-5+1,a=t<=4,o=t>=s+1;return e<=7?Array.from({length:e},(r,i)=>i+1):a?[...Array.from({length:5},(r,i)=>i+1),"ellipsis",e]:o?[1,"ellipsis",...Array.from({length:5},(r,i)=>e-i).sort()]:[1,"ellipsis",...Array.from({length:3},(r,i)=>t-1+i),"ellipsis",e]}function D(e,t,s=1){$(".gas-filters-sw-li.btn-page",$(e)).remove(),$(".btn-ellipsis",$(e)).remove();let a=$(".gas-filters-sw-li.duplicate-btn",$(e));t===1&&$("#btn-page-next").addClass("disabled");let o=ne(t,s);for(let r of o)r==="ellipsis"?Me():Re(a,r)}function Re(e,t,s,a={place:"before",elementId:"#btn-page-next"}){let o=e.clone();o.text(t).removeClass("duplicate-btn").addClass(`btn-page ${s??""}`).attr("id",`btn-page-${t}`),a.place==="before"?o.insertBefore(a.elementId):o.insertAfter(a.elementId)}function Me(e={place:"before",elementId:"#btn-page-next"}){let t=$('<span class="btn-ellipsis">...</span>');e.place==="before"?t.insertBefore(e.elementId):t.insertAfter(e.elementId)}async function Z(e,t,s,a){let o=$(".gas-filters-sw-li.active",$(e)).first().text(),r=s.target.innerText.toLowerCase()==="next"?Number(o)+1:s.target.innerText.toLowerCase()==="previous"?Number(o)-1:Number(s.target.innerText);$(".gas-filters-sw-li:not(.btn-ellipsis)",$(e)).removeClass("active").removeClass("disabled"),r===t?$("#btn-page-next",$(e)).addClass("disabled"):r===1&&$("#btn-page-previous",$(e)).addClass("disabled"),D(e,t,r),$(`#btn-page-${r}`,$(e)).addClass("active"),$(`${e} .btn-page`).on("click",i=>{Z(e,t,i,()=>a())}),await a()}function ie({elemId:e,fetchFn:t,totalPages:s}){$(`${e} .gas-filters-sw-li`).off("click"),D(e,s),$("#btn-page-1").addClass("active"),$(`${e} .gas-filters-sw-li`).on("click",a=>{Z(e,s,a,()=>t())})}var M="#gas-gh-achievements",ke=document.querySelector("meta[name=domain]")?.content,pe=1,le=10;async function ce(e,t,s){let a=$(`${M}-pagination .gas-filters-sw-li.active`).text()||1,o=$(`${M} .ga-loader-container`);$(`${M} .achievement-table`).hide();let r=$(`${M} .${t===1?"psn":"xbox"}-achievement-list`),i=$(`${M} .pagination-section`),p=$(`${M} .empty-state`);p.hide(),r.hide(),o.show();let g={Authorization:`Bearer ${token}`},n=`https://${ke}/api/game/${e}/achievements?perPage=${le}&offset=${a-1}${s||""}`,x=await fetch(n,{headers:token?g:{}}),l=[];if(x.ok){let h=await x.json();pe=Math.ceil((h?.count||1)/le),l=h.results}console.info(`=== ${M} results ===`,l);let f=["name","description"],m=["id","score","achieversCount","gAPoints"],u=r.parent(),c=r.children().first(),d=$(".gh-row",r).first();d.show();let w=d.prop("outerHTML");r.html(c).append(d),l.length>0?(d.hide(),l.forEach((h,y)=>{let v=w;for(let[b,C]of Object.entries(h)){let se=$(".gas-list-entry-cover",v);se&&h.iconURL?.length&&(v=T(se,h.iconURL,".gh-row")||v),b==="name"?v=v.replaceAll("{|name|}",U(C)||"N.A."):f.includes(b)?v=v.replaceAll(`{|${b}|}`,(b.endsWith("At")?gaDate(C):C)||""):m.includes(b)?v=v.replaceAll(`{|${b}|}`,Math.round(C||0)):b==="rarity"?v=W(C,v,".gh-row"):b==="trophyType"&&t===1?v=q(C,v):(b==="userProgress"||!h.userProgress)&&(v=_(C,v))}A(r,v,y,h.userProgress?.unlocked)}),o.hide(),u.removeClass("hidden"),i.removeClass("hidden"),r.css({display:"flex","flex-direction":"column"}),p.hide()):(o.hide(),i.addClass("hidden"),r.hide(),p.show())}async function me(e,t,s=void 0){let a=`${M}-pagination`;$(".gas-filters-sw-li.btn-page",$(M)).remove(),$(".btn-ellipsis",$(M)).remove(),await ce(e,t,s),ie({elemId:a,fetchFn:()=>ce(e,t,s),totalPages:pe})}var ee="#gas-gh-versions-dropdown";async function de(e){let t=$(e.target);$(`${ee}-options,${ee}-toggle`).removeClass("w--open");let s=Number(t.data("version-id")),a=Number(K(t.data("platform")?.toLowerCase())||0),o=t.data("gpe-id"),r=t.data("external-group-id"),i=`&gpeId=${o}${r?`&achExtGroupId=${r}`:""}`;$(`${ee}-text-selected`).text(t.text()),me(s,a,i)}var He="#gas-gh",fe="#gas-gh-versions-dropdown";async function ue(e,t){let s="versions",a=`${He}-${s}`,r=await(await fetch(`${t}/${s}`)).json(),i=["achievementsCount"],p=["gameId","externalGameId","region"];console.info(`=== ${a} results ===`,r);let g=$(a).prop("outerHTML"),n=$(`${a} .gas-list`),x=$(`${a} .heading-description-wrapper`).children().last(),l=x.prop("outerHTML");if(l&&(l=l.replaceAll("{|name|}",e.name),x.prop("outerHTML",l)),r.length){let f=n.children().first(),m=$(".gas-list-entry",n).first();m.show(),g=m.prop("outerHTML"),n.html(f).append(m),m.hide();let u="gas-version-option",c=$(`${fe}-options`).children().first();c.addClass(u),r.forEach((d,w)=>{if(ge(c,d),d.achievementsGroups.length>0)for(let y of d.achievementsGroups)ge(c,d,y);let h=g;for(let[y,v]of Object.entries(d))p.includes(y)?h=h.replaceAll(`{|${y}|}`,v||"?"):i.includes(y)?h=h.replaceAll(`{|${y}|}`,Math.round(v||0)):y==="name"?h=h.replaceAll(`{|${y}|}`,d.name?.length?d.name:`${d.consoles[0]??""} ${d.region?` | ${d.region}`:""}`):y==="platform"?h=L(v,h):y==="consoles"&&(h=$(".gas-console-tags",h).html(v.map(b=>{let C=b.toLowerCase();return`<div class="console-${C.startsWith("ps")?"playstation":C.slice(0,4)}">${b}</div>`})).parents(".gas-list-entry").prop("outerHTML"));A(n,h,w)}),c.remove(),$(`.${u}`).on("click",de)}n.css("display","flex"),$(`${a}-tab .gas-list-empty`).show(),$(`${a},${a}-tab-btn`).css("display","flex")}function ge(e,t,s){let a=s?s?.externalGroupId==="default"?"Base Game":s?.groupName:"All",o=e.clone(),r=t.consoles[0]+(t.region?` \u2014 ${t.region} `:"");s?.externalGroupId&&o.data("external-group-id",s.externalGroupId),o.data("version-id",t.gameId).data("version-external-id",t.externalGameId).data("gpe-id",t.gPEId).data("platform",t.platform).text(`${t.name?.length?`${t.name} | `:""}
          ${r?`${r} | `:""} ${a}`),$(`${fe}-options`).append(o)}var I="#gas-gh";function he(e,t){let s=$(t),a=s.prop("outerHTML");console.info(`=== ${t} ===`,e);let o=["name","igdbId","description"],r=["ownersCount","achievementsCount","gaReviewScore","versionsCount","completion"],i=["releaseDate"],p=[],g=["developers","publishers","franchises","engines","modes","genres","themes","series","supportedLanguages","playerPerspectives"],n=[...o,...i],x=[...r,...p];t.endsWith("top")&&(e.coverURL||e.imageURL)?.length&&(a=s.css("background-image",`linear-gradient(rgba(255,255,255,0),#030922),
          linear-gradient(rgba(70,89,255,.4),rgba(70,89,255,.4)),
          url(${e.coverURL||e.imageURL})`).prop("outerHTML")),$(".gas-img",a).each((m,u)=>{e.imageURL?.length&&(a=T($(u),e.imageURL,t)||a)});for(let[m,u]of Object.entries(e))n.find(c=>c.toLowerCase()===m.toLowerCase())?a=a.replaceAll(`{|${m}|}`,u?.length?m.endsWith("Date")?R(u):u:"N.A."):x.find(c=>c.toLowerCase()===m.toLowerCase())?a=a.replaceAll(`{|${m}|}`,Math.round(u||0)):m==="platformsInGACount"&&t.endsWith("top")?a=L(u?.length?u:e.importedFromPlatforms,a,t):g.includes(m)&&(a=a.replaceAll(`{|${m}|}`,u?.length?u.join(", "):"N.A."));s.prop("outerHTML",a);let l=Object.keys(e),f=[...r,...n,...g].filter(m=>!l.includes(m));for(let m of f)$(`div:contains({|${m}|})`).parent(".entry-wrapper").remove();t.endsWith("about")&&f.length>0&&$(".about-game-entry-div").each(function(){$(this).find(".entry-wrapper").length===0&&$(this).remove()})}async function $e(e,t){let s=await fetch(e);if(!s.ok){location.replace("/games");return}let a=await s.json();if(Object.keys(a).length>0&&a.id){if(a.versionDetails&&a.versionDetails.defaultVersion!==Number(t)){location.replace(`/game?id=${a.versionDetails.defaultVersion}`);return}if(document.title=`${a.name?.length?a.name:a.id} | ${document.title}`,a.igdbId?.length)for(let o of["top","about"])he(a,`${I}-${o}`);else $(`${I}-about,${I}-igdb-id,[href="${I}-about"]`).remove(),he(a,`${I}-top`)}return a}var H="#gas-gh";function Se(e){if($("#official-review-game-title").text(e.name),$(`${H}-top-ga-score`).prepend(k(0)),$(`${H}-top-ga-score-text`).text("-"),!e?.gaReviewURL?.length)return;let t=`${H}-official-review`;if($(t).css("display","flex"),$(`${t}-placeholder`).hide(),$(`${t}-url`).attr("href",e.gaReviewURL),e?.gaReviewSummary?.length&&$(`${t}-summary`).text(e.gaReviewSummary),e?.gaReviewScore){let s=Math.round(e.gaReviewScore),a=k(s);$(`${t}-score-text`).text(s),$(`${t}-score-bg`).replaceWith(a),$(`${H}-top-ga-score .bg-review-score`).replaceWith(a),$(`${H}-top-ga-score-text`).text(s)}else $(`${t}-score`).parent().remove()}async function Fe(e,t){let s=`${H}-review-form`;if((await fetch(`${e}/review`,{headers:{Authorization:`Bearer ${t}`}})).status===200){$(s).remove();return}let o=$(".submit-button",s);o.attr("disabled",!0);let r=$("[name=title]",s),i=$("[name=content]",s),p=$("[name][required]",s),g=o.val(),n=$(".gas-form-error",s),x=$("div",n),l=n.text(),f=$(".gas-form-success",s),m=$(".gas-rating-scale",s),u=$(".gas-rating-selected",s);Y(m,u);let c=!1,d=()=>{c&&Number(u.data("rate"))&&o.removeClass("disabled-button").attr("disabled",!1)};p.on("focusout keyup",()=>{p.each(function(){$(this).val()?.length?(c=!0,$(this).prev("label").removeClass("field-label-missing")):(c=!1,$(this).prev("label").addClass("field-label-missing"),o.addClass("disabled-button").attr("disabled",!0))}),d()}),$("li",m).one("click",()=>{m.parent().prev("label").removeClass("field-label-missing"),d()}),o.on("click",async w=>{w.preventDefault();let h=Number(u.data("rate")||0);if(!h||!r.val()?.length||!i.val().length){n.show(),x.text("Please choose a rating and fill-in required fields"),setTimeout(()=>{n.hide(),x.text(l)},formMessageDelay);return}isUserInputActive=!1,$("input",s).attr("disabled",!0),o.val(o.data("wait"));let y={title:r.val(),content:i.val(),rating:h},v=await fetch(`${e}/review`,{method:"POST",headers:{Authorization:`Bearer ${t}`,Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify(y)}),b=await v.json();if(v.status!==201){n.show(),x.text(b?.message),setTimeout(()=>{n.hide(),x.text(l),$("input",s).attr("disabled",!1),o.val(g)},formMessageDelay);return}$("form",s).hide(),f.attr("title",b?.message).show(),setTimeout(()=>{location.reload()},formMessageDelay)})}async function we(e,t,s){Se(s),await Fe(e,t)}function ve({listData:e,elemId:t}){let s=$(`${t}-bars`),a=[],o=["positive","mixed","negative"];if(e.length){for(let i of o){a=e.filter(n=>n.classification?.toLowerCase()===i);let p=$(`.gas-bar-${i}`,s);p.length&&p.css("width",`${100*(a.length/e.length)||1}%`);let g=$(`.gas-bar-text-${i}`,s);g.length&&g.text(a?.length)}let r=Math.round(e.map(i=>i.rating).reduce((i,p)=>i+p)/e.length);$(".gas-avg-rate-wrapper").each((i,p)=>{$(p).prepend(k(r)),$(".gas-avg-rate-text",p).text(r)})}else{for(let r of o)$(`.gas-bar-${r}`,s).css("width","1%");$(".gas-avg-rate-wrapper").each((r,i)=>{$(i).prepend(k(0)),$(".gas-avg-rate-text",i).text("-")})}}var Ue=["all","playstation","xbox","steam"];function xe({listData:e,elemId:t,numKeysToReplace:s,textKeysToReplace:a,tabCounts:o,tabMatcher:r}){let i=$(`${t} .gas-list-tabs`);console.info(`=== ${t} results ===`,e);let p=i.prop("outerHTML");if(!o){r="platform",o={all:e.length,playstation:e.filter(g=>g[r].toLowerCase()==="playstation")?.length,xbox:e.filter(g=>g[r].toLowerCase()==="xbox")?.length,steam:e.filter(g=>g[r].toLowerCase()==="steam")?.length};for(let g of Ue)p=p.replaceAll(`{|${g}Cnt|}`,o[g])||"0"}i.prop("outerHTML",p);for(let g of Object.keys(o)){let n=$(`${t} .gas-list-${g}`),x=$(".gas-list-empty",n);if(o[g]>0){let l=n.children().first(),f=$(".gas-list-entry",n).first();f.show(),p=f.prop("outerHTML"),n.html(l).append(f),f.hide(),(g==="all"?e:e.filter(m=>m[r]?.toLowerCase()===g)).forEach((m,u)=>{let c=p;for(let[d,w]of Object.entries(m)){let h=$(".gas-list-entry-cover",c);if(h&&m.iconURL?.length&&(c=T(h,m.iconURL)||c),t.endsWith("achievements")&&d==="name")c=c.replaceAll("{|name|}",U(w)||"N.A.");else if(a.includes(d))c=c.replaceAll(`{|${d}|}`,(d.endsWith("At")?R(w):w)||"");else if(s.includes(d))c=c.replaceAll(`{|${d}|}`,Math.round(w||0));else if(d==="rating"){c=c.replaceAll(`{|${d}|}`,Math.round(w||0));let y=$(".gas-list-entry-rating",c);y.length&&(c=y.prepend(k(w)).parents(".gas-list-entry").prop("outerHTML"))}else d==="platform"?c=L(w,c):d==="rarity"&&(c=z(w,c))}A(n,c,u)})}else n.html(x),x.show()}}async function P({elemIdPrefix:e,gamehubURL:t},{listName:s,numKeysToReplace:a,textKeysToReplace:o,tabs:r,tabMatcher:i}){let p=`${e}-${s}`,n=await(await fetch(`${t}/${s}`)).json();if(Array.isArray(n)||n.length>0){let x;if(Array.isArray(r)){x={};for(let l of r)x[l]=l==="all"?n.length:n.filter(f=>f[i]?.toLowerCase()===l)?.length}switch(s){case"reviews":ve({listData:n,elemId:p}),$(".gas-count-reviews").each((l,f)=>{$(f).text($(f).text().replace("{|reviewsCnt|}",n.length)),l>0&&$(f).text($(f).text().replace(`{|${r[l]}ReviewsCnt|}`,x[r[l]]))});break;case"guides":$(`${e}-top .gas-count-guides`).text(n.length);break;default:break}xe({listData:n,elemId:p,numKeysToReplace:a,textKeysToReplace:o,tabCounts:x,tabMatcher:i})}}async function ye(e,t){await P({elemIdPrefix:e,gamehubURL:t},{listName:"guides",numKeysToReplace:["id","commentsCount","viewsCount","likesCount"],textKeysToReplace:["profileId","name","description","author","updatedAt"]})}var Ie="#gas-gh",Ne=document.querySelector("meta[name=forum-domain]")?.content;function De({gamehubData:e},{listData:t,elemId:s,numKeysToReplace:a,textKeysToReplace:o}){console.info(`=== ${s} results ===`,t);let r=$(s).prop("outerHTML"),i=$(`${s} .gas-list`),p=$(`${s} .gas-list-empty`),g=$(".gas-list-entry",i).first();if(g.show(),r=g.prop("outerHTML"),g.hide(),t?.length&&r?.length)i.html(g),t.forEach((n,x)=>{let l=r;l=l.replaceAll("{|idx|}",x+1);for(let[f,m]of Object.entries(n)){if(n.gameIconURL?.length&&!F(n.gameIconURL)){let u=$(".gas-list-entry-cover-game",l);u?.length&&(l=T(u,n.gameIconURL)||l)}if((n.iconURL?.length||n.imageURL?.length)&&!E(n.imageURL)&&!F(n.imageURL)&&!F(n.iconURL)){let u=$(".gas-list-entry-cover",l);u?.length&&(l=s.includes("list-games")?u.css("background-image",`url(${n.imageURL})`).parents(".gas-list-entry").prop("outerHTML"):T(u,n.iconURL||n.imageURL)||l)}o.includes(f)?l=l.replaceAll(`{|${f}|}`,(f.endsWith("At")?R(m):V(m))||""):a.includes(f)?l=l.replaceAll(`{|${f}|}`,Math.round(m||0)):f==="lastPlayed"?l=l.replaceAll(`{|${f}|}`,R(m)):(f==="importedFromPlatform"||f==="platform")&&(l=L(m,l))}i.append(l)});else{t?.length&&!r?.length&&console.error(`${s} template issue (missing a '.gas-' class?)`);let n=p.children().first(),x=n.prop("outerHTML").replaceAll("{|name|}",e.name);n=n.prop("outerHTML",x),$(s).html(p),p.show()}i.css("display","flex")}async function be(e){let t=[],s=`${Ie}-forum-threads`;if(e.forumCategoryID){let a=await fetch(`https://${Ne}/api/category/${e.forumCategoryID}`);a.ok&&(t=(await a.json()).topics.slice(0,5)),t=t.map(o=>({id:o.cid,title:o.title,topic_id:o.tid,author_name:o.user.username,imageURL:o.user.picture?.toLowerCase().includes("http")?new DOMParser().parseFromString(o.user.picture,"text/html").documentElement.textContent:"https://uploads-ssl.webflow.com/6455fdc10a7247f51c568c32/64b50ee999d75d5f75a28b08_user%20avatar%20default.svg",category_name:o.category.name,category_id:o.category.cid,views:o.viewcount,upvotes:o.upvotes,replies:o.postcount}))}De({gamehubData:e},{listData:t,elemId:s,numKeysToReplace:["replies","views","upvotes"],textKeysToReplace:["title","author_name","category_name","topic_id","category_id"]}),$(`${s} .ga-loader-container`).hide()}var Pe=document.querySelector("meta[name=domain]")?.content,Oe=["all","playstation","xbox","steam"];async function te(e,t="",{gameId:s}){let a=$(e).prop("outerHTML");for(let o of Oe){let r=$(`${e} .gas-list-${o}`),i=0;switch(o){case"playstation":i=1;break;case"xbox":i=2;break;case"steam":i=3;break;default:break}let p={gameId:s};i&&(p.type=i),t.length&&(p.q=t);let n=await(await fetch(`https://${Pe}/api/leaderboard${Object.keys(p)?.length?`?${new URLSearchParams(p).toString()}`:""}`)).json();console.info(`=== ${e} results ===`,n);let x=["profileId","name"],l=["totalAchievements","gaPoints"];switch(i){case 1:l.push("silver","bronze","gold","platinum");break;case 2:l.push("gamescore");break;case 3:l.push("games");break}let f=$(".gas-list-empty",r);if(n.count>0&&n.results?.length){let m=r.children().first(),u=$(".gas-list-entry",r).first();u.show(),a=u.prop("outerHTML"),r.html(m).append(u),u.hide(),n.results.forEach((c,d)=>{let w=a;w=w.replaceAll("{|idx|}",d+1);for(let[h,y]of Object.entries(c))if(h==="iconURL"){let v=$(".gas-list-entry-cover",w);v?.length&&y?.length&&(w=T(v,y)||w)}else if(h==="recentlyPlayed"){!i&&y?.platform?.length&&(w=L(y?.platform,w));let v=$(".gas-list-entry-cover-game",w);v?.length&&y?.iconURL?.length&&(w=T(v,y.iconURL)||w)}else x.includes(h)?w=w.replaceAll(`{|${h}|}`,y||""):l.includes(h)&&(w=w.replaceAll(`{|${h}|}`,Math.round(y||0)));A(r,w,d)})}else r.html(f),f.show()}}async function Te(e,t){P({elemIdPrefix:e,gamehubURL:t},{listName:"reviews",numKeysToReplace:["id","likesCount"],textKeysToReplace:["profileId","name","content","author","classification","updatedAt"],tabs:["all","positive","mixed","negative"],tabMatcher:"classification"})}var je=document.querySelector("meta[name=domain]")?.content,Be=new URLSearchParams(location.search),j=Be.get("id")||1044,S=`https://${je}/api/game/${j}`,O="#gas-gh";$(".ga-loader-container").show();$("#ga-sections-container").hide();$(async()=>{await auth0Bootstrap();let e=await $e(S,j);if(e){we(S,token,e),X(`${O}-leaderboard`,te,{gameId:j}),await Promise.all([await ue(e,S),await te(`${O}-leaderboard`,"",{gameId:j}),await ye(O,S),await Te(O,S),await re(S),await be(e)]),$(".ga-loader-container").hide(),$("#ga-sections-container").show(),$("#gas-wf-tab-activator").click();return}});})();
