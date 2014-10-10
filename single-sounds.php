<?php
/* Redirect browser, primarily for facebook and to hide our single song pages */
$location = get_permalink( get_page_by_title( 'Music' ) )."#".$post->post_name;
header("Location:".$location);

/* Make sure that code below does not get executed when we redirect. */
exit; ?>