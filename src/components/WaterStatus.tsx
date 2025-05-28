
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface WaterStatusProps {
  level: string;
  lastChange: Date;
  daysSince: number;
}

const WaterStatus = ({ level, lastChange, daysSince }: WaterStatusProps) => {
  const getLevelStatus = (level: string) => {
    return level === "OK" ? "optimal" : "danger";
  };

  const getLevelColor = (level: string) => {
    return level === "OK" 
      ? "border-blue-200 bg-blue-50/50" 
      : "border-red-200 bg-red-50/50";
  };

  const getLevelBadge = (level: string) => {
    return level === "OK" 
      ? <Badge className="bg-blue-100 text-blue-700 border-blue-200">Normal</Badge>
      : <Badge className="bg-red-100 text-red-700 border-red-200">Bajo</Badge>;
  };

  const getWaterIcon = (level: string) => {
    return level === "OK" ? "💧" : "⚠️";
  };

  const getDaysColor = (days: number) => {
    if (days <= 7) return "text-emerald-600";
    if (days <= 14) return "text-amber-600";
    return "text-red-600";
  };

  return (
    <Card className={`${getLevelColor(level)} backdrop-blur-sm transition-all duration-300 hover:shadow-lg`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-700 flex items-center justify-between">
          <span className="flex items-center space-x-2">
            <span className="text-lg">{getWaterIcon(level)}</span>
            <span>Nivel de Agua</span>
          </span>
          {getLevelBadge(level)}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-center">
            <div className="relative w-16 h-20 border-2 border-blue-300 rounded-lg bg-blue-50">
              <div 
                className={`absolute bottom-0 left-0 right-0 bg-blue-400 rounded-b transition-all duration-500 ${
                  level === "OK" ? "h-14" : "h-6"
                }`}
              >
                <div className="absolute inset-0 bg-blue-500/30 animate-pulse rounded-b"></div>
              </div>
              <div className="absolute top-1 left-1 right-1 h-1 bg-blue-200 rounded"></div>
              <div className="absolute top-3 left-1 right-1 h-1 bg-blue-200 rounded"></div>
            </div>
          </div>
          
          <div className="text-center space-y-1">
            <p className="text-xs text-gray-600">Último cambio</p>
            <p className="text-sm font-semibold">{lastChange.toLocaleDateString()}</p>
            <p className={`text-xs font-medium ${getDaysColor(daysSince)}`}>
              Hace {daysSince} días
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WaterStatus;
