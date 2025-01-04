// pages/dashboard.tsx
import { useState, useEffect } from "react";

// Replace this with real auth logic (e.g., a global context or NextAuth)
const mockCurrentUser = { id: 1, name: "John Doe" };

const Dashboard = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [totalLikes, setTotalLikes] = useState(0);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPost, setNewPost] = useState({
    mediaType: "PICTURE", // Must be 'VIDEO' or 'PICTURE' to match your schema enum
    mediaUrl: "",
    caption: "",
  });
  const [file, setFile] = useState<File | null>(null);

  // 1. Fetch posts on mount
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/posts");
        const result = await response.json();
        if (response.ok) {
          // result.data should be an array of posts
          setPosts(result.data);
          // Calculate total likes across all posts
          let sum = 0;
          result.data.forEach((post: any) => {
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

  // 2. Create new post
  const handleUpload = async () => {
    if (!newPost.mediaUrl) {
      alert("Please upload a file or provide a URL.");
      return;
    }

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorId: mockCurrentUser.id, // real app: replace with actual user ID
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

      // The new post is in data.data and should include likes: []
      const createdPost = data.data;

      // Add the new post to the top of our list
      setPosts((prev) => [createdPost, ...prev]);

      // Currently, no likes for a brand-new post, so totalLikes doesn’t need to change
      setIsModalOpen(false);
      setNewPost({ mediaType: "PICTURE", mediaUrl: "", caption: "" });
      setFile(null);
    } catch (error) {
      console.error("Error creating post:", error);
      alert("An unexpected error occurred while creating a post.");
    }
  };

  // 3. Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      // In a real-world app, you'd upload to a server or storage service
      setNewPost({
        ...newPost,
        // Convert local file to a temporary object URL for preview
        mediaUrl: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  // 4. Toggle like/unlike
  const handleLike = async (postId: number) => {
    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: mockCurrentUser.id }),
      });

      const data = await response.json();
      if (!response.ok) {
        alert(data.message || "Error toggling like.");
        return;
      }

      // Update local state
      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post.id === postId) {
            // Use optional chaining or default to an array
            const userAlreadyLiked = post.likes?.some(
              (like: any) => like.userId === mockCurrentUser.id
            );

            if (userAlreadyLiked) {
              // Remove the user's like from the array
              return {
                ...post,
                likes: post.likes.filter(
                  (like: any) => like.userId !== mockCurrentUser.id
                ),
              };
            } else {
              // Add a new like
              return {
                ...post,
                likes: [...(post.likes || []), { userId: mockCurrentUser.id, postId }],
              };
            }
          }
          return post;
        })
      );

      // Recalculate total likes
      setTotalLikes((prev) => {
        // We can do a quick approach:
        const likedPost = posts.find((p) => p.id === postId);
        if (!likedPost) return prev;

        // If userAlreadyLiked was true, we unliked => subtract 1
        const wasLiked = likedPost.likes?.some(
          (like: any) => like.userId === mockCurrentUser.id
        );
        return wasLiked ? prev - 1 : prev + 1;
      });
    } catch (error) {
      console.error("Error toggling like:", error);
      alert("An unexpected error occurred while toggling like.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Navbar */}
      <header className="bg-black text-yellow-500 flex justify-between items-center px-6 py-4">
        <h1 className="text-lg font-bold">TalkSport</h1>
        <div className="flex items-center space-x-6">
          <a href="/dashboard" className="hover:text-yellow-300">
            For you
          </a>
          <a href="/logout" className="hover:text-yellow-300">
            Log out
          </a>
          {/* Notification Icon */}
          <div className="relative">
            <button className="relative">
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
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {totalLikes}
              </span>
            )}
          </div>
          {/* Plus Button */}
          <button
            className="bg-yellow-500 text-white rounded-full h-6 w-6 flex items-center justify-center shadow-lg hover:bg-yellow-600"
            onClick={() => setIsModalOpen(true)}
          >
            +
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow px-4 py-6">
        <h2 className="text-4xl text-yellow-500 font-bold text-center mb-8">
          TalkSport
        </h2>
        <div className="max-w-2xl mx-auto space-y-6">
          {posts.map((post) => {
            // Optional chaining to avoid undefined
            const isLiked = post.likes?.some(
              (like: any) => like.userId === mockCurrentUser.id
            );
            return (
              <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {post.mediaType === "PICTURE" ? (
                  <img
                    src={post.mediaUrl}
                    alt="User Content"
                    className="w-full h-auto object-cover"
                  />
                ) : (
                  <video controls className="w-full h-auto object-cover">
                    <source src={post.mediaUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
                <div className="p-4">
                  <p className="text-gray-700">{post.caption}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    {/* Like Button */}
                    <button onClick={() => handleLike(post.id)}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill={isLiked ? "red" : "none"}
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className={`w-5 h-5 ${isLiked ? "text-red-500" : "text-gray-500"}`}
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
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black text-yellow-500 text-center py-4">
        TalkSport © 2024
      </footer>

      {/* Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6">
            <h3 className="text-yellow-500 text-lg font-bold mb-4">Upload Video/Photo</h3>
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
                    setNewPost({ ...newPost, mediaType: e.target.value })
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
                    setNewPost({ ...newPost, caption: e.target.value })
                  }
                  placeholder="Write a caption"
                  className="w-full mt-1 border border-gray-300 rounded-md p-2 text-black font-medium"
                ></textarea>
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
    </div>
  );
};

export default Dashboard;
