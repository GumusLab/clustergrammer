const rgbArrayToString = (rgb: number[]) => {
  return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${
    rgb.length > 3 ? rgb[3] : 1
  })`;
};

export default rgbArrayToString;
