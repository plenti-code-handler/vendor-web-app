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
        shape="pill"
        logo_alignment="left"
        auto_select={false}
      />
    </div>
  );
};

export default GoogleAuthButton;