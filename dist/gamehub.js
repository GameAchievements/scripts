(()=>{var C=e=>{let t=o=>`0${o}`.slice(-2),s=new Date(e);return`${s.getFullYear()} . ${t(s.getMonth()+1)} . ${t(s.getDate())}`},G=e=>{let t=o=>`0${o}`.slice(-2),s=new Date(e);return`${t(s.getHours())}h${t(s.getMinutes())}`},V=e=>{let t=new Date(e),s=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],o=`${t.getDate()} ${s[t.getMonth()]}, ${t.getFullYear()}`,a=t.toLocaleTimeString().toLowerCase();return{date:o,time:a}};var F=e=>{switch(e){case"playstation":return 1;case"xbox":return 2;default:return 3}};var W=e=>e?.length?e.replace(/"(\w)/g,"\u201C$1").replace(/(\w)"/g,"$1\u201D").replaceAll('"',"'"):e;var N=e=>e?.includes("steamstatic")||e?.includes("steampowered"),_=e=>e?.includes("images-eds.xboxlive.com");var U=e=>{if(!e)return"N.A.";let t=e.lastIndexOf(" | ");return t>0?e.slice(0,t):e};var re=e=>{if(e<25)return"common";if(e<50)return"rare";if(e<75)return"very-rare";if(e>=75)return"ultra-rare"},q=(e,t,s=".hero-section-achievement")=>{let o=t,a=re(e);return o=$(".rarity-tag-wrapper",o).children(`:not(.gas-rarity-tag-${a})`).hide().parents(s).prop("outerHTML"),o};var A=(e,t,s,o=!1)=>{e.append(t).children().last().removeClass(["bg-light","bg-dark","locked","unlocked"]).addClass(`bg-${s%2>0?"light":"dark"}`).addClass(`${o?"unlocked":"locked"}`)};var L=(e,t,s=".gas-list-entry")=>{let o=t,a={ps:{rgx:/playstation/gi},xbox:{rgx:/xbox/gi},steam:{rgx:/steam|pc|windows|mac|linux/gi}};return a.ps.rgx.test(e)&&(o=$(".gas-platform-psn",o).css("display","inherit").parents(s).prop("outerHTML")),a.steam.rgx.test(e)&&(o=$(".gas-platform-steam",o).css("display","inherit").parents(s).prop("outerHTML")),a.xbox.rgx.test(e)&&(o=$(".gas-platform-xbox",o).css("display","inherit").parents(s).prop("outerHTML")),o};var E=(e,t,s=".gh-row")=>{let o=t,a=e?.unlocked;return a&&(o=o.replaceAll("{|unlockedAt|}",`${G(e.unlockedAt)}<br />${C(e.unlockedAt)}`)),o=$(".status-wrapper",o).children(`:not(.${a?"unlocked":"locked"}-status)`).hide().parents(s).prop("outerHTML"),o};var z=(e,t,s=".gh-row")=>{let o=t;return o=$(".trophy-wrapper",o).children(`:not(.trophy-${e.toLowerCase()})`).hide().parents(s).prop("outerHTML"),o};var b=(e,t,s=".gas-list-entry")=>e.removeAttr("srcset").removeAttr("sizes").attr("src",t).parents(s).prop("outerHTML");var X=(e,t)=>{let s=t,o=rarityClassCalc(e);return s=s.replaceAll("{|rarity|}",o.replace("-"," ")),s=$(".gas-rarity-tag",s).removeClass("gas-rarity-tag").addClass(`gas-rarity-tag-${o}`).children(".p1").addClass(o).parents(".gas-list-entry").prop("outerHTML"),s};var J=(e,t,s={})=>{$(`${e} .search-input`).removeAttr("required"),$(`${e} form.search`).on("submit",async function(o){o.preventDefault(),searchTerm=new URLSearchParams($(this).serialize()).get("query"),$(".ga-loader-container",e).show(),$(".gas-list,.gas-list-results-info",e).hide(),await t(e,searchTerm,s),$(".gas-list-results-info",e).show(),$(".ga-loader-container").hide()})};function Y(e){switch(e){case 1:return"#FF6C6C";case 2:return"#FF876C";case 3:return"#FFB36C";case 4:return"#FFD66C";case 5:return"#D0FF6C";case 6:return"#6CFFCA";case 7:return"#69E4FF";case 8:return"#99A3FF";case 9:return"#C699FF";case 10:return"#FFA0EA";default:return"#5663BA"}}function ne(e=""){return`<svg ${e} viewBox="0 0 400 283" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M396.063 200.058C387.286 177.198 388.232 171.375 363.69 113.777C342.879 64.745 324.486 39.1518 302.256 32.5827V16.449C302.256 7.35738 294.899 0 285.807 0H260.74C251.648 0 244.291 7.35738 244.291 16.449V30.7959H155.687V16.449C155.687 7.35738 148.277 0 139.238 0H114.17C105.079 0 97.7212 7.35738 97.7212 16.449V32.5827C75.4388 39.1518 57.098 64.745 36.2345 113.777C11.6925 171.427 12.5859 177.25 3.80958 200.058C-4.91416 222.919 0.341103 257.656 30.0859 275.104C59.8833 292.499 89.6806 279.36 114.17 246.568C138.712 213.775 148.329 215.414 169.35 215.414H230.679C251.701 215.414 261.265 213.775 285.807 246.568C310.297 279.36 340.094 292.446 369.891 275.104C399.636 257.709 404.944 222.919 396.168 200.058H396.063Z" />
    </svg>`}function D(){$("svg",this).css("fill",Y(Number($(this).data("rate")))),$("p",this).show()}function Q(){$("svg",this).css("fill","#5663BA"),$("p",this).hide()}function Z(e,t){for(let s=1;s<11;s++)e.append(`<li data-rate="${s}" role="button"><p>${s}</p>${ne()}</li>`);$("li",e).click(function(){$(this).siblings().removeClass("rating-active"),$(this).addClass("rating-active");let s=Number($(this).data("rate"));t.data("rate",s).text(`${s}/10`).css("color",Y(s))}),$("li",e).on("mouseenter",function(){D.apply(this),$(this).nextAll().each(Q),$(this).prevAll().each(D)}),$("li",e).on("mouseleave",()=>{let s=$(".rating-active",e);s.length?(D.apply(s),s.prevAll().each(D),s.nextAll().each(Q)):$("li",e).each(Q)})}function R(e){return ne(`class="bg-review-score" fill="${Y(e)}"`)}var be="#gas-gh";function Te({listsData:e,elemId:t,numKeysToReplace:s,textKeysToReplace:o}){console.info(`=== ${t} results ===`,e),$(`${t} .gas-list-first, ${t} .gas-list-latest`).each((n,i)=>{let m=$(i),u=m.prop("outerHTML"),r=$(".gas-list-empty",m),w=m.children().first(),c=$(".gas-list-entry",m).first();m.html(w);let g=e[n===0?"firstAchievers":"latestAchievers"];g?.length>0?(c.show(),m.append(c),u=c.prop("outerHTML"),c.hide(),g.forEach((p,h)=>{let l=u;for(let[v,f]of Object.entries(p)){let x=$(".gas-list-entry-cover",l);if(x&&p.iconURL?.length&&(l=b(x,p.avatar)||l),l=l.replaceAll("{|idx|}",h+1),v==="unlockedAt"){let{date:d,time:y}=V(f);l=l.replaceAll("{|unlockedDt|}",d||"N.A."),l=l.replaceAll(`{|${v}|}`,y||"N.A.")}else o.includes(v)?l=l.replaceAll(`{|${v}|}`,f||""):s.includes(v)&&(l=l.replaceAll(`{|${v}|}`,Math.round(f||0)))}A(m,l,h)})):(m.append(r),r.show())})}async function Ae({gamehubURL:e},{listName:t,numKeysToReplace:s,textKeysToReplace:o}){let a=`${be}-${t}`,i=await(await fetch(`${e}/${t}`)).json();Te({listsData:i,elemId:a,numKeysToReplace:s,textKeysToReplace:o})}async function ie(e){await Ae({gamehubURL:e},{listName:"achievers",numKeysToReplace:["id","achievementId"],textKeysToReplace:["profileId","achievementName","playerName","name"]})}function le(e,t){let s=e-5+1,o=t<=4,a=t>=s+1;return e<=7?Array.from({length:e},(n,i)=>i+1):o?[...Array.from({length:5},(n,i)=>i+1),"ellipsis",e]:a?[1,"ellipsis",...Array.from({length:5},(n,i)=>e-i).sort()]:[1,"ellipsis",...Array.from({length:3},(n,i)=>t-1+i),"ellipsis",e]}function O(e,t,s=1){$(".gas-filters-sw-li.btn-page",$(e)).remove(),$(".btn-ellipsis",$(e)).remove();let o=$(".gas-filters-sw-li.duplicate-btn",$(e));t===1&&$("#btn-page-next").addClass("disabled");let a=le(t,s);for(let n of a)n==="ellipsis"?Ce():Le(o,n)}function Le(e,t,s,o={place:"before",elementId:"#btn-page-next"}){let a=e.clone();a.text(t).removeClass("duplicate-btn").addClass(`btn-page ${s??""}`).attr("id",`btn-page-${t}`),o.place==="before"?a.insertBefore(o.elementId):a.insertAfter(o.elementId)}function Ce(e={place:"before",elementId:"#btn-page-next"}){let t=$('<span class="btn-ellipsis">...</span>');e.place==="before"?t.insertBefore(e.elementId):t.insertAfter(e.elementId)}async function ee(e,t,s,o){let a=$(".gas-filters-sw-li.active",$(e)).first().text(),n=s.target.innerText.toLowerCase()==="next"?Number(a)+1:s.target.innerText.toLowerCase()==="previous"?Number(a)-1:Number(s.target.innerText);$(".gas-filters-sw-li:not(.btn-ellipsis)",$(e)).removeClass("active").removeClass("disabled"),n===t?$("#btn-page-next",$(e)).addClass("disabled"):n===1&&$("#btn-page-previous",$(e)).addClass("disabled"),O(e,t,n),$(`#btn-page-${n}`,$(e)).addClass("active"),$(`${e} .btn-page`).on("click",i=>{ee(e,t,i,()=>o())}),await o()}function te({elemId:e,fetchFn:t,totalPages:s}){$(`${e} .gas-filters-sw-li`).off("click"),O(e,s),$(`${e} .gas-filters-sw-li`).on("click",o=>{ee(e,s,o,()=>t())}),$("#btn-page-1").addClass("active")}var M="#gas-gh-achievements",Re=document.querySelector("meta[name=domain]")?.content,pe=1,Me=20;async function ce(e,t){let s=$(`${M}-pagination .gas-filters-sw-li.active`).text()||1,o=$(`${M} .ga-loader-container`);$(`${M} .achievement-table`).hide();let a=$(`${M} .${t===1?"psn":"xbox"}-achievement-list`),n=$(`${M} .pagination-section`),i=$(`${M} .empty-state`);i.hide(),a.hide(),o.show();let m={Authorization:`Bearer ${token}`},u=`https://${Re}/api/game/${e}/achievements?perPage=100&offset=${s-1}${t?`&platform=${t}`:""}`,r=await fetch(u,{headers:token?m:{}});console.log("resLists urlStr",u);let w=[];if(r.ok){let f=await r.json();console.log("resLists",f),pe=Math.ceil((f?.count||1)/Me),w=f.results}console.info(`=== ${M} results ===`,w);let c=["name","description"],g=["id","score","achieversCount","gAPoints"],p=a.parent(),h=a.children().first(),l=$(".gh-row",a).first();l.show();let v=l.prop("outerHTML");a.html(h).append(l),w.length>0?(l.hide(),w.forEach((f,x)=>{let d=v;for(let[y,T]of Object.entries(f)){let S=$(".gas-list-entry-cover",d);S&&f.iconURL?.length&&(d=b(S,f.iconURL,".gh-row")||d),y==="name"?d=d.replaceAll("{|name|}",U(T)||"N.A."):c.includes(y)?d=d.replaceAll(`{|${y}|}`,(y.endsWith("At")?gaDate(T):T)||""):g.includes(y)?d=d.replaceAll(`{|${y}|}`,Math.round(T||0)):y==="rarity"?d=q(T,d,".gh-row"):y==="trophyType"&&t===1?d=z(T,d):(y==="userProgress"||!f.userProgress)&&(d=E(T,d))}A(a,d,x,f.userProgress?.unlocked)}),o.hide(),p.removeClass("hidden"),n.removeClass("hidden"),a.css({display:"flex","flex-direction":"column"}),i.hide()):(o.hide(),n.addClass("hidden"),a.hide(),i.show())}async function I(e,t){await ce(e,t),te({elemId:"#gas-gh-pagination",fetchFn:()=>ce(e,t),totalPages:pe})}var se="#gas-gh-versions-dropdown";async function me(e){let t=$(e.target);$(`${se}-options,${se}-toggle`).removeClass("w--open");let s=Number(t.data("version-id")),o=Number(F(t.data("platform")?.toLowerCase())||0);$(`${se}-text-selected`).text(t.text()),I(s,o)}var ke="#gas-gh",oe="#gas-gh-versions-dropdown";async function fe(e,t){let s="versions",o=`${ke}-${s}`;if(!e.versionDetails){let g=e.platforms??e.importedFromPlatforms,p=Number(g?.length>=1?F(g[0].toLowerCase()):0);return $(oe).remove(),I(e.id,p)}let n=await(await fetch(`${t}/${s}`)).json();console.log("listData",n);let i=["achievementsCount"],m=["gameId","externalGameId","region"];console.info(`=== ${o} results ===`,n);let u=$(o).prop("outerHTML"),r=$(`${o} .gas-list`),w=$(`${o} .heading-description-wrapper`).children().last(),c=w.prop("outerHTML");if(c&&(c=c.replaceAll("{|name|}",e.name),w.prop("outerHTML",c)),n.length){let g=r.children().first(),p=$(".gas-list-entry",r).first();p.show(),u=p.prop("outerHTML"),r.html(g).append(p),p.hide();let h="gas-version-option",l=$(`${oe}-options`).children().first();l.addClass(h),n.forEach((v,f)=>{if(de(l,v),v.achievementsGroups.length>0){console.log("itm",v.achievementsGroups);for(let d of v.achievementsGroups)de(l,v,d)}let x=u;for(let[d,y]of Object.entries(v))m.includes(d)?x=x.replaceAll(`{|${d}|}`,y||"?"):i.includes(d)?x=x.replaceAll(`{|${d}|}`,Math.round(y||0)):d==="name"?x=x.replaceAll(`{|${d}|}`,v.name?.length?v.name:versionOptionSuffix):d==="platform"?x=L(y,x):d==="consoles"&&(x=$(".gas-console-tags",x).html(y.map(T=>{let S=T.toLowerCase();return`<div class="console-${S.startsWith("ps")?"playstation":S.slice(0,4)}">${T}</div>`})).parents(".gas-list-entry").prop("outerHTML"));A(r,x,f)}),l.remove(),$(`.${h}`).on("click",me)}r.css("display","flex"),$(`${o}-tab .gas-list-empty`).show(),$(`${o},${o}-tab-btn`).css("display","flex")}function de(e,t,s){let o=s?s?.externalGroupId==="default"?"Game Base":s?.groupName:"All",a=e.clone(),n=t.consoles[0]+(t.region?` \u2014 ${t.region} `:"");a.data("version-id",t.gameId).data("version-external-id",t.externalGameId).data("platform",t.platform).text(`${t.name?.length?`${t.name} | `:""}
          ${n?`${n} | `:""} ${o}`),$(`${oe}-options`).append(a)}var P="#gas-gh";function ge(e,t){let s=$(t),o=s.prop("outerHTML");console.info(`=== ${t} ===`,e);let a=["name","igdbId","description"],n=["ownersCount","achievementsCount","gaReviewScore","versionsCount","completion"],i=["releaseDate"],m=[],u=["developers","publishers","franchises","engines","modes","genres","themes","series","supportedLanguages","playerPerspectives"],r=[...a,...i],w=[...n,...m];t.endsWith("top")&&(e.coverURL||e.imageURL)?.length&&(o=s.css("background-image",`linear-gradient(rgba(255,255,255,0),#030922),
          linear-gradient(rgba(70,89,255,.4),rgba(70,89,255,.4)),
          url(${e.coverURL||e.imageURL})`).prop("outerHTML")),$(".gas-img",o).each((p,h)=>{e.imageURL?.length&&(o=b($(h),e.imageURL,t)||o)});for(let[p,h]of Object.entries(e))r.find(l=>l.toLowerCase()===p.toLowerCase())?o=o.replaceAll(`{|${p}|}`,h?.length?p.endsWith("Date")?C(h):h:"N.A."):w.find(l=>l.toLowerCase()===p.toLowerCase())?o=o.replaceAll(`{|${p}|}`,Math.round(h||0)):p==="platformsInGACount"&&t.endsWith("top")?o=L(h?.length?h:e.importedFromPlatforms,o,t):u.includes(p)&&(o=o.replaceAll(`{|${p}|}`,h?.length?h.join(", "):"N.A."));s.prop("outerHTML",o);let c=Object.keys(e),g=[...n,...r,...u].filter(p=>!c.includes(p));for(let p of g)$(`div:contains({|${p}|})`).parent(".entry-wrapper").remove();t.endsWith("about")&&g.length>0&&$(".about-game-entry-div").each(function(){$(this).find(".entry-wrapper").length===0&&$(this).remove()})}async function ue(e,t){let s=await fetch(e);if(!s.ok){location.replace("/games");return}let o=await s.json();if(Object.keys(o).length>0&&o.id){if(o.versionDetails&&o.versionDetails.defaultVersion!==Number(t)){location.replace(`/game?id=${o.versionDetails.defaultVersion}`);return}if(document.title=`${o.name?.length?o.name:o.id} | ${document.title}`,o.igdbId?.length)for(let a of["top","about"])ge(o,`${P}-${a}`);else $(`${P}-about,${P}-igdb-id,[href="${P}-about"]`).remove(),ge(o,`${P}-top`)}return o}var k="#gas-gh";function He(e){if($("#official-review-game-title").text(e.name),$(`${k}-top-ga-score`).prepend(R(0)),$(`${k}-top-ga-score-text`).text("-"),!e?.gaReviewURL?.length)return;let t=`${k}-official-review`;if($(t).css("display","flex"),$(`${t}-placeholder`).hide(),$(`${t}-url`).attr("href",e.gaReviewURL),e?.gaReviewSummary?.length&&$(`${t}-summary`).text(e.gaReviewSummary),e?.gaReviewScore){let s=Math.round(e.gaReviewScore),o=R(s);$(`${t}-score-text`).text(s),$(`${t}-score-bg`).replaceWith(o),$(`${k}-top-ga-score .bg-review-score`).replaceWith(o),$(`${k}-top-ga-score-text`).text(s)}else $(`${t}-score`).parent().remove()}async function Se(e,t){let s=`${k}-review-form`;if((await fetch(`${e}/review`,{headers:{Authorization:`Bearer ${t}`}})).status===200){$(s).remove();return}let a=$(".submit-button",s);a.attr("disabled",!0);let n=$("[name=title]",s),i=$("[name=content]",s),m=$("[name][required]",s),u=a.val(),r=$(".gas-form-error",s),w=$("div",r),c=r.text(),g=$(".gas-form-success",s),p=$(".gas-rating-scale",s),h=$(".gas-rating-selected",s);Z(p,h);let l=!1,v=()=>{l&&Number(h.data("rate"))&&a.removeClass("disabled-button").attr("disabled",!1)};m.on("focusout keyup",()=>{m.each(function(){$(this).val()?.length?(l=!0,$(this).prev("label").removeClass("field-label-missing")):(l=!1,$(this).prev("label").addClass("field-label-missing"),a.addClass("disabled-button").attr("disabled",!0))}),v()}),$("li",p).one("click",()=>{p.parent().prev("label").removeClass("field-label-missing"),v()}),a.on("click",async f=>{f.preventDefault();let x=Number(h.data("rate")||0);if(!x||!n.val()?.length||!i.val().length){r.show(),w.text("Please choose a rating and fill-in required fields"),setTimeout(()=>{r.hide(),w.text(c)},formMessageDelay);return}isUserInputActive=!1,$("input",s).attr("disabled",!0),a.val(a.data("wait"));let d={title:n.val(),content:i.val(),rating:x},y=await fetch(`${e}/review`,{method:"POST",headers:{Authorization:`Bearer ${t}`,Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify(d)}),T=await y.json();if(y.status!==201){r.show(),w.text(T?.message),setTimeout(()=>{r.hide(),w.text(c),$("input",s).attr("disabled",!1),a.val(u)},formMessageDelay);return}$("form",s).hide(),g.attr("title",T?.message).show(),setTimeout(()=>{location.reload()},formMessageDelay)})}async function he(e,t,s){He(s),await Se(e,t)}function $e({listData:e,elemId:t}){let s=$(`${t}-bars`),o=[],a=["positive","mixed","negative"];if(e.length){for(let i of a){o=e.filter(r=>r.classification?.toLowerCase()===i);let m=$(`.gas-bar-${i}`,s);m.length&&m.css("width",`${100*(o.length/e.length)||1}%`);let u=$(`.gas-bar-text-${i}`,s);u.length&&u.text(o?.length)}let n=Math.round(e.map(i=>i.rating).reduce((i,m)=>i+m)/e.length);$(".gas-avg-rate-wrapper").each((i,m)=>{$(m).prepend(R(n)),$(".gas-avg-rate-text",m).text(n)})}else{for(let n of a)$(`.gas-bar-${n}`,s).css("width","1%");$(".gas-avg-rate-wrapper").each((n,i)=>{$(i).prepend(R(0)),$(".gas-avg-rate-text",i).text("-")})}}var Fe=["all","playstation","xbox","steam"];function ve({listData:e,elemId:t,numKeysToReplace:s,textKeysToReplace:o,tabCounts:a,tabMatcher:n}){let i=$(`${t} .gas-list-tabs`);console.info(`=== ${t} results ===`,e);let m=i.prop("outerHTML");if(!a){n="platform",a={all:e.length,playstation:e.filter(u=>u[n].toLowerCase()==="playstation")?.length,xbox:e.filter(u=>u[n].toLowerCase()==="xbox")?.length,steam:e.filter(u=>u[n].toLowerCase()==="steam")?.length};for(let u of Fe)m=m.replaceAll(`{|${u}Cnt|}`,a[u])||"0"}i.prop("outerHTML",m);for(let u of Object.keys(a)){let r=$(`${t} .gas-list-${u}`),w=$(".gas-list-empty",r);if(a[u]>0){let c=r.children().first(),g=$(".gas-list-entry",r).first();g.show(),m=g.prop("outerHTML"),r.html(c).append(g),g.hide(),(u==="all"?e:e.filter(p=>p[n]?.toLowerCase()===u)).forEach((p,h)=>{let l=m;for(let[v,f]of Object.entries(p)){let x=$(".gas-list-entry-cover",l);if(x&&p.iconURL?.length&&(l=b(x,p.iconURL)||l),t.endsWith("achievements")&&v==="name")l=l.replaceAll("{|name|}",U(f)||"N.A.");else if(o.includes(v))l=l.replaceAll(`{|${v}|}`,(v.endsWith("At")?C(f):f)||"");else if(s.includes(v))l=l.replaceAll(`{|${v}|}`,Math.round(f||0));else if(v==="rating"){l=l.replaceAll(`{|${v}|}`,Math.round(f||0));let d=$(".gas-list-entry-rating",l);d.length&&(l=d.prepend(R(f)).parents(".gas-list-entry").prop("outerHTML"))}else v==="platform"?l=L(f,l):v==="rarity"&&(l=X(f,l))}A(r,l,h)})}else r.html(w),w.show()}}async function j({elemIdPrefix:e,gamehubURL:t},{listName:s,numKeysToReplace:o,textKeysToReplace:a,tabs:n,tabMatcher:i}){let m=`${e}-${s}`,r=await(await fetch(`${t}/${s}`)).json();if(Array.isArray(r)||r.length>0){let w;if(Array.isArray(n)){w={};for(let c of n)w[c]=c==="all"?r.length:r.filter(g=>g[i]?.toLowerCase()===c)?.length}switch(s){case"reviews":$e({listData:r,elemId:m}),$(".gas-count-reviews").each((c,g)=>{$(g).text($(g).text().replace("{|reviewsCnt|}",r.length)),c>0&&$(g).text($(g).text().replace(`{|${n[c]}ReviewsCnt|}`,w[n[c]]))});break;case"guides":$(`${e}-top .gas-count-guides`).text(r.length);break;default:break}ve({listData:r,elemId:m,numKeysToReplace:o,textKeysToReplace:a,tabCounts:w,tabMatcher:i})}}async function we(e,t){await j({elemIdPrefix:e,gamehubURL:t},{listName:"guides",numKeysToReplace:["id","commentsCount","viewsCount","likesCount"],textKeysToReplace:["profileId","name","description","author","updatedAt"]})}var Ne="#gas-gh",Ue=document.querySelector("meta[name=forum-domain]")?.content;function Pe({gamehubData:e},{listData:t,elemId:s,numKeysToReplace:o,textKeysToReplace:a}){console.info(`=== ${s} results ===`,t);let n=$(s).prop("outerHTML"),i=$(`${s} .gas-list`),m=$(`${s} .gas-list-empty`),u=$(".gas-list-entry",i).first();if(u.show(),n=u.prop("outerHTML"),u.hide(),t?.length&&n?.length)i.html(u),t.forEach((r,w)=>{let c=n;c=c.replaceAll("{|idx|}",w+1);for(let[g,p]of Object.entries(r)){if(r.gameIconURL?.length&&!N(r.gameIconURL)){let h=$(".gas-list-entry-cover-game",c);h?.length&&(c=b(h,r.gameIconURL)||c)}if((r.iconURL?.length||r.imageURL?.length)&&!_(r.imageURL)&&!N(r.imageURL)&&!N(r.iconURL)){let h=$(".gas-list-entry-cover",c);h?.length&&(c=s.includes("list-games")?h.css("background-image",`url(${r.imageURL})`).parents(".gas-list-entry").prop("outerHTML"):b(h,r.iconURL||r.imageURL)||c)}a.includes(g)?c=c.replaceAll(`{|${g}|}`,(g.endsWith("At")?C(p):W(p))||""):o.includes(g)?c=c.replaceAll(`{|${g}|}`,Math.round(p||0)):g==="lastPlayed"?c=c.replaceAll(`{|${g}|}`,C(p)):(g==="importedFromPlatform"||g==="platform")&&(c=L(p,c))}i.append(c)});else{t?.length&&!n?.length&&console.error(`${s} template issue (missing a '.gas-' class?)`);let r=m.children().first(),w=r.prop("outerHTML").replaceAll("{|name|}",e.name);r=r.prop("outerHTML",w),$(s).html(m),m.show()}i.css("display","flex")}async function xe(e){let t=[],s=`${Ne}-forum-threads`;if(e.forumCategoryID){let o=await fetch(`https://${Ue}/api/category/${e.forumCategoryID}`);o.ok&&(t=(await o.json()).topics.slice(0,5)),t=t.map(a=>({id:a.cid,title:a.title,topic_id:a.tid,author_name:a.user.username,imageURL:a.user.picture?.toLowerCase().includes("http")?new DOMParser().parseFromString(a.user.picture,"text/html").documentElement.textContent:"https://uploads-ssl.webflow.com/6455fdc10a7247f51c568c32/64b50ee999d75d5f75a28b08_user%20avatar%20default.svg",category_name:a.category.name,category_id:a.category.cid,views:a.viewcount,upvotes:a.upvotes,replies:a.postcount}))}Pe({gamehubData:e},{listData:t,elemId:s,numKeysToReplace:["replies","views","upvotes"],textKeysToReplace:["title","author_name","category_name","topic_id","category_id"]}),$(`${s} .ga-loader-container`).hide()}var De=document.querySelector("meta[name=domain]")?.content,Oe=["all","playstation","xbox","steam"];async function ae(e,t="",{gameId:s}){let o=$(e).prop("outerHTML");for(let a of Oe){let n=$(`${e} .gas-list-${a}`),i=0;switch(a){case"playstation":i=1;break;case"xbox":i=2;break;case"steam":i=3;break;default:break}let m={gameId:s};i&&(m.type=i),t.length&&(m.q=t);let r=await(await fetch(`https://${De}/api/leaderboard${Object.keys(m)?.length?`?${new URLSearchParams(m).toString()}`:""}`)).json();console.info(`=== ${e} results ===`,r);let w=["profileId","name"],c=["totalAchievements","gaPoints"];switch(i){case 1:c.push("silver","bronze","gold","platinum");break;case 2:c.push("gamescore");break;case 3:c.push("games");break}let g=$(".gas-list-empty",n);if(r.count>0&&r.results?.length){let p=n.children().first(),h=$(".gas-list-entry",n).first();h.show(),o=h.prop("outerHTML"),n.html(p).append(h),h.hide(),r.results.forEach((l,v)=>{let f=o;f=f.replaceAll("{|idx|}",v+1);for(let[x,d]of Object.entries(l))if(x==="iconURL"){let y=$(".gas-list-entry-cover",f);y?.length&&d?.length&&(f=b(y,d)||f)}else if(x==="recentlyPlayed"){!i&&d?.platform?.length&&(f=L(d?.platform,f));let y=$(".gas-list-entry-cover-game",f);y?.length&&d?.iconURL?.length&&(f=b(y,d.iconURL)||f)}else w.includes(x)?f=f.replaceAll(`{|${x}|}`,d||""):c.includes(x)&&(f=f.replaceAll(`{|${x}|}`,Math.round(d||0)));A(n,f,v)})}else n.html(g),g.show()}}async function ye(e,t){j({elemIdPrefix:e,gamehubURL:t},{listName:"reviews",numKeysToReplace:["id","likesCount"],textKeysToReplace:["profileId","name","content","author","classification","updatedAt"],tabs:["all","positive","mixed","negative"],tabMatcher:"classification"})}var Ie=document.querySelector("meta[name=domain]")?.content,je=new URLSearchParams(location.search),K=je.get("id")||1044,H=`https://${Ie}/api/game/${K}`,B="#gas-gh";$(".ga-loader-container").show();$("#ga-sections-container").hide();$(async()=>{await auth0Bootstrap();let e=await ue(H,K);if(e){he(H,token,e),J(`${B}-leaderboard`,ae,{gameId:K}),await Promise.all([await fe(e,H),await ae(`${B}-leaderboard`,"",{gameId:K}),await we(B,H),await ye(B,H),await ie(H),await xe(e)]),$(".ga-loader-container").hide(),$("#ga-sections-container").show(),$("#gas-wf-tab-activator").click();return}});})();
