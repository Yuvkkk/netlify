exports.handler = async (event) => {
  const fetch = (await import("node-fetch")).default;

  const accountId = "005fa8f08ff41590000000002";
  const applicationKey = "K005rTY6c7IuYqYDDdYQbhlCEc9qy3Y";
  const authUrl = "https://api.backblazeb2.com/b2api/v2/b2_authorize_account";

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  console.log("收到请求:", event.body.slice(0, 100));
  try {
    const { file, fileName } = JSON.parse(event.body);
    if (!file || !fileName) {
      console.log("错误: 缺少文件或文件名");
      return { statusCode: 400, body: JSON.stringify({ message: "缺少文件或文件名" }) };
    }

    console.log("文件信息:", fileName);
    const authResponse = await fetch(authUrl, {
      method: "POST",
      headers: {
        Authorization: "Basic " + Buffer.from(`${accountId}:${applicationKey}`).toString("base64"),
        "Content-Length": "0",
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
    const { uploadUrl, authorizationToken: uploadAuthToken } = uploadUrlData;
    console.log("获取上传 URL 成功:", uploadUrl);

    await fetch(uploadUrl, {
      method: "POST",
      headers: {
        Authorization: uploadAuthToken,
        "Content-Type": "application/json",
        "X-Bz-File-Name": encodeURIComponent(fileName),
        "X-Bz-Content-Sha1": "do_not_verify",
      },
      body: file,
    });
    console.log("上传成功:", fileName);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "JSON file uploaded successfully",
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
