const express = require('express');
const request = require('request');
var cors = require('cors')

const app = new express();
app.use(express.json());

var corsOptions = {
  origin: '*',//'http://localhost:3000',
  optionsSuccessStatus: 200
}

const SUPERVISOR_ENDPOINT = 'https://o3m5qixdng.execute-api.us-east-1.amazonaws.com/api/managers';
var supervisors = [];

// Validation constants
const REQUIRED_FIELDS = ['firstName', 'lastName', 'supervisor'];
const digitRegex = /\d/;
const phoneNumberRegex = /^(\(\d{3}\)|\d{3})-?\d{3}-?\d{4}$/; // Resourced from https://stackoverflow.com/a/3256622/2033526
const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;        // Resourced from https://regexr.com/3e48o

const commonValidation = (value) => {
  return value
    && typeof value === 'string'
    && value.length;
};

const validate = (form) => {
  // if firstName, lastName or supervisor fields are missing, return an error
  // Name fields are required and must only contain letters, no numbers.
  // Standard validation against phone number and/or email must be applied.
  // Any invalid requests must send back an error response.

  // firstName   (required)
  // lastName    (required)
  // email       (optional)
  // phoneNumber (optional)
  // supervisor  (required)
  const errors = [];
  const keys = Object.keys(form);

  // Check presence of required fields
  REQUIRED_FIELDS.forEach((rf) => {
    if (!keys.includes(rf)) {
      errors.push(`${rf} is missing`);
    }
  });

  keys.forEach((key) => {
    const value = form[key];

    // Validate required fields
    if (REQUIRED_FIELDS.includes(key)) {
      var isValid = commonValidation(value) && !value.match(digitRegex);

      if (!isValid) {
        errors.push(`${key} is invalid`);
      }
    }

    // Validate email
    if (key === 'email') {
      var isValid = commonValidation(value) && value.match(emailRegex);
      if (!isValid) {
        errors.push(`email is invalid`);
      }
    }

    // Validate phoneNumber
    if (key === 'phoneNumber') {
      var isValid = commonValidation(value) && value.match(phoneNumberRegex);
      if (!isValid) {
        errors.push(`phoneNumber is invalid`);
      }
    }
  });

  return errors;
};

// GET /api/supervisors
app.get('/api/supervisors', cors(corsOptions), async (req, res) => {
  // Use cached supervisor list if present
  if (supervisors.length > 0) {
      // TODO: Handle cache invalidation
      res.json(supervisors);
  } else {
    // Load supervisors from external endpoint
    request(SUPERVISOR_ENDPOINT, async (error, response, body) => {
      if (!error && response.statusCode == 200) {
        supervisors = JSON.parse(body);
      }
      // TODO: This does not handle errors from AWS endpoint
      res.json(supervisors);
    })
  }
});

// POST /api/submit
app.post('/api/submit', cors(corsOptions), async (req, res) => {
  var form = req.body;
  const errors = validate(form);
  console.error("here");
  if (errors.length > 0) {
    // res.status(400);
  } else {
    // If successful, log body to express console
    console.log(req.body);
    // res.status(204);
  }

  res.json({errors: errors});
});


const port = 8080;
app.listen(port, () => {
  console.log(`Listening on ${port} Ctrl+c to stop this server.`)
});