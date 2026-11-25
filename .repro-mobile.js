async (page) => {
  const base = "D:/Projects/Wishlist site/";
  const log = [];

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
  await page.evaluate(() => localStorage.clear());

  const slugs = ["brown-stair-brown-lacquer", "geometric-solids-with-stand"];
  for (const slug of slugs) {
    await page.goto("http://localhost:3000/product/" + slug, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Add to quote request" }).first().click();
    await page.waitForTimeout(300);
  }

  await page.goto("http://localhost:3000/cart", { waitUntil: "networkidle" });
  await page.waitForTimeout(500);

  const dims = await page.evaluate(() => ({
    docScroll: document.documentElement.scrollWidth,
    docClient: document.documentElement.clientWidth,
    bodyScroll: document.body.scrollWidth,
  }));
  log.push("cart dims: " + JSON.stringify(dims));

  const wide = await page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const out = [];
    document.querySelectorAll("main *").forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.right > vw + 1) {
        out.push(
          el.tagName +
            " | " +
            String(el.className).slice(0, 70) +
            " | right=" +
            Math.round(r.right) +
            " | " +
            (el.textContent || "").trim().slice(0, 28),
        );
      }
    });
    return out.slice(0, 14);
  });
  log.push("overflow: " + JSON.stringify(wide, null, 1));

  await page.screenshot({ path: base + "repro-cart.png", fullPage: true });
  return log.join("\n");
}
