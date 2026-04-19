const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const movies = require('./movie-model.js');

const app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'files')));

// GET all movies (with optional genre filter)
app.get('/movies', function (req, res) {
  const genre = req.query.genre;
  if (genre) {
    const filtered = Object.values(movies).filter(function(movie) {
      return movie.Genres.includes(genre);
    });
    res.json(filtered);
  } else {
    res.json(Object.values(movies));
  }
});

// GET one movie by imdbID
app.get('/movies/:imdbID', function (req, res) {
  const movie = movies[req.params.imdbID];
  if (movie) {
    res.send(movie);
  } else {
    res.sendStatus(404);
  }
});

// PUT update or create a movie
app.put('/movies/:imdbID', function (req, res) {
  const id = req.params.imdbID;
  if (movies[id]) {
    movies[id] = req.body;
    res.sendStatus(200);
  } else {
    movies[id] = req.body;
    res.status(201).send(movies[id]);
  }
});

// GET all genres sorted alphabetically
app.get('/genres', function (req, res) {
  const allGenres = [];

  Object.values(movies).forEach(function(movie) {
    movie.Genres.forEach(function(genre) {
      if (!allGenres.includes(genre)) {
        allGenres.push(genre);
      }
    });
  });

  allGenres.sort();
  res.json(allGenres);
});

app.listen(3000);
console.log("Server now listening on http://localhost:3000/");