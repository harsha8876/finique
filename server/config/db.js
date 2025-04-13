const oracledb = require('oracledb');

const dbConfig = {
  user: 'banking_app',
  password: 'harsha',
  connectString: 'Harsha:1521/XE' // No need to mention XEPDB1 if working with CDB$ROOT
};


async function getConnection() {
  return await oracledb.getConnection(dbConfig);
}

module.exports = getConnection;
