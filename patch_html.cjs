const fs = require('fs');
const indexHtmlPath = __dirname + '/index.html';
let html = fs.readFileSync(indexHtmlPath, 'utf8');

const gradientCss = `
        /* Campuran / Mixed Gradient */
        .text-accent {
            background: linear-gradient(135deg, #00f2fe 0%, #4facfe 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            color: transparent;
        }
        .bg-accent {
            background: linear-gradient(135deg, #00f2fe 0%, #4facfe 100%) !important;
            color: white !important;
        }
        .border-accent {
            border-color: #00f2fe !important;
        }
        .accent-glow {
            box-shadow: 0 0 20px rgba(0, 242, 254, 0.4) !important;
        }
        .group:hover .group-hover\\:text-accent {
            background: linear-gradient(135deg, #00f2fe 0%, #4facfe 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            color: transparent;
        }
        .group:hover .group-hover\\:bg-accent {
            background: linear-gradient(135deg, #00f2fe 0%, #4facfe 100%) !important;
            color: white !important;
        }
        .group:hover .group-hover\\:border-accent {
            border-color: #00f2fe !important;
        }
        .hover\\:text-accent:hover {
            background: linear-gradient(135deg, #00f2fe 0%, #4facfe 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            color: transparent;
        }
`;

if (!html.includes('.text-accent {')) {
    html = html.replace('</style>', gradientCss + '</style>');
    fs.writeFileSync(indexHtmlPath, html);
    console.log('Patched index.html with gradient css!');
} else {
    console.log('Already patched.');
}
