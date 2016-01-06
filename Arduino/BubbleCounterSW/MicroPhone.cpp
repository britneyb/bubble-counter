/* 
* MicroPhone.cpp
*
* Created: 2015-12-28 23:44:04
* Author: u007333
*/


#include "MicroPhone.h"
#include "Pins.h"
#include <time.h>

// default constructor
MicroPhone::MicroPhone()
{
} //MicroPhone

void MicroPhone::initialize(int pin)
{
  arduinoPin = pin;
  pinMode(arduinoPin, INPUT);
  currentValue = false;
  lastChange=now();
}

time_t MicroPhone::getLastChange()
{
  return lastChange;
}

int MicroPhone::getMicrophoneValue()
{
  microPhoneValue = digitalRead(arduinoPin);
  return microPhoneValue;
}


bool MicroPhone::valueHasChanged()
{
  bool value = getMicrophoneValue();
  
  
if(value != currentValue)

 {
   if((lastChange + MIN_SEC_BETWEEN_TWO_BUBBLE) < now())
     {
       currentValue = value;
       lastChange=now();
       return true;
     }  
 }
return false;
}




void MicroPhone::updateMe()
{
  valueHasChanged();
}

// default destructor
MicroPhone::~MicroPhone()
{
} //~MicroPhone
