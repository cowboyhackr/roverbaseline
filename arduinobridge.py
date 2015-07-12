import serial
import sys
import string
 
ser = serial.Serial('/dev/ttyAMA0', 115200)
while True :
    try:
        # Read data incoming on the serial line
        data=ser.readline()
        print data
    except:
        print "Unexpected error:", sys.exc_info()
        sys.exit()