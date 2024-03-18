import mongoose from "mongoose";
import puppeteer from "puppeteer";
import { getLinkModel } from "../models/linkModel.js";

export async function scrapper(Book, collection) {
  const Link = getLinkModel(collection);
  const links = await Link.find();
  console.log(links);

  const browser = await puppeteer.launch({ headless: false });
  for (let i = 0; i < links.length; i++) {
    // async function scrap() {
    try {
      const page = await browser.newPage();
      await page.goto(links[i].link);
      await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36"
      );
      console.log(links[i].link);
      const title = await page.evaluate(
        () => document.querySelector("#productTitle").textContent
      );

      const img = await page.evaluate(() => {
        const imgEl =
          document.querySelector("#ebooksImgBlkFront") ||
          document.querySelector("#imgBlkFront") ||
          document.querySelector("#main-image") ||
          document.querySelector(".a-dynamic-image");
        return imgEl.src;
      });

      const rating = await page.evaluate(
        () => document.querySelector("i span").innerHTML.split(" ")[0]
      );

      const author = await page.evaluate(() => {
        const authorEl =
          document.querySelector(
            "#bylineInfo > span > span.a-declarative > a.a-link-normal.contributorNameID"
          ) || document.querySelector(".author a").innerHTML;
        return authorEl ? authorEl.innerHTML : "Anonymous";
      });

      const price = await page.evaluate(() => {
        const priceEl =
          document.querySelector(
            "#a-autoid-2-announce > span.slot-price > span"
          ) ||
          document.querySelector(
            "#a-autoid-1-announce > span.slot-price > span"
          ) ||
          document.querySelector(
            "#a-autoid-3-announce > span.slot-price > span"
          ) ||
          document.querySelector(
            "#a-autoid-0-announce > span.slot-price > span"
          );
        return priceEl ? priceEl.textContent.trim() : "Not Found";
      });

      const reviews = await page.evaluate(() => {
        const reviewEl = document.querySelector("#acrCustomerReviewText");
        return reviewEl ? reviewEl.innerHTML : "0 reviews";
      });

      const clickable = await page.evaluate(() => {
        const clickable = document.querySelector(
          "#bookDescription_feature_div > div > div.a-expander-header.a-expander-partial-collapse-header > a"
        );
        return clickable && clickable.click();
      });

      // if (clickable) await page.click(clickable);

      const desc = await page.evaluate(() => {
        return document.querySelector(
          "#bookDescription_feature_div > div > div.a-expander-content.a-expander-partial-collapse-content.a-expander-content-expanded"
        ).innerText;
      });

      // if (clickable) await page.click(clickable);

      const data = {
        title,
        img,
        desc,
        reviews,
        rating,
        author,
        price,
      };
      console.log(typeof Book);

      const book = new Book(data);
      const result = await book.save();
      console.log(result);
      await page.close();
    } catch (error) {
      console.log(error, links[i].link);
      // scrap();
    }
    // }
    // scrap();
  }

  await browser.close();
}

export function closeConnection() {
  mongoose.connection
    .close()
    .then(() => console.log("Connection closed......."));
}
