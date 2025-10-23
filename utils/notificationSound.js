const soundMap = {
    'order': '/sounds/order.mp3',
  };
  
  export const playNotificationSound = (type = 'order', volume = 0.7) => {
    try {
      const soundUrl = soundMap[type] || soundMap['default'];
      const audio = new Audio(soundUrl);
      audio.volume = volume;
      
      audio.play().catch(error => {
        console.log('Sound playback blocked (user interaction may be required):', error);
        // Browsers often block audio unless triggered by user interaction
      });
    } catch (error) {
      console.error('Error playing notification sound:', error);
    }
  };
  
  export default playNotificationSound;