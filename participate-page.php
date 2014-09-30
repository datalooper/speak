 <?php 
 global $post;
 $pageslug = get_post( $post )->post_name;
 if($pageslug == "participate"){ ?>

 <a class="docTitle" data-doctitle="<?php echo wp_title( ' | ', 'false', 'right' ); bloginfo( 'name' ); ?>"></a>
 <div class="header"><h2><?php echo get_the_excerpt(); ?></h2></div>

 <div class="row">
 	<div class="large-6 columns">
 		<h2 class="section">Membership</h2>
 		<p>Our cooperative studio is built to create art. 
 			Members get access to inexpensive studio rates,
 			open access to unbooked studio hours and join a
 			community of people dedicated to crafting music.</p>
 			<h2 class="section">Contact</h2>
 			<p><span>Email</span><a href="mailto:info@speakstudios.org">info@speakstudios.org</a></p>
 			<p><span>Phone</span>805-234-8357</p>
 			<h2 class="section">Connect</h2>
 			<ul class="social-container">
						<li><a href="" class="fb social"></a></li>
						<li><a href="" class="youtube social"></a></li>
						<li><a href="" class="instagram social"></a></li>
					</ul>
 		</div>
 		<div class="large-6 columns">
 			<h2 class="section">Mailing List</h2>
 			<p>Join our mailing list if you are interested in receiving 
 				tracks and to be notified when we have events.</p>
 							<?php chimpy_lite_form(); ?>

 				<h2 class="section">Rates</h2>
 				<p class="rateDesc">hourly rate with engineer
 					<br/>(no membership required)</p>
 				<p class="rate">$35/hr</p>
				<p class="rateDesc">one time membership fee</p>
				<p class="rate">$75</p>
				<p class="rateDesc">Hourly rate without engineer	
					<br/>(Membership required)</p>
					<p class="rate">$15-25/hr</p>
 					</div>
 				</div>
 				<?php } ?>