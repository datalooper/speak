



<?php 
/* Template Name: Main Index */  ?>

<?php get_header(); ?>
<div id="ajaxLoader"><p>Loading Music Player</p><img src="<?php bloginfo('template_directory') ?>/assets/img/ajax-loader.gif"/></div>
 <div id="content-container" class="cf">
	<section class="page home">
		<?php get_template_part('home-page'); ?>
	</section>
	<section class="page members">
		<?php get_template_part('members-page'); ?>
	</section>
	<section class="page music">
		<?php get_template_part('music-page'); ?>
	</section>
	<section class="page participate">
		<?php get_template_part('participate-page'); ?>
	</section>
</div>

<?php get_footer(); ?>