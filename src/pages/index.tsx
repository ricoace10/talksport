import { useState, useEffect } from "react";
import Image from "next/image";
import Head from "next/head";
import Layout from "../components/Layout";
import { Post } from "../types";

const Home = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/posts");
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const result = await response.json();
        setPosts(result.data); // Ensure your API returns posts in `data`
      } catch (error) {
        console.error(error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <Layout>
      <Head>
        <title>TalkSport - Home</title>
      </Head>
      
      {/* Main container that will grow and allow scrolling */}
      <div className="min-h-screen bg-gray-100">
        <div className="text-center pt-20">
          <h1 className="text-5xl font-bold text-yellow-700">TalkSport</h1>
          <div className="bg-gray-400 w-4/5 h-60 mx-auto mt-8 rounded-lg shadow-md" />
          <p className="text-yellow-500 text-lg mt-4 italic">Let’s Talk Football...</p>
        </div>
        
        {/* Public Feed */}
        <div className="max-w-2xl mx-auto space-y-6 mt-8 pb-20">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-lg shadow-md overflow-hidden relative"
            >
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
                <div className="flex items-center mt-2">
                  <span className="text-gray-700">
                    {post.likes?.length ?? 0} likes
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Home;
