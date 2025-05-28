
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface MetricCardProps {
  title: string;
  value: string;
  unit: string;
  status: "optimal" | "warning" | "danger";
  range: string;
  icon: string;
}

const MetricCard = ({ title, value, unit, status, range, icon }: MetricCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "optimal":
        return "border-emerald-200 bg-emerald-50/50";
      case "warning":
        return "border-amber-200 bg-amber-50/50";
      case "danger":
        return "border-red-200 bg-red-50/50";
      default:
        return "border-gray-200 bg-gray-50/50";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "optimal":
        return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">Óptimo</Badge>;
      case "warning":
        return <Badge className="bg-amber-100 text-amber-700 border-amber-200">Precaución</Badge>;
      case "danger":
        return <Badge className="bg-red-100 text-red-700 border-red-200">Crítico</Badge>;
      default:
        return <Badge variant="outline">Normal</Badge>;
    }
  };

  const getProgressBar = (status: string) => {
    const width = status === "optimal" ? "75%" : status === "warning" ? "50%" : "25%";
    const color = status === "optimal" ? "bg-emerald-500" : status === "warning" ? "bg-amber-500" : "bg-red-500";
    
    return (
      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
        <div className={`${color} h-2 rounded-full transition-all duration-500`} style={{ width }}></div>
      </div>
    );
  };

  return (
    <Card className={`${getStatusColor(status)} backdrop-blur-sm transition-all duration-300 hover:shadow-lg`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-700 flex items-center justify-between">
          <span className="flex items-center space-x-2">
            <span className="text-lg">{icon}</span>
            <span>{title}</span>
          </span>
          {getStatusBadge(status)}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-bold text-gray-800">{value}</span>
            <span className="text-sm text-gray-600">{unit}</span>
          </div>
          {getProgressBar(status)}
          <p className="text-xs text-gray-500">Rango ideal: {range}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricCard;
