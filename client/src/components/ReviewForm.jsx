import { useState } from "react";
import StarRating from "./StarRating";
import { API_ENDPOINTS } from "../config/api";
import { useAuth } from "../context/AuthContext";
import { useCompare } from "../context/CompareContext";

export default function ReviewForm({ partId, onReviewAdded }) {
  const { token, isAuthenticated } = useAuth();
  const { showToast } = useCompare();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!isAuthenticated) {
    return (
      <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-5 text-white/70">
        Please log in to write a review.
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!rating) {
      setError("Please select a rating.");
      showToast("Please select a rating.", "error");
      return;
    }

    if (comment.trim().length < 10) {
      setError("Comment must be at least 10 characters.");
      showToast("Comment must be at least 10 characters.", "error");
      return;
    }

    try {
      setSubmitting(true);

      const res = await fetch(API_ENDPOINTS.reviews.create, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          partId,
          rating,
          comment: comment.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to submit review");
      }

      setSuccess("Review submitted successfully!");
      showToast("Review submitted successfully!", "success");

      setRating(0);
      setComment("");

      if (onReviewAdded) {
        onReviewAdded(data.data);
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
      showToast(err.message || "Something went wrong", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-5 space-y-4"
    >
      <h3 className="text-xl font-semibold text-white">Write a Review</h3>

      <div>
        <label className="block text-sm text-white/70 mb-2">Your Rating</label>
        <StarRating value={rating} onChange={setRating} />
      </div>

      <div>
        <label className="block text-sm text-white/70 mb-2">Your Comment</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          placeholder="Share your experience with this part..."
          className="w-full rounded-xl bg-white/5 ring-1 ring-white/10 px-4 py-3 text-white outline-none focus:ring-white/25"
        />
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-200">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-2 text-sm text-green-200">
          {success}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="rounded-xl px-4 py-2 font-semibold text-slate-950
                   bg-gradient-to-r from-cyan-400 via-indigo-500 to-fuchsia-500
                   hover:opacity-95 disabled:opacity-60"
      >
        {submitting ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}