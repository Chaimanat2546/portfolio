# Thai PDF Generator

Generate PDF documents with proper Thai language support.

## Features

- Generate PDFs with proper Thai text rendering
- Support for Thai fonts (Sarabun, Garuda, Umpush, Loma)
- CLI and Python API
- Configurable fonts, margins, and orientation

## Installation

### From source:
```bash
cd mcp-thaipdf
pip install -e .
```

### With HTML support:
```bash
pip install -e ".[html]"
```

## CLI Usage

### Generate PDF from text:
```bash
thaipdf "สวัสดีชาวโลก" -o hello.pdf
```

### Generate from file:
```bash
thaipdf document.txt -f -o output.pdf -t "เอกสารของฉัน"
```

### Options:
```bash
thaipdf "Content here" \
  -o output.pdf \
  -t "Document Title" \
  -s 14 \
  -l 1.8 \
  -m 25 \
  --landscape
```

### Check available Thai fonts:
```bash
thaipdf --check-fonts
```

## Python API

```python
from mcp_thaipdf.server import ThaiPDF

# Create generator
generator = ThaiPDF()

# Generate PDF
output = generator.generate(
    content="สวัสดีชาวโลก\nนี่คือเอกสารภาษาไทย",
    title="เอกสารตัวอย่าง",
    output_path="output.pdf",
    font_size=12,
    line_spacing=1.5,
    margin_mm=20,
    orientation="P"
)
```

## Requirements

- Python 3.8+
- Thai fonts: `fonts-thai-tlwg` or `fonts-tlwg-garuda-otf`

Install Thai fonts on Ubuntu/Debian:
```bash
sudo apt-get install fonts-thai-tlwg
```

## Font Support

The tool automatically detects and uses available Thai fonts in this order:
1. Sarabun (TH Sarabun)
2. Garuda
3. Umpush
4. Loma
5. Noto Sans Thai

## License

MIT
