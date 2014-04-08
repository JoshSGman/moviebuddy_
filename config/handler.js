var db = require('./db_config');
var FB = require('fb');

// get a user from the db
exports.getUser = function(req, res) {
  
  db.User.findOne({facebookId: req.params.facebookId}, function (err, user) {
    console.log('user found: line 8 ', user);
    if (!err) {
      res.send(user);
    } else {
      res.send(err);
    }
  });
};

// enter a user into the db
exports.postUser = function(req, res) {
  var body = req.body;
  var user = new db.User({
    facebookId:      body.facebookId,
    facebook_token:  body.facebookToken,
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

  res.send(user);
};

// update user collection
exports.putUser = function(req, res) {
  var body = req.body;
  db.User.findOne({facebookId: req.params.facebookId}, function (err, user) {
    user.facebookToken = body.facebookToken;
    user.name           = body.name;
    user.email          = body.email;
    user.city           = body.city;

    user.save(function (err) {
      if (!err) {
        console.log("updated");
      } else {
        console.log(err);
      }

      res.send(user);
    });
  });
};

// delete users from the db
exports.deleteUser = function(req, res) {
  db.User.findOne({facebookId: req.params.facebookId}, function (err, user) {
    user.remove(function (err) {
      if (!err) {
        console.log("removed");
        res.send();
      } else {
        res.send(err);
      }
    });
  });
};

//get user friends from the db
exports.getFriends = function(req, res) {
  db.User.findOne({facebookId: req.params[0]}, function(err, user) {
    if (!err && user) {
      var usersFriends = [];
      for (var i = 0; i < user.friends.length; i++) {
        db.User.find({facebookId: user.friends[i]}, function(err, friend) {
          usersFriends.push(friend[0]);
          if (i === user.friends.length) {
            res.send(usersFriends);
          }
        });
      }
    } else {
      console.log('sending error: ', err);
      res.send(err);
    }
  });
};

// Update user friends 
exports.updateFriends = function(res, id) {

  db.User.findOne({facebookId : id}, function(err, user){
    if(!err) {
      // <-- loop through the results array --> // 
      for (var i = 0; i < res.length; i++){
        // <-- check if the user exists in the database --> // 
        db.User.findOne({ facebookId: res[i].uid }, function(err, friend){
          // <-- loop through the results array --> // 
          if (!err && friend !== null) {
            var friendId = friend.facebookId;
            var userFriends = user.friends;
            // <-- if user doesn't already exist as a friend insert --> // 
            if (userFriends.indexOf(friendId) === -1) {
              userFriends.push(friendId);
              user.save();
            }
          }
        });
      }
    }
  });
};

exports.queryFBFriends = function(token, profile){

  FB.setAccessToken(token);

  FB.api('fql', {
    q : 'SELECT name, uid FROM user WHERE uid IN (SELECT uid2 FROM friend WHERE uid1 = '+profile.id+')'
  }, function(res){
    exports.updateFriends(res.data, profile.id);
  });
};


// get outings from the database
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

// enter outings into database function
exports.postOuting = function(req, res) {
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
      console.log("created");
    } else {
      console.log(err);
    }
  });

  res.send(outing);
};


// update outings into database function
exports.putOuting = function(req, res) {
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

    outing.save(function(err){
      if (!err){
        console.log("updated");
      } else {
        console.log(err);
      }
      res.send(user);
    });
  });
};


// Delete outings handler function
exports.deleteOuting = function(req, res) {
  db.Outing.findById(req.params.id, function(err, outing){
    user.remove(function(err){
      if(!err){
        console.log("removed!");
        res.send();
      } else {
        res.send(err);
      }
    });
  });
};



