export function generateHtml(svgContent: string): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RITA Visualization</title>
    <style>
        body, html {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            overflow: auto;
            background-color: #f0f0f0;
        }
        .container {
            display: flex;
            justify-content: center;
            align-items: center;
            min-width: 100%;
            min-height: 100%;
            padding: 20px;
            box-sizing: border-box;
        }
        /* Ensure SVG doesn't overflow if we want it contained, 
           but usually visualizations are better scrolled if large.
           The SVG itself defines its size. */
    </style>
</head>
<body>
    <div class="container">
        ${svgContent}
    </div>
</body>
</html>`;
}
