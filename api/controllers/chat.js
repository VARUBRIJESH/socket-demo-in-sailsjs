module.exports = {

    friendlyName: 'Chat',

    description: 'Save Chat message with senderId and receiverId and also publish message to sender and receiver.',

    inputs: {
        user: {
            required: true,
            type: 'string'
        },
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
    },

    exits: {

    },

    fn: async function(inputs, exits) {

        try {

            let newChat = await chat.create({
                senderId: inputs.senderId,
                receiverId: inputs.receiverId,
                msg: inputs.msg
            }).meta({ fetch: true });

            console.log({ newChat });

            console.log('----- published to users  -----', [inputs.receiverId]);

            user.publish([inputs.receiverId], {
                verb: 'published',
                msg: newChat.msg,
                user: inputs.user,
                senderId: newChat.senderId
            });

            return exits.success('Success');

        } catch (err) {
            return exits.error(err);
        }
    }

};