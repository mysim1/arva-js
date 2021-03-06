/**
 * Created by lundfall on 04/07/2017.
 */
import EventEmitter     from 'eventemitter3'
import { ObjectHelper }               from 'arva-js/utils/ObjectHelper.js'

let isObserved = Symbol('isObserved')

export class ArrayObserver extends EventEmitter {

  dirtyPositions = {}

  /**
   *
   * @param array
   * @param hookFunction
   */
  constructor (array, hookFunction = () => {}) {
    super()
    if (!Array.isArray(array)) {
      throw new Error(`Array observer created without array!`)
    }
    this._hookFunction = hookFunction
    this._array = array
    Object.defineProperty(this._array, isObserved, {value: true, enumerable: false})
    this.rebuild()
    this._overrideMethods()
    this._hijackMapper()
  }

  static isArrayObserved (array) {
    return !!array[isObserved]
  }

  rebuild () {
    if (this._arrayLength) {
      for (let index = this._arrayLength; index < this._array.length; index++) {
        this._addHookAtIndex(index)
      }
    } else {
      /* Initializing for the first time */
      for (let [index] of this._array.entries()) {
        this._addHookAtIndex(index)
      }
    }
    for (let index in this._dirtyPositions) {
      this._addHookAtIndex(index)
    }

    this._arrayLength = this._array.length
    this._dirtyPositions = {}
  }

  _overrideModificaitionMethod (methodName, newMethod) {
    let originalMethod = this._array[methodName]
    Object.defineProperty(this._array, methodName, {
      value: function () {
        let result = originalMethod.apply(this._array, arguments)
        newMethod.call(this, ...arguments, result)
        this.emit('modified', {methodName})
        return result
      }.bind(this), enumerable: false
    })
  }

  _addHookAtIndex (index) {
    if (this._hasHookAtIndex(index)) {
      return
    }

    ObjectHelper.addGetSetPropertyWithShadow(this._array, index, this._array[index], false, true, ({newValue, oldValue}) => {
      this.emit('replaced', {newValue, oldValue, index})
      this._dirtyPositions[index] = true
    }, () => {
      this.emit('accessed', {index})
    })
    this._hookFunction(index, this._array[index])
  }

  _hijackMapper (callback) {
    //TODO Finalize and optimize
    this._overrideReadMethod('map', (originalMapFunction, passedMapper) => {
      this.emit('mapCalled', originalMapFunction, passedMapper)
      let mappedEntries = originalMapFunction.call(this._array, passedMapper)
      return new MappedArray(mappedEntries)
    })
  }

  _hasHookAtIndex (index) {
    return !!Object.getOwnPropertyDescriptor(this._array, index).get
  }

  _overrideMethods () {
    this._overrideModificaitionMethod('pop', this._pop)
    this._overrideModificaitionMethod('push', this._push)
    this._overrideModificaitionMethod('reverse', this._reverse)
    this._overrideModificaitionMethod('shift', this._shift)
    this._overrideModificaitionMethod('unshift', this._unshift)
    this._overrideModificaitionMethod('sort', this._sort)
    this._overrideModificaitionMethod('splice', this._splice)
  }

  _overrideReadMethod (methodName, replacement) {
    let originalMethod = this._array[methodName]
    Object.defineProperty(this._array, methodName, {
      value: function () {
        return replacement(originalMethod, ...arguments)
      }.bind(this), enumerable: false
    })
  }

  _pop (removedElement) {
    if (this._array.length) {
      this.emit('removed', {index: this._array.length, oldValue: removedElement})
    }
  }

  _push (element, newLength) {
    this.emit('added', {index: newLength - 1, newValue: element})
  }

  _reverse (reversedArray) {
    //todo anything to do here?
  }

  _shift (shiftedElement) {
    this.emit('removed', {index: this._array.length, oldValue: this._array[this._array.length - 1]})
  }

  _sort () {
    //todo anything todo here?
  }

  _splice (start, deleteCount, ...itemsToAddAndDeletedElements) {

    let deletedElements =
      itemsToAddAndDeletedElements.slice(-deleteCount)
    let itemsToAdd = itemsToAddAndDeletedElements.slice(0, -deleteCount)

    let maxIndex = Math.max(deletedElements.length, itemsToAdd.length)
    for (let index = start; index < maxIndex; index++) {
      if (index < deletedElements.length) {
        this.emit('removed', {index, oldValue: deletedElements[index]})
      }
    }

  }

  _unshift (newLength, ...newItems) {
    for (let index = this._array.length - newItems.length; index < this._array.length; index++) {
      this.emit('added', {index, newValue: this._array[index]})
    }
  }
}

export class MappedArray {
  constructor (array) {
    this._array = array
  }

  getArray () {
    return this._array
  }
}
//TODO remove this!
window.o = [1, 2, 3]

window.arr = ArrayObserver
window.test = new ArrayObserver(o)

let debugListen = (eventName) => {
  window.test.on(eventName, function () {
    console.log(eventName, ...arguments)
  })
}

debugListen('removed')
debugListen('replaced')
debugListen('added')
debugListen('accessed')
debugListen('modified')
