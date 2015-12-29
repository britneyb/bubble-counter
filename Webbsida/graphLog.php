<?php
class MyDB extends SQLite3{
   function __construct($stringDB){          //Funktion som öppnar önskad databas.
      $this->open($stringDB);
   }
}

$type = $_REQUEST["type"];					//Läser in variablen type från GET-meddelandet.
if($type == "getLogs")						//Hämta alla loggar	graphLog.php?type=getLogs
	getLogs();
else if($type == "loadLog")					//Ladda ett loggschema graphLog.php?type=loadLog&date="2015/05/20 10:47"
	loadLog();
else if($type == "deleteLog")				//Ta bort en logg 	graphLog.php?type=deleteLog&date="2015/04/22"
	deleteLog();
else if($type == "loadCurrent")				//Load the most recent log  graphLog.php?type=loadCurrent
	loadCurrent();

function getLogs(){
	$db = new MyDB("sqltemptime.db");
   if(!$db){
      echo $db->lastErrorMsg();
   }
   $sql = <<<EOF
      SELECT name,date,type FROM schema;
EOF;
   $ret = $db->query($sql);
   $array = [];
   while($row=$ret->fetchArray()){
      array_push($array, $row[2]." ".$row[0]." ".$row[1]);
   }
   $db->close();

   echo json_encode($array);
}

function loadLog(){
	$date = $_REQUEST["date"];
		$db = new MyDB("sqltemptime.db");
	if(!$db){
		echo $db->lastErrorMsg();
	}

	$date = $_REQUEST["date"];
	$logArray = [];
	$sql = <<<EOF
		SELECT * FROM schema WHERE date = "$date";
EOF;
	$ret = $db->query($sql);
	$row=$ret->fetchArray();
	for($i = 0; $i < 6; $i++){
		array_push($logArray, $row[$i]);
	}

	$id = $logArray[0];
	$dataArray = [];
	$sql = <<<EOF
		SELECT time, temp FROM timeTemp WHERE id = "$id";
EOF;
	$ret = $db->query($sql);
	while($row=$ret->fetchArray()){
		array_push($dataArray, [$row[0],$row[1]]);
	}
	echo json_encode([$logArray, $dataArray]);
	$db->close();
}


function deleteLog(){
	$db = new MyDB("sqltemptime.db");
	if(!$db){
		echo $db->lastErrorMsg();
	}
	$date = $_REQUEST["date"];
	$sql = <<<EOF
		SELECT id FROM schema WHERE date = "$date";
EOF;
	$ret = $db->query($sql);
	$row = $ret->fetchArray(SQLITE3_ASSOC);
	$id = $row['id'];

	$sql = <<<EOF
	DELETE FROM timeTemp
	WHERE id = "$id";
EOF;
	$ret = $db->exec($sql);
	if(!$ret){
		echo $db->lastErrorMsg();
	} else {
		echo "Row deleted";
	}
	$sql = <<<EOF
	DELETE FROM schema
	WHERE id = "$id";
EOF;
	$ret = $db->exec($sql);
	if(!$ret){
		echo $db->lastErrorMsg();
	} else {
		echo "Row deleted";
	}

	$db->close();
}

function loadCurrent(){
	$db = new MyDB("sqltemptime.db");
	if(!$db){
		echo $db->lastErrorMsg();
	}

	$logArray = [];
	$sql = <<<EOF
		SELECT * FROM schema WHERE id = (SELECT MAX(id) FROM schema);
EOF;
	$ret = $db->query($sql);
	$row=$ret->fetchArray();
	for($i = 0; $i < 6; $i++){
		array_push($logArray, $row[$i]);
	}

	$id = $logArray[0];
	$dataArray = [];
	$sql = <<<EOF
		SELECT time, temp FROM timeTemp WHERE id = "$id";
EOF;
	$ret = $db->query($sql);
	while($row=$ret->fetchArray()){
		array_push($dataArray, [$row[0],$row[1]]);
	}
	echo json_encode([$logArray, $dataArray]);
	$db->close();
}
