require('dotenv').config();

const neo4j = require('neo4j-driver');

const driver = neo4j.driver(
  process.env.COGNODB_URI,
  neo4j.auth.basic(
    process.env.COGNODB_USER,
    process.env.COGNODB_PASSWORD
  )
);

driver.verifyConnectivity()
  .then(() => {
    console.log('CognoDB connected');
  })
  .catch((err) => {
    console.error(
      'CognoDB connection failed at startup:',
      err.message
    );
  });

module.exports = driver;