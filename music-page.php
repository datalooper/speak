<?php
global $post;
$pageslug = get_post( $post )->post_name;
if ( $pageslug == "music" ) {
	?>
	<a class="docTitle" data-doctitle="<?php echo wp_title( ' | ', 'false', 'right' );
	bloginfo( 'name' ); ?>"></a>
	<div id="libraryContainer">

		<div class="header">
			<form id="search" action="#" method="post">
				<div id="label"><label for="search-terms" id="search-label">search</label></div>
				<div id="input"><input type="text" name="search-terms" id="search-terms"
				                       placeholder="Enter search terms..."></div>
			</form>
			<nav>
				<ul>
					<li><a href="#">Album</a></li>
					<li><a href="#">Songs</a></li>
					<li><a href="#">Nav 3</a></li>
					<li><a href="#">Nav 4</a></li>
				</ul>
			</nav>
		</div>
	</div>

<?php } ?>