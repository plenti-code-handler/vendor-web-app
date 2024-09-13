const CustomNextArrow = (props) => {
  const { onClick } = props;
  return (
    <div
      className="custom-arrow custom-next"
      onClick={onClick}
      style={{
        position: "absolute",
        right: "-40px",
        top: "50%",
        zIndex: 1,
        cursor: "pointer",
        transform: "translateY(-50%)",
      }}
    >
      {/* Custom Arrow Design */}
      <img src="/custom-next-arrow.png" alt="Next" style={{ width: "30px" }} />
    </div>
  );
};

const CustomPrevArrow = (props) => {
  const { onClick } = props;
  return (
    <div
      className="custom-arrow custom-prev"
      onClick={onClick}
      style={{
        position: "absolute",
        left: "-40px",
        top: "50%",
        zIndex: 1,
        cursor: "pointer",
        transform: "translateY(-50%)",
      }}
    >
      {/* Custom Arrow Design */}
      <img
        src="/custom-prev-arrow.png"
        alt="Previous"
        style={{ width: "30px" }}
      />
    </div>
  );
};
