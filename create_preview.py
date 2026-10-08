import os

src_file = r"C:\Users\user\.gemini\antigravity\scratch\solar-system-3d\solar-system.html"
dst_file = r"C:\Users\user\.gemini\antigravity\brain\569118cb-0d7a-424f-9d03-e093e1a8191a\preview_inline.html"

with open(src_file, "r", encoding="utf-8") as f:
    content = f.read()

# Make body fit inside an inline chat card cleanly
replacement_css = """
body, html {
  margin: 0;
  padding: 0;
  background-color: #030509;
  overflow: hidden;
  height: auto;
}
.viewport-card {
  position: relative;
  width: 100%;
  height: 485px;
  overflow: hidden;
  border-radius: 14px;
  border: 1px solid rgba(56, 189, 248, 0.25);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8);
}
"""

content = content.replace("body, html {", replacement_css + "\n.unused-body-rule {", 1)
content = content.replace("<body>", "<body>\n<div class=\"viewport-card\">", 1)
content = content.replace("</body>", "</div>\n</body>", 1)

with open(dst_file, "w", encoding="utf-8") as f:
    f.write(content)

print(f"Successfully generated {dst_file} (Size: {os.path.getsize(dst_file)} bytes)")
