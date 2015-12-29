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
    int getButtonValue();
    void updateButtonStatus();
  
private:
int buttonStatus;
int pin_val;
boolean buttonIsPushed;
};



#endif
