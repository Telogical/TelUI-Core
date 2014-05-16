//This will be a service of Telogical level formatters.


angular
    .module('TelUI')
    .service('TelRenderDisplay', [

        function () {
            'use strict';
            this.button = {
                html: function (o) {
                    return '<button id="' +
                        o.$scope.id.toLowerCase() +
                        '_' +
                        o.row.id +
                        '_' +
                        o.cell.toLowerCase() +
                        '_button">'
                        + o.cell
                        + '</button>';
                },
                script: function (o) {

                    function click() {
                        if (o.options.click && typeof o.options.click === 'function') {
                            o.options.click.call(this, o);
                        }
                    }

                    var $cEL = $(o.cellEl);
                    $cEL
                        .find('button')
                        .button({})
                        .addClass(o.options.cssClass)
                        .on('click.telRenderButton', click);
                }
            };
        }]);
