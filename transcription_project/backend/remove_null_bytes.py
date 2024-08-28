import os

def remove_null_bytes(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.py'):
                filepath = os.path.join(root, file)
                try:
                    with open(filepath, 'rb') as f:
                        content = f.read()
                    
                    # Remove null bytes and other potential problematic characters
                    content = content.replace(b'\x00', b'')  # Null byte
                    content = content.replace(b'\r\n', b'\n')  # Windows line endings
                    content = content.replace(b'\r', b'\n')  # Mac line endings
                    
                    # Write back to file
                    with open(filepath, 'wb') as f:
                        f.write(content)
                    
                    print(f"Processed: {filepath}")
                except Exception as e:
                    print(f"Error processing {filepath}: {str(e)}")

# Run the function on the current directory
remove_null_bytes('.')