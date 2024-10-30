import { promises as fs } from "fs";

(async function() {    
    //delete docs folder
    console.error(`## Deleting built folder`);
    const folderPath = './docs';
    try {
        await fs.rm(folderPath, { recursive: true }); // Use fs.promises.rmdir()
        console.log(`Folder ${folderPath} has been deleted successfully.`);
    } catch (err) {
        console.error(`Error deleting folder: ${err}`);
    }
})();