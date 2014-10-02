/** Custom JS for Speak Studios **/


body = $('body');

$(document).on('ajax-navigation', function () {
    if (checkPage() == "music") {
        SpeakPlayer.init($('#libraryContainer'), $('#playerContainer'), $('#playlistContainer'));
    }
    checkPage();
    checkHome();
});
$(document).on('no-ajax-navigation', function () {
    checkPage();
});
body.on('click', '.top-bar-menu a', function () {
    $('.top-bar-menu li').removeClass('active');
    $(this).parent('li').addClass('active');

});

$(document).ready(function () {
    screenWindow = $(window);
    homeTopBarContainer = $('.homeNavWrap');
    checkPage();
    checkHome();
});

body.on('click', '.userMore', function () {
    var el = $(this);
    var user = el.closest('.user');
    var userInfo = user.find('.fullInfo');
    el.hide();
    el.next('.userLess').show();
    userInfo.addClass('active');
    user.addClass('active');
});
body.on('click', '.userLess', function () {
    var el = $(this);
    var user = el.closest('.user');
    var userInfo = user.find('.fullInfo');
    el.hide();
    el.prev('.userMore').show();
    userInfo.removeClass('active');
    user.removeClass('active');
});

function checkPage() {

    var activeNav = $('.top-bar-menu li.active a'), slinky = $('#slinky');
    pageName = body.attr('class');

    //fades out visualizer
    $('canvas').removeClass('opaque');
    if (pageName != "home" && homeTopBarContainer.hasClass('transparent')) {
        homeTopBarContainer.removeClass('transparent');
    } else if (pageName == "home") {
        checkScroll();
    } else if (pageName == "music") {
        player.libraryContainer.removeClass('transparent');
    }

    //animates slinky

    slinky.css({
        'width': activeNav.width(),
        'left': activeNav.position().left
    });

    return pageName;
}

function checkHome() {
    if (pageName == "home") {
        setupHome();
    }
}
function setupHome() {
    circleCTAs = $('.circleCTAs img');
    circleCTAs.addClass('animated');
    setupHomeCarousel();
    setupEquipmentSection();
}


$(window).scroll(function () {
    if (pageName == "home") {
        checkScroll();
    }
});
function checkScroll() {
    if (screenWindow.scrollTop() > 300 && homeTopBarContainer.hasClass('transparent')) {
        homeTopBarContainer.removeClass('transparent');
        circleCTAs.removeClass('animated');
    } else if (screenWindow.scrollTop() < 300 && !homeTopBarContainer.hasClass('transparent')) {
        homeTopBarContainer.addClass('transparent');
    }
}
//Mailing list show/hide
body.on("click", ".circleCTAs .home-connect", function () {
    hideShowMailingForm();
    return false;
});

body.on("click", ".chimpy_lite_custom_css .exitForm", function () {
    hideShowMailingForm();
    return false;
});
function hideShowMailingForm() {
    var signupForm = $('.chimpy_lite_signup_form');
    if (signupForm.hasClass('active')) {
        signupForm.removeClass('active');
    } else {
        signupForm.addClass("active");
        setTimeout(function () {
            $('html, body').animate({
                scrollTop: $('.circleCTAs').offset().top
            }, 500);
        }, 500);

    }
}
function setupHomeCarousel() {
    $('.homeCarousel').slick({
        infinite: true,
        speed: 300,
        slidesToShow: 3,
        touchMove: false,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 737,
                settings: {
                    slidesToShow: 1
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1
                }
            }
        ],
        onBeforeChange: function () {
            selectCenterSlide(2);

        },
        onAfterChange: function () {
            selectCenterSlide(1);

        },
        onInit: function () {
            selectCenterSlide(1);
        }
    });

}

function selectCenterSlide(selector) {
    var slides = $('.slick-slide');
    slides.removeClass("focused");
    var index = $('.slick-active').eq(selector).attr("index");
    $('div[index="' + index + '"]').each(function () {
        $(this).addClass('focused');
    });
}


function setupEquipmentSection() {
    moveEquipmentHeaderLine();

    var headers = $('.headers');

    headers.on("click", 'li', function () {
        var el = $(this);
        headers.find('li').removeClass('selected');
        el.addClass("selected");
        $('.equipment-type').removeClass('selected');
        $(el.find('a').attr('href')).addClass('selected');
        moveEquipmentHeaderLine();

        return false;
    });
}

function moveEquipmentHeaderLine() {
    var underline = $('.equipment .underline');
    var selector = $('.equipment .headers li');
    var selectedType = $('.equipment .headers .selected');
    var selectedIndex = selectedType.index();
    var selectedLeft = 0;
    for (x = 0; x <= selectedIndex; x++) {
        var el = selector.eq(x);
        selectedLeft += parseInt(el.css('margin-left'));

        if (x != selectedIndex) {
            selectedLeft += el.width() + parseInt(el.css('margin-right'));
        }
    }
    var selectedWidth = selectedType.width();
    underline.css({"margin-left": selectedLeft, "width": selectedWidth});
}

/** YOUTUBE HOME PAGE FEATURE **/

// Inject YouTube API script
var tag = document.createElement('script');
tag.src = "//www.youtube.com/player_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var ytplayer;

function onYouTubePlayerAPIReady() {
    // create the global player from the specific iframe (#video)
    var youtubeId = $('#youtube-player').data("ytid");
    ytplayer = new YT.Player('youtube-player', {
        height: '390',
        width: '640',
        videoId: youtubeId,
        playerVars: {
            controls: 1,
            autohide: 1,
            showinfo: 0,
            modestbranding: 1,
            wmode: "opaque"
        },
        events: {
            'onReady': onPlayerReady,
        }
    });
}

function onPlayerReady(event) {
    // bind events


    var videoOverlayButton = $('.videoOverlay .button');
    videoOverlayButton.on("click", function () {
        videoOverlayButton.fadeOut();
        $('#firstFrame').fadeOut();
        $('.videoOverlay').fadeOut();
        ytplayer.playVideo();
        return false;
    });

}




