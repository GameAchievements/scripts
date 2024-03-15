(()=>{var f=a=>{let t=e=>`0${e}`.slice(-2),r=new Date(a);return`${r.getFullYear()} . ${t(r.getMonth()+1)} . ${t(r.getDate())}`};var x=a=>{let t=new Date(a),r=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],e=`${t.getDate()} ${r[t.getMonth()]}, ${t.getFullYear()}`,o=t.toLocaleTimeString().toLowerCase();return{date:e,time:o}};var w=a=>{if(!a)return"N.A.";let t=a.lastIndexOf(" | ");return t>0?a.slice(0,t):a};var v=(a,t,r=".gas-list-entry")=>{let e=t,o={ps:{rgx:/playstation/gi},xbox:{rgx:/xbox/gi},steam:{rgx:/steam|pc|windows|mac|linux/gi}};return o.ps.rgx.test(a)&&(e=$(".gas-platform-psn",e).css("display","inherit").parents(r).prop("outerHTML")),o.steam.rgx.test(a)&&(e=$(".gas-platform-steam",e).css("display","inherit").parents(r).prop("outerHTML")),o.xbox.rgx.test(a)&&(e=$(".gas-platform-xbox",e).css("display","inherit").parents(r).prop("outerHTML")),e};var u=(a,t,r=".gas-list-entry")=>a.removeAttr("srcset").removeAttr("sizes").attr("src",t).parents(r).prop("outerHTML");var F="#gas-guide";function D({listData:a,elemId:t,textKeysToReplace:r}){console.info(`=== ${t} results ===`,a);let e=$(t).prop("outerHTML"),o=$(`${t} .gas-list`),c=$(".gas-list-empty",o);if(a.count>0&&a.results?.length){let s=o.children().first(),n=$(".gas-list-entry",o).first();n.show(),e=n.prop("outerHTML"),o.html(s).append(n),n.hide(),a.results.forEach((i,p)=>{let l=e;for(let[m,d]of Object.entries(i)){let b=$(".gas-list-entry-cover",l);if(b.length&&i.imageUrl?.length&&(l=u(b,i.imageURL)||l),r.includes(m))l=l.replaceAll(`{|${m}|}`,d||"");else if(m==="date"){let{date:I,time:L}=x(d);l=l.replaceAll(`{|${m}|}`,`${I} at ${L}`)}}o.append(l).children().last().removeClass(["bg-light","bg-dark"]).addClass(`bg-${p%2>0?"light":"dark"}`)})}else o.html(c),c.show();o.show()}async function H({apiDomain:a,guideId:t},{listName:r,textKeysToReplace:e}){let o=`${F}-${r}`,s=await(await fetch(`https://${a}/api/guide/${t}/${r}`)).json();$(`.gas-guide-${r}-count`).text(s.count||""),D({listData:s,elemId:o,textKeysToReplace:e})}async function C(a,t){await H({apiDomain:a,guideId:t},{listName:"comments",numKeysToReplace:[],textKeysToReplace:["profileId","author","comment"]})}var h="#gas-guide";function S(a){let t=$(`${h}-nav`),r=$(`${h}-sections`),e=$(".gas-nav-btn",t).first(),o=$(".gas-section",r).first();for(let c=a.length-1;c>=0;c--){let s=a[c],n=e.clone();n.attr("title",s.title),n.children().first().text(n.text().replace("{|title|}",s.title));let i=c+1;t.prepend(n.attr("href",`${h}-section-${i}`));let p=o.clone(),l=$(".gas-section-title",p);l.text(l.text().replace("{|title|}",`${i} \u203A ${s.title}`));let m=$(".gas-section-content",p);m.html(m.text().replace("{|content|}",s.content)),r.prepend(p.attr("id",`${h.slice(1)}-section-${i}`))}e.remove(),o.remove()}function P(a){let t=`${h}-details`,r=$(t),e=r.prop("outerHTML");console.info(`=== ${t} ===`,a);let o=["id","name","description","achievementId","achievementName","gameId","gameName","profileId","author","createdAt","updatedAt"],c=["comments","upvotes"],s=a.coverURL||a.imageURL;s?.length&&(e=r.css("background-image",`linear-gradient(rgba(255,255,255,0),#030922),
          linear-gradient(rgba(70,89,255,.4),rgba(70,89,255,.4)),
          url(${s})`).prop("outerHTML"));let n=$(".gas-author-cover",e);n?.length&&a.avatar?.length&&(e=u(n,a.avatar,t)||e);for(let[i,p]of Object.entries(a))o.includes(i)?e=e.replaceAll(`{|${i}|}`,(i.endsWith("At")?f(p):p)||""):c.includes(i)?e=e.replaceAll(`{|${i}|}`,Math.round(p||0)):i==="platform"&&(e=v(p,e,t));r.prop("outerHTML",e),S(a.sections)}async function T(a,t){let r=await fetch(`https://${a}/api/guide/${t}`);if(r.status!==200)return;let e=await r.json();return Object.keys(e).length>0&&e.id&&(document.title=`${e.name?.length?e.name:e.id} | ${document.title}`,achievementId=e.achievementId,e.achievementName=w(e.achievementName),P(e)),e}var g;function R(a){g=a;let t=$(`${elemIdPrefix}-btn-like`),r=$(`${elemIdPrefix}-btn-like-del`);g?t.hide():r.hide();let e=async()=>{t.attr("disabled",!0),r.attr("disabled",!0);let o=await fetch(`https://${apiDomain}/api/guide/${guideId}/upvote`,{method:"POST",headers:{Authorization:`Bearer ${token}`}}),c=$(`${elemIdPrefix}-upvotes-count`),s=g?-1:1;if(g=!g,c.text(Number(c.text()||0)+s),o.status===204){t.attr("disabled",!1).show(),r.hide();return}t.hide(),r.attr("disabled",!1).show()};t.on("click",e),r.on("click",e)}var U=a=>{let t=`${elemIdPrefix}-comment-form`;if(a){$(`${elemIdPrefix}-btn-add-comment`).hide(),$(t).parent().hide();return}let r=4e3,e=$(".submit-button",t);e.attr("disabled",!0);let o=$("[name=comment]",t),c=e.text(),s=$(".gas-form-error",t),n=$("div",s),i=s.text(),p=$(".gas-form-success",t);o.on("focusout keyup",function(){$(this).val()?.length?($(this).prev("label").removeClass("field-label-missing"),e.removeClass("disabled-button").attr("disabled",!1)):($(this).prev("label").addClass("field-label-missing"),e.addClass("disabled-button").attr("disabled",!0))}),e.on("click",async l=>{if(l.preventDefault(),!o.val().length){s.show(),n.text("Please write your comment in the box above"),setTimeout(()=>{s.hide(),n.text(i)},r);return}isUserInputActive=!1,$("input",t).attr("disabled",!0),e.text(e.data("wait"));let m=await fetch(`https://${apiDomain}/api/guide/${guideId}/comment`,{method:"POST",headers:{Authorization:`Bearer ${token}`,Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify({comment:o.val()})}),d=await m.json();if(m.status!==201){s.show(),n.text(d?.message),setTimeout(()=>{s.hide(),n.text(i),$("input",t).attr("disabled",!1),e.text(c)},r);return}$("form",t).hide(),p.attr("title",d?.message).show(),setTimeout(()=>{location.reload()},r)})};async function y(){token}var A=document.querySelector("meta[name=domain]")?.content,O=new URLSearchParams(location.search),k=O.get("id")||1;$(".ga-loader-container").show();$("#ga-sections-container").hide();$().ready(async()=>{if(await auth0Bootstrap(),await T(A,k)){await y(),await C(A,k),$(".ga-loader-container").hide(),$("#ga-sections-container").show(),$("#gas-wf-tab-activator").click();return}location.replace("/guides")});})();
