import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const ActivityChart = ({ data }) => {
  const categories = (data || []).map((d) => d.year);
  const counts = (data || []).map((d) => d.count);

  const options = {
    chart: {
      type: "column",
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
      lineColor: "#4b5563",
      tickColor: "#4b5563",
    },
    yAxis: {
      title: { text: null },
      gridLineColor: "#1f2933",
      labels: { style: { color: "#9ca3af", fontSize: "11px" } },
      allowDecimals: false,
      min: 0,
    },
    tooltip: {
      backgroundColor: "#020617",
      borderColor: "#4b5563",
      style: { color: "#e5e7eb", fontSize: "11px" },
      pointFormat: "<b>{point.y} repos</b>",
    },
    series: [
      {
        name: "Repos",
        data: counts,
        color: {
          linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
          stops: [
            [0, "#38bdf8"],
            [1, "#4f46e5"],
          ],
        },
        borderRadius: 4,
      },
    ],
    legend: { enabled: false },
    plotOptions: {
      column: {
        pointPadding: 0.1,
        groupPadding: 0.2,
      },
    },
  };

  return (
    <div className="panel">
      <div className="panel-title">Repo Activity Timeline (by last push year)</div>
      {(!data || !data.length) ? (
        <div className="sub-text">No activity data.</div>
      ) : (
        <HighchartsReact highcharts={Highcharts} options={options} />
      )}
    </div>
  );
};

export default ActivityChart;
