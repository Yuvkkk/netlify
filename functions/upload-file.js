// netlify/functions/uploadFile.js

const { B2 } = require("b2-sdk");
const axios = require("axios");

// 初始化B2 SDK
const b2 = new B2({
  accountId: "005fa8f08ff41590000000002", // Backblaze 账号ID
  applicationKey: "K005rTY6c7IuYqYDDdYQbhlCEc9qy3Y", // Backblaze 应用密钥
});

exports.handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: "Only POST method is allowed" }),
    };
  }

  try {
    // 解析文件和文件名
    const { file, fileName } = JSON.parse(event.body);

    // 使用 B2 客户端授权
    await b2.authorize();

    // 上传文件到指定的B2桶
    const response = await b2.uploadFile({
      bucketId: "5f4a78ff70c84f6f94510519", // 你的桶ID
      fileName: fileName, // 上传的文件名
      data: file, // 文件的二进制数据
    });

    // 返回成功信息和文件URL
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "File uploaded successfully",
        fileUrl: response.data.fileUrl, // 文件的公开URL
      }),
    };
  } catch (error) {
    console.error("Error uploading file:", error);

    // 上传失败时返回错误信息
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error uploading file", error: error.message }),
    };
  }
};
