/*
 Library to print a string to a 20x4 Display and a Display-controller with an address of 0x27
*/

#ifndef Display_h
#define Display_h

#include <Wire.h> 
#include <LiquidCrystal_I2C.h>
#include <Time.h>
#include "Arduino.h"

class Display
{
  public:
    Display();
    void Print(String str, int row = 0, int column = 0);
    void Begin();
    void Default();
    void failed();
    void menu(String str);
    void totalTime(time_t time);

    void step(int row, int cStep, int cTemp, int cTime, int steps);
  private:
  	LiquidCrystal_I2C lcd = LiquidCrystal_I2C(0x27,20,4);
};

#endif
