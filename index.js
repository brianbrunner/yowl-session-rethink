module.exports = function(options) {

  // now that we have our configs, require things
  // that are dependent on them
  require('./lib/thinky').init(options);
  var Session = require('./lib/session');

  return function (context, event, next) {
    // create unique id for the current platform/session combo
    var id = context._platform.name + "|" + context.sessionId;
    Session.getOrCreate(id, function(err, session) {
      if (err) {
        next(err);
      } else {
        context.merge(session.context);
        next(null, function(context, event, next) {
          session.context = context.dump();
          session.save().then(function(session) {
            next();
          }).error(function(err) {
            next(err);
          });
        });
      }
    });
  };

};
