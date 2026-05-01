import { useState, useEffect } from "react";
import axiosInstance from "../../api/axios";
import { toast } from "react-hot-toast";
import { Star } from "lucide-react";

const ViewFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const { data } = await axiosInstance.get("/feedback");
      setFeedbacks(data.data);
    } catch (error) {
      toast.error("Failed to load feedback");
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${i < rating ? "fill-amber-400 text-amber-400" : "text-slate-300"}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Customer Feedback</h1>

      {loading ? (
        <div className="p-8 text-center text-slate-500">Loading feedback...</div>
      ) : feedbacks.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {feedbacks.map((feedback) => (
            <div key={feedback._id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-start mb-4">
                {renderStars(feedback.rating)}
                <span className="text-xs text-slate-400">
                  {new Date(feedback.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-slate-700 italic mb-6">"{feedback.message}"</p>
              <div className="border-t border-slate-100 pt-4 mt-auto">
                <p className="text-sm font-semibold text-slate-900">{feedback.name}</p>
                <p className="text-xs text-slate-500">{feedback.email}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 text-center text-slate-500">
          No feedback received yet.
        </div>
      )}
    </div>
  );
};

export default ViewFeedback;
