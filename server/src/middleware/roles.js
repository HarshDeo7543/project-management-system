function permit(...allowed) {
  return (req, res, next) => {
    const { role } = req.user || {};
    if (!role) return res.status(401).json({ message: 'Missing role' });
    if (allowed.includes(role)) return next();
    return res.status(403).json({ message: 'Forbidden: insufficient rights' });
  };
}

module.exports = { permit };
