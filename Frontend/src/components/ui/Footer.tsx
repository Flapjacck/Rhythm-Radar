const Footer = () => {
  return (
    <footer className="w-full py-6 mt-10 text-center border-t border-white/10 relative z-10">
      <div className="max-w-5xl mx-auto px-6">
        <p className="text-gray-400 text-sm">
          Created by{" "}
          <a
            href="https://SpencerKelly.tech"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-400 hover:text-green-300 transition-colors font-medium relative z-20"
            onClick={(e) => {
              e.stopPropagation();
              window.open("https://SpencerKelly.tech", "_blank");
            }}
          >
            Spencer Kelly
          </a>
        </p>
        <p className="text-gray-500 text-xs mt-1">
          Powered by Spotify API &copy; {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
