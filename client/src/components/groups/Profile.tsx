import { useState, useContext } from 'react';
import { styled } from 'styled-components';
import headshot from '../../img/headshot.jpg';
import AddImage from '../../img/addImage.jpg';
import palette from '../../lib/styles/palette';
import { User, UserContext } from '../../contexts/UserContext';
import * as profileAPI from '../../lib/api/profile';
import '../../styles/groups/GroupPage.scss';

const ProfilePictureUpload = () => {
    const { user, setUser } = useContext(UserContext);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
                        console.log(e);
                    });
            };

            // Read the contents of the selected file as a data URL.
            reader.readAsDataURL(file);
        }
    };

    return (
        <>
            <input
                required
                style={{ display: 'none' }}
                type="file"
                id="file"
                onChange={handleFileChange}
            />
            <label htmlFor="file">
                <img src={AddImage} alt="" />
            </label>
        </>
    );
};

const Profile = () => {
    const { user } = useContext(UserContext);

    return (
        <div className="profile-block">
            <div className="backgroundCover">
                {user!.imgURL ? (
                    <img src={user?.imgURL} alt="headshot" />
                ) : (
                    <ProfilePictureUpload />
                )}
            </div>
            <div className="profile-content">
                <div className="name">{user?.username}</div>
            </div>
        </div>
    );
};

export default Profile;
