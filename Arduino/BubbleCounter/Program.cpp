/*
 Main class to handle the whole program.
*/

#include "Arduino.h"
#include "Program.h"


void Program::Default()
{
//	Button::Begin();
	lcd.Begin();
//	pinMode(BUZZER, OUTPUT);
       microPhone.Begin();
       button.Begin();

}

void Program::Receive()
{
 serialStr.Print("helloooo");
 lcd.menu(String(button.getButtonValue()));
 
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



