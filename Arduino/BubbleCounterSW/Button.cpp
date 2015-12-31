/*
 Class to handle all the buttons
*/

#include "Arduino.h"
#include "Button.h"


void Button::Begin()
{
  pinMode(BUTTON, INPUT);
  buttonPushCounter = 0;
  buttonPreviousValue = false;
}

void Button::isPushed()
{
    if(getButtonValue() != buttonPreviousValue)
    {
        if(buttonPreviousValue)
          updateButtonPushCounter();
        buttonPreviousValue = getButtonValue();
    }
}

boolean Button::getButtonValue()
{
  return digitalRead(BUTTON);
}

void Button::updateButtonPushCounter()
{
  buttonPushCounter++;
  if(buttonPushCounter >= NUMBER_OF_MENUES)
    buttonPushCounter = 0;
}

int Button::getButtonPushCounter()
{
  return buttonPushCounter;
}
