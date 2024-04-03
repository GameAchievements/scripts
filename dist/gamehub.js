(()=>{var C=e=>{let t=a=>`0${a}`.slice(-2),s=new Date(e);return`${s.getFullYear()} . ${t(s.getMonth()+1)} . ${t(s.getDate())}`},V=e=>{let t=a=>`0${a}`.slice(-2),s=new Date(e);return`${t(s.getHours())}h${t(s.getMinutes())}`},G=e=>{let t=new Date(e),s=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],a=`${t.getDate()} ${s[t.getMonth()]}, ${t.getFullYear()}`,o=t.toLocaleTimeString().toLowerCase();return{date:a,time:o}};var D=e=>{switch(e){case"playstation":return 1;case"xbox":return 2;default:return 3}};var W=e=>e?.length?e.replace(/"(\w)/g,"\u201C$1").replace(/(\w)"/g,"$1\u201D").replaceAll('"',"'"):e;var U=e=>e?.includes("steamstatic")||e?.includes("steampowered"),_=e=>e?.includes("images-eds.xboxlive.com");var N=e=>{if(!e)return"N.A.";let t=e.lastIndexOf(" | ");return t>0?e.slice(0,t):e};var ne=e=>{if(e<25)return"common";if(e<50)return"rare";if(e<75)return"very-rare";if(e>=75)return"ultra-rare"},q=(e,t,s=".hero-section-achievement")=>{let a=t,o=ne(e);return a=$(".rarity-tag-wrapper",a).children(`:not(.gas-rarity-tag-${o})`).hide().parents(s).prop("outerHTML"),a};var A=(e,t,s,a=!1)=>{e.append(t).children().last().removeClass(["bg-light","bg-dark","locked","unlocked"]).addClass(`bg-${s%2>0?"light":"dark"}`).addClass(`${a?"unlocked":"locked"}`)};var L=(e,t,s=".gas-list-entry")=>{let a=t,o={ps:{rgx:/playstation/gi},xbox:{rgx:/xbox/gi},steam:{rgx:/steam|pc|windows|mac|linux/gi}};return o.ps.rgx.test(e)&&(a=$(".gas-platform-psn",a).css("display","inherit").parents(s).prop("outerHTML")),o.steam.rgx.test(e)&&(a=$(".gas-platform-steam",a).css("display","inherit").parents(s).prop("outerHTML")),o.xbox.rgx.test(e)&&(a=$(".gas-platform-xbox",a).css("display","inherit").parents(s).prop("outerHTML")),a};var E=(e,t,s=".gh-row")=>{let a=t,o=e?.unlocked;return o&&(a=a.replaceAll("{|unlockedAt|}",`${V(e.unlockedAt)}<br />${C(e.unlockedAt)}`)),a=$(".status-wrapper",a).children(`:not(.${o?"unlocked":"locked"}-status)`).hide().parents(s).prop("outerHTML"),a};var z=(e,t,s=".gh-row")=>{let a=t;return a=$(".trophy-wrapper",a).children(`:not(.trophy-${e.toLowerCase()})`).hide().parents(s).prop("outerHTML"),a};var T=(e,t,s=".gas-list-entry")=>e.removeAttr("srcset").removeAttr("sizes").attr("src",t).parents(s).prop("outerHTML");var X=(e,t)=>{let s=t,a=rarityClassCalc(e);return s=s.replaceAll("{|rarity|}",a.replace("-"," ")),s=$(".gas-rarity-tag",s).removeClass("gas-rarity-tag").addClass(`gas-rarity-tag-${a}`).children(".p1").addClass(a).parents(".gas-list-entry").prop("outerHTML"),s};var J=(e,t,s={})=>{$(`${e} .search-input`).removeAttr("required"),$(`${e} form.search`).on("submit",async function(a){a.preventDefault(),searchTerm=new URLSearchParams($(this).serialize()).get("query"),$(".ga-loader-container",e).show(),$(".gas-list,.gas-list-results-info",e).hide(),await t(e,searchTerm,s),$(".gas-list-results-info",e).show(),$(".ga-loader-container").hide()})};function Y(e){switch(e){case 1:return"#FF6C6C";case 2:return"#FF876C";case 3:return"#FFB36C";case 4:return"#FFD66C";case 5:return"#D0FF6C";case 6:return"#6CFFCA";case 7:return"#69E4FF";case 8:return"#99A3FF";case 9:return"#C699FF";case 10:return"#FFA0EA";default:return"#5663BA"}}function ie(e=""){return`<svg ${e} viewBox="0 0 400 283" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M396.063 200.058C387.286 177.198 388.232 171.375 363.69 113.777C342.879 64.745 324.486 39.1518 302.256 32.5827V16.449C302.256 7.35738 294.899 0 285.807 0H260.74C251.648 0 244.291 7.35738 244.291 16.449V30.7959H155.687V16.449C155.687 7.35738 148.277 0 139.238 0H114.17C105.079 0 97.7212 7.35738 97.7212 16.449V32.5827C75.4388 39.1518 57.098 64.745 36.2345 113.777C11.6925 171.427 12.5859 177.25 3.80958 200.058C-4.91416 222.919 0.341103 257.656 30.0859 275.104C59.8833 292.499 89.6806 279.36 114.17 246.568C138.712 213.775 148.329 215.414 169.35 215.414H230.679C251.701 215.414 261.265 213.775 285.807 246.568C310.297 279.36 340.094 292.446 369.891 275.104C399.636 257.709 404.944 222.919 396.168 200.058H396.063Z" />
    </svg>`}function O(){$("svg",this).css("fill",Y(Number($(this).data("rate")))),$("p",this).show()}function Q(){$("svg",this).css("fill","#5663BA"),$("p",this).hide()}function Z(e,t){for(let s=1;s<11;s++)e.append(`<li data-rate="${s}" role="button"><p>${s}</p>${ie()}</li>`);$("li",e).click(function(){$(this).siblings().removeClass("rating-active"),$(this).addClass("rating-active");let s=Number($(this).data("rate"));t.data("rate",s).text(`${s}/10`).css("color",Y(s))}),$("li",e).on("mouseenter",function(){O.apply(this),$(this).nextAll().each(Q),$(this).prevAll().each(O)}),$("li",e).on("mouseleave",()=>{let s=$(".rating-active",e);s.length?(O.apply(s),s.prevAll().each(O),s.nextAll().each(Q)):$("li",e).each(Q)})}function R(e){return ie(`class="bg-review-score" fill="${Y(e)}"`)}var ye="#gas-gh";function be({listsData:e,elemId:t,numKeysToReplace:s,textKeysToReplace:a}){console.info(`=== ${t} results ===`,e),$(`${t} .gas-list-first, ${t} .gas-list-latest`).each((n,i)=>{let m=$(i),f=m.prop("outerHTML"),r=$(".gas-list-empty",m),x=m.children().first(),c=$(".gas-list-entry",m).first();m.html(x);let g=e[n===0?"firstAchievers":"latestAchievers"];g?.length>0?(c.show(),m.append(c),f=c.prop("outerHTML"),c.hide(),g.forEach((p,h)=>{let l=f;for(let[u,d]of Object.entries(p)){let y=$(".gas-list-entry-cover",l);if(y&&p.iconURL?.length&&(l=T(y,p.avatar)||l),l=l.replaceAll("{|idx|}",h+1),u==="unlockedAt"){let{date:w,time:v}=G(d);l=l.replaceAll("{|unlockedDt|}",w||"N.A."),l=l.replaceAll(`{|${u}|}`,v||"N.A.")}else a.includes(u)?l=l.replaceAll(`{|${u}|}`,d||""):s.includes(u)&&(l=l.replaceAll(`{|${u}|}`,Math.round(d||0)))}A(m,l,h)})):(m.append(r),r.show())})}async function Te({gamehubURL:e},{listName:t,numKeysToReplace:s,textKeysToReplace:a}){let o=`${ye}-${t}`,i=await(await fetch(`${e}/${t}`)).json();be({listsData:i,elemId:o,numKeysToReplace:s,textKeysToReplace:a})}async function le(e){await Te({gamehubURL:e},{listName:"achievers",numKeysToReplace:["id","achievementId"],textKeysToReplace:["profileId","achievementName","playerName","name"]})}function ce(e,t){let s=e-5+1,a=t<=4,o=t>=s+1;return e<=7?Array.from({length:e},(n,i)=>i+1):a?[...Array.from({length:5},(n,i)=>i+1),"ellipsis",e]:o?[1,"ellipsis",...Array.from({length:5},(n,i)=>e-i).sort()]:[1,"ellipsis",...Array.from({length:3},(n,i)=>t-1+i),"ellipsis",e]}function I(e,t,s=1){$(".gas-filters-sw-li.btn-page",$(e)).remove(),$(".btn-ellipsis",$(e)).remove();let a=$(".gas-filters-sw-li.duplicate-btn",$(e));t===1&&$("#btn-page-next").addClass("disabled");let o=ce(t,s);for(let n of o)n==="ellipsis"?Le():Ae(a,n)}function Ae(e,t,s,a={place:"before",elementId:"#btn-page-next"}){let o=e.clone();o.text(t).removeClass("duplicate-btn").addClass(`btn-page ${s??""}`).attr("id",`btn-page-${t}`),a.place==="before"?o.insertBefore(a.elementId):o.insertAfter(a.elementId)}function Le(e={place:"before",elementId:"#btn-page-next"}){let t=$('<span class="btn-ellipsis">...</span>');e.place==="before"?t.insertBefore(e.elementId):t.insertAfter(e.elementId)}async function ee(e,t,s,a){let o=$(".gas-filters-sw-li.active",$(e)).first().text(),n=s.target.innerText.toLowerCase()==="next"?Number(o)+1:s.target.innerText.toLowerCase()==="previous"?Number(o)-1:Number(s.target.innerText);$(".gas-filters-sw-li:not(.btn-ellipsis)",$(e)).removeClass("active").removeClass("disabled"),n===t?$("#btn-page-next",$(e)).addClass("disabled"):n===1&&$("#btn-page-previous",$(e)).addClass("disabled"),I(e,t,n),$(`#btn-page-${n}`,$(e)).addClass("active"),$(`${e} .btn-page`).on("click",i=>{ee(e,t,i,()=>a())}),await a()}function te({elemId:e,fetchFn:t,totalPages:s}){$(`${e} .gas-filters-sw-li`).off("click"),I(e,s),$(`${e} .gas-filters-sw-li`).on("click",a=>{ee(e,s,a,()=>t())}),$("#btn-page-1").addClass("active")}var k="#gas-gh-achievements",Ce=document.querySelector("meta[name=domain]")?.content,me=1,Re=20;async function pe(e,t){let s=$(`${k}-pagination .gas-filters-sw-li.active`).text()||1,a=$(`${k} .ga-loader-container`);$(`${k} .achievement-table`).hide();let o=$(`${k} .${t===1?"psn":"xbox"}-achievement-list`),n=$(`${k} .pagination-section`),i=$(`${k} .empty-state`);i.hide(),o.hide(),a.show();let m={Authorization:`Bearer ${token}`},f=`https://${Ce}/api/game/${e}/achievements?perPage=100&offset=${s-1}${t?`&platform=${t}`:""}`,r=await fetch(f,{headers:token?m:{}});console.log("resLists urlStr",f);let x=[];if(r.ok){let d=await r.json();console.log("resLists",d),me=Math.ceil((d?.count||1)/Re),x=d.results}console.info(`=== ${k} results ===`,x);let c=["name","description"],g=["id","score","achieversCount","gAPoints"],p=o.parent(),h=o.children().first(),l=$(".gh-row",o).first();l.show();let u=l.prop("outerHTML");o.html(h).append(l),x.length>0?(l.hide(),x.forEach((d,y)=>{let w=u;for(let[v,b]of Object.entries(d)){let M=$(".gas-list-entry-cover",w);M&&d.iconURL?.length&&(w=T(M,d.iconURL,".gh-row")||w),v==="name"?w=w.replaceAll("{|name|}",N(b)||"N.A."):c.includes(v)?w=w.replaceAll(`{|${v}|}`,(v.endsWith("At")?gaDate(b):b)||""):g.includes(v)?w=w.replaceAll(`{|${v}|}`,Math.round(b||0)):v==="rarity"?w=q(b,w,".gh-row"):v==="trophyType"&&t===1?w=z(b,w):(v==="userProgress"||!d.userProgress)&&(w=E(b,w))}A(o,w,y,d.userProgress?.unlocked)}),a.hide(),p.removeClass("hidden"),n.removeClass("hidden"),o.css({display:"flex","flex-direction":"column"}),i.hide()):(a.hide(),n.addClass("hidden"),o.hide(),i.show())}async function se(e,t){await pe(e,t),te({elemId:"#gas-gh-pagination",fetchFn:()=>pe(e,t),totalPages:me})}var Me="#gas-gh",H="#gas-gh-versions-dropdown";async function ke(e){let t=$(e.target);$(`${H}-options,${H}-toggle`).removeClass("w--open");let s=Number(t.data("version-id")),a=Number(D(t.data("platform")?.toLowerCase())||0);$(`${H}-text-selected`).text(t.text()),se(s,a)}async function de(e,t){let s="versions",a=`${Me}-${s}`;if(!e.versionDetails){let g=e.platforms??e.importedFromPlatforms,p=Number(g?.length>=1?D(g[0].toLowerCase()):0);return $(H).remove(),se(e.id,p)}let n=await(await fetch(`${t}/${s}`)).json(),i=["achievementsCount"],m=["gameId","externalGameId","region"];console.info(`=== ${a} results ===`,n);let f=$(a).prop("outerHTML"),r=$(`${a} .gas-list`),x=$(`${a} .heading-description-wrapper`).children().last(),c=x.prop("outerHTML");if(c&&(c=c.replaceAll("{|name|}",e.name),x.prop("outerHTML",c)),n.length){let g=r.children().first(),p=$(".gas-list-entry",r).first();p.show(),f=p.prop("outerHTML"),r.html(g).append(p),p.hide();let h="gas-version-option",l=$(`${H}-options`).children().first();l.addClass(h),n.forEach((u,d)=>{let y=l.clone(),w=u.consoles[0]+(u.region?` \u2014 ${u.region} `:"");y.data("version-id",u.gameId).data("version-external-id",u.externalGameId).data("platform",u.platform).text((u.name?.length?`${u.name} | `:"")+w),$(`${H}-options`).append(y);let v=f;for(let[b,M]of Object.entries(u))m.includes(b)?v=v.replaceAll(`{|${b}|}`,M||"?"):i.includes(b)?v=v.replaceAll(`{|${b}|}`,Math.round(M||0)):b==="name"?v=v.replaceAll(`{|${b}|}`,u.name?.length?u.name:w):b==="platform"?v=L(M,v):b==="consoles"&&(v=$(".gas-console-tags",v).html(M.map(oe=>{let re=oe.toLowerCase();return`<div class="console-${re.startsWith("ps")?"playstation":re.slice(0,4)}">${oe}</div>`})).parents(".gas-list-entry").prop("outerHTML"));A(r,v,d)}),l.remove(),$(`.${h}`).on("click",ke)}r.css("display","flex"),$(`${a}-tab .gas-list-empty`).show(),$(`${a},${a}-tab-btn`).css("display","flex")}var P="#gas-gh";function ge(e,t){let s=$(t),a=s.prop("outerHTML");console.info(`=== ${t} ===`,e);let o=["name","igdbId","description"],n=["ownersCount","achievementsCount","gaReviewScore","versionsCount","completion"],i=["releaseDate"],m=[],f=["developers","publishers","franchises","engines","modes","genres","themes","series","supportedLanguages","playerPerspectives"],r=[...o,...i],x=[...n,...m];t.endsWith("top")&&(e.coverURL||e.imageURL)?.length&&(a=s.css("background-image",`linear-gradient(rgba(255,255,255,0),#030922),
          linear-gradient(rgba(70,89,255,.4),rgba(70,89,255,.4)),
          url(${e.coverURL||e.imageURL})`).prop("outerHTML")),$(".gas-img",a).each((p,h)=>{e.imageURL?.length&&(a=T($(h),e.imageURL,t)||a)});for(let[p,h]of Object.entries(e))r.find(l=>l.toLowerCase()===p.toLowerCase())?a=a.replaceAll(`{|${p}|}`,h?.length?p.endsWith("Date")?C(h):h:"N.A."):x.find(l=>l.toLowerCase()===p.toLowerCase())?a=a.replaceAll(`{|${p}|}`,Math.round(h||0)):p==="platformsInGACount"&&t.endsWith("top")?a=L(h?.length?h:e.importedFromPlatforms,a,t):f.includes(p)&&(a=a.replaceAll(`{|${p}|}`,h?.length?h.join(", "):"N.A."));s.prop("outerHTML",a);let c=Object.keys(e),g=[...n,...r,...f].filter(p=>!c.includes(p));for(let p of g)$(`div:contains({|${p}|})`).parent(".entry-wrapper").remove();t.endsWith("about")&&g.length>0&&$(".about-game-entry-div").each(function(){$(this).find(".entry-wrapper").length===0&&$(this).remove()})}async function fe(e,t){let s=await fetch(e);if(!s.ok){location.replace("/games");return}let a=await s.json();if(Object.keys(a).length>0&&a.id){if(a.versionDetails&&a.versionDetails.defaultVersion!==Number(t)){location.replace(`/game?id=${a.versionDetails.defaultVersion}`);return}if(document.title=`${a.name?.length?a.name:a.id} | ${document.title}`,a.igdbId?.length)for(let o of["top","about"])ge(a,`${P}-${o}`);else $(`${P}-about,${P}-igdb-id,[href="${P}-about"]`).remove(),ge(a,`${P}-top`)}return a}var S="#gas-gh";function He(e){if($("#official-review-game-title").text(e.name),$(`${S}-top-ga-score`).prepend(R(0)),$(`${S}-top-ga-score-text`).text("-"),!e?.gaReviewURL?.length)return;let t=`${S}-official-review`;if($(t).css("display","flex"),$(`${t}-placeholder`).hide(),$(`${t}-url`).attr("href",e.gaReviewURL),e?.gaReviewSummary?.length&&$(`${t}-summary`).text(e.gaReviewSummary),e?.gaReviewScore){let s=Math.round(e.gaReviewScore),a=R(s);$(`${t}-score-text`).text(s),$(`${t}-score-bg`).replaceWith(a),$(`${S}-top-ga-score .bg-review-score`).replaceWith(a),$(`${S}-top-ga-score-text`).text(s)}else $(`${t}-score`).parent().remove()}async function Se(e,t){let s=`${S}-review-form`;if((await fetch(`${e}/review`,{headers:{Authorization:`Bearer ${t}`}})).status===200){$(s).remove();return}let o=$(".submit-button",s);o.attr("disabled",!0);let n=$("[name=title]",s),i=$("[name=content]",s),m=$("[name][required]",s),f=o.val(),r=$(".gas-form-error",s),x=$("div",r),c=r.text(),g=$(".gas-form-success",s),p=$(".gas-rating-scale",s),h=$(".gas-rating-selected",s);Z(p,h);let l=!1,u=()=>{l&&Number(h.data("rate"))&&o.removeClass("disabled-button").attr("disabled",!1)};m.on("focusout keyup",()=>{m.each(function(){$(this).val()?.length?(l=!0,$(this).prev("label").removeClass("field-label-missing")):(l=!1,$(this).prev("label").addClass("field-label-missing"),o.addClass("disabled-button").attr("disabled",!0))}),u()}),$("li",p).one("click",()=>{p.parent().prev("label").removeClass("field-label-missing"),u()}),o.on("click",async d=>{d.preventDefault();let y=Number(h.data("rate")||0);if(!y||!n.val()?.length||!i.val().length){r.show(),x.text("Please choose a rating and fill-in required fields"),setTimeout(()=>{r.hide(),x.text(c)},formMessageDelay);return}isUserInputActive=!1,$("input",s).attr("disabled",!0),o.val(o.data("wait"));let w={title:n.val(),content:i.val(),rating:y},v=await fetch(`${e}/review`,{method:"POST",headers:{Authorization:`Bearer ${t}`,Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify(w)}),b=await v.json();if(v.status!==201){r.show(),x.text(b?.message),setTimeout(()=>{r.hide(),x.text(c),$("input",s).attr("disabled",!1),o.val(f)},formMessageDelay);return}$("form",s).hide(),g.attr("title",b?.message).show(),setTimeout(()=>{location.reload()},formMessageDelay)})}async function ue(e,t,s){He(s),await Se(e,t)}function he({listData:e,elemId:t}){let s=$(`${t}-bars`),a=[],o=["positive","mixed","negative"];if(e.length){for(let i of o){a=e.filter(r=>r.classification?.toLowerCase()===i);let m=$(`.gas-bar-${i}`,s);m.length&&m.css("width",`${100*(a.length/e.length)||1}%`);let f=$(`.gas-bar-text-${i}`,s);f.length&&f.text(a?.length)}let n=Math.round(e.map(i=>i.rating).reduce((i,m)=>i+m)/e.length);$(".gas-avg-rate-wrapper").each((i,m)=>{$(m).prepend(R(n)),$(".gas-avg-rate-text",m).text(n)})}else{for(let n of o)$(`.gas-bar-${n}`,s).css("width","1%");$(".gas-avg-rate-wrapper").each((n,i)=>{$(i).prepend(R(0)),$(".gas-avg-rate-text",i).text("-")})}}var Fe=["all","playstation","xbox","steam"];function $e({listData:e,elemId:t,numKeysToReplace:s,textKeysToReplace:a,tabCounts:o,tabMatcher:n}){let i=$(`${t} .gas-list-tabs`);console.info(`=== ${t} results ===`,e);let m=i.prop("outerHTML");if(!o){n="platform",o={all:e.length,playstation:e.filter(f=>f[n].toLowerCase()==="playstation")?.length,xbox:e.filter(f=>f[n].toLowerCase()==="xbox")?.length,steam:e.filter(f=>f[n].toLowerCase()==="steam")?.length};for(let f of Fe)m=m.replaceAll(`{|${f}Cnt|}`,o[f])||"0"}i.prop("outerHTML",m);for(let f of Object.keys(o)){let r=$(`${t} .gas-list-${f}`),x=$(".gas-list-empty",r);if(o[f]>0){let c=r.children().first(),g=$(".gas-list-entry",r).first();g.show(),m=g.prop("outerHTML"),r.html(c).append(g),g.hide(),(f==="all"?e:e.filter(p=>p[n]?.toLowerCase()===f)).forEach((p,h)=>{let l=m;for(let[u,d]of Object.entries(p)){let y=$(".gas-list-entry-cover",l);if(y&&p.iconURL?.length&&(l=T(y,p.iconURL)||l),t.endsWith("achievements")&&u==="name")l=l.replaceAll("{|name|}",N(d)||"N.A.");else if(a.includes(u))l=l.replaceAll(`{|${u}|}`,(u.endsWith("At")?C(d):d)||"");else if(s.includes(u))l=l.replaceAll(`{|${u}|}`,Math.round(d||0));else if(u==="rating"){l=l.replaceAll(`{|${u}|}`,Math.round(d||0));let w=$(".gas-list-entry-rating",l);w.length&&(l=w.prepend(R(d)).parents(".gas-list-entry").prop("outerHTML"))}else u==="platform"?l=L(d,l):u==="rarity"&&(l=X(d,l))}A(r,l,h)})}else r.html(x),x.show()}}async function j({elemIdPrefix:e,gamehubURL:t},{listName:s,numKeysToReplace:a,textKeysToReplace:o,tabs:n,tabMatcher:i}){let m=`${e}-${s}`,r=await(await fetch(`${t}/${s}`)).json();if(Array.isArray(r)||r.length>0){let x;if(Array.isArray(n)){x={};for(let c of n)x[c]=c==="all"?r.length:r.filter(g=>g[i]?.toLowerCase()===c)?.length}switch(s){case"reviews":he({listData:r,elemId:m}),$(".gas-count-reviews").each((c,g)=>{$(g).text($(g).text().replace("{|reviewsCnt|}",r.length)),c>0&&$(g).text($(g).text().replace(`{|${n[c]}ReviewsCnt|}`,x[n[c]]))});break;case"guides":$(`${e}-top .gas-count-guides`).text(r.length);break;default:break}$e({listData:r,elemId:m,numKeysToReplace:a,textKeysToReplace:o,tabCounts:x,tabMatcher:i})}}async function we(e,t){await j({elemIdPrefix:e,gamehubURL:t},{listName:"guides",numKeysToReplace:["id","commentsCount","viewsCount","likesCount"],textKeysToReplace:["profileId","name","description","author","updatedAt"]})}var Ue="#gas-gh",Ne=document.querySelector("meta[name=forum-domain]")?.content;function Pe({gamehubData:e},{listData:t,elemId:s,numKeysToReplace:a,textKeysToReplace:o}){console.info(`=== ${s} results ===`,t);let n=$(s).prop("outerHTML"),i=$(`${s} .gas-list`),m=$(`${s} .gas-list-empty`),f=$(".gas-list-entry",i).first();if(f.show(),n=f.prop("outerHTML"),f.hide(),t?.length&&n?.length)i.html(f),t.forEach((r,x)=>{let c=n;c=c.replaceAll("{|idx|}",x+1);for(let[g,p]of Object.entries(r)){if(r.gameIconURL?.length&&!U(r.gameIconURL)){let h=$(".gas-list-entry-cover-game",c);h?.length&&(c=T(h,r.gameIconURL)||c)}if((r.iconURL?.length||r.imageURL?.length)&&!_(r.imageURL)&&!U(r.imageURL)&&!U(r.iconURL)){let h=$(".gas-list-entry-cover",c);h?.length&&(c=s.includes("list-games")?h.css("background-image",`url(${r.imageURL})`).parents(".gas-list-entry").prop("outerHTML"):T(h,r.iconURL||r.imageURL)||c)}o.includes(g)?c=c.replaceAll(`{|${g}|}`,(g.endsWith("At")?C(p):W(p))||""):a.includes(g)?c=c.replaceAll(`{|${g}|}`,Math.round(p||0)):g==="lastPlayed"?c=c.replaceAll(`{|${g}|}`,C(p)):(g==="importedFromPlatform"||g==="platform")&&(c=L(p,c))}i.append(c)});else{t?.length&&!n?.length&&console.error(`${s} template issue (missing a '.gas-' class?)`);let r=m.children().first(),x=r.prop("outerHTML").replaceAll("{|name|}",e.name);r=r.prop("outerHTML",x),$(s).html(m),m.show()}i.css("display","flex")}async function ve(e){let t=[],s=`${Ue}-forum-threads`;if(e.forumCategoryID){let a=await fetch(`https://${Ne}/api/category/${e.forumCategoryID}`);a.ok&&(t=(await a.json()).topics.slice(0,5)),t=t.map(o=>({id:o.cid,title:o.title,topic_id:o.tid,author_name:o.user.username,imageURL:o.user.picture?.toLowerCase().includes("http")?new DOMParser().parseFromString(o.user.picture,"text/html").documentElement.textContent:"https://uploads-ssl.webflow.com/6455fdc10a7247f51c568c32/64b50ee999d75d5f75a28b08_user%20avatar%20default.svg",category_name:o.category.name,category_id:o.category.cid,views:o.viewcount,upvotes:o.upvotes,replies:o.postcount}))}Pe({gamehubData:e},{listData:t,elemId:s,numKeysToReplace:["replies","views","upvotes"],textKeysToReplace:["title","author_name","category_name","topic_id","category_id"]}),$(`${s} .ga-loader-container`).hide()}var De=document.querySelector("meta[name=domain]")?.content,Oe=["all","playstation","xbox","steam"];async function ae(e,t="",{gameId:s}){let a=$(e).prop("outerHTML");for(let o of Oe){let n=$(`${e} .gas-list-${o}`),i=0;switch(o){case"playstation":i=1;break;case"xbox":i=2;break;case"steam":i=3;break;default:break}let m={gameId:s};i&&(m.type=i),t.length&&(m.q=t);let r=await(await fetch(`https://${De}/api/leaderboard${Object.keys(m)?.length?`?${new URLSearchParams(m).toString()}`:""}`)).json();console.info(`=== ${e} results ===`,r);let x=["profileId","name"],c=["totalAchievements","gaPoints"];switch(i){case 1:c.push("silver","bronze","gold","platinum");break;case 2:c.push("gamescore");break;case 3:c.push("games");break}let g=$(".gas-list-empty",n);if(r.count>0&&r.results?.length){let p=n.children().first(),h=$(".gas-list-entry",n).first();h.show(),a=h.prop("outerHTML"),n.html(p).append(h),h.hide(),r.results.forEach((l,u)=>{let d=a;d=d.replaceAll("{|idx|}",u+1);for(let[y,w]of Object.entries(l))if(y==="iconURL"){let v=$(".gas-list-entry-cover",d);v?.length&&w?.length&&(d=T(v,w)||d)}else if(y==="recentlyPlayed"){!i&&w?.platform?.length&&(d=L(w?.platform,d));let v=$(".gas-list-entry-cover-game",d);v?.length&&w?.iconURL?.length&&(d=T(v,w.iconURL)||d)}else x.includes(y)?d=d.replaceAll(`{|${y}|}`,w||""):c.includes(y)&&(d=d.replaceAll(`{|${y}|}`,Math.round(w||0)));A(n,d,u)})}else n.html(g),g.show()}}async function xe(e,t){j({elemIdPrefix:e,gamehubURL:t},{listName:"reviews",numKeysToReplace:["id","likesCount"],textKeysToReplace:["profileId","name","content","author","classification","updatedAt"],tabs:["all","positive","mixed","negative"],tabMatcher:"classification"})}var Ie=document.querySelector("meta[name=domain]")?.content,je=new URLSearchParams(location.search),K=je.get("id")||1044,F=`https://${Ie}/api/game/${K}`,B="#gas-gh";$(".ga-loader-container").show();$("#ga-sections-container").hide();$(async()=>{await auth0Bootstrap();let e=await fe(F,K);if(e){ue(F,token,e),J(`${B}-leaderboard`,ae,{gameId:K}),await Promise.all([await de(e,F),await ae(`${B}-leaderboard`,"",{gameId:K}),await we(B,F),await xe(B,F),await le(F),await ve(e)]),$(".ga-loader-container").hide(),$("#ga-sections-container").show(),$("#gas-wf-tab-activator").click();return}});})();
