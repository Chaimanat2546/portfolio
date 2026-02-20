#!/usr/bin/env python3
"""
Thai PDF Generator
Generate PDFs with proper Thai language support.
"""

import argparse
import sys
from pathlib import Path
from typing import Optional


def check_dependencies():
    """Check if required dependencies are installed."""
    try:
        from fpdf import FPDF
        return True
    except ImportError:
        print("Error: fpdf2 is required. Install with: pip install fpdf2")
        return False


class ThaiPDF:
    """PDF generator with Thai font support."""
    
    def __init__(self):
        from fpdf import FPDF
        self.pdf = FPDF()
        self.default_font = None
        self._add_thai_fonts()
    
    def _add_thai_fonts(self):
        """Add Thai-supporting fonts to the PDF."""
        from fpdf import FPDF
        
        font_paths = {
            'Garuda': '/usr/share/fonts/truetype/tlwg/Garuda.ttf',
            'GarudaBold': '/usr/share/fonts/truetype/tlwg/Garuda-Bold.ttf',
            'Umpush': '/usr/share/fonts/truetype/tlwg/Umpush.ttf',
            'UmpushBold': '/usr/share/fonts/truetype/tlwg/Umpush-Bold.ttf',
            'Loma': '/usr/share/fonts/truetype/tlwg/Loma.ttf',
            'LomaBold': '/usr/share/fonts/truetype/tlwg/Loma-Bold.ttf',
        }
        
        fonts_added = []
        for name, path in font_paths.items():
            if Path(path).exists():
                style = 'B' if 'Bold' in name else ''
                font_name = name.replace('Bold', '')
                try:
                    self.pdf.add_font(font_name, style, path)
                    fonts_added.append(f"{font_name} {style}".strip())
                except Exception as e:
                    print(f"Warning: Could not add font {name}: {e}")
        
        if fonts_added:
            # Use first available font
            first_font = fonts_added[0].replace(' Bold', '').replace(' B', '')
            self.default_font = first_font
            self.pdf.set_font(first_font, '', 12)
        else:
            self.default_font = 'Helvetica'
            print("Warning: No Thai fonts found. PDF may not display Thai text correctly.")
            print("Install Thai fonts: sudo apt-get install fonts-thai-tlwg")
        
        return fonts_added
    
    def generate(
        self,
        content: str,
        title: str = "",
        output_path: str = "output.pdf",
        font_size: int = 12,
        line_spacing: float = 1.5,
        margin_mm: float = 20.0,
        orientation: str = "P"
    ) -> str:
        """
        Generate a PDF with Thai text.
        
        Args:
            content: The text content (supports newlines)
            title: Optional document title
            output_path: Where to save the PDF
            font_size: Base font size
            line_spacing: Line spacing multiplier
            margin_mm: Page margins in millimeters
            orientation: 'P' for Portrait, 'L' for Landscape
        
        Returns:
            Path to the generated PDF
        """
        self.pdf.set_auto_page_break(auto=True, margin=margin_mm)
        self.pdf.set_margins(margin_mm, margin_mm, margin_mm)
        self.pdf.add_page(orientation=orientation)
        
        # Add title
        if title:
            from fpdf.enums import XPos, YPos
            self.pdf.set_font(self.default_font, 'B', font_size + 4)
            self.pdf.cell(0, 10, title, new_x=XPos.LMARGIN, new_y=YPos.NEXT, align='C')
            self.pdf.ln(5)
        
        # Set content font
        self.pdf.set_font(self.default_font, '', font_size)
        
        # Process content line by line
        import html
        lines = content.split('\n')
        
        for line in lines:
            line = line.strip()
            if not line:
                self.pdf.ln(font_size * line_spacing / 2)
                continue
            
            # Decode HTML entities
            line = html.unescape(line)
            
            # Handle bullet points
            if line.startswith('- ') or line.startswith('• '):
                from fpdf.enums import XPos, YPos
                self.pdf.cell(5)  # Indent
                self.pdf.cell(0, font_size * line_spacing, '• ' + line[2:], new_x=XPos.LMARGIN, new_y=YPos.NEXT)
            else:
                self.pdf.multi_cell(0, font_size * line_spacing, line)
        
        # Save PDF
        self.pdf.output(output_path)
        return output_path


def main():
    """CLI entry point."""
    parser = argparse.ArgumentParser(
        description='Generate PDFs with Thai language support'
    )
    parser.add_argument('content', nargs='?', default='', help='Text content or file path')
    parser.add_argument('-o', '--output', default='output.pdf', help='Output PDF path')
    parser.add_argument('-t', '--title', default='', help='Document title')
    parser.add_argument('-s', '--font-size', type=int, default=12, help='Font size')
    parser.add_argument('-l', '--line-spacing', type=float, default=1.5, help='Line spacing')
    parser.add_argument('-m', '--margin', type=float, default=20, help='Margin in mm')
    parser.add_argument('--landscape', action='store_true', help='Use landscape orientation')
    parser.add_argument('--file', '-f', action='store_true', help='Treat content as file path')
    parser.add_argument('--check-fonts', action='store_true', help='Check available Thai fonts')
    
    args = parser.parse_args()
    
    if args.check_fonts:
        check_thai_fonts()
        return
    
    if not args.content:
        parser.print_help()
        sys.exit(1)
    
    if not check_dependencies():
        sys.exit(1)
    
    # Get content
    if args.file:
        with open(args.content, 'r', encoding='utf-8') as f:
            content = f.read()
    else:
        content = args.content
    
    # Generate PDF
    generator = ThaiPDF()
    orientation = 'L' if args.landscape else 'P'
    
    try:
        output = generator.generate(
            content=content,
            title=args.title,
            output_path=args.output,
            font_size=args.font_size,
            line_spacing=args.line_spacing,
            margin_mm=args.margin,
            orientation=orientation
        )
        print(f"PDF generated: {output}")
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)


def check_thai_fonts():
    """Check available Thai fonts."""
    fonts = [
        ("Garuda", "/usr/share/fonts/truetype/tlwg/Garuda.ttf"),
        ("Sarabun", "/usr/share/fonts/truetype/tlwg/Sarabun-Regular.ttf"),
        ("Sarabun Bold", "/usr/share/fonts/truetype/tlwg/Sarabun-Bold.ttf"),
        ("Umpush", "/usr/share/fonts/truetype/tlwg/Umpush.ttf"),
        ("Loma", "/usr/share/fonts/truetype/tlwg/Loma.ttf"),
        ("Noto Sans Thai", "/usr/share/fonts/truetype/noto/NotoSansThai-Regular.ttf"),
    ]
    
    print("Thai Font Availability:")
    print("-" * 50)
    for name, path in fonts:
        exists = Path(path).exists()
        status = "✓" if exists else "✗"
        print(f"{status} {name}: {path}")
    print("-" * 50)
    
    # Check if any fonts are available
    if not any(Path(p).exists() for _, p in fonts):
        print("\nNo Thai fonts found!")
        print("Install with: sudo apt-get install fonts-thai-tlwg")


if __name__ == '__main__':
    main()
