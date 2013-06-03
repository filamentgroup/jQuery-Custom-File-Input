/**
 * --------------------------------------------------------------------
 * jQuery customfileinput plugin
 * Author: Scott Jehl, scott@filamentgroup.com
 * Copyright (c) 2009 Filament Group
 * licensed under MIT (filamentgroup.com/examples/mit-license.txt)
 * --------------------------------------------------------------------
 * Updated by seb@madebymade.co.uk, 30/05/2013
 * --------------------------------------------------------------------
 */
$.fn.customFileInput = function(options){
  var defaults = {
    button_class: '',
    button_text: {
      no_file: 'Browse',
      file: 'Change'
    },
    input_class: '',
    input_text: {
      no_file: 'No file selected...'
    }
  };

  var settings = $.extend({}, defaults, options);

  //apply events and styles for file input element
  var fileInput = $(this)
    .addClass('customfile-input') //add class for CSS
    .bind({
      mouseover: function(){
        upload.addClass('customfile-hover');
      },
      mouseout: function(){
        upload.removeClass('customfile-hover');
      },
      focus: function(){
        upload.addClass('customfile-focus');
        fileInput.data('val', fileInput.val());
      },
      blur: function(){
        upload.removeClass('customfile-focus');
        $(this).trigger('checkChange');
      },
      disable: function(){
        fileInput.attr('disabled',true);
        upload.addClass('customfile-disabled');
      },
      enable: function(){
        fileInput.removeAttr('disabled');
        upload.removeClass('customfile-disabled');
      },
      checkChange: function(){
        if(fileInput.val() && fileInput.val() != fileInput.data('val')){
          fileInput.trigger('change');
        }
      },
      change: function(){
        var newValue = $(this).val();

        if (newValue !== '') {
          populate_field(newValue);
        } else {
          reset_field();
        }
      },
      click: function(){ //for IE and Opera, make sure change fires after choosing a file, using an async callback
        fileInput.data('val', fileInput.val());
        setTimeout(function(){
          fileInput.trigger('checkChange');
        }, 100);
      },
      touchend: function(){
        fileInput.click();
      }
    });

  //create custom control container
  var upload = $('<div class="customfile ' + settings.input_class + '"></div>');
  //create custom control button
  var uploadButton = $('<span class="customfile-button ' + settings.button_class + '" aria-hidden="true">' + settings.button_text.no_file + '</span>').appendTo(upload);
  //create custom control feedback
  var uploadFeedback = $('<span class="customfile-feedback" aria-hidden="true">' + settings.input_text.no_file + '</span>').appendTo(upload);


  var populate_field = function(newValue){
    var fileName = newValue.split(/\\/).pop();
    //get file extension
    var fileExt = 'customfile-ext-' + fileName.split('.').pop().toLowerCase();
    //update the feedback
    uploadFeedback
      .text(fileName) //set feedback text to filename
      .removeClass(uploadFeedback.data('fileExt') || '') //remove any existing file extension class
      .addClass(fileExt) //add file extension class
      .data('fileExt', fileExt) //store file extension for class removal on next change
      .addClass('customfile-feedback-populated'); //add class to show populated state
    //change text of button
    uploadButton.text(settings.button_text.file);
  };

  var reset_field = function(){
    uploadFeedback
      .text(settings.input_text.no_file)
      .removeClass(uploadFeedback.data('fileExt') || '')
      .data('fileExt', '')
      .removeClass('customfile-feedback-populated');

    uploadButton.text(settings.button_text.no_file);
  };

  //match disabled state
  if(fileInput.is('[disabled]')){
    fileInput.trigger('disable');
  }

  //on mousemove, keep file input under the cursor to steal click
  upload
    .mousemove(function(e){
      fileInput.css({
        'left': (e.pageX - upload.offset().left) - fileInput.outerWidth() + 20, //position right side 20px right of cursor X)
        'top': (e.pageY - upload.offset().top) - 10
      });
    })
    .insertAfter(fileInput); //insert after the input

  fileInput.appendTo(upload);
  //return jQuery
  return $(this);
};
