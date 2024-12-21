export const getLineBackgroundColors = (label) => {
  let color1 = getLineBackgroundColor(label, "array");
  let color2 = getLineBackgroundColor(label, "array", true);

  return ["rgb(" + color1.join(",") + ")", "rgb(" + color2.join(",") + ")"];
};

export const getLineBackgroundColor = (label, type, darker) => {
  let value = null;

  switch (label) {
    case "1":
      value = [255, 0, 0];
      break;

    case "2":
      value = [235, 188, 194];
      break;

    case "3":
      value = [255, 208, 20];
      break;

    case "4":
      value = [58, 242, 229];
      break;

    case "5C1":
      value = [207, 207, 207];
      break;

    case "5C2":
      value = [173, 173, 173];
      break;

    case "6C1":
      value = [14, 199, 88];
      break;

    case "6C2":
      value = [0, 194, 0];
      break;

    case "7C1":
      value = [255, 157, 28];
      break;

    case "7C2":
      value = [255, 157, 28];
      break;

    case "11":
      value = [186, 51, 9];
      break;

    case "12":
      value = [178, 219, 116];
      break;

    case "13":
      value = [212, 176, 211];
      break;

    case "14":
      value = [62, 194, 230];
      break;

    case "16":
      value = [212, 68, 178];
      break;

    case "17":
      value = [255, 210, 199];
      break;

    case "18":
      value = [201, 243, 255];
      break;

    case "24C1":
      value = [255, 102, 34];
      break;

    case "24C2":
      value = [255, 102, 34];
      break;

    case "LC":
      value = [23, 46, 255];
      break;

    case "E1":
      value = [42, 153, 181];
      break;

    case "N1":
      value = [173, 173, 173];
      break;

    case "N2":
      value = [105, 105, 105];
      break;

    case "N3":
      value = [171, 171, 171];
      break;

    default:
      value = [0, 122, 255];
      break;
  }

  if (darker) {
    value = value.map((value) => Math.max(value - 30, 0));
  }

  if (type === "string") {
    value = `rgb(${value.join(",")})`;
  }

  return value;
};

export const getLineTextColor = (label) => {
  switch (label) {
    case "18":
      return "#000";

    default:
      return "#fff";
  }
};
