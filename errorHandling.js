const psqlErrors = (err, req, res, next) => {
  psqlCodes = {
    '22P02': { status: 400, message: err.message },
    '23502': { status: 400, message: err.message },
    '23503': { status: 404, message: err.message },
    '42703': { status: 400, message: err.message }
  };
  if (psqlCodes[err.code]) {
    const { status, message } = psqlCodes[err.code];
    res.status(status).send({ message });
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

const send500Error = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ message: 'Internal server error' });
};

module.exports = {
  send405Error,
  customExpressErrors,
  psqlErrors,
  send500Error
};
