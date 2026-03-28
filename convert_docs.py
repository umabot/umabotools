import os
import markdown2
from pathlib import Path
import re
import shutil

# Configuration
DOCS_DIR = './docs'
OUTPUT_DIR = './dist'
SNIPPETS_DIR = './assets/snippets'
INDEX_MD = './index.md'
INDEX_HTML = './index.html'
TRANSLATE_SCRIPT_SOURCE = './assets/js/google_translate_header.js'
TRANSLATE_SCRIPT_DIST = './dist/assets/js/google_translate_header.js'
DIST_INDEX_HTML = './dist/index.html'

# Landing page template (for index.html)
LANDING_TEMPLATE = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title}</title>
    <style>
        /* Reset */
        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}
        
        /* Base styles */
        body {{
            background-color: #ffffff;
            color: #333333;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            padding: 20px;
            line-height: 1.6;
        }}
        
        /* Header with logo */
        .header {{
            text-align: center;
            margin-bottom: 40px;
        }}
        
        .header img {{
            max-width: 200px;
            height: auto;
            margin-bottom: 20px;
        }}
        
        .logo {{
            height: 38px;
            width: auto;
            margin-bottom: 20px;
        }}

        /* Translation header */
        .translate-header {{
            max-width: 900px;
            margin: 0 auto 12px;
            padding: 10px 20px;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            background-color: #fafafa;
        }}

        .translate-header-inner {{
            display: flex;
            align-items: center;
            gap: 8px;
            flex-wrap: wrap;
        }}

        .translate-label {{
            font-size: 14px;
            font-weight: 600;
            color: #333333;
            margin-right: 4px;
        }}

        .translate-btn {{
            border: 1px solid #d0d0d0;
            background-color: #ffffff;
            color: #333333;
            border-radius: 999px;
            padding: 4px 12px;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
        }}

        .translate-btn:hover {{
            border-color: #b5b5b5;
            background-color: #f5f5f5;
        }}

        .translate-btn.active {{
            border-color: #0066cc;
            background-color: #0066cc;
            color: #ffffff;
        }}

        .translate-status {{
            font-size: 12px;
            color: #666666;
            margin-left: 8px;
        }}

        .translate-hidden-widget,
        .skiptranslate.goog-te-gadget,
        .goog-te-banner-frame.skiptranslate {{
            position: absolute !important;
            left: -9999px !important;
            width: 1px !important;
            height: 1px !important;
            overflow: hidden !important;
            opacity: 0 !important;
            pointer-events: none !important;
        }}

        #google_translate_element {{
            min-height: 1px;
        }}

        body {{
            top: 0 !important;
        }}
        
        /* Main container */
        .container {{
            max-width: 900px;
            margin: 0 auto;
            padding: 20px;
        }}
        
        /* Headings */
        h1 {{
            color: #000000;
            font-size: 32px;
            margin-bottom: 20px;
            font-weight: 600;
        }}
        
        h2 {{
            color: #000000;
            font-size: 24px;
            margin-top: 40px;
            margin-bottom: 20px;
            font-weight: 600;
        }}
        
        /* Description text */
        .description {{
            font-size: 16px;
            margin-bottom: 30px;
            line-height: 1.8;
        }}
        
        /* Horizontal rule */
        hr {{
            border: none;
            border-top: 1px solid #e0e0e0;
            margin: 40px 0;
        }}
        
        /* Links */
        a {{
            color: #0066cc;
            text-decoration: none;
        }}
        
        a:hover {{
            text-decoration: underline;
        }}
        
        /* Table styles */
        table {{
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }}
        
        thead {{
            background-color: #f5f5f5;
        }}
        
        th {{
            text-align: left;
            padding: 15px 12px;
            font-weight: 600;
            color: #333333;
            border-bottom: 2px solid #e0e0e0;
        }}
        
        td {{
            padding: 15px 12px;
            border-bottom: 1px solid #f0f0f0;
            vertical-align: top;
        }}
        
        tr:hover {{
            background-color: #f9f9f9;
        }}
        
        /* Footer */
        .footer {{
            margin-top: 60px;
            padding-top: 40px;
            border-top: 1px solid #e0e0e0;
            text-align: center;
            font-size: 14px;
            color: #666666;
        }}
        
        .footer p {{
            margin: 10px 0;
        }}
        
        .footer em {{
            color: #888888;
            font-style: normal;
        }}
        
        /* Responsive */
        @media (max-width: 768px) {{
            body {{
                padding: 10px;
            }}

            .translate-header {{
                padding: 10px;
                margin-bottom: 10px;
            }}
            
            .container {{
                padding: 10px;
            }}
            
            h1 {{
                font-size: 26px;
            }}
            
            h2 {{
                font-size: 20px;
            }}
            
            table {{
                font-size: 14px;
            }}
            
            th, td {{
                padding: 10px 8px;
            }}
        }}
        
        @media (max-width: 480px) {{
            h1 {{
                font-size: 22px;
            }}

            .translate-label {{
                width: 100%;
                margin-right: 0;
            }}
            
            h2 {{
                font-size: 18px;
            }}
            
            table {{
                font-size: 13px;
            }}
            
            th, td {{
                padding: 8px 6px;
            }}
        }}
    </style>
