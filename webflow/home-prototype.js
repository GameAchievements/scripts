const apiDomain = document.querySelector("meta[name=domain]")?.content;
$(".ga-list").show();

function showLogos(platformName, dataTemplateActual) {
  const platformVerifier = {
    ps: { rgx: /playstation/gi },
    xbox: { rgx: /xbox/gi },
    steam: { rgx: /steam|pc|windows|mac|linux/gi },
  };
  if (platformVerifier.ps.rgx.test(platformName)) {
    dataTemplateActual = $(`.ga-logo-playstation`, dataTemplateActual)
      .css("display", "inherit")
      .parents(".ga-list-entry")
      .prop("outerHTML");
  }
  if (platformVerifier.steam.rgx.test(platformName)) {
    dataTemplateActual = $(`.ga-logo-steam`, dataTemplateActual)
      .css("display", "inherit")
      .parents(".ga-list-entry")
      .prop("outerHTML");
  }
  if (platformVerifier.xbox.rgx.test(platformName)) {
    dataTemplateActual = $(`.ga-logo-xbox`, dataTemplateActual)
      .css("display", "inherit")
      .parents(".ga-list-entry")
      .prop("outerHTML");
  }
  return dataTemplateActual;
}
function gamesResponseHandler(res, elemId, limit = 0) {
  const $list = $(`${elemId} .ga-list`);
  const dataTemplate = $list.children().eq(0).prop("outerHTML");
  $list.children().eq(0).hide();
  console.info(`=================== ${elemId} games ===================`, res);
  const keysToReplace = ["id", "name", "players", "createdAt", "updatedAt"];
  const images = {};
  let itemsArray = limit ? res.slice(0, limit) : res;
  itemsArray.forEach((item) => {
    let dataTemplateActual = dataTemplate;
    Object.entries(item).forEach(([key, value]) => {
      dataTemplateActual = $(`.ga-list-entry-cover`, dataTemplateActual)
        .attr("src", item.imageURL)
        .parents(".ga-list-entry")
        .data("id", item.id)
        .prop("outerHTML");
      if (keysToReplace.includes(key)) {
        dataTemplateActual = dataTemplateActual.replaceAll(
          `{|${key}|}`,
          (key.endsWith("At") ? new Date(value).toLocaleString() : value) || ""
        );
      }
      if (key === "gPEs" && Array.isArray(value) && value.length) {
        dataTemplateActual = showLogos(
          value[0]?.platform?.name,
          dataTemplateActual
        );
      }
    });
    images[item.id] = item.imageURL;
    $list.append(dataTemplateActual);
  });
}
async function fetchGames(type) {
  const resGames = await fetch(`https://${apiDomain}/api/game/list/${type}`);
  const gamesData = await resGames.json();
  const elemId = "#ga-list-" + type;
  if (Array.isArray(gamesData) || gamesData.length > 0) {
    gamesResponseHandler(gamesData, elemId, 5);
  }
  setTimeout(() => {
    $(`${elemId} .ga-list-header`).show();
    if (!Array.isArray(gamesData) || !gamesData.length) {
      $(`${elemId} .ga-list-empty`).show();
      return;
    }
    $(`${elemId} .ga-list-results-info`).text(gamesData.length + " result(s)");
    $(`${elemId} .ga-list-results-info,${elemId} .ga-list`).show();
  }, 300);
}
window.onload = async () => {
  await auth0Bootstrap();
  await Promise.all(
    ["recent", "top"].map(async (type) => await fetchGames(type))
  );
  setTimeout(() => {
    $(".ga-loader").hide();
  }, 600);
};
