// dont show header when not on first page
(function() {
  var pathname = window.location.pathname;
  if (/^\/page\/\d+\/$/.test(pathname)) {
    var header = document.getElementById('main-header');
    var jumbo = document.getElementById('jumbo');
    var split = document.getElementById('split');
    split.style.display = 'none';
    header.style.minHeight = '0px';
    header.style.height = '0px';
    header.style.padding = '3% 0';
    jumbo.style.display = 'none';
  }
})();

// adding ellipse to the index excerpts
(function() {
  var excerpts = document.getElementsByClassName('post-excerpt');
  if (excerpts.length > 0) {
    Array.prototype.forEach.call(excerpts, function(excerpt) {
      var paras = excerpt.getElementsByTagName('p');
      var p = paras[paras.length - 2];
      if (p.childNodes[0].nodeName === '#text')
        p.innerHTML += '...';
    });
  }
})();

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
      if (window.innerWidth <= 1000)
        ink.classList.add('animate-ripple');
      nav.classList.add('show');
      Array.prototype.forEach.call(navItems, function(navItem, i) {
        setTimeout(function() {
          if (opened)
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

// dealing with image and embed widths on resize
(function() {
  var post = document.querySelector('.post');
  if (post === null)
    return;
  var imgs = document.querySelectorAll('.post img');
  var embeds = document.querySelectorAll('.post iframe');
  var set = false;
  var init = true;
  var imageWidth = 662;
  var columnWidth = 550;
  var calcWidth = function(ele) {
    var windowWidth = window.innerWidth
    if (ele.tagName === 'IMG' && ele.naturalWidth < Math.min(columnWidth, windowWidth - 32)) {
      ele.style.width = 'auto';
      ele.style.marginLeft = 'auto';
      ele.classList.add('thin');
      return;
    }
    var margin = (windowWidth - post.offsetWidth) / 2;
    ele.style.width = windowWidth.toString() + 'px';
    ele.style.marginLeft = (-margin).toString() + 'px';
    if (ele.tagName === 'IFRAME')
      ele.style.height = (windowWidth / 1.776).toString() + 'px';
  }
  var resetWidth = function(ele) {
    var windowWidth = window.innerWidth
    if (ele.tagName === 'IMG' && ele.naturalWidth < Math.min(columnWidth, windowWidth - 32)) {
      ele.style.width = 'auto';
      ele.style.marginLeft = 'auto';
      ele.classList.add('thin');
      return;
    }
    ele.style.width = '126%';
    ele.style.marginLeft = '0px';
    if (ele.tagName === 'IFRAME')
      ele.style.height = (imageWidth / 1.776).toString() + 'px';
  }
  var resizeHandler = function(e) {
    var windowWidth = window.innerWidth
    if (windowWidth <= imageWidth) {
      if (imgs.length > 0) {
        Array.prototype.forEach.call(imgs, calcWidth);
      }
      if (embeds.length > 0) {
        Array.prototype.forEach.call(embeds, calcWidth)
      }
      if (set === false)
        set = true;
    } else if ((set || init) && windowWidth > imageWidth) {
      if (imgs.length > 0) {
        Array.prototype.forEach.call(imgs, resetWidth);
      }
      if (embeds.length > 0) {
        Array.prototype.forEach.call(embeds, resetWidth);
      }
      set = false;
      if (init)
        init = false;
    }
  }
  resizeHandler();
  window.addEventListener('resize', resizeHandler);
})();
