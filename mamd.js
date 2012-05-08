/*----- LICENSE ------------------------------------------------------
 * Copyright (c) 2012 Krzysztof Antoszek <krzysztof (at) antoszek.net>
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation files
 * (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify,
 * merge, publish, distribute, sublicense, and/or sell copies of the
 * Software, and to permit persons to whom the Software is furnished
 * to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
 * BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * ---------------------------------------------------------------- */

(function(k,l){var g={},i=[],f=[],o=l.getElementsByTagName("head")[0],m=function(a,d){var b,c=a.length,e=!0,h=[];for(b=0;b<c;b++)"undefined"===typeof g[a[b]]?(e=!1,i.push(a[b])):h.push(g[a[b]]);!0===e?d.apply(null,h):f.push([a,d]);c=i.concat().reverse();for(e=i.length;0<=--e;)b=l.createElement("script"),b.src=[c[e].replace(/\./gi,"/"),"js"].join("."),b.defer=!0,b.async=!0,o.appendChild(b),c.splice(e,1);i=c.reverse()},p=function(){for(var a=f.length,d,b=[],c,e,h;0<=--a;){d=f[a][1];b=[];c=!0;h=f[a][0].length;
for(e=0;e<h;e++)"undefined"===typeof g[f[a][0][e]]?c=!1:b.push(g[f[a][0][e]]);!0===c&&(f.splice(a,1),d.apply(null,b))}},n=function(a,d,b){var c=d.pop();if(0<d.length){if("undefined"!==typeof a[c]){if("object"!==typeof a[c]||null===a[c])throw Error("mamd.provide(): Cannot create leaf if namespace path part is not an object",[].concat(d,c),typeof a[c]);}else a[c]={};n(a[c],d,b)}else a[c]=b},j=function(a,d){var b=a.split(".");g[a]=d;n(k,b.reverse(),g[a])};k.mamd={require:m,define:function(){var a=Array.prototype.slice.call(arguments),
d,b,c;if(1>=a.length)throw Error("mamd.define(): must have at least 2 parameters, name and factory");d=a.pop();b=2===a.length?a.pop():[];c=a.pop();0<b.length?m(b,function(){j(c,d.apply(null,arguments))}):j(c,d.apply(null));p()},provide:j}})(window,document);
