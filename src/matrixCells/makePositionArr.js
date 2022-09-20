export default (function make_position_arr(
  store,
  inst_row_order,
  inst_col_order
) {
  const num_row = store.select("labels").num_row;
  const num_col = store.select("labels").num_col;
  const canvas_pos = store.select("node_canvas_pos");
  const row_nodes = store.select("network").row_nodes;
  const col_nodes = store.select("network").col_nodes;
  let row_pos;
  let col_pos;
  function position_function(d, i) {
    row_pos =
      canvas_pos.y_arr[
        num_row - 1 - row_nodes[Math.floor(i / num_col)][inst_row_order]
      ];
    col_pos =
      canvas_pos.x_arr[num_col - 1 - col_nodes[i % num_col][inst_col_order]];
    return [col_pos, row_pos];
  }
  // generate new array with position elements
  const pos_dict = {};
  for (let i = 0; i < num_col * num_row; i++) {
    pos_dict[`${row_nodes[Math.floor(i / num_col)].name}, ${col_nodes[i % num_col].name}`] = position_function(null, i);
  }
  return pos_dict;
});
