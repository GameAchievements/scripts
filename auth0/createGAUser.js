/* eslint-disable @typescript-eslint/no-var-requires */
/**
 * auth0 Actions > Flows
 * Handler that will be called during the execution of a PostUserRegistration flow.
 *
 * @param {Event} event - Details about the context and user that has registered.
 * @param {PostUserRegistrationAPI} api - Methods and utilities to help change the behavior after a signup.
 */
const axios = require("axios");

exports.onExecutePostUserRegistration = async (event, api) => {
  try {
    const { email, name, username, nickname, user_id } = event.user;
    const resSignup = await axios({
      method: "post",
      url: "https://gameachievements.up.railway.app/api/user",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      data: {
        email,
        name: name || username || nickname,
        auth0Id: user_id,
      },
    });
    console.log("[auth0][pos-reg] signed up", resSignup?.data);
  } catch (err) {
    console.log(
      `[auth0][pos-reg] Error on "${event.user.email}" signup`,
      err.message
    );
  }
};
