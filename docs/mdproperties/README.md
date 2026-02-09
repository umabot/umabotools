# mdproperties - Markdown Frontmatter Manager

A command-line tool to manage YAML frontmatter properties in Obsidian markdown files. This utility provides a simple interface to read, add, modify, and delete properties from markdown file headers without manually editing the frontmatter block.

## Features

### Core Operations

- **Read**: Display all frontmatter properties in YAML format
- **List**: Show properties in a human-readable format with indexed list items
- **Add**: Create new properties with single values or comma-separated lists
- **Modify**: Update existing properties or manage list items
- **Delete**: Remove properties from the frontmatter

### Smart Property Management

- **Automatic List Handling**: Comma-separated values are automatically converted to YAML lists
- **List Operations**: Add or remove items from list properties by index or value
- **Safe Defaults**: Creates default frontmatter structure if none exists (PARA: Resource, tags: [])
- **Confirmation Prompts**: Requires user confirmation before saving changes

## Installation

This tool uses `uv` for Python dependency management.

```bash
# Navigate to the project root
cd /path/to/umabotools

# Install dependencies with uv
uv sync

# Run the tool
uv run python tools/mdproperties/mdproperties.py --help
```

### Dependencies

- **click** - Command-line interface framework
- **python-frontmatter** - YAML frontmatter parser
- **pyyaml** - YAML serialization/deserialization

All dependencies are managed in `pyproject.toml`.

## Usage

### Read Frontmatter

Display all properties in YAML format:

```bash
uv run python tools/mdproperties/mdproperties.py read path/to/file.md
```

**Example output:**
```yaml
PARA: Resource
tags:
  - obsidian
  - howto
status: published
```

### List Properties

Show properties in a friendly format with indexed lists:

```bash
uv run python tools/mdproperties/mdproperties.py list path/to/file.md
```

**Example output:**
```
PARA: Resource
tags:
  0: obsidian
  1: howto
status: published
```

### Add Property

Create a new property. Comma-separated values become lists:

```bash
# Add a single value
uv run python tools/mdproperties/mdproperties.py add path/to/file.md author "John Doe"

# Add a list (comma-separated)
uv run python tools/mdproperties/mdproperties.py add path/to/file.md keywords "python, cli, obsidian"
```

**Note**: The command will fail if the property already exists. Use `modify` instead.

### Modify Property

Update existing properties or manage list items:

#### Replace Entire Property

```bash
# Change a single value
uv run python tools/mdproperties/mdproperties.py modify path/to/file.md PARA "Project"

# Replace with a list
uv run python tools/mdproperties/mdproperties.py modify path/to/file.md tags "new-tag1, new-tag2"
```

#### Add to List

```bash
uv run python tools/mdproperties/mdproperties.py modify path/to/file.md tags --add "python"
```

#### Remove from List

```bash
# Remove by value
uv run python tools/mdproperties/mdproperties.py modify path/to/file.md tags --remove "python"

# Remove by index
uv run python tools/mdproperties/mdproperties.py modify path/to/file.md tags --remove 0
```

### Delete Property

Remove a property entirely from the frontmatter:

```bash
uv run python tools/mdproperties/mdproperties.py delete path/to/file.md deprecated_field
```

## PARA System Integration

The tool includes built-in support for the PARA method (Projects, Areas, Resources, Archives) commonly used in Obsidian knowledge management:

- Default `PARA` property is set to "Resource" when creating new frontmatter
- Empty `tags` array is created by default
- Easily modify PARA categories with the `modify` command

## Example Workflow

```bash
# Create a new blog post with metadata
uv run python tools/mdproperties/mdproperties.py add blog.md PARA "Project"
uv run python tools/mdproperties/mdproperties.py add blog.md tags "blog, writing"
uv run python tools/mdproperties/mdproperties.py add blog.md status "draft"

# Update as you progress
uv run python tools/mdproperties/mdproperties.py modify blog.md status "review"
uv run python tools/mdproperties/mdproperties.py modify blog.md tags --add "published"

# Check your work
uv run python tools/mdproperties/mdproperties.py list blog.md
```

## Technical Details

### File Format

The tool works with standard YAML frontmatter delimited by `---`:

```markdown
---
PARA: Resource
tags:
  - obsidian
  - productivity
status: active
---

# Your Markdown Content

Regular markdown content goes here.
```

### Error Handling

- **File Not Found**: Clear error message with filepath
- **Property Exists**: Prevents accidental overwrites when using `add`
- **Property Not Found**: Warns when trying to modify/delete non-existent properties
- **Invalid List Operations**: Validates index ranges and value existence
- **Confirmation Required**: All changes require user confirmation before saving

### Testing

The project includes comprehensive test coverage using pytest:

```bash
# Run tests
uv run pytest tools/mdproperties/test_mdproperties.py
```

Tests cover:
- Basic CRUD operations
- Complex frontmatter structures
- List operations (add/remove by index and value)
- Error conditions
- Confirmation workflows

## Use Cases

### Obsidian Vault Management

- Bulk update project status across multiple notes
- Add or remove tags systematically
- Standardize metadata across your vault
- Automate note categorization

### Documentation Projects

- Manage document properties (author, date, version)
- Track document lifecycle (draft → review → published)
- Add cross-references and metadata
- Maintain consistent frontmatter structure

### Blog Post Management

- Track publication status
- Manage categories and tags
- Store URLs and references
- Update post metadata efficiently

## Command Reference

| Command | Purpose | Example |
|---------|---------|---------|
| `read` | Display YAML frontmatter | `read file.md` |
| `list` | Show indexed properties | `list file.md` |
| `add` | Create new property | `add file.md key value` |
| `modify` | Update property | `modify file.md key value` |
| `modify --add` | Add to list | `modify file.md tags --add newtag` |
| `modify --remove` | Remove from list | `modify file.md tags --remove 0` |
| `delete` | Remove property | `delete file.md key` |

## GitHub Repository

Full source code: [umabotools/tools/mdproperties](https://github.com/umabot/umabotools/tree/main/tools/mdproperties)

