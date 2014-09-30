<?php 
global $post;
$pageslug = get_post( $post )->post_name;
if($pageslug == "members"){

  	//do stuff ?>
  <a class="docTitle" data-doctitle="<?php echo wp_title( ' | ', 'false', 'right' ); bloginfo( 'name' ); ?>"></a>
  
	<ul class="small-block-grid-1 large-block-grid-2 xlarge-block-grid-4">
		
  	<?php   	
  	foreach(get_users() as $user){ ?>
  	<li class="user <?php echo $user->id; ?>">
  		<div class="userImg">
  			<img src="<?php echo get_cupp_meta($user->id, 'full'); ?>"/>
  		</div>
  		<div class="userInfo">
  			<h2 class="userName left"><?php echo get_the_author_meta('first_name',$user->id)." ".get_the_author_meta('last_name',$user->id); ?> <span class="userNickname"><?php echo get_the_author_meta( 'nickname', $user->id );?></span></h2>
  			<a href="#" class="userMore right"></a>
  			<a href="#" class="userLess right"></a>
  		</div>
  		<div class="fullInfo">
  			<p class="userBio small"><?php echo get_the_author_meta( 'description', $user->id );?></p>
  		</div>
  	</li> 
  	<?php 

  } ?>
	
	</ul>	
<?php 
}
?>