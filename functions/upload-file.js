exports.handler = async () => {
  await b2.authorizeAccount({
    accountId: "005fa8f08ff41590000000002",
    applicationKey: "K005rTY6c7IuYqYDDdYQbhlCEc9qy3Y",
  });
  return { statusCode: 200, body: "B2 授权成功" };
};
