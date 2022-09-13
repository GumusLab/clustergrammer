import React, { useEffect, useRef } from "react";
import cgl, { ClustergrammerProps } from "./cg";
import cytofData from "./data/cytof.json";
import multViewData from './data/mult_view.json';


const getArgs = (container: HTMLElement, data: any): ClustergrammerProps => {
  return {
    container,
    network: data as unknown as ClustergrammerProps["network"],
    width: "100%",
    height: "100%",
    showControls: false,
    onClick: ({ row, col }) => console.log(row, col),
    // disableTooltip: true,
    enabledTooltips: ["dendro", "cell"],
    showDendroSliders: false
  }
}

function Clustergrammer() {
  const containerRef1 = useRef<HTMLDivElement>(null);
  const containerRef2 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef1.current) return;
    cgl(getArgs(containerRef1.current, cytofData));
  }, [containerRef1]);


  useEffect(() => {
    if (!containerRef2.current) return;
    cgl(getArgs(containerRef2.current, multViewData));
  }, [containerRef2]);

  return (
    <div style={{ display: "flex"}}>
      <div id="cgm-container-2" style={{ height: "800px", width: "800px" }}>
        <div
          id="cgm1"
          ref={containerRef1}
          style={{ height: "100%", width: "100%" }}
        />
      </div>
      <div id="cgm-container-2" style={{ height: "800px", width: "800px" }}>
        <div
          id="cgm2"
          ref={containerRef2}
          style={{ height: "100%", width: "100%" }}
        />
      </div>
    </div>
  );
}
export default Clustergrammer;
