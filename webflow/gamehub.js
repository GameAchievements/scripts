const apiDomain = document.querySelector("meta[name=domain]")?.content;
const urlParams = new URLSearchParams(window.location.search);
const gameId = urlParams.get("id") || 1044;
const elemIdPrefix = `#gas-gh`;
const formMessageDelay = 4000;
let token;
$(".ga-loader-container").show();
$("#ga-sections-container").hide();

function gamehubResponseHandler(res, elemId) {
  const $ghContainer = $(`${elemId}`);
  let dataTemplateActual = $ghContainer.prop("outerHTML");
  console.info(`=== ${elemId} ===`, res);
  const textKeysToReplace = [
    "name",
    "igdbId",
    "description",
    "ownersCount",
    "recentGamersCount",
    "completion",
    "achievementsCount",
  ];
  const dateKeysToReplace = ["releaseDate"];
  const keysWithArrays = ["genres", "modes", "publishers", "developers"];
  if (elemId.endsWith("top")) {
    dataTemplateActual = $ghContainer
      .css(
        "background-image",
        `linear-gradient(rgba(255,255,255,0),#030922),
          linear-gradient(rgba(70,89,255,.4),rgba(70,89,255,.4)),
          url(${res.coverURL || res.imageURL})`
      )
      .prop("outerHTML");
  }
  $(".gas-img", dataTemplateActual).each((idx, elm) => {
    dataTemplateActual = $(elm)
      .removeAttr("srcset")
      .removeAttr("sizes")
      .attr("src", res.imageURL)
      .parents(elemId)
      .prop("outerHTML");
  });
  Object.entries(res).forEach(([key, value]) => {
    if (textKeysToReplace.includes(key)) {
      dataTemplateActual = dataTemplateActual.replaceAll(`{|${key}|}`, value);
    } else if (dateKeysToReplace.includes(key)) {
      dataTemplateActual = dataTemplateActual.replaceAll(
        `{|${key}|}`,
        gaDate(value)
      );
    } else if (key === "platforms" && elemId.endsWith("about")) {
      dataTemplateActual = showPlatform(
        value?.length ? value : res["importedFromPlatforms"],
        dataTemplateActual,
        elemId
      );
    } else if (keysWithArrays.includes(key)) {
      const $tags = $(`.gas-tags-${key}`, dataTemplateActual);
      if ($tags?.length && value?.length) {
        dataTemplateActual = $tags
          .html(
            value.map((tag) => `<div class="igdb-tag">${tag}</div>`).join("\n")
          )
          .parents(elemId)
          .prop("outerHTML");
      }
    }
  });
  $ghContainer.prop("outerHTML", dataTemplateActual);
}
async function fetchGamehub(elemIdsSuffixes) {
  const resFetch = await fetch(`https://${apiDomain}/api/game/${gameId}`);
  const resData = await resFetch.json();
  if (Object.keys(resData).length > 0 && resData.id) {
    document.title = `${resData.name?.length ? resData.name : resData.id} | ${
      document.title
    }`;
    elemIdsSuffixes.forEach((elemIdSuf) => {
      gamehubResponseHandler(resData, `${elemIdPrefix}-${elemIdSuf}`);
    });
  }
}

