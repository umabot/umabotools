import pytest
from click.testing import CliRunner
from tools.mdproperties.mdproperties import cli
import os
import shutil
from pathlib import Path

@pytest.fixture
def test_file():
    content = """---
PARA: Resource
tags:
  - obsidian
  - howto
---
This is a test file.
"""
    filepath = 'test.md'
    with open(filepath, 'w') as f:
        f.write(content)
    yield filepath
    os.remove(filepath)

@pytest.fixture
def complex_test_file():
    # Source path relative to this test file
    base_path = Path(__file__).parent
    src_path = base_path / 'test' / 'blog_note_test.md'
    
    # Temp destination
    dest_path = 'temp_complex_test.md'
    
    shutil.copy(src_path, dest_path)
    
    yield dest_path
    
    if os.path.exists(dest_path):
        os.remove(dest_path)

def test_read_command(test_file):
    runner = CliRunner()
    result = runner.invoke(cli, ['read', test_file])
    assert result.exit_code == 0
    assert 'PARA: Resource' in result.output
    assert 'obsidian' in result.output

def test_list_command(test_file):
    runner = CliRunner()
    result = runner.invoke(cli, ['list', test_file])
    assert result.exit_code == 0
    assert 'PARA: Resource' in result.output
    assert '0: obsidian' in result.output

def test_add_command(test_file):
    runner = CliRunner()
    result = runner.invoke(cli, ['add', test_file, 'new_prop', 'new_value'], input='y\n')
    assert result.exit_code == 0
    assert 'Changes saved successfully.' in result.output

    with open(test_file, 'r') as f:
        content = f.read()
    assert 'new_prop: new_value' in content

def test_modify_command(test_file):
    runner = CliRunner()
    result = runner.invoke(cli, ['modify', test_file, 'PARA', 'Archived'], input='y\n')
    assert result.exit_code == 0
    assert 'Changes saved successfully.' in result.output


def test_complex_read(complex_test_file):
    runner = CliRunner()
    result = runner.invoke(cli, ['read', complex_test_file])
    assert result.exit_code == 0
    # Check for specific properties from the file
    assert 'PARA: Project' in result.output
    assert 'Finished: true' in result.output
    assert 'Progress: 100' in result.output
    assert 'Start Date:' in result.output

def test_complex_add_tag(complex_test_file):
    runner = CliRunner()
    # Add a new tag 'python' to the tags list
    result = runner.invoke(cli, ['modify', complex_test_file, 'tags', 'python', '--add', 'python'], input='y\n')
    assert result.exit_code == 0
    assert 'Changes saved successfully.' in result.output
    
    # Verify the addition
    result = runner.invoke(cli, ['read', complex_test_file])
    assert 'python' in result.output
    assert 'blog' in result.output  # Ensure original scalar values remain (this test data uses list for tags)

def test_complex_modify_status(complex_test_file):
    runner = CliRunner()
    # Modify the status property
    result = runner.invoke(cli, ['modify', complex_test_file, 'status', 'archived', '--add', 'archived'], input='y\n')
    assert result.exit_code == 0
    
    # Verify
    result = runner.invoke(cli, ['read', complex_test_file])
    assert 'archived' in result.output
    assert 'published' in result.output

def test_complex_remove_tag(complex_test_file):
    runner = CliRunner()
    # Remove 'LinkedIn' from tags (index 1 based on file content)
    # File content: [blog, LinkedIn, presales]
    result = runner.invoke(cli, ['modify', complex_test_file, 'tags', '1', '--remove', '1'], input='y\n')
    assert result.exit_code == 0
    
    # Verify
    result = runner.invoke(cli, ['read', complex_test_file])
    assert 'LinkedIn' not in result.output
    assert 'blog' in result.output
    assert 'presales' in result.output

def test_delete_command(test_file):
    runner = CliRunner()
    result = runner.invoke(cli, ['delete', test_file, 'PARA'], input='y\n')
    assert result.exit_code == 0
    assert 'Changes saved successfully.' in result.output

    with open(test_file, 'r') as f:
        content = f.read()
    assert 'PARA' not in content
