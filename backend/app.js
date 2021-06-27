const express = require("express");
const fs = require("fs");
const app = express();
const path = require("path");

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

function getPath(url) {
    var pathTakenArray = url.split("/").slice(2); // splits the url and removes the first empty string and the word "movies" or "video"
    //The following piece of code removes any string with only whitespace or null string
    var temp = [];
    for (var i = 0; i < pathTakenArray.length; i++) {
      if (pathTakenArray[i] != "" && pathTakenArray[i].trim() != "")
      temp.push(decodeURIComponent(pathTakenArray[i]));
    }
    pathTakenArray = temp;

    var pathTakenString = pathTakenArray.join(path.sep); // Joins the array of paths and decodes the string
    return pathTakenString;
}
app.get("/video/*", (req, res) => {
    var filePath = getPath(req.url);
    const range = req.headers.range; // This is to find the range of bytes the video requested
    if (!range) {
        res.status(400).send("Requires Range Header");
    } else {
        if (path.extname(filePath) !== ".mp4") {
            res.status(400).send("File format must be .mp4");
        } else {
            const videoPath = path.join("D:\\Videos\\Movies\\", filePath); // Path of the video
            const videoSize = fs.statSync(videoPath).size; // Size of the video

            const CHUNK_SIZE = 20 ** 6; // The chunck of file that is sent at a time
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

            const videoStream = fs.createReadStream(videoPath, { start, end }); // The read stream
            videoStream.pipe(res); // The response
        }
    }
});

app.get("/movies/*", (req, res, next) => {
    //This middleware gets the list of movies and directories in the required path
    var folderPath = getPath(req.url);
    if (folderPath.includes("..")) res.status(401).send("Unautorized Access");
    // If the use tries to go back to a different directory, it stops it here
    else
        fs.readdir(
            path.join("D:\\Videos\\Movies\\", folderPath), // The new path
            (err, files) => {
                if (err) res.status(400).send("Path Not Found");
                // This retruns true if the path sent is not correct
                else {
                    var watchableMovies = JSON.stringify(
                        files.filter((file) => path.extname(file) == ".mp4") // Only chooses .mp4 files (HTML5 only supportes .mp4)
                    );
                    var directories = JSON.stringify(
                        files.filter((file) => path.extname(file) == "") // Files that have no extension are directories
                    );

                    res.status(200).json({
                        movies: watchableMovies,
                        folders: directories,
                    });
                }
            }
        );
});

app.listen(8000, () => {
    console.log("Listening on port 8000");
});
