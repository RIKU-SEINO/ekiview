'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('qrcodes', [
      {
        place_id: 'ChIJn8hH6fuLGGARvhUirnza1u0',//東京駅, NewDaysミニ 東ホ3AのPlaceID
        panorama_id: 'UiCQ_t9VKpXnIIeB4gTGmQ',//東京駅, NewDaysミニ 東ホ3AのパノラマID
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        place_id: 'ChIJ5yuSzsaLGGARA5M1HqiKxqU',//東京駅, 駅たびコンシェルジュ(丸の内北口)のPlaceID
        panorama_id: 'T3AAkDdJM1eIb9lLsY7bEA',//東京駅, 駅たびコンシェルジュ(丸の内北口)のパノラマID
        created_at: new Date(),
        updated_at: new Date(),
      },
    ], {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('qrcodes', null, {});
  }
};
