import fs from "fs";
import path from "path";

// Mocking AWS S3 behavior to run locally without credentials

export const fetchS3Folder = async (key: string, localPath: string): Promise<void> => {
    try {
        console.log(`[MOCK] Fetching S3 folder ${key} to ${localPath}`);
        await createFolder(localPath);
        // Provide a default index.js if nothing exists
        const indexPath = path.join(localPath, "index.js");
        if (!fs.existsSync(indexPath)) {
            await writeFile(indexPath, "// Welcome to cloudCode locally!\nconsole.log('Hello from local env!');");
        }
    } catch (error) {
        console.error('Error fetching folder:', error);
    }
};

export async function copyS3Folder(sourcePrefix: string, destinationPrefix: string, continuationToken?: string): Promise<void> {
    console.log(`[MOCK] Copied S3 folder ${sourcePrefix} to ${destinationPrefix}`);
}

function writeFile(filePath: string, fileData: any): Promise<void> {
    return new Promise(async (resolve, reject) => {
        await createFolder(path.dirname(filePath));

        fs.writeFile(filePath, fileData, (err) => {
            if (err) {
                reject(err)
            } else {
                resolve()
            }
        })
    });
}

function createFolder(dirName: string) {
    return new Promise<void>((resolve, reject) => {
        fs.mkdir(dirName, { recursive: true }, (err) => {
            if (err) {
                return reject(err)
            }
            resolve()
        });
    })
}

export const saveToS3 = async (key: string, filePath: string, content: string): Promise<void> => {
    console.log(`[MOCK] Saving ${filePath} to S3 bucket at ${key}`);
}