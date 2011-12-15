(function($) {
      $.cors = function(options) {
        options.success = options.success || function(data, text) {alert('no success callback specified');};
        options.error = options.error || function(xhr, text, thrown) {alert('no fail callback specified');};
        $.ajax(options);
      };
      
      $.corsSetup = function(options) {
        $.ajaxSetup(options);
      };
      
      // CORS Verbs
      $.getCORS = function(url, data, callback, type, headers, xhrFields) {
        options = {
          url: url,
          type: 'GET',
          data: data,
          success: callback,
          dataType: type,
          error: callback,
          headers: headers,
          xhrFields: xhrFields
        };
        $.cors(options);
      };
      $.postCORS = function(url, data, callback, type, headers, xhrFields) {
        options = {
          url: url,
          type: 'POST',
          data: data,
          success: callback,
          dataType: type,
          error: callback,
          headers: headers,
          xhrFields: xhrFields
        };
        $.cors(options);
      };
      $.putCORS = function(url, data, callback, type, headers, xhrFields) {
        options = {
          url: url,
          type: 'PUT',
          data: data,
          success: callback,
          dataType: type,
          error: callback,
          headers: headers,
          xhrFields: xhrFields
        };
        $.cors(options);
      };
      $.deleteCORS = function(url, data, callback, type, headers, xhrFields) {
        options = {
          url: url,
          type: 'DELETE',
          data: data,
          success: callback,
          dataType: type,
          error: callback,
          headers: headers,
          xhrFields: xhrFields
        };
        $.cors(options);
      };

      $.postCORSWithFile = function(url, data, callback, type, headers, xhrFields) {
          options = {
            url: url,
            type: 'POST',
            data: data,
            success: callback,
            dataType: type,
            error: callback,
            headers: headers,
            cache: false,
            contentType: false,
            processData: false,
            xhrFields: xhrFields
          };
          $.cors(options);
        };
      // CORS with JSON
      $.postJSON = function(url, data, callback) {
        $.ajaxSetup({
          contentType: 'application/json; charset=utf-8'
        });
        $.postCORS(url, JSON.stringify(data), callback, 'json');
      };
      $.putJSON = function(url, data, callback) {
        $.ajaxSetup({
          contentType: 'application/json; charset=utf-8'
        });
        $.putCORS(url, JSON.stringify(data), callback, 'json');
      };
      $.deleteJSON = function(url, data, callback) {
        $.deleteCORS(url, data, callback, 'json');
      };
      $.corsJSON = function(type, url, data, success, error) {
        $.ajaxSetup({
          error: error,
          contentType: 'application/json; charset=utf-8'
        });
        $.cors({
          type: type,
          url: url,
          data: data,
          dataType: 'json',
          success: success,
          error: error
        });
      };

})(jQuery);

//Cross-domain ajax for IE8+
$.ajaxTransport("+*", function( options, originalOptions, jqXHR ) {
	if(jQuery.browser.msie && window.XDomainRequest) {
		var xdr;
        return {
        		send: function( headers, completeCallback ) {
                // Use Microsoft XDR
                xdr = new XDomainRequest();
                if(options.type == 'PUT' || options.type == 'DELETE') {
                	var methodData = "_method=" + options.type;
                	if(options.data) {
                		options.data += "&" + methodData;
                	} else {
                		options.data = methodData;
                	}
                	options.type = 'POST';
                }
                xdr.open(options.type, options.url);
                xdr.onload = function() {
                    if(this.contentType.match(/\/xml/)){
                        var dom = new ActiveXObject("Microsoft.XMLDOM");
                        dom.async = false;
                        dom.loadXML(this.responseText);
                        completeCallback(200, "success", [dom]);
                    } else {
                        completeCallback(200, "success", [this.responseText]);
                    }
                };
                
                xdr.ontimeout = function(){
                    completeCallback(408, "error", ["Request timed out."]);
                };
                
                xdr.onerror = function(){
                    completeCallback(404, "error", ["The requested resource could not be found."]);
                };
                
                xdr.send(options.data);
          },
          abort: function() {
              if(xdr)xdr.abort();
          }
        };
	}
});
// XMLHTTP JS class is is developed by Alex Serebryakov (#0.9.1)
// For more information, consult www.ajaxextended.com
// Stolen from http://bit.ly/cpTekr

// What's new in 0.9.1:
// - fixed the _createQuery function (used to force multipart requests)
// - fixed the getResponseHeader function (incorrect search)
// - fixed the _parseXML function (bug in the ActiveX parsing section)
// - fixed the _destroyScripts function (DOM errors reported)

jQuery.proxy_xmlhttp = function(apiURL) {

  // The following two options are configurable
  // you don't need to change the rest. Plug & play!
  var _maximumRequestLength = 1500;
  var _apiURL = apiURL || 'http://' + window.location.hostname + '/xmlhttp/';

  this.status = null;
  this.statusText = null;
  this.responseText = null;
  this.responseXML = null;
  this.synchronous = false;
  this.readyState = 0;
  
  this.onreadystatechange =  function() { };
  this.onerror = function() { };
  this.onload = function() { };
  
  this.abort = function() {
    _stop = true;
    _destroyScripts();
  };
  
  this.getAllResponseHeaders = function() {
    // Returns all response headers as a string
    var result = '';
    for (var property in _responseHeaders) {
      result += property + ': ' + _responseHeaders[property] + '\r\n';
    }
    return result;
  };
  
  this.getResponseHeader = function(name) {
    // Returns a response header value
    // Note, that the search is case-insensitive
    for(var property in _responseHeaders) {
      if(property.toLowerCase() == name.toLowerCase()) {
        return _responseHeaders[property];
      }
    }
    return null;
  };
  
  this.overrideMimeType = function(type) {
    _overrideMime = type;
  };
  
  this.open = function(method, url, sync, userName, password) {
    // Setting the internal values
    if (!_checkParameters(method, url)) {
        return;
    }
    _method = (method) ? method : '';
    _url = (url) ? url : '';
    _userName = (userName) ? userName : '';
    _password = (password) ? password : '';
    _setReadyState(1);
  };
  
  this.openRequest = function(method, url, sync, userName, password) {
    // This method is inserted for compatibility purposes only
    return this.open(method, url, sync, userName, password);
  };
  
  this.send = function(data) {
    if (_stop) {
        return;
    }
    var src = _createQuery(data);
    _createScript(src);
//    _setReadyState(2);
  };
  
  this.setRequestHeader = function(name, value) {
    // Set the request header. If the defined header
    // already exists (search is case-insensitive), rewrite it
    if (_stop) {
        return;
    }
    for(var property in _requestHeaders) {
      if(property.toLowerCase() == name.toLowerCase()) {
        _requestHeaders[property] = value; return;
      }
    }
    _requestHeaders[name] = value;
  };
  
  var _method = '';
  var _url = '';
  var _userName = '';
  var _password = '';
  var _requestHeaders = {
    "HTTP-Referer": escape(document.location),
    "Content-Type": "application/x-www-form-urlencoded"
  };
  var _responseHeaders = { };
  var _overrideMime = "";
  var self = this;
  var _id = '';
  var _scripts = [];
  var _stop = false;
  
  var _throwError = function(description) {
    // Stop script execution and run
    // the user-defined error handler
    self.onerror(description);
    self.abort();
    return false;
  };
  
  var _createQuery = function(data) {
    if(!data) {
      data = '';
    }
    var headers = '';
    for (var property in _requestHeaders) {
      headers += property + '=' + _requestHeaders[property] + '&';
    }
    var originalsrc = _method +
    '$' + _id + 
    '$' + _userName +
    '$' + _password + 
    '$' + headers + 
    '$' + _escape(data) +
    '$' + _url;
    var src = originalsrc;
    var max =  _maximumRequestLength, request = [];
    var total = Math.floor(src.length / max), current = 0;
    while(src.length > 0) {
      var query = _apiURL + '?' + 'multipart' + '$' + _id + '$' + current++ + '$' + total + '$' + src.substr(0, max);
      request.push(query);
      src = src.substr(max);
    }
    if(request.length == 1) {
      src = _apiURL + '?' + originalsrc;
    } else {
      src = request;
    }
    return src;
  };
  
  var _checkParameters = function(method, url) {
    // Check the method value (GET, POST, HEAD)
    // and the prefix of the url (http://)
    if(!method) {
      return _throwError('Please, specify the query method (GET, POST or HEAD)');
    }
    if(!url) {
      return _throwError('Please, specify the URL');
    }
    if(method.toLowerCase() != 'get' &&
      method.toLowerCase() != 'post' &&
      method.toLowerCase() != 'put' &&
      method.toLowerCase() != 'delete' &&
      method.toLowerCase() != 'options' &&
      method.toLowerCase() != 'head') {
      return _throwError('Please, specify either a GET, POST or a HEAD method');
    }
    if(url.toLowerCase().substr(0,7) != 'http://') {
      return _throwError('Only HTTP protocol is supported (http://)');
    }
    return true;
  };

  var _createScript = function(src) {
    if ('object' == typeof src) {
      for(var i = 0; i < src.length; i++) {
        _createScript(src[i]);
      }
      return true;
    }
    // Create the SCRIPT tag
    var script = document.createElement('script');
    script.src = src;
    script.type = 'text/javascript';
    if (navigator.userAgent.indexOf('Safari')){
      script.charset = 'utf-8'; // Safari bug
    }
    script = document.getElementsByTagName('head')[0].appendChild(script);
    _scripts.push(script);
    return script;
  };
  
  var _escape = function(string) {
    // Native escape() function doesn't quote the plus sign +
    string = escape(string);
    string = string.replace('+', '%2B');
    return string;
  };
  
  var _destroyScripts = function() {
    // Removes the SCRIPT nodes used by the class
    for(var i = 0; i < _scripts.length; i++) {
      if(_scripts[i].parentNode) {
        _scripts[i].parentNode.removeChild(_scripts[i]);
      }
    }
  };
  
  var _registerCallback = function() {
    // Register a callback variable (in global scope)
    // that points to current instance of the class
    _id = 'v' + Math.random().toString().substr(2);
    window[_id] = self;
  };
  
  var _setReadyState = function(number) {
    // Set the ready state property of the class
    self.readyState = number;
    self.onreadystatechange();
    if(number == 4) {
      self.onload();
    }
  };
    
  var _parseXML = function() {
      var type = self.getResponseHeader('Content-type') + _overrideMime;
      if(!(type.indexOf('html') > -1 || type.indexOf('xml') > -1)) {
        return;
      }
      var xml;
      if(document.implementation &&
        document.implementation.createDocument &&
        navigator.userAgent.indexOf('Opera') == -1) {
        var parser = new DOMParser();
        xml = parser.parseFromString(self.responseText, "text/xml");
        self.responseXML = xml;
      } else if (window.ActiveXObject) {
        xml = new ActiveXObject('MSXML2.DOMDocument.3.0');
        if (xml.loadXML(self.responseText)) {
          self.responseXML = xml;
        }
      } else {
        xml = document.body.appendChild(document.createElement('div'));
        xml.style.display = 'none';
        xml.innerHTML = self.responseText;
        _cleanWhitespace(xml, true);
        self.responseXML = xml.childNodes[0];
        document.body.removeChild(xml);
     }
  };
  
  var _cleanWhitespace = function(element, deep) {
    var i = element.childNodes.length;
    if(i === 0) {
      return;
    }
    do {
      var node = element.childNodes[--i];
      if (node.nodeType == 3 && !_cleanEmptySymbols(node.nodeValue)) {
        element.removeChild(node);
      }
      if (node.nodeType == 1 && deep) {
        _cleanWhitespace(node, true);
      }
    } while(i > 0);
  };

  var _cleanEmptySymbols = function(string) {
    string = string.replace('\r', '');
    string = string.replace('\n', '');
    string = string.replace(' ', '');
    return (string.length === 0) ? false : true; 
  };
 
  this._parse = function(object) {
    // Parse the received data and set all
    // the appropriate properties of the class
    if(_stop) {
      return true;
    }
    if(object.multipart) {
      return true;
    }
    if(!object.success) {
      return _throwError(object.description);
    }
    _responseHeaders = object.responseHeaders;
    this.status = object.status;
    this.statusText = object.statusText;
    this.responseText = object.responseText;
    _parseXML();
    _destroyScripts();
    _setReadyState(4);
    return true;
  };
    
   _registerCallback();

};
(function(b,j){if(b.cleanData){var k=b.cleanData;b.cleanData=function(a){for(var c=0,d;(d=a[c])!=null;c++)try{b(d).triggerHandler("remove")}catch(e){}k(a)}}else{var l=b.fn.remove;b.fn.remove=function(a,c){return this.each(function(){if(!c)if(!a||b.filter(a,[this]).length)b("*",this).add([this]).each(function(){try{b(this).triggerHandler("remove")}catch(d){}});return l.call(b(this),a,c)})}}b.widget=function(a,c,d){var e=a.split(".")[0],f;a=a.split(".")[1];f=e+"-"+a;if(!d){d=c;c=b.Widget}b.expr[":"][f]=
function(h){return!!b.data(h,a)};b[e]=b[e]||{};b[e][a]=function(h,g){arguments.length&&this._createWidget(h,g)};c=new c;c.options=b.extend(true,{},c.options);b[e][a].prototype=b.extend(true,c,{namespace:e,widgetName:a,widgetEventPrefix:b[e][a].prototype.widgetEventPrefix||a,widgetBaseClass:f},d);b.widget.bridge(a,b[e][a])};b.widget.bridge=function(a,c){b.fn[a]=function(d){var e=typeof d==="string",f=Array.prototype.slice.call(arguments,1),h=this;d=!e&&f.length?b.extend.apply(null,[true,d].concat(f)):
d;if(e&&d.charAt(0)==="_")return h;e?this.each(function(){var g=b.data(this,a),i=g&&b.isFunction(g[d])?g[d].apply(g,f):g;if(i!==g&&i!==j){h=i;return false}}):this.each(function(){var g=b.data(this,a);g?g.option(d||{})._init():b.data(this,a,new c(d,this))});return h}};b.Widget=function(a,c){arguments.length&&this._createWidget(a,c)};b.Widget.prototype={widgetName:"widget",widgetEventPrefix:"",options:{disabled:false},_createWidget:function(a,c){b.data(c,this.widgetName,this);this.element=b(c);this.options=
b.extend(true,{},this.options,this._getCreateOptions(),a);var d=this;this.element.bind("remove."+this.widgetName,function(){d.destroy()});this._create();this._trigger("create");this._init()},_getCreateOptions:function(){return b.metadata&&b.metadata.get(this.element[0])[this.widgetName]},_create:function(){},_init:function(){},destroy:function(){this.element.unbind("."+this.widgetName).removeData(this.widgetName);this.widget().unbind("."+this.widgetName).removeAttr("aria-disabled").removeClass(this.widgetBaseClass+
"-disabled ui-state-disabled")},widget:function(){return this.element},option:function(a,c){var d=a;if(arguments.length===0)return b.extend({},this.options);if(typeof a==="string"){if(c===j)return this.options[a];d={};d[a]=c}this._setOptions(d);return this},_setOptions:function(a){var c=this;b.each(a,function(d,e){c._setOption(d,e)});return this},_setOption:function(a,c){this.options[a]=c;if(a==="disabled")this.widget()[c?"addClass":"removeClass"](this.widgetBaseClass+"-disabled ui-state-disabled").attr("aria-disabled",
c);return this},enable:function(){return this._setOption("disabled",false)},disable:function(){return this._setOption("disabled",true)},_trigger:function(a,c,d){var e=this.options[a];c=b.Event(c);c.type=(a===this.widgetEventPrefix?a:this.widgetEventPrefix+a).toLowerCase();d=d||{};if(c.originalEvent){a=b.event.props.length;for(var f;a;){f=b.event.props[--a];c[f]=c.originalEvent[f]}}this.element.trigger(c,d);return!(b.isFunction(e)&&e.call(this.element[0],c,d)===false||c.isDefaultPrevented())}}})(jQuery);
;/*
 * jQuery File Upload Plugin 5.1
 * https://github.com/blueimp/jQuery-File-Upload
 *
 * Copyright 2010, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://creativecommons.org/licenses/MIT/
 */

