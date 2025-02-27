const { B2 } = require("b2-sdk");

const b2 = new B2({
  accountId: "005fa8f08ff41590000000002",
  applicationKey: "K005rTY6c7IuYqYDDdYQbhlCEc9qy3Y",
});

exports.handler = async (event) => {
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
    await b2.authorize();
    console.log("B2 授权成功");
    const response = await b2.uploadFile({
      bucketId: "5f4a78ff70c84f6f94510519",
      fileName: fileName,
      data: Buffer.from(file, "base64"), // 解码 Base64 数据
    });

    console.log("上传成功:", fileName);
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "File uploaded successfully",
        fileUrl: response.data.downloadUrl,
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
