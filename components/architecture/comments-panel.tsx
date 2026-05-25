"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, X, User, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Comment {
  id: string;
  author: string;
  authorAvatar?: string;
  content: string;
  timestamp: Date;
  replies?: Comment[];
}

interface CommentsPanelProps {
  open: boolean;
  onClose: () => void;
  architectureId: string;
}

export function CommentsPanel({
  open,
  onClose,
  architectureId,
}: CommentsPanelProps) {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "1",
      author: "Sarah Johnson",
      content:
        "Great architecture! Have you considered adding a CDN for the static assets?",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
    },
    {
      id: "2",
      author: "Michael Chen",
      content:
        "The database replication setup looks solid. What's your disaster recovery strategy?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      replies: [
        {
          id: "2-1",
          author: "You",
          content:
            "We're planning automated backups to a different region every 6 hours.",
          timestamp: new Date(Date.now() - 1000 * 60 * 60),
        },
      ],
    },
  ]);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      author: "You",
      content: newComment,
      timestamp: new Date(),
    };

    if (replyingTo) {
      setComments((prev) =>
        prev.map((c) => {
          if (c.id === replyingTo) {
            return {
              ...c,
              replies: [...(c.replies || []), comment],
            };
          }
          return c;
        })
      );
      setReplyingTo(null);
    } else {
      setComments((prev) => [comment, ...prev]);
    }

    setNewComment("");
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 shadow-2xl flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <MessageSquare className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Comments
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {comments.length} comment{comments.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Comments List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {comments.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-700 mb-3" />
                <p className="text-gray-500 dark:text-gray-500">
                  No comments yet. Start the conversation!
                </p>
              </div>
            ) : (
              comments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  onReply={() => setReplyingTo(comment.id)}
                />
              ))
            )}
          </div>

          {/* Input */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
            {replyingTo && (
              <div className="mb-3 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>
                  Replying to{" "}
                  {comments.find((c) => c.id === replyingTo)?.author}
                </span>
                <button
                  onClick={() => setReplyingTo(null)}
                  className="text-red-500 hover:text-red-600"
                >
                  Cancel
                </button>
              </div>
            )}
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              />
              <button
                type="submit"
                disabled={!newComment.trim()}
                className="px-4 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
              >
                <Send className="h-5 w-5" />
              </button>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function CommentItem({
  comment,
  onReply,
  isReply = false,
}: {
  comment: Comment;
  onReply: () => void;
  isReply?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${isReply ? "ml-8 mt-3" : ""}`}
    >
      <div className="flex gap-3">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
            {comment.author[0]}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {comment.author}
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-500">
              <Clock className="h-3 w-3" />
              {formatDistanceToNow(comment.timestamp, { addSuffix: true })}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {comment.content}
          </p>
          {!isReply && (
            <button
              onClick={onReply}
              className="text-xs text-purple-600 dark:text-purple-400 hover:underline"
            >
              Reply
            </button>
          )}
        </div>
      </div>

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-3">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onReply={onReply}
              isReply
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}
