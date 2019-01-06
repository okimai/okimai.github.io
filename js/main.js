$(function () {

    function photoChange(photolist) {
        var photos = photolist.find("li");
        var current = 0;

        function open() {
//			alert("#photolist is "+photolist);
//			alert("photos is "+photos);
//			alert("photos[current] is "+photos[current]);
//			alert("$(photos[current]) is "+$(photos[current]));
            $(photos[current]).fadeIn(1200, "easeInQuad", function () {
                setTimeout(change, 1500);
            });
        }

        function close() {
            $(photos[current]).fadeOut(1200, "easeOutQuad");
        }

        function change() {
            close();
            current = ++current % photos.length;
            open();
        }

        open();
    }

    photoChange($("#photolist"));

    function init(target) {

        var current = 0;
        var size = target.find("li").length;
        var width = 139;
        var prevButton = $(target.find(".fa-angle-left"));
        var nextButton = $(target.find(".fa-angle-right"));
        var ul = target.find("ul");

        function init() {
            prevButton.on("click", function () {
                current = --current < 0 ? current + 4 : current;
                ul.stop().animate({"left": -width * current}, 1200, "easeOutQuad");
            });
            nextButton.on("click", function () {
                current = ++current % size;
                ul.stop().animate({"left": -width * current}, 1200, "easeInOutQuad");
            });
        }

        init();
    }

    init($("#button-demo"));

    function initThumbnail(target, autoPlay) {
        var mains = target.find("ul.main li");
        var size = mains.length;
        var main = target.find("ul.main");
        var thumbnails = target.find("ul.thumbnail li");
        var current = 0;
        var interval = 4000;
        var timer;

        $(thumbnails).each(function (index) {
            $(this).on("click", function () {
                show(index);
            })
        });

        function show(index) {
            if (index != current) {
                // alert("index:" + index + " and current:" + current);
                $(thumbnails[current]).stop().animate({"opacity": 0.7}, 200, "easeOutQuad");
                $(thumbnails[index]).stop().animate({"opacity": 1}, 200, "easeInOutQuad");
                $(mains[current]).stop().fadeOut(1200, "easeOutQuad");
                $(mains[index]).stop().fadeIn(1200, "easeInOutQuad");
                current = index;
                if(autoPlay){
                    clearTimeout(timer);
                    timer = setTimeout(change, interval);
                }
            }
        }

        function change() {
            var index = (current + 1) % size;
            show(index);
        }

        if(autoPlay){
            timer = setTimeout(change, interval);
        }
    }

    initThumbnail($("#thumbnail-demo"), true);
});
