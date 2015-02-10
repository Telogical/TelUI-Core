

function Widget(ui) {
  'use strict';
  
  var React = ui.Core.React;
  
  return {
    propTypes: {
      id: React.PropTypes.string,
      state: React.PropTypes.string,
      disabled: React.PropTypes.bool,
      label: React.PropTypes.string,
      iconPrimary: React.PropTypes.string,
      iconSecondary: React.PropTypes.string,
      text: React.PropTypes.bool
    },
    getInitialState: function getInitialState() {
      return {
        hover: false,
        disabled: false,
        active: false,
        checked: !!this.props.value || false
      };
    },

    componentWillMount: function componentWillMount() {
      var component = this;

      if (component.props.text === false) {
        component.props.label = '';
      }
    },
    __offset: function offset(elem) {
      if (!elem) {
        return null;
      }

      var x = elem.offsetLeft,
        y = elem.offsetTop,
        w = elem.offsetWidth,
        h = elem.offsetHeight;

      while (elem = elem.offsetParent) {
        x += elem.offsetLeft;
        y += elem.offsetTop;
      }

      return {
        left: x,
        top: y,
        width: w,
        height: h
      };
    },
    _toPx: function toPx(n) {
      if (typeof n === 'string' && n.indexOf('px') > -1) {
        return n;
      }
      return n + 'px';
    },

    //Possibly swap this for lodash
    __equals: function equals(x, y) {
      //todo : move to base class for list managers
      // I've heavily commented this because equality for js objects is tricky - Jesse

      if (x === y) {
        // if both x and y are null or undefined and exactly the same
        // short circuits primitives.
        return true;
      }

      if (!(x instanceof Object) || !(y instanceof Object)) {
        // if they are not strictly equal, they both need to be Objects
        // instanceof preferable to typeof here.
        return false;
      }

      if (x.id && y.id && x.id === y.id) {
        //for our components, they both have ids that are equal
        //again - short circuit for speed reasons.
        // I am trusting the dev to provide unique ids for now.
        // add keys to this?
        return true;
      }

      if (x.constructor !== y.constructor) {
        // they must have the exact same prototype chain, the closest we can do is
        // test for a constructor.
        return false;
      }

      for (var p in x) {
        if (!x.hasOwnProperty(p)) {
          // other properties were tested using x.constructor === y.constructor
          continue;
        }

        if (!y.hasOwnProperty(p)) {
          // allows to compare x[ p ] and y[ p ] when set to undefined
          return false;
        }

        if (x[p] === y[p]) {
          // if they have the same strict value or identity then they are equal
          continue;
        }

        if (typeof (x[p]) !== 'object') {
          // Numbers, Strings, Functions, Booleans must be strictly equal
          return false;
        }

        if (!this.__equals(x[p], y[p])) {
          // Objects and Arrays must be tested recursively
          return false;
        }
      }

      for (p in y) {
        if (y.hasOwnProperty(p) && !x.hasOwnProperty(p)) {
          // allows x[ p ] to be set to undefined
          return false;
        }
      }

      return true;
    }
  };
}

module.exports = Widget;