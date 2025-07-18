export const uploadFile = async (file: File, directory: string = 'uploads'): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = file.name.split('.').pop();
    const filename = `${timestamp}_${randomString}.${extension}`;
    const filepath = `${directory}/${filename}`;

    // Simulate file upload by creating a URL for the file
    const reader = new FileReader();
    reader.onload = (e) => {
      // In a real implementation, this would upload to server
      // For demo, we'll just return a mock path
      resolve(`/assets/${filepath}`);
    };
    reader.onerror = () => reject(new Error('File upload failed'));
    reader.readAsDataURL(file);
  });
};

export const validateFile = (file: File, allowedTypes: string[], maxSize: number = 5 * 1024 * 1024): boolean => {
  if (!allowedTypes.includes(file.type)) {
    throw new Error(`File type not allowed. Allowed types: ${allowedTypes.join(', ')}`);
  }
  
  if (file.size > maxSize) {
    throw new Error(`File size too large. Maximum size: ${maxSize / (1024 * 1024)}MB`);
  }
  
  return true;
};

export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const generateSubmissionNumber = (): string => {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${year}${month}${day}-${random}`;
};