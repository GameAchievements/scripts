(()=>{var f=e=>{let t=s=>`0${s}`.slice(-2),o=new Date(e);return`${o.getFullYear()} . ${t(o.getMonth()+1)} . ${t(o.getDate())}`};var w=e=>{if(!e)return"N.A.";let t=e.lastIndexOf(" | ");return t>0?e.slice(0,t):e};function d(e,t="#gas-guide-details"){let o=$(t),s=o.prop("outerHTML");console.info(`=== ${t} ===`,e);let n=["id","name","achievementId","achievementName","gameId","gameName"],l=e.coverURL||e.imageURL;l?.length&&t.endsWith("details")&&(s=o.css("background-image",`linear-gradient(rgba(255,255,255,0),#030922),
          linear-gradient(rgba(70,89,255,.4),rgba(70,89,255,.4)),
          url(${l})`).prop("outerHTML"));for(let[i,r]of Object.entries(e))i==="achievementName"?s=s.replaceAll(`{|${i}|}`,w(r)):n.includes(i)&&(s=s.replaceAll(`{|${i}|}`,(i.endsWith("At")?f(r):r)||""));o.prop("outerHTML",s)}async function D(e,t){let s=await(await fetch(`https://${e}/api/achievement/${t}`)).json();Object.keys(s).length>0&&s.id&&(document.title=`Achievement ${s.name?.length?s.name:s.id} | ${document.title}`,s.achievementName=s.name,d(s),d(s,"#gas-guide-form"))}async function k(e,t){let o=await fetch(`https://${e}/api/guide/${t}`);return guideFetchedData=await o.json(),Object.keys(guideFetchedData).length>0&&guideFetchedData.id&&(document.title=`${guideFetchedData.name?.length?guideFetchedData.name:guideFetchedData.id} | ${document.title}`,d(guideFetchedData),d(guideFetchedData,"#gas-guide-form")),guideFetchedData}var M=(e,t)=>t?(isUserInputActive=!0,!0):!1,P=e=>{if((e.hasClass("gas-form-tinymce")?tinyMCE.get(e.attr("id")).getContent():e.val())?.length)return e.prev("label").removeClass("field-label-missing");e.prev("label").addClass("field-label-missing")};function p(e,t="#gas-guide-form"){let o=!1,s=!1;e?.length&&P(e);for(let n of $("input[name][required]",t))if(o=M($(n),$(n).val()?.length),!o)break;for(let n of $(".gas-form-tinymce",t))if(s=M($(n),tinyMCE.get($(n).attr("id")).getContent()?.length),!s)break;o&&s?$(`${t}-btn-submit`).removeClass("disabled-button").attr("disabled",!1):$(`${t}-btn-submit`).addClass("disabled-button").attr("disabled",!0)}var v=document.querySelector("meta[name=domain]")?.content,H=new URLSearchParams(window.location.search),g=Number(H.get("id"))||0,y=g>0,h=Number(H.get("achievementId"))||0,c,O="#gas-guide",a=`${O}-form`,b=4e3,I=4,m=2,R=$(".gas-form-section",a).last().clone(),x="section-2";$(".ga-loader-container").show();$("#ga-sections-container").hide();var S,C={selector:".gas-form-tinymce",height:200,menubar:!1,toolbar_mode:"floating",plugins:"link image lists",toolbar:"undo redo | bold italic underline | numlist bullist",content_style:"body { font-family:Gantari,sans-serif; font-size:1rem }",setup:e=>{e.on("Paste Change input Undo Redo",t=>{clearTimeout(S),S=setTimeout(()=>p($(e.targetElm)),100)})}};function N(){if(confirm("Do you want to remove this section?")){p();let e=$(this).parents(".gas-form-section");tinyMCE.get($(".gas-form-tinymce",e).attr("id")).remove(),e.remove(),m--,$(".gas-form-section label[for$=-title]",a).each((t,o)=>$(o).text(`${t+1}${$(o).text().slice(1)}`)),m<=I&&$(".gas-form-section-add",a).show()}}async function L(){m++,$(`${a}-btn-submit`).addClass("disabled-button").attr("disabled",!0);let e=R.clone().show(),t=`section-${m}`;$(`label[for=${x}-title]`,e).text(`${m} \u203A section name*`).attr("for",`${t}-title`),$(`[name=${x}-title]`,e).attr("name",`${t}-title`).on("focusout keyup",function(){p($(this))}),$(`label[for=${x}-content]`,e).attr("for",`${t}-content`);let o=`${t}-content`;$(".gas-form-tinymce",e).attr("id",o).attr("name",o).attr("data-name",o),$(".gas-form-section-del",e).on("click",N),$(".gas-form-sections",a).append(e),C.selector=`#${o}`,await tinymce.init(C),m>I&&$(".gas-form-section-add",a).hide()}async function V(){$(".gas-form-tinymce",R).removeAttr("id"),await tinymce.init(C),y&&c?.id===g&&($("[name=guide-title]",a).val(c.name),$("[name=guide-description]",a).val(c.description),c.sections.forEach(async(l,i)=>{i>1&&i<c.sections.length&&await L(),$(`[name=section-${i+1}-title]`).val(l.title),tinyMCE.get(`section-${i+1}-content`).setContent(l.content)})),$(".gas-form-section-add",a).on("click",L),$(".gas-form-section-del",a).on("click",N),$(`${a}-btn-cancel`,a).on("click",l=>{l.preventDefault();let i=$("#gas-popup-leave-confirmation");i.css({opacity:1,display:"flex"}),$(".gas-popup-btn-close",i).one("click",r=>{r.preventDefault(),i.hide()}),$(".gas-popup-btn-leave",i).one("click",r=>{r.preventDefault(),isUserInputActive=!1,i.hide(),u()})}),$(`${a}-btn-submit`).attr("disabled",!0);let e=$(`${a}-btn-submit`).val(),t=$(".gas-form-error",a),o=$("div",t),s=t.text(),n=$(".gas-form-success",a);$("input[name][required]",a).on("focusout keyup",function(){p($(this))}),$(`${a}-btn-submit`).on("click",async l=>{l.preventDefault(),$(`${a}-btn-submit`).addClass("disabled-button").attr("disabled",!0),isUserInputActive=!1,$(`${a}-btn-submit`).val($(`${a}-btn-submit`).data("wait"));let i=[];$(".gas-form-section",a).each(function(){i.push({title:$("input[name$=-title]",this).val(),content:tinyMCE.get($(".gas-form-tinymce",this).attr("id")).getContent()})});let r={author:"GA user",title:$("[name=guide-title]",a).val(),description:$("[name=guide-description]",a).val(),sections:i},T="POST",F=`https://${v}/api/guide`;if(y)F+=`/${g}`,T="PUT",r.author=c.author,r.profileId=c.profileId;else{if(!userProfileData){t.show(),o.text("Issue on accessing your data for saving. Please try again later."),$(`${a}-btn-submit`).val(e),setTimeout(()=>{t.hide(),o.text(s)},b);return}r.profileId=userProfileData.id,r.author=userProfileData.name,r.achievementId=h}let A=await fetch(F,{method:T,headers:{Authorization:`Bearer ${token}`,Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify(r)}),U=await A.json();if(![200,201].includes(A.status)){t.show(),o.text(U?.message),$(`${a}-btn-submit`).val(e).removeClass("disabled-button").attr("disabled",!1),setTimeout(()=>{t.hide(),o.text(s)},b);return}n.show(),$(`${a}-btn-submit`).val(e),setTimeout(()=>{$(`${a}-fields`).hide()},b/5),setTimeout(()=>{isUserInputActive=!1,n.hide(),u()},b)})}function u(){window.location.replace(y?`/guide?id=${g}`:h>0?`/achievement?id=${h}`:"/guides")}$(async()=>{if(await auth0Bootstrap(),!token){console.log("User not authenticated"),u();return}if(y){if(c=await k(v,g),c?.achievementId>0){let e=await fetch(`https://${v}/api/achievement/${c.achievementId}/guide-auth-user-data`,{headers:{Authorization:`Bearer ${token}`}});if(e.status!==200){console.log("User not found/issue, cannot access to guide edition"),u();return}if(!(await e.json()).ownedGuideId){console.log("This form does not belong to the creator"),u();return}}}else if(h>0)await D(v,h);else{console.log("no valid parameter provided"),u();return}await V(),$(".ga-loader-container").hide(),$("#ga-sections-container").show()});})();
