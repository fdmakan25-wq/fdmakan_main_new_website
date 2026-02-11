import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

// Helper function to upload image to Cloudinary
export async function uploadImage(
  file: File | Buffer | string,
  folder: string = 'fdmakan/properties'
): Promise<string> {
  try {
    let uploadResult;

    if (typeof file === 'string') {
      // If it's a URL, upload from URL
      uploadResult = await cloudinary.uploader.upload(file, {
        folder,
        transformation: [
          { width: 800, height: 800, crop: 'limit', quality: 'auto', format: 'auto' },
        ],
      });
    } else if (file instanceof Buffer) {
      // If it's a buffer (file upload)
      uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            folder,
            transformation: [
              { width: 800, height: 800, crop: 'limit', quality: 'auto', format: 'auto' },
            ],
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(file);
      });
    } else {
      // If it's a File object, convert to buffer
      const arrayBuffer = await (file as unknown as Blob).arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            folder,
            transformation: [
              { width: 800, height: 800, crop: 'limit', quality: 'auto', format: 'auto' },
            ],
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(buffer);
      });
    }

    return (uploadResult as any).secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
}

// Helper function to upload video to Cloudinary
export async function uploadVideo(
  file: File | Buffer | string,
  folder: string = 'fdmakan/videos'
): Promise<string> {
  try {
    let uploadResult;

    if (typeof file === 'string') {
      uploadResult = await cloudinary.uploader.upload(file, {
        resource_type: 'video',
        folder,
        transformation: [{ width: 800, height: 600, crop: 'limit', quality: 'auto' }],
      });
    } else if (file instanceof Buffer) {
      uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            resource_type: 'video',
            folder,
            transformation: [{ width: 800, height: 600, crop: 'limit', quality: 'auto' }],
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(file);
      });
    } else {
      const arrayBuffer = await (file as unknown as Blob).arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            resource_type: 'video',
            folder,
            transformation: [{ width: 800, height: 600, crop: 'limit', quality: 'auto' }],
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(buffer);
      });
    }

    return (uploadResult as any).secure_url;
  } catch (error) {
    console.error('Error uploading video to Cloudinary:', error);
    throw error;
  }
}

// Helper function to delete from Cloudinary
export async function deleteFromCloudinary(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw error;
  }
}

