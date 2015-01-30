function UI() {
    'use strict';
    window.UI = window.UI || {Appearances: {}, Mixins: {}};
    var ui = window.UI;
    ui.Mixins = {
        List: require('./mixins/list')(),
        Widget: require('./mixins/widget')(),
        Appearance: require('./mixins/appearance')()
    };
    ui.Appearances = {};
    return ui;
}

module.exports = new UI();
