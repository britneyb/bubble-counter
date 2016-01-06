/* 
* Bubble.h
*
* Created: 2015-12-29 15:38:48
* Author: Mattias Bornvall
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
int getStartTime();
int getNumberOfBubbles();
void setStartTIme(time_t);
void setNumberOfBubbles(int );

protected:
private:
	Bubble( const Bubble &c );
	Bubble& operator=( const Bubble &c );
  void initialize();


}; //Bubble

#endif //__BUBBLE_H__
