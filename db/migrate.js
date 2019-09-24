const { Client } = require('pg')

const migrate = async () => {
  const client = new Client()
  await client.connect()

  console.log("dropping existing tables...")
  await client.query('DROP TABLE IF EXISTS gcal_settings;')

  console.log("running migrations...")
  await client.query('CREATE TABLE gcal_settings (' + 
    'user_id INTEGER UNIQUE NOT NULL,' + 
    'secret VARCHAR(50),' + 
    'calendar_id VARCHAR(255) NOT NULL,' +
    'api_key VARCHAR(255) NOT NULL,' +
    'max_results INTEGER NOT NULL,' +
    'message VARCHAR(225) NOT NULL,' +
    'date_format VARCHAR(50) NOT NULL' +
    ');')

  await client.end()
}
migrate();