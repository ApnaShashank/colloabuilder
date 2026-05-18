import os
import re

directory = r'c:\Users\brije\OneDrive\Desktop\colloabuilder\app\dashboard'

# Match imports from @hugeicons/core-free-icons
# Handling both single line and multiline imports
hugeicon_import_re = re.compile(r'import\s*\{([^}]+)\}\s*from\s*"@hugeicons/core-free-icons";', re.DOTALL)

for root, dirs, files in os.walk(directory):
    for file in files:
        if file.endswith('.tsx'):
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            if '@hugeicons/core-free-icons' in content:
                print(f"Refactoring {path}")
                
                # 1. Add HugeiconsIcon import if not present
                if 'from "@hugeicons/react"' not in content:
                    # Insert after the existing hugeicons import or at the top
                    content = re.sub(r'(import\s*\{[^}]+\}\s*from\s*"@hugeicons/core-free-icons";)', 
                                     r'\1\nimport { HugeiconsIcon } from "@hugeicons/react";', 
                                     content)
                
                # 2. Identify all imported icons
                match = hugeicon_import_re.search(content)
                if match:
                    icons_str = match.group(1)
                    # Clean up icons (remove newlines, spaces, trailing commas)
                    icons = [i.strip() for i in icons_str.replace('\n', ' ').split(',') if i.strip()]
                    
                    for icon in icons:
                        # 3. Replace <Icon ... /> with <HugeiconsIcon icon={Icon} ... />
                        # We need to be careful not to replace parts of other words
                        # Pattern: <Icon followed by space or />
                        # Handling both <Icon /> and <Icon ... />
                        pattern = rf'<({icon})(\s+[^/>]*)?/>'
                        replacement = rf'<HugeiconsIcon icon={{\1}}\2 />'
                        content = re.sub(pattern, replacement, content)
                        
                        # 4. Handle opening/closing tags if any (unlikely for icons but good to have)
                        pattern_complex = rf'<({icon})(\s+[^>]*)?>(.*?)</\1>'
                        replacement_complex = rf'<HugeiconsIcon icon={{\1}}\2>\3</HugeiconsIcon>'
                        content = re.sub(pattern_complex, replacement_complex, content)

                with open(path, 'w', encoding='utf-8') as f:
                    f.write(content)

print("Refactoring complete.")
