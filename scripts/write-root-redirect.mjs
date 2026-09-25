import { writeFileSync } from "node:fs";

writeFileSync(
  "out/index.html",
  `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="utf-8" />
  <meta http-equiv="refresh" content="0; url=/ja/" />
  <link rel="canonical" href="/ja/" />
  <title>Woo Sunmyung</title>
</head>
<body>
  <p><a href="/ja/">日本語ポートフォリオへ / Continue to Japanese portfolio</a></p>
</body>
</html>
`,
);
console.log("wrote out/index.html → /ja/");
