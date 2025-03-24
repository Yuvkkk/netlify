const fetch = require("node-fetch");

const accountId = "005fa8f08ff41590000000007";
const applicationKey = "K005GSPBDYHFwmnMHSMPTVgvlxwabLw";
const authUrl = "https://api.backblazeb2.com/b2api/v2/b2_authorize_account";

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  console.log("收到请求:", event.body.slice(0, 100));
  try {
    if (!event.body) {
      console.log("错误: 请求体为空");
      return { statusCode: 400, body: JSON.stringify({ message: "请求体为空" }) };
    }

    const { file, fileName, mimeType } = JSON.parse(event.body);
    if (!file || !fileName) {
      console.log("错误: 缺少文件或文件名");
      return { statusCode: 400, body: JSON.stringify({ message: "缺少文件或文件名" }) };
    }

    console.log("文件信息:", fileName, mimeType || "application/octet-stream");
    const authResponse = await fetch(authUrl, {
      method: "GET",
      headers: {
        Authorization: "Basic " + Buffer.from(`${accountId}:${applicationKey}`).toString("base64"),
      },
    });
    const authData = await authResponse.json();
    if (!authResponse.ok) throw new Error(JSON.stringify(authData));
    const { authorizationToken, apiUrl } = authData;
    console.log("B2 授权成功", { authorizationToken, apiUrl });

    const uploadUrlResponse = await fetch(`${apiUrl}/b2api/v2/b2_get_upload_url`, {
      method: "POST",
      headers: {
        Authorization: authorizationToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ bucketId: "5f4a78ff70c84f6f94510519" }),
    });
    const uploadUrlData = await uploadUrlResponse.json();
    if (!uploadUrlResponse.ok) throw new Error(JSON.stringify(uploadUrlData));
    const { uploadUrl, authorizationToken: uploadAuthToken } = uploadUrlData;
    console.log("获取上传 URL 成功:", uploadUrl);

    const fileBuffer = Buffer.from(file, "base64"); // 解码 Base64 为二进制
    const uploadResponse = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        Authorization: uploadAuthToken,
        "Content-Type": mimeType || "application/octet-stream", // 使用文件 MIME 类型，默认二进制流
        "X-Bz-File-Name": encodeURIComponent(fileName),
        "X-Bz-Content-Sha1": "do_not_verify",
      },
      body: fileBuffer,
    });
    if (!uploadResponse.ok) throw new Error(await uploadResponse.text());
    console.log("上传成功:", fileName);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "File uploaded successfully",
        fileUrl: `${apiUrl}/file/my-free-storage/${encodeURIComponent(fileName)}`,
      }),
    };
  } catch (error) {
    console.error("处理失败:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error uploading file", error: error.message }),
    };
  }
};
