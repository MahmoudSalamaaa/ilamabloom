const base="https://www.ilamabloom.com";
const publicRoutes=[
  ["", "weekly", 1],
  ["/explore", "weekly", .8],
  ["/food-atlas", "weekly", .8],
  ["/journal", "daily", .7],
  ["/visit", "weekly", .7],
  ["/kids", "weekly", .7],
  ["/lens", "monthly", .6],
  ["/account", "monthly", .4],
  ["/privacy", "monthly", .4],
  ["/about", "monthly", .4],
] as const;

export default function sitemap(){
  const lastModified=new Date();
  return publicRoutes.map(([path,changeFrequency,priority])=>({
    url:base+path,
    lastModified,
    changeFrequency,
    priority,
  }));
}

