/*

  clustergrammer-gl version 0.13.8

 */

function clustergrammer_gl(args, external_model=null){

  var d3 = require("d3");

  console.log('#################################');
  console.log('clustergrammer-gl version 0.13.8');
  console.log('#################################');

  var cgm = {};

  // check if container is defined
  if (args.container !=null){

    cgm.args = args;

    cgm.initialize_params = require('./params/initialize_params');
    // cgm.decompress_network = require('./params/decompress_network');
    cgm.initialize_regl = require('./params/initialize_regl');
    cgm.initialize_containers = require('./initialize_viz/initialize_containers');
    cgm.build_dendrogram_sliders = require('./dendrogram/build_dendrogram_sliders');
    cgm.build_control_panel = require('./control_panel/build_control_panel');
    cgm.run_viz = require('./draws/run_viz');
    cgm.destroy_viz = require('./initialize_viz/destroy_viz');
    cgm.ini_canvas_mouseover = require('./initialize_viz/ini_canvas_mouseover')
    cgm.viz_from_network = require('./initialize_viz/viz_from_network');
    cgm.draw_labels_tooltips_or_dendro = require('./draws/draw_labels_tooltips_or_dendro');

    cgm.single_clicking = require('./interactions/single_clicking');
    cgm.zoom_rules_high_mat = require('./zoom/zoom_rules_high_mat');

    cgm.gen_ordered_labels = require('./params/gen_label_par');


    if (typeof args.widget_callback !== 'undefined'){
      console.log('pass widget_callback to cgm  ')
      cgm.widget_callback = args.widget_callback;
    }


    // initialize network
    // cgm.decompress_network(args.network);
    cgm.network = args.network;

    // going to work on passing in filtered network in place of full network
    // as a quick crop method
    cgm.viz_from_network(external_model);

    if (external_model != null){
      // copy the cgm object to the external widget model
      external_model.cgm = cgm;

    }

    cgm.recluster = require('./recluster/recluster');

    cgm.manual_update_to_cats = require('./cats/manual_update_to_cats')

    // this prevents Jupyter from listening to typing on the modal and
    // misinterpreting as keyboard shortcuts
    if (cgm.params.is_widget){

      console.log('>>> -----------------------------------')
      console.log('Found widget, preventing keyboard shortcuts on tooltip')
      console.log('checking if tooltip is present')
      console.log('empty tooltip', d3.select(cgm.params.tooltip_id).empty())
      console.log('>>> -----------------------------------')

      let tooltip_id = cgm.params.tooltip_id.replace('#', '')

      Jupyter.keyboard_manager
             .register_events(document.getElementById(tooltip_id))

    }

    cgm.slice_linkage = function(axis, dist_thresh){
      console.log('slice_linkage')

      params = this.params
      network = params.network
      let clust_a
      let clust_b

      // initialize group_links
      ['row', 'col'].forEach((axis) => {
          network[axis + '_nodes'].forEach((x, i) => { x.group_links = i})
        })

      // the max individual cluster id
      max_clust_id = params.network[axis + '_nodes'].length

      params.network.linkage[axis].forEach((x, i) => {

        if (x[2] < dist_thresh){

          // get cluster that are being combined together
          clust_a = x[0]
          clust_b = x[1]

          new_clust_id = max_clust_id + i

          // console.log('index', i)
          // console.log(new_clust_id)

          // replace old cluster ids with new cluster id
          // effectively merging clusters
          network[axis + '_nodes'].forEach((x, i) => {
            if (x.group_links == clust_a || x.group_links == clust_b){
              x.group_links = new_clust_id
            }
          })


        }

      })

      console.log(params.network.col_nodes.map((x) => x.group_links))

    }

    return cgm;

  }
}

// necessary for exporting function
module.exports = clustergrammer_gl;