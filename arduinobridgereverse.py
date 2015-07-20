import serial
import sys
import string
import time
 
ser = serial.Serial('/dev/ttyAMA0', 115200)
counter = 20
while True :
    try:
    	if counter == 121:
        	counter = 20
        
    	print "counter: " 
    	print str(counter)
    	ser.write(str(counter))
    	time.sleep(10)
        counter += 1

        # Read data incoming on the serial line
        data=ser.readline()
        print data
    except:
        print "Unexpected error:", sys.exc_info()
        sys.exit()


# corresponding arduino code
# int servoAngle = 0;   // for incoming serial data


# void setup() {
#   Serial.begin(115200);
# }
 
# void loop() {
#         // send data only when you receive data:
#         if (Serial.available() > 0) {
#                 // read the incoming byte:
#                 servoAngle = Serial.parseInt();

#                 // say what you got:
#                 Serial.print("servo angle received: ");
#                 Serial.println(servoAngle, DEC);

#         }
# }