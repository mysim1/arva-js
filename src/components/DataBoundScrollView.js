/**
 This Source Code is licensed under the MIT license. If a copy of the
 MIT-license was not distributed with this file, You can obtain one at:
 http://opensource.org/licenses/mit-license.html.

 @author: Hans van den Akker (mysim1)
 @license MIT
 @copyright Bizboard, 2015

 */

import _                from 'lodash';
import FlexScrollView   from 'famous-flex/src/FlexScrollView.js';
import {Throttler}      from 'arva-utils/Throttler.js';


export class DataBoundScrollView extends FlexScrollView {

    constructor(OPTIONS = {}) {
        super(_.extend({
            autoPipeEvents: true,
            throttleDelay: 0, /* If set to 0, no delay is added in between adding items to the DataBoundScrollView. */
            dataSource: [],
            sortingDirection: 'ascending'
        }, OPTIONS));

        this.isGrouped = this.options.groupBy != null;
        this.isDescending = this.options.sortingDirection === 'descending';
        this.throttler = new Throttler(this.options.throttleDelay, true, this);

        /* If present in options.headerTemplate or options.placeholderTemplate, we build the header and placeholder elements. */
        this._addHeader();
        this._addPlaceholder();

        if (this.options.dataStore) {
            this._bindDataSource(this.options.dataStore);
        } else {
            console.log('No DataSource was set.');
        }
    }

    /**
     * Reloads the dataFilter option of the DataBoundScrollView, and verifies whether the items in the dataStore are allowed by the new filter.
     * It removes any currently visible items that aren't allowed anymore, and adds any non-visible ones that are allowed now.
     * @param {Function} newFilter New filter function to verify item visibility with.
     * @returns {void}
     */
    reloadFilter(newFilter) {
        this.options.dataFilter = newFilter;

        for(let entry of this.options.dataStore) {
            let surface = _.find(this._dataSource, (surface) => {
                return surface.dataId === entry.id;
            });

            if(newFilter(entry)) {
                /* This entry should be in the view, add it if it doesn't exist yet. */
                if(!surface) {
                    this._addItem(entry);
                }
            } else {
                /* This entry should not be in the view, remove if present. */
                if(surface) {
                    this._removeItem(entry);
                }
            }
        }
    }

    _findGroup(groupId) {
        return _.findIndex(this._dataSource, function (surface) {
            return surface.groupId === groupId;
        });
    }

    _findNextGroup(fromIndex) {
        let dslength = this._dataSource.length;
        for (let pos = fromIndex; pos < dslength; pos++) {
            if (this._dataSource[pos].groupId) {
                return pos;
            }
        }

        return this._dataSource.length - 1;
    }


    _getGroupByValue(child) {
        let groupByValue = '';
        if (typeof this.options.groupBy === 'function') {
            groupByValue = this.options.groupBy(child);
        } else if (typeof this.options.groupBy === 'string') {
            groupByValue = this.options.groupBy;
        }
        return groupByValue;
    }

    _addGroupItem(groupByValue) {
        let insertIndex = this.header ? 1 : 0;
        let newSurface = this.options.groupTemplate(groupByValue);
        newSurface.groupId = groupByValue;

        if (this.isDescending) {
            this.insert(insertIndex, newSurface);
            return insertIndex;
        } else {
            insertIndex = this._dataSource.length - 1;
            this.insert(insertIndex, newSurface);
            return insertIndex;
        }
    }

    _getGroupItemIndex(child) {
        let insertIndex;
        let groupByValue = this._getGroupByValue(child);
        let groupIndex = this._findGroup(groupByValue);
        if (groupIndex > -1) {
            insertIndex = groupIndex;
        } else {
            insertIndex = this._addGroupItem(groupByValue);
        }

        return insertIndex;
    }

    _getInsertIndex(child) {
        /* If we're using groups, find the item index of the group this item belongs to. If */
        if (this.isGrouped) {
            return this._getGroupItemIndex(child);
        }

        /* If we're using a header, that will be the first index, so the first index we can use is 1 instead of 0. */
        let firstIndex = this.header ? 1 : 0;

        /* Return the first or last position, depending on the sorting direction. */
        return this.isDescending ? firstIndex : this._dataSource.length;
    }

    _addItem(child) {
        this._removePlaceholder();

        let insertIndex = this._getInsertIndex(child);
        let newSurface = this.options.itemTemplate(child);
        newSurface.dataId = child.id;
        newSurface.on('click', function () {
            this._eventOutput.emit('child_click', {renderNode: newSurface, dataObject: child});
        }.bind(this));

        if (this.isGrouped) {
            if (this.isDescending) {
                insertIndex++;
            } else {
                insertIndex = this._findNextGroup(insertIndex) + 1;
            }
        }

        this.insert(insertIndex, newSurface);
    }


