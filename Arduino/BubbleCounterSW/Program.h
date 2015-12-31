/*
 Main class to handle the whole program.
*/

#ifndef Program_h
#define Program_h


#include "Arduino.h"
#include "Display.h"
#include "SerialString.h"
#include "Pins.h"
#include "Button.h"
#include "MicroPhone.h"
#include "BubbleCounter.h"


class Program
{

public:
    void Default();
    void Receive();
    void Pause();
   void ProgramFinished();
   void printMenu(int value);

private:
  	Display lcd; //Our display functions
 	SerialString serialStr; //Our Serial functions

       Button button;
        BubbleCounter bubbleCounter1;


};













#endif
