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

// how about some real Javascript Ghost?
// action button
(function() {
  var opened = false;
  var hideNav = function(e) {
    if (!opened) return;
    opened = false;
    var ink = document.getElementById('ink');
    var nav = document.getElementById('nav');
    var navItems = document.getElementsByClassName('nav-item');
    ink.classList.remove('animate-ripple');
    Array.prototype.forEach.call(navItems, function(navItem, i) {
      setTimeout(function() {
        navItem.classList.remove('show');
      }, 100 * i)
    });
    setTimeout(function() {
      nav.classList.remove('show');
    }, 500);
  }
  var showNav = function(e) {
    if (opened) return;
    opened = true;
    var ele = document.getElementById('action-button');
    var ink = document.getElementById('ink');
    var nav = document.getElementById('nav');
    var navItems = document.getElementsByClassName('nav-item');
    var d = Math.max(window.innerWidth, window.innerHeight);
    var right = (-(d / 2) + ele.offsetWidth / 2 + 25).toString() + 'px';
    var bottom = (-(d / 2) + ele.offsetHeight / 2 + 15).toString() + 'px';
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
        }, 100 * (navItems.length - i));
      });
    }, 23);
  }
  var ab = document.getElementById('action-button').childNodes[1];
  ab.addEventListener('click', showNav);
  ab.addEventListener('mouseover', showNav);
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
