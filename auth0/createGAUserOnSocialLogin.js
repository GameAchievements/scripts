/**
 * Handler that will be called during the execution of a PostLogin flow.
 *
 * @param {Event} event - Details about the user and the context in which they are logging in.
 * @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
 */
const axios = require("axios");

exports.onExecutePostLogin = async (event, api) => {
  const { name, email, nickname, user_id } = event.user;

  if (!user_id.includes("discord") && !user_id.includes("google")) {
    return;
  }

  return await axios({
    method: "post",
    url: "https://gameachievements.up.railway.app/api/user",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    data: {
      email,
      name: name || nickname,
      auth0Id: user_id,
    },
  });
};
