const fs = require("fs");
const path = require("path");
const dir = "./src/components";
const files = fs.readdirSync(dir).filter(f => f.endsWith(".tsx"));

files.forEach(f => {
  const filePath = path.join(dir, f);
  let content = fs.readFileSync(filePath, "utf8");
  let modified = false;
  
  if (content.includes("Ambient White Glow")) {
    const lines = content.split("\n");
    const newLines = lines.filter(line => 
      !line.includes("Ambient White Glow strictly behind the text") &&
      !line.includes("rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.4) 40%") &&
      !line.includes("rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 70%") &&
      !line.includes("rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.7) 40%")
    );
    content = newLines.join("\n");
    modified = true;
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log("Removed glow from", f);
  }
});
