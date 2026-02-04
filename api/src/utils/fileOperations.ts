import fs from 'fs';
import path from 'path';

/**
 * Safely write content to a file using atomic operation (temp file + rename)
 * This prevents data corruption if the write is interrupted
 * 
 * @param filePath - Full path to the target file
 * @param content - String content to write
 * @throws Error if directory creation or file write fails
 */
export function safeWriteFile(filePath: string, content: string): void {
  const dir = path.dirname(filePath);
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  // Write to temporary file first
  const tempFilePath = `${filePath}.tmp`;
  
  try {
    fs.writeFileSync(tempFilePath, content, 'utf-8');
    // Atomically rename temp file to final destination
    fs.renameSync(tempFilePath, filePath);
  } catch (error) {
    // Clean up temp file if it exists
    if (fs.existsSync(tempFilePath)) {
      try {
        fs.unlinkSync(tempFilePath);
      } catch (cleanupError) {
        // Ignore cleanup errors
      }
    }
    throw error;
  }
}

/**
 * Safely read JSON file and parse it
 * 
 * @param filePath - Full path to the JSON file
 * @returns Parsed JSON object or empty object if file doesn't exist
 * @throws Error if file exists but cannot be read or parsed
 */
export function safeReadJsonFile<T>(filePath: string): T {
  if (!fs.existsSync(filePath)) {
    return {} as T;
  }
  
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    throw new Error(`Failed to read or parse JSON file at ${filePath}: ${error}`);
  }
}

/**
 * Ensure directory exists, creating it if necessary
 * 
 * @param dirPath - Path to the directory
 */
export function ensureDir(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}
