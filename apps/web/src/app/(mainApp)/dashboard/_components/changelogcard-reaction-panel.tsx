const ReactionPanel = ({
  reactions,
}: {
  reactions?: { thumbsUp: number; heart: number; fire: number };
}) => {
  return reactions ? (
    <div className="flex text-xs gap-1 text-muted-foreground  absolute -bottom-2 right-3 bg-accent py-[0.15rem] px-[0.2rem] rounded-2xl backdrop-blur-lg shadow-xl border border-accent-foreground/10">
      {reactions && reactions.thumbsUp > 0 && (
        <span className="flex items-center gap-1">👍 {reactions.thumbsUp}</span>
      )}
      {reactions && reactions.heart > 0 && (
        <span className="flex items-center gap-1">❤️ {reactions.heart}</span>
      )}
      {reactions && reactions.fire > 0 && (
        <span className="flex items-center gap-1">🔥 {reactions.fire}</span>
      )}
    </div>
  ) : null;
};

export default ReactionPanel;
