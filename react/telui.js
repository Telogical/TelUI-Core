function UI() {
  'use strict';


  var TelUI = {
    Appearances: {

    },
    Core: {
      React: require('react/addons'),
      _: require('lodash')
    }
  };

  TelUI.Mixins = {
    List: require('./mixins/list')(TelUI),
    Widget: require('./mixins/widget')(TelUI),
    Appearance: require('./mixins/appearance')(TelUI)
  };

  return TelUI;
}

module.exports = new UI();