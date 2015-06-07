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

  setUpPinsAtStart();
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
  //else if (data.length !== 1) {
   // console.log("data length !== 1");
    //console.log(JSON.stringify(data));
    //callback(this.RESULT_INVALID_ATTRIBUTE_LENGTH);
  //}
  else {
    // console.log(JSON.stringify(data));
    // console.log('processing write request');
    // var receivedData = data.readUInt8(0);
    // console.log(typeof data);
    // console.log(data.toString('ascii'));
    
    // console.log(receivedData);
    // console.log(typeof receivedData);
        var command = data.toString('ascii');
    //console.log('command');
    console.log(command);

    if(command === "0"){
      console.log("stop");


        async.series([
            function(callback) {
                delayedWrite(16, false, callback);
            },
            function(callback) {
                delayedWrite(18, false, callback);
            },
            function(callback) {
                delayedWrite(13, false, callback);
            },
            function(callback) {
                delayedWrite(15, false, callback);
            },
        ], function(err, results) {
            if (err){
              console.log(err);
            }
            console.log('Writes complete, pause then unexport pins');
            setTimeout(function() {
                gpio.destroy(function() {
                    console.log('Closed pins,');
                    return;
                });
            }, 500);
        });

    }
    else if(command === "1"){
      console.log("command left");


        async.series([
            function(callback) {
                delayedWrite(16, false, callback);
            },
            function(callback) {
                delayedWrite(18, true, callback);
            },
            function(callback) {
                delayedWrite(13, true, callback);
            },
            function(callback) {
                delayedWrite(15, false, callback);
            },
        ], function(err, results) {
            if (err){
              console.log(err);
            }
            console.log('Writes complete, pause then unexport pins');
            setTimeout(function() {
                gpio.destroy(function() {
                    console.log('Closed pins');
                    return;
                });
            }, 500);
        });


    }else if(command === "2"){
      console.log("command right");
      
      setUpPins(function(){
        async.series([
            function(callback) {
                delayedWrite(16, true, callback);
            },
            function(callback) {
                delayedWrite(18, false, callback);
            },
            function(callback) {
                delayedWrite(13, false, callback);
            },
            function(callback) {
                delayedWrite(15, true, callback);
            },
        ], function(err, results) {
            if (err){
              console.log(err);
            }
            console.log('Writes complete, pause then unexport pins');
            setTimeout(function() {
                gpio.destroy(function() {
                    console.log('Closed pins, now exit');
                    return;
                });
            }, 500);
        });
      });
    }
    else if(command === "3"){
      console.log("forward");

        setUpPins(function(){

          async.series([
              function(callback) {
                  delayedWrite(16, true, callback);
              },
              function(callback) {
                  delayedWrite(18, false, callback);
              },
              function(callback) {
                  delayedWrite(13, true, callback);
              },
              function(callback) {
                  delayedWrite(15, false, callback);
              },
          ], function(err, results) {
              if (err){
                console.log(err);
              }
              console.log('Writes complete, pause then unexport pins');
              setTimeout(function() {
                  gpio.destroy(function() {
                      console.log('Closed pins');
                      return;
                  });
              }, 500);
          });

        });

    }
    else if(command === "4"){
      console.log("back");

        setUpPins(function(){
          async.series([
              function(callback) {
                  delayedWrite(16, false, callback);
              },
              function(callback) {
                  delayedWrite(18, true, callback);
              },
              function(callback) {
                  delayedWrite(13, false, callback);
              },
              function(callback) {
                  delayedWrite(15, true, callback);
              },
          ], function(err, results) {
              if (err){
                console.log(err);
              }
              console.log('Writes complete, pause then unexport pins');
              setTimeout(function() {
                  gpio.destroy(function() {
                      console.log('Closed pins');

                  });
              }, 500);
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

  async.parallel([
    function(callback) {
        gpio.setup(16, gpio.DIR_OUT, callback)
    },
    function(callback) {
        gpio.setup(18, gpio.DIR_OUT, callback)
    },
    function(callback) {
        gpio.setup(22, gpio.DIR_OUT, callback)
    },
    function(callback) {
        gpio.setup(13, gpio.DIR_OUT, callback)
    },
    ], function(err, results) {
        console.log('Pins set up');
        cb();
    });
}

function setUpPinsAtStart(){

  async.parallel([
    function(callback) {
        gpio.setup(16, gpio.DIR_OUT, callback)
    },
    function(callback) {
        gpio.setup(18, gpio.DIR_OUT, callback)
    },
    function(callback) {
        gpio.setup(22, gpio.DIR_OUT, callback)
    },
    function(callback) {
        gpio.setup(13, gpio.DIR_OUT, callback)
    },
    ], function(err, results) {
        console.log('Pins set up @ startup');

    });
}



BatteryLevelCharacteristic.prototype.onNotify = function() {
  console.log('NotifyOnlyCharacteristic on notify');
};

module.exports = BatteryLevelCharacteristic;
