import mongoose from "mongoose";
import puppeteer from "puppeteer";

export async function scrapper(url, Link) {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    const aTags = await page.$$eval(
      "#gridItemRoot .p13n-sc-uncoverable-faceout > a:nth-child(1)",
      (links) => {
        return links.map((link) => link.href);
      }
    );
    console.log("Tags " + aTags);
    console.log(url);

    aTags.forEach(async (link) => {
      const data = new Link({ link });
      const result = await data.save();
      console.log(result);
    });
    return aTags;
  } catch (error) {
    console.log(error);
    scrapper(url, Link);
  }
}

export function closedb() {
  mongoose.connection.close().then(() => console.log("Closed....."));
}
