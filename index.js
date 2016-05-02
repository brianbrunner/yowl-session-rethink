module.exports = function(options) {

  // now that we have our configs, require things
  // that are dependent on them
  require('./lib/thinky').init(options);
  var Session = require('./lib/session');

  // Expose the underlying session model
  this.session_model = module.exports.session_model = Session;

  return function (context, event, next) {
    // create unique id for the current platform/session combo
    var id = context.platform.name + "|" + context.sessionId;
    Session.getOrCreate(id, function(err, session) {
      if (err) {
        next(err);
      } else {
        context.mergeSession(session.data);
        next(null, function(context, event, next) {
          session.data = context.dumpSession();
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
