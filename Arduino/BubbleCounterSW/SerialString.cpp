/*
   Library to have a basic communication with a Serial device.
*/

#include "Arduino.h"
#include "SerialString.h"


void SerialString::Print(String str)
{
	Serial.print(str);	
}


String SerialString::Read()
{
	
	String str = "";
	while(Serial.available())
	{
		str += Serial.readString();
	}
	return str;

}

