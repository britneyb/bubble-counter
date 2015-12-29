<?php
class MyDB extends SQLite3{
   function __construct($stringDB){          //Funktion som öppnar önskad databas.
      $this->open($stringDB);
   }
}

$type = $_REQUEST["type"];                   //Läser in variablen type från GET-meddelandet.

if($type == "checkName"){                    //sqlfunctions.php?type=checkName&name="namnet"
   checkName();
}
else if($type == "saveSchedule"){            //sqlfunctions.php?type=saveSchedule&name="namnet"&array="arrayen"
   saveSchedule();
}
else if ($type == "getSchedule"){            //sqlfunctions.php?type=getSchedule&name="namnet"
   getSchedule();
}
else if ($type == "getList"){                //sqlfunctions.php?type=getList
   getList();
}
else if ($type == "upLoad"){                 //sqlfunctions.php?type=upLoad&name="namnet"&array="arrayen"
   upLoad();
}
else if ($type == "response"){               //sqlfunctions.php?type=response
   response();
}
else if ($type = "delete"){                  //sqlfunctions.php?type=delete&name="namnet"
   delete();
}

function checkName(){                        //Funktion som kollar om namnet finns i databsen.
   $name = $_REQUEST["name"];
   if(preg_match("/[a-zA-ZåäöÅÄÖ0-9]+/", $name)){
      $db = new MyDB("sqltemptime.db");
      if(!$db){
         echo $db->lastErrorMsg();
      }
      $sql = <<<EOF
         SELECT name FROM mashschedule WHERE name="$name";
EOF;
      $ret = $db->query($sql);
      $row = $ret->fetchArray(SQLITE3_ASSOC);
      if($row['name']){
         echo "fail";
      } else {
         echo "success";
      }
      $db->close();
   }
   else{
      echo "Name not valid";
   }
}

function saveSchedule(){                     //Funktion som läser datan från GET-meddelandet och gör det redo för att läggas in i databasen.
   $array = json_decode($_REQUEST["array"]);
   $name = $_REQUEST["name"];
   if(preg_match("/[a-zA-ZåäöÅÄÖ0-9]+/", $name)){
      if(!empty($array)){
         $temp = "";
         $time = "";
         for($i = 0; $i < count($array); $i++){
            $temp .= "/".$array[$i][0];
            $time .= "/".$array[$i][1];
         }
         if(preg_match("/[0-9]+/", $temp)){
            if(preg_match("/[0-9]+/", $time)){
               writeData($name, $temp, $time);
            }
            else{
               echo "Time not valid";
            }
         }
         else{
            echo "Temp not valid";
         }
      }
   }
   else{
      echo "Name not valid";
   }
}

function getSchedule(){                      //Funktion som hämtar ett specifikt schema från databasen.
   $name = $_REQUEST["name"];
   if(preg_match("/[a-zA-ZåäöÅÄÖ0-9]+/", $name)){
      $db = new MyDB("sqltemptime.db");
      if(!$db){
         echo $db->lastErrorMsg();
      }
      $sql = <<<EOF
         SELECT * FROM mashschedule WHERE name = "$name";
EOF;
      $ret = $db->query($sql);
      $row=$ret->fetchArray();
      for ($i = 0; $i < 3; $i++){
         print($row[$i]." ");
      }
      $db->close();
   }
   else{
      echo "Name not valid";
   }
}

function getList(){                          //Funktion som tar fram en lista på alla scheman i databasen.
   $db = new MyDB("sqltemptime.db");
   if(!$db){
      echo $db->lastErrorMsg();
   }
   $sql = <<<EOF
      SELECT name FROM mashschedule;
EOF;
   $ret = $db->query($sql);
   while($row=$ret->fetchArray()){
      print($row[0]."/");
   }
   $db->close();
}

function writeData($name, $temp, $time){     //Funktion som lägger in scheman i databasen.
   $db = new MyDB("sqltemptime.db");
   if(!$db){
      echo $db->lastErrorMsg();
   }
   $sql = <<<EOF
      INSERT INTO mashschedule (name,temp,time)
      VALUES ('$name', '$temp', '$time');
EOF;
   $ret = $db->exec($sql);
   if(!$ret){
      echo $db->lastErrorMsg();
   } else {
      echo "Data insertet\n";
   }
   $db->close();
}

function upLoad(){                                    //Funktion som skickar en sträng till arduinon.
   $name = $_REQUEST["name"];                         //name,temp1,time1,temp2,time2....tempn,timen,checksum
   $array = json_decode($_REQUEST["array"]);          //checksum = strlen(name)+temp1+time1+temp2+...+tempn+timen
   if(preg_match("/[a-zA-ZåäöÅÄÖ0-9]+/", $name)){
      if(!empty($array)){
         $check = strlen($name);
         $text = $name;
         for($i = 0; $i < count($array); $i++){
            $text .= ",".$array[$i][0];
            $text .= ",".$array[$i][1];
            $check += $array[$i][0];
            $check += $array[$i][1];
         }
         $text .= ",".$check.",";
         //echo $text;
         $fp = fopen("/dev/ttyACM0","w");
         if(!$fp){
            echo "Can't find /dev/ttyACM0";
            $fp = fopen("/dev/ttyACM1","w");
            if(!$fp){
               echo "Can't find /dev/ttyACM1";
            }
         }
         fwrite($fp,$text);
         echo "Scheme sent";
         fclose($fp);
      }
      else{
         echo "Arrayen tom";
      }
   }
   else{
      echo "Invalid namn";
   }
}

function delete(){
   $db = new MyDB("sqltemptime.db");
   if(!$db){
      echo $db->lastErrorMsg();
   }
   $name = $_REQUEST["name"];
   $sql = <<<EOF
      DELETE FROM mashschedule
      WHERE name = "$name";
EOF;
   $ret = $db->exec($sql);
   if(!$ret){
      echo $db->lastErrorMsg();
   } else {
      echo "Row deleted";
   }
   $db->close();
}

function response(){
   $fp = fopen("/dev/ttyACM0","r");
   if(!$fp){
      echo "Can't find /dev/ttyACM0";
      $fp = fopen("/dev/ttyACM1","r");
      if(!$fp){
         echo "Can't find /dev/ttyACM1";
      }
   }
   //$respond = "";
   $respond = fread($fp,10);
   echo "test";
   echo $respond;
   fclose($fp);
}
