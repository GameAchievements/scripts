const apiDomain = document.querySelector("meta[name=domain]")?.content;

let guidesCount = 0;

function guidesResponseHandler(res, elemId) {
  const $list = $(`${elemId} .gas-list`);
  const $listHeader = $list.children().first();
  const $entryTemplate = $(".gas-list-entry", $list).first();
  $entryTemplate.show();
  const dataTemplate = $entryTemplate.prop("outerHTML");
  $list.html($listHeader).append($entryTemplate);
  $entryTemplate.hide();
  console.info(`=== ${elemId} results ===`, res);
  const numKeysToReplace = ["likes", "comments"];
  const keysToReplace = [
    "id",
    "name",
    "author",
    "description",
    "achievementId",
    "achievementName",
    "profileId",
  ];
  res.forEach((item, resIdx) => {
    let dataTemplateActual = dataTemplate;
    Object.entries(item).forEach(([key, value]) => {
      let $entryImg = $(`.gas-list-entry-cover-game`, dataTemplateActual);
      if ($entryImg && item.gameIconURL?.length) {
        dataTemplateActual = $entryImg
          .removeAttr("srcset")
          .removeAttr("sizes")
          .attr("src", item.gameIconURL)
          .parents(".gas-list-entry")
          .prop("outerHTML");
      }
      $entryImg = $(`.gas-list-entry-cover`, dataTemplateActual);
      if ($entryImg && item.iconURL?.length) {
        dataTemplateActual = $entryImg
          .removeAttr("srcset")
          .removeAttr("sizes")
          .attr("src", item.iconURL)
          .parents(".gas-list-entry")
          .prop("outerHTML");
      }
      if (keysToReplace.includes(key)) {
        dataTemplateActual = dataTemplateActual.replaceAll(`{|${key}|}`, value);
      } else if (numKeysToReplace.includes(key)) {
        dataTemplateActual = dataTemplateActual.replaceAll(
          `{|${key}|}`,
          Math.round(value || 0)
        );
      } else if (key === "platform") {
        dataTemplateActual = showPlatform(value, dataTemplateActual);
      }
    });
    $list
      .append(dataTemplateActual)
      .children()
      .last()
      .removeClass(["bg-light", "bg-dark"])
      .addClass(`bg-${resIdx % 2 > 0 ? "light" : "dark"}`);
  });
}
async function fetchGuides() {
  const elemId = "#gas-list-guides";
  const resGuides = await fetch(`https://${apiDomain}/api/guide/list`);
  const guidesData = await resGuides.json();
  if (guidesData?.results.length > 0) {
    guidesCount = guidesData.count;
    guidesResponseHandler(guidesData.results, elemId);
  }
  setTimeout(() => {
    $(`${elemId} .ga-loader-container`).hide();
    if (!guidesCount) {
      $(`${elemId} .gas-list-empty`).show();
      return;
    }
    $(`${elemId} .gas-list-results-info`).text(guidesCount + " result(s)");
    $(`${elemId} .gas-list-results-info,${elemId} .gas-list`).show();
  }, 600);
}
window.onload = async () => {
  await auth0Bootstrap();
  await fetchGuides();
};
