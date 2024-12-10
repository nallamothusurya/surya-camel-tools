const express = require("express");
const multer = require("multer");
const { google } = require("googleapis");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const app = express();
const port = 3000;

// Set up Multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Google Drive API setup with Service Account Credentials
const credentials = {
    "type": "service_account",
    "project_id": "project1-5050",
    "private_key_id": "076cce432fca8311559a26571dabbe21bf5b62b0",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCakI6Y0rd7kr5N\nAl7PglKbnwbvPE7/mo8fsa5aW05VMvJaATNpmGJOz8hiYIBcsbS4ewf0vgC0jGTm\nM4N+Molhw7a9yqf5OFqESS7dcfTMzPCQs2OHtFjPn3LT+Yq2WyCpxr1mWN4WZxI9\nM6R9Yym03pAdM3zeYvdLOVOyxCS6SA+QzFLW7z1J6yedor5x2jsZ43iHsQqs/+eH\nzLR4NiylueZJQ7SJuXRZ5ZUnN8Sb1nPHL+Eg3tkIWAzeFwOWih6nssf6HXFHDWmM\nEgwxUdFUaER7N/ndRh3vZqBcOWIlUyoJRCBvAXa+LerNKhTSy52FMpFiq0gvwPMO\nCjfk2E/DAgMBAAECggEAIgCyNiGJFujZ75QZanonlS+/dUrlsCp+2QCcNCmJCoo6\nMZ25Az5wRhlE4ouLQZkggkMipW9VNWL7YX8sqssQWQ8WuRsHp/aDRz3YTwQeUB23\nwIWOXFDLBuXze3mWz/YtMdxUV1suhGwpYYhmY+U4TB94QcxNaJkKAST76kRnNgmD\nqIynNClbFCozpBbM0wji2Pj9k2UB5PknkkL3KCf+GBdR5fbxLvvWwIZTJj7qLXr3\nUia9Bk22dG8nh84Us45xCDynErP5q9xONY4I5hjGfOY5tBdix44KA7Xf1XDLCFIG\nqK5/U22a8al6vEIPxaSvxVOTD0ZNY/DBrOJeC6jKGQKBgQDSBNsG+3an4n4rCrKl\nB1VeWpGwrCPiC+3//HLzmVgIMv91mcEWd30rR6v9RF04eSTIqn8VuUek2r99cI4J\nFJMbv6WXfO4TnlulqSff+HKDhmEAEQMg2vi1jyKJCDRW8iQAZ/hrnixW2B8f0eKE\nqNc2amKw4NXbAiRHVUEREZLtSwKBgQC8Z5lWJDVPWv3M/bdBHO32nJvk6u1CThOb\nt812jwiBFKzbXBpytj/FNQsj1tlwYmsgZggScAVHXrUoQZYlCAWLERLtk8vzfRp0\nWZfEXSLfpq+Mv3zlUKnoS9AUiO5Q+I1eVe1AiB9CTjC8Vl0TAXQbW0dVdgc9EoNv\n6pvf5c10aQKBgCNRV7fz379Z0lfQo7wm4I9OccOhHyOrV+m9fWNDvU8brGQNaDAs\nBeuaUOz1ayvNC4eHTHnNv6OUebFRlUEnqZl4ABPamXrJHaZdLOx4LmG53mQReFI1\nIK//kxIyRAL/E1jSIy+N2Oz9yTYjqJEgh5iKCXCvTqdW09z/FEMXjnrDAoGAUIFk\nQC7QqMwUz1dKywP1mv9ojfTk1QRP1KZBoXuVArM2+bTtiD7gGQCFdhcEasVjSUDQ\nCjDb0JdjiYQdCE3ZMIdnMyWIbM70UutFsp6pnC+5q8bXM5W4RI7Ap0Wrr+XFYp4M\n9xozYT3QDWpJ8ykX1+i1HouEpFAY4eW6HX4wwKECgYEAwCwBv59EFf5+mLc64FiX\n7Js8Q2G77bVNnoxhWXzNCw78RlXtcW/e62LP+6rRgOVDm4qa3BsBMnvLnoGeZ+bX\nrnmidf3IiQx0oBhw1izaNVSQAZ07gSTG0/XetdSFQoVIcbuFn3NCzGiayg/rY1m4\ngb5xS29F0T1pfqDPn3ucnWo=\n-----END PRIVATE KEY-----\n",
    "client_email": "project1@project1-5050.iam.gserviceaccount.com",
    "client_id": "101365334169474563906",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/project1%40project1-5050.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
};

// OAuth2 Client for Service Account
const auth = new google.auth.GoogleAuth({
    credentials: credentials,
    scopes: ["https://www.googleapis.com/auth/drive.file"]
});

// Set up Google Drive API client
const drive = google.drive({ version: "v3", auth });

// Serve the static files in the "public" directory
app.use(express.static("public"));
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});
app.get("/crop", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "ccrop.html"));
});
app.get("/css", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "styles.css"));
});
app.get("/enhance", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "cenhance.html"));
});
app.get("/border", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "cborder.html"));
});
app.get("/colorborder", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "colborder.html"));
});

app.get("/advertise", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "image.png"));
});
app.get("/favicon", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "favicon.ico"));
});

app.get("/icon", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "favicon-32x32.png"));
});
// Route to handle image upload and storing on Google Drive
app.post("/upload", upload.single("image"), async (req, res) => {
    const file = req.file;
    if (!file) {
        return res.status(400).send("No file uploaded.");
    }

    const fileMetadata = {
        name: file.originalname,
        parents: ['your-folder-id'], // Optional: specify a folder in Drive
    };
    const media = {
        mimeType: file.mimetype,
        body: fs.createReadStream(file.buffer),
    };

    try {
        const driveResponse = await drive.files.create({
            resource: fileMetadata,
            media: media,
            fields: "id",
        });
        res.status(200).send({ fileId: driveResponse.data.id });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error uploading the file.");
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
