import serial
import re
import sqlite3

ser = serial.Serial('/dev/ttyACM0', 9600, timeout=1) # Establish the connection on a specific port

con = sqlite3.connect('sqltemptime.db')
c = con.cursor();

while ser.isOpen():
	data = (ser.readline()).decode('utf-8')
	if data != "":
		match = re.match(r'\w+,\d+,\d+,\d+,\d+,\d+', data)
		if match:
			match2 = re.search(r'(\w+),(\d+),(\d+),(\d+),(\d+),(\d+)', match.group(0))
			_check = match2.group(6)
			_time = match2.group(4)
			_temp = match2.group(5)
			_id = match2.group(2)
			_checkSum = int(_id)+int(_time)+int(_temp)+int(match2.group(3))
			if match2.group(1) == "boil":
				_time = int(match2.group(3))-int(_time)
			if int(_checkSum) == int(_check):
				c.execute("INSERT INTO timeTemp (time, temp, id) VALUES (?, ?, ?)", ("{}".format(_time), "{}".format(_temp), "{}".format(_id)))
				con.commit()

