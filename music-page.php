<?php
global $post;
$pageslug = get_post( $post )->post_name;
if ( $pageslug == "music" ) {
	?>
	<a class="docTitle" data-doctitle="<?php echo wp_title( ' | ', 'false', 'right' );
	bloginfo( 'name' ); ?>"></a>


	<div id="libraryContainer">
        <div id="featured"></div>

        <div class="header filter">
            <input type="text" name="search-terms" class="search" placeholder="Filter">

            <nav class="sorting">
                <ul>
                    <li><a href="#">Artist</a></li>
                    <li><a class="active" href="#">Songs</a></li>
                </ul>
            </nav>
			<div class="genres">
				<span><input type="checkbox"/><p>Rock</p></span>
				<span><input type="checkbox"/><p>Folk</p></span>
				<span><input type="checkbox"/><p>Reggae</p></span>
				<span><input type="checkbox"/><p>Psych</p></span>
				<span><input type="checkbox"/><p>Alternative</p></span>

			</div>

		</div>

	</div>

<?php } ?>