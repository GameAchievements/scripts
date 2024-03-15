(()=>{var f=a=>{let t=e=>`0${e}`.slice(-2),s=new Date(a);return`${s.getFullYear()} . ${t(s.getMonth()+1)} . ${t(s.getDate())}`};var x=a=>{let t=new Date(a),s=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],e=`${t.getDate()} ${s[t.getMonth()]}, ${t.getFullYear()}`,r=t.toLocaleTimeString().toLowerCase();return{date:e,time:r}};var w=a=>{if(!a)return"N.A.";let t=a.lastIndexOf(" | ");return t>0?a.slice(0,t):a};var v=(a,t,s=".gas-list-entry")=>{let e=t,r={ps:{rgx:/playstation/gi},xbox:{rgx:/xbox/gi},steam:{rgx:/steam|pc|windows|mac|linux/gi}};return r.ps.rgx.test(a)&&(e=$(".gas-platform-psn",e).css("display","inherit").parents(s).prop("outerHTML")),r.steam.rgx.test(a)&&(e=$(".gas-platform-steam",e).css("display","inherit").parents(s).prop("outerHTML")),r.xbox.rgx.test(a)&&(e=$(".gas-platform-xbox",e).css("display","inherit").parents(s).prop("outerHTML")),e};var u=(a,t,s=".gas-list-entry")=>a.removeAttr("srcset").removeAttr("sizes").attr("src",t).parents(s).prop("outerHTML");var M="#gas-guide";function D({listData:a,elemId:t,textKeysToReplace:s}){console.info(`=== ${t} results ===`,a);let e=$(t).prop("outerHTML"),r=$(`${t} .gas-list`),c=$(".gas-list-empty",r);if(a.count>0&&a.results?.length){let o=r.children().first(),n=$(".gas-list-entry",r).first();n.show(),e=n.prop("outerHTML"),r.html(o).append(n),n.hide(),a.results.forEach((i,p)=>{let l=e;for(let[m,d]of Object.entries(i)){let b=$(".gas-list-entry-cover",l);if(b.length&&i.imageUrl?.length&&(l=u(b,i.imageURL)||l),s.includes(m))l=l.replaceAll(`{|${m}|}`,d||"");else if(m==="date"){let{date:I,time:L}=x(d);l=l.replaceAll(`{|${m}|}`,`${I} at ${L}`)}}r.append(l).children().last().removeClass(["bg-light","bg-dark"]).addClass(`bg-${p%2>0?"light":"dark"}`)})}else r.html(c),c.show();r.show()}async function H({apiDomain:a,guideId:t},{listName:s,textKeysToReplace:e}){let r=`${M}-${s}`,o=await(await fetch(`https://${a}/api/guide/${t}/${s}`)).json();$(`.gas-guide-${s}-count`).text(o.count||""),D({listData:o,elemId:r,textKeysToReplace:e})}async function y(a,t){await H({apiDomain:a,guideId:t},{listName:"comments",numKeysToReplace:[],textKeysToReplace:["profileId","author","comment"]})}var h="#gas-guide";function S(a){let t=$(`${h}-nav`),s=$(`${h}-sections`),e=$(".gas-nav-btn",t).first(),r=$(".gas-section",s).first();for(let c=a.length-1;c>=0;c--){let o=a[c],n=e.clone();n.attr("title",o.title),n.children().first().text(n.text().replace("{|title|}",o.title));let i=c+1;t.prepend(n.attr("href",`${h}-section-${i}`));let p=r.clone(),l=$(".gas-section-title",p);l.text(l.text().replace("{|title|}",`${i} \u203A ${o.title}`));let m=$(".gas-section-content",p);m.html(m.text().replace("{|content|}",o.content)),s.prepend(p.attr("id",`${h.slice(1)}-section-${i}`))}e.remove(),r.remove()}function P(a){let t=`${h}-details`,s=$(t),e=s.prop("outerHTML");console.info(`=== ${t} ===`,a);let r=["id","name","description","achievementId","achievementName","gameId","gameName","profileId","author","createdAt","updatedAt"],c=["comments","upvotes"],o=a.coverURL||a.imageURL;o?.length&&(e=s.css("background-image",`linear-gradient(rgba(255,255,255,0),#030922),
          linear-gradient(rgba(70,89,255,.4),rgba(70,89,255,.4)),
          url(${o})`).prop("outerHTML"));let n=$(".gas-author-cover",e);n?.length&&a.avatar?.length&&(e=u(n,a.avatar,t)||e);for(let[i,p]of Object.entries(a))r.includes(i)?e=e.replaceAll(`{|${i}|}`,(i.endsWith("At")?f(p):p)||""):c.includes(i)?e=e.replaceAll(`{|${i}|}`,Math.round(p||0)):i==="platform"&&(e=v(p,e,t));s.prop("outerHTML",e),S(a.sections)}async function T(a,t){let s=await fetch(`https://${a}/api/guide/${t}`);if(s.status!==200)return;let e=await s.json();return Object.keys(e).length>0&&e.id&&(document.title=`${e.name?.length?e.name:e.id} | ${document.title}`,achievementId=e.achievementId,e.achievementName=w(e.achievementName),P(e)),e}var g;function R(a){g=a;let t=$(`${elemIdPrefix}-btn-like`),s=$(`${elemIdPrefix}-btn-like-del`);g?t.hide():s.hide();let e=async()=>{t.attr("disabled",!0),s.attr("disabled",!0);let r=await fetch(`https://${apiDomain}/api/guide/${guideId}/upvote`,{method:"POST",headers:{Authorization:`Bearer ${token}`}}),c=$(`${elemIdPrefix}-upvotes-count`),o=g?-1:1;if(g=!g,c.text(Number(c.text()||0)+o),r.status===204){t.attr("disabled",!1).show(),s.hide();return}t.hide(),s.attr("disabled",!1).show()};t.on("click",e),s.on("click",e)}var O=a=>{let t=`${elemIdPrefix}-comment-form`;if(a){$(`${elemIdPrefix}-btn-add-comment`).hide(),$(t).parent().hide();return}let s=4e3,e=$(".submit-button",t);e.attr("disabled",!0);let r=$("[name=comment]",t),c=e.text(),o=$(".gas-form-error",t),n=$("div",o),i=o.text(),p=$(".gas-form-success",t);r.on("focusout keyup",function(){$(this).val()?.length?($(this).prev("label").removeClass("field-label-missing"),e.removeClass("disabled-button").attr("disabled",!1)):($(this).prev("label").addClass("field-label-missing"),e.addClass("disabled-button").attr("disabled",!0))}),e.on("click",async l=>{if(l.preventDefault(),!r.val().length){o.show(),n.text("Please write your comment in the box above"),setTimeout(()=>{o.hide(),n.text(i)},s);return}isUserInputActive=!1,$("input",t).attr("disabled",!0),e.text(e.data("wait"));let m=await fetch(`https://${apiDomain}/api/guide/${guideId}/comment`,{method:"POST",headers:{Authorization:`Bearer ${token}`,Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify({comment:r.val()})}),d=await m.json();if(m.status!==201){o.show(),n.text(d?.message),setTimeout(()=>{o.hide(),n.text(i),$("input",t).attr("disabled",!1),e.text(c)},s);return}$("form",t).hide(),p.attr("title",d?.message).show(),setTimeout(()=>{location.reload()},s)})};async function C(){token}var A=document.querySelector("meta[name=domain]")?.content,j=new URLSearchParams(location.search),k=j.get("id")||1;$(".ga-loader-container").show();$("#ga-sections-container").hide();$().ready(async()=>{if(await auth0Bootstrap(),await T(A,k)){await C(),await y(A,k),$(".ga-loader-container").hide(),$("#ga-sections-container").show(),$("#gas-wf-tab-activator").click();return}location.replace("/guides")});})();
