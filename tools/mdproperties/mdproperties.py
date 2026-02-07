import click
import frontmatter
import yaml

def load_markdown_file(filepath):
    """Loads a markdown file and its frontmatter."""
    try:
        post = frontmatter.load(filepath)
    except FileNotFoundError:
        click.echo(f"Error: File not found at {filepath}")
        return None

    if not post.metadata:
        post.metadata = {
            'PARA': 'Resource',
            'tags': []
        }
    return post

def save_markdown_file(post, filepath):
    """Saves the markdown file with updated frontmatter after confirmation."""
    if click.confirm('Do you want to save the changes?'):
        with open(filepath, 'w') as f:
            f.write(frontmatter.dumps(post))
        click.echo("Changes saved successfully.")
    else:
        click.echo("Operation cancelled.")

@click.group()
def cli():
    """A command-line tool to manage frontmatter in Obsidian markdown files."""
    pass

@cli.command()
@click.argument('filepath')
def read(filepath):
    """Reads the frontmatter of a markdown file."""
    post = load_markdown_file(filepath)
    if post:
        click.echo(yaml.dump(post.metadata))

@cli.command(name='list')
@click.argument('filepath')
def list_properties(filepath):
    """Lists the properties of a markdown file."""
    post = load_markdown_file(filepath)
    if post:
        for key, value in post.metadata.items():
            if isinstance(value, list):
                click.echo(f"{key}:")
                for i, item in enumerate(value):
                    click.echo(f"  {i}: {item}")
            else:
                click.echo(f"{key}: {value}")

@cli.command()
@click.argument('filepath')
@click.argument('prop')
@click.argument('value')
def add(filepath, prop, value):
    """Adds a new property to the frontmatter."""
    post = load_markdown_file(filepath)
    if not post:
        return

    if prop in post.metadata:
        click.echo(f"Error: Property '{prop}' already exists. Use 'modify' to change it.")
        return

    if ',' in value:
        new_value = [item.strip() for item in value.split(',')]
    else:
        new_value = value

    post.metadata[prop] = new_value
    save_markdown_file(post, filepath)

@cli.command()
@click.argument('filepath')
@click.argument('prop')
@click.argument('value', required=False)
@click.option('--add', 'add_item', help='Adds an item to a list property.')
@click.option('--remove', 'remove_item', help='Removes an item from a list property.')
def modify(filepath, prop, value, add_item, remove_item):
    """Modifies an existing property."""
    post = load_markdown_file(filepath)
    if not post:
        return

    if prop not in post.metadata:
        click.echo(f"Error: Property '{prop}' not found. Use 'add' to create it.")
        return

    if add_item:
        if isinstance(post.metadata[prop], list):
            post.metadata[prop].append(add_item)
        else:
            click.echo(f"Error: Property '{prop}' is not a list.")
            return
    elif remove_item:
        if isinstance(post.metadata[prop], list):
            try:
                # Try to remove by index first
                remove_index = int(remove_item)
                if 0 <= remove_index < len(post.metadata[prop]):
                    del post.metadata[prop][remove_index]
                else:
                    click.echo(f"Error: Index {remove_index} is out of range for '{prop}'.")
                    return
            except ValueError:
                # If it's not an integer, try to remove by value
                if remove_item in post.metadata[prop]:
                    post.metadata[prop].remove(remove_item)
                else:
                    click.echo(f"Error: Item '{remove_item}' not found in '{prop}'.")
                    return
        else:
            click.echo(f"Error: Property '{prop}' is not a list.")
            return
    elif value is not None:
        if ',' in value:
            new_value = [item.strip() for item in value.split(',')]
        else:
            new_value = value
        post.metadata[prop] = new_value
    else:
        click.echo("Error: No modification specified. Use a new value, --add, or --remove.")
        return

    save_markdown_file(post, filepath)

@cli.command()
@click.argument('filepath')
@click.argument('prop')
def delete(filepath, prop):
    """Deletes a property from the frontmatter."""
    post = load_markdown_file(filepath)
    if not post:
        return

    if prop not in post.metadata:
        click.echo(f"Error: Property '{prop}' not found.")
        return

    del post.metadata[prop]
    save_markdown_file(post, filepath)

if __name__ == "__main__":
    cli()
