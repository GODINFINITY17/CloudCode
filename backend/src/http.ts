import { Express } from "express";
import { copyS3Folder } from "./aws";
import express from "express";

export function initHttp(app: Express) {
    app.use(express.json());

    app.post("/project", async (req, res) => {
        // Hit a database to ensure this slug isn't taken already
        const { replId, language } = req.body;

        if (!replId) {
            res.status(400).send("Bad request");
            return;
        }

        await copyS3Folder(`base/${language}`, `code/${replId}`);

        res.send("Project created");
    });

    app.get("/", (req, res) => {
        res.send(`
            <html>
                <body style="font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background-color: #1e1e1e; color: #4ade80;">
                    <h1>🚀 Backend is working properly!</h1>
                </body>
            </html>
        `);
    });
}