module.exports = function draw_tooltip_components(regl, params){

  console.log('draw tooltip components')

  // Spillover Components (may not need to redraw)
  params.cameras.static.draw(() => {

    var args = params.spillover_args.mat_corners;
    var args = params.tooltip_args;
    var triangles = params.spillover_triangles.mat_corners;

    // spillover rects to hide matrix spillover
    regl(args)(triangles);

  });
};