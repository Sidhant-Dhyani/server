const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { MongoClient, GridFSBucket } = require("mongodb");
const fs = require("fs");
const multer = require("multer");
// const UserModel = require("./models/user");
// const PDF = require("./models/pdf");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 3000;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const atlas =
  "mongodb+srv://brahmgaur17:26download12345@cluster0.bl32bqx.mongodb.net/Test";

const client = new MongoClient(atlas);

async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas1");
  } catch (error) {
    console.error("Error connecting to MongoDB Atlas:", error);
  }
}

connectToMongoDB();

async function connectToMongoDB1() {
  try {
    await mongoose.connect(
      "mongodb+srv://brahmgaur17:26download12345@cluster0.bl32bqx.mongodb.net/Test"
    );
    console.log("Connected to MongoDB Atlas2");
  } catch (error) {
    console.error("Error connecting to MongoDB Atlas:", error);
  }
}

connectToMongoDB1();

// app.get("/users", (req, res) => {
//   UserModel.find()
//     .then((users) => res.json(users))
//     .catch((err) => res.json(err));
// });

// app.get("/users", async (req, res) => {
//   try {
//     let users = await UserModel.find();
//     console.log(users);
//     res.json(users);
//   } catch (err) {
//     console.log(err);
//   }
//   return;
// });

app.post("/upload", upload.single("file"), async (req, res) => {
  console.log(req.body);
  try {
    // Ensure a file is uploaded
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Connect to the database
    const db = client.db("Test");
    const bucket = new GridFSBucket(db);

    const uploadedFile = req.file;
    const uploadStream = bucket.openUploadStream(uploadedFile.originalname, {
      metadata: {
        contentType: uploadedFile.mimetype,
        title: req.body.title,
        author: req.body.author,
        description: req.body.description,
      },
    });

    // Write the file buffer to GridFS
    uploadStream.end(uploadedFile.buffer);

    uploadStream.on("error", (error) => {
      console.error("Error uploading file:", error);
      res.status(500).json({ error: "Internal Server Error" });
    });

    uploadStream.on("finish", async () => {
      res.status(200).json({ message: "File uploaded successfully" });
    });
  } catch (error) {
    console.error("Error handling file upload:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/pdfs", async (req, res) => {
  try {
    const db = client.db("farzi");
    const bucket = new GridFSBucket(db);

    const files = await bucket.find().toArray();

    // Extract relevant file information
    const pdfs = files.map((file) => {
      return {
        filename: file.filename,
        contentType: file.contentType,
        uploadDate: file.uploadDate,
      };
    });

    res.status(200).json(pdfs);
  } catch (error) {
    console.error("Error fetching PDFs:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/download-pdf/:filename", async (req, res) => {
  try {
    const db = client.db("Test");
    const bucket = new GridFSBucket(db);

    const filename = req.params.filename;
    const downloadStream = bucket.openDownloadStreamByName(filename);

    // Set response headers
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Type", "application/pdf");

    // Pipe the file stream to the response
    downloadStream.pipe(res);
  } catch (error) {
    console.error("Error downloading PDF:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/view-pdf/:filename", async (req, res) => {
  try {
    const db = client.db("farzi");
    const bucket = new GridFSBucket(db);

    const filename = req.params.filename;
    const downloadStream = bucket.openDownloadStreamByName(filename);

    // Set response headers
    res.setHeader("Content-Disposition", `inline; filename="${filename}"`);
    res.setHeader("Content-Type", "application/pdf");

    // Pipe the file stream to the response
    downloadStream.pipe(res);
  } catch (error) {
    console.error("Error viewing PDF:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// app.get('/users', async (req, res)=>{
//   await UserModel.find().then((users) => res.json(users))
//   .catch((err) => res.json(err));
// })

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
