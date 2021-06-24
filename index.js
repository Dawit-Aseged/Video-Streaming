const express = require("express");
const fs = require("fs");
const app = express();
const path = require("path");

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/video", (req, res) => {
    const range = req.headers.range;
    if (!range) {
        res.status(400).send("Requires Range Header");
        res.end();
    } else {
        const videoPath = "The Avengers (2012).mp4";
        const videoSize = fs.statSync(videoPath).size;

        const CHUNK_SIZE = 20 ** 6;
        const start = Number(range.replace(/\D/g, ""));
        const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

        const contentLength = end - start + 1;
        const headers = {
            "Content-Range": `bytes ${start}-${end}/${videoSize}`,
            "Accept-Ranges": "bytes",
            "Content-Length": contentLength,
            "Content-Type": "video/mp4",
        };

        res.writeHead(206, headers);

        const videoStream = fs.createReadStream(videoPath, { start, end });
        videoStream.pipe(res);
    }
});

app.get("/movies", (req, res, next) => {
    fs.readdir("D:\\Videos\\Movies\\", (err, files) => {
        if (err) {
            res.status(400).send(err);
        }
        var watchableMovies = JSON.stringify(
            files.filter((file) => path.extname(file) == ".mp4")
        );
        var directories = JSON.stringify(
            files.filter((file) => path.extname(file) == "")
        );

        res.status(200).json({
            movies: watchableMovies,
            folders: directories,
        });
    });
});

app.get("/movies/*", (req, res, next) => {
    var folders = req.url.split("/").slice(2);
    folders = folders.map((folder) => {
        return decodeURIComponent(folder);
    });

    var temp = [];
    for (var i = 0; i < folders.length; i++) {
        if (folders[i] != "" && folders[i].trim() != "") temp.push(folders[i]);
    }
    folders = temp;
    console.log(folders);
    var folderPath = folders.join("\\");

    if (folderPath.includes("..")) res.status(401).send("Unautorized Access");
    fs.readdir(path.join("D:\\Videos\\Movies\\", folderPath), (err, files) => {
        if (err) res.status(400).send("Path Not Found");
        else {
            var watchableMovies = JSON.stringify(
                files.filter((file) => path.extname(file) == ".mp4")
            );
            var directories = JSON.stringify(
                files.filter((file) => path.extname(file) == "")
            );

            res.status(200).json({
                movies: watchableMovies,
                folders: directories,
            });
        }
    });
});

app.listen(8000, () => {
    console.log("Listening on port 8000");
});
