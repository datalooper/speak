<?php //check for index page ?>



<div class="top-bar-container contain-to-grid show-for-medium-up">
	<nav class="top-bar" data-topbar="">
		<a class="logo" href="<?php echo home_url(); ?>/"><img src="<?php echo bloginfo('template_directory');?>/assets/img/logo.png"/></a>
		<section class="cf top-bar-section">

			<?php foundationPress_top_bar_r(); ?>
					<div id="slinky"></div>

		</section>

	</nav>

</div>



<section class="container" role="document">
	<?php do_action('foundationPress_after_header'); ?>