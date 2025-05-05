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
import ForgotPasswordPage from "@/pages/forgot-password-page";
import ResetPasswordPage from "@/pages/reset-password-page";
import SettingsPage from "@/pages/settings-page";
import SavedPage from "@/pages/saved-page";
import MyCommunitiesPage from "@/pages/my-communities-page";
import { ProtectedRoute } from "@/lib/protected-route";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/forgot-password" component={ForgotPasswordPage} />
      <Route path="/reset-password" component={ResetPasswordPage} />
      <Route path="/:communityName" component={CommunityPage} />
      <Route path="/:communityName/post/:postId" component={PostDetailPage} />
      <ProtectedRoute path="/:communityName/submit" component={CreatePostPage} />
      <Route path="/u/:username" component={UserProfilePage} />
      <ProtectedRoute path="/payment" component={PaymentPage} />
      <ProtectedRoute path="/payment-success" component={PaymentSuccessPage} />
      <ProtectedRoute path="/settings" component={SettingsPage} />
      <ProtectedRoute path="/saved" component={SavedPage} />
      <ProtectedRoute path="/my-communities" component={MyCommunitiesPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return <Router />;
}

export default App;
