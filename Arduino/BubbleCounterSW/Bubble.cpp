/* 
* Bubble.cpp
*
* Created: 2015-12-29 15:38:48
* Author: u007333
*/


#include "Bubble.h"


// default constructor
Bubble::Bubble()
{
  startTime = 0;
  numberOfBubbles = 0;
  
} //Bubble

void Bubble::initialize()
{
  ;
}

int Bubble::getStartTime()
{
  return startTime;
}

void Bubble::setStartTIme(time_t aStartTime)
{
  startTime = aStartTime;
}

void Bubble::setNumberOfBubbles(int aNumberOfBubbles)
{
  numberOfBubbles = aNumberOfBubbles;
}

int Bubble::getNumberOfBubbles()
{
  return numberOfBubbles;
}

// default destructor
Bubble::~Bubble()
{
} //~Bubble
