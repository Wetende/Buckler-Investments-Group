"""File handling utility functions."""

import os
import hashlib
from pathlib import Path
from typing import List, Optional, Dict, Any, BinaryIO
import mimetypes
from datetime import datetime


def generate_file_hash(file_path: str, algorithm: str = "sha256") -> str:
    """
    Generate hash for a file.
    
    Args:
        file_path: Path to the file
        algorithm: Hash algorithm to use
        
    Returns:
        File hash as hex string
    """
    hash_func = hashlib.new(algorithm)
    
    with open(file_path, 'rb') as f:
        for chunk in iter(lambda: f.read(4096), b""):
            hash_func.update(chunk)
    
    return hash_func.hexdigest()


def get_file_info(file_path: str) -> Dict[str, Any]:
    """
    Get comprehensive file information.
    
    Args:
        file_path: Path to the file
        
    Returns:
        Dictionary with file information
    """
    path = Path(file_path)
    
    if not path.exists():
        raise FileNotFoundError(f"File not found: {file_path}")
    
    stat = path.stat()
    
    return {
        "name": path.name,
        "stem": path.stem,
        "suffix": path.suffix,
        "size_bytes": stat.st_size,
        "size_mb": round(stat.st_size / (1024 * 1024), 2),
        "created_at": datetime.fromtimestamp(stat.st_ctime),
        "modified_at": datetime.fromtimestamp(stat.st_mtime),
        "mime_type": mimetypes.guess_type(file_path)[0],
        "is_image": is_image_file(file_path),
        "is_document": is_document_file(file_path),
        "hash_sha256": generate_file_hash(file_path),
    }


def is_image_file(file_path: str) -> bool:
    """
    Check if file is an image.
    
    Args:
        file_path: Path to the file
        
    Returns:
        True if file is an image
    """
    mime_type, _ = mimetypes.guess_type(file_path)
    return mime_type is not None and mime_type.startswith('image/')


def is_document_file(file_path: str) -> bool:
    """
    Check if file is a document.
    
    Args:
        file_path: Path to the file
        
    Returns:
        True if file is a document
    """
    document_extensions = {'.pdf', '.doc', '.docx', '.txt', '.rtf', '.odt'}
    return Path(file_path).suffix.lower() in document_extensions


def ensure_directory_exists(directory_path: str) -> None:
    """
    Ensure a directory exists, create if it doesn't.
    
    Args:
        directory_path: Path to the directory
    """
    Path(directory_path).mkdir(parents=True, exist_ok=True)


def sanitize_filename(filename: str) -> str:
    """
    Sanitize filename for safe filesystem usage.
    
    Args:
        filename: Original filename
        
    Returns:
        Sanitized filename
    """
    # Remove or replace dangerous characters
    dangerous_chars = '<>:"/\\|?*'
    for char in dangerous_chars:
        filename = filename.replace(char, '_')
    
    # Remove leading/trailing spaces and dots
    filename = filename.strip(' .')
    
    # Limit filename length
    if len(filename) > 255:
        name, ext = os.path.splitext(filename)
        filename = name[:255 - len(ext)] + ext
    
    return filename


def get_unique_filename(directory: str, filename: str) -> str:
    """
    Get a unique filename by appending numbers if file exists.
    
    Args:
        directory: Target directory
        filename: Desired filename
        
    Returns:
        Unique filename
    """
    base_path = Path(directory) / filename
    
    if not base_path.exists():
        return filename
    
    name, ext = os.path.splitext(filename)
    counter = 1
    
    while base_path.exists():
        new_filename = f"{name}_{counter}{ext}"
        base_path = Path(directory) / new_filename
        counter += 1
    
    return base_path.name


def copy_file_with_metadata(source: str, destination: str) -> None:
    """
    Copy file while preserving metadata.
    
    Args:
        source: Source file path
        destination: Destination file path
    """
    import shutil
    
    # Ensure destination directory exists
    ensure_directory_exists(str(Path(destination).parent))
    
    # Copy file with metadata
    shutil.copy2(source, destination)


def move_file_safely(source: str, destination: str) -> None:
    """
    Move file safely with backup if destination exists.
    
    Args:
        source: Source file path
        destination: Destination file path
    """
    import shutil
    
    dest_path = Path(destination)
    
    # If destination exists, create backup
    if dest_path.exists():
        backup_path = dest_path.with_suffix(dest_path.suffix + '.backup')
        shutil.move(str(dest_path), str(backup_path))
    
    # Ensure destination directory exists
    ensure_directory_exists(str(dest_path.parent))
    
    # Move file
    shutil.move(source, destination)


