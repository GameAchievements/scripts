(()=>{var s=!1;$(window).on("beforeunload",e=>s?(e.preventDefault(),e.returnValue=""):e.returnValue=void 0);$(".gas-form").on("input",e=>{s=!1;for(let t of $("input:not([type=submit]),textarea",".gas-form"))if($(t).val().length){s=!0;break}});})();