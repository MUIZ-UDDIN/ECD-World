async (page) => {
  const pages = [
    "/",
    "/shop",
    "/shop/sensorial",
    "/product/brown-stair-brown-lacquer",
    "/product/geometric-solids-with-stand",
    "/product/11-colored-pencils-1-dozen-pencils-per-color",
    "/cart",
    "/checkout",
    "/wishlist",
    "/about",
    "/contact",
    "/does-not-exist",
  ];

  const cart = [
    { slug: "brown-stair-brown-lacquer", quantity: 1 },
    { slug: "geometric-solids-with-stand", quantity: 2 },
    { slug: "11-colored-pencils-1-dozen-pencils-per-color", quantity: 1 },
    { slug: "stands-for-long-red-rods-numerical-rods", quantity: 1 },
  ];

  const report = [];

  for (const width of [320, 375, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
    await page.evaluate((items) => {
      localStorage.setItem(
        "ecd-world-store",
        JSON.stringify({ state: { cart: items, wishlist: [] }, version: 1 }),
      );
    }, cart);

    for (const path of pages) {
      await page.goto("http://localhost:3000" + path, { waitUntil: "networkidle" });
      await page.waitForTimeout(250);

      const result = await page.evaluate(() => {
        const de = document.documentElement;
        const overflow = de.scrollWidth - de.clientWidth;
        const offenders = [];
        if (overflow > 0) {
          de.querySelectorAll("body *").forEach((el) => {
            const r = el.getBoundingClientRect();
            if (r.right > de.clientWidth + 1) {
              offenders.push(
                el.tagName +
                  "." +
                  String(el.className).slice(0, 46) +
                  " r=" +
                  Math.round(r.right) +
                  " | " +
                  (el.textContent || "").trim().slice(0, 24),
              );
            }
          });
        }
        return { overflow, offenders: offenders.slice(0, 3) };
      });

      report.push(
        width + "px  " + path.padEnd(58) + (result.overflow > 0 ? "OVERFLOW +" + result.overflow : "ok"),
      );
      if (result.overflow > 0) {
        result.offenders.forEach((o) => report.push("        " + o));
      }
    }
  }

  return report.join("\n");
}
