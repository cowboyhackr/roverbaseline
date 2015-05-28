var bleno = require('bleno'),
  BatteryService = require('./roverbluetoothservice');
  
var primaryService = new RoverBlueToothService();

bleno.on('stateChange', function(state) {
    console.log('on -> stateChange: ' + state);

    if (state === 'poweredOn') {
        bleno.startAdvertising('RoverListening', [primaryService.uuid]);
        console.log("call to startAdvertising...")
    } else {
        bleno.stopAdvertising();
        console.log("call to stopAdvertising...")
    }
});

bleno.on('advertisingStart', function(error) {
    console.log('on -> advertisingStart: ' + (error ? 'error ' + error : 'success'));

    if (!error) {
        bleno.setServices([primaryService]);
    }
});