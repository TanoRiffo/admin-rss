import axios from "axios";
import { YoutubeCardData } from "../types/carrusel";

export async function fetchNews(): Promise<YoutubeCardData[]> {

  const url = "https://uap.edu.ar/wp-json/wp/v2/posts?_embed&per_page=5";

  try {

    const { data } = await axios.get(url);

    const noticias: YoutubeCardData[] = data.map((post: any) => {

      const title = post.title?.rendered || "Sin título";
      const link = post.link || "";

      const image =
        post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
        post._embedded?.["wp:featuredmedia"]?.[0]?.media_details?.sizes?.medium?.source_url ||
        post._embedded?.["wp:featuredmedia"]?.[0]?.media_details?.sizes?.thumbnail?.source_url ||
        "https://via.placeholder.com/300";

      return {
        id: post.id.toString(),
        type: "youtube",   // 👈 IMPORTANTE
        title: title,
        imageUrl: image,   // 👈 NO image
        link: link
      };

    });

    return noticias;

  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }

}