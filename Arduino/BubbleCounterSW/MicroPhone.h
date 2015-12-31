/* 
* MicroPhone.h
*
* Created: 2015-12-28 23:44:04
* Author: u007333
*/


#ifndef __MICROPHONE_H__
#define __MICROPHONE_H__


class MicroPhone
{
//variables
public:
protected:
private:
int microPhoneValue;
int arduinoPin;

//functions
public:
	MicroPhone();
	~MicroPhone();
void Begin(int);
int getMicrophoneValue();

protected:
private:
	MicroPhone( const MicroPhone &c );
	MicroPhone& operator=( const MicroPhone &c );

}; //MicroPhone

#endif //__MICROPHONE_H__
