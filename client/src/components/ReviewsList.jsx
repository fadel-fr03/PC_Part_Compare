import { useEffect, useState } from "react";
import StarRating from "./StarRating";
import { API_ENDPOINTS } from "../config/api";
import { useAuth } from "../context/AuthContext";

export default function ReviewsList({
  partId,
  refreshKey = 0,
  sort = "newest",
}) {
  const { user, token, isAuthenticated } = useAuth();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editRating, setEditRating] = useState(0);
  const [editComment, setEditComment] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const fetchReviews = async () => {
      try {
        setLoading(true);
        setError("");

        const url = `${API_ENDPOINTS.reviews.byPart(
          partId
        )}?sort=${encodeURIComponent(sort)}`;

        const res = await fetch(url, { signal: controller.signal });
        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.message || "Failed to fetch reviews");
        }

        setReviews(data.data || []);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Reviews fetch error:", err);
          setError(err.message || "Something went wrong");
        }
      } finally {
        setLoading(false);
      }
    };

    if (partId) {
      fetchReviews();
    }

    return () => controller.abort();
  }, [partId, refreshKey, sort]);

  const currentUserId = user?.id || user?._id;

  const startEditing = (review) => {
    setEditingId(review._id);
    setEditRating(review.rating);
    setEditComment(review.comment);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditRating(0);
    setEditComment("");
  };

  const handleUpdate = async (reviewId) => {
    try {
      setActionLoading(true);
      setError("");

      if (!editRating) {
        throw new Error("Please select a rating.");
      }

      if (editComment.trim().length < 10) {
        throw new Error("Comment must be at least 10 characters.");
      }

      const res = await fetch(API_ENDPOINTS.reviews.update(reviewId), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          rating: editRating,
          comment: editComment.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to update review");
      }

      setReviews((prev) =>
        prev.map((review) =>
          review._id === reviewId ? data.data : review
        )
      );

      cancelEditing();
    } catch (err) {
      console.error("Update review error:", err);
      setError(err.message || "Failed to update review");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (reviewId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this review?"
    );
    if (!confirmed) return;

    try {
      setActionLoading(true);
      setError("");

      const res = await fetch(API_ENDPOINTS.reviews.delete(reviewId), {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to delete review");
      }

      setReviews((prev) => prev.filter((review) => review._id !== reviewId));
    } catch (err) {
      console.error("Delete review error:", err);
      setError(err.message || "Failed to delete review");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-5 text-white/70">
        Loading reviews...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-red-200">
        {error}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-5 text-white/70">
        No reviews yet. Be the first to review this part.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => {
        const reviewOwnerId = review.user?._id || review.user?.id;
        const isOwner =
          isAuthenticated &&
          currentUserId &&
          reviewOwnerId &&
          String(currentUserId) === String(reviewOwnerId);

        const isEditing = editingId === review._id;

        return (
          <div
            key={review._id}
            className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-5"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h4 className="text-white font-semibold">
                  {review.user?.username || "Anonymous User"}
                </h4>
                <p className="mt-1 text-xs text-white/50">
                  {new Date(review.createdAt).toLocaleString()}
                </p>
              </div>

              {!isEditing ? (
                <StarRating value={review.rating} readOnly />
              ) : (
                <StarRating value={editRating} onChange={setEditRating} />
              )}
            </div>

            {!isEditing ? (
              <p className="mt-4 text-sm text-white/75 leading-relaxed">
                {review.comment}
              </p>
            ) : (
              <div className="mt-4 space-y-3">
                <textarea
                  value={editComment}
                  onChange={(e) => setEditComment(e.target.value)}
                  rows={4}
                  className="w-full rounded-xl bg-white/5 ring-1 ring-white/10 px-4 py-3 text-white outline-none focus:ring-white/25"
                />
              </div>
            )}

            {isOwner && (
              <div className="mt-4 flex flex-wrap gap-2">
                {!isEditing ? (
                  <>
                    <button
                      type="button"
                      onClick={() => startEditing(review)}
                      className="rounded-xl px-4 py-2 text-sm font-semibold bg-white/10 text-white ring-1 ring-white/15 hover:bg-white/15"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(review._id)}
                      disabled={actionLoading}
                      className="rounded-xl px-4 py-2 text-sm font-semibold bg-red-500/15 text-red-200 ring-1 ring-red-500/20 hover:bg-red-500/25 disabled:opacity-60"
                    >
                      {actionLoading ? "Deleting..." : "Delete"}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => handleUpdate(review._id)}
                      disabled={actionLoading}
                      className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 via-indigo-500 to-fuchsia-500 hover:opacity-95 disabled:opacity-60"
                    >
                      {actionLoading ? "Saving..." : "Save Changes"}
                    </button>

                    <button
                      type="button"
                      onClick={cancelEditing}
                      className="rounded-xl px-4 py-2 text-sm font-semibold bg-white/10 text-white ring-1 ring-white/15 hover:bg-white/15"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}