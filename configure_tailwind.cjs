const fs = require('fs');
const path = require('path');

const indexHtmlPath = path.join(__dirname, 'index.html');
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

if (!indexHtml.includes('tailwind.config')) {
    const configScript = `
    <script>
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              accent: {
                DEFAULT: '#8b5cf6', // Violet
                hover: '#a78bfa',
                glow: 'rgba(139, 92, 246, 0.5)'
              }
            }
          }
        }
      }
    </script>
    `;
    indexHtml = indexHtml.replace('</head>', configScript + '\n</head>');
    fs.writeFileSync(indexHtmlPath, indexHtml);
}

const dirs = [__dirname, path.join(__dirname, 'components')];
dirs.forEach(dir => {
    fs.readdirSync(dir).forEach(file => {
        if (file.endsWith('.tsx')) {
            const filePath = path.join(dir, file);
            let content = fs.readFileSync(filePath, 'utf8');
            // Replace various hardcoded colors with tokens
            content = content.replace(/\[#d4ff00\]/g, 'accent');
            content = content.replace(/rgba\(212,\s*255,\s*0,\s*0\.5\)/g, 'accent-glow');
            content = content.replace(/rgba\(212,\s*255,\s*0,\s*0\.2\)/g, 'accent-glow');
            fs.writeFileSync(filePath, content);
        }
    });
});
console.log('Done configuring tailwind and replacing hex values with semantic tokens.');
