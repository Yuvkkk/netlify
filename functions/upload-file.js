const { B2 } = require("b2-sdk");

const b2 = new B2({
  accountId: "005fa8f08ff41590000000002",
  applicationKey: "K005rTY6c7IuYqYDDdYQbhlCEc9qy3Y",
});

exports.handler = async () => {
  try {
    await b2.authorizeAccount({
      accountId: "005fa8f08ff41590000000002",
      applicationKey: "K005rTY6c7IuYqYDDdYQbhlCEc9qy3Y",
    });
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
