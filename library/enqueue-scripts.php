<?php
if (!function_exists('FoundationPress_scripts')) :
    function FoundationPress_scripts() {

        // deregister the jquery version bundled with wordpress
        wp_deregister_script( 'jquery' );

        // register scripts
        wp_register_script( 'modernizr', get_template_directory_uri() . '/js/modernizr/modernizr.min.js', array(), '1.0.0', false );
        wp_register_script( 'jquery', get_template_directory_uri() . '/js/jquery/dist/jquery.min.js', array(), '1.0.0', false );
        wp_register_script( 'foundation', get_template_directory_uri() . '/js/app.js', array('jquery'), '1.0.0', true );
        wp_register_script( 'sticky', get_template_directory_uri() . '/js/jquery.sticky.js', array('jquery'), '1.0.0', true );
        wp_register_script( 'slick', '//cdn.jsdelivr.net/jquery.slick/1.3.7/slick.min.js', array(), '1.0.0', true );
        wp_register_script( 'custom-scrollbar', get_template_directory_uri() . '/js/jquery.mCustomScrollbar.concat.min.js', array('jquery'), '1.0.0', true );
        wp_register_script( 'sketch', get_template_directory_uri() . '/js/sketch.min.js', array('jquery'), '1.0.0', true );
        wp_register_script( 'transit', get_template_directory_uri() . '/js/jquery.transit.min.js', array('jquery'), '1.0.0', true );
        wp_register_script( 'handlebars', get_template_directory_uri() . '/js/handlebars.runtime-v2.0.0.js', array('jquery'), '1.0.0', true );
        wp_register_script( 'handlebars-templates', get_template_directory_uri() . '/js/templates.js', array('jquery'), '1.0.0', true );
        wp_register_script( 'list', get_template_directory_uri() . '/js/list.min.js', array('jquery'), '1.0.0', true );

        // enqueue scripts
        wp_enqueue_script('modernizr');
        wp_enqueue_script('jquery');
        wp_enqueue_script('jquery-ui-sortable');
        wp_enqueue_script('jquery-ui-tabs');
        wp_enqueue_script('jquery-ui-slider');
        wp_enqueue_script('custom-scrollbar');
        wp_enqueue_script('sketch');
        wp_enqueue_script('handlebars');
        wp_enqueue_script('handlebars-templates');
        wp_enqueue_script('list');

        wp_enqueue_script('transit');
        wp_enqueue_script('foundation');
        wp_enqueue_script('sticky');
        wp_enqueue_script('slick');
        wp_enqueue_script( 'custom', get_template_directory_uri() . '/js/custom.js', array(), '1.0.0', true );


    }

    add_action( 'wp_enqueue_scripts', 'FoundationPress_scripts' );
endif;

function kitchensink_scripts() {
    if ( is_page_template('kitchen-sink.php') ) {

        wp_enqueue_script( 'kitchen-sink', get_template_directory_uri() . '/js/kitchen-sink.js', array('jquery'), '1.0.0', true );

    }
}

add_action( 'wp_enqueue_scripts', 'kitchensink_scripts' );

// Add the JS
function theme_name_scripts() {
    wp_localize_script( 'foundation', 'MyAjax', array(
        // URL to wp-admin/admin-ajax.php to process the request
        'ajaxurl' => admin_url( 'admin-ajax.php' ),

        // generate a nonce with a unique ID "myajax-post-comment-nonce"
        // so that you can check it later when an AJAX request is sent
        'security' => wp_create_nonce( 'my-special-string' )
    ));
}
add_action( 'wp_enqueue_scripts', 'theme_name_scripts' );

?>