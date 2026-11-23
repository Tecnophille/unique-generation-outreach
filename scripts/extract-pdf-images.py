import pymupdf
from pathlib import Path

pdf_path = Path(r"C:\Users\HPAdmin\Downloads\UGO_31 Pages_compressed_compressed.pdf")
out_dir = Path(r"C:\Users\HPAdmin\Desktop\unique-generation-outreach\public\uploads\from-pdf")
out_dir.mkdir(parents=True, exist_ok=True)

doc = pymupdf.open(pdf_path)
manifest = []
seen_xrefs = set()
count = 0

for page_index in range(len(doc)):
    page = doc[page_index]
    images = page.get_images(full=True)
    for img_i, img in enumerate(images):
        xref = img[0]
        if xref in seen_xrefs:
            continue
        seen_xrefs.add(xref)
        try:
            pix = pymupdf.Pixmap(doc, xref)
            if pix.n - pix.alpha > 3:
                pix = pymupdf.Pixmap(pymupdf.csRGB, pix)
            w, h = pix.width, pix.height
            if w < 80 or h < 80:
                continue
            count += 1
            name = f"p{page_index + 1:02d}_img{img_i + 1:02d}_{w}x{h}.png"
            path = out_dir / name
            pix.save(path.as_posix())
            manifest.append(
                {
                    "file": name,
                    "page": page_index + 1,
                    "w": w,
                    "h": h,
                    "bytes": path.stat().st_size,
                    "aspect": round(w / h, 3) if h else 0,
                }
            )
        except Exception as e:
            print("skip", xref, e)

print(f"pages={len(doc)} extracted={count} unique_xrefs={len(seen_xrefs)}")
manifest.sort(key=lambda x: x["bytes"], reverse=True)
for m in manifest:
    print(
        f"{m['file']}\tpage={m['page']}\t{m['w']}x{m['h']}\t{m['bytes'] // 1024}KB\taspect={m['aspect']}"
    )

texts = []
for i in range(len(doc)):
    t = doc[i].get_text("text").strip().replace("\n", " ")[:220]
    texts.append(f"PAGE {i + 1}: {t}")
(out_dir / "_pages_text.txt").write_text("\n".join(texts), encoding="utf-8")
(out_dir / "_manifest.txt").write_text(
    "\n".join(
        f"{m['file']}\tpage={m['page']}\t{m['w']}x{m['h']}\t{m['bytes']}" for m in manifest
    ),
    encoding="utf-8",
)
print("done")
