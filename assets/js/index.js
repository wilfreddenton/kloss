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
