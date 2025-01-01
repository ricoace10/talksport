import { useState } from "react";

const Dashboard = () => {
  // Example user content
  const [posts, setPosts] = useState([
    { id: 1, mediaType: "IMAGE", mediaUrl: "https://via.placeholder.com/600x400", caption: "First post" },
    { id: 2, mediaType: "VIDEO", mediaUrl: "https://www.w3schools.com/html/mov_bbb.mp4", caption: "Check out this video" },
  ]);

  // Notifications (likes)
  const [likes, setLikes] = useState(0);

  // Simulate liking a post
  const handleLike = () => {
    setLikes((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Navbar */}
      <header className="bg-black text-yellow-500 flex justify-between items-center px-6 py-4">
        <h1 className="text-lg font-bold">TalkSport</h1>
        <div className="flex items-center space-x-6">
          <a href="#" className="hover:text-yellow-300">For you</a>
          <a href="#" className="hover:text-yellow-300">Log out</a>
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
            {likes > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {likes}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow px-4 py-6">
        <h2 className="text-4xl text-yellow-500 font-bold text-center mb-8">TalkSport</h2>
        <div className="max-w-2xl mx-auto space-y-6">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {post.mediaType === "IMAGE" ? (
                <img
                  src={post.mediaUrl}
                  alt="User Content"
                  className="w-full h-auto object-cover"
                />
              ) : (
                <video
                  controls
                  className="w-full h-auto object-cover"
                >
                  <source src={post.mediaUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
              <div className="p-4">
                <p className="text-gray-700">{post.caption}</p>
                <button
                  onClick={handleLike}
                  className="mt-2 text-yellow-500 hover:text-yellow-300"
                >
                  Like
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black text-yellow-500 text-center py-4">
        TalkSport © 2024
      </footer>
    </div>
  );
};

export default Dashboard;
