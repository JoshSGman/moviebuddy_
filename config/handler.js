var db = require('./db_config');
var url = require('url');

exports.getUser = function(req, res) {
  return db.User.findOne({facebook_id: req.params.facebookid}, function (err, user) {
    if (!err) {
      return res.send(user);
    } else {
      return console.log(err);
    }
  });
};

exports.postUser = function(req, res) {
  var body = req.body;
  var user = new db.User({
    facebook_id:     body.fb_id,
    facebook_token:  body.fb_token,
    name:            body.name,
    email:           body.email,
    city:            body.city
    // hometown:        ,
    // favMovie:        ,
    // favGenre:        ,
    // age:             { type: Number },
    // favTheater:      ,
    // currentCity:     ,
    // favActor:        ,
    // favDirector:     
  });
  user.save(function (err) {
    if (!err) {
      return console.log("created");
    } else {
      return console.log(err);
    }
  });
  return res.send(user);
};

exports.putUser = function(req, res) {
  var body = req.body;
  return db.User.findOne({facebook_id: req.params.id}, function (err, user) {
    user.facebook_token = body.facebook_token;
    user.name           = body.name;
    user.email          = body.email;
    user.city           = body.city;
    return user.save(function (err) {
      if (!err) {
        console.log("updated");
      } else {
        console.log(err);
      }
      return res.send(user);
    });
  });
};

exports.deleteUser = function(req, res) {
  return db.User.findOne({facebook_id: req.params.id}, function (err, user) {
    return user.remove(function (err) {
      if (!err) {
        console.log("removed");
        return res.send();
      } else {
        console.log(err);
      }
    });
  });
};

exports.getOuting = function(req, res){
  console.log('req.params:', req.params);
  return db.Outing.find({
    // *** TO-DO: Enable find of correct outings.
  }, function(err, outing){
  // return db.Outing.findById(req.params.id, function(err, outing){
    if(!err) {
      return res.send(outing);
    } else {
      return console.log(err);
    }
  });
};

exports.postOuting = function(req, res){
  var body = req.body;
  var outing = new db.Outing({
    movie:     body.movie,
    date:      body.date,
    theater:   body.theater,
    address:   body.address,
    city:      body.city,
    state:     body.state,
    zip:       body.zip,
    invitees:  body.invitees,
    attendees: body.attendees,
    creator:   body.creator
  });
  outing.save(function (err) {
    if (!err) {
      return console.log("created");
    } else {
      return console.log(err);
    }
  });
  return res.send(outing);
};

exports.putOuting = function(req, res){
  var body = req.body;
  return db.Outing.findById(req.params.id, function(err, outing){
    outing.movie     = body.movie;
    outing.date      = body.date;
    outing.theater   = body.theater;
    outing.address   = body.address;
    outing.city      = body.city;
    outing.state     = body.state;
    outing.zip       = body.zip;
    outing.invitees  = body.invitees;
    outing.attendees = body.attendees;
    outing.creator   = body.creator;

    return outing.save(function(err){
      if(!err){
        console.log("updated");
      }else{
        console.log(err);
      }
      return res.send(user);
    });

  });
};

exports.deleteOuting = function(req, res){
  return db.Outing.findById( req.params.id, function(err, outing){
    return user.remove(function(err){
      if(!err){
        console.log("removed!");
        return res.send();
      } else {
        console.log(err);
      }
    });
  });
};
