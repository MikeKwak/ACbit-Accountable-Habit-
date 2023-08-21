import { useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import * as profileAPI from '../../lib/api/profile';
import Profile from '../../components/groups/Profile';
import { Group } from '../main/MainContainer';

// type ProfileContainerProps = {
//     setGroup: React.Dispatch<React.SetStateAction<Group | null>>
// }

const ProfileContainer = () => {
    const { user, setUser } = useContext(UserContext);

    const uploadImage = (imgURL: string) => {
        profileAPI
            .uploadImage(imgURL)
            .then(() => {
                setUser({
                    ...user!,
                    imgURL: imgURL,
                });
            })
            .catch((e) => {
                console.log(e);
            });
    };

    return (
        <Profile uploadImage={uploadImage} />
    )
};

export default ProfileContainer;
