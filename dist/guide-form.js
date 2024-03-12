(() => {
  // utils/dateTIme.js
  var gaDate = (isoDate) => {
    const pad = (v) => `0${v}`.slice(-2);
    const dateObj = new Date(isoDate);
    return `${dateObj.getFullYear()} . ${pad(dateObj.getMonth() + 1)} . ${pad(
      dateObj.getDate()
    )}`;
  };

  // utils/achievementNameSlicer.js
  var achievementNameSlicer = (name) => {
    if (!name) {
      return "N.A.";
    }
    const metaDivider = name.lastIndexOf(" | ");
    return metaDivider > 0 ? name.slice(0, metaDivider) : name;
  };

  // wrappers/GuideFormPage/utils/detailsResponseHandler.js
  function detailsResponseHandler(res, elemId2 = `#gas-guide-details`) {
    const $ghContainer = $(elemId2);
    let dataTemplateActual = $ghContainer.prop("outerHTML");
    console.info(`=== ${elemId2} ===`, res);
    const textKeysToReplace = [
      "id",
      "name",
      "achievementId",
      "achievementName",
      "gameId",
      "gameName"
    ];
    const guideImg = res.coverURL || res.imageURL;
    if (guideImg?.length && elemId2.endsWith("details")) {
      dataTemplateActual = $ghContainer.css(
        "background-image",
        `linear-gradient(rgba(255,255,255,0),#030922),
          linear-gradient(rgba(70,89,255,.4),rgba(70,89,255,.4)),
          url(${guideImg})`
      ).prop("outerHTML");
    }
    Object.entries(res).forEach(([key, value]) => {
      if (key === "achievementName") {
        dataTemplateActual = dataTemplateActual.replaceAll(
          `{|${key}|}`,
          achievementNameSlicer(value)
        );
      } else if (textKeysToReplace.includes(key)) {
        dataTemplateActual = dataTemplateActual.replaceAll(
          `{|${key}|}`,
          (key.endsWith("At") ? gaDate(value) : value) || ""
        );
      }
    });
    $ghContainer.prop("outerHTML", dataTemplateActual);
  }

  // wrappers/GuideFormPage/AchievementSection.js
  async function fetchAchievement(apiDomain2, achievementId2) {
    const resFetch = await fetch(
      `https://${apiDomain2}/api/achievement/${achievementId2}`
    );
    const achievementFetchedData = await resFetch.json();
    if (Object.keys(achievementFetchedData).length > 0 && achievementFetchedData.id) {
      document.title = `Achievement ${achievementFetchedData.name?.length ? achievementFetchedData.name : achievementFetchedData.id} | ${document.title}`;
      achievementFetchedData.achievementName = achievementFetchedData.name;
      detailsResponseHandler(achievementFetchedData);
      detailsResponseHandler(achievementFetchedData, `#gas-guide-form`);
    }
  }

  // wrappers/GuideFormPage/GuideData.js
  async function fetchGuide(apiDomain2, guideId2) {
    const resFetch = await fetch(`https://${apiDomain2}/api/guide/${guideId2}`);
    guideFetchedData = await resFetch.json();
    if (Object.keys(guideFetchedData).length > 0 && guideFetchedData.id) {
      document.title = `${guideFetchedData.name?.length ? guideFetchedData.name : guideFetchedData.id} | ${document.title}`;
      detailsResponseHandler(guideFetchedData);
      detailsResponseHandler(guideFetchedData, `#gas-guide-form`);
    }
    return guideFetchedData;
  }

  // wrappers/GuideFormPage/utils/canSubmit.js
  var isRequiredFilled = ($el, hasLen) => {
    if (hasLen) {
      isUserInputActive = true;
      return true;
    }
    return false;
  };
  var highlightRequiredLabel = ($el) => {
    if (($el.hasClass("gas-form-tinymce") ? tinyMCE.get($el.attr("id")).getContent() : $el.val())?.length) {
      return $el.prev("label").removeClass("field-label-missing");
    }
    $el.prev("label").addClass("field-label-missing");
  };
  function canSubmit($elChanged, elemId2 = `#gas-guide-form`) {
    let allInputsFilled = false;
    let allTextareasFilled = false;
    if ($elChanged?.length) {
      highlightRequiredLabel($elChanged);
    }
    for (const inp of $("input[name][required]", elemId2)) {
      allInputsFilled = isRequiredFilled($(inp), $(inp).val()?.length);
      if (!allInputsFilled) {
        break;
      }
    }
    for (const txt of $(".gas-form-tinymce", elemId2)) {
      allTextareasFilled = isRequiredFilled(
        $(txt),
        tinyMCE.get($(txt).attr("id")).getContent()?.length
      );
      if (!allTextareasFilled) {
        break;
      }
    }
    if (allInputsFilled && allTextareasFilled) {
      $(`${elemId2}-btn-submit`).removeClass("disabled-button").attr("disabled", false);
    } else {
      $(`${elemId2}-btn-submit`).addClass("disabled-button").attr("disabled", true);
    }
  }

  // webflow/guide-form.js
  var apiDomain = document.querySelector("meta[name=domain]")?.content;
  var urlParams = new URLSearchParams(window.location.search);
  var guideId = Number(urlParams.get("id")) || 0;
  var isEditing = guideId > 0;
  var achievementId = Number(urlParams.get("achievementId")) || 0;
  var guideFetchedData2;
  var elemIdPrefix = `#gas-guide`;
  var elemId = `${elemIdPrefix}-form`;
  var formMessageDelay2 = 4e3;
  var sectionsLimit = 4;
  var sectionsCount = 2;
  var $sectionTemp = $(".gas-form-section", elemId).last().clone();
  var templatePrefix = "section-2";
  $(".ga-loader-container").show();
  $("#ga-sections-container").hide();
  var editorChangeHandlerId;
  var tmceObj = {
    selector: ".gas-form-tinymce",
    height: 200,
    menubar: false,
    toolbar_mode: "floating",
    plugins: "link image lists",
    toolbar: "undo redo | bold italic underline | numlist bullist",
    content_style: "body { font-family:Gantari,sans-serif; font-size:1rem }",
    setup: (editor) => {
      editor.on("Paste Change input Undo Redo", (evt) => {
        clearTimeout(editorChangeHandlerId);
        editorChangeHandlerId = setTimeout(
          () => canSubmit($(editor.targetElm)),
          100
        );
      });
    }
  };
  function delSection() {
    if (confirm("Do you want to remove this section?")) {
      canSubmit();
      const $sec = $(this).parents(".gas-form-section");
      tinyMCE.get($(".gas-form-tinymce", $sec).attr("id")).remove();
      $sec.remove();
      sectionsCount--;
      $(`.gas-form-section label[for$=-title]`, elemId).each(
        (secIdx, el) => $(el).text(`${secIdx + 1}${$(el).text().slice(1)}`)
      );
      if (sectionsCount <= sectionsLimit) {
        $(".gas-form-section-add", elemId).show();
      }
    }
  }
  async function addSection() {
    sectionsCount++;
    $(`${elemId}-btn-submit`).addClass("disabled-button").attr("disabled", true);
    const $newSection = $sectionTemp.clone().show();
    const curSecId = `section-${sectionsCount}`;
    $(`label[for=${templatePrefix}-title]`, $newSection).text(`${sectionsCount} \u203A section name*`).attr("for", `${curSecId}-title`);
    $(`[name=${templatePrefix}-title]`, $newSection).attr("name", `${curSecId}-title`).on("focusout keyup", function() {
      canSubmit($(this));
    });
    $(`label[for=${templatePrefix}-content]`, $newSection).attr(
      "for",
      `${curSecId}-content`
    );
    const tinyId = `${curSecId}-content`;
    $(".gas-form-tinymce", $newSection).attr("id", tinyId).attr("name", tinyId).attr("data-name", tinyId);
    $(".gas-form-section-del", $newSection).on("click", delSection);
    $(".gas-form-sections", elemId).append($newSection);
    tmceObj.selector = `#${tinyId}`;
    await tinymce.init(tmceObj);
    if (sectionsCount > sectionsLimit) {
      $(".gas-form-section-add", elemId).hide();
    }
  }
  async function setupForm() {
    $(".gas-form-tinymce", $sectionTemp).removeAttr("id");
    await tinymce.init(tmceObj);
    if (isEditing && guideFetchedData2?.id === guideId) {
      $("[name=guide-title]", elemId).val(guideFetchedData2.name);
      $("[name=guide-description]", elemId).val(guideFetchedData2.description);
      guideFetchedData2.sections.forEach(async (sec, secIdx) => {
        if (secIdx > 1 && secIdx < guideFetchedData2.sections.length) {
          await addSection();
        }
        $(`[name=section-${secIdx + 1}-title]`).val(sec.title);
        tinyMCE.get(`section-${secIdx + 1}-content`).setContent(sec.content);
      });
    }
    $(".gas-form-section-add", elemId).on("click", addSection);
    $(".gas-form-section-del", elemId).on("click", delSection);
    $(`${elemId}-btn-cancel`, elemId).on("click", (evt) => {
      evt.preventDefault();
      const $popupWrapper = $(`#gas-popup-leave-confirmation`);
      $popupWrapper.css({ opacity: 1, display: "flex" });
      $(`.gas-popup-btn-close`, $popupWrapper).one("click", (evt2) => {
        evt2.preventDefault();
        $popupWrapper.hide();
      });
      $(`.gas-popup-btn-leave`, $popupWrapper).one("click", (evt2) => {
        evt2.preventDefault();
        isUserInputActive = false;
        $popupWrapper.hide();
        redirectAway();
      });
    });
    $(`${elemId}-btn-submit`).attr("disabled", true);
    const submitText = $(`${elemId}-btn-submit`).val();
    const $errEl = $(".gas-form-error", elemId);
    const $errorDiv = $("div", $errEl);
    const txtError = $errEl.text();
    const $successEl = $(".gas-form-success", elemId);
    $(`input[name][required]`, elemId).on("focusout keyup", function() {
      canSubmit($(this));
    });
    $(`${elemId}-btn-submit`).on("click", async (e) => {
      e.preventDefault();
      $(`${elemId}-btn-submit`).addClass("disabled-button").attr("disabled", true);
      isUserInputActive = false;
      $(`${elemId}-btn-submit`).val($(`${elemId}-btn-submit`).data("wait"));
      let sections = [];
      $(".gas-form-section", elemId).each(function() {
        sections.push({
          title: $("input[name$=-title]", this).val(),
          content: tinyMCE.get($(".gas-form-tinymce", this).attr("id")).getContent()
        });
      });
      const reqData = {
        author: "GA user",
        title: $("[name=guide-title]", elemId).val(),
        description: $("[name=guide-description]", elemId).val(),
        sections
      };
      let method = "POST";
      let guideURL = `https://${apiDomain}/api/guide`;
      if (isEditing) {
        guideURL += `/${guideId}`;
        method = "PUT";
        reqData.author = guideFetchedData2.author;
        reqData.profileId = guideFetchedData2.profileId;
      } else {
        if (!userProfileData) {
          $errEl.show();
          $errorDiv.text(
            "Issue on accessing your data for saving. Please try again later."
          );
          $(`${elemId}-btn-submit`).val(submitText);
          setTimeout(() => {
            $errEl.hide();
            $errorDiv.text(txtError);
          }, formMessageDelay2);
          return;
        }
        reqData.profileId = userProfileData.id;
        reqData.author = userProfileData.name;
        reqData.achievementId = achievementId;
      }
      const resFecth = await fetch(guideURL, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(reqData)
      });
      const revData = await resFecth.json();
      if (![200, 201].includes(resFecth.status)) {
        $errEl.show();
        $errorDiv.text(revData?.message);
        $(`${elemId}-btn-submit`).val(submitText).removeClass("disabled-button").attr("disabled", false);
        setTimeout(() => {
          $errEl.hide();
          $errorDiv.text(txtError);
        }, formMessageDelay2);
        return;
      }
      $successEl.show();
      $(`${elemId}-btn-submit`).val(submitText);
      setTimeout(() => {
        $(`${elemId}-fields`).hide();
      }, formMessageDelay2 / 5);
      setTimeout(() => {
        isUserInputActive = false;
        $successEl.hide();
        redirectAway();
      }, formMessageDelay2);
    });
  }
  function redirectAway() {
    window.location.replace(
      isEditing ? `/guide?id=${guideId}` : achievementId > 0 ? `/achievement?id=${achievementId}` : "/guides"
    );
  }
  $(async () => {
    await auth0Bootstrap();
    if (!token) {
      console.log("User not authenticated");
      redirectAway();
      return;
    }
    if (isEditing) {
      guideFetchedData2 = await fetchGuide(apiDomain, guideId);
      if (guideFetchedData2?.achievementId > 0) {
        const resFetch = await fetch(
          `https://${apiDomain}/api/achievement/${guideFetchedData2.achievementId}/guide-auth-user-data`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (resFetch.status !== 200) {
          console.log("User not found/issue, cannot access to guide edition");
          redirectAway();
          return;
        }
        const revData = await resFetch.json();
        if (!revData.ownedGuideId) {
          console.log("This form does not belong to the creator");
          redirectAway();
          return;
        }
      }
    } else if (achievementId > 0) {
      await fetchAchievement(apiDomain, achievementId);
    } else {
      console.log("no valid parameter provided");
      redirectAway();
      return;
    }
    await setupForm();
    $(".ga-loader-container").hide();
    $("#ga-sections-container").show();
  });
})();
