import React, { useContext, useEffect, useState } from 'react';
import PostList from '../../components/posts/PostList';
import axios, { AxiosResponse } from 'axios';
import { useParams } from 'react-router-dom';
import * as postAPI from '../../lib/api/posts';
import { PostsContext } from '../../contexts/PostsContext';
import { UserContext } from '../../contexts/UserContext';

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
    tags: string;
    body: string;
    deadline: string;
};

const PostListContainer: React.FC = () => {
    const { user, setUser } = useContext(UserContext);
    const { posts, setPosts } = useContext(PostsContext);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<boolean>(false);
    const { groupID } = useParams();

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
        console.log('test')
        setUser({
            ...user!,
            taskData: updatedTaskData,
        });
    };

    const createPost = (formData: PostFormData) => {
        postAPI
            .create(groupID!, formData)
            .then((res: AxiosResponse<Post>) => {
                setPosts((prevPosts) => [...prevPosts, res.data]);
            })
            .catch((error) => {
                console.error('Error fetching groups:', error);
            });
    };

    const completePost = (_id: string) => {
        postAPI
            .complete(groupID!, _id)
            .then((res: AxiosResponse<Post[]>) => {
                setPosts(res.data);
                updateTaskData();
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const deletePost = (_id: string) => {
        postAPI
            .remove(groupID!, _id)
            .then(() => {
                setPosts(posts.filter((post) => post._id !== _id));
            })
            .catch((e) => {
                console.log(e);
            });
    };

    useEffect(() => {
        setLoading(true);
        axios
            .get<Post[]>(`/api/posts/${groupID}`)
            .then((response) => {
                setPosts(response.data); // Update the state with the fetched posts
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching posts:', error);
                setError(true);
                setLoading(false);
            });
    }, []);

    return (
        <PostList
            loading={loading}
            error={error}
            posts={posts}
            createPost={createPost}
            completePost={completePost}
            deletePost={deletePost}
        />
    );
};

export default PostListContainer;
