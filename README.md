# Nespresso Product Scraper

This project scrapes product data from the Nespresso website, specifically targeting coffee capsules. The script uses Puppeteer to navigate through the pages and extract relevant product information, filtering out unwanted data and ensuring no duplicates.

## Features

- Scrapes product data including title, image link, description, and price.
- Handles pagination to scrape data from multiple pages.
- Filters out products without descriptions and those with "Kit" in their titles.
- Ensures no duplicate entries in the final dataset.
- Saves the scraped data to a JSON file.

## Prerequisites

- [Node.js](https://nodejs.org/) (version 12 or higher)

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/Ptdavid0/Scrapper.git
    cd nespresso-product-scraper
    ```

2. Install the dependencies:
    ```bash
    pnpm install
    ```

## Usage

Run the scraper script:

```bash
node puppeteer.js
```

This will launch Puppeteer, navigate through the Nespresso website, scrape the product data, and save it to a file named `products.json`.

## Configuration

The script is configured to scrape coffee capsules from the Nespresso Brazil website. If you need to scrape data from a different Nespresso region or change the query, you can modify the `getBaseUrl` function in `scraper.js` accordingly.

## File Structure

- `puppeteer.js`: The main script file that contains the logic for scraping the data.

## Contributing

Feel free to submit issues or pull requests if you have suggestions for improving the script.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
