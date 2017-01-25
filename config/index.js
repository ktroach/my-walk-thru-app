const API_BASE_URL = 'https://teamwerxxapi.herokuapp.com/api/v1/';
const IMAGE_UPLOADER_BASE = 'https://pros-s3-image-uploader.herokuapp.com:443/api/CloudStoreImages';

export default {
   API_BASE_URL,
   TEAM_LEAGUE_API_URL: API_BASE_URL+'/leagues/5803d3e0b2bfe4001146b7f9',
   PLAYERS_API_URL: API_BASE_URL+'/players',
   TEAMS_API_URL: API_BASE_URL+'/teams',
   TEAM_API_URL: API_BASE_URL+'/teams?filter={"where": {"id": "57f699e8ac326c0011b37db1"}}',
   DEFAULT_PLAYER_AVATAR: 'https://randomuser.me/api/portraits/med/lego/5.jpg',
   DEFAULT_DIVISION_AVATAR:'http://cdn3.sportngin.com/attachments/text_block/6297/6324/CFPO_30_year_medium.jpg',
   DEFAULT_TEAM_AVATAR:'http://cdn3.sportngin.com/attachments/text_block/6297/6324/CFPO_30_year_medium.jpg',
   SCHEDULES_API_URL: API_BASE_URL+'/schedules',
   TEAM_SCHEDULE_API_URL: API_BASE_URL+'/schedules/57df293a4528b70011d1cc83',
   ALL_EVENTS_API_URL: API_BASE_URL+'events?filter=%7B%22where%22%3A%7B%22scheduleId%22%3A%20%2257df293a4528b70011d1cc83%22%7D%7D',
   PRACTICE_SCHEDULE_API_URL: API_BASE_URL+'events?filter=%7B%22where%22%3A%7B%22scheduleId%22%3A%20%2257df293a4528b70011d1cc83%22%2C%20%22eventtype%22%3A%22practice%22%7D%7D',
   GAME_SCHEDULE_API_URL: API_BASE_URL+'events?filter=%7B%22where%22%3A%7B%22scheduleId%22%3A%20%2257df293a4528b70011d1cc83%22%2C%20%22eventtype%22%3A%22game%22%7D%7D',
   ALL_DIVISIONS_API_URL: API_BASE_URL+'/divisions',
   MIGHTYMITES_TEAMS_API: API_BASE_URL+'/teams?filter=%7B%22where%22%20%3A%20%7B%22divisionId%22%3A%225803d3acb2bfe4001146b7f8%22%7D%7D',
   NORTH_DISTRICT_TEAMS_API: API_BASE_URL+'/districts/580640689d6d1300117af03d/teams',
   EAST_DISTRICT_TEAMS_API: API_BASE_URL+'/districts/580640689d6d1300117af03d/teams',
   SOUTH_DISTRICT_TEAMS_API: API_BASE_URL+'/districts/580640689d6d1300117af03d/teams',
   WEST_DISTRICT_TEAMS_API: API_BASE_URL+'/districts/580640689d6d1300117af03d/teams',
   PRICING_API_URL: API_BASE_URL+'divisions?filter=%7B%20%22where%22%20%3A%20%7B%20%22divisiontype%22%3A%20%22pricing%22%20%7D%20%7D',
   PRICING_ITEMS_API_URL_NO: API_BASE_URL+'teams?filter=%7B%20%22where%22%20%3A%20%7B%20%22rank%22%3A%20999%20%7D%20%7D',
   PRICING_ITEMS_API_URL: API_BASE_URL+'/teams?filter={"where": {"rank": "999"}}',
   PRICING_ITEMS_API: API_BASE_URL+'/teams',
   IMAGE_UPLOADER_PHOTOS_API: IMAGE_UPLOADER_BASE+'/upload/'

};
