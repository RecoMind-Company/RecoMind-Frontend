import { Toaster } from "react-hot-toast";
import ProfileCompletionBanner from "../UI/ProfileCompletionBanner";

const Home = () => {
  return (
    <>
      <Toaster position="top-center" />
      <ProfileCompletionBanner userName="Ahmed" completionPercentage={50} />
    </>
  );
};

export default Home;
