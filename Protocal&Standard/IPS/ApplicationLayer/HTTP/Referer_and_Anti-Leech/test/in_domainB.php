<?php
	// header('Content-Type: image/jpeg');
	// echo file_get_contents($_GET['src']);

	$referer = $_SERVER['HTTP_REFERER'];

	if( $referer === 'domainB' ){
		header( "location: $_GET['img']" );
	}
	else{
		exit;
	}
?>
