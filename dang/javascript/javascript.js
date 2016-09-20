window.onload = function () {
    var oHtml=document.getElementsByTagName("html")[0];
    setRem();
    window.addEventListener("resize",setRem,false);
    window.addEventListener("orientationchange",setRem,false);
    function setRem(){
        var iWidth=oHtml.getBoundingClientRect().width;
        oHtml.style.fontSize=iWidth/27+"px";
    }

    var scroll = document.querySelectorAll('.scroll')[0];
    var scrollBox = document.querySelectorAll('.scrollBox')[0];
    var iW = scroll.clientWidth;
    var startX = 0;
    var transX = 0;
    var dots = document.querySelectorAll('.mask')[0].querySelectorAll('.dot');


    scrollBox.addEventListener('touchstart', function (ev) {
        var num = -transX/iW;
        if(num == 0) {
            num = dots.length;
        }
        if(num == dots.length*2 - 1) {
            num = dots.length - 1;
        }
        console.log(num)
        transX = -num*iW;
        scrollBox.style.webkitTransform = scrollBox.style.transform = 'translate3d('+(transX)+'px,0,0)';
        startPoint = ev.changedTouches[0].pageX;
        startX = transX;
        scrollBox.style.transition = "0ms";
        //console.log(startX);
    });


    scrollBox.addEventListener('touchmove', function (ev) {
        var nowPoint = ev.changedTouches[0].pageX;

        var disX = nowPoint - startPoint;

        transX = startX + disX;
        scrollBox.style.webkitTransform = scrollBox.style.transform = 'translate3d('+(transX)+'px,0,0)';
    });
    scrollBox.addEventListener('touchend', function (ev) {
        var num = Math.round(-transX/iW);
        scrollBox.style.transition = "500ms";
        transX = -num*iW;
        //console.log(num);
        scrollBox.style.webkitTransform = scrollBox.style.transform = 'translate3d('+(transX)+'px,0,0)';
            for(var i=0;i<dots.length;i++){
            dots[i].className = 'dot';
        }
        dots[num% dots.length].className = "dot active";
    });

    //计时器
    var tTime = new Date(new Date().getTime()+10000000).getTime();
    var timer0 = null;
    var clock = document.querySelectorAll('.timer')[0];
    var number = clock.querySelectorAll('.number');
    timer0 = setInterval(function () {
        var nTime = new Date().getTime();
        var disTime = Math.round((tTime - nTime)/1000);
        var disH = parseInt((disTime%86400)/3600);
        var disM = parseInt((disTime%3600)/60);
        var disS = parseInt(disTime%60);
        var str = toDouble(disH) + toDouble(disM) + toDouble(disS);
        console.log(str);
        for(var i=0;i<number.length;i++){
            number[i].innerHTML = str.charAt(i);
        }
    },1000)

    function toDouble(n){
        return n = n < 10? '0' + n : '' + n;
    }



    var banner = document.querySelectorAll('.banner')[0];
    var bannerBox = banner.querySelectorAll('.bannerBox')[0];
    var imgs = bannerBox.querySelectorAll('a');
    var mask = banner.querySelectorAll('.mask')[0];
    var dot2s = mask.querySelectorAll('.dot');
    var nub = 0;
    var timer = null;
    var zIndex = 2;
    console.log(imgs.length)
    imgs[0].style.zIndex = zIndex;

    timer = setInterval(play,1500);
    function play(){
        imgs[nub%imgs.length].style.opacity = 0;
        dot2s[nub%imgs.length].className = 'dot';
        nub++;
        zIndex++;
        imgs[nub%imgs.length].style.zIndex = zIndex;
        imgs[nub%imgs.length].style.opacity = 1;
        dot2s[nub%imgs.length].className = 'dot active';
    }
}