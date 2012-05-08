/*----- LICENSE ------------------------------------------------------
 * Copyright (c) 2012 Krzysztof Antoszek <krzysztof (at) antoszek.net>
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


(function(k,l){var g={},h=[],f=[],o=l.getElementsByTagName("head")[0],m=function(a,e){for(var c=0,b=a.length,d=!0,i=[];c<b;c++)a[c]in g?i.push(g[a[c]]):(d=!1,h.push(a[c]));!0===d?e.apply(null,i):f.push([a,e]);c=0;for(b=h.length;c<b;c++)d=l.createElement("script"),d.src=[h[c].replace(/\./gi,"/"),"js"].join("."),d.defer=!0,d.async=!0,o.appendChild(d),h.splice(c,1)},p=function(){for(var a=f.length;0<=--a;){for(var e=f[a][1],c=[],b=!0,d=0,i=f[a][0].length;d<i;d++)f[a][0][d]in g?c.push(g[f[a][0][d]]):
b=!1;!0===b&&(f.splice(a,1),e.apply(null,c))}},n=function(a,e,c){var b=e.pop();if(0<e.length){if(b in a){if("object"!==typeof a[b]||null===a[b])throw Error("mamd.provide(): Cannot create leaf if namespace path part is not an object",[].concat(e,b),typeof a[b]);}else a[b]={};n(a[b],e,c)}else a[b]=c},j=function(a,e){var c=a.split(".");g[a]=e;n(k,c.reverse(),g[a])};k.mamd={require:m,define:function(a,e,c){var b=Array.prototype.slice.call(arguments);if(0===b.length)throw Error("mamd.define(): must have at least 2 parameters, name and factory");
var d=b.pop(),f=2===b.length?b.pop():[],g=b.pop();0<f.length?m(f,function(){j(g,d.apply(null,arguments))}):j(g,d.apply(null));p()},provide:j}})(window,document);
