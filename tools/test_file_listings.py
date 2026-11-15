import os
from pathlib import Path
import subprocess
import sys
import tempfile
import time
import unittest


TOOLS = Path(__file__).resolve().parent


@unittest.skipUnless(sys.platform == "darwin", "Requires macOS/BSD find and stat")
class FileListingTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.directory = self.root / "-files"
        self.directory.mkdir()
        now = time.time()
        for name, size, age in (
            ("large.txt", 2048, 200),
            ("new.txt", 20, 100),
            ("with\ttab.txt", 1, 150),
            ("empty.txt", 0, 50),
            ("old.txt", 30, 45 * 86400),
        ):
            file = self.directory / name
            file.write_bytes(b"x" * size)
            os.utime(file, (now - age, now - age))
        (self.directory / "link.txt").symlink_to(self.directory / "large.txt")

    def run_listing(self, name, *args):
        return subprocess.run(
            [
                "zsh",
                "-f",
                "-c",
                f'source "$1"; shift; {name} "$@"',
                "test",
                str(TOOLS / f"{name}.zsh"),
                *args,
            ],
            cwd=self.root,
            capture_output=True,
            text=True,
        )

    def test_size_defaults_order_summary_and_empty_exclusion(self):
        result = self.run_listing("list_files_by_size", "-files")
        self.assertEqual(result.returncode, 0, result.stderr)
        rows = result.stdout.splitlines()
        self.assertEqual(len(rows), 3)
        self.assertTrue(rows[0].endswith("/large.txt"))
        self.assertTrue(rows[1].endswith("/new.txt"))
        self.assertTrue(rows[2].endswith("/with\ttab.txt"))
        self.assertIn("Total files matched: 3", result.stderr)
        self.assertIn("(2069 bytes)", result.stderr)
        self.assertNotIn("Total files", result.stdout)

    def test_default_directory(self):
        for name, count in (("list_files_by_size", 3), ("list_files_by_date", 4)):
            with self.subTest(name=name):
                result = self.run_listing(name)
                self.assertEqual(result.returncode, 0, result.stderr)
                self.assertEqual(len(result.stdout.splitlines()), count)
                self.assertIn("./-files/", result.stdout)

    def test_size_filter_empty_and_age(self):
        result = self.run_listing(
            "list_files_by_size", str(self.directory), "-30", "+1k", r"\.txt$"
        )
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(len(result.stdout.splitlines()), 1)
        self.assertIn("large.txt", result.stdout)
        empty = self.run_listing(
            "list_files_by_size", str(self.directory), "-30", "0", "empty"
        )
        self.assertEqual(empty.returncode, 0, empty.stderr)
        self.assertIn("empty.txt", empty.stdout)
        old = self.run_listing(
            "list_files_by_size", str(self.directory), "+30", "+0", r"\.txt$"
        )
        self.assertEqual(old.returncode, 0, old.stderr)
        self.assertEqual(len(old.stdout.splitlines()), 1)
        self.assertIn("old.txt", old.stdout)

    def test_date_defaults_order_summary_and_empty_inclusion(self):
        result = self.run_listing("list_files_by_date", str(self.directory))
        self.assertEqual(result.returncode, 0, result.stderr)
        rows = result.stdout.splitlines()
        self.assertEqual(len(rows), 4)
        for row, name in zip(rows, ("empty.txt", "new.txt", "with\ttab.txt", "large.txt")):
            self.assertTrue(row.endswith("/" + name), row)
        self.assertIn("Total files matched: 4", result.stderr)
        self.assertIn("(2069 bytes)", result.stderr)
        self.assertNotIn("Total files", result.stdout)

    def test_date_regex_filter(self):
        result = self.run_listing(
            "list_files_by_date", str(self.directory), "-30", r"with.tab\.txt$"
        )
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(len(result.stdout.splitlines()), 1)
        self.assertIn("with\ttab.txt", result.stdout)
        self.assertIn("Total files matched: 1", result.stderr)

    def test_errors_are_nonzero(self):
        for name in ("list_files_by_size", "list_files_by_date"):
            with self.subTest(name=name, error="missing directory"):
                result = self.run_listing(name, str(self.root / "missing"))
                self.assertNotEqual(result.returncode, 0)
                self.assertIn("No such file", result.stderr)
            with self.subTest(name=name, error="invalid regex"):
                args = [str(self.directory), "-30"]
                if name == "list_files_by_size":
                    args.append("+0")
                result = self.run_listing(name, *args, "[")
                self.assertNotEqual(result.returncode, 0)
                self.assertIn("awk:", result.stderr)
        result = self.run_listing(
            "list_files_by_size", str(self.directory), "-30", "not-a-size"
        )
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("find:", result.stderr)


if __name__ == "__main__":
    unittest.main()