function listResponseHandler({
  listData,
  elemId,
  numKeysToReplace,
  textKeysToReplace,
  tabCounts,
  tabMatcher,
}) {
  const $listTabs = $(`${elemId} .gas-list-tabs`);
  console.info(`=== ${elemId} results ===`, listData);
  let dataTemplate = $listTabs.prop("outerHTML");
  if (!tabCounts) {
    tabMatcher = "platform";
    tabCounts = {
      allCnt: listData.length,
      playstationCnt: listData.filter(
        (item) => item[tabMatcher].toLowerCase() === "playstation"
      )?.length,
      xboxCnt: listData.filter(
        (item) => item[tabMatcher].toLowerCase() === "xbox"
      )?.length,
      steamCnt: listData.filter(
        (item) => item[tabMatcher].toLowerCase() === "steam"
      )?.length,
    };
  }
  const tabKeysToReplace = Object.keys(tabCounts);
  tabKeysToReplace.forEach((key) => {
    dataTemplate = dataTemplate.replaceAll(`{|${key}|}`, tabCounts[key]) || "0";
  });
  // replace counts
  $listTabs.prop("outerHTML", dataTemplate);
  tabKeysToReplace.forEach((key) => {
    const tabName = key.slice(0, key.indexOf("Cnt"));
    const $list = $(`${elemId} .gas-list-${tabName}`);
    const $emptyList = $(`.gas-list-empty`, $list);
    if (tabCounts[key] > 0) {
      const $listHeader = $list.children().first();
      const $entryTemplate = $(".gas-list-entry", $list).first();
      $entryTemplate.show();
      dataTemplate = $entryTemplate.prop("outerHTML");
      $list.html($listHeader).append($entryTemplate);
      $entryTemplate.hide();
      (tabName === "all"
        ? listData
        : listData.filter((item) => item[tabMatcher]?.toLowerCase() === tabName)
      ).forEach((item, resIdx) => {
        let dataTemplateActual = dataTemplate;
        Object.entries(item).forEach(([key, value]) => {
          const $entryImg = $(`.gas-list-entry-cover`, dataTemplateActual);
          if ($entryImg && item.iconURL?.length) {
            dataTemplateActual = $entryImg
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
          } else if (key === "rating") {
            dataTemplateActual = dataTemplateActual.replaceAll(
              `{|${key}|}`,
              Math.round(value || 0)
            );
            const $rateWrapper = $(
              `.gas-list-entry-rating`,
              dataTemplateActual
            );
            if ($rateWrapper.length) {
              dataTemplateActual = $rateWrapper
                .prepend(ratingSVG(value))
                .parents(".gas-list-entry")
                .prop("outerHTML");
            }
          } else if (key === "platform") {
            dataTemplateActual = showPlatform(value, dataTemplateActual);
          } else if (key === "rarity") {
            const classValue = rarityClassCalc(value);
            dataTemplateActual = dataTemplateActual.replaceAll(
              `{|${key}|}`,
              classValue.replace("-", " ")
            );
            dataTemplateActual = $(`.gas-rarity-tag`, dataTemplateActual)
              .removeClass("gas-rarity-tag")
              .addClass(`gas-rarity-tag-${classValue}`)
              .children(".p1")
              .addClass(classValue)
              .parents(".gas-list-entry")
              .prop("outerHTML");
          }
        });
        $list
          .append(dataTemplateActual)
          .children()
          .last()
          .removeClass(["bg-light", "bg-dark"])
          .addClass(`bg-${resIdx % 2 > 0 ? "light" : "dark"}`);
      });
    } else {
      $list.html($emptyList);
      $emptyList.show();
    }
  });
}

function reviewsBarsHandler({ listData, elemId }) {
  const $barsContainer = $(elemId + "-bars");
  let barItems = [];
  const bars = ["positive", "mixed", "negative"];
  if (listData.length) {
    bars.forEach((barName) => {
      barItems = listData.filter(
        (item) => item.classification?.toLowerCase() === barName
      );
      const $bar = $(`.gas-bar-${barName}`, $barsContainer);
      if ($bar.length) {
        // when barItems == 0, 1% width shows a little bit of the bar
        $bar.css("width", `${100 * (barItems.length / listData.length) || 1}%`);
      }
      const $barText = $(`.gas-bar-text-${barName}`, $barsContainer);
      if ($barText.length) {
        $barText.text(barItems?.length);
      }
    });

    const avgRating = Math.round(
      listData
        .map((li) => li.rating)
        .reduce((prevLi, currLi) => prevLi + currLi) / listData.length
    );
    $(`.gas-avg-rate-wrapper`).each((idx, rateEl) => {
      $(rateEl).prepend(ratingSVG(avgRating));
      $(".gas-avg-rate-text", rateEl).text(avgRating);
    });
  } else {
    bars.forEach((barName) => {
      $(`.gas-bar-${barName}`, $barsContainer).css("width", "1%");
    });
    $(`.gas-avg-rate-wrapper`).each((idx, rateEl) => {
      $(rateEl).prepend(ratingSVG(0));
      $(".gas-avg-rate-text", rateEl).text("-");
    });
  }
}

