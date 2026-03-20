import Parser from "rss-parser";

const parser = new Parser();

type Video = {
  title: string;
  link: string;
  pubDate?: string;
};

type Programa = {
  programa: string;
  title: string;
  link: string;
  pubDate?: string;
};

const PROGRAMAS = [
  { nombre: "Ventana al Día", match: ["ventana al dia"] },
  { nombre: "Un Toque a las Noticias", match: ["un toque a las noticias"] },
  { nombre: "Sintonizados", match: ["sintonizados"] },
  { nombre: "Línea de Tres", match: ["linea de tres", "línea de tres","linea de 3"] },
  { nombre: "Dios con Nosotros", match: ["dios con nosotros"] }
];

function getVideoId(url: string): string | null {
  const match = url.match(/v=([^&]+)/);
  return match ? match[1] : null;
}

function obtenerUltimosProgramas(videos: Video[]): Programa[] {
  const resultado: Programa[] = [];

  for (const programa of PROGRAMAS) {
    const filtrados = videos.filter((video: Video) =>
      programa.match.some(p =>
        video.title.toLowerCase().includes(p)
      )
    );

    if (filtrados.length > 0) {
      resultado.push({
        programa: programa.nombre,
        ...filtrados[0]
      });
    }
  }

  return resultado;
}

export async function fetchYouTubePrograms() {
  const feed = await parser.parseURL(
    "https://www.youtube.com/feeds/videos.xml?channel_id=UCz0MY5RSR6yoPuDJq8ugIcA" // 👈 poné tu channel_id real
  );

  const videos: Video[] = feed.items.map((item: any) => ({
    title: item.title,
    link: item.link,
    pubDate: item.pubDate
  }));

  videos.sort((a, b) =>
    new Date(b.pubDate || 0).getTime() - new Date(a.pubDate || 0).getTime()
  );

  const programas = obtenerUltimosProgramas(videos);

  const cards = programas.map((video: Programa) => ({
    id: video.link,
    type: "youtube",
    title: video.title,
    imageUrl: `https://img.youtube.com/vi/${getVideoId(video.link)}/hqdefault.jpg`,
    link: video.link
  }));

  return cards;
}