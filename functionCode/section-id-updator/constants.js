const liveBroadcastPossibleStates = {
  UPCOMING: "5", CURRENT_LIVE: "1", PAST_LIVE: "6",
}

const liveVideoQuerySpec = {
  query: `SELECT * FROM c where c.sectionId IN ("1", "5", "6")`
}

module.exports = {
  liveBroadcastPossibleStates, liveVideoQuerySpec
}
