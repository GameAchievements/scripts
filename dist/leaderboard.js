(()=>{var g=(e,s,r=".gas-list-entry")=>{let o=s,n={ps:{rgx:/playstation/gi},xbox:{rgx:/xbox/gi},steam:{rgx:/steam|pc|windows|mac|linux/gi}};return n.ps.rgx.test(e)&&(o=$(".gas-platform-psn",o).css("display","inherit").parents(r).prop("outerHTML")),n.steam.rgx.test(e)&&(o=$(".gas-platform-steam",o).css("display","inherit").parents(r).prop("outerHTML")),n.xbox.rgx.test(e)&&(o=$(".gas-platform-xbox",o).css("display","inherit").parents(r).prop("outerHTML")),o};var m=(e,s,r=".gas-list-entry")=>e.removeAttr("srcset").removeAttr("sizes").attr("src",s).parents(r).prop("outerHTML");var h=(e,s,r={})=>{$(`${e} form.search`).on("submit",async function(o){o.preventDefault(),searchTerm=new URLSearchParams($(this).serialize()).get("query"),searchTerm?.length&&($(".ga-loader-container",e).show(),$(".gas-list,.gas-list-results-info",e).hide(),await s(e,searchTerm,r),$(".gas-list-results-info",e).show(),$(".ga-loader-container").hide())})};var u,w,d;function y({listData:e,elemId:s,numKeysToReplace:r,textKeysToReplace:o}){console.info(`=== ${s} results ===`,e);let n=$(s).prop("outerHTML"),a=$(`${s} .gas-list`);u||(d=$(".gas-list-empty",a),w=a.children().first(),u=$(".gas-list-entry",a).first().clone(),$(".gas-list-entry",a).first().remove()),e?.length?(n=u.prop("outerHTML"),a.html(w),e.forEach((b,x)=>{let t=n;t=t.replaceAll("{|idx|}",x+1);for(let[l,i]of Object.entries(b))if(l==="iconURL"){let c=$(".gas-list-entry-cover",t);c?.length&&i?.length&&(t=m(c,i)||t)}else if(l==="recentlyPlayed"){!p()&&i?.platform?.length&&(t=g(i?.platform,t));let c=$(".gas-list-entry-cover-game",t);c?.length&&i?.iconURL?.length&&(t=m(c,i.iconURL)||t)}else o.includes(l)?t=t.replaceAll(`{|${l}|}`,i||""):r.includes(l)&&(t=t.replaceAll(`{|${l}|}`,Math.round(i||0)));a.append(t).children().last().removeClass(["bg-light","bg-dark"]).addClass(`bg-${x%2>0?"light":"dark"}`)})):(a.html(d),d.show()),a.css("display","flex")}var v=document.querySelector("meta[name=domain]")?.content,p=()=>{switch(window.location.pathname){case"/playstation-leaderboard":return 1;case"/xbox-leaderboard":return 2;case"/steam-leaderboard":return 3;default:return}};async function f(e,s=""){let r={};p()&&(r.type=p()),s.length&&(r.q=s);let n=await(await fetch(`https://${v}/api/leaderboard${Object.keys(r)?.length?`?${new URLSearchParams(r).toString()}`:""}`)).json(),a=["totalAchievements","gaPoints"];switch(p()){case 1:a.push("silver","bronze","gold","platinum");break;case 2:a.push("gamescore");break;case 3:a.push("games");break}y({listData:n.results,elemId:e,numKeysToReplace:a,textKeysToReplace:["profileId","name"]})}$(".ga-loader-container").show();$("#ga-sections-container").hide();$().ready(async()=>{let e="#gas-leaderboard";await auth0Bootstrap(),h(e,f),await f(e),$(".ga-loader-container").hide(),$("#ga-sections-container").show()});})();
