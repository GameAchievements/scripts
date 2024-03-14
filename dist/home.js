(()=>{var g=e=>{let r=s=>`0${s}`.slice(-2),a=new Date(e);return`${a.getFullYear()} . ${r(a.getMonth()+1)} . ${r(a.getDate())}`};var v=e=>e?.length?e.replace(/"(\w)/g,"\u201C$1").replace(/(\w)"/g,"$1\u201D").replaceAll('"',"'"):e;var d=e=>e?.includes("steamstatic")||e?.includes("steampowered"),C=e=>e?.includes("images-eds.xboxlive.com");var x=(e,r,a=".gas-list-entry")=>{let s=r,t={ps:{rgx:/playstation/gi},xbox:{rgx:/xbox/gi},steam:{rgx:/steam|pc|windows|mac|linux/gi}};return t.ps.rgx.test(e)&&(s=$(".gas-platform-psn",s).css("display","inherit").parents(a).prop("outerHTML")),t.steam.rgx.test(e)&&(s=$(".gas-platform-steam",s).css("display","inherit").parents(a).prop("outerHTML")),t.xbox.rgx.test(e)&&(s=$(".gas-platform-xbox",s).css("display","inherit").parents(a).prop("outerHTML")),s};var y=(e,r,a=".gas-list-entry")=>e.removeAttr("srcset").removeAttr("sizes").attr("src",r).parents(a).prop("outerHTML");function m({listData:e,elemId:r,numKeysToReplace:a,textKeysToReplace:s,drillDown:t={key:null,keysToReplace:null}}){console.info(`=== ${r} results ===`,e);let n=$(r).prop("outerHTML"),p=$(`${r} .gas-list`),f=$(`${r} .gas-list-empty`),u=$(".gas-list-entry",p).first();u.show(),n=u.prop("outerHTML"),u.hide(),e?.length&&n?.length?(p.html(u),e.forEach((i,M)=>{let o=n;o=o.replaceAll("{|idx|}",M+1);for(let[l,h]of Object.entries(i)){if(i.gameIconURL?.length&&!d(i.gameIconURL)){let c=$(".gas-list-entry-cover-game",o);c?.length&&(o=y(c,i.gameIconURL)||o)}if((i.iconURL?.length||i.imageURL?.length)&&!C(i.imageURL)&&!d(i.imageURL)&&!d(i.iconURL)){let c=$(".gas-list-entry-cover",o);c?.length&&(o=r.includes("list-games")?c.css("background-image",`url(${i.imageURL})`).parents(".gas-list-entry").prop("outerHTML"):y(c,i.iconURL||i.imageURL)||o)}if(s.includes(l))o=o.replaceAll(`{|${l}|}`,(l.endsWith("At")?g(h):v(h))||"");else if(a.includes(l))o=o.replaceAll(`{|${l}|}`,Math.round(h||0));else if(l==="lastPlayed")o=o.replaceAll(`{|${l}|}`,g(h));else if(l==="importedFromPlatform"||l==="platform"||l==="platforms")o=x(h,o);else if(t.key&&l===t.key)for(let c of t.keysToReplace)c==="platform"?o=x(h[c],o):o=o.replaceAll(`{|${c}|}`,Math.round(h[c]||0))}p.append(o)})):(e?.length&&!n?.length&&console.error(`${r} template issue (missing a '.gas-' class?)`),$(r).html(f),f.show()),p.css("display","flex")}async function A(e,r){let a=await fetch(`https://${r}/api/achievement/list/latest`),s=[];a.ok&&(s=(await a.json()).slice(0,4));let t=`${e}-list-achievements-latest`;m({listData:s,elemId:t,numKeysToReplace:["id"],textKeysToReplace:["name","description"],drillDown:{key:"gameVersionData",keysToReplace:["completion","platform","totalAchievements"]}}),$(`${t} .ga-loader-container`).hide()}async function L(e,r,a){let s=await fetch(`https://${r}/api/game/list/${e}`),t=[];s.ok&&(t=(await s.json())?.slice(0,4));let n=`${a}-list-games-${e}`;m({listData:t,elemId:n,numKeysToReplace:["id","players","achievements","averageCompletion","totalAchievements"],textKeysToReplace:["id","name","description","lastPlayed","externalGameId"]}),$(`${n} .ga-loader-container`).hide()}async function b(e,r){let a=await fetch(`https://${r}/api/guide/list?perPage=5&orderBy=createdAt:desc`),s=[];a.ok&&(s=(await a.json()).results?.slice(0,4));let t=`${e}-list-guides`;m({listData:s,elemId:t,numKeysToReplace:["id","comments","likes"],textKeysToReplace:["name","author","description","profileId"]}),$(`${t} .ga-loader-container`).hide()}async function R(e){let a=await(await fetch(`https://${e}/api/game/stats`)).json(),s=$("#top-page"),t=s.prop("outerHTML");console.info("=== #top-page ===",a);let n=["registeredUsers","gamesTracked","achievementsTracked","achievementsUnlocked","forumPosts"];for(let[p,f]of Object.entries(a))n.find(u=>u.toLowerCase()===p.toLowerCase())&&(t=t.replaceAll(`{|${p}|}`,Math.round(f||0)));s.prop("outerHTML",t)}var D=document.querySelector("meta[name=forum-domain]")?.content;async function k(e){let r=await fetch(`https://${D}/api/recent`),a=[];r.ok&&(a=(await r.json()).topics.slice(0,5)),a=a.map(t=>({id:t.cid,title:t.title,topic_id:t.tid,author_name:t.user.username,imageURL:t.user.picture?.toLowerCase().includes("http")?new DOMParser().parseFromString(t.user.picture,"text/html").documentElement.textContent:"https://uploads-ssl.webflow.com/6455fdc10a7247f51c568c32/64b50ee999d75d5f75a28b08_user%20avatar%20default.svg",category_name:t.category.name,category_id:t.category.cid,views:t.viewcount,upvotes:t.upvotes,replies:t.postcount}));let s=`${e}-forum-threads`;m({listData:a,elemId:s,numKeysToReplace:["replies","views","upvotes"],textKeysToReplace:["title","author_name","category_name","topic_id","category_id"]}),$(`${s} .ga-loader-container`).hide()}var w=document.querySelector("meta[name=domain]")?.content,T="#gas-home";$(async()=>{$(".ga-loader-container").show(),await auth0Bootstrap(),await Promise.all(["recent","top"].map(async e=>await L(e,w,T))),await R(w),await b(T,w),await A(T,w),await k(T)});})();
