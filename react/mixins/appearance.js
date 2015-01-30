var React = require('react/addons');
var _ = require('lodash');

function Appearance() {
  'use strict';

  return {
    propTypes: {
      id: React.PropTypes.string,
      disabled: React.PropTypes.bool,
      label: React.PropTypes.string,
      iconPrimary: React.PropTypes.string,
      iconSecondary: React.PropTypes.string,
      text: React.PropTypes.bool,
      active: React.PropTypes.bool
    },

    __nameIcon: function nameIcon(uiIcon) {
      return (uiIcon.indexOf('ui-icon-') === -1) ? 'ui-icon-' + uiIcon : uiIcon;
    },

    __generateIcon: function generateIcon(uiIcon, position) {
      if (position && uiIcon && uiIcon.length) {

        position = position || 'primary';
        uiIcon = (uiIcon.indexOf('ui-icon-') === -1) ? 'ui-icon-' + uiIcon : uiIcon;

        var iconClasses = ['ui-icon-' + position, 'ui-icon', uiIcon],
          elOpts = {
            id: this.props.id + '_icon_' + position,
            'className': iconClasses.join(' '),
          },
          el = React.DOM.i(elOpts, '');

        return el;
      }
      return null;
    },
    __iconPrimary: function iconPrimary(glyphPrimary) {
      return this.__generateIcon(glyphPrimary, 'primary');
    },
    __iconSecondary: function iconSecondary(glyphSecondary) {
      return this.__generateIcon(glyphSecondary, 'secondary');
    },
    __onMouseDown: function onMouseDown(control) {
      //console.log('mousedown for ', control);
      if (!control.props.disabled) {
        control.setState({
          active: true
        });
      }
    },
    __onMouseUp: function onMouseUp(control) {
      control.setState({
        active: false,
      });

      if (!control.props.disabled) {
        var hasFocusableInput = control.refs &&
          control.refs.input &&
          control.refs.input.props.tabIndex != -1;

        if (hasFocusableInput) {
          control
            .refs
            .input
            .getDOMNode()
            .focus();
        }
      }
    },
    __onMouseEnter: function onMouseEnter(control) {

      function clear(li) {
        if (li.state.hover) {
          li.setState({
            hover: false
          });
        }
      }

      if (!control.props.disabled) {
        control.setState({
          hover: true
        });

        //clear all else.
        var hasAlistWithChildren = control.props.list && control.props.list.refs;
        if (hasAlistWithChildren) {
          _.each(control.props.list.refs, clear);
        }
      }
    },
    __onMouseLeave: function onMouseLeave(control) {
      control.setState({
        hover: false
      });
    },
    __applyUiStates: function applyUiStates(classes) {
      if (this.props.uiState) {
        var uiState = this.props.uiState;
        uiState = _.contains(uiState, 'ui-state-') ? uiState : 'ui-state-' + uiState;
        classes[uiState] = true;
      }
      return classes;
    },
  };
}

module.exports = Appearance;