/*jslint nomen: true, unparam: true, regexp: true */
/*global document, XMLHttpRequestUpload, Blob, File, FormData, location, jQuery */

(function ($) {
    'use strict';

    // The fileupload widget listens for change events on file input fields
    // defined via fileInput setting and drop events of the given dropZone.
    // In addition to the default jQuery Widget methods, the fileupload widget
    // exposes the "add" and "send" methods, to add or directly send files
    // using the fileupload API.
    // By default, files added via file input selection, drag & drop or
    // "add" method are uploaded immediately, but it is possible to override
    // the "add" callback option to queue file uploads.
    $.widget('blueimp.fileupload', {
        
        options: {
            // The namespace used for event handler binding on the dropZone and
            // fileInput collections.
            // If not set, the name of the widget ("fileupload") is used.
            namespace: undefined,
            // The drop target collection, by the default the complete document.
            // Set to null or an empty collection to disable drag & drop support:
            dropZone: $(document),
            // The file input field collection, that is listened for change events.
            // If undefined, it is set to the file input fields inside
            // of the widget element on plugin initialization.
            // Set to null or an empty collection to disable the change listener.
            fileInput: undefined,
            // By default, the file input field is replaced with a clone after
            // each input field change event. This is required for iframe transport
            // queues and allows change events to be fired for the same file
            // selection, but can be disabled by setting the following option to false:
            replaceFileInput: true,
            // The parameter name for the file form data (the request argument name).
            // If undefined or empty, the name property of the file input field is
            // used, or "files[]" if the file input name property is also empty:
            paramName: undefined,
            // By default, each file of a selection is uploaded using an individual
            // request for XHR type uploads. Set to false to upload file
            // selections in one request each:
            singleFileUploads: true,
            // Set the following option to true to issue all file upload requests
            // in a sequential order:
            sequentialUploads: false,
            // To limit the number of concurrent uploads,
            // set the following option to an integer greater than 0:
            limitConcurrentUploads: undefined,
            // Set the following option to true to force iframe transport uploads:
            forceIframeTransport: false,
            // By default, XHR file uploads are sent as multipart/form-data.
            // The iframe transport is always using multipart/form-data.
            // Set to false to enable non-multipart XHR uploads:
            multipart: true,
            // To upload large files in smaller chunks, set the following option
            // to a preferred maximum chunk size. If set to 0, null or undefined,
            // or the browser does not support the required Blob API, files will
            // be uploaded as a whole.
            maxChunkSize: undefined,
            // When a non-multipart upload or a chunked multipart upload has been
            // aborted, this option can be used to resume the upload by setting
            // it to the size of the already uploaded bytes. This option is most
            // useful when modifying the options object inside of the "add" or
            // "send" callbacks, as the options are cloned for each file upload.
            uploadedBytes: undefined,
            // By default, failed (abort or error) file uploads are removed from the
            // global progress calculation. Set the following option to false to
            // prevent recalculating the global progress data:
            recalculateProgress: true,
            
            // Additional form data to be sent along with the file uploads can be set
            // using this option, which accepts an array of objects with name and
            // value properties, a function returning such an array, a FormData
            // object (for XHR file uploads), or a simple object.
            // The form of the first fileInput is given as parameter to the function:
            formData: function (form) {
                return form.serializeArray();
            },
            
            // The add callback is invoked as soon as files are added to the fileupload
            // widget (via file input selection, drag & drop or add API call).
            // If the singleFileUploads option is enabled, this callback will be
            // called once for each file in the selection for XHR file uplaods, else
            // once for each file selection.
            // The upload starts when the submit method is invoked on the data parameter.
            // The data object contains a files property holding the added files
            // and allows to override plugin options as well as define ajax settings.
            // Listeners for this callback can also be bound the following way:
            // .bind('fileuploadadd', func);
            // data.submit() returns a Promise object and allows to attach additional
            // handlers using jQuery's Deferred callbacks:
            // data.submit().done(func).fail(func).always(func);
            add: function (e, data) {
                data.submit();
            },
            
            // Other callbacks:
            // Callback for the start of each file upload request:
            // send: function (e, data) {}, // .bind('fileuploadsend', func);
            // Callback for successful uploads:
            // done: function (e, data) {}, // .bind('fileuploaddone', func);
            // Callback for failed (abort or error) uploads:
            // fail: function (e, data) {}, // .bind('fileuploadfail', func);
            // Callback for completed (success, abort or error) requests:
            // always: function (e, data) {}, // .bind('fileuploadalways', func);
            // Callback for upload progress events:
            // progress: function (e, data) {}, // .bind('fileuploadprogress', func);
            // Callback for global upload progress events:
            // progressall: function (e, data) {}, // .bind('fileuploadprogressall', func);
            // Callback for uploads start, equivalent to the global ajaxStart event:
            // start: function (e) {}, // .bind('fileuploadstart', func);
            // Callback for uploads stop, equivalent to the global ajaxStop event:
            // stop: function (e) {}, // .bind('fileuploadstop', func);
            // Callback for change events of the fileInput collection:
            // change: function (e, data) {}, // .bind('fileuploadchange', func);
            // Callback for drop events of the dropZone collection:
            // drop: function (e, data) {}, // .bind('fileuploaddrop', func);
            // Callback for dragover events of the dropZone collection:
            // dragover: function (e) {}, // .bind('fileuploaddragover', func);
            
            // The plugin options are used as settings object for the ajax calls.
            // The following are jQuery ajax settings required for the file uploads:
            processData: false,
            contentType: false,
            cache: false
        },
        
        // A list of options that require a refresh after assigning a new value:
        _refreshOptionsList: ['namespace', 'dropZone', 'fileInput'],

        _isXHRUpload: function (options) {
            var undef = 'undefined';
            return !options.forceIframeTransport &&
                typeof XMLHttpRequestUpload !== undef && typeof File !== undef &&
                (!options.multipart || typeof FormData !== undef);
        },

        _getFormData: function (options) {
            var formData;
            if (typeof options.formData === 'function') {
                return options.formData(options.form);
            } else if ($.isArray(options.formData)) {
                return options.formData;
            } else if (options.formData) {
                formData = [];
                $.each(options.formData, function (name, value) {
                    formData.push({name: name, value: value});
                });
                return formData;
            }
            return [];
        },

        _getTotal: function (files) {
            var total = 0;
            $.each(files, function (index, file) {
                total += file.size || 1;
            });
            return total;
        },

        _onProgress: function (e, data) {
            if (e.lengthComputable) {
                var total = data.total || this._getTotal(data.files),
                    loaded = parseInt(
                        e.loaded / e.total * (data.chunkSize || total),
                        10
                    ) + (data.uploadedBytes || 0);
                this._loaded += loaded - (data.loaded || data.uploadedBytes || 0);
                data.lengthComputable = true;
                data.loaded = loaded;
                data.total = total;
                // Trigger a custom progress event with a total data property set
                // to the file size(s) of the current upload and a loaded data
                // property calculated accordingly:
                this._trigger('progress', e, data);
                // Trigger a global progress event for all current file uploads,
                // including ajax calls queued for sequential file uploads:
                this._trigger('progressall', e, {
                    lengthComputable: true,
                    loaded: this._loaded,
                    total: this._total
                });
            }
        },

        _initProgressListener: function (options) {
            var that = this,
                xhr = options.xhr ? options.xhr() : $.ajaxSettings.xhr();
            // Accesss to the native XHR object is required to add event listeners
            // for the upload progress event:
            if (xhr.upload && xhr.upload.addEventListener) {
                xhr.upload.addEventListener('progress', function (e) {
                    that._onProgress(e, options);
                }, false);
                options.xhr = function () {
                    return xhr;
                };
            }
        },

        _initXHRData: function (options) {
            var formData,
                file = options.files[0];
            if (!options.multipart || options.blob) {
                // For non-multipart uploads and chunked uploads,
                // file meta data is not part of the request body,
                // so we transmit this data as part of the HTTP headers.
                // For cross domain requests, these headers must be allowed
                // via Access-Control-Allow-Headers or removed using
                // the beforeSend callback:
                options.headers = $.extend(options.headers, {
                    'X-File-Name': file.name,
                    'X-File-Type': file.type,
                    'X-File-Size': file.size
                });
                if (!options.blob) {
                    // Non-chunked non-multipart upload:
                    options.contentType = file.type;
                    options.data = file;
                } else if (!options.multipart) {
                    // Chunked non-multipart upload:
                    options.contentType = 'application/octet-stream';
                    options.data = options.blob;
                }
            }
            if (options.multipart && typeof FormData !== 'undefined') {
                if (options.formData instanceof FormData) {
                    formData = options.formData;
                } else {
                    formData = new FormData();
                    $.each(this._getFormData(options), function (index, field) {
                        formData.append(field.name, field.value);
                    });
                }
                if (options.blob) {
                    formData.append(options.paramName, options.blob);
                } else {
                    $.each(options.files, function (index, file) {
                        // File objects are also Blob instances.
                        // This check allows the tests to run with
                        // dummy objects:
                        if (file instanceof Blob) {
                            formData.append(options.paramName, file);
                        }
                    });
                }
                options.data = formData;
            }
            // Blob reference is not needed anymore, free memory:
            options.blob = null;
        },
        
        _initIframeSettings: function (options) {
            // Setting the dataType to iframe enables the iframe transport:
            options.dataType = 'iframe ' + (options.dataType || '');
            // The iframe transport accepts a serialized array as form data:
            options.formData = this._getFormData(options);
        },
        
        _initDataSettings: function (options) {
            if (this._isXHRUpload(options)) {
                if (!this._chunkedUpload(options, true)) {
                    if (!options.data) {
                        this._initXHRData(options);
                    }
                    this._initProgressListener(options);
                }
            } else {
                this._initIframeSettings(options);
            }
        },
        
        _initFormSettings: function (options) {
            // Retrieve missing options from the input field and the
            // associated form, if available:
            if (!options.form || !options.form.length) {
                options.form = $(options.fileInput.prop('form'));
            }
            if (!options.paramName) {
                options.paramName = options.fileInput.prop('name') ||
                    'files[]';
            }
            if (!options.url) {
                options.url = options.form.prop('action') || location.href;
            }
            // The HTTP request method must be "POST" or "PUT":
            options.type = (options.type || options.form.prop('method') || '')
                .toUpperCase();
            if (options.type !== 'POST' && options.type !== 'PUT') {
                options.type = 'POST';
            }
        },
        
        _getAJAXSettings: function (data) {
            var options = $.extend({}, this.options, data);
            this._initFormSettings(options);
            this._initDataSettings(options);
            return options;
        },

        // Maps jqXHR callbacks to the equivalent
        // methods of the given Promise object:
        _enhancePromise: function (promise) {
            promise.success = promise.done;
            promise.error = promise.fail;
            promise.complete = promise.always;
            return promise;
        },

        // Creates and returns a Promise object enhanced with
        // the jqXHR methods abort, success, error and complete:
        _getXHRPromise: function (resolveOrReject, context, args) {
            var dfd = $.Deferred(),
                promise = dfd.promise();
            context = context || this.options.context || promise;
            if (resolveOrReject === true) {
                dfd.resolveWith(context, args);
            } else if (resolveOrReject === false) {
                dfd.rejectWith(context, args);
            }
            promise.abort = dfd.promise;
            return this._enhancePromise(promise);
        },

        // Uploads a file in multiple, sequential requests
        // by splitting the file up in multiple blob chunks.
        // If the second parameter is true, only tests if the file
        // should be uploaded in chunks, but does not invoke any
        // upload requests:
        _chunkedUpload: function (options, testOnly) {
            var that = this,
                file = options.files[0],
                fs = file.size,
                ub = options.uploadedBytes = options.uploadedBytes || 0,
                mcs = options.maxChunkSize || fs,
                // Use the Blob methods with the slice implementation
                // according to the W3C Blob API specification:
                slice = file.webkitSlice || file.mozSlice || file.slice,
                upload,
                n,
                jqXHR,
                pipe;
            if (!(this._isXHRUpload(options) && slice && (ub || mcs < fs)) ||
                    options.data) {
                return false;
            }
            if (testOnly) {
                return true;
            }
            if (ub >= fs) {
                file.error = 'uploadedBytes';
                return this._getXHRPromise(false);
            }
            // n is the number of blobs to upload,
            // calculated via filesize, uploaded bytes and max chunk size:
            n = Math.ceil((fs - ub) / mcs);
            // The chunk upload method accepting the chunk number as parameter:
            upload = function (i) {
                if (!i) {
                    return that._getXHRPromise(true);
                }
                // Upload the blobs in sequential order:
                return upload(i -= 1).pipe(function () {
                    // Clone the options object for each chunk upload:
                    var o = $.extend({}, options);
                    o.blob = slice.call(
                        file,
                        ub + i * mcs,
                        ub + (i + 1) * mcs
                    );
                    // Store the current chunk size, as the blob itself
                    // will be dereferenced after data processing:
                    o.chunkSize = o.blob.size;
                    // Process the upload data (the blob and potential form data):
                    that._initXHRData(o);
                    // Add progress listeners for this chunk upload:
                    that._initProgressListener(o);
                    jqXHR = ($.ajax(o) || that._getXHRPromise(false, o.context))
                        .done(function () {
                            // Create a progress event if upload is done and
                            // no progress event has been invoked for this chunk:
                            if (!o.loaded) {
                                that._onProgress($.Event('progress', {
                                    lengthComputable: true,
                                    loaded: o.chunkSize,
                                    total: o.chunkSize
                                }), o);
                            }
                            options.uploadedBytes = o.uploadedBytes
                                += o.chunkSize;
                        });
                    return jqXHR;
                });
            };
            // Return the piped Promise object, enhanced with an abort method,
            // which is delegated to the jqXHR object of the current upload,
            // and jqXHR callbacks mapped to the equivalent Promise methods:
            pipe = upload(n);
            pipe.abort = function () {
                return jqXHR.abort();
            };
            return this._enhancePromise(pipe);
        },

        _beforeSend: function (e, data) {
            if (this._active === 0) {
                // the start callback is triggered when an upload starts
                // and no other uploads are currently running,
                // equivalent to the global ajaxStart event:
                this._trigger('start');
            }
            this._active += 1;
            // Initialize the global progress values:
            this._loaded += data.uploadedBytes || 0;
            this._total += this._getTotal(data.files);
        },

        _onDone: function (result, textStatus, jqXHR, options) {
            if (!this._isXHRUpload(options)) {
                // Create a progress event for each iframe load:
                this._onProgress($.Event('progress', {
                    lengthComputable: true,
                    loaded: 1,
                    total: 1
                }), options);
            }
            options.result = result;
            options.textStatus = textStatus;
            options.jqXHR = jqXHR;
            this._trigger('done', null, options);
        },

        _onFail: function (jqXHR, textStatus, errorThrown, options) {
            options.jqXHR = jqXHR;
            options.textStatus = textStatus;
            options.errorThrown = errorThrown;
            this._trigger('fail', null, options);
            if (options.recalculateProgress) {
                // Remove the failed (error or abort) file upload from
                // the global progress calculation:
                this._loaded -= options.loaded || options.uploadedBytes || 0;
                this._total -= options.total || this._getTotal(options.files);
            }
        },

        _onAlways: function (result, textStatus, jqXHR, errorThrown, options) {
            this._active -= 1;
            options.result = result;
            options.textStatus = textStatus;
            options.jqXHR = jqXHR;
            options.errorThrown = errorThrown;
            this._trigger('always', null, options);
            if (this._active === 0) {
                // The stop callback is triggered when all uploads have
                // been completed, equivalent to the global ajaxStop event:
                this._trigger('stop');
                // Reset the global progress values:
                this._loaded = this._total = 0;
            }
        },

        _onSend: function (e, data) {
            var that = this,
                jqXHR,
                slot,
                pipe,
                options = that._getAJAXSettings(data),
                send = function (resolve, args) {
                    that._sending += 1;
                    jqXHR = jqXHR || (
                        (resolve !== false &&
                        that._trigger('send', e, options) !== false &&
                        (that._chunkedUpload(options) || $.ajax(options))) ||
                        that._getXHRPromise(false, options.context, args)
                    ).done(function (result, textStatus, jqXHR) {
                        that._onDone(result, textStatus, jqXHR, options);
                    }).fail(function (jqXHR, textStatus, errorThrown) {
                        that._onFail(jqXHR, textStatus, errorThrown, options);
                    }).always(function (a1, a2, a3) {
                        that._sending -= 1;
                        if (a3 && a3.done) {
                            that._onAlways(a1, a2, a3, undefined, options);
                        } else {
                            that._onAlways(undefined, a2, a1, a3, options);
                        }
                        if (options.limitConcurrentUploads &&
                                options.limitConcurrentUploads > that._sending) {
                            // Start the next queued upload,
                            // that has not been aborted:
                            var nextSlot = that._slots.shift();
                            while (nextSlot) {
                                if (!nextSlot.isRejected()) {
                                    nextSlot.resolve();
                                    break;
                                }
                                nextSlot = that._slots.shift();
                            }
                        }
                    });
                    return jqXHR;
                };
            this._beforeSend(e, options);
            if (this.options.sequentialUploads ||
                    (this.options.limitConcurrentUploads &&
                    this.options.limitConcurrentUploads <= this._sending)) {
                if (this.options.limitConcurrentUploads > 1) {
                    slot = $.Deferred();
                    this._slots.push(slot);
                    pipe = slot.pipe(send);
                } else {
                    pipe = (this._sequence = this._sequence.pipe(send, send));
                }
                // Return the piped Promise object, enhanced with an abort method,
                // which is delegated to the jqXHR object of the current upload,
                // and jqXHR callbacks mapped to the equivalent Promise methods:
                pipe.abort = function () {
                    var args = [undefined, 'abort', 'abort'];
                    if (!jqXHR) {
                        if (slot) {
                            slot.rejectWith(args);
                        }
                        return send(false, args);
                    }
                    return jqXHR.abort();
                };
                return this._enhancePromise(pipe);
            }
            return send();
        },
        
        _onAdd: function (e, data) {
            var that = this,
                result = true,
                options = $.extend({}, this.options, data);
            if (options.singleFileUploads && this._isXHRUpload(options)) {
                $.each(data.files, function (index, file) {
                    var newData = $.extend({}, data, {files: [file]});
                    newData.submit = function () {
                        return that._onSend(e, newData);
                    };
                    return (result = that._trigger('add', e, newData));
                });
                return result;
            } else if (data.files.length) {
                data = $.extend({}, data);
                data.submit = function () {
                    return that._onSend(e, data);
                };
                return this._trigger('add', e, data);
            }
        },
        
        // File Normalization for Gecko 1.9.1 (Firefox 3.5) support:
        _normalizeFile: function (index, file) {
            if (file.name === undefined && file.size === undefined) {
                file.name = file.fileName;
                file.size = file.fileSize;
            }
        },

        _replaceFileInput: function (input) {
            var inputClone = input.clone(true);
            $('<form></form>').append(inputClone)[0].reset();
            // Detaching allows to insert the fileInput on another form
            // without loosing the file input value:
            input.after(inputClone).detach();
            // Replace the original file input element in the fileInput
            // collection with the clone, which has been copied including
            // event handlers:
            this.options.fileInput = this.options.fileInput.map(function (i, el) {
                if (el === input[0]) {
                    return inputClone[0];
                }
                return el;
            });
        },
        
        _onChange: function (e) {
            var that = e.data.fileupload,
                data = {
                    files: $.each($.makeArray(e.target.files), that._normalizeFile),
                    fileInput: $(e.target),
                    form: $(e.target.form)
                };
            if (!data.files.length) {
                // If the files property is not available, the browser does not
                // support the File API and we add a pseudo File object with
                // the input value as name with path information removed:
                data.files = [{name: e.target.value.replace(/^.*\\/, '')}];
            }
            // Store the form reference as jQuery data for other event handlers,
            // as the form property is not available after replacing the file input: 
            if (data.form.length) {
                data.fileInput.data('blueimp.fileupload.form', data.form);
            } else {
                data.form = data.fileInput.data('blueimp.fileupload.form');
            }
            if (that.options.replaceFileInput) {
                that._replaceFileInput(data.fileInput);
            }
            if (that._trigger('change', e, data) === false ||
                    that._onAdd(e, data) === false) {
                return false;
            }
        },
        
        _onDrop: function (e) {
            var that = e.data.fileupload,
                dataTransfer = e.dataTransfer = e.originalEvent.dataTransfer,
                data = {
                    files: $.each(
                        $.makeArray(dataTransfer && dataTransfer.files),
                        that._normalizeFile
                    )
                };
            if (that._trigger('drop', e, data) === false ||
                    that._onAdd(e, data) === false) {
                return false;
            }
            e.preventDefault();
        },
        
        _onDragOver: function (e) {
            var that = e.data.fileupload,
                dataTransfer = e.dataTransfer = e.originalEvent.dataTransfer;
            if (that._trigger('dragover', e) === false) {
                return false;
            }
            if (dataTransfer) {
                dataTransfer.dropEffect = dataTransfer.effectAllowed = 'copy';
            }
            e.preventDefault();
        },
        
        _initEventHandlers: function () {
            var ns = this.options.namespace || this.name;
            this.options.dropZone
                .bind('dragover.' + ns, {fileupload: this}, this._onDragOver)
                .bind('drop.' + ns, {fileupload: this}, this._onDrop);
            this.options.fileInput
                .bind('change.' + ns, {fileupload: this}, this._onChange);
        },

        _destroyEventHandlers: function () {
            var ns = this.options.namespace || this.name;
            this.options.dropZone
                .unbind('dragover.' + ns, this._onDragOver)
                .unbind('drop.' + ns, this._onDrop);
            this.options.fileInput
                .unbind('change.' + ns, this._onChange);
        },
        
        _beforeSetOption: function (key, value) {
            this._destroyEventHandlers();
        },
        
        _afterSetOption: function (key, value) {
            var options = this.options;
            if (!options.fileInput) {
                options.fileInput = $();
            }
            if (!options.dropZone) {
                options.dropZone = $();
            }
            this._initEventHandlers();
        },
        
        _setOption: function (key, value) {
            var refresh = $.inArray(key, this._refreshOptionsList) !== -1;
            if (refresh) {
                this._beforeSetOption(key, value);
            }
            $.Widget.prototype._setOption.call(this, key, value);
            if (refresh) {
                this._afterSetOption(key, value);
            }
        },

        _create: function () {
            var options = this.options;
            if (options.fileInput === undefined) {
                options.fileInput = this.element.is('input:file') ?
                    this.element : this.element.find('input:file');
            } else if (!options.fileInput) {
                options.fileInput = $();
            }
            if (!options.dropZone) {
                options.dropZone = $();
            }
            this._slots = [];
            this._sequence = this._getXHRPromise(true);
            this._sending = this._active = this._loaded = this._total = 0;
            this._initEventHandlers();
        },
        
        destroy: function () {
            this._destroyEventHandlers();
            $.Widget.prototype.destroy.call(this);
        },

        enable: function () {
            $.Widget.prototype.enable.call(this);
            this._initEventHandlers();
        },
        
        disable: function () {
            this._destroyEventHandlers();
            $.Widget.prototype.disable.call(this);
        },

        // This method is exposed to the widget API and allows adding files
        // using the fileupload API. The data parameter accepts an object which
        // must have a files property and can contain additional options:
        // .fileupload('add', {files: filesList});
        add: function (data) {
            if (!data || this.options.disabled) {
                return;
            }
            data.files = $.each($.makeArray(data.files), this._normalizeFile);
            this._onAdd(null, data);
        },
        
        // This method is exposed to the widget API and allows sending files
        // using the fileupload API. The data parameter accepts an object which
        // must have a files property and can contain additional options:
        // .fileupload('send', {files: filesList});
        // The method returns a Promise object for the file upload call.
        send: function (data) {
            if (data && !this.options.disabled) {
                data.files = $.each($.makeArray(data.files), this._normalizeFile);
                if (data.files.length) {
                    return this._onSend(null, data);
                }
            }
            return this._getXHRPromise(false, data && data.context);
        }
        
    });
    
}(jQuery));/*
 * jQuery Iframe Transport Plugin 1.2.2
 * https://github.com/blueimp/jQuery-File-Upload
 *
 * Copyright 2011, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://creativecommons.org/licenses/MIT/
 */

