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
  var clickHandler = function(e) {
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
  var ab = document.getElementById('action-button');
  ab.addEventListener('click', clickHandler);
})();
