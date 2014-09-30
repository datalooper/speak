<?php
/*
Author: Ole Fredrik Lie
URL: http://olefredrik.com
*/

// Various clean up functions
require_once('library/cleanup.php'); 

// Required for Foundation to work properly
require_once('library/foundation.php');

// Register all navigation menus
require_once('library/navigation.php');

// Add menu walker
require_once('library/menu-walker.php');

// Create widget areas in sidebar and footer
require_once('library/widget-areas.php');

// Return entry meta information for posts
require_once('library/entry-meta.php');

// Enqueue scripts
require_once('library/enqueue-scripts.php');

// Add theme support
require_once('library/theme-support.php');

add_filter('body_class','add_body_class');
add_action( 'init', 'create_post_type' );
add_action( 'init', 'create_equipment_taxonomies', 0 );
add_action('init', 'add_page_excerpt');
add_action('wp_footer', array('ChimpyLite', 'print_frontend_scripts_and_styles'));

function add_page_excerpt() {
	add_post_type_support( 'page', 'excerpt' );
}
function add_body_class(){
      //get current page name, useful for loading content later on.
      global $post;
      $classes[] = $post->post_name;
      return $classes;
}
function create_post_type() {
	register_post_type( 'equipment',
		array(
			'labels' => array(
				'name' => __( 'Equipment' ),
				'singular_name' => __( 'Equipment' )
			),
		'public' => true,
		'has_archive' => true,
		'supports'           => array( 'title', 'editor', 'thumbnail', 'excerpt'),
		)
	);
}

function add_equipment_link_meta(){
	   add_meta_box( 'equipment_link', "Equipment Link", 'equipment_link_callback', 'equipment');
}
add_action( 'add_meta_boxes', 'add_equipment_link_meta' );

/**
 * Prints the box content.
 * 
 * @param WP_Post $post The object for the current post/page.
 */
function equipment_link_callback( $post ) {

	// Add an nonce field so we can check for it later.
	wp_nonce_field( 'equipment_link', 'equipment_link_nonce' );

	/*
	 * Use get_post_meta() to retrieve an existing value
	 * from the database and use the value for the form.
	 */
	$value = get_post_meta( $post->ID, 'equipment_link', true );

	echo '<label for="equipment_link">';
	_e( 'Enter Link to Product Page, for example: http://www.demeteramps.com/preamps/VTMP.html', 'myplugin_textdomain' );
	echo '</label><br/>';
	echo '<input type="text" id="equipment_link" name="equipment_link" value="' . esc_attr( $value ) . '" size="45" />';
}

/**
 * When the post is saved, saves our custom data.
 *
 * @param int $post_id The ID of the post being saved.
 */
function equipment_link_save_meta_box_data( $post_id ) {

	/*
	 * We need to verify this came from our screen and with proper authorization,
	 * because the save_post action can be triggered at other times.
	 */

	// Check if our nonce is set.
	if ( ! isset( $_POST['equipment_link_nonce'] ) ) {
		return;
	}

	// Verify that the nonce is valid.
	if ( ! wp_verify_nonce( $_POST['equipment_link_nonce'], 'equipment_link' ) ) {
		return;
	}

	// If this is an autosave, our form has not been submitted, so we don't want to do anything.
	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
		return;
	}

	// Check the user's permissions.
	if ( isset( $_POST['post_type'] ) && 'page' == $_POST['post_type'] ) {

		if ( ! current_user_can( 'edit_page', $post_id ) ) {
			return;
		}

	} else {

		if ( ! current_user_can( 'edit_post', $post_id ) ) {
			return;
		}
	}

	/* OK, it's safe for us to save the data now. */
	
	// Make sure that it is set.
	if ( ! isset( $_POST['equipment_link'] ) ) {
		return;
	}

	// Sanitize user input.
	$my_data = sanitize_text_field( $_POST['equipment_link'] );

	// Update the meta field in the database.
	update_post_meta( $post_id, 'equipment_link', $my_data );
}
add_action( 'save_post', 'equipment_link_save_meta_box_data' );

function create_equipment_taxonomies(){
// Add new taxonomy, make it hierarchical (like categories)
	$labels = array(
		'name'              => _x( 'Equipment Types', 'taxonomy general name' ),
		'singular_name'     => _x( 'Equipment Type', 'taxonomy singular name' ),
		'search_items'      => __( 'Search Equipment Types' ),
		'all_items'         => __( 'All Equipment Types' ),
		'parent_item'       => __( 'Parent Equipment Type' ),
		'parent_item_colon' => __( 'Parent Equipment Type:' ),
		'edit_item'         => __( 'Edit Equipment Type' ),
		'update_item'       => __( 'Update Equipment Type' ),
		'add_new_item'      => __( 'Add New Equipment Type' ),
		'new_item_name'     => __( 'New Equipment Type Name' ),
		'menu_name'         => __( 'Equipment Type' ),
	);

	$args = array(
		'hierarchical'      => true,
		'labels'            => $labels,
		'show_ui'           => true,
		'show_admin_column' => true,
		'query_var'         => true,
		'rewrite'           => array( 'slug' => 'equipmenttype' ),
	);

	register_taxonomy( 'equipmenttype', array( 'equipment' ), $args );


	}
?>