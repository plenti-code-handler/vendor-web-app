import { GoogleLogin } from '@react-oauth/google';

const GoogleAuthButton = ({ onSuccess, onError, text = "continue_with" }) => {
  return (
    <div className="w-full">
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