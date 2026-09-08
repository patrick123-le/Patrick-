#!/usr/bin/env python3
"""Extract Word-embedded mind maps and map them to the matching work IDs."""

from __future__ import annotations

import io
import json
import re
import sys
import zipfile
from pathlib import Path
from xml.etree import ElementTree as ET

from PIL import Image


SITE_ROOT = Path(__file__).resolve().parents[1]
PROJECT_ROOT = SITE_ROOT.parent
DOCX_PATH = PROJECT_ROOT / "法务面经 副本-编辑版.docx"
WORKS_PATH = SITE_ROOT / "content" / "works.json"
MAPPING_PATH = SITE_ROOT / "content" / "mindmaps.json"
OUTPUT_DIR = SITE_ROOT / "public" / "mindmaps"

NS = {
    "w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main",
    "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
    "pr": "http://schemas.openxmlformats.org/package/2006/relationships",
}
R_EMBED = f"{{{NS['r']}}}embed"
R_ID = f"{{{NS['r']}}}id"


def heading_title(text: str) -> str:
    text = re.sub(r"^Q\d+\s+", "", text, flags=re.I)
    text = re.sub(r"^【[^】]+】\s*", "", text)
    return text.strip()


def heading_work_id(text: str, title_to_id: dict[str, str]) -> str | None:
    q_match = re.match(r"^Q(\d+)\s+", text, flags=re.I)
    if q_match:
        return f"q{q_match.group(1)}"
    if re.match(r"^【(?:补充题目|Day\s*\d+|DAY\s*\d+)】", text, flags=re.I):
        return title_to_id.get(heading_title(text))
    return None


def main() -> None:
    works = json.loads(WORKS_PATH.read_text(encoding="utf-8"))
    work_ids = {work["id"] for work in works}
    title_to_id = {work["title"].strip(): work["id"] for work in works}
    mapping: dict[str, list[dict[str, object]]] = {work["id"]: [] for work in works}
    counters: dict[str, int] = {}

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    with zipfile.ZipFile(DOCX_PATH) as archive:
        document = ET.fromstring(archive.read("word/document.xml"))
        rel_root = ET.fromstring(archive.read("word/_rels/document.xml.rels"))
        relationships = {
            node.attrib["Id"]: node.attrib["Target"]
            for node in rel_root.findall("pr:Relationship", NS)
        }

        current_id: str | None = None
        for paragraph in document.findall(".//w:body//w:p", NS):
            text = "".join(node.text or "" for node in paragraph.findall(".//w:t", NS)).strip()
            next_id = heading_work_id(text, title_to_id)
            if next_id:
                current_id = next_id if next_id in work_ids else None

            targets: list[str] = []
            for node in paragraph.iter():
                for attribute in (R_EMBED, R_ID):
                    relationship_id = node.attrib.get(attribute)
                    target = relationships.get(relationship_id or "", "")
                    if target.startswith("media/") and target not in targets:
                        targets.append(target)

            if not current_id:
                continue
            for target in targets:
                counters[current_id] = counters.get(current_id, 0) + 1
                raw = archive.read(f"word/{target}")
                suffix = Path(target).suffix.lower()
                filename = f"{current_id}-{counters[current_id]:02d}{suffix}"
                (OUTPUT_DIR / filename).write_bytes(raw)
                with Image.open(io.BytesIO(raw)) as image:
                    width, height = image.size
                mapping[current_id].append(
                    {
                        "src": f"/mindmaps/{filename}",
                        "alt": f"{next(work['title'] for work in works if work['id'] == current_id)}的思维导图",
                        "width": width,
                        "height": height,
                    }
                )

    compact_mapping = {work_id: images for work_id, images in mapping.items() if images}
    MAPPING_PATH.write_text(
        json.dumps(compact_mapping, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    total = sum(len(images) for images in compact_mapping.values())
    print(f"Extracted {total} mind maps for {len(compact_mapping)} works")


if __name__ == "__main__":
    try:
        main()
    except Exception as error:
        print(f"Mind-map extraction failed: {error}", file=sys.stderr)
        raise
