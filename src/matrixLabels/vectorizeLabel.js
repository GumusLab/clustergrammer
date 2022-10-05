import vectorize_text from "vectorize-text";

export default function vectorize_label(
  fontDetails,
  inst_axis,
  inst_name,
  async = true
) {
  const vect_text_attrs = {
    textAlign: "left",
    triangles: true,
    size: fontDetails,
    font: '"Open Sans", verdana, arial, sans-serif',
  };

  if (async) {
    vect_text_attrs["canvas"] = new OffscreenCanvas(8192, 1024);
    vect_text_attrs["context"] = vect_text_attrs["canvas"].getContext("2d");
  }

  if (inst_axis === "col") {
    vect_text_attrs.textAlign = "left";
    vect_text_attrs.textBaseline = "bottom";
  } else {
    vect_text_attrs.textAlign = "right";
    vect_text_attrs.textBaseline = "middle";
  }
  return vectorize_text(inst_name, vect_text_attrs);
}
