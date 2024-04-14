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
pdfSchema.index({ title: "text", author: "text", keywords: "text" });
const PDF = mongoose.model("PDF", pdfSchema);

module.exports = PDF;
