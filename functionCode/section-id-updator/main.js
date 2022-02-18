const {CosmosClient} = require("@azure/cosmos");
const Promise = require('bluebird')
const moment = require('moment-timezone');
const {liveVideoQuerySpec} = require("./constants")
const {computeVideoStatus} = require("./youtubeAPI")

require("dotenv").config();
const COSMOS_ENDPOINT = process.env.COSMOS_ENDPOINT;
const COSMOS_MASTER_KEY = process.env.COSMOS_MASTER_KEY;
const COSMOS_DATABASE_ID = process.env.COSMOS_DATABASE_ID;
const COSMOS_CONTAINER_ID = process.env.COSMOS_CONTAINER_ID

const client = new CosmosClient({endpoint: COSMOS_ENDPOINT, key: COSMOS_MASTER_KEY});


async function main() {
  
  const {database} = await client.databases.createIfNotExists({id: COSMOS_DATABASE_ID});
  const {container} = await database.containers.createIfNotExists({id: COSMOS_CONTAINER_ID});
  
  const {resources: items} = await container.items
    .query(liveVideoQuerySpec)
    .fetchAll();
  
  
  // Update items one by one
  // Change section IDs
  
  Promise.map(items, async (item) => {
    const updatedSectionId = await computeVideoStatus(item.videoId)
    if (updatedSectionId) {
      await container.items.upsert(item);
    }
  }, {
    concurrency: 10
  }).catch((e) => {
    console.log(e)
  })
  
  
}

module.exports = {main}