/*jslint unparam: true */
/*global jQuery */

(function ($) {
    'use strict';

    // Helper variable to create unique names for the transport iframes:
    var counter = 0;

    // The iframe transport accepts three additional options:
    // options.fileInput: a jQuery collection of file input fields
    // options.paramName: the parameter name for the file form data,
    //  overrides the name property of the file input field(s)
    // options.formData: an array of objects with name and value properties,
    //  equivalent to the return data of .serializeArray(), e.g.:
    //  [{name: a, value: 1}, {name: b, value: 2}]
    $.ajaxTransport('iframe', function (options, originalOptions, jqXHR) {
        if (options.type === 'POST' || options.type === 'GET') {
            var form,
                iframe;
            return {
                send: function (headers, completeCallback) {
                    form = $('<form style="display:none;"></form>');
                    // javascript:false as initial iframe src
                    // prevents warning popups on HTTPS in IE6.
                    // IE versions below IE8 cannot set the name property of
                    // elements that have already been added to the DOM,
                    // so we set the name along with the iframe HTML markup:
                    iframe = $(
                        '<iframe src="javascript:false;" name="iframe-transport-' +
                            (counter += 1) + '"></iframe>'
                    ).bind('load', function () {
                        var fileInputClones;
                        
                        var getIframeContent = function(event) {
                        	if(event.data) {
                        		var response;
                                // Wrap in a try/catch block to catch exceptions thrown
                                // when trying to access cross-domain iframe contents:
                                try {
                                    response = event.data;
                                    // Google Chrome and Firefox do not throw an
                                    // exception when calling iframe.contents() on
                                    // cross-domain requests, so we unify the response:
                                    if (!response.length) {// || !response[0].firstChild
                                        throw new Error();
                                    }
                                } catch (e) {
                                    response = undefined;
                                }
                                // The complete callback returns the
                                // iframe content document as response object:
                                completeCallback(
                                    200,
                                    'success',
                                    {'iframe': response}
                                );
                                // Fix for IE endless progress bar activity bug
                                // (happens on form submits to iframe targets):
                                $('<iframe src="javascript:false;"></iframe>')
                                    .appendTo(form);
                                form.remove();
                        	}
                        };
                        
                        if (typeof window.addEventListener != 'undefined') {  
                    		window.addEventListener('message', getIframeContent, false);
                    	} else if (typeof window.attachEvent != 'undefined') {  
                    		window.attachEvent('onmessage', getIframeContent);  
                    	}
                        
                        iframe
                            .unbind('load')
                            .bind('load', function () {
                               /* var response;
                                // Wrap in a try/catch block to catch exceptions thrown
                                // when trying to access cross-domain iframe contents:
                                try {
                                    response = iframe.contents();
                                    // Google Chrome and Firefox do not throw an
                                    // exception when calling iframe.contents() on
                                    // cross-domain requests, so we unify the response:
                                    if (!response.length || !response[0].firstChild) {
                                        throw new Error();
                                    }
                                } catch (e) {
                                    response = undefined;
                                }
                                // The complete callback returns the
                                // iframe content document as response object:
                                completeCallback(
                                    200,
                                    'success',
                                    {'iframe': response}
                                );
                                // Fix for IE endless progress bar activity bug
                                // (happens on form submits to iframe targets):
                                $('<iframe src="javascript:false;"></iframe>')
                                    .appendTo(form);
                                form.remove();*/
                            });
                        form
                            .prop('target', iframe.prop('name'))
                            .prop('action', options.url)
                            .prop('method', options.type);
                        if (options.formData) {
                            $.each(options.formData, function (index, field) {
                                $('<input type="hidden"/>')
                                    .prop('name', field.name)
                                    .val(field.value)
                                    .appendTo(form);
                            });
                        }
                        if (options.fileInput && options.fileInput.length &&
                                options.type === 'POST') {
                            fileInputClones = options.fileInput.clone();
                            // Insert a clone for each file input field:
                            options.fileInput.after(function (index) {
                                return fileInputClones[index];
                            });
                            if (options.paramName) {
                                options.fileInput.each(function () {
                                    $(this).prop('name', options.paramName);
                                });
                            }
                            // Appending the file input fields to the hidden form
                            // removes them from their original location:
                            form
                                .append(options.fileInput)
                                .prop('enctype', 'multipart/form-data')
                                // enctype must be set as encoding for IE:
                                .prop('encoding', 'multipart/form-data');
                        }
                        form.submit();
                        // Insert the file input fields at their original location
                        // by replacing the clones with the originals:
                        if (fileInputClones && fileInputClones.length) {
                            options.fileInput.each(function (index, input) {
                                var clone = $(fileInputClones[index]);
                                $(input).prop('name', clone.prop('name'));
                                clone.replaceWith(input);
                            });
                        }
                    });
                    form.append(iframe).appendTo('body');
                },
                abort: function () {
                    if (iframe) {
                        // javascript:false as iframe src aborts the request
                        // and prevents warning popups on HTTPS in IE6.
                        // concat is used to avoid the "Script URL" JSLint error:
                        iframe
                            .unbind('load')
                            .prop('src', 'javascript'.concat(':false;'));
                    }
                    if (form) {
                        form.remove();
                    }
                }
            };
        }
    });

    // The iframe transport returns the iframe content document as response.
    // The following adds converters from iframe to text, json, html, and script:
    $.ajaxSetup({
        converters: {
            'iframe text': function (iframe) {
                return iframe.text();
            },
            'iframe json': function (iframe) {
                return $.parseJSON(iframe);
            },
            'iframe html': function (iframe) {
                return iframe.find('body').html();
            },
            'iframe script': function (iframe) {
                return $.globalEval(iframe.text());
            }
        }
    });

}(jQuery));
function Cocoafish(key) {
	if(arguments.length == 1) {
		return new CocoafishWithKey(key);
	}
}

