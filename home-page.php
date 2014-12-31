
<?php 
  global $post;
  $pageslug = get_post( $post )->post_name;
  if($pageslug == "home"){

$youtubeInfo = json_decode(do_shortcode( '[smGetFeatureVideo]' )); 
$youtubeId = $youtubeInfo->ID;
$youtubeLink = "http://www.youtube.com/embed/".$youtube->ID."?version=3;hl=en_US;rel=0;modestbranding=1;enablejsapi=1;autohide=1;showinfo=0;controls=1;theme=light;";
$youtubeImgLink = "http://img.youtube.com/vi/".$youtube->ID."/maxresdefault.jpg";

$args = array(	
	'posts_per_page'   => -1,
    'num_posts'        => -1,
    'equipmenttype'    => 'microphones',
	'post_type'        => 'equipment'); 
$microphones = get_posts($args);

$args = array(
	'posts_per_page'   => -1,
    'num_posts'        => -1,
	'equipmenttype'    => 'pre-amps',
	'post_type'        => 'equipment',
	'post_status'      => 'publish'); 
$preamps = get_posts($args);

$args = array(
	'posts_per_page'   => 0,
    'num_posts'        => -1,
    'equipmenttype'    => 'instruments',
	'post_type'        => 'equipment',
	'post_status'      => 'publish'); 
$instruments = get_posts($args);

$args = array(
	'posts_per_page'   => 0,
	'offset'           => 0,
    'num_posts'        => -1,
    'equipmenttype'    => 'other',
	'orderby'          => 'post_date',
	'order'            => 'DESC',
	'post_type'        => 'equipment',
	'post_status'      => 'publish',
	'suppress_filters' => true ); 
$other = get_posts($args);
?>	
		
<?php do_action('foundationPress_before_content'); ?>
<a class="docTitle" data-doctitle="<?php bloginfo( 'name' ); echo ' | '; bloginfo( 'description' );?>"></a>	
<div id="content" class="content-wrap">

		<?php while (have_posts()) : the_post(); ?>
		<div id="featured-video" class="featured-video">
			<div id="youtube-player" data-ytid=<?php echo $youtubeId; ?>></div>
			<div id="firstFrame"><?php echo $youtubeInfo->firstframe; ?></div>
			<div class="videoOverlay">
				<img class="homeCircle" src="<?php echo get_template_directory_uri(); ?>/assets/img/homeCircle.png" />
				<h2><?php echo get_the_content(); ?></h2>
				<a href="#" class="button green-bg radius small">Watch Latest</a>

			</div>
		</div>



	<?php endwhile;?>

	<div id="section-2" class="mission section narrow">
		<h1 class="green-blue">Empowering Musicians to Create</h1>
		<p class="description">Speak Studios empowers musicians to turn a fleeting idea into a work of art. Our studio is co-operatively run by a group of creative individuals who have a passion for music and recording. We hope you enjoy our creations.</p>

			<ul class="circleCTAs cf">
				<li><a data-section="music" href="<?php echo get_permalink( get_page_by_title( 'music' ) );?>"><img src="<?php echo get_template_directory_uri(); ?>/assets/img/home-listen.png" alt="listen to music"/></li>
				<li><a data-section="members" href="<?php echo get_permalink( get_page_by_title( 'members' ) );?>"><img src="<?php echo get_template_directory_uri(); ?>/assets/img/home-members.png" alt="meet the members"/></a></li>
				<li><a href="#" class="home-connect"><img src="<?php echo get_template_directory_uri(); ?>/assets/img/home-connect.png" alt="stay connected"/></a></li>
			</ul>
			<?php chimpy_lite_form(); ?>
		</div>

		<div id="section-3" class="gallery section">
			<h1 class="purple">Our humble (but awesome) studio</h1>
			<div class="homeCarousel">
				<div><img src="<?php echo get_template_directory_uri(); ?>/assets/slideshow/home-overall-2.jpg" alt="Speak Studios Overall"/></div>
				<div><img src="<?php echo get_template_directory_uri(); ?>/assets/slideshow/home-rogers-2.jpg" alt="Speak Studios Rogers Kit"/></div>
				<div><img src="<?php echo get_template_directory_uri(); ?>/assets/slideshow/home-gobos.jpg" alt="Speak Studios Gobos"/></div>
				<div><img src="<?php echo get_template_directory_uri(); ?>/assets/slideshow/home-mixing.jpg" alt="Speak Studios Mixing Room"/></div>
				<div><img src="<?php echo get_template_directory_uri(); ?>/assets/slideshow/home-rogers.jpg" alt="Speak Studios Rogers Kit Again"/></div>
				<div><img src="<?php echo get_template_directory_uri(); ?>/assets/slideshow/home-overall-1.jpg" alt="Speak Studios Overall"/></div>
			</div>
		</div>

		<div id="section-4" class="section equipment ">
			<h1 class="green">The Goods</h1>
            <?php echo get_post_field('post_content', 3201); ?>
<!--			<ul class="headers">-->
<!--				<li class="selected"><a href="#microphones">Microphones</a></li>-->
<!--				<li><a href="#preamps">Pre-Amps</a></li>-->
<!--				<li><a href="#instruments">Instruments</a></li>-->
<!--				<li><a href="#other">Other</a></li>-->
<!--				<div class="underline"></div>-->
<!---->
<!--			</ul>-->
<!--			<ul id="microphones" class="small-block-grid-1 medium-block-grid-2 large-block-grid-3 selected equipment-type">-->
<!--				--><?php //foreach($microphones as $microphone){ ?>
<!--				<li>-->
<!--					<p class="title">--><?php //echo $microphone->post_title; ?><!--</p>-->
<!--				</li>-->
<!--				--><?php //}?>
<!--			</ul>-->
<!--			<ul id="preamps" class="small-block-grid-1 medium-block-grid-2 large-block-grid-3 equipment-type ">-->
<!--				--><?php //foreach($preamps as $preamp){ ?>
<!--				<li>-->
<!--					<p class="title">--><?php //echo $preamp->post_title; ?><!--</p>-->
<!--				</li>-->
<!--				--><?php //}?><!--  </ul>-->
<!--				<ul id="instruments" class="small-block-grid-1 medium-block-grid-2 large-block-grid-3 equipment-type ">-->
<!--					--><?php //foreach($instruments as $instrument){ ?>
<!--					<li>-->
<!--						<p class="title">--><?php //echo $instrument->post_title; ?><!--</p>-->
<!--					</li>-->
<!--					--><?php //}?><!-- -->
<!--				</ul>-->
<!--				<ul id="other" class="small-block-grid-1 large-block-grid-3 equipment-type ">-->
<!--					--><?php //foreach($other as $piece){ ?>
<!--					<li>-->
<!--						<p class="title">--><?php //echo $piece->post_title; ?><!--</p>-->
<!--					</li>-->
<!--					--><?php //}?><!-- -->
<!--				</ul>	-->
			</div> 
			<div id="home-footer" >
				<div class="footerOverlay">
					<h1>This is the end. My only friend, the end.</h1>
					<ul class="social-container">
						<li><a href="http://www.facebook.com/speakstudios" class="fb social"></a></li>
						<li><a href="" class="youtube social"></a></li>
						<li><a href="" class="instagram social"></a></li>
					</ul>
				</div>			
				<video width="100%" height="auto" autoplay loop>
					<source src="<?php echo get_template_directory_uri(); ?>/assets/video/loopingtape.mp4" type="video/mp4">
                    <source src="<?php echo get_template_directory_uri(); ?>/assets/video/loopingtape.ogg" type="video/ogg">
                    <source src="<?php echo get_template_directory_uri(); ?>/assets/video/loopingtape.webm" type="video/webm">

                    For the love of God, get a new browser!
					</video>

			</div>
	

				<?php do_action('foundationPress_after_content');  } ?>

