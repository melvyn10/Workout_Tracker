const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const path = require("path");

const PORT = process.env.PORT || 3000;

const db = require("./models");

const app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workout", { useNewUrlParser: true });

// Route to post form submission to mongoDB via mongoose
app.post("/api/workouts", ({body}, res) => {
    // Create a exercise
    console.log("create new exercise body: ", body);
    db.Workout.create ({})
        .then(dbWorkout => {
            console.log("dbWorkout",dbWorkout); 
            res.json(dbWorkout);
        })
        .catch(err => {
            console.log("err ", err);
            res.json(err);
        });
    });

app.put("/api/workouts/:id", ({params, body}, res) => {
    console.log("new exercise params: ",params.id);
    console.log("new exercise body: ", body);
    db.Workout.findOneAndUpdate(
        { _id: params.id},
        { $push: {exercises: body}},
        { new: true}
    )
    .then(dbWorkout => {
            console.log("Workout ",dbWorkout);
            res.json(dbWorkout);
        })
    .catch(err => {
            console.log("err ", err);
            res.json(err);
        });
    });

app.get("/api/workouts", (req, res) => {
    console.log("find workout ");
    db.Workout.find({})
    .then(dbWorkout => {
        console.log("dbWorkout ", dbWorkout);
        res.json(dbWorkout);
    })
    .catch(err => {
        console.log("err ", err);
        res.json(err);
    });
});

// Route for dashboard page
app.get("/api/workouts/range", (req, res) => {
    db.Workout.find({})
      .limit(7)
      .then((dbWorkout) => {
        console.log("plot dbWorkout ", dbWorkout);
        res.json(dbWorkout);
      })
      .catch((err) => {
        console.log("plot err ", err);
        res.json(err);
      });
  });

// routes to link to html
// send to index page
app.get ("/", (req,res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

// send to exercise page
app.get ("/exercise", (req,res) => {

    res.sendFile(path.join(__dirname, "./public/exercise.html"));
});

// send to stats page
app.get ("/stats", (req,res) => {
    res.sendFile(path.join(__dirname, "./public/stats.html"));
});

app.listen(PORT, () => {
    console.log(`App running on port ${PORT}!`);
});