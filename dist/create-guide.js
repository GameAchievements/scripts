(()=>{var g=e=>{let t=o=>`0${o}`.slice(-2),i=new Date(e);return`${i.getFullYear()} . ${t(i.getMonth()+1)} . ${t(i.getDate())}`};var w=e=>{if(!e)return"N.A.";let t=e.lastIndexOf(" | ");return t>0?e.slice(0,t):e};var b=document.querySelector("meta[name=domain]")?.content,D=new URLSearchParams(window.location.search),d=Number(D.get("id"))||0,h=d>0,n,u=Number(D.get("achievementId"))||0,a="#gas-guide-form",l=2,F=$(".gas-form-section",a).last().clone();$(".ga-loader-container").show(),$("#ga-sections-container").hide();var A=(e,t)=>!!t&&(isUserInputActive=!0,!0),H=e=>{if((e.hasClass("gas-form-tinymce")?tinyMCE.get(e.attr("id")).getContent():e.val())?.length)return e.prev("label").removeClass("field-label-missing");e.prev("label").addClass("field-label-missing")},v=e=>{let t=!1,i=!1;e?.length&&H(e);for(let o of $("input[name][required]",a))if(t=A($(o),$(o).val()?.length),!t)break;for(let o of $(".gas-form-tinymce",a))if(i=A($(o),tinyMCE.get($(o).attr("id")).getContent()?.length),!i)break;t&&i?$(`${a}-btn-submit`).removeClass("disabled-button").attr("disabled",!1):$(`${a}-btn-submit`).addClass("disabled-button").attr("disabled",!0)},k,y={selector:".gas-form-tinymce",height:200,menubar:!1,toolbar_mode:"floating",plugins:"link image lists",toolbar:"undo redo | bold italic underline | numlist bullist",content_style:"body { font-family:Gantari,sans-serif; font-size:1rem }",setup:e=>{e.on("Paste Change input Undo Redo",()=>{clearTimeout(k),k=setTimeout(()=>v($(e.targetElm)),100)})}};function I(){if(confirm("Do you want to remove this section?")){v();let e=$(this).parents(".gas-form-section");tinyMCE.get($(".gas-form-tinymce",e).attr("id")).remove(),e.remove(),l--,$(".gas-form-section label[for$=-title]",a).each((t,i)=>$(i).text(`${t+1}${$(i).text().slice(1)}`)),l<=4&&$(".gas-form-section-add",a).show()}}async function M(){l++,$(`${a}-btn-submit`).addClass("disabled-button").attr("disabled",!0);let e=F.clone().show(),t=`section-${l}`;$("label[for=section-2-title]",e).text(`${l} \u203A section name*`).attr("for",`${t}-title`),$("[name=section-2-title]",e).attr("name",`${t}-title`).on("focusout keyup",function(){v($(this))}),$("label[for=section-2-content]",e).attr("for",`${t}-content`);let i=`${t}-content`;$(".gas-form-tinymce",e).attr("id",i).attr("name",i).attr("data-name",i),$(".gas-form-section-del",e).on("click",I),$(".gas-form-sections",a).append(e),y.selector=`#${i}`,await tinymce.init(y),l>4&&$(".gas-form-section-add",a).hide()}async function N(){$(".gas-form-tinymce",F).removeAttr("id"),await tinymce.init(y),h&&n?.id===d&&($("[name=guide-title]",a).val(n.name),$("[name=guide-description]",a).val(n.description),n.sections.forEach(async(c,s)=>{s>1&&s<n.sections.length&&await M(),$(`[name=section-${s+1}-title]`).val(c.title),tinyMCE.get(`section-${s+1}-content`).setContent(c.content)})),$(".gas-form-section-add",a).on("click",M),$(".gas-form-section-del",a).on("click",I),$(`${a}-btn-cancel`,a).on("click",c=>{c.preventDefault();let s=$("#gas-popup-leave-confirmation");s.css({opacity:1,display:"flex"}),$(".gas-popup-btn-close",s).one("click",r=>{r.preventDefault(),s.hide()}),$(".gas-popup-btn-leave",s).one("click",r=>{r.preventDefault(),isUserInputActive=!1,s.hide(),m()})}),$(`${a}-btn-submit`).attr("disabled",!0);let e=$(`${a}-btn-submit`).val(),t=$(".gas-form-error",a),i=$("div",t),o=t.text(),p=$(".gas-form-success",a);$("input[name][required]",a).on("focusout keyup",function(){v($(this))}),$(`${a}-btn-submit`).on("click",async c=>{c.preventDefault(),$(`${a}-btn-submit`).addClass("disabled-button").attr("disabled",!0),isUserInputActive=!1,$(`${a}-btn-submit`).val($(`${a}-btn-submit`).data("wait"));let s=[];$(".gas-form-section",a).each(function(){s.push({title:$("input[name$=-title]",this).val(),content:tinyMCE.get($(".gas-form-tinymce",this).attr("id")).getContent()})});let r={author:"GA user",title:$("[name=guide-title]",a).val(),description:$("[name=guide-description]",a).val(),sections:s},x="POST",C=`https://${b}/api/guide`;if(h)C+=`/${d}`,x="PUT",r.author=n.author,r.profileId=n.profileId;else{if(!userProfileData)return t.show(),i.text("Issue on accessing your data for saving. Please try again later."),$(`${a}-btn-submit`).val(e),void setTimeout(()=>{t.hide(),i.text(o)},4e3);r.profileId=userProfileData.id,r.author=userProfileData.name,r.achievementId=u}let T=await fetch(C,{method:x,headers:{Authorization:`Bearer ${token}`,Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify(r)}),S=await T.json();if(![200,201].includes(T.status))return t.show(),i.text(S?.message),$(`${a}-btn-submit`).val(e).removeClass("disabled-button").attr("disabled",!1),void setTimeout(()=>{t.hide(),i.text(o)},4e3);p.show(),$(`${a}-btn-submit`).val(e),setTimeout(()=>{$(`${a}-fields`).hide()},800),setTimeout(()=>{isUserInputActive=!1,p.hide(),m()},4e3)})}function f(e,t="#gas-guide-details"){let i=$(t),o=i.prop("outerHTML"),p=["id","name","achievementId","achievementName","gameId","gameName"],c=e.coverURL||e.imageURL;c?.length&&t.endsWith("details")&&(o=i.css("background-image",`linear-gradient(rgba(255,255,255,0),#030922),
          linear-gradient(rgba(70,89,255,.4),rgba(70,89,255,.4)),
          url(${c})`).prop("outerHTML")),Object.entries(e).forEach(([s,r])=>{s==="achievementName"?o=o.replaceAll(`{|${s}|}`,w(r)):p.includes(s)&&(o=o.replaceAll(`{|${s}|}`,(s.endsWith("At")?g(r):r)||""))}),i.prop("outerHTML",o)}async function R(){n=await(await fetch(`https://${b}/api/guide/${d}`)).json(),Object.keys(n).length>0&&n.id&&(document.title=`${n.name?.length?n.name:n.id} | ${document.title}`,f(n),f(n,"#gas-guide-form"))}async function j(){let t=await(await fetch(`https://${b}/api/achievement/${u}`)).json();Object.keys(t).length>0&&t.id&&(document.title=`Achievement ${t.name?.length?t.name:t.id} | ${document.title}`,t.achievementName=t.name,f(t),f(t,"#gas-guide-form"))}function m(){window.location.replace(h?`/guide?id=${d}`:u>0?`/achievement?id=${u}`:"/guides")}$(async()=>{if(await auth0Bootstrap(),token){if(h){if(await R(),n?.achievementId>0){let e=await fetch(`https://${b}/api/achievement/${n.achievementId}/guide-auth-user-data`,{headers:{Authorization:`Bearer ${token}`}});if(e.status!==200||!(await e.json()).ownedGuideId)return void m()}}else{if(!(u>0))return void m();await j()}await N(),$(".ga-loader-container").hide(),$("#ga-sections-container").show()}else m()});})();
