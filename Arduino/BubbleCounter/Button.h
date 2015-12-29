/*
 Class to handle all the buttons
*/


#ifndef Button_h
#define Button_h

#include "Arduino.h"
#include "Pins.h"	


class Button
{

public:
    void Begin();
    void isPushed();
    boolean getButtonValue();
    void updateButtonPushCounter();
    int getButtonPushCounter();
  
private:
int buttonPushCounter;
int pin_val;
boolean buttonPreviousValue;
};



#endif
