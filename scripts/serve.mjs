import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
const root = path.resolve("out");
const port = Number(process.env.PORT || 3000);
const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "text/javascript",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".txt": "text/plain; charset=utf-8",
  ".ico": "image/x-icon",
};
const exists = async (file) => {
  try {
    return (await stat(file)).isFile();
  } catch {
    return false;
  }
};
if (!(await exists(path.join(root, "index.html")))) {
  console.error("Run npm run build before npm start.");
  process.exit(1);
}
createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(
      new URL(req.url, "http://localhost").pathname,
    );
    const target = path.resolve(root, `.${pathname}`);
    if (!target.startsWith(root + path.sep) && target !== root) {
      res.writeHead(403);
      res.end();
      return;
    }
    const candidates = [
      target,
      path.join(target, "index.html"),
      `${target}.html`,
    ];
    let file;
    for (const candidate of candidates) {
      if (await exists(candidate)) {
        file = candidate;
        break;
      }
    }
    res.statusCode = file ? 200 : 404;
    file ||= path.join(root, "404.html");
    res.setHeader(
      "Content-Type",
      mime[path.extname(file)] || "application/octet-stream",
    );
    res.setHeader("X-Content-Type-Options", "nosniff");
    if (req.method === "HEAD") {
      res.end();
      return;
    }
    if (req.method !== "GET") {
      res.writeHead(405);
      res.end();
      return;
    }
    res.end(await readFile(file));
  } catch {
    res.writeHead(400);
    res.end("Invalid request");
  }
}).listen(port, "127.0.0.1", () =>
  console.log(`StudyFlow is ready at http://localhost:${port}`),
);