</head>
<body>
    <div class="translate-header" data-translate-root data-storage-key="umabot_lang_pref" data-page-language="en" data-included-languages="en,es,fr">
        <div class="translate-header-inner">
            <span class="translate-label">Language:</span>
            <button type="button" class="translate-btn" data-lang="en">EN</button>
            <button type="button" class="translate-btn" data-lang="es">ES</button>
            <button type="button" class="translate-btn" data-lang="fr">FR</button>
            <span class="translate-status" aria-live="polite"></span>
        </div>
        <div id="google_translate_element" class="translate-hidden-widget" aria-hidden="true"></div>
    </div>
    <div class="container">
        {content}
    </div>
    <script src="./assets/js/google_translate_header.js"></script>
    <script src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>
</body>
</html>
"""

# Documentation template (for docs)
DOCS_TEMPLATE = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title}</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.2.0/github-markdown.min.css">
    <style>
        body {{
            background-color: #ffffff !important;
            color: #333333;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            margin: 0;
            padding: 20px;
            line-height: 1.6;
        }}
        
        .markdown-body {{
            box-sizing: border-box;
            min-width: 200px;
            max-width: 900px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff !important;
        }}
        
        .markdown-body a {{
            color: #0066cc;
            text-decoration: none;
        }}
        .markdown-body a:hover {{
            text-decoration: underline;
        }}

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

        /* Translation header */
        .translate-header {{
            max-width: 900px;
            margin: 0 auto 12px;
            padding: 10px 20px;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            background-color: #fafafa;
        }}

        .translate-header-inner {{
            display: flex;
            align-items: center;
            gap: 8px;
            flex-wrap: wrap;
        }}

        .translate-label {{
            font-size: 14px;
            font-weight: 600;
            color: #333333;
            margin-right: 4px;
        }}

        .translate-btn {{
            border: 1px solid #d0d0d0;
            background-color: #ffffff;
            color: #333333;
            border-radius: 999px;
            padding: 4px 12px;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
        }}

        .translate-btn:hover {{
            border-color: #b5b5b5;
            background-color: #f5f5f5;
        }}

        .translate-btn.active {{
            border-color: #0066cc;
            background-color: #0066cc;
            color: #ffffff;
        }}

        .translate-status {{
            font-size: 12px;
            color: #666666;
            margin-left: 8px;
        }}

        .translate-hidden-widget,
        .skiptranslate.goog-te-gadget,
        .goog-te-banner-frame.skiptranslate {{
            position: absolute !important;
            left: -9999px !important;
            width: 1px !important;
            height: 1px !important;
            overflow: hidden !important;
            opacity: 0 !important;
            pointer-events: none !important;
        }}

        #google_translate_element {{
            min-height: 1px;
        }}

        body {{
            top: 0 !important;
        }}

        @media (max-width: 768px) {{
            body {{
                padding: 10px;
            }}

            .translate-header {{
                padding: 10px;
                margin-bottom: 10px;
            }}

            .translate-label {{
                width: 100%;
                margin-right: 0;
            }}

            .markdown-body {{
                padding: 10px;
            }}
        }}
        
        @media (prefers-color-scheme: light) {{
            body {{
                background-color: #ffffff !important;
            }}
            .markdown-body {{
                background-color: #ffffff !important;
            }}
        }}
        
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
    <div class="translate-header" data-translate-root data-storage-key="umabot_lang_pref" data-page-language="en" data-included-languages="en,es,fr">
        <div class="translate-header-inner">
            <span class="translate-label">Language:</span>
            <button type="button" class="translate-btn" data-lang="en">EN</button>
            <button type="button" class="translate-btn" data-lang="es">ES</button>
            <button type="button" class="translate-btn" data-lang="fr">FR</button>
            <span class="translate-status" aria-live="polite"></span>
        </div>
        <div id="google_translate_element" class="translate-hidden-widget" aria-hidden="true"></div>
    </div>
    {content}
    <script src="{translate_script_src}"></script>
    <script src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>
</body>
</html>
"""


def to_posix_path(path_obj):
    """Return a path using forward slashes for HTML links."""
    return str(path_obj).replace(os.sep, '/')


def compute_relative_url(from_file, to_file):
    """Compute relative URL from one file path to another."""
    return to_posix_path(Path(os.path.relpath(to_file, start=from_file.parent)))


def ensure_dist_support_files(index_converted):
    """Copy shared translation script and landing page into dist for self-contained docs."""
    translate_source = Path(TRANSLATE_SCRIPT_SOURCE)
    translate_target = Path(TRANSLATE_SCRIPT_DIST)
    translate_target.parent.mkdir(parents=True, exist_ok=True)

    if translate_source.exists():
        shutil.copy2(translate_source, translate_target)
        print(f"✓ Copied translation helper to {translate_target}")
    else:
        print(f"⊘ Translation helper not found at {translate_source}")

    if index_converted and Path(INDEX_HTML).exists():
        dist_index_target = Path(DIST_INDEX_HTML)
        dist_index_target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(Path(INDEX_HTML), dist_index_target)
        print(f"✓ Copied landing page to {dist_index_target}")

