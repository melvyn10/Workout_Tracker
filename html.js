const express = require("express");
const path = require("path");

module.exports = function (app)    {
    // send to index page
    app.get ("/", (req,res) => {
        res.sendFile(path.join(__dirname, "../public/index.html"));
    });

    // send to exercise page
    app.get ("/exercise", (req,res) => {
        res.sendFile(path.join(__dirname, "../public/exercise.html"));
    });

    // send to stats page
    app.get ("/stats", (req,res) => {
        res.sendFile(path.join(__dirname, "../public/stats.html"));
    });
};    