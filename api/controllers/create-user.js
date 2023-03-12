module.exports = {

    friendlyName: 'User',

    description: 'create a user with username and subscribe also.',

    inputs: {
        username: {
            type: 'string',
            required: true,
            description: 'The username of the user.'
        }
    },

    exits: {

    },

    fn: async function(inputs, exits) {

        try {

            let newUser = await user.create({
                username: inputs.username
            }).meta({ fetch: true });

            console.log({ newUser });

            user.subscribe(this.req, [newUser.id]);

            let allUsers = await user.find({});
            sails.sockets.blast('user-list', {
                users: allUsers
            });

            return exits.success(newUser);

        } catch (err) {
            return exits.error(err);
        }
    }
};