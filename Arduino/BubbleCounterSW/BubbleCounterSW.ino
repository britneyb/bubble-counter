#include <Time.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>

#include "Program.h"
#include "Display.h"
#include "SerialString.h"
#include "Pins.h"
//#include "Button.h
#include "MicroPhone.h"


Program program;

void setup()
{
  	Serial.begin(9600);
	program.Default();
}

void loop()
{
  	program.Receive(); 
}
