
import cgl from "clustergrammer-gl";
import { ClustergrammerProps } from "clustergrammer-gl/index.types";
import React, { useEffect, useRef } from "react";
import cytofData from "./data/cytof.json";
import { generateRandomNetwork } from "./generateRandomNetwork";


const getArgs = (container: HTMLElement, data: any, otherProps: Partial<ClustergrammerProps>): ClustergrammerProps => {
  return {
    container,
    network: data as unknown as ClustergrammerProps["network"],
    width: "100%",
    height: "100%",
    showControls: true,
    onClick: ({ row, col }) => console.log(row, col),
    showDendroSliders: true,
    legend: {
      show: true,
      height: "25%",
      side: "right",
    },
    ...otherProps,
  }
}



function Clustergrammer() {
  const containerRef1 = useRef<HTMLDivElement>(null);
  const containerRef2 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef1.current) return;
    cgl(getArgs(containerRef1.current, cytofData, {  }));
  }, [containerRef1]);


  useEffect(() => {
    if (!containerRef2.current) return;
    cgl(getArgs(containerRef2.current, generateRandomNetwork(2, 4), { matrixColors: {
      pos: [0, 255, 255],
      neg: [0, 255, 255]
    } }));
  }, [containerRef2]);


  return (
    <div style={{ display: "flex"}}>
      <div id="cgm-container-1" style={{ height: "800px", width: "800px", padding: "20px" }}>
        <div
          id="cgm1"
          ref={containerRef1}
          style={{ height: "75%", width: "75%" }}
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
