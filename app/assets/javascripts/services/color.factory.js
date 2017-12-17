(function() {
  'use strict';

  angular
    .module('colorFactory', [])
    .factory('colorFactory', ColorFactory);

  ColorFactory.$inject = [];

  function ColorFactory(){
    return {
      getDarkenedColor: getDarkenedColor,
      getTextColor: getTextColor
    };

    function getDarkenedColor(colorHex){
      return chroma(colorHex)
        .darken()
        .saturate(1)
        .hex();
    }

    function getTextColor(colorHex){
      var darkText = chroma('#283c46');
      var whiteText = chroma('#FFFFFF');
      var textColor;

      var contrast = chroma.contrast(colorHex, darkText);

      if (contrast >= 4.5){
        textColor = darkText.hex();
      } else {
        textColor = whiteText.hex();
      }

      return textColor;
    }

  }
})();
