<?php
global $post;
$pageslug = get_post( $post )->post_name;
if ( $pageslug == "music" ) {
	?>
	<a class="docTitle" data-doctitle="<?php echo wp_title( ' | ', 'false', 'right' );
	bloginfo( 'name' ); ?>"></a>


	<div id="libraryContainer">
	</div>

<?php } ?>