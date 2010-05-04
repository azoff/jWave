/*!
 * jQuery.jWave v1.1.0
 *  A jQuery plug-in that allows facilitated embedding of Google Wave (R) 
 *	threads into an external website or blog. 
 *
 * Copyright 2010, Jonathan Azoff
 *  Freely distributable under the terms outlined in the DBAD license:
 *  http://github.com/SFEley/candy/blob/master/LICENSE.markdown
 *
 * Date: Sunday, May 3rd 2010
 *
 * For usage examples and API documentation, see azoffdesign.com/jwave 
 */

/*jslint onevar: true, strict: true, browser: true */
/*global window, jQuery, google */
"use strict";
(function($, doc, jwave, fn) {
	
	jwave = $.fn.jwave = function(id, options) {
		
		if(!fn.isWaveId(id)) {
			throw(id + fn.constants.ERROR_ID);
		}
		
		options		= options || {};
		options.id	= id;
		
		this.each(fn.onEachElement(options));
		
	};
	
	fn = jwave.fn = {
	
		constants: {
			ERROR_ID: " is not a valid Google Wav ID, for details refer to http://wave-api-faq.appspot.com/#waveid",
			ERROR_DEPENDENCY: "A dependency error occurred while trying to initialize jWave.",
			FUNCTION: "function",
			UNDEFINED: "undefined"
		},
		
		loaded: false,
		
		queue: [],
		
		onEachElement: function(options) {
			
			return function(handler, target) {
			
				handler = fn.getWaveHandler(target, options);
				
				if(fn.loaded) {
					handler.call(target);
				} else {
					fn.queue.push(handler);
				}
				
			};
			
		},
		
		getWaveHandler: function(target, options) {
			
			return function(panel) {
				options.target = target;
				panel = new google.wave.WavePanel(options);
				panel.loadWave(options.id);
			};
			
		},
		
		onGoogleApiReady: function(i, len) {
			
			fn.loaded = true;
			len = fn.queue.length;
			for(i=0;i<len;i++) {
				fn.queue[i].call(fn.queue);
			} 
			
		},
		
		isWaveId: function(id) {
			return id && typeof id === "string" && /^googlewave.com!w\+[A-Za-z0-9]+(\.[0-9]+)*$/.test(id);
		}
		
	};
	
	if(typeof google === fn.constants.UNDEFINED ||
	   typeof google.wave === fn.constants.UNDEFINED ||
	   typeof google.wave.WavePanel !== fn.constants.FUNCTION) {
		$.fn.jwave = null;
		throw(fn.constants.ERROR_GOOGLE);
	} else {
		google.setOnLoadCallback(fn.onGoogleApiReady);
	}
	
})(jQuery, document);