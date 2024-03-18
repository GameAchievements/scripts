(()=>{var d=e=>{let r=o=>`0${o}`.slice(-2),t=new Date(e);return`${t.getFullYear()} . ${r(t.getMonth()+1)} . ${r(t.getDate())}`};var v=e=>e?.length?e.replace(/"(\w)/g,"\u201C$1").replace(/(\w)"/g,"$1\u201D").replaceAll('"',"'"):e;function C(e,r){if(e.length<=r)return e;let t=e.substr(0,r);return t=t.substr(0,Math.min(t.length,t.lastIndexOf(" "))),`${t} ...`}var g=e=>e?.includes("steamstatic")||e?.includes("steampowered"),A=e=>e?.includes("images-eds.xboxlive.com");var x=(e,r,t=".gas-list-entry")=>{let o=r,a={ps:{rgx:/playstation/gi},xbox:{rgx:/xbox/gi},steam:{rgx:/steam|pc|windows|mac|linux/gi}};return a.ps.rgx.test(e)&&(o=$(".gas-platform-psn",o).css("display","inherit").parents(t).prop("outerHTML")),a.steam.rgx.test(e)&&(o=$(".gas-platform-steam",o).css("display","inherit").parents(t).prop("outerHTML")),a.xbox.rgx.test(e)&&(o=$(".gas-platform-xbox",o).css("display","inherit").parents(t).prop("outerHTML")),o};var y=(e,r,t=".gas-list-entry")=>e.removeAttr("srcset").removeAttr("sizes").attr("src",r).parents(t).prop("outerHTML");function S(e){switch(e){case 1:return"#FF6C6C";case 2:return"#FF876C";case 3:return"#FFB36C";case 4:return"#FFD66C";case 5:return"#D0FF6C";case 6:return"#6CFFCA";case 7:return"#69E4FF";case 8:return"#99A3FF";case 9:return"#C699FF";case 10:return"#FFA0EA";default:return"#5663BA"}}function U(e=""){return`<svg ${e} viewBox="0 0 400 283" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M396.063 200.058C387.286 177.198 388.232 171.375 363.69 113.777C342.879 64.745 324.486 39.1518 302.256 32.5827V16.449C302.256 7.35738 294.899 0 285.807 0H260.74C251.648 0 244.291 7.35738 244.291 16.449V30.7959H155.687V16.449C155.687 7.35738 148.277 0 139.238 0H114.17C105.079 0 97.7212 7.35738 97.7212 16.449V32.5827C75.4388 39.1518 57.098 64.745 36.2345 113.777C11.6925 171.427 12.5859 177.25 3.80958 200.058C-4.91416 222.919 0.341103 257.656 30.0859 275.104C59.8833 292.499 89.6806 279.36 114.17 246.568C138.712 213.775 148.329 215.414 169.35 215.414H230.679C251.701 215.414 261.265 213.775 285.807 246.568C310.297 279.36 340.094 292.446 369.891 275.104C399.636 257.709 404.944 222.919 396.168 200.058H396.063Z" />
    </svg>`}function L(e){return U(`class="bg-review-score" fill="${S(e)}"`)}function u({listData:e,elemId:r,numKeysToReplace:t,textKeysToReplace:o,drillDown:a={key:null,keysToReplace:null}}){console.info(`=== ${r} results ===`,e);let c=$(r).prop("outerHTML"),m=$(`${r} .gas-list`),f=$(`${r} .gas-list-empty`),h=$(".gas-list-entry",m).first();h.show(),c=h.prop("outerHTML"),h.hide(),e?.length&&c?.length?(m.html(h),e.forEach((l,H)=>{let s=c;s=s.replaceAll("{|idx|}",H+1);for(let[n,p]of Object.entries(l)){if(l.gameIconURL?.length&&!g(l.gameIconURL)){let i=$(".gas-list-entry-cover-game",s);i?.length&&(s=y(i,l.gameIconURL)||s)}if((l.iconURL?.length||l.imageURL?.length)&&!A(l.imageURL)&&!g(l.imageURL)&&!g(l.iconURL)){let i=$(".gas-list-entry-cover",s);i?.length&&(s=r.includes("list-games")?i.css("background-image",`url(${l.imageURL})`).parents(".gas-list-entry").prop("outerHTML"):y(i,l.iconURL||l.imageURL)||s)}if(o.includes(n))s=s.replaceAll(`{|${n}|}`,(n.endsWith("At")?d(p):v(p))||"");else if(t.includes(n))s=s.replaceAll(`{|${n}|}`,Math.round(p||0));else if(n==="lastPlayed")s=s.replaceAll(`{|${n}|}`,d(p));else if(n==="content")s=s.replaceAll(`{|${n}|}`,C(p,160));else if(n==="importedFromPlatform"||n==="platform"||n==="platforms")s=x(p,s);else if(a.key&&n===a.key)for(let i of a.keysToReplace)i==="platform"?s=x(p[i],s):s=s.replaceAll(`{|${i}|}`,Math.round(p[i]||0));else if(n==="rating"){s=s.replaceAll(`{|${n}|}`,Math.round(p||0));let i=$(".gas-list-entry-rating",s);i.length&&(s=i.prepend(L(p)).parents(".gas-list-entry").prop("outerHTML"))}}m.append(s)})):(e?.length&&!c?.length&&console.error(`${r} template issue (missing a '.gas-' class?)`),$(r).html(f),f.show()),m.css("display","flex")}async function M(e,r){let t=await fetch(`https://${r}/api/achievement/list/latest`),o=[];t.ok&&(o=(await t.json()).slice(0,4));let a=`${e}-list-achievements-latest`;u({listData:o,elemId:a,numKeysToReplace:["id"],textKeysToReplace:["name","description"],drillDown:{key:"gameVersionData",keysToReplace:["completion","platform","totalAchievements"]}}),$(`${a} .ga-loader-container`).hide()}async function b(e,r,t){let o=await fetch(`https://${r}/api/game/list/${e}`),a=[];o.ok&&(a=(await o.json())?.slice(0,4));let c=`${t}-list-games-${e}`;u({listData:a,elemId:c,numKeysToReplace:["id","players","achievements","averageCompletion","totalAchievements"],textKeysToReplace:["id","name","description","lastPlayed","externalGameId"]}),$(`${c} .ga-loader-container`).hide()}async function k(e,r){let t=await fetch(`https://${r}/api/guide/list?perPage=5&orderBy=createdAt:desc`),o=[];t.ok&&(o=(await t.json()).results?.slice(0,4));let a=`${e}-list-guides`;u({listData:o,elemId:a,numKeysToReplace:["id","comments","likes"],textKeysToReplace:["name","author","description","profileId"]}),$(`${a} .ga-loader-container`).hide()}async function R(e){let t=await(await fetch(`https://${e}/api/game/stats`)).json(),o=$("#top-page"),a=o.prop("outerHTML");console.info("=== #top-page ===",t);let c=["registeredUsers","gamesTracked","achievementsTracked","achievementsUnlocked","forumPosts"];for(let[m,f]of Object.entries(t))c.find(h=>h.toLowerCase()===m.toLowerCase())&&(a=a.replaceAll(`{|${m}|}`,Math.round(f||0)));o.prop("outerHTML",a)}var I=document.querySelector("meta[name=forum-domain]")?.content;async function F(e){let r=await fetch(`https://${I}/api/recent`),t=[];r.ok&&(t=(await r.json()).topics.slice(0,5)),t=t.map(a=>({id:a.cid,title:a.title,topic_id:a.tid,author_name:a.user.username,imageURL:a.user.picture?.toLowerCase().includes("http")?new DOMParser().parseFromString(a.user.picture,"text/html").documentElement.textContent:"https://uploads-ssl.webflow.com/6455fdc10a7247f51c568c32/64b50ee999d75d5f75a28b08_user%20avatar%20default.svg",category_name:a.category.name,category_id:a.category.cid,views:a.viewcount,upvotes:a.upvotes,replies:a.postcount}));let o=`${e}-forum-threads`;u({listData:t,elemId:o,numKeysToReplace:["replies","views","upvotes"],textKeysToReplace:["title","author_name","category_name","topic_id","category_id"]}),$(`${o} .ga-loader-container`).hide()}var w=document.querySelector("meta[name=domain]")?.content,T="#gas-home";$(async()=>{$(".ga-loader-container").show(),await auth0Bootstrap(),await Promise.all(["recent","top"].map(async e=>await b(e,w,T)),await R(w),await k(T,w),await M(T,w),await F(T))});})();
