// <script src="https://cdn.tiny.cloud/1/sj801m9s9ivbndop77c87iww4n5onm4rvgcxo1a63ayhv32s/tinymce/6/tinymce.min.js" referrerpolicy="origin"></script>
const apiDomain = document.querySelector("meta[name=domain]")?.content;
const urlParams = new URLSearchParams(window.location.search);
const guideId = Number(urlParams.get("id")) || 0;
const isEditing = guideId > 0;
let achievementId = Number(urlParams.get("achievementId")) || 0;
let guideFetchedData;
const elemIdPrefix = `#gas-guide`;
const elemId = `${elemIdPrefix}-form`;
const formMessageDelay = 4000;
const sectionsLimit = 4;
let sectionsCount = 2; // initial

// clone the copyable section into a template (section-2)
const $sectionTemp = $(".gas-form-section", elemId).last().clone();
const templatePrefix = "section-2";

$(".ga-loader-container").show();
$("#ga-sections-container").hide();

const highlightRequiredLabel = ($el, hasLen) => {
  if (hasLen) {
    isUserInputActive = true;
    $el.prev("label").removeClass("field-label-missing");
    return true;
  }
  $el.prev("label").addClass("field-label-missing");
  return false;
};

// cycle all fields and verify if they all have content
const canSubmit = () => {
  let allInputsFilled = false;
  let allTextareasFilled = false;
  for (const inp of $("input[name][required]", elemId)) {
    allInputsFilled = highlightRequiredLabel($(inp), $(inp).val()?.length);
    if (!allInputsFilled) {
      break;
    }
  }
  for (const txt of $(".gas-form-tinymce", elemId)) {
    allTextareasFilled = highlightRequiredLabel(
      $(txt),
      tinyMCE.get($(txt).attr("id")).getContent()?.length
    );
    if (!allTextareasFilled) {
      break;
    }
  }
  if (allInputsFilled && allTextareasFilled) {
    $(`${elemId}-btn-submit`)
      .removeClass("disabled-button")
      .attr("disabled", false);
  } else {
    $(`${elemId}-btn-submit`)
      .addClass("disabled-button")
      .attr("disabled", true);
  }
};

let editorChangeHandlerId;
const tmceObj = {
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
      editorChangeHandlerId = setTimeout(canSubmit, 100);
    });
  },
};

function delSection() {
  if (confirm("Do you want to remove this section?")) {
    const $sec = $(this).parents(".gas-form-section");
    tinyMCE.get($(".gas-form-tinymce", $sec).attr("id")).remove();
    $sec.remove();
    sectionsCount--;
    $(`.gas-form-section label[for$=-title]`, elemId).each((secIdx, el) =>
      $(el).text(`${secIdx + 1}${$(el).text().slice(1)}`)
    );
    if (sectionsCount <= sectionsLimit) {
      $(".gas-form-section-add", elemId).show();
    }
  }
}

async function addSection() {
  sectionsCount++;
  const $newSection = $sectionTemp.clone().show();
  const curSecId = `section-${sectionsCount}`;
  $(`label[for=${templatePrefix}-title]`, $newSection)
    .text(`${sectionsCount} › section name*`)
    .attr("for", `${curSecId}-title`);
  $(`[name=${templatePrefix}-title]`, $newSection).attr(
    "name",
    `${curSecId}-title`
  );
  $(`label[for=${templatePrefix}-content]`, $newSection).attr(
    "for",
    `${curSecId}-content`
  );

  const tinyId = `${curSecId}-content`;
  $(".gas-form-tinymce", $newSection)
    .attr("id", tinyId)
    .attr("name", tinyId)
    .attr("data-name", tinyId);
  $(".gas-form-section-del", $newSection).on("click", delSection);
  $(".gas-form-sections", elemId).append($newSection);
  tmceObj.selector = `#${tinyId}`;
  await tinymce.init(tmceObj);
  if (sectionsCount > sectionsLimit) {
    $(".gas-form-section-add", elemId).hide();
  }
  canSubmit();
}

async function setupForm() {
  $(".gas-form-tinymce", $sectionTemp).removeAttr("id");
  // only activate tinyMCE after copying
  await tinymce.init(tmceObj);

  if (isEditing && guideFetchedData?.id === guideId) {
    $("[name=guide-title]", elemId).val(guideFetchedData.name);
    $("[name=guide-description]", elemId).val(guideFetchedData.description);
    guideFetchedData.sections.forEach(async (sec, secIdx) => {
      if (secIdx > 1 && secIdx < guideFetchedData.sections.length) {
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
    $popupWrapper.show().css("opacity", 1);
    $(`.gas-popup-btn-close`).one("click", (evt) => {
      evt.preventDefault();
      $popupWrapper.hide();
    });
    $(`.gas-popup-btn-leave`).one("click", (evt) => {
      evt.preventDefault();
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
  $(`input[name][required]`, elemId).on("focusout keyup", canSubmit);

  $(`${elemId}-btn-submit`).on("click", async (e) => {
    e.preventDefault();
    $(`${elemId}-btn-submit`)
      .addClass("disabled-button")
      .attr("disabled", true);
    // disable show popup on leave page (site-settings)
    isUserInputActive = false;
    $(`${elemId}-btn-submit`).val($(`${elemId}-btn-submit`).data("wait"));
    let sections = [];
    $(".gas-form-section", elemId).each(function () {
      sections.push({
        title: $("input[name$=-title]", this).val(),
        content: tinyMCE
          .get($(".gas-form-tinymce", this).attr("id"))
          .getContent(),
      });
    });
    const reqData = {
      author: "GA user",
      title: $("[name=guide-title]", elemId).val(),
      description: $("[name=guide-description]", elemId).val(),
      sections,
    };
    let method = "POST";
    let guideURL = `https://${apiDomain}/api/guide`;
    if (isEditing) {
      guideURL += `/${guideId}`;
      method = "PUT";
      reqData.author = guideFetchedData.author;
      reqData.profileId = guideFetchedData.profileId;
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
        }, formMessageDelay);
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
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reqData),
    });
    const revData = await resFecth.json();
    if (![200, 201].includes(resFecth.status)) {
      $errEl.show();
      $errorDiv.text(revData?.message);
      $(`${elemId}-btn-submit`)
        .val(submitText)
        .removeClass("disabled-button")
        .attr("disabled", false);
      setTimeout(() => {
        $errEl.hide();
        $errorDiv.text(txtError);
      }, formMessageDelay);
      return;
    }
    $successEl.show();
    $(`${elemId}-btn-submit`).val(submitText);
    setTimeout(() => {
      $successEl.hide();
      redirectAway();
    }, formMessageDelay);
  });
}

function detailsResponseHandler(res, elemId = `${elemIdPrefix}-details`) {
  const $ghContainer = $(elemId);
  let dataTemplateActual = $ghContainer.prop("outerHTML");
  console.info(`=== ${elemId} ===`, res);
  const textKeysToReplace = [
    "id",
    "name",
    "achievementId",
    "achievementName",
    "gameId",
    "gameName",
  ];
  const guideImg = res.coverURL || res.imageURL;
  if (guideImg?.length && elemId.endsWith("details")) {
    dataTemplateActual = $ghContainer
      .css(
        "background-image",
        `linear-gradient(rgba(255,255,255,0),#030922),
          linear-gradient(rgba(70,89,255,.4),rgba(70,89,255,.4)),
          url(${guideImg})`
      )
      .prop("outerHTML");
  }
  Object.entries(res).forEach(([key, value]) => {
    if (key === "achievementName") {
      dataTemplateActual = dataTemplateActual.replaceAll(
        `{|${key}|}`,
        value.slice(0, value.indexOf(" | "))
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

async function fetchGuide() {
  const resFetch = await fetch(`https://${apiDomain}/api/guide/${guideId}`);
  guideFetchedData = await resFetch.json();
  if (Object.keys(guideFetchedData).length > 0 && guideFetchedData.id) {
    document.title = `${
      guideFetchedData.name?.length
        ? guideFetchedData.name
        : guideFetchedData.id
    } | ${document.title}`;
    detailsResponseHandler(guideFetchedData);
    detailsResponseHandler(guideFetchedData, `${elemIdPrefix}-form`);
  }
}

async function fetchAchievement() {
  const resFetch = await fetch(
    `https://${apiDomain}/api/achievement/${achievementId}`
  );
  const achievementFetchedData = await resFetch.json();
  if (
    Object.keys(achievementFetchedData).length > 0 &&
    achievementFetchedData.id
  ) {
    document.title = `Achievement ${
      achievementFetchedData.name?.length
        ? achievementFetchedData.name
        : achievementFetchedData.id
    } | ${document.title}`;
    achievementFetchedData.achievementName = achievementFetchedData.name;
    detailsResponseHandler(achievementFetchedData);
    detailsResponseHandler(achievementFetchedData, `${elemIdPrefix}-form`);
  }
}

function redirectAway() {
  window.location.replace(
    isEditing
      ? `/guide?id=${guideId}`
      : achievementId > 0
      ? `/achievement?id=${achievementId}`
      : "/guides"
  );
}

$().ready(async () => {
  await auth0Bootstrap();
  if (!token) {
    console.log("User not authenticated");
    redirectAway();
    return;
  }
  if (isEditing) {
    await fetchGuide();
    if (guideFetchedData?.achievementId > 0) {
      const resFetch = await fetch(
        `https://${apiDomain}/api/achievement/${guideFetchedData.achievementId}/guide-auth-user-data`,
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
    await fetchAchievement();
  } else {
    console.log("no valid parameter provided");
    redirectAway();
    return;
  }
  await setupForm();
  $(".ga-loader-container").hide();
  $("#ga-sections-container").show();
});
