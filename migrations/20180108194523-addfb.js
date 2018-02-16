'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    //Add columns facebookID & facebookToken
    return queryInterface.addColumn('users', 'facebookID', Sequelize.STRING).then(function(){
      return queryInterface.addColumn('users', 'facebookToken', Sequelize.STRING);
    });
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    //Remove columns facebookID & facebookToken
    return queryInterface.removeColumn('users', 'facebookID').then(function(){
      return queryInterface.removeColumn('users', 'facebookToken');
    });
  }
};
