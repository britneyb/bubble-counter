# Control system for home brewery

A complete system that monitors and manages the temperature of a home brewery.

## Installation

###Raspbian 
First of all you need Raspbian installed on your Raspberry Pi which you can easily do with NOOBS (New Out Of the Box Software).

#### Default user for Raspbian
User: pi

Password: raspberry


### Apache & PHP
To install Apache which we are going to use as our webserver we need to write some lines in the terminal:

Installing apache and php:
sudo apt-get install apache2 php5 libapache2-mod-php5

Restarting apache:
sudo service apache2 restart
 
Enter the IP-address of your raspberry in your web browser. If it works you should see the text “It works!”. 


### SQLite
Write the following in the terminal to install sqlite:
sudo apt-get install sqlite3 libsqlite3-dev

To be able to communicate with sqlite through php:
sudo apt-get install php5-sqlite

If you write sqlite3 it should be starting the command-line utility and that should indicate that sqlite is installed successfully.

To quit sqlite press ctrl+d or write “.quit”. 

### Permissions
No external user should normally be able to access the usb-ports but in our case we have to make an exception to be able to communicate with the arduino through php. The user which will be used when you browse a website on your server is named www-data. To be able to communicate with the usb we have to add that user to the dialout group. We can easily do that with the following line in the terminal:

usermod -a -G dialout www-data

To see if www-data is added successfully to dialout, type the following:
groups www-data

After that add the user Pi as the owner of the folder www
sudo chown -R pi /var/www

To see if Pi is now the owner:
ls -l /var/www

We also have to edit a file that decides who has permission for sudo:
sudo visudo

Add www-data to sudoer with the following line:
www-data ALL = NOPASSWD: /sbin/shutdown

The reason we have to do this is to be able to shutdown the system through the website.

### Adding the website
Next step is to add the website which you can get from our Github under path /website/:
https://github.com/Sevag1990/home-brewery

The website should be placed under /var/www/

### Script at startup
Copy the python-script serverip.py found on Github to /home/pi

Then edit the rc.local file using this command:
sudo nano /etc/rc.local

Then copy this following line at the end of the file:
python3 /home/pi/serverip.py

### Optional: Sync Time
If you have a problem getting the right time from the raspberry you could add this lines also in the file rc.local using the same command as above.

time=$(wget http://www.timeapi.org/utc/in+one+hours?format=%25d%20%25b%20%25Y%2$
echo "Time set to:"
sudo date -s "`echo $time`"

### Arduino

To upload the code to the Arduino you will first have to import several libraries in your C:/Users/”user”/Documents/Arduino/libraries folder.

The libraries you need is the following and can also be found on Github under the path /Arduino/libraries/:

LiquidCrystal_I2C2004V1
OneWire
Time
dallas-temperature-control

You will also need to replace a core file to arduino because we need to change a value to be able to receive our message which would be too large otherwise. The file you need to replace is called “HardwareSerial.h” and you can find it under /Arduino/Arduino Cores/ on Github. The file should be placed in /Arduino/hardware/arduino/avr/cores/arduino/
