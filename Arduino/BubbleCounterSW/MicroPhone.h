/* 
* MicroPhone.h
*
* Created: 2015-12-28 23:44:04
* Author: Mattias Bornvall
*/


#ifndef __MICROPHONE_H__
#define __MICROPHONE_H__

#include <time.h>

class MicroPhone
{
//variables
public:
protected:
private:
int microPhoneValue;
int arduinoPin;
bool currentValue;
time_t lastChange;

//functions
public:
	MicroPhone();
	~MicroPhone();
void initialize(int);
int getMicrophoneValue();
bool valueHasChanged();
void updateMe();
time_t getLastChange();

protected:
private:
	MicroPhone( const MicroPhone &c );
	MicroPhone& operator=( const MicroPhone &c );

}; //MicroPhone

#endif //__MICROPHONE_H__
