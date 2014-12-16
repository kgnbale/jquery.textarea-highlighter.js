var marexandre;
(function (marexandre) {
  'use strict';

  var Helper = (function() {
    function Helper() {}

    Helper.prototype.orderBy = function(list, type) {
      return list.sort(function(a, b) {
        return parseInt(a[type], 10) - parseInt(b[type], 10);
      });
    };

    Helper.prototype.removeOverlapingIndecies = function(list) {
      var a = [], item, next;

      // Check for overlapping items
      for (var i = 0, imax = list.length; i < imax; i++) {
        item = list[i];

        for (var j = i + 1; j < imax; j++) {
          next = list[j];

          if (this.isOverlap(item, next)) {
            a.push(j);
          }
        }
      }
      // Remove overlapping items from the list
      return list.slice(0).filter(function(elem, pos) {
        if (a.indexOf(pos) !== -1) {
          return false;
        }
        return true;
      });
    };

    Helper.prototype.isOverlap = function(x, y) {
      return x.start < y.end && y.start < x.end;
    };

    Helper.prototype.flattenIndeciesList = function(list) {
      var a = [], type, obj;

      for (var i = 0, imax = list.length; i < imax; i++) {
        type = list[i].type;
        for (var j = 0, jmax = list[i].indecies.length; j < jmax; j++) {
          obj = list[i].indecies[j];
          a.push({ 'start': obj.start, 'end': obj.end, 'type': type });
        }
      }

      return a;
    };

    Helper.prototype.makeTokenized = function(text, indecies, useWordBoundary) {
      var a = [], s = 0, ss = 0, obj, w, ww;
      useWordBoundary = useWordBoundary || true;

      for (var i = 0, imax = indecies.length; i < imax; i++) {
        obj = indecies[i];
        ss = obj.start;
        if (ss > s) {
          a.push({ 'value': text.slice(s, ss), 'type': 'text' });
        }

        w = text.slice(ss, obj.end);
        ww = text.slice(ss - 1, obj.end + 1);

        if (useWordBoundary && this.isWrappedByASCII(w) ) {
          if (this.checkWordBoundary(w, ww)) {
            a.push({ 'value': w, 'type': obj.type });
          } else {
            a.push({ 'value': w, 'type': 'text' });
          }
        } else {
          a.push({ 'value': w, 'type': obj.type });
        }

        s = obj.end;
      }
      if (s < text.length) {
        a.push({ 'value': text.slice(s, text.length), 'type': 'text' });
      }

      return a;
    };

    Helper.prototype.checkWordBoundary = function(w, ww) {
      return new RegExp('\\b' + w + '\\b').test(ww);
    };

    Helper.prototype.isWrappedByASCII = function(str) {
      return /^\w.*\w$|^\w+$/.test(str);
    };

    Helper.prototype.isCharacter = function(s) {
      var c = s.charCodeAt(0);
      if ((c >= 65 && c <= 90) || (c >= 97 && c <= 122)) {
        return true;
      }
      return false;
    };

    Helper.prototype.escapeHTML = function(str) {
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    };

    Helper.prototype.escapeRegExp = function(str) {
      return str.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
    };

    Helper.prototype.getUniqueArray = function(a) {
      return a.filter(function(elem, pos, self) {
        if (elem === '') {
          return false;
        }
        return self.indexOf(elem) === pos;
      });
    };

    Helper.prototype.createHTML = function(tokenized) {
      var a = [];

      for (var i = 0, imax = tokenized.length; i < imax; i++) {
        if (tokenized[i].type === 'text') {
          a.push(tokenized[i].value);
        } else {
          a.push(this.getTextInSpan(tokenized[i].type, tokenized[i].value));
        }
      }

      return a.join('');
    };

    Helper.prototype.getTextInSpan = function(className, text) {
      return '<span class="' + className + '">' + text + '</span>';
    };

    Helper.prototype.browser = function() {
      var userAgent = navigator.userAgent,
          msie    = /(msie|trident)/i.test( userAgent ),
          chrome  = /chrome/i.test( userAgent ),
          firefox = /firefox/i.test( userAgent ),
          safari  = /safari/i.test( userAgent ) && !chrome,
          iphone  = /iphone/i.test( userAgent );

      if ( msie ) { return { msie: true }; }
      if ( chrome ) { return { chrome: true }; }
      if ( firefox ) { return { firefox: true }; }
      if ( iphone ) { return { iphone: true }; }
      if ( safari ) { return { safari: true }; }

      return {
        msie   : false,
        chrome : false,
        firefox: false,
        safari : false,
        iphone : false
      };
    };

    return Helper;
  })();

  marexandre.Helper = Helper;
})(marexandre || (marexandre = {}));
