(()=>{var p=e=>{let t=a=>`0${a}`.slice(-2),s=new Date(e);return`${s.getFullYear()} . ${t(s.getMonth()+1)} . ${t(s.getDate())}`};var y=e=>{if(!e)return"N.A.";let t=e.lastIndexOf(" | ");return t>0?e.slice(0,t):e};var b=document.querySelector("meta[name=domain]")?.content,I=new URLSearchParams(window.location.search),m=Number(I.get("id"))||0,h=m>0,n,u=Number(I.get("achievementId"))||0;var i="#gas-guide-form";var l=2,A=$(".gas-form-section",i).last().clone();$(".ga-loader-container").show(),$("#ga-sections-container").hide();var D=(e,t)=>!!t&&(isUserInputActive=!0,!0),H=e=>{if((e.hasClass("gas-form-tinymce")?tinyMCE.get(e.attr("id")).getContent():e.val())?.length)return e.prev("label").removeClass("field-label-missing");e.prev("label").addClass("field-label-missing")},v=e=>{let t=!1,s=!1;e?.length&&H(e);for(let a of $("input[name][required]",i))if(t=D($(a),$(a).val()?.length),!t)break;for(let a of $(".gas-form-tinymce",i))if(s=D($(a),tinyMCE.get($(a).attr("id")).getContent()?.length),!s)break;t&&s?$(`${i}-btn-submit`).removeClass("disabled-button").attr("disabled",!1):$(`${i}-btn-submit`).addClass("disabled-button").attr("disabled",!0)},M,w={selector:".gas-form-tinymce",height:200,menubar:!1,toolbar_mode:"floating",plugins:"link image lists",toolbar:"undo redo | bold italic underline | numlist bullist",content_style:"body { font-family:Gantari,sans-serif; font-size:1rem }",setup:e=>{e.on("Paste Change input Undo Redo",t=>{clearTimeout(M),M=setTimeout(()=>v($(e.targetElm)),100)})}};function T(){if(confirm("Do you want to remove this section?")){v();let e=$(this).parents(".gas-form-section");tinyMCE.get($(".gas-form-tinymce",e).attr("id")).remove(),e.remove(),l--,$(".gas-form-section label[for$=-title]",i).each((t,s)=>$(s).text(`${t+1}${$(s).text().slice(1)}`)),l<=4&&$(".gas-form-section-add",i).show()}}async function F(){l++,$(`${i}-btn-submit`).addClass("disabled-button").attr("disabled",!0);let e=A.clone().show(),t=`section-${l}`;$("label[for=section-2-title]",e).text(`${l} \u203A section name*`).attr("for",`${t}-title`),$("[name=section-2-title]",e).attr("name",`${t}-title`).on("focusout keyup",function(){v($(this))}),$("label[for=section-2-content]",e).attr("for",`${t}-content`);let s=`${t}-content`;$(".gas-form-tinymce",e).attr("id",s).attr("name",s).attr("data-name",s),$(".gas-form-section-del",e).on("click",T),$(".gas-form-sections",i).append(e),w.selector=`#${s}`,await tinymce.init(w),l>4&&$(".gas-form-section-add",i).hide()}async function N(){$(".gas-form-tinymce",A).removeAttr("id"),await tinymce.init(w),h&&n?.id===m&&($("[name=guide-title]",i).val(n.name),$("[name=guide-description]",i).val(n.description),n.sections.forEach(async(c,o)=>{o>1&&o<n.sections.length&&await F(),$(`[name=section-${o+1}-title]`).val(c.title),tinyMCE.get(`section-${o+1}-content`).setContent(c.content)})),$(".gas-form-section-add",i).on("click",F),$(".gas-form-section-del",i).on("click",T),$(`${i}-btn-cancel`,i).on("click",c=>{c.preventDefault();let o=$("#gas-popup-leave-confirmation");o.css({opacity:1,display:"flex"}),$(".gas-popup-btn-close",o).one("click",r=>{r.preventDefault(),o.hide()}),$(".gas-popup-btn-leave",o).one("click",r=>{r.preventDefault(),isUserInputActive=!1,o.hide(),d()})}),$(`${i}-btn-submit`).attr("disabled",!0);let e=$(`${i}-btn-submit`).val(),t=$(".gas-form-error",i),s=$("div",t),a=t.text(),g=$(".gas-form-success",i);$("input[name][required]",i).on("focusout keyup",function(){v($(this))}),$(`${i}-btn-submit`).on("click",async c=>{c.preventDefault(),$(`${i}-btn-submit`).addClass("disabled-button").attr("disabled",!0),isUserInputActive=!1,$(`${i}-btn-submit`).val($(`${i}-btn-submit`).data("wait"));let o=[];$(".gas-form-section",i).each(function(){o.push({title:$("input[name$=-title]",this).val(),content:tinyMCE.get($(".gas-form-tinymce",this).attr("id")).getContent()})});let r={author:"GA user",title:$("[name=guide-title]",i).val(),description:$("[name=guide-description]",i).val(),sections:o},C="POST",x=`https://${b}/api/guide`;if(h)x+=`/${m}`,C="PUT",r.author=n.author,r.profileId=n.profileId;else{if(!userProfileData)return t.show(),s.text("Issue on accessing your data for saving. Please try again later."),$(`${i}-btn-submit`).val(e),void setTimeout(()=>{t.hide(),s.text(a)},4e3);r.profileId=userProfileData.id,r.author=userProfileData.name,r.achievementId=u}let k=await fetch(x,{method:C,headers:{Authorization:`Bearer ${token}`,Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify(r)}),L=await k.json();if(![200,201].includes(k.status))return t.show(),s.text(L?.message),$(`${i}-btn-submit`).val(e).removeClass("disabled-button").attr("disabled",!1),void setTimeout(()=>{t.hide(),s.text(a)},4e3);g.show(),$(`${i}-btn-submit`).val(e),setTimeout(()=>{$(`${i}-fields`).hide()},800),setTimeout(()=>{isUserInputActive=!1,g.hide(),d()},4e3)})}function f(e,t="#gas-guide-details"){let s=$(t),a=s.prop("outerHTML"),g=["id","name","achievementId","achievementName","gameId","gameName"],c=e.coverURL||e.imageURL;c?.length&&t.endsWith("details")&&(a=s.css("background-image",`linear-gradient(rgba(255,255,255,0),#030922),
          linear-gradient(rgba(70,89,255,.4),rgba(70,89,255,.4)),
          url(${c})`).prop("outerHTML")),Object.entries(e).forEach(([o,r])=>{o==="achievementName"?a=a.replaceAll(`{|${o}|}`,y(r)):g.includes(o)&&(a=a.replaceAll(`{|${o}|}`,(o.endsWith("At")?p(r):r)||""))}),s.prop("outerHTML",a)}async function R(){n=await(await fetch(`https://${b}/api/guide/${m}`)).json(),Object.keys(n).length>0&&n.id&&(document.title=`${n.name?.length?n.name:n.id} | ${document.title}`,f(n),f(n,"#gas-guide-form"))}async function j(){let e=await fetch(`https://${b}/api/achievement/${u}`),t=await e.json();Object.keys(t).length>0&&t.id&&(document.title=`Achievement ${t.name?.length?t.name:t.id} | ${document.title}`,t.achievementName=t.name,f(t),f(t,"#gas-guide-form"))}function d(){window.location.replace(h?`/guide?id=${m}`:u>0?`/achievement?id=${u}`:"/guides")}$(async()=>{if(await auth0Bootstrap(),token){if(h){if(await R(),n?.achievementId>0){let e=await fetch(`https://${b}/api/achievement/${n.achievementId}/guide-auth-user-data`,{headers:{Authorization:`Bearer ${token}`}});if(e.status!==200||!(await e.json()).ownedGuideId)return void d()}}else{if(!(u>0))return void d();await j()}await N(),$(".ga-loader-container").hide(),$("#ga-sections-container").show()}else d()});})();
