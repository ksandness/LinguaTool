var eventUtility = {//Self executes an inner returning function
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
    }()),
    getTarget : (function() {
        if (typeof addEventListener !== "undefined") {
            return function(event) {
                return event.target;
            }
        } else {
            return function(event) {
                return event.srcElement;
            }
        }
    }()),
    preventDefault : (function() {
        if (typeof addEventListener !== "undefined") {
            return function(event) {
                event.preventDefault();
            }
        } else {
            return function(event) {
                event.returnValue = false;
            }
        }
    }()),
    hasClass : function (ele,cls) {
        return ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
    },
    addClass : function (ele,cls) {
        if (!eventUtility.hasClass(ele,cls)) ele.className += " "+cls;
    },
    removeClass : function (ele,cls) {
        if (eventUtility.hasClass(ele,cls)) {
            var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)');
            ele.className=ele.className.replace(reg,' ');
        }
    }
};


/** Determine whether a node's text content is entirely whitespace.
*
* @param nod  A node implementing the |CharacterData| interface (i.e.,
    *             a |Text|, |Comment|, or |CDATASection| node
    * @return     True if all of the text content of |nod| is whitespace,
    *             otherwise false.
    */
function is_all_ws( nod )
{
    // Use ECMA-262 Edition 3 String and RegExp features
    return !(/[^\t\n\r ]/.test(nod.data));
}


/**
 * Determine if a node should be ignored by the iterator functions.
 *
 * @param nod  An object implementing the DOM1 |Node| interface.
 * @return     true if the node is:
 *                1) A |Text| node that is all whitespace
 *                2) A |Comment| node
 *             and otherwise false.
 */

function is_ignorable( nod )
{
    return ( nod.nodeType == 8) || // A comment node
        ( (nod.nodeType == 3) && is_all_ws(nod) ); // a text node, all ws
}

/**
 * Version of |previousSibling| that skips nodes that are entirely
 * whitespace or comments.  (Normally |previousSibling| is a property
 * of all DOM nodes that gives the sibling node, the node that is
 * a child of the same parent, that occurs immediately before the
 * reference node.)
 *
 * @param sib  The reference node.
 * @return     Either:
 *               1) The closest previous sibling to |sib| that is not
 *                  ignorable according to |is_ignorable|, or
 *               2) null if no such node exists.
 */
function node_before( sib )
{
    while ((sib = sib.previousSibling)) {
        if (!is_ignorable(sib)) return sib;
    }
    return null;
}

/**
 * Version of |nextSibling| that skips nodes that are entirely
 * whitespace or comments.
 *
 * @param sib  The reference node.
 * @return     Either:
 *               1) The closest next sibling to |sib| that is not
 *                  ignorable according to |is_ignorable|, or
 *               2) null if no such node exists.
 */
function node_after( sib )
{
    while ((sib = sib.nextSibling)) {
        if (!is_ignorable(sib)) return sib;
    }
    return null;
}


/*var eventUtility = {//Executes the function directly
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
};*/

function slideDown(element, targetHeight, animationStep, animationInterval) {
    var curHeight = element.clientHeight;
    if (curHeight >= targetHeight)
        return true;
    element.style.height = (curHeight + animationStep) + "px";
    window.setTimeout(function() {
        slideDown(element, targetHeight, animationStep, animationInterval);
    }, animationInterval);
    return false;
}