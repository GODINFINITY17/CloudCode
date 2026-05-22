import { S3 } from "aws-sdk";
import fs from "fs";
import path from "path";

const s3 = new S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION || "us-east-1"
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME || "";

export const fetchS3Folder = async (key: string, localPath: string): Promise<void> => {
    try {
        console.log(`Fetching S3 folder ${key} to ${localPath}`);
        const params = {
            Bucket: BUCKET_NAME,
            Prefix: key
        };

        const response = await s3.listObjectsV2(params).promise();
        
        if (response.Contents) {
            // Use Promise.all to fetch all files in parallel
            await Promise.all(response.Contents.map(async (file) => {
                const fileKey = file.Key;
                if (fileKey) {
                    const getObjectParams = {
                        Bucket: BUCKET_NAME,
                        Key: fileKey
                    };

                    const data = await s3.getObject(getObjectParams).promise();
                    if (data.Body) {
                        const fileData = data.Body;
                        // Replace the base prefix with the localPath safely
                        const relativePath = fileKey.replace(key, "").replace(/^\/+/, "");
                        if (!relativePath) return; // Skip if it's just the folder key itself
                        
                        const filePath = path.join(localPath, relativePath);
                        await writeFile(filePath, fileData);
                        console.log(`Downloaded ${fileKey} to ${filePath}`);
                    }
                }
            }));
        }

        // Provide a default index.js if nothing exists after download
        const indexPath = path.join(localPath, "index.js");
        if (!fs.existsSync(indexPath)) {
            await writeFile(indexPath, "// Welcome to cloudCode locally!\nconsole.log('Hello from local env!');");
        }
    } catch (error) {
        console.error('Error fetching folder:', error);
    }
};

export async function copyS3Folder(sourcePrefix: string, destinationPrefix: string, continuationToken?: string): Promise<void> {
    try {
        console.log(`Copying S3 folder ${sourcePrefix} to ${destinationPrefix}`);
        const listParams: S3.ListObjectsV2Request = {
            Bucket: BUCKET_NAME,
            Prefix: sourcePrefix,
            ContinuationToken: continuationToken
        };

        const listedObjects = await s3.listObjectsV2(listParams).promise();

        if (!listedObjects.Contents || listedObjects.Contents.length === 0) return;

        await Promise.all(listedObjects.Contents.map(async (object) => {
            if (!object.Key) return;
            const destinationKey = object.Key.replace(sourcePrefix, destinationPrefix);
            const copyParams = {
                Bucket: BUCKET_NAME,
                CopySource: `${BUCKET_NAME}/${object.Key}`,
                Key: destinationKey
            };

            await s3.copyObject(copyParams).promise();
            console.log(`Copied ${object.Key} to ${destinationKey}`);
        }));

        if (listedObjects.IsTruncated) {
            await copyS3Folder(sourcePrefix, destinationPrefix, listedObjects.NextContinuationToken);
        }
    } catch (error) {
        console.error('Error copying folder:', error);
    }
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
    try {
        const fullKey = `${key}/${filePath}`;
        console.log(`Saving ${filePath} to S3 bucket at ${fullKey}`);
        const params = {
            Bucket: BUCKET_NAME,
            Key: fullKey,
            Body: content
        };
        await s3.putObject(params).promise();
    } catch (error) {
        console.error("Error saving to S3:", error);
    }
}