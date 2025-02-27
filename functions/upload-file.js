const { B2 } = require("b2-sdk");

// 初始化B2 SDK
const b2 = new B2({
  accountId: "005fa8f08ff41590000000002", // 你的B2账号ID
  applicationKey: "K005rTY6c7IuYqYDDdYQbhlCEc9qy3Y", // 你的B2应用密钥
});

exports.handler = async () => {
  try {
    // 进行B2授权，使用b2.authorize()进行授权
    await b2.authorize();

    console.log("B2 授权成功");

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "B2 授权成功" }),
    };
  } catch (error) {
    console.error("授权失败:", error.message);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: "授权失败", error: error.message }),
    };
  }
};
