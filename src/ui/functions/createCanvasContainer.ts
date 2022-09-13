import { select } from "d3-selection";
import { ClustergrammerProps } from "../../index.types";
import { CANVAS_CONTAINER_CLASSNAME } from "../ui.const";
import { LEGEND_WIDTH } from "./buildLegend";

const getCanvasContainer = (
  baseContainer: HTMLElement
): HTMLDivElement | undefined => {
  return document
    .getElementById(baseContainer.id)
    ?.getElementsByClassName(CANVAS_CONTAINER_CLASSNAME)?.[0] as HTMLDivElement;
};

export const createCanvasContainer = (args: ClustergrammerProps) => {
  const { container: baseContainer, width, height, hideLegend } = args;
  let canvas_container = getCanvasContainer(baseContainer);

  if (!canvas_container) {
    // make canvas container
    select(baseContainer)
      .append("div")
      .attr("class", CANVAS_CONTAINER_CLASSNAME)
      .style("position", "relative")
      .style("cursor", "default");
  }

  canvas_container = getCanvasContainer(baseContainer);

  let finalWidth = width;
  if (!hideLegend) {
    finalWidth = `calc(${width} - ${LEGEND_WIDTH})`;
  }

  if (canvas_container) {
    canvas_container.style.height = `${height}`;
    canvas_container.style.width = `${finalWidth}`;
  }

  return canvas_container;
};
