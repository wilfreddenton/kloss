/**
 * Main JS file for Casper behaviours
 */

/* globals jQuery, document */
(function ($, undefined) {
    "use strict";
    var $document = $(document);
    $document.ready(function () {
        var $postContent = $(".post-content");
        $postContent.fitVids();
    });
})(jQuery);

// action button
(function() {
  var opened = false;
  var ab = document.getElementById('action-button').childNodes[1];
  var ink = document.getElementById('ink');
  var nav = document.getElementById('nav');
  var navItems = document.getElementsByClassName('nav-item');
  var hideNav = function(e) {
    if (!opened || $(nav).is(':hover') || $(ab).is(':hover')) return;
    opened = false;
    ink.classList.remove('animate-ripple');
    Array.prototype.forEach.call(navItems, function(navItem, i) {
      setTimeout(function() {
        navItem.classList.remove('show');
      }, 75 * i)
    });
    setTimeout(function() {
      if (!opened)
        nav.classList.remove('show');
    }, 500);
  }
  var showNav = function(e) {
    if (opened) return;
    opened = true;
    var d = Math.max(window.innerWidth, window.innerHeight);
    var right = (-(d / 2) + ab.offsetWidth / 2 + 25).toString() + 'px';
    var bottom = (-(d / 2) + ab.offsetHeight / 2 + 15).toString() + 'px';
    ink.classList.remove('animate-ripple');
    setTimeout(function() {
      d = d.toString() + 'px';
      ink.style.width = d;
      ink.style.height = d;
      ink.style.right = right;
      ink.style.bottom = bottom;
      ink.classList.add('animate-ripple');
      nav.classList.add('show');
      Array.prototype.forEach.call(navItems, function(navItem, i) {
        setTimeout(function() {
          navItem.classList.add('show');
        }, 75 * (navItems.length - i));
      });
    }, 23);
  }
  ab.addEventListener('click', showNav);
  ab.addEventListener('mouseover', showNav);
  ab.addEventListener('mouseout', hideNav);
  nav.addEventListener('mouseout', hideNav);
  ink.addEventListener('click', hideNav);
})();

// adding ellipse to the index excerpts
(function() {
  var excerpts = document.getElementsByClassName('post-excerpt');
  if (excerpts.length > 0) {
    Array.prototype.forEach.call(excerpts, function(excerpt) {
      var paras = excerpt.getElementsByTagName('p');
      var p = paras[paras.length - 2];
      if (p.childNodes.length === 1 && p.childNodes[0].nodeName === '#text')
        p.innerHTML += '...';
    });
  }
})();

// dealing with image widths on resize
(function() {
  var imgs = document.querySelectorAll('.post img');
  var set = false;
  var post = document.querySelector('.post');
  var resizeHandler = function(e) {
    if (window.innerWidth <= 662) {
      var margin = (window.innerWidth - post.offsetWidth) / 2;
      Array.prototype.forEach.call(imgs, function(img) {
        img.style.width = window.innerWidth.toString() + 'px';
        img.style.marginLeft = (-margin).toString() + 'px';
      });
      if (set === false)
        set = true;
    } else if (set === true && window.innerWidth > 662){
      Array.prototype.forEach.call(imgs, function(img) {
        img.style.width = '126%';
        img.style.marginLeft = '0px';
      });
      set = false;
    }
  }
  resizeHandler();
  window.addEventListener('resize', resizeHandler);
})();
