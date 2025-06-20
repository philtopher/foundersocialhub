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
import HowItWorksPage from "@/pages/how-it-works-page";
import TermsPage from "@/pages/terms-page";
import PrivacyPage from "@/pages/privacy-page";
import NotificationsPage from "@/pages/notifications-page";
import ExplorePage from "@/pages/explore-page";
import MyPostsPage from "@/pages/my-posts-page";
import { ProtectedRoute } from "@/lib/protected-route";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/forgot-password" component={ForgotPasswordPage} />
      <Route path="/reset-password" component={ResetPasswordPage} />
      <Route path="/how-it-works" component={HowItWorksPage} />
      <Route path="/terms" component={TermsPage} />
      <Route path="/privacy" component={PrivacyPage} />
      <ProtectedRoute path="/payment" component={PaymentPage} />
      <ProtectedRoute path="/payment-success" component={PaymentSuccessPage} />
      <ProtectedRoute path="/settings" component={SettingsPage} />
      <ProtectedRoute path="/saved" component={SavedPage} />
      <ProtectedRoute path="/my-communities" component={MyCommunitiesPage} />
      <ProtectedRoute path="/create-post" component={CreatePostPage} />
      <ProtectedRoute path="/profile" component={UserProfilePage} />
      <ProtectedRoute path="/my-posts" component={MyPostsPage} />
      <ProtectedRoute path="/notifications" component={() => <NotificationsPage />} />
      <ProtectedRoute path="/explore" component={() => <ExplorePage />} />
      <Route path="/u/:username" component={UserProfilePage} />
      <ProtectedRoute path="/:communityName/submit" component={CreatePostPage} />
      <Route path="/:communityName/post/:postId" component={PostDetailPage} />
      <Route path="/:communityName" component={CommunityPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return <Router />;
}

export default App;
