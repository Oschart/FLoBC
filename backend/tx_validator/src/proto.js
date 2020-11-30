/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
(function(global, factory) { /* global define, require, module */

    /* AMD */ if (typeof define === 'function' && define.amd)
        define(["protobufjs/minimal"], factory);

    /* CommonJS */ else if (typeof require === 'function' && typeof module === 'object' && module && module.exports)
        module.exports = factory(require("protobufjs/minimal"));

})(this, function($protobuf) {
    "use strict";

    // Common aliases
    var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;
    
    // Exported root namespace
    var $root = $protobuf.roots.machinelearning || ($protobuf.roots.machinelearning = {});
    
    $root.Model = (function() {
    
        /**
         * Properties of a Model.
         * @exports IModel
         * @interface IModel
         * @property {number|null} [version] Model version
         * @property {number|null} [size] Model size
         * @property {Array.<number>|null} [weights] Model weights
         */
    
        /**
         * Constructs a new Model.
         * @exports Model
         * @classdesc Represents a Model.
         * @implements IModel
         * @constructor
         * @param {IModel=} [properties] Properties to set
         */
        function Model(properties) {
            this.weights = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * Model version.
         * @member {number} version
         * @memberof Model
         * @instance
         */
        Model.prototype.version = 0;
    
        /**
         * Model size.
         * @member {number} size
         * @memberof Model
         * @instance
         */
        Model.prototype.size = 0;
    
        /**
         * Model weights.
         * @member {Array.<number>} weights
         * @memberof Model
         * @instance
         */
        Model.prototype.weights = $util.emptyArray;
    
        /**
         * Creates a new Model instance using the specified properties.
         * @function create
         * @memberof Model
         * @static
         * @param {IModel=} [properties] Properties to set
         * @returns {Model} Model instance
         */
        Model.create = function create(properties) {
            return new Model(properties);
        };
    
        /**
         * Encodes the specified Model message. Does not implicitly {@link Model.verify|verify} messages.
         * @function encode
         * @memberof Model
         * @static
         * @param {IModel} message Model message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Model.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.version != null && Object.hasOwnProperty.call(message, "version"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.version);
            if (message.size != null && Object.hasOwnProperty.call(message, "size"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.size);
            if (message.weights != null && message.weights.length) {
                writer.uint32(/* id 3, wireType 2 =*/26).fork();
                for (var i = 0; i < message.weights.length; ++i)
                    writer.float(message.weights[i]);
                writer.ldelim();
            }
            return writer;
        };
    
        /**
         * Encodes the specified Model message, length delimited. Does not implicitly {@link Model.verify|verify} messages.
         * @function encodeDelimited
         * @memberof Model
         * @static
         * @param {IModel} message Model message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Model.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };
    
        /**
         * Decodes a Model message from the specified reader or buffer.
         * @function decode
         * @memberof Model
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {Model} Model
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Model.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Model();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.version = reader.uint32();
                    break;
                case 2:
                    message.size = reader.uint32();
                    break;
                case 3:
                    if (!(message.weights && message.weights.length))
                        message.weights = [];
                    if ((tag & 7) === 2) {
                        var end2 = reader.uint32() + reader.pos;
                        while (reader.pos < end2)
                            message.weights.push(reader.float());
                    } else
                        message.weights.push(reader.float());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        /**
         * Decodes a Model message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof Model
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {Model} Model
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Model.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };
    
        /**
         * Verifies a Model message.
         * @function verify
         * @memberof Model
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Model.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.version != null && message.hasOwnProperty("version"))
                if (!$util.isInteger(message.version))
                    return "version: integer expected";
            if (message.size != null && message.hasOwnProperty("size"))
                if (!$util.isInteger(message.size))
                    return "size: integer expected";
            if (message.weights != null && message.hasOwnProperty("weights")) {
                if (!Array.isArray(message.weights))
                    return "weights: array expected";
                for (var i = 0; i < message.weights.length; ++i)
                    if (typeof message.weights[i] !== "number")
                        return "weights: number[] expected";
            }
            return null;
        };
    
        /**
         * Creates a Model message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof Model
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {Model} Model
         */
        Model.fromObject = function fromObject(object) {
            if (object instanceof $root.Model)
                return object;
            var message = new $root.Model();
            if (object.version != null)
                message.version = object.version >>> 0;
            if (object.size != null)
                message.size = object.size >>> 0;
            if (object.weights) {
                if (!Array.isArray(object.weights))
                    throw TypeError(".Model.weights: array expected");
                message.weights = [];
                for (var i = 0; i < object.weights.length; ++i)
                    message.weights[i] = Number(object.weights[i]);
            }
            return message;
        };
    
        /**
         * Creates a plain object from a Model message. Also converts values to other types if specified.
         * @function toObject
         * @memberof Model
         * @static
         * @param {Model} message Model
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Model.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.weights = [];
            if (options.defaults) {
                object.version = 0;
                object.size = 0;
            }
            if (message.version != null && message.hasOwnProperty("version"))
                object.version = message.version;
            if (message.size != null && message.hasOwnProperty("size"))
                object.size = message.size;
            if (message.weights && message.weights.length) {
                object.weights = [];
                for (var j = 0; j < message.weights.length; ++j)
                    object.weights[j] = options.json && !isFinite(message.weights[j]) ? String(message.weights[j]) : message.weights[j];
            }
            return object;
        };
    
        /**
         * Converts this Model to JSON.
         * @function toJSON
         * @memberof Model
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Model.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        return Model;
    })();
    
    $root.TxShareUpdates = (function() {
    
        /**
         * Properties of a TxShareUpdates.
         * @exports ITxShareUpdates
         * @interface ITxShareUpdates
         * @property {Array.<number>|null} [gradients] TxShareUpdates gradients
         * @property {number|Long|null} [seed] TxShareUpdates seed
         */
    
        /**
         * Constructs a new TxShareUpdates.
         * @exports TxShareUpdates
         * @classdesc Represents a TxShareUpdates.
         * @implements ITxShareUpdates
         * @constructor
         * @param {ITxShareUpdates=} [properties] Properties to set
         */
        function TxShareUpdates(properties) {
            this.gradients = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * TxShareUpdates gradients.
         * @member {Array.<number>} gradients
         * @memberof TxShareUpdates
         * @instance
         */
        TxShareUpdates.prototype.gradients = $util.emptyArray;
    
        /**
         * TxShareUpdates seed.
         * @member {number|Long} seed
         * @memberof TxShareUpdates
         * @instance
         */
        TxShareUpdates.prototype.seed = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
    
        /**
         * Creates a new TxShareUpdates instance using the specified properties.
         * @function create
         * @memberof TxShareUpdates
         * @static
         * @param {ITxShareUpdates=} [properties] Properties to set
         * @returns {TxShareUpdates} TxShareUpdates instance
         */
        TxShareUpdates.create = function create(properties) {
            return new TxShareUpdates(properties);
        };
    
        /**
         * Encodes the specified TxShareUpdates message. Does not implicitly {@link TxShareUpdates.verify|verify} messages.
         * @function encode
         * @memberof TxShareUpdates
         * @static
         * @param {ITxShareUpdates} message TxShareUpdates message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TxShareUpdates.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.gradients != null && message.gradients.length) {
                writer.uint32(/* id 1, wireType 2 =*/10).fork();
                for (var i = 0; i < message.gradients.length; ++i)
                    writer.float(message.gradients[i]);
                writer.ldelim();
            }
            if (message.seed != null && Object.hasOwnProperty.call(message, "seed"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint64(message.seed);
            return writer;
        };
    
        /**
         * Encodes the specified TxShareUpdates message, length delimited. Does not implicitly {@link TxShareUpdates.verify|verify} messages.
         * @function encodeDelimited
         * @memberof TxShareUpdates
         * @static
         * @param {ITxShareUpdates} message TxShareUpdates message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TxShareUpdates.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };
    
        /**
         * Decodes a TxShareUpdates message from the specified reader or buffer.
         * @function decode
         * @memberof TxShareUpdates
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {TxShareUpdates} TxShareUpdates
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TxShareUpdates.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.TxShareUpdates();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    if (!(message.gradients && message.gradients.length))
                        message.gradients = [];
                    if ((tag & 7) === 2) {
                        var end2 = reader.uint32() + reader.pos;
                        while (reader.pos < end2)
                            message.gradients.push(reader.float());
                    } else
                        message.gradients.push(reader.float());
                    break;
                case 2:
                    message.seed = reader.uint64();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        /**
         * Decodes a TxShareUpdates message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof TxShareUpdates
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {TxShareUpdates} TxShareUpdates
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TxShareUpdates.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };
    
        /**
         * Verifies a TxShareUpdates message.
         * @function verify
         * @memberof TxShareUpdates
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        TxShareUpdates.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.gradients != null && message.hasOwnProperty("gradients")) {
                if (!Array.isArray(message.gradients))
                    return "gradients: array expected";
                for (var i = 0; i < message.gradients.length; ++i)
                    if (typeof message.gradients[i] !== "number")
                        return "gradients: number[] expected";
            }
            if (message.seed != null && message.hasOwnProperty("seed"))
                if (!$util.isInteger(message.seed) && !(message.seed && $util.isInteger(message.seed.low) && $util.isInteger(message.seed.high)))
                    return "seed: integer|Long expected";
            return null;
        };
    
        /**
         * Creates a TxShareUpdates message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof TxShareUpdates
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {TxShareUpdates} TxShareUpdates
         */
        TxShareUpdates.fromObject = function fromObject(object) {
            if (object instanceof $root.TxShareUpdates)
                return object;
            var message = new $root.TxShareUpdates();
            if (object.gradients) {
                if (!Array.isArray(object.gradients))
                    throw TypeError(".TxShareUpdates.gradients: array expected");
                message.gradients = [];
                for (var i = 0; i < object.gradients.length; ++i)
                    message.gradients[i] = Number(object.gradients[i]);
            }
            if (object.seed != null)
                if ($util.Long)
                    (message.seed = $util.Long.fromValue(object.seed)).unsigned = true;
                else if (typeof object.seed === "string")
                    message.seed = parseInt(object.seed, 10);
                else if (typeof object.seed === "number")
                    message.seed = object.seed;
                else if (typeof object.seed === "object")
                    message.seed = new $util.LongBits(object.seed.low >>> 0, object.seed.high >>> 0).toNumber(true);
            return message;
        };
    
        /**
         * Creates a plain object from a TxShareUpdates message. Also converts values to other types if specified.
         * @function toObject
         * @memberof TxShareUpdates
         * @static
         * @param {TxShareUpdates} message TxShareUpdates
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        TxShareUpdates.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.gradients = [];
            if (options.defaults)
                if ($util.Long) {
                    var long = new $util.Long(0, 0, true);
                    object.seed = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.seed = options.longs === String ? "0" : 0;
            if (message.gradients && message.gradients.length) {
                object.gradients = [];
                for (var j = 0; j < message.gradients.length; ++j)
                    object.gradients[j] = options.json && !isFinite(message.gradients[j]) ? String(message.gradients[j]) : message.gradients[j];
            }
            if (message.seed != null && message.hasOwnProperty("seed"))
                if (typeof message.seed === "number")
                    object.seed = options.longs === String ? String(message.seed) : message.seed;
                else
                    object.seed = options.longs === String ? $util.Long.prototype.toString.call(message.seed) : options.longs === Number ? new $util.LongBits(message.seed.low >>> 0, message.seed.high >>> 0).toNumber(true) : message.seed;
            return object;
        };
    
        /**
         * Converts this TxShareUpdates to JSON.
         * @function toJSON
         * @memberof TxShareUpdates
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        TxShareUpdates.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        return TxShareUpdates;
    })();
    
    $root.exonum = (function() {
    
        /**
         * Namespace exonum.
         * @exports exonum
         * @namespace
         */
        var exonum = {};
    
        exonum.crypto = (function() {
    
            /**
             * Namespace crypto.
             * @memberof exonum
             * @namespace
             */
            var crypto = {};
    
            crypto.Hash = (function() {
    
                /**
                 * Properties of a Hash.
                 * @memberof exonum.crypto
                 * @interface IHash
                 * @property {Uint8Array|null} [data] Hash data
                 */
    
                /**
                 * Constructs a new Hash.
                 * @memberof exonum.crypto
                 * @classdesc Represents a Hash.
                 * @implements IHash
                 * @constructor
                 * @param {exonum.crypto.IHash=} [properties] Properties to set
                 */
                function Hash(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }
    
                /**
                 * Hash data.
                 * @member {Uint8Array} data
                 * @memberof exonum.crypto.Hash
                 * @instance
                 */
                Hash.prototype.data = $util.newBuffer([]);
    
                /**
                 * Creates a new Hash instance using the specified properties.
                 * @function create
                 * @memberof exonum.crypto.Hash
                 * @static
                 * @param {exonum.crypto.IHash=} [properties] Properties to set
                 * @returns {exonum.crypto.Hash} Hash instance
                 */
                Hash.create = function create(properties) {
                    return new Hash(properties);
                };
    
                /**
                 * Encodes the specified Hash message. Does not implicitly {@link exonum.crypto.Hash.verify|verify} messages.
                 * @function encode
                 * @memberof exonum.crypto.Hash
                 * @static
                 * @param {exonum.crypto.IHash} message Hash message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Hash.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.data != null && Object.hasOwnProperty.call(message, "data"))
                        writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.data);
                    return writer;
                };
    
                /**
                 * Encodes the specified Hash message, length delimited. Does not implicitly {@link exonum.crypto.Hash.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof exonum.crypto.Hash
                 * @static
                 * @param {exonum.crypto.IHash} message Hash message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Hash.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };
    
                /**
                 * Decodes a Hash message from the specified reader or buffer.
                 * @function decode
                 * @memberof exonum.crypto.Hash
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {exonum.crypto.Hash} Hash
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Hash.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.exonum.crypto.Hash();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.data = reader.bytes();
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };
    
                /**
                 * Decodes a Hash message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof exonum.crypto.Hash
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {exonum.crypto.Hash} Hash
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Hash.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };
    
                /**
                 * Verifies a Hash message.
                 * @function verify
                 * @memberof exonum.crypto.Hash
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                Hash.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.data != null && message.hasOwnProperty("data"))
                        if (!(message.data && typeof message.data.length === "number" || $util.isString(message.data)))
                            return "data: buffer expected";
                    return null;
                };
    
                /**
                 * Creates a Hash message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof exonum.crypto.Hash
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {exonum.crypto.Hash} Hash
                 */
                Hash.fromObject = function fromObject(object) {
                    if (object instanceof $root.exonum.crypto.Hash)
                        return object;
                    var message = new $root.exonum.crypto.Hash();
                    if (object.data != null)
                        if (typeof object.data === "string")
                            $util.base64.decode(object.data, message.data = $util.newBuffer($util.base64.length(object.data)), 0);
                        else if (object.data.length)
                            message.data = object.data;
                    return message;
                };
    
                /**
                 * Creates a plain object from a Hash message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof exonum.crypto.Hash
                 * @static
                 * @param {exonum.crypto.Hash} message Hash
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                Hash.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults)
                        if (options.bytes === String)
                            object.data = "";
                        else {
                            object.data = [];
                            if (options.bytes !== Array)
                                object.data = $util.newBuffer(object.data);
                        }
                    if (message.data != null && message.hasOwnProperty("data"))
                        object.data = options.bytes === String ? $util.base64.encode(message.data, 0, message.data.length) : options.bytes === Array ? Array.prototype.slice.call(message.data) : message.data;
                    return object;
                };
    
                /**
                 * Converts this Hash to JSON.
                 * @function toJSON
                 * @memberof exonum.crypto.Hash
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                Hash.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
    
                return Hash;
            })();
    
            crypto.PublicKey = (function() {
    
                /**
                 * Properties of a PublicKey.
                 * @memberof exonum.crypto
                 * @interface IPublicKey
                 * @property {Uint8Array|null} [data] PublicKey data
                 */
    
                /**
                 * Constructs a new PublicKey.
                 * @memberof exonum.crypto
                 * @classdesc Represents a PublicKey.
                 * @implements IPublicKey
                 * @constructor
                 * @param {exonum.crypto.IPublicKey=} [properties] Properties to set
                 */
                function PublicKey(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }
    
                /**
                 * PublicKey data.
                 * @member {Uint8Array} data
                 * @memberof exonum.crypto.PublicKey
                 * @instance
                 */
                PublicKey.prototype.data = $util.newBuffer([]);
    
                /**
                 * Creates a new PublicKey instance using the specified properties.
                 * @function create
                 * @memberof exonum.crypto.PublicKey
                 * @static
                 * @param {exonum.crypto.IPublicKey=} [properties] Properties to set
                 * @returns {exonum.crypto.PublicKey} PublicKey instance
                 */
                PublicKey.create = function create(properties) {
                    return new PublicKey(properties);
                };
    
                /**
                 * Encodes the specified PublicKey message. Does not implicitly {@link exonum.crypto.PublicKey.verify|verify} messages.
                 * @function encode
                 * @memberof exonum.crypto.PublicKey
                 * @static
                 * @param {exonum.crypto.IPublicKey} message PublicKey message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                PublicKey.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.data != null && Object.hasOwnProperty.call(message, "data"))
                        writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.data);
                    return writer;
                };
    
                /**
                 * Encodes the specified PublicKey message, length delimited. Does not implicitly {@link exonum.crypto.PublicKey.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof exonum.crypto.PublicKey
                 * @static
                 * @param {exonum.crypto.IPublicKey} message PublicKey message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                PublicKey.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };
    
                /**
                 * Decodes a PublicKey message from the specified reader or buffer.
                 * @function decode
                 * @memberof exonum.crypto.PublicKey
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {exonum.crypto.PublicKey} PublicKey
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                PublicKey.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.exonum.crypto.PublicKey();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.data = reader.bytes();
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };
    
                /**
                 * Decodes a PublicKey message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof exonum.crypto.PublicKey
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {exonum.crypto.PublicKey} PublicKey
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                PublicKey.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };
    
                /**
                 * Verifies a PublicKey message.
                 * @function verify
                 * @memberof exonum.crypto.PublicKey
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                PublicKey.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.data != null && message.hasOwnProperty("data"))
                        if (!(message.data && typeof message.data.length === "number" || $util.isString(message.data)))
                            return "data: buffer expected";
                    return null;
                };
    
                /**
                 * Creates a PublicKey message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof exonum.crypto.PublicKey
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {exonum.crypto.PublicKey} PublicKey
                 */
                PublicKey.fromObject = function fromObject(object) {
                    if (object instanceof $root.exonum.crypto.PublicKey)
                        return object;
                    var message = new $root.exonum.crypto.PublicKey();
                    if (object.data != null)
                        if (typeof object.data === "string")
                            $util.base64.decode(object.data, message.data = $util.newBuffer($util.base64.length(object.data)), 0);
                        else if (object.data.length)
                            message.data = object.data;
                    return message;
                };
    
                /**
                 * Creates a plain object from a PublicKey message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof exonum.crypto.PublicKey
                 * @static
                 * @param {exonum.crypto.PublicKey} message PublicKey
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                PublicKey.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults)
                        if (options.bytes === String)
                            object.data = "";
                        else {
                            object.data = [];
                            if (options.bytes !== Array)
                                object.data = $util.newBuffer(object.data);
                        }
                    if (message.data != null && message.hasOwnProperty("data"))
                        object.data = options.bytes === String ? $util.base64.encode(message.data, 0, message.data.length) : options.bytes === Array ? Array.prototype.slice.call(message.data) : message.data;
                    return object;
                };
    
                /**
                 * Converts this PublicKey to JSON.
                 * @function toJSON
                 * @memberof exonum.crypto.PublicKey
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                PublicKey.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
    
                return PublicKey;
            })();
    
            crypto.Signature = (function() {
    
                /**
                 * Properties of a Signature.
                 * @memberof exonum.crypto
                 * @interface ISignature
                 * @property {Uint8Array|null} [data] Signature data
                 */
    
                /**
                 * Constructs a new Signature.
                 * @memberof exonum.crypto
                 * @classdesc Represents a Signature.
                 * @implements ISignature
                 * @constructor
                 * @param {exonum.crypto.ISignature=} [properties] Properties to set
                 */
                function Signature(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }
    
                /**
                 * Signature data.
                 * @member {Uint8Array} data
                 * @memberof exonum.crypto.Signature
                 * @instance
                 */
                Signature.prototype.data = $util.newBuffer([]);
    
                /**
                 * Creates a new Signature instance using the specified properties.
                 * @function create
                 * @memberof exonum.crypto.Signature
                 * @static
                 * @param {exonum.crypto.ISignature=} [properties] Properties to set
                 * @returns {exonum.crypto.Signature} Signature instance
                 */
                Signature.create = function create(properties) {
                    return new Signature(properties);
                };
    
                /**
                 * Encodes the specified Signature message. Does not implicitly {@link exonum.crypto.Signature.verify|verify} messages.
                 * @function encode
                 * @memberof exonum.crypto.Signature
                 * @static
                 * @param {exonum.crypto.ISignature} message Signature message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Signature.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.data != null && Object.hasOwnProperty.call(message, "data"))
                        writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.data);
                    return writer;
                };
    
                /**
                 * Encodes the specified Signature message, length delimited. Does not implicitly {@link exonum.crypto.Signature.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof exonum.crypto.Signature
                 * @static
                 * @param {exonum.crypto.ISignature} message Signature message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Signature.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };
    
                /**
                 * Decodes a Signature message from the specified reader or buffer.
                 * @function decode
                 * @memberof exonum.crypto.Signature
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {exonum.crypto.Signature} Signature
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Signature.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.exonum.crypto.Signature();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.data = reader.bytes();
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };
    
                /**
                 * Decodes a Signature message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof exonum.crypto.Signature
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {exonum.crypto.Signature} Signature
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Signature.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };
    
                /**
                 * Verifies a Signature message.
                 * @function verify
                 * @memberof exonum.crypto.Signature
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                Signature.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.data != null && message.hasOwnProperty("data"))
                        if (!(message.data && typeof message.data.length === "number" || $util.isString(message.data)))
                            return "data: buffer expected";
                    return null;
                };
    
                /**
                 * Creates a Signature message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof exonum.crypto.Signature
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {exonum.crypto.Signature} Signature
                 */
                Signature.fromObject = function fromObject(object) {
                    if (object instanceof $root.exonum.crypto.Signature)
                        return object;
                    var message = new $root.exonum.crypto.Signature();
                    if (object.data != null)
                        if (typeof object.data === "string")
                            $util.base64.decode(object.data, message.data = $util.newBuffer($util.base64.length(object.data)), 0);
                        else if (object.data.length)
                            message.data = object.data;
                    return message;
                };
    
                /**
                 * Creates a plain object from a Signature message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof exonum.crypto.Signature
                 * @static
                 * @param {exonum.crypto.Signature} message Signature
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                Signature.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults)
                        if (options.bytes === String)
                            object.data = "";
                        else {
                            object.data = [];
                            if (options.bytes !== Array)
                                object.data = $util.newBuffer(object.data);
                        }
                    if (message.data != null && message.hasOwnProperty("data"))
                        object.data = options.bytes === String ? $util.base64.encode(message.data, 0, message.data.length) : options.bytes === Array ? Array.prototype.slice.call(message.data) : message.data;
                    return object;
                };
    
                /**
                 * Converts this Signature to JSON.
                 * @function toJSON
                 * @memberof exonum.crypto.Signature
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                Signature.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
    
                return Signature;
            })();
    
            return crypto;
        })();
    
        return exonum;
    })();

    return $root;
});
