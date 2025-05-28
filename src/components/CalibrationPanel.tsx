
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const CalibrationPanel = () => {
  const [lastCalibration, setLastCalibration] = useState(
    new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 días atrás
  );
  const [isCalibrating, setIsCalibrating] = useState(false);

  const handleCalibration = () => {
    setIsCalibrating(true);
    setTimeout(() => {
      setLastCalibration(new Date());
      setIsCalibrating(false);
    }, 3000);
  };

  const daysSinceCalibration = Math.floor(
    (Date.now() - lastCalibration.getTime()) / (1000 * 60 * 60 * 24)
  );

  const getCalibrationStatus = () => {
    if (daysSinceCalibration <= 7) return "optimal";
    if (daysSinceCalibration <= 14) return "warning";
    return "danger";
  };

  const getStatusBadge = () => {
    const status = getCalibrationStatus();
    switch (status) {
      case "optimal":
        return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">Reciente</Badge>;
      case "warning":
        return <Badge className="bg-amber-100 text-amber-700 border-amber-200">Próxima</Badge>;
      case "danger":
        return <Badge className="bg-red-100 text-red-700 border-red-200">Urgente</Badge>;
      default:
        return <Badge variant="outline">Normal</Badge>;
    }
  };

  return (
    <Card className="bg-white/60 backdrop-blur-sm border-emerald-100">
      <CardHeader>
        <CardTitle className="text-emerald-700 flex items-center justify-between">
          <span className="flex items-center space-x-2">
            <span className="text-lg">⚙️</span>
            <span>Calibración</span>
          </span>
          {getStatusBadge()}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-gray-600">Última calibración</p>
          <p className="font-semibold">{lastCalibration.toLocaleDateString()}</p>
          <p className="text-xs text-gray-500">Hace {daysSinceCalibration} días</p>
        </div>

        <div className="space-y-3">
          <div className="text-xs space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Sensor pH:</span>
              <span className={daysSinceCalibration <= 7 ? "text-emerald-600" : "text-amber-600"}>
                {daysSinceCalibration <= 7 ? "✓ OK" : "⚠ Revisar"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Sensor EC:</span>
              <span className={daysSinceCalibration <= 7 ? "text-emerald-600" : "text-amber-600"}>
                {daysSinceCalibration <= 7 ? "✓ OK" : "⚠ Revisar"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Sensor Temp:</span>
              <span className="text-emerald-600">✓ OK</span>
            </div>
          </div>

          <Button 
            onClick={handleCalibration}
            disabled={isCalibrating}
            className="w-full bg-emerald-600 hover:bg-emerald-700"
          >
            {isCalibrating ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Calibrando...</span>
              </div>
            ) : (
              "Calibrar Sensores"
            )}
          </Button>
        </div>

        <div className="text-xs text-gray-500 bg-emerald-50 p-2 rounded border border-emerald-200">
          💡 Se recomienda calibrar los sensores cada 7-10 días para mantener la precisión
        </div>
      </CardContent>
    </Card>
  );
};

export default CalibrationPanel;
