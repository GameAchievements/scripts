// for header settings: <meta name="loginRedirectPath" content="/profile" />

const apiDomain = document.querySelector("meta[name=domain]")?.content;
let token;
/**
 * Gets {user, profile, platformAccount} models
 *
 * @param {string} email
 * @returns {Promise<{user: {}, profile: {}, platformAccount: {}}>}
 */
const fetchGAUserData = async (email) => {
  try {
    const resProf = await fetch(`https://${apiDomain}/api/profile/${email}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const userData = await resProf.json();
    displayGAUserData({ ...userData.user, ...userData.profile });
    return userData;
  } catch (err) {
    console.error("[auth0] fetching user data error", err);
  }
};
const displayGAUserData = async (userData) => {
  $("#ga-profile-top-data").each((idx, item) => {
    let dataTemplateActual = $(item).html();
    Object.entries(userData).forEach(([key, value]) => {
      dataTemplateActual = dataTemplateActual.replaceAll(
        `{|${key}|}`,
        (key.endsWith("At") ? new Date(value).toLocaleString() : value) || ""
      );
    });
    $(item).html(dataTemplateActual);
  });
};

const fetchGAUserGamesData = async (profileId) => {
  try {
    const resProf = await fetch(
      `https://${apiDomain}/api/game/list/profile/${profileId}`
    );
    return await resProf.json();
  } catch (err) {
    console.error("[auth0] fetching user data error", err);
  }
};
const formsSetup = async (profileId) => {
  const formIdPrefix = "wf-form-";
  const formIdSuffixes = ["steam", "xbox", "psn"];
  formIdSuffixes.forEach((suffix) => {
    let platformId = 1; // psn
    switch (suffix) {
      case "steam":
        platformId = 3;
        break;
      case "xbox":
        platformId = 2;
        break;
    }
    const formId = `${formIdPrefix}${suffix}`;
    $(`#${formId} input[type=submit]`).click(async (e) => {
      e.preventDefault();
      const data = {
        profile: profileId,
        platform: platformId,
        external: $(`#${formId} input[name=external]`).val(), // instead of $(`#${formId}`).serialize()
      };
      console.log("[PA] linking with data", data);

      const resLink = await fetch(`https://${apiDomain}/api/profile/link-pa`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const resLinkjson = await resLink.json();
      $(".ga-link-pa-response").show();
      $("#ga-link-pa-data").text(JSON.stringify(resLinkjson, {}, 2));
    });
  });
};
$("#ga-btn-dev-data").click(() => {
  $("#ga-container-dev-data").toggle();
});

window.onload = async () => {
  $(".ga-loader").show();
  $(".ga-data-container,#ga-container-dev-data").hide();
  await auth0Bootstrap();
  token = await auth0Client.getTokenSilently();
  if (userAuth0Data && Object.keys(userAuth0Data).length > 0) {
    const uA0Elem = document.getElementById("ga-auth-user-data");
    uA0Elem.innerText = JSON.stringify(userAuth0Data, {}, 2);
    if (userAuth0Data?.email?.length) {
      const gaUData = await fetchGAUserData(userAuth0Data.email);
      const gaUElem = document.getElementById("ga-user-data");
      gaUElem.innerText = JSON.stringify(gaUData, {}, 2);
      const profileId = gaUData?.profile?.id;
      const gaUGamesData = await fetchGAUserGamesData(profileId);
      const gaUGamesElem = document.getElementById("ga-user-games-data");
      gaUGamesElem.innerText = JSON.stringify(gaUGamesData, {}, 2);
      formsSetup(profileId);
    }
    $(".ga-loader").hide();
    $(".ga-data-container").show();
    return;
  }
  if (login) {
    login();
    return;
  }
  window.location.replace("/");
};
