import path from 'path';
import getAudioDuration from 'get-audio-duration';
import User from '../models/user';


export const getAudioDurationPromise = (fileName : string) => {
    const filePath = path.join(__dirname, '../../public/data/uploads', fileName);
    return new Promise((resolve, reject) => {
        const duration = getAudioDuration(filePath);

        if (duration) {
            resolve(duration);
        } else {
            reject('Failed to retrieve audio duration.');
        }
    });
}


export const reduceToken = async (duration : any, uid : string) => {
    if (duration) {
        const user = await User.findOne({uid: uid});
        if (user) {
            user.token -= duration * 1000 / 60;
            if (user.token > 0) {
                user.save();
                return true;
            } else 
                return false;
            


        } else 
            return false


        


    } else 
        return false;
    


}
