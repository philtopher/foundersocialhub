import { Switch, Route } from "wouter";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import CommunityPage from "@/pages/community-page";
import PostDetailPage from "@/pages/post-detail-page";
import CreatePostPage from "@/pages/create-post-page";
import UserProfilePage from "@/pages/user-profile-page";
import PaymentPage from "@/pages/payment-page";
import PaymentSuccessPage from "@/pages/payment-success-page";
import { ProtectedRoute } from "@/lib/protected-route";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/r/:communityName" component={CommunityPage} />
      <Route path="/r/:communityName/post/:postId" component={PostDetailPage} />
      <ProtectedRoute path="/r/:communityName/submit" component={CreatePostPage} />
      <Route path="/u/:username" component={UserProfilePage} />
      <ProtectedRoute path="/payment" component={PaymentPage} />
      <ProtectedRoute path="/payment-success" component={PaymentSuccessPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return <Router />;
}

export default App;
