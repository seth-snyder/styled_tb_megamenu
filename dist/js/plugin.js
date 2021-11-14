/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./js/plugin.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./js/plugin.js":
/*!**********************!*\
  !*** ./js/plugin.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

class TBMegaMenu {
  constructor(id) {
    this.id = id;
  }

  init() {
    const _this = this;

    var navParent = jQuery('#' + this.id);
    var menuId = navParent.attr('id');
    var menuSettings = drupalSettings['TBMegaMenu'][menuId]; // console.log(menuSettings);

    var isTouch = window.matchMedia('(pointer: coarse)').matches;
    var hasArrows = menuSettings['arrows'] === '1'; // We have to define this as a function because it can change as the browser resizes.

    function isMobile() {
      return navParent.hasClass('tbm--mobile');
    } // Key Pressed


    function keydownEvent(k) {
      // Determine Key
      switch (k.keyCode) {
        // TAB
        case 9:
          // On mobile, we can follow the natural tab order.
          if (!isMobile()) {
            nav_tab(k);
          }

          break;
        // ENTER

        case 13:
          nav_enter();
          break;
        // ESC

        case 27:
          nav_esc();
          break;
        // LEFT

        case 37:
          k.preventDefault();
          nav_left(k);
          break;
        // UP

        case 38:
          k.preventDefault();
          nav_up(k);
          break;
        // RIGHT

        case 39:
          k.preventDefault();
          nav_right(k);
          break;
        // DOWN

        case 40:
          k.preventDefault();
          nav_down(k);
          break;
        // Else

        default: // Do nothing

      } // determine key

    } // keydownEvent

    /* Keypress Functions */
    // Tab


    function nav_tab(k) {
      k.preventDefault();

      if (nav_is_toplink()) {
        if (k.shiftKey || k.keyCode === 38 || k.keyCode === 37) {
          nav_prev_toplink();
        } else {
          nav_next_toplink();
        }
      } else {
        if (k.shiftKey || k.keyCode === 38 || k.keyCode === 37) {
          getNextPrevElement('prev').focus();
        } else {
          getNextPrevElement('next').focus();
        }
      }
    } // Escape


    function nav_esc() {
      nav_close_megamenu();
    } // Enter


    function nav_enter() {
      if (jQuery(document.activeElement).hasClass('no-link')) {
        jQuery(document.activeElement).trigger('click');
      }
    } // Left


    function nav_left(k) {
      if (nav_is_toplink()) {
        nav_prev_toplink();
      } else {
        // TODO/NICE TO HAVE - Go to previous column
        nav_up(k);
      }
    } // Right


    function nav_right(k) {
      if (nav_is_toplink()) {
        nav_next_toplink();
      } else {
        // TODO/NICE TO HAVE - Go to previous column
        nav_down(k);
      }
    } // Up


    function nav_up(k) {
      if (nav_is_toplink()) {// Do nothing.
      } else {
        nav_tab(k);
      }
    } // Down


    function nav_down(k) {
      if (nav_is_toplink()) {
        getNextPrevElement('next').focus(); // nav_next_column();
      } else if ( // If the next element takes the user out of this top level, then do nothing.
      getNextPrevElement('next').closest('.tbm-item.level-1') !== document.activeElement.closest('.tbm-item.level-1')) {// Do nothing.
      } else {
        nav_tab(k);
      }
    }
    /* Helper Functions */
    // Determine Link Level


    function nav_is_toplink() {
      var $topLevel = Drupal.TBMegaMenu[menuId]['topLevel'];
      return $topLevel.index(document.activeElement) > -1;
    }

    function nav_is_last_toplink() {
      var $topLevel = Drupal.TBMegaMenu[menuId]['topLevel'];
      return $topLevel.index(document.activeElement) === $topLevel.length - 1;
    }

    function nav_is_first_toplink() {
      var $topLevel = Drupal.TBMegaMenu[menuId]['topLevel'];
      return $topLevel.index(document.activeElement) === 0;
    } // Close Mega Menu


    function nav_close_megamenu() {
      navParent.find('.open').removeClass('open');
      navParent.find('.tbm-clicked').removeClass('tbm-clicked');
      ariaCheck();
    } // Next Toplink


    function nav_next_toplink() {
      if (!nav_is_last_toplink()) {
        var $topLevel = Drupal.TBMegaMenu[menuId]['topLevel'];
        var index = $topLevel.index(document.activeElement);

        if (index > -1) {
          $topLevel[index + 1].focus();
        }
      } else {
        nav_close_megamenu(); // Focus on the next element.

        getNextPrevElement('next', true).focus();
      }
    } // Previous Toplink


    function nav_prev_toplink() {
      if (!nav_is_first_toplink()) {
        var $topLevel = Drupal.TBMegaMenu[menuId]['topLevel'];
        var index = $topLevel.index(document.activeElement);

        if (index > -1) {
          $topLevel[index - 1].focus();
        }
      } else {
        // Focus on the previous element.
        getNextPrevElement('prev', true).focus();
      }
    }

    var ariaCheck = function () {
      jQuery('li.tbm-item', navParent).each(function () {
        if (jQuery(this).is('.tbm-group')) {
          // Mega menu item has mega class (it's a true mega menu)
          if (!jQuery(this).parents().is('.open')) {
            // Mega menu item has mega class and its ancestor is closed, so apply appropriate ARIA attributes
            jQuery(this).find('.tbm-toggle, .tbm-submenu-toggle').attr('aria-expanded', 'false');
          } else if (jQuery(this).parents().is('.open')) {
            // Mega menu item has mega class and its ancestor is open, so apply appropriate ARIA attributes
            jQuery(this).find('.tbm-toggle, .tbm-submenu-toggle').attr('aria-expanded', 'true');
          }
        } else if (jQuery(this).is('.tbm-item--has-dropdown') || jQuery(this).is('.tbm-item--has-flyout')) {
          // Mega menu item has dropdown (it's a flyout menu)
          if (!jQuery(this).is('.open')) {
            // Mega menu item has dropdown class and is closed, so apply appropriate ARIA attributes
            jQuery(this).find('.tbm-toggle, .tbm-submenu-toggle').attr('aria-expanded', 'false');
          } else if (jQuery(this).is('.open')) {
            // Mega menu item has dropdown class and is open, so apply appropriate ARIA attributes
            jQuery(this).find('.tbm-toggle, .tbm-submenu-toggle').attr('aria-expanded', 'true');
          }
        } else {
          // Mega menu item is neither a mega or dropdown class, so remove ARIA attributes (it doesn't have children)
          jQuery(this).find('.tbm-toggle, .tbm-submenu-toggle').removeAttr('aria-expanded');
        }
      });
    };

    var showMenu = function ($subMenu, mm_timeout) {
      if ($subMenu.hasClass('level-1')) {
        $subMenu.addClass('animating');
        clearTimeout($subMenu.data('animatingTimeout'));
        $subMenu.data('animatingTimeout', setTimeout(function () {
          $subMenu.removeClass('animating');
        }, mm_timeout));
        clearTimeout($subMenu.data('hoverTimeout'));
        $subMenu.data('hoverTimeout', setTimeout(function () {
          $subMenu.addClass('open');
          ariaCheck();
        }, 100));
      } else {
        clearTimeout($subMenu.data('hoverTimeout'));
        $subMenu.data('hoverTimeout', setTimeout(function () {
          $subMenu.addClass('open');
          ariaCheck();
        }, 100));
      }
    };

    var hideMenu = function ($subMenu, mm_timeout) {
      $subMenu.find('.tbm-toggle, .tbm-submenu-toggle').attr('aria-expanded', 'false');

      if ($subMenu.hasClass('mega')) {
        $subMenu.addClass('animating');
        clearTimeout($subMenu.data('animatingTimeout'));
        $subMenu.data('animatingTimeout', setTimeout(function () {
          $subMenu.removeClass('animating');
        }, mm_timeout));
        clearTimeout($subMenu.data('hoverTimeout'));
        $subMenu.data('hoverTimeout', setTimeout(function () {
          $subMenu.removeClass('open');
          ariaCheck();
        }, 100));
      } else {
        clearTimeout($subMenu.data('hoverTimeout'));
        $subMenu.data('hoverTimeout', setTimeout(function () {
          $subMenu.removeClass('open');
          ariaCheck();
        }, 100));
      }
    };

    jQuery('.tbm-button').click(function () {
      console.log('clicked'); // If the menu is currently open, collapse all open dropdowns before
      // hiding the menu.

      if (navParent.hasClass('tbm--mobile-show')) {
        nav_close_megamenu();
        jQuery(this).attr('aria-expanded', 'false');
      } else {
        jQuery(this).attr('aria-expanded', 'true');
      } // Toggle the menu visibility.


      jQuery(this).parent().toggleClass('tbm--mobile-show');
    });

    if (!isTouch) {
      var mm_duration = navParent.data('duration') ? navParent.data('duration') : 0;
      var mm_timeout = mm_duration ? 100 + mm_duration : 500; // Show dropdowns and flyouts on hover.

      jQuery('.tbm-item', navParent).on('mouseenter', function (event) {
        console.log(this);

        if (!isMobile() && !hasArrows) {
          showMenu(jQuery(this), mm_timeout);
        }
      }); // Show dropdwons and flyouts on focus.

      jQuery('.tbm-toggle', navParent).on('focus', function (event) {
        if (!isMobile() && !hasArrows) {
          var $this = jQuery(this);
          var $subMenu = $this.closest('li');
          showMenu($subMenu, mm_timeout); // If the focus moves outside of the subMenu, close it.

          jQuery(document).on('focusin', function (event) {
            if ($subMenu.has(event.target).length) {
              return;
            }

            jQuery(document).unbind(event);
            hideMenu($subMenu, mm_timeout);
          });
        }
      });
      jQuery('.tbm-item', navParent).on('mouseleave', function (event) {
        if (!isMobile() && !hasArrows) {
          hideMenu(jQuery(this), mm_timeout);
        }
      });
    } // Define actions for touch devices.


    var createTouchMenu = function (items) {
      items.children('.tbm-link-container').children('.tbm-link').each(function () {
        var $item = jQuery(this);
        var tbitem = jQuery(this).closest('.tbm-item');
        $item.click(function (event) {
          if (!isMobile() && isTouch && !hasArrows) {
            // If the menu link has already been clicked once...
            if ($item.hasClass('tbm-clicked')) {
              var $uri = $item.attr('href'); // If the menu link has a URI, go to the link.
              // <nolink> menu items will not have a URI.

              if ($uri) {
                window.location.href = $uri;
              } else {
                $item.removeClass('tbm-clicked');
                hideMenu(tbitem, mm_timeout);
              }
            } else {
              event.preventDefault(); // Hide any already open menus which are not parents of the
              // currently clicked menu item.

              var $openParents = $item.parents('.open');
              var $allOpen = jQuery('.tbm .open'); // Loop through all open items and check to see if they are
              // parents of the clicked item.

              $allOpen.each(function (index, item) {
                if (jQuery(item).is($openParents)) {// do nothing
                } else {
                  jQuery(item).removeClass('open');
                }
              }); // Apply aria attributes.

              ariaCheck(); // Remove any existing tmb-clicked classes.

              navParent.find('.tbm-clicked').removeClass('tbm-clicked'); // Open the submenu and apply the tbm-clicked class.

              $item.addClass('tbm-clicked');
              showMenu(tbitem, mm_timeout);
            }
          }
        });
      }); // Anytime there's a click outside the menu, close the menu.

      jQuery(document).on('click', function (event) {
        if (jQuery(event.target).closest('.tbm-nav').length === 0) {
          if (navParent.find('.open').length > 0) {
            nav_close_megamenu();
          }
        }
      });
    }; // Add touch functionality.


    createTouchMenu(jQuery('.tbm-item', navParent).has('.tbm-submenu')); // Toggle submenus.

    jQuery('.tbm-submenu-toggle, .tbm-link.no-link', navParent).on('click', function () {
      if (isMobile()) {
        var $parentItem = jQuery(this).closest('.tbm-item');

        if ($parentItem.hasClass('open')) {
          hideMenu($parentItem, mm_timeout);
        } else {
          showMenu($parentItem, mm_timeout);
        }
      } // Do not add a click listener if we are on a touch device with no
      // arrows and the element is a no-link element. In that case, we
      // want to use touch menu handler.


      if (!isMobile() && !(isTouch && !hasArrows && jQuery(this).hasClass('no-link'))) {
        var $parentItem = jQuery(this).closest('.tbm-item');

        if ($parentItem.hasClass('open')) {
          hideMenu($parentItem, mm_timeout); // Hide any children.

          $parentItem.find('.open').each(function (index, item) {
            var $this = jQuery(this);
            hideMenu($this, mm_timeout);
          });
        } else {
          showMenu($parentItem, mm_timeout); // Find any siblings and close them.

          $parentItem.siblings().each(function (index, item) {
            var $this = jQuery(this);
            hideMenu($this, mm_timeout); // Hide any children.

            $this.find('.open').each(function (index, item) {
              var $this = jQuery(this);
              hideMenu($this, mm_timeout);
            });
          });
        }
      }
    }); // Add keyboard listeners.

    navParent.on('keydown', keydownEvent);
  }

}

/***/ })

/******/ });
//# sourceMappingURL=plugin.js.map