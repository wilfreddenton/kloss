(function (window) {
  var Ripples = function (initialState, setStateCallback) {
    this.state = initialState;
    this.events = {};
    this.eventTargets = {};
    this.setStateCallback = setStateCallback;
    for (var key in this.state) {
      var eventName = 'ripple' + key;
      this.events[eventName] = new Event(eventName);
      this.eventTargets[eventName] = [];
    }
  }
  Ripples.prototype.setState = function (newState) {
    for (var key in newState) {
      if (newState.hasOwnProperty(key)) {
        var eventName = 'ripple' + key;
        ripples.state[key] = newState[key];
        this.eventTargets[eventName].forEach(function (ele) {
          ele.dispatchEvent(this.events[eventName]);
        }.bind(this));
      }
    }
    if (typeof this.setStateCallback === 'function')
      this.setStateCallback();
  }
  Ripples.prototype.ripple = function (stateKeys, elements, reaction) {
    if (!Array.isArray(stateKeys))
      stateKeys = [stateKeys];
    if (!Array.isArray(elements))
      elements = [elements];
    stateKeys.forEach(function (key) {
      var eventName = 'ripple' + key;
      elements.forEach(function (element) {
        element.addEventListener(eventName, reaction);
        this.eventTargets[eventName].push(element);
      }.bind(this));
    }.bind(this));
  }
  Ripples.prototype.calm = function (stateKeys, elements, reaction) {
    if (!Array.isArray(stateKeys))
      stateKeys = [stateKeys];
    if (!Array.isArray(elements))
      elements = [elements];
    stateKeys.forEach(function (key) {
      var eventName = 'ripple' + key;
      elements.forEach(function (element) {
        element.removeEventListener(eventName, reaction);
        var i = this.eventTargets[eventName].indexOf(element);
        this.eventTargets[eventName].splice(i, 1);
      }.bind(this));
    }.bind(this));
  }
  Ripples.prototype.render = function (template) {
    if (typeof template[0] === 'string')
      template = [template];
    var docFrag = document.createDocumentFragment();
    template.forEach(function (subTemp) {
      var tag = subTemp[0], params = subTemp[1], children = subTemp[2];
      var element = document.createElement(tag);
      for (var key in params) {
        var param = params[key];
        if (typeof param === 'object' && param && !Array.isArray(param)) {
          for (var name in param)
            element[key][name] = param[name];
        } else { element[key] = param; }
      }
      if (Array.isArray(children)) {
        var childFrag = this.render(children);
        element.appendChild(childFrag);
      } else { element.innerHTML = children; }
      docFrag.appendChild(element);
    }.bind(this));
    return docFrag;
  }
  // Initialization
  var initialState = {
    open: false,
    busy: false,
    set: false,
    init: true,
    imgViewerClosing: false,
    innerWidth: 0,
    innerHeight: 0,
    scrollY: 0
  }
  var refs = {
    excerpts: document.getElementsByClassName('post-excerpt'),
    ab: document.getElementById('action-button').childNodes[1],
    ink: document.getElementById('ink'),
    nav: document.getElementById('nav'),
    navItems: document.getElementsByClassName('nav-item'),
    post: document.querySelector('.post'),
    imgs: document.querySelectorAll('.post img'),
    embeds: document.querySelectorAll('.post iframe'),
    imgViewerBackground: document.querySelector('.img-viewer-background'),
    imgViewerContent: document.querySelector('.img-viewer-content')
  }
  var ripples = new Ripples(initialState);
  // Reactions
  var isHover = function (e) {
    console.log(e.parentNode.querySelector(':hover'))
    return (e.parentNode.querySelector(':hover') === e);
  }
  var showNav = function () {
    refs.nav.classList.add('show');
  }
  var showNavItem = function (item) {
    item.classList.add('show');
  }
  var showInk = function () {
    var d = Math.max(window.innerWidth, window.innerHeight);
    var right = (-(d / 2) + refs.ab.offsetWidth / 2 + 25).toString() + 'px';
    var bottom = (-(d / 2) + refs.ab.offsetHeight / 2 + 15).toString() + 'px';
    refs.ink.classList.remove('animate-ripple');
    setTimeout(function() {
      d = d.toString() + 'px';
      refs.ink.style.width = d;
      refs.ink.style.height = d;
      refs.ink.style.right = right;
      refs.ink.style.bottom = bottom;
      refs.ink.classList.add('animate-ripple');
    });
  }
  var hideNav = function () {
    setTimeout(function () {
      if (!ripples.state.open)
        refs.nav.classList.remove('show');
    }, 500);
  }
  var hideNavItem = function (item) {
    item.classList.remove('show');
  }
  var hideInk = function () {
    refs.ink.classList.remove('animate-ripple');
  }
  var toggleNav = function () {
    switch (this.id) {
    case 'nav':
      ripples.state.open ? showNav() : hideNav();
      break;
    case 'ink':
      ripples.state.open ? showInk() : hideInk();
      break;
    default:
      ripples.state.open ? showNavItem(this) : hideNavItem(this);
    }
  }
  // Handlers
  var open = function () {
    if (ripples.state.open) return;
    ripples.setState({ open: true });
  }
  var close = function () {
    if (!ripples.state.open) return;
    ripples.setState({ open: false });
  }
  var showBackground = function () {
    refs.imgViewerBackground.classList.remove('img-viewer-hidden');
    refs.imgViewerBackground.classList.add('img-viewer-active');
  }
  var hideBackground = function () {
    refs.imgViewerBackground.classList.remove('img-viewer-active');
    setTimeout(function () {
      refs.imgViewerBackground.classList.add('img-viewer-hidden');
    }, 300);
  }
  var implodeImg = function (img) {
    img.classList.remove('no-transform');
    var scale = parseFloat(img.dataset.width) / parseFloat(img.style.width);
    var imgCenter = parseFloat(img.dataset.top) + parseFloat(img.dataset.height) / 2;
    var windowCenter = ripples.state.scrollY + window.innerHeight / 2;
    var scaleTop = (imgCenter - windowCenter) / scale;
    img.style.transform = 'scale(' + scale + ') translateY(' + scaleTop.toString() + 'px)';
    setTimeout(function () {
      img.classList.add('no-transform');
      img.style.transform = '';
      img.style.width = img.dataset.width.toString() + 'px';
      img.style.height = img.dataset.height.toString() + 'px';
      img.style.top = img.dataset.top.toString() + 'px';
      img.style.left = img.dataset.left.toString() + 'px';
    }, 300);
  }
  var explodeImg = function (img) {
    var viewer = refs.imgViewerContent;
    var imgOffsetWidth = parseFloat(img.dataset.offsetWidth);
    var imgOffsetHeight = parseFloat(img.dataset.offsetHeight);
    var imgDistTop = parseFloat(img.dataset.distTop);
    var imgNaturalWidth = img.naturalWidth;
    var imgNaturalHeight = img.naturalHeight;
    var windowInnerWidth = ripples.state.innerWidth;
    var windowInnerHeight = ripples.state.innerHeight;
    var windowScrollY = ripples.state.scrollY;
    var left = ((windowInnerWidth - imgOffsetWidth) / 2);
    var top = imgDistTop + windowScrollY;
    viewer.src = img.src;
    viewer.dataset.width = imgOffsetWidth;
    viewer.dataset.height = imgOffsetHeight;
    viewer.dataset.left = left;
    viewer.dataset.top = top;
    viewer.style.height = imgOffsetHeight.toString() + 'px';
    viewer.style.width = imgOffsetWidth.toString() + 'px';
    viewer.style.left = left.toString() + 'px';
    viewer.style.top = top.toString() + 'px';
    // split
    viewer.classList.add('img-viewer-active');
    img.classList.add('img-viewer-active');
    requestAnimationFrame(function () {
      document.body.style.overflow = 'hidden';
      var width = imgNaturalWidth;
      var height = imgNaturalHeight;
      if (imgNaturalHeight > windowInnerHeight || imgNaturalWidth > windowInnerWidth) {
        var ratio = imgNaturalWidth / imgNaturalHeight;
        width = windowInnerWidth;
        height = windowInnerWidth / ratio;
        if (windowInnerHeight < height) {
          width = ratio * windowInnerHeight;
          height = windowInnerHeight;
        }
      }
      left = (windowInnerWidth - width) / 2;
      top = windowScrollY + (windowInnerHeight - height) / 2;
      var scale = width / imgOffsetWidth;
      var imgCenter = (windowScrollY + imgDistTop) + imgOffsetHeight / 2;
      var windowCenter = windowScrollY + windowInnerHeight / 2;
      var scaleTop = (windowCenter - imgCenter) / scale;
      viewer.classList.remove('no-transform');
      viewer.style.transform = 'scale(' + scale + ') translateY(' + scaleTop.toString() + 'px)';
      setTimeout(function () {
        viewer.classList.add('no-transform');
        viewer.style.transform = '';
        viewer.style.height = height.toString() + 'px';
        viewer.style.width = width.toString() + 'px';
        viewer.style.left = left.toString() + 'px';
        viewer.style.top = top.toString() + 'px';
        document.body.style.overflow = 'auto';
      }, 300);
    });
  }
  var imgViewerOpen = function (img) {
    showBackground();
    // copyImgToImgViewerContent(img);
    // explodeImg(refs.imgViewerContent);
    requestAnimationFrame(function () {
      explodeImg(img)
    });
  }
  var imgViewerClose = function (img) {
    hideBackground();
    requestAnimationFrame(function () {
      implodeImg(refs.imgViewerContent);
    });
    setTimeout(function () {
      img.classList.remove('img-viewer-active');
      refs.imgViewerContent.classList.remove('img-viewer-active');
    }, 300);
  }
  var imgViewerOpenHandler = function (e) {
    imgViewerOpen(this);
  }
  var enableImgViewer = function (img) {
    img.classList.add('img-viewer');
    img.addEventListener('click', imgViewerOpenHandler);
  }
  var disableImgViewer = function (img) {
    img.classList.remove('img-viewer');
    img.removeEventListener('click', imgViewerOpenHandler);
  }
  var imgViewerCloseHandler = function (e) {
    if (this.classList.contains('img-viewer-active')) {
      var img = document.querySelector('.post img.img-viewer-active');
      imgViewerClose(img);
    }
  }
  var correctRatio = function (img) {
    return Math.abs(Math.round(img.naturalWidth * 100 / img.naturalHeight) - Math.round(img.width * 100 / img.height)) <= 1;
  }
  var overflowImg = function (img, toWidth) {
    img.classList.add('overflow-gutter');
    img.style.width = toWidth.toString() + 'px';
  }
  var tightenImg = function (img) {
    img.classList.remove('overflow-gutter');
    img.style.width = 'auto';
  }
  function resizeImg(img) {
    var parentWidth = img.parentNode.offsetWidth;
    var windowWidth = window.innerWidth;
    var toWidth = Math.min(windowWidth, parentWidth * 1.26);
    var imgHeight = img.classList.contains('overflow-gutter') ? Math.floor(img.height / 1.26) : img.height;
    if (((!img.classList.contains('overflow-gutter') && img.offsetWidth === parentWidth)
         || (img.classList.contains('overflow-gutter') && img.offsetWidth >= parentWidth))
        && img.naturalWidth >= toWidth
        && imgHeight * 1.26 <= 600
        && correctRatio(img)) {
      overflowImg(img, toWidth);
    } else {
      tightenImg(img);
    }
    img.dataset.offsetWidth = img.offsetWidth;
    img.dataset.offsetHeight = img.offsetHeight;
    img.dataset.distTop = img.getBoundingClientRect().top;
    if (img.naturalHeight > img.height || img.naturalWidth > img.width) {
      if (!img.classList.contains('img-viewer'))
        enableImgViewer(img);
    } else {
      if (img.classList.contains('img-viewer'))
        disableImgViewer(img);
    }
  }
  var resizeEmbed = function (embed) {
    var parentWidth = embed.parentNode.offsetWidth;
    var windowWidth = window.innerWidth;
    var toWidth = Math.min(windowWidth, parentWidth * 1.26);
    embed.style.width = toWidth.toString() + 'px';
    embed.style.height = (toWidth / 1.777).toString() + 'px';
  }
  var setWindowDims = function () {
    ripples.setState({
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight
    });
  }
  var resizeHandler = function (e) {
    Array.prototype.forEach.call(refs.imgs, resizeImg);
    Array.prototype.forEach.call(refs.embeds, resizeEmbed);
    requestAnimationFrame(setWindowDims);
  }
  function debounce(func, wait, immediate) {
    var timeout;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    }
  }
  var updateImgDists = function () {
    var imgs = document.querySelectorAll('.post img.img-viewer');
    var frame = function (img) {
      img.dataset.distTop = img.getBoundingClientRect().top;
    }
    Array.prototype.forEach.call(imgs, function(img) {
      requestAnimationFrame(function () {
        frame(img);
      });
    });
  }
  var updateScrollY = function () {
    requestAnimationFrame(function () {
      ripples.setState({ scrollY: window.scrollY });
    });
  }
  var debouncedUpdateScrollY = debounce(updateScrollY, 50);
  var debouncedUpdateImgDists = debounce(updateImgDists, 50);
  var scrollHandler = function (e) {
    var img = document.querySelector('.post img.img-viewer-active')
    if (img && !ripples.state.imgViewerClosing) {
      ripples.setState({ imgViewerClosing: true });
      imgViewerClose(img);
      setTimeout(function () {
        ripples.setState({ imgViewerClosing: false });
      }, 310);
    }
    debouncedUpdateImgDists();
    debouncedUpdateScrollY();
  }
  // adding ellipse to the index excerpts
  if (refs.excerpts.length > 0) {
    Array.prototype.forEach.call(refs.excerpts, function(excerpt) {
      var paras = excerpt.getElementsByTagName('p');
      var p = paras[paras.length - 1];
      if (p.childNodes[0].nodeName === '#text')
        p.innerHTML += '...';
    });
  }
  var eles = [refs.nav, refs.ink];
  Array.prototype.push.apply(eles, refs.navItems);
  ripples.ripple('open', eles, toggleNav);
  refs.ab.addEventListener('click', open);
  refs.ab.addEventListener('mouseover', open);
  refs.nav.addEventListener('mouseover', open);
  refs.ink.addEventListener('mouseover', close);
  refs.ink.addEventListener('click', close);
  refs.imgViewerContent.addEventListener('click', imgViewerCloseHandler);
  refs.imgViewerBackground.addEventListener('click', imgViewerCloseHandler);
  // dealing with image and embed widths on resize
  var prepImg = function (img) {
    resizeImg(img);
  }
  Array.prototype.forEach.call(refs.imgs, function (img) {
    if (img.complete) { // images will be loaded from cache
      resizeImg(img);
    } else {
      img.addEventListener('load', function (e) {
        resizeImg(this);
      });
    }
  });
  Array.prototype.forEach.call(refs.embeds, resizeEmbed);
  requestAnimationFrame(setWindowDims);
  window.addEventListener('resize', resizeHandler);
  window.addEventListener('scroll', scrollHandler);
})(window);
