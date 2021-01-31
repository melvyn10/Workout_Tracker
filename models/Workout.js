// workout models
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const WorkoutSchema = new Schema({
    day: {
        type: Date,
        default: Date.now
    },

    exercises: [{
        type: {
            type: String,
            trim: true,
            required: "Exercise Type is required"
        },
        name: {
          type: String,
          trim: true,
          required: "Exercise Name is required"
        },
        duration: Number,
        weight: Number,
        sets: Number,
        reps: Number, 
        distance: Number
      }
    ],

    totalDuration: {
        type: Number,
        default: 0
    }
}
//    { toJASON: { virtuals: true,},}
);

/*
WorkoutSchema.virtual("totalDuration"). 
    get(function() {
        const duration = this.exercises.reduce((total, current) =>
            { return total + current.duration;},0);
        console.log ("total duration ", duration);
        return duration;
    });
*/
WorkoutSchema.methods.calDuration = function () {
    this.totalDuration = this.exercises.reduce( function(a, b) {
        return a + b.duration;}, 0);
     return this.totalDuration;
};

const Workout = mongoose.model("Workout", WorkoutSchema);

module.exports = Workout;
