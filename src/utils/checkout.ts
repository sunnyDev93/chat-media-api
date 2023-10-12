import User from "../models/user";

export const chargeToken = async (uid : String, plan : string, token : number) => {
    console.log("Charge");

    try {
        const user = await User.findOne({uid: uid});
        if (! user) {
            throw new Error('User not found');
        }
        if (user.token) {
            user.token = token;
            user.plan = plan
        }

        await user.save();
    } catch (error) {
        console.error('Error updating user budget:', error);
        throw error;
    }
}


// export const checkOut = async (uid : any, amount : any) => {
//     try {
//         const user = await User.findOne({uid: uid});
//         if (! user) {
//             throw new Error('User not found');
//         }
//         user.token += amount;

//         await user.save();
//     } catch (error) {
//         console.error('Error updating user budget:', error);
//         throw error;
//     }
// }
