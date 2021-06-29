export default {
    Comment: {
        isMine: ({ userId }, _, { loggedInUser }) => userId === loggedInUser?.id
    }
};