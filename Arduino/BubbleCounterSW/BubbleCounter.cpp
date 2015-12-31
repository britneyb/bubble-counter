/* 
* BubbleCounter.cpp
*
* Created: 2015-12-29 15:27:27
* Author: u007333
*/


#include "BubbleCounter.h"
#include "MicroPhone.h"
#include "Bubble.h"


// default constructor
BubbleCounter::BubbleCounter()
{

} //BubbleCounter

void BubbleCounter::Begin(int pin)
{
     for(int i=0; i < NUMBER_OF_HOURS; i++)
  {
    bubble[i] = new Bubble();
  } 
    microPhone.Begin(pin);
 
  
}

// default destructor
BubbleCounter::~BubbleCounter()
{
} //~BubbleCounter
