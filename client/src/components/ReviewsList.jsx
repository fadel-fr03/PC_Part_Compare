import { useEffect, useState } from "react";
import StarRating from "./StarRating";
import { API_ENDPOINTS } from "../config/api";
import { useAuth } from "../context/AuthContext";

export default function ReviewsList({
  partId,
  refreshKey = 0,
  sort = "newest",
  showOnlyMine = false,
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

        // Dashboard mode: only my reviews
        if (showOnlyMine) {
          if (!isAuthenticated || !user) {
            setReviews([]);
            return;
          }

          const partsRes = await fetch(API_ENDPOINTS.parts.list, {
            signal: controller.signal,
          });
          const partsData = await partsRes.json();

          if (!partsRes.ok || !partsData.success) {
            throw new Error(partsData.message || "Failed to fetch parts");
          }

          const parts = partsData.data || [];
          const currentUserId = user.id || user._id;

          const reviewRequests = parts.map(async (part) => {
            const res = await fetch(
              `${API_ENDPOINTS.reviews.byPart(part._id)}?sort=newest`,
              {
                signal: controller.signal,
              }
            );
            const data = await res.json();

            if (!res.ok || !data.success) {
              return [];
            }

            return (data.data || [])
              .filter((review) => {
                const reviewUserId = review.user?._id || review.user?.id;
                return String(reviewUserId) === String(currentUserId);
              })
              .map((review) => ({
                ...review,
                partName: part.name,
                partId: part._id,
              }));
          });

          const nestedReviews = await Promise.all(reviewRequests);
          const myReviews = nestedReviews.flat();

          myReviews.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );

          setReviews(myReviews);
          return;
        }

        // PartDetail mode: reviews for one part
        if (!partId) {
          setReviews([]);
          return;
        }

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
          console.error("ReviewsList error:", err);
          setError(err.message || "Something went wrong");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();

    return () => controller.abort();
  }, [partId, refreshKey, sort, showOnlyMine, user, isAuthenticated]);

  const currentUserId = user?.id || user?._id;

  const startEditing = (review) => {
    setError("");
    setEditingId(review._id);
    setEditRating(review.rating);
    setEditComment(review.comment);
  };

  const cancelEditing = () => {
    setError("");
    setEditingId(null);
    setEditRating(0);
    setEditComment("");
    setActionLoading(false);
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
          review._id === reviewId
            ? {
                ...review,
                ...data.data,
                partName: review.partName,
                partId: review.partId,
              }
            : review
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

  if (!isAuthenticated && showOnlyMine) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-white/70">
        Please log in to view your reviews.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-white/70">
        Loading reviews...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-red-200">
          {error}
        </div>
      )}

      {reviews.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-white/70">
          {showOnlyMine
            ? "You have not written any reviews yet."
            : "No reviews yet. Be the first to review this part."}
        </div>
      ) : (
        reviews.map((review) => {
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
              className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5 shadow-[0_0_25px_rgba(15,23,42,0.18)]"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h4 className="text-white font-semibold">
                    {showOnlyMine
                      ? review.partName || "Part"
                      : review.user?.username || "Anonymous User"}
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
                <p className="mt-4 text-sm leading-relaxed text-white/75">
                  {review.comment}
                </p>
              ) : (
                <div className="mt-4 space-y-3">
                  <textarea
                    value={editComment}
                    onChange={(e) => {
                      setEditComment(e.target.value);
                      if (error) setError("");
                    }}
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
        })
      )}
    </div>
  );
}