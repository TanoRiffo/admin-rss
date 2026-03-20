import { NextResponse } from 'next/server';
import { fetchYouTubePrograms } from '../../../../lib/fetchYoutubePrograms';
import db from '../../../../lib/firebaseAdmin';

export async function GET(request: Request) {
  // Verificación de seguridad (opcional pero recomendada)
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const youtubePrograms = await fetchYouTubePrograms();
    
    if (youtubePrograms.length > 0) {
      const batch = db.batch();
      // Guardamos en la colección de caché
      youtubePrograms.forEach((video) => {
        const docRef = db.collection('lastYoutubePrograms').doc(video.id.replace(/\//g, '_'));
        batch.set(docRef, video);
      });
      await batch.commit();
      return NextResponse.json({ success: true, count: youtubePrograms.length });
    }
    
    return NextResponse.json({ success: false, message: "No se encontraron videos" });
  } catch (error) {
    return NextResponse.json({ error: "Fallo el cron" }, { status: 500 });
  }
}