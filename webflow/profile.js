// for header settings: <meta name="loginRedirectPath" content="/profile" />

const apiDomain = document.querySelector("meta[name=domain]")?.content;
let token;
const fetchGAUserData = async (email) => {
  const resProf = await fetch(`https://${apiDomain}/api/profile/${email}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const userData = await resProf.json();
  console.log(userData.user, userData.profile);
};

window.onload = async () => {
  $(".ga-loader").show();
  await auth0Bootstrap();
  token = await auth0Client.getTokenSilently();
  if (userAuth0Data && userAuth0Data?.email?.length) {
    await fetchGAUserData(userAuth0Data.email);
    $(".ga-loader").hide();
    return;
  }
  if (login) {
    login();
    return;
  }
  window.location.replace("/");
};
