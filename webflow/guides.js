const apiDomain = document.querySelector("meta[name=domain]")?.content;

function listResponseHandler({
  listData,
  elemId,
  numKeysToReplace,
  textKeysToReplace,
}) {
  // console.info(`=== ${elemId} results ===`, listData);
  let dataTemplate = $(elemId).prop("outerHTML");
  const $list = $(`${elemId} .gas-list`);
  const $emptyList = $(`${elemId} .gas-list-empty`);
  if (listData?.length) {
    const $entryTemplate = $(".gas-list-entry", $list).first();
    $entryTemplate.show();
    dataTemplate = $entryTemplate.prop("outerHTML");
    $entryTemplate.hide();
    $list.html($entryTemplate);
    listData.forEach((item, resIdx) => {
      let dataTemplateActual = dataTemplate;
      dataTemplateActual = dataTemplateActual.replaceAll(`{|idx|}`, resIdx + 1);
      Object.entries(item).forEach(([key, value]) => {
        let $entryImg = $(`.gas-list-entry-cover-game`, dataTemplateActual);
        if ($entryImg.length && item.gameIconURL?.length) {
          const imgCaption = `For achievement: ${achievementNameSlicer(
            item.achievementName
          )}`;
          dataTemplateActual = $entryImg
            .removeAttr("srcset")
            .removeAttr("sizes")
            .attr("src", item.gameIconURL)
            .attr("alt", imgCaption)
            .attr("title", imgCaption)
            .parents(".gas-list-entry")
            .prop("outerHTML");
        }
        $entryImg = $(`.gas-list-entry-cover`, dataTemplateActual);
        if ($entryImg.length && item.iconURL?.length) {
          dataTemplateActual = $entryImg
            .removeAttr("srcset")
            .removeAttr("sizes")
            .attr("src", item.iconURL)
            .parents(".gas-list-entry")
            .prop("outerHTML");
        }
        if (textKeysToReplace.includes(key)) {
          dataTemplateActual = dataTemplateActual.replaceAll(
            `{|${key}|}`,
            (key.endsWith("At") ? gaDate(value) : value) || ""
          );
        } else if (numKeysToReplace.includes(key)) {
          dataTemplateActual = dataTemplateActual.replaceAll(
            `{|${key}|}`,
            Math.round(value || 0)
          );
        } else if (key === "platform") {
          dataTemplateActual = showPlatform(value, dataTemplateActual);
        }
      });
      $list.append(dataTemplateActual);
    });
  } else {
    $(elemId).html($emptyList);
    $emptyList.show();
  }
  $list.css("display", "flex");
}

async function fetchGuides() {
  const elemId = "#gas-list-guides";
  const resGuides = await fetch(`https://${apiDomain}/api/guide/list`);
  const fetchData = await resGuides.json();
  $(`${elemId} .gas-list-results-info`).text(
    (fetchData?.count || 0) + " result(s)"
  );
  listResponseHandler({
    listData: fetchData.results,
    elemId,
    numKeysToReplace: ["likes", "comments"],
    textKeysToReplace: [
      "id",
      "name",
      "author",
      "description",
      "achievementId",
      "achievementName",
      "profileId",
    ],
  });
}
window.onload = async () => {
  await auth0Bootstrap();
  await fetchGuides();
  $(".ga-loader-container").hide();
};
