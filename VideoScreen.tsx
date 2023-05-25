import React, { useRef, useState } from "react";
import { View, Button, ActivityIndicator } from "react-native";
import { Video, AVPlaybackStatus } from "expo-av";

const videoUrls = ["https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8", "https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_fmp4/master.m3u8"];

const VideoScreen: React.FC = () => {
  const videoRef = useRef<Video>(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const switchVideo = async () => {
    if (videoRef.current) {
      const videoPlayer = videoRef.current;
      const status: AVPlaybackStatus = await videoPlayer.getStatusAsync();

      // Pause current video
      await videoPlayer.pauseAsync();

      // Hide video and show loading indicator
      setIsLoading(true);

      // Switch video URL
      const nextVideoIndex = (currentVideoIndex + 1) % videoUrls.length;
      const videoUrl = videoUrls[nextVideoIndex];

      // Calculate the time to seek in the next video
      const currentMillis = status.isLoaded ? status.positionMillis : 0;
      const seekTime = Math.floor(currentMillis / 1000);

      // Load new video and play
      setCurrentVideoIndex(nextVideoIndex);
      setCurrentTime(seekTime); // Update the current time for the next video
      await videoPlayer.unloadAsync();
      await videoPlayer.loadAsync({ uri: videoUrl });
      await videoPlayer.playFromPositionAsync(currentMillis);
      setIsLoading(false);
    }
  };

  const onProgress = (status: AVPlaybackStatus) => {
    setCurrentTime(Math.floor(status.isLoaded ? status.positionMillis : 0 / 1000));
  };

  return (
    <View style={{ flex: 1 }}>
      <Video ref={videoRef} source={{ uri: videoUrls[currentVideoIndex] }} onPlaybackStatusUpdate={onProgress} style={{ flex: 1 }} resizeMode="contain" useNativeControls />

      {isLoading ? <ActivityIndicator size="large" color="#0000ff" /> : <Button title="Switch Video" onPress={switchVideo} />}
    </View>
  );
};

export default VideoScreen;
