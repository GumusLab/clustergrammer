import { zoom_function } from "../cameras/zoomFunction";
import make_opacity_arr from "./makeOpacityArr";
import make_position_arr from "./makePositionArr";

export default function make_matrix_args(regl, store) {
  // make arrays
  const arrs = {};
  const row_nodes = store.select("network").row_nodes;
  const col_nodes = store.select("network").col_nodes;
  const {
    highlighted_cols,
    highlighted_rows,
  } = store.select("search");
  arrs.opacity_arr = make_opacity_arr(store);
  arrs.mask_arr = new Array(arrs.opacity_arr.length).fill(0.0);

  const ini_dict = make_position_arr(
    store,
    store.select("order").inst.row,
    store.select("order").inst.col
  );
  const new_dict = make_position_arr(
    store,
    store.select("order").new.row,
    store.select("order").new.col
  );
  arrs.position_arr = {};
  arrs.position_arr.ini = Object.values(ini_dict);
  arrs.position_arr.new = Object.values(new_dict);

  for (let i = 0; i < highlighted_cols.length; i++) {
    if (highlighted_cols[i].length == 0) continue
    for (let j = 0; j < highlighted_rows.length; j++) {
      if (highlighted_rows[j].length == 0) continue
      const targetNode = new_dict[`${row_nodes[0].name}, ${col_nodes[0].name}`];

      for (let i = 0; i < arrs.mask_arr.length; i++) {
        if (arrs.position_arr.new[i][0] === targetNode[0]) {
          arrs.mask_arr[i] += 0.3;
        }
        if (arrs.position_arr.new[i][1] === targetNode[1]) {
          arrs.mask_arr[i] += 0.3;
        }
        arrs.mask_arr[i] = Math.min(arrs.mask_arr[i], 1.0);
      }
    }
  }

  store.dispatch(store.actions.setArrsState(arrs));
  const opacity_buffer = regl.buffer({
    type: "float",
    usage: "dynamic",
  })(arrs.opacity_arr);
  const mask_buffer = regl.buffer({
    type: "float",
    usage: "dynamic",
  })(arrs.mask_arr);
  const tile_width = store.select("visualization").viz_dim.tile_width;
  const tile_height = store.select("visualization").viz_dim.tile_height;
  const triangle_verts = [
    [tile_width, 0.0],
    [tile_width, tile_height],
    [0.0, tile_height],
    [tile_width, 0.0],
    [0.0, 0.0],
    [0.0, tile_height],
  ];
  const vert_string = `
    // precision highp float;
    precision lowp float;
    attribute vec2 position;
    attribute vec2 pos_att_ini, pos_att_new;
    attribute float intensity_arr;
    attribute float mask_arr;
    uniform mat4 zoom;
    uniform bool run_animation;
    uniform float interp_uni;
    varying vec2 pos;

    // pass varying variables to fragment from vector
    varying float intensity_vary;
    varying float mask_vary;

    void main() {

      // interpolate between the two positions using the interpolate uniform
      if (run_animation == true){
        pos = mix(pos_att_ini, pos_att_new, interp_uni);
      } else {
        pos = pos_att_ini;
      }

      gl_Position = zoom *
                    vec4( position.x + pos.x,
                          position.y + pos.y,
                          0.75,
                          1
                        );

      // pass attribute (in vert) to varying in frag
      intensity_vary = intensity_arr;
      mask_vary = mask_arr;
    }`;
  const frag_string = `
    // precision highp float;
    precision lowp float;
    uniform vec3 pos_rgb;
    uniform vec3 neg_rgb;
    // use the varying being passed from the vertex shader
    varying float intensity_vary;
    varying float mask_vary;
    void main() {
      if (intensity_vary > 0.0){
        gl_FragColor = vec4(pos_rgb, abs(intensity_vary));
      } else {
        gl_FragColor = vec4(neg_rgb, abs(intensity_vary));
      }
      if (mask_vary == 0.3) {
        gl_FragColor = vec4(1.0, 1.0, 0.0, min(1.0, intensity_vary + 0.3));
      }
      if (mask_vary > 0.4) {
        gl_FragColor = vec4(1.0, 0.0, 0.0, min(1.0, intensity_vary + 0.5));
      }

    }`;
  const num_instances = arrs.position_arr.ini.length;
  const inst_properties = {
    vert: vert_string,
    frag: frag_string,
    attributes: {
      position: triangle_verts,
      pos_att_ini: {
        buffer: regl.buffer(arrs.position_arr.ini),
        divisor: 1,
      },
      pos_att_new: {
        buffer: regl.buffer(arrs.position_arr.new),
        divisor: 1,
      },
      intensity_arr: {
        buffer: opacity_buffer,
        divisor: 1,
      },
      mask_arr: {
        buffer: mask_buffer,
        divisor: 1,
      }
    },
    blend: {
      enable: true,
      func: {
        srcRGB: "src alpha",
        srcAlpha: 1,
        dstRGB: "one minus src alpha",
        dstAlpha: 1,
      },
      equation: {
        rgb: "add",
        alpha: "add",
      },
      color: [0, 0, 0, 0],
    },
    count: 6,
    uniforms: {
      zoom: zoom_function,
      interp_uni: (ctx, props) => Math.max(0, Math.min(1, props.interp_prop)),
      run_animation: regl.prop("run_animation"),
      pos_rgb: store.select("cat_viz").mat_colors.pos_rgb.map((x) => x / 255),
      neg_rgb: store.select("cat_viz").mat_colors.neg_rgb.map((x) => x / 255),
    },
    instances: num_instances,
    depth: {
      enable: false,
    },
  };
  // draw top and bottom of matrix cells
  // ////////////////////////////////////
  return inst_properties;
}
