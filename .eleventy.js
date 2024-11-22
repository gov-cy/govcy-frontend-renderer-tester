const fs = require('fs');
const path = require('path');
const { govcyFrontendRenderer } = require('@gov-cy/govcy-frontend-renderer');
// when build for live `npx @11ty/eleventy --pathprefix=prefix`
module.exports = function (eleventyConfig) {
    // Read pathPrefix from command-line arguments
    const argv = process.argv.slice(2); // Remove node and script path
    const pathPrefixArg = argv.find(arg => arg.startsWith('--pathprefix='));
    const pathPrefix = pathPrefixArg ? pathPrefixArg.split('=')[1] : '';
    console.log('pathPrefix:', pathPrefix);

    const renderer = new govcyFrontendRenderer();
    // Add a collection based on the JSON data
    eleventyConfig.addCollection('pages', function () {
        try {
            // Read configuration
            const files = getJsonFiles('src/data/');
            console.log('JSON Files:', files);
            let pages = [];
            //for each `json` file in `/src/data` folder
            files.forEach(file => {
                // read file
                const siteData = JSON.parse(fs.readFileSync(path.join(__dirname, 'src', 'data', file), 'utf8')); // get site data
                // console.log('SiteData:', siteData);
               
                // Inject script tag using Eleventy's url filter
                const scriptTag = `
                    <script src="${pathPrefix}/js/route.js"></script>
                `;
                // set url and content for all pages in this file (or site)
                const sitePages = siteData.pages.map(page => {
                    //---- handle site.sections (e.g. to have a site level header) ----
                    // Check if siteData.sections exists
                    if (siteData.site.sections) {
                        // Iterate over each section in siteData.sections
                        siteData.site.sections.forEach(siteSection => {
                            // Check if this section is already present in page.pageTemplate.sections
                            const hasSection = page.pageTemplate.sections.some(pageSection => pageSection.name === siteSection.name);
    
                            // If the section is missing, add it
                            if (!hasSection) {
                                page.pageTemplate.sections.push(siteSection);
                            }
                        });
                    }
                    return {
                        url: siteData.site.id + '/' + page.pageData.url,
                        routes: siteData.routes,
                        content: renderer.renderFromJSON(
                            page.pageTemplate, 
                            { "site": siteData.site, "pageData": page.pageData }
                        ).replace(
                            '</body>', 
                            `<script>
                                const DSFpathPrefix = '${pathPrefix}';
                                const DSFroutes=${JSON.stringify(siteData.routes)};
                            </script>
                            ${scriptTag}
                            </body>`)
                    }
                });
                // add file (or site) pages to collection array
                pages = pages.concat(sitePages);
                // console.log('Pages:', pages);
            });
            // console.log('Pages Collection:', pages); // Debug log
            console.log('Collection setup complete');
            return pages;
        } catch (error) {
            console.error('Error setting up collections:', error);
        }
    });
    console.log('Added pages collection');



    /**
 * Function to get a list of .json files in a directory
 * @param {string} relativeDir - The relative directory path
 * @returns {Array<string>} - An array of JSON file names
 */
    function getJsonFiles(relativeDir) {
        // Resolve the relative directory path to an absolute path
        const directoryPath = path.join(__dirname, relativeDir);

        try {
            // Read the directory synchronously
            const files = fs.readdirSync(directoryPath);

            // Filter out only .json files
            const jsonFiles = files.filter(file => path.extname(file) === '.json');

            // Return the array of JSON file names
            return jsonFiles;
        } catch (err) {
            console.error('Unable to scan directory:', err);
            return [];
        }
    }

    //copy `js`
    eleventyConfig.addPassthroughCopy("./src/js");

    //add markdown support for njk files
    const markdownIt = require("markdown-it");
    const md = markdownIt({ html: true });
    eleventyConfig.addNunjucksFilter("markdown", (content) => {
        return md.render(content);
      });

    // Add a custom Markdown shortcode
    eleventyConfig.addPairedShortcode("markdown", (content) => {
        return md.render(content); // Render raw HTML
      });
    
    // Specify input and output directories
    return {
        dir: {
            input: "src",
            output: "docs"
        },
        markdownTemplateEngine: "njk", // Use Nunjucks for Markdown
        htmlTemplateEngine: "njk",    // Use Nunjucks for HTML
        templateFormats: ["md", "njk"], // Supported file formats
    };

};
