import Layout from "../components/Layout";

const Home = () => {
  return (
    <Layout>
      <div className="text-center mt-20">
        <h1 className="text-5xl font-bold text-yellow-700">TalkSport</h1>
        <div className="bg-gray-400 w-4/5 h-60 mx-auto mt-8 rounded-lg shadow-md"></div>
        <p className="text-yellow-500 text-lg mt-4 italic">Let’s Talk Football...</p>
      </div>
    </Layout>
  );
};

export default Home;
