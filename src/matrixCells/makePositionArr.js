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
  function position_function(i) {
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
  const row_dict = {};
  const col_dict = {};
  for (let i = 0; i < num_col * num_row; i++) {
    const temp_pos = position_function(i);
    const row_name = row_nodes[Math.floor(i / num_col)].name;
    const col_name = col_nodes[i % num_col].name;
    pos_dict[`${row_name}, ${col_name}`] = temp_pos
    if (row_dict[row_name] === undefined) row_dict[row_name] = [];
    if (col_dict[col_name] === undefined) col_dict[col_name] = [];
    row_dict[row_name].push(i);
    col_dict[col_name].push(i);
  }
  return {
    pos_dict,
    row_dict,
    col_dict,
  };
});
