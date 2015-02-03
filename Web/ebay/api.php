<?php
header('Content-Type: application/json; charset=utf-8');
include('simple_html_dom.php');

$pagenum = 1;
if(isset($_GET["page"])){
	$pagenum = $_GET["page"];
}
$city = "regensburg";
if(isset($_GET["city"])){
	$city = $_GET["city"];
}

$BASEURL = "http://kleinanzeigen.ebay.de";

function loadHTML($url){
	$html = file_get_html($url);
	return $html;
}

function findSales($html){
	$result = array();
	foreach($html->find('li.ad-listitem') as $e)
    	$result[] = $e;
    return $result;
}

class Article{ 
	public $name="";
	public $description="";
	public $location="";
	public $time="";
	public $image="";
	public $url="";
}

function convertMatchToObject($sale){
	global $BASEURL;
	$article = new Article();
	
	// find image url
	$image = $sale->find('a.srpimagebox');
	if(array_key_exists("data-imgsrc", $image[0]->attr)){
		$article->image = str_replace("\$_9", "\$_72", $image[0]->attr["data-imgsrc"]);
	}

	// find name and url
	$title = $sale->find('a.ad-title');
	if(array_key_exists("href", $title[0]->attr)){
		$article->url = $BASEURL.$title[0]->attr["href"];
	}
	$article->name = $title[0]->innertext;

	// find description
	$text = $sale->find('.ad-listitem-main p');
	$description = "";
	for($i=0; $i<count($text)-1; $i++){
		$txt = $text[$i];
		$description .= $txt->innertext;
	}
	$article->description = $description;

	// find time
	$article->time = trim($sale->find('.ad-listitem-addon')[0]->innertext);

	// find location
	$article->location = str_replace("<br>", " ", $sale->find('.ad-listitem-location')[0]->innertext);

	return $article;
}

$page = "";
if($pagenum > 1){
	$page = "/seite:".$pagenum;
}

$url = $BASEURL."/anzeigen/s-zu-verschenken/$city$page/c192l7636";
$content = loadHTML($url);
$sales = findSales($content);
$articles = array();
foreach($sales as $sale){
	$obj = convertMatchToObject($sale);
	$articles[] = $obj;
}

$result = array();
$result["page"]=$pagenum;
$result["count"]=count($articles);
$result["data"]=$articles;
$result["city"]=$city;
echo json_encode($result, JSON_UNESCAPED_UNICODE);

?>