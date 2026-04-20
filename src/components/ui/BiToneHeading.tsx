interface BiToneHeadingProps {
  text: string;
  firstColor?: string;
  secondColor?: string;
}

export default function BiToneHeading({
  text,
  firstColor = "#0D0D1A",
  secondColor = "#1A3263",
}: BiToneHeadingProps) {
  const words = text.trim().split(/\s+/);
  const splitIndex = Math.ceil(words.length / 2);
  const firstHalf = words.slice(0, splitIndex).join(" ");
  const secondHalf = words.slice(splitIndex).join(" ");

  return (
    <>
      <span style={{ color: firstColor }}>{firstHalf}</span>
      {secondHalf && <span style={{ color: secondColor }}> {secondHalf}</span>}
    </>
  );
}
