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

void MicroPhone::Begin()
{
  pinMode(MICRO_PHONE, INPUT);
}

int MicroPhone::getMicrophoneValue()
{
  pin_val = digitalRead(MICRO_PHONE);
  return pin_val;
}


// default destructor
MicroPhone::~MicroPhone()
{
} //~MicroPhone
