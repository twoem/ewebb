exports.ensureAuthenticated = (req, res, next) => {
  if (req.session && req.session.authenticated) return next();
  res.redirect('/admin/login');
};
