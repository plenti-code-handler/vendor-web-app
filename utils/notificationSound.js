import { toast } from "sonner";

// Singleton audio instance (preloaded and reusable)
let audioInstance = null;
let audioUnlocked = false;

const soundMap = {
  'order': '/sounds/order.mp3',
  'default': '/sounds/order.mp3',
};

// Initialize audio instance
const getAudioInstance = () => {
  if (!audioInstance) {
    audioInstance = new Audio();
    audioInstance.volume = 0.7;
    // setupAudioListeners(audioInstance);
  }
  return audioInstance;
};

// Initialize and unlock audio on first user interaction
export const initializeAudio = () => {
  if (typeof window === 'undefined') return;
  
  try {
    const audio = getAudioInstance();

    if (!audioUnlocked) {
      audio.src = soundMap['order'];
      audio.load();
      
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            audio.pause();
            audio.currentTime = 0;
            audioUnlocked = true;
            console.log('✅ Audio unlocked successfully');
          })
          .catch((error) => {
            console.log('⏳ Audio still locked:', error.message);
          });
      }
    }
  } catch (error) {
    console.error('Error initializing audio:', error);
  }
};

// Play notification sound
export const playNotificationSound = (type = 'order', volume = 0.7) => {
  if (typeof window === 'undefined') return;

  try {
    const soundUrl = soundMap[type] || soundMap['default'];
    const audio = getAudioInstance();
    
    console.log('🔔 New notification - playing sound');
    
    // ✅ ALWAYS stop current playback first (if any)
    if (!audio.paused) {
      console.log('⏹️ Stopping current sound');
      audio.pause();
    }
    
    // ✅ Reset to beginning
    audio.currentTime = 0;
    
    // ✅ Update src only if different
    const currentSrc = audio.src;
    const fullSoundUrl = new URL(soundUrl, window.location.origin).href;
    
    if (currentSrc !== fullSoundUrl) {
      console.log('🔄 Loading new sound:', soundUrl);
      audio.src = soundUrl;
      audio.load();
    }
    
    // Update volume
    audio.volume = volume;

    // ✅ Play from start (this will interrupt any ongoing play)
    const playPromise = audio.play();
    
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          console.log('✅ Sound started playing!');
          audioUnlocked = true;
        })
        .catch((error) => {
          console.warn('❌ Sound playback blocked:', error.message);
          
          // Only show unlock prompt if not unlocked yet
          if (!audioUnlocked) {
            console.log('💡 Audio locked - waiting for user interaction');
            const unlockOnInteraction = () => {
              initializeAudio();
            };
            
            document.addEventListener('click', unlockOnInteraction, { once: true });
            document.addEventListener('touchstart', unlockOnInteraction, { once: true });
          }
        });
    }
  } catch (error) {
    console.error('❌ Error playing notification sound:', error);
  }
};

// Preload sound file
export const preloadSound = (type = 'order') => {
  if (typeof window === 'undefined') return;
  
  try {
    const soundUrl = soundMap[type] || soundMap['default'];
    const audio = getAudioInstance(); // ✅ Use getter to ensure listeners
    
    audio.src = soundUrl;
    audio.load();
    console.log('📦 Sound preloaded:', soundUrl);
  } catch (error) {
    console.error('Error preloading sound:', error);
  }
};

export default playNotificationSound;