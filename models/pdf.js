const mongoose = require("mongoose");

const pdfSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    coursecode: { type: String },
    year: { type: Number },
    semester: { type: Number },
    filePath: { type: String },
    tags: [string],
  },
  { timestamps: true }
);
const PDF = mongoose.model("PDF", pdfSchema);

module.exports = PDF;
