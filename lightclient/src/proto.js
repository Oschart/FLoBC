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
    var $root = $protobuf.roots.cryptocurrency || ($protobuf.roots.cryptocurrency = {});
    
    $root.exonum = (function() {
    
        /**
         * Namespace exonum.
         * @exports exonum
         * @namespace
         */
        var exonum = {};
    
        exonum.examples = (function() {
    
            /**
             * Namespace examples.
             * @memberof exonum
             * @namespace
             */
            var examples = {};
    
            examples.cryptocurrency_advanced = (function() {
    
                /**
                 * Namespace cryptocurrency_advanced.
                 * @memberof exonum.examples
                 * @namespace
                 */
                var cryptocurrency_advanced = {};
    
                cryptocurrency_advanced.Transfer = (function() {
    
                    /**
                     * Properties of a Transfer.
                     * @memberof exonum.examples.cryptocurrency_advanced
                     * @interface ITransfer
                     * @property {exonum.crypto.IHash|null} [to] Transfer to
                     * @property {number|Long|null} [amount] Transfer amount
                     * @property {number|Long|null} [seed] Transfer seed
                     */
    
                    /**
                     * Constructs a new Transfer.
                     * @memberof exonum.examples.cryptocurrency_advanced
                     * @classdesc Represents a Transfer.
                     * @implements ITransfer
                     * @constructor
                     * @param {exonum.examples.cryptocurrency_advanced.ITransfer=} [properties] Properties to set
                     */
                    function Transfer(properties) {
                        if (properties)
                            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }
    
                    /**
                     * Transfer to.
                     * @member {exonum.crypto.IHash|null|undefined} to
                     * @memberof exonum.examples.cryptocurrency_advanced.Transfer
                     * @instance
                     */
                    Transfer.prototype.to = null;
    
                    /**
                     * Transfer amount.
                     * @member {number|Long} amount
                     * @memberof exonum.examples.cryptocurrency_advanced.Transfer
                     * @instance
                     */
                    Transfer.prototype.amount = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
    
                    /**
                     * Transfer seed.
                     * @member {number|Long} seed
                     * @memberof exonum.examples.cryptocurrency_advanced.Transfer
                     * @instance
                     */
                    Transfer.prototype.seed = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
    
                    /**
                     * Creates a new Transfer instance using the specified properties.
                     * @function create
                     * @memberof exonum.examples.cryptocurrency_advanced.Transfer
                     * @static
                     * @param {exonum.examples.cryptocurrency_advanced.ITransfer=} [properties] Properties to set
                     * @returns {exonum.examples.cryptocurrency_advanced.Transfer} Transfer instance
                     */
                    Transfer.create = function create(properties) {
                        return new Transfer(properties);
                    };
    
                    /**
                     * Encodes the specified Transfer message. Does not implicitly {@link exonum.examples.cryptocurrency_advanced.Transfer.verify|verify} messages.
                     * @function encode
                     * @memberof exonum.examples.cryptocurrency_advanced.Transfer
                     * @static
                     * @param {exonum.examples.cryptocurrency_advanced.ITransfer} message Transfer message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    Transfer.encode = function encode(message, writer) {
                        if (!writer)
                            writer = $Writer.create();
                        if (message.to != null && Object.hasOwnProperty.call(message, "to"))
                            $root.exonum.crypto.Hash.encode(message.to, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                        if (message.amount != null && Object.hasOwnProperty.call(message, "amount"))
                            writer.uint32(/* id 2, wireType 0 =*/16).uint64(message.amount);
                        if (message.seed != null && Object.hasOwnProperty.call(message, "seed"))
                            writer.uint32(/* id 3, wireType 0 =*/24).uint64(message.seed);
                        return writer;
                    };
    
                    /**
                     * Encodes the specified Transfer message, length delimited. Does not implicitly {@link exonum.examples.cryptocurrency_advanced.Transfer.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof exonum.examples.cryptocurrency_advanced.Transfer
                     * @static
                     * @param {exonum.examples.cryptocurrency_advanced.ITransfer} message Transfer message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    Transfer.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer).ldelim();
                    };
    
                    /**
                     * Decodes a Transfer message from the specified reader or buffer.
                     * @function decode
                     * @memberof exonum.examples.cryptocurrency_advanced.Transfer
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {exonum.examples.cryptocurrency_advanced.Transfer} Transfer
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    Transfer.decode = function decode(reader, length) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.exonum.examples.cryptocurrency_advanced.Transfer();
                        while (reader.pos < end) {
                            var tag = reader.uint32();
                            switch (tag >>> 3) {
                            case 1:
                                message.to = $root.exonum.crypto.Hash.decode(reader, reader.uint32());
                                break;
                            case 2:
                                message.amount = reader.uint64();
                                break;
                            case 3:
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
                     * Decodes a Transfer message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof exonum.examples.cryptocurrency_advanced.Transfer
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {exonum.examples.cryptocurrency_advanced.Transfer} Transfer
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    Transfer.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };
    
                    /**
                     * Verifies a Transfer message.
                     * @function verify
                     * @memberof exonum.examples.cryptocurrency_advanced.Transfer
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    Transfer.verify = function verify(message) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (message.to != null && message.hasOwnProperty("to")) {
                            var error = $root.exonum.crypto.Hash.verify(message.to);
                            if (error)
                                return "to." + error;
                        }
                        if (message.amount != null && message.hasOwnProperty("amount"))
                            if (!$util.isInteger(message.amount) && !(message.amount && $util.isInteger(message.amount.low) && $util.isInteger(message.amount.high)))
                                return "amount: integer|Long expected";
                        if (message.seed != null && message.hasOwnProperty("seed"))
                            if (!$util.isInteger(message.seed) && !(message.seed && $util.isInteger(message.seed.low) && $util.isInteger(message.seed.high)))
                                return "seed: integer|Long expected";
                        return null;
                    };
    
                    /**
                     * Creates a Transfer message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof exonum.examples.cryptocurrency_advanced.Transfer
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {exonum.examples.cryptocurrency_advanced.Transfer} Transfer
                     */
                    Transfer.fromObject = function fromObject(object) {
                        if (object instanceof $root.exonum.examples.cryptocurrency_advanced.Transfer)
                            return object;
                        var message = new $root.exonum.examples.cryptocurrency_advanced.Transfer();
                        if (object.to != null) {
                            if (typeof object.to !== "object")
                                throw TypeError(".exonum.examples.cryptocurrency_advanced.Transfer.to: object expected");
                            message.to = $root.exonum.crypto.Hash.fromObject(object.to);
                        }
                        if (object.amount != null)
                            if ($util.Long)
                                (message.amount = $util.Long.fromValue(object.amount)).unsigned = true;
                            else if (typeof object.amount === "string")
                                message.amount = parseInt(object.amount, 10);
                            else if (typeof object.amount === "number")
                                message.amount = object.amount;
                            else if (typeof object.amount === "object")
                                message.amount = new $util.LongBits(object.amount.low >>> 0, object.amount.high >>> 0).toNumber(true);
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
                     * Creates a plain object from a Transfer message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof exonum.examples.cryptocurrency_advanced.Transfer
                     * @static
                     * @param {exonum.examples.cryptocurrency_advanced.Transfer} message Transfer
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    Transfer.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        var object = {};
                        if (options.defaults) {
                            object.to = null;
                            if ($util.Long) {
                                var long = new $util.Long(0, 0, true);
                                object.amount = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                            } else
                                object.amount = options.longs === String ? "0" : 0;
                            if ($util.Long) {
                                var long = new $util.Long(0, 0, true);
                                object.seed = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                            } else
                                object.seed = options.longs === String ? "0" : 0;
                        }
                        if (message.to != null && message.hasOwnProperty("to"))
                            object.to = $root.exonum.crypto.Hash.toObject(message.to, options);
                        if (message.amount != null && message.hasOwnProperty("amount"))
                            if (typeof message.amount === "number")
                                object.amount = options.longs === String ? String(message.amount) : message.amount;
                            else
                                object.amount = options.longs === String ? $util.Long.prototype.toString.call(message.amount) : options.longs === Number ? new $util.LongBits(message.amount.low >>> 0, message.amount.high >>> 0).toNumber(true) : message.amount;
                        if (message.seed != null && message.hasOwnProperty("seed"))
                            if (typeof message.seed === "number")
                                object.seed = options.longs === String ? String(message.seed) : message.seed;
                            else
                                object.seed = options.longs === String ? $util.Long.prototype.toString.call(message.seed) : options.longs === Number ? new $util.LongBits(message.seed.low >>> 0, message.seed.high >>> 0).toNumber(true) : message.seed;
                        return object;
                    };
    
                    /**
                     * Converts this Transfer to JSON.
                     * @function toJSON
                     * @memberof exonum.examples.cryptocurrency_advanced.Transfer
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    Transfer.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };
    
                    return Transfer;
                })();
    
                cryptocurrency_advanced.Issue = (function() {
    
                    /**
                     * Properties of an Issue.
                     * @memberof exonum.examples.cryptocurrency_advanced
                     * @interface IIssue
                     * @property {number|Long|null} [amount] Issue amount
                     * @property {number|Long|null} [seed] Issue seed
                     */
    
                    /**
                     * Constructs a new Issue.
                     * @memberof exonum.examples.cryptocurrency_advanced
                     * @classdesc Represents an Issue.
                     * @implements IIssue
                     * @constructor
                     * @param {exonum.examples.cryptocurrency_advanced.IIssue=} [properties] Properties to set
                     */
                    function Issue(properties) {
                        if (properties)
                            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }
    
                    /**
                     * Issue amount.
                     * @member {number|Long} amount
                     * @memberof exonum.examples.cryptocurrency_advanced.Issue
                     * @instance
                     */
                    Issue.prototype.amount = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
    
                    /**
                     * Issue seed.
                     * @member {number|Long} seed
                     * @memberof exonum.examples.cryptocurrency_advanced.Issue
                     * @instance
                     */
                    Issue.prototype.seed = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
    
                    /**
                     * Creates a new Issue instance using the specified properties.
                     * @function create
                     * @memberof exonum.examples.cryptocurrency_advanced.Issue
                     * @static
                     * @param {exonum.examples.cryptocurrency_advanced.IIssue=} [properties] Properties to set
                     * @returns {exonum.examples.cryptocurrency_advanced.Issue} Issue instance
                     */
                    Issue.create = function create(properties) {
                        return new Issue(properties);
                    };
    
                    /**
                     * Encodes the specified Issue message. Does not implicitly {@link exonum.examples.cryptocurrency_advanced.Issue.verify|verify} messages.
                     * @function encode
                     * @memberof exonum.examples.cryptocurrency_advanced.Issue
                     * @static
                     * @param {exonum.examples.cryptocurrency_advanced.IIssue} message Issue message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    Issue.encode = function encode(message, writer) {
                        if (!writer)
                            writer = $Writer.create();
                        if (message.amount != null && Object.hasOwnProperty.call(message, "amount"))
                            writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.amount);
                        if (message.seed != null && Object.hasOwnProperty.call(message, "seed"))
                            writer.uint32(/* id 2, wireType 0 =*/16).uint64(message.seed);
                        return writer;
                    };
    
                    /**
                     * Encodes the specified Issue message, length delimited. Does not implicitly {@link exonum.examples.cryptocurrency_advanced.Issue.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof exonum.examples.cryptocurrency_advanced.Issue
                     * @static
                     * @param {exonum.examples.cryptocurrency_advanced.IIssue} message Issue message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    Issue.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer).ldelim();
                    };
    
                    /**
                     * Decodes an Issue message from the specified reader or buffer.
                     * @function decode
                     * @memberof exonum.examples.cryptocurrency_advanced.Issue
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {exonum.examples.cryptocurrency_advanced.Issue} Issue
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    Issue.decode = function decode(reader, length) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.exonum.examples.cryptocurrency_advanced.Issue();
                        while (reader.pos < end) {
                            var tag = reader.uint32();
                            switch (tag >>> 3) {
                            case 1:
                                message.amount = reader.uint64();
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
                     * Decodes an Issue message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof exonum.examples.cryptocurrency_advanced.Issue
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {exonum.examples.cryptocurrency_advanced.Issue} Issue
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    Issue.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };
    
                    /**
                     * Verifies an Issue message.
                     * @function verify
                     * @memberof exonum.examples.cryptocurrency_advanced.Issue
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    Issue.verify = function verify(message) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (message.amount != null && message.hasOwnProperty("amount"))
                            if (!$util.isInteger(message.amount) && !(message.amount && $util.isInteger(message.amount.low) && $util.isInteger(message.amount.high)))
                                return "amount: integer|Long expected";
                        if (message.seed != null && message.hasOwnProperty("seed"))
                            if (!$util.isInteger(message.seed) && !(message.seed && $util.isInteger(message.seed.low) && $util.isInteger(message.seed.high)))
                                return "seed: integer|Long expected";
                        return null;
                    };
    
                    /**
                     * Creates an Issue message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof exonum.examples.cryptocurrency_advanced.Issue
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {exonum.examples.cryptocurrency_advanced.Issue} Issue
                     */
                    Issue.fromObject = function fromObject(object) {
                        if (object instanceof $root.exonum.examples.cryptocurrency_advanced.Issue)
                            return object;
                        var message = new $root.exonum.examples.cryptocurrency_advanced.Issue();
                        if (object.amount != null)
                            if ($util.Long)
                                (message.amount = $util.Long.fromValue(object.amount)).unsigned = true;
                            else if (typeof object.amount === "string")
                                message.amount = parseInt(object.amount, 10);
                            else if (typeof object.amount === "number")
                                message.amount = object.amount;
                            else if (typeof object.amount === "object")
                                message.amount = new $util.LongBits(object.amount.low >>> 0, object.amount.high >>> 0).toNumber(true);
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
                     * Creates a plain object from an Issue message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof exonum.examples.cryptocurrency_advanced.Issue
                     * @static
                     * @param {exonum.examples.cryptocurrency_advanced.Issue} message Issue
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    Issue.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        var object = {};
                        if (options.defaults) {
                            if ($util.Long) {
                                var long = new $util.Long(0, 0, true);
                                object.amount = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                            } else
                                object.amount = options.longs === String ? "0" : 0;
                            if ($util.Long) {
                                var long = new $util.Long(0, 0, true);
                                object.seed = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                            } else
                                object.seed = options.longs === String ? "0" : 0;
                        }
                        if (message.amount != null && message.hasOwnProperty("amount"))
                            if (typeof message.amount === "number")
                                object.amount = options.longs === String ? String(message.amount) : message.amount;
                            else
                                object.amount = options.longs === String ? $util.Long.prototype.toString.call(message.amount) : options.longs === Number ? new $util.LongBits(message.amount.low >>> 0, message.amount.high >>> 0).toNumber(true) : message.amount;
                        if (message.seed != null && message.hasOwnProperty("seed"))
                            if (typeof message.seed === "number")
                                object.seed = options.longs === String ? String(message.seed) : message.seed;
                            else
                                object.seed = options.longs === String ? $util.Long.prototype.toString.call(message.seed) : options.longs === Number ? new $util.LongBits(message.seed.low >>> 0, message.seed.high >>> 0).toNumber(true) : message.seed;
                        return object;
                    };
    
                    /**
                     * Converts this Issue to JSON.
                     * @function toJSON
                     * @memberof exonum.examples.cryptocurrency_advanced.Issue
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    Issue.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };
    
                    return Issue;
                })();
    
                cryptocurrency_advanced.CreateWallet = (function() {
    
                    /**
                     * Properties of a CreateWallet.
                     * @memberof exonum.examples.cryptocurrency_advanced
                     * @interface ICreateWallet
                     * @property {string|null} [name] CreateWallet name
                     */
    
                    /**
                     * Constructs a new CreateWallet.
                     * @memberof exonum.examples.cryptocurrency_advanced
                     * @classdesc Represents a CreateWallet.
                     * @implements ICreateWallet
                     * @constructor
                     * @param {exonum.examples.cryptocurrency_advanced.ICreateWallet=} [properties] Properties to set
                     */
                    function CreateWallet(properties) {
                        if (properties)
                            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }
    
                    /**
                     * CreateWallet name.
                     * @member {string} name
                     * @memberof exonum.examples.cryptocurrency_advanced.CreateWallet
                     * @instance
                     */
                    CreateWallet.prototype.name = "";
    
                    /**
                     * Creates a new CreateWallet instance using the specified properties.
                     * @function create
                     * @memberof exonum.examples.cryptocurrency_advanced.CreateWallet
                     * @static
                     * @param {exonum.examples.cryptocurrency_advanced.ICreateWallet=} [properties] Properties to set
                     * @returns {exonum.examples.cryptocurrency_advanced.CreateWallet} CreateWallet instance
                     */
                    CreateWallet.create = function create(properties) {
                        return new CreateWallet(properties);
                    };
    
                    /**
                     * Encodes the specified CreateWallet message. Does not implicitly {@link exonum.examples.cryptocurrency_advanced.CreateWallet.verify|verify} messages.
                     * @function encode
                     * @memberof exonum.examples.cryptocurrency_advanced.CreateWallet
                     * @static
                     * @param {exonum.examples.cryptocurrency_advanced.ICreateWallet} message CreateWallet message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    CreateWallet.encode = function encode(message, writer) {
                        if (!writer)
                            writer = $Writer.create();
                        if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                            writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
                        return writer;
                    };
    
                    /**
                     * Encodes the specified CreateWallet message, length delimited. Does not implicitly {@link exonum.examples.cryptocurrency_advanced.CreateWallet.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof exonum.examples.cryptocurrency_advanced.CreateWallet
                     * @static
                     * @param {exonum.examples.cryptocurrency_advanced.ICreateWallet} message CreateWallet message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    CreateWallet.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer).ldelim();
                    };
    
                    /**
                     * Decodes a CreateWallet message from the specified reader or buffer.
                     * @function decode
                     * @memberof exonum.examples.cryptocurrency_advanced.CreateWallet
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {exonum.examples.cryptocurrency_advanced.CreateWallet} CreateWallet
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    CreateWallet.decode = function decode(reader, length) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.exonum.examples.cryptocurrency_advanced.CreateWallet();
                        while (reader.pos < end) {
                            var tag = reader.uint32();
                            switch (tag >>> 3) {
                            case 1:
                                message.name = reader.string();
                                break;
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        return message;
                    };
    
                    /**
                     * Decodes a CreateWallet message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof exonum.examples.cryptocurrency_advanced.CreateWallet
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {exonum.examples.cryptocurrency_advanced.CreateWallet} CreateWallet
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    CreateWallet.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };
    
                    /**
                     * Verifies a CreateWallet message.
                     * @function verify
                     * @memberof exonum.examples.cryptocurrency_advanced.CreateWallet
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    CreateWallet.verify = function verify(message) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (message.name != null && message.hasOwnProperty("name"))
                            if (!$util.isString(message.name))
                                return "name: string expected";
                        return null;
                    };
    
                    /**
                     * Creates a CreateWallet message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof exonum.examples.cryptocurrency_advanced.CreateWallet
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {exonum.examples.cryptocurrency_advanced.CreateWallet} CreateWallet
                     */
                    CreateWallet.fromObject = function fromObject(object) {
                        if (object instanceof $root.exonum.examples.cryptocurrency_advanced.CreateWallet)
                            return object;
                        var message = new $root.exonum.examples.cryptocurrency_advanced.CreateWallet();
                        if (object.name != null)
                            message.name = String(object.name);
                        return message;
                    };
    
                    /**
                     * Creates a plain object from a CreateWallet message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof exonum.examples.cryptocurrency_advanced.CreateWallet
                     * @static
                     * @param {exonum.examples.cryptocurrency_advanced.CreateWallet} message CreateWallet
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    CreateWallet.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        var object = {};
                        if (options.defaults)
                            object.name = "";
                        if (message.name != null && message.hasOwnProperty("name"))
                            object.name = message.name;
                        return object;
                    };
    
                    /**
                     * Converts this CreateWallet to JSON.
                     * @function toJSON
                     * @memberof exonum.examples.cryptocurrency_advanced.CreateWallet
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    CreateWallet.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };
    
                    return CreateWallet;
                })();
    
                cryptocurrency_advanced.Wallet = (function() {
    
                    /**
                     * Properties of a Wallet.
                     * @memberof exonum.examples.cryptocurrency_advanced
                     * @interface IWallet
                     * @property {exonum.crypto.IHash|null} [owner] Wallet owner
                     * @property {string|null} [name] Wallet name
                     * @property {number|Long|null} [balance] Wallet balance
                     * @property {number|Long|null} [history_len] Wallet history_len
                     * @property {exonum.crypto.IHash|null} [history_hash] Wallet history_hash
                     */
    
                    /**
                     * Constructs a new Wallet.
                     * @memberof exonum.examples.cryptocurrency_advanced
                     * @classdesc Represents a Wallet.
                     * @implements IWallet
                     * @constructor
                     * @param {exonum.examples.cryptocurrency_advanced.IWallet=} [properties] Properties to set
                     */
                    function Wallet(properties) {
                        if (properties)
                            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }
    
                    /**
                     * Wallet owner.
                     * @member {exonum.crypto.IHash|null|undefined} owner
                     * @memberof exonum.examples.cryptocurrency_advanced.Wallet
                     * @instance
                     */
                    Wallet.prototype.owner = null;
    
                    /**
                     * Wallet name.
                     * @member {string} name
                     * @memberof exonum.examples.cryptocurrency_advanced.Wallet
                     * @instance
                     */
                    Wallet.prototype.name = "";
    
                    /**
                     * Wallet balance.
                     * @member {number|Long} balance
                     * @memberof exonum.examples.cryptocurrency_advanced.Wallet
                     * @instance
                     */
                    Wallet.prototype.balance = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
    
                    /**
                     * Wallet history_len.
                     * @member {number|Long} history_len
                     * @memberof exonum.examples.cryptocurrency_advanced.Wallet
                     * @instance
                     */
                    Wallet.prototype.history_len = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
    
                    /**
                     * Wallet history_hash.
                     * @member {exonum.crypto.IHash|null|undefined} history_hash
                     * @memberof exonum.examples.cryptocurrency_advanced.Wallet
                     * @instance
                     */
                    Wallet.prototype.history_hash = null;
    
                    /**
                     * Creates a new Wallet instance using the specified properties.
                     * @function create
                     * @memberof exonum.examples.cryptocurrency_advanced.Wallet
                     * @static
                     * @param {exonum.examples.cryptocurrency_advanced.IWallet=} [properties] Properties to set
                     * @returns {exonum.examples.cryptocurrency_advanced.Wallet} Wallet instance
                     */
                    Wallet.create = function create(properties) {
                        return new Wallet(properties);
                    };
    
                    /**
                     * Encodes the specified Wallet message. Does not implicitly {@link exonum.examples.cryptocurrency_advanced.Wallet.verify|verify} messages.
                     * @function encode
                     * @memberof exonum.examples.cryptocurrency_advanced.Wallet
                     * @static
                     * @param {exonum.examples.cryptocurrency_advanced.IWallet} message Wallet message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    Wallet.encode = function encode(message, writer) {
                        if (!writer)
                            writer = $Writer.create();
                        if (message.owner != null && Object.hasOwnProperty.call(message, "owner"))
                            $root.exonum.crypto.Hash.encode(message.owner, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                        if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                            writer.uint32(/* id 2, wireType 2 =*/18).string(message.name);
                        if (message.balance != null && Object.hasOwnProperty.call(message, "balance"))
                            writer.uint32(/* id 3, wireType 0 =*/24).uint64(message.balance);
                        if (message.history_len != null && Object.hasOwnProperty.call(message, "history_len"))
                            writer.uint32(/* id 4, wireType 0 =*/32).uint64(message.history_len);
                        if (message.history_hash != null && Object.hasOwnProperty.call(message, "history_hash"))
                            $root.exonum.crypto.Hash.encode(message.history_hash, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
                        return writer;
                    };
    
                    /**
                     * Encodes the specified Wallet message, length delimited. Does not implicitly {@link exonum.examples.cryptocurrency_advanced.Wallet.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof exonum.examples.cryptocurrency_advanced.Wallet
                     * @static
                     * @param {exonum.examples.cryptocurrency_advanced.IWallet} message Wallet message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    Wallet.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer).ldelim();
                    };
    
                    /**
                     * Decodes a Wallet message from the specified reader or buffer.
                     * @function decode
                     * @memberof exonum.examples.cryptocurrency_advanced.Wallet
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {exonum.examples.cryptocurrency_advanced.Wallet} Wallet
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    Wallet.decode = function decode(reader, length) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.exonum.examples.cryptocurrency_advanced.Wallet();
                        while (reader.pos < end) {
                            var tag = reader.uint32();
                            switch (tag >>> 3) {
                            case 1:
                                message.owner = $root.exonum.crypto.Hash.decode(reader, reader.uint32());
                                break;
                            case 2:
                                message.name = reader.string();
                                break;
                            case 3:
                                message.balance = reader.uint64();
                                break;
                            case 4:
                                message.history_len = reader.uint64();
                                break;
                            case 5:
                                message.history_hash = $root.exonum.crypto.Hash.decode(reader, reader.uint32());
                                break;
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        return message;
                    };
    
                    /**
                     * Decodes a Wallet message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof exonum.examples.cryptocurrency_advanced.Wallet
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {exonum.examples.cryptocurrency_advanced.Wallet} Wallet
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    Wallet.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };
    
                    /**
                     * Verifies a Wallet message.
                     * @function verify
                     * @memberof exonum.examples.cryptocurrency_advanced.Wallet
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    Wallet.verify = function verify(message) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (message.owner != null && message.hasOwnProperty("owner")) {
                            var error = $root.exonum.crypto.Hash.verify(message.owner);
                            if (error)
                                return "owner." + error;
                        }
                        if (message.name != null && message.hasOwnProperty("name"))
                            if (!$util.isString(message.name))
                                return "name: string expected";
                        if (message.balance != null && message.hasOwnProperty("balance"))
                            if (!$util.isInteger(message.balance) && !(message.balance && $util.isInteger(message.balance.low) && $util.isInteger(message.balance.high)))
                                return "balance: integer|Long expected";
                        if (message.history_len != null && message.hasOwnProperty("history_len"))
                            if (!$util.isInteger(message.history_len) && !(message.history_len && $util.isInteger(message.history_len.low) && $util.isInteger(message.history_len.high)))
                                return "history_len: integer|Long expected";
                        if (message.history_hash != null && message.hasOwnProperty("history_hash")) {
                            var error = $root.exonum.crypto.Hash.verify(message.history_hash);
                            if (error)
                                return "history_hash." + error;
                        }
                        return null;
                    };
    
                    /**
                     * Creates a Wallet message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof exonum.examples.cryptocurrency_advanced.Wallet
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {exonum.examples.cryptocurrency_advanced.Wallet} Wallet
                     */
                    Wallet.fromObject = function fromObject(object) {
                        if (object instanceof $root.exonum.examples.cryptocurrency_advanced.Wallet)
                            return object;
                        var message = new $root.exonum.examples.cryptocurrency_advanced.Wallet();
                        if (object.owner != null) {
                            if (typeof object.owner !== "object")
                                throw TypeError(".exonum.examples.cryptocurrency_advanced.Wallet.owner: object expected");
                            message.owner = $root.exonum.crypto.Hash.fromObject(object.owner);
                        }
                        if (object.name != null)
                            message.name = String(object.name);
                        if (object.balance != null)
                            if ($util.Long)
                                (message.balance = $util.Long.fromValue(object.balance)).unsigned = true;
                            else if (typeof object.balance === "string")
                                message.balance = parseInt(object.balance, 10);
                            else if (typeof object.balance === "number")
                                message.balance = object.balance;
                            else if (typeof object.balance === "object")
                                message.balance = new $util.LongBits(object.balance.low >>> 0, object.balance.high >>> 0).toNumber(true);
                        if (object.history_len != null)
                            if ($util.Long)
                                (message.history_len = $util.Long.fromValue(object.history_len)).unsigned = true;
                            else if (typeof object.history_len === "string")
                                message.history_len = parseInt(object.history_len, 10);
                            else if (typeof object.history_len === "number")
                                message.history_len = object.history_len;
                            else if (typeof object.history_len === "object")
                                message.history_len = new $util.LongBits(object.history_len.low >>> 0, object.history_len.high >>> 0).toNumber(true);
                        if (object.history_hash != null) {
                            if (typeof object.history_hash !== "object")
                                throw TypeError(".exonum.examples.cryptocurrency_advanced.Wallet.history_hash: object expected");
                            message.history_hash = $root.exonum.crypto.Hash.fromObject(object.history_hash);
                        }
                        return message;
                    };
    
                    /**
                     * Creates a plain object from a Wallet message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof exonum.examples.cryptocurrency_advanced.Wallet
                     * @static
                     * @param {exonum.examples.cryptocurrency_advanced.Wallet} message Wallet
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    Wallet.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        var object = {};
                        if (options.defaults) {
                            object.owner = null;
                            object.name = "";
                            if ($util.Long) {
                                var long = new $util.Long(0, 0, true);
                                object.balance = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                            } else
                                object.balance = options.longs === String ? "0" : 0;
                            if ($util.Long) {
                                var long = new $util.Long(0, 0, true);
                                object.history_len = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                            } else
                                object.history_len = options.longs === String ? "0" : 0;
                            object.history_hash = null;
                        }
                        if (message.owner != null && message.hasOwnProperty("owner"))
                            object.owner = $root.exonum.crypto.Hash.toObject(message.owner, options);
                        if (message.name != null && message.hasOwnProperty("name"))
                            object.name = message.name;
                        if (message.balance != null && message.hasOwnProperty("balance"))
                            if (typeof message.balance === "number")
                                object.balance = options.longs === String ? String(message.balance) : message.balance;
                            else
                                object.balance = options.longs === String ? $util.Long.prototype.toString.call(message.balance) : options.longs === Number ? new $util.LongBits(message.balance.low >>> 0, message.balance.high >>> 0).toNumber(true) : message.balance;
                        if (message.history_len != null && message.hasOwnProperty("history_len"))
                            if (typeof message.history_len === "number")
                                object.history_len = options.longs === String ? String(message.history_len) : message.history_len;
                            else
                                object.history_len = options.longs === String ? $util.Long.prototype.toString.call(message.history_len) : options.longs === Number ? new $util.LongBits(message.history_len.low >>> 0, message.history_len.high >>> 0).toNumber(true) : message.history_len;
                        if (message.history_hash != null && message.hasOwnProperty("history_hash"))
                            object.history_hash = $root.exonum.crypto.Hash.toObject(message.history_hash, options);
                        return object;
                    };
    
                    /**
                     * Converts this Wallet to JSON.
                     * @function toJSON
                     * @memberof exonum.examples.cryptocurrency_advanced.Wallet
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    Wallet.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };
    
                    return Wallet;
                })();
    
                cryptocurrency_advanced.Config = (function() {
    
                    /**
                     * Properties of a Config.
                     * @memberof exonum.examples.cryptocurrency_advanced
                     * @interface IConfig
                     */
    
                    /**
                     * Constructs a new Config.
                     * @memberof exonum.examples.cryptocurrency_advanced
                     * @classdesc Represents a Config.
                     * @implements IConfig
                     * @constructor
                     * @param {exonum.examples.cryptocurrency_advanced.IConfig=} [properties] Properties to set
                     */
                    function Config(properties) {
                        if (properties)
                            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }
    
                    /**
                     * Creates a new Config instance using the specified properties.
                     * @function create
                     * @memberof exonum.examples.cryptocurrency_advanced.Config
                     * @static
                     * @param {exonum.examples.cryptocurrency_advanced.IConfig=} [properties] Properties to set
                     * @returns {exonum.examples.cryptocurrency_advanced.Config} Config instance
                     */
                    Config.create = function create(properties) {
                        return new Config(properties);
                    };
    
                    /**
                     * Encodes the specified Config message. Does not implicitly {@link exonum.examples.cryptocurrency_advanced.Config.verify|verify} messages.
                     * @function encode
                     * @memberof exonum.examples.cryptocurrency_advanced.Config
                     * @static
                     * @param {exonum.examples.cryptocurrency_advanced.IConfig} message Config message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    Config.encode = function encode(message, writer) {
                        if (!writer)
                            writer = $Writer.create();
                        return writer;
                    };
    
                    /**
                     * Encodes the specified Config message, length delimited. Does not implicitly {@link exonum.examples.cryptocurrency_advanced.Config.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof exonum.examples.cryptocurrency_advanced.Config
                     * @static
                     * @param {exonum.examples.cryptocurrency_advanced.IConfig} message Config message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    Config.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer).ldelim();
                    };
    
                    /**
                     * Decodes a Config message from the specified reader or buffer.
                     * @function decode
                     * @memberof exonum.examples.cryptocurrency_advanced.Config
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {exonum.examples.cryptocurrency_advanced.Config} Config
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    Config.decode = function decode(reader, length) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.exonum.examples.cryptocurrency_advanced.Config();
                        while (reader.pos < end) {
                            var tag = reader.uint32();
                            switch (tag >>> 3) {
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        return message;
                    };
    
                    /**
                     * Decodes a Config message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof exonum.examples.cryptocurrency_advanced.Config
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {exonum.examples.cryptocurrency_advanced.Config} Config
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    Config.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };
    
                    /**
                     * Verifies a Config message.
                     * @function verify
                     * @memberof exonum.examples.cryptocurrency_advanced.Config
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    Config.verify = function verify(message) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        return null;
                    };
    
                    /**
                     * Creates a Config message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof exonum.examples.cryptocurrency_advanced.Config
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {exonum.examples.cryptocurrency_advanced.Config} Config
                     */
                    Config.fromObject = function fromObject(object) {
                        if (object instanceof $root.exonum.examples.cryptocurrency_advanced.Config)
                            return object;
                        return new $root.exonum.examples.cryptocurrency_advanced.Config();
                    };
    
                    /**
                     * Creates a plain object from a Config message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof exonum.examples.cryptocurrency_advanced.Config
                     * @static
                     * @param {exonum.examples.cryptocurrency_advanced.Config} message Config
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    Config.toObject = function toObject() {
                        return {};
                    };
    
                    /**
                     * Converts this Config to JSON.
                     * @function toJSON
                     * @memberof exonum.examples.cryptocurrency_advanced.Config
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    Config.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };
    
                    return Config;
                })();
    
                return cryptocurrency_advanced;
            })();
    
            return examples;
        })();
    
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
