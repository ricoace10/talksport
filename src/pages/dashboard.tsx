import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Post, User } from "../types";
import Head from "next/head";

interface Like {
  userId: number;
  postId: number;
}

const Dashboard = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [totalLikes, setTotalLikes] = useState<number>(0);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Create Post Modal
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [newPost, setNewPost] = useState({
    mediaType: "PICTURE",
    mediaUrl: "",
    caption: "",
  });

  // Menu, Delete, and Edit States
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);
  const [deleteModalId, setDeleteModalId] = useState<number | null>(null);
  const [editModalId, setEditModalId] = useState<number | null>(null);
  const [editCaption, setEditCaption] = useState<string>("");

  // 1. On mount, get current user & fetch posts
  useEffect(() => {
    // Attempt to load user info from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser) as User);
    }

    // Fetch all posts from all users
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/posts");
        const result = await response.json();

        if (response.ok) {
          const allPosts: Post[] = result.data;
          setPosts(allPosts);

          // Calculate total likes
          let sum = 0;
          allPosts.forEach((post: Post) => {
            sum += post.likes?.length || 0;
          });
          setTotalLikes(sum);
        } else {
          console.error(result.message);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  // 2. Handle uploading a new post
  const handleUpload = async () => {
    if (!newPost.mediaUrl) {
      alert("Please provide a file or media URL.");
      return;
    }
    if (!currentUser?.id) {
      alert("No current user found. Please log in again.");
      return;
    }

    try {
      // The 'authorId' is set to 'currentUser.id' so we can identify ownership
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorId: currentUser.id,
          mediaType: newPost.mediaType,
          mediaUrl: newPost.mediaUrl,
          caption: newPost.caption,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        alert(data.message || "Error uploading post.");
        return;
      }

      // Insert new post at top
      setPosts((prev) => [data.data, ...prev]);
      setIsModalOpen(false);
      setNewPost({ mediaType: "PICTURE", mediaUrl: "", caption: "" });
    } catch (error) {
      console.error("Error creating post:", error);
      alert("An unexpected error occurred while creating a post.");
    }
  };

  // 2a. Handle file selection (optional)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewPost((prev) => ({
        ...prev,
        mediaUrl: URL.createObjectURL(e.target.files![0]),
      }));
    }
  };

  // 3. Like or Unlike
  const handleLike = async (postId: number) => {
    if (!currentUser?.id) {
      alert("No current user found. Please log in again.");
      return;
    }

    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser.id }),
      });

      const data = await response.json();
      if (!response.ok) {
        alert(data.message || "Error toggling like.");
        return;
      }

      // Update likes in local state
      setPosts((prevPosts) =>
        prevPosts.map((post: Post) => {
          if (post.id === postId) {
            const userAlreadyLiked = post.likes?.some(
              (like: Like) => like.userId === currentUser.id
            );
            if (userAlreadyLiked) {
              // remove the like
              return {
                ...post,
                likes: post.likes.filter(
                  (like: Like) => like.userId !== currentUser.id
                ),
              };
            } else {
              // add a like
              return {
                ...post,
                likes: [
                  ...(post.likes || []),
                  { userId: currentUser.id, postId },
                ],
              };
            }
          }
          return post;
        })
      );

      // Re-calc total likes
      setTotalLikes((prevTotal) => {
        const thisPost = posts.find((p) => p.id === postId);
        if (!thisPost) return prevTotal;

        const wasLiked = thisPost.likes?.some(
          (like: Like) => like.userId === currentUser.id
        );
        return wasLiked ? prevTotal - 1 : prevTotal + 1;
      });
    } catch (error) {
      console.error("Error toggling like:", error);
      alert("An unexpected error occurred while toggling like.");
    }
  };

  // 4. Show/hide the 3-dot menu
  const toggleMenu = (postId: number) => {
    setMenuOpenId((prev) => (prev === postId ? null : postId));
  };

  // 5. Deleting a post
  const handleDeleteConfirm = (postId: number) => {
    setDeleteModalId(postId);
    setMenuOpenId(null);
  };

  const deletePost = async () => {
    if (!deleteModalId) return;
  
    try {
      const response = await fetch(`/api/posts/${deleteModalId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: Number(currentUser?.id), // Convert to number
        }),
      });
  
      const data = await response.json();
      if (!response.ok) {
        alert(data.message || "Error deleting post.");
        return;
      }
  
      // Success logic: remove post from local state, close modal, etc.
      // e.g.,
      // setPosts((prev) => prev.filter((p) => p.id !== deleteModalId));
      // setDeleteModalId(null);
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("An unexpected error occurred while deleting the post.");
    }
  };
  

  // 6. Editing a post
  const handleEdit = (postId: number, existingCaption: string) => {
    setEditModalId(postId);
    setEditCaption(existingCaption || "");
    setMenuOpenId(null);
  };

  const updatePost = async () => {
    if (!editModalId) return;
  
    try {
      const response = await fetch(`/api/posts/${editModalId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: Number(currentUser?.id), // Convert to number
          caption: editCaption,
        }),
      });
  
      const data = await response.json();
      if (!response.ok) {
        alert(data.message || "Error updating post.");
        return;
      }
  
      // Success logic: update local state, close modal, etc.
      // e.g.,
      // setPosts((prevPosts) =>
      //   prevPosts.map((post) =>
      //     post.id === editModalId ? data.data : post
      //   )
      // );
      // setEditModalId(null);
      // setEditCaption("");
    } catch (error) {
      console.error("Error updating post:", error);
      alert("An unexpected error occurred while updating the post.");
    }
  };
  

  useEffect(() => {
    document.documentElement.lang = "en";
  }, []);

  return (
    <>
      <Head>
        <html lang="en" />
        <title>TalkSport - Dashboard</title>
        <meta
          name="description"
          content="TalkSport dashboard where users can interact, post content, and engage with the community."
        />
      </Head>
      <div className="min-h-screen flex flex-col bg-gray-100">
        {/* Navbar */}
        <header className="bg-black text-yellow-500 flex justify-between items-center px-6 py-4">
          <h1 className="text-lg font-bold">TalkSport</h1>
          <div className="flex items-center space-x-6">
            <Link href="/dashboard" className="hover:text-yellow-300">
              For you
            </Link>
            <Link href="/logout" className="hover:text-yellow-300">
              Log out
            </Link>
            {/* Notification Icon for total likes */}
            <div className="relative">
              <button aria-label="Notifications">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14h-6a2 2 0 01-2-2V7a4 4 0 118 0v5a2 2 0 01-2 2h-1"
                  />
                </svg>
              </button>
              {totalLikes > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-700 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalLikes}
                </span>
              )}
            </div>
            {/* Plus Button (create post) */}
            <button
              className="bg-yellow-700 text-white rounded-full h-6 w-6 flex items-center justify-center shadow-lg hover:bg-yellow-600"
              onClick={() => setIsModalOpen(true)}
            >
              +
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow px-4 py-6">
          <h2 className="text-4xl text-yellow-700 font-bold text-center mb-8">
            TalkSport
          </h2>
          <div className="max-w-2xl mx-auto space-y-6">
            {posts.map((post: Post) => {
              // Evaluate ownership: only the user whose ID matches authorId can see Edit/Delete
              const isLiked = post.likes?.some(
                (like: Like) => like.userId === currentUser?.id
              );
              const isOwner = post.authorId === currentUser?.id;

              return (
                <div
                  key={post.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden relative"
                >
                  {/* Media */}
                  {post.mediaType === "PICTURE" ? (
                    <Image
                      src={post.mediaUrl}
                      alt="User Content"
                      width={600}
                      height={400}
                      className="w-full h-auto object-cover"
                    />
                  ) : (
                    <video controls className="w-full h-auto object-cover">
                      <source src={post.mediaUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  )}

                  <div className="p-4">
                    <p className="text-gray-800">{post.caption}</p>
                    <div className="flex items-center justify-between mt-2">
                      {/* Like Button */}
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleLike(post.id)}
                          aria-label={
                            isLiked ? "Unlike this post" : "Like this post"
                          }
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill={isLiked ? "red" : "none"}
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className={`w-5 h-5 ${
                              isLiked ? "text-red-500" : "text-gray-500"
                            }`}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5.121 21.364l-.007-.006a9.001 9.001 0 01-1.751-1.57C.465 16.68-.81 11.76 1.757 8.465 3.836 5.694 7.313 5 9.31 6.485c1.283.947 2.288 2.616 3.174 3.884.886-1.268 1.891-2.937 3.174-3.884 1.997-1.485 5.474-1.209 7.553 1.98 2.567 3.295 1.292 8.215-2.363 11.328a9.002 9.002 0 01-1.751 1.57l-.007.006L12 21.757l-6.879-6.393z"
                            />
                          </svg>
                        </button>
                        <span className="text-gray-700">
                          {post.likes?.length ?? 0} likes
                        </span>
                      </div>

                      {/* 3-dot menu (Only the Owner sees this) */}
                      {isOwner && (
                        <div className="relative">
                          <button
                            onClick={() => toggleMenu(post.id)}
                            className="bg-white text-gray-700 hover:text-black p-1 rounded-full shadow-md"
                            aria-label="Options menu"
                          >
                            ⋯
                          </button>
                          {menuOpenId === post.id && (
                            <div className="absolute bottom-10 right-0 bg-white border border-gray-200 shadow-md rounded-md p-2 z-50">
                              <button
                                className="block w-full text-left px-2 py-1 text-sm hover:bg-gray-100 text-yellow-500"
                                onClick={() =>
                                  handleEdit(post.id, post.caption || "")
                                }
                              >
                                Edit
                              </button>
                              <button
                                className="block w-full text-left px-2 py-1 text-sm hover:bg-gray-100 text-red-500"
                                onClick={() => handleDeleteConfirm(post.id)}
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-black text-yellow-600 text-center py-4">
          TalkSport © 2024
        </footer>

        {/* Upload New Post Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6">
              <h3 className="text-yellow-500 text-lg font-bold mb-4">
                Upload Video/Photo
              </h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleUpload();
                }}
              >
                <div className="mb-4">
                  <label
                    htmlFor="mediaType"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Media Type
                  </label>
                  <select
                    id="mediaType"
                    value={newPost.mediaType}
                    onChange={(e) =>
                      setNewPost((prev) => ({
                        ...prev,
                        mediaType: e.target.value,
                      }))
                    }
                    className="w-full mt-1 border border-gray-300 rounded-md p-2"
                  >
                    <option value="PICTURE">Image</option>
                    <option value="VIDEO">Video</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="mediaFile"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Media File
                  </label>
                  <input
                    type="file"
                    id="mediaFile"
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                    className="w-full mt-1 border border-gray-300 rounded-md p-2"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="caption"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Caption
                  </label>
                  <textarea
                    id="caption"
                    value={newPost.caption}
                    onChange={(e) =>
                      setNewPost((prev) => ({
                        ...prev,
                        caption: e.target.value,
                      }))
                    }
                    placeholder="Write a caption"
                    className="w-full mt-1 border border-gray-300 rounded-md p-2 text-black font-medium"
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="bg-gray-300 text-gray-700 rounded-md px-4 py-2 hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-yellow-500 text-white rounded-md px-4 py-2 hover:bg-yellow-600"
                  >
                    Upload
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteModalId !== null && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h3 className="text-xl font-bold mb-4">Delete Post</h3>
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete this post?
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setDeleteModalId(null)}
                  className="bg-gray-300 text-gray-700 rounded-md px-4 py-2 hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={deletePost}
                  className="bg-red-500 text-white rounded-md px-4 py-2 hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {editModalId !== null && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
              <h3 className="text-xl font-bold mb-4">Edit Post</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  updatePost();
                }}
              >
                <div className="mb-4">
                  <label
                    htmlFor="editCaption"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Caption
                  </label>
                  <textarea
                    id="editCaption"
                    value={editCaption}
                    onChange={(e) => setEditCaption(e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2 text-black font-medium"
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setEditModalId(null)}
                    className="bg-gray-300 text-gray-700 rounded-md px-4 py-2 hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-yellow-500 text-white rounded-md px-4 py-2 hover:bg-yellow-600"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;
