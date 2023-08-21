const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs-extra");
const path = require("path");
const url = require("url");

async function downloadResource(src, outputDir) {
  // Parse the URL and skip if it's a relative URL.
  let parsedUrl;
  try {
    parsedUrl = new URL(src);
  } catch (err) {
    // src is a relative URL.
    return null;
  }

  const outputPath = path.join(
    outputDir,
    path.basename(decodeURIComponent(parsedUrl.pathname))
  );

  try {
    const response = await axios.get(src, { responseType: "arraybuffer" });
    fs.writeFileSync(outputPath, response.data);
    return outputPath;
  } catch (err) {
    console.log(`Failed to download resource from ${src}`);
    return null;
  }
}

async function processHtmlFile(inputFilePath, outputDir) {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirpSync(outputDir);
  }

  // Load the input HTML file.
  const inputHtml = fs.readFileSync(inputFilePath, "utf-8");
  const $ = cheerio.load(inputHtml);

  // Download resources and replace the URLs.
  // Updated selector array to include 'script[src]'
  let downloadPromises = [];
  ["link[href]", "img[src]", "script[src]"].forEach((selector) => {
    $(selector).each(function () {
      const attr = selector.split("[")[1].slice(0, -1);
      const src = $(this).attr(attr);

      if (!src) return;

      let downloadPromise = downloadResource(src, outputDir).then(
        (outputPath) => {
          if (outputPath) {
            const relativePath = path.relative(outputDir, outputPath);
            $(this).attr(attr, "./" + relativePath);
          }
        }
      );
      downloadPromises.push(downloadPromise);
    });
  });

  // Special handling for inline styles with background-image
  $("[style]").each(function () {
    let style = $(this).attr("style");
    const match = style.match(/url\(["']?(.*?)["']?\)/i);
    if (match) {
      const src = match[1];
      let downloadPromise = downloadResource(src, outputDir).then(
        (outputPath) => {
          if (outputPath) {
            const relativePath = path.relative(outputDir, outputPath);
            style = style.replace(src, "./" + relativePath);
            $(this).attr("style", style);
          }
        }
      );
      downloadPromises.push(downloadPromise);
    }
  });

  // Special handling for CSS in <style> tags.
  $("style").each(function () {
    let css = $(this).html();
    let urlRegex = /url\(["']?(.*?)["']?\)/g;
    let match;
    while ((match = urlRegex.exec(css)) !== null) {
      const src = match[1];
      let downloadPromise = downloadResource(src, outputDir).then(
        (outputPath) => {
          if (outputPath) {
            const relativePath = path.relative(outputDir, outputPath);
            css = css.replace(src, "./" + relativePath);
            $(this).html(css);
          }
        }
      );
      downloadPromises.push(downloadPromise);
    }
  });

  // Wait for all resources to be downloaded before saving HTML
  await Promise.all(downloadPromises);

  // Write the output HTML file.
  const outputHtml = $.html();
  fs.writeFileSync(
    path.join(outputDir, path.basename(inputFilePath)),
    outputHtml
  );
}

function copyNonIndexFiles(srcDir, destDir) {
  // Ensure the destination directory exists
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  // Read the source directory
  const files = fs.readdirSync(srcDir);

  // Iterate over each file/directory
  for (const file of files) {
    const fullPath = path.join(srcDir, file);

    // Check if it's a file and not index.html
    if (
      fs.statSync(fullPath).isFile() &&
      path.basename(fullPath) !== "index.html"
    ) {
      // Copy the file to the destination directory
      fs.copySync(fullPath, path.join(destDir, file));
    }
  }
}

const main = async () => {
  if (fs.existsSync(path.join(__dirname, "../dist"))) {
    fs.rmdirSync(path.join(__dirname, "../dist"));
  }

  // Usage
  await processHtmlFile(
    path.join(__dirname, "../src/index.html"),
    path.join(__dirname, "../dist")
  ).catch(console.error);

  copyNonIndexFiles(
    path.join(__dirname, "../src"),
    path.join(__dirname, "../dist")
  );
};

main();
