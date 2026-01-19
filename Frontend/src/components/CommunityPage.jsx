import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase/firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  arrayUnion,
  arrayRemove,
  where,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import "./CommunityPage.css";

function CommunityPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedTopics, setSelectedTopics] = useState([]);
  const [openPostModal, setOpenPostModal] = useState(false);
  const [openYourPostsModal, setOpenYourPostsModal] = useState(false);
  const { currentUser } = useAuth() || { currentUser: null };

  const [topics] = useState([
    "All Topics",
    "Indoor Plants",
    "Outdoor Plants",
    "Cross Breeding",
    "Gardening",
    "Expert AMA",
    "Fruits",
    "Vegetables",
  ]);

  const [newComment, setNewComment] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostTopic, setNewPostTopic] = useState("indoor-plants");

  const [expandedCommentSections, setExpandedCommentSections] = useState({});
  const [commentReplyText, setCommentReplyText] = useState({});
  const [replyingTo, setReplyingTo] = useState({});

  const [userPosts, setUserPosts] = useState([]);
  const [userPostsLoading, setUserPostsLoading] = useState(false);

  // Toggle comments visibility for a specific post
  const toggleComments = (postId) => {
    setExpandedCommentSections((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  // Function to handle topic selection
  const handleTopicSelect = (topic) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  // Fetch posts from Firestore
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const postsRef = collection(db, "forum_posts");
        let q = query(postsRef, orderBy("timestamp", "desc"));

        // Filter by selected topics
        if (
          selectedTopics.length > 0 &&
          !selectedTopics.includes("All Topics")
        ) {
          const topicNames = selectedTopics.map((topic) =>
            topic.toLowerCase().replace(" ", "-")
          );
          q = query(
            postsRef,
            where("topic", "in", topicNames),
            orderBy("timestamp", "desc")
          );
        }

        const querySnapshot = await getDocs(q);

        // Get all post IDs first
        const postIds = querySnapshot.docs.map((doc) => doc.id);

        // Fetch all comments in one query instead of per-post
        const commentsRef = collection(db, "forum_comments");
        const commentsQuery = query(
          commentsRef,
          where("postId", "in", postIds.length > 0 ? postIds : ["dummy"]),
          orderBy("timestamp", "asc")
        );
        const commentsSnapshot = await getDocs(commentsQuery);

        // Group comments by postId for efficient lookup
        const commentsByPostId = {};
        commentsSnapshot.docs.forEach((commentDoc) => {
          const commentData = commentDoc.data();
          const postId = commentData.postId;

          if (!commentsByPostId[postId]) {
            commentsByPostId[postId] = [];
          }

          // Handle timestamp properly
          let commentTimestamp = "Unknown";
          if (commentData.timestamp) {
            if (typeof commentData.timestamp.toDate === "function") {
              commentTimestamp = commentData.timestamp
                .toDate()
                .toLocaleString();
            } else if (commentData.timestamp instanceof Date) {
              commentTimestamp = commentData.timestamp.toLocaleString();
            } else if (typeof commentData.timestamp === "string") {
              commentTimestamp = new Date(
                commentData.timestamp
              ).toLocaleString();
            }
          }

          commentsByPostId[postId].push({
            id: commentDoc.id,
            author: commentData.author,
            content: commentData.content,
            timestamp: commentTimestamp,
            likes: commentData.likes || 0,
            likedBy: commentData.likedBy || [],
            isReply: commentData.isReply || false,
            parentCommentId: commentData.parentCommentId,
          });
        });

        // Build posts array
        const fetchedPosts = querySnapshot.docs.map((docSnapshot) => {
          const postData = docSnapshot.data();

          // Handle timestamp properly
          let timestamp = "Unknown date";
          if (postData.timestamp) {
            if (typeof postData.timestamp.toDate === "function") {
              timestamp = postData.timestamp.toDate().toLocaleString();
            } else if (postData.timestamp instanceof Date) {
              timestamp = postData.timestamp.toLocaleString();
            } else if (typeof postData.timestamp === "string") {
              timestamp = new Date(postData.timestamp).toLocaleString();
            }
          }

          // Get comments for this post from the grouped comments
          const comments = commentsByPostId[docSnapshot.id] || [];

          // Check if current user has liked or disliked the post
          const userLiked = postData.likedBy?.includes(currentUser?.uid);
          const userDisliked = postData.dislikedBy?.includes(currentUser?.uid);

          return {
            id: docSnapshot.id,
            title: postData.title,
            author: postData.authorName,
            authorId: postData.authorId,
            content: postData.content,
            timestamp,
            topic: postData.topic,
            likes: postData.likes || 0,
            dislikes: postData.dislikes || 0,
            comments,
            isExpertAMA: postData.topic === "expert-ama",
            userLiked,
            userDisliked,
            isRepost: postData.isRepost || false,
            originalAuthor: postData.originalAuthor,
          };
        });

        setPosts(fetchedPosts);
        setError(null);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError(`Failed to load posts: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [currentUser, selectedTopics]);

  const fetchUserPosts = async () => {
    if (!currentUser) {
      alert("Please sign in to view your posts");
      return;
    }

    try {
      setUserPostsLoading(true);

      // Query posts created by the user or reposted by the user
      const postsRef = collection(db, "forum_posts");
      const userQuery = query(
        postsRef,
        where("authorId", "==", currentUser.uid),
        orderBy("timestamp", "desc")
      );

      const querySnapshot = await getDocs(userQuery);

      const fetchedUserPosts = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          timestamp: data.timestamp?.toDate
            ? data.timestamp.toDate().toLocaleString()
            : "Unknown date",
        };
      });

      setUserPosts(fetchedUserPosts);
      setOpenYourPostsModal(true);
    } catch (err) {
      console.error("Error fetching user posts:", err);
      alert("Failed to load your posts. Please try again.");
    } finally {
      setUserPostsLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleLike = async (postId) => {
    if (!currentUser) {
      alert("Please sign in to like posts.");
      return;
    }

    try {
      const postRef = doc(db, "forum_posts", postId);
      const userId = currentUser.uid;
      const postIndex = posts.findIndex((post) => post.id === postId);
      const post = posts[postIndex];

      // Create a copy of posts for immutable update
      const updatedPosts = [...posts];

      if (post.userLiked) {
        // User is unliking the post
        updatedPosts[postIndex] = {
          ...post,
          likes: post.likes - 1,
          userLiked: false,
        };

        // Update Firestore
        await updateDoc(postRef, {
          likes: post.likes - 1,
          likedBy: arrayRemove(userId),
        });
      } else {
        // User is liking the post
        let dislikeChange = 0;

        // If user previously disliked, remove the dislike
        if (post.userDisliked) {
          dislikeChange = -1;
          await updateDoc(postRef, {
            dislikedBy: arrayRemove(userId),
          });
        }

        updatedPosts[postIndex] = {
          ...post,
          likes: post.likes + 1,
          dislikes: post.dislikes + dislikeChange,
          userLiked: true,
          userDisliked: false,
        };

        // Update Firestore
        await updateDoc(postRef, {
          likes: post.likes + 1,
          dislikes: post.dislikes + dislikeChange,
          likedBy: arrayUnion(userId),
        });
      }

      setPosts(updatedPosts);
    } catch (err) {
      console.error("Error updating like:", err);
      alert("Failed to update like. Please try again.");
    }
  };

  const handleDislike = async (postId) => {
    if (!currentUser) {
      alert("Please sign in to dislike posts.");
      return;
    }

    try {
      const postRef = doc(db, "forum_posts", postId);
      const userId = currentUser.uid;
      const postIndex = posts.findIndex((post) => post.id === postId);
      const post = posts[postIndex];

      // Create a copy of posts for immutable update
      const updatedPosts = [...posts];

      if (post.userDisliked) {
        // User is removing dislike
        updatedPosts[postIndex] = {
          ...post,
          dislikes: post.dislikes - 1,
          userDisliked: false,
        };

        // Update Firestore
        await updateDoc(postRef, {
          dislikes: post.dislikes - 1,
          dislikedBy: arrayRemove(userId),
        });
      } else {
        // User is disliking the post
        let likeChange = 0;

        // If user previously liked, remove the like
        if (post.userLiked) {
          likeChange = -1;
          await updateDoc(postRef, {
            likedBy: arrayRemove(userId),
          });
        }

        updatedPosts[postIndex] = {
          ...post,
          dislikes: post.dislikes + 1,
          likes: post.likes + likeChange,
          userDisliked: true,
          userLiked: false,
        };

        // Update Firestore
        await updateDoc(postRef, {
          dislikes: post.dislikes + 1,
          likes: post.likes + likeChange,
          dislikedBy: arrayUnion(userId),
        });
      }

      setPosts(updatedPosts);
    } catch (err) {
      console.error("Error updating dislike:", err);
      alert("Failed to update dislike. Please try again.");
    }
  };

  const handleCommentSubmit = async (postId) => {
    if (!currentUser) {
      alert("Please sign in to comment.");
      return;
    }

    if (!newComment.trim()) return;

    try {
      const commentData = {
        postId,
        authorId: currentUser.uid,
        author:
          currentUser.displayName || currentUser.email || "Anonymous User",
        content: newComment,
        likes: 0,
        likedBy: [],
        timestamp: serverTimestamp(),
      };

      // Add comment to Firestore
      const commentsRef = collection(db, "forum_comments");
      const docRef = await addDoc(commentsRef, commentData);

      // Format timestamp for display
      const newCommentObj = {
        id: docRef.id,
        ...commentData,
        timestamp: new Date().toLocaleString(),
      };

      // Update local state
      setPosts(
        posts.map((post) => {
          if (post.id === postId) {
            return { ...post, comments: [...post.comments, newCommentObj] };
          }
          return post;
        })
      );

      // Update comment count in the post document
      const postRef = doc(db, "forum_posts", postId);
      await updateDoc(postRef, {
        commentCount: posts.find((p) => p.id === postId).comments.length + 1,
      });

      setNewComment("");
    } catch (err) {
      console.error("Error adding comment:", err);
      alert("Failed to add comment. Please try again.");
    }
  };

  const handleRepost = async (postId) => {
    if (!currentUser) {
      alert("Please sign in to repost.");
      return;
    }

    const postToRepost = posts.find((post) => post.id === postId);
    if (!postToRepost) return;

    try {
      const username =
        currentUser.displayName || currentUser.email || "Anonymous User";

      // Check if the content already has a "Reposted from @" prefix and remove it
      let cleanContent = postToRepost.content;
      const repostPattern = /^Reposted from @[^:]+:\s*/;
      if (repostPattern.test(cleanContent)) {
        cleanContent = cleanContent.replace(repostPattern, "");
      }

      const repostData = {
        topic: postToRepost.topic,
        title: postToRepost.title,
        authorId: currentUser.uid,
        authorName: username,
        content: cleanContent,
        likes: 0,
        dislikes: 0,
        likedBy: [],
        dislikedBy: [],
        commentCount: 0,
        timestamp: serverTimestamp(),
        isRepost: true,
        originalAuthor: postToRepost.author,
        originalPostId: postId,
      };

      // Add repost to Firestore
      const postsRef = collection(db, "forum_posts");
      const docRef = await addDoc(postsRef, repostData);

      // Add to local state
      const newPost = {
        ...repostData,
        id: docRef.id,
        author: username,
        timestamp: new Date().toLocaleString(),
        comments: [],
        userLiked: false,
        userDisliked: false,
      };

      setPosts([newPost, ...posts]);

      // Optionally, update repost count on the original post
      const origPostRef = doc(db, "forum_posts", postId);
      await updateDoc(origPostRef, {
        repostCount: (postToRepost.repostCount || 0) + 1,
      });

      alert("Post was successfully reposted!");
    } catch (err) {
      console.error("Error creating repost:", err);
      alert("Failed to create repost. Please try again.");
    }
  };

  const handleOpenPostModal = () => {
    if (!currentUser) {
      alert("Please sign in to create a post.");
      return;
    }
    setOpenPostModal(true);
  };

  const handleClosePostModal = () => {
    setOpenPostModal(false);
    // Clear form data when closing modal
    setNewPostContent("");
    setNewPostTopic("indoor-plants");
  };

  const clearAllPosts = async () => {
    if (
      !currentUser ||
      !currentUser.email ||
      !currentUser.email.endsWith("admin.com")
    ) {
      alert("You don't have permission to perform this action");
      return;
    }

    if (
      window.confirm(
        "Are you sure you want to clear all posts? This cannot be undone."
      )
    ) {
      try {
        setLoading(true);

        // Get all posts
        const postsRef = collection(db, "forum_posts");
        const postsSnapshot = await getDocs(postsRef);

        // Get all comments
        const commentsRef = collection(db, "forum_comments");
        const commentsSnapshot = await getDocs(commentsRef);

        // Delete all posts
        const postDeletions = postsSnapshot.docs.map((doc) =>
          deleteDoc(doc.ref)
        );

        // Delete all comments
        const commentDeletions = commentsSnapshot.docs.map((doc) =>
          deleteDoc(doc.ref)
        );

        // Wait for all deletions to complete
        await Promise.all([...postDeletions, ...commentDeletions]);

        setPosts([]);
        alert("All posts cleared successfully!");
      } catch (error) {
        console.error("Error clearing posts:", error);
        alert("Error clearing posts: " + error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmitNewPost = async () => {
    if (!currentUser) {
      alert("Please sign in to create a post.");
      return;
    }

    if (newPostContent.trim() === "") return;

    try {
      const username =
        currentUser.displayName || currentUser.email || "Anonymous User";

      const newPostData = {
        topic: newPostTopic,
        authorId: currentUser.uid,
        authorName: username,
        content: newPostContent,
        likes: 0,
        dislikes: 0,
        likedBy: [],
        dislikedBy: [],
        commentCount: 0,
        timestamp: serverTimestamp(),
        isExpertAMA: newPostTopic === "expert-ama",
      };

      // Add post to Firestore
      const postsRef = collection(db, "forum_posts");
      const docRef = await addDoc(postsRef, newPostData);

      // Add to local state with properly formatted timestamp
      const savedPost = {
        ...newPostData,
        id: docRef.id,
        author: username,
        timestamp: new Date().toLocaleString(),
        comments: [],
        userLiked: false,
        userDisliked: false,
      };

      setPosts([savedPost, ...posts]);

      setNewPostContent("");
      setNewPostTopic("indoor-plants");
      handleClosePostModal();
    } catch (err) {
      console.error("Error creating post:", err);
      alert("Failed to create post. Please try again.");
    }
  };

  const handleCommentLike = async (postId, commentId) => {
    if (!currentUser) {
      alert("Please sign in to like comments.");
      return;
    }

    try {
      const commentRef = doc(db, "forum_comments", commentId);
      const userId = currentUser.uid;

      // Find the post and comment
      const postIndex = posts.findIndex((post) => post.id === postId);
      if (postIndex === -1) return;

      const post = posts[postIndex];
      const commentIndex = post.comments.findIndex((c) => c.id === commentId);
      if (commentIndex === -1) return;

      const comment = post.comments[commentIndex];

      // Check if user already liked the comment
      const userLiked = comment.likedBy?.includes(userId);

      // Create updated posts array
      const updatedPosts = [...posts];
      const updatedComments = [...post.comments];

      if (userLiked) {
        // Unlike the comment
        updatedComments[commentIndex] = {
          ...comment,
          likes: Math.max(0, comment.likes - 1),
          likedBy: comment.likedBy.filter((id) => id !== userId),
        };

        // Update firestore
        await updateDoc(commentRef, {
          likes: Math.max(0, comment.likes - 1),
          likedBy: arrayRemove(userId),
        });
      } else {
        // Like the comment
        updatedComments[commentIndex] = {
          ...comment,
          likes: (comment.likes || 0) + 1,
          likedBy: [...(comment.likedBy || []), userId],
        };

        // Update firestore
        await updateDoc(commentRef, {
          likes: (comment.likes || 0) + 1,
          likedBy: arrayUnion(userId),
        });
      }

      // Update the post with new comments
      updatedPosts[postIndex] = {
        ...post,
        comments: updatedComments,
      };

      // Update state
      setPosts(updatedPosts);
    } catch (err) {
      console.error("Error liking comment:", err);
      alert("Failed to like comment. Please try again.");
    }
  };

  const toggleReplyToComment = (postId, commentId) => {
    setReplyingTo((prev) => ({
      ...prev,
      [`${postId}-${commentId}`]: !prev[`${postId}-${commentId}`],
    }));
    // Clear reply text if closing
    if (replyingTo[`${postId}-${commentId}`]) {
      setCommentReplyText((prev) => ({
        ...prev,
        [`${postId}-${commentId}`]: "",
      }));
    }
  };

  const handleCommentReplySubmit = async (postId, parentCommentId) => {
    if (!currentUser) {
      alert("Please sign in to reply.");
      return;
    }

    const replyKey = `${postId}-${parentCommentId}`;
    const replyText = commentReplyText[replyKey]?.trim();

    if (!replyText) return;

    try {
      const username =
        currentUser.displayName || currentUser.email || "Anonymous User";

      const replyData = {
        postId,
        authorId: currentUser.uid,
        author: username,
        content: replyText,
        likes: 0,
        likedBy: [],
        timestamp: serverTimestamp(),
        isReply: true,
        parentCommentId: parentCommentId,
      };

      // Add reply to Firestore as a comment
      const commentsRef = collection(db, "forum_comments");
      const docRef = await addDoc(commentsRef, replyData);

      // Format timestamp for display
      const newReply = {
        id: docRef.id,
        ...replyData,
        timestamp: new Date().toLocaleString(),
      };

      // Update local state
      setPosts(
        posts.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              comments: [...post.comments, newReply],
            };
          }
          return post;
        })
      );

      // Update comment count in the post document
      const postRef = doc(db, "forum_posts", postId);
      await updateDoc(postRef, {
        commentCount: posts.find((p) => p.id === postId).comments.length + 1,
      });

      // Reset reply state
      setCommentReplyText((prev) => ({
        ...prev,
        [replyKey]: "",
      }));
      setReplyingTo((prev) => ({
        ...prev,
        [replyKey]: false,
      }));
    } catch (err) {
      console.error("Error adding reply:", err);
      alert("Failed to add reply. Please try again.");
    }
  };

  const handleDeletePost = async (postId, isRepost) => {
    if (!currentUser) return;

    if (
      window.confirm(
        "Are you sure you want to delete this post? This cannot be undone."
      )
    ) {
      try {
        // Get reference to the post
        const postRef = doc(db, "forum_posts", postId);

        // Delete post from Firestore
        await deleteDoc(postRef);

        // Update local state (both userPosts and main posts list)
        setUserPosts(userPosts.filter((post) => post.id !== postId));
        setPosts(posts.filter((post) => post.id !== postId));

        // If it was a repost, no need to delete comments
        if (!isRepost) {
          // Get all comments for this post
          const commentsRef = collection(db, "forum_comments");
          const commentsQuery = query(
            commentsRef,
            where("postId", "==", postId)
          );
          const commentsSnapshot = await getDocs(commentsQuery);

          // Delete all comments
          const commentDeletions = commentsSnapshot.docs.map((doc) =>
            deleteDoc(doc.ref)
          );

          await Promise.all(commentDeletions);
        }

        alert("Post deleted successfully!");
      } catch (err) {
        console.error("Error deleting post:", err);
        alert("Failed to delete post. Please try again.");
      }
    }
  };

  const filteredPosts =
    selectedTopics.length === 0 || selectedTopics.includes("All Topics")
      ? posts
      : posts.filter((post) => {
          const topicName = selectedTopics.map((topic) =>
            topic.toLowerCase().replace(" ", "-")
          );
          return topicName.includes(post.topic);
        });

  return (
    <div className="community-container">
      <div className="community-header">
        <h1 className="community-title">Community Forum</h1>
        <div className="header-buttons">
          <button className="secondary-button" onClick={fetchUserPosts}>
            Your Posts
          </button>
          <button className="post-button" onClick={handleOpenPostModal}>
            What's on your mind?
          </button>
        </div>
      </div>

      {/* Topic Tabs */}
      <div className="topics-tabs">
        {topics.map((topic, index) => (
          <button
            key={index}
            className={`topic-tab ${
              selectedTopics.includes(topic) ? "active" : ""
            }`}
            onClick={() => handleTopicSelect(topic)}
          >
            {topic}
          </button>
        ))}
      </div>

      {/* Your Posts Modal */}
      {openYourPostsModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Your Posts</h3>
              <button
                className="close-button"
                onClick={() => setOpenYourPostsModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              {userPostsLoading ? (
                <div className="loading">
                  <div className="loading-spinner"></div>
                  <p>Loading your posts...</p>
                </div>
              ) : userPosts.length === 0 ? (
                <div className="empty-state small">
                  <p>You haven't created any posts yet.</p>
                </div>
              ) : (
                <div className="user-posts-list">
                  {userPosts.map((post) => (
                    <div className="user-post-item" key={post.id}>
                      <div className="user-post-content">
                        <span className="user-post-topic">
                          {post.topic.replace("-", " ")}
                        </span>
                        <p className="user-post-text">
                          {post.content.substring(0, 100)}
                          {post.content.length > 100 ? "..." : ""}
                        </p>
                        <span className="user-post-time">{post.timestamp}</span>
                      </div>
                      <div className="user-post-actions">
                        <button
                          className="button danger small"
                          onClick={() =>
                            handleDeletePost(post.id, post.isRepost)
                          }
                        >
                          {post.isRepost ? "Remove" : "Delete"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create Post Modal */}
      {openPostModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Create a New Post</h3>
              <button className="close-button" onClick={handleClosePostModal}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="topic-select">Topic</label>
                <select
                  id="topic-select"
                  value={newPostTopic}
                  onChange={(e) => setNewPostTopic(e.target.value)}
                  className="form-control"
                >
                  <option value="indoor-plants">Indoor Plants</option>
                  <option value="outdoor-plants">Outdoor Plants</option>
                  <option value="cross-breeding">Cross Breeding</option>
                  <option value="gardening">Gardening</option>
                  <option value="expert-ama">Expert AMA</option>
                  <option value="fruits">Fruits</option>
                  <option value="vegetables">Vegetables</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="post-content">Content</label>
                <textarea
                  id="post-content"
                  className="form-control"
                  rows={6}
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="Share your thoughts, questions, or plant care tips..."
                ></textarea>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="button secondary"
                onClick={handleClosePostModal}
              >
                Cancel
              </button>
              <button
                className="button primary"
                onClick={handleSubmitNewPost}
                disabled={!newPostContent} // Only check for content now
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Show loading state */}
      {loading && (
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      )}

      {/* Show error message if any */}
      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button className="button" onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      )}

      {/* Remove the offline mode message and replace with connected status */}
      <div className="notice-card success">
        <h3>Community Forum</h3>
        <p>
          You are now connected to the live community forum. Post, comment, and
          interact with other plant enthusiasts!
        </p>
      </div>

      {/* Posts List */}
      <div className="posts-container">
        {!loading && filteredPosts.length === 0 ? (
          <div className="empty-state">
            <h3>No posts in this topic yet</h3>
            <p>Be the first to start a conversation!</p>
            <button className="button primary" onClick={handleOpenPostModal}>
              Create Post
            </button>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <div className="post-card" key={post.id}>
              <div className="post-header">
                <div className="user-info">
                  <div className="post-meta">
                    <span className="author-name">
                      {post.author || "Unknown User"}
                    </span>
                    <span className="timestamp">{post.timestamp}</span>
                    <span className="inline-topic-tag">
                      {post.topic.replace("-", " ")}
                    </span>
                  </div>
                </div>
                <div className="post-header-right">
                  {post.isExpertAMA && (
                    <span className="expert-badge">Expert</span>
                  )}
                  {post.isRepost && (
                    <span className="repost-badge">
                      Reposted from {post.originalAuthor}
                    </span>
                  )}
                </div>
              </div>

              {/* Remove post title */}
              <p className="post-content">{post.content}</p>

              <div className="post-actions">
                <button
                  className={`action-button ${post.userLiked ? "liked" : ""}`}
                  onClick={() => handleLike(post.id)}
                >
                  <i className="fas fa-thumbs-up"></i>{" "}
                  <span className="action-count">{post.likes}</span>
                </button>
                <button
                  className={`action-button ${
                    post.userDisliked ? "disliked" : ""
                  }`}
                  onClick={() => handleDislike(post.id)}
                >
                  <i className="fas fa-thumbs-down"></i>{" "}
                  <span className="action-count">{post.dislikes}</span>
                </button>
                <button
                  className="action-button"
                  onClick={() => toggleComments(post.id)}
                >
                  <i className="fas fa-comment"></i>{" "}
                  <span className="action-count">
                    {post.comments.length > 0 ? post.comments.length : ""}
                  </span>
                </button>
                <button
                  className="action-button"
                  onClick={() => handleRepost(post.id)}
                >
                  <i className="fas fa-share"></i> Share
                </button>
              </div>

              {/* Only show comments section if expanded */}
              {expandedCommentSections[post.id] && (
                <div className="comments-section">
                  <h4 className="comments-title">Comments</h4>
                  {post.comments.length === 0 && (
                    <p className="no-comments">No comments yet</p>
                  )}

                  {post.comments
                    // Show parent comments first, then their replies
                    .filter((comment) => !comment.isReply)
                    .map((comment) => (
                      <div className="comment-thread" key={comment.id}>
                        <div className="comment">
                          <div className="comment-header">
                            <span className="comment-author">
                              {comment.author}
                            </span>
                            <div className="comment-likes">
                              <button
                                className={`like-button ${
                                  comment.likedBy?.includes(currentUser?.uid)
                                    ? "liked"
                                    : ""
                                }`}
                                onClick={() =>
                                  handleCommentLike(post.id, comment.id)
                                }
                              >
                                <i className="fas fa-thumbs-up"></i>
                              </button>
                              <span>{comment.likes}</span>
                            </div>
                          </div>
                          <div className="comment-content">
                            {comment.content}
                          </div>
                          <div className="comment-actions">
                            <button
                              className="reply-button"
                              onClick={() =>
                                toggleReplyToComment(post.id, comment.id)
                              }
                            >
                              Reply
                            </button>
                          </div>

                          {/* Comment reply form */}
                          {replyingTo[`${post.id}-${comment.id}`] && (
                            <div className="comment-reply-form">
                              <input
                                type="text"
                                placeholder="Write a reply..."
                                value={
                                  commentReplyText[
                                    `${post.id}-${comment.id}`
                                  ] || ""
                                }
                                onChange={(e) =>
                                  setCommentReplyText((prev) => ({
                                    ...prev,
                                    [`${post.id}-${comment.id}`]:
                                      e.target.value,
                                  }))
                                }
                                className="comment-input reply-input"
                              />
                              <button
                                className="comment-button"
                                onClick={() =>
                                  handleCommentReplySubmit(post.id, comment.id)
                                }
                              >
                                Reply
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Show replies to this comment */}
                        {post.comments
                          .filter(
                            (reply) =>
                              reply.isReply &&
                              reply.parentCommentId === comment.id
                          )
                          .map((reply) => (
                            <div className="comment reply" key={reply.id}>
                              <div className="comment-header">
                                <span className="comment-author">
                                  {reply.author}
                                </span>
                                <div className="comment-likes">
                                  <button
                                    className={`like-button ${
                                      reply.likedBy?.includes(currentUser?.uid)
                                        ? "liked"
                                        : ""
                                    }`}
                                    onClick={() =>
                                      handleCommentLike(post.id, reply.id)
                                    }
                                  >
                                    <i className="fas fa-thumbs-up"></i>
                                  </button>
                                  <span>{reply.likes}</span>
                                </div>
                              </div>
                              <div className="comment-content">
                                {reply.content}
                              </div>
                            </div>
                          ))}
                      </div>
                    ))}

                  <div className="add-comment">
                    <input
                      type="text"
                      placeholder="Write a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="comment-input"
                    />
                    <button
                      className="comment-button"
                      onClick={() => handleCommentSubmit(post.id)}
                    >
                      Post
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Floating Action Button for mobile */}
      <button className="floating-button" onClick={handleOpenPostModal}>
        +
      </button>
    </div>
  );
}

export default CommunityPage;
