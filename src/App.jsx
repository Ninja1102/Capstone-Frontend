import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigationbar from "./components/Navigationbar";
import SignInForm from "./components/SignIn";
import RegisterForm from "./components/Register";
import LandingPage from "./components/LandingPage";
import NavBar from "./components/Home/NavBar";
import HomePage from "./components/Home/HomePage";
import Events from "./components/Home/Events";
import EventForm from "./components/EventForm";
import AdminNavBar from "../src/components/Admin/AdminNavBar";
import AdminHome from "./components/Admin/AdminHome";
import UserPage from "./components/Admin/UserPage";
import AdminEvents from "./components/Admin/AdminEvents";
import AdminAnalytics from "./components/Admin/AdminAnalytics";
import UserDashboard from "./components/UserProfile/UserDashboard";
import UserDetails from "./components/UserProfile/UserDetails";
import UserSettings from "./components/UserProfile/UserSettings";
import FeedbackPage from '../src/components/Admin/FeedbackPage';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Navigationbar />
              <LandingPage />
            </>
          }
        />
        <Route
          path="/signin"
          element={
            <>
              <Navigationbar />
              <SignInForm />
            </>
          }
        />
        <Route
          path="/register"
          element={
            <>
              <Navigationbar />
              <RegisterForm />
            </>
          }
        />
        <Route
          path="/home"
          element={
            <>
              <NavBar />
              <HomePage />
            </>
          }
        />
        <Route
          path="/events"
          element={
            <>
              <NavBar />
              <Events />
            </>
          }
        />
        <Route
          path="/create-event"
          element={
            <>
              <NavBar />
              <EventForm />
            </>
          }
        />
        <Route
          path="/admin"
          element={
            <>
              <AdminNavBar />
              <AdminHome />
            </>
          }
        />
        <Route
          path="/admin/users"
          element={
            <>
              <AdminNavBar />
              <UserPage />
            </>
          }
        />
        <Route
          path="/admin/events"
          element={
            <>
              <AdminNavBar />
              <AdminEvents />
            </>
          }
        />
        <Route
          path="/admin/analytics"
          element={
            <>
              <AdminNavBar />
              <AdminAnalytics />
            </>
          }
        />
        <Route
          path="/home/profile"
          element={
            <>
              <UserDashboard />
            </>
          }
        />
        <Route
          path="/home/profile/profile"
          element={
            <>
              <UserDashboard />
              <UserDetails />
            </>
          }
        />
        <Route
          path="/home/profile/settings"
          element={
            <>
              <UserDashboard />
              <UserSettings />
            </>
          }
        />
        <Route 
          path="/admin/feedback"
          element={
            <FeedbackPage />
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
