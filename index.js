const express = require('express')
const app = express()

const PDFUtil = require('./utils/pdf.util');

app.get('/', function (req, res) {
  const output = [
    '<h2>Example PDF renderer</h2>',
    '<hr/>',
    'Approach 1: (URL Based)',
    'a. Remote: <a href="http://localhost:7676/pdf/url?q=https://google.com">http://localhost:7676/pdf/url?q=https://google.com</a>',
    'b. Local: <a href="http://localhost:7676/pdf/url?q=http://localhost:7676">http://localhost:7676/pdf/render?q=http://localhost:7676</a>',
    '<hr/>',
    'Approach 2: (HTML Based)',
    '<a href="http://localhost:7676/pdf/render">http://localhost:7676/pdf/render</a>',
  ];
  const outputPars = output.map(x => `<p>${x}</p>`);

  res.send(
`<body>
        <div style="max-width: 700px; margin: 0 auto;">${outputPars.join('')}</div>
      </body>`
  );
});

app.get('/pdf/url', function (req, res) {
  const { q: url = 'https://google.com' } = req.query;
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

const PORT = 7676;
console.log(`Server running on port: ${PORT}`);
console.log(`Remote: http://localhost:7676/pdf/url?q=https://google.com`);
console.log(`Local: http://localhost:7676/pdf/url?q=http://localhost:7676`);

app.listen(PORT);
