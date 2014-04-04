// creative the directives as re-usable components

TelogicalUi
    .directive('telGrid', function () {
        'use strict';
        return {
            restrict: 'E',
            replace: true,

            template: '<table></table>',
            transclude: false,
            scope: {
                'ngDisabled': '=?',
                'id': '@',
                'data': '=?',
                'colModel': '=',
                'colNames': '=',
                'colSort': '=',
                'width': '=?',
                'height': '=?',
                'table': '@',
                'placeholder': '@',
                'title': '@',

                'hasSearch': '@',
                'hasHeaderRow': '@',

                'hasHeaderToolbar': '@',
                'hasFooterToolbar': '@',
                'dynamicHeaderRow': '@',

                'tableCallback': '&?',
                'rowCallback': '&?',
                'cellCallback': '&?'

            },
            link: function ($scope, $element) {
                function handleDisabled(value) {
                    if ($element.hasClass('ui-dialog')) {
                        $element.attr('disabled', value);
                        if (value) {
                            $element.dialog('disable');
                        } else {
                            $element.dialog('enable');
                        }
                    }
                }

                function mapColModelToPlugin(columnModel) {
                    var mappedColumns = [];

                    function assignRender(o) {
                        return function (data, type, row) {

                            var opts = {
                                cell: data,
                                row: row,
                                tableEl: $element,
                                $scope: $scope,
                                valueProperty: o.valueProperty,
                                options: o.renderOptions
                            };
                            if (o.display && type === 'display') {
                                if (o.displayType === 'object' && $.type(o.display.html) === 'function') {
                                    return o.display.html(opts);
                                } else if (o.displayType === 'function') {
                                    return o.display(opts);
                                } else {
                                    return o.display.toString();
                                }
                            }

                            if (o.sort && type === 'sort') {
                                if (o.sortType === 'function') {
                                    var value = o.sort(opts);
                                    return value;
                                }
                            }


                            return data;
                        };
                    }

                    function assignScript(o) {
                        return function (nTd, sData, oData, iRow, iCol) {
                            if ($.type(o.display.script) === 'function') {
                                var opts = {
                                    cellEl: nTd,
                                    cell: sData,
                                    row: oData,
                                    rowIndex: iRow,
                                    columnIndex: iCol,
                                    $scope: $scope,
                                    tableEl: $element,
                                    valueProperty: o.valueProperty,
                                    options: o.renderOptions

                                };
                                o.display.script(opts);
                            }
                        };
                    }

                    for (var i = 0, ii = columnModel.length; i < ii; i++) {


                        var col = columnModel[i];

                        if (col.visible) {
                            var mobj = {
                                sTitle: col.title || '',
                                mData: col.value || '',
                                bVisible: col.visible || false,
                                bSortable: col.canSort || false,
                                sWidth: col.width || 'auto',
                                key: col.key || false,
                                asSorting: ['asc', 'desc']

                            };
                            if (col.renderDisplay || col.renderSort || col.renderFilter) {
                                var opts = {
                                    display: col.renderDisplay,
                                    displayType: $.type(col.renderDisplay),
                                    sort: col.renderSort,
                                    sortType: $.type(col.renderSort),
                                    filter: col.renderFilter,
                                    filterType: $.type(col.renderFilter),
                                    renderOptions: col.renderOptions,
                                    valueProperty: mobj.mData
                                };
                                mobj.mRender = assignRender(opts);
                                if (opts.displayType === 'object') {
                                    mobj.fnCreatedCell = assignScript(opts);
                                }
                            }
                            mappedColumns.push(mobj);
                        }
                    }
                    return mappedColumns;
                }

                function buildsDom() {
                    var head = $scope.hasHeaderToolbar ? '<"H"lfr>' : '';
                    var table = 't';
                    var foot = $scope.hasFooterToolbar ? '<"F"ip> ' : '';
                    var sDom = [head, table, foot].join('');
                    return sDom;
                }

                function rowCallback(nRow, aData, iDisplayIndex) {
                    var options = {
                        rowEl: nRow,
                        data: aData,
                        rowIndex: iDisplayIndex,
                        id: aData.id || iDisplayIndex
                    };
                    var rowAttributes = {
                        id: ($scope.id + '_' + aData.id).toLowerCase(),
                        'data-row': options.rowIndex
                    };
                    var cellCallback = function (col, i) {
                        var mCol = $scope.mappedColumns[i];
                        var cellAttributes = {
                            'id': ($scope.id + '_' + aData.id + '_' + mCol.mData.split('.').join('_')).toLowerCase(),
                            'width': mCol.sWidth || 'auto',
                            'data-property': mCol.mData,
                            'data-row': options.rowIndex,
                            'data-cell': i
                        };

                        $(col, nRow)
                            .attr(cellAttributes)
                            .addClass(mCol.mData.split('.').join('-'));

                        if ($scope.cellCallback) {
                            var cellCallbackOptions = {
                                cellEl: col,
                                cellIndex: i
                            };
                            var cellOptions = $.extend(options, cellCallbackOptions);
                            $scope.cellCallback(cellOptions);
                        }
                    };
                    _.each($('td', nRow), cellCallback);

                    $(nRow).attr(rowAttributes);
                    if ($scope.rowCallback) {
                        $scope.rowCallback(options);
                    }
                    return nRow;
                }

                function drawCallback(options) {
                    $scope.hasHeaderRow = ($scope.hasHeaderRow === 'false' || $scope.hasHeaderRow === false) ? false : true;
                    if (!$scope.hasHeaderRow) {
                        $element.find('thead').css({
                            display: 'none'
                        });
                    }
                    if ($scope.tableCallback) {
                        var tableCallbackOptions = {
                            id: $scope.id,
                            colModel: $scope.colModel,
                            data: $scope.data,
                            tableEl: $element,
                            tableOptions: options
                        };
                        $scope.tableCallback(tableCallbackOptions);
                    }
                }

                function headerCallback(nHead, aData, iStart, iEnd, aiDisplay) {

                    if ($scope.dynamicHeaderRow === 'true') {
                        _.each($scope.colModel, function (column, i) {
                            if (column.displayRowCount) {
                                nHead.getElementsByTagName('th')[i].innerHTML =
                                    '<div class="DataTables_sort_wrapper">'
                                        + (iEnd - iStart)
                                        + '<span class="DataTables_sort_icon css_right ui-icon ui-icon-carat-2-n-s"></span></div>';
                            }
                            if (column.customHeaderFunction) {
                                nHead.getElementsByTagName('th')[i].innerHTML =
                                    '<div class="DataTables_sort_wrapper">'
                                        + column.customHeaderFunction(nHead, aData, iStart, iEnd, aiDisplay, column.customHeaderExtraArgs)
                                        + '<span class="DataTables_sort_icon css_right ui-icon ui-icon-carat-2-n-s"></span></div>';
                            }
                        });
                    }
                }

                function updateGrid(_values) {
                    if ($scope.refreshDebounce) {
                        clearTimeout($scope.refreshDebounce);
                    }

                    $scope.refreshDebounce = setTimeout(function () {
                        var cols = (_values[1] || $scope.colModel || []),
                            data = (_values[0] || $scope.data || []);

                        $scope.hasHeaderToolbar =
                            ($scope.hasHeaderToolbar === 'false' || $scope.hasHeaderToolbar === false) ? false : true;
                        $scope.hasFooterToolbar =
                            ($scope.hasFooterToolbar === 'false' || $scope.hasFooterToolbar === false) ? false : true;

                        $scope.mappedColumns = mapColModelToPlugin(cols);

                        var _config = $.extend(config, {
                            'aoColumns': $scope.mappedColumns || [],
                            'aaData': $scope.safetywrap(data, cols) || [],
                            'sDom': buildsDom(),
                            'bSortClasses': $scope.hasHeaderToolbar ? true: false,
                        });

                        if ($scope.dataTable) {
                            $scope.dataTable.fnDestroy();
                            $scope.dataTable.children().remove();
                        }

                        $scope.dataTable = false;
                        $scope.dataTable = $element.dataTable(_config);

                    }, $scope.refreshDebounceSpeed);
                }

                var safetyWrap = function (data, cols) {
                    if (!cols) {
                        return [];
                    }
                    var props = (function () {
                        var p = [];
                        for (var i = 0, ii = cols.length; i < ii; i++) {
                            p.push(cols[i].mData);
                        }
                        return p;
                    })();
                    for (var i = 0, ii = data.length; i < ii; i++) {
                        var datum = data[i];
                        for (var k = 0, kk = props.length; k < kk; k++) {
                            var p = props[k];
                            if (!datum.hasOwnProperty(p)) {
                                datum[p] = '';
                            }
                        }
                    }
                    return data;
                };

                var config = {
                    'aaSorting': $scope.colSort || [],
                    'bPaginate': false,
                    'bLengthChange': false,
                    'bServerside': false,
                    'bFilter': ($scope.hasSearch && $scope.hasSearch === 'false') ? false : true,
                    'bSort': true,
                    'bInfo': false,
                    'bAutoWidth': false,
                    'bJQueryUI': true,
                    'bRetrieve': true,
                    'bDeferRender': true,
                    'aoColumns': $scope.colModel || [],
                    'aaData': $scope.data || [],
                    'oLanguage': {
                        'sSearch': $scope.placeholder || 'Filter Results'
                    },
                    'fnRowCallback': rowCallback,
                    'fnDrawCallback': drawCallback,
                    'fnHeaderCallback': headerCallback
                };

                $scope.data = $scope.data || [];
                $scope.refreshDebounceSpeed = $scope.refreshDebounceSpeed ? parseInt($scope.refreshDebounceSpeed, 10) : 150;
                $scope.safetywrap = safetyWrap;
                $scope.$watchCollection('[data, colModel, hasHeaderToolbar, hasFooterToolbar]', updateGrid);
                $scope.$watch('ngDisabled', handleDisabled);
            }
        };
    });