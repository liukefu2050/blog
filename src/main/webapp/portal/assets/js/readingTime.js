/*!

Name: Reading Time
Dependencies: jQuery
Author: Michael Lynch
Author URL: http://michaelynch.com
Date Created: August 14, 2013
Date Updated: January 24, 2014
Licensed under the MIT license
*/

;(function($) {

    $.fn.readingTime = function(options) {
    
    	//return if no element was bound
		//so chained events can continue
		if(!this.length) { 
			return this; 
		}
		//define default parameters
        var defaults = {
	        readingTimeTarget: '.eta',
	        wordCountTarget: null,
	        wordsPerMinute: 270,
	        round: false,
	        lang: 'en',
			lessThanAMinuteString: '',
			prependTimeString: '',
			prependWordString: '',
	        remotePath: null,
	        remoteTarget: null
        }
        
        //define plugin
        var plugin = this;

        //define element
        var el = $(this);

        //merge defaults and options
        plugin.settings = $.extend({}, defaults, options);
        
        //define vars
        var readingTimeTarget = plugin.settings.readingTimeTarget;
        var wordCountTarget = plugin.settings.wordCountTarget;
        var wordsPerMinute = plugin.settings.wordsPerMinute;
        var round = plugin.settings.round;
        var lang = plugin.settings.lang;
		var lessThanAMinuteString = plugin.settings.lessThanAMinuteString;
		var prependTimeString = plugin.settings.prependTimeString;
		var prependWordString = plugin.settings.prependWordString;
        var remotePath = plugin.settings.remotePath;
        var remoteTarget = plugin.settings.remoteTarget;

        if(lang =='ch'){
        	var lessThanAMinute = lessThanAMinuteString || "少于1";
        	var minShortForm = " ";
   
        //if lang is set to french
        } else if(lang == 'fr') {
			
        	var lessThanAMinute = lessThanAMinuteString || "Moins d'une minute";
        	
        	var minShortForm = '分钟';
	     
	    //if lang is set to german  
        } else if(lang == 'de') {
        
	        var lessThanAMinute = lessThanAMinuteString || "Weniger als eine Minute";
	        
	        var minShortForm = '分钟';

        //if lang is set to spanish
        } else if(lang == 'es') {
	        
	        var lessThanAMinute = lessThanAMinuteString || "Menos de un minuto";
	        
	        var minShortForm = '分钟';
	        
        //if lang is set to dutch
        } else if(lang == 'nl') {
	        
	        var lessThanAMinute = lessThanAMinuteString || "Minder dan een minuut";
	        
	        var minShortForm = '分钟';
	
	    //default lang is english
        } else {
	        
	        var lessThanAMinute = lessThanAMinuteString || 'Less than a minute';
	        
	        var minShortForm = '分钟';
	        
        }
        
        var setTime = function(text) {

	        //split text by spaces to define total words
			// var totalWords = text.split(' ').length;
			/*真是环境中是单词，中文换行，空格
				around Number = 文本的长度-英文单词的个数*5-空格数-回车数
			*/
			//空格数
			var totalSpace =text.split(" ").length-1;
			//回车数
			var totalEnterSpace = text.split("\n").length-1;
			//词数（大约）
			var fakeTotalWords = totalSpace+1;

			//字符数=字数+字母数+空数+回车数（假设在java中，平均每个单词的长度大约为（public static void main (String [] args ）{）
			var totalChars = text.length ;
	 
			//字数 = 字符数-
			var totalWords = totalChars - 4.1*fakeTotalWords -totalSpace - totalEnterSpace;

			// alert("空格数+:"+totalSpace+"\n"+"回车数："+totalEnterSpace+"\n"+"词数："+fakeTotalWords+"\n"+"字符数："+totalChars+"\n"+"字数："+totalWords);

			//取整数
			totalWords = totalWords.toFixed(0);



			//define words per second based on words per minute (wordsPerMinute)
			var wordsPerSecond = wordsPerMinute / 60;
			
			//define total reading time in seconds
			var totalReadingTimeSeconds = totalWords / wordsPerSecond;
			
			//define reading time in minutes
			var readingTimeMinutes =totalReadingTimeSeconds / 60;
			
			//define remaining reading time seconds
			var readingTimeSeconds = totalReadingTimeSeconds - readingTimeMinutes * 60;
		 		

			//if round is set to true
			if(round === true) {
				
				//if minutes are greater than 0
				if(readingTimeMinutes > 0) {
					readingTimeMinutes	= readingTimeMinutes.toFixed(2);
					//set reading time by the minute
					el.find(readingTimeTarget).text(prependTimeString + readingTimeMinutes + ' ' + minShortForm);
				
				} else {

					//set reading time as less than a minute
					el.find(readingTimeTarget).text(prependTimeString + lessThanAMinute);
					
				}
			
			//if round is set to false	
			} else {
				
				//format reading time
				var readingTime = readingTimeMinutes + ':' + readingTimeSeconds;
				
				readingTime=readingTime.fixed(2);
				//set reading time in minutes and seconds
				el.find(readingTimeTarget).text(prependTimeString + readingTime);
				
			}
	
			//if word count container isn't blank or undefined
			if(wordCountTarget !== '' && wordCountTarget !== undefined) {
			
				//set word count
				el.find(wordCountTarget).text(prependWordString + totalWords);
			
			}
		
		};
		
		//for each element
		el.each(function() {
        
	        //if remotePath and remoteTarget aren't null
	        if(remotePath != null && remoteTarget != null) {

	        	//get contents of remote file
	    		$.get(remotePath, function(data) {
					
					//set time using the remote target found in the remote file
					setTime($('<div>').html(data).find(remoteTarget).text());
					
				});
		        
	        } else {
	
		        //set time using the targeted element
		        setTime(el.text());
	        
	        }
        
        });
        
    }

})(jQuery);