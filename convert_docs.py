import os
import markdown2
from pathlib import Path

# Configuration
DOCS_DIR = './docs'
OUTPUT_DIR = './dist' # Where the HTML files will go
TEMPLATE = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title}</title>
    <!-- Use github-markdown-css for syntax highlighting and table formatting, but override container styles -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.2.0/github-markdown.min.css">
    <style>
        /* Base styles matching index.html */
        body {{
            background-color: #ffffff !important;
            color: #333333;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            margin: 0;
            padding: 20px;
            line-height: 1.6;
        }}
        
        /* Container matching index.html dimensions and flat style */
        .markdown-body {{
            box-sizing: border-box;
            min-width: 200px;
            max-width: 900px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff !important;
        }}
        
        /* Override GitHub link colors to match index.html */
        .markdown-body a {{
            color: #0066cc;
            text-decoration: none;
        }}
        .markdown-body a:hover {{
            text-decoration: underline;
        }}

        /* Code blocks with dark background and light text */
        .markdown-body code {{
            background-color: #1e1e1e !important;
            color: #d4d4d4 !important;
            padding: 2px 6px;
            border-radius: 3px;
        }}
        
        .markdown-body pre {{
            background-color: #1e1e1e !important;
            padding: 16px;
            border-radius: 6px;
            overflow: auto;
        }}
        
        .markdown-body pre code {{
            background-color: transparent !important;
            color: #d4d4d4 !important;
            padding: 0;
        }}
        
        /* Tables with white background */
        .markdown-body table {{
            background-color: #ffffff !important;
            border-collapse: collapse;
        }}
        
        .markdown-body table tr {{
            background-color: #ffffff !important;
            border-top: 1px solid #e0e0e0 !important;
        }}
        
        .markdown-body table tr:nth-child(2n) {{
            background-color: #f5f5f5 !important;
        }}
        
        .markdown-body table th {{
            background-color: #f5f5f5 !important;
            color: #333333 !important;
            padding: 12px;
            text-align: left;
            font-weight: 600;
            border-bottom: 2px solid #e0e0e0;
        }}
        
        .markdown-body table td {{
            color: #333333 !important;
            padding: 15px 12px;
            border-bottom: 1px solid #e0e0e0;
        }}

        @media (max-width: 768px) {{
            body {{
                padding: 10px;
            }}
            .markdown-body {{
                padding: 10px;
            }}
        }}
        
        /* Force white background in light mode */
        @media (prefers-color-scheme: light) {{
            body {{
                background-color: #ffffff !important;
            }}
            .markdown-body {{
                background-color: #ffffff !important;
            }}
        }}
        
        /* Override dark mode with light styles for body and tables, but keep code dark */
        @media (prefers-color-scheme: dark) {{
            body {{
                background-color: #ffffff !important;
                color: #333333 !important;
            }}
            .markdown-body {{
                background-color: #ffffff !important;
                color-scheme: light !important;
            }}
            .markdown-body code {{
                background-color: #1e1e1e !important;
                color: #d4d4d4 !important;
            }}
            .markdown-body pre {{
                background-color: #1e1e1e !important;
            }}
            .markdown-body table th,
            .markdown-body table td {{
                color: #333333 !important;
            }}
        }}
    </style>
</head>
<body class="markdown-body">
    {content}
</body>
</html>
"""

def convert_markdown():
    # Ensure output directory exists
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)

    for path in Path(DOCS_DIR).rglob('*.md'):
        print(f"Converting {path}...")
        
        with open(path, 'r', encoding='utf-8') as f:
            md_content = f.read()
            
        # Convert MD to HTML (supporting tables, code blocks, etc.)
        html_content = markdown2.markdown(md_content, extras=["fenced-code-blocks", "tables", "header-ids"])
        
        # Prepare file paths
        relative_path = path.relative_to(DOCS_DIR)
        output_file = Path(OUTPUT_DIR) / relative_path.with_suffix('.html')
        
        # Ensure subdirectories exist in dist
        output_file.parent.mkdir(parents=True, exist_ok=True)
        
        # Wrap in template
        final_html = TEMPLATE.format(
            title=path.stem.replace('_', ' ').title(),
            content=html_content
        )
        
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(final_html)

    print(f"Done! All documentation converted to {OUTPUT_DIR}")

if __name__ == "__main__":
    convert_markdown()