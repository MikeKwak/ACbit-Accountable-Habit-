import { useState, useContext } from 'react';
import { styled } from 'styled-components';
import headshot from '../../img/headshot.jpg';
import AddImage from '../../img/addImage.jpg';
import palette from '../../lib/styles/palette';
import { User, UserContext } from '../../contexts/UserContext';
import * as profileAPI from '../../lib/api/profile';
import '../../styles/groups/GroupPage.scss';


type ProfileProps = {
    uploadImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const Profile: React.FC<ProfileProps> = ({ uploadImage }) => {
    const { user } = useContext(UserContext);

    return (
        <div className="profile-block">
            <div className="backgroundCover">
                <input
                    required
                    style={{ display: 'none' }}
                    type="file"
                    id="file"
                    onChange={uploadImage}
                />
                <label htmlFor="file">
                    {user!.imgURL ? (
                        <img src={user?.imgURL} alt="headshot" />
                    ) : (
                        <img src={AddImage} alt="" /> 
                    )}
                    
                </label>
            </div>
            <div className="profile-content">
                <div className="name">{user?.username}</div>
            </div>
        </div>
    );
};

export default Profile;
