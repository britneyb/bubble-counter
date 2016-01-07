/*
 Main class to handle the whole program.
*/

#include "Arduino.h"
#include "Program.h"


void Program::initialize()
{
       lcd.initialize();
       button.initialize();
       bubbleCounter1.initialize(MICRO_PHONE_1); 
}

void Program::updateMe()
{
 //serialStr.Println("value:"+String(bubbleCounter1.microPhone.valueHasChanged())+" "+String(bubbleCounter1.microPhone.getLastChange()));
 //serialStr.Print("starttime:"+String(bubbleCounter1.bubble[0]->startTime));
 printMenu(button.getButtonPushCounter());
 button.isPushed();
 bubbleCounter1.updateMe();
 
 
}

void Program::Pause()
{
  
}

void Program::ProgramFinished()
{
//	while(!digitalRead(stopButton))
//	{
//		lcd.programFinished();
//	}
}

void Program::printMenu(int value)
{
  //serialStr.Print(String(value));
  switch(value)
  {
    case 0:
      lcd.turnOffDisplay();
      break;
    case 1:
      lcd.testMenu(bubbleCounter1.bubble[bubbleCounter1.getCurrentPosInArray()]->getStartTime(), bubbleCounter1.bubble[bubbleCounter1.getCurrentPosInArray()]->getNumberOfBubbles());
      break;
    case 2:
      lcd.firstMenu(bubbleCounter1.timeSinceLastBubble());
      break;
    default:
      lcd.turnOffDisplay();
      break;
  
  } 

}


