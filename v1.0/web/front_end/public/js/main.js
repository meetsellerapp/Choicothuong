/**
 *  App     : Game App 
 *  Auth    : leeseawuyhs
 */

var WEPAPP = {};

WEPAPP.Slider = {
    slick: function (element, prev, next) {
        $(element).slick({
            dots: true,
            infinite: true,
            vertical: true,
            speed: 300,
            slidesToShow: 3,
            slidesToScroll: 3,
            //centerMode: true,
            prevArrow: $('.prev'),
            nextArrow: $('.next'),
            appendDots: '.game-slick-slide .slick-dots-ctr'
        });

        /* style paginate */
        var slickCtr = $('div.game-slick-slide div.slick-ctr div.slick-dots-ctr');
        var slickCtrHeight = $('.game-slick-slide .slick-list').height();

        var totalPage = slickCtr.find('ul.slick-dots li').length;
        //console.log(totalPage);
        var paginateItemHeight = 20;
        var nextPrevHeight = 25;
        var slickLiHeight = Math.round((slickCtrHeight - (nextPrevHeight * 2)) / (totalPage));
        slickCtr.find('ul.slick-dots li').css({
            'height': Math.round(slickLiHeight),
            'padding-top': Math.round((slickLiHeight - paginateItemHeight) / 2)
        });

        /* Resize window */
        $(window).bind("resize", updateSizes_vat).bind("load", updateSizes_vat);
        function updateSizes_vat() {
            $(element).trigger("updateSizes");
        }
        updateSizes_vat();
    }
};

WEPAPP.Modal = {
    closeDialog: function (obj) {
        $(obj).removeClass('modal-open');
        $(obj).closest('.modal').fadeOut();
        $(obj).closest('.modal').removeClass('modal-open');
        if ($('body').find('.modal.modal-open').length < 1) {
            this.hideBackdrop();
        }
        return false;
    },
    showBackdrop: function () {
        $('.modal-backdrop').fadeIn();
        $('.modal-backdrop').css('height', $(document).height());
//        if (!$('body').hasClass('modal-dialog-show')) {
//            $('body').addClass('modal-dialog-show').addClass('modal-open');
//        }
    },
    hideBackdrop: function () {
        $('.modal-backdrop').fadeOut();
//        if ($('body').hasClass('modal-dialog-show')) {
//            $('body').removeClass('modal-dialog-show').removeClass('modal-open');
//        }
    },
    alert: function (options) {
        this.showBackdrop();
        var obj = $(options.obj);
        if (typeof options.title !== "undefined" && options.title !== '') {
            options.content = '<h2 class="modal-title"><span>' + options.title + '</span></h2>' + options.content;
        }
        obj.find('.modal-body-content').html(options.content);
        this.alertPosition(options.obj);
        obj.addClass('modal-open');
        obj.fadeIn();
    },
    alertPosition: function (modalElement) {
        var obj = $(modalElement);
        var sidebarWidth = $('.sidebar').width();
        var windowWidth = $(window).width();
        var contentWith = obj.find('.modal-dialog').width();
        obj.find('.modal-dialog').css({
            'margin-top': 100,
            'margin-left': (windowWidth - sidebarWidth - contentWith) / 2 + sidebarWidth
        });

    },
    fullViewDialog: function (modalElement) {
        this.showBackdrop();
        var obj = $(modalElement);
        if (obj.attr('data-view') !== "undefined" && obj.attr('data-view') === 'full-view') {
            this.resize(modalElement);
        }
        $(modalElement).addClass('modal-open');
        $(modalElement).fadeIn();
    },
    resize: function (modalElement) {
        var obj = $(modalElement);
        var sidebarWidth = $('.sidebar').width() + 20;
        var windowHeight = $(window).height();
        var windowWidth = $(window).width();
        obj.find('.modal-dialog').css({
            height: windowHeight,
            width: windowWidth - sidebarWidth - 25,
            'margin-left': sidebarWidth
        });
        obj.find('.modal-dialog .modal-body-content').css({
            height: windowHeight - 30
        });
    }

};

jQuery(document).ready(function () {
    /* Init scroll slider */
    WEPAPP.Slider.slick('.game-slick-slide .slick-slide-wrapper');

    /* Show add coin form */
    $('a.add-coin-event').click(function () {
        WEPAPP.Modal.fullViewDialog('#diaLogModal');
    });

    /* Rezise window */
    jQuery(window).resize(function () {
        WEPAPP.Modal.resize('#diaLogModal');
    });

    /* On submit add coin form */
    jQuery('.btn-add').click(function () {
        var content = '<div class="text-center"><h4>Thông báo</h4> <p>Quý khách đã nạp thẻ <strong style="color: red;">100.000vnđ</strong> thành công</br/> và nhận được <strong style="color: red;">1.000 Coins</strong></p></div>';
        WEPAPP.Modal.alert({
            obj: '#diaLogAlertModal',
            content: content
        });
    });

    /* Handle tab event */
    jQuery('.tab-events-event, .tab-login-event').click(function () {
        var content = '<div class="text-center"><p>Coming soon...</p></div>';
        WEPAPP.Modal.alert({
            obj: '#diaLogAlertModal',
            content: content,
            title: 'Message'
        });
        return false;
    });

    /* Handle click on Lien He tab */
    jQuery('.tab-contact-event').click(function () {
        var content = '<div>'
                + '<h4>Liên hệ:</h4>'
                + '<p style="font-style: italic;">kinhdoanh_megastar@gmail.com</p>'
                + '<p style="font-style: italic;">www.facebook.com/choicothuongchamcom</p>'
                + '<h4>Góp ý:</h4>'
                + '<p style="font-style: italic;">feedback_megastar@gmail.com</p>'
                + '</div>';
        WEPAPP.Modal.alert({
            obj: '#diaLogAlertModal',
            content: content,
            title: 'LIÊN HỆ'
        });
        return false;
    });
});