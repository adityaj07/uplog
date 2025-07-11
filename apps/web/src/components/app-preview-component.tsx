const AppComponent = () => {
  return (
    <div className="relative space-y-3 rounded-[1rem] bg-white/5 p-4">
      <div className="flex items-center gap-1.5 text-sky-400">
        <svg
          className="size-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M4 4v16h16V4H4Zm2 2h12v12H6V6Zm2 2v2h8V8H8Zm0 4v2h5v-2H8Z"
          />
        </svg>
        <div className="text-sm font-medium">Product Updates</div>
      </div>
      <div className="space-y-3">
        <div className="text-foreground border-b border-white/10 pb-3 text-sm font-medium">
          Your team has published more changelog updates this year than last
          year.
        </div>
        <div className="space-y-3">
          <div className="space-y-1">
            <div className="space-x-1">
              <span className="text-foreground align-baseline text-xl font-medium">
                36
              </span>
              <span className="text-muted-foreground text-xs">
                Updates/month
              </span>
            </div>
            <div className="flex h-5 items-center rounded bg-gradient-to-l from-sky-400 to-blue-600 px-2 text-xs text-white">
              2025
            </div>
          </div>
          <div className="space-y-1">
            <div className="space-x-1">
              <span className="text-foreground align-baseline text-xl font-medium">
                18
              </span>
              <span className="text-muted-foreground text-xs">
                Updates/month
              </span>
            </div>
            <div className="text-foreground bg-muted flex h-5 w-2/3 items-center rounded px-2 text-xs dark:bg-white/20">
              2024
            </div>
          </div>
        </div>

        {/* Reactions Section */}
        <div className="border-t border-white/10 pt-3 space-y-2">
          <div className="text-sm font-medium text-foreground">
            Users reacted <span className="font-semibold text-white">213</span>{" "}
            times to your changelogs this month
          </div>
          <div className="flex gap-2 flex-wrap text-sm">
            <span className="bg-white/10 text-white px-3 py-1 rounded-full flex items-center gap-1">
              🚀 <span className="font-medium">98</span>
            </span>
            <span className="bg-white/10 text-white px-3 py-1 rounded-full flex items-center gap-1">
              ❤️ <span className="font-medium">67</span>
            </span>
            <span className="bg-white/10 text-white px-3 py-1 rounded-full flex items-center gap-1">
              🔥 <span className="font-medium">34</span>
            </span>
            <span className="bg-white/10 text-white px-3 py-1 rounded-full flex items-center gap-1">
              🙌 <span className="font-medium">14</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppComponent;
