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
                console.log('SiteData:', siteData);
               
                // Inject script tag using Eleventy's url filter
                const scriptTag = `
                    <script src="${pathPrefix}/js/route.js"></script>
                `;
                // set url and content for all pages in this file (or site)
                const sitePages = siteData.pages.map(page => ({
                    url: siteData.site.id + '/' + page.pageData.url,
                    content: renderer.renderFromJSON(
                        page.pageTemplate, 
                        { "site": siteData.site, "pageData": page.pageData }
                    ).replace('</body>', `${scriptTag}\n</body>`)
                }));
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

    
    // Specify input and output directories
    return {
        dir: {
            input: "src",
            output: "docs"
        }
    };

};
