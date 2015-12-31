/*
   Library to print a string to a 20x4 Display and a Display-controller with an address of 0x27
*/

#include "Arduino.h"
#include "Display.h"

Display::Display() 
{
 	
}

void Display::Print(String str, int row, int column)
{
	lcd.setCursor(column, row);
	lcd.print(str);
}

void Display::Begin()
{
	lcd.init(); 
	lcd.backlight();
	lcd.setCursor(0, 0); 
	lcd.clear(); 
}

void Display::Default()
{
}


void Display::failed()
{
	lcd.setCursor(0,1);
	lcd.print("Fail                ");
}

void Display::firstMenu(String str)
{

  turnOnDisplay();
  
  lcd.setCursor(0,0);
  lcd.print("SUM:"+str);//+Stri;ng(getTotalAmountOfSequences()));
  lcd.setCursor(0,1);
  lcd.print("MCD:");//+String(hour(currentPosition))+"h "+String(minute(currentPosition))+"min "+String(second(currentPosition))+"sec"); //meantime current day
  lcd.setCursor(0,2);
  lcd.print("LS: ");//+String(hour(getNumberOfSecondsSinceLastSequence()))+"h "+String(minute(getNumberOfSecondsSinceLastSequence()))+"min "+String(second(getNumberOfSecondsSinceLastSequence()))+"sec"); // last sequence
  lcd.setCursor(0,3);
  lcd.print("UT: ");//+String(day(now())-1)+"days "+String(hour(now()))+"h "+String(minute(now()))+"min");  //uptime

}
void Display::turnOnDisplay()
{
  //lcd.clear();	
  lcd.backlight();
  lcd.display(); 
}

void Display::turnOffDisplay()
{
    lcd.clear();
    lcd.noDisplay();
    lcd.noBacklight();
}



void Display::totalTime(time_t t)
{
	lcd.setCursor(0,0);
	lcd.print("Total: ");
	lcd.setCursor(7,0);
	lcd.print(String(hour(t)));
	lcd.setCursor(8,0);
	lcd.print(":  ");
	lcd.setCursor(9,0);
	lcd.print(String(minute(t)));
	lcd.setCursor(11,0);
	lcd.print(":  ");
	lcd.setCursor(12,0);
	lcd.print(String(second(t)));
	lcd.setCursor(15,0);
	lcd.print("     ");
}





