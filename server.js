const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
var PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Routes
// =============================================================
// html routes
app.get("/",function(req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"))
});
app.get("/notes", function(req, res){
    res.sendFile(path.join(__dirname, "./public/notes.html"))
});
const noteData = path.join(__dirname, "./db/db.json")
//api routes
app.get("/api/notes", function(req, res){
    res.sendFile(noteData);
});
app.post("/api/notes", function(req, res){
    const newNote = req.body;
    const newId = Date.now();
    newNote.id = newId;
    fs.readFile(noteData,function(err,data){
        if(err) throw err;
        const notes = JSON.parse(data);
        notes.push(newNote);
        const notesWrite = JSON.stringify(notes);
        fs.writeFile(noteData, notesWrite, function(err){
            if (err) throw err;
            res.sendFile(noteData);
        })
    })
    
});
app.delete("/api/notes/:id", function(req, res){
    const cancelID = parseInt(req.params.id);
    
    fs.readFile(noteData,function(err,data){
        if (err) throw err;
        const notes = JSON.parse(data);
        const noteDel = notes.filter(note => note.id !== cancelID);
        console.log(noteDel);
        const notesWrite = JSON.stringify(noteDel);
        fs.writeFile(noteData, notesWrite,function(err){
            if (err) throw err;
            res.sendFile(noteData);

        })
    })
    
    
})


// Starts the server to begin listening
// =============================================================
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
  });