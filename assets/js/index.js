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
    busy: false
  }
  var refs = {
    excerpts: document.getElementsByClassName('post-excerpt'),
    ab: document.getElementById('action-button').childNodes[1],
    ink: document.getElementById('ink'),
    nav: document.getElementById('nav'),
    navItems: document.getElementsByClassName('nav-item'),
    post: document.querySelector('.post'),
    imgs: document.querySelectorAll('.post img'),
    embeds: document.querySelectorAll('.post iframe')
  }
  var ripples = new Ripples(initialState);
  // Reactions
  var isHover = function (e) {
    console.log(e.parentElement.querySelector(':hover'))
    return (e.parentElement.querySelector(':hover') === e);
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
  function open() {
    if (ripples.state.open) return;
    ripples.setState({ open: true });
  }
  function close() {
    if (!ripples.state.open) return;
    ripples.setState({ open: false });
  }
  // Main
  // adding ellipse to the index excerpts
  if (refs.excerpts.length > 0) {
    Array.prototype.forEach.call(refs.excerpts, function(excerpt) {
      var paras = excerpt.getElementsByTagName('p');
      var p = paras[paras.length - 2];
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
  // dealing with image and embed widths on resize
  window.addEventListener('load', function (e) {
    var post = refs.post;
    var imgs = refs.imgs;
    var embeds = refs.embeds;
    if (post === null)
      return;
    var set = false;
    var init = true;
    var imageWidth = 662;
    var columnWidth = 550;
    var calcWidth = function(ele) {
      var windowWidth = document.body.offsetWidth;
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
  });
})(window);
