import { NextRequest, NextResponse } from 'next/server';
import { uploadVideo } from '@/lib/cloudinary';
import { getAdminSessionFromRequest } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Require admin session to upload media
    const session = await getAdminSessionFromRequest(request);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin authentication required to upload videos' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = (formData.get('folder') as string) || 'fdmakan/videos';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const validTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only MP4, WebM, and MOV are allowed.' },
        { status: 400 }
      );
    }

    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size too large. Maximum size is 50MB.' },
        { status: 400 }
      );
    }

    const videoUrl = await uploadVideo(file, folder);

    return NextResponse.json({ success: true, url: videoUrl }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error uploading video:', error);
    return NextResponse.json(
      { error: 'Failed to upload video', message },
      { status: 500 }
    );
  }
}
