const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const fs = require("fs").promises;

puppeteer.use(StealthPlugin());

(async () => {
  let allProducts = [];
  let currentPage = 1;
  let hasNextPage = true;

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
  );

  const getBaseUrl = (page) =>
    `https://www.nespresso.com/br/busca?q=Capsulas&tab=Products&p=${page}&prd_facet_categories=Capsule`;

  while (hasNextPage) {
    const url = getBaseUrl(currentPage);
    await page.goto(url, { waitUntil: "networkidle2" });

    const products = await page.evaluate(() => {
      const productElements = document.querySelectorAll(
        "div._product-item_1bth7_93"
      );
      const productData = [];

      productElements.forEach((product) => {
        const title =
          product.querySelector("a._title-section_1bth7_142")?.innerText || "";
        const imageLink =
          product.querySelector("div._image-section_1bth7_129 img")?.src || "";
        const description =
          product.querySelector("div._metadata-section_1bth7_154 div")
            ?.innerText || "";
        const price =
          product.querySelector("div._price_1bth7_165")?.innerText || "";

        productData.push({
          title,
          imageLink,
          description,
          price,
        });
      });

      return productData;
    });

    allProducts = allProducts.concat(products);

    const nextPageLink = await page.evaluate(() => {
      const nextLink = document.querySelector('a[aria-label="Próximo"]');
      return nextLink ? nextLink.href : null;
    });

    console.log(`Scrapping page number: ${currentPage}`);

    hasNextPage = !!nextPageLink;

    if (hasNextPage) currentPage++;
  }

  const filterAndRemoveDuplicates = (products) => {
    const filteredData = products.filter(
      (product) => !!product.description && !product.title.includes("Kit")
    );

    const uniqueProducts = [];
    const seenTitles = new Set();

    for (const product of filteredData) {
      if (!seenTitles.has(product.title)) {
        seenTitles.add(product.title);
        uniqueProducts.push(product);
      }
    }

    return uniqueProducts;
  };

  try {
    const filteredData = filterAndRemoveDuplicates(allProducts);

    console.log("Capsulas identificadas: ", filteredData.length);
    console.log(
      "Produtos removidos: ",
      allProducts.length - filteredData.length
    );

    await fs.writeFile("products.json", JSON.stringify(filteredData, null, 2));
    console.log("Data saved to products.json");
  } catch (error) {
    console.error("Error writing to file:", error);
  }

  await browser.close();
})();