function CocoafishWithKey(appKey) {
	this.key = appKey;
}

//Common
CocoafishWithKey.prototype.sendRequest = function(url, method, data, useSecure, callback) {
	if(com.cocoafish.js.sdk.utils.checkAppKey(this)) {
		com.cocoafish.js.sdk.sendRequest(this.key, url, method, data, useSecure, callback);
	} else {
		callback(com.cocoafish.constants.noAppKeyError);
	}
};

/*
//Users
CocoafishWithKey.prototype.createUser = function(data, callback) {
	if(com.cocoafish.js.sdk.utils.checkAppKey(this)) {
		com.cocoafish.js.sdk.createUser(this.key, data, callback);
	} else {
		callback(com.cocoafish.constants.noAppKeyError);
	}
};

CocoafishWithKey.prototype.loginUser = function(data, callback) {
	if(com.cocoafish.js.sdk.utils.checkAppKey(this)) {
		com.cocoafish.js.sdk.loginUser(this.key, this, data, callback);
	} else {
		callback(com.cocoafish.constants.noAppKeyError);
	}
};

CocoafishWithKey.prototype.getUserProfile = function(userId, callback) {
	if(com.cocoafish.js.sdk.utils.checkAppKey(this)) {
		com.cocoafish.js.sdk.getUserProfile(this.key, userId, callback);
	} else {
		callback(com.cocoafish.constants.noAppKeyError);
	}
};

CocoafishWithKey.prototype.getCurrentUserProfile = function(callback) {
	if(com.cocoafish.js.sdk.utils.checkAppKey(this)) {
		com.cocoafish.js.sdk.getCurrentUserProfile(this.key, callback);
	} else {
		callback(com.cocoafish.constants.noAppKeyError);
	}
};

CocoafishWithKey.prototype.getUsers = function(callback, data) {
	if(com.cocoafish.js.sdk.utils.checkAppKey(this)) {
		com.cocoafish.js.sdk.getUsers(this.key, callback, data);
	} else {
		callback(com.cocoafish.constants.noAppKeyError);
	}
};

CocoafishWithKey.prototype.updateUser = function(callback, data) {
	if(com.cocoafish.js.sdk.utils.checkAppKey(this)) {
		com.cocoafish.js.sdk.updateUser(this.key, callback, data);
	} else {
		callback(com.cocoafish.constants.noAppKeyError);
	}
};

CocoafishWithKey.prototype.logoutUser = function(callback) {
	if(com.cocoafish.js.sdk.utils.checkAppKey(this)) {
		com.cocoafish.js.sdk.logoutUser(this.key, callback);
	} else {
		callback(com.cocoafish.constants.noAppKeyError);
	}
};

CocoafishWithKey.prototype.deleteUser = function(callback) {
	if(com.cocoafish.js.sdk.utils.checkAppKey(this)) {
		com.cocoafish.js.sdk.deleteUser(this.key, callback);
	} else {
		callback(com.cocoafish.constants.noAppKeyError);
	}
};

//Social Integration
CocoafishWithKey.prototype.linkWithFacebook = function(data, callback) {
	if(com.cocoafish.js.sdk.utils.checkAppKey(this)) {
		com.cocoafish.js.sdk.linkWithFacebook(this.key, data, callback);
	} else {
		callback(com.cocoafish.constants.noAppKeyError);
	}
};

CocoafishWithKey.prototype.loginWithFacebook = function(data, callback) {
	if(com.cocoafish.js.sdk.utils.checkAppKey(this)) {
		com.cocoafish.js.sdk.loginWithFacebook(this.key, data, callback);
	} else {
		callback(com.cocoafish.constants.noAppKeyError);
	}
};

CocoafishWithKey.prototype.unlinkFromFacebook = function(callback) {
	if(com.cocoafish.js.sdk.utils.checkAppKey(this)) {
		com.cocoafish.js.sdk.unlinkFromFacebook(this.key, callback);
	} else {
		callback(com.cocoafish.constants.noAppKeyError);
	}
};

//Places
CocoafishWithKey.prototype.createPlace = function(data, callback) {
	if(com.cocoafish.js.sdk.utils.checkAppKey(this)) {
		com.cocoafish.js.sdk.createPlace(this.key, data, callback);
	} else {
		callback(com.cocoafish.constants.noAppKeyError);
	}
};

CocoafishWithKey.prototype.findPlaces = function(data, callback) {
	if(com.cocoafish.js.sdk.utils.checkAppKey(this)) {
		com.cocoafish.js.sdk.findPlaces(this.key, data, callback);
	} else {
		callback(com.cocoafish.constants.noAppKeyError);
	}
};

CocoafishWithKey.prototype.getPlace = function(placeId, callback) {
	if(com.cocoafish.js.sdk.utils.checkAppKey(this)) {
		com.cocoafish.js.sdk.getPlace(this.key, placeId, callback);
	} else {
		callback(com.cocoafish.constants.noAppKeyError);
	}
};

CocoafishWithKey.prototype.updatePlace = function(data, callback) {
	if(com.cocoafish.js.sdk.utils.checkAppKey(this)) {
		com.cocoafish.js.sdk.updatePlace(this.key, callback, data);
	} else {
		callback(com.cocoafish.constants.noAppKeyError);
	}
};

CocoafishWithKey.prototype.deletePlace = function(placeId, callback) {
	if(com.cocoafish.js.sdk.utils.checkAppKey(this)) {
		com.cocoafish.js.sdk.deletePlace(this.key, placeId, callback);
	} else {
		callback(com.cocoafish.constants.noAppKeyError);
	}
};

//Checkins
CocoafishWithKey.prototype.checkinPlaceOrEvent = function(data, callback) {
	if(com.cocoafish.js.sdk.utils.checkAppKey(this)) {
		com.cocoafish.js.sdk.checkinPlaceOrEvent(this.key, data, callback);
	} else {
		callback(com.cocoafish.constants.noAppKeyError);
	}
};

CocoafishWithKey.prototype.findCheckins = function(data, callback) {
	if(com.cocoafish.js.sdk.utils.checkAppKey(this)) {
		com.cocoafish.js.sdk.findCheckins(this.key, data, callback);
	} else {
		callback(com.cocoafish.constants.noAppKeyError);
	}
};

CocoafishWithKey.prototype.getCheckin = function(checkinId, callback) {
	if(com.cocoafish.js.sdk.utils.checkAppKey(this)) {
		com.cocoafish.js.sdk.getCheckin(this.key, checkinId, callback);
	} else {
		callback(com.cocoafish.constants.noAppKeyError);
	}
};

CocoafishWithKey.prototype.deleteCheckin = function(checkinId, callback) {
	if(com.cocoafish.js.sdk.utils.checkAppKey(this)) {
		com.cocoafish.js.sdk.deleteCheckin(this.key, checkinId, callback);
	} else {
		callback(com.cocoafish.constants.noAppKeyError);
	}
};

//Status
CocoafishWithKey.prototype.createStatus = function(data, callback) {
	if(com.cocoafish.js.sdk.utils.checkAppKey(this)) {
		com.cocoafish.js.sdk.createStatus(this.key, data, callback);
	} else {
		callback(com.cocoafish.constants.noAppKeyError);
	}
};

CocoafishWithKey.prototype.getUserStatuses = function(data, callback) {
	if(com.cocoafish.js.sdk.utils.checkAppKey(this)) {
		com.cocoafish.js.sdk.getUserStatuses(this.key, data, callback);
	} else {
		callback(com.cocoafish.constants.noAppKeyError);
	}
};

//Key-Values
CocoafishWithKey.prototype.setKeyValue = function(key, value, callback) {
	if(com.cocoafish.js.sdk.utils.checkAppKey(this)) {
		com.cocoafish.js.sdk.setKeyValue(this.key, key, value, callback);
	} else {
		callback(com.cocoafish.constants.noAppKeyError);
	}
};

CocoafishWithKey.prototype.getKeyValue = function(key, callback) {
	if(com.cocoafish.js.sdk.utils.checkAppKey(this)) {
		com.cocoafish.js.sdk.getKeyValue(this.key, key, callback);
	} else {
		callback(com.cocoafish.constants.noAppKeyError);
	}
};

CocoafishWithKey.prototype.appendKeyValue = function(key, value, callback) {
	if(com.cocoafish.js.sdk.utils.checkAppKey(this)) {
		com.cocoafish.js.sdk.appendKeyValue(this.key, key, value, callback);
	} else {
		callback(com.cocoafish.constants.noAppKeyError);
	}
};

CocoafishWithKey.prototype.deleteKeyValue = function(key, callback) {
	if(com.cocoafish.js.sdk.utils.checkAppKey(this)) {
		com.cocoafish.js.sdk.deleteKeyValue(this.key, key, callback);
	} else {
		callback(com.cocoafish.constants.noAppKeyError);
	}
};

//Events
CocoafishWithKey.prototype.createEvent = function(data, callback) {
	if(com.cocoafish.js.sdk.utils.checkAppKey(this)) {
		com.cocoafish.js.sdk.createEvent(this.key, data, callback);
	} else {
		callback(com.cocoafish.constants.noAppKeyError);
	}
};

CocoafishWithKey.prototype.getEvent = function(eventId, callback) {
	if(com.cocoafish.js.sdk.utils.checkAppKey(this)) {
		com.cocoafish.js.sdk.getEvent(this.key, eventId, callback);
	} else {
		callback(com.cocoafish.constants.noAppKeyError);
	}
};

CocoafishWithKey.prototype.findEvents = function(data, callback) {
	if(com.cocoafish.js.sdk.utils.checkAppKey(this)) {
		com.cocoafish.js.sdk.findEvents(this.key, data, callback);
	} else {
		callback(com.cocoafish.constants.noAppKeyError);
	}
};

CocoafishWithKey.prototype.updateEvent = function(data, callback) {
	if(com.cocoafish.js.sdk.utils.checkAppKey(this)) {
		com.cocoafish.js.sdk.updateEvent(this.key, data, callback);
	} else {
		callback(com.cocoafish.constants.noAppKeyError);
	}
};

CocoafishWithKey.prototype.deleteEvent = function(eventId, callback) {
	if(com.cocoafish.js.sdk.utils.checkAppKey(this)) {
		com.cocoafish.js.sdk.deleteEvent(this.key, eventId, callback);
	} else {
		callback(com.cocoafish.constants.noAppKeyError);
	}
};

//Messages
CocoafishWithKey.prototype.createMessage = function(data, callback) {
	if(com.cocoafish.js.sdk.utils.checkAppKey(this)) {
		com.cocoafish.js.sdk.createMessage(this.key, data, callback);
	} else {
		callback(com.cocoafish.constants.noAppKeyError);
	}
};

CocoafishWithKey.prototype.replyMessage = function(data, callback) {
	if(com.cocoafish.js.sdk.utils.checkAppKey(this)) {
		com.cocoafish.js.sdk.replyMessage(this.key, data, callback);
	} else {
		callback(com.cocoafish.constants.noAppKeyError);
	}
};

CocoafishWithKey.prototype.getMessage = function(messageId, callback) {
	if(com.cocoafish.js.sdk.utils.checkAppKey(this)) {
		com.cocoafish.js.sdk.getMessage(this.key, messageId, callback);
	} else {
		callback(com.cocoafish.constants.noAppKeyError);
	}
};

CocoafishWithKey.prototype.getInboxMessages = function(data, callback) {
	if(com.cocoafish.js.sdk.utils.checkAppKey(this)) {
		com.cocoafish.js.sdk.getInboxMessages(this.key, data, callback);
	} else {
		callback(com.cocoafish.constants.noAppKeyError);
	}
};

CocoafishWithKey.prototype.getSentMessages = function(data, callback) {
	if(com.cocoafish.js.sdk.utils.checkAppKey(this)) {
		com.cocoafish.js.sdk.getSentMessages(this.key, data, callback);
	} else {
		callback(com.cocoafish.constants.noAppKeyError);
	}
};

CocoafishWithKey.prototype.getMessageThreads = function(data, callback) {
	if(com.cocoafish.js.sdk.utils.checkAppKey(this)) {
		com.cocoafish.js.sdk.getMessageThreads(this.key, data, callback);
	} else {
		callback(com.cocoafish.constants.noAppKeyError);
	}
};

CocoafishWithKey.prototype.getThreadMessages = function(data, callback) {
	if(com.cocoafish.js.sdk.utils.checkAppKey(this)) {
		com.cocoafish.js.sdk.getThreadMessages(this.key, data, callback);
	} else {
		callback(com.cocoafish.constants.noAppKeyError);
	}
};

CocoafishWithKey.prototype.deleteMessage = function(messageId, callback) {
	if(com.cocoafish.js.sdk.utils.checkAppKey(this)) {
		com.cocoafish.js.sdk.deleteMessage(this.key, messageId, callback);
	} else {
		callback(com.cocoafish.constants.noAppKeyError);
	}
};

CocoafishWithKey.prototype.deleteThreadMessages = function(threadId, callback) {
	if(com.cocoafish.js.sdk.utils.checkAppKey(this)) {
		com.cocoafish.js.sdk.deleteThreadMessages(this.key, threadId, callback);
	} else {
		callback(com.cocoafish.constants.noAppKeyError);
	}
};

//Photos
CocoafishWithKey.prototype.uploadPhoto = function(data, fileInputId, callback) {
	if(com.cocoafish.js.sdk.utils.checkAppKey(this)) {
		com.cocoafish.js.sdk.uploadPhoto(this.key, data, fileInputId, callback);
	} else {
		callback(com.cocoafish.constants.noAppKeyError);
	}
};

CocoafishWithKey.prototype.getPhoto = function(photoId, callback) {
	if(com.cocoafish.js.sdk.utils.checkAppKey(this)) {
		com.cocoafish.js.sdk.getPhoto(this.key, photoId, callback);
	} else {
		callback(com.cocoafish.constants.noAppKeyError);
	}
};

CocoafishWithKey.prototype.findPhotos = function(data, callback) {
	if(com.cocoafish.js.sdk.utils.checkAppKey(this)) {
		com.cocoafish.js.sdk.findPhotos(this.key, data, callback);
	} else {
		callback(com.cocoafish.constants.noAppKeyError);
	}
};

CocoafishWithKey.prototype.deletePhoto = function(photoId, callback) {
	if(com.cocoafish.js.sdk.utils.checkAppKey(this)) {
		com.cocoafish.js.sdk.deletePhoto(this.key, photoId, callback);
	} else {
		callback(com.cocoafish.constants.noAppKeyError);
	}
};

//Friends
CocoafishWithKey.prototype.addFriends = function(data, callback) {
	if(com.cocoafish.js.sdk.utils.checkAppKey(this)) {
		com.cocoafish.js.sdk.addFriends(this.key, data, callback);
	} else {
		callback(com.cocoafish.constants.noAppKeyError);
	}
};

CocoafishWithKey.prototype.getFriendRequests = function(callback) {
	if(com.cocoafish.js.sdk.utils.checkAppKey(this)) {
		com.cocoafish.js.sdk.getFriendRequests(this.key, callback);
	} else {
		callback(com.cocoafish.constants.noAppKeyError);
	}
};

CocoafishWithKey.prototype.approveFriendRequests = function(data, callback) {
	if(com.cocoafish.js.sdk.utils.checkAppKey(this)) {
		com.cocoafish.js.sdk.approveFriendRequests(this.key, data, callback);
	} else {
		callback(com.cocoafish.constants.noAppKeyError);
	}
};

CocoafishWithKey.prototype.findFriends = function(data, callback) {
	if(com.cocoafish.js.sdk.utils.checkAppKey(this)) {
		com.cocoafish.js.sdk.findFriends(this.key, data, callback);
	} else {
		callback(com.cocoafish.constants.noAppKeyError);
	}
};

CocoafishWithKey.prototype.removeFriends = function(data, callback) {
	if(com.cocoafish.js.sdk.utils.checkAppKey(this)) {
		com.cocoafish.js.sdk.removeFriends(this.key, data, callback);
	} else {
		callback(com.cocoafish.constants.noAppKeyError);
	}
};

//Chats
CocoafishWithKey.prototype.createChatMessage = function(data, callback) {
	if(com.cocoafish.js.sdk.utils.checkAppKey(this)) {
		com.cocoafish.js.sdk.createChatMessage(this.key, data, callback);
	} else {
		callback(com.cocoafish.constants.noAppKeyError);
	}
};

CocoafishWithKey.prototype.findChatMessages = function(data, callback) {
	if(com.cocoafish.js.sdk.utils.checkAppKey(this)) {
		com.cocoafish.js.sdk.findChatMessages(this.key, data, callback);
	} else {
		callback(com.cocoafish.constants.noAppKeyError);
	}
};

//Photo Collections
CocoafishWithKey.prototype.createPhotoCollection = function(data, callback) {
	if(com.cocoafish.js.sdk.utils.checkAppKey(this)) {
		com.cocoafish.js.sdk.createPhotoCollection(this.key, data, callback);
	} else {
		callback(com.cocoafish.constants.noAppKeyError);
	}
};

CocoafishWithKey.prototype.getPhotoCollection = function(collectionId, callback) {
	if(com.cocoafish.js.sdk.utils.checkAppKey(this)) {
		com.cocoafish.js.sdk.getPhotoCollection(this.key, collectionId, callback);
	} else {
		callback(com.cocoafish.constants.noAppKeyError);
	}
};

CocoafishWithKey.prototype.updatePhotoCollection = function(data, callback) {
	if(com.cocoafish.js.sdk.utils.checkAppKey(this)) {
		com.cocoafish.js.sdk.updatePhotoCollection(this.key, data, callback);
	} else {
		callback(com.cocoafish.constants.noAppKeyError);
	}
};

CocoafishWithKey.prototype.findPhotoCollections = function(data, callback) {
	if(com.cocoafish.js.sdk.utils.checkAppKey(this)) {
		com.cocoafish.js.sdk.findPhotoCollections(this.key, data, callback);
	} else {
		callback(com.cocoafish.constants.noAppKeyError);
	}
};

CocoafishWithKey.prototype.findSubPhotoCollections = function(data, callback) {
	if(com.cocoafish.js.sdk.utils.checkAppKey(this)) {
		com.cocoafish.js.sdk.findSubPhotoCollections(this.key, data, callback);
	} else {
		callback(com.cocoafish.constants.noAppKeyError);
	}
};

CocoafishWithKey.prototype.getCollectionPhotos = function(data, callback) {
	if(com.cocoafish.js.sdk.utils.checkAppKey(this)) {
		com.cocoafish.js.sdk.getCollectionPhotos(this.key, data, callback);
	} else {
		callback(com.cocoafish.constants.noAppKeyError);
	}
};

CocoafishWithKey.prototype.deletePhotoCollection = function(collectionId, callback) {
	if(com.cocoafish.js.sdk.utils.checkAppKey(this)) {
		com.cocoafish.js.sdk.deletePhotoCollection(this.key, collectionId, callback);
	} else {
		callback(com.cocoafish.constants.noAppKeyError);
	}
};
*/var com;
if (!com) com = {};
if (!com.cocoafish) com.cocoafish = {};
if (!com.cocoafish.constants) com.cocoafish.constants = {};
if (!com.cocoafish.js) com.cocoafish.js = {};
if (!com.cocoafish.js.sdk) com.cocoafish.js.sdk = {};
if (!com.cocoafish.js.sdk.utils) com.cocoafish.js.sdk.utils = {};

