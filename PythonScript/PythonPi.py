from time import sleep
import serial
import time
import socket
import os
import re
import sqlite3


gw = os.popen("ip -4 route show default").read().split()
s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
s.connect((gw[2], 0))
ipaddr = s.getsockname()[0]

print ("IP:", ipaddr)

ser = serial.Serial('/dev/ttyACM0', 9600, timeout=1) # Establish the connection on a specific port

ser.write(("ip,IP:"+ipaddr).encode('utf-8'))

con = sqlite3.connect('sqltemptime.db')
c = con.cursor();

while ser.isOpen():
	data = (ser.readline()).decode('utf-8')
	if data != "":
		match = re.match(r'\w+,\d+,\d+,\d+', data)
		#print(match)
		match2 = re.search(r'(\w+),(\d+),(\d+),(\d+)', match.group(0))
		c.execute("INSERT INTO timeTemp (time, temp, id) VALUES (?, ?, ?)", ("{}".format(match2.group(3)), "{}".format(match2.group(4)), "{}".format(match2.group(2))))
		con.commit();
		print(match2.group(1)+":"+match2.group(2)+":"+match2.group(3)+":"+match2.group(4))

