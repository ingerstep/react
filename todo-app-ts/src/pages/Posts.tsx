import { useEffect, useState } from 'react';
import '../styles/App.css';
import { usePosts } from '../hooks/usePosts';
import { useFetching } from '../hooks/useFetching';
import { PostService } from '../API/PostService';
import { getPagesCount } from '../utils/pages';
import { MyButton } from '../components/UI/button/MyButton';
import { MyModal } from '../components/UI/modal/MyModal';
import { PostForm } from '../components/PostForm';
import { PostFilter } from '../components/PostFilter';
import { Loader } from '../components/UI/Loader/Loader';
import { PostList } from '../components/PostList';
import { Pagination } from '../components/UI/pagination/Pagination';


export interface Post {
    id: number;
    title: string;
    body: string;
}

export const Posts = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [filter, setFilter] = useState({ sort: '', query: '' });
    const [modal, setModal] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);
    const sortedAndSearchedPosts = usePosts(posts, filter.sort, filter.query);

    const [fetchPosts, isPostsLoading, postError] = useFetching(async (limit, page) => {
        const response = await PostService.getAll(limit, page);
        const totalCount = response.headers['x-total-count'];

        setPosts(response.data);
        setTotalPages(getPagesCount(totalCount, limit));
    })

    useEffect(() => {
        if (typeof fetchPosts === 'function') {
            fetchPosts(limit, page);
        } else {
            console.error(postError);
        }
    }, [])

    const createPost = (newPost: Post) => {
        setPosts([...posts, newPost]);
        setModal(false);
    }

    const removePost = (post: Post) => {
        setPosts(posts.filter(p => p.id !== post.id));
    }

    const changePage = (page: number) => {
        setPage(page)
        if (typeof fetchPosts === 'function') {
            fetchPosts(limit, page);
        } else {
            console.error(postError);
        }
    }

    return (
        <div className="App">
            <MyButton style={{ marginTop: 30 }} onClick={() => setModal(true)}>
                Create post
            </MyButton>
            <hr style={{ margin: '15px 0' }} />
            <MyModal visible={modal} setVisible={setModal}>
                <PostForm create={createPost} />
            </MyModal>
            <PostFilter
                filter={filter}
                setFilter={setFilter}
            />
            {postError && typeof postError === "string" && <h1>Error {postError}</h1>}
            {isPostsLoading
                ? <Loader />
                : <PostList posts={sortedAndSearchedPosts} remove={removePost} title='Title list' />
            }
            <Pagination page={page} changePage={changePage} totalPages={totalPages} />
        </div>
    )
}
