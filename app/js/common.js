$(function() {
	//===== Fixed header =====//
	function headerFixed() {
		var t = $('.site-header-topbar').outerHeight();
		var c = $('.site-header-content').outerHeight();
		var scr = $('html, body').scrollTop();

		if ( scr > t ) {
			$('body').addClass('header-fixed');
			$('.site-header').css('padding-bottom', c + 'px');
		} else {
			$('body').removeClass('header-fixed');
			$('.site-header').css('padding-bottom', '0');
		}
	}
	headerFixed();

	//===== Nav menu =====//
	function menuIn() {
		$('body').addClass('menu-on');
	}

	function menuOut() {
		$('body').removeClass('menu-on');
	}

	$('#cat-btn, .nav-close').on('click', function(e) {
		e.preventDefault();

		if ( $('body').hasClass('menu-on') ) {
			menuOut();
		} else {
			menuIn();
		}
	});

	//===== Popup =====//
	//Function popup In
	function popupIn(el) {
		var b = $('body');
		var elem = $(el);
		var padL = window.innerWidth - document.body.clientWidth;

		b.addClass('popup-on');
		b.attr( 'style', 'margin-right: ' + padL + 'px' );
		elem.addClass('active');

		setTimeout (function() {
			elem.addClass('visible');
		}, 50);
	}

	//Function popup Out
	function popupOut(el, timeOut) {
		var b = $('body');
		var elem = $(el);

		elem.removeClass('visible');

		setTimeout (function() {
			b.removeClass('popup-on');
			b.attr( 'style', '' );

			elem.removeClass('active');
		}, timeOut);
	}

	//Function popup Out for All
	function popupOutAll(timeOut) {
		var b = $('body');

		$('.popup').each( function(e) {
			$(this).removeClass('visible');

			setTimeout (function() {
				$(this).removeClass('active');
			}, timeOut);
		});

		setTimeout (function() {
			b.removeClass('popup-on');
			b.attr( 'style', '' );
		}, timeOut);
	}

	//Click to activator for popup
	$('a[data-popup]').on('click', function(e) {
		e.preventDefault();

		var b = $('body');
		var t = $(this).attr('href').replace('#', '');
		var d = $(this).data('popup');

		if ( b.hasClass('popup-on') ) {
			popupOut('#' + t, 600);
		} else {
			popupIn('#' + t);
		}
	});

	//Close popup (click to close button)
	$('.popup-close').on('click', function(e) {
		e.preventDefault();

		var p = $(this).closest('.popup');
		var t = p.attr('id');

		popupOut('#' + t, 600);
	});

	//Close popup (click out of content)
	$('.popup').on('mouseup', function(e) {
		var t = $(this).attr('id');

		if ( $(e.target).closest('.popup-content').length ) {
			return;
		} else {
			popupOut('#' + t, 600);
			e.stopPropagation();
		}
	});

	//===== Show phone number =====//
	$('.show-tel').on('click', function(e) {
		e.preventDefault();

		var tel = $(this).data('tel');
		var telStr = tel.replace(/\D+/g, '');
		var c = '<a href="tel:+' + telStr + '">' + tel + '</a>';
		var el = $(this).closest('.products-item-tel');

		el.find('a').css('opacity', '0.3');

		setTimeout( function() {
			el.html(c)
			el.attr('style', '');
		}, 400);
	});

	//===== Resize & scroll window =====//
	$(window).on('scroll', function() {
		headerFixed();
	});

	//===== Press Esc =====//
	$(document).on('keyup', function(e) {
		if (e.keyCode == 27) {
			if ( $('body').hasClass('menu-on') ) {
				menuOut();
			}

			if ( $('body').hasClass('popup-on') ) {
				popupOutAll(600);
			}
		}
	});

	//===== Click out of element =====//
	$(document).on('mouseup', function(e) {
		if ( $('body').hasClass('menu-on') ) {
			if ( !$(e.target).closest('.site-header-nav, #cat-btn, .nav-close').length ) {
				menuOut();
			}
		}
	});
});
