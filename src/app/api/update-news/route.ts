export const dynamic = "force-dynamic"; // Esto evita que Next.js cachee la respuesta

import { updateNewsCarousel } from "@/../lib/newsToCarousel";
export async function GET() {
  try {
    console.log("Iniciando actualización de noticias...");
    await updateNewsCarousel();
    
    return Response.json({ success: true, message: "Actualizado con éxito" });
  } catch (error: any) {
    console.error("Error en el Route Handler:", error.message);
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}