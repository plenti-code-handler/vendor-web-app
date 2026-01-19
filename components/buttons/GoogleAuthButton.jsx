import { GoogleLogin } from '@react-oauth/google';

const GoogleAuthButton = ({ onSuccess, onError, text = "continue_with" }) => {
  return (
    /* Ensure this container has a defined width or is allowed to grow */
    <div style={{ width: '100%' }}> 
      <GoogleLogin
        onSuccess={onSuccess}
        onError={onError}
        theme="outline"
        size="large"
        width="100%" 
        text={text}
        shape="rectangular"
        logo_alignment="left"
      />
    </div>
  );
};

export default GoogleAuthButton;