import serial
import sys
import string
import time
 
ser = serial.Serial('/dev/ttyAMA0', 115200)
counter = 0
while True :
    try:
    	print "counter: " 
    	print str(counter)
    	ser.write(str(counter))
    	time.sleep(1)
        counter += 1
        # Read data incoming on the serial line
        data=ser.readline()
        print data
    except:
        print "Unexpected error:", sys.exc_info()
        sys.exit()