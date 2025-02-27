const axios = require("axios");

const accountId = "005fa8f08ff41590000000002"; // 你的B2账号ID
const applicationKey = "K005rTY6c7IuYqYDDdYQbhlCEc9qy3Y"; // 你的B2应用密钥

const authUrl = "https://api.backblaze.com/b2_api/v2/b2_authorize_account";

exports.handler = async () => {
  try {
    // 使用 Basic Authentication 进行授权
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
    console.error("授权失败:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "授权失败", error: error.message }),
    };
  }
};
