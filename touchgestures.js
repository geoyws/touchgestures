// TouchGestures only supports IE9+ currently
// Might support IE8 and below in the future

var TouchGestures = function() {
  this.swipeDirection;
  this.startX;
  this.startY;
  this.distanceX;
  this.distanceY;
  this.minSwipeDistance = 150; // required min distance
  this.maxPerpendicularDistance = 100; // maximum distance allowed perpendicularly
  this.allowedTime = 400; // 400ms
  this.elapsedTime;
  this.startTime;
  this.handleSwipe;
};

TouchGestures.prototype.swipeDetect = function(element, callback) {
  var touchSurface = element,
      that = this;

  // ensure that callback is a function before anything else
  if (typeof callback !== 'function') {
    return;
  } else {
    that.handleSwipe = callback;
    /* callback will have to look like this:
        function (swipeDirection) { // swipeDirection argument will be passed in by handleSwipe('swipeDirection')
          if (swipeDirection == 'up') {
            // do something
          }
          else if (swipeDirection == 'down') {
            // do something
          }
          else if (swipeDirection == 'left') {
            // do something
          }
          else if (swipeDirection == 'right') {
            // do something
          }
        }
    */
  }
  
  ['touchstart', 'mousedown'].forEach(function (eventName) {
    touchSurface.addEventListener(eventName, function(event) {
      var touchObj = (eventName === 'touchstart') ? event.changedTouches[0] : event;
      that.swipeDirection = 'none';
      that.distance = 0;
      that.startX = touchObj.pageX;
      that.startY = touchObj.pageY;
      that.startTime = new Date().getTime(); // record time when finger makes first contact with the surface
      event.preventDefault();
    }, false);
  });

  ['touchmove', 'mousemove'].forEach(function (eventName) {
    touchSurface.addEventListener(eventName, function(event) {
      event.preventDefault(); // prevent scrolling within the div
    }, false);
  });

  ['touchend', 'mouseup'].forEach(function (eventName) {
    touchSurface.addEventListener(eventName, function(event) {
      var touchObj = (eventName === 'touchend') ? event.changedTouches[0] : event;
      that.distanceX = touchObj.pageX - that.startX;
      that.distanceY = touchObj.pageY - that.startY;
      that.elapsedTime = new Date().getTime() - that.startTime;
      if (that.elapsedTime <= that.allowedTime) {
        // checking conditions for horizontal swipe
        if (Math.abs(that.distanceX) >= that.minSwipeDistance && Math.abs(that.distanceY) <= that.maxPerpendicularDistance) {
          that.swipeDirection = (that.distanceX < 0) ? 'left' : 'right';
        }
        // checking conditions for vertical swipe
        else if (Math.abs(that.distanceY) >= that.minSwipeDistance && Math.abs(that.distanceX) <= that.maxPerpendicularDistance) {
          that.swipeDirection = (that.distanceY < 0) ? 'up' : 'down';
        }
      }
      that.handleSwipe(that.swipeDirection);
      event.preventDefault();
    }, false);
  });
};

var touchGestures = new TouchGestures(); // initialize it for use
