import {notFound, OptionObserver, listeners} from './OptionObserver';

export let changeValue = Symbol('changeValue'),
    unwrapValue = Symbol('unwrapValue'),
    storedInputOption = Symbol('storedInputOption');

/* Every property has to be represented by Symbols in order to avoid any collisions with option names */
let nestedPropertyPath = Symbol('nestedPropertyPath'),
    optionParentObject = Symbol('optionParentObject'),
    foreignNestedPropertyPath = Symbol('foreignNestedPropertyPath'),
    propertyName = Symbol('propertyName'),
    optionObject = Symbol('optionObject'),
    optionObserver = Symbol('optionObserver'),
    /* This is the option observer that consumes the input option */
    foreignOptionObserver = Symbol('optionObserver'),
    listenerTree = Symbol('listenerTree');

/**
 * Represents an option where data flows upwards
 */
export class InputOption {
    constructor(incomingNestedPropertyPath, incomingOptionObserver, incomingListenerTree) {
        this[nestedPropertyPath] = incomingNestedPropertyPath.slice(0, -1);
        this[optionObserver] = incomingOptionObserver;
        this[propertyName] = incomingNestedPropertyPath[incomingNestedPropertyPath.length - 1];
        this[listenerTree] = incomingListenerTree;

    }

    [changeValue] = (newValue) => {
        let storedOptionsObserver = this[optionObserver];
        if (this._shouldMuteUpdatesWhenChanging) {
            //todo does this work 100% for arrays? todo: This won't work for subsequent updates, need to clear this._forbiddenUpdates... immediately after
            if (!this._entryNames) {
                throw new Error('Trying to change unwrapped value in InputOption');
            }
            storedOptionsObserver.preventEntryFromBeingUpdated(this._entryNames);
        }
        let optionParentObject = storedOptionsObserver.accessObjectPath(storedOptionsObserver.getOptions(), this[nestedPropertyPath]);
        if (optionParentObject === notFound) {
            throw new Error('Cannot change value of root input option');
        }
        optionParentObject[this[propertyName]] = newValue;
        if (this._shouldMuteUpdatesWhenChanging) {
            storedOptionsObserver.allowEntryToBeUpdated(this._entryNames);
        }
    };

    [unwrapValue] = (theForeignOptionObserver, theForeignNestedPropertyPath) => {
        //TODO This function is getting a little bit too long
        let storedInputOptions = this[listenerTree][storedInputOption];
        if(!storedInputOptions){
            storedInputOptions = this[listenerTree][storedInputOption] = [];
        }
        storedInputOptions.push(this);
        this[foreignNestedPropertyPath] = theForeignNestedPropertyPath;
        let storedOptionsObserver = this[optionObserver];
        //TODO When unwrapValue is called for the second time, this._shouldMuteUpdatesWhenChanging will always go to false
        //There should be another solution, but not sure how to implement it
        let activeRecordings = storedOptionsObserver.getActiveRecordings();
        let recordedEntryNames = Object.keys(activeRecordings);
        if (recordedEntryNames.length !== 1) {
            throw new Error(recordedEntryNames[OptionObserver.preprocess] ?
                'Input option cannot be unwrapped inside preprocess function' :
                recordedEntryNames.length === 0 ?
                    'Cannot unwrap input option outside renderable initializer' :
                    'Trying to unwrap value in InputOption but OptionObserver should have exactly one recording');
        }
        /* Determine if there's already listeners for this. If not, we should suppress certain updates from happening */
        this._entryNames = [];
        let recordedEntryName;
        let listenersInsideListenerTree = this[listenerTree][listeners];
        let listenerForRecordAlreadyDefined = false;

        /* Go into the nested structure to get the full entryNames list (should be quite flat, if not completely) */
        do {
            recordedEntryNames = Object.keys(activeRecordings);
            recordedEntryName = recordedEntryNames[0];
            if (recordedEntryName) {
                this._entryNames.push(recordedEntryName);
            }
            listenersInsideListenerTree = listenersInsideListenerTree[recordedEntryName] || {};
            activeRecordings = activeRecordings[recordedEntryName];
            if (listenersInsideListenerTree === true) {
                listenerForRecordAlreadyDefined = true;
            }
        } while (activeRecordings);
        if(theForeignOptionObserver && theForeignOptionObserver !== this[foreignOptionObserver]){
            this._setupForeignOptionObserverListener(theForeignOptionObserver)
        }
        this._shouldMuteUpdatesWhenChanging = !listenerForRecordAlreadyDefined;

        return storedOptionsObserver.accessObjectPath(this[optionObserver].getOptions(), this[nestedPropertyPath].concat(this[propertyName]));
    };

    updateValueIfNecessary(){
        if(this._valueShouldBeInvalidated){
            this[foreignOptionObserver].flushUpdates();
        }
    }

    _setupForeignOptionObserverListener(theForeignOptionObserver) {
        this[foreignOptionObserver] = theForeignOptionObserver;
        theForeignOptionObserver.on('propertyUpdated', ({nestedPropertyPath: nestedPathOfUpdate, propertyName, value, oldValue})=> {
            /* Check if the updated property is a subset of the own nested property */
            for(let [index, intermediatePropertyName] of nestedPathOfUpdate.concat(propertyName).entries()){
                if(intermediatePropertyName !== this[foreignNestedPropertyPath][index]){
                    return;
                }
            }
            this._valueShouldBeInvalidated = true;
            theForeignOptionObserver.once('postFlush', () =>{
                this._valueShouldBeInvalidated = false;
            });
        })
    }
}