#!/usr/bin/env python3
import xml.etree.ElementTree as ET
import re
import shutil
import os

# Register namespaces
namespaces = {
    'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main',
    'w14': 'http://schemas.microsoft.com/office/word/2010/wordml',
    'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships',
    'mc': 'http://schemas.openxmlformats.org/markup-compatibility/2006',
    'wp': 'http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing',
    'wp14': 'http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing',
    'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
    'pic': 'http://schemas.openxmlformats.org/drawingml/2006/picture',
    'wps': 'http://schemas.microsoft.com/office/word/2010/wordprocessingShape',
    'wpc': 'http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas',
    'cx': 'http://schemas.microsoft.com/office/drawing/2014/chartex',
    'cx1': 'http://schemas.microsoft.com/office/drawing/2015/9/8/chartex',
    'cx2': 'http://schemas.microsoft.com/office/drawing/2015/10/21/chartex',
    'cx3': 'http://schemas.microsoft.com/office/drawing/2016/5/9/chartex',
    'cx4': 'http://schemas.microsoft.com/office/drawing/2016/5/10/chartex',
    'cx5': 'http://schemas.microsoft.com/office/drawing/2016/5/11/chartex',
    'cx6': 'http://schemas.microsoft.com/office/drawing/2016/5/12/chartex',
    'cx7': 'http://schemas.microsoft.com/office/drawing/2016/5/13/chartex',
    'cx8': 'http://schemas.microsoft.com/office/drawing/2016/5/14/chartex',
    'aink': 'http://schemas.microsoft.com/office/drawing/2016/ink',
    'am3d': 'http://schemas.microsoft.com/office/drawing/2017/model3d',
    'o': 'urn:schemas-microsoft-com:office:office',
    'oel': 'http://schemas.microsoft.com/office/2019/extlst',
    'm': 'http://schemas.openxmlformats.org/officeDocument/2006/math',
    'v': 'urn:schemas-microsoft-com:vml',
    'w10': 'urn:schemas-microsoft-com:office:word',
    'w15': 'http://schemas.microsoft.com/office/word/2012/wordml',
    'w16cex': 'http://schemas.microsoft.com/office/word/2018/wordml/cex',
    'w16cid': 'http://schemas.microsoft.com/office/word/2016/wordml/cid',
    'w16': 'http://schemas.microsoft.com/office/word/2018/wordml',
    'w16du': 'http://schemas.microsoft.com/office/word/2023/wordml/word16du',
    'w16sdtdh': 'http://schemas.microsoft.com/office/word/2020/wordml/sdtdatahash',
    'w16sdtfl': 'http://schemas.microsoft.com/office/word/2024/wordml/sdtformatlock',
    'w16se': 'http://schemas.microsoft.com/office/word/2015/wordml/symex',
    'wpg': 'http://schemas.microsoft.com/office/word/2010/wordprocessingGroup',
    'wpi': 'http://schemas.microsoft.com/office/word/2010/wordprocessingInk',
    'wne': 'http://schemas.microsoft.com/office/word/2006/wordml',
    'wps': 'http://schemas.microsoft.com/office/word/2010/wordprocessingShape',
    'a14': 'http://schemas.microsoft.com/office/drawing/2010/main',
}

for prefix, uri in namespaces.items():
    ET.register_namespace(prefix, uri)

# Read the XML file
xml_path = '/root/.openclaw/workspace/meeting_v3_extracted/word/document.xml'
tree = ET.parse(xml_path)
root = tree.getroot()

# Helper function to find all text elements
def get_text_elements():
    """Get all w:t elements"""
    return root.findall('.//w:t', namespaces)

def get_rfonts_elements():
    """Get all w:rFonts elements"""
    return root.findall('.//w:rFonts', namespaces)

# Replace text content
text_mapping = {
    'ครั้งที่ 2': 'ครั้งที่ 4',
    'ครั้งที่ 2/2569': 'ครั้งที่ 4/2569',
    '16 มกราคม 2569': '16 กุมภาพันธ์ 2569',
    'วันศุกร์ที่ 26 ธันวาคม พ.ศ. 2568': 'วันอาทิตย์ที่ 16 กุมภาพันธ์ พ.ศ. 2569',
    '2/2568': '3/2569',  # Reference to previous meeting
}

# Update text elements
for t_elem in get_text_elements():
    if t_elem.text:
        for old, new in text_mapping.items():
            if old in t_elem.text:
                t_elem.text = t_elem.text.replace(old, new)
                print(f"Replaced: '{old}' -> '{new}'")

# Change font to TH Sarabun New
for rfonts_elem in get_rfonts_elements():
    # Set the ascii and h-ansi fonts
    rfonts_elem.set('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}ascii', 'TH Sarabun New')
    rfonts_elem.set('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}hAnsi', 'TH Sarabun New')
    # Set East Asian font
    rfonts_elem.set('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}eastAsia', 'TH Sarabun New')
    # Set complex script font (for Thai)
    rfonts_elem.set('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}cs', 'TH Sarabun New')

print("Font changed to TH Sarabun New")

# Also update styles.xml for default font
styles_path = '/root/.openclaw/workspace/meeting_v3_extracted/word/styles.xml'
if os.path.exists(styles_path):
    styles_tree = ET.parse(styles_path)
    styles_root = styles_tree.getroot()
    
    for rfonts_elem in styles_root.findall('.//w:rFonts', namespaces):
        rfonts_elem.set('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}ascii', 'TH Sarabun New')
        rfonts_elem.set('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}hAnsi', 'TH Sarabun New')
        rfonts_elem.set('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}eastAsia', 'TH Sarabun New')
        rfonts_elem.set('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}cs', 'TH Sarabun New')
    
    styles_tree.write(styles_path, encoding='UTF-8', xml_declaration=True)
    print("Styles updated")

# Save the modified document.xml
tree.write(xml_path, encoding='UTF-8', xml_declaration=True)
print("Document updated successfully!")
