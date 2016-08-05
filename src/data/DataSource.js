/**


 @author: Tom Clement (tjclement)
 @license NPOSL-3.0
 @copyright Bizboard, 2015

 */

export class DataSource {

    /**
     * @param {String} path Full path to resource in remote data storage.
     * @return {DataSource} DataSource instance.
     **/
    constructor(path) {
        this._dataReference = null;
    }

    /**
     * Indicate that the DataSource can be inherited when instantiating a list of models. By
     * default we indicate false, which should trigger data model instantiation to create unique
     * DataSource references to each model either in array or directly.
     *
     * If set to false, model updates trigger creation of a new DataSource instance. (default)
     *
     * @returns {Boolean} Whether the DataSource is inheritable.
     */
    get inheritable() {
        return false;
    }

    /**
     * Returns the full path to this dataSource's source on the remote storage provider.
     * @returns {String} Full resource path.
     */
    toString() {
    }

    /**
     * Returns a dataSource reference to the given child branch of the current dataSource.
     * @param {String} childName Child branch name.
     * @param {Object} options Optional: additional options to pass to new DataSource instance.
     * @returns {DataSource} New dataSource instance pointing to the given child branch.
     */
    child(childName, options = null) {
    }

    /**
     * Returns the full URL to the path on the dataSource. Functionally identical to toString().
     * @returns {String} Full resource path.
     */
    path() {
    }

    /**
     * Returns the name of the current branch in the path on the dataSource.
     * @returns {String} Current branch name.
     */
    key() {
    }

    /**
     * Writes newData to the path this dataSource was constructed with.
     * @param {Object} newData Data to write to dataSource.
     * @returns {Promise} Resolves when write to server is complete.
     */
    set(newData) {
        return Promise.resolve();
    }

    /**
     * Removes the object and all underlying children that this dataSource points to.
     * @returns {void}
     */
    remove() {
    }

    /**
     * Writes newData to the path this dataSource was constructed with, appended by a random UID generated by
     * the dataSource.
     * @param {Object} newData New data to append to dataSource.
     * @returns {void}
     */
    push(newData) {
    }

    /**
     * Writes newData with given priority (ordering) to the path this dataSource was constructed with.
     * @param {Object} newData New data to set.
     * @param {String|Number} priority Priority value by which the data should be ordered.
     * @returns {Promise} Resolves when write to server is complete.
     */
    setWithPriority(newData, priority) {
        return Promise.resolve();
    }

    /**
     * Sets the priority (ordering) of an object on a given dataSource.
     * @param {String|Number} newPriority New priority value to order data by.
     * @returns {void}
     */
    setPriority(newPriority) {
    }

    /**
     * Orders the DataSource's childs by the value in child[key].
     * @param {String} childKey Key of the field to order by.
     * @returns {DataSource} New dataSource instance.
     */
    orderByChild(childKey) {
    }

    /**
     * Orders the DataSource's childs by their key names, ignoring their priority.
     * @returns {DataSource} New dataSource instance.
     */
    orderByKey() {
    }

    /**
     * Orders the DataSource's childs by their values, ignoring their priority.
     * @returns {DataSource} New dataSource instance.
     */
    orderByValue() {
    }

    /**
     * Returns a new dataSource reference that will limit the subscription to only the first given amount items.
     * @param {Number} amount Amount of items to limit the dataSource to.
     * @returns {DataSource} New dataSource instance.
     */
    limitToFirst(amount) {
    }

    /**
     * Returns a new dataSource reference that will limit the subscription to only the last given amount items.
     * @param {Number} amount Amount of items to limit the dataSource to.
     * @returns {DataSource} New dataSource instance.
     */
    limitToLast(amount) {
    }

    /**
     * Authenticates all instances of this DataSource with the given OAuth provider and credentials.
     * @param {String} provider google, facebook, github, or twitter
     * @param {String|Object} credentials Access token string, or object with key/value pairs with e.g. OAuth 1.1 credentials.
     * @param {Function} onComplete Callback, executed when login is completed either successfully or erroneously.
     * On error, first argument is error message.
     * On success, the first argument is null, and the second argument is an object containing the fields uid, provider, auth, and expires.
     * @param {Object} options Optional, additional client arguments, such as configuring session persistence.
     * @returns {void}
     */
    authWithOAuthToken(provider, credentials, onComplete, options) {
    }

    /**
     * Authenticates all instances of this DataSource with a custom auth token or secret.
     * @param {String} authToken Authentication token or secret.
     * @param {Function} onComplete Callback, executed when login is completed either successfully or erroneously.
     * On error, first argument is error message.
     * On success, the first argument is null, and the second argument is an object containing the fields uid, provider, auth, and expires.
     * @param {Object} options Optional, additional client arguments, such as configuring session persistence.
     * @returns {void}
     */
    authWithCustomToken(authToken, onComplete, options) {
    }

