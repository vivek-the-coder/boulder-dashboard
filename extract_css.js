const fs = require('fs');
const html = fs.readFileSync('version6_updated.html', 'utf8');
const cssBlocks = [...html.matchAll(/<style>([\s\S]*?)<\/style>/g)];
const combinedCss = cssBlocks.map(m => m[1]).join('\n\n/* ----- NEW STYLE BLOCK ----- */\n\n');

const prepend = `@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&display=swap');\n@import "tailwindcss";\n\n`;

fs.writeFileSync('buyout-dashboard/src/app/globals.css', prepend + combinedCss);
console.log("Extracted " + cssBlocks.length + " style blocks.");
