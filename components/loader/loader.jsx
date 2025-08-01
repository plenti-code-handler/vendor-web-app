import BeatLoader from "react-spinners/BeatLoader";

const Loader = () => {
  return (
    <div className="flex justify-center items-center p-20">
      <div className="" role="status">
        <BeatLoader
          color="#5F22D9"
          loading={true}
          size={10}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    </div>
  );
};

export default Loader;
