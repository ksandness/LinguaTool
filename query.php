<?php

//--------------------------------------------------------------------------
// Example php script for fetching data from mysql database
//--------------------------------------------------------------------------
$host = 'localhost';
$user = 'kevinsan_admin';
$pass = 'veggieboy';
$databaseName = 'lingua_tool';
$tableName = 'verbs';

function specialCharacters(&$item, $key) {//encode array to allow for special language characters
    $item = utf8_encode($item);
}


if (isset($_POST['verbsearch'])) {


    //--------------------------------------------------------------------------
    // 1) Connect to mysql database
    //--------------------------------------------------------------------------

    $mysqli = new mysqli($host, $user, $pass, $databaseName);//new connection

    if (mysqli_connect_errno()) {//if connection fails
        printf("Connect failed: %s\n", mysqli_connect_error());
        exit();
    }


    //--------------------------------------------------------------------------
    // 2) Query database for data
    //--------------------------------------------------------------------------

    $text = $mysqli->real_escape_string($_POST['verbsearch']);//pull search term
    $text = utf8_decode($text);
    $whereClause = "infinitive = '$text'";

    if(isset($_POST['mood']) && !empty($_POST['mood'])){
        $whereClause .= " AND (";
        foreach($_POST['mood'] as $key=>$value){
            if($value==1) $mood[] = "`mood_english`='".$mysqli->real_escape_string($key)."'";
        }
        $whereClause .= implode(' OR ', $mood);
        $whereClause .= ")";
    }

    $query = "SELECT * FROM $tableName  WHERE ".$whereClause;//look for search term
    $result = $mysqli->query($query) or die($mysqli->error.__LINE__);//store result

    //--------------------------------------------------------------------------
    // 3) echo result as json
    //--------------------------------------------------------------------------

    $json = array();//create an array that will be returned
    if($result->num_rows > 0) {
        while($row = $result->fetch_array()) {
            $jsonrow = array (
                'id' => $row["verbID"],
                'infinitive' => $row["infinitive"],
                'infinitiveEnglish' => $row["infinitive_english"],
                'moodEnglish' => $row["mood_english"],
                'tenseEnglish' => $row["tense_english"],
                'verbEnglish' => $row["verb_english"],
                'form1s' => $row["form_1s"],
                'form2s' => $row['form_2s'],
                'form3s' => $row['form_3s'],
                'form1p' => $row['form_1p'],
                'form2p' => $row['form_2p'],
                'form3p' => $row['form_3p'],
                'gerund' => $row['gerund'],
                'pastparticiple' => $row['pastparticiple']
            );
            array_push($json, $jsonrow);
        }

        array_walk_recursive($json, 'specialCharacters');

        $jsonstring = json_encode($json);//convert to JSON format
        echo $jsonstring;
    }
    else {
        echo 'NO RESULTS';
    }

}

if (isset($_POST['randomsearch'])) {


    //--------------------------------------------------------------------------
    // 1) Connect to mysql database
    //--------------------------------------------------------------------------

    $mysqli = new mysqli($host, $user, $pass, $databaseName);//new connection

    if (mysqli_connect_errno()) {//if connection fails
        printf("Connect failed: %s\n", mysqli_connect_error());
        exit();
    }


    //--------------------------------------------------------------------------
    // 2) Query database for data
    //--------------------------------------------------------------------------

    $randomResult = $mysqli->query("SELECT infinitive FROM verbs ORDER BY RAND() LIMIT 1") or die($mysqli->error.__LINE__);
    if($randomResult->num_rows > 0) {
        while($row = $randomResult->fetch_array()) {
            $randomVerb = $row["infinitive"];
        }
    }

    $whereClause = "infinitive = '$randomVerb'";

    if(isset($_POST['mood']) && !empty($_POST['mood'])){
        $whereClause .= " AND (";
        foreach($_POST['mood'] as $key=>$value){
            if($value==1) $mood[] = "`mood_english`='".$mysqli->real_escape_string($key)."'";
        }
        $whereClause .= implode(' OR ', $mood);
        $whereClause .= ")";
    }

    $query = "SELECT * FROM $tableName  WHERE ".$whereClause;//look for search term
    $result = $mysqli->query($query) or die($mysqli->error.__LINE__);//store result

    //--------------------------------------------------------------------------
    // 3) echo result as json
    //--------------------------------------------------------------------------

    $json = array();//create an array that will be returned
    if($result->num_rows > 0) {
        while($row = $result->fetch_array()) {
            $jsonrow = array (
                'id' => $row["verbID"],
                'infinitive' => $row["infinitive"],
                'infinitiveEnglish' => $row["infinitive_english"],
                'moodEnglish' => $row["mood_english"],
                'tenseEnglish' => $row["tense_english"],
                'verbEnglish' => $row["verb_english"],
                'form1s' => $row["form_1s"],
                'form2s' => $row['form_2s'],
                'form3s' => $row['form_3s'],
                'form1p' => $row['form_1p'],
                'form2p' => $row['form_2p'],
                'form3p' => $row['form_3p'],
                'gerund' => $row['gerund'],
                'pastparticiple' => $row['pastparticiple']
            );
            array_push($json, $jsonrow);
        }

        array_walk_recursive($json, 'specialCharacters');

        $jsonstring = json_encode($json);//convert to JSON format
        echo $jsonstring;
    }
    else {
        echo 'NO RESULTS';
    }

}
?>