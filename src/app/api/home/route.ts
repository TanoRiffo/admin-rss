import { NextResponse } from 'next/server';
import db from '../../../../lib/firebaseAdmin';
import { fetchAndParseRSS } from '../../../../lib/fetchAndParseRSS';
import { fetchYouTubePrograms } from '../../../../lib/fetchYoutubePrograms';

export async function GET() {
  try {
    // 1. Carruseles de Firebase
    const carouselsSnapshot = await db.collection('carousels').get();
    const carousels = carouselsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // 2. RSS (Spotify)
    let feeds: any[] = []; 
    try {
      feeds = await fetchAndParseRSS();
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : 'Error desconocido en RSS';
      console.error("Error en RSS:", errorMessage);
    }

    // 3. YouTube con Persistencia (Caché)
    let youtubePrograms: any[] = [];
    try {
      youtubePrograms = await fetchYouTubePrograms();

      // 🔥 Si logramos traer videos, actualizamos la caché en Firebase
      if (youtubePrograms.length > 0) {
        const batch = db.batch();
        const collectionRef = db.collection('lastYoutubePrograms');
        
        youtubePrograms.forEach((video) => {
          // Limpiamos el ID de caracteres que Firebase no permite en nombres de documentos
          const safeId = video.id.replace(/[/##$\[\]]/g, '_');
          const docRef = collectionRef.doc(safeId);
          batch.set(docRef, video);
        });
        await batch.commit();
      }
    } catch (e) {
      console.error("Fallo YouTube, cargando caché de Firebase:", e);
      // 🛡️ FALLBACK: Si falla la conexión a YouTube, leemos lo último guardado
      const cacheSnapshot = await db.collection('lastYoutubePrograms').get();
      youtubePrograms = cacheSnapshot.docs.map(doc => doc.data());
    }

    // 4. Respuesta Final
    return NextResponse.json(
      {
        feeds,
        carousels,
        youtubePrograms
      },
      {
        headers: {
          'Access-Control-Allow-Origin': 'http://localhost:8081',
          'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      }
    );

  } catch (error: unknown) {
    console.error("Error crítico en API:", error);
    return NextResponse.json(
      { error: 'Error al obtener datos' },
      { status: 500 }
    );
  }
}

// 🔥 necesario para CORS
export function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': 'http://localhost:8081',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}