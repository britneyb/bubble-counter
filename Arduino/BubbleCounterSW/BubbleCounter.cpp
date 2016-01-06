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

void BubbleCounter::initialize(int pin)
{
     for(int i=0; i < NUMBER_OF_HOURS; i++)
  {
    bubble[i] = new Bubble();
  } 
 microPhone.initialize(pin);
 currentPosInArray=0;
  
}

void BubbleCounter::updateMe()
{
   if(microPhone.valueHasChanged())
   {
     addNewBubbleToArray(now());
    } 
  
}

void BubbleCounter::nextPositionInArray()
{
  if(currentPosInArray == (NUMBER_OF_HOURS-1))
    currentPosInArray = 0;
  else
    currentPosInArray++; 
}

void BubbleCounter::addNewBubbleToArray(time_t aStartTime)
{

  
  time_t tmpStartTime=  bubble[currentPosInArray]->getStartTime();
  
  if(tmpStartTime == 0)
   {
     bubble[currentPosInArray]->setStartTIme(aStartTime);
     bubble[currentPosInArray]->setNumberOfBubbles(bubble[currentPosInArray]->getNumberOfBubbles()+1);
   }
  
   else if(hour(tmpStartTime) == hour(aStartTime))
    bubble[currentPosInArray]->setNumberOfBubbles(bubble[currentPosInArray]->getNumberOfBubbles()+1);
    //serialStr.Println("aStartTime:"+String(aStartTime) + " tmpStartTime " +String(tmpStartTime));
  

  
   else if(hour(tmpStartTime) != hour(aStartTime))
   {
     nextPositionInArray();
     bubble[currentPosInArray]->setStartTIme(aStartTime);
     bubble[currentPosInArray]->setNumberOfBubbles(1);
   } 

     
     serialStr.Println("aStartTime:"+String(aStartTime) + " getStartTIme:"+String(bubble[currentPosInArray]->getStartTime())+ " getNumberOfBubbles:"+String(bubble[currentPosInArray]->getNumberOfBubbles())+ " currentPosInArray:"+String(currentPosInArray));
}

int BubbleCounter::getCurrentPosInArray()
{
  return currentPosInArray;
}



// default destructor
BubbleCounter::~BubbleCounter()
{
} //~BubbleCounter
