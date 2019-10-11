const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");


//Database connection
mongoose.connect("mongodb://localhost:27017/wikiDb", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Schemas
const articleSchema = new mongoose.Schema({
  title: String,
  content: String
});

// create Collection
const Article = new mongoose.model("Article", articleSchema);


const app = express();

app.set('view-engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

////////////////////////////Request targeting all articles////////////////////////
app.route("/articles")

  //GET all articles
  .get(function(req, res) {
    Article.find({}, function(err, foundArticles) {
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    });
  })

  //Post articles
  .post(function(req, res) {
    const articleTitle = req.body.title;
    const articleContent = req.body.content;

    const article = new Article({
      title: articleTitle,
      content: articleContent
    });
    article.save(function(err) {
      if (!err) {
        res.send("Successfully Inserted");
      } else {
        res.send(err);
      }
    });
  })

//Delete all article
delete(function(req, res) {
  Article.deleteMany(function(err) {
    if (!err) {
      res.send("All articles are deleted Successfully");
    } else {
      res.send(err);
    }
  });
});




////////////////////////////Request targeting specific articles////////////////////////

app.route("/articles/:titleName")
  //Get specific article
  .get(function(req, res) {
    const titleName = req.params.titleName;
    Article.findOne({
      title: titleName
    }, function(err, foundArticle) {
      if (!err) {
        res.send(foundArticle);
      } else {
        res.send("No article matching that title was found.");
      }
    });
  })
  .put(function(req, res) {

    Article.update({
        title: req.params.titleName
      }, {
        title: req.body.title,
        content: req.body.content
      }, {
        overwrite: true
      },
      function(err) {
        if (!err) {
          res.send("Article Successfully updated");
        } else {
          res.send(err);
        }
      });
  })
  .patch(function(req, res) {
    Article.update({
      title: req.params.titleName
    }, {
      $set: req.body

    }, function(err) {
      if (!err) {
        res.send("Successfully Updated");
      } else {
        res.send(err);
      }
    });
  })
  .delete(function(req, res) {
    Article.delete({
      title: req.params.titleName
    }, function(err) {
      if (!err) {
        res.send("Document delete Successfully");
      } else {
        res.send(err);
      }
    })
  });

app.listen("3000", function() {
  console.log("Server is running on port 3000");
});
