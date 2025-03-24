import React, {
  useRef,
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { motion, AnimatePresence } from "framer-motion";

export const MusicPlayer = forwardRef(function MusicPlayer(
  { timedLyrics, isPlaying, onTogglePlay, persistentAudioRef, duration },
  ref
) {
  // Use the persistent audio instance if provided; otherwise, create a local one.
  const localAudioRef = useRef(null);
  const audioRef =
    persistentAudioRef && persistentAudioRef.current
      ? persistentAudioRef
      : localAudioRef;

  const [currentTime, setCurrentTime] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(-1);

  useEffect(() => {
    // If no audio instance exists locally, create one
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.preload = "auto";
    }
    const audio = audioRef.current;

    // Update currentTime on each timeupdate
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);

      // If you have timed lyrics, update currentIndex
      if (timedLyrics && timedLyrics.length > 0) {
        let newIndex = -1;
        for (let i = 0; i < timedLyrics.length; i++) {
          if (timedLyrics[i].start <= audio.currentTime) {
            newIndex = i;
          } else {
            break;
          }
        }
        setCurrentIndex(newIndex);
      }
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [timedLyrics, audioRef]);

  // Expose a togglePlay method to the parent
  useImperativeHandle(ref, () => ({
    togglePlay(isCurrentlyPlaying) {
      const audio = audioRef.current;
      if (!audio) return;
      isCurrentlyPlaying ? audio.pause() : audio.play();
    },
  }));

  // Utility to format time in mm:ss
  function formatTime(sec) {
    if (isNaN(sec) || !isFinite(sec) || sec < 0) return "0:00";
    const minutes = Math.floor(sec / 60);
    const seconds = Math.floor(sec % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  }

  // Handle scrubbing the progress bar
  const handleScrub = (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  // Example: if you want the next line of lyrics
  const currentLyricText =
    timedLyrics && currentIndex >= 0 ? timedLyrics[currentIndex].line : "";
  const nextLyricText =
    timedLyrics && currentIndex < timedLyrics.length - 1
      ? timedLyrics[currentIndex + 1].line
      : "";

  return (
    <motion.div
      className="music-player"
      // Fade in/out only (no slide or scale)
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      {/* (Optional) Timed Lyrics Display */}
      {/* 
        If you want to display lyrics, insert your 
        AnimatePresence blocks here for currentLyricText/nextLyricText
      */}

      {/* Progress Bar */}
      <input
        type="range"
        min={0}
        max={duration} // <-- use the duration from the prop
        value={currentTime}
        onChange={handleScrub}
        className="progress-bar"
        style={{
          background: `linear-gradient(to right, #C099A0 0%, #4D80E6 ${
            (currentTime / duration) * 100
          }%, #eee ${(currentTime / duration) * 100}%, #eee 100%)`,
          marginTop: "5rem",
        }}
      />

      {/* Time Info */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "0.5rem",
        }}
      >
        <span style={{ fontSize: "0.85rem", color: "#333" }}>
          {formatTime(currentTime)}
        </span>
        <span style={{ fontSize: "0.85rem", color: "#333" }}>
          {formatTime(duration)} {/* <-- show the prop-based total time */}
        </span>
      </div>

      {/* Play/Pause Button */}
      {/* <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "1rem",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "36px",
            height: "36px",
            cursor: "pointer",
            marginTop: "-20px",
          }}
          onClick={onTogglePlay}
        >
          <AnimatePresence mode="wait">
            {isPlaying ? (
              <motion.svg
                key="pause"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <rect x="5" y="3" width="4" height="18" />
                <rect x="15" y="3" width="4" height="18" />
              </motion.svg>
            ) : (
              <motion.svg
                key="play"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M8 5v14l11-7z" />
              </motion.svg>
            )}
          </AnimatePresence>
        </div>
      </div> */}
    </motion.div>
  );
});
