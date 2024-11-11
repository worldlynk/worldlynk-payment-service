// src/middlewares/validateRequest.js
module.exports = (req, res, next) => {
    if (!req.body.amount || typeof req.body.amount !== 'number') {
      return res.status(400).json({ error: true, message: 'Invalid amount' });
    }
    next();
  };
  