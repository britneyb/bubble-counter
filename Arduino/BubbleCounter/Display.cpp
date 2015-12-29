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

void Display::menu(String str)
{
	lcd.setCursor(0,0);
	lcd.print("value:                ");
        lcd.setCursor(0,1);
        lcd.print(str);

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