    /**
     * Authenticates all instances of this DataSource with the given email/password credentials.
     * @param {String|Object} credentials Object with key/value pairs {email: "value", password:"value"}.
     * @param {Function} onComplete Callback, executed when login is completed either successfully or erroneously.
     * On error, first argument is error message.
     * On success, the first argument is null, and the second argument is an object containing the fields uid, provider, auth, and expires.
     * @param {Object} options Optional, additional client arguments, such as configuring session persistence.
     * @returns {void}
     */
    authWithPassword(credentials, onComplete, options) {
    }

    /**
     * Authenticates all instances of this DataSource as an anonymous user.
     * @param {Function} onComplete Callback, executed when login is completed either successfully or erroneously.
     * On error, first argument is error message.
     * On success, the first argument is null, and the second argument is an object containing the fields uid, provider, auth, and expires.
     * @param {Object} options Optional, additional client arguments, such as configuring session persistence.
     * @returns {void}
     */
    authAnonymously(onComplete, options) {
    }

    /**
     * Fetches the current user's authentication state.
     * If the user is authenticated, returns an object containing at least the fields uid, provider, auth, and expires.
     * If the user is not authenticated, returns null.
     * @returns {Object|null} User auth object.
     */
    getAuth() {
    }

    /**
     * Logs out from the datasource, allowing to re-authenticate at a later time.
     * @returns {void}
     */
    unauth() {
    }

    /**
     * Subscribe to an event emitted by the DataSource.
     * @param {String} event Event type to subscribe to. Allowed values are: 'value', 'child_changed', 'child_added', 'child_removed', 'child_moved'.
     * @param {Function} handler Function to call when the subscribed event is emitted.
     * @param {Object} context Context to set 'this' to when calling the handler function.
     */
    on(event, handler, context) {
    }

    /**
     * Subscribe to an event emitted by the DataSource once, and then immediately unsubscribe.
     * @param {String} event Event type to subscribe to. Allowed values are: 'value', 'child_changed', 'child_added', 'child_removed', 'child_moved'.
     * @param {Function} handler Function to call when the subscribed event is emitted.
     * @param {Object} context Context to set 'this' to when calling the handler function.
     */
    once(event, handler, context) {
    }


    /**
     * Unsubscribe to a previously subscribed event. If no handler or context is given, all handlers for
     * the given event are removed. If no parameters are given at all, all event types will have their handlers removed.
     * @param {String} event Event type to unsubscribe from. Allowed values are: 'value', 'child_changed', 'child_added', 'child_removed', 'child_moved'.
     * @param {Function} handler Optional: Function that was used in previous subscription.
     */
    off(event, handler) {
    }

    /**
     * Sets the callback triggered when dataSource updates the data.
     * @param {Function} callback Callback function to call when the subscribed data value changes.
     * @returns {void}
     **/
    setValueChangedCallback(callback) {
    }

    /**
     * Removes the callback set to trigger when dataSource updates the data.
     * @returns {void}
     **/
    removeValueChangedCallback() {
    }

    /**
     * Set the callback triggered when dataSource adds a data element.
     * @param {Function} callback Callback function to call when a new data child is added.
     * @returns {void}
     **/
    setChildAddedCallback(callback) {
    }

    /**
     * Removes the callback set to trigger when dataSource adds a data element.
     * @returns {void}
     **/
    removeChildAddedCallback() {
    }

    /**
     * Set the callback triggered when dataSource changes a data element.
     * @param {Function} callback Callback function to call when a child is changed.
     * @returns {void}
     **/
    setChildChangedCallback(callback) {
    }

    /**
     * Removes the callback set to trigger when dataSource changes a data element.
     * @returns {void}
     **/
    removeChildChangedCallback() {
    }

    /**
     * Set the callback triggered when dataSource moves a data element.
     * @param {Function} callback Callback function to call when a child is moved.
     * @returns {void}
     **/
    setChildMovedCallback(callback) {
    }

    /**
     * Removes the callback set to trigger when dataSource moves a data element.
     * @returns {void}
     **/
    removeChildMovedCallback() {
    }

    /**
     * Set the callback triggered when dataSource removes a data element.
     * @param {Function} callback Callback function to call when a child is removed.
     * @returns {void}
     **/
    setChildRemovedCallback(callback) {
    }

    /**
     * Removes the callback set to trigger when dataSource removes a data element.
     * @returns {void}
     **/
    removeChildRemovedCallback() {
    }


    /**
     * Resolves when the DataSource is synchronized to the server
     * @returns {Promise} Resolves when the DataSource is synchronized
     */
    synced() {
    }
}