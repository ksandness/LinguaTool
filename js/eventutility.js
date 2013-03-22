var eventUtility = {//Self executes a inner returning function
    addEvent : (function () {
      if (typeof addEventListener === "function") {
            return function(obj,evt,fn) {
                obj.addEventListener(evt,fn,false);
            };
        } else {
            return function(obj,evt,fn) {
                obj.attachEvent("on" + evt, fn);
            };
      }
    }()),
    removeEvent : (function() {
        if (typeof removeEventListener === "function") {
            return function(obj,evt,fn) {
                obj.removeEventListener(evt,fn,false);
            }
        } else {
            return function(obj,evt,fn) {
                obj.detachEvent("on" + evt, fn);
            }
        }
    }())
};


var eventUtility = {//Executes the function directly
    addEvent : function (obj,evt,fn) {
        if (typeof addEventListener === "function") {
            obj.addEventListener(evt,fn,false);
        } else {
            obj.attachEvent("on" + evt, fn);
        }
    },
    removeEvent : function(obj,evt,fn) {
        if (typeof removeEventListener === "function") {
            obj.removeEventListener(evt,fn,false);
        } else {
            obj.detachEvent("on" + evt, fn);
        }
    }
};