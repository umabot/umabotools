# List Files by Size

`list_files_by_size` is a zsh function for macOS that recursively lists regular files, largest first, with their size, modification time, and path. It uses macOS/BSD `find`, `stat`, `sort`, and `awk`; it does not work with GNU `stat` as written.

## Installation

Clone this repository and add the following line to `~/.zshrc`, replacing the path with the actual location of your checkout:

```zsh
source "$HOME/path/to/umabotools/tools/list_files_by_size.zsh"
```

Start a new zsh session or run `source ~/.zshrc`.

## Usage

```zsh
list_files_by_size [directory [days_old [min_size [filter_pattern]]]]
```

| Argument | Default | Description |
|---|---|---|
| `directory` | `.` | Directory to traverse recursively. |
| `days_old` | `-30` | BSD `find -mtime` argument, in completed 24-hour periods. For example, `-30` means less than 30 days old, `30` means 30 completed days, and `+30` means more than 30 completed days. |
| `min_size` | `+0` | BSD `find -size` argument; the default matches nonempty files, not empty files. Examples: `+10M`, `+500k`, and `+1G`. The suffix and rounding semantics are those of macOS `find`. Use `0` to match empty files. |
| `filter_pattern` | `.*` | awk extended regular expression matched against the complete path, not just the filename. |

```zsh
list_files_by_size
list_files_by_size "$HOME/Downloads" -7 +10M '\.(zip|dmg)$'
list_files_by_size "$HOME/Documents" +30 +0 '\.pdf$' > large-pdfs.txt
```

Rows go to stdout; the banner, summary, and errors go to stderr. Sizes use powers of 1024, although labels are `KB`, `MB`, etc. The summary counts only matching files. The function returns a nonzero status on traversal or processing errors; if an error occurs, any output may be incomplete.

File paths containing tabs are supported. Paths containing newline characters cannot be represented reliably by this line-oriented output. Symbolic links are not followed by default.
