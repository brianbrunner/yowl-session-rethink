var thinky = require('./thinky'),
    r = thinky.r,
    type = thinky.type;

var Session = thinky.createModel("Session", {
  id: type.string(),
  created_at: type.date().default(function() {
    return new Date();
  }),
  updated_at: type.date().default(function() {
    return new Date();
  }),
  context: type.object().default({})
});

Session.getOrCreate = function(id, cb) {
  Session.get(id).then(function(session) {
    cb(null, session);
  }).error(function(err) {
    if (err    ) {
      var session = new Session({
        id: id,
        context: {}
      });
      session.save().then(function(session) {
        cb(null, session);
      }).error(function(err) {
        cb(err);
      });
    } else {
      cb(err);
    }
  });
};

module.exports = Session;
