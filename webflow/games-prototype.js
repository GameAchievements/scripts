const apiDomain = document.querySelector("meta[name=domain]")?.content;
function showLogos(platformsArray, dataTemplateActual) {
  const platformVerifier = {
    ps: { status: false, rgx: /playstation/gi },
    xbox: { status: false, rgx: /xbox/gi },
    steam: { status: false, rgx: /pc|windows|mac|linux/gi },
  };
  platformsArray.forEach((platform) => {
    if (
      !platformVerifier.ps.status &&
      platformVerifier.ps.rgx.test(platform.name)
    ) {
      dataTemplateActual = $(`.ga-logo-playstation`, dataTemplateActual)
        .css("display", "inherit")
        .parents(".ga-list-entry")
        .prop("outerHTML");
      platformVerifier.ps.status = true;
    }
    if (
      !platformVerifier.steam.status &&
      platformVerifier.steam.rgx.test(platform.name)
    ) {
      dataTemplateActual = $(`.ga-logo-steam`, dataTemplateActual)
        .css("display", "inherit")
        .parents(".ga-list-entry")
        .prop("outerHTML");
      platformVerifier.steam.status = true;
    }
    if (
      !platformVerifier.xbox.status &&
      platformVerifier.xbox.rgx.test(platform.name)
    ) {
      dataTemplateActual = $(`.ga-logo-xbox`, dataTemplateActual)
        .css("display", "inherit")
        .parents(".ga-list-entry")
        .prop("outerHTML");
      platformVerifier.xbox.status = true;
    }
  });
  return dataTemplateActual;
}
function shortTag(tag) {
  const tagParts = tag.match(/([\w\s]+)\(([\w\s]+)\)/);
  let tagText = tag;
  let tagTitle;
  if (tagParts?.length > 1) {
    tagTitle = tagParts[1];
    tagText = tagParts[2];
  }
  return `<div class="ga-tags-entry"${
    tagTitle ? ` title="${tagTitle}"` : ""
  }>${tagText}</div>`;
}

let gamesCount = 0;
let filterTxt = "All";

function gamesResponseHandler(res) {
  const dataTemplate = $(".ga-list").children().eq(0).prop("outerHTML");
  $(".ga-list").children().eq(0).hide();
  console.info("=================== games found ===================", res);
  const keysToReplace = ["id", "name", "description", "updatedAt"];
  const keysWithArrays = [
    "genres",
    "modes",
    "importedFromPlatforms",
    "platforms",
  ];
  if (Array.isArray(res)) {
    gamesCount = res.length;
    if (!gamesCount) {
      return;
    }
    const images = {};
    res.forEach((item) => {
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
            (key.endsWith("At") ? new Date(value).toLocaleString() : value) ||
              ""
          );
        }
        if (keysWithArrays.includes(key)) {
          if (key === "importedFromPlatforms") {
            value.forEach((platName) => {
              dataTemplateActual = $(
                `.ga-logo-${platName.toLowerCase()}`,
                dataTemplateActual
              )
                .css("display", "inherit")
                .parents(".ga-list-entry")
                .prop("outerHTML");
            });
          } else if (key === "platforms") {
            dataTemplateActual = showLogos(value, dataTemplateActual);
          } else {
            dataTemplateActual = $(`.ga-tags-${key}`, dataTemplateActual)
              .html(value.map((tag) => shortTag(tag)).join(""))
              .parents(".ga-list-entry")
              .prop("outerHTML");
          }
        }
      });
      images[item.id] = item.imageURL;
      $(".ga-list").append(dataTemplateActual);
    });
  }
}
async function fetchUpdateGames() {
  const resGames = await fetch(
    `https://${apiDomain}/api/game/list` +
      (filterTxt === "All" ? "" : "?startsWith=" + filterTxt)
  );
  const gamesData = await resGames.json();
  gamesResponseHandler(gamesData);
  setTimeout(() => {
    $(".ga-loader").hide();
    $(".ga-list-header").show();
    if (!gamesCount) {
      $(".ga-list-empty,.ga-filters-sw").show();
      return;
    }
    $(".ga-list-results-info").text(gamesCount + " result(s)");
    $(".ga-list-results-info,.ga-list").show();
  }, 600);
}
$(".ga-filters-sw-li").on("click", function () {
  $(".ga-filters-sw-li").removeClass("active");
  $(this).addClass("active");
  $(".ga-loader").show();
  $(".ga-list").html($(".ga-list").children().eq(0).show().prop("outerHTML"));
  $(".ga-list-header,.ga-list-results-info,.ga-list-empty,.ga-list").hide();
  filterTxt = $(this).text();
  fetchUpdateGames();
});
window.onload = async () => {
  await auth0Bootstrap();
  await fetchUpdateGames();
};
