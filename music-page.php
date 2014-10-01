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

			<div class="genres">
				<span><input type="checkbox"/><p>Rock</p></span>
				<span><input type="checkbox"/><p>Folk</p></span>
				<span><input type="checkbox"/><p>Reggae</p></span>
				<span><input type="checkbox"/><p>Psych</p></span>
				<span><input type="checkbox"/><p>Alternative</p></span>

			</div>
			<nav class="sorting">
				<ul>
					<li><a href="#">Artist</a></li>
					<li><a class="active" href="#">Songs</a></li>
				</ul>
			</nav>
		</div>

	</div>

<?php } ?>