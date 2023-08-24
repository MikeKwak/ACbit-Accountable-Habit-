import { useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import * as profileAPI from '../../lib/api/profile';
import Profile from '../../components/common/Profile';

const ProfileContainer = () => {
    const { user, setUser } = useContext(UserContext);

    const uploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();

            reader.onloadend = () => {
                const imgURL = reader.result as string;

                profileAPI
                    .uploadImage(imgURL)
                    .then(() => {
                        setUser({
                            ...user!,
                            imgURL: imgURL,
                        });
                    })
                    .catch((e) => {
                        console.log('here')
                        console.log(e);
                    });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <Profile uploadImage={uploadImage} />
    )
};

export default ProfileContainer;
