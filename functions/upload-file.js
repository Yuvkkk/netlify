const fetch = require("node-fetch");

const accountId = "005fa8f08ff41590000000002";
const applicationKey = "K005rTY6c7IuYqYDDdYQbhlCEc9qy3Y";
const authUrl = "https://api.backblazeb2.com/b2api/v2/b2_authorize_account";

exports.handler = async () => {
  try {
    const authResponse = await fetch(authUrl, {
      method: "POST",
      headers: {
        Authorization: "Basic " + Buffer.from(`${accountId}:${applicationKey}`).toString("base64"),
        // 仅保留 Authorization，避免任何多余头
      },
      body: null, // 明确无请求体
    });
    const authData = await authResponse.json();
    if (!authResponse.ok) throw new Error(JSON.stringify(authData));
    const { authorizationToken, apiUrl } = authData;
    console.log("B2 授权成功", { authorizationToken, apiUrl });
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "B2 授权成功", authorizationToken, apiUrl }),
    };
  } catch (error) {
    console.error("授权失败:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "授权失败", error: error.message }),
    };
  }
};
