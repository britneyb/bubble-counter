<?php
class MyDB extends SQLite3{
   function __construct($stringDB){          //Funktion som öppnar önskad databas.
      $this->open($stringDB);
   }
}

$type = $_REQUEST["type"];                   //Läser in variablen type från GET-meddelandet.

if($type == "checkName"){                    //kylschema.php?type=checkName&name="namnet"
   checkName();
}
else if($type == "saveSchedule"){            //kylschema.php?type=saveSchedule&name="namnet"&temp="temperaturen"
   saveSchedule();
}
else if ($type == "getSchedule"){            //kylschema.php?type=getSchedule&name="namnet"
   getSchedule();
}
else if ($type == "getList"){                //kylschema.php?type=getList
   getList();
}
else if ($type == "upLoad"){                 //kylschema.php?type=upLoad&name="namnet"&temp="temperaturen"
   upLoad();
}
else if ($type = "delete"){                  //kylschema.php?type=delete&name="namnet"
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
         SELECT name FROM coolingschedule WHERE name="$name";
EOF;
      $ret = $db->query($sql);
      $row = $ret->fetchArray(SQLITE3_ASSOC);
      if($row['name']){
        echo "fail";
      }
      else{
        echo "success";
      }
      $db->close();
   }
   else{
      echo "Name not valid";
   }
}

function saveSchedule(){                     //Funktion som läser datan från GET-meddelandet och gör det redo för att läggas in i databasen.
	$name = $_REQUEST["name"];
	$temp = $_REQUEST["temp"];
	if(preg_match("/[a-zA-ZåäöÅÄÖ0-9]+/", $name)){
		if(preg_match("/[0-9]+/", $temp)){
			$db = new MyDB("sqltemptime.db");
		   if(!$db){
		      echo $db->lastErrorMsg();
		   }
		   $sql = <<<EOF
		      INSERT INTO coolingschedule (name,temp)
		      VALUES ('$name', '$temp');
EOF;
		   $ret = $db->exec($sql);
		   if(!$ret){
		      echo $db->lastErrorMsg();
		   } else {
		      echo "Data insertet\n";
		   }
		   $db->close();
		}
        else{
           echo "Temp not valid";
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
         SELECT * FROM coolingschedule WHERE name = "$name";
EOF;
      $ret = $db->query($sql);
      $row=$ret->fetchArray();
      for ($i = 0; $i < 2; $i++){
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
      SELECT name FROM coolingschedule;
EOF;
   $ret = $db->query($sql);
   while($row=$ret->fetchArray()){
      print($row[0]."/");
   }
   $db->close();
}

function upLoad(){										//Funktion som skickar en sträng till arduinon.
   $name = $_REQUEST["name"];							//type,name,checksum,temp,
   $temp = $_REQUEST["temp"];							//checksum = strlen(name)+temp
   if(preg_match("/[a-zA-ZåäöÅÄÖ0-9]+/", $name)){
      if(preg_match("/[0-9]+/", $temp)){
         $text = "cooling,";
         $check = strlen($name);
         $text .= $name;
         $id = makeRow($name);
         $text .= ",".$id;
         $check += $temp;
         $text .= ",".$check.",".$temp.",";
         $fp = fopen("/dev/ttyACM0","w");
         if(!$fp){
            echo "Can't find /dev/ttyACM0";
         }
         fwrite($fp,$text);
         echo "Scheme sent";
         fclose($fp);
         exec('python3 PythonPi.py');
      }
      else{
         echo "Invalid temp";
      }
   }
   else{
      echo "Invalid namn";
   }
}

function makeRow($name){
   $date = date('Y/m/d H:i');
   $db = new MyDB("sqltemptime.db");
   if(!$db){
      echo $db->lastErrorMsg();
   }
   $sql = <<<EOF
      INSERT INTO schema (name, type, date)
      VALUES ('$name', 'cooling', '$date');
EOF;
   $ret = $db->exec($sql);
   if(!$ret){
      echo $db->lastErrorMsg();
   } else {
      echo "Data insertet\n";
   }
   $id = $db->lastInsertRowid();
   $db->close();
   return $id;
}

function delete(){
   $db = new MyDB("sqltemptime.db");
   if(!$db){
      echo $db->lastErrorMsg();
   }
   $name = $_REQUEST["name"];
   $sql = <<<EOF
      DELETE FROM coolingschedule
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