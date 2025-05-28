
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from '@/hooks/use-toast';

interface AlertConfig {
  ph: { min: number; max: number };
  ec: { min: number; max: number };
  lightHours: { target: number; tolerance: number };
  waterChangeDays: number;
}

interface AlertSettingsProps {
  config: AlertConfig;
  onConfigChange: (config: AlertConfig) => void;
}

const AlertSettings = ({ config, onConfigChange }: AlertSettingsProps) => {
  const [localConfig, setLocalConfig] = useState(config);

  const handleSave = () => {
    onConfigChange(localConfig);
    toast({
      title: "✅ Configuración Guardada",
      description: "Las alertas han sido actualizadas correctamente.",
    });
  };

  const handleReset = () => {
    const defaultConfig: AlertConfig = {
      ph: { min: 5.0, max: 7.0 },
      ec: { min: 0.8, max: 2.8 },
      lightHours: { target: 16, tolerance: 2 },
      waterChangeDays: 7
    };
    setLocalConfig(defaultConfig);
    onConfigChange(defaultConfig);
    toast({
      title: "🔄 Configuración Restaurada",
      description: "Se han restaurado los valores por defecto.",
    });
  };

  return (
    <Card className="bg-white/60 backdrop-blur-sm border-emerald-100">
      <CardHeader>
        <CardTitle className="text-emerald-700 flex items-center space-x-2">
          <span className="text-lg">🚨</span>
          <span>Configuración de Alertas</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* pH */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold text-gray-700">Rango de pH</Label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-gray-600">Mínimo</Label>
              <Input
                type="number"
                step="0.1"
                value={localConfig.ph.min}
                onChange={(e) => setLocalConfig({
                  ...localConfig,
                  ph: { ...localConfig.ph, min: parseFloat(e.target.value) || 0 }
                })}
                className="h-8"
              />
            </div>
            <div>
              <Label className="text-xs text-gray-600">Máximo</Label>
              <Input
                type="number"
                step="0.1"
                value={localConfig.ph.max}
                onChange={(e) => setLocalConfig({
                  ...localConfig,
                  ph: { ...localConfig.ph, max: parseFloat(e.target.value) || 0 }
                })}
                className="h-8"
              />
            </div>
          </div>
        </div>

        {/* EC/TDS */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold text-gray-700">Rango de EC (mS/cm)</Label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-gray-600">Mínimo</Label>
              <Input
                type="number"
                step="0.1"
                value={localConfig.ec.min}
                onChange={(e) => setLocalConfig({
                  ...localConfig,
                  ec: { ...localConfig.ec, min: parseFloat(e.target.value) || 0 }
                })}
                className="h-8"
              />
            </div>
            <div>
              <Label className="text-xs text-gray-600">Máximo</Label>
              <Input
                type="number"
                step="0.1"
                value={localConfig.ec.max}
                onChange={(e) => setLocalConfig({
                  ...localConfig,
                  ec: { ...localConfig.ec, max: parseFloat(e.target.value) || 0 }
                })}
                className="h-8"
              />
            </div>
          </div>
        </div>

        {/* Horas de Luz */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold text-gray-700">Configuración de Luces</Label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-gray-600">Horas objetivo</Label>
              <Input
                type="number"
                step="0.5"
                value={localConfig.lightHours.target}
                onChange={(e) => setLocalConfig({
                  ...localConfig,
                  lightHours: { ...localConfig.lightHours, target: parseFloat(e.target.value) || 0 }
                })}
                className="h-8"
              />
            </div>
            <div>
              <Label className="text-xs text-gray-600">Tolerancia (±hrs)</Label>
              <Input
                type="number"
                step="0.5"
                value={localConfig.lightHours.tolerance}
                onChange={(e) => setLocalConfig({
                  ...localConfig,
                  lightHours: { ...localConfig.lightHours, tolerance: parseFloat(e.target.value) || 0 }
                })}
                className="h-8"
              />
            </div>
          </div>
        </div>

        {/* Cambio de Agua */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold text-gray-700">Recordatorio de Cambio de Agua</Label>
          <div>
            <Label className="text-xs text-gray-600">Cada (días)</Label>
            <Input
              type="number"
              min="1"
              value={localConfig.waterChangeDays}
              onChange={(e) => setLocalConfig({
                ...localConfig,
                waterChangeDays: parseInt(e.target.value) || 7
              })}
              className="h-8"
            />
          </div>
        </div>

        {/* Botones */}
        <div className="flex space-x-3">
          <Button onClick={handleSave} className="flex-1 bg-emerald-600 hover:bg-emerald-700">
            Guardar Configuración
          </Button>
          <Button onClick={handleReset} variant="outline" className="flex-1">
            Valores por Defecto
          </Button>
        </div>

        <div className="text-xs text-gray-500 bg-emerald-50 p-3 rounded border border-emerald-200">
          💡 Las alertas se mostrarán cuando los valores salgan de los rangos configurados. 
          Hay un período de espera de 30 segundos entre alertas del mismo tipo.
        </div>
      </CardContent>
    </Card>
  );
};

export default AlertSettings;
