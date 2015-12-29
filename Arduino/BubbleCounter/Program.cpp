/*
 Main class to handle the whole program.
*/

#include "Arduino.h"
#include "Program.h"


void Program::Default()
{
       lcd.Begin();
       microPhone.Begin();
       button.Begin();

}

void Program::Receive()
{
 
 printMenu(button.getButtonPushCounter());
 button.isPushed();
 
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
  serialStr.Print(String(value));
  switch(value)
  {
    case 0:
    lcd.turnOffDisplay();
    break;
    case 1:
    lcd.firstMenu("test");
    break;
  
  
  
  } 

}


