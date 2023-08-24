import React, { useContext, useEffect, useState } from 'react';
import PostList from '../../components/posts/PostList';
import { AxiosResponse } from 'axios';
import { useParams } from 'react-router-dom';
import * as postAPI from '../../lib/api/posts';
import { UserContext } from '../../contexts/UserContext';
import { Group } from '../main/MainContainer';
import defaultPicture from '../../img/default.png';
import deletedPicture from '../../img/default.png';

export type Post = {
    _id: string;
    status: string;
    title: string;
    body: string;
    tags: string[];
    publishedDate: Date;
    deadlineDate: Date;
    user: {
        _id: string;
        username: string;
        imgURL: string;
    };
};

export type PostFormData = {
    title: string;
    body: string;
    deadline: string;
};

type PostListContainerProps = {
    users: {
        username: string;
        imgURL: string;
    }[];
    posts: Post[];
    setGroup: React.Dispatch<React.SetStateAction<Group | null>>;
    error: string;
    setError: React.Dispatch<React.SetStateAction<string>>;
};

const PostListContainer: React.FC<PostListContainerProps> = ({
    users,
    posts,
    setGroup,
    error,
    setError,
}) => {
    const { user, setUser } = useContext(UserContext);
    const [loading, setLoading] = useState(false);
    const { groupID } = useParams();
    //'createAt', 'deadline', 'user'
    const [sortOption, setSortOption] = useState<string>('createdAt');

    const [status, setStatus] = useState<string>('upcoming');

    const createPost = (formData: PostFormData) => {
        setLoading(true);
        postAPI
            .create(groupID!, formData)
            .then((res: AxiosResponse<Post[]>) => {
                setGroup(
                    (prevGroup): Group => ({
                        ...prevGroup!,
                        posts: res.data,
                    }),
                );
                setLoading(false);
            })
            .catch((e) => {
                if (e.response.status === 400) {
                    if (e.response.data === 'chrono-error') {
                        setError('invalid input for deadline');
                        setTimeout(() => {
                            setError('');
                        }, 3000);
                    } else {
                        setError('failed to create post');
                        setTimeout(() => {
                            setError('');
                        }, 3000);
                    }
                }
            });
    };

    const completePost = (_id: string) => {
        postAPI
            .complete(groupID!, _id)
            .then((res: AxiosResponse<Post[]>) => {
                setGroup(
                    (prevGroup): Group => ({
                        ...prevGroup!,
                        posts: res.data,
                    }),
                );
                updateTaskData();
            })
            .catch((e) => {
                setError('failed to complete post');
            });
    };

    //update User's progress chart on post completion
    const updateTaskData = () => {
        const currentDate = new Date();
        const todayDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate(),
        );

        const updatedTaskData = user!.taskData.map((task) => {
            const taskDate = new Date(task.date);

            if (taskDate.getTime() === todayDate.getTime()) {
                return {
                    ...task,
                    tasksCompleted: task.tasksCompleted + 1,
                };
            }
            return task;
        });

        const taskExistsForToday = updatedTaskData.some(
            (task) => new Date(task.date).getTime() === todayDate.getTime(),
        );

        if (!taskExistsForToday) {
            updatedTaskData.push({
                date: todayDate,
                tasksCompleted: 1,
            });
        }
        setUser({
            ...user!,
            taskData: updatedTaskData,
        });
    };

    const deletePost = (_id: string) => {
        postAPI
            .remove(groupID!, _id)
            .then(() => {
                setGroup((prevGroup) => ({
                    ...prevGroup!,
                    posts:
                        prevGroup?.posts.filter((post) => post._id !== _id) ||
                        [],
                }));
            })
            .catch((e) => {
                setError('failed to delete post');
            });
    };

    const sortPosts = (sortOption: string) => {
        const sortedPosts: Post[] = [...posts];
        if (sortOption === 'createdAt') {
            sortedPosts.sort(
                (a, b) =>
                    new Date(a.publishedDate).getTime() -
                    new Date(b.publishedDate).getTime(),
            );
        } else if (sortOption === 'deadline') {
            sortedPosts.sort(
                (a, b) =>
                    new Date(a.deadlineDate).getTime() -
                    new Date(b.deadlineDate).getTime(),
            );
            console.log(sortedPosts);
        } else if (sortOption === 'user') {
            sortedPosts.sort((a, b) => {
                if (a.user.username === user!.username) {
                    return -1; // a comes before b
                } else if (b.user.username === user!.username) {
                    return 1; // b comes before a
                } else {
                    return a.user.username.localeCompare(b.user.username);
                }
            });
        }
        return sortedPosts;
    };

    const getUserImgURL = (username: string) => {
        if (username === user!.username && user!.imgURL) {
            return user!.imgURL;
        }
        const groupUser = users.find((user) => user.username === username);
        if (!groupUser) {
            return deletedPicture;
        } else {
            if (groupUser.imgURL) {
                return groupUser.imgURL;
            }
        }
        return defaultPicture;
    };

    return (
        <PostList
            loading={loading}
            error={error}
            setError={setError}
            sortedPosts={sortPosts(sortOption)}
            createPost={createPost}
            completePost={completePost}
            deletePost={deletePost}
            sortOption={sortOption}
            setSortOption={setSortOption}
            getUserImgURL={getUserImgURL}
            status={status}
            setStatus={setStatus}
        />
    );
};

export default PostListContainer;