if (!com.cocoafish.sdk) com.cocoafish.sdk = {};
if (!com.cocoafish.sdk.url) com.cocoafish.sdk.url = {};

/*
if (!com.cocoafish.api.users) com.cocoafish.api.users = {};
if (!com.cocoafish.api.facebook) com.cocoafish.api.facebook = {};
if (!com.cocoafish.api.places) com.cocoafish.api.places = {};
if (!com.cocoafish.api.checkins) com.cocoafish.api.checkins = {};
if (!com.cocoafish.api.status) com.cocoafish.api.status = {};
if (!com.cocoafish.api.keyvalues) com.cocoafish.api.keyvalues = {};
if (!com.cocoafish.api.events) com.cocoafish.api.events = {};
if (!com.cocoafish.api.messages) com.cocoafish.api.messages = {};
if (!com.cocoafish.api.photos) com.cocoafish.api.photos = {};
if (!com.cocoafish.api.friends) com.cocoafish.api.friends = {};
if (!com.cocoafish.api.chats) com.cocoafish.api.chats = {};
if (!com.cocoafish.api.photocollections) com.cocoafish.api.photocollections = {};
*///REST APIs

//protocals
com.cocoafish.sdk.url.http = 'http://';
com.cocoafish.sdk.url.https = 'https://';

