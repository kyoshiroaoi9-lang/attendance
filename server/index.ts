import express from "express";
import path from "node:path";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { createServer as createViteServer } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const clientDir = path.resolve(rootDir, "client");
const distDir = path.resolve(rootDir, "dist", "public");

const app = express();
const port = Number(process.env.PORT) || 5000;

if (process.env.NODE_ENV !== "production") {
  const vite = await createViteServer({
    root: clientDir,
    server: { middlewareMode: true },
    appType: "custom",
  });

  app.use(vite.middlewares);

  app.get(/.*/, async (req, res, next) => {
    try {
      const url = req.originalUrl;
      const template = await fs.readFile(
        path.join(clientDir, "index.html"),
        "utf-8",
      );
      const html = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (error) {
      next(error);
    }
  });
} else {
  app.use(express.static(distDir));
  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(distDir, "index.html"));
  });
}

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
