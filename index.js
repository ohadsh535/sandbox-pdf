const express = require('express');
const app = express();

const PORT = 7676;

const PDFUtil = require('./utils/pdf.util');

app.get('/', function (req, res) {

  const URLS = {
    remote: `http://localhost:${PORT}/pdf/url?q=https://google.com`,
    local: `http://localhost:${PORT}/pdf/url?q=http://localhost:${PORT}`,
    render: `http://localhost:${PORT}/pdf/render`,
  }

  const output = [
    '<h2>Example PDF renderer</h2>',
    '<hr/>',
    'Approach 1: (URL Based)',
    `a. Remote: <a href="${URLS.remote}">${URLS.remote}</a>`,
    `b. Local: <a href="${URLS.local}">${URLS.local}</a>`,
    '<hr/>',
    'Approach 2: (HTML Based)',
    `<a href="${URLS.render}">${URLS.render}</a>`,
  ];
  const outputPars = output.map(x => `<p>${x}</p>`);

  res.send(`<body><div style="max-width: 700px; margin: 30px auto;">${outputPars.join('')}</div></body>`);
});

app.get('/pdf/url', function (req, res) {
  const {q: url = 'https://google.com'} = req.query;
  PDFUtil.urlToPdf(url)
    .then((pdf) => {
      res.contentType('application/pdf');
      res.send(pdf);
    })
    .catch((err) => res.send(err));
});

app.get('/pdf/render', function (req, res) {
  /** -- Example -- If using template engine, example pug */
  // const options = { docData: {} };
  // const { file = './pdf-template.pug' } = options;
  // const pdfHTML = pug.renderFile(file, options);
  /** -- Example:End -- */

  PDFUtil.htmlToPdf(`<body><p>Just rendered pdf from dynamic HTML</p><p>${new Date().toISOString()}</p></body>`)
    .then((pdf) => {
      res.contentType('application/pdf');
      res.send(pdf);
    })
    .catch((err) => res.send(err));
});

console.log(`Server running on port: ${PORT}`);
console.log(`Visit: http://localhost:${PORT}`);

app.listen(PORT);
