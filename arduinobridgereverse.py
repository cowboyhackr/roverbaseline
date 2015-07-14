import serial
import sys
import string
 
ser = serial.Serial('/dev/ttyAMA0', 115200)
counter = 0
while True :
    try:
    	print "counter: " + counter
    	ser.write(counter)
    	time.sleep(1)
        counter += 1
        # Read data incoming on the serial line
        data=ser.readline()
        print data
    except:
        print "Unexpected error:", sys.exc_info()
        sys.exit()