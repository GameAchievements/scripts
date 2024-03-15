(() => {
  // utils/dateTIme.js
  var gaDate = (isoDate) => {
    const pad = (v) => `0${v}`.slice(-2);
    const dateObj = new Date(isoDate);
    return `${dateObj.getFullYear()} . ${pad(dateObj.getMonth() + 1)} . ${pad(
      dateObj.getDate()
    )}`;
  };
  var gaDateTime = (isoDate) => {
    const dateObj = new Date(isoDate);
    const month = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ];
    const date = `${dateObj.getDate()} ${month[dateObj.getMonth()]}, ${dateObj.getFullYear()}`;
    const time = dateObj.toLocaleTimeString().toLowerCase();
    return { date, time };
  };

  // utils/achievementNameSlicer.js
  var achievementNameSlicer = (name) => {
    if (!name) {
      return "N.A.";
    }
    const metaDivider = name.lastIndexOf(" | ");
    return metaDivider > 0 ? name.slice(0, metaDivider) : name;
  };

  // utils/templateReplacers/showPlatform.js
  var showPlatform = (platformName, dataTemplateActual, parentSelector = ".gas-list-entry") => {
    let templateTemp = dataTemplateActual;
    const platformVerifier = {
      ps: { rgx: /playstation/gi },
      xbox: { rgx: /xbox/gi },
      steam: { rgx: /steam|pc|windows|mac|linux/gi }
    };
    if (platformVerifier.ps.rgx.test(platformName)) {
      templateTemp = $(".gas-platform-psn", templateTemp).css("display", "inherit").parents(parentSelector).prop("outerHTML");
    }
    if (platformVerifier.steam.rgx.test(platformName)) {
      templateTemp = $(".gas-platform-steam", templateTemp).css("display", "inherit").parents(parentSelector).prop("outerHTML");
    }
    if (platformVerifier.xbox.rgx.test(platformName)) {
      templateTemp = $(".gas-platform-xbox", templateTemp).css("display", "inherit").parents(parentSelector).prop("outerHTML");
    }
    return templateTemp;
  };

  // utils/templateReplacers/showImageFromSrc.js
  var showImageFromSrc = ($img, url, parentSelector = ".gas-list-entry") => $img.removeAttr("srcset").removeAttr("sizes").attr("src", url).parents(parentSelector).prop("outerHTML");

  // wrappers/GuidePage/CommentsSection.js
  var elemIdPrefix2 = "#gas-guide";
  function listResponseHandler({ listData, elemId, textKeysToReplace }) {
    console.info(`=== ${elemId} results ===`, listData);
    let dataTemplate = $(elemId).prop("outerHTML");
    const $list = $(`${elemId} .gas-list`);
    const $emptyList = $(".gas-list-empty", $list);
    if (listData.count > 0 && listData.results?.length) {
      const $listHeader = $list.children().first();
      const $entryTemplate = $(".gas-list-entry", $list).first();
      $entryTemplate.show();
      dataTemplate = $entryTemplate.prop("outerHTML");
      $list.html($listHeader).append($entryTemplate);
      $entryTemplate.hide();
      listData.results.forEach((item, resIdx) => {
        let dataTemplateActual = dataTemplate;
        for (const [key, value] of Object.entries(item)) {
          const $entryImg = $(".gas-list-entry-cover", dataTemplateActual);
          if ($entryImg.length && item.imageUrl?.length) {
            dataTemplateActual = showImageFromSrc($entryImg, item.imageURL) || dataTemplateActual;
          }
          if (textKeysToReplace.includes(key)) {
            dataTemplateActual = dataTemplateActual.replaceAll(
              `{|${key}|}`,
              value || ""
            );
          } else if (key === "date") {
            const { date, time } = gaDateTime(value);
            dataTemplateActual = dataTemplateActual.replaceAll(
              `{|${key}|}`,
              `${date} at ${time}`
            );
          }
        }
        $list.append(dataTemplateActual).children().last().removeClass(["bg-light", "bg-dark"]).addClass(`bg-${resIdx % 2 > 0 ? "light" : "dark"}`);
      });
    } else {
      $list.html($emptyList);
      $emptyList.show();
    }
    $list.show();
  }
  async function listFetcher({ apiDomain: apiDomain3, guideId: guideId3 }, { listName, textKeysToReplace }) {
    const elemId = `${elemIdPrefix2}-${listName}`;
    const resList = await fetch(
      `https://${apiDomain3}/api/guide/${guideId3}/${listName}`
    );
    const listData = await resList.json();
    $(`.gas-guide-${listName}-count`).text(listData.count || "");
    listResponseHandler({
      listData,
      elemId,
      textKeysToReplace
    });
  }
  async function loadComments(apiDomain3, guideId3) {
    await listFetcher(
      { apiDomain: apiDomain3, guideId: guideId3 },
      {
        listName: "comments",
        numKeysToReplace: [],
        textKeysToReplace: ["profileId", "author", "comment"]
      }
    );
  }

  // wrappers/GuidePage/GuideData.js
  var elemIdPrefix3 = "#gas-guide";
  function loadSections(sections) {
    const $nav = $(`${elemIdPrefix3}-nav`);
    const $secs = $(`${elemIdPrefix3}-sections`);
    const $navTemp = $(".gas-nav-btn", $nav).first();
    const $secTemp = $(".gas-section", $secs).first();
    for (let secIdx = sections.length - 1; secIdx >= 0; secIdx--) {
      const sec = sections[secIdx];
      const $newNavBtn = $navTemp.clone();
      $newNavBtn.attr("title", sec.title);
      $newNavBtn.children().first().text($newNavBtn.text().replace("{|title|}", sec.title));
      const secNum = secIdx + 1;
      $nav.prepend($newNavBtn.attr("href", `${elemIdPrefix3}-section-${secNum}`));
      const $newSec = $secTemp.clone();
      const $secTitle = $(".gas-section-title", $newSec);
      $secTitle.text(
        $secTitle.text().replace("{|title|}", `${secNum} \u203A ${sec.title}`)
      );
      const $secContent = $(".gas-section-content", $newSec);
      $secContent.html($secContent.text().replace("{|content|}", sec.content));
      $secs.prepend(
        $newSec.attr("id", `${elemIdPrefix3.slice(1)}-section-${secNum}`)
      );
    }
    $navTemp.remove();
    $secTemp.remove();
  }
  function guideResponseHandler(res) {
    const elemId = `${elemIdPrefix3}-details`;
    const $ghContainer = $(elemId);
    let dataTemplateActual = $ghContainer.prop("outerHTML");
    console.info(`=== ${elemId} ===`, res);
    const textKeysToReplace = [
      "id",
      "name",
      "description",
      "achievementId",
      "achievementName",
      "gameId",
      "gameName",
      "profileId",
      "author",
      "createdAt",
      "updatedAt"
    ];
    const numKeysToReplace = ["comments", "upvotes"];
    const guideImg = res.coverURL || res.imageURL;
    if (guideImg?.length) {
      dataTemplateActual = $ghContainer.css(
        "background-image",
        `linear-gradient(rgba(255,255,255,0),#030922),
          linear-gradient(rgba(70,89,255,.4),rgba(70,89,255,.4)),
          url(${guideImg})`
      ).prop("outerHTML");
    }
    const $authorImg = $(".gas-author-cover", dataTemplateActual);
    if ($authorImg?.length && res.avatar?.length) {
      dataTemplateActual = showImageFromSrc($authorImg, res.avatar, elemId) || dataTemplateActual;
    }
    for (const [key, value] of Object.entries(res)) {
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
        dataTemplateActual = showPlatform(value, dataTemplateActual, elemId);
      }
    }
    $ghContainer.prop("outerHTML", dataTemplateActual);
    loadSections(res.sections);
  }
  async function fetchGuide(apiDomain3, guideId3) {
    const resFetch = await fetch(`https://${apiDomain3}/api/guide/${guideId3}`);
    if (resFetch.status !== 200) {
      return;
    }
    const resData = await resFetch.json();
    if (Object.keys(resData).length > 0 && resData.id) {
      document.title = `${resData.name?.length ? resData.name : resData.id} | ${document.title}`;
      achievementId = resData.achievementId;
      resData.achievementName = achievementNameSlicer(resData.achievementName);
      guideResponseHandler(resData);
    }
    return resData;
  }

  // wrappers/GuidePage/VerifyAuthUserGuideData.js
  var achievementId2 = 0;
  var hasLike;
  function setupLike(hasLikeFromFetch) {
    hasLike = hasLikeFromFetch;
    const $btnLike = $(`${elemIdPrefix}-btn-like`);
    const $btnDelLike = $(`${elemIdPrefix}-btn-like-del`);
    if (hasLike) {
      $btnLike.hide();
    } else {
      $btnDelLike.hide();
    }
    const changeLikeStatus = async () => {
      $btnLike.attr("disabled", true);
      $btnDelLike.attr("disabled", true);
      const resFetch = await fetch(
        `https://${apiDomain}/api/guide/${guideId}/upvote`,
        { method: "POST", headers: { Authorization: `Bearer ${token}` } }
      );
      const $likesCount = $(`${elemIdPrefix}-upvotes-count`);
      const countChange = hasLike ? -1 : 1;
      hasLike = !hasLike;
      $likesCount.text(Number($likesCount.text() || 0) + countChange);
      if (resFetch.status === 204) {
        $btnLike.attr("disabled", false).show();
        $btnDelLike.hide();
        return;
      }
      $btnLike.hide();
      $btnDelLike.attr("disabled", false).show();
    };
    $btnLike.on("click", changeLikeStatus);
    $btnDelLike.on("click", changeLikeStatus);
  }
  var setupCommentForm = (hasComment) => {
    const formWrapperId = `${elemIdPrefix}-comment-form`;
    if (hasComment) {
      $(`${elemIdPrefix}-btn-add-comment`).hide();
      $(formWrapperId).parent().hide();
      return;
    }
    const formMessageDelay = 4e3;
    const $submitBtn = $(".submit-button", formWrapperId);
    $submitBtn.attr("disabled", true);
    const $contentField = $("[name=comment]", formWrapperId);
    const submitText = $submitBtn.text();
    const $errEl = $(".gas-form-error", formWrapperId);
    const $errorDiv = $("div", $errEl);
    const txtError = $errEl.text();
    const $successEl = $(".gas-form-success", formWrapperId);
    $contentField.on("focusout keyup", function() {
      if (!$(this).val()?.length) {
        $(this).prev("label").addClass("field-label-missing");
        $submitBtn.addClass("disabled-button").attr("disabled", true);
      } else {
        $(this).prev("label").removeClass("field-label-missing");
        $submitBtn.removeClass("disabled-button").attr("disabled", false);
      }
    });
    $submitBtn.on("click", async (e) => {
      e.preventDefault();
      if (!$contentField.val().length) {
        $errEl.show();
        $errorDiv.text("Please write your comment in the box above");
        setTimeout(() => {
          $errEl.hide();
          $errorDiv.text(txtError);
        }, formMessageDelay);
        return;
      }
      isUserInputActive = false;
      $("input", formWrapperId).attr("disabled", true);
      $submitBtn.text($submitBtn.data("wait"));
      const resFetch = await fetch(
        `https://${apiDomain}/api/guide/${guideId}/comment`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ comment: $contentField.val() })
        }
      );
      const revData = await resFetch.json();
      if (resFetch.status !== 201) {
        $errEl.show();
        $errorDiv.text(revData?.message);
        setTimeout(() => {
          $errEl.hide();
          $errorDiv.text(txtError);
          $("input", formWrapperId).attr("disabled", false);
          $submitBtn.text(submitText);
        }, formMessageDelay);
        return;
      }
      $("form", formWrapperId).hide();
      $successEl.attr("title", revData?.message).show();
      setTimeout(() => {
        location.reload();
      }, formMessageDelay);
    });
  };
  async function verifyAuthenticatedUserGuideData() {
    if (!token || !achievementId2) {
      return;
    }
    const resFetch = await fetch(
      `https://${apiDomain}/api/achievement/${achievementId2}/guide-auth-user-data?id=${guideId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (resFetch.status !== 200) {
      $(`${elemIdPrefix}-nav-auth`).hide();
      $(`${elemIdPrefix}-comment-form`).parent().hide();
      return;
    }
    const revData = await resFetch.json();
    const $editBtn = $(`${elemIdPrefix}-btn-edit`);
    if (revData.ownedGuideId > 0) {
      $editBtn.attr("href", `/guide-form?id=${revData.ownedGuideId}`).show();
    } else {
      $editBtn.hide();
    }
    setupLike(revData.hasLike);
    setupCommentForm(revData.hasComment);
  }

  // webflow/guide.js
  var apiDomain2 = document.querySelector("meta[name=domain]")?.content;
  var urlParams = new URLSearchParams(location.search);
  var guideId2 = urlParams.get("id") || 1;
  $(".ga-loader-container").show();
  $("#ga-sections-container").hide();
  $().ready(async () => {
    await auth0Bootstrap();
    if (await fetchGuide(apiDomain2, guideId2)) {
      await verifyAuthenticatedUserGuideData();
      await loadComments(apiDomain2, guideId2);
      $(".ga-loader-container").hide();
      $("#ga-sections-container").show();
      $("#gas-wf-tab-activator").click();
      return;
    }
    location.replace("/guides");
  });
})();
