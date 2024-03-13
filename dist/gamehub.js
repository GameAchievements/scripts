(()=>{var C=e=>{let s=a=>`0${a}`.slice(-2),t=new Date(e);return`${t.getFullYear()} . ${s(t.getMonth()+1)} . ${s(t.getDate())}`},K=e=>{let s=a=>`0${a}`.slice(-2),t=new Date(e);return`${s(t.getHours())}h${s(t.getMinutes())}`},G=e=>{let s=new Date(e),t=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],a=`${s.getDate()} ${t[s.getMonth()]}, ${s.getFullYear()}`,o=s.toLocaleTimeString().toLowerCase();return{date:a,time:o}};var N=e=>{switch(e){case"playstation":return 1;case"xbox":return 2;default:return 3}};var V=e=>e?.length?e.replace(/"(\w)/g,"\u201C$1").replace(/(\w)"/g,"$1\u201D").replaceAll('"',"'"):e;var H=e=>e?.includes("steamstatic")||e?.includes("steampowered"),W=e=>e?.includes("images-eds.xboxlive.com");var F=e=>{if(!e)return"N.A.";let s=e.lastIndexOf(" | ");return s>0?e.slice(0,s):e};var se=e=>{if(e<25)return"common";if(e<50)return"rare";if(e<75)return"very-rare";if(e>=75)return"ultra-rare"},q=(e,s,t=".hero-section-achievement")=>{let a=s,o=se(e);return a=$(".rarity-tag-wrapper",a).children(`:not(.gas-rarity-tag-${o})`).hide().parents(t).prop("outerHTML"),a};var L=(e,s,t,a=!1)=>{e.append(s).children().last().removeClass(["bg-light","bg-dark","locked","unlocked"]).addClass(`bg-${t%2>0?"light":"dark"}`).addClass(`${a?"unlocked":"locked"}`)};var A=(e,s,t=".gas-list-entry")=>{let a=s,o={ps:{rgx:/playstation/gi},xbox:{rgx:/xbox/gi},steam:{rgx:/steam|pc|windows|mac|linux/gi}};return o.ps.rgx.test(e)&&(a=$(".gas-platform-psn",a).css("display","inherit").parents(t).prop("outerHTML")),o.steam.rgx.test(e)&&(a=$(".gas-platform-steam",a).css("display","inherit").parents(t).prop("outerHTML")),o.xbox.rgx.test(e)&&(a=$(".gas-platform-xbox",a).css("display","inherit").parents(t).prop("outerHTML")),s};var B=(e,s,t=".gh-row")=>{let a=s,o=e?.unlocked;return o&&(a=a.replaceAll("{|unlockedAt|}",`${K(e.unlockedAt)}<br />${C(e.unlockedAt)}`)),a=$(".status-wrapper",a).children(`:not(.${o?"unlocked":"locked"}-status)`).hide().parents(t).prop("outerHTML"),a};var _=(e,s,t=".gh-row")=>{let a=s;return a=$(".trophy-wrapper",a).children(`:not(.trophy-${e.toLowerCase()})`).hide().parents(t).prop("outerHTML"),a};var T=(e,s,t=".gas-list-entry")=>e.removeAttr("srcset").removeAttr("sizes").attr("src",s).parents(t).prop("outerHTML");var E=(e,s)=>{let t=s,a=rarityClassCalc(e);return t=t.replaceAll("{|rarity|}",a.replace("-"," ")),t=$(".gas-rarity-tag",t).removeClass("gas-rarity-tag").addClass(`gas-rarity-tag-${a}`).children(".p1").addClass(a).parents(".gas-list-entry").prop("outerHTML"),t};var z=(e,s,t={})=>{$(`${e} form.search`).on("submit",async function(a){a.preventDefault(),searchTerm=new URLSearchParams($(this).serialize()).get("query"),searchTerm?.length&&($(".ga-loader-container",e).show(),$(".gas-list,.gas-list-results-info",e).hide(),await s(e,searchTerm,t),$(".gas-list-results-info",e).show(),$(".ga-loader-container").hide())})};function Q(e){switch(e){case 1:return"#FF6C6C";case 2:return"#FF876C";case 3:return"#FFB36C";case 4:return"#FFD66C";case 5:return"#D0FF6C";case 6:return"#6CFFCA";case 7:return"#69E4FF";case 8:return"#99A3FF";case 9:return"#C699FF";case 10:return"#FFA0EA";default:return"#5663BA"}}function ae(e=""){return`<svg ${e} viewBox="0 0 400 283" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M396.063 200.058C387.286 177.198 388.232 171.375 363.69 113.777C342.879 64.745 324.486 39.1518 302.256 32.5827V16.449C302.256 7.35738 294.899 0 285.807 0H260.74C251.648 0 244.291 7.35738 244.291 16.449V30.7959H155.687V16.449C155.687 7.35738 148.277 0 139.238 0H114.17C105.079 0 97.7212 7.35738 97.7212 16.449V32.5827C75.4388 39.1518 57.098 64.745 36.2345 113.777C11.6925 171.427 12.5859 177.25 3.80958 200.058C-4.91416 222.919 0.341103 257.656 30.0859 275.104C59.8833 292.499 89.6806 279.36 114.17 246.568C138.712 213.775 148.329 215.414 169.35 215.414H230.679C251.701 215.414 261.265 213.775 285.807 246.568C310.297 279.36 340.094 292.446 369.891 275.104C399.636 257.709 404.944 222.919 396.168 200.058H396.063Z" />
    </svg>`}function D(){$("svg",this).css("fill",Q(Number($(this).data("rate")))),$("p",this).show()}function J(){$("svg",this).css("fill","#5663BA"),$("p",this).hide()}function X(e,s){for(let t=1;t<11;t++)e.append(`<li data-rate="${t}" role="button"><p>${t}</p>${ae()}</li>`);$("li",e).click(function(){$(this).siblings().removeClass("rating-active"),$(this).addClass("rating-active");let t=Number($(this).data("rate"));s.data("rate",t).text(`${t}/10`).css("color",Q(t))}),$("li",e).on("mouseenter",function(){D.apply(this),$(this).nextAll().each(J),$(this).prevAll().each(D)}),$("li",e).on("mouseleave",()=>{let t=$(".rating-active",e);t.length?(D.apply(t),t.prevAll().each(D),t.nextAll().each(J)):$("li",e).each(J)})}function R(e){return ae(`class="bg-review-score" fill="${Q(e)}"`)}var he="#gas-gh";function ge({listsData:e,elemId:s,numKeysToReplace:t,textKeysToReplace:a}){console.info(`=== ${s} results ===`,e),$(`${s} .gas-list-first, ${s} .gas-list-latest`).each((p,m)=>{let d=$(m),h=d.prop("outerHTML"),r=$(".gas-list-empty",d),v=d.children().first(),i=$(".gas-list-entry",d).first();d.html(v);let f=e[p===0?"firstAchievers":"latestAchievers"];f?.length>0?(i.show(),d.append(i),h=i.prop("outerHTML"),i.hide(),f.forEach((c,u)=>{let n=h;for(let[g,l]of Object.entries(c)){let y=$(".gas-list-entry-cover",n);if(y&&c.iconURL?.length&&(n=T(y,c.avatar)||n),n=n.replaceAll("{|idx|}",u+1),g==="unlockedAt"){let{date:w,time:x}=G(l);n=n.replaceAll("{|unlockedDt|}",w||"N.A."),n=n.replaceAll(`{|${g}|}`,x||"N.A.")}else a.includes(g)?n=n.replaceAll(`{|${g}|}`,l||""):t.includes(g)&&(n=n.replaceAll(`{|${g}|}`,Math.round(l||0)))}L(d,n,u)})):(d.append(r),r.show())})}async function ue({gamehubURL:e},{listName:s,numKeysToReplace:t,textKeysToReplace:a}){let o=`${he}-${s}`,m=await(await fetch(`${e}/${s}`)).json();ge({listsData:m,elemId:o,numKeysToReplace:t,textKeysToReplace:a})}async function oe(e){await ue({gamehubURL:e},{listName:"achievers",numKeysToReplace:["id","achievementId"],textKeysToReplace:["profileId","achievementName","playerName","name"]})}var $e="#gas-gh",ye=document.querySelector("meta[name=domain]")?.content;async function Y(e,s){let t=`${$e}-achievements`,a=$(`${t} .ga-loader-container`),o=$(`${t} .${s===1?"psn":"xbox"}-achievement-list`),p=$(`${t} .empty-state`);p.hide(),o.hide(),a.show();let m={Authorization:`Bearer ${token}`},h=await(await fetch(`https://${ye}/api/game/${e}/achievements${s?`?platform=${s}`:""}`,{headers:token?m:{}})).json();console.info(`=== ${t} results ===`,h);let r=["name","description"],v=["id","score","achieversCount","gAPoints"],i=o.parent(),f=o.children().first(),c=$(".gh-row",o).first();c.show();let u=c.prop("outerHTML");o.html(f).append(c),h.length>0?(c.hide(),h.forEach((n,g)=>{let l=u;for(let[y,w]of Object.entries(n)){let x=$(".gas-list-entry-cover",l);x&&n.iconURL?.length&&(l=T(x,n.iconURL,".gh-row")||l),y==="name"?l=l.replaceAll("{|name|}",F(w)||"N.A."):r.includes(y)?l=l.replaceAll(`{|${y}|}`,(y.endsWith("At")?gaDate(w):w)||""):v.includes(y)?l=l.replaceAll(`{|${y}|}`,Math.round(w||0)):y==="rarity"?l=q(w,l,".gh-row"):y==="trophyType"&&s===1?l=_(w,l):y==="userProgress"&&(l=B(w,l))}L(o,l,g,n.userProgress?.unlocked)}),a.hide(),i.removeClass("hidden"),o.css({display:"flex","flex-direction":"column"}),p.hide()):(a.hide(),o.hide(),p.show())}var ve="#gas-gh",k="#gas-gh-versions-dropdown";async function we(e){let s=$(e.target);$(`${k}-options,${k}-toggle`).removeClass("w--open");let t=Number(s.data("version-id")),a=Number(N(s.data("platform")?.toLowerCase())||0);$(`${k}-text-selected`).text(s.text()),Y(t,a)}async function re(e,s){let t="versions",a=`${ve}-${t}`;if(!e.versionDetails){let f=e.platforms??e.importedFromPlatforms,c=Number(f?.length>=1?N(f[0].toLowerCase()):0);return $(k).remove(),Y(e.id,c)}let p=await(await fetch(`${s}/${t}`)).json(),m=["achievementsCount"],d=["gameId","externalGameId","region"];console.info(`=== ${a} results ===`,p);let h=$(a).prop("outerHTML"),r=$(`${a} .gas-list`),v=$(`${a} .heading-description-wrapper`).children().last(),i=v.prop("outerHTML");if(i&&(i=i.replaceAll("{|name|}",e.name),v.prop("outerHTML",i)),p.length){let f=r.children().first(),c=$(".gas-list-entry",r).first();c.show(),h=c.prop("outerHTML"),r.html(f).append(c),c.hide();let u="gas-version-option",n=$(`${k}-options`).children().first();n.addClass(u),p.forEach((g,l)=>{let y=n.clone(),w=g.consoles[0]+(g.region?` \u2014 ${g.region} `:"");y.data("version-id",g.gameId).data("version-external-id",g.externalGameId).data("platform",g.platform).text((g.name?.length?`${g.name} | `:"")+w),$(`${k}-options`).append(y);let x=h;for(let[b,I]of Object.entries(g))d.includes(b)?x=x.replaceAll(`{|${b}|}`,I||"?"):m.includes(b)?x=x.replaceAll(`{|${b}|}`,Math.round(I||0)):b==="name"?x=x.replaceAll(`{|${b}|}`,g.name?.length?g.name:w):b==="platform"?x=A(I,x):b==="consoles"&&(x=$(".gas-console-tags",x).html(I.map(ee=>{let te=ee.toLowerCase();return`<div class="console-${te.startsWith("ps")?"playstation":te.slice(0,4)}">${ee}</div>`})).parents(".gas-list-entry").prop("outerHTML"));L(r,x,l)}),n.remove(),$(`.${u}`).on("click",we)}r.css("display","flex"),$(`${a}-tab .gas-list-empty`).show(),$(`${a},${a}-tab-btn`).css("display","flex")}var U="#gas-gh";function ne(e,s){let t=$(s),a=t.prop("outerHTML");console.info(`=== ${s} ===`,e);let o=["name","igdbId","description"],p=["ownersCount","achievementsCount","gaReviewScore","versionsCount","completion"],m=["releaseDate"],d=[],h=["developers","publishers","franchises","engines","modes","genres","themes","series","supportedLanguages","playerPerspectives"],r=[...o,...m],v=[...p,...d];s.endsWith("top")&&(e.coverURL||e.imageURL)?.length&&(a=t.css("background-image",`linear-gradient(rgba(255,255,255,0),#030922),
          linear-gradient(rgba(70,89,255,.4),rgba(70,89,255,.4)),
          url(${e.coverURL||e.imageURL})`).prop("outerHTML")),$(".gas-img",a).each((c,u)=>{e.imageURL?.length&&(a=T($(u),e.imageURL,s)||a)});for(let[c,u]of Object.entries(e))r.find(n=>n.toLowerCase()===c.toLowerCase())?a=a.replaceAll(`{|${c}|}`,u?.length?c.endsWith("Date")?C(u):u:"N.A."):v.find(n=>n.toLowerCase()===c.toLowerCase())?a=a.replaceAll(`{|${c}|}`,Math.round(u||0)):c==="platformsInGACount"&&s.endsWith("top")?a=A(u?.length?u:e.importedFromPlatforms,a,s):h.includes(c)&&(a=a.replaceAll(`{|${c}|}`,u?.length?u.join(", "):"N.A."));t.prop("outerHTML",a);let i=Object.keys(e),f=[...p,...r,...h].filter(c=>!i.includes(c));for(let c of f)$(`div:contains({|${c}|})`).parent(".entry-wrapper").remove();s.endsWith("about")&&f.length>0&&$(".about-game-entry-div").each(function(){$(this).find(".entry-wrapper").length===0&&$(this).remove()})}async function ie(e,s){let t=await fetch(e);if(!t.ok){location.replace("/games");return}let a=await t.json();if(Object.keys(a).length>0&&a.id){if(a.versionDetails&&a.versionDetails.defaultVersion!==Number(s)){location.replace(`/game?id=${a.versionDetails.defaultVersion}`);return}if(document.title=`${a.name?.length?a.name:a.id} | ${document.title}`,a.igdbId?.length)for(let o of["top","about"])ne(a,`${U}-${o}`);else $(`${U}-about,${U}-igdb-id,[href="${U}-about"]`).remove(),ne(a,`${U}-top`)}return a}var M="#gas-gh";function xe(e){if($("#official-review-game-title").text(e.name),$(`${M}-top-ga-score`).prepend(R(0)),$(`${M}-top-ga-score-text`).text("-"),!e?.gaReviewURL?.length)return;let s=`${M}-official-review`;if($(s).css("display","flex"),$(`${s}-placeholder`).hide(),$(`${s}-url`).attr("href",e.gaReviewURL),e?.gaReviewSummary?.length&&$(`${s}-summary`).text(e.gaReviewSummary),e?.gaReviewScore){let t=Math.round(e.gaReviewScore),a=R(t);$(`${s}-score-text`).text(t),$(`${s}-score-bg`).replaceWith(a),$(`${M}-top-ga-score .bg-review-score`).replaceWith(a),$(`${M}-top-ga-score-text`).text(t)}else $(`${s}-score`).parent().remove()}async function Te(e,s){let t=`${M}-review-form`;if((await fetch(`${e}/review`,{headers:{Authorization:`Bearer ${s}`}})).status===200){$(t).remove();return}let o=$(".submit-button",t);o.attr("disabled",!0);let p=$("[name=title]",t),m=$("[name=content]",t),d=$("[name][required]",t),h=o.val(),r=$(".gas-form-error",t),v=$("div",r),i=r.text(),f=$(".gas-form-success",t),c=$(".gas-rating-scale",t),u=$(".gas-rating-selected",t);X(c,u);let n=!1,g=()=>{n&&Number(u.data("rate"))&&o.removeClass("disabled-button").attr("disabled",!1)};d.on("focusout keyup",()=>{d.each(function(){$(this).val()?.length?(n=!0,$(this).prev("label").removeClass("field-label-missing")):(n=!1,$(this).prev("label").addClass("field-label-missing"),o.addClass("disabled-button").attr("disabled",!0))}),g()}),$("li",c).one("click",()=>{c.parent().prev("label").removeClass("field-label-missing"),g()}),o.on("click",async l=>{l.preventDefault();let y=Number(u.data("rate")||0);if(!y||!p.val()?.length||!m.val().length){r.show(),v.text("Please choose a rating and fill-in required fields"),setTimeout(()=>{r.hide(),v.text(i)},formMessageDelay);return}isUserInputActive=!1,$("input",t).attr("disabled",!0),o.val(o.data("wait"));let w={title:p.val(),content:m.val(),rating:y},x=await fetch(`${e}/review`,{method:"POST",headers:{Authorization:`Bearer ${s}`,Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify(w)}),b=await x.json();if(x.status!==201){r.show(),v.text(b?.message),setTimeout(()=>{r.hide(),v.text(i),$("input",t).attr("disabled",!1),o.val(h)},formMessageDelay);return}$("form",t).hide(),f.attr("title",b?.message).show(),setTimeout(()=>{location.reload()},formMessageDelay)})}function le(e,s,t){xe(t),Te(e,s)}function ce({listData:e,elemId:s}){let t=$(`${s}-bars`),a=[],o=["positive","mixed","negative"];if(e.length){for(let m of o){a=e.filter(r=>r.classification?.toLowerCase()===m);let d=$(`.gas-bar-${m}`,t);d.length&&d.css("width",`${100*(a.length/e.length)||1}%`);let h=$(`.gas-bar-text-${m}`,t);h.length&&h.text(a?.length)}let p=Math.round(e.map(m=>m.rating).reduce((m,d)=>m+d)/e.length);$(".gas-avg-rate-wrapper").each((m,d)=>{$(d).prepend(R(p)),$(".gas-avg-rate-text",d).text(p)})}else{for(let p of o)$(`.gas-bar-${p}`,t).css("width","1%");$(".gas-avg-rate-wrapper").each((p,m)=>{$(m).prepend(R(0)),$(".gas-avg-rate-text",m).text("-")})}}var be=["all","playstation","xbox","steam"];function pe({listData:e,elemId:s,numKeysToReplace:t,textKeysToReplace:a,tabCounts:o,tabMatcher:p}){let m=$(`${s} .gas-list-tabs`);console.info(`=== ${s} results ===`,e);let d=m.prop("outerHTML");if(!o){p="platform",o={all:e.length,playstation:e.filter(h=>h[p].toLowerCase()==="playstation")?.length,xbox:e.filter(h=>h[p].toLowerCase()==="xbox")?.length,steam:e.filter(h=>h[p].toLowerCase()==="steam")?.length};for(let h of be)d=d.replaceAll(`{|${h}Cnt|}`,o[h])||"0"}m.prop("outerHTML",d);for(let h of Object.keys(o)){let r=$(`${s} .gas-list-${h}`),v=$(".gas-list-empty",r);if(o[h]>0){let i=r.children().first(),f=$(".gas-list-entry",r).first();f.show(),d=f.prop("outerHTML"),r.html(i).append(f),f.hide(),(h==="all"?e:e.filter(c=>c[p]?.toLowerCase()===h)).forEach((c,u)=>{let n=d;for(let[g,l]of Object.entries(c)){let y=$(".gas-list-entry-cover",n);if(y&&c.iconURL?.length&&(n=T(y,c.iconURL)||n),s.endsWith("achievements")&&g==="name")n=n.replaceAll("{|name|}",F(l)||"N.A.");else if(a.includes(g))n=n.replaceAll(`{|${g}|}`,(g.endsWith("At")?gaDate(l):l)||"");else if(t.includes(g))n=n.replaceAll(`{|${g}|}`,Math.round(l||0));else if(g==="rating"){n=n.replaceAll(`{|${g}|}`,Math.round(l||0));let w=$(".gas-list-entry-rating",n);w.length&&(n=w.prepend(R(l)).parents(".gas-list-entry").prop("outerHTML"))}else g==="platform"?n=A(l,n):g==="rarity"&&(n=E(l,n))}L(r,n,u)})}else r.html(v),v.show()}}async function P({elemIdPrefix:e,gamehubURL:s},{listName:t,numKeysToReplace:a,textKeysToReplace:o,tabs:p,tabMatcher:m}){let d=`${e}-${t}`,r=await(await fetch(`${s}/${t}`)).json();if(Array.isArray(r)||r.length>0){let v;if(Array.isArray(p)){v={};for(let i of p)v[i]=i==="all"?r.length:r.filter(f=>f[m]?.toLowerCase()===i)?.length}switch(t){case"reviews":ce({listData:r,elemId:d}),$(".gas-count-reviews").each((i,f)=>{$(f).text($(f).text().replace("{|reviewsCnt|}",r.length)),i>0&&$(f).text($(f).text().replace(`{|${p[i]}ReviewsCnt|}`,v[p[i]]))});break;case"guides":$(`${e}-top .gas-count-guides`).text(r.length);break;default:break}pe({listData:r,elemId:d,numKeysToReplace:a,textKeysToReplace:o,tabCounts:v,tabMatcher:m})}}async function me(e,s){await P({elemIdPrefix:e,gamehubURL:s},{listName:"guides",numKeysToReplace:["id","commentsCount","viewsCount","likesCount"],textKeysToReplace:["profileId","name","description","author","updatedAt"]})}var Le="#gas-gh",Ae=document.querySelector("meta[name=forum-domain]")?.content;function Ce({gamehubData:e},{listData:s,elemId:t,numKeysToReplace:a,textKeysToReplace:o}){console.info(`=== ${t} results ===`,s);let p=$(t).prop("outerHTML"),m=$(`${t} .gas-list`),d=$(`${t} .gas-list-empty`),h=$(".gas-list-entry",m).first();if(h.show(),p=h.prop("outerHTML"),h.hide(),s?.length&&p?.length)m.html(h),s.forEach((r,v)=>{let i=p;i=i.replaceAll("{|idx|}",v+1);for(let[f,c]of Object.entries(r)){if(r.gameIconURL?.length&&!H(r.gameIconURL)){let u=$(".gas-list-entry-cover-game",i);u?.length&&(i=T(u,r.gameIconURL)||i)}if((r.iconURL?.length||r.imageURL?.length)&&!W(r.imageURL)&&!H(r.imageURL)&&!H(r.iconURL)){let u=$(".gas-list-entry-cover",i);u?.length&&(i=t.includes("list-games")?u.css("background-image",`url(${r.imageURL})`).parents(".gas-list-entry").prop("outerHTML"):T(u,r.iconURL||r.imageURL)||i)}o.includes(f)?i=i.replaceAll(`{|${f}|}`,(f.endsWith("At")?C(c):V(c))||""):a.includes(f)?i=i.replaceAll(`{|${f}|}`,Math.round(c||0)):f==="lastPlayed"?i=i.replaceAll(`{|${f}|}`,C(c)):(f==="importedFromPlatform"||f==="platform")&&(i=A(c,i))}m.append(i)});else{s?.length&&!p?.length&&console.error(`${t} template issue (missing a '.gas-' class?)`);let r=d.children().first(),v=r.prop("outerHTML").replaceAll("{|name|}",e.name);r=r.prop("outerHTML",v),$(t).html(d),d.show()}m.css("display","flex")}async function de(e){let s=[],t=`${Le}-forum-threads`;if(e.forumCategoryID){let a=await fetch(`https://${Ae}/api/category/${e.forumCategoryID}`);a.ok&&(s=(await a.json()).topics.slice(0,5)),s=s.map(o=>({id:o.cid,title:o.title,topic_id:o.tid,author_name:o.user.username,imageURL:o.user.picture?.toLowerCase().includes("http")?new DOMParser().parseFromString(o.user.picture,"text/html").documentElement.textContent:"https://uploads-ssl.webflow.com/6455fdc10a7247f51c568c32/64b50ee999d75d5f75a28b08_user%20avatar%20default.svg",category_name:o.category.name,category_id:o.category.cid,views:o.viewcount,upvotes:o.upvotes,replies:o.postcount}))}Ce({gamehubData:e},{listData:s,elemId:t,numKeysToReplace:["replies","views","upvotes"],textKeysToReplace:["title","author_name","category_name","topic_id","category_id"]}),$(`${t} .ga-loader-container`).hide()}var Re=document.querySelector("meta[name=domain]")?.content,ke=["all","playstation","xbox","steam"];async function Z(e,s="",{gameId:t}){let a=$(e).prop("outerHTML");for(let o of ke){let p=$(`${e} .gas-list-${o}`),m=0;switch(o){case"playstation":m=1;break;case"xbox":m=2;break;case"steam":m=3;break;default:break}let d={gameId:t};m&&(d.type=m),s.length&&(d.q=s);let r=await(await fetch(`https://${Re}/api/leaderboard${Object.keys(d)?.length?`?${new URLSearchParams(d).toString()}`:""}`)).json();console.info(`=== ${e} results ===`,r);let v=["profileId","name"],i=["totalAchievements","gaPoints"];switch(m){case 1:i.push("silver","bronze","gold","platinum");break;case 2:i.push("gamescore");break;case 3:i.push("games");break}let f=$(".gas-list-empty",p);if(r.count>0&&r.results?.length){let c=p.children().first(),u=$(".gas-list-entry",p).first();u.show(),a=u.prop("outerHTML"),p.html(c).append(u),u.hide(),r.results.forEach((n,g)=>{let l=a;l=l.replaceAll("{|idx|}",g+1);for(let[y,w]of Object.entries(n))if(y==="iconURL"){let x=$(".gas-list-entry-cover",l);x?.length&&w?.length&&(l=T(x,w)||l)}else if(y==="recentlyPlayed"){!m&&w?.platform?.length&&(l=A(w?.platform,l));let x=$(".gas-list-entry-cover-game",l);x?.length&&w?.iconURL?.length&&(l=T(x,w.iconURL)||l)}else v.includes(y)?l=l.replaceAll(`{|${y}|}`,w||""):i.includes(y)&&(l=l.replaceAll(`{|${y}|}`,Math.round(w||0)));L(p,l,g)})}else p.html(f),f.show()}}async function fe(e,s){P({elemIdPrefix:e,gamehubURL:s},{listName:"reviews",numKeysToReplace:["id","likesCount"],textKeysToReplace:["profileId","name","content","author","classification","updatedAt"],tabs:["all","positive","mixed","negative"],tabMatcher:"classification"})}var Me=document.querySelector("meta[name=domain]")?.content,Se=new URLSearchParams(location.search),O=Se.get("id")||1044,S=`https://${Me}/api/game/${O}`,j="#gas-gh";$(".ga-loader-container").show();$("#ga-sections-container").hide();$(async()=>{await auth0Bootstrap();let e=await ie(S,O);if(e){le(S,token,e),z(`${j}-leaderboard`,Z,{gameId:O}),await Promise.all([await re(e,S),await Z(`${j}-leaderboard`,"",{gameId:O}),await me(j,S),await fe(j,S),await oe(S),await de(e)]),$(".ga-loader-container").hide(),$("#ga-sections-container").show(),$("#gas-wf-tab-activator").click();return}});})();
