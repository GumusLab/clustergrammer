import { NetworkState } from "./state/reducers/networkSlice";
import { TooltipState } from "./state/reducers/tooltip/tooltipSlice";

export type ClustergrammerInstance = {};

export type OnClickCallbackProps = {
  row: string | null;
  col: string | null;
  clickType: TooltipState["tooltip_type"];
};

export type OnClickCallback =
  | (({ row, col, clickType }: OnClickCallbackProps) => void)
  | undefined;

type Color = number[] | string;

export type ClustergrammerProps = {
  use_hzome?: boolean;
  container: HTMLElement;
  network: NetworkState;
  width: number | string;
  height: number | string;
  showControls?: boolean;
  showDendroSliders?: boolean;
  hideLegend?: boolean;
  onClick?: OnClickCallback;
  disableTooltip?: boolean;
  enabledTooltips?: Array<"dendro" | "cat" | "cell" | "label" | string>;
  labelLength?: number;
  matrixColors?: { pos: Color; neg: Color };
};
