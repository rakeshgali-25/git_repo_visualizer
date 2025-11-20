import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

export default function LanguageChart({ data }) {
  const seriesData =
    data && data.length
      ? data.map((item) => ({
          name: item.language,
          y: item.count,
        }))
      : [];

  const options = {
    chart: {
      type: "pie",
      backgroundColor: "transparent",
      height: 260,
    },
    title: {
      text: null,
    },
    credits: {
      enabled: false,
    },
    tooltip: {
      pointFormat: "<b>{point.y} repos</b> ({point.percentage:.1f}%)",
      backgroundColor: "#020617",
      borderColor: "#4b5563",
      style: { color: "#e5e7eb", fontSize: "11px" },
    },
    legend: {
      layout: "vertical",
      align: "right",
      verticalAlign: "middle",
      itemStyle: { color: "#e5e7eb", fontSize: "11px" },
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        innerSize: "40%", // donut feel
        dataLabels: {
          enabled: false,
        },
        showInLegend: true,
      },
    },
    series: [
      {
        name: "Repos",
        colorByPoint: true,
        data: seriesData,
      },
    ],
  };

  return (
    <div className="panel">
      <div className="panel-title">Language Distribution</div>
      {!seriesData.length ? (
        <div className="sub-text">No language data.</div>
      ) : (
        <div style={{ width: "100%", height: 260 }}>
          <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
      )}
    </div>
  );
}
