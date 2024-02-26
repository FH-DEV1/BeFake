"use client"
import { PageProvider, usePageState } from "@/components/PagesContext";
import SelectedPost from "@/components/pages/SelectedPost";
import Feed from "@/components/pages/feed";
import Error from "@/components/pages/error";
import { Start } from "@/components/pages/start";
import FOFfeed from "@/components/pages/FOFfeed";
import Login from "@/components/pages/login";
import OTPValidate from "@/components/pages/OTPValidate";
import MyProfile from "@/components/pages/MyProfile";

function ActivePageComponent() {
  const { page } = usePageState();
  switch (page) {
    case "start":
      return <Start />;
    case "feed":
      return <Feed />;
    case "SelectedPost":
      return <SelectedPost />;
    case "Error":
      return <Error />;
    case "FOFfeed":
      return <FOFfeed />;
    case "login":
      return <Login />;
    case "OTP":
      return <OTPValidate />;
    case "MyProfile":
      return <MyProfile />;
    default:
      return <Start />;
  }
}

const Home: React.FC = () => {
  return (
    <PageProvider>
      <ActivePageComponent />
    </PageProvider>
  )
}
export default Home;