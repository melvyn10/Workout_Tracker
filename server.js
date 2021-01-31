const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const path = require("path");

const PORT = process.env.PORT || 3000;

const Workout = require("./models/Workout.js");

const app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

// mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workout", { useNewUrlParser: true });
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/workout',
{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false

}
);
    

// Route to post form submission to mongoDB via mongoose
app.post("/api/workouts", ({body}, res) => {
    // Create a exercise
    const workout = new Workout(body);
    console.log("new workout",workout);
    workout.calDuration();
    Workout.create ({workout})
        .then(dbWorkout => {
            console.log("create dbWorkout",dbWorkout);
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
    Workout.findOneAndUpdate(
        { _id: params.id},
        { $push: {exercises: body}},
        { new: true}
    )
    .then(dbWorkout => {
        console.log("add exercise to Workout ",dbWorkout);
        dbWorkout.calDuration();
        console.log("tot duration after ", dbWorkout.totalDuration);
        res.json(dbWorkout);
    })
    .catch(err => {
        console.log("err ", err);
        res.json(err);
    });
    });

app.get("/api/workouts", (req, res) => {
    console.log("find workout ");
    Workout.find({})
    .then(dbWorkout => {
        console.log("found dbWorkout ", dbWorkout);
        console.log("found total duration ", dbWorkout.totalDuration);
        res.json(dbWorkout);
    })
    .catch(err => {
        console.log("err ", err);
        res.json(err);
    });
});

// Route for dashboard page
app.get("/api/workouts/range", (req, res) => {
    Workout.find({})
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