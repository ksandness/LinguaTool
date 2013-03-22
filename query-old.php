<?php

if (isset($_POST['verbsearchsubmit'])) {
//--------------------------------------------------------------------------
// Example php script for fetching data from mysql database
//--------------------------------------------------------------------------
$host = 'localhost';
$user = 'kevinsan_admin';
$pass = 'veggieboy';
$databaseName = 'lingua_tool';
$tableName = 'verbs';

//--------------------------------------------------------------------------
// 1) Connect to mysql database
//--------------------------------------------------------------------------

//1.
//$con = mysql_connect($host,$user,$pass);
//$dbs = mysql_select_db($databaseName, $con);


//2.
$mysqli = new mysqli($host, $user, $pass, $databaseName);

if (mysqli_connect_errno()) {
    printf("Connect failed: %s\n", mysqli_connect_error());
    exit();
}


//--------------------------------------------------------------------------
// 2) Query database for data
//--------------------------------------------------------------------------
//1.
//$result = mysql_query("SELECT * FROM $tableName"); //query
//$array = mysql_fetch_row($result);

//2.
$text = $mysqli->real_escape_string($_POST['verbsearchsubmit']);
$query = "SELECT * FROM $tableName  WHERE 'infinitive' LIKE '%{$text}%'";
$result = $mysqli->query($query) or die($mysqli->error.__LINE__);

//--------------------------------------------------------------------------
// 3) echo result as json
//--------------------------------------------------------------------------
//1.
//echo json_encode($array);

//2. Build JSON string manual through concatenation
/*$json = '{';
if($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $id = $row["verbID"];
        $infinitive = $row['infinitive'];
        $infinitiveEnglish = $row['infinitive_english'];
        $infinitiveMood = $row['mood_english'];
        $json .= '"id'.$id.'":{ "infinitive":"'.$infinitive.'","infinitive_english":"'.$infinitiveEnglish.'","infinitive_mood":"'.$infinitiveMood.'"},';
    }
}
else {
    echo 'NO RESULTS';
}
$json = chop($json, ",");
$json .= '}';
echo $json;
echo json_encode($row); */

//3. Build JSON string via array and then encode
$json = array();
if($result->num_rows > 0) {
    while($row = $result->fetch_array()) {
        $jsonrow = array (
            'id' => $row["verbID"],
            'infinitive' => $row["infinitive"],
            'infinitive-english' => $row["infinitive_english"],
            'mood' => $row["mood_english"]
        );
        array_push($json, $jsonrow);
    }
    $jsonstring = json_encode($json);
    echo $jsonstring;
}
else {
    echo 'NO RESULTS';
}

}

?>