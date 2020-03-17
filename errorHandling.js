const psqlErrors = (err, req, res, next) => {
  psqlCodes = {
    '': { status: 404, message: err.message }
  };
  if (psqlCodes[err.code]) {
    const { status, message } = psqlCodes[err.code];
  } else {
    next(err);
  }
};

const customExpressErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ message: err.message });
  } else {
    next(err);
  }
};

const send405Error = (req, res, next) => {
  res.status(405).send({ message: 'method not allowed' });
};

module.exports = { send405Error, customExpressErrors, psqlErrors };
