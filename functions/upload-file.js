const formidable = require("formidable-serverless"); // 必须有这一行
const B2 = require("backblaze-b2");

const b2 = new B2({
  applicationKeyId: "005fa8f08ff41590000000002", // 替换为你的 keyID
  applicationKey: "K005rTY6c7IuYqYDDdYQbhlCEc9qy3Y", // 替换为你的 applicationKey
});

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const form = new formidable.IncomingForm();
  try {
    const [fields, files] = await form.parse(Buffer.from(event.body, "base64"));
    const file = files.file[0];
    if (!file) {
      return { statusCode: 400, body: JSON.stringify({ message: "没有上传文件" }) };
    }

    await b2.authorize();
    const uploadUrl = await b2.getUploadUrl({ bucketId: "5f4a78ff70c84f6f94510519" }); // 替换为你的 Bucket ID
    await b2.uploadFile({
      uploadUrl: uploadUrl.data.uploadUrl,
      uploadAuthToken: uploadUrl.data.authorizationToken,
      fileName: file.originalFilename,
      data: require("fs").createReadStream(file.filepath),
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: `文件 ${file.originalFilename} 已保存到 Backblaze B2` }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "处理失败: " + error.message }),
    };
  }
};