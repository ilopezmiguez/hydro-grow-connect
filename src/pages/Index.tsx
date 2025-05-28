import { useState, useEffect } from "react";
import { Bell, Thermometer, Clock, BarChart3, Home } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import MetricCard from "@/components/MetricCard";
import SystemControl from "@/components/SystemControl";
import WaterStatus from "@/components/WaterStatus";
import CalibrationPanel from "@/components/CalibrationPanel";
import AlertSettings from "@/components/AlertSettings";
import { useAlerts } from "@/hooks/useAlerts";

const Index = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [pumpStatus, setPumpStatus] = useState(false);
  const [lightsStatus, setLightsStatus] = useState(true);
  const [showAlertSettings, setShowAlertSettings] = useState(false);
  
  // Configuración de alertas
  const [alertConfig, setAlertConfig] = useState({
    ph: { min: 5.0, max: 7.0 },
    ec: { min: 0.8, max: 2.8 },
    lightHours: { target: 16, tolerance: 2 },
    waterChangeDays: 7
  });
  
  // Datos simulados que cambiarían en tiempo real
  const [sensorData, setSensorData] = useState({
    ph: 6.2,
    ec: 1.8,
    waterLevel: "OK",
    waterTemp: 22.5,
    lightHours: 8.5,
    lastWaterChange: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 días atrás
  });

  // Hook de alertas
  useAlerts(sensorData, alertConfig);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      // Simular pequeñas variaciones en los datos
      setSensorData(prev => ({
        ...prev,
        ph: Math.max(4.5, Math.min(8.0, prev.ph + (Math.random() - 0.5) * 0.2)), // Rango más amplio para probar alertas
        ec: Math.max(0.5, Math.min(3.5, prev.ec + (Math.random() - 0.5) * 0.1)), // Rango más amplio para probar alertas
        waterTemp: Math.max(18, Math.min(28, prev.waterTemp + (Math.random() - 0.5) * 0.2)),
        lightHours: Math.max(0, Math.min(24, prev.lightHours + 0.1)), // Incrementar gradualmente
        waterLevel: Math.random() > 0.95 ? "Bajo" : "OK" // Ocasionalmente simular nivel bajo
      }));
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const getPhStatus = (ph: number) => {
    if (ph >= 5.8 && ph <= 6.8) return "optimal";
    if (ph >= 5.5 && ph <= 7.2) return "warning";
    return "danger";
  };

  const getEcStatus = (ec: number) => {
    if (ec >= 1.2 && ec <= 2.0) return "optimal";
    if (ec >= 0.8 && ec <= 2.5) return "warning";
    return "danger";
  };

  const daysSinceWaterChange = Math.floor(
    (currentTime.getTime() - sensorData.lastWaterChange.getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-cyan-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-emerald-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">H</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
                  HydroGrow
                </h1>
                <p className="text-sm text-gray-600">Smart Farm</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/')}
                className="text-emerald-600 hover:bg-emerald-50"
              >
                <Home className="h-4 w-4 mr-1" />
                Panel
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/history')}
                className="text-emerald-600 hover:bg-emerald-50"
              >
                <BarChart3 className="h-4 w-4 mr-1" />
                Historial
              </Button>
              <Badge variant="outline" className="text-emerald-600 border-emerald-200">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
                En línea
              </Badge>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setShowAlertSettings(!showAlertSettings)}
              >
                <Bell className="h-5 w-5 text-gray-600" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Configuración de Alertas (condicional) */}
        {showAlertSettings && (
          <AlertSettings 
            config={alertConfig}
            onConfigChange={setAlertConfig}
          />
        )}

        {/* Métricas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="pH"
            value={sensorData.ph.toFixed(1)}
            unit=""
            status={getPhStatus(sensorData.ph)}
            range="5.8 - 6.8"
            icon="🧪"
          />
          <MetricCard
            title="EC/TDS"
            value={sensorData.ec.toFixed(1)}
            unit="mS/cm"
            status={getEcStatus(sensorData.ec)}
            range="1.2 - 2.0"
            icon="⚡"
          />
          <MetricCard
            title="Temp. Agua"
            value={sensorData.waterTemp.toFixed(1)}
            unit="°C"
            status={sensorData.waterTemp >= 20 && sensorData.waterTemp <= 25 ? "optimal" : "warning"}
            range="20 - 25°C"
            icon="🌡️"
          />
          <WaterStatus 
            level={sensorData.waterLevel}
            lastChange={sensorData.lastWaterChange}
            daysSince={daysSinceWaterChange}
          />
        </div>

        {/* Panel de control del sistema */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SystemControl
              pumpStatus={pumpStatus}
              lightsStatus={lightsStatus}
              lightHours={sensorData.lightHours}
              onPumpToggle={() => setPumpStatus(!pumpStatus)}
              onLightsToggle={() => setLightsStatus(!lightsStatus)}
            />
          </div>
          <div>
            <CalibrationPanel />
          </div>
        </div>

        {/* Información adicional */}
        <Card className="bg-white/60 backdrop-blur-sm border-emerald-100">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-emerald-700">
              <Clock className="h-5 w-5" />
              <span>Información del Sistema</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Último cambio de agua</p>
                <p className="font-semibold">{sensorData.lastWaterChange.toLocaleDateString()}</p>
                <p className="text-xs text-orange-600">Hace {daysSinceWaterChange} días</p>
              </div>
              <div>
                <p className="text-gray-600">Horas de luz hoy</p>
                <p className="font-semibold">{sensorData.lightHours.toFixed(1)} hrs</p>
                <p className="text-xs text-emerald-600">Ciclo de 16h recomendado</p>
              </div>
              <div>
                <p className="text-gray-600">Próximo mantenimiento</p>
                <p className="font-semibold">En 4 días</p>
                <p className="text-xs text-blue-600">Cambio de nutrientes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
