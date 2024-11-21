/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

// See https://developers.cloudflare.com/workers/tutorials/build-a-qr-code-generator/ for more details
export default {
	async fetch(request, env, ctx) {
		// Handle POST requests to generate QR code
		if (request.method === 'POST') {
			return generateQRCode(request);
		}

		// Return the landing page for GET requests
		return new Response(landingHTML, {
			headers: {
				'Content-Type': 'text/html',
			},
		});
	},
};

import QRCode from 'qrcode-svg';

async function generateQRCode(request) {
	const { text } = await request.json();
	const qr = new QRCode({ content: text || 'https://discuss.pytorch.kr' });
	return new Response(qr.svg(), { headers: { 'Content-Type': 'image/svg+xml' } });
}

const landingHTML = `
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>QR Code Generator</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
</head>
<body>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container">
      <a class="navbar-brand" href="/">QR Code Generator</a>
      <!--
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <a class="nav-link active" aria-current="page" href="#">Home</a>
          </li>
        </ul>
      </div>
      -->
    </div>
  </nav>

  <div class="container">
    <h1 class="fs-4 pt-3 mb-3">QR Code Generator</h1>

    <div class="col-md-9 col-sm-12">

      <!-- How to use -->
      <div class="mb-3">
        <p class="fs-5 px-0">How to use:</p>
        <ol>
          <li>Enter the URL (or text) you want to encode in the QR code.</li>
          <li>Click the "Generate QR Code" button.</li>
          <li>The QR code will be generated and displayed below.</li>
        </ol>
      </div>

      <hr class="col-3 my-4">

      <!-- QR Code Generator Form -->
      <div class="mb-3">
        <label for="textToGenerate" class="form-label fs-5">Text to Generate QR Code:</label>
        <div class="input-group mb-3">
          <input type="email" class="form-control" id="textToGenerate" placeholder="https://discuss.pytorch.kr">
          <button onclick="generate()" class="btn btn-outline-secondary">Generate QR Code</button>
        </div>
        <p class="fs-5">Your Generated QR Code Image:</p>
        <img id="qr" src="data:image/png;base64,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" />
      </div>

      <hr class="col-3 my-4">

      <!-- Some Examples -->
      <div class="mb-3">
        <p class="fs-5 px-0">Some Examples:</p>
        <ol>
          <li>URL: <code>https://discuss.pytorch.kr</code></li>
          <li>Text: <code>Visit PyTorch Korea User Group, https://pytorch.kr/</code></li>
          <li>WiFi: <code>WIFI:T:WPA;S:SSID;P:password;;</code></li>
          <li>SMS: <code>SMS:+1234567890:Visit PyTorch Korea User Group, https://pytorch.kr/</code></li>
          <li>Email: <code>mailto:somewhere@over.the.9bow</code></li>
          <li>Phone: <code>tel:+1234567890</code></li>
        </ol>
      </div>

      <hr class="col-3 my-4">

      <!-- Disclaimer -->
      <div class="col-12 mb-3">
        <p class="fs-5 px-0">Disclaimer:</p>
        <p class="col-12">
          This tool is provided for personal purposes only. Do not use it for any illegal activities. <br />
          If you want your own, see <a href="https://developers.cloudflare.com/workers/tutorials/build-a-qr-code-generator/" target="_blank">Cloudflare's "Build a QR code generator" tutorial</a> for more details.
        </p>
      </div>

    </div>
  </div>

  <footer class="footer mt-auto py-3 bg-dark text-white">
    <div class="container">
      Published by <a href="https://9bow.io">9bow</a>
    </div>
  </footer>
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-Z16BL2F8EN"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-Z16BL2F8EN');
  </script>
  <script type="text/javascript">
    function generate() {
      fetch(window.location.pathname, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: document.querySelector("#textToGenerate").value })
      })
      .then(response => response.blob())
      .then(blob => {
        const reader = new FileReader();
        reader.onloadend = function () {
          // Update the image source with the newly generated QR code
          document.querySelector("#qr").src = reader.result;
          console.log(reader.result);
        }
        reader.readAsDataURL(blob);
      })
    }
  </script>
</body>
</html>
`;