    _replaceItem(child) {

        let index = this._getDataSourceIndex(child.id);

        let newSurface = this.options.itemTemplate(child);
        newSurface.dataId = child.id;
        this.replace(index, newSurface);
    }


    _removeItem(child) {
        let index = _.findIndex(this._dataSource, function (surface) {
            return surface.dataId === child.id;
        });

        if (index > -1) {
            this.remove(index);
        }

        /* The amount of items in the dataSource is subtracted with a header if present, to get the total amount of actual items in the scrollView. */
        let itemCount = this._dataSource.length - (this.header ? 1 : 0);
        if (itemCount === 0) {
            this._addPlaceholder();
        }
    }


    _moveItem(oldId, prevChildId = null) {

        let oldIndex = this._getDataSourceIndex(oldId);
        let previousSiblingIndex = this._getNextVisibleIndex(prevChildId);

        if (oldIndex !== previousSiblingIndex) {
            this.move(oldIndex, previousSiblingIndex);
        }
    }

    _addHeader() {
        if (this.options.headerTemplate && !this.header) {
            this.header = this.options.headerTemplate();
            this.insert(0, this.header);
        }
    }

    _addPlaceholder() {
        if (this.options.placeholderTemplate && !this.placeholder) {
            let insertIndex = this.header ? 1 : 0;
            this.placeholder = this.options.placeholderTemplate();
            this.placeholder.dataId = this.placeholder.id = '_placeholder';
            this.insert(insertIndex, this.placeholder);
        }
    }

    _removePlaceholder() {
        if (this.placeholder) {
            this._removeItem(this.placeholder);
            this.placeholder = null;
        }
    }

    _bindDataSource() {

        if (!this.options.dataStore || !this.options.itemTemplate) {
            console.log('Datasource and template should both be set.');
            return;
        }

        if (!this.options.template instanceof Function) {
            console.log('Template needs to be a function.');
            return;
        }

        this.options.dataStore.on('child_added', function (child) {

            if (!this.options.dataFilter ||
                (typeof this.options.dataFilter === 'function')) {

                let result = this.options.dataFilter(child);

                if (result instanceof Promise) {
                    /* If the result is a Promise, show the item when that promise resolves. */
                    result.then((show) => { if (show) { this.throttler.add(() => { return this._addItem(child); }); } });
                } else if (result) {
                    /* The result is an item, so we can add it directly. */
                    this.throttler.add(() => { return this._addItem(child); });
                }
            }
        }.bind(this));


        this.options.dataStore.on('child_changed', function (child, previousSibling) {

            let changedItem = this._getDataSourceIndex(child.id);

            if (this._dataSource && changedItem < this._dataSource.length) {

                if (this.options.dataFilter &&
                    typeof this.options.dataFilter === 'function' && !this.options.dataFilter(child)) {
                    this._removeItem(child);
                } else {
                    if (changedItem === -1) {
                        this.throttler.add(() => { return this._addItem(child); });
                        this.throttler.add(() => { return this._moveItem(child.id, previousSibling); });
                    } else {
                        this.throttler.add(() => { return this._replaceItem(child); });
                        this.throttler.add(() => { return this._moveItem(child.id, previousSibling); });
                    }
                }
            }
        }.bind(this));


        this.options.dataStore.on('child_moved', function (child, previousSibling) {
            let current = this._getDataSourceIndex(child.id);
            let previous = this._getDataSourceIndex(previousSibling);
            this.throttler.add(() => { return this._moveItem(current, previous); });
        }.bind(this));


        this.options.dataStore.on('child_removed', function (child) {
            this.throttler.add(() => { return this._removeItem(child); });
        }.bind(this));
    }


    _getDataSourceIndex(id) {
        return _.findIndex(this._dataSource, function (surface) {
            return surface.dataId === id;
        });
    }


    _getNextVisibleIndex(id) {

        let viewIndex = this._getDataSourceIndex(id);
        if (viewIndex === -1) {
            let modelIndex = _.findIndex(this.options.dataStore, function (model) {
                return model.id === id;
            });

            if (modelIndex === 0 || modelIndex === -1) {
                return this.isDescending ? this._dataSource ? this._dataSource.length - 1 : 0 : 0;
            } else {
                let nextModel = this.options.dataStore[this.isDescending ? modelIndex + 1 : modelIndex - 1];
                let nextIndex = this._getDataSourceIndex(nextModel.id);
                if (nextIndex > -1) {

                    return this.isDescending ? nextIndex === 0 ? 0 : nextIndex - 1 :
                                   this._dataSource.length === nextIndex + 1 ? nextIndex : nextIndex + 1;
                } else {
                    return this._getNextVisibleIndex(nextModel.id);
                }
            }
        } else {
            return this.isDescending ? viewIndex === 0 ? 0 : viewIndex - 1 :
                           this._dataSource.length === viewIndex + 1 ? viewIndex : viewIndex + 1;
        }
    }
}