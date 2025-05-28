
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface SystemControlProps {
  pumpStatus: boolean;
  lightsStatus: boolean;
  lightHours: number;
  onPumpToggle: () => void;
  onLightsToggle: () => void;
}

const SystemControl = ({ 
  pumpStatus, 
  lightsStatus, 
  lightHours, 
  onPumpToggle, 
  onLightsToggle 
}: SystemControlProps) => {
  return (
    <Card className="bg-white/60 backdrop-blur-sm border-emerald-100">
      <CardHeader>
        <CardTitle className="text-emerald-700">Control del Sistema</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Control de la Bomba */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded-full ${pumpStatus ? 'bg-blue-500 animate-pulse' : 'bg-gray-300'}`}></div>
                <div>
                  <h3 className="font-semibold text-gray-800">Bomba de Agua</h3>
                  <p className="text-sm text-gray-600">Sistema de circulación</p>
                </div>
              </div>
              <Badge 
                variant={pumpStatus ? "default" : "secondary"}
                className={pumpStatus ? "bg-blue-100 text-blue-700 border-blue-200" : ""}
              >
                {pumpStatus ? "Encendida" : "Apagada"}
              </Badge>
            </div>
            <Button 
              onClick={onPumpToggle}
              variant={pumpStatus ? "destructive" : "default"}
              className={`w-full ${pumpStatus ? '' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {pumpStatus ? "Apagar Bomba" : "Encender Bomba"}
            </Button>
            <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
              💡 La bomba circula nutrientes cada 15 minutos durante 5 minutos
            </div>
          </div>

          {/* Control de Luces LED */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded-full ${lightsStatus ? 'bg-yellow-500 animate-pulse' : 'bg-gray-300'}`}></div>
                <div>
                  <h3 className="font-semibold text-gray-800">Luces LED</h3>
                  <p className="text-sm text-gray-600">Iluminación de crecimiento</p>
                </div>
              </div>
              <Badge 
                variant={lightsStatus ? "default" : "secondary"}
                className={lightsStatus ? "bg-yellow-100 text-yellow-700 border-yellow-200" : ""}
              >
                {lightsStatus ? "Encendidas" : "Apagadas"}
              </Badge>
            </div>
            <Button 
              onClick={onLightsToggle}
              variant={lightsStatus ? "destructive" : "default"}
              className={`w-full ${lightsStatus ? '' : 'bg-yellow-600 hover:bg-yellow-700'}`}
            >
              {lightsStatus ? "Apagar Luces" : "Encender Luces"}
            </Button>
            <div className="text-xs space-y-1">
              <div className="flex justify-between text-gray-600">
                <span>Horas hoy:</span>
                <span className="font-semibold">{lightHours.toFixed(1)}h / 16h</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className="bg-yellow-500 h-1.5 rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(100, (lightHours / 16) * 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemControl;