async function listFetcher({
  listName,
  numKeysToReplace,
  textKeysToReplace,
  tabs,
  tabMatcher,
}) {
  const elemId = `${elemIdPrefix}-${listName}`;
  const resList = await fetch(
    `https://${apiDomain}/api/game/${gameId}/${listName}`
  );
  const listData = await resList.json();
  if (Array.isArray(listData) || listData.length > 0) {
    let tabCounts;
    if (Array.isArray(tabs)) {
      tabCounts = {};
      tabs.forEach((tabName) => {
        tabCounts[`${tabName}Cnt`] =
          tabName === "all"
            ? listData.length
            : listData.filter(
                (item) => item[tabMatcher]?.toLowerCase() === tabName
              )?.length;
      });
    }
    switch (listName) {
      case "reviews":
        reviewsBarsHandler({ listData, elemId });

        $(`.gas-count-reviews`).each((idx, revEl) => {
          $(revEl).text(
            $(revEl).text().replace("{|reviewsCnt|}", listData.length)
          );
          if (idx > 0) {
            $(revEl).text(
              $(revEl)
                .text()
                .replace(
                  `{|${tabs[idx]}ReviewsCnt|}`,
                  tabCounts[`${tabs[idx]}Cnt`]
                )
            );
          }
        });
        break;
      case "guides":
        $(`${elemIdPrefix}-top .gas-count-guides`).text(listData.length);
        break;
      default:
        break;
    }
    listResponseHandler({
      listData,
      elemId,
      numKeysToReplace,
      textKeysToReplace,
      tabCounts,
      tabMatcher,
    });
  }
}

function achieversHandler({
  listsData,
  elemId,
  numKeysToReplace,
  textKeysToReplace,
}) {
  console.info(`=== ${elemId} results ===`, listsData);
  const $achieversLists = $(
    `${elemId} .gas-list-first, ${elemId} .gas-list-latest`
  );
  $achieversLists.each((listIdx, listEl) => {
    const $list = $(listEl);
    let dataTemplate = $list.prop("outerHTML");
    const $emptyList = $(`.gas-list-empty`, $list);
    const $listHeader = $list.children().first();
    const $entryTemplate = $(".gas-list-entry", $list).first();
    $list.html($listHeader);
    const listDataToRead =
      listsData[listIdx === 0 ? "firstAchievers" : "latestAchievers"];
    if (listDataToRead?.length > 0) {
      $entryTemplate.show();
      $list.append($entryTemplate);
      dataTemplate = $entryTemplate.prop("outerHTML");
      $entryTemplate.hide();
      listDataToRead.forEach((item, itemIdx) => {
        let dataTemplateActual = dataTemplate;
        Object.entries(item).forEach(([key, value]) => {
          const $entryImg = $(`.gas-list-entry-cover`, dataTemplateActual);
          if ($entryImg && item.iconURL?.length) {
            dataTemplateActual = $entryImg
              .attr("src", item.avatar)
              .parents(".gas-list-entry")
              .data("id", item.id)
              .prop("outerHTML");
          }
          dataTemplateActual = dataTemplateActual.replaceAll(
            `{|idx|}`,
            itemIdx + 1
          );
          if (key === "unlockedAt") {
            const { date, time } = gaDateTime(value);
            dataTemplateActual = dataTemplateActual.replaceAll(
              `{|unlockedDt|}`,
              date || "N.A."
            );
            dataTemplateActual = dataTemplateActual.replaceAll(
              `{|${key}|}`,
              time || "N.A."
            );
          } else if (textKeysToReplace.includes(key)) {
            dataTemplateActual = dataTemplateActual.replaceAll(
              `{|${key}|}`,
              value || ""
            );
          } else if (numKeysToReplace.includes(key)) {
            dataTemplateActual = dataTemplateActual.replaceAll(
              `{|${key}|}`,
              Math.round(value || 0)
            );
          }
        });
        $list
          .append(dataTemplateActual)
          .children()
          .last()
          .removeClass(["bg-light", "bg-dark"])
          .addClass(`bg-${itemIdx % 2 > 0 ? "light" : "dark"}`);
      });
    } else {
      $list.append($emptyList);
      $emptyList.show();
    }
  });
}

async function achieversFetcher({
  listName,
  numKeysToReplace,
  textKeysToReplace,
}) {
  const elemId = `${elemIdPrefix}-${listName}`;
  const resLists = await fetch(
    `https://${apiDomain}/api/game/${gameId}/${listName}`
  );
  const listsData = await resLists.json();
  achieversHandler({
    listsData,
    elemId,
    numKeysToReplace,
    textKeysToReplace,
  });
}

