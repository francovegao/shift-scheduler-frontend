"use client";

import { useEffect, useState } from "react";
import {
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  PlusIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import { fetchPharmacistComments } from "@/app/lib/data";
import {
  createPharmacistComment,
  updatePharmacistComment,
  deletePharmacistComment,
} from "@/app/lib/actions";
import { formatInTimeZone } from "date-fns-tz";
import { toast } from "react-toastify";

interface PharmacistComment {
  id: string;
  pharmacistId: string;
  authorId: string;
  comment: string;
  companyId: string | null;
  locationId: string | null;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    role: string | null;
  };
}

interface PharmacistCommentsProps {
  pharmacistId: string;
  token: string;
  userRole: string;
  userId: string;
}

export default function PharmacistComments({
  pharmacistId,
  token,
  userRole,
  userId,
}: PharmacistCommentsProps) {
  const [open, setOpen] = useState(false);
  const [comments, setComments] = useState<PharmacistComment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingComment, setEditingComment] =
    useState<PharmacistComment | null>(null);
  const [commentText, setCommentText] = useState("");
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 5;

  const canCreateComment =
    userRole === "admin" ||
    userRole === "pharmacy_manager" ||
    userRole === "location_manager";

  const fetchComments = async () => {
    setIsLoading(true);
    try {
      const response = await fetchPharmacistComments(
        pharmacistId,
        token,
        currentPage,
        itemsPerPage,
      );
      if (response && response.data) {
        setComments(response.data);
        setTotalItems(response.meta?.totalItems || 0);
        setTotalPages(response.meta?.totalPages || 1);
      }
    } catch (err) {
      console.error("Failed to fetch comments:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [pharmacistId, token, currentPage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setIsSubmitting(true);
    setError("");

    try {
      if (editingComment) {
        const result = await updatePharmacistComment(
          token,
          { success: false, error: false },
          {
            id: editingComment.id,
            comment: commentText,
          },
        );
        if (result?.success) {
          toast(`Comment has been updated!`, { toastId: "unique-toast" });
          setEditingComment(null);
          setCommentText("");
          fetchComments();
        } else {
          setError("Failed to update comment");
        }
      } else {
        const result = await createPharmacistComment(
          token,
          { success: false, error: false },
          {
            pharmacistId,
            comment: commentText,
          },
        );
        if (result?.success) {
          toast(`Comment has been created!`, { toastId: "unique-toast" });
          setShowForm(false);
          setCommentText("");
          fetchComments();
        } else {
          setError("Failed to create comment");
        }
      }
    } catch (err) {
      console.error("Error:", err);
      setError("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (comment: PharmacistComment) => {
    setEditingComment(comment);
    setCommentText(comment.comment);
    setShowForm(true);
  };

  const handleDelete = async (commentId: string) => {
    try {
      const result = await deletePharmacistComment(
        token,
        { success: false, error: false },
        commentId,
      );
      if (result?.success) {
        toast(`Comment has been deleted!`, { toastId: "unique-toast" });
        fetchComments();
        setOpen(false);
      } else {
        toast(`Failed to delete comment!`, { toastId: "unique-toast" });
      }
    } catch (err) {
      console.error("Error:", err);
      toast(`An error occurred!`, { toastId: "unique-toast" });
    }
  };

  const canEditComment = (comment: PharmacistComment) => {
    return comment.authorId === userId;
  };

  const canDeleteComment = (comment: PharmacistComment) => {
    return comment.authorId === userId || userRole === "admin";
  };

  const formatDate = (dateString: string) => {
    return formatInTimeZone(
      new Date(dateString),
      "America/Edmonton",
      "MMM d, yyyy",
    );
  };

  if (isLoading) {
    return (
      <div className="bg-surface p-4 rounded-md">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface p-4 rounded-md">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Pharmacist Notes</h1>
        {canCreateComment && (
          <button
            onClick={() => {
              setEditingComment(null);
              setCommentText("");
              setShowForm(true);
            }}
            className="flex items-center gap-2 px-3 py-1.5 bg-primary text-white text-sm rounded-md hover:bg-primary/90 transition-colors"
          >
            <PlusIcon className="w-4 h-4" />
            Add Comment
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-4 p-4 rounded-md border">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder={
              editingComment
                ? "Edit your comment..."
                : "Write a comment about this pharmacist..."
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            rows={3}
            required
          />
          <div className="flex justify-end gap-2 mt-3">
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingComment(null);
                setCommentText("");
              }}
              className="bg-complementary-one text-white p-2 rounded-md hover:bg-complementary-one-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !commentText.trim()}
              className="p-2 bg-primary text-white text-sm rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? "Saving..."
                : editingComment
                  ? "Update"
                  : "Add Comment"}
            </button>
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </form>
      )}

      {comments.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No comments yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="border border-gray-200 rounded-md p-4 bg-white"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-gray-900">
                      {comment.author.firstName} {comment.author.lastName}
                    </span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                      {comment.author.role?.replace("_", " ") || "Unknown"}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {comment.comment}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {canEditComment(comment) && (
                    <button
                      onClick={() => handleEdit(comment)}
                      className="p-1.5 text-gray-500 hover:text-primary hover:bg-gray-100 rounded transition-colors"
                      title="Edit comment"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                  )}
                  {canDeleteComment(comment) && (
                    <button
                      onClick={() => setOpen(true)}
                      className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-gray-100 rounded transition-colors"
                      title="Delete comment"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
              {open && (
                <div className="w-screen h-screen fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center overflow-hidden">
                  <div className="bg-surface p-8 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%] max-h-[calc(100dvh-40px)] overflow-y-auto flex flex-col gap-4 items-center">
                    <span className="text-center font-medium">
                      Are you sure you want to delete this comment?
                    </span>
                    <span className="text-center font-medium">
                      This action cannot be undone!
                    </span>
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="bg-complementary-one text-white p-2 rounded-md hover:bg-complementary-one-100 cursor-pointer"
                    >
                      Delete
                    </button>
                    <div
                      className="absolute top-4 right-4 cursor-pointer text-foreground"
                      onClick={() => setOpen(false)}
                    >
                      <XMarkIcon className="w-6" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeftIcon className="w-4" />
              </button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages} ({totalItems} total)
              </span>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowRightIcon className="w-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
