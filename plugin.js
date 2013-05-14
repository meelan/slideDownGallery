/*
    SlideDownGallery - Sliding Down Gallery jQuery Plugin
    Version: 1.0
    Site: http://www.pixeldeveloped.co.za/
    Build Date: Feb 2013
    Author:  Meelan Bawjee
    License: Released under MIT License / GPL License
*/

;(function($){
    $.slidedownGallery = function(el, options){
        // To avoid scope issues, use 'base' instead of 'this'
        // to reference this class from internal events and functions.
        var base = this;

        // Access to jQuery and DOM versions of element
        base.$el = $(el);
        base.el = el;
        
        // Add a reverse reference to the DOM object
        base.$el.data("slidedownGallery", base);
        
        base.init = function(){             
             base.options = $.extend({},$.slidedownGallery.defaultoptions, options);
            // Put your initialization code here
            base.doStuff();
        };
        
        // Sample Function, Uncomment to use
        // base.functionName = function(paramaters){
        // 
        // };
        
        base.doStuff = function(){
        // HAVE YOUR PLUGIN DO STUFF HERE
            var base = this;
            $("#placeholder").hide();
            
            //initial call
            resizer();

            var timeOut = null;
            window.onresize = function () {
                if (timeOut != null) clearTimeout(timeOut);
                timeOut = setTimeout(resizer, 100);
            };

            function resizer(){
                //remove row and last class
                $(".item").removeClass('lastItem');
                $(".item").removeClass('firstItem');
                $('.item').attr('class', function (i, c) { return c.replace(/\brow-\S+/g, ''); });
                //reset row index
                var rowIndex = 1;
                var previousItemPos = 0;
                var currentItemPos = 0;
                var totalItems = $('.item').length;
                $(".item").each(function (index, value) {
                    currentItemPos = $(this).offsetRelative(base);              
                    //if distance is less then we are on a new row
                    //increment row index
                    //assign last class to previous item i.e. last item in previous row 
                    if (currentItemPos.left < previousItemPos.left) {                   
                        $(this).prev('.item').addClass('lastItem');
                        previousItemPos = 0;
                        rowIndex++;
                        $(this).addClass("firstItem");
                    } else {                    
                        previousItemPos = $(this).offsetRelative(base);                 
                    };
                    //assign firstItem clas to very first item & lastItem class to very last item
                    if (index == totalItems - 1) {$(this).addClass('lastItem');};                    
                    if (index == 0) {$(this).addClass("firstItem");};

                    //assign row attribute with index to item               
                    $(this).attr("row", rowIndex);
                });

            }; // end resizer


            //click event
            var currentItem;
            var currentRow;
            var previousRow = 0;
            $(".item a").click(function(e){
                e.preventDefault();
                
                //find row of clicked item
                currentItem = $(this).parent();
                currentRow = currentItem.attr("row");

                //hide placeholder - animate out
                var item = $(this);
                if ($("#placeholder").hasClass("active")) {
                    if (currentRow != previousRow) {
                        //different row
                        //update previous row value                                               
                        previousRow = currentRow;
                        $("#placeholder").slideUp(base.options.delay, base.options.slideUpAnimation ,function(){
                            //change contents of placeholder
                            $("#placeholder").html('<img src="' + $(item).attr("href") + '" width="100%" alt="image">');        
                        });
                    } else {
                        //same row - no animation - update content of placeholder                               
                        $("#placeholder").html('<img src="' + $(item).attr("href") + '" width="100%" alt="image">');    
                    } 
                } else{
                    previousRow = currentRow;
                    $("#placeholder").html('<img src="' + $(item).attr("href") + '" width="100%" alt="image">');    
                };
                
                //display placeholder - animate in
                //loop through each item in current row
                $(".item[row='" + currentRow + "']").each(function () {
                        if (base.options.placeholderPosition == "bottom") {
                             //find last item in row
                            if ($(this).hasClass("lastItem")) {
                                $("#placeholder").insertAfter($(this)).addClass("active"); 
                                $("#placeholder").slideDown(base.options.delay, base.options.slideDownAnimation);                       
                            }
                        }
                        else if (base.options.placeholderPosition == "top") {
                             //find first item in row
                            if ($(this).hasClass("firstItem")) {
                                $("#placeholder").insertBefore($(this)).addClass("active"); 
                                $("#placeholder").slideDown(base.options.delay);                           
                            }
                        }                    
                });  //end each 
                  
            }); //end click event
        
            
        };// END DOING STUFF
        
        // Run initializer
        base.init();
    };

    $.slidedownGallery.defaultoptions = {
        delay : 500,
        placeholderPosition : "bottom",
        slideDownAnimation : "linear",
        slideUpAnimation : "linear" 
    };
    
    $.fn.slidedownGallery = function(options){
        return this.each(function(){
            //constructor
            (new $.slidedownGallery(this, options));
        });
    };
    
})(jQuery);






