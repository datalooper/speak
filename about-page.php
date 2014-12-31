<?php 
global $post;
$pageslug = get_post( $post )->post_name;
if($pageslug == "about"){
  	//do stuff ?>
  <a class="docTitle" data-doctitle="<?php echo wp_title( ' | ', 'false', 'right' ); bloginfo( 'name' ); ?>"></a>
    <div class="row ">
        <div class="large-12 small-12 column">
            <h1>What is Speak?</h1>
            <p>Speak Studios is a co-operative music studio, focused on growing a community of musicians and engineers who can share both the cost and benefit of running a professional music studio. </p>
        </div>
    </div>
    <div class="row ">
        <div class="large-12 small-12 column">
            <h1>How does Speak work?</h1>
            <p>Let's say you are in a band that wants to record an album. You have a vision of what you want the final product to sound like and you've done a bit of home recording before, but you don't have the budget to buy all of the equipment you really need to record a professional album. You could book time at a tradional music studio, but in general, this ends up being extremely expensive and you don't really get to make many creative or informed decisions about the overall color of your final recording. Often times, the engineer throws up their default set up that they know will sound 'clean and accurate', and you end up with clean, accurate recordings that have none of the original sonic color that you initially envisioned. </p>        </div>
    </div>

    <div class="large-5 hide-for-small column">
            <img src="<?php echo bloginfo('template_directory'); ?>/assets/img/aboutArt.png" />
        </div>

            <!--    --><?php //while (have_posts()) : the_post(); ?>
<!--        <article --><?php //post_class() ?><!-- id="post---><?php //the_ID(); ?><!--">-->
<!--            <header>-->
<!--                <h1 class="entry-title">--><?php //the_title(); ?><!--</h1>-->
<!--            </header>-->
<!--            --><?php //do_action('foundationPress_post_before_entry_content'); ?>
<!--            <div class="entry-content">-->
<!--                --><?php //the_content();  ?>
<!---->
<!--            </div>-->
<!---->
<!--        </article>-->
<!--    --><?php //endwhile;?>

    </div>
<?php 
}
?>