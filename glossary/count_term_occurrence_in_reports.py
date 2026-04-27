# /// script
# requires-python = ">=3.11"
# dependencies = [
#     "pandas",
#     "pymupdf",
#     "tqdm",
# ]
#
# AI Disclosure:
#   This file was created with assistance from ChatGPT (GPT-5.4 Thinking, OpenAI)
#   and then reviewed and modified by the repository author.
# ///
from __future__ import annotations

import argparse
import re
from pathlib import Path
from collections import defaultdict

import fitz  # PyMuPDF
import pandas as pd
from tqdm import tqdm


def load_terms(term_file: Path) -> list[str]:
    """Load one term per line from a UTF-8 text file."""
    with term_file.open("r", encoding="utf-8") as f:
        return [line.strip() for line in f if line.strip()]


def _wrap_boundaries_if_alnum_ends(escaped: str, original: str) -> str:
    """Add word boundaries if original starts/ends with an alnum."""
    starts_alnum = bool(re.match(r"^[A-Za-z0-9]", original))
    ends_alnum = bool(re.match(r".*[A-Za-z0-9]$", original))
    return (r"\b" + escaped + r"\b") if (starts_alnum and ends_alnum) else escaped


_ABBR_RE = re.compile(r"^(.*?)\s*\(([^()]+)\)\s*(.*)$")


def build_term_pattern(term: str) -> re.Pattern:
    """
    If term is "BASE (ABBR) SUFFIX", match:
      - "BASE SUFFIX"
      - "ABBR SUFFIX"  (ABBR standalone)
    If term is "BASE (ABBR)" (no suffix), match:
      - "BASE"
      - standalone "ABBR"
    Else match term literally.
    """
    t = term.strip()
    m = _ABBR_RE.match(t)
    if m:
        base = m.group(1).strip()
        abbr = m.group(2).strip()
        suffix = m.group(3).strip()

        parts: list[str] = []
        if suffix:
            base_suffix = f"{base} {suffix}".strip()
            parts.append(_wrap_boundaries_if_alnum_ends(re.escape(base_suffix), base_suffix))
            parts.append(rf"\b{re.escape(abbr)}\b\s+{re.escape(suffix)}")
        else:
            if base:
                parts.append(_wrap_boundaries_if_alnum_ends(re.escape(base), base))
            parts.append(rf"\b{re.escape(abbr)}\b")

        return re.compile(r"(?:%s)" % "|".join(parts), flags=re.IGNORECASE)

    esc = _wrap_boundaries_if_alnum_ends(re.escape(t), t)
    return re.compile(esc, flags=re.IGNORECASE)


def compile_patterns(terms: list[str]) -> list[re.Pattern]:
    """Compile all term regexes once; index-aligned with terms list."""
    return [build_term_pattern(t) for t in terms]


def scan_repo(repo: Path, terms: list[str], patterns: list[re.Pattern]) -> dict[int, set[str]]:
    """
    Return: term_index -> set of relative report paths containing that term.
    Uses page-by-page early exit per PDF.
    """
    pdfs = sorted(repo.rglob("*.pdf"))
    if not pdfs:
        raise SystemExit(f"No PDFs found under: {repo}")

    term_to_reports_idx: dict[int, set[str]] = defaultdict(set)

    failed_open: list[tuple[str, str]] = []
    no_text: list[str] = []

    for pdf in tqdm(pdfs, desc="Processing PDFs (page-by-page)"):
        rel_path = str(pdf.relative_to(repo))

        try:
            doc = fitz.open(str(pdf))
        except Exception as e:
            failed_open.append((rel_path, repr(e)))
            continue

        remaining = set(range(len(terms)))  # indices not yet found in this PDF
        any_text = False

        try:
            for page in doc:
                page_text = page.get_text("text") or ""
                if page_text.strip():
                    any_text = True

                # iterate only remaining term indices
                for i in list(remaining):
                    if patterns[i].search(page_text):
                        term_to_reports_idx[i].add(rel_path)
                        remaining.remove(i)

                if not remaining:
                    break
        finally:
            doc.close()

        if not any_text:
            no_text.append(rel_path)

    # Write issues file if needed
    if failed_open or no_text:
        issues = []
        for p, err in failed_open:
            issues.append({"PDF": p, "Issue": "failed_open", "Detail": err})
        for p in no_text:
            issues.append({"PDF": p, "Issue": "no_text_extracted", "Detail": ""})
        pd.DataFrame(issues).to_csv("pdf_extraction_issues.csv", index=False)

    return term_to_reports_idx


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Count how many PDF reports contain each term (presence/absence), with abbreviation support."
    )
    parser.add_argument("repo", type=Path, help="Path to the cloned public-pentesting-reports repo")
    parser.add_argument("terms_file", type=Path, help="Path to terms.txt (one term per line)")
    parser.add_argument("--out", type=Path, default=Path("term_report_counts.csv"), help="Output CSV filename")
    parser.add_argument("--sep", default=", ", help="Separator for report paths in CSV (default: ', ')")
    args = parser.parse_args()

    # Suppress noisy MuPDF stderr warnings
    fitz.TOOLS.mupdf_display_errors(False)
    fitz.TOOLS.mupdf_display_warnings(False)

    repo = args.repo.expanduser().resolve()
    terms = load_terms(args.terms_file)
    if not terms:
        raise SystemExit(f"No terms found in: {args.terms_file}")

    patterns = compile_patterns(terms)
    found = scan_repo(repo, terms, patterns)

    rows = []
    for i, term in enumerate(terms):
        reports = sorted(found.get(i, set()))
        rows.append(
            {
                "Term": term,
                "Report Count": len(reports),
                "Reports": args.sep.join(reports),
            }
        )

    df = pd.DataFrame(rows).sort_values(by="Report Count", ascending=False)
    df.to_csv(args.out, index=False)

    print(f"\nWrote: {args.out}")
    if Path("pdf_extraction_issues.csv").exists():
        print("Wrote: pdf_extraction_issues.csv")
    print("\nTop terms:\n")
    print(df.head(30).to_string(index=False))


if __name__ == "__main__":
    main()