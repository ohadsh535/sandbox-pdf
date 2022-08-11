const puppeteer = require('puppeteer');

const PDF_FORMAT_OPTS = {
  format: 'A4',
  margin: {
    top: '38px',
    right: '38px',
    bottom: '38px',
    left: '38px',
  },
};

/***
 * URL based rendering.
 *
 * @param url
 * @returns {Promise<Buffer>}
 */
async function urlToPdf(url) {
  const browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage();
  await page.goto(url, {waitUntil: 'networkidle0'});
  const pdf = await page.pdf(PDF_FORMAT_OPTS);

  await browser.close();
  return pdf
}

/***
 * HTML based rendering.
 *
 * @param pdfHTML
 * @returns {Promise<Buffer>}
 */
async function htmlToPdf(pdfHTML) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  await page.setContent(pdfHTML);
  const pdf = await page.pdf(PDF_FORMAT_OPTS);
  await browser.close();
  return pdf;
}

const PDFUtil = {
  urlToPdf,
  htmlToPdf
};

module.exports = PDFUtil;
