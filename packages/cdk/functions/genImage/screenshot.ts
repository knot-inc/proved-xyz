import chrome from "/opt/nodejs/chrome-aws-lambda";

export default async function screenshot(url: string) {
  let browser;
  try {
    const options = {
      args: chrome.args,
      executablePath: await chrome.executablePath,
      headless: chrome.headless,
    };

    // TODO: Use our defined fonts
    await chrome.font(
      "https://raw.githack.com/minoryorg/Noto-Sans-CJK-JP/master/fonts/NotoSansCJKjp-Medium.ttf"
    );
    await chrome.font(
      "https://raw.githack.com/googlefonts/noto-cjk/main/Sans/Variable/TTF/NotoSansCJKsc-VF.ttf"
    );
    await chrome.font(
      "https://raw.githack.com/googlei18n/noto-emoji/master/fonts/NotoColorEmoji.ttf"
    );

    browser = await chrome.puppeteer.launch(options);
    const page = await browser.newPage();
    await page.setViewport({ width: 700, height: 500 });
    await page.goto(url, { waitUntil: "networkidle0" });
    return await page.screenshot({ type: "png" });
  } finally {
    if (browser !== null) {
      await browser?.close();
    }
  }
}
