const axios = require("axios");

const accountId = "005fa8f08ff41590000000002";
const applicationKey = "K005rTY6c7IuYqYDDdYQbhlCEc9qy3Y";
const authUrl = "https://api.backblazeb2.com/b2api/v2/b2_authorize_account";

exports.handler = async () => {
  try {
    const response = await axios.post(authUrl, null, {
      auth: {
        username: accountId,
        password: applicationKey,
      },
    });

    const { authorizationToken, apiUrl, accountId: newAccountId } = response.data;
    console.log("B2 授权成功", { authorizationToken, apiUrl, newAccountId });
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "B2 授权成功", authorizationToken }),
    };
  } catch (error) {
    console.error("授权失败:", error.message, error.response ? error.response.data : "无响应数据");
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "授权失败", error: error.message }),
    };
  }
};
