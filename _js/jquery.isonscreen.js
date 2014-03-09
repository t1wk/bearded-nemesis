/*! isOnScreen jQuery Plugin
==============================================================
@name jquery.isonscreen.js
@author Steven Wade, https://github.com/stevenwadejr
@version ?
@date ?
@category Plugins

@based-on: jQuery - Test if element is in viewport
@based-url: https://coderwall.com/p/fnvjvg
==============================================================
*/

$.fn.isOnScreen = function(){
    
    var win = $(window);

      var viewport = {
          top : win.scrollTop(),
          left : win.scrollLeft()
      };
      viewport.right = viewport.left + win.width();
      viewport.bottom = viewport.top + win.height();

      var bounds = this.offset();
      bounds.right = bounds.left + this.outerWidth();
      bounds.bottom = bounds.top + this.outerHeight();

      var isOnScreen = (!(viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < bounds.top || viewport.top > bounds.bottom));

      return (!(viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < bounds.top || viewport.top > bounds.bottom));
  };