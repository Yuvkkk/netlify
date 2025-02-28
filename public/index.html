<!DOCTYPE html>
<html lang="zh">
<head>
  <meta charset="UTF-8">
  <title>文件上传</title>
</head>
<body>
  <h1>上传文件到 Backblaze B2</h1>
  <input type="file" id="fileInput" accept=".zip" />
  <button onclick="upload()">上传</button>
  <p id="result"></p>
  <script>
    async function upload() {
      const file = document.getElementById("fileInput").files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = async () => {
        const fileContent = reader.result.split(",")[1]; // 提取 Base64 数据
        try {
          const response = await fetch("/.netlify/functions/upload-file", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              file: fileContent,
              fileName: file.name,
              mimeType: file.type // 发送 MIME 类型
            }),
          });
          const data = await response.json();
          document.getElementById("result").textContent = data.message;
        } catch (error) {
          document.getElementById("result").textContent = "上传失败: " + error.message;
        }
      };
      reader.readAsDataURL(file); // 读取为 Base64
    }
  </script>
</body>
</html>
