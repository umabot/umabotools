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
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.2.0/github-markdown.min.css">
    <style>
        body {{
            box-sizing: border-box;
            min-width: 200px;
            max-width: 980px;
            margin: 0 auto;
            padding: 45px;
            background-color: #f6f8fa;
        }}
        .markdown-body {{
            background-color: white;
            padding: 40px;
            border: 1px solid #d0d7de;
            border-radius: 6px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }}
        @media (max-width: 767px) {{
            .markdown-body {{
                padding: 15px;
            }}
            body {{
                padding: 15px;
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