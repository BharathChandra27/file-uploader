// Importing packages
const express = require("express");
const ejs = require("ejs");
const multer = require("multer");
const path = require("path");

// Initilizing the app
const app = express();
const port = 2000;

// Public folder
app.use(express.static("./public"));

// ejs config
app.set("view engine", "ejs");

// Setting Storage Engine
const storage = multer.diskStorage({
  destination: "./public/uploads",
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  }
});

// Init Upload
const upload = multer({
  storage: storage,
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
    //   limits: { fileSize: 10 }
    // Size specified in bytes
  }
}).single("myImage");

// Check File type
function checkFileType(file, cb) {
  // Allowed Ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check MIME types
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images Only!!");
  }
}

// Setting routes
app.get("/", (req, res) => {
  res.render("index");
});

app.post("/uploaded", (req, res) => {
  upload(req, res, err => {
    if (err) {
      res.render("index", {
        msg: err
      });
    } else {
      // console.log(req.file);
      if (req.file == undefined) {
        res.render("index", { msg: "Error: No file detected!!" });
      } else {
        res.render("success", {
          msg: "File uploaded succesfully!!",
          file: `uploads/${req.file.filename}`
        });
      }
    }
  });
});

// Setting app to listen on port: 2000
app.listen(port, () => console.log(`Server started on port ${port}`));