//base url
com.cocoafish.sdk.url.baseURL = 'api.cocoafish.com/v1/';

/*
//users
com.cocoafish.api.users.createUser = 'http://api.cocoafish.com/v1/users/create.json';
com.cocoafish.api.users.loginUser = 'http://api.cocoafish.com/v1/users/login.json';
com.cocoafish.api.users.showUserProfile = 'http://api.cocoafish.com/v1/users/show.json';
com.cocoafish.api.users.showCurrentUser = 'http://api.cocoafish.com/v1/users/show/me.json';
com.cocoafish.api.users.searchUsers = 'http://api.cocoafish.com/v1/users/search.json';
com.cocoafish.api.users.updateUser = 'http://api.cocoafish.com/v1/users/update.json';
com.cocoafish.api.users.logoutUser = 'http://api.cocoafish.com/v1/users/logout.json';
com.cocoafish.api.users.deleteUser = 'http://api.cocoafish.com/v1/users/delete.json';

//Facebook
com.cocoafish.api.facebook.linkWithFacebook = 'http://api.cocoafish.com/v1/social/facebook/link.json';
com.cocoafish.api.facebook.loginWithFacebook = 'http://api.cocoafish.com/v1/social/facebook/login.json';
com.cocoafish.api.facebook.unlinkFromFacebook = 'http://api.cocoafish.com/v1/social/facebook/unlink.json';

//Places
com.cocoafish.api.places.createPlace = 'http://api.cocoafish.com/v1/places/create.json';
com.cocoafish.api.places.findPlaces = 'http://api.cocoafish.com/v1/places/search.json';
com.cocoafish.api.places.getPlace = 'http://api.cocoafish.com/v1/places/show.json';
com.cocoafish.api.places.updatePlace = 'http://api.cocoafish.com/v1/places/update.json';
com.cocoafish.api.places.deletePlace = 'http://api.cocoafish.com/v1/places/delete.json';

//Checkins
com.cocoafish.api.checkins.checkinPlaceOrEvent = 'http://api.cocoafish.com/v1/checkins/create.json';
com.cocoafish.api.checkins.findCheckins = 'http://api.cocoafish.com/v1/checkins/search.json';
com.cocoafish.api.checkins.getCheckin = 'http://api.cocoafish.com/v1/checkins/show.json';
com.cocoafish.api.checkins.deleteCheckin = 'http://api.cocoafish.com/v1/checkins/delete.json';

//Status
com.cocoafish.api.status.createStatus = 'http://api.cocoafish.com/v1/statuses/create.json';
com.cocoafish.api.status.getUserStatuses = 'http://api.cocoafish.com/v1/statuses/search.json';

//Key-Values
com.cocoafish.api.keyvalues.setKeyValue = 'http://api.cocoafish.com/v1/keyvalues/set.json';
com.cocoafish.api.keyvalues.getKeyValue = 'http://api.cocoafish.com/v1/keyvalues/get.json';
com.cocoafish.api.keyvalues.appendKeyValue = 'http://api.cocoafish.com/v1/keyvalues/append.json';
com.cocoafish.api.keyvalues.deleteKeyValue = 'http://api.cocoafish.com/v1/keyvalues/delete.json';

//Events
com.cocoafish.api.events.createEvent = 'http://api.cocoafish.com/v1/events/create.json';
com.cocoafish.api.events.getEvent = 'http://api.cocoafish.com/v1/events/show.json';
com.cocoafish.api.events.findEvents = 'http://api.cocoafish.com/v1/events/search.json';
com.cocoafish.api.events.updateEvent = 'http://api.cocoafish.com/v1/events/update.json';
com.cocoafish.api.events.deleteEvent = 'http://api.cocoafish.com/v1/events/delete.json';

//Messages
com.cocoafish.api.messages.createMessage = 'http://api.cocoafish.com/v1/messages/create.json';
com.cocoafish.api.messages.replyMessage = 'http://api.cocoafish.com/v1/messages/reply.json';
com.cocoafish.api.messages.getMessage = 'http://api.cocoafish.com/v1/messages/show.json';
com.cocoafish.api.messages.getInboxMessages = 'http://api.cocoafish.com/v1/messages/show/inbox.json';
com.cocoafish.api.messages.getSentMessages = 'http://api.cocoafish.com/v1/messages/show/sent.json';
com.cocoafish.api.messages.getMessageThreads = 'http://api.cocoafish.com/v1/messages/show/threads.json';
com.cocoafish.api.messages.getThreadMessages = 'http://api.cocoafish.com/v1/messages/show/thread.json';
com.cocoafish.api.messages.deleteMessage = 'http://api.cocoafish.com/v1/messages/delete.json';
com.cocoafish.api.messages.deleteThreadMessages = 'http://api.cocoafish.com/v1/messages/delete.json';

//Photos
com.cocoafish.api.photos.uploadPhoto = 'http://api.cocoafish.com/v1/photos/create.json';
com.cocoafish.api.photos.getPhoto = 'http://api.cocoafish.com/v1/photos/show.json';
com.cocoafish.api.photos.findPhotos = 'http://api.cocoafish.com/v1/photos/search.json';
com.cocoafish.api.photos.deletePhoto = 'http://api.cocoafish.com/v1/photos/delete.json';

//Friends
com.cocoafish.api.friends.addFriends = 'http://api.cocoafish.com/v1/friends/add.json';
com.cocoafish.api.friends.getFriendRequests = 'http://api.cocoafish.com/v1/friends/requests.json';
com.cocoafish.api.friends.approveFriendRequests = 'http://api.cocoafish.com/v1/friends/approve.json';
com.cocoafish.api.friends.findFriends = 'http://api.cocoafish.com/v1/friends/search.json';
com.cocoafish.api.friends.removeFriends = 'http://api.cocoafish.com/v1/friends/remove.json';

//Chats
com.cocoafish.api.chats.createChatMessage = 'http://api.cocoafish.com/v1/chats/create.json';
com.cocoafish.api.chats.findChatMessages = 'http://api.cocoafish.com/v1/chats/search.json';

//Photo Collections
com.cocoafish.api.photocollections.createPhotoCollection = 'http://api.cocoafish.com/v1/collections/create.json';
com.cocoafish.api.photocollections.getPhotoCollection = 'http://api.cocoafish.com/v1/collections/show.json';
com.cocoafish.api.photocollections.updatePhotoCollection = 'http://api.cocoafish.com/v1/collections/update.json';
com.cocoafish.api.photocollections.findPhotoCollections = 'http://api.cocoafish.com/v1/collections/search.json';
com.cocoafish.api.photocollections.findSubPhotoCollections = 'http://api.cocoafish.com/v1/collections/show/subcollections.json';
com.cocoafish.api.photocollections.getCollectionPhotos = 'http://api.cocoafish.com/v1/collections/show/photos.json';
com.cocoafish.api.photocollections.deletePhotoCollection = 'http://api.cocoafish.com/v1/collections/delete.json';
*/

