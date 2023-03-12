module.exports = {

    friendlyName: 'User',

    description: 'To give list of online users',

    inputs: {

    },

    exits: {

    },

    fn: async function(inputs, exits) {

        try {

            let allUsers = await user.find({});
            return exits.success(allUsers);

        } catch (err) {
            return exits.error(err);
        }
    }

};