const setupReviewForm = () => {
  const formWrapperId = `${elemIdPrefix}-review-form`;
  const $submitBtn = $(`.submit-button`, formWrapperId);
  $submitBtn.attr("disabled", true);
  const $titleField = $(`input[name=title]`, formWrapperId);
  const $contentField = $(`input[name=content]`, formWrapperId);
  const $requiredFields = $(`input[name][required]`, formWrapperId);
  const submitText = $submitBtn.text();
  const $errEl = $(".gas-form-error", formWrapperId);
  const $errorDiv = $("div", $errEl);
  const txtError = $errEl.text();
  const $successEl = $(".gas-form-success", formWrapperId);
  const $ratingScale = $(".gas-rating-scale", formWrapperId);
  const $rateChosen = $(".gas-rating-selected", formWrapperId);
  ratingScale($ratingScale, $rateChosen);
  let requiredFilled = false;
  const canSubmit = () => {
    if (requiredFilled && Number($rateChosen.data("rate"))) {
      $submitBtn.removeClass("disabled-button").attr("disabled", false);
    }
  };
  $requiredFields.on("focusout keyup", function () {
    $requiredFields.each(function () {
      if (!$(this).val()?.length) {
        requiredFilled = false;
        $(this).prev("label").addClass("field-label-missing");
        $submitBtn.addClass("disabled-button").attr("disabled", true);
      } else {
        requiredFilled = true;
        $(this).prev("label").removeClass("field-label-missing");
      }
    });
    canSubmit();
  });
  $("li", $ratingScale).one("click", function () {
    $ratingScale.parent().prev("label").removeClass("field-label-missing");
    canSubmit();
  });
  $submitBtn.on("click", async (e) => {
    e.preventDefault();
    const rating = Number($rateChosen.data("rate") || 0);
    if (!rating || !$titleField.val()?.length || !$contentField.val().length) {
      $errEl.show();
      $errorDiv.text("Please choose a rating and fill-in required fields");
      setTimeout(() => {
        $errEl.hide();
        $errorDiv.text(txtError);
      }, formMessageDelay);
      return;
    }
    // disable show popup on leave page (site-settings)
    isUserInputActive = false;
    $(`input`, formWrapperId).attr("disabled", true);
    $submitBtn.text($submitBtn.data("wait"));
    const reqData = {
      title: $titleField.val(),
      content: $contentField.val(),
      rating,
    };
    const resFecth = await fetch(
      `https://${apiDomain}/api/game/${gameId}/review`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reqData),
      }
    );
    const revData = await resFecth.json();
    if (resFecth.status !== 201) {
      $errEl.show();
      $errorDiv.text(revData?.message);
      setTimeout(() => {
        $errEl.hide();
        $errorDiv.text(txtError);
        $(`input`, formWrapperId).attr("disabled", false);
        $submitBtn.text(submitText);
      }, formMessageDelay);
      return;
    }
    $(`form`, formWrapperId).hide();
    $successEl.attr("title", revData?.message).show();
  });
};

window.onload = async () => {
  await auth0Bootstrap();
  if (userAuth0Data?.sub?.length) {
    token = await auth0Client.getTokenSilently();
  }
  await fetchGamehub(["top", "about"]);
  setupReviewForm();
  await Promise.all([
    await listFetcher({
      listName: "achievements",
      numKeysToReplace: ["id", "score", "achieversCount", "gAPoints"],
      textKeysToReplace: ["name", "description", "updatedAt"],
    }),
    await listFetcher({
      listName: "guides",
      numKeysToReplace: ["id", "commentsCount", "viewsCount", "likesCount"],
      textKeysToReplace: [
        "profileId",
        "name",
        "description",
        "author",
        "updatedAt",
      ],
    }),
    await listFetcher({
      listName: "reviews",
      numKeysToReplace: ["id", "likesCount"],
      textKeysToReplace: [
        "profileId",
        "name",
        "content",
        "author",
        "classification",
        "updatedAt",
      ],
      tabs: ["all", "positive", "mixed", "negative"],
      tabMatcher: "classification",
    }),
    await achieversFetcher({
      listName: "achievers",
      numKeysToReplace: ["id", "achievementId"],
      textKeysToReplace: ["profileId", "achievementName", "playerName", "name"],
    }),
  ]);
  $(".ga-loader-container").hide();
  $("#ga-sections-container").show();
  $("#gas-wf-tab-activator").click();
};
