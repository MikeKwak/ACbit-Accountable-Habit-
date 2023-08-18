import { createContext, useEffect, useState } from 'react';
import { Post } from '../containers/posts/PostListContainer'; // Import the Post type

export const PostsContext = createContext<{
    posts: Post[];
    setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
}>({
    posts: [],
    setPosts: () => {},
});

interface PostsProviderProps {
    children: React.ReactNode;
}

export const PostsProvider: React.FC<PostsProviderProps> = ({ children }) => {
    const [posts, setPosts] = useState<Post[]>(() => {
        const storedPosts = localStorage.getItem('posts');
        return storedPosts ? JSON.parse(storedPosts) : [];
    });

    useEffect(() => {
        if (posts.length > 0) {
            localStorage.setItem('posts', JSON.stringify(posts));
        } else {
            localStorage.removeItem('posts');
        }
    }, [posts]);

    return (
        <PostsContext.Provider value={{ posts, setPosts }}>
            {children}
        </PostsContext.Provider>
    );
};
