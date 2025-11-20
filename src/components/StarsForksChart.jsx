import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const StarsForksChart = ({ data }) => {
  const categories = (data || []).map((d) => d.name);
  const stars = (data || []).map((d) => d.stars || 0);
  const forks = (data || []).map((d) => d.forks || 0);

  const options = {
    chart: {
    type: "bar",            // 👈 horizontal bars
    backgroundColor: "transparent",
    height: 260,
  },
 
    title: { text: null },
    credits: { enabled: false },
    xAxis: {
    categories,
    labels: {
      style: { color: "#e5e7eb", fontSize: "11px" },
    },
  },
    yAxis: {
      title: { text: null },
      gridLineColor: "#1f2933",
      labels: { style: { color: "#9ca3af", fontSize: "11px" } },
      allowDecimals: false,
      min: 0,
    },
    legend: {
      itemStyle: { color: "#e5e7eb", fontSize: "11px" },
    },
    tooltip: {
      shared: true,
      backgroundColor: "#020617",
      borderColor: "#4b5563",
      style: { color: "#e5e7eb", fontSize: "11px" },
    },
    plotOptions: {
      column: {
        pointPadding: 0.1,
        groupPadding: 0.15,
        borderRadius: 4,
      },
    },
    series: [
      {
        name: "Stars",
        data: stars,
        color: {
          linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
          stops: [
            [0, "#38bdf8"],
            [1, "#4f46e5"],
          ],
        },
      },
      {
        name: "Forks",
        data: forks,
        color: {
          linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
          stops: [
            [0, "#fb7185"],
            [1, "#ec4899"],
          ],
        },
      },
    ],
  };

  return (
    <div className="panel">
      <div className="panel-title">Top Repos – Stars vs Forks</div>
      {(!data || !data.length) ? (
        <div className="sub-text">No data.</div>
      ) : (
        <HighchartsReact highcharts={Highcharts} options={options} />
      )}
    </div>
  );
};

export default StarsForksChart;
