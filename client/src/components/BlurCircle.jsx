export const BlurCircle = ({
  top = "auto",
  left = "auto",
  right = "auto",
  bottom = "auto",
  size = "232px",
  center = false,
  blur = true,
  blurLevel = "blur-3xl",
  color = "bg-primary/60",
  index = -50,
}) => {
  return (
    <div
      className={`
        absolute aspect-square rounded-full ${color}
        ${blur ? blurLevel : ""}
      `}
      style={{
        top,
        left,
        right,
        bottom,
        width: size,
        height: size,
        transform: center ? "translate(-50%, -50%)" : "none",
        zIndex: index,
      }}
    ></div>
  );
};
