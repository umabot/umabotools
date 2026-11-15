# List Files by Date

`list_files_by_date` is a zsh function for macOS that recursively lists regular files, newest modification time first, with their timestamp, size, and path. It uses macOS/BSD `find`, `stat`, `sort`, and `awk`; it does not work with GNU `stat` as written.

## Installation

Clone this repository and add the following line to `~/.zshrc`, replacing the path with the actual location of your checkout:

```zsh
source "$HOME/path/to/umabotools/tools/list_files_by_date.zsh"
```

Start a new zsh session or run `source ~/.zshrc`.

## Usage

```zsh
list_files_by_date [directory [days_old [filter_pattern]]]
```

| Argument | Default | Description |
|---|---|---|
| `directory` | `.` | Directory to traverse recursively. |
| `days_old` | `-30` | BSD `find -mtime` argument, in completed 24-hour periods. For example, `-30` means less than 30 days old, `30` means 30 completed days, and `+30` means more than 30 completed days. |
| `filter_pattern` | `.*` | awk extended regular expression matched against the complete path, not just the filename. |

```zsh
list_files_by_date
list_files_by_date "$HOME/Documents" -7 '\.(md|txt)$'
list_files_by_date "$HOME/Downloads" +30 '.*' > older-files.txt
```

Rows go to stdout; the banner, summary, and errors go to stderr. Sizes use powers of 1024, although labels are `KB`, `MB`, etc. Empty files are included. The summary counts only matching files. The function returns a nonzero status on traversal or processing errors; if an error occurs, any output may be incomplete.

File paths containing tabs are supported. Paths containing newline characters cannot be represented reliably by this line-oriented output. Symbolic links are not followed by default.
