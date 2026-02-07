import './PostKeleton.css';
const PostSkeleton = () => {
  return (
    <div className="post-skeleton">
      <div className="skeleton avatar" />
      <div className="skeleton content">
        <div className="skeleton line short" />
        <div className="skeleton line" />
        <div className="skeleton line" />
      </div>
    </div>
  );
};

export default PostSkeleton;
