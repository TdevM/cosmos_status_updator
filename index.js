const {CosmosClient} = require("@azure/cosmos");
const moment = require('moment-timezone');

require("dotenv").config();
const COSMOS_ENDPOINT = process.env.COSMOS_ENDPOINT;
const COSMOS_MASTER_KEY = process.env.COSMOS_MASTER_KEY;
const COSMOS_DATABASE_ID = process.env.COSMOS_DATABASE_ID;
const COSMOS_CONTAINER_ID = process.env.COSMOS_CONTAINER_ID

const client = new CosmosClient({endpoint: COSMOS_ENDPOINT, key: COSMOS_MASTER_KEY});


async function main() {
  
  const {database} = await client.databases.createIfNotExists({id: COSMOS_DATABASE_ID});
  const {container} = await database.containers.createIfNotExists({id: COSMOS_CONTAINER_ID});
  
  const currentUnix = moment().tz("Asia/Kolkata").unix();
  
  // Raw SQL queries for live videos which got older currentTime and needs to be updated to expired
  const querySpec = {
    query: `SELECT * from c where c.videoStatus = 'live' and c.liveTill < '${currentUnix}'`
  };
  
  
  // read all items in the Items container
  const {resources: items} = await container.items
    .query(querySpec)
    .fetchAll();
  
  // Update items one by one
  for (const item of items) {
    console.log(`${item.id} - ${item.videoTitle}`);
    item.videoStatus = 'expired'
    await container.items.upsert(item);
  }
  
  
}

main().then((item) => {

}).catch((error) => {
  console.error(error);
});
