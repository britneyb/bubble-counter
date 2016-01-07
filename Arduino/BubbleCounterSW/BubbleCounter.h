/* 
* BubbleCounter.h
*
* Created: 2015-12-29 15:27:28
* Author: Mattias Bornvall
*/


#ifndef __BubbleCounter_H__
#define __BubbleCounter_H__

#include "MicroPhone.h"
#include "Bubble.h"
#include "Pins.h"
#include "SerialString.h"

class BubbleCounter
{
//variables
public:
MicroPhone microPhone;
int currentPosInArray;
        Bubble *bubble[NUMBER_OF_HOURS]; //pos 0 = current hour, pos 1= previous hour
time_t lastBubble;
protected:
private:
SerialString serialStr; //Our Serial functions
//functions
public:
	BubbleCounter();
	~BubbleCounter();

void updateMe();        
void initialize(int);
void nextPositionInArray();
void addNewBubbleToArray(time_t);
int getCurrentPosInArray();
int timeSinceLastBubble();
protected:

private:
	BubbleCounter( const BubbleCounter &c );
	BubbleCounter& operator=( const BubbleCounter &c );




}; //BubbleCounter

#endif //__BubbleCounter_H__
