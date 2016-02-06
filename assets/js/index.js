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
(function() {
  var opened = false;
  var hideNav = function(e) {
    if (!opened) return;
    console.log('hey');
    opened = false;
    var ink = document.getElementById('ink');
    ink.classList.remove('animate-ripple');
  }
  var showNav = function(e) {
    if (opened) return;
    opened = true;
    var ele = document.getElementById('action-button');
    var ink = document.getElementById('ink');
    var d = Math.max(window.innerWidth, window.innerHeight);
    var right = (-(d / 2) + ele.offsetWidth / 2 + 25).toString() + 'px';
    var bottom = (-(d / 2) + ele.offsetHeight / 2 + 15).toString() + 'px';
    ink.classList.remove('animate-ripple');
    setTimeout(() => {
      d = d.toString() + 'px';
      ink.style.width = d;
      ink.style.height = d;
      ink.style.right = right;
      ink.style.bottom = bottom;
      ink.classList.add('animate-ripple');
    }, 23);
  }
  var ab = document.getElementById('action-button').childNodes[1];
  ab.addEventListener('click', showNav);
  ab.addEventListener('mouseover', showNav);
  ink.addEventListener('click', hideNav);
})();
