const mongoose = require("mongoose");

const pdfSchema = new mongoose.Schema(
  {
    filename: String,
    contentType: String,
    metadata: {
      title: String,
      author: String,
      description: String,
    },
  },
  { timestamps: true }
);

const PDF = mongoose.model("PDF", pdfSchema);
module.exports = PDF;
