
import { useRef, useState, useEffect } from "react";
import { SyncLoader } from "react-spinners";

interface SpotifyIframeApi {
    createController(
        element: HTMLElement,
        options: {
        uri: string;
        width: string;
        height: string;
        },
        callback: (controller: SpotifyEmbedController) => void
    ): void;
}
  
interface SpotifyEmbedController {
play(): void;
pause(): void;
loadUri(uri: string): void;
addListener(event: string, callback: (event: any) => void): void;
removeListener(event: string): void;
}

declare global {
    interface Window {
        onSpotifyIframeApiReady?: (SpotifyIframeApi: SpotifyIframeApi) => void;
    }
}

export default function PlaySpotify() {
  const embedRef = useRef(null);
  const spotifyEmbedControllerRef = useRef<SpotifyEmbedController | null>(null);
  const [iFrameAPI, setIFrameAPI] = useState<SpotifyIframeApi | undefined>(undefined);

  const [playerLoaded, setPlayerLoaded] = useState(false);
  const [uri, setUri] = useState("");
  const [inputValue, setInputValue] = useState("");
//   const [uri, setUri] = useState("spotify:album:0FV8hJPG7iVI9N3M24AFxR");
//   https://open.spotify.com/intl-ja/track/6xRyarDnqu0VIpfFeyRy3x?si=2493eaca842848aa
// src="https://open.spotify.com/embed/track/6xRyarDnqu0VIpfFeyRy3x?utm_source=generator"
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://open.spotify.com/embed/iframe-api/v1";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    // if (iFrameAPI) {
    //   return;
    // }
    window.onSpotifyIframeApiReady = (SpotifyIframeApi :SpotifyIframeApi) => {
      setIFrameAPI(SpotifyIframeApi);
    };
  }, []);

  useEffect(() => {
    if (playerLoaded || iFrameAPI === undefined || embedRef.current === null || !uri) {
      return;
    }
  
    iFrameAPI.createController(
      embedRef.current,
      {
        width: "60%",
        height: "400",
        uri: uri,
      },
      (spotifyEmbedController) => {
        spotifyEmbedController.addListener("ready", () => {
          setPlayerLoaded(true);
        });
  
        spotifyEmbedController.addListener("playback_update", (e) => {
          console.log("Playback update", e.data);
        });
  
        spotifyEmbedController.addListener("playback_started", (e) => {
          console.log("Playback started", e.data);
        });
  
        spotifyEmbedControllerRef.current = spotifyEmbedController;
      }
    );
  
    return () => {
      if (spotifyEmbedControllerRef.current) {
        spotifyEmbedControllerRef.current.removeListener("playback_update");
      }
    };
  }, [playerLoaded, iFrameAPI, uri]);
  

  useEffect(() => {
    if (spotifyEmbedControllerRef.current && uri) {
      spotifyEmbedControllerRef.current.loadUri(uri);
    }
  }, [uri]);



  const onPauseClick = () => {
    if (spotifyEmbedControllerRef.current) {
      spotifyEmbedControllerRef.current.pause();
    }
  };

  const onPlayClick = () => {
    if (spotifyEmbedControllerRef.current) {
      spotifyEmbedControllerRef.current.play();
    }
  };

  const extractSpotifyUri = (url: string): string | null => {
    try {
      const urlObj = new URL(url);
      const pathSegments = urlObj.pathname.split('/');
      const type = pathSegments[1]; // track, album, etc.
      const id = pathSegments[2]; // Spotify ID
      if (type && id) {
        return `spotify:${type}:${id}`;
      }
      return null;
    } catch (error) {
      console.error("Invalid URL:", error);
      return null;
    }
  };

  const onUriChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newInput = event.target.value;
    setInputValue(newInput);
  
    const extractedUri = extractSpotifyUri(newInput);
    if (extractedUri) {
      setUri(extractedUri);
    }
  };
  

//   const onUriChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const newInput = event.target.value;
//     setInputValue(newInput);

//     const extractedUri = extractSpotifyUri(newInput);
  
//     if (extractedUri) {
//       setUri(extractedUri);
//       if (spotifyEmbedControllerRef.current) {
//         spotifyEmbedControllerRef.current.loadUri(extractedUri);
//       }
//     } else {
//       console.error("Failed to extract Spotify URI from the input.");
//     }
//   };

//   const onUriChange = (event) => {
    
//     setUri(event.target.value);
//     if (spotifyEmbedControllerRef.current) {
//       spotifyEmbedControllerRef.current.loadUri(event.target.value);
//     }
//   };

  return (
    <div>
      <div ref={embedRef} />
      {!playerLoaded && <p><SyncLoader size={10} color={"#70F0B8"} /></p>}
      {/* <div>
        <button aria-label="Play" onClick={onPlayClick}>
          Play
        </button>
        <button aria-label="Pause" onClick={onPauseClick}>
          Pause
        </button>
      </div> */}

      <div>
        <p>Change URI:</p>
        <input
          type="text"
          value={inputValue}
          onChange={onUriChange}
          placeholder="Enter Spotify URI"
        />
      </div>
    </div>
  );
}