def delete_file_safely(file_path: str, backup: bool = True) -> None:
    """
    Delete file safely with optional backup.
    
    Args:
        file_path: Path to file to delete
        backup: Whether to create backup before deletion
    """
    path = Path(file_path)
    
    if not path.exists():
        return
    
    if backup:
        backup_path = path.with_suffix(path.suffix + '.deleted')
        path.rename(backup_path)
    else:
        path.unlink()


def compress_file(file_path: str, compression_format: str = "zip") -> str:
    """
    Compress a file.
    
    Args:
        file_path: Path to file to compress
        compression_format: Compression format ('zip', 'tar', 'tar.gz')
        
    Returns:
        Path to compressed file
    """
    import zipfile
    import tarfile
    
    path = Path(file_path)
    
    if compression_format == "zip":
        compressed_path = path.with_suffix(path.suffix + '.zip')
        with zipfile.ZipFile(compressed_path, 'w', zipfile.ZIP_DEFLATED) as zf:
            zf.write(file_path, path.name)
    
    elif compression_format == "tar":
        compressed_path = path.with_suffix(path.suffix + '.tar')
        with tarfile.open(compressed_path, 'w') as tf:
            tf.add(file_path, path.name)
    
    elif compression_format == "tar.gz":
        compressed_path = path.with_suffix(path.suffix + '.tar.gz')
        with tarfile.open(compressed_path, 'w:gz') as tf:
            tf.add(file_path, path.name)
    
    else:
        raise ValueError(f"Unsupported compression format: {compression_format}")
    
    return str(compressed_path)


def extract_file(compressed_path: str, destination_dir: str) -> List[str]:
    """
    Extract compressed file.
    
    Args:
        compressed_path: Path to compressed file
        destination_dir: Directory to extract to
        
    Returns:
        List of extracted file paths
    """
    import zipfile
    import tarfile
    
    ensure_directory_exists(destination_dir)
    extracted_files = []
    
    if compressed_path.endswith('.zip'):
        with zipfile.ZipFile(compressed_path, 'r') as zf:
            zf.extractall(destination_dir)
            extracted_files = [os.path.join(destination_dir, name) for name in zf.namelist()]
    
    elif compressed_path.endswith(('.tar', '.tar.gz', '.tar.bz2')):
        mode = 'r'
        if compressed_path.endswith('.tar.gz'):
            mode = 'r:gz'
        elif compressed_path.endswith('.tar.bz2'):
            mode = 'r:bz2'
        
        with tarfile.open(compressed_path, mode) as tf:
            tf.extractall(destination_dir)
            extracted_files = [os.path.join(destination_dir, name) for name in tf.getnames()]
    
    else:
        raise ValueError(f"Unsupported archive format: {compressed_path}")
    
    return extracted_files


def clean_temp_files(temp_dir: str, max_age_hours: int = 24) -> int:
    """
    Clean old temporary files.
    
    Args:
        temp_dir: Temporary files directory
        max_age_hours: Maximum age in hours before deletion
        
    Returns:
        Number of files deleted
    """
    from datetime import timedelta
    
    if not os.path.exists(temp_dir):
        return 0
    
    now = datetime.now()
    max_age = timedelta(hours=max_age_hours)
    deleted_count = 0
    
    for file_path in Path(temp_dir).rglob('*'):
        if file_path.is_file():
            file_age = now - datetime.fromtimestamp(file_path.stat().st_mtime)
            if file_age > max_age:
                try:
                    file_path.unlink()
                    deleted_count += 1
                except OSError:
                    # File might be in use, skip
                    pass
    
    return deleted_count


def get_directory_size(directory_path: str) -> Dict[str, Any]:
    """
    Calculate directory size and file count.
    
    Args:
        directory_path: Path to directory
        
    Returns:
        Dictionary with size information
    """
    total_size = 0
    file_count = 0
    dir_count = 0
    
    for path in Path(directory_path).rglob('*'):
        if path.is_file():
            total_size += path.stat().st_size
            file_count += 1
        elif path.is_dir():
            dir_count += 1
    
    return {
        "total_size_bytes": total_size,
        "total_size_mb": round(total_size / (1024 * 1024), 2),
        "total_size_gb": round(total_size / (1024 * 1024 * 1024), 2),
        "file_count": file_count,
        "directory_count": dir_count,
    }
