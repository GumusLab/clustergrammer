import axios from "axios";
import { select } from "d3-selection";
import * as _ from "underscore";

function setTooltip(tooltip_id, data, gene_symbol) {
  if (data.name !== undefined) {
    // assign html
    select(tooltip_id).html(function () {
      const sym_name = gene_symbol + ": " + data.name;
      const full_html =
        "<p>" + sym_name + "</p> <p>" + data.description + "</p>";
      return full_html;
    });
    // set width
    select(tooltip_id).selectAll("p").style("width", "500px");
  }
}

function get_request(store, ini_gene_symbol) {
  let gene_symbol;
  if (ini_gene_symbol.indexOf(" ") > 0) {
    gene_symbol = ini_gene_symbol.split(" ")[0];
  } else if (ini_gene_symbol.indexOf("_") > 0) {
    gene_symbol = ini_gene_symbol.split("_")[0];
  } else {
    gene_symbol = ini_gene_symbol;
  }
  const base_url = "https://amp.pharm.mssm.edu/Harmonizome/api/1.0/gene/";
  const url = base_url + gene_symbol;
  axios
    .get(url)
    .then(function (response) {
      // handle success
      setTooltip(response.data, ini_gene_symbol);
      // save data for repeated use
      const newGeneData = {
        name: response.data.name,
        description: response.data.description,
      };
      store.dispatch(
        store.actions.mutateHzomeGeneData({ [gene_symbol]: newGeneData })
      );
    })
    .catch(function (error) {
      console.error("Error while trying to get hzome: ", error);
    });
}

export function getHzomeGeneInfo(store, gene_symbol) {
  if (_.has(store.select("hzome").gene_data, gene_symbol)) {
    const inst_data = store.select("hzome").gene_data[gene_symbol];
    setTooltip(store.select("tooltip").tooltip_id, inst_data, gene_symbol);
  } else {
    get_request(store, gene_symbol);
  }
}
