(function ($, window, document, undefined) {
  "use strict";

  var userFont = "userFont",
  defaults = {
    store: false,
    storeIsDefined: !(typeof store === "undefined"),
    userFontSizeRange: 7,
    userFontFamily: false,
    startFontFamily: ""
  };

  function Plugin(element, options) {
    var _self = this;
    _self.element = element;
    _self.options = $.extend({}, defaults, options);
    _self._defaults = defaults;
    _self._name = userFont;
    _self.init();
  }

  Plugin.prototype = {
    init: function() {
      var _self = this,
      fn = function(){
        _self.defineElements();
        _self.getDefaultFontSize();
        _self.getDefaultFontFamily();
      };

      fn();

      if( _self.options.store === true && !(_self.options.storeIsDefined) ) {
        _self.dependencyWarning();
      }
    },

    dependencyWarning : function(){
      console.warn('store script is required');
    },

    bindControlerHandlers: function(){

      var _self = this;

      // decrease fn
      _self.$decreaseButton = $('.fontsize-decrease');
      if( _self.$decreaseButton.length){

        _self.$decreaseButton.on('click', function(e){
          e.preventDefault();
          var $el = $(this);

          if(!$el.hasClass('disabled')){
            var n = _self.getCurrentVariation();
            if(n > 1){
              _self.$target.removeClass('fontsize-' + n);
              _self.$target.attr('data-fontsize', n-1);
              if ( _self.options.store === true && store.enabled){
                _self.storeCurrentSize();
              }
              _self.fontsizeChanged();
            }
          }
        });
      }

      // increase fn
      _self.$increaseButton = $('.fontsize-increase');
      if( _self.$increaseButton.length){
        _self.$increaseButton.on('click', function(e) {
          e.preventDefault();
          var $el = $(this);

          if(!$el.hasClass('disabled')){
            var n = _self.getCurrentVariation();
            if(n < _self.options.userFontSizeRange){
              _self.$target.removeClass('fontsize-' + n);
              _self.$target.attr('data-fontsize', n+1);

              if ( _self.options.store === true && store.enabled){
                _self.storeCurrentSize();
              }
              _self.fontsizeChanged();
            }
          }
        });
      }

      // reset the font size to its default
      _self.$resetButton = $(".fontsize-reset");
      if( _self.$resetButton.length){
        _self.$resetButton.on('click', function(e){
          e.preventDefault();
          var $el = $(this);

          if(!$el.hasClass('disabled')){
            var n = _self.getCurrentVariation();
            _self.$target.removeClass('fontsize-' + n);

            _self.$target.attr('data-fontsize', _self.defaultFontsize);
            if ( _self.options.store === true && store.enabled){
              _self.storeCurrentSize();
            }
            _self.fontsizeChanged();
          }
        });
      }
    },

    defineElements: function() {
      var _self = this;
      _self.$target = _self.element;
      _self.bindControlerHandlers();
    },

    getDefaultFontSize: function () {
      var _self = this,
      v = _self.options.userFontSizeRange;
      _self.defaultFontsize = 0;

      if(v % 2 === 0){
        _self.defaultFontsize = (v/2) + 1;
      } else {
        _self.defaultFontsize = parseInt((v/2) + 1, 10);
      }
      _self.setDefaultFontSize();
    },

    detectFontFamily : function(font) {
      var testString  = '~iomwIOMW';
      var containerId = 'font-container';
      var fontArray = font instanceof Array;

      if (!fontArray) {
        font = [ font ];
      }

      var fontAvailability = [];
      var containerSel = '#' + containerId;
      var spanSel      = containerSel + ' span';
      var familySansSerif = 'sans-serif';
      var familyMonospace = 'monospace, monospace';
      // DOM:
      $('body').append('<div id="' + containerId + '"></div>');
      $(containerSel).append('<span></span>');
      $(spanSel).append(document.createTextNode(testString));
      // CSS:
      $(containerSel).css('visibility', 'hidden');
      $(containerSel).css('position', 'absolute');
      $(containerSel).css('left', '-9999px');
      $(containerSel).css('top', '0');
      $(containerSel).css('font-weight', 'bold');
      $(containerSel).css('font-size', '200px !important');
      jQuery.each( font, function (i, v) {
        $(spanSel).css('font-family', v + ',' + familyMonospace );
        var monospaceFallbackWidth = $(spanSel).width();
        var monospaceFallbackHeight = $(spanSel).height();

        $(spanSel).css('font-family', v + ',' + familySansSerif );
        var sansSerifFallbackWidth = $(spanSel).width();
        var sansSerifFallbackHeight = $(spanSel).height();

        fontAvailability[i] = true
        && monospaceFallbackWidth == sansSerifFallbackWidth
        && monospaceFallbackHeight == sansSerifFallbackHeight;
      } );
      $(containerSel).remove();
      if (!fontArray && fontAvailability.length == 1) {
        fontAvailability = fontAvailability[0];
      }
      return fontAvailability;
    },

    getDefaultFontFamily: function () {
      var _self = this;
      var defaultFf = _self.options.startFontFamily;
      if(_self.options.userFontFamily) {
        if( _self.options.store === true && _self.options.storeIsDefined && store.enabled && _self.detectFontFamily(defaultFf)){
          var getFf = store.get('Ff') || defaultFf;
          $(".js-user-font").css("font-family", getFf);
        }
        _self.setDefaultFontFamily();
      }
    },

    setDefaultFontFamily: function() {
      var _self = this;
      _self.$fontFamilyButton = $(".fontfamily");
      if( _self.$fontFamilyButton.length){
        _self.$fontFamilyButton.on('click', function(e) {
          e.preventDefault();
          var $el = $(this);
          var currentFf =  $el.attr("data-fontfamily");
          if(_self.detectFontFamily(currentFf)) {
            store.set('Ff', currentFf);
            $(".js-user-font").css("font-family", currentFf);
          }
        });
      }
    },

    setDefaultFontSize: function(){
      var _self = this;
      if( _self.options.store === true && _self.options.storeIsDefined && store.enabled){
        var currentFs = store.get('userfs') || _self.defaultFontsize;
        _self.$target.attr("data-fontsize", currentFs );
      } else {
        _self.$target.attr("data-fontsize", _self.defaultFontsize );
      }
      _self.fontsizeChanged();
    },

    storeCurrentSize : function() {
      var _self = this;
      if( _self.options.storeIsDefined ) {
        var currentfontsize = store.set('userfs', _self.$target.attr("data-fontsize"));
      } else {
        _self.dependencyWarning();
      }
    },

    getCurrentVariation : function(){
      return parseInt( this.$target.attr("data-fontsize"), 10 );
    },

    fontsizeChanged : function(){
      var _self = this,
      currentFs = _self.getCurrentVariation();
      _self.$target.addClass( "fontsize-" +  currentFs);

      if(currentFs === _self.defaultFontsize){
        _self.$resetButton.addClass('button-disabled');
      } else{
        _self.$resetButton.removeClass('button-disabled');
      }

      if(currentFs === _self.options.userFontSizeRange){
        _self.$increaseButton.addClass('button-disabled');
      } else {
        _self.$increaseButton.removeClass('button-disabled');
      }

      if(currentFs === 1){
        _self.$decreaseButton.addClass('button-disabled');
      } else {
        _self.$decreaseButton.removeClass('button-disabled');
      }
    }
  };

  $.fn[userFont] = function (options) {
    var _self = this;
    return _self.each(function () {
      if (!$.data(_self, "plugin_" + userFont)) {
        $.data(_self, "plugin_" + userFont, new Plugin(_self, options));
      }
    });
  };

  $[userFont] = function() {
    var $window = $(window);
    return $window.userFont.apply($window, Array.prototype.slice.call(arguments, 0));
  };

})(jQuery, window, document);
