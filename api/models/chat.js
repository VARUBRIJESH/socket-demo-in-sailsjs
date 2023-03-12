/**
 * Chat.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {

        senderId: {
            required: true,
            type: 'number'
        },

        receiverId: {
            required: true,
            type: 'number'
        },

        msg: {
            required: true,
            type: 'string'
        }

    }

};