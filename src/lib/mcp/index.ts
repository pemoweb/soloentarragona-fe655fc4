import { auth, defineMcp } from "@lovable.dev/mcp-js";
import searchDirectorio from "./tools/search-directorio";
import getBusiness from "./tools/get-business";
import listNews from "./tools/list-news";
import getNews from "./tools/get-news";
import listClassifieds from "./tools/list-classifieds";
import listServices from "./tools/list-services";
import whoami from "./tools/whoami";

// The OAuth issuer MUST be the direct Supabase host (not the .lovable.cloud proxy).
const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "solo-en-tarragona-mcp",
  title: "Solo en Tarragona",
  version: "0.1.0",
  instructions:
    "Herramientas para consultar el directorio local, noticias, clasificados y servicios públicos de Tarragona (Solo en Tarragona). Usa search_directorio y get_business para negocios, list_news y get_news_post para noticias, list_classifieds para anuncios y list_public_services para emergencias/farmacias/hospitales.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [
    searchDirectorio,
    getBusiness,
    listNews,
    getNews,
    listClassifieds,
    listServices,
    whoami,
  ],
});
