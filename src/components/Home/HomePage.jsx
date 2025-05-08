import { useEffect, useState } from "react";
import Carousel from "./Carousel";
import { useNavigate } from "react-router-dom";
import EventForm from "../EventForm";
import Events from "./Events";
import FeedbackForm from "../Feedbackform";
import Schedule from "./Schedule";
import { HelpCircle, MessageCircle } from "lucide-react";
import axios from "axios";

export default function HomePage() {
  const navigate = useNavigate();
  const [showTutorial, setShowTutorial] = useState(false);
  const [communityPosts, setCommunityPosts] = useState([]);
  const [newPost, setNewPost] = useState("");

  const token = sessionStorage.getItem('jwtToken');
  const userId = sessionStorage.getItem('userId');

  useEffect(() => {
    if(!userId || userId === 'undefined'){
      navigate('/signin')
    } else {
      fetchCommunityPosts();
    }
  }, [])

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  const fetchCommunityPosts = async () => {
    try {
      const response = await axios.get(
        `http://localhost:9997/feedback/get-feedback-by-eventId/userReviews`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      setCommunityPosts(response.data);
    }catch (error) {
      console.error("Error fetching community posts:", error);
    }
  };

  const createCommunityPost = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:9997/feedback/create-feedback",
        {
          userId,
          eventId: "userReviews",
          feedbackMessage: newPost,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNewPost("");
      fetchCommunityPosts();
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const tutorials = [
    {
      section: "Home",
      description: "Welcome to our platform! Browse through featured events and announcements in the carousel."
    },
    {
      section: "Events", 
      description: "View and register for upcoming events. Click on any event card to see more details and sign up."
    },
    {
      section: "Schedule",
      description: "Manage your event schedule and set reminders. Green events indicate reminders are set."
    },
    {
      section: "Feedback",
      description: "Share your thoughts and experiences about events you've attended."
    },
    {
      section: "Community",
      description: "Connect with other attendees, share experiences, and build meaningful connections."
    }
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setShowTutorial(!showTutorial)}
        className="fixed right-4 top-20 z-50 p-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
        title="Help"
      >
        <HelpCircle size={24} />
      </button>

      {showTutorial && (
        <div className="fixed right-4 top-32 z-50 w-72 bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <h3 className="font-bold text-lg mb-4">Platform Guide</h3>
          <div className="space-y-4">
            {tutorials.map((item, index) => (
              <div key={index}>
                <h4 className="font-semibold text-black">{item.section}</h4>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{display: "flex", flexDirection: "column", gap: "2rem"}}>
        <section id="home-section">
          <Carousel />
        </section>
        
        <section id="events-section">
          <Events />
        </section>

        <section id="schedules-section">
          <Schedule />
        </section>

        <section id="feedback-section">
          <FeedbackForm />
        </section>

        <section id="community-section" className="w-full max-w-6xl mx-auto p-8">
          <div className="flex items-center gap-3 mb-6">
            <MessageCircle className="h-8 w-8" />
            <h2 className="text-3xl font-bold">Let Us Know How We Can Improve</h2>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <form onSubmit={createCommunityPost} className="mb-8">
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="Share your thoughts with the community..."
                className="w-full p-4 border rounded-lg resize-none h-32"
                required
              />
              <button 
                type="submit"
                className="mt-2 px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Post
              </button>
            </form>

            <div className="space-y-6">
              {communityPosts.map((post) => (
                <div key={post.feedbackId} className="p-6 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <img src={post.image} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <p className="font-medium">{post.userName}</p>
                    </div>
                  </div>
                  <p className="text-gray-700">{post.feedbackMessage}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
