#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import sys

# Try pypdf first
try:
    from pypdf import PdfReader
    
    pdf_path = r'c:\Users\admin\IWE\DS-strategy\inbox\Еже ИФ текст лекций (2025).pdf'
    output_path = r'c:\Users\admin\IWE\DS-strategy\inbox\Еже-лекции.txt'
    
    reader = PdfReader(pdf_path)
    text = ''
    
    for page_num, page in enumerate(reader.pages):
        extracted = page.extract_text()
        if extracted:
            text += f"\n--- Page {page_num + 1} ---\n{extracted}"
    
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(text)
    
    print(f"✓ Converted to: {output_path}")
    print(f"✓ Total pages: {len(reader.pages)}")
    sys.exit(0)

except ImportError:
    print("pypdf not installed, trying PyPDF2...")
    try:
        from PyPDF2 import PdfReader
        
        pdf_path = r'c:\Users\admin\IWE\DS-strategy\inbox\Еже ИФ текст лекций (2025).pdf'
        output_path = r'c:\Users\admin\IWE\DS-strategy\inbox\Еже-лекции.txt'
        
        reader = PdfReader(pdf_path)
        text = ''
        
        for page_num, page in enumerate(reader.pages):
            extracted = page.extract_text()
            if extracted:
                text += f"\n--- Page {page_num + 1} ---\n{extracted}"
        
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(text)
        
        print(f"✓ Converted to: {output_path}")
        print(f"✓ Total pages: {len(reader.pages)}")
        sys.exit(0)
    
    except ImportError:
        print("ERROR: Neither pypdf nor PyPDF2 installed. Install with: pip install pypdf")
        sys.exit(1)
