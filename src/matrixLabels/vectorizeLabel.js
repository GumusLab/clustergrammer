import vectorize_text from "vectorize-text";

export default function vectorize_label(fontDetails, inst_axis, inst_name) {
  const canvas = new OffscreenCanvas(8192, 1024);
  const context = canvas.getContext("2d");
  const vect_text_attrs = {
    textAlign: "left",
    triangles: true,
    size: fontDetails,
    font: '"Open Sans", verdana, arial, sans-serif',
    canvas,
    context,
  };
  if (inst_axis === "col") {
    vect_text_attrs.textAlign = "left";
    vect_text_attrs.textBaseline = "bottom";
  } else {
    vect_text_attrs.textAlign = "right";
    vect_text_attrs.textBaseline = "middle";
  }
  return vectorize_text(inst_name, vect_text_attrs);
}