//HTTP methods
com.cocoafish.constants.get_method = 'GET';
com.cocoafish.constants.post_method = 'POST';
com.cocoafish.constants.put_method = 'PUT';
com.cocoafish.constants.delete_method = 'DELETE';

//others
com.cocoafish.constants.keyparam = '?key=';
com.cocoafish.constants.json='json';
com.cocoafish.constants.sessionId = '_session_id';
com.cocoafish.constants.sessionCookieName = 'Cookie';
com.cocoafish.constants.responseCookieName = 'Set-Cookie';
com.cocoafish.constants.ie = 'MSIE';
com.cocoafish.constants.ie_v7 = 7;
com.cocoafish.constants.file = 'file';
com.cocoafish.constants.userId = 'user_id';
com.cocoafish.constants.placeId = 'place_id';
com.cocoafish.constants.suppressCode = 'suppress_response_codes';
com.cocoafish.constants.response_wrapper = 'response_wrapper';
com.cocoafish.constants.ie_post_message = 'ie_post_message';
com.cocoafish.constants.photo = 'photo';
com.cocoafish.constants.method = '_method';
com.cocoafish.constants.name = 'name';
com.cocoafish.constants.value = 'value';
com.cocoafish.constants.noAppKeyError = {'meta' : {'stat': 'fail', 'code': 409, 'message': 'Application key is not provided.'}};com.cocoafish.js.sdk.utils.getSessionParams = function(appKey) {
	var sessionParams = com.cocoafish.constants.keyparam + appKey;
	var sessionId = com.cocoafish.js.sdk.utils.getCookie(com.cocoafish.constants.sessionId);
	if (sessionId) {
		sessionParams += '&' + com.cocoafish.constants.sessionId + '=' + sessionId;
	}
	return sessionParams;
};

