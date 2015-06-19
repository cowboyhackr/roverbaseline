var util = require('util'),
  os = require('os'),
  PythonShell = require('python-shell'),
  exec = require('child_process').exec,
  bleno = require('bleno'),
  gpio = require("rpi-gpio"),
  async = require("async"),
  Descriptor = bleno.Descriptor,
  Characteristic = bleno.Characteristic,
  RoverSettings = require('./rover');

  gpio.destroy(function() {
      console.log('Closed pins');
      setUpPins(null);
      return;
  });

var BatteryLevelCharacteristic = function() {
  BatteryLevelCharacteristic.super_.call(this, {
      uuid: '2A19',
      properties: ['read', 'write', 'notify'],
      descriptors: [
        new Descriptor({
            uuid: '2901',
            value: 'Battery level between 0 and 100 percent'
        }),
        new Descriptor({
            uuid: '2904',
            value: new Buffer([0x04, 0x01, 0x27, 0xAD, 0x01, 0x00, 0x00 ]) // maybe 12 0xC unsigned 8 bit
        })
      ]
  });



};

util.inherits(BatteryLevelCharacteristic, Characteristic);

BatteryLevelCharacteristic.prototype.onReadRequest = function(offset, callback) {
  
  console.log("in read");
  if (os.platform() === 'darwin') {
    exec('pmset -g batt', function (error, stdout, stderr) {

      var data = stdout.toString();
      // data - 'Now drawing from \'Battery Power\'\n -InternalBattery-0\t95%; discharging; 4:11 remaining\n'
      var percent = data.split('\t')[1].split(';')[0];
      console.log(percent);
      percent = parseInt(percent, 10);
      callback(this.RESULT_SUCCESS, new Buffer([percent]));

    });
  } else {
    // return hardcoded value
    console.log("reading...")
    callback(this.RESULT_SUCCESS, new Buffer([98]));

  }
};

BatteryLevelCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  //console.log("in write");
  if (offset) {
    //console.log("in write - offset");
    callback(this.RESULT_ATTR_NOT_LONG);
  }

  else {

        var command = data.toString('ascii');
    //console.log('command');
    console.log(command);

    if(command === "0"){
      console.log("stop");

            setUpPins(function(){
                gpio.write(16, false, function(err) {
                    if (err) console.log(err);
                       gpio.write(18, false, function(err) {
                          if (err) console.log(err);
                            gpio.write(13, false, function(err) {
                              if (err) console.log(err);
                              gpio.write(15, false, function(err) {
                                if (err) console.log(err);
                                console.log("back pins set");
                              });
                          });
                      });
                  });
              });

    }
    else if(command === "2"){
      console.log("command right");

            setUpPins(function(){
                gpio.write(16, false, function(err) {
                    if (err) console.log(err);
                       gpio.write(18, true, function(err) {
                          if (err) console.log(err);
                            gpio.write(13, true, function(err) {
                              if (err) console.log(err);
                              gpio.write(15, false, function(err) {
                                if (err) console.log(err);
                                console.log("left pins set");
                              });
                          });
                      });
                  });
              });


    }else if(command === "1"){
      console.log("command left");
      

            setUpPins(function(){
                gpio.write(16, true, function(err) {
                    if (err) console.log(err);
                       gpio.write(18, false, function(err) {
                          if (err) console.log(err);
                            gpio.write(13, false, function(err) {
                              if (err) console.log(err);
                              gpio.write(15, true, function(err) {
                                if (err) console.log(err);
                                console.log("right pins set");
                              });
                          });
                      });
                  });
              });


    }
    else if(command === "3"){
      console.log("forward");

               setUpPins(function(){
                gpio.write(16, true, function(err) {
                    if (err) console.log(err);
                       gpio.write(18, false, function(err) {
                          if (err) console.log(err);
                            gpio.write(13, true, function(err) {
                              if (err) console.log(err);
                              gpio.write(15, false, function(err) {
                                if (err) console.log(err);
                                console.log("forward pins set");
                              });
                          });
                      });
                  });
              });
    }
    else if(command === "4"){
      console.log("back");

            setUpPins(function(){
                gpio.write(16, false, function(err) {
                    if (err) console.log(err);
                       gpio.write(18, true, function(err) {
                          if (err) console.log(err);
                            gpio.write(13, false, function(err) {
                              if (err) console.log(err);
                              gpio.write(15, true, function(err) {
                                if (err) console.log(err);
                                console.log("back pins set");
                              });
                          });
                      });
                  });
              });

    }
  }
  callback(this.RESULT_SUCCESS);
};

function delayedWrite(pin, value, callback) {
    setTimeout(function() {
        gpio.write(pin, value, callback);
    }, 500);
}

function setUpPins(cb){

      gpio.setup(16, gpio.DIR_OUT, function(err){
          if (err) console.log(err);
          gpio.setup(18, gpio.DIR_OUT, function(err){
             if (err) console.log(err);
             gpio.setup(15, gpio.DIR_OUT, function(err){
                  if (err) console.log(err);
                  gpio.setup(13, gpio.DIR_OUT, function(err){
                      if (err) console.log(err);

                      console.log("pins setup");
                      if(cb) cb();
                        return;
                });
             });
          });
      });

      // async.parallel([
      //   function(callback) {
      //       gpio.setup(16, gpio.DIR_OUT, callback)
      //   },
      //   function(callback) {
      //       gpio.setup(18, gpio.DIR_OUT, callback)
      //   },
      //   function(callback) {
      //       gpio.setup(22, gpio.DIR_OUT, callback)
      //   },
      //   function(callback) {
      //       gpio.setup(13, gpio.DIR_OUT, callback)
      //   },
      //   ], function(err, results) {
      //       console.log('Pins set up');
      //       if(cb){
      //         cb();
      //       }
      //   });
      //   return;
      //});
}


BatteryLevelCharacteristic.prototype.onNotify = function() {
  console.log('NotifyOnlyCharacteristic on notify');
};

module.exports = BatteryLevelCharacteristic;
