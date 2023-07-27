// <script src="https://cdn.tiny.cloud/1/sj801m9s9ivbndop77c87iww4n5onm4rvgcxo1a63ayhv32s/tinymce/6/tinymce.min.js" referrerpolicy="origin"></script>
const apiDomain = document.querySelector("meta[name=domain]")?.content;
const urlParams = new URLSearchParams(window.location.search);
const guideId = Number(urlParams.get("id")) || 0;
let achievementId = Number(urlParams.get("achievementId")) || 0;
let guideFetchedData;
const elemIdPrefix = `#gas-guide`;
const elemId = `${elemIdPrefix}-form`;

// clone the copyable section into a template (section-2)
const $sectionTemp = $(".gas-form-section", elemId).clone();
const templatePrefix = "section-2";

$(".ga-loader-container").show();
$("#ga-sections-container").hide();

const tmceObj = {
  selector: ".gas-form-tinymce",
  height: 200,
  menubar: false,
  toolbar_mode: "floating",
  plugins: "link image lists",
  toolbar: "undo redo | bold italic underline | numlist bullist",
  content_style: "body { font-family:Gantari,sans-serif; font-size:1rem }",
};

// https://stackoverflow.com/a/14023897/6225838
//  // get the content of the active editor
//  alert(tinyMCE.activeEditor.getContent());
//  // get the content by id of a particular textarea
//  alert(tinyMCE.get('section-1-content').getContent());

const sectionsLimit = 4;
let sectionsCount = 2; // initial

function delSection() {
  if (
    confirm(
      "Press OK to confirm you want to remove this section and its content"
    )
  ) {
    $(this).parents(".gas-form-section").remove();
    sectionsCount--;
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
  $(".gas-form-section-del", $newSection).click(delSection);
  $(".gas-form-sections", elemId).append($newSection);
  tmceObj.selector = `#${tinyId}`;
  await tinymce.init(tmceObj);
  if (sectionsCount > sectionsLimit) {
    $(".gas-form-section-add", elemId).hide();
  }
}

async function setupForm() {
  $(".gas-form-tinymce", $sectionTemp).removeAttr("id");
  // only activate tinyMCE after copying
  await tinymce.init(tmceObj);

  if (guideId > 0 && guideFetchedData?.id === guideId) {
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

  $(".gas-form-section-add", elemId).click(addSection);
  $(".gas-form-section-del", elemId).click(delSection);

  $(".gas-form-cancel", elemId).click(function () {
    $(`${elemIdPrefix}-popup-leave`).show();
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
    Number(guideId) || 0 ? `/guide?id=${guideId}` : "/guides"
  );
}

$().ready(async () => {
  await auth0Bootstrap();
  if (userAuth0Data?.sub?.length) {
    token = await auth0Client.getTokenSilently();
  } else {
    console.log("User not authenticated");
    redirectAway();
    return;
  }
  if (guideId > 0) {
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
