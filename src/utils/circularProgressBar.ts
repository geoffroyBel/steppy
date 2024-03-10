export function calculatePercentage(
  randomValue: number,
  maxValue: number
): number {
  const percentage = Math.round((randomValue / maxValue) * 100);

  return percentage;
}
export function generateRandomNumber(maxValue: number): number {
  const randomMultiplier = Math.floor(Math.random() * (maxValue / 1000 + 1));

  const randomNumber = randomMultiplier * 1000;

  return randomNumber;
}
export function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number
) {
  var angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;

  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}
export function describeArc(
  x: number,
  y: number,
  radius: number,
  startAngle: number,
  endAngle: number
) {
  var start = polarToCartesian(x, y, radius, startAngle);
  var end = polarToCartesian(x, y, radius, endAngle);

  var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  var d = [
    "M",
    start.x,
    start.y,
    "A",
    radius,
    radius,
    0,
    0,
    0,
    end.x,
    end.y,
  ].join(" ");

  return d;
}
export const color = (r: number, g: number, b: number) =>
  `rgb(${r * 255}, ${g * 255}, ${b * 255})`;