com.cocoafish.js.sdk.utils.BrowserDetect = 
{
		init: function () {
			this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
			this.version = this.searchVersion(navigator.userAgent)
				|| this.searchVersion(navigator.appVersion)
				|| "an unknown version";
			this.OS = this.searchString(this.dataOS) || "an unknown OS";
		},
		searchString: function (data) {
			for (var i=0;i<data.length;i++)	{
				var dataString = data[i].string;
				var dataProp = data[i].prop;
				this.versionSearchString = data[i].versionSearch || data[i].identity;
				if (dataString) {
					if (dataString.indexOf(data[i].subString) != -1)
						return data[i].identity;
				}
				else if (dataProp)
					return data[i].identity;
			}
		},
		searchVersion: function (dataString) {
			var index = dataString.indexOf(this.versionSearchString);
			if (index == -1) return;
			return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
		},
		dataBrowser: [
			{
				string: navigator.userAgent,
				subString: "Chrome",
				identity: "Chrome"
			},
			{ 	string: navigator.userAgent,
				subString: "OmniWeb",
				versionSearch: "OmniWeb/",
				identity: "OmniWeb"
			},
			{
				string: navigator.vendor,
				subString: "Apple",
				identity: "Safari",
				versionSearch: "Version"
			},
			{
				prop: window.opera,
				identity: "Opera"
			},
			{
				string: navigator.vendor,
				subString: "iCab",
				identity: "iCab"
			},
			{
				string: navigator.vendor,
				subString: "KDE",
				identity: "Konqueror"
			},
			{
				string: navigator.userAgent,
				subString: "Firefox",
				identity: "Firefox"
			},
			{
				string: navigator.vendor,
				subString: "Camino",
				identity: "Camino"
			},
			{		// for newer Netscapes (6+)
				string: navigator.userAgent,
				subString: "Netscape",
				identity: "Netscape"
			},
			{
				string: navigator.userAgent,
				subString: "MSIE",
				identity: "MSIE",
				versionSearch: "MSIE"
			},
			{
				string: navigator.userAgent,
				subString: "Gecko",
				identity: "Mozilla",
				versionSearch: "rv"
			},
			{ 		// for older Netscapes (4-)
				string: navigator.userAgent,
				subString: "Mozilla",
				identity: "Netscape",
				versionSearch: "Mozilla"
			}
		],
		dataOS : [
			{
				string: navigator.platform,
				subString: "Win",
				identity: "Windows"
			},
			{
				string: navigator.platform,
				subString: "Mac",
				identity: "Mac"
			},
			{
				   string: navigator.userAgent,
				   subString: "iPhone",
				   identity: "iPhone/iPod"
		    },
			{
				string: navigator.platform,
				subString: "Linux",
				identity: "Linux"
			}
		]
};
com.cocoafish.js.sdk.utils.BrowserDetect.init();

com.cocoafish.js.sdk.utils.getCookie = function( name ) {
	// first we'll split this cookie up into name/value pairs
	// note: document.cookie only returns name=value, not the other components
	var a_all_cookies = document.cookie.split( ';' );
	var a_temp_cookie = '';
	var cookie_name = '';
	var cookie_value = '';
	var b_cookie_found = false; // set boolean t/f default f
	var i = '';
	
	for ( i = 0; i < a_all_cookies.length; i++ )
	{
		// now we'll split apart each name=value pair
		a_temp_cookie = a_all_cookies[i].split( '=' );
		
		
		// and trim left/right whitespace while we're at it
		cookie_name = a_temp_cookie[0].replace(/^\s+|\s+$/g, '');
	
		// if the extracted name matches passed name
		if ( cookie_name == name )
		{
			b_cookie_found = true;
			// we need to handle case where cookie has no value but exists (no = sign, that is):
			if ( a_temp_cookie.length > 1 )
			{
				cookie_value = unescape( a_temp_cookie[1].replace(/^\s+|\s+$/g, '') );
			}
			// note that in cases where cookie is initialized but no value, null is returned
			return cookie_value;
			break;
		}
		a_temp_cookie = null;
		cookie_name = '';
	}
	if ( !b_cookie_found ) 
	{
		return null;
	}
};

/*
only the first 2 parameters are required, the cookie name, the cookie
value. Cookie time is in milliseconds, so the below expires will make the 
number you pass in the Set_Cookie function call the number of days the cookie
lasts, if you want it to be hours or minutes, just get rid of 24 and 60.

Generally you don't need to worry about domain, path or secure for most applications
so unless you need that, leave those parameters blank in the function call.
*/
com.cocoafish.js.sdk.utils.setCookie = function( name, value, expires, path, domain, secure ) {
	// set time, it's in milliseconds
	var today = new Date();
	today.setTime( today.getTime() );
	// if the expires variable is set, make the correct expires time, the
	// current script below will set it for x number of days, to make it
	// for hours, delete * 24, for minutes, delete * 60 * 24
	if ( expires )
	{
		expires = expires * 1000 * 60 * 60 * 24;
	}
	//alert( 'today ' + today.toGMTString() );// this is for testing purpose only
	var expires_date = new Date( today.getTime() + (expires) );
	//alert('expires ' + expires_date.toGMTString());// this is for testing purposes only

	document.cookie = name + "=" + escape( value ) +
		( ( expires ) ? ";expires=" + expires_date.toGMTString() : "" ) + //expires.toGMTString()
		( ( path ) ? ";path=" + path : "" ) + 
		( ( domain ) ? ";domain=" + domain : "" ) +
		( ( secure ) ? ";secure" : "" );
};

com.cocoafish.js.sdk.utils.deleteCookie = function( name, path, domain ) {
	if ( com.cocoafish.js.sdk.utils.getCookie( name ) ) document.cookie = name + "=" +
			( ( path ) ? ";path=" + path : "") +
			( ( domain ) ? ";domain=" + domain : "" ) +
			";expires=Thu, 01-Jan-1970 00:00:01 GMT";
};

com.cocoafish.js.sdk.utils.checkAppKey = function(obj) {
	if(obj) {
		if(obj.key) {
			return true;
		}
	}
	return false;
};

com.cocoafish.js.sdk.utils.prepareFormData = function(data) {
	if(window.FormData) {
		var formData = new FormData();
		if(data) {
			for (prop in data) {
			    if (!data.hasOwnProperty(prop)) {
			        continue;
			    }
			    if(prop == com.cocoafish.constants.photo || prop == com.cocoafish.constants.file) {
			    	var fileInputId = data[prop];
			    	var fileInput = document.getElementById(fileInputId);
					if(fileInput && fileInput.files[0]) {
						formData.append(prop, fileInput.files[0]);
					}
			    } else {
			    	formData.append(prop, data[prop]);
			    }
			}
		}
		return formData;
	}
};

com.cocoafish.js.sdk.utils.prepareFormDataArray = function(data) {
	var formDataArray = new Array();
	if(data) {
		for (prop in data) {
		    if (!data.hasOwnProperty(prop)) {
		        continue;
		    }
		    if(prop != com.cocoafish.constants.photo && prop != com.cocoafish.constants.file) {
		    	var object = new Object();
		    	object[com.cocoafish.constants.name] = prop;
		    	object[com.cocoafish.constants.value] = data[prop];
		    	formDataArray.push(object);
		    }
		}
	}
	return formDataArray;
};

com.cocoafish.js.sdk.utils.getPhotoObject = function(data) {
	if(data) {
		for (prop in data) {
		    if (!data.hasOwnProperty(prop)) {
		        continue;
		    }
		    if(prop == com.cocoafish.constants.photo || prop == com.cocoafish.constants.file) {
		    	var fileInputId = data[prop];
		    	var fileInput = $('#' + fileInputId);
				return fileInput;
		    }
		}
	}
	return null;
};

com.cocoafish.js.sdk.utils.uploadMessageCallback = function(event) {
	if(event && event.data) {
		return $.parseJSON(event.data);
	} else {
		return {};
	}
};com.cocoafish.js.sdk.sendRequest = function(appKey, url, method, data, useSecure, callback) {
	//build request url
	var reqURL = '';
	if(useSecure) {
		reqURL += com.cocoafish.sdk.url.https;
	} else {
		reqURL += com.cocoafish.sdk.url.http;
	}
	reqURL += com.cocoafish.sdk.url.baseURL + url + com.cocoafish.js.sdk.utils.getSessionParams(appKey);
	
	//Search for session id and save it into cookie
	var serverCallback = function(responseData, responseStatus, requestObj) {
		if(responseData && responseData.meta && responseData.meta.session_id) {
			var sessionId = responseData.meta.session_id;
			com.cocoafish.js.sdk.utils.setCookie(com.cocoafish.constants.sessionId, sessionId);
		}
		callback(responseData);
	}
	
	var fileInputObj = com.cocoafish.js.sdk.utils.getPhotoObject(data);
	if(fileInputObj) {	
		//send request with file
		if(com.cocoafish.js.sdk.utils.BrowserDetect.browser == com.cocoafish.constants.ie) {
			//IE8+
			var formDataArray = com.cocoafish.js.sdk.utils.prepareFormDataArray(data);
			var suppressCode = {name: com.cocoafish.constants.suppressCode, value: true};
			formDataArray.push(suppressCode);
			
			var wrapperValue = com.cocoafish.constants.ie_post_message;
//			if(com.cocoafish.js.sdk.utils.BrowserDetect.version == com.cocoafish.constants.ie_v7) {	//for IE7 only
//				wrapperValue = com.cocoafish.constants.ie_document_domain;
//			}
			var responseWrapper = {name: com.cocoafish.constants.response_wrapper, value: wrapperValue};
			formDataArray.push(responseWrapper);
			
			var fileUploadObject = fileInputObj.fileupload({
		        dataType: com.cocoafish.constants.json,
		        url: reqURL,
		        formData: function(form) {
		        	return formDataArray;
		        },
		        done: function (e, data) {
		            callback(data.result);
		        }
		    });
			
			var fieldName = '';
			if(data.file) {
				fieldName = com.cocoafish.constants.file;
			} else if(data.photo) {
				fieldName = com.cocoafish.constants.photo;
			}
			fileInputObj.prop(com.cocoafish.constants.name, fieldName);
			
			fileUploadObject.fileupload('send', {files:[{name:fieldName}]});
		} else {
			//other browsers
			var formData = com.cocoafish.js.sdk.utils.prepareFormData(data);
			formData.append(com.cocoafish.constants.suppressCode, true);
			$.postCORSWithFile(reqURL, formData, serverCallback, com.cocoafish.constants.json, {}, {withCredentials: true});
		}
	} else {
		if(data == null) {
			data = {};
		}
		data[com.cocoafish.constants.suppressCode] = true;
		//send request without file
		if(method) {
			if(method.toUpperCase() == com.cocoafish.constants.get_method) {
				$.getCORS(reqURL, data, serverCallback, com.cocoafish.constants.json);
			} else if(method.toUpperCase() == com.cocoafish.constants.post_method) {
				$.postCORS(reqURL, data, serverCallback, com.cocoafish.constants.json, {}, {withCredentials:true});
			} else if(method.toUpperCase() == com.cocoafish.constants.put_method) {
				$.putCORS(reqURL, data, serverCallback, com.cocoafish.constants.json, {}, {withCredentials:true});
			} else if(method.toUpperCase() == com.cocoafish.constants.delete_method) {
				$.deleteCORS(reqURL, data, serverCallback, com.cocoafish.constants.json, {}, {withCredentials: true});
			}
		}
	}
};