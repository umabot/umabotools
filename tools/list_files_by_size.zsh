list_files_by_size() {
  setopt localoptions pipefail

  local target_dir="${1:-.}"
  local days_old="${2:--30}"
  local min_size="${3:-+0}"
  local filter_pattern="${4:-.*}"

  [[ "$target_dir" == -* ]] && target_dir="./$target_dir"

  printf "=== Files in '%s' [Modified: %s days, Size: %s, Pattern: '%s'] (Sorted by Size) ===\n" \
    "$target_dir" "$days_old" "$min_size" "$filter_pattern" >&2

  find "$target_dir" -type f -mtime "$days_old" -size "$min_size" \
    -exec stat -f '%z%t%Sm%t%N' -t '%Y-%m-%d %H:%M:%S' {} + |
    sort -k1,1rn |
    LIST_FILES_PATTERN="$filter_pattern" awk -F '\t' '
      BEGIN {
        split("B KB MB GB TB PB", units, " ")
        pattern = ENVIRON["LIST_FILES_PATTERN"]
        if ("" ~ pattern) {}
      }
      {
        path = substr($0, index($0, "\t") + 1)
        path = substr(path, index(path, "\t") + 1)
        if (path !~ pattern) next

        bytes = $1
        total_bytes += bytes
        count++
        u = 1
        while (bytes >= 1024 && u < 6) {
          bytes /= 1024
          u++
        }
        printf "%8.2f %-2s  |  %-19s  |  %s\n", bytes, units[u], $2, path
      }
      END {
        bytes = total_bytes
        u = 1
        while (bytes >= 1024 && u < 6) {
          bytes /= 1024
          u++
        }
        printf "----------------------------------------------------------------------\n" > "/dev/stderr"
        printf "Total files matched: %d  |  Total volume: %.2f %s (%.0f bytes)\n", count, bytes, units[u], total_bytes > "/dev/stderr"
      }
    '
}
