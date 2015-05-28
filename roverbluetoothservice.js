var util = require('util'),
  bleno = require('bleno'),
  BlenoPrimaryService = bleno.PrimaryService,
  RoverCommand = require('./rover-command');

function RoverBlueToothService() {
  RoverBlueToothService.super_.call(this, {
      uuid: '180F',
      characteristics: [
          new RoverCommand()
      ]
  });
}

util.inherits(RoverBlueToothService, BlenoPrimaryService);

module.exports = RoverBlueToothService;
