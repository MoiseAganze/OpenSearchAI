const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();
const PORT = 3000;

// Liste de proxys (remplace-les par des proxys valides)
const proxyList = [
  "http://proxy1.com:port",
  "http://proxy2.com:port",
  "http://proxy3.com:port",
  "http://proxy4.com:port",
];

// Fonction pour obtenir un User-Agent dynamique
function getRandomUserAgent() {
  const userAgents = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  ];
  return userAgents[Math.floor(Math.random() * userAgents.length)];
}

// Fonction pour scraper Bing
async function scrapeBing(query, useProxy, extraUrl) {
  const bingURL = `https://www.bing.com/search?q=${encodeURIComponent(query)}`;
  const userAgent = getRandomUserAgent();

  const axiosOptions = {
    headers: { "User-Agent": userAgent },
  };

  if (useProxy) {
    axiosOptions.proxy = {
      host: proxyList[Math.floor(Math.random() * proxyList.length)],
    };
  }

  try {
    const response = await axios.get(bingURL, axiosOptions);
    const $ = cheerio.load(response.data);

    let results = [];
    $("li.b_algo").each((index, element) => {
      const link = $(element).find("a").attr("href");
      if (link) results.push(link);
    });

    if (extraUrl) {
      return [...results.slice(1, 3), extraUrl]; // 2 liens Bing + 1 URL personnalisée
    } else {
      return results.slice(1, 4); // 3 liens Bing
    }
  } catch (error) {
    console.error("Erreur lors du scraping de Bing:", error.message);
    return [];
  }
}

// Fonction pour scraper le contenu des pages trouvées
async function scrapePageContent(url, useProxy) {
  try {
    const userAgent = getRandomUserAgent();
    const axiosOptions = {
      headers: { "User-Agent": userAgent },
    };

    if (useProxy) {
      axiosOptions.proxy = {
        host: proxyList[Math.floor(Math.random() * proxyList.length)],
      };
    }

    const response = await axios.get(url, axiosOptions);
    const $ = cheerio.load(response.data);

    let title = $("title").text().trim();
    let paragraphs = [];
    $("p").each((index, element) => {
      paragraphs.push($(element).text().trim());
    });

    let content = paragraphs.join(" ");
    let contentSize = Buffer.byteLength(content, "utf-8"); // Taille en octets

    // Récupération du nom du site et de l'icône
    let siteName =
      $("meta[property='og:site_name']").attr("content") || url.split("/")[2];
    let favicon =
      $("link[rel='icon']").attr("href") ||
      `https://${url.split("/")[2]}/favicon.ico`;

    return { title, content, contentSize, siteName, favicon, url };
  } catch (error) {
    console.error(`Erreur lors du scraping de la page ${url}:`, error.message);
    return {
      title: "",
      content: "",
      contentSize: 0,
      siteName: "",
      favicon: "",
      url,
    };
  }
}

// Route API
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/IHM/index.html");
});
app.get("/search", async (req, res) => {
  const { key, proxy, url } = req.query;

  if (!key) {
    return res.status(400).json({ error: "Paramètre 'key' requis" });
  }

  const useProxy = proxy === "true";
  const links = await scrapeBing(key, useProxy, url);

  if (links.length === 0) {
    return res.status(500).json({ error: "Aucun lien trouvé" });
  }

  let results = {};
  let count = 1;
  for (const link of links) {
    const pageData = await scrapePageContent(link, useProxy);
    results[`SEARCH${count}`] = {
      Name: pageData.siteName,
      Icon: pageData.favicon,
      Link: pageData.url,
      Title: pageData.title,
      Content: pageData.content,
      Size: `${pageData.contentSize} bytes`,
    };
    count++;
  }

  res.json({ query: key, results });
});

// Lancer le serveur
app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
