/* 
* BubbleCounter.h
*
* Created: 2015-12-29 15:27:28
* Author: u007333
*/


#ifndef __BubbleCounter_H__
#define __BubbleCounter_H__

#include "MicroPhone.h"
#include "Bubble.h"
#include "Pins.h"

class BubbleCounter
{
//variables
public:
protected:
private:

//functions
public:
	BubbleCounter();
	~BubbleCounter();
        MicroPhone microPhone;
void Begin(int);
protected:

private:
	BubbleCounter( const BubbleCounter &c );
	BubbleCounter& operator=( const BubbleCounter &c );


        Bubble *bubble[NUMBER_OF_HOURS]; //pos 0 = current hour, pos 1= previous hour

}; //BubbleCounter

#endif //__BubbleCounter_H__
