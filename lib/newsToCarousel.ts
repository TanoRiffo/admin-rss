import db from "./firebaseAdmin";
import { fetchNews } from "./fetchNews";

export async function updateNewsCarousel() {

  const noticias = await fetchNews();

  const cards = noticias.map((n) => ({
    id: n.id,           // clave única
    type: "youtube",    // necesario para tu union type
    title: n.title,
    imageUrl: n.imageUrl,
    link: n.link
  }));

  await db.collection("carousels").doc("noticias").set({
    title: "Noticias",
    cards
  });

}