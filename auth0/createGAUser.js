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
  const { email, name, username, nickname, user_id, user_metadata } =
    event.user;
  return await axios({
    method: "post",
    url: "https://gameachievements.up.railway.app/api/user",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    data: {
      email,
      name: user_metadata?.ga_name || nickname || username || name,
      auth0Id: user_id,
    },
  });
};
