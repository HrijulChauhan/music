import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "@fontsource/inter"; // Global font
import "./styles.css";
import { MusicPlayer } from "./MusicPlayer";

export default function SharedLayout() {
  const [activeGame, setActiveGame] = useState(null); // Controls the modal
  const [currentTrack, setCurrentTrack] = useState(null); // The track that is actually playing
  const [isPlaying, setIsPlaying] = useState(false);

  const musicPlayerRef = useRef(null);

  // Persistent audio instance so that music continues playing even if modal unmounts
  const audioInstanceRef = useRef(null);

  // Create a single Audio object once, without any default src
  useEffect(() => {
    if (!audioInstanceRef.current) {
      audioInstanceRef.current = new Audio();
      audioInstanceRef.current.preload = "auto";
    }
  }, []);

  // Toggle play/pause
  const handleTogglePlay = () => {
    if (musicPlayerRef.current) {
      // If the MusicPlayer is still mounted, use its toggle method
      musicPlayerRef.current.togglePlay(isPlaying);
    } else {
      // Otherwise, directly pause/play the audio instance
      const audio = audioInstanceRef.current;
      if (!audio) return;
      isPlaying ? audio.pause() : audio.play();
    }
    setIsPlaying((prev) => !prev);
  };

  // Close the modal but keep the current track playing
  const closeModal = () => {
    setActiveGame(null);
  };

  // When user clicks a song:
  // - Immediately start playing it
  // - Update "Now playing" pill
  // - Do NOT open the modal
  const handleGameClick = (game) => {
    const audio = audioInstanceRef.current;

    // If same track is clicked again, do nothing
    if (currentTrack?.title === game.title) {
      return;
    }

    // Otherwise, load and start playing this new track
    if (audio) {
      audio.pause();
      audio.src = game.audioUrl;
      audio.load();
      audio.play(); // auto-play
    }

    setCurrentTrack(game);
    setIsPlaying(true);
  };

  // When user clicks the "Now Playing" pill, open the modal (if there's a current track)
  const handleNowPlayingClick = () => {
    if (currentTrack) {
      setActiveGame(currentTrack);
    }
  };

  return (
    <>
      {/* ---------- MODAL (Overlay + Card) ---------- */}
      <AnimatePresence>
        {activeGame && (
          <>
            {/* Dark overlay that closes the modal when clicked */}
            <motion.div
              className="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
            />

            {/* Centered container for the modal card */}
            <div
              className="active-game"
              style={
                {
                  // position: "fixed",
                  // inset: 0,
                  // zIndex: 11,
                  // display: "flex",
                  // alignItems: "center",
                  // justifyContent: "center",
                }
              }
            >
              <motion.div
                layoutId={`card-${activeGame?.title}`}
                className="inner"
                // idk why i cant add this border radius to the god damn .css file
                style={{ borderRadius: 8 }}
                onClick={(e) => e.stopPropagation()}
                exit={{ opacity: 0, scale: 0.9 }} // Exit animation for smooth card transition
              >
                {/* Header */}
                <div className="header" style={{ marginBottom: "-3rem" }}>
                  <motion.img
                    layoutId={`image-${activeGame?.title}`}
                    height={56}
                    width={56}
                    alt=""
                    src={activeGame?.image}
                    style={{ borderRadius: 4 }}
                  />
                  <div className="header-inner">
                    <div className="content-wrapper">
                      <motion.h2
                        layoutId={`title-${activeGame?.title}`}
                        className="game-title"
                      >
                        {activeGame?.title}
                      </motion.h2>
                      <motion.p
                        layoutId={`description-${activeGame?.title}`}
                        className="game-description"
                      >
                        {activeGame?.description}
                      </motion.p>
                    </div>
                  </div>
                </div>

                {/* MusicPlayer - pass the track's duration from the GAMES array */}
                <MusicPlayer
                  ref={musicPlayerRef}
                  persistentAudioRef={audioInstanceRef}
                  isPlaying={isPlaying}
                  onTogglePlay={handleTogglePlay}
                  duration={activeGame?.duration}
                />
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* circle */}
      <div style={{ paddingLeft: "0rem" }}>
        <div className = "randomClass">
          {/* Circle aligned to the left edge of the container */}
          <div
            style={{
              marginBottom: "64px",
              height: "30px",
              width: "30px",
              borderRadius: "100%",
              background: "linear-gradient(to bottom, #47585C, #D4DCDA)",
            }}
          ></div>

          {/* ---------- LIST OF GAMES (max 3 columns per row) ---------- */}
          <ul
            className="list"
            style={{
              // display: "grid",
              // gridTemplateColumns: "repeat(2, 1fr)",
              gap: "72px 24px", // Different vertical and horizontal gaps
              listStyle: "none",
              padding: 0,
              margin: 0,
            }}
          >
            {GAMES.map((game) => (
              <motion.li
                layoutId={`card-${game.title}`}
                key={game.title}
                whileHover={{ scale: 0.98 }}
                onClick={() => handleGameClick(game)}
                style={{
                  borderRadius: 8,
                  cursor: "pointer",
                  padding: 8,
                  textAlign: "center",
                }}
              >
                <motion.img
                  layoutId={`image-${game.title}`}
                  height={32}
                  width={32}
                  alt=""
                  src={game.image}
                  style={{ borderRadius: 0 }}
                />
                <div
                  className="game-wrapper"
                  style={{
                    display: "flex",
                    flexGrow: 1,
                    alignItems: "center",
                    justifyContent: "flex-start",
                    borderBottom: "none",
                  }}
                >
                  <div
                    className="content-wrapper"
                    style={{ margin: 0, padding: 0 }}
                  >
                    <motion.h2
                      layoutId={`title-${game.title}`}
                      className="game-title"
                      style={{
                        fontSize: "1rem",
                        margin: "0rem 0 0rem",
                        textAlign: "left",
                        letterSpacing: "0px",
                        fontWeight: 500,
                      }}
                    >
                      {game.title}
                    </motion.h2>
                    <motion.p
                      layoutId={`description-${game.title}`}
                      className="game-description"
                      style={{
                        fontSize: "1rem",
                        fontWeight: 400,
                        margin: 0,
                        letterSpacing: "-0.1px",
                        textAlign: "left",
                      }}
                    >
                      {game.description}
                    </motion.p>
                  </div>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
      {/* ---------- NOW PLAYING PILL (Bottom Center) ---------- */}
      <div
        style={{
          position: "fixed",
          bottom: 16,
          left: "50%",
          transform: "translateX(-50%)",
          color: "white",
          background: "black",
          borderRadius: 9999,
          padding: "8px 12px",
          display: "flex",
          alignItems: "center",
          boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
          gap: "8px",
        }}
      >
        {/* Left side: track image (or placeholder) + text 
            Clicking this area will open the modal if there's a current track */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            cursor: currentTrack ? "pointer" : "default",
          }}
          onClick={() => {
            if (currentTrack) {
              setActiveGame(currentTrack); // open the modal
            }
          }}
        >
          {currentTrack ? (
            <img
              src={currentTrack.image}
              alt=""
              style={{ width: 32, height: 32, borderRadius: 999 }}
            />
          ) : (
            <motion.svg
              width="0"
              height="0"
              viewBox="0 0 24 24"
              fill="currentColor"
              style={{ filter: "grayscale(100%)", opacity: 0.5 }}
            >
              <path d="M8 5v14l11-7z" />
            </motion.svg>
          )}

          <span
            style={{
              fontSize: "0.85rem",
              color: "rgba(255, 255, 255, 0.5)",
              marginLeft: 8,
            }}
          >
            Now playing:{" "}
            <span style={{ color: "#fff" }}>
              <u>{currentTrack ? currentTrack.title : ""}</u>
            </span>
          </span>
        </div>

        {/* Right side: Play/Pause icon. We stop click events from also opening the modal. */}
        <div
          style={{
            width: "36px",
            height: "36px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            borderRadius: "100%",
            backgroundColor: "#111111",
          }}
          onClick={(e) => {
            e.stopPropagation(); // Prevent opening the modal
            handleTogglePlay();
          }}
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
      </div>
    </>
  );
}

// Sample data: multiple songs with distinct audioUrl values and a duration field
const GAMES = [
  {
    title: "Massive",
    description: "Drake",
    image: "https://i.scdn.co/image/ab67616d00001e028dc0d801766a5aa6a33cbe37",
    audioUrl: "/massivecobalt.mp3",
    duration: 337,
  },
  {
    title: "Virtual Insanity",
    description: "Jamiroquai",
    image: "https://upload.wikimedia.org/wikipedia/en/7/7d/Virtualinsanity.jpg",
    audioUrl: "https://audio.jukehost.co.uk/Z0LeugwQUdZRa0yTOx56rRKXEgZ5ZaP1",
    duration: 234.72,
  },
  {
    title: " tell you straight",
    description: "jigitz",
    image:
      "https://cdn-images.dzcdn.net/images/cover/a1a827a7c6ec3e759ddf68d41d7cf69c/0x1900-000000-80-0-0.jpg",
    audioUrl: "https://audio.jukehost.co.uk/8lTU7EIOmpbmcWrfqxeWYac1JGqnSfrg",
    duration: 124.9436,
  },
  {
    title: "FORWARD",
    description: "SBTRKT",
    image:
      "https://images.genius.com/f0eacc3ddcf32dd1fdd7b52efa58f2ba.1000x1000x1.png",
    audioUrl: "https://audio.jukehost.co.uk/YMZEu5fXeEZ5wJtJECNlmQclv0aInpJc",
    duration: 136.7249,
  },
  {
    title: "Feel Good Inc.",
    description: "Gorillaz",
    image: "https://i.scdn.co/image/ab67616d0000b27319d85a472f328a6ed9b704cf",
    audioUrl: "https://audio.jukehost.co.uk/F8vAgMn9iBjJ0VFIynaM6IwU5weVbnRo",
    duration: 253.9886,
  },
  {
    title: "Untitled",
    description: "Blaxian",
    image: "https://i.scdn.co/image/ab67616d0000b273880c48bcb0e62fb61e4bc875",
    audioUrl: "https://audio.jukehost.co.uk/oKBB7swMnQ7PReJ0QqhfKocjlNp8feBS",
    duration: 167.1053,
  },
  {
    title: "CRAZY",
    description: "LE SSERAFIM",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDGltN9xw2XBehm6IAYtWtAE5_ATAkNLihxA&s",
    audioUrl: "https://audio.jukehost.co.uk/5gKX2yfp3pJ7r0UlUPNyTggVAYp2mNTo",
    duration: 170.0571,
  },
  {
    title: "Danielle",
    description: "Fred again..",
    image: "https://i.scdn.co/image/ab67616d0000b2737d37a4cb9bf92e31e2162fd7",
    audioUrl: "https://audio.jukehost.co.uk/i8UFY3wfgQuuv743Y3S5LMb49gMuPFHv",
    duration: 193.7763,
  },
  {
    title: "Battlefield",
    description: "NxWorries",
    image: "https://i.scdn.co/image/ab67616d00001e0298bb835c8a41af410352008a",
    audioUrl: "https://audio.jukehost.co.uk/Jz3nb76dRP6KXOdT4OuKQSoyJaCoMfLA",
    duration: 218.2008,
  },
  {
    title: "On the low",
    description: "Burna Boy",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0oOtvHDvYUMGTUlSkPogsaHSoJZve-EK-Fg&s",
    audioUrl: "https://audio.jukehost.co.uk/pqJdIu0kDDd7hzqjbFdwOjMfI4G7YaF2",
    duration: 202.3183,
  },
  {
    title: "Vishay Khatam",
    description: "Naam Sujal",
    image:
      "https://c.saavncdn.com/802/MTV-Hustle-4-Episode-7-Hindi-2024-20241109084138-500x500.jpg",
    audioUrl: "https://audio.jukehost.co.uk/OlwN8PbOf5r8CowBnUWpQ273OI5Iixyd",
    duration: 191.9216,
  },
  {
    title: "Chainsaw Blood",
    description: "Vaundy",
    image: "https://i.scdn.co/image/ab67616d0000b2737a910ed50c45df3713b5de71",
    audioUrl: "https://audio.jukehost.co.uk/eY6tuuo9j55gtx235RIrgBMgHewVQNlD",
    duration: 222.1714,
  },
  {
    title: "Igloo",
    description: "Kiss of life",
    image: "https://i.scdn.co/image/ab67616d0000b27315175a3af8eb08dbc8c77a31",
    audioUrl: "https://audio.jukehost.co.uk/arShEWSXuqj6gg9dflrMuRN2NeyEslq5",
    duration: 145.6849,
  },
  {
    title: "Tyler Herro",
    description: "Jack Harlow",
    image: "https://i.scdn.co/image/ab67616d00001e02aeb14ead136118a987246b63",
    audioUrl: "https://audio.jukehost.co.uk/ezjlRt6HkMQnoIipN342fc4gyoCqQ9Pp",
    duration: 156.6302,
  },
  {
    title: "ETA",
    description: "NewJeans (NJZ?)",
    image: "https://i.scdn.co/image/ab67616d0000b2730744690248ef3ba7b776ea7b",
    audioUrl: "https://audio.jukehost.co.uk/w10913rk2r83fPvbn1biqDZs1blD9f8i",
    duration: 194.7429,
  },
  {
    title: "Vampire",
    description: "Dominic Fike",
    image: "https://i1.sndcdn.com/artworks-C2xuNsnVACOl-0-t500x500.jpg",
    audioUrl: "https://audio.jukehost.co.uk/9rnl9qIBtQPAyjHnRJOBcAQljTTtRUxK",
    duration: 186.8278,
  },
  {
    title: "M a k e I t T o T h e M o r n i n g",
    description: "PARTYNEXTDOOR ",
    image:
      "https://i1.sndcdn.com/artworks-d1a2zT5sxRb72vi9-wWNtRg-t500x500.jpg",
    audioUrl: "https://audio.jukehost.co.uk/G7S0MPAZfK4sU4DLvXdo2L2xYeHmEQ8m",
    duration: 168.6726,
  },
  {
    title: "Hanumankind Freestyle",
    description: "The Hanumankind & On The Radar",
    image:
      "https://i1.sndcdn.com/artworks-sBEc25mR0PhYkb2Z-oFS9Yg-t500x500.jpg",
    audioUrl: "https://audio.jukehost.co.uk/W2rkbwsujg9rt98c1hV8clPL8UfQl8k3",
    duration: 155,
  },
  {
    title: "To The Light",
    description: "A. chal",
    image: "https://i1.sndcdn.com/artworks-000211838749-shu5ok-t500x500.jpg",
    audioUrl: "https://audio.jukehost.co.uk/QA5bS1H6GNnwkCHk6BBqhSEkTv34aLo2",
    duration: 236,
  },
  {
    title: "Jungle",
    description: "Fred again..",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSctzNtOS7hXbuvwzDeziOUv14_DDrt7YnC2w&s",
    audioUrl: "https://audio.jukehost.co.uk/5ZZXJnDag1RK2neMn0tlqpfYT9ovgqRC",
    duration: 195,
  },
];
