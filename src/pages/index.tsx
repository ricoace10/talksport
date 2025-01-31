import Layout from "../components/Layout";

const Home = () => {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 md:px-8">
        <h1 className="text-4xl sm:text-5xl font-bold text-yellow-500 text-center mt-16 sm:mt-20">
          TalkSport
        </h1>

        <div className="bg-gray-200 w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl h-48 sm:h-60 mx-auto mt-6 sm:mt-8 rounded-lg shadow-md"></div>

        <p className="text-yellow-500 text-md sm:text-lg mt-3 sm:mt-4 italic text-center">
          Let’s Talk Football...
        </p>
      </div>
    </Layout>
  );
};

export default Home;
