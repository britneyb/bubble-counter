/* Analog Read Interrupter
* -----------------------
*/
#include <Wire.h> 
#include <LiquidCrystal_I2C.h>
#include <Time.h>

LiquidCrystal_I2C lcd(0x27,20,4);  // set the LCD address to 0x27 for a 20 chars and 4 line display. SDA=analog4 SCL=analog5

int photoInterrupterPin = 2; // select the input pin for the interrupter
int tactButtonPin = 3;
int ledOnShield = 4;

int _totalAmountOfBubbleSequences = 0; //total amount of bubble sequences from start
int const _numberOfDayPositions = 1;
time_t _sequencesForCurrentDayArray[_numberOfDayPositions][3]; // each Day has pos 0=time of first sequence, 1=time of last sequence 2 = number of sequences during that day.
int _currentDayPosition=0; //keep track of current position in the array
time_t _dateTimeOfLastSequence=now();
time_t _minTimeBetweenTwoSequences=2; //minimum number of seconds between two sequences. if less than this, consider it to be in the same sequence


int displayUpdateFrequency=0;
int turnDisplayOff = 180;
int lcdBacklightCounter=now();
void setup()
{
   lcd.init();                      // initialize the lcd 
   lcd.init();
   lcd.backlight();
  // Print a message to the LCD.
    Serial.begin(9600); // set up Serial library at 9600 bps
    pinMode(photoInterrupterPin, INPUT);
    pinMode(tactButtonPin, INPUT);
    pinMode(ledOnShield, OUTPUT);

}

void loop()
{
updateSequence(digitalRead(photoInterrupterPin));
turnOnOffDisplay(digitalRead(tactButtonPin));
    Serial.println(analogRead(photoInterrupterPin));
}




int getCurrentArrayPosition()
{
int currentPosition;
  
for(int i =0; i<_numberOfDayPositions;i++)
{
  if(day(_sequencesForCurrentDayArray[i][1]) == day(now()) )
    return i;
  else
  {
    currentPosition = getNextOrPreviousArrayPosition(true); //new day has started. set all initial values to 0;
    _sequencesForCurrentDayArray[currentPosition][0]=0;
    _sequencesForCurrentDayArray[currentPosition][1]=0;
    _sequencesForCurrentDayArray[currentPosition][2]=0;
    _currentDayPosition = currentPosition;
    return currentPosition;
  }  
    
}


}



int getNextOrPreviousArrayPosition(bool next)
{
int nextPosition = _currentDayPosition;
  
  if(next) //give me the next position in the array
  {
    nextPosition++;
    if(nextPosition < _numberOfDayPositions)
            return nextPosition;
    else
      return 0;
  }
  else //get me the previous position in the array
  {
    nextPosition--;
    if(nextPosition >= 0)
      return nextPosition;
        else
      return (_numberOfDayPositions-1);
  }
 }

int turnOnOffDisplay(bool buttonIsPushed)
{
  
if((lcdBacklightCounter + turnDisplayOff) < ((int)now()))
{
  lcd.noDisplay();
  lcd.noBacklight();
}
if(buttonIsPushed)
{
  lcd.display();
  lcd.backlight();
  lcdBacklightCounter =now();
}

if(displayUpdateFrequency>5000 )
{
  getMenu(); 
   displayUpdateFrequency=0;  
}
displayUpdateFrequency++;

}

void updateSequence(bool input)
{
if(input)
{
  if(_dateTimeOfLastSequence + _minTimeBetweenTwoSequences <= now())
  {
    _sequencesForCurrentDayArray[getCurrentArrayPosition()][2]++;
    _sequencesForCurrentDayArray[getCurrentArrayPosition()][1] = now();
    if(_sequencesForCurrentDayArray[getCurrentArrayPosition()][0] == 0)
      _sequencesForCurrentDayArray[getCurrentArrayPosition()][0] = now();
      
  _totalAmountOfBubbleSequences++; 
  }
  digitalWrite(ledOnShield, HIGH);
  _dateTimeOfLastSequence = now();
}

digitalWrite(ledOnShield, LOW);

}


void getMenu()
{
  time_t currentPosition = getAvarageSequenceForCurrentDay(getCurrentArrayPosition());
  
  lcd.clear();
lcd.setCursor(0,0);
  lcd.print("SUM:"+String(getTotalAmountOfSequences()));
  lcd.setCursor(0,1);
  lcd.print("MCD:"+String(hour(currentPosition))+"h "+String(minute(currentPosition))+"min "+String(second(currentPosition))+"sec"); //meantime current day
  lcd.setCursor(0,2);
  lcd.print("LS: "+String(hour(getNumberOfSecondsSinceLastSequence()))+"h "+String(minute(getNumberOfSecondsSinceLastSequence()))+"min "+String(second(getNumberOfSecondsSinceLastSequence()))+"sec"); // last sequence
  lcd.setCursor(0,3);
  lcd.print("UT: "+String(day(now())-1)+"days "+String(hour(now()))+"h "+String(minute(now()))+"min");  //uptime
    
}

time_t getAvarageSequenceForCurrentDay(int currentPostion)
{
float avarage;


avarage = float(((int)_sequencesForCurrentDayArray[currentPostion][1]- (int)_sequencesForCurrentDayArray[currentPostion][0]))/(int)_sequencesForCurrentDayArray[currentPostion][2];
 
 //Serial.println((time_t)avarage);  
  return (time_t)avarage;
}

int getNumberOfSecondsSinceLastSequence()
{
  return now()-_dateTimeOfLastSequence;
}

int getTotalAmountOfSequences()
{
  return _totalAmountOfBubbleSequences;
}


