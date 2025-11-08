import os
import re
import hashlib
from pathlib import Path

def extract_svgs_from_js():
    """Extract SVG tags from JS files and replace with img imports"""
    
    src_dir = Path('src')
    icons_dir = src_dir / 'assets' / 'icons'
    icons_dir.mkdir(parents=True, exist_ok=True)
    
    # Find all JS files
    js_files = list(src_dir.rglob('*.js'))
    
    svg_counter = 0
    modifications = []
    
    for js_file in js_files:
        print(f"\nProcessing: {js_file}")
        
        with open(js_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Find all SVG tags (including multiline)
        svg_pattern = r'<svg[^>]*>.*?</svg>'
        svgs = re.finditer(svg_pattern, content, re.DOTALL | re.IGNORECASE)
        
        new_content = content
        imports_to_add = []
        replacements = []
        
        for match in svgs:
            svg_content = match.group(0)
            
            # Generate a unique name for the SVG
            svg_hash = hashlib.md5(svg_content.encode()).hexdigest()[:8]
            svg_name = f"icon_{svg_hash}"
            svg_filename = f"{svg_name}.svg"
            svg_path = icons_dir / svg_filename
            
            # Save SVG file
            with open(svg_path, 'w', encoding='utf-8') as f:
                f.write(svg_content)
            
            print(f"  - Saved: {svg_filename}")
            
            # Calculate relative import path
            relative_path = os.path.relpath(svg_path, js_file.parent).replace('\\', '/')
            
            # Prepare import statement
            import_statement = f"import {svg_name} from './{relative_path}';"
            imports_to_add.append(import_statement)
            
            # Store replacement info
            replacements.append({
                'old': svg_content,
                'new': f'<img src={{{svg_name}}} alt="icon" />',
                'import': import_statement
            })
            
            svg_counter += 1
        
        # Apply replacements if any SVGs were found
        if replacements:
            # Replace SVGs with img tags
            for replacement in replacements:
                new_content = new_content.replace(replacement['old'], replacement['new'], 1)
            
            # Add imports at the top (after any existing imports)
            import_section = '\n'.join([r['import'] for r in replacements])
            
            # Find the position to insert imports (after last import or at beginning)
            last_import_match = list(re.finditer(r'^import\s+.*?;?\s*$', new_content, re.MULTILINE))
            
            if last_import_match:
                # Insert after last import
                insert_pos = last_import_match[-1].end()
                new_content = new_content[:insert_pos] + '\n' + import_section + new_content[insert_pos:]
            else:
                # Insert at the beginning
                new_content = import_section + '\n\n' + new_content
            
            # Write back to file
            with open(js_file, 'w', encoding='utf-8') as f:
                f.write(new_content)
            
            modifications.append(str(js_file))
            print(f"  ✓ Modified: {js_file}")
    
    print(f"\n{'='*60}")
    print(f"Summary:")
    print(f"  - Total SVGs extracted: {svg_counter}")
    print(f"  - Files modified: {len(modifications)}")
    print(f"  - SVG files saved to: {icons_dir}")
    print(f"{'='*60}")
    
    if modifications:
        print("\nModified files:")
        for mod in modifications:
            print(f"  - {mod}")

if __name__ == '__main__':
    extract_svgs_from_js()
