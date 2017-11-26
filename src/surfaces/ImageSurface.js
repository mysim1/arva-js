/**
 * This Source Code is licensed under the MIT license. If a copy of the
 * MIT-license was not distributed with this file, You can obtain one at:
 * http://opensource.org/licenses/mit-license.html.
 *
 * @author: Hans van den Akker (mysim1)
 * @license MIT
 * @copyright Bizboard, 2015 - 2016
 *
 * This is an ES6 port of the BKImageSurface of Hein Rutjes (IjzerenHein).
 *
 */

/**
 * BkImageSurface adds support for sizing-strategies such as AspectFit and AspectFill for displaying images with famo.us.
 * It uses a 'div' with a background-image rather than a 'img' tag.
 *
 * Can be used as a drop-in replacement for ImageSurface, in case the the size of the div is not derived
 * from the image.
 *
 * @module
 */

import FamousSurface from 'famous/core/Surface';


/**
 * @class
 * @param {Object} options Options.
 * @param {String} [options.content] Image-url.
 * @param {SizeMode|String} [options.sizeMode] Size-mode to use.
 * @param {PositionMode|String} [options.positionMode] Position-mode to use.
 * @param {RepeatMode|String} [options.repeatMode] Repeat-mode to use.
 * @alias module:BkImageSurface
 */
export class ImageSurface extends FamousSurface {

    static SizeMode = {
        AUTO: 'auto',
        FILL: '100% 100%',
        ASPECTFILL: 'cover',
        ASPECTFIT: 'contain'
    };

    static PositionMode = {
        CENTER: 'center center',
        LEFT: 'left center',
        RIGHT: 'right center',
        TOP: 'center top',
        BOTTOM: 'center bottom',
        TOPLEFT: 'left top',
        TOPRIGHT: 'right top',
        BOTTOMLEFT: 'left bottom',
        BOTTOMRIGHT: 'right bottom'
    };

    static RepeatMode = {
        NONE: 'no-repeat',
        VERTICAL: 'repeat-x',
        HORIZONTAL: 'repeat-y',
        BOTH: 'repeat'
    };

    constructor(options) {
        super(options);
        this.content = undefined;
        this._imageUrl = options ? options.content : undefined;
        this._sizeMode = (options && options.sizeMode) ? options.sizeMode : ImageSurface.SizeMode.FILL;
        this._positionMode = (options && options.positionMode) ? options.positionMode : ImageSurface.PositionMode.CENTER;
        this._repeatMode = (options && options.repeatMode) ? options.repeatMode : ImageSurface.RepeatMode.NONE;

        this._updateProperties();
    }

    /**
     * Update the css-styles on the div.
     *
     * @private
     */
    _updateProperties() {
        var props = this.getProperties();
        if (this._imageUrl) {
            var imageUrl = this._imageUrl;
            // url encode '(' and ')'
            if ((imageUrl.indexOf('(') >= 0) || (imageUrl.indexOf(')') >= 0)) {
                imageUrl = imageUrl.split('(').join('%28');
                imageUrl = imageUrl.split(')').join('%29');
            }
            props.backgroundImage = 'url(' + imageUrl + ')';
        }
        else {
            props.backgroundImage = '';
        }
        props.backgroundSize = this._sizeMode;
        props.backgroundPosition = this._positionMode;
        props.backgroundRepeat = this._repeatMode;
        this.setProperties(props);
    }

    /**
     * @param {String} imageUrl Image-url, when set will cause re-rendering
     */
    setContent(imageUrl) {
        this._imageUrl = imageUrl;
        this._updateProperties();
    }

    /**
     * @return {String} Image-url
     */
    getContent() {
        return this._imageUrl;
    }

    /**
     * @param {SizeMode|String} sizeMode Sizing-mode, when set will cause re-rendering
     */
    setSizeMode(sizeMode) {
        this._sizeMode = sizeMode;
        this._updateProperties();
    }

    /**
     * @return {SizeMode|String} Size-mode
     */
    getSizeMode() {
        return this._sizeMode;
    }

    /**
     * @param {PositionMode|String} positionMode Position-mode, when set will cause re-rendering
     */
    setPositionMode(positionMode) {
        this._positionMode = positionMode;
        this._updateProperties();
    }

    /**
     * @return {RepeatMode|String} Position-mode
     */
    getPositionMode() {
        return this._positionMode;
    }

    /**
     * @param {RepeatMode|String} repeatMode Repeat-mode, when set will cause re-rendering
     */
    setRepeatMode(repeatMode) {
        this._repeatMode = repeatMode;
        this._updateProperties();
    }

    /**
     * @return {RepeatMode|String} Repeat-mode
     */
    getRepeatMode() {
        return this._repeatMode;
    }

    /**
     * Place the document element that this component manages into the document.
     *
     * NOTE: deploy and recall were added because famo.us removed the background-image
     * after the surface was removed/re-added from the DOM.
     *
     * @private
     * @param {Node} target document parent of this container
     */
    deploy(target) {
        target.innerHTML = '';
        if (this._imageUrl) {
            target.style.backgroundImage = 'url(' + this._imageUrl + ')';
        }
    }

    /**
     * Remove this component and contained content from the document
     *
     * NOTE: deploy and recall were added because famo.us removed the background-image
     * after the surface was removed/re-added from the DOM.
     *
     * @private
     * @param {Node} target node to which the component was deployed
     */
    recall(target) {
        target.style.backgroundImage = '';
    }
}
