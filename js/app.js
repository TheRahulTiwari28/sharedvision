
// humburger menu
function closenav(){
  document.getElementById("nav-toggle").checked = false;
}


 /* vertical navigation dots */
const VND = ((document, window) => {
  'use strict';
  const render = {
    Dots(sections) {
      const listOfdots = sections.map((element, index) =>
          `<li id="nav-toSection#${index}" class="dot"></li>`).join('\r\n');

      document.body.innerHTML += `<section id="dots"><ul>${listOfdots}</ul></section>`;
    },
  };
  const normalized = {
    positionTop(positionTop) {
      return positionTop - getSize.headerHeight();
    },
  };
  const is = {
    scrollThrowSection(positionScroll) {
      const {rangeY: {value}} = position;

      return positionScroll >= value.start &&
          positionScroll < value.end;
    },

    visibleElement(element) {
      const styleDisplay = getComputedStyle(element, null)['display'];
      const styleVisibility = getComputedStyle(element, null)['visibility'];

      return styleDisplay !== 'none' && styleVisibility !== 'hidden';
    },
  };
  const getSize = {
    headerHeight() {
      const header = document.querySelector('header');

      if (header) {
        const position = getComputedStyle(header, null)['position'];
        return position === 'fixed' ? header.clientHeight || header.offsetHeight : 0;
      }
      return 0;
    },

    fullHeight(element) {
      const marginBottom = parseInt(getComputedStyle(element, null)['margin-bottom']);

      return element.offsetHeight + marginBottom;
    },
  };
  const scroll = {
    top(value) {
      scrollBy({
        top: value,
        left: 0,
        behavior: 'smooth',
      });
    },

    stop(callBack) {
      let currentPageY = null;
      let scrollingTimeout = null;

      const isScrolling = () => {
        if (currentPageY !== pageYOffset) {
          currentPageY = pageYOffset;

          clearTimeout(scrollingTimeout);
          setTimeout(isScrolling, 66);
          scrollingTimeout = setTimeout(callBack, 66);
        }
      };
      isScrolling();
    },
  };
  const keyboard = {
    getKeyCode(event) {
      return event.which || event.keyCode;
    },

    '33' (event, sections) {
      const prevPositionTop = position.getClientPrevTop(sections);

      event.preventDefault();
      scroll.top(prevPositionTop);
    },

    '34' (event, sections) {
      const nextPositionTop = position.getClientNextTop(sections);

      event.preventDefault();
      scroll.top(nextPositionTop);
    },
  };
  const dom = {
    getAllElements(cls) {
      const listOfElements = document.querySelectorAll(`.${cls}`);
      return Array.from(listOfElements);
    },

    containClass(element, cls) {
      return element.classList.contains(cls);
    },

    addClass(element, cls) {
      if (!this.containClass(element, cls)) {
        element.classList.add(cls);
      }
    },

    removeClass(elements, cls) {
      const element = elements.find(element => this.containClass(element, cls));

      if (element) {
        element.classList.remove(cls);
      }
    },

    toggleCls(removeFrom, addTo, cls) {
      this.removeClass(removeFrom, cls);
      this.addClass(addTo, cls);
    },

    toggleDots(indexOfSection) {
      const Dots = this.getAllElements('dot');
      const nextDot = document.getElementById(`nav-toSection#${indexOfSection}`);
      this.toggleCls(Dots, nextDot, 'dot--active');
    },
  };
  const position = {
    rangeY: {
      range: {
        start: null,
        end: null,
      },

      set value(element) {
        this.range = {
          start: element.offsetTop - 30,
          end: element.offsetTop + getSize.fullHeight(element) - 30,
        };
      },

      get value() {
        return this.range;
      },

    },

    scrollThrow(section) {
      const positionScroll = Math.ceil(pageYOffset + getSize.headerHeight());

      if (!is.scrollThrowSection(positionScroll)) {
        this.rangeY.value = section;
      }

      return is.scrollThrowSection(positionScroll);
    },

    getClientTop(element) {
      return element.getBoundingClientRect().top || element.getBoundingClientRect().y;
    },

    getClientPrevTop(sections) {
      const prevSection = sections.reduce((cur, acc) => {
        const curPositionTop = this.getClientTop(cur);
        const accPositionTop = this.getClientTop(acc);

        return curPositionTop < 0 && accPositionTop < 0
            ? curPositionTop > accPositionTop ? cur : acc
            : cur;
      });
      const prevPositionTop = this.getClientTop(prevSection);

      return normalized.positionTop(prevPositionTop);
    },

    getClientNextTop(sections) {
      const nexSection = sections.reduce((cur, acc) => {
        const curPositionTop = this.getClientTop(cur);
        const accPositionTop = this.getClientTop(acc);

        return curPositionTop > getSize.headerHeight() + 10
            ? curPositionTop < accPositionTop ? cur : acc
            : acc;
      });

      const nextPositionTop = this.getClientTop(nexSection);

      return normalized.positionTop(nextPositionTop);
    },
  };
  const handleListener = {
    listener({element, event, callBack, arg}) {
      element.addEventListener(event, (evn) => callBack({evn, arg}));
    },

    Dots({evn: {target}, arg: cls}) {
      if (target.tagName === 'LI') {
        const indexOfSection = target.id.split('#')[1];
        const sections = dom.getAllElements(cls);
        const positionTop = position.getClientTop(sections[indexOfSection]);
        const normalizedPosition = normalized.positionTop(positionTop);
        const toggleDots = () => dom.toggleDots(indexOfSection);

        scroll.top(normalizedPosition);
        scroll.stop(toggleDots);
      }
    },

    pgUpDownKeys({arg: cls}) {
      const keyCode = keyboard.getKeyCode(event);
      const sections = dom.getAllElements(cls);

      if (keyboard[keyCode] && !!sections.length) {
        keyboard[keyCode](event, sections);
      }
    },

    scrolling: {
      currentSection: null,
      indexOfSection: null,

      init({arg: sections}) {
        if (!position.scrollThrow(this.currentSection || sections[0])) {
          this.currentSection = sections.find((section, index) => {
            if (position.scrollThrow(section)) {
              this.indexOfSection = index;
              return true;
            }
          });
          dom.toggleDots(this.indexOfSection);
        }
      },
    },

    resize: {
      resizeTimeout: null,

      hideOnSmallScreen(screenSize) {
        const Dots = document.getElementById('nav-dots');

        window.screen.width <= screenSize
            ? is.visibleElement(Dots) && (Dots.style.display = 'none')
            : !is.visibleElement(Dots) && (Dots.style.display = 'flex');
      },

      init({arg: screenSize}) {
        if (!this.resizeTimeout) {
          this.resizeTimeout = setTimeout(() => {
            this.resizeTimeout = null;
            this.hideOnSmallScreen(screenSize);
          }, 66);
        }
      },
    },
  };
  const init = function({cls, hideOnScreenLess = 0} = {}) {
    const {
      listener,
      pgUpDownKeys,
      scrolling,
      resize,
      Dots: dotsListener,
    } = handleListener;

    render.Dots(dom.getAllElements(cls));
    resize.init({arg: hideOnScreenLess});

    const sections = dom.getAllElements(cls);
    const Dots = document.getElementById('dots');
    const firstDot = document.getElementById('nav-toSection#0');

    dom.addClass(firstDot, 'dot--active');

    listener({
      element: document,
      event: 'keydown',
      callBack: pgUpDownKeys,
      arg: cls,
    });
    listener({
      element: document,
      event: 'scroll',
      callBack: scrolling.init.bind(handleListener.scrolling),
      arg: sections,
    });
    listener({
      element: window,
      event: 'resize',
      callBack: resize.init.bind(handleListener.resize),
      arg: hideOnScreenLess,
    });
    listener({
      element: Dots,
      event: 'click',
      callBack: dotsListener,
      arg: cls,
    });
  };

  return {
    init: init,
  };
})(document, window);

  VND.init({
    cls: 'js-Dots',
    hideOnScreenLess: 640,
  })
