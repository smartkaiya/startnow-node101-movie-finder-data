//var data = require('./data.json');
var express = require('express');
var morgan = require('morgan');
var axios = require('axios');
var app = express();


// When making calls to the OMDB API make sure to append the '&apikey=8730e0e' parameter
var cache = [];
app.get('/', (req, res) => {
    var movieId = req.query.i;
    var movieTitle = req.query.t;
    var cachedMovie;
    if (movieId) {
        cachedMovie = cache.find(function(item){return item.i == movieId;});
        if (cachedMovie) {
            return res.json(cachedMovie.data);
        } 
        
        else {
            axios.get('http://www.omdbapi.com/?i=' + movieId + '&apikey=8730e0e')
                .then((response) => {
                    var objCache = {i: req.query.i, t: null, data: response.data};
                    cache.push(objCache);
                    res.json(response.data);
                })
                .catch(function (error) {
                    console.log(error);
                });    
        }
    } 
    else if (movieTitle) {
        cachedMovie = cache.find(function(item){return item.t == movieTitle;});
        if (cachedMovie) {
            return res.json(cachedMovie.data);
        } 
        movieTitle = movieTitle.replace(' ', '%20');
        axios.get('http://www.omdbapi.com/?t=' + movieTitle + '&apikey=8730e0e')
            .then((response) => {
                var objCache = {t: req.query.t, i: null, data: response.data};
                cache.push(objCache);
                res.json(response.data)
            })
            .catch(function (error) {
                console.log(error);
            });
        } 
        //else {
           // res.send('ok');
        //}

});

module.exports = app;

