/*
 Class to handle all the buttons
*/

#include "Arduino.h"
#include "Button.h"


void Button::Begin()
{
  pinMode(BUTTON, INPUT);
  buttonStatus = 0;
}

void Button::isPushed()
{

}

int Button::getButtonValue()
{
  pin_val = digitalRead(BUTTON);
  return pin_val;
}

void Button::updateButtonStatus()
{
  buttonStatus++;
  if(buttonStatus >= NUMBER_OF_MENUES)
    buttonStatus = 0;
}
