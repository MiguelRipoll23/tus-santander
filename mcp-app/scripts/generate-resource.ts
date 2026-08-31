import { promises as fs } from "fs";
import path from "path";

// Emits the widget component as a single main.html served by the backend MCP
// server (backend/static/widgets/estimations/main.html).
const dist = path.resolve("dist", "assets");
const backendResourcePath = path.resolve(
  "../backend/static/widgets/estimations/main.html"
);

try {
  await fs.access(dist);
} catch {
  console.error("❌ Assets directory does not exist. Aborting.");
  process.exit(1);
}

const files = await fs.readdir(dist);
const cssFiles = files.filter((f) => f.endsWith(".css"));
const jsFiles = files.filter((f) => f.endsWith(".js"));

if (cssFiles.length === 0 || jsFiles.length === 0) {
  console.warn("⚠️ No CSS or JS files found. Nothing to do.");
  process.exit(0);
}

// pick the first CSS and first JS (or you could loop all if multiple)
const cssFile = cssFiles[0];
const jsFile = jsFiles[0];

console.log(`📁 Assets:\n- ${cssFile}\n- ${jsFile}`);

try {
  const [css, js] = await Promise.all([
    fs.readFile(path.join(dist, cssFile), "utf8"),
    fs.readFile(path.join(dist, jsFile), "utf8"),
  ]);

  const mainHtml = `<div id="root"></div>
<style>${css}</style>
<script type="module">${js}</script>`;

  await Promise.all([
    fs.writeFile(path.join(dist, "main.html"), mainHtml),
    fs.writeFile(backendResourcePath, mainHtml),
  ]);

  console.log(`✅ Generated main.html (dist + ${backendResourcePath})`);
} catch (error) {
  if (error instanceof Error) {
    console.warn(`⚠️ Failed to generate main.html: ${error.message}`);
  } else {
    console.warn("⚠️ Failed to generate main.html:", error);
  }
}
