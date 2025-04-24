export class Helpers {
  /**
   * Converts a base64 string to a File object
   * @param base64String - The base64 encoded string (with or without data URI prefix)
   * @param filename - The name for the resulting file
   * @param mimeType - Optional MIME type for the file
   * @returns File object
   */
  static base64ToFile(base64: string, field: string): File {
    const byteString = atob(base64.split(",")[1]);
    const mimeString = base64.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new File([ab], `${field}.${mimeString.split("/")[1]}`, {
      type: mimeString,
    });
  }

  /**
   * Detects MIME type from base64 string with data URI
   * @param base64String - The base64 string with data URI prefix
   * @returns Detected MIME type or application/octet-stream
   */
  static detectMimeType(base64String: string): string {
    if (base64String.startsWith("data:")) {
      const mimeMatch = base64String.match(
        /^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);/,
      );
      return mimeMatch ? mimeMatch[1] : "application/octet-stream";
    }
    return "application/octet-stream";
  }

  /**
   * Converts a File object to base64 string
   * @param file - The file to convert
   * @returns Promise resolving to base64 string
   */
  static fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  }

  /**
   * Generates a random string ID
   * @param length - Length of the ID (default: 16)
   * @returns Random string ID
   */
  static generateId(length: number = 16): string {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}

// Export a singleton instance if preferred
export const helpers = new Helpers();
