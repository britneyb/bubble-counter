/* 
* MicroPhone.cpp
*
* Created: 2015-12-28 23:44:04
* Author: u007333
*/


#include "MicroPhone.h"
#include "Pins.h"

// default constructor
MicroPhone::MicroPhone()
{
} //MicroPhone

void MicroPhone::Begin(int pin)
{
  arduinoPin = pin;
  pinMode(arduinoPin, INPUT);
}

int MicroPhone::getMicrophoneValue()
{
  microPhoneValue = digitalRead(arduinoPin);
  return microPhoneValue;
}


// default destructor
MicroPhone::~MicroPhone()
{
} //~MicroPhone
