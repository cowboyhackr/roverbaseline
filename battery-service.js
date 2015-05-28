var util = require('util'),
  bleno = require('bleno'),
  BlenoPrimaryService = bleno.PrimaryService,
  ShinyCommand = require('./shiny-command');

function BatteryService() {
  BatteryService.super_.call(this, {
      uuid: '180F',
      characteristics: [
          new ShinyCommand()
      ]
  });
}

util.inherits(BatteryService, BlenoPrimaryService);

module.exports = BatteryService;