def load_snippet(snippet_name):
    """Load a markdown snippet from the snippets directory."""
    snippet_path = Path(SNIPPETS_DIR) / f"{snippet_name}.md"
    if snippet_path.exists():
        with open(snippet_path, 'r', encoding='utf-8') as f:
            return f.read()
    return ""

def parse_frontmatter(content):
    """Extract YAML frontmatter from markdown content."""
    frontmatter_pattern = r'^---\s*\n(.*?)\n---\s*\n'
    match = re.match(frontmatter_pattern, content, re.DOTALL)
    
    if match:
        frontmatter_text = match.group(1)
        body = content[match.end():]
        
        metadata = {}
        for line in frontmatter_text.strip().split('\n'):
            if ':' in line:
                key, value = line.split(':', 1)
                metadata[key.strip()] = value.strip().lower() == 'true' if value.strip().lower() in ['true', 'false'] else value.strip()
        
        return metadata, body
    
    return {}, content

def convert_index():
    """Convert index.md to index.html using landing page template."""
    if not Path(INDEX_MD).exists():
        print("⊘ index.md not found, skipping index generation")
        return False
    
    print("Converting index.md → index.html...")
    
    with open(INDEX_MD, 'r', encoding='utf-8') as f:
        md_content = f.read()
    
    # Parse frontmatter
    metadata, body = parse_frontmatter(md_content)
    
    # Convert to HTML
    html_content = markdown2.markdown(body, extras=["fenced-code-blocks", "tables", "header-ids"])
    
    # Add class="logo" to logo image for styling
    html_content = re.sub(
        r'<img src="assets/images/logo\.png"([^>]*)>',
        r'<img src="assets/images/logo.png" class="logo"\1>',
        html_content
    )
    
    # Apply landing page template
    final_html = LANDING_TEMPLATE.format(
        title=metadata.get('title', 'Umabot Tools - Landing Page'),
        content=html_content
    )
    
    # Write to root
    with open(INDEX_HTML, 'w', encoding='utf-8') as f:
        f.write(final_html)
    
    print(f"✓ Created {INDEX_HTML}")
    return True

def convert_docs():
    """Convert documentation markdown files with snippets."""
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)

    # Load reusable snippets
    header_snippet = load_snippet('doc-header')
    footer_snippet = load_snippet('doc-footer')

    skipped_files = []
    converted_files = []

    for path in Path(DOCS_DIR).rglob('*.md'):
        with open(path, 'r', encoding='utf-8') as f:
            md_content = f.read()
        
        # Parse frontmatter
        metadata, body = parse_frontmatter(md_content)
        
        # Check if file should be skipped
        if metadata.get('skip_conversion') or metadata.get('draft'):
            print(f"⊘ Skipping {path} (skip_conversion={metadata.get('skip_conversion')}, draft={metadata.get('draft')})")
            skipped_files.append(path)
            continue
        
        print(f"Converting {path}...")
        
        # Prepare file paths
        relative_path = path.relative_to(DOCS_DIR)
        output_file = Path(OUTPUT_DIR) / relative_path.with_suffix('.html')

        # Resolve per-page links inside dist so docs remain self-contained.
        dist_index_target = Path(DIST_INDEX_HTML)
        translate_script_target = Path(TRANSLATE_SCRIPT_DIST)
        home_link = compute_relative_url(output_file, dist_index_target)
        translate_script_src = compute_relative_url(output_file, translate_script_target)

        resolved_header_snippet = header_snippet.replace('../../index.html', home_link)
        
        # Ensure subdirectories exist
        output_file.parent.mkdir(parents=True, exist_ok=True)

        # Inject header and footer snippets
        full_markdown = f"{resolved_header_snippet}\n\n{body}\n\n{footer_snippet}"

        # Convert to HTML
        html_content = markdown2.markdown(full_markdown, extras=["fenced-code-blocks", "tables", "header-ids"])
        
        # Apply documentation template
        final_html = DOCS_TEMPLATE.format(
            title=metadata.get('title', path.stem.replace('_', ' ').title()),
            content=html_content,
            translate_script_src=translate_script_src
        )
        
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(final_html)
        
        converted_files.append(path)

    print(f"\n✓ Converted {len(converted_files)} documentation file(s)")
    if skipped_files:
        print(f"⊘ Skipped {len(skipped_files)} file(s)")
    
    return len(converted_files)

def main():
    """Main conversion workflow."""
    print("=" * 60)
    print("Umabotools Documentation Converter")
    print("=" * 60)
    
    # Convert index.md to index.html
    index_converted = convert_index()

    # Copy root-level support files into dist for self-contained docs.
    ensure_dist_support_files(index_converted)
    
    print()
    
    # Convert documentation files
    docs_converted = convert_docs()
    
    print()
    print("=" * 60)
    print(f"✓ Conversion complete!")
    if index_converted:
        print(f"  - index.html generated")
    print(f"  - {docs_converted} documentation page(s) in {OUTPUT_DIR}")
    print("=" * 60)

if __name__ == "__main__":
    main()
