/* 
* Bubble.h
*
* Created: 2015-12-29 15:38:48
* Author: u007333
*/


#ifndef __BUBBLE_H__
#define __BUBBLE_H__
#include <time.h>


class Bubble
{
//variables
public:
protected:
private:
time_t startTime;
int numberOfBubbles;




//functions
public:
	Bubble();
	~Bubble();
protected:
private:
	Bubble( const Bubble &c );
	Bubble& operator=( const Bubble &c );
  void Begin();

}; //Bubble

#endif //__BUBBLE_H